import { createClient } from "@supabase/supabase-js";
import { STAGING_TARGET } from "./lib/deployment-target.mjs";

const supabaseUrl = process.env.SUPABASE_URL || STAGING_TARGET.apiUrl;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (supabaseUrl !== STAGING_TARGET.apiUrl) {
  throw new Error(`Backend health checks are staging-only. Received ${supabaseUrl}.`);
}
if (!anonKey) {
  throw new Error("SUPABASE_ANON_KEY is required; do not hard-code credentials in this script.");
}

const supabase = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
const checks = await Promise.all([
  supabase.from("firms").select("id", { count: "exact", head: true }),
  supabase.from("wisp_versions").select("id", { count: "exact", head: true }),
  supabase.from("firm_invitations").select("id", { count: "exact", head: true }),
]);

const errors = checks.map((result) => result.error).filter(Boolean);
if (errors.length) throw new Error(`Staging health check failed: ${errors.map((error) => error.message).join("; ")}`);

console.log("Staging anonymous health checks completed without exposing tenant records.");
