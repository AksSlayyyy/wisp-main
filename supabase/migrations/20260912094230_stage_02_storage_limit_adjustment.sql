-- Stage 2 operational adjustment: retain abuse protection while supporting large compliance scans.
update storage.buckets
set file_size_limit = case id
  when 'documents' then 104857600 -- 100 MB
  when 'wisp-pdfs' then 52428800 -- 50 MB
  when 'training-assets' then 52428800 -- 50 MB
end
where id in ('documents', 'wisp-pdfs', 'training-assets');
