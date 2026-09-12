-- PostgreSQL defaults EXECUTE to PUBLIC. Revoke from PUBLIC and concrete API
-- roles so only the intended caller path can invoke each SECURITY DEFINER RPC.
revoke all on function public.create_wisp_generation_job(uuid, text, jsonb) from public, anon, authenticated;
revoke all on function public.claim_wisp_generation_job() from public, anon, authenticated;
revoke all on function public.complete_wisp_generation_job(uuid, uuid, text, text, text, bigint) from public, anon, authenticated;
revoke all on function public.fail_wisp_generation_job(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.sign_wisp_version(uuid, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.activate_wisp_version(uuid) from public, anon, authenticated;

-- The browser now uses activate_wisp_version. Remove the legacy activation
-- route so it cannot bypass immutable-version signature checks.
revoke all on function public.activate_wisp_project(uuid) from public, anon, authenticated;

grant execute on function public.create_wisp_generation_job(uuid, text, jsonb) to authenticated;
grant execute on function public.sign_wisp_version(uuid, text, text, text, text, text) to authenticated;
grant execute on function public.activate_wisp_version(uuid) to authenticated;
grant execute on function public.claim_wisp_generation_job() to service_role;
grant execute on function public.complete_wisp_generation_job(uuid, uuid, text, text, text, bigint) to service_role;
grant execute on function public.fail_wisp_generation_job(uuid, uuid, text) to service_role;
