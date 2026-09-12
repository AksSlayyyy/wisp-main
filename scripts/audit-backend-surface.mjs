import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

function uniqueSorted(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export function findSupabaseModuleBindings(appSource) {
  return uniqueSorted(
    [...appSource.matchAll(/supabaseModule\.([A-Za-z0-9_]+)\s*\|\|/g)].map(
      (match) => match[1],
    ),
  );
}

export function findSupabaseClientExports(clientSource) {
  return uniqueSorted(
    [
      ...clientSource.matchAll(
        /export\s+(?:(?:async\s+)?function|const|let)\s+([A-Za-z0-9_]+)/g,
      ),
    ].map((match) => match[1]),
  );
}

export function auditBackendSurface(appSource, clientSource) {
  const bindings = findSupabaseModuleBindings(appSource);
  const exports = findSupabaseClientExports(clientSource);
  const exportSet = new Set(exports);
  const missing = bindings.filter((binding) => !exportSet.has(binding));
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({ bindings, exports, missing }))
    .digest("hex");

  return { bindings, exports, missing, fingerprint };
}

async function main() {
  const args = process.argv.slice(2);
  const baselineIndex = args.indexOf("--baseline");
  const baselinePath = baselineIndex === -1 ? null : args[baselineIndex + 1];
  if (baselineIndex !== -1 && !baselinePath) {
    throw new Error("--baseline requires a file path");
  }

  const root = process.cwd();
  const [appSource, clientSource] = await Promise.all([
    readFile(resolve(root, "app.js"), "utf8"),
    readFile(resolve(root, "supabase-client.js"), "utf8"),
  ]);
  const audit = auditBackendSurface(appSource, clientSource);

  if (!baselinePath) {
    console.log(JSON.stringify(audit, null, 2));
    process.exitCode = audit.missing.length ? 1 : 0;
    return;
  }

  const baseline = JSON.parse(await readFile(resolve(baselinePath), "utf8"));
  const knownMissing = new Set(baseline.knownMissingBindings ?? []);
  const missingSet = new Set(audit.missing);
  const unexpectedMissing = audit.missing.filter((name) => !knownMissing.has(name));
  const resolvedKnownMissing = [...knownMissing].filter((name) => !missingSet.has(name));

  console.log(
    JSON.stringify(
      { ...audit, baseline: resolve(baselinePath), unexpectedMissing, resolvedKnownMissing },
      null,
      2,
    ),
  );
  process.exitCode = unexpectedMissing.length ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
