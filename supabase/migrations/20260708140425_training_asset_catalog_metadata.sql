alter table public.training_assets
  add column if not exists asset_key text,
  add column if not exists source_kind text not null default 'platform',
  add column if not exists sort_order integer not null default 0;

update public.training_assets
set
  asset_key = case
    when asset_type = 'mandatory' and title ilike '%annual staff training%' then 'annual_staff_training'
    when asset_type = 'mandatory' and title ilike '%sign-in sheet%' then 'employee_training_signin_sheet'
    when asset_type = 'video' and title ilike '%written information security plan overview%' then 'wisp_overview_video'
    when asset_type = 'video' and title ilike '%phishing%' then 'phishing_awareness_training'
    when title ilike '%dirty dozen%' then 'irs_dirty_dozen_briefing'
    when asset_type = 'resource' and title ilike '%ftc safeguards rule quick reference guide%' then 'ftc_safeguards_quick_reference'
    else asset_key
  end,
  source_kind = coalesce(nullif(source_kind, ''), 'platform'),
  sort_order = case
    when asset_type = 'mandatory' and title ilike '%annual staff training%' then 10
    when asset_type = 'mandatory' and title ilike '%sign-in sheet%' then 20
    when asset_type = 'video' and title ilike '%written information security plan overview%' then 30
    when asset_type = 'video' and title ilike '%phishing%' then 40
    when title ilike '%dirty dozen%' then 50
    when asset_type = 'resource' and title ilike '%ftc safeguards rule quick reference guide%' then 60
    else coalesce(sort_order, 0)
  end;

create index if not exists training_assets_firm_sort_idx
  on public.training_assets (firm_id, asset_type, sort_order, created_at);

create unique index if not exists training_assets_firm_asset_key_unique
  on public.training_assets (firm_id, asset_key)
  where asset_key is not null;
