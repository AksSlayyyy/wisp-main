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
