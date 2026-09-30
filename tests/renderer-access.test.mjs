import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('both direct render routes check caller firm permission before rendering', () => {
  const source = readFileSync(new URL('../scripts/wisp_merge_service.mjs', import.meta.url), 'utf8');
  assert.equal((source.match(/await canRenderWispForFirm\(principal, payload\.firmId\)/g) || []).length, 2);
  assert.match(source, /user_id: `eq\.\$\{principal\.id\}`/);
  assert.match(source, /Authorization: principal\.authorization/);
  assert.match(source, /status: 'eq\.active'/);
  assert.match(source, /typeof saved\.wisp_builder === 'boolean'/);
  const auth = source.slice(source.indexOf('async function authenticateRequest'), source.indexOf('async function canRenderWispForFirm'));
  assert.doesNotMatch(auth, /workerToken/);
});
