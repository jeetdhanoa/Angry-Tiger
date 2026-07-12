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

-- ------------------------------------------------------------
-- 6. Phase 9 — addresses & downloads (member dashboard)
-- ------------------------------------------------------------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null default 'Home',
  name text not null default '',
  line1 text not null,
  line2 text not null default '',
  city text not null,
  state text not null default '',
  pincode text not null default '',
  phone text not null default '',
  is_default boolean not null default false
);

alter table public.addresses enable row level security;

drop policy if exists "manage own addresses" on public.addresses;
create policy "manage own addresses" on public.addresses
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on public.addresses to authenticated;

-- Digital goods granted to a user (screeners, wallpapers, drops).
-- Rows are created from the dashboard; members can only read their own.
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  note text not null default '',
  url text not null
);

alter table public.downloads enable row level security;

drop policy if exists "read own downloads" on public.downloads;
create policy "read own downloads" on public.downloads
  for select to authenticated using (auth.uid() = user_id);

grant select on public.downloads to authenticated;

-- ------------------------------------------------------------
-- 7. Phase 15 — lock forms to the server route (run ONLY after
--    SUPABASE_SERVICE_ROLE_KEY is set in Vercel and deployed).
--    /api/forms then becomes the only door: rate-limited,
--    honeypotted and CAPTCHA-checked. Uncomment and run:
-- ------------------------------------------------------------
-- revoke insert on public.newsletter from anon, authenticated;
-- revoke insert on public.contact from anon, authenticated;
-- revoke insert on public.waitlist from anon, authenticated;

-- ------------------------------------------------------------
-- 8. Numbered waitlist — join_waitlist() returns your place in line.
--    Runs as definer so visitors get a number without read access
--    to the table. Rejoining returns the same number.
-- ------------------------------------------------------------
create or replace function public.join_waitlist(p_email text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  clean text := lower(trim(p_email));
  pos integer;
begin
  if clean !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' or length(clean) > 254 then
    raise exception 'invalid email';
  end if;
  insert into public.waitlist (email) values (clean)
  on conflict (email) do nothing;
  select count(*) into pos
    from public.waitlist w
    where w.created_at <= (select created_at from public.waitlist where email = clean);
  return pos;
end;
$$;

revoke all on function public.join_waitlist(text) from public;
grant execute on function public.join_waitlist(text) to anon, authenticated;

-- ------------------------------------------------------------
-- 9. Phase 10 — admin ("The office" at /admin)
--    Admins are profiles with is_admin = true. All admin access
--    flows through RLS policies checking is_admin(), so the
--    public API stays locked for everyone else.
-- ------------------------------------------------------------
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- Security definer so policies can check the flag without RLS recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- products: admins see everything (including hidden) and write
drop policy if exists "admin reads all products" on public.products;
create policy "admin reads all products" on public.products
  for select to authenticated using (public.is_admin());

drop policy if exists "admin writes products" on public.products;
create policy "admin writes products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant insert, update, delete on public.products to authenticated;

-- orders: admins read all and update status
drop policy if exists "admin reads all orders" on public.orders;
create policy "admin reads all orders" on public.orders
  for select to authenticated using (public.is_admin());

drop policy if exists "admin updates orders" on public.orders;
create policy "admin updates orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

grant update on public.orders to authenticated;

-- profiles: admins read all and can toggle the admin flag
drop policy if exists "admin reads all profiles" on public.profiles;
create policy "admin reads all profiles" on public.profiles
  for select to authenticated using (public.is_admin());

drop policy if exists "admin updates profiles" on public.profiles;
create policy "admin updates profiles" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- newsletter / contact / waitlist: admins read and delete
drop policy if exists "admin reads newsletter" on public.newsletter;
create policy "admin reads newsletter" on public.newsletter
  for select to authenticated using (public.is_admin());
drop policy if exists "admin deletes newsletter" on public.newsletter;
create policy "admin deletes newsletter" on public.newsletter
  for delete to authenticated using (public.is_admin());
grant select, delete on public.newsletter to authenticated;

drop policy if exists "admin reads contact" on public.contact;
create policy "admin reads contact" on public.contact
  for select to authenticated using (public.is_admin());
drop policy if exists "admin deletes contact" on public.contact;
create policy "admin deletes contact" on public.contact
  for delete to authenticated using (public.is_admin());
grant select, delete on public.contact to authenticated;

drop policy if exists "admin reads waitlist" on public.waitlist;
create policy "admin reads waitlist" on public.waitlist
  for select to authenticated using (public.is_admin());
drop policy if exists "admin deletes waitlist" on public.waitlist;
create policy "admin deletes waitlist" on public.waitlist
  for delete to authenticated using (public.is_admin());
grant select, delete on public.waitlist to authenticated;

-- Hand yourself the keys (sign up on the site with this email first):
-- update public.profiles set is_admin = true where email = 'jeetdhanoa9@gmail.com';

-- ------------------------------------------------------------
-- 10. Admin domain lock — office keys only for @angrytiger.in
-- ------------------------------------------------------------
-- is_admin() now requires BOTH the profile flag AND a current
-- @angrytiger.in login (checked against the live JWT, not the
-- copied profile email).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
         and lower(coalesce(auth.jwt() ->> 'email', '')) like '%@angrytiger.in'
$$;

-- Belt and braces: the flag itself can't be set on outside addresses.
update public.profiles set is_admin = false
  where is_admin and lower(email) not like '%@angrytiger.in';

alter table public.profiles drop constraint if exists admin_requires_house_email;
alter table public.profiles add constraint admin_requires_house_email
  check (not is_admin or lower(email) like '%@angrytiger.in');

-- ------------------------------------------------------------
-- 11. careers — the Production page's join-the-house applications
--     (crew / cast / creative), with CV files in a PRIVATE storage
--     bucket. Run this whole block once in the Supabase SQL editor.
--     Review applications in the dashboard: rows in Table Editor →
--     careers, files in Storage → cvs.
-- ------------------------------------------------------------
create table if not exists public.careers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('crew', 'cast', 'creative')),
  name text not null,
  email text not null,
  discipline text not null default '',
  link text not null default '',
  message text not null default '',
  cv_path text,
  cv_name text
);

alter table public.careers enable row level security;

-- Insert-only for visitors (same staged model as the other form tables:
-- anon works before SUPABASE_SERVICE_ROLE_KEY is configured in Vercel).
drop policy if exists "anon can insert" on public.careers;
create policy "anon can insert" on public.careers
  for insert to anon, authenticated with check (true);

grant insert on public.careers to anon, authenticated;

-- Private bucket for CVs: 4MB cap (Vercel's request limit is ~4.5MB),
-- PDF/DOC/DOCX only. Not public — files are only readable from the
-- dashboard or with the service key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 4194304,
        array['application/pdf', 'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

drop policy if exists "anon can upload cvs" on storage.objects;
create policy "anon can upload cvs" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'cvs');

-- Later hardening, once SUPABASE_SERVICE_ROLE_KEY is live in Vercel
-- (run together with the other revokes above):
-- revoke insert on public.careers from anon, authenticated;
-- drop policy "anon can upload cvs" on storage.objects;
