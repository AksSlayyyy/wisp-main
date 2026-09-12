# Stage 4 — Versioned WISP Foundation

**Status:** database and queue-worker implementation deployed to staging on 2026-09-12. The browser cutover is intentionally held until the staging Render service receives the new source and server-only worker credentials.

## Implemented

- Added immutable `wisp_versions` records with firm/project ownership, sequential version number, source revision, canonical snapshot, SHA-256 content hash, lifecycle state, and server timestamps.
- Added durable `wisp_generation_jobs` with firm-scoped idempotency keys, request hashes, attempts, lease tokens, expiry, status, and failure fields.
- Added append-only `wisp_version_signatures`, bound to one immutable version, an authenticated user, a reserved signatory role, consent text, and server timestamp.
- Extended generated-file metadata with version ID, content hash, and size.
- Added security-definer RPCs:
  - `create_wisp_generation_job` creates an immutable snapshot and a durable idempotent job after manager authorization.
  - `claim_wisp_generation_job` grants a time-bounded worker lease.
  - `complete_wisp_generation_job` accepts only a valid lease plus a non-empty SHA-256-identified artifact before marking a version ready.
  - `sign_wisp_version` records an append-only, version-bound consent/signature.
- Added authenticated `wisp-generate` Edge Function on staging. It accepts a JWT, project ID, and idempotency key, then invokes the authorized job-creation RPC and returns `202`.
- The immutable job snapshot now includes a bounded render payload (max 4 MB). Signatures are stripped before it is stored, so a future signature cannot silently alter the approved version’s generation input.
- Added lease expiry recovery and a bounded three-attempt failure policy. A stale worker cannot complete a job after its lease expires.
- Added a renderer worker implementation: it claims work using the service role, renders the immutable payload, SHA-256 hashes the PDF, uploads it to private storage, and completes the lease-bound job. It processes at most two jobs per poll and is safe across replicas because the database owns leasing.
- Hardened renderer source defaults: authentication is required unless explicitly disabled for a local demo; a dedicated `WISP_RENDERER_WORKER_TOKEN` protects internal worker triggering.

## Verification

- The complete local migration chain replayed successfully, including both Stage 4 migrations.
- `npm test` passed (3/3) and `npm run build:staging` passed against staging ref `eugsdqwimpocfibmjfxa`.
- Staging migrations `stage_04_versioned_wisp_foundation`, `stage_04_generation_payload_and_lifecycle`, and `stage_04_remove_legacy_generation_rpc` applied successfully.
- `wisp-generate` Edge Function is ACTIVE at version 2 with JWT verification enabled.

## Required cutover work

The current browser still calls the hosted Render endpoint and uploads a final artifact itself. The user has configured `WISP_REQUIRE_AUTH` and `WISP_RENDERER_WORKER_TOKEN` on Render, but the deployed Render container still needs this new source plus `SUPABASE_SERVICE_ROLE_KEY` and `WISP_RENDERER_WORKER_ENABLED=true` before it can safely claim and complete queue jobs.

The next Stage 4 increment must deploy this renderer source to the staging Render service, add its server-only worker credentials, prove a real queued PDF completes, and switch the frontend to enqueue-only generation. Only then can old direct signature/finalization writes be revoked without breaking users. This is intentionally not claimed complete yet.
