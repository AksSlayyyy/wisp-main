# Stage 1 — Baseline and Safe Test Harness

**Status:** implemented locally on 2026-09-12. No staging schema, data, storage object, Edge Function, or production branch was changed.

## Purpose

Stage 1 makes every later production-readiness change measurable and harder to send to the wrong environment. It does not fix the known security or persistence defects; those are deliberately assigned to later stages.

## What changed

| Deliverable | Why it exists | What it does |
| --- | --- | --- |
| `scripts/lib/deployment-target.mjs` | Prevent accidental main-project work. | Defines the only approved Stage 1 target: staging ref `eugsdqwimpocfibmjfxa`, its API URL, and staging renderer origin. It parses `config.js` without executing browser code. |
| `scripts/verify-deployment-target.mjs` | Make target selection repeatable. | Fails if `config.js` is not pointed exactly at staging, uses a non-publishable browser key, or points at a different renderer. |
| `tests/*.test.mjs` | Protect the guardrail itself. | Tests staging parsing/rejection and the backend-surface audit logic. |
| `scripts/audit-backend-surface.mjs` | Detect false-success frontend fallbacks. | Compares every `supabaseModule.x || fallback` binding in `app.js` with real exports in `supabase-client.js`. |
| `docs/baselines/backend-surface.json` | Do not hide already-known defects. | Records the 14 known missing backend bindings. The audit fails only if a *new* missing binding appears; a resolved binding is reported so the baseline can be intentionally updated in Stage 3. |
| `scripts/snapshot-supabase-baseline.mjs` | Capture a schema/policy baseline before DB work. | With a staging-only session-pooler connection string supplied securely via `SUPABASE_STAGING_DB_URL`, reads metadata only and writes/checks hashes for migrations, RLS, policies, functions/grants, buckets, and triggers. It never reads application rows. |
| `scripts/replay-local-supabase.mjs` | Make migration replay deliberate. | Is dry-run by default. A local reset requires both `--apply` and `--confirm-local-reset`; it starts local Postgres only, then runs `supabase ... --local` commands. |
| `docs/testing/staging-fixtures.md` | Prevent tests from touching customer data. | Defines an isolated fixture naming and cleanup contract. It creates no users or test data because a dedicated test mailbox/service setup has not been approved. |

## Current measured backend gap

The audit fingerprint is `6ee97ba677f077a6e16b65a752590b78418846360b3b0170dbbfa9dd3d77a614`.

The known missing bindings are the six special-document PDF exports, seven special-document persistence/save paths, and `flushDocumentWorkspacesKeepalive`. In practical terms, those flows can currently fall back to client behavior rather than proving that a durable Supabase write occurred. Stage 3 will replace these with real tenant-scoped persistence and tests.

## Verification performed

These passed on this checkout:

```powershell
npm test
npm run check:staging-target
npm run audit:backend-surface
npm run replay:local-supabase
npm run build:staging
```

Results:

- 3 automated tests passed.
- The frontend was verified as targeting staging ref `eugsdqwimpocfibmjfxa`.
- The backend-surface audit found no *new* missing binding beyond the 14 deliberately recorded gaps.
- Local replay stayed a dry-run.
- The staging static build completed in `cloudflare-dist`.

## What is not complete yet

1. **Remote metadata snapshot:** captured through authenticated Supabase staging MCP and recorded in `docs/baselines/staging-supabase-metadata.json`. The optional direct-connection script remains ready, but this Windows/Node runtime rejects the Session Pooler's certificate chain with `SELF_SIGNED_CERT_IN_CHAIN`; TLS validation was not bypassed.
2. **Local replay:** completed successfully on 2026-09-12. All 31 local migrations are present after a clean local reset. Windows reserved the default Supabase port range, so local API/database/Studio ports use `55431`/`55432`/`55433`; the harness starts Postgres only because schema replay does not need optional local services.
3. **Fixture users:** no dedicated testing identities or mailbox have been provisioned. That is intentional: tests must not reuse a real customer/admin account.

## How to verify it yourself

From `G:\WISP`:

```powershell
npm run verify:stage-1
npm run build:staging
```

To capture the staging metadata baseline, set `SUPABASE_STAGING_DB_URL` only in your local secure environment to the **staging branch's Session pooler** connection string, then run:

```powershell
npm run snapshot:staging-baseline -- --write docs/baselines/staging-supabase.json
npm run snapshot:staging-baseline -- --check docs/baselines/staging-supabase.json
```

The generated JSON contains metadata and hashes, not customer records or credentials. Do not commit a connection string.

On this Windows machine, use the committed MCP-derived metadata baseline above until the local Node certificate-chain issue is resolved; do not weaken TLS verification to force the direct script through.

To validate migrations locally after Docker Desktop is running:

```powershell
npm run replay:local-supabase
npm run replay:local-supabase:apply
```

The second command resets **only the local Supabase stack**. It does not act on staging or main.

## Next stage

Proceed to **Stage 2 — tenant and storage boundary**: remove anonymous storage-object access, use immutable firm identifiers for object paths, enforce manager/editor write roles, add file size/MIME allow-lists, and prove all of that using isolated fixtures.
