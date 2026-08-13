-- Ensure pgcrypto digest resolves through Supabase extension search_path.`r`n`r`n-- Fix pgcrypto lookup for acknowledgement request token hashing.
-- Supabase installs pgcrypto in the extensions schema.

create or replace function public.create_wisp_acknowledgement_requests(
  p_project_id uuid,
  p_recipients jsonb,
  p_wisp_snapshot jsonb,
  p_acknowledgement_text text,
  p_expires_in_days integer default 30
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_project record;
  v_recipient jsonb;
  v_staff_id text;
  v_name text;
  v_email text;
  v_role text;
  v_token text;
  v_token_hash text;
  v_request record;
  v_results jsonb := '[]'::jsonb;
  v_expires_at timestamptz := now() + make_interval(days => greatest(1, least(coalesce(p_expires_in_days, 30), 90)));
begin
  select id, firm_id into v_project
  from public.wisp_projects
  where id = p_project_id;

  if not found then
    raise exception 'WISP project not found';
  end if;

  if coalesce(jsonb_typeof(p_recipients), '') <> 'array' then
    raise exception 'Select at least one staff member';
  end if;

  if jsonb_array_length(p_recipients) = 0 then
    raise exception 'Select at least one staff member';
  end if;

  if coalesce(length(trim(p_acknowledgement_text)), 0) = 0 then
    raise exception 'Acknowledgement text is required';
  end if;

  for v_recipient in select value from jsonb_array_elements(p_recipients)
  loop
    v_staff_id := nullif(trim(v_recipient ->> 'staff_id'), '');
    v_name := nullif(trim(v_recipient ->> 'name'), '');
    v_email := nullif(trim(v_recipient ->> 'email'), '');
    v_role := nullif(trim(v_recipient ->> 'role'), '');

    if v_staff_id is null or v_name is null then
      continue;
    end if;

    -- A resend invalidates the prior link before a fresh opaque token is issued.
    update public.wisp_acknowledgement_requests
    set status = 'revoked', revoked_at = now(), updated_at = now()
    where project_id = p_project_id
      and recipient_staff_id = v_staff_id
      and status = 'pending';

    v_token := encode(gen_random_bytes(32), 'hex');
    v_token_hash := encode(digest(v_token, 'sha256'), 'hex');

    insert into public.wisp_acknowledgement_requests (
      project_id, firm_id, recipient_staff_id, recipient_name, recipient_email, recipient_role,
      acknowledgement_text, wisp_snapshot, access_token_hash, expires_at
    ) values (
      p_project_id, v_project.firm_id, v_staff_id, v_name, v_email, v_role,
      p_acknowledgement_text, coalesce(p_wisp_snapshot, '{}'::jsonb), v_token_hash, v_expires_at
    )
    returning id, expires_at into v_request;

    v_results := v_results || jsonb_build_array(jsonb_build_object(
      'id', v_request.id,
      'token', v_token,
      'recipient_name', v_name,
      'recipient_email', v_email,
      'expires_at', v_request.expires_at
    ));
  end loop;

  if jsonb_array_length(v_results) = 0 then
    raise exception 'No valid staff recipients were supplied';
  end if;

  return jsonb_build_object('requests', v_results);
end;
$$;

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
begin
  v_token_hash := encode(digest(coalesce(p_token, ''), 'sha256'), 'hex');
  select * into v_request
  from public.wisp_acknowledgement_requests
  where id = p_request_id and access_token_hash = v_token_hash;

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

  update public.wisp_acknowledgement_requests
  set opened_at = coalesce(opened_at, now()), updated_at = now()
  where id = v_request.id;

  return jsonb_build_object(
    'id', v_request.id,
    'recipient_name', v_request.recipient_name,
    'recipient_email', v_request.recipient_email,
    'recipient_role', v_request.recipient_role,
    'acknowledgement_text', v_request.acknowledgement_text,
    'wisp_snapshot', v_request.wisp_snapshot,
    'expires_at', v_request.expires_at
  );
end;
$$;

create or replace function public.complete_wisp_acknowledgement_request(
  p_request_id uuid,
  p_token text,
  p_signature_method text,
  p_signature_data text,
  p_signature_font text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_request public.wisp_acknowledgement_requests%rowtype;
  v_token_hash text;
begin
  if p_signature_method not in ('draw', 'type') then
    raise exception 'Choose a signature method';
  end if;

  if coalesce(length(trim(p_signature_data)), 0) = 0 then
    raise exception 'Provide a signature before continuing';
  end if;

  v_token_hash := encode(digest(coalesce(p_token, ''), 'sha256'), 'hex');
  update public.wisp_acknowledgement_requests
  set status = 'signed',
      signed_at = now(),
      signature_method = p_signature_method,
      signature_data = p_signature_data,
      signature_font = nullif(trim(p_signature_font), ''),
      updated_at = now()
  where id = p_request_id
    and access_token_hash = v_token_hash
    and status = 'pending'
    and expires_at > now()
  returning * into v_request;

  if not found then
    raise exception 'This signing link is expired, invalid, or already used';
  end if;

  return jsonb_build_object(
    'id', v_request.id,
    'status', v_request.status,
    'signed_at', v_request.signed_at,
    'recipient_name', v_request.recipient_name,
    'recipient_role', v_request.recipient_role
  );
end;
$$;
