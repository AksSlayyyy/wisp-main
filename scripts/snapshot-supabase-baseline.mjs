import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import pg from "pg";
import { STAGING_TARGET } from "./lib/deployment-target.mjs";

const { Client } = pg;
const args = new Set(process.argv.slice(2));
const writeIndex = process.argv.indexOf("--write");
const checkIndex = process.argv.indexOf("--check");
const outputPath = writeIndex >= 0 ? process.argv[writeIndex + 1] : "";
const checkPath = checkIndex >= 0 ? process.argv[checkIndex + 1] : "";

if (writeIndex >= 0 && !outputPath) throw new Error("--write requires a file path.");
if (checkIndex >= 0 && !checkPath) throw new Error("--check requires a file path.");
if (args.has("--write") && args.has("--check")) {
  throw new Error("Use either --write or --check, not both.");
}

const connectionString = process.env.SUPABASE_STAGING_DB_URL;
if (!connectionString) {
  throw new Error(
    "SUPABASE_STAGING_DB_URL is required. Use the staging Session Pooler connection string; do not commit it.",
  );
}

const queries = {
  migrations: `select version, name from supabase_migrations.schema_migrations order by version`,
  tables: `select schemaname, tablename, rowsecurity as rls_enabled from pg_tables where schemaname in ('public', 'storage') order by schemaname, tablename`,
  policies: `select schemaname, tablename, policyname, roles, cmd, qual, with_check from pg_policies where schemaname in ('public', 'storage') order by schemaname, tablename, policyname`,
  functions: `select n.nspname as schema, p.proname as name, pg_get_function_identity_arguments(p.oid) as arguments, p.prosecdef as security_definer, has_function_privilege('anon', p.oid, 'execute') as anon_execute, has_function_privilege('authenticated', p.oid, 'execute') as authenticated_execute from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname in ('public', 'private') and p.prokind = 'f' order by n.nspname, p.proname, pg_get_function_identity_arguments(p.oid)`,
  buckets: `select id, public, file_size_limit, allowed_mime_types from storage.buckets order by id`,
  triggers: `select event_object_table as table_name, trigger_name, action_statement from information_schema.triggers where trigger_schema = 'public' order by event_object_table, trigger_name`,
};

const client = new Client({ connectionString, ssl: { rejectUnauthorized: true } });
let sections;
try {
  await client.connect();
  sections = Object.fromEntries(
    await Promise.all(
      Object.entries(queries).map(async ([name, query]) => {
        const result = await client.query(query);
        return [name, result.rows];
      }),
    ),
  );
} finally {
  await client.end().catch(() => {});
}

const canonical = JSON.stringify(sections);
const fingerprint = createHash("sha256").update(canonical).digest("hex");
const snapshot = {
  format: 1,
  environment: "staging",
  project_ref: process.env.SUPABASE_PROJECT_REF || STAGING_TARGET.projectRef,
  captured_at: new Date().toISOString(),
  fingerprint,
  sections,
};

if (outputPath) {
  const target = resolve(process.cwd(), outputPath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  console.log(`Wrote metadata-only staging baseline: ${target}`);
} else if (checkPath) {
  const expected = JSON.parse(
    await readFile(resolve(process.cwd(), checkPath), "utf8"),
  );
  if (expected.fingerprint !== snapshot.fingerprint) {
    throw new Error(
      `Staging metadata drift detected. Expected ${expected.fingerprint}; received ${snapshot.fingerprint}. Run with --write only after reviewing the change.`,
    );
  }
  console.log(`Staging metadata fingerprint matches ${checkPath}.`);
} else {
  console.log(JSON.stringify(snapshot, null, 2));
}
