-- Training content is platform-owned and shared across every firm.
-- Firm workspaces may read the catalog but must never need to seed it client-side.

create unique index if not exists training_assets_platform_asset_key_unique
  on public.training_assets (asset_key)
  where firm_id is null and asset_key is not null;

insert into public.training_assets (
  firm_id, bucket_name, asset_key, source_kind, sort_order, title,
  description, asset_type, action_primary, action_secondary, storage_path
)
values
  (null, 'training-assets', 'annual_staff_training', 'platform', 10,
   '[PPTX] WISP Annual Staff Training Presentation - 2.4 MB',
   'Mandatory annual training deck for internal staff awareness reviews.',
   'mandatory', 'View', 'Download', null),
  (null, 'training-assets', 'employee_training_signin_sheet', 'platform', 20,
   '[DOCX] WISP Employee Training Sign-in Sheet - 120 KB',
   'Sign-in sheet to document attendance for required employee training.',
   'mandatory', 'View', 'Download', null),
  (null, 'training-assets', 'wisp_overview_video', 'platform', 30,
   'Written Information Security Plan Overview - 14 Mins',
   'Overview video for WISP concepts and internal readiness expectations.',
   'video', 'Watch Video', null, null),
  (null, 'training-assets', 'phishing_awareness_training', 'platform', 40,
   'Security Awareness: Recognizing Phishing Scams - 7 Mins',
   'Security-awareness video focused on phishing and suspicious messages.',
   'video', 'Watch Video', null, null),
  (null, 'training-assets', 'irs_dirty_dozen_briefing', 'platform', 50,
   'IRS "Dirty Dozen" Financial Scams Briefing - 11 Mins',
   'Short-form security briefing on common financial scam patterns.',
   'video', 'Watch Video', null, null),
  (null, 'training-assets', 'ftc_safeguards_quick_reference', 'platform', 60,
   '[PDF] FTC Safeguards Rule Quick Reference Guide - 1.8 MB',
   'Reference guide covering FTC Safeguards Rule expectations.',
   'resource', 'View', 'Download', null)
on conflict (asset_key) where firm_id is null and asset_key is not null do update
  set bucket_name = excluded.bucket_name,
      source_kind = excluded.source_kind,
      sort_order = excluded.sort_order,
      title = excluded.title,
      description = excluded.description,
      asset_type = excluded.asset_type,
      action_primary = excluded.action_primary,
      action_secondary = excluded.action_secondary,
      storage_path = excluded.storage_path;
