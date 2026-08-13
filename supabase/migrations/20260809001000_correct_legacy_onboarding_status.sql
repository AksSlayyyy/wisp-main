-- Correct the initial legacy backfill: rows created solely by the first
-- onboarding migration have no collected profile or completing user. They are
-- not genuinely onboarded and must enter the setup gate.
update public.firm_onboarding
set
  status = 'not_started',
  current_step = 1,
  completed_at = null,
  completed_by = null,
  updated_at = now()
where status = 'completed'
  and profile = '{}'::jsonb
  and completed_by is null;