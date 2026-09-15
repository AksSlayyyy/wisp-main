import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("secure acknowledgement downloads resolve the current WISP PDF", async () => {
  const source = await readFile(
    new URL("../supabase/functions/public-wisp-download/index.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /from\("wisp_generated_files"\)/);
  assert.match(source, /eq\("project_id", acknowledgement\.project_id\)/);
  assert.match(source, /order\("created_at", \{ ascending: false \}\)/);
  assert.match(source, /currentFile\?\.storage_path/);
});
