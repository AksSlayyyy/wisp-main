import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("backend health checks cannot silently target the production project", async () => {
  const source = await readFile(new URL("../scripts/verify-backend-health.mjs", import.meta.url), "utf8");

  assert.doesNotMatch(source, /thowcapchyevizbkcofs/);
  assert.match(source, /STAGING_TARGET\.apiUrl/);
  assert.match(source, /SUPABASE_ANON_KEY is required/);
});

test("release verification protects the staging artifact contract", async () => {
  const source = await readFile(new URL("../scripts/verify-release-readiness.mjs", import.meta.url), "utf8");

  assert.match(source, /assertStagingTarget/);
  assert.match(source, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(source, /settingsBillingUnavailableTab/);
});
