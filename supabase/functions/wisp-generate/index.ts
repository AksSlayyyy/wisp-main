import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const authorization = request.headers.get("Authorization");
  if (!authorization) return new Response("Unauthorized", { status: 401 });
  try {
    const { projectId, idempotencyKey, renderPayload } = await request.json();
    if (!projectId || !idempotencyKey) return Response.json({ error: "projectId and idempotencyKey are required" }, { status: 400 });
    const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authorization } } });
    const { data, error } = await client.rpc("create_wisp_generation_job", {
      p_project_id: projectId,
      p_idempotency_key: idempotencyKey,
      p_render_payload: renderPayload || {},
    });
    if (error) return Response.json({ error: error.message }, { status: 403 });
    return Response.json(data, { status: 202 });
  } catch {
    return Response.json({ error: "Invalid generation request" }, { status: 400 });
  }
});
