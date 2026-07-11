alter table public.dashboard_facts
  add column if not exists risk_assessment_status text not null default 'not_started' check (risk_assessment_status in ('not_started', 'in_progress', 'completed')),
  add column if not exists wisp_project_status text not null default 'not_started' check (wisp_project_status in ('not_started', 'in_progress', 'completed')),
  add column if not exists documents_count integer not null default 0,
  add column if not exists training_assets_count integer not null default 0,
  add column if not exists completed_sections_count integer not null default 0,
  add column if not exists risk_score integer,
  add column if not exists next_action_key text,
  add column if not exists next_action_label text,
  add column if not exists last_assessment_at timestamptz,
  add column if not exists last_wisp_updated_at timestamptz,
  add column if not exists summary jsonb not null default '{}'::jsonb;
