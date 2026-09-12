-- Stage 4: bind every queued render to an immutable, server-stored payload.
alter table public.wisp_generation_jobs
  add column if not exists render_payload jsonb,
  add column if not exists last_error_at timestamptz;

-- Replace the two-argument foundation RPC so callers cannot enqueue a job
-- without the immutable render payload used by the worker.
drop function if exists public.create_wisp_generation_job(uuid, text);

create or replace function public.create_wisp_generation_job(
  p_project_id uuid,
  p_idempotency_key text,
  p_render_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  p public.wisp_projects%rowtype;
  v public.wisp_versions%rowtype;
  j public.wisp_generation_jobs%rowtype;
  snapshot jsonb;
  render_payload jsonb;
begin
  if auth.uid() is null or length(trim(coalesce(p_idempotency_key,''))) < 16 then
    raise exception 'Invalid generation request';
  end if;
  if pg_column_size(coalesce(p_render_payload, '{}'::jsonb)) > 4194304 then
    raise exception 'WISP render payload is too large';
  end if;
  select * into p from public.wisp_projects where id = p_project_id for update;
  if not found or not private.can_manage_firm(p.firm_id) then
    raise exception 'Not allowed to generate this WISP';
  end if;
  select * into j from public.wisp_generation_jobs
    where firm_id = p.firm_id and idempotency_key = p_idempotency_key;
  if found then
    return jsonb_build_object('job_id', j.id, 'version_id', j.version_id, 'status', j.status);
  end if;
  render_payload := coalesce(p_render_payload, '{}'::jsonb) - 'signatures';
  snapshot := jsonb_build_object(
    'title', p.title,
    'section_drafts', p.section_drafts,
    'assessment_snapshot', p.assessment_snapshot,
    'project_id', p.id,
    'firm_id', p.firm_id,
    'render_payload', render_payload
  );
  insert into public.wisp_versions(project_id, firm_id, version_number, source_revision, snapshot, content_hash, created_by)
  values (
    p.id, p.firm_id,
    (select coalesce(max(version_number), 0) + 1 from public.wisp_versions where project_id = p.id),
    p.updated_at, snapshot, encode(digest(snapshot::text, 'sha256'), 'hex'), auth.uid()
  ) returning * into v;
  insert into public.wisp_generation_jobs(version_id, firm_id, idempotency_key, request_hash, render_payload)
  values (v.id, p.firm_id, p_idempotency_key, encode(digest(snapshot::text, 'sha256'), 'hex'), render_payload)
  returning * into j;
  return jsonb_build_object('job_id', j.id, 'version_id', v.id, 'status', j.status, 'content_hash', v.content_hash);
end; $$;

create or replace function public.claim_wisp_generation_job()
returns jsonb language plpgsql security definer set search_path = public as $$
declare j public.wisp_generation_jobs%rowtype;
begin
  -- Expired leases are safe to retry because completion requires the lease token.
  update public.wisp_generation_jobs
    set status = 'queued', lease_token = null, lease_expires_at = null, updated_at = now()
    where status = 'leased' and lease_expires_at < now();
  select * into j from public.wisp_generation_jobs
    where status = 'queued' order by created_at for update skip locked limit 1;
  if not found then return null; end if;
  update public.wisp_generation_jobs
    set status = 'leased', attempts = attempts + 1, lease_token = gen_random_uuid(),
        lease_expires_at = now() + interval '10 minutes', updated_at = now()
    where id = j.id returning * into j;
  return jsonb_build_object(
    'job_id', j.id, 'version_id', j.version_id, 'firm_id', j.firm_id,
    'lease_token', j.lease_token, 'render_payload', j.render_payload
  );
end; $$;

create or replace function public.fail_wisp_generation_job(p_job_id uuid, p_lease_token uuid, p_error_code text)
returns void language plpgsql security definer set search_path = public as $$
declare j public.wisp_generation_jobs%rowtype;
begin
  select * into j from public.wisp_generation_jobs where id = p_job_id for update;
  if not found or j.status <> 'leased' or j.lease_token <> p_lease_token then
    raise exception 'Invalid generation lease';
  end if;
  update public.wisp_generation_jobs set status = case when attempts >= 3 then 'failed' else 'queued' end,
    error_code = left(coalesce(p_error_code, 'render_failed'), 200), last_error_at = now(),
    lease_token = null, lease_expires_at = null, updated_at = now() where id = j.id;
  update public.wisp_versions set state = 'failed'
    where id = j.version_id and (select status from public.wisp_generation_jobs where id = j.id) = 'failed';
end; $$;

revoke all on function public.create_wisp_generation_job(uuid,text,jsonb), public.fail_wisp_generation_job(uuid,uuid,text) from public;
grant execute on function public.create_wisp_generation_job(uuid,text,jsonb) to authenticated;
grant execute on function public.fail_wisp_generation_job(uuid,uuid,text) to service_role;
