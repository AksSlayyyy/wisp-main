import assert from 'node:assert/strict';
import test from 'node:test';
import { createQueueDrainer } from '../scripts/lib/wisp-queue-drainer.mjs';

test('overlapping timer/wake calls do not claim additional jobs', async () => {
  let unblock, calls = 0, active = 0, peak = 0;
  const held = new Promise(resolve => { unblock = resolve; });
  const drain = createQueueDrainer(async () => {
    calls++; active++; peak = Math.max(peak, active);
    await held; active--; return true;
  });
  const first = drain();
  const overlaps = await Promise.all(Array.from({ length: 20 }, () => drain()));
  assert.ok(overlaps.every(result => result.busy && result.processed === 0));
  assert.equal(calls, 1);
  unblock();
  assert.deepEqual(await first, { processed: 2, enabled: true });
  assert.equal(peak, 1);
  assert.equal(calls, 2);
  await drain();
  assert.equal(calls, 4, 'subsequent tick can process the next bounded batch');
});

test('gate releases after claim errors and empty queues', async () => {
  let fails = true, calls = 0;
  const drain = createQueueDrainer(async () => {
    calls++; if (fails) throw new Error('RPC unavailable'); return false;
  });
  await assert.rejects(drain(), /RPC unavailable/);
  fails = false;
  assert.deepEqual(await drain(), { processed: 0, enabled: true });
  assert.equal(calls, 2);
});

test('disabled workers never claim; invalid batch configuration fails', async () => {
  const drain = createQueueDrainer(() => { throw new Error('must not claim'); }, { enabled: () => false });
  assert.deepEqual(await drain(), { processed: 0, enabled: false });
  assert.throws(() => createQueueDrainer(() => true, { batchSize: 0 }), /Invalid/);
});
