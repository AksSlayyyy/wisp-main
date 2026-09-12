# Stage 4 — Immutable WISP Generation and Signing

**Status:** Complete on staging — 2026-09-12.

## What changed

- Final WISP generation is now a durable, database-leased job. The browser requests a job through the JWT-protected `wisp-generate` Edge Function; it no longer creates or uploads the final PDF.
- Each job creates an immutable `wisp_versions` snapshot with a content hash, lifecycle state, and sequential version number. The server renderer builds the PDF from that snapshot, appends approved attachments, hashes it, uploads it to private storage, and records its exact size and hash.
- The queue has idempotency, leases, expired-lease recovery, and a three-attempt failure limit. Multiple renderer instances cannot process the same job at once.
- Signatures are append-only records against the exact immutable version. Activation requires both required roles on that same version; the old browser-driven signature/finalization path is no longer used.
- Browser activation now calls `activate_wisp_version`; the legacy `activate_wisp_project` RPC has no API execute permission.

## Security boundary

- Anonymous users cannot queue, claim, complete, fail, sign, or activate WISP jobs/versions.
- Signed-in users can only queue, sign, and activate, and each RPC verifies project/firm authorization internally.
- Claim, complete, and fail are renderer-only operations, granted solely to `service_role`.
- Signed-in users cannot insert generated-file metadata or legacy signature rows directly. Final artifacts remain private and server-created.

## Staging evidence

- Staging migrations applied: `stage_04_versioned_wisp_foundation`, `stage_04_generation_payload_and_lifecycle`, `stage_04_remove_legacy_generation_rpc`, `stage_04_immutable_cutover`, and `stage_04_rpc_privileges`.
- `wisp-generate` Edge Function is active with JWT verification enabled.
- A disposable staging user queued job `09f9f753-30c7-4be8-8e59-5097105b079a`. The renderer leased it once and completed it successfully.
- The resulting immutable version `2bb83f9e-146a-4802-8eaa-b695fe75e409` was signed twice, then activated. Its server-rendered private PDF was 68,500 bytes with SHA-256 `5c46fee073c6f6c0095b3eb4452428b01714c59abc96e66d5ec10f1aec556c95`.
- Effective privilege inspection confirmed anonymous access is false for every Stage 4 RPC; renderer-only operations are false for `authenticated` and true for `service_role`; direct legacy finalization writes are false for `authenticated`.
- `node --check` passed for the browser and renderer sources, `npm test` passed (3/3), `npm run build:staging` passed, the staging-target guard confirmed `eugsdqwimpocfibmjfxa`, and the renderer Docker image built locally.

## Deferred to later stages

- Formal firm invitations and signatory-role assignment are Stage 5 work. Stage 4 binds every signature to an authenticated account and immutable version, but does not yet model delegated compliance roles as memberships.
- Broader legacy security-definer function review, leaked-password protection, performance indexing, backup rehearsal, and production promotion remain in the production-readiness plan.
