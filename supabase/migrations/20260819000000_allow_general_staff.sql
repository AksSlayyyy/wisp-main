-- WISP roles are reserved for the two required plan signatories. Other staff
-- can be saved for acknowledgement requests without being assigned either role.
alter table public.firm_staff
  alter column wisp_role drop not null;

comment on column public.firm_staff.wisp_role is
  'Optional reserved WISP role. NULL denotes a general staff member.';
