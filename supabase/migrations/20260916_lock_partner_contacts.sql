-- Partner applications contain PII and must never be writable/readable directly
-- from browser roles. The Next.js server API writes with the service-role key.

alter table public.partner_contacts enable row level security;

revoke all privileges on table public.partner_contacts from anon;
revoke all privileges on table public.partner_contacts from authenticated;

comment on table public.partner_contacts is
  'Partner application PII. Access is server-only through the validated application endpoint.';
