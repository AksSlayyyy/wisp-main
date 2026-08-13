create or replace function public.get_wisp_acknowledgement_request(
  p_request_id uuid,
  p_token text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_request public.wisp_acknowledgement_requests%rowtype;
  v_token_hash text;
  v_wisp_pdf_storage_path text;
begin
  v_token_hash := encode(digest(coalesce(p_token, ''), 'sha256'), 'hex');

  select * into v_request
  from public.wisp_acknowledgement_requests
  where id = p_request_id
    and access_token_hash = v_token_hash;

  if not found then
    raise exception 'This signing link is invalid';
  end if;

  if v_request.status = 'pending' and v_request.expires_at <= now() then
    update public.wisp_acknowledgement_requests
    set status = 'expired', updated_at = now()
    where id = v_request.id;
    raise exception 'This signing link has expired';
  end if;

  if v_request.status <> 'pending' then
    raise exception 'This signing link is no longer active';
  end if;

  select coalesce(
    (
      select nullif(f.storage_path, '')
      from public.wisp_generated_files f
      where f.project_id = v_request.project_id
      order by f.created_at desc
      limit 1
    ),
    nullif(v_request.wisp_snapshot ->> 'finalPdfStoragePath', ''),
    nullif(v_request.wisp_snapshot ->> 'final_pdf_storage_path', '')
  ) into v_wisp_pdf_storage_path;

  update public.wisp_acknowledgement_requests
  set opened_at = coalesce(opened_at, now()), updated_at = now()
  where id = v_request.id;

  return jsonb_build_object(
    'id', v_request.id,
    'project_id', v_request.project_id,
    'recipient_name', v_request.recipient_name,
    'recipient_email', v_request.recipient_email,
    'recipient_role', v_request.recipient_role,
    'acknowledgement_text', v_request.acknowledgement_text,
    'wisp_snapshot', v_request.wisp_snapshot,
    'wisp_pdf_storage_path', v_wisp_pdf_storage_path,
    'created_at', v_request.created_at,
    'expires_at', v_request.expires_at
  );
end;
$$;

grant execute on function public.get_wisp_acknowledgement_request(uuid, text) to anon, authenticated;
