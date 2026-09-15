-- A signature is version-bound evidence. Render a new artifact for that same
-- immutable WISP version rather than changing the original unsigned artifact.
create or replace function public.queue_wisp_signed_render(
  p_version_id uuid,
  p_idempotency_key text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v public.wisp_versions%rowtype;
  source_job public.wisp_generation_jobs%rowtype;
  queued_job public.wisp_generation_jobs%rowtype;
begin
  if auth.uid() is null or length(trim(coalesce(p_idempotency_key, ''))) < 16 then
    raise exception 'Invalid signed-render request';
  end if;
  select * into v from public.wisp_versions where id = p_version_id for update;
  if not found or v.state not in ('ready', 'signing', 'active') or not private.can_manage_firm(v.firm_id) then
    raise exception 'Not allowed to render this signed WISP';
  end if;
  select * into queued_job from public.wisp_generation_jobs
    where firm_id = v.firm_id and idempotency_key = p_idempotency_key;
  if found then
    return jsonb_build_object('job_id', queued_job.id, 'version_id', queued_job.version_id, 'status', queued_job.status);
  end if;
  select * into source_job from public.wisp_generation_jobs
    where version_id = v.id and status = 'succeeded' and render_payload is not null
    order by completed_at desc nulls last, created_at desc
    limit 1;
  if not found then
    raise exception 'The immutable WISP render payload is unavailable';
  end if;
  insert into public.wisp_generation_jobs(version_id, firm_id, idempotency_key, request_hash, render_payload)
  values (
    v.id, v.firm_id, p_idempotency_key,
    encode(digest(source_job.render_payload::text || ':signed:' || now()::text, 'sha256'), 'hex'),
    source_job.render_payload
  ) returning * into queued_job;
  return jsonb_build_object('job_id', queued_job.id, 'version_id', queued_job.version_id, 'status', queued_job.status);
end;
$$;

create or replace function public.complete_wisp_generation_job(
  p_job_id uuid,
  p_lease_token uuid,
  p_storage_path text,
  p_file_name text,
  p_content_hash text,
  p_size_bytes bigint
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  j public.wisp_generation_jobs%rowtype;
  f public.wisp_generated_files%rowtype;
begin
  select * into j from public.wisp_generation_jobs where id = p_job_id for update;
  if not found or j.status <> 'leased' or j.lease_token <> p_lease_token or j.lease_expires_at < now() then
    raise exception 'Invalid or expired generation lease';
  end if;
  if p_size_bytes < 1 or p_content_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid generated artifact';
  end if;
  insert into public.wisp_generated_files(project_id, version_id, storage_path, file_name, content_hash, size_bytes)
  select v.project_id, v.id, p_storage_path, p_file_name, p_content_hash, p_size_bytes
    from public.wisp_versions v where v.id = j.version_id
    returning * into f;
  update public.wisp_versions
    set state = case when state = 'queued' then 'ready' else state end,
        ready_at = coalesce(ready_at, now())
    where id = j.version_id;
  update public.wisp_generation_jobs
    set status = 'succeeded', completed_at = now(), updated_at = now()
    where id = j.id;
  return jsonb_build_object('version_id', j.version_id, 'file_id', f.id, 'status', 'ready');
end;
$$;

create or replace function public.fail_wisp_generation_job(
  p_job_id uuid,
  p_lease_token uuid,
  p_error_code text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  j public.wisp_generation_jobs%rowtype;
begin
  select * into j from public.wisp_generation_jobs where id = p_job_id for update;
  if not found or j.status <> 'leased' or j.lease_token <> p_lease_token then
    raise exception 'Invalid generation lease';
  end if;
  update public.wisp_generation_jobs
    set status = case when attempts >= 3 then 'failed' else 'queued' end,
        error_code = left(coalesce(p_error_code, 'render_failed'), 200),
        last_error_at = now(), lease_token = null, lease_expires_at = null, updated_at = now()
    where id = j.id;
  update public.wisp_versions
    set state = 'failed'
    where id = j.version_id
      and state = 'queued'
      and (select status from public.wisp_generation_jobs where id = j.id) = 'failed';
end;
$$;

revoke all on function public.queue_wisp_signed_render(uuid, text) from public;
grant execute on function public.queue_wisp_signed_render(uuid, text) to authenticated;
