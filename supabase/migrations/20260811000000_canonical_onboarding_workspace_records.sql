-- Promote completed onboarding data into durable workspace records.
-- The onboarding JSON remains the historical setup snapshot; app_settings and
-- firm_staff are the records the application should use after onboarding.

create table if not exists public.firm_staff (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 1 and 160),
  email text,
  role_title text not null check (char_length(trim(role_title)) between 1 and 160),
  wisp_role text not null check (wisp_role in ('data_security_coordinator', 'principal_operating_officer')),
  status text not null default 'active' check (status in ('active', 'inactive')),
  source text not null default 'onboarding' check (source in ('onboarding', 'settings')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (firm_id, wisp_role)
);

create index if not exists firm_staff_firm_id_idx on public.firm_staff (firm_id);

alter table public.firm_staff enable row level security;

drop policy if exists "Members read firm staff" on public.firm_staff;
drop policy if exists "Managers write firm staff" on public.firm_staff;

create policy "Members read firm staff"
  on public.firm_staff for select to authenticated
  using ((select private.has_firm_access(firm_id)));

create policy "Managers write firm staff"
  on public.firm_staff for all to authenticated
  using ((select private.can_manage_firm(firm_id)))
  with check ((select private.can_manage_firm(firm_id)));

grant select, insert, update, delete on public.firm_staff to authenticated;

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
  update public.firms
  set
    name = coalesce(v_firm_name, name),
    primary_contact = coalesce(v_contact_name, primary_contact),
    updated_at = now()
  where id = p_firm_id;

  select coalesce(settings, '{}'::jsonb)
    into v_settings
  from public.app_settings
  where firm_id = p_firm_id;
  v_settings := coalesce(v_settings, '{}'::jsonb);

  v_company := coalesce(v_settings -> 'company', '{}'::jsonb)
    || jsonb_strip_nulls(jsonb_build_object(
      'email', v_business_email,
      'phone', v_business_phone,
      'website', v_website,
      'city', v_city,
      'state', v_state,
      'address', nullif(concat_ws(', ', v_city, v_state), '')
    ));

  with onboarding_roles (wisp_role, role_title, full_name) as (
    values
      ('data_security_coordinator'::text, 'Data Security Coordinator'::text, nullif(left(trim(coalesce(v_profile ->> 'dsc_name', '')), 160), '')),
      ('principal_operating_officer'::text, 'Principal Operating Officer'::text, nullif(left(trim(coalesce(v_profile ->> 'poo_name', '')), 160), ''))
  ), upserted as (
    insert into public.firm_staff (firm_id, full_name, role_title, wisp_role, status, source)
    select p_firm_id, full_name, role_title, wisp_role, 'active', 'onboarding'
    from onboarding_roles
    where full_name is not null
    on conflict (firm_id, wisp_role) do update
      set full_name = excluded.full_name,
          role_title = excluded.role_title,
          status = 'active',
          source = 'onboarding',
          updated_at = now()
    returning id, full_name, role_title, wisp_role, status
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', id::text,
    'name', full_name,
    'email', '',
    'role', role_title,
    'wisp_role', wisp_role,
    'status', status,
    'source', 'onboarding'
  ) order by wisp_role), '[]'::jsonb)
  into v_onboarding_staff
  from upserted;

  select coalesce(jsonb_agg(staff), '[]'::jsonb)
    into v_existing_staff
  from jsonb_array_elements(coalesce(v_settings -> 'staff', '[]'::jsonb)) as staff
  where coalesce(staff ->> 'wisp_role', '') not in ('data_security_coordinator', 'principal_operating_officer');

  v_settings := jsonb_set(v_settings, '{company}', v_company, true);
  v_settings := jsonb_set(v_settings, '{staff}', v_existing_staff || v_onboarding_staff, true);

  insert into public.app_settings (firm_id, settings, updated_at)
  values (p_firm_id, v_settings, now())
  on conflict (firm_id) do update
    set settings = excluded.settings,
        updated_at = excluded.updated_at;
end;
$$;

revoke all on function private.sync_onboarding_workspace_records(uuid, jsonb) from public;

create or replace function public.complete_my_firm_onboarding(p_profile jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_firm public.firms%rowtype;
  v_onboarding public.firm_onboarding%rowtype;
  v_profile jsonb := coalesce(p_profile, '{}'::jsonb);
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Sign in before completing onboarding';
  end if;

  select f.* into v_firm
  from public.firm_memberships m
  join public.firms f on f.id = m.firm_id
  where m.user_id = v_user_id and m.status = 'active'
  order by m.created_at
  limit 1;

  if not found or not private.can_manage_firm(v_firm.id) then
    raise exception 'You are not allowed to complete this workspace onboarding';
  end if;

  if nullif(trim(coalesce(v_profile ->> 'firm_name', '')), '') is null
     or nullif(trim(coalesce(v_profile ->> 'contact_name', '')), '') is null
     or nullif(trim(coalesce(v_profile ->> 'business_email', '')), '') is null
     or nullif(trim(coalesce(v_profile ->> 'dsc_name', '')), '') is null
     or nullif(trim(coalesce(v_profile ->> 'poo_name', '')), '') is null then
    raise exception 'Complete the required firm and WISP role details before continuing';
  end if;

  perform private.sync_onboarding_workspace_records(v_firm.id, v_profile);

  insert into public.firm_onboarding (firm_id, status, current_step, profile, started_at, completed_at, completed_by, updated_at)
  values (v_firm.id, 'completed', 6, v_profile, now(), now(), v_user_id, now())
  on conflict (firm_id) do update
    set status = 'completed',
        current_step = 6,
        profile = coalesce(public.firm_onboarding.profile, '{}'::jsonb) || excluded.profile,
        started_at = coalesce(public.firm_onboarding.started_at, now()),
        completed_at = now(),
        completed_by = v_user_id,
        updated_at = now()
  returning * into v_onboarding;

  select * into v_firm from public.firms where id = v_firm.id;
  return jsonb_build_object(
    'onboarding', to_jsonb(v_onboarding),
    'firm', to_jsonb(v_firm),
    'settings', coalesce((select settings from public.app_settings where firm_id = v_firm.id), '{}'::jsonb)
  );
end;
$$;

revoke all on function public.complete_my_firm_onboarding(jsonb) from public;
grant execute on function public.complete_my_firm_onboarding(jsonb) to authenticated;

-- Backfill already-completed workspaces without changing their completion audit data.
do $$
declare
  v_onboarding record;
begin
  for v_onboarding in
    select firm_id, profile
    from public.firm_onboarding
    where status = 'completed'
  loop
    perform private.sync_onboarding_workspace_records(v_onboarding.firm_id, v_onboarding.profile);
  end loop;
end;
$$;
