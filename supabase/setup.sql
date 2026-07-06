-- Angry Tiger — form submission tables
-- Run once in Supabase → SQL Editor → New query → paste → Run.
--
-- Visitors (anon key) may only INSERT. Nobody can read these rows through
-- the public API — view them in Supabase → Table Editor (or add authenticated
-- policies later for an admin area).

-- Contact / story submissions ("Talk to the tiger")
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null default '',
  email text not null,
  story text not null
);

alter table public.contact_submissions enable row level security;

drop policy if exists "anon can insert" on public.contact_submissions;
create policy "anon can insert" on public.contact_submissions
  for insert to anon, authenticated with check (true);

-- Newsletter signups (footer "First to know")
create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

alter table public.newsletter_signups enable row level security;

drop policy if exists "anon can insert" on public.newsletter_signups;
create policy "anon can insert" on public.newsletter_signups
  for insert to anon, authenticated with check (true);

-- Ambush waitlist (membership "Get in early")
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

alter table public.waitlist_signups enable row level security;

drop policy if exists "anon can insert" on public.waitlist_signups;
create policy "anon can insert" on public.waitlist_signups
  for insert to anon, authenticated with check (true);

-- Newer Supabase projects don't grant table privileges to the API roles by
-- default — RLS policies only apply on top of these grants.
grant insert on public.contact_submissions to anon, authenticated;
grant insert on public.newsletter_signups to anon, authenticated;
grant insert on public.waitlist_signups to anon, authenticated;
