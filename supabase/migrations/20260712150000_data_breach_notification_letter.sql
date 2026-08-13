create table if not exists public.data_breach_notification_letters (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null unique references public.firms(id) on delete cascade,
  letter_data jsonb not null default '{}'::jsonb,
  exported_document_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.data_breach_notification_letters disable row level security;
