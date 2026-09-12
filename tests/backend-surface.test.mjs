import test from "node:test";
import assert from "node:assert/strict";
import { auditBackendSurface } from "../scripts/audit-backend-surface.mjs";

test("reports dynamic Supabase bindings that are absent from the client module", () => {
  const audit = auditBackendSurface(
    "saveThing = supabaseModule.saveThing || saveThing; missingThing = supabaseModule.missingThing || missingThing;",
    "export async function saveThing() {}",
  );

  assert.deepEqual(audit.bindings, ["missingThing", "saveThing"]);
  assert.deepEqual(audit.missing, ["missingThing"]);
  assert.equal(audit.fingerprint.length, 64);
});
