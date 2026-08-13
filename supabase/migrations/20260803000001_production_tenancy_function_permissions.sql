-- RLS policies invoke these helpers in the caller context. They stay in the
-- private schema, but authenticated application requests need execute access.
grant usage on schema private to authenticated;
grant execute on function private.has_firm_access(uuid) to authenticated;
grant execute on function private.can_manage_firm(uuid) to authenticated;
grant execute on function private.has_storage_access(text, text) to authenticated;
