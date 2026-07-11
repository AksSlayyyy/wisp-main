import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const migrationName = process.argv[2] || "20260708140425_training_asset_catalog_metadata.sql";
const sqlPath = path.join(root, "supabase", "migrations", migrationName);
const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error("Missing SUPABASE_DB_URL environment variable.");
  console.error("Set it via: $env:SUPABASE_DB_URL='postgresql://...'");
  process.exit(1);
}

console.log(`Applying migration: ${migrationName}`);

const sql = await fs.readFile(sqlPath, "utf8");
const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Connected to Supabase database.");
  await client.query(sql);
  console.log("Migration applied successfully.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}