import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { assertStagingTarget, readProjectWindowEnvironment } from "./lib/deployment-target.mjs";

const root = process.cwd();
const read = (path) => readFile(resolve(root, path), "utf8");
const [app, config, index, client] = await Promise.all([
  read("app.js"), read("config.js"), read("index.html"), read("supabase-client.js"),
]);
const errors = [...assertStagingTarget(await readProjectWindowEnvironment(resolve(root, "config.js")))];
const forbiddenBrowserPatterns = [
  [/SUPABASE_SERVICE_ROLE_KEY/, "service-role credential reference appears in browser source"],
];
for (const [pattern, description] of forbiddenBrowserPatterns) {
  if (pattern.test(`${app}\n${client}`)) errors.push(description);
}
if (!app.includes("import(\"./supabase-client.js")) errors.push("app.js does not load the bundled Supabase client.");
if (!config.includes("ENABLE_PRODUCTION_AUTH: true")) errors.push("staging auth is not enabled in public runtime config.");
if (!app.includes("settingsBillingUnavailableTab()")) errors.push("billing controls are not explicitly disabled pending provider integration.");
for (const file of ["cloudflare-dist/index.html", "cloudflare-dist/app.js", "cloudflare-dist/supabase-client.js", "cloudflare-dist/assets/brand/wispnow-logo-cropped.png", "cloudflare-dist/assets/brand/wispnow-logo-sidebar-cropped.png"]) {
  try { await access(resolve(root, file)); } catch { errors.push(`missing deploy artifact: ${file}`); }
}
if (errors.length) throw new Error(`Release readiness failed:\n- ${errors.join("\n- ")}`);
console.log("Release readiness checks passed for the staging artifact.");
