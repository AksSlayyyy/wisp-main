create extension if not exists pgcrypto;

create table if not exists public.firms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  primary_contact text,
  practice_type text,
  staff_size text,
  tax_software text,
  it_management text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dashboard_facts (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  completion_percent integer not null default 68,
  focus_area text,
  status_label text,
  next_audit_label text,
  section_count integer not null default 12,
  updated_at timestamptz not null default now(),
  unique (firm_id)
);

create table if not exists public.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  status text not null default 'draft',
  company_name text,
  primary_contact text,
  practice_type text,
  staff_size text,
  tax_software text,
  it_management text,
  answers jsonb not null default '{}'::jsonb,
  score_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.risk_assessment_answers (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.risk_assessments(id) on delete cascade,
  question_key text not null,
  question_label text,
  answer_value text,
  score integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id, question_key)
);

create table if not exists public.wisp_projects (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  title text not null default 'Written Information Security Plan',
  status text not null default 'draft',
  section_drafts jsonb not null default '{}'::jsonb,
  assessment_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wisp_answers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.wisp_projects(id) on delete cascade,
  section_key text not null,
  answer_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, section_key)
);

create table if not exists public.wisp_generated_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.wisp_projects(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  bucket_name text not null default 'documents',
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.training_assets (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid references public.firms(id) on delete cascade,
  bucket_name text not null default 'training-assets',
  storage_path text,
  title text not null,
  description text,
  asset_type text not null,
  action_primary text,
  action_secondary text,
  created_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  logo_path text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (firm_id)
);

insert into public.firms (slug, name, primary_contact, practice_type, staff_size, tax_software, it_management)
values ('default-firm', 'Current Fiscal LLC', 'John Miller', 'Small CPA Firm (2-10 staff)', '2-10 staff', 'Drake Tax', 'Existing MSP partner')
on conflict (slug) do nothing;

insert into public.dashboard_facts (firm_id, completion_percent, focus_area, status_label, next_audit_label, section_count)
select id, 68, 'Administrative Safeguards', 'In Progress', 'Mar 2026', 12
from public.firms
where slug = 'default-firm'
on conflict (firm_id) do nothing;

insert into public.app_settings (firm_id, settings)
select id, '{}'::jsonb
from public.firms
where slug = 'default-firm'
on conflict (firm_id) do nothing;

insert into storage.buckets (id, name, public)
values
  ('wisp-pdfs', 'wisp-pdfs', false),
  ('documents', 'documents', false),
  ('training-assets', 'training-assets', true)
on conflict (id) do nothing;

alter table public.firms disable row level security;
alter table public.dashboard_facts disable row level security;
alter table public.risk_assessments disable row level security;
alter table public.risk_assessment_answers disable row level security;
alter table public.wisp_projects disable row level security;
alter table public.wisp_answers disable row level security;
alter table public.wisp_generated_files disable row level security;
alter table public.documents disable row level security;
alter table public.training_assets disable row level security;
alter table public.app_settings disable row level security;
