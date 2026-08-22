import { cp, mkdir, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
// A dedicated directory avoids Cloudflare's restored build-output cache from
// ever carrying obsolete Pages-only files such as _redirects into a Worker build.
const outputDirectory = resolve(root, "cloudflare-dist");
const files = [
  "index.html",
  "app.js",
  "styles.css",
  "config.js",
  "supabase-client.js",
];
const directories = ["assets/fonts", "design/training"];
const optionalFiles = [
  "design/auth-hero-bg.png",
  "assets/brand/wispnow-logo.svg",
];

await rm(outputDirectory, { recursive: true, force: true });
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
    // Optional visual artwork: the UI has a CSS fallback.
  }
}

console.log(`Cloudflare static assets built in: ${outputDirectory}`);
