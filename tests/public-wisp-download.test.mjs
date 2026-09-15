import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("secure acknowledgement downloads resolve the current WISP PDF", async () => {
  const [source, migration] = await Promise.all([
    readFile(new URL("../supabase/functions/public-wisp-download/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../supabase/migrations/20260915133000_acknowledgement_pdf_project_reference.sql", import.meta.url), "utf8"),
  ]);

  assert.match(source, /from\("wisp_generated_files"\)/);
  assert.match(source, /eq\("project_id", acknowledgement\.project_id\)/);
  assert.match(source, /order\("created_at", \{ ascending: false \}\)/);
  assert.match(source, /currentFile\?\.storage_path/);
  assert.match(migration, /'project_id', v_request\.project_id/);
});
