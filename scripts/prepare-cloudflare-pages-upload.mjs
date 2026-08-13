import { cp, mkdir, rm, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const root = process.cwd();
const outputDirectory = resolve(root, "tmp", "cloudflare-pages-upload");
const outputArchive = resolve(root, "easywisp-cloudflare-pages.zip");

const files = [
  "index.html",
  "app.js",
  "styles.css",
  "config.js",
  "supabase-client.js",
  "_redirects",
];
const directories = ["assets/fonts", "design/training"];
const optionalFiles = ["design/auth-hero-bg.png"];

await rm(outputDirectory, { recursive: true, force: true });
await rm(outputArchive, { force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of files) {
  await cp(resolve(root, file), resolve(outputDirectory, file));
}
for (const directory of directories) {
  await cp(resolve(root, directory), resolve(outputDirectory, directory), {
    recursive: true,
  });
}
for (const file of optionalFiles) {
  try {
    await stat(resolve(root, file));
    await cp(resolve(root, file), resolve(outputDirectory, file));
  } catch {
    // The app still renders a gradient if this optional artwork is absent.
  }
}

execFileSync(
  "tar",
  ["-a", "-c", "-f", outputArchive, "-C", outputDirectory, "."],
  { stdio: "inherit" },
);

console.log(`Cloudflare Pages upload ZIP created: ${outputArchive}`);
