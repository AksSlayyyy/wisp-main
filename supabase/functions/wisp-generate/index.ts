import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://wisp-main.wynaai9.workers.dev",
  "http://localhost:8788",
  "http://127.0.0.1:8788",
]);
const cors = (origin: string | null) => origin && allowedOrigins.has(origin)
  ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" }
  : {};
const json = (body: unknown, status = 200, origin: string | null = null) =>
  Response.json(body, { status, headers: cors(origin) });

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.has(origin))
    return json({ error: "Origin not allowed" }, 403);
  if (request.method === "OPTIONS")
    return new Response(null, {
      headers: {
        ...cors(origin),
        "Access-Control-Allow-Headers": "authorization, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, 405, origin);
  const authorization = request.headers.get("Authorization");
  if (!authorization) return json({ error: "Unauthorized" }, 401, origin);
  try {
    const { projectId, idempotencyKey, renderPayload } = await request.json();
    if (!projectId || !idempotencyKey)
      return json({ error: "projectId and idempotencyKey are required" }, 400, origin);
    const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authorization } } });
    const { data, error } = await client.rpc("create_wisp_generation_job", {
      p_project_id: projectId,
      p_idempotency_key: idempotencyKey,
      p_render_payload: renderPayload || {},
    });
    if (error) return json({ error: error.message }, 403, origin);
    return json(data, 202, origin);
  } catch {
    return json({ error: "Invalid generation request" }, 400, origin);
  }
});
