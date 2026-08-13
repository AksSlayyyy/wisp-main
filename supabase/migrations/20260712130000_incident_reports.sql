create table if not exists public.incident_reports (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  report_data jsonb not null default '{}'::jsonb,
  exported_document_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists incident_reports_firm_updated_idx
  on public.incident_reports (firm_id, updated_at desc);

alter table public.incident_reports disable row level security;
