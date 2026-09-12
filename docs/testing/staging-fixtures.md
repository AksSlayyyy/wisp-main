# Staging fixture contract

Stage 1 reserves a clean, isolated fixture set for security and workflow tests. It deliberately does not create Auth users or alter customer/test firms; creation requires a dedicated test-email domain and a service credential that are not stored in this repository.

## Naming and isolation

- Prefix every generated firm, user, storage object, request, job, and audit event with `e2e-stage-` plus a run ID.
- Use a run ID such as `20260912-a1b2c3`; never reuse an old run ID.
- Create two fixture firms and identities: firm A owner/admin/editor/viewer and firm B owner/editor. Add a disabled member and an unauthenticated session case.
- Store fixture IDs only in an ignored local file such as `tmp/e2e-stage-fixtures.json`; never in source, screenshots, or reports.
- Use a dedicated staging mailbox/domain. Do not send test invitations or acknowledgement emails to customer addresses.

## Required fixture operations

1. Create test Auth users with confirmed email state through the server-side invitation harness to be introduced in Stage F. Until then, use Supabase Dashboard-created test users and record their UUIDs locally.
2. Create firms/memberships only through a privileged staging-only setup path. Never create a firm by bypassing RLS from an ordinary browser account.
3. Seed one safe PDF and one safe text file per firm under the fixture run prefix. Do not use real client documents, employee names, signatures, or payment data.
4. At the end of each run, archive the test report and remove fixture data using the dedicated cleanup operation. Cleanup must target explicit IDs/prefixes, never a broad bucket or schema deletion.

## Minimum evidence per later stage

- Fixture run ID, test user role map, and generated resource IDs redacted to the last eight characters.
- API/browser results for permitted and denied operations.
- Staging baseline fingerprint before and after the stage.
- Confirmation that no customer firm IDs, customer storage paths, or live customer emails were used.
