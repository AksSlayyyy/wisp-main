-- PRODUCTION FOUNDATION
-- This migration replaces the build-stage anonymous workspace with firm-scoped
-- access. Apply it to staging first. Do not apply it to the current shared
-- testing project until real Auth users have been created and verified.

create schema if not exists private;
revoke all on schema private from public;

-- Membership helpers are intentionally private and are used by RLS/RPCs only.
create or replace function private.has_firm_access(target_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1
    from public.firm_memberships m
    where m.firm_id = target_firm_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

create or replace function private.can_manage_firm(target_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1
    from public.firm_memberships m
    where m.firm_id = target_firm_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role in ('owner', 'admin', 'editor')
  );
$$;

create or replace function private.has_storage_access(target_bucket_id text, object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1
    from public.firm_memberships m
    join public.firms f on f.id = m.firm_id
    where m.user_id = auth.uid()
      and m.status = 'active'
      and target_bucket_id in ('documents', 'wisp-pdfs')
      and f.slug = (storage.foldername(object_name))[1]
  );
$$;

revoke all on function private.has_firm_access(uuid) from public;
revoke all on function private.can_manage_firm(uuid) from public;
revoke all on function private.has_storage_access(text, text) from public;

-- New Auth users receive an isolated firm and owner membership atomically.
create or replace function private.handle_new_easywisp_user()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_name text := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'firm_name'), ''), 'My firm'), 120);
  v_contact text := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)), 120);
  v_base text;
  v_slug text;
  v_firm_id uuid;
begin
  -- Do not create duplicate workspaces if the trigger is replayed.
  if exists (select 1 from public.firm_memberships where user_id = new.id) then
    return new;
  end if;

  v_base := trim(both '-' from lower(regexp_replace(v_name, '[^a-zA-Z0-9]+', '-', 'g')));
  v_base := left(coalesce(nullif(v_base, ''), 'firm'), 45);
  v_slug := v_base || '-' || substr(encode(digest(new.id::text || clock_timestamp()::text, 'sha256'), 'hex'), 1, 10);

  insert into public.firms (slug, name, primary_contact)
  values (v_slug, v_name, v_contact)
  returning id into v_firm_id;

  insert into public.firm_memberships (firm_id, user_id, role, status)
  values (v_firm_id, new.id, 'owner', 'active');

  insert into public.app_settings (firm_id, settings) values (v_firm_id, '{}'::jsonb);
  insert into public.dashboard_facts (firm_id, completion_percent, status_label, section_count)
  values (v_firm_id, 0, 'Not started', 12);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_easywisp on auth.users;
create trigger on_auth_user_created_easywisp
  after insert on auth.users
  for each row execute procedure private.handle_new_easywisp_user();

-- Transitional helper for an authenticated test account created before the trigger.
create or replace function public.provision_my_easywisp_firm(p_firm_name text, p_full_name text default null)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user auth.users%rowtype;
  v_firm public.firms%rowtype;
  v_base text;
  v_slug text;
begin
  if auth.uid() is null then raise exception 'Sign in before creating a workspace'; end if;
  select * into v_user from auth.users where id = auth.uid();
  if not found then raise exception 'Authenticated user not found'; end if;
  select f.* into v_firm from public.firm_memberships m join public.firms f on f.id = m.firm_id
    where m.user_id = auth.uid() and m.status = 'active' order by m.created_at limit 1;
  if found then return jsonb_build_object('id', v_firm.id, 'slug', v_firm.slug, 'name', v_firm.name); end if;
  if coalesce(length(trim(p_firm_name)), 0) < 2 then raise exception 'Enter your firm name'; end if;
  v_base := left(trim(both '-' from lower(regexp_replace(trim(p_firm_name), '[^a-zA-Z0-9]+', '-', 'g'))), 45);
  v_slug := coalesce(nullif(v_base, ''), 'firm') || '-' || substr(encode(digest(auth.uid()::text || clock_timestamp()::text, 'sha256'), 'hex'), 1, 10);
  insert into public.firms (slug, name, primary_contact) values (v_slug, left(trim(p_firm_name), 120), left(coalesce(nullif(trim(p_full_name), ''), split_part(v_user.email, '@', 1)), 120)) returning * into v_firm;
  insert into public.firm_memberships (firm_id, user_id, role, status) values (v_firm.id, auth.uid(), 'owner', 'active');
  insert into public.app_settings (firm_id, settings) values (v_firm.id, '{}'::jsonb);
  insert into public.dashboard_facts (firm_id, completion_percent, status_label, section_count) values (v_firm.id, 0, 'Not started', 12);
  return jsonb_build_object('id', v_firm.id, 'slug', v_firm.slug, 'name', v_firm.name);
end;
$$;

revoke all on function public.provision_my_easywisp_firm(text, text) from public;
grant execute on function public.provision_my_easywisp_firm(text, text) to authenticated;

-- Remove development-era anonymous storage access.
drop policy if exists "Build stage can read workspace storage" on storage.objects;
drop policy if exists "Build stage can upload workspace storage" on storage.objects;
drop policy if exists "Build stage can update workspace storage" on storage.objects;
drop policy if exists "Build stage can delete workspace storage" on storage.objects;
drop policy if exists "Firm members can read firm documents storage" on storage.objects;
drop policy if exists "Firm members can upload firm documents storage" on storage.objects;
drop policy if exists "Firm members can update firm documents storage" on storage.objects;
drop policy if exists "Firm members can delete firm documents storage" on storage.objects;

create policy "Firm members read private workspace files" on storage.objects for select to authenticated
using ((select private.has_storage_access(bucket_id, name)));
create policy "Firm editors upload private workspace files" on storage.objects for insert to authenticated
with check ((select private.has_storage_access(bucket_id, name)));
create policy "Firm editors update private workspace files" on storage.objects for update to authenticated
using ((select private.has_storage_access(bucket_id, name))) with check ((select private.has_storage_access(bucket_id, name)));
create policy "Firm editors delete private workspace files" on storage.objects for delete to authenticated
using ((select private.has_storage_access(bucket_id, name)));

-- Enable RLS on every firm-owned table.
alter table public.firms enable row level security;
alter table public.firm_memberships enable row level security;
alter table public.dashboard_facts enable row level security;
alter table public.risk_assessments enable row level security;
alter table public.risk_assessment_answers enable row level security;
alter table public.wisp_projects enable row level security;
alter table public.wisp_answers enable row level security;
alter table public.wisp_generated_files enable row level security;
alter table public.wisp_attachments enable row level security;
alter table public.wisp_signatures enable row level security;
alter table public.wisp_acknowledgement_requests enable row level security;
alter table public.documents enable row level security;
alter table public.app_settings enable row level security;
alter table public.training_assets enable row level security;
alter table public.training_sign_in_sheets enable row level security;
alter table public.terminated_employee_checklists enable row level security;
alter table public.record_retention_policies enable row level security;
alter table public.disaster_recovery_plans enable row level security;
alter table public.incident_reports enable row level security;
alter table public.data_breach_response_guidelines enable row level security;
alter table public.data_breach_notification_letters enable row level security;

-- Reset policy names from the old, incomplete RLS attempt.
do $$ declare r record; begin
  for r in select schemaname, tablename, policyname from pg_policies where schemaname = 'public' loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

create policy "Members view firm" on public.firms for select to authenticated using ((select private.has_firm_access(id)));
create policy "Owners update firm" on public.firms for update to authenticated using ((select private.can_manage_firm(id))) with check ((select private.can_manage_firm(id)));
create policy "Members view memberships" on public.firm_memberships for select to authenticated using ((select private.has_firm_access(firm_id)));

-- Direct firm-owned tables share the same member-read/editor-write model.
create policy "Members read dashboard" on public.dashboard_facts for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write dashboard" on public.dashboard_facts for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read assessments" on public.risk_assessments for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write assessments" on public.risk_assessments for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read projects" on public.wisp_projects for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write projects" on public.wisp_projects for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read documents" on public.documents for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write documents" on public.documents for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read settings" on public.app_settings for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write settings" on public.app_settings for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read training sheets" on public.training_sign_in_sheets for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write training sheets" on public.training_sign_in_sheets for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read termination checklists" on public.terminated_employee_checklists for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write termination checklists" on public.terminated_employee_checklists for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read retention policy" on public.record_retention_policies for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write retention policy" on public.record_retention_policies for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read recovery plan" on public.disaster_recovery_plans for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write recovery plan" on public.disaster_recovery_plans for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read incident reports" on public.incident_reports for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write incident reports" on public.incident_reports for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read breach guidelines" on public.data_breach_response_guidelines for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write breach guidelines" on public.data_breach_response_guidelines for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read breach letters" on public.data_breach_notification_letters for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Editors write breach letters" on public.data_breach_notification_letters for all to authenticated using ((select private.can_manage_firm(firm_id))) with check ((select private.can_manage_firm(firm_id)));
create policy "Members read platform training" on public.training_assets for select to authenticated using (firm_id is null or (select private.has_firm_access(firm_id)));

-- Project descendants must derive tenancy through their parent project.
create policy "Members read assessment answers" on public.risk_assessment_answers for select to authenticated using (exists (select 1 from public.risk_assessments a where a.id = assessment_id and (select private.has_firm_access(a.firm_id))));
create policy "Editors write assessment answers" on public.risk_assessment_answers for all to authenticated using (exists (select 1 from public.risk_assessments a where a.id = assessment_id and (select private.can_manage_firm(a.firm_id)))) with check (exists (select 1 from public.risk_assessments a where a.id = assessment_id and (select private.can_manage_firm(a.firm_id))));
create policy "Members read WISP answers" on public.wisp_answers for select to authenticated using (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.has_firm_access(p.firm_id))));
create policy "Editors write WISP answers" on public.wisp_answers for all to authenticated using (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.can_manage_firm(p.firm_id)))) with check (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.can_manage_firm(p.firm_id))));
create policy "Members read generated WISPs" on public.wisp_generated_files for select to authenticated using (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.has_firm_access(p.firm_id))));
create policy "Editors write generated WISPs" on public.wisp_generated_files for all to authenticated using (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.can_manage_firm(p.firm_id)))) with check (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.can_manage_firm(p.firm_id))));
create policy "Members read WISP attachments" on public.wisp_attachments for select to authenticated using (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.has_firm_access(p.firm_id))));
create policy "Editors write WISP attachments" on public.wisp_attachments for all to authenticated using (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.can_manage_firm(p.firm_id)))) with check (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.can_manage_firm(p.firm_id))));
create policy "Members read WISP signatures" on public.wisp_signatures for select to authenticated using (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.has_firm_access(p.firm_id))));
create policy "Editors write WISP signatures" on public.wisp_signatures for all to authenticated using (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.can_manage_firm(p.firm_id)))) with check (exists (select 1 from public.wisp_projects p where p.id = project_id and (select private.can_manage_firm(p.firm_id))));

-- Acknowledgement rows are exposed only by the token-protected public RPCs or manager RPCs.
create policy "No direct acknowledgement access" on public.wisp_acknowledgement_requests for select to authenticated using (false);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.firms, public.dashboard_facts, public.risk_assessments, public.risk_assessment_answers, public.wisp_projects, public.wisp_answers, public.wisp_generated_files, public.wisp_attachments, public.wisp_signatures, public.documents, public.app_settings, public.training_sign_in_sheets, public.terminated_employee_checklists, public.record_retention_policies, public.disaster_recovery_plans, public.incident_reports, public.data_breach_response_guidelines, public.data_breach_notification_letters to authenticated;
grant select on public.firm_memberships, public.training_assets to authenticated;

-- Production acknowledgement management: authenticated firm editors only.
create or replace function public.create_wisp_acknowledgement_requests(p_project_id uuid, p_recipients jsonb, p_wisp_snapshot jsonb, p_acknowledgement_text text, p_expires_in_days integer default 30)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_project public.wisp_projects%rowtype; v_recipient jsonb; v_staff_id text; v_name text; v_email text; v_role text; v_token text; v_hash text; v_request record; v_results jsonb := '[]'::jsonb; v_expires timestamptz := now() + make_interval(days => greatest(1, least(coalesce(p_expires_in_days, 30), 90)));
begin
  select * into v_project from public.wisp_projects where id = p_project_id;
  if not found or not private.can_manage_firm(v_project.firm_id) then raise exception 'You are not allowed to manage acknowledgement requests for this WISP'; end if;
  if coalesce(jsonb_typeof(p_recipients), '') <> 'array' or jsonb_array_length(p_recipients) = 0 then raise exception 'Select at least one staff member'; end if;
  if coalesce(length(trim(p_acknowledgement_text)), 0) = 0 then raise exception 'Acknowledgement text is required'; end if;
  for v_recipient in select value from jsonb_array_elements(p_recipients) loop
    v_staff_id := nullif(trim(v_recipient ->> 'staff_id'), ''); v_name := nullif(trim(v_recipient ->> 'name'), ''); v_email := nullif(trim(v_recipient ->> 'email'), ''); v_role := nullif(trim(v_recipient ->> 'role'), '');
    if v_staff_id is null or v_name is null then continue; end if;
    if exists (select 1 from public.wisp_acknowledgement_requests where project_id = p_project_id and recipient_staff_id = v_staff_id and status = 'signed') then raise exception '% has already acknowledged this WISP and cannot sign again', v_name; end if;
    update public.wisp_acknowledgement_requests set status = 'revoked', revoked_at = now(), updated_at = now() where project_id = p_project_id and recipient_staff_id = v_staff_id and status = 'pending';
    v_token := encode(gen_random_bytes(32), 'hex'); v_hash := encode(digest(v_token, 'sha256'), 'hex');
    insert into public.wisp_acknowledgement_requests (project_id, firm_id, recipient_staff_id, recipient_name, recipient_email, recipient_role, acknowledgement_text, wisp_snapshot, access_token_hash, expires_at)
    values (p_project_id, v_project.firm_id, v_staff_id, v_name, v_email, v_role, p_acknowledgement_text, coalesce(p_wisp_snapshot, '{}'::jsonb), v_hash, v_expires) returning id, expires_at into v_request;
    v_results := v_results || jsonb_build_array(jsonb_build_object('id', v_request.id, 'token', v_token, 'recipient_name', v_name, 'recipient_email', v_email, 'expires_at', v_request.expires_at));
  end loop;
  if jsonb_array_length(v_results) = 0 then raise exception 'No valid staff recipients were supplied'; end if;
  return jsonb_build_object('requests', v_results);
end; $$;

create or replace function public.list_wisp_acknowledgement_requests(p_project_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_project public.wisp_projects%rowtype; v_rows jsonb;
begin
  select * into v_project from public.wisp_projects where id = p_project_id;
  if not found or not private.has_firm_access(v_project.firm_id) then raise exception 'You are not allowed to view acknowledgement requests for this WISP'; end if;
  update public.wisp_acknowledgement_requests set status = 'expired', updated_at = now() where project_id = p_project_id and status = 'pending' and expires_at <= now();
  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'recipient_staff_id', recipient_staff_id, 'recipient_name', recipient_name, 'recipient_email', recipient_email, 'recipient_role', recipient_role, 'status', status, 'expires_at', expires_at, 'opened_at', opened_at, 'signed_at', signed_at, 'signature_method', signature_method, 'signature_data', signature_data, 'signature_font', signature_font, 'created_at', created_at) order by created_at desc), '[]'::jsonb) into v_rows from public.wisp_acknowledgement_requests where project_id = p_project_id;
  return v_rows;
end; $$;

create or replace function public.remove_wisp_acknowledgement_request(p_project_id uuid, p_request_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_project public.wisp_projects%rowtype; v_request public.wisp_acknowledgement_requests%rowtype;
begin
  select * into v_project from public.wisp_projects where id = p_project_id;
  if not found or not private.can_manage_firm(v_project.firm_id) then raise exception 'You are not allowed to manage acknowledgement requests for this WISP'; end if;
  update public.wisp_acknowledgement_requests set status = 'revoked', revoked_at = now(), updated_at = now() where id = p_request_id and project_id = p_project_id and status = 'pending' returning * into v_request;
  if not found then raise exception 'Only pending acknowledgement requests can be removed'; end if;
  return jsonb_build_object('id', v_request.id, 'status', v_request.status);
end; $$;

revoke all on function public.create_wisp_acknowledgement_requests(uuid, jsonb, jsonb, text, integer) from public;
revoke all on function public.list_wisp_acknowledgement_requests(uuid) from public;
revoke all on function public.remove_wisp_acknowledgement_request(uuid, uuid) from public;
grant execute on function public.create_wisp_acknowledgement_requests(uuid, jsonb, jsonb, text, integer) to authenticated;
grant execute on function public.list_wisp_acknowledgement_requests(uuid) to authenticated;
grant execute on function public.remove_wisp_acknowledgement_request(uuid, uuid) to authenticated;

-- Public signing remains token-only; no direct table access is granted to anon.
grant execute on function public.get_wisp_acknowledgement_request(uuid, text) to anon;
grant execute on function public.complete_wisp_acknowledgement_request(uuid, text, text, text, text) to anon;
