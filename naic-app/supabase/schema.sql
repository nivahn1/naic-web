-- National AI Consortium — member portal schema
-- Run this in the Supabase SQL editor (or `supabase db push`) for your project.

-- 1. Profiles table -------------------------------------------------------------

create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  full_name      text,
  membership_tier text not null default 'free'
                 check (membership_tier in
                   ('free','bronze','silver','gold','platinum','diamond')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- Added directly against the live project (not yet exercised by app code
  -- in this branch) — tracked here so schema.sql matches reality.
  role           text not null default 'member'
                 check (role in ('member', 'admin')),
  email          text
);

-- 2. Row Level Security -------------------------------------------------------

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by their owner" on public.profiles;
create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles are updatable by their owner" on public.profiles;
create policy "Profiles are updatable by their owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Auto-create a profile row on sign-up -----------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- This function only ever runs as the trigger below — never as an API RPC.
revoke execute on function public.handle_new_user() from anon, authenticated, public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Keep updated_at fresh -------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.touch_updated_at() from anon, authenticated, public;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- 5. Backfill profiles for any users that already exist -----------------------

insert into public.profiles (id, full_name)
select id, raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (id) do nothing;

-- Note: email confirmation is left ON. New sign-ups get a "check your inbox"
-- message; the link lands on /auth/confirm, which establishes the session.
-- To let members in without verifying, turn off "Confirm email" under
-- Authentication → Providers → Email.

-- 6. Recognition nominations ---------------------------------------------------

create table if not exists public.nominations (
  id                 uuid primary key default gen_random_uuid(),
  nominee_name       text not null check (char_length(nominee_name) between 2 and 120),
  nominee_title      text check (char_length(nominee_title) <= 160),
  nominee_company    text check (char_length(nominee_company) <= 160),
  nominee_email      text not null check (char_length(nominee_email) <= 254),
  nominee_phone      text check (char_length(nominee_phone) <= 40),
  nominator_name     text not null check (char_length(nominator_name) between 2 and 120),
  nominator_title    text check (char_length(nominator_title) <= 160),
  nominator_company  text check (char_length(nominator_company) <= 160),
  nominator_email    text not null check (char_length(nominator_email) <= 254),
  nominator_phone    text check (char_length(nominator_phone) <= 40),
  awards             text[] not null check (array_length(awards, 1) between 1 and 6),
  rationale          text not null check (char_length(rationale) between 40 and 4000),
  submitted_by       uuid references auth.users (id) on delete set null,
  created_at         timestamptz not null default now(),
  -- Added directly against the live project for the review workflow —
  -- tracked here so schema.sql matches reality.
  review_status      text not null default 'new'
                     check (review_status in ('new', 'reviewed', 'shortlisted', 'archived'))
);

alter table public.nominations enable row level security;

-- Anyone may submit a nomination; the form is public by design. There is
-- deliberately no select/update/delete policy, so submissions are write-only
-- over the API and readable only with the service role (Supabase dashboard).
drop policy if exists "Anyone may submit a nomination" on public.nominations;
create policy "Anyone may submit a nomination"
  on public.nominations for insert
  to anon, authenticated
  with check (true);

create index if not exists nominations_created_at_idx
  on public.nominations (created_at desc);

-- 7. Advisory Board applications --------------------------------------------

create table if not exists public.advisory_applications (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null check (char_length(full_name) between 2 and 120),
  title         text check (char_length(title) <= 160),
  company       text check (char_length(company) <= 160),
  email         text not null check (char_length(email) <= 254),
  phone         text check (char_length(phone) <= 40),
  expertise     text check (char_length(expertise) <= 300),
  message       text not null check (char_length(message) between 40 and 4000),
  bio_path      text not null,
  headshot_path text not null,
  submitted_by  uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  -- Added directly against the live project for the review workflow —
  -- tracked here so schema.sql matches reality.
  review_status text not null default 'new'
                check (review_status in ('new', 'reviewed', 'approved', 'archived'))
);

alter table public.advisory_applications enable row level security;

-- Same write-only shape as nominations: public insert, no select/update/delete
-- policy, so applications are readable only with the service role.
drop policy if exists "Anyone may submit an advisory application" on public.advisory_applications;
create policy "Anyone may submit an advisory application"
  on public.advisory_applications for insert
  to anon, authenticated
  with check (true);

create index if not exists advisory_applications_created_at_idx
  on public.advisory_applications (created_at desc);

-- Private bucket for the bio + headshot files that come with each application.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'advisory-applications',
  'advisory-applications',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone may upload an advisory application file" on storage.objects;
create policy "Anyone may upload an advisory application file"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'advisory-applications');

-- 8. Program registrations ---------------------------------------------------

-- Registration intent is recorded immediately at insert (status 'pending'),
-- before the person ever reaches Stripe. Payment happens entirely on
-- Stripe's hosted Checkout page — card data never touches this table or
-- this app's server. Once Stripe confirms payment, the success page
-- updates `status` to 'paid' using the service-role client (the anon/
-- authenticated insert policy below intentionally grants no update access).
create table if not exists public.program_registrations (
  id                          uuid primary key default gen_random_uuid(),
  program_slugs               text[] not null check (array_length(program_slugs, 1) between 1 and 20),
  program_names               text[] not null,
  discount_percent            smallint not null default 0 check (discount_percent between 0 and 100),
  full_name                   text not null check (char_length(full_name) between 2 and 120),
  email                       text not null check (char_length(email) <= 254),
  phone                       text check (char_length(phone) <= 40),
  billing_street              text not null check (char_length(billing_street) <= 200),
  billing_city                text not null check (char_length(billing_city) <= 120),
  billing_state               text not null check (char_length(billing_state) <= 80),
  billing_zip                 text not null check (char_length(billing_zip) <= 20),
  billing_country             text not null default 'US' check (char_length(billing_country) = 2),
  amount_cents                integer not null,
  status                      text not null default 'pending'
                              check (status in ('pending', 'paid', 'cancelled')),
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  submitted_by                uuid references auth.users (id) on delete set null,
  created_at                  timestamptz not null default now()
);

alter table public.program_registrations enable row level security;

-- Public may only insert (create a pending registration). No select/update/
-- delete policy exists, so reading or marking-paid requires the service
-- role — which RLS does not apply to.
drop policy if exists "Anyone may submit a program registration" on public.program_registrations;
create policy "Anyone may submit a program registration"
  on public.program_registrations for insert
  to anon, authenticated
  with check (true);

create index if not exists program_registrations_created_at_idx
  on public.program_registrations (created_at desc);

-- 9. Certification registrations ---------------------------------------------

-- Same shape and write-only policy as program_registrations, but each
-- certification tier has its own price (AI-CP, AI-SCP, AI-EP differ), so
-- price_cents is stored per selected item alongside the totals.
create table if not exists public.certification_registrations (
  id                          uuid primary key default gen_random_uuid(),
  certification_slugs         text[] not null check (array_length(certification_slugs, 1) between 1 and 20),
  certification_names         text[] not null,
  price_cents                 integer[] not null,
  discount_percent            smallint not null default 0 check (discount_percent between 0 and 100),
  full_name                   text not null check (char_length(full_name) between 2 and 120),
  email                       text not null check (char_length(email) <= 254),
  phone                       text check (char_length(phone) <= 40),
  billing_street              text not null check (char_length(billing_street) <= 200),
  billing_city                text not null check (char_length(billing_city) <= 120),
  billing_state               text not null check (char_length(billing_state) <= 80),
  billing_zip                 text not null check (char_length(billing_zip) <= 20),
  billing_country             text not null default 'US' check (char_length(billing_country) = 2),
  amount_cents                integer not null,
  status                      text not null default 'pending'
                              check (status in ('pending', 'paid', 'cancelled')),
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  submitted_by                uuid references auth.users (id) on delete set null,
  created_at                  timestamptz not null default now()
);

alter table public.certification_registrations enable row level security;

drop policy if exists "Anyone may submit a certification registration" on public.certification_registrations;
create policy "Anyone may submit a certification registration"
  on public.certification_registrations for insert
  to anon, authenticated
  with check (true);

create index if not exists certification_registrations_created_at_idx
  on public.certification_registrations (created_at desc);

-- 10. Training registrations ---------------------------------------------------

-- Same shape as program_registrations — flat $999 per training. Customized
-- AI Training is intentionally excluded (see table 11): it's scoped through
-- a consultation, not this checkout.
create table if not exists public.training_registrations (
  id                          uuid primary key default gen_random_uuid(),
  training_slugs              text[] not null check (array_length(training_slugs, 1) between 1 and 20),
  training_names              text[] not null,
  full_name                   text not null check (char_length(full_name) between 2 and 120),
  email                       text not null check (char_length(email) <= 254),
  phone                       text check (char_length(phone) <= 40),
  billing_street              text not null check (char_length(billing_street) <= 200),
  billing_city                text not null check (char_length(billing_city) <= 120),
  billing_state               text not null check (char_length(billing_state) <= 80),
  billing_zip                 text not null check (char_length(billing_zip) <= 20),
  billing_country             text not null default 'US' check (char_length(billing_country) = 2),
  amount_cents                integer not null,
  status                      text not null default 'pending'
                              check (status in ('pending', 'paid', 'cancelled')),
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  submitted_by                uuid references auth.users (id) on delete set null,
  created_at                  timestamptz not null default now()
);

alter table public.training_registrations enable row level security;

drop policy if exists "Anyone may submit a training registration" on public.training_registrations;
create policy "Anyone may submit a training registration"
  on public.training_registrations for insert
  to anon, authenticated
  with check (true);

create index if not exists training_registrations_created_at_idx
  on public.training_registrations (created_at desc);

-- 11. Customized AI Training consultation requests -----------------------------

-- No payment here — this is a "book a consultation" contact form. Write-only,
-- same as the other public forms; read only via the dashboard or service role.
create table if not exists public.customized_training_consultations (
  id             uuid primary key default gen_random_uuid(),
  full_name      text not null check (char_length(full_name) between 2 and 120),
  email          text not null check (char_length(email) <= 254),
  phone          text check (char_length(phone) <= 40),
  company        text not null check (char_length(company) between 1 and 160),
  format         text check (char_length(format) <= 80),
  message        text not null check (char_length(message) between 20 and 4000),
  submitted_by   uuid references auth.users (id) on delete set null,
  created_at     timestamptz not null default now()
);

alter table public.customized_training_consultations enable row level security;

drop policy if exists "Anyone may request a customized training consultation" on public.customized_training_consultations;
create policy "Anyone may request a customized training consultation"
  on public.customized_training_consultations for insert
  to anon, authenticated
  with check (true);

create index if not exists customized_training_consultations_created_at_idx
  on public.customized_training_consultations (created_at desc);

-- 12. Webinar registrations -----------------------------------------------------

-- Flat $99/webinar, same shape as training_registrations.
create table if not exists public.webinar_registrations (
  id                          uuid primary key default gen_random_uuid(),
  webinar_slugs               text[] not null check (array_length(webinar_slugs, 1) between 1 and 20),
  webinar_names               text[] not null,
  full_name                   text not null check (char_length(full_name) between 2 and 120),
  email                       text not null check (char_length(email) <= 254),
  phone                       text check (char_length(phone) <= 40),
  billing_street              text not null check (char_length(billing_street) <= 200),
  billing_city                text not null check (char_length(billing_city) <= 120),
  billing_state               text not null check (char_length(billing_state) <= 80),
  billing_zip                 text not null check (char_length(billing_zip) <= 20),
  billing_country             text not null default 'US' check (char_length(billing_country) = 2),
  amount_cents                integer not null,
  status                      text not null default 'pending'
                              check (status in ('pending', 'paid', 'cancelled')),
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  submitted_by                uuid references auth.users (id) on delete set null,
  created_at                  timestamptz not null default now()
);

alter table public.webinar_registrations enable row level security;

drop policy if exists "Anyone may submit a webinar registration" on public.webinar_registrations;
create policy "Anyone may submit a webinar registration"
  on public.webinar_registrations for insert
  to anon, authenticated
  with check (true);

create index if not exists webinar_registrations_created_at_idx
  on public.webinar_registrations (created_at desc);

-- 13. Event registrations -------------------------------------------------------

-- Flat $149/event, same shape as webinar_registrations.
create table if not exists public.event_registrations (
  id                          uuid primary key default gen_random_uuid(),
  event_slugs                 text[] not null check (array_length(event_slugs, 1) between 1 and 20),
  event_names                 text[] not null,
  full_name                   text not null check (char_length(full_name) between 2 and 120),
  email                       text not null check (char_length(email) <= 254),
  phone                       text check (char_length(phone) <= 40),
  billing_street              text not null check (char_length(billing_street) <= 200),
  billing_city                text not null check (char_length(billing_city) <= 120),
  billing_state               text not null check (char_length(billing_state) <= 80),
  billing_zip                 text not null check (char_length(billing_zip) <= 20),
  billing_country             text not null default 'US' check (char_length(billing_country) = 2),
  amount_cents                integer not null,
  status                      text not null default 'pending'
                              check (status in ('pending', 'paid', 'cancelled')),
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  submitted_by                uuid references auth.users (id) on delete set null,
  created_at                  timestamptz not null default now()
);

alter table public.event_registrations enable row level security;

drop policy if exists "Anyone may submit an event registration" on public.event_registrations;
create policy "Anyone may submit an event registration"
  on public.event_registrations for insert
  to anon, authenticated
  with check (true);

create index if not exists event_registrations_created_at_idx
  on public.event_registrations (created_at desc);

-- 14. Conference registrations ---------------------------------------------------

-- Standard ($1,199) or VIP ($1,399), chosen per conference — conference_tiers and
-- price_cents are parallel arrays to conference_slugs, like certification_registrations.
create table if not exists public.conference_registrations (
  id                          uuid primary key default gen_random_uuid(),
  conference_slugs            text[] not null check (array_length(conference_slugs, 1) between 1 and 20),
  conference_names            text[] not null,
  conference_tiers            text[] not null,
  price_cents                 integer[] not null,
  full_name                   text not null check (char_length(full_name) between 2 and 120),
  email                       text not null check (char_length(email) <= 254),
  phone                       text check (char_length(phone) <= 40),
  billing_street              text not null check (char_length(billing_street) <= 200),
  billing_city                text not null check (char_length(billing_city) <= 120),
  billing_state               text not null check (char_length(billing_state) <= 80),
  billing_zip                 text not null check (char_length(billing_zip) <= 20),
  billing_country             text not null default 'US' check (char_length(billing_country) = 2),
  amount_cents                integer not null,
  status                      text not null default 'pending'
                              check (status in ('pending', 'paid', 'cancelled')),
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  submitted_by                uuid references auth.users (id) on delete set null,
  created_at                  timestamptz not null default now()
);

alter table public.conference_registrations enable row level security;

drop policy if exists "Anyone may submit a conference registration" on public.conference_registrations;
create policy "Anyone may submit a conference registration"
  on public.conference_registrations for insert
  to anon, authenticated
  with check (true);

create index if not exists conference_registrations_created_at_idx
  on public.conference_registrations (created_at desc);

-- 15. Conference inquiries (nonprofit / government) ------------------------------

-- No payment — nonprofit and government registrants contact us instead of
-- checking out. Write-only, same as the other public contact forms.
create table if not exists public.conference_inquiries (
  id                 uuid primary key default gen_random_uuid(),
  conference_slugs   text[] not null check (array_length(conference_slugs, 1) between 1 and 20),
  organization_name  text not null check (char_length(organization_name) between 1 and 160),
  organization_type  text not null check (organization_type in ('nonprofit', 'government')),
  full_name          text not null check (char_length(full_name) between 2 and 120),
  email              text not null check (char_length(email) <= 254),
  phone              text check (char_length(phone) <= 40),
  message            text check (char_length(message) <= 4000),
  submitted_by       uuid references auth.users (id) on delete set null,
  created_at         timestamptz not null default now()
);

alter table public.conference_inquiries enable row level security;

drop policy if exists "Anyone may submit a conference inquiry" on public.conference_inquiries;
create policy "Anyone may submit a conference inquiry"
  on public.conference_inquiries for insert
  to anon, authenticated
  with check (true);

create index if not exists conference_inquiries_created_at_idx
  on public.conference_inquiries (created_at desc);

-- 16. AI Week registrations ------------------------------------------------------

-- Flat $599/week, same shape as webinar_registrations.
create table if not exists public.week_registrations (
  id                          uuid primary key default gen_random_uuid(),
  week_slugs                  text[] not null check (array_length(week_slugs, 1) between 1 and 20),
  week_names                  text[] not null,
  full_name                   text not null check (char_length(full_name) between 2 and 120),
  email                       text not null check (char_length(email) <= 254),
  phone                       text check (char_length(phone) <= 40),
  billing_street              text not null check (char_length(billing_street) <= 200),
  billing_city                text not null check (char_length(billing_city) <= 120),
  billing_state               text not null check (char_length(billing_state) <= 80),
  billing_zip                 text not null check (char_length(billing_zip) <= 20),
  billing_country             text not null default 'US' check (char_length(billing_country) = 2),
  amount_cents                integer not null,
  status                      text not null default 'pending'
                              check (status in ('pending', 'paid', 'cancelled')),
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  submitted_by                uuid references auth.users (id) on delete set null,
  created_at                  timestamptz not null default now()
);

alter table public.week_registrations enable row level security;

drop policy if exists "Anyone may submit a week registration" on public.week_registrations;
create policy "Anyone may submit a week registration"
  on public.week_registrations for insert
  to anon, authenticated
  with check (true);

create index if not exists week_registrations_created_at_idx
  on public.week_registrations (created_at desc);

-- 17. Celebration registrations ---------------------------------------------------

-- Flat $2,499/celebration, same shape as week_registrations.
create table if not exists public.celebration_registrations (
  id                          uuid primary key default gen_random_uuid(),
  celebration_slugs           text[] not null check (array_length(celebration_slugs, 1) between 1 and 20),
  celebration_names           text[] not null,
  full_name                   text not null check (char_length(full_name) between 2 and 120),
  email                       text not null check (char_length(email) <= 254),
  phone                       text check (char_length(phone) <= 40),
  billing_street              text not null check (char_length(billing_street) <= 200),
  billing_city                text not null check (char_length(billing_city) <= 120),
  billing_state               text not null check (char_length(billing_state) <= 80),
  billing_zip                 text not null check (char_length(billing_zip) <= 20),
  billing_country             text not null default 'US' check (char_length(billing_country) = 2),
  amount_cents                integer not null,
  status                      text not null default 'pending'
                              check (status in ('pending', 'paid', 'cancelled')),
  stripe_checkout_session_id  text unique,
  stripe_payment_intent_id    text,
  submitted_by                uuid references auth.users (id) on delete set null,
  created_at                  timestamptz not null default now()
);

alter table public.celebration_registrations enable row level security;

drop policy if exists "Anyone may submit a celebration registration" on public.celebration_registrations;
create policy "Anyone may submit a celebration registration"
  on public.celebration_registrations for insert
  to anon, authenticated
  with check (true);

create index if not exists celebration_registrations_created_at_idx
  on public.celebration_registrations (created_at desc);
