# WISP Backend Implementation Plan

## Current State

The app already has a partial Supabase-backed persistence layer, but the backend is not production-complete yet.

### Existing backend wiring

- `supabase-client.js`
  - Fetches bootstrap state for the app
  - Saves risk assessment drafts
  - Saves WISP builder drafts
  - Uploads and deletes documents
  - Uploads the company logo
  - Seeds training assets if none exist
  - Updates dashboard facts from assessment output
- `supabase/migrations/20260624_initial_schema.sql`
  - Defines core tables for firms, assessments, WISP drafts, documents, training assets, settings, and dashboard facts
- `scripts/wisp_merge_service.mjs`
  - Provides a local HTTP service for DOCX merge and PDF preview generation

### Major gaps

- No real user authentication or user-to-firm ownership model
- Current data access is effectively single-tenant via a hardcoded `default-firm`
- Row Level Security is disabled on all tables
- WISP generation depends on a local process instead of a backend service or edge function flow
- Generated files are not persisted as a first-class backend workflow
- No firm membership or role model for multi-user collaboration

## Backend Surface Map

### 1. Firm identity and tenancy

Status: `partial`

What exists:

- `firms` table
- Hardcoded slug lookup via `DEFAULT_FIRM_SLUG = "default-firm"`
- Firm metadata is updated from assessment form data

What is missing:

- Real logged-in user identity
- Mapping between auth users and firms
- Firm membership roles such as owner, admin, editor, viewer
- Tenant-aware data resolution instead of hardcoded default firm selection

Implementation target:

- Add `firm_memberships` table tied to `auth.users`
- Resolve active firm from authenticated user membership
- Remove hardcoded default-firm dependency from frontend data access

### 2. Risk assessment flow

Status: `partial`

What exists:

- Risk draft persistence in `risk_assessments`
- Per-question rows in `risk_assessment_answers`
- Dashboard sync after save

What is missing:

- Ownership and access policies
- Assessment history strategy
- Explicit submit/finalize workflow
- Safer server-side validation of saved payload shape

Implementation target:

- Lock assessment rows to firm membership
- Decide whether one active assessment or many assessments per firm should exist
- Add finalized/submitted lifecycle rules if needed

### 3. WISP builder drafts

Status: `partial`

What exists:

- `wisp_projects` table
- Draft section JSON persistence
- Assessment snapshot storage

What is missing:

- Per-section normalized answer sync into `wisp_answers` if we want queryable content
- Versioning strategy
- Collaboration and ownership rules
- Finalization/publish state

Implementation target:

- Define draft lifecycle: `draft`, `review`, `finalized`, `archived`
- Secure read/write access by firm membership
- Decide whether JSON draft storage alone is enough for v1

### 4. Document library uploads

Status: `partial`

What exists:

- Upload to Supabase Storage bucket `documents`
- Insert metadata into `documents` table
- Delete metadata and storage object

What is missing:

- RLS and storage policies
- Firm-scoped storage path conventions that are enforced, not just implied
- File type and size validation on the backend side
- Auditability for who uploaded or deleted files

Implementation target:

- Enforce storage access by firm membership
- Add `created_by` where helpful
- Add policy-safe bucket conventions for private documents

### 5. Company settings and logo

Status: `partial`

What exists:

- `app_settings` table
- Logo upload and signed URL preview generation

What is missing:

- Auth-aware access control
- General settings model beyond logo path

Implementation target:

- Protect settings by firm membership
- Expand `settings` JSON only where needed instead of scattering more columns prematurely

### 6. Training library

Status: `partial`

What exists:

- `training_assets` table
- Default seed rows
- Public `training-assets` bucket

What is missing:

- Decision on whether assets are global, per-firm, or mixed
- Admin workflow for editing library content
- Consistent storage-backed metadata for seeded assets

Implementation target:

- Decide if training assets should remain globally readable
- Separate platform-managed training assets from firm-managed assets if necessary

### 7. Dashboard facts

Status: `partial`

What exists:

- `dashboard_facts` table
- Sync helper based on assessment scores

What is missing:

- Clear source-of-truth rules
- Rebuild strategy if facts drift from assessment data

Implementation target:

- Keep as derived cache only
- Recompute on save or move to a database view/function later

### 8. Generated WISP DOCX/PDF output

Status: `missing` as a true backend capability

What exists:

- Local merge service running on `127.0.0.1:8766`
- Preview generation from Python and headless browser tooling
- Frontend fetches generated data directly from the local service

What is missing:

- Hosted backend execution path
- Persistent generated files in storage
- Metadata records in `wisp_generated_files`
- Auth and tenancy around generation/download
- Retry/error tracking

Implementation target:

- Move generation behind a backend-owned endpoint or function
- Save generated DOCX/PDF to storage
- Insert metadata rows into `wisp_generated_files`
- Return signed download URLs or generation job status

### 9. Security model

Status: `missing`

What exists:

- None in production terms

What is missing:

- RLS on every exposed table
- Storage policies
- Secure user-to-firm access checks
- Safe handling for generated files and documents

Implementation target:

- Enable RLS on all app tables
- Add membership-based policies
- Validate that anonymous users cannot access firm data

## Recommended Implementation Order

### Phase 1: Identity and security foundation

1. Add user-to-firm membership model
2. Enable RLS on all app tables
3. Add storage policies for `documents`, `wisp-pdfs`, and `training-assets`
4. Update frontend data access to resolve the current firm from the authenticated user

### Phase 2: Core app persistence hardening

1. Finish securing risk assessments
2. Finish securing WISP drafts
3. Add lifecycle fields where needed
4. Add minimal audit columns if useful

### Phase 3: Generated document backend

1. Replace local-only merge dependency with a backend-owned flow
2. Persist generated files in storage
3. Write rows to `wisp_generated_files`
4. Return signed URLs or downloadable artifacts safely

### Phase 4: Admin and collaboration polish

1. Training asset management rules
2. Settings expansion
3. Dashboard cleanup and derived-data strategy
4. Optional document/activity audit trail

## First Backend Slice To Implement

Start with:

`auth + firm memberships + RLS`

Why this goes first:

- Every other backend feature depends on correct ownership boundaries
- The current app is still operating like a single-tenant prototype
- If we keep building on top of disabled RLS, we will have to rework every query later

## Files Reviewed

- `app.js`
- `supabase-client.js`
- `supabase/migrations/20260624_initial_schema.sql`
- `scripts/wisp_merge_service.mjs`
- `scripts/apply-supabase-schema.mjs`
