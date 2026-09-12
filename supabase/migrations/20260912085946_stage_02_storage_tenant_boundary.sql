-- Stage 2: private, firm-scoped object storage. New objects use immutable firm UUID paths.
create or replace function private.has_storage_read_access(target_bucket_id text, object_name text)
returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and (
    (target_bucket_id in ('documents', 'wisp-pdfs') and exists (
      select 1 from public.firm_memberships m
      where m.user_id = auth.uid() and m.status = 'active'
        and (
          m.firm_id::text = (storage.foldername(object_name))[1]
          -- Existing staging files retain their old slug path until a later migration copies them.
          or exists (select 1 from public.firms f where f.id = m.firm_id and f.slug = (storage.foldername(object_name))[1])
        )
    )) or
    (target_bucket_id = 'training-assets' and (storage.foldername(object_name))[1] = 'platform')
  );
$$;

create or replace function private.can_manage_storage_object(target_bucket_id text, object_name text)
returns boolean language sql stable security definer set search_path = '' as $$
  select target_bucket_id in ('documents', 'wisp-pdfs') and exists (
    select 1 from public.firm_memberships m
    where m.user_id = auth.uid() and m.status = 'active'
      and m.role in ('owner', 'admin', 'editor')
      and (
        m.firm_id::text = (storage.foldername(object_name))[1]
        or exists (select 1 from public.firms f where f.id = m.firm_id and f.slug = (storage.foldername(object_name))[1])
      )
  );
$$;

revoke all on function private.has_storage_read_access(text, text) from public;
revoke all on function private.can_manage_storage_object(text, text) from public;
grant execute on function private.has_storage_read_access(text, text), private.can_manage_storage_object(text, text) to authenticated;

-- Replace every legacy storage.objects policy, including anonymous build-stage policies.
do $$ declare r record; begin
  for r in select policyname from pg_policies where schemaname = 'storage' and tablename = 'objects' loop
    execute format('drop policy if exists %I on storage.objects', r.policyname);
  end loop;
end $$;

create policy "Authenticated members read private firm files" on storage.objects for select to authenticated
  using ((select private.has_storage_read_access(bucket_id, name)));
create policy "Firm managers write private firm files" on storage.objects for insert to authenticated
  with check ((select private.can_manage_storage_object(bucket_id, name)));
create policy "Firm managers update private firm files" on storage.objects for update to authenticated
  using ((select private.can_manage_storage_object(bucket_id, name)))
  with check ((select private.can_manage_storage_object(bucket_id, name)));
create policy "Firm managers delete private firm files" on storage.objects for delete to authenticated
  using ((select private.can_manage_storage_object(bucket_id, name)));

-- Every bucket is private. Training assets are readable only to authenticated members through the policy above.
update storage.buckets
set public = false,
    file_size_limit = case id when 'training-assets' then 10485760 else 26214400 end,
    allowed_mime_types = case id
      when 'wisp-pdfs' then array['application/pdf']::text[]
      when 'training-assets' then array['application/pdf']::text[]
      else array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','image/jpeg','image/png']::text[]
    end
where id in ('documents', 'wisp-pdfs', 'training-assets');
