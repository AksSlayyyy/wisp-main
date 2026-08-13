alter table public.wisp_projects
  add column if not exists activated_at timestamptz;

-- Preserve the existing displayed implementation date for WISPs already active.
update public.wisp_projects
set activated_at = updated_at
where status = 'active' and activated_at is null;

create or replace function public.activate_wisp_project(p_project_id uuid)
returns public.wisp_projects
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_project public.wisp_projects%rowtype;
begin
  select * into v_project
  from public.wisp_projects
  where id = p_project_id;

  if not found then
    raise exception 'WISP project not found or is not available to you';
  end if;

  if v_project.status <> 'completed' then
    raise exception 'Only completed WISPs can be moved to Active';
  end if;

  if not exists (
    select 1 from public.wisp_signatures
    where project_id = p_project_id and signer_role = 'Principal Operating Officer'
  ) or not exists (
    select 1 from public.wisp_signatures
    where project_id = p_project_id and signer_role = 'Data Security Coordinator'
  ) then
    raise exception 'The Principal Operating Officer and Data Security Coordinator must sign before activation';
  end if;

  update public.wisp_projects
  set status = 'active',
      activated_at = coalesce(activated_at, now()),
      updated_at = now()
  where id = p_project_id
  returning * into v_project;

  return v_project;
end;
$$;

revoke execute on function public.activate_wisp_project(uuid) from public;
grant execute on function public.activate_wisp_project(uuid) to authenticated;