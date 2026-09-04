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

-- 8. Admin role -----------------------------------------------------------------

-- Admins are ordinary members with role = 'admin'. There is deliberately no
-- self-serve path to the role: it is granted only from the SQL editor (or with
-- the service role), see the promote snippet at the end of this section.
alter table public.profiles
  add column if not exists role text not null default 'member';

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('member', 'admin'));

-- Members may edit their own name and plan — and nothing else. Column-level
-- grants (not just RLS) are what stop a member from PATCHing their own row to
-- role = 'admin' through the REST API.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, membership_tier) on public.profiles to authenticated;

-- Security-definer so it can read profiles without tripping the table's own
-- RLS — a policy that queried profiles directly would recurse.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from anon, public;
grant execute on function public.is_admin() to authenticated;

-- Admins can read every member, nomination and application. Still read-only:
-- no admin insert/update/delete policies anywhere.
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can view nominations" on public.nominations;
create policy "Admins can view nominations"
  on public.nominations for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can view advisory applications" on public.advisory_applications;
create policy "Admins can view advisory applications"
  on public.advisory_applications for select
  to authenticated
  using (public.is_admin());

-- Lets the admin pages mint signed URLs for the bio + headshot of each
-- application. The bucket stays private to everyone else.
drop policy if exists "Admins can read advisory application files" on storage.objects;
create policy "Admins can read advisory application files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'advisory-applications' and public.is_admin());

-- 9. Admin dashboard reads -----------------------------------------------------

-- Sign-in and email-confirmation data lives in auth.users, which is not
-- reachable over the REST API. These two functions are the only way the admin
-- pages see it, and both refuse anyone who isn't an admin.

create or replace function public.admin_metrics()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'members', (
      select jsonb_build_object(
        'total',    count(*),
        'new_7d',   count(*) filter (where p.created_at > now() - interval '7 days'),
        'new_30d',  count(*) filter (where p.created_at > now() - interval '30 days'),
        'prev_30d', count(*) filter (where p.created_at > now() - interval '60 days'
                                       and p.created_at <= now() - interval '30 days'),
        'paid',     count(*) filter (where p.membership_tier <> 'free'),
        'admins',   count(*) filter (where p.role = 'admin')
      )
      from public.profiles p
    ),
    'accounts', (
      select jsonb_build_object(
        'confirmed',       count(*) filter (where u.email_confirmed_at is not null),
        'unconfirmed',     count(*) filter (where u.email_confirmed_at is null),
        'active_30d',      count(*) filter (where u.last_sign_in_at > now() - interval '30 days'),
        'never_signed_in', count(*) filter (where u.last_sign_in_at is null)
      )
      from auth.users u
      where u.deleted_at is null
    ),
    'tiers', (
      select coalesce(jsonb_object_agg(t.membership_tier, t.n), '{}'::jsonb)
      from (
        select membership_tier, count(*) as n
        from public.profiles group by membership_tier
      ) t
    ),
    -- Thirteen months so the chart can show a full year plus the month in
    -- progress; each bucket is a calendar month in UTC.
    'signups', (
      select coalesce(jsonb_agg(
               jsonb_build_object('month', to_char(g.m, 'YYYY-MM'), 'count', (
                 select count(*) from public.profiles p
                 where date_trunc('month', p.created_at at time zone 'UTC') = g.m
               ))
               order by g.m
             ), '[]'::jsonb)
      from generate_series(
        date_trunc('month', (now() at time zone 'UTC')) - interval '12 months',
        date_trunc('month', (now() at time zone 'UTC')),
        interval '1 month'
      ) as g(m)
    ),
    'nominations', (
      select jsonb_build_object(
        'total',   count(*),
        'new_30d', count(*) filter (where n.created_at > now() - interval '30 days'),
        'awards', (
          select coalesce(jsonb_object_agg(a.award, a.n), '{}'::jsonb)
          from (
            select award, count(*) as n
            from public.nominations, unnest(awards) as award
            group by award
          ) a
        )
      )
      from public.nominations n
    ),
    'advisory', (
      select jsonb_build_object(
        'total',   count(*),
        'new_30d', count(*) filter (where a.created_at > now() - interval '30 days')
      )
      from public.advisory_applications a
    )
  ) into result;

  return result;
end;
$$;

revoke execute on function public.admin_metrics() from anon, public;
grant execute on function public.admin_metrics() to authenticated;

create or replace function public.admin_members(
  search text default null,
  lim    integer default 100,
  off    integer default 0
)
returns table (
  id                uuid,
  full_name         text,
  email             text,
  membership_tier   text,
  role              text,
  created_at        timestamptz,
  last_sign_in_at   timestamptz,
  email_confirmed_at timestamptz,
  total_count       bigint
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized' using errcode = '42501';
  end if;

  return query
  select p.id,
         p.full_name,
         u.email::text,
         p.membership_tier,
         p.role,
         p.created_at,
         u.last_sign_in_at,
         u.email_confirmed_at,
         count(*) over () as total_count
  from public.profiles p
  join auth.users u on u.id = p.id
  where u.deleted_at is null
    and (
      search is null or search = ''
      or p.full_name ilike '%' || search || '%'
      or u.email::text ilike '%' || search || '%'
    )
  order by p.created_at desc
  limit greatest(1, least(coalesce(lim, 100), 500))
  offset greatest(0, coalesce(off, 0));
end;
$$;

revoke execute on function public.admin_members(text, integer, integer) from anon, public;
grant execute on function public.admin_members(text, integer, integer) to authenticated;

-- Promote someone to admin (run as the project owner, in the SQL editor):
--
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');
--
-- and to demote, set it back to 'member'.
