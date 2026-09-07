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
  updated_at     timestamptz not null default now()
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
  created_at         timestamptz not null default now()
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
  created_at    timestamptz not null default now()
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

-- 9. Admin role ---------------------------------------------------------------

-- Admins are ordinary members with `role = 'admin'`. There is no separate
-- admin table and no service-role dependency for reads: every admin-only
-- query below is enforced by Postgres itself, so a bug in the app layer
-- cannot leak submissions.
alter table public.profiles
  add column if not exists role text not null default 'member'
  check (role in ('member', 'admin'));

-- Email is duplicated onto the profile so the admin tables can search and
-- sort by it. auth.users is not reachable over PostgREST.
alter table public.profiles
  add column if not exists email text;

-- `security definer` is essential: is_admin() reads public.profiles, and it
-- is used inside a policy ON public.profiles. Running as the definer skips
-- RLS on that read and avoids infinite policy recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from anon, public;
grant execute on function public.is_admin() to authenticated;

-- Keep the profile's email in sync with the auth record.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from anon, authenticated, public;

create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

revoke execute on function public.handle_user_email_change() from anon, authenticated, public;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- Backfill emails for users that signed up before this column existed.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and p.email is distinct from u.email;

-- 10. Review status on the two submission tables ------------------------------

alter table public.nominations
  add column if not exists review_status text not null default 'new'
  check (review_status in ('new', 'reviewed', 'shortlisted', 'archived'));

alter table public.advisory_applications
  add column if not exists review_status text not null default 'new'
  check (review_status in ('new', 'reviewed', 'approved', 'archived'));

-- 11. Admin policies ----------------------------------------------------------

-- Permissive policies OR together, so these sit alongside the owner-only and
-- insert-only policies above rather than replacing them.

drop policy if exists "Admins may view every profile" on public.profiles;
create policy "Admins may view every profile"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins may update every profile" on public.profiles;
create policy "Admins may update every profile"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No delete policy on profiles: removing a member goes through the Supabase
-- Auth admin API (auth.users), and the FK cascade drops the profile row.

drop policy if exists "Admins may view nominations" on public.nominations;
create policy "Admins may view nominations"
  on public.nominations for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins may update nominations" on public.nominations;
create policy "Admins may update nominations"
  on public.nominations for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins may delete nominations" on public.nominations;
create policy "Admins may delete nominations"
  on public.nominations for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins may view advisory applications" on public.advisory_applications;
create policy "Admins may view advisory applications"
  on public.advisory_applications for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins may update advisory applications" on public.advisory_applications;
create policy "Admins may update advisory applications"
  on public.advisory_applications for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins may delete advisory applications" on public.advisory_applications;
create policy "Admins may delete advisory applications"
  on public.advisory_applications for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins may view program registrations" on public.program_registrations;
create policy "Admins may view program registrations"
  on public.program_registrations for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins may update program registrations" on public.program_registrations;
create policy "Admins may update program registrations"
  on public.program_registrations for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins may delete program registrations" on public.program_registrations;
create policy "Admins may delete program registrations"
  on public.program_registrations for delete
  to authenticated
  using (public.is_admin());

-- Admins can read (and clean up) the private advisory bio/headshot files, so
-- the dashboard can hand out short-lived signed download links.
drop policy if exists "Admins may read advisory application files" on storage.objects;
create policy "Admins may read advisory application files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'advisory-applications' and public.is_admin());

drop policy if exists "Admins may delete advisory application files" on storage.objects;
create policy "Admins may delete advisory application files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'advisory-applications' and public.is_admin());

-- 12. Promote your first admin ------------------------------------------------

-- Nobody is an admin until you say so. Sign up through the site first, then
-- uncomment this line with your own address and run it once. After that you
-- can promote and demote everyone else from /admin/members.
--
-- update public.profiles set role = 'admin' where email = 'you@example.com';

-- 13. Column-level write hardening -------------------------------------------

-- RLS alone does NOT secure the role column. The owner-update policy in
-- section 2 lets a member update their own row, and an RLS policy cannot
-- express *which columns* changed -- `with check` only sees the resulting
-- row. So with a table-wide UPDATE grant, any signed-in member could
--
--   PATCH /rest/v1/profiles?id=eq.<their own id>   {"role": "admin"}
--
-- and promote themselves. Column-level grants are checked before RLS is
-- consulted, which is what actually closes this off. Members may write only
-- their display name and their chosen plan; nothing can write `role` over
-- the REST API at all.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, membership_tier) on public.profiles to authenticated;

-- 14. Guarded role changes ----------------------------------------------------

-- Because of the grant above, even an admin cannot write `role` directly.
-- Role changes go through this function instead: it runs as its definer (so
-- the grant does not apply), but refuses to do anything unless the *caller*
-- is an admin. Same shape as admin_metrics()/admin_members().
create or replace function public.admin_set_member_role(target uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  if new_role not in ('member', 'admin') then
    raise exception 'Invalid role' using errcode = '22023';
  end if;

  -- Enforced here as well as in the app, so the last admin cannot lock
  -- everyone out even by calling the RPC directly.
  if target = (select auth.uid()) and new_role <> 'admin' then
    raise exception 'You cannot remove your own admin access'
      using errcode = '42501';
  end if;

  update public.profiles set role = new_role where id = target;
end;
$$;

revoke execute on function public.admin_set_member_role(uuid, text) from anon, public;
grant execute on function public.admin_set_member_role(uuid, text) to authenticated;
