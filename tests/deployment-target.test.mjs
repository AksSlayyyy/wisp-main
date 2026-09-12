import test from "node:test";
import assert from "node:assert/strict";
import {
  STAGING_TARGET,
  assertStagingTarget,
  readWindowEnvironment,
} from "../scripts/lib/deployment-target.mjs";

test("reads the public runtime environment without executing config.js", () => {
  const environment = readWindowEnvironment(`
    window.__ENV__ = {
      SUPABASE_URL: "${STAGING_TARGET.apiUrl}",
      SUPABASE_ANON_KEY: "sb_publishable_test",
      WISP_RENDERER_URL: "${STAGING_TARGET.rendererOrigin}",
    };
  `);

  assert.deepEqual(environment, {
    supabaseUrl: STAGING_TARGET.apiUrl,
    publishableKey: "sb_publishable_test",
    rendererUrl: STAGING_TARGET.rendererOrigin,
  });
});

test("rejects a non-staging Supabase URL", () => {
  const errors = assertStagingTarget({
    supabaseUrl: "https://thowcapchyevizbkcofs.supabase.co",
    publishableKey: "sb_publishable_test",
    rendererUrl: STAGING_TARGET.rendererOrigin,
  });

  assert.equal(errors.length, 1);
  assert.match(errors[0], /SUPABASE_URL/);
});
