# Stage 2 — Tenant and Storage Boundary

**Status:** implementation deployed to staging on 2026-09-12. Main was not changed.

## What changed

- Added staging migration `20260912090000_stage_02_storage_tenant_boundary.sql`.
  - Deleted every legacy `storage.objects` policy, including anonymous policies.
  - Replaced them with four authenticated-only policies: member read and owner/admin/editor insert, update, delete.
  - Made `documents`, `wisp-pdfs`, and `training-assets` private.
  - Set maximum file sizes: 25 MB for firm documents/WISPs and 10 MB for training assets.
  - Applied MIME allow-lists. WISP PDFs and training assets are PDF-only; documents support PDF, Office files, JPEG, and PNG.
  - New browser uploads now use the immutable firm UUID as the first path segment, rather than a mutable firm slug. Legacy slug paths remain readable/manageable by the same firm until an explicit object-copy migration is run.
- Added authenticated-only helper functions for storage read and manager write checks. Viewers can read but cannot upload, modify, or delete.
- Added `public-wisp-download` Edge Function on staging. Its JWT requirement is intentionally disabled because acknowledgement recipients are external; the function instead requires the existing high-entropy request ID + token and validates them using the token-protected acknowledgement RPC before generating a five-minute WISP download URL.
- Changed the public acknowledgement screen to use that function rather than attempting an anonymous Storage signed URL.
- Scoped browser cache keys by Supabase environment URL, authenticated user ID, and firm ID for company logo, risk drafts, WISP drafts, special documents, document workspaces, and workspace settings.

## Why

Before this stage, anonymous Storage policies exposed file metadata and could allow file operations; a member with viewer access could also pass the previous storage helper and write objects. Browser drafts were globally keyed and could be hydrated into another account on a shared browser.

## Evidence

- Local database reset/replay completed with the new migration.
- Staging migration applied successfully.
- Staging policy inspection confirms exactly four `storage.objects` policies, all granted to `{authenticated}`.
- Staging bucket inspection confirms all three buckets have `public=false` and the configured limits.
- `public-wisp-download` is ACTIVE on staging (version 1).
- Staging frontend build completed with the staging-target guard.
- Disposable staging fixtures were created: Firm A owner/editor/viewer and Firm B owner. RLS helper checks ran under the authenticated database role: Firm A owner and editor could read/write Firm A; Firm A viewer could read but not write; Firm B owner could neither read nor write Firm A.

## How to verify

```powershell
npm run build:staging
supabase db reset --local
supabase migration list --local
```

In staging, sign in as an owner/admin/editor and confirm document upload, replacement, and deletion work. Sign in as a viewer and confirm files can be opened but upload/delete actions are refused by Storage. Open a real acknowledgement URL in a private browser window and confirm the WISP preview opens through the secure token-gated flow.

## Fixture lifecycle

The disposable identities are named `stage2-fixture-*@invalid.test`. They are staging-only, have non-production passwords, and exist solely for regression tests in later stages. They must be deleted before a final production promotion review.
