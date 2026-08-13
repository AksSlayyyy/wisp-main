create table if not exists public.terminated_employee_checklists (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  employee_name text not null default '',
  termination_date date,
  coordinator_name text not null default '',
  status text not null default 'draft' check (status in ('draft', 'completed')),
  checklist_data jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  exported_document_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists terminated_employee_checklists_firm_updated_idx
  on public.terminated_employee_checklists (firm_id, updated_at desc);

alter table public.terminated_employee_checklists disable row level security;
