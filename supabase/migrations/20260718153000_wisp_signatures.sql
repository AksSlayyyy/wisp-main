create table if not exists public.wisp_signatures (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.wisp_projects(id) on delete cascade,
  signer_name text not null,
  signer_role text not null,
  signer_email text,
  signature_method text not null check (signature_method in ('draw', 'type')),
  signature_data text not null,
  signature_font text,
  signed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, signer_role)
);

create index if not exists wisp_signatures_project_id_idx on public.wisp_signatures(project_id);
alter table public.wisp_signatures disable row level security;
