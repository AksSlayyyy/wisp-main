import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("a WISP signature queues a server-side signed PDF render", async () => {
  const [client, app, renderer, migration] = await Promise.all([
    readFile(new URL("../supabase-client.js", import.meta.url), "utf8"),
    readFile(new URL("../app.js", import.meta.url), "utf8"),
    readFile(new URL("../scripts/wisp_merge_service.mjs", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260915113000_signed_wisp_pdf_renders.sql", import.meta.url), "utf8"),
  ]);

  assert.match(client, /queueWispSignedRender\(project\.id\)/);
  assert.match(client, /rpc\("queue_wisp_signed_render"/);
  assert.match(app, /waitForSignedWispRender/);
  assert.match(renderer, /fetchVersionSignatures\(job\.version_id\)/);
  assert.match(renderer, /-signed-\$\{String\(jobId\)\.slice\(0, 8\)\}/);
  assert.match(renderer, /signature\?\.signer_name \|\| block\?\.name/);
  assert.match(migration, /create or replace function public\.queue_wisp_signed_render/);
  assert.match(migration, /and state = 'queued'/);
});
