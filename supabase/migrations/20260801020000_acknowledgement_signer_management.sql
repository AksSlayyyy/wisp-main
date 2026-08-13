create or replace function public.create_wisp_acknowledgement_requests(
  p_project_id uuid,
  p_recipients jsonb,
  p_wisp_snapshot jsonb,
  p_acknowledgement_text text,
  p_expires_in_days integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_project record;
  v_recipient jsonb;
  v_staff_id text;
  v_name text;
  v_email text;
  v_role text;
  v_token text;
  v_token_hash text;
  v_request record;
  v_results jsonb := '[]'::jsonb;
  v_expires_at timestamptz := now() + make_interval(days => greatest(1, least(coalesce(p_expires_in_days, 30), 90)));
begin
  select id, firm_id into v_project from public.wisp_projects where id = p_project_id;
  if not found then raise exception 'WISP project not found'; end if;
  if auth.uid() is null or not exists (
    select 1 from public.firm_memberships
    where firm_id = v_project.firm_id and user_id = auth.uid() and status = 'active'
  ) then raise exception 'You are not allowed to manage acknowledgement requests for this WISP'; end if;
  if coalesce(jsonb_typeof(p_recipients), '') <> 'array' or jsonb_array_length(p_recipients) = 0 then raise exception 'Select at least one staff member'; end if;
  if coalesce(length(trim(p_acknowledgement_text)), 0) = 0 then raise exception 'Acknowledgement text is required'; end if;

  for v_recipient in select value from jsonb_array_elements(p_recipients) loop
    v_staff_id := nullif(trim(v_recipient ->> 'staff_id'), '');
    v_name := nullif(trim(v_recipient ->> 'name'), '');
    v_email := nullif(trim(v_recipient ->> 'email'), '');
    v_role := nullif(trim(v_recipient ->> 'role'), '');
    if v_staff_id is null or v_name is null then continue; end if;
    if exists (select 1 from public.wisp_acknowledgement_requests where project_id = p_project_id and recipient_staff_id = v_staff_id and status = 'signed') then
      raise exception '% has already acknowledged this WISP and cannot sign again', v_name;
    end if;
    update public.wisp_acknowledgement_requests set status = 'revoked', revoked_at = now(), updated_at = now()
    where project_id = p_project_id and recipient_staff_id = v_staff_id and status = 'pending';
    v_token := encode(gen_random_bytes(32), 'hex');
    v_token_hash := encode(digest(v_token, 'sha256'), 'hex');
    insert into public.wisp_acknowledgement_requests (project_id, firm_id, recipient_staff_id, recipient_name, recipient_email, recipient_role, acknowledgement_text, wisp_snapshot, access_token_hash, expires_at)
    values (p_project_id, v_project.firm_id, v_staff_id, v_name, v_email, v_role, p_acknowledgement_text, coalesce(p_wisp_snapshot, '{}'::jsonb), v_token_hash, v_expires_at)
    returning id, expires_at into v_request;
    v_results := v_results || jsonb_build_array(jsonb_build_object('id', v_request.id, 'token', v_token, 'recipient_name', v_name, 'recipient_email', v_email, 'expires_at', v_request.expires_at));
  end loop;
  if jsonb_array_length(v_results) = 0 then raise exception 'No valid staff recipients were supplied'; end if;
  return jsonb_build_object('requests', v_results);
end;
$$;

create or replace function public.remove_wisp_acknowledgement_request(p_project_id uuid, p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare v_request public.wisp_acknowledgement_requests%rowtype;
begin
  if auth.uid() is null or not exists (
    select 1 from public.wisp_projects p join public.firm_memberships m on m.firm_id = p.firm_id
    where p.id = p_project_id and m.user_id = auth.uid() and m.status = 'active'
  ) then raise exception 'You are not allowed to manage acknowledgement requests for this WISP'; end if;
  update public.wisp_acknowledgement_requests set status = 'revoked', revoked_at = now(), updated_at = now()
  where id = p_request_id and project_id = p_project_id and status = 'pending'
  returning * into v_request;
  if not found then raise exception 'Only pending acknowledgement requests can be removed'; end if;
  return jsonb_build_object('id', v_request.id, 'status', v_request.status);
end;
$$;

revoke all on function public.create_wisp_acknowledgement_requests(uuid, jsonb, jsonb, text, integer) from anon;
revoke all on function public.list_wisp_acknowledgement_requests(uuid) from anon;
grant execute on function public.create_wisp_acknowledgement_requests(uuid, jsonb, jsonb, text, integer) to authenticated;
grant execute on function public.remove_wisp_acknowledgement_request(uuid, uuid) to authenticated;
