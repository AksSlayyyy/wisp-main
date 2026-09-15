-- Keep the signed-version workflow aligned with the firm-staff role names shown in the app.
alter table public.wisp_version_signatures
  drop constraint if exists wisp_version_signatures_signer_role_check;

update public.wisp_version_signatures
  set signer_role = 'Principal Operating Officer'
  where signer_role = 'Principal / Owner';

alter table public.wisp_version_signatures
  add constraint wisp_version_signatures_signer_role_check
  check (signer_role in ('Data Security Coordinator', 'Principal Operating Officer'));

create or replace function public.sign_wisp_version(
  p_version_id uuid,
  p_signer_role text,
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
  u auth.users%rowtype;
  s public.wisp_version_signatures%rowtype;
begin
  select * into v from public.wisp_versions where id = p_version_id for update;
  if not found or v.state not in ('ready', 'signing') or not private.can_manage_firm(v.firm_id) then
    raise exception 'Not allowed to sign this version';
  end if;
  if p_signer_role not in ('Data Security Coordinator', 'Principal Operating Officer')
    or p_signature_method not in ('draw', 'type')
    or length(trim(coalesce(p_consent_text, ''))) < 10 then
    raise exception 'Invalid signature';
  end if;
  select * into u from auth.users where id = auth.uid();
  insert into public.wisp_version_signatures(
    version_id, firm_id, signer_user_id, signer_name, signer_role,
    signature_method, signature_data, signature_font, consent_text
  ) values (
    v.id, v.firm_id, auth.uid(), coalesce(u.raw_user_meta_data->>'full_name', u.email),
    p_signer_role, p_signature_method, p_signature_data, p_signature_font, p_consent_text
  ) on conflict(version_id, signer_role) do nothing returning * into s;
  if s.id is null then
    select * into s from public.wisp_version_signatures
      where version_id = v.id and signer_role = p_signer_role;
  end if;
  update public.wisp_versions set state = 'signing' where id = v.id and state = 'ready';
  return jsonb_build_object('id', s.id, 'version_id', v.id, 'signed_at', s.consented_at);
end;
$$;

create or replace function public.activate_wisp_version(p_version_id uuid)
returns public.wisp_projects
language plpgsql
security definer
set search_path = public
as $$
declare
  v public.wisp_versions%rowtype;
  p public.wisp_projects%rowtype;
begin
  select * into v from public.wisp_versions where id = p_version_id for update;
  if not found or v.state not in ('ready', 'signing') then
    raise exception 'This WISP version is not ready for activation';
  end if;
  if not private.can_manage_firm(v.firm_id) then
    raise exception 'Not allowed to activate this WISP version';
  end if;
  if (select count(*) from public.wisp_version_signatures
      where version_id = v.id
        and signer_role in ('Data Security Coordinator', 'Principal Operating Officer')) <> 2 then
    raise exception 'Both required signatories must approve this exact WISP version before activation';
  end if;
  update public.wisp_versions
    set state = 'superseded', superseded_at = now()
    where project_id = v.project_id and id <> v.id and state = 'active';
  update public.wisp_versions
    set state = 'active', activated_at = now()
    where id = v.id;
  update public.wisp_projects
    set status = 'active', updated_at = now()
    where id = v.project_id
    returning * into p;
  return p;
end;
$$;
