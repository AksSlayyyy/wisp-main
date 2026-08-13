create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

create table if not exists public.firm_memberships (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'editor', 'viewer')),
  status text not null default 'active' check (status in ('active', 'invited', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (firm_id, user_id)
);

create index if not exists firm_memberships_user_id_idx
  on public.firm_memberships (user_id);

create index if not exists firm_memberships_firm_id_idx
  on public.firm_memberships (firm_id);

create or replace function private.has_firm_access(target_firm_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.firm_memberships memberships
    where memberships.firm_id = target_firm_id
      and memberships.user_id = (select auth.uid())
      and memberships.status = 'active'
  );
$$;

create or replace function private.has_firm_role(target_firm_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.firm_memberships memberships
    where memberships.firm_id = target_firm_id
      and memberships.user_id = (select auth.uid())
      and memberships.status = 'active'
      and memberships.role = any (allowed_roles)
  );
$$;

create or replace function private.has_storage_access(target_bucket_id text, object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.firm_memberships memberships
    join public.firms firms
      on firms.id = memberships.firm_id
    where memberships.user_id = (select auth.uid())
      and memberships.status = 'active'
      and target_bucket_id in ('documents', 'wisp-pdfs')
      and firms.slug = (storage.foldername(object_name))[1]
  );
$$;

revoke all on function private.has_firm_access(uuid) from public;
revoke all on function private.has_firm_role(uuid, text[]) from public;
revoke all on function private.has_storage_access(text, text) from public;

grant execute on function private.has_firm_access(uuid) to authenticated;
grant execute on function private.has_firm_role(uuid, text[]) to authenticated;
grant execute on function private.has_storage_access(text, text) to authenticated;

grant select, update on public.firms to authenticated;
grant select on public.firm_memberships to authenticated;
grant select, insert, update on public.dashboard_facts to authenticated;
grant select, insert, update on public.risk_assessments to authenticated;
grant select, insert, update on public.risk_assessment_answers to authenticated;
grant select, insert, update on public.wisp_projects to authenticated;
grant select, insert, update on public.wisp_answers to authenticated;
grant select, insert on public.wisp_generated_files to authenticated;
grant select, insert, delete on public.documents to authenticated;
grant select on public.training_assets to authenticated;
grant select, insert, update on public.app_settings to authenticated;

insert into public.firm_memberships (firm_id, user_id, role, status)
select firms.id, users.id, 'owner', 'active'
from public.firms firms
cross join auth.users users
where firms.slug = 'default-firm'
on conflict (firm_id, user_id) do nothing;

alter table public.firms enable row level security;
alter table public.firm_memberships enable row level security;
alter table public.dashboard_facts enable row level security;
alter table public.risk_assessments enable row level security;
alter table public.risk_assessment_answers enable row level security;
alter table public.wisp_projects enable row level security;
alter table public.wisp_answers enable row level security;
alter table public.wisp_generated_files enable row level security;
alter table public.documents enable row level security;
alter table public.training_assets enable row level security;
alter table public.app_settings enable row level security;

create policy "Firm members can view their firm"
on public.firms
for select
to authenticated
using ((select private.has_firm_access(id)));

create policy "Firm admins can update their firm"
on public.firms
for update
to authenticated
using ((select private.has_firm_role(id, array['owner', 'admin'])))
with check ((select private.has_firm_role(id, array['owner', 'admin'])));

create policy "Firm members can view memberships in their firm"
on public.firm_memberships
for select
to authenticated
using ((select private.has_firm_access(firm_id)));

create policy "Firm members can view dashboard facts"
on public.dashboard_facts
for select
to authenticated
using ((select private.has_firm_access(firm_id)));

create policy "Firm members can create dashboard facts"
on public.dashboard_facts
for insert
to authenticated
with check ((select private.has_firm_access(firm_id)));

create policy "Firm members can update dashboard facts"
on public.dashboard_facts
for update
to authenticated
using ((select private.has_firm_access(firm_id)))
with check ((select private.has_firm_access(firm_id)));

create policy "Firm members can view assessments"
on public.risk_assessments
for select
to authenticated
using ((select private.has_firm_access(firm_id)));

create policy "Firm members can create assessments"
on public.risk_assessments
for insert
to authenticated
with check ((select private.has_firm_access(firm_id)));

create policy "Firm members can update assessments"
on public.risk_assessments
for update
to authenticated
using ((select private.has_firm_access(firm_id)))
with check ((select private.has_firm_access(firm_id)));

create policy "Firm members can view assessment answers"
on public.risk_assessment_answers
for select
to authenticated
using (
  exists (
    select 1
    from public.risk_assessments assessments
    where assessments.id = risk_assessment_answers.assessment_id
      and (select private.has_firm_access(assessments.firm_id))
  )
);

create policy "Firm members can create assessment answers"
on public.risk_assessment_answers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.risk_assessments assessments
    where assessments.id = risk_assessment_answers.assessment_id
      and (select private.has_firm_access(assessments.firm_id))
  )
);

create policy "Firm members can update assessment answers"
on public.risk_assessment_answers
for update
to authenticated
using (
  exists (
    select 1
    from public.risk_assessments assessments
    where assessments.id = risk_assessment_answers.assessment_id
      and (select private.has_firm_access(assessments.firm_id))
  )
)
with check (
  exists (
    select 1
    from public.risk_assessments assessments
    where assessments.id = risk_assessment_answers.assessment_id
      and (select private.has_firm_access(assessments.firm_id))
  )
);

create policy "Firm members can view WISP projects"
on public.wisp_projects
for select
to authenticated
using ((select private.has_firm_access(firm_id)));

create policy "Firm members can create WISP projects"
on public.wisp_projects
for insert
to authenticated
with check ((select private.has_firm_access(firm_id)));

create policy "Firm members can update WISP projects"
on public.wisp_projects
for update
to authenticated
using ((select private.has_firm_access(firm_id)))
with check ((select private.has_firm_access(firm_id)));

create policy "Firm members can view WISP answers"
on public.wisp_answers
for select
to authenticated
using (
  exists (
    select 1
    from public.wisp_projects projects
    where projects.id = wisp_answers.project_id
      and (select private.has_firm_access(projects.firm_id))
  )
);

create policy "Firm members can create WISP answers"
on public.wisp_answers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.wisp_projects projects
    where projects.id = wisp_answers.project_id
      and (select private.has_firm_access(projects.firm_id))
  )
);

create policy "Firm members can update WISP answers"
on public.wisp_answers
for update
to authenticated
using (
  exists (
    select 1
    from public.wisp_projects projects
    where projects.id = wisp_answers.project_id
      and (select private.has_firm_access(projects.firm_id))
  )
)
with check (
  exists (
    select 1
    from public.wisp_projects projects
    where projects.id = wisp_answers.project_id
      and (select private.has_firm_access(projects.firm_id))
  )
);

create policy "Firm members can view generated files"
on public.wisp_generated_files
for select
to authenticated
using (
  exists (
    select 1
    from public.wisp_projects projects
    where projects.id = wisp_generated_files.project_id
      and (select private.has_firm_access(projects.firm_id))
  )
);

create policy "Firm members can create generated files"
on public.wisp_generated_files
for insert
to authenticated
with check (
  exists (
    select 1
    from public.wisp_projects projects
    where projects.id = wisp_generated_files.project_id
      and (select private.has_firm_access(projects.firm_id))
  )
);

create policy "Firm members can view documents"
on public.documents
for select
to authenticated
using ((select private.has_firm_access(firm_id)));

create policy "Firm members can create documents"
on public.documents
for insert
to authenticated
with check ((select private.has_firm_access(firm_id)));

create policy "Firm members can delete documents"
on public.documents
for delete
to authenticated
using ((select private.has_firm_access(firm_id)));

create policy "Firm members can view training assets"
on public.training_assets
for select
to authenticated
using (firm_id is null or (select private.has_firm_access(firm_id)));

create policy "Firm members can view app settings"
on public.app_settings
for select
to authenticated
using ((select private.has_firm_access(firm_id)));

create policy "Firm members can create app settings"
on public.app_settings
for insert
to authenticated
with check ((select private.has_firm_access(firm_id)));

create policy "Firm members can update app settings"
on public.app_settings
for update
to authenticated
using ((select private.has_firm_access(firm_id)))
with check ((select private.has_firm_access(firm_id)));

create policy "Firm members can read firm documents storage"
on storage.objects
for select
to authenticated
using ((select private.has_storage_access(bucket_id, name)));

create policy "Firm members can upload firm documents storage"
on storage.objects
for insert
to authenticated
with check ((select private.has_storage_access(bucket_id, name)));

create policy "Firm members can update firm documents storage"
on storage.objects
for update
to authenticated
using ((select private.has_storage_access(bucket_id, name)))
with check ((select private.has_storage_access(bucket_id, name)));

create policy "Firm members can delete firm documents storage"
on storage.objects
for delete
to authenticated
using ((select private.has_storage_access(bucket_id, name)));
