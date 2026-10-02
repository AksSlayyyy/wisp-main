-- Activity history is server-owned; existing audit records remain immutable to customers.
create index if not exists audit_events_firm_created_id_idx
  on public.audit_events(firm_id, created_at desc, id desc);
create unique index if not exists audit_events_session_once_idx
  on public.audit_events(firm_id, actor_user_id, action, (metadata->>'session_id'))
  where action in ('workspace_session_started','sign_out_requested');

create or replace function public.list_firm_activity(
  p_firm_id uuid, p_offset integer default 0, p_limit integer default 10, p_before timestamptz default null
) returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_before timestamptz := least(coalesce(p_before, now()), now());
  v_limit integer := greatest(1, least(coalesce(p_limit,10),200));
  v_offset integer := greatest(0, coalesce(p_offset,0));
  v_total bigint; v_items jsonb;
begin
  if not private.has_firm_permission(p_firm_id,'settings_logs') then
    raise exception 'You do not have permission to view activity logs' using errcode='42501';
  end if;
  select count(*) into v_total from public.audit_events where firm_id=p_firm_id and created_at<=v_before;
  select coalesce(jsonb_agg(x.row_data order by x.created_at desc, x.id desc),'[]'::jsonb) into v_items
  from (
    select e.id,e.created_at,jsonb_build_object(
      'id',e.id,'activity',initcap(replace(e.action,'_',' ')),
      'user',coalesce(u.email,'WispNow system'),
      'details',concat_ws(' · ',initcap(replace(e.entity_type,'_',' ')),
        nullif(left(coalesce(e.metadata->>'name',e.metadata->>'email',e.metadata->>'file_name',e.metadata->>'status',''),240),'')),
      'date',e.created_at,'ip',null
    ) as row_data
    from public.audit_events e left join auth.users u on u.id=e.actor_user_id
    where e.firm_id=p_firm_id and e.created_at<=v_before
    order by e.created_at desc,e.id desc limit v_limit offset v_offset
  ) x;
  return jsonb_build_object('items',v_items,'total',v_total,'offset',v_offset,'limit',v_limit,'asOf',v_before);
end;
$$;
revoke all on function public.list_firm_activity(uuid,integer,integer,timestamptz) from public,anon;
grant execute on function public.list_firm_activity(uuid,integer,integer,timestamptz) to authenticated;

-- This records authenticated workspace access, not a fabricated Auth login or IP.
create or replace function public.record_my_workspace_session(p_firm_id uuid,p_event text default 'workspace_session_started')
returns void language plpgsql security definer set search_path = '' as $$
declare v_session text := auth.jwt()->>'session_id';
begin
  if p_event not in ('workspace_session_started','sign_out_requested') or
     not private.has_firm_access(p_firm_id) or v_session is null then
    raise exception 'Workspace session event is not authorized' using errcode='42501';
  end if;
  insert into public.audit_events(firm_id,actor_user_id,action,entity_type,metadata)
    values(p_firm_id,auth.uid(),p_event,'workspace_session',jsonb_build_object('session_id',v_session))
    on conflict do nothing;
end;
$$;
revoke all on function public.record_my_workspace_session(uuid,text) from public,anon;
grant execute on function public.record_my_workspace_session(uuid,text) to authenticated;

create or replace function private.audit_workspace_change()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_new jsonb := case when TG_OP='DELETE' then null else to_jsonb(new) end;
  v_old jsonb := case when TG_OP='INSERT' then null else to_jsonb(old) end;
  v_row jsonb := coalesce(v_new,v_old); v_firm uuid; v_action text; v_metadata jsonb;
begin
  if TG_OP='UPDATE' then
    if TG_TABLE_NAME='app_settings' then
      if ((v_new->'settings') - 'activityLogs') is not distinct from ((v_old->'settings') - 'activityLogs')
        and v_new->'logo_path' is not distinct from v_old->'logo_path' then return new; end if;
    elsif (v_new - 'updated_at' - 'last_save_request_id' - 'last_save_request_hash')
      is not distinct from (v_old - 'updated_at' - 'last_save_request_id' - 'last_save_request_hash') then return new;
    end if;
  end if;
  v_firm := (v_row->>'firm_id')::uuid;
  if TG_TABLE_NAME='firms' then v_firm := (v_row->>'id')::uuid; end if;
  if v_firm is null and v_row ? 'project_id' then
    select firm_id into v_firm from public.wisp_projects where id=(v_row->>'project_id')::uuid;
  end if;
  if v_firm is null or not exists(select 1 from public.firms where id=v_firm) then
    return case when TG_OP='DELETE' then old else new end;
  end if;
  v_action := TG_TABLE_NAME || '_' || case TG_OP when 'INSERT' then 'created' when 'UPDATE' then 'updated' else 'removed' end;
  v_metadata := jsonb_strip_nulls(jsonb_build_object(
    'name',left(coalesce(v_row->>'file_name',v_row->>'title',v_row->>'name',v_row->>'full_name'),240),
    'status',v_row->>'status'
  ));
  insert into public.audit_events(firm_id,actor_user_id,action,entity_type,entity_id,metadata)
    values(v_firm,auth.uid(),v_action,TG_TABLE_NAME,(v_row->>'id')::uuid,v_metadata);
  return case when TG_OP='DELETE' then old else new end;
end;
$$;
revoke all on function private.audit_workspace_change() from public,anon,authenticated;
do $$ declare t text; begin
  foreach t in array array['documents','firm_staff','risk_assessments','wisp_projects','wisp_versions','wisp_attachments','wisp_signatures','app_settings'] loop
    execute format('create trigger record_workspace_activity after insert or update or delete on public.%I for each row execute function private.audit_workspace_change()',t);
  end loop;
  create trigger record_workspace_activity after update on public.firms
    for each row execute function private.audit_workspace_change();
end $$;
