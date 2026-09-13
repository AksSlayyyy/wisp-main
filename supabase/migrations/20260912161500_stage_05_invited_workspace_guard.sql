-- Do not let an invited account bypass the invitation flow by using the
-- historical self-provisioning fallback before accepting its invitation.
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
