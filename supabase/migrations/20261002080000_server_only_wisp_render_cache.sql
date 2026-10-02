-- Reviewed artifacts are server-authored, private, and never customer writable.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('wisp-render-cache', 'wisp-render-cache', false, 52428800, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 52428800, allowed_mime_types = array['application/pdf'];

create policy "WISP render cache is server only" on storage.objects
as restrictive for all to anon, authenticated
using (bucket_id <> 'wisp-render-cache')
with check (bucket_id <> 'wisp-render-cache');
