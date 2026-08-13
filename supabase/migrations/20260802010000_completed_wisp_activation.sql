create or replace function public.activate_wisp_project(p_project_id uuid)
returns public.wisp_projects
language plpgsql
security definer
set search_path = public
as $$
declare
  v_project public.wisp_projects%rowtype;
begin
  select * into v_project from public.wisp_projects where id = p_project_id;
  if not found then raise exception 'WISP project not found'; end if;

  if auth.uid() is null or not exists (
    select 1 from public.firm_memberships
    where firm_id = v_project.firm_id and user_id = auth.uid() and status = 'active'
  ) then
    raise exception 'You are not allowed to activate this WISP';
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
  set status = 'active', updated_at = now()
  where id = p_project_id
  returning * into v_project;

  return v_project;
end;
$$;

grant execute on function public.activate_wisp_project(uuid) to authenticated;
