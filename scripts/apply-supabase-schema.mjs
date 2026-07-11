import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const sqlPath = path.join(root, "supabase", "migrations", "20260624_initial_schema.sql");
const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error("Missing SUPABASE_DB_URL environment variable.");
  process.exit(1);
}

const sql = await fs.readFile(sqlPath, "utf8");
const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  await client.query(sql);
  console.log("Supabase schema applied successfully.");
} finally {
  await client.end().catch(() => {});
}
