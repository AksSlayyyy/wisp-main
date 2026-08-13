import { cp, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const root = process.cwd();
const outputDirectory = resolve(root, "dist");
const outputArchive = resolve(root, "easywisp-cloudflare-pages.zip");
await rm(outputArchive, { force: true });
execFileSync(process.execPath, ["scripts/build-cloudflare-static.mjs"], { stdio: "inherit" });

execFileSync(
  "tar",
  ["-a", "-c", "-f", outputArchive, "-C", outputDirectory, "."],
  { stdio: "inherit" },
);

console.log(`Cloudflare Pages upload ZIP created: ${outputArchive}`);
