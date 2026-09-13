-- Membership changes must go through checked Stage 5 RPCs, never raw Data API DML.
revoke insert, update, delete on table public.firm_memberships from public, anon, authenticated;
grant select on table public.firm_memberships to authenticated;
