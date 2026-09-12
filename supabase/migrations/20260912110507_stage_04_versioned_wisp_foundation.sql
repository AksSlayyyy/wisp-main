-- Stage 4 foundation: immutable WISP versions, durable generation jobs, and version-bound signatures.
create table if not exists public.wisp_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.wisp_projects(id) on delete cascade,
  firm_id uuid not null references public.firms(id) on delete cascade,
  version_number integer not null,
  source_revision timestamptz not null,
  snapshot jsonb not null,
  content_hash text not null,
  state text not null default 'queued' check (state in ('queued','rendering','ready','signing','active','superseded','failed')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  ready_at timestamptz,
  activated_at timestamptz,
  superseded_at timestamptz,
  unique(project_id, version_number)
);
create table if not exists public.wisp_generation_jobs (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.wisp_versions(id) on delete cascade,
  firm_id uuid not null references public.firms(id) on delete cascade,
  idempotency_key text not null,
  request_hash text not null,
  status text not null default 'queued' check (status in ('queued','leased','succeeded','failed')),
  attempts integer not null default 0,
  lease_token uuid,
  lease_expires_at timestamptz,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(firm_id, idempotency_key)
);
create table if not exists public.wisp_version_signatures (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.wisp_versions(id) on delete cascade,
  firm_id uuid not null references public.firms(id) on delete cascade,
  signer_user_id uuid not null references auth.users(id),
  signer_name text not null,
  signer_role text not null check (signer_role in ('Data Security Coordinator','Principal / Owner')),
  signature_method text not null check (signature_method in ('draw','type')),
  signature_data text not null check (length(signature_data) between 1 and 1048576),
  signature_font text,
  consent_text text not null,
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(version_id, signer_role)
);
alter table public.wisp_generated_files add column if not exists version_id uuid references public.wisp_versions(id) on delete restrict;
alter table public.wisp_generated_files add column if not exists content_hash text;
alter table public.wisp_generated_files add column if not exists size_bytes bigint;

alter table public.wisp_versions enable row level security;
alter table public.wisp_generation_jobs enable row level security;
alter table public.wisp_version_signatures enable row level security;
create policy "Members read WISP versions" on public.wisp_versions for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Members read WISP jobs" on public.wisp_generation_jobs for select to authenticated using ((select private.has_firm_access(firm_id)));
create policy "Members read version signatures" on public.wisp_version_signatures for select to authenticated using ((select private.has_firm_access(firm_id)));

create or replace function public.create_wisp_generation_job(p_project_id uuid, p_idempotency_key text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare p public.wisp_projects%rowtype; v public.wisp_versions%rowtype; j public.wisp_generation_jobs%rowtype; snapshot jsonb;
begin
  if auth.uid() is null or length(trim(coalesce(p_idempotency_key,''))) < 16 then raise exception 'Invalid generation request'; end if;
  select * into p from public.wisp_projects where id=p_project_id for update;
  if not found or not private.can_manage_firm(p.firm_id) then raise exception 'Not allowed to generate this WISP'; end if;
  select * into j from public.wisp_generation_jobs where firm_id=p.firm_id and idempotency_key=p_idempotency_key;
  if found then return jsonb_build_object('job_id',j.id,'version_id',j.version_id,'status',j.status); end if;
  snapshot := jsonb_build_object('title',p.title,'section_drafts',p.section_drafts,'assessment_snapshot',p.assessment_snapshot,'project_id',p.id,'firm_id',p.firm_id);
  insert into public.wisp_versions(project_id,firm_id,version_number,source_revision,snapshot,content_hash,created_by)
  values(p.id,p.firm_id,(select coalesce(max(version_number),0)+1 from public.wisp_versions where project_id=p.id),p.updated_at,snapshot,encode(digest(snapshot::text,'sha256'),'hex'),auth.uid()) returning * into v;
  insert into public.wisp_generation_jobs(version_id,firm_id,idempotency_key,request_hash) values(v.id,p.firm_id,p_idempotency_key,encode(digest(snapshot::text,'sha256'),'hex')) returning * into j;
  return jsonb_build_object('job_id',j.id,'version_id',v.id,'status',j.status,'content_hash',v.content_hash);
end; $$;

create or replace function public.claim_wisp_generation_job()
returns jsonb language plpgsql security definer set search_path = public as $$
declare j public.wisp_generation_jobs%rowtype;
begin
  select * into j from public.wisp_generation_jobs where status='queued' order by created_at for update skip locked limit 1;
  if not found then return null; end if;
  update public.wisp_generation_jobs set status='leased',attempts=attempts+1,lease_token=gen_random_uuid(),lease_expires_at=now()+interval '10 minutes',updated_at=now() where id=j.id returning * into j;
  return jsonb_build_object('job_id',j.id,'version_id',j.version_id,'lease_token',j.lease_token);
end; $$;

create or replace function public.complete_wisp_generation_job(p_job_id uuid,p_lease_token uuid,p_storage_path text,p_file_name text,p_content_hash text,p_size_bytes bigint)
returns jsonb language plpgsql security definer set search_path = public as $$
declare j public.wisp_generation_jobs%rowtype; f public.wisp_generated_files%rowtype;
begin
  select * into j from public.wisp_generation_jobs where id=p_job_id for update;
  if not found or j.status <> 'leased' or j.lease_token <> p_lease_token or j.lease_expires_at < now() then raise exception 'Invalid or expired generation lease'; end if;
  if p_size_bytes < 1 or p_content_hash !~ '^[0-9a-f]{64}$' then raise exception 'Invalid generated artifact'; end if;
  insert into public.wisp_generated_files(project_id,version_id,storage_path,file_name,content_hash,size_bytes)
  select v.project_id,v.id,p_storage_path,p_file_name,p_content_hash,p_size_bytes from public.wisp_versions v where v.id=j.version_id returning * into f;
  update public.wisp_versions set state='ready',ready_at=now() where id=j.version_id;
  update public.wisp_generation_jobs set status='succeeded',completed_at=now(),updated_at=now() where id=j.id;
  return jsonb_build_object('version_id',j.version_id,'file_id',f.id,'status','ready');
end; $$;

create or replace function public.sign_wisp_version(p_version_id uuid,p_signer_role text,p_signature_method text,p_signature_data text,p_signature_font text,p_consent_text text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v public.wisp_versions%rowtype; u auth.users%rowtype; s public.wisp_version_signatures%rowtype;
begin
  select * into v from public.wisp_versions where id=p_version_id for update;
  if not found or v.state not in ('ready','signing') or not private.can_manage_firm(v.firm_id) then raise exception 'Not allowed to sign this version'; end if;
  if p_signer_role not in ('Data Security Coordinator','Principal / Owner') or p_signature_method not in ('draw','type') or length(trim(coalesce(p_consent_text,''))) < 10 then raise exception 'Invalid signature'; end if;
  select * into u from auth.users where id=auth.uid();
  insert into public.wisp_version_signatures(version_id,firm_id,signer_user_id,signer_name,signer_role,signature_method,signature_data,signature_font,consent_text)
  values(v.id,v.firm_id,auth.uid(),coalesce(u.raw_user_meta_data->>'full_name',u.email),p_signer_role,p_signature_method,p_signature_data,p_signature_font,p_consent_text)
  on conflict(version_id,signer_role) do nothing returning * into s;
  if s.id is null then select * into s from public.wisp_version_signatures where version_id=v.id and signer_role=p_signer_role; end if;
  update public.wisp_versions set state='signing' where id=v.id and state='ready';
  return jsonb_build_object('id',s.id,'version_id',v.id,'signed_at',s.consented_at);
end; $$;

revoke all on function public.claim_wisp_generation_job(), public.complete_wisp_generation_job(uuid,uuid,text,text,text,bigint) from public;
revoke all on function public.create_wisp_generation_job(uuid,text), public.sign_wisp_version(uuid,text,text,text,text,text) from public;
grant execute on function public.create_wisp_generation_job(uuid,text), public.sign_wisp_version(uuid,text,text,text,text,text) to authenticated;
grant execute on function public.claim_wisp_generation_job(), public.complete_wisp_generation_job(uuid,uuid,text,text,text,bigint) to service_role;
