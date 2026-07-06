-- ============================================================
-- Angry Tiger — database schema (Phase 6)
-- Run in Supabase → SQL Editor → New query → paste → Run.
-- Idempotent: safe to re-run, and it migrates the Phase-5 form
-- tables (newsletter_signups / waitlist_signups / contact_submissions)
-- to their final names.
--
-- Access model (RLS on every table):
--   profiles    signed-in users read/update their own row (auto-created on signup)
--   products    public catalog — anyone can read active products; only you write
--   cart        signed-in users manage their own cart rows
--   orders      signed-in users create and read their own orders; only you update
--   newsletter  visitors can subscribe (insert-only)
--   contact     visitors can submit (insert-only)
--   waitlist    visitors can join (insert-only)
-- Nothing else is exposed through the public API. Manage data in the
-- dashboard (Table Editor / SQL Editor), which bypasses RLS.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Rename Phase-5 form tables to their final names
-- ------------------------------------------------------------
do $$ begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'newsletter_signups')
     and not exists (select from pg_tables where schemaname = 'public' and tablename = 'newsletter') then
    alter table public.newsletter_signups rename to newsletter;
  end if;
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'waitlist_signups')
     and not exists (select from pg_tables where schemaname = 'public' and tablename = 'waitlist') then
    alter table public.waitlist_signups rename to waitlist;
  end if;
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'contact_submissions')
     and not exists (select from pg_tables where schemaname = 'public' and tablename = 'contact') then
    alter table public.contact_submissions rename to contact;
  end if;
end $$;

-- ------------------------------------------------------------
-- 1. profiles — one row per auth user, created automatically
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  email text not null,
  name text not null default ''
);

alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

grant select, update on public.profiles to authenticated;

-- Auto-create a profile whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for anyone who signed up before this table existed.
insert into public.profiles (id, email)
select id, coalesce(email, '') from auth.users
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 2. products — the public catalog
-- ------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price integer not null,                    -- whole rupees (₹1,499 → 1499)
  category text not null,                    -- clothing / posters / books / discs / objects
  tag text not null default '',              -- e.g. "Drop 001 · Pre-order"
  sizes text[] not null default '{}',        -- e.g. {S,M,L,XL}; empty = no size choice
  sold_out boolean not null default false,
  active boolean not null default true
);

alter table public.products enable row level security;

drop policy if exists "anyone can read active products" on public.products;
create policy "anyone can read active products" on public.products
  for select to anon, authenticated using (active);

grant select on public.products to anon, authenticated;

-- Seed Drop 001 (no-op if already present).
insert into public.products (slug, name, description, price, category, tag, sizes)
values (
  'tiger-tee',
  'The tiger tee.',
  'Heavy 240 gsm cotton, cut to fit everyone. The walking tiger, screen printed front and center. Made in India. One drop at a time, and when it''s gone, it''s gone.',
  1499,
  'clothing',
  'Drop 001 · Pre-order',
  array['S','M','L','XL']
)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- 3. cart — one row per user × product × size
-- ------------------------------------------------------------
create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  size text not null default '',
  qty integer not null default 1 check (qty > 0),
  unique (user_id, product_id, size)
);

alter table public.cart enable row level security;

drop policy if exists "manage own cart" on public.cart;
create policy "manage own cart" on public.cart
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on public.cart to authenticated;

-- ------------------------------------------------------------
-- 4. orders — checkout snapshots
-- ------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending',    -- pending / paid / shipped / cancelled
  total integer not null,                    -- whole rupees at time of order
  items jsonb not null                       -- [{product_id, name, size, price, qty}]
);

alter table public.orders enable row level security;

drop policy if exists "read own orders" on public.orders;
create policy "read own orders" on public.orders
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "create own orders" on public.orders;
create policy "create own orders" on public.orders
  for insert to authenticated with check (auth.uid() = user_id);

-- Status changes (paid/shipped/…) happen in the dashboard, not via the API.
grant select, insert on public.orders to authenticated;

-- ------------------------------------------------------------
-- 5. newsletter / contact / waitlist — visitor forms (insert-only)
--    (created here for fresh installs; renamed above if Phase 5 ran)
-- ------------------------------------------------------------
create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

create table if not exists public.contact (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null default '',
  email text not null,
  story text not null
);

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique
);

alter table public.newsletter enable row level security;
alter table public.contact enable row level security;
alter table public.waitlist enable row level security;

drop policy if exists "anon can insert" on public.newsletter;
create policy "anon can insert" on public.newsletter
  for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert" on public.contact;
create policy "anon can insert" on public.contact
  for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert" on public.waitlist;
create policy "anon can insert" on public.waitlist
  for insert to anon, authenticated with check (true);

grant insert on public.newsletter to anon, authenticated;
grant insert on public.contact to anon, authenticated;
grant insert on public.waitlist to anon, authenticated;
