import { cp, mkdir, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

const root = process.cwd();
// A dedicated directory avoids Cloudflare's restored build-output cache from
// ever carrying obsolete Pages-only files such as _redirects into a Worker build.
const outputDirectory = resolve(root, "cloudflare-dist");
const files = [
  "index.html",
  "app.js",
  "styles.css",
  "config.js",
];
const directories = ["assets/fonts", "design/training"];
const optionalFiles = [
  "design/auth-hero-bg.png",
  "assets/brand/wispnow-logo-cropped.png",
  "assets/brand/wispnow-logo-sidebar-cropped.png",
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

// Compile the complete browser client and its pinned SDK into a compatibility
// bundle. Serving this source file raw previously caused some browser paths to
// reject syntax before authentication could initialise.
await build({
  entryPoints: [resolve(root, "supabase-client.js")],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2017"],
  outfile: resolve(outputDirectory, "supabase-client.js"),
  logLevel: "warning",
});

console.log(`Cloudflare static assets built in: ${outputDirectory}`);
