import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import '../wisp-appearance.js';

const source = readFileSync(new URL('../scripts/wisp_merge_service.mjs', import.meta.url), 'utf8');
const render = vm.runInNewContext(source.slice(source.indexOf('function buildDownloadPreviewHtml('), source.indexOf('function runMerge(')) + '\nbuildDownloadPreviewHtml', {
  WispAppearance: globalThis.WispAppearance, readFileSync, path, ROOT: process.cwd(), SIGNATURE_FONT_DATA_URLS: {},
  escapeHtml: value => String(value || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;'),
});
const preview = { pages: [
  { isCover: true, blocks: [{ kind: 'cover-firm', text: 'Example Firm' }] },
  { title: 'Policy', blocks: [{ kind: 'paragraph', text: 'Final policy content.' }] },
  { title: 'Signatures', blocks: [{ kind: 'signature-section', name: 'Synthetic signer', title: 'Data Security Coordinator' }] },
] };

test('one centered Attachments divider follows signatures only when files are attached', () => {
  assert.doesNotMatch(render(preview), /aria-label="Attachments"/);
  assert.doesNotMatch(render(preview, [], '', null, []), /aria-label="Attachments"/);
  const html = render(preview, [], '', null, [{ storagePath: 'first.pdf' }, { storagePath: 'second.pdf' }]);
  assert.equal((html.match(/aria-label="Attachments"/g) || []).length, 1);
  assert.ok(html.indexOf('Synthetic signer') < html.indexOf('aria-label="Attachments"'));
  assert.match(html, /<h1 class="export-docx-heading">Attachments<\/h1>/);
  assert.match(html, /top: 50%; left: 0; width: 100%/);
  assert.match(html, /height: 792pt/);
});

test('divider uses the saved document typography and bar colors', () => {
  const html = render(preview, [], '', { headingFont: 'lora', headingColor: '#234567', topBarColor: '#008877', bottomBarColor: '#776655' }, [{ storagePath: 'first.pdf' }]);
  assert.match(html, /"Wisp-lora"/);
  assert.match(html, /color:\s*#234567/);
  assert.match(html, /background: #008877/);
  assert.match(html, /background: #776655/);
});

test('divider inherits the actual document heading style for every font, including legacy PDFs', () => {
  for (const appearance of [null, ...globalThis.WispAppearance.fonts.map(([headingFont]) => ({ headingFont }))]) {
    const html = render(preview, [], '', appearance, [{ storagePath: 'first.pdf' }]);
    assert.match(html, /<h1 class="export-docx-heading">Attachments<\/h1>/);
    const dividerRule = html.match(/\.export-attachments-divider h1 \{([^}]+)\}/)?.[1] || '';
    assert.doesNotMatch(dividerRule, /font-family|font-weight|font-style|\bcolor\s*:/, 'Divider must not override document heading typography');
    assert.match(dividerRule, /text-decoration: none/, 'Centered divider has no section underline');
  }
});

test('preview and queued final rendering both forward the attachment list', () => {
  assert.match(source, /renderPdfBuffer\(officialPreview\.preview, officialPreview\.tempDir,[^\n]+payload\?\.attachments\)/);
  assert.match(source, /renderPdfBuffer\(preview, result\.tempDir, result\.slug,[^\n]+payload\?\.attachments\)/);
  assert.match(source, /buildDownloadPreviewHtml\(preview, signatures, coverLogo, appearance, attachments\)/);
});
