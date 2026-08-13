-- Firm-scoped onboarding state. Canonical firm data remains in public.firms;
-- this table records setup progress, versioning, and the information collected
-- while the workspace is being configured.
create table if not exists public.firm_onboarding (
  firm_id uuid primary key references public.firms(id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  current_step smallint not null default 1 check (current_step between 1 and 6),
  flow_version integer not null default 1,
  profile jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  completed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists firm_onboarding_status_idx
  on public.firm_onboarding (status);

create or replace function public.create_firm_onboarding()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.firm_onboarding (firm_id)
  values (new.id)
  on conflict (firm_id) do nothing;
  return new;
end;
$$;

revoke all on function public.create_firm_onboarding() from public;

drop trigger if exists create_firm_onboarding_on_firm_insert on public.firms;
create trigger create_firm_onboarding_on_firm_insert
  after insert on public.firms
  for each row execute function public.create_firm_onboarding();

-- Existing workspaces were created before this required setup gate. Do not
-- interrupt them; only firms created from now on begin onboarding.
insert into public.firm_onboarding (firm_id, status, current_step, completed_at)
select f.id, 'completed', 6, now()
from public.firms f
on conflict (firm_id) do nothing;

alter table public.firm_onboarding enable row level security;

drop policy if exists "Members read firm onboarding" on public.firm_onboarding;
drop policy if exists "Owners manage firm onboarding" on public.firm_onboarding;

create policy "Members read firm onboarding"
  on public.firm_onboarding for select to authenticated
  using ((select private.has_firm_access(firm_id)));

create policy "Owners manage firm onboarding"
  on public.firm_onboarding for all to authenticated
  using ((select private.can_manage_firm(firm_id)))
  with check ((select private.can_manage_firm(firm_id)));

grant select, insert, update on public.firm_onboarding to authenticated;