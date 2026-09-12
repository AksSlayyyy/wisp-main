import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (request) => {
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "authorization, apikey, content-type" };
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
  try {
    const { requestId, token } = await request.json();
    if (!requestId || !token) throw new Error("Missing acknowledgement link credentials");
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: acknowledgement, error } = await admin.rpc("get_wisp_acknowledgement_request", { p_request_id: requestId, p_token: token });
    if (error || !acknowledgement) throw new Error("This acknowledgement link is unavailable");
    const snapshot = acknowledgement.wisp_snapshot ?? {};
    const path = acknowledgement.wisp_pdf_storage_path ?? snapshot.finalPdfStoragePath ?? snapshot.final_pdf_storage_path;
    if (!path) throw new Error("Finalized WISP PDF unavailable");
    const { data, error: signedError } = await admin.storage.from("wisp-pdfs").createSignedUrl(path, 300);
    if (signedError || !data?.signedUrl) throw new Error("Finalized WISP PDF unavailable");
    return Response.json({ signedUrl: data.signedUrl }, { headers: cors });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to load document" }, { status: 403, headers: cors });
  }
});
