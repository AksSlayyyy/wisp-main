# Stage 6 — readiness proof

## Implemented controls

- A GitHub Actions workflow runs a locked dependency install, unit tests, the staging-target assertion, static build, and release-artifact verification on every pull request and push to `main`.
- `verify:release` rebuilds the Cloudflare artifact and checks that it targets the staging Supabase project, contains the pinned browser SDK bundle and both brand assets, keeps billing explicitly unavailable, and has no browser reference to a service-role credential.
- `backend:health` no longer has a production URL or embedded key fallback. It accepts only the staging API URL and requires a supplied public anonymous key.
- The Supabase security and performance advisors were rechecked on staging on 2026-09-13.

## Evidence

Run locally:

```powershell
npm test
npm run verify:release
$env:SUPABASE_ANON_KEY = "<staging publishable key>"
npm run backend:health
```

The first two commands are safe without credentials. The health check deliberately refuses every non-staging endpoint.

## Current external release gates

These require dashboard access or a separate isolated environment and therefore cannot be claimed complete from source code alone:

1. Enable Supabase leaked-password protection.
2. Configure production-grade SMTP and test password reset plus invitation delivery against the Cloudflare URL.
3. Start Docker Desktop, then run the local migration replay before release.
4. Perform a backup restore into an isolated Supabase project, verify row counts and a downloaded storage/PDF checksum, then destroy that restore project.
5. Run the role/tenant browser matrix with two test firms and owner, admin, editor, and viewer users.
6. Configure and verify Cloudflare response security headers and monitoring/alert routing.

## Advisor interpretation

- `audit_events` and `firm_invitations` intentionally have RLS with no direct policies: only server-owned security-definer routines and the `member-admin` Edge Function operate on them. This prevents browser table access.
- Security-definer routines remain executable only where they implement the authenticated product workflows or public token-signing flow. Their authorization is enforced inside each routine; this is reviewed in the earlier stages and should remain part of the regression matrix.
- The performance advisor identifies several unindexed foreign keys and overlapping read/write policies. These are tuning items, not authorization failures. Add indexes from observed slow queries rather than blindly indexing every foreign key before launch.
