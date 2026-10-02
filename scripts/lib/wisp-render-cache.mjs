import { createHash } from 'node:crypto';

export const RENDER_CACHE_BUCKET = 'wisp-render-cache';
export function stableRenderJson(value) {
  if (Array.isArray(value)) return '[' + value.map(stableRenderJson).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().filter(key => value[key] !== undefined).map(key => JSON.stringify(key) + ':' + stableRenderJson(value[key])).join(',') + '}';
  return JSON.stringify(value) ?? 'null';
}
export const pdfDigest = bytes => createHash('sha256').update(bytes).digest('hex');

// Called only AFTER caller authorization or acquisition of a trusted DB job lease.
// Attachment bytes are reauthorized and hashed even on a cache hit. Never trust a
// browser cache ID, file hash, signed URL, or caller-supplied PDF bytes.
export async function prepareRenderIdentity({ payload, firmId, signatures = [], coverLogo = '', revision, readAttachment }) {
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(firmId || '')) throw new Error('Invalid render firm.');
  const rows = Array.isArray(payload.attachments) ? payload.attachments : [];
  if (rows.length > 30) throw new Error('Too many WISP attachments.');
  const files = [];
  let total = 0;
  for (const row of rows) {
    const storagePath = String(row?.storagePath || row?.storage_path || '');
    if (!storagePath.startsWith(`${firmId}/wisp/`) || storagePath.includes('..') || storagePath.includes('\\') || !storagePath.split('/').includes('attachments')) throw new Error('Invalid WISP attachment path.');
    const bytes = Buffer.from(await readAttachment(storagePath));
    total += bytes.length;
    if (bytes.length > 10 * 1024 * 1024 || total > 50 * 1024 * 1024) throw new Error('WISP attachments exceed the size limit.');
    if (!bytes.subarray(0, 1024).includes(Buffer.from('%PDF-'))) throw new Error('Invalid PDF attachment.');
    files.push({ storagePath, bytes, hash: pdfDigest(bytes) });
  }
  const { generatedAt, reviewPackageVersion, signatures: ignoredSignatures, ...content } = payload;
  const fingerprint = pdfDigest(stableRenderJson({ revision, firmId, content: { ...content, firmId }, signatures, coverLogo, files: files.map(({ storagePath, hash }) => ({ storagePath, hash })) }));
  return { fingerprint, path: `${firmId}/${fingerprint}.pdf`, files };
}

export async function reuseOrRenderPdf({ identity, readCache, writeCache, render, enabled = true }) {
  if (enabled) {
    const cached = await readCache(identity.path);
    if (cached) {
      const bytes = Buffer.from(cached);
      if (bytes.length && bytes.subarray(0, 1024).includes(Buffer.from('%PDF-'))) return { bytes, reused: true };
      throw new Error('The stored reviewed PDF is invalid.');
    }
  }
  let bytes = Buffer.from(await render(identity.files));
  if (!bytes.length || !bytes.subarray(0, 1024).includes(Buffer.from('%PDF-'))) throw new Error('The renderer did not return a PDF.');
  if (enabled) bytes = Buffer.from(await writeCache(identity.path, bytes) || bytes);
  return { bytes, reused: false };
}
