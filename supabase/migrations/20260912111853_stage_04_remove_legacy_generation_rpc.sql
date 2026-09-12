-- The payload-aware RPC is the only supported enqueue path.
drop function if exists public.create_wisp_generation_job(uuid, text);
