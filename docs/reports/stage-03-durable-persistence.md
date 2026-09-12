# Stage 3 — Durable Persistence and Honest Save Results

**Status:** implemented, locally verified, and deployed on 2026-09-12.

## What changed

- Implemented durable Supabase save functions for record-retention policies, disaster-recovery plans, incident reports, breach-response guidelines, breach-notification letters, terminated-employee checklists, and special-document instances.
- Added bootstrap reads for the five special-document records, so saved records are restored from the database rather than relying on browser storage.
- Implemented all six PDF export paths. Each export now saves the source record, uploads the PDF to the private `documents` bucket, creates a `documents` metadata row, and records that document ID on the source record.
- Added a keepalive implementation that persists document workspaces rather than silently doing nothing.
- Updated the backend-surface audit to recognize exported constants as well as exported functions. It now reports **zero missing bindings**.

## Why

Previously, several UI actions could display a successful-looking result while their Supabase function was absent. Special documents could exist only in local browser storage. Exports were downloaded locally but not tied to the durable document library.

## What it now does

- A save failure throws to the caller instead of returning a false success.
- A successful save writes a firm-scoped row protected by existing Stage 2 RLS.
- Reloading a signed-in workspace fetches special-document data from Supabase.
- A PDF export is retained in private Storage and visible through the document metadata flow, not just the visitor's browser download.
- New code has no missing `supabaseModule` binding fallbacks.

## Verification completed

```powershell
npm run build:staging
npm run audit:backend-surface
npm test
```

- Staging target guard passed.
- Static staging build passed.
- All 3 automated harness tests passed.
- Backend-surface audit reports `missing: []`.

## Deferred combined testing

Per the agreed approach, browser save/reload/export workflows will be run alongside the final combined staging test pass rather than requiring user-by-user manual testing now. Before production promotion, that pass must prove persistence after refresh and re-login, rejected writes for viewers, successful editor/owner writes, and durable exported-PDF retrieval.

## Deployment evidence

The frontend was deployed to [wisp-main.wynaai9.workers.dev](https://wisp-main.wynaai9.workers.dev) as Cloudflare version `78d5fe43-aeda-4759-a6bb-2a680d64d3c3`. A live `HEAD` request returned `200 OK`. The frontend is configured to use the staging Supabase project; no Supabase main/project promotion occurred.
