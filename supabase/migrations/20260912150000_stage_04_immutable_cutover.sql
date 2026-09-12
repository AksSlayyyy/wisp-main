-- Stage 4 cutover: browser clients may request generation and record consent,
-- but only the server-side renderer may create final artifacts.

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
        and signer_role in ('Data Security Coordinator', 'Principal / Owner')) <> 2 then
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

-- Legacy tables remain readable for historical records, but new final files and
-- signatures must flow through the lease-bound/immutable RPCs above.
revoke insert, update, delete on public.wisp_generated_files from authenticated;
revoke insert, update, delete on public.wisp_signatures from authenticated;
revoke all on function public.activate_wisp_version(uuid) from public;
grant execute on function public.activate_wisp_version(uuid) to authenticated;
