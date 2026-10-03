// All timer/startup/wake callers share one bounded drain per process.
// Database leases still coordinate distinct service instances.
export function createQueueDrainer(processOne, { enabled = () => true, batchSize = 2 } = {}) {
  if (!Number.isInteger(batchSize) || batchSize < 1) throw new Error('Invalid queue batch size');
  let draining = false;
  return async function drain() {
    if (!enabled()) return { processed: 0, enabled: false };
    if (draining) return { processed: 0, enabled: true, busy: true };
    // Acquire synchronously, before the first await/lease claim.
    draining = true;
    let processed = 0;
    try {
      while (processed < batchSize && await processOne()) processed += 1;
      return { processed, enabled: true };
    } finally {
      draining = false;
    }
  };
}
