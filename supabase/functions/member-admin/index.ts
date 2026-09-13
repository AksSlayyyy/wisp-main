import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://wisp-main.wynaai9.workers.dev",
  "http://localhost:8788",
  "http://127.0.0.1:8788",
]);
const cors = (origin: string | null) => origin && allowedOrigins.has(origin)
  ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" }
  : {};
const json = (body: unknown, status = 200, origin: string | null = null) => Response.json(body, { status, headers: cors(origin) });

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.has(origin)) return json({ error: "Origin not allowed" }, 403);
  if (request.method === "OPTIONS") return new Response(null, { headers: { ...cors(origin), "Access-Control-Allow-Headers": "authorization, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" } });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);
  const authorization = request.headers.get("Authorization");
  if (!authorization) return json({ error: "Unauthorized" }, 401, origin);

  try {
    const body = await request.json();
    const action = String(body?.action || "");
    const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authorization } } });
    const { data: identity, error: identityError } = await userClient.auth.getUser();
    if (identityError || !identity.user) return json({ error: "Unauthorized" }, 401, origin);
    if (!["invite", "resend"].includes(action)) return json({ error: "Unsupported action" }, 400, origin);

    const delivery = action === "invite"
      ? await userClient.rpc("create_firm_invitation", { p_firm_id: body.firmId, p_email: body.email, p_role: body.role })
      : await userClient.rpc("get_firm_invitation_delivery", { p_invitation_id: body.invitationId });
    if (delivery.error) return json({ error: delivery.error.message }, 403, origin);

    const invitation = delivery.data;
    if (!origin || !allowedOrigins.has(origin)) return json({ error: "Origin not allowed" }, 403, origin);
    const inviteLink = `${origin}/?invite=${encodeURIComponent(invitation.id)}`;
    const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(invitation.email, {
      redirectTo: inviteLink,
      data: { easywisp_invitation_id: invitation.id },
    });

    const delivered = !inviteError;
    await userClient.rpc("record_firm_invitation_delivery", {
      p_invitation_id: invitation.id,
      p_success: delivered,
      p_provider_message: inviteError?.message || null,
    });

    // Existing users cannot receive an Auth invitation email. The returned link
    // is still safe: acceptance additionally requires a verified login matching
    // the invitation's email address.
    if (inviteError && /already|registered|exists/i.test(inviteError.message)) {
      return json({ id: invitation.id, status: "existing_account", inviteLink }, 200, origin);
    }
    if (inviteError) return json({ error: "The invitation could not be delivered. Check SMTP delivery settings and retry." }, 502, origin);
    return json({ id: invitation.id, status: "sent", inviteLink }, 200, origin);
  } catch {
    return json({ error: "Invalid member administration request" }, 400, origin);
  }
});
