-- Stage 5: server-owned firm invitations, membership administration and audit events.
-- The browser never writes membership, invitation, entitlement, or audit records directly.

create table if not exists public.firm_invitations (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  invited_by uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired', 'delivery_failed')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id) on delete set null,
  revoked_at timestamptz,
  sent_at timestamptz,
  provider_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint firm_invitations_email_normalized check (email = lower(trim(email))),
  constraint firm_invitations_acceptance_state check (
    (status = 'accepted' and accepted_at is not null and accepted_by is not null)
    or status <> 'accepted'
  )
);

create unique index if not exists firm_invitations_one_open_email
  on public.firm_invitations (firm_id, email)
  where status in ('pending', 'delivery_failed');
create index if not exists firm_invitations_firm_status_idx
  on public.firm_invitations (firm_id, status, created_at desc);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (length(action) between 3 and 120),
  entity_type text not null check (length(entity_type) between 3 and 80),
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_events_metadata_object check (jsonb_typeof(metadata) = 'object')
);
create index if not exists audit_events_firm_created_idx on public.audit_events (firm_id, created_at desc);

alter table public.firm_invitations enable row level security;
alter table public.audit_events enable row level security;

create or replace function private.can_administer_members(p_firm_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.firm_memberships m
    where m.firm_id = p_firm_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role in ('owner', 'admin')
  );
$$;

create or replace function private.is_firm_owner(p_firm_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.firm_memberships m
    where m.firm_id = p_firm_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
      and m.role = 'owner'
  );
$$;

revoke all on function private.can_administer_members(uuid) from public;
revoke all on function private.is_firm_owner(uuid) from public;
grant execute on function private.can_administer_members(uuid) to authenticated;
grant execute on function private.is_firm_owner(uuid) to authenticated;

create or replace function private.record_audit_event(
  p_firm_id uuid, p_action text, p_entity_type text, p_entity_id uuid default null, p_metadata jsonb default '{}'::jsonb
) returns void language sql security definer set search_path = '' as $$
  insert into public.audit_events (firm_id, actor_user_id, action, entity_type, entity_id, metadata)
  values (p_firm_id, (select auth.uid()), p_action, p_entity_type, p_entity_id, coalesce(p_metadata, '{}'::jsonb));
$$;
revoke all on function private.record_audit_event(uuid, text, text, uuid, jsonb) from public;

-- Invited accounts must not receive an unintended owner workspace from the signup trigger.
create or replace function private.handle_new_easywisp_user()
returns trigger language plpgsql security definer set search_path = public, extensions as $$
declare
  v_name text := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'firm_name'), ''), 'My firm'), 120);
  v_contact text := left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)), 120);
  v_base text;
  v_slug text;
  v_firm_id uuid;
begin
  if exists (select 1 from public.firm_memberships where user_id = new.id) then return new; end if;
  if exists (
    select 1 from public.firm_invitations i
    where i.email = lower(trim(new.email))
      and i.status in ('pending', 'delivery_failed')
      and i.expires_at > now()
  ) then return new; end if;

  v_base := trim(both '-' from lower(regexp_replace(v_name, '[^a-zA-Z0-9]+', '-', 'g')));
  v_base := left(coalesce(nullif(v_base, ''), 'firm'), 45);
  v_slug := v_base || '-' || substr(encode(digest(new.id::text || clock_timestamp()::text, 'sha256'), 'hex'), 1, 10);
  insert into public.firms (slug, name, primary_contact) values (v_slug, v_name, v_contact) returning id into v_firm_id;
  insert into public.firm_memberships (firm_id, user_id, role, status) values (v_firm_id, new.id, 'owner', 'active');
  insert into public.app_settings (firm_id, settings) values (v_firm_id, '{}'::jsonb);
  insert into public.dashboard_facts (firm_id, completion_percent, status_label, section_count) values (v_firm_id, 0, 'Not started', 12);
  return new;
end;
$$;

create or replace function public.provision_my_easywisp_firm(p_firm_name text, p_full_name text default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_user auth.users%rowtype; v_firm public.firms%rowtype; v_base text; v_slug text;
begin
  if auth.uid() is null then raise exception 'Sign in before creating a workspace'; end if;
  select * into v_user from auth.users where id=auth.uid();
  if not found then raise exception 'Authenticated user not found'; end if;
  select f.* into v_firm from public.firm_memberships m join public.firms f on f.id=m.firm_id
    where m.user_id=auth.uid() and m.status='active' order by m.created_at limit 1;
  if found then return jsonb_build_object('id',v_firm.id,'slug',v_firm.slug,'name',v_firm.name); end if;
  if exists (select 1 from public.firm_invitations i where i.email=lower(trim(v_user.email)) and i.status in ('pending','delivery_failed') and i.expires_at>now()) then
    raise exception 'Accept the invitation from its secure link before opening a workspace';
  end if;
  if coalesce(length(trim(p_firm_name)),0) < 2 then raise exception 'Enter your firm name'; end if;
  v_base := left(trim(both '-' from lower(regexp_replace(trim(p_firm_name),'[^a-zA-Z0-9]+','-','g'))),45);
  v_slug := coalesce(nullif(v_base,''),'firm') || '-' || substr(encode(digest(auth.uid()::text || clock_timestamp()::text,'sha256'),'hex'),1,10);
  insert into public.firms (slug,name,primary_contact) values (v_slug,left(trim(p_firm_name),120),left(coalesce(nullif(trim(p_full_name),''),split_part(v_user.email,'@',1)),120)) returning * into v_firm;
  insert into public.firm_memberships (firm_id,user_id,role,status) values (v_firm.id,auth.uid(),'owner','active');
  insert into public.app_settings (firm_id,settings) values (v_firm.id,'{}'::jsonb);
  insert into public.dashboard_facts (firm_id,completion_percent,status_label,section_count) values (v_firm.id,0,'Not started',12);
  return jsonb_build_object('id',v_firm.id,'slug',v_firm.slug,'name',v_firm.name);
end;
$$;
revoke all on function public.provision_my_easywisp_firm(text,text) from public, anon;
grant execute on function public.provision_my_easywisp_firm(text,text) to authenticated;

create or replace function public.create_firm_invitation(p_firm_id uuid, p_email text, p_role text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare v_email text := lower(trim(coalesce(p_email, ''))); v_role text := lower(trim(coalesce(p_role, ''))); v_invitation public.firm_invitations%rowtype;
begin
  if not private.can_administer_members(p_firm_id) then raise exception 'You are not allowed to invite members to this firm'; end if;
  if v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$' then raise exception 'Enter a valid email address'; end if;
  if v_role not in ('admin', 'editor', 'viewer') then raise exception 'Choose admin, editor, or viewer access'; end if;
  if not private.is_firm_owner(p_firm_id) and v_role = 'admin' then raise exception 'Only an owner can invite an administrator'; end if;
  if exists (select 1 from public.firm_memberships m join auth.users u on u.id=m.user_id where m.firm_id=p_firm_id and lower(u.email)=v_email and m.status='active') then raise exception 'This person is already an active member'; end if;
  update public.firm_invitations set status='revoked', revoked_at=now(), updated_at=now()
    where firm_id=p_firm_id and email=v_email and status in ('pending','delivery_failed');
  insert into public.firm_invitations (firm_id,email,role,invited_by) values (p_firm_id,v_email,v_role,auth.uid()) returning * into v_invitation;
  perform private.record_audit_event(p_firm_id, 'member.invited', 'firm_invitation', v_invitation.id, jsonb_build_object('email',v_email,'role',v_role));
  return jsonb_build_object('id',v_invitation.id,'email',v_invitation.email,'role',v_invitation.role,'expires_at',v_invitation.expires_at);
end;
$$;

create or replace function public.get_firm_invitation_delivery(p_invitation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_invitation public.firm_invitations%rowtype;
begin
  select * into v_invitation from public.firm_invitations where id=p_invitation_id for update;
  if not found or not private.can_administer_members(v_invitation.firm_id) then raise exception 'Invitation is unavailable'; end if;
  if v_invitation.status not in ('pending','delivery_failed') or v_invitation.expires_at <= now() then raise exception 'Invitation is no longer active'; end if;
  return jsonb_build_object('id',v_invitation.id,'email',v_invitation.email,'role',v_invitation.role,'firm_id',v_invitation.firm_id);
end;
$$;

create or replace function public.record_firm_invitation_delivery(p_invitation_id uuid, p_success boolean, p_provider_message text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_invitation public.firm_invitations%rowtype;
begin
  select * into v_invitation from public.firm_invitations where id=p_invitation_id for update;
  if not found or not private.can_administer_members(v_invitation.firm_id) then raise exception 'Invitation is unavailable'; end if;
  update public.firm_invitations
  set status = case when p_success then 'pending' else 'delivery_failed' end,
      sent_at = case when p_success then now() else sent_at end,
      provider_message = left(nullif(trim(p_provider_message), ''), 300), updated_at=now()
  where id=v_invitation.id returning * into v_invitation;
  perform private.record_audit_event(v_invitation.firm_id, case when p_success then 'member.invitation_sent' else 'member.invitation_delivery_failed' end, 'firm_invitation', v_invitation.id, jsonb_build_object('email',v_invitation.email));
  return jsonb_build_object('id',v_invitation.id,'status',v_invitation.status,'sent_at',v_invitation.sent_at);
end;
$$;

create or replace function public.revoke_firm_invitation(p_invitation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_invitation public.firm_invitations%rowtype;
begin
  select * into v_invitation from public.firm_invitations where id=p_invitation_id for update;
  if not found or not private.can_administer_members(v_invitation.firm_id) then raise exception 'Invitation is unavailable'; end if;
  if v_invitation.status not in ('pending','delivery_failed') then raise exception 'Only an open invitation can be revoked'; end if;
  update public.firm_invitations set status='revoked', revoked_at=now(), updated_at=now() where id=v_invitation.id returning * into v_invitation;
  perform private.record_audit_event(v_invitation.firm_id, 'member.invitation_revoked', 'firm_invitation', v_invitation.id, jsonb_build_object('email',v_invitation.email));
  return jsonb_build_object('id',v_invitation.id,'status',v_invitation.status);
end;
$$;

create or replace function public.accept_firm_invitation(p_invitation_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_invitation public.firm_invitations%rowtype; v_email text;
begin
  select lower(trim(email)) into v_email from auth.users where id=auth.uid();
  select * into v_invitation from public.firm_invitations where id=p_invitation_id for update;
  if not found or v_invitation.status not in ('pending','delivery_failed') or v_invitation.expires_at <= now() then raise exception 'This invitation is unavailable or expired'; end if;
  if v_email is distinct from v_invitation.email then raise exception 'Sign in with the invited email address to accept this invitation'; end if;
  insert into public.firm_memberships (firm_id,user_id,role,status) values (v_invitation.firm_id,auth.uid(),v_invitation.role,'active')
    on conflict (firm_id,user_id) do update set role=excluded.role,status='active',updated_at=now();
  update public.firm_invitations set status='accepted',accepted_at=now(),accepted_by=auth.uid(),updated_at=now() where id=v_invitation.id;
  perform private.record_audit_event(v_invitation.firm_id, 'member.invitation_accepted', 'firm_invitation', v_invitation.id, jsonb_build_object('role',v_invitation.role));
  return jsonb_build_object('firm_id',v_invitation.firm_id,'role',v_invitation.role,'status','accepted');
end;
$$;

create or replace function public.set_firm_membership_role(p_membership_id uuid, p_role text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_member public.firm_memberships%rowtype; v_role text := lower(trim(coalesce(p_role,'')));
begin
  select * into v_member from public.firm_memberships where id=p_membership_id for update;
  if not found or not private.can_administer_members(v_member.firm_id) then raise exception 'Member is unavailable'; end if;
  if v_member.role='owner' then raise exception 'Transfer ownership before changing an owner role'; end if;
  if v_role not in ('admin','editor','viewer') then raise exception 'Choose admin, editor, or viewer access'; end if;
  if not private.is_firm_owner(v_member.firm_id) and v_role='admin' then raise exception 'Only an owner can grant administrator access'; end if;
  update public.firm_memberships set role=v_role,updated_at=now() where id=v_member.id returning * into v_member;
  perform private.record_audit_event(v_member.firm_id,'member.role_changed','firm_membership',v_member.id,jsonb_build_object('role',v_role));
  return jsonb_build_object('id',v_member.id,'role',v_member.role,'status',v_member.status);
end;
$$;

create or replace function public.disable_firm_membership(p_membership_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_member public.firm_memberships%rowtype;
begin
  select * into v_member from public.firm_memberships where id=p_membership_id for update;
  if not found or not private.can_administer_members(v_member.firm_id) then raise exception 'Member is unavailable'; end if;
  if v_member.role='owner' then raise exception 'Transfer ownership before disabling the owner'; end if;
  if v_member.user_id=auth.uid() then raise exception 'You cannot disable your own membership'; end if;
  if not private.is_firm_owner(v_member.firm_id) and v_member.role='admin' then raise exception 'Only an owner can disable an administrator'; end if;
  update public.firm_memberships set status='disabled',updated_at=now() where id=v_member.id returning * into v_member;
  perform private.record_audit_event(v_member.firm_id,'member.disabled','firm_membership',v_member.id,'{}'::jsonb);
  return jsonb_build_object('id',v_member.id,'status',v_member.status);
end;
$$;

create or replace function public.list_firm_access_directory(p_firm_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_members jsonb; v_invitations jsonb;
begin
  if not private.can_administer_members(p_firm_id) then raise exception 'You are not allowed to manage this firm'; end if;
  update public.firm_invitations set status='expired',updated_at=now() where firm_id=p_firm_id and status in ('pending','delivery_failed') and expires_at<=now();
  select coalesce(jsonb_agg(jsonb_build_object('id',m.id,'user_id',m.user_id,'email',u.email,'name',coalesce(nullif(u.raw_user_meta_data->>'full_name',''),split_part(u.email,'@',1)),'role',m.role,'status',m.status,'created_at',m.created_at) order by m.created_at), '[]'::jsonb)
    into v_members from public.firm_memberships m join auth.users u on u.id=m.user_id where m.firm_id=p_firm_id;
  select coalesce(jsonb_agg(jsonb_build_object('id',i.id,'email',i.email,'role',i.role,'status',i.status,'expires_at',i.expires_at,'sent_at',i.sent_at,'created_at',i.created_at) order by i.created_at desc), '[]'::jsonb)
    into v_invitations from public.firm_invitations i where i.firm_id=p_firm_id and i.status in ('pending','delivery_failed','expired');
  return jsonb_build_object('members',v_members,'invitations',v_invitations);
end;
$$;

revoke all on table public.firm_invitations, public.audit_events from public, anon, authenticated;
revoke all on function public.create_firm_invitation(uuid,text,text) from public, anon;
revoke all on function public.get_firm_invitation_delivery(uuid) from public, anon;
revoke all on function public.record_firm_invitation_delivery(uuid,boolean,text) from public, anon;
revoke all on function public.revoke_firm_invitation(uuid) from public, anon;
revoke all on function public.accept_firm_invitation(uuid) from public, anon;
revoke all on function public.set_firm_membership_role(uuid,text) from public, anon;
revoke all on function public.disable_firm_membership(uuid) from public, anon;
revoke all on function public.list_firm_access_directory(uuid) from public, anon;
grant execute on function public.create_firm_invitation(uuid,text,text) to authenticated;
grant execute on function public.get_firm_invitation_delivery(uuid) to authenticated;
grant execute on function public.record_firm_invitation_delivery(uuid,boolean,text) to authenticated;
grant execute on function public.revoke_firm_invitation(uuid) to authenticated;
grant execute on function public.accept_firm_invitation(uuid) to authenticated;
grant execute on function public.set_firm_membership_role(uuid,text) to authenticated;
grant execute on function public.disable_firm_membership(uuid) to authenticated;
grant execute on function public.list_firm_access_directory(uuid) to authenticated;
