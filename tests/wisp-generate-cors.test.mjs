import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("WISP generation accepts the deployed app's CORS preflight", async () => {
  const source = await readFile(
    new URL("../supabase/functions/wisp-generate/index.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /https:\/\/wisp-main\.wynaai9\.workers\.dev/);
  assert.match(source, /request\.method === "OPTIONS"/);
  assert.match(source, /Access-Control-Allow-Headers/);
  assert.match(source, /Access-Control-Allow-Methods/);
});
