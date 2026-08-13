create table if not exists public.wisp_attachments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.wisp_projects(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null default 'application/pdf',
  size_bytes bigint not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wisp_attachments_project_sort_idx
  on public.wisp_attachments(project_id, sort_order, created_at);

alter table public.wisp_attachments disable row level security;
