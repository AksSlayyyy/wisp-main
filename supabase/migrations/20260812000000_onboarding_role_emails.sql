-- Capture the responsible officers' email addresses alongside their names.
-- Existing firms retain their current records until onboarding is edited again.
create or replace function private.sync_onboarding_workspace_records(
  p_firm_id uuid,
  p_profile jsonb
)
returns void
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_profile jsonb := coalesce(p_profile, '{}'::jsonb);
  v_settings jsonb;
  v_company jsonb;
  v_existing_staff jsonb;
  v_onboarding_staff jsonb;
  v_firm_name text := nullif(left(trim(coalesce(p_profile ->> 'firm_name', '')), 120), '');
  v_contact_name text := nullif(left(trim(coalesce(p_profile ->> 'contact_name', '')), 120), '');
  v_business_email text := nullif(lower(left(trim(coalesce(p_profile ->> 'business_email', '')), 320)), '');
  v_business_phone text := nullif(left(trim(coalesce(p_profile ->> 'business_phone', '')), 60), '');
  v_website text := nullif(left(trim(coalesce(p_profile ->> 'website', '')), 500), '');
  v_city text := nullif(left(trim(coalesce(p_profile ->> 'city', '')), 120), '');
  v_state text := nullif(upper(left(trim(coalesce(p_profile ->> 'state', '')), 12)), '');
begin
  update public.firms set name = coalesce(v_firm_name, name), primary_contact = coalesce(v_contact_name, primary_contact), updated_at = now() where id = p_firm_id;
  select coalesce(settings, '{}'::jsonb) into v_settings from public.app_settings where firm_id = p_firm_id;
  v_settings := coalesce(v_settings, '{}'::jsonb);
  v_company := coalesce(v_settings -> 'company', '{}'::jsonb) || jsonb_strip_nulls(jsonb_build_object('email', v_business_email, 'phone', v_business_phone, 'website', v_website, 'city', v_city, 'state', v_state, 'address', nullif(concat_ws(', ', v_city, v_state), '')));
  with onboarding_roles (wisp_role, role_title, full_name, email) as (
    values
      ('data_security_coordinator'::text, 'Data Security Coordinator'::text, nullif(left(trim(coalesce(v_profile ->> 'dsc_name', '')), 160), ''), nullif(lower(left(trim(coalesce(v_profile ->> 'dsc_email', '')), 320)), '')),
      ('principal_operating_officer'::text, 'Principal Operating Officer'::text, nullif(left(trim(coalesce(v_profile ->> 'poo_name', '')), 160), ''), nullif(lower(left(trim(coalesce(v_profile ->> 'poo_email', '')), 320)), ''))
  ), upserted as (
    insert into public.firm_staff (firm_id, full_name, email, role_title, wisp_role, status, source)
    select p_firm_id, full_name, email, role_title, wisp_role, 'active', 'onboarding' from onboarding_roles where full_name is not null
    on conflict (firm_id, wisp_role) do update set full_name = excluded.full_name, email = excluded.email, role_title = excluded.role_title, status = 'active', source = 'onboarding', updated_at = now()
    returning id, full_name, email, role_title, wisp_role, status
  ) select coalesce(jsonb_agg(jsonb_build_object('id', id::text, 'name', full_name, 'email', email, 'role', role_title, 'wisp_role', wisp_role, 'status', status, 'source', 'onboarding') order by wisp_role), '[]'::jsonb) into v_onboarding_staff from upserted;
  select coalesce(jsonb_agg(staff), '[]'::jsonb) into v_existing_staff from jsonb_array_elements(coalesce(v_settings -> 'staff', '[]'::jsonb)) as staff where coalesce(staff ->> 'wisp_role', '') not in ('data_security_coordinator', 'principal_operating_officer');
  v_settings := jsonb_set(v_settings, '{company}', v_company, true);
  v_settings := jsonb_set(v_settings, '{staff}', v_existing_staff || v_onboarding_staff, true);
  insert into public.app_settings (firm_id, settings, updated_at) values (p_firm_id, v_settings, now()) on conflict (firm_id) do update set settings = excluded.settings, updated_at = excluded.updated_at;
end;
$$;
