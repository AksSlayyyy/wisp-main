-- Build-stage only: auth is deliberately disabled, so client access must not depend on memberships.
-- Replace these permissive rules with firm-scoped RLS before production.
alter table if exists public.firms disable row level security;
alter table if exists public.firm_memberships disable row level security;
alter table if exists public.dashboard_facts disable row level security;
alter table if exists public.risk_assessments disable row level security;
alter table if exists public.risk_assessment_answers disable row level security;
alter table if exists public.wisp_projects disable row level security;
alter table if exists public.wisp_answers disable row level security;
alter table if exists public.wisp_generated_files disable row level security;
alter table if exists public.documents disable row level security;
alter table if exists public.training_assets disable row level security;
alter table if exists public.app_settings disable row level security;

drop policy if exists "Firm members can read firm documents storage" on storage.objects;
drop policy if exists "Firm members can upload firm documents storage" on storage.objects;
drop policy if exists "Firm members can update firm documents storage" on storage.objects;
drop policy if exists "Firm members can delete firm documents storage" on storage.objects;
drop policy if exists "Build stage can read workspace storage" on storage.objects;
drop policy if exists "Build stage can upload workspace storage" on storage.objects;
drop policy if exists "Build stage can update workspace storage" on storage.objects;
drop policy if exists "Build stage can delete workspace storage" on storage.objects;

create policy "Build stage can read workspace storage"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('documents', 'wisp-pdfs', 'training-assets'));

create policy "Build stage can upload workspace storage"
on storage.objects for insert
to anon, authenticated
with check (bucket_id in ('documents', 'wisp-pdfs', 'training-assets'));

create policy "Build stage can update workspace storage"
on storage.objects for update
to anon, authenticated
using (bucket_id in ('documents', 'wisp-pdfs', 'training-assets'))
with check (bucket_id in ('documents', 'wisp-pdfs', 'training-assets'));

create policy "Build stage can delete workspace storage"
on storage.objects for delete
to anon, authenticated
using (bucket_id in ('documents', 'wisp-pdfs', 'training-assets'));
