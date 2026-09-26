// Vendored assets, not a runtime CDN dependency. Keep upstream licenses with fonts.
import { mkdir, writeFile } from 'node:fs/promises';
import '../wisp-appearance.js';
const target = new URL('../assets/fonts/wisp/', import.meta.url);
await mkdir(target, { recursive: true });
const manifest = {};
for (const [id] of globalThis.WispAppearance.fonts) {
  const metadata = await fetch(`https://registry.npmjs.org/@fontsource/${id}/latest`).then(r => { if (!r.ok) throw new Error(id); return r.json(); });
  manifest[id] = metadata.version;
  for (const weight of [400, 700]) {
    const response = await fetch(`https://cdn.jsdelivr.net/npm/@fontsource/${id}@${metadata.version}/files/${id}-latin-${weight}-normal.woff2`);
    if (!response.ok) throw new Error(`${id} ${weight}: ${response.status}`);
    await writeFile(new URL(`${id}-${weight}.woff2`, target), Buffer.from(await response.arrayBuffer()));
  }
  const license = await fetch(`https://cdn.jsdelivr.net/npm/@fontsource/${id}@${metadata.version}/LICENSE`);
  if (!license.ok) throw new Error(`Missing license: ${id}`);
  await writeFile(new URL(`${id}-LICENSE.txt`, target), await license.text());
  console.log(`Vendored ${id} ${metadata.version}`);
}
await writeFile(new URL('versions.json', target), JSON.stringify(manifest, null, 2));
