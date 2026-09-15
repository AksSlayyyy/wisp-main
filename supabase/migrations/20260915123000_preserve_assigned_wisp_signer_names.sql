-- The audit user remains signer_user_id. signer_name is the responsible
-- official named on the WISP, selected from Builder/Staff by the client.
drop function if exists public.sign_wisp_version(uuid, text, text, text, text, text);

create or replace function public.sign_wisp_version(
  p_version_id uuid,
  p_signer_role text,
  p_signer_name text,
  p_signature_method text,
  p_signature_data text,
  p_signature_font text,
  p_consent_text text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.wisp_versions%rowtype;
  s public.wisp_version_signatures%rowtype;
begin
  select * into v from public.wisp_versions where id = p_version_id for update;
  if not found or v.state not in ('ready', 'signing') or not private.can_manage_firm(v.firm_id) then
    raise exception 'Not allowed to sign this version';
  end if;
  if p_signer_role not in ('Data Security Coordinator', 'Principal Operating Officer')
    or length(trim(coalesce(p_signer_name, ''))) < 1
    or length(trim(p_signer_name)) > 160
    or p_signature_method not in ('draw', 'type')
    or length(trim(coalesce(p_consent_text, ''))) < 10 then
    raise exception 'Invalid signature';
  end if;
  insert into public.wisp_version_signatures(
    version_id, firm_id, signer_user_id, signer_name, signer_role,
    signature_method, signature_data, signature_font, consent_text
  ) values (
    v.id, v.firm_id, auth.uid(), trim(p_signer_name), p_signer_role,
    p_signature_method, p_signature_data, p_signature_font, p_consent_text
  ) on conflict(version_id, signer_role) do nothing returning * into s;
  if s.id is null then
    select * into s from public.wisp_version_signatures
      where version_id = v.id and signer_role = p_signer_role;
  end if;
  update public.wisp_versions set state = 'signing' where id = v.id and state = 'ready';
  return jsonb_build_object('id', s.id, 'version_id', v.id, 'signed_at', s.consented_at);
end;
$$;

-- Repair the initial staging records created before the assigned name was
-- passed through the signing workflow. Future records use the Builder name.
update public.wisp_version_signatures signature
set signer_name = staff.full_name
from public.firm_staff staff
where staff.firm_id = signature.firm_id
  and staff.full_name is not null
  and ((signature.signer_role = 'Principal Operating Officer' and staff.wisp_role = 'principal_operating_officer')
    or (signature.signer_role = 'Data Security Coordinator' and staff.wisp_role = 'data_security_coordinator'));

revoke all on function public.sign_wisp_version(uuid, text, text, text, text, text, text) from public;
grant execute on function public.sign_wisp_version(uuid, text, text, text, text, text, text) to authenticated;
