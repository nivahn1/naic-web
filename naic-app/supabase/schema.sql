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
