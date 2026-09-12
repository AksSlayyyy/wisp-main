import { spawnSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const confirmed = args.has("--confirm-local-reset");
const commands = [
  [
    "supabase",
    [
      "start",
      "--exclude",
      "edge-runtime,gotrue,imgproxy,kong,logflare,mailpit,postgres-meta,postgrest,realtime,storage-api,studio,supavisor,vector",
    ],
  ],
  ["supabase", ["db", "reset", "--local"]],
  ["supabase", ["migration", "list", "--local"]],
];

if (!apply) {
  console.log("Local replay dry run. The following commands would run only against the local Supabase stack:");
  for (const [command, commandArgs] of commands) {
    console.log(`  ${command} ${commandArgs.join(" ")}`);
  }
  console.log("Run with --apply --confirm-local-reset after Docker is available.");
  process.exit(0);
}

if (!confirmed) {
  throw new Error(
    "Local replay resets the local database. Re-run with --apply --confirm-local-reset to continue.",
  );
}

for (const [command, commandArgs] of commands) {
  const windows = process.platform === "win32";
  const executable = windows ? process.env.ComSpec ?? "cmd.exe" : command;
  const executableArgs = windows
    ? ["/d", "/s", "/c", [command, ...commandArgs].join(" ")]
    : commandArgs;
  const result = spawnSync(executable, executableArgs, {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
