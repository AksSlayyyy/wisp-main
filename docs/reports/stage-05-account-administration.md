# Stage 5 — Account Administration

**Status:** Complete on staging — 2026-09-13.

## Delivered

- Replaced simulated settings-JSON invitations with server-owned `firm_invitations`, real membership administration RPCs, and append-only `audit_events`.
- Added owner/admin role ceilings: only owners can grant or remove administrator access; owners cannot be disabled or demoted through the member-management path; users cannot disable themselves.
- Invitation acceptance is bound to the invited account's email address. It creates or restores only that intended firm membership.
- The signup trigger and legacy self-provisioning fallback both detect an open invitation and prevent an invited person from accidentally receiving an unrelated owner workspace.
- Added JWT-protected `member-admin` Edge Function for Supabase Auth email invitations. It uses a service-role credential only on the server, permits only the staging site and local development origins, and never accepts a caller-provided redirect target.
- User Management now reads the database directory, supports invite/resend/revoke/change-role/disable actions, and no longer writes fake user records or seat counts into settings JSON.
- Added password-recovery control backed by Supabase Auth's password-reset email flow.
- Removed reachable raw card/CVV entry and simulated paid-plan controls. Billing is explicitly unavailable until a real hosted payment provider and webhook-backed entitlements are implemented.

## Staging evidence

- Applied migrations: `stage_05_account_administration`, `stage_05_membership_grants`, and `stage_05_invited_workspace_guard`.
- `member-admin` is ACTIVE, version 1, with JWT verification enabled.
- Effective privilege inspection confirms: anonymous users cannot read invitations or execute invite/accept/provision RPCs; signed-in users cannot directly write invitation, membership, or audit tables; checked authenticated RPCs remain available.
- `npm test` passed (3/3); `npm run build:staging` passed and asserted the staging Supabase ref `eugsdqwimpocfibmjfxa`.
- The local full migration replay was attempted but Docker Desktop was not running. The staging migration application itself succeeded before permission verification.

## Required hosted configuration before external invitation/recovery testing

- Configure staging Supabase Auth SMTP and sender domain. The application deliberately reports delivery failure rather than pretending an email was sent.
- Add `https://wisp-main.wynaai9.workers.dev` to Supabase Auth redirect URLs (and any future staging custom domain). Password-reset and invitation links rely on this allowlist.
- Before production, enable leaked-password protection and choose MFA policy for owners/admins. These are hosted Auth settings, not browser code.

## Deferred

- Billing checkout, portal, payment webhooks, and entitlements require a chosen provider and price/seat policy; they remain deliberately disabled.
- Ownership transfer, formal seat limits, email-change verification walkthrough, MFA enrollment UX, and session-expiry walkthrough are launch-hardening follow-ups.
