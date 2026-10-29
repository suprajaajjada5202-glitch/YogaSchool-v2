-- =====================================================================
-- The Yoga School: Supabase schema
-- Run this once in Supabase > SQL Editor (then run seed.sql).
-- Content is public to read when published; only admins can change it.
-- Contact messages can be submitted by anyone but only read by admins.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Admins: add a row here for each staff login (see README step 4)
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Keep updated_at fresh on every edit
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------
create table if not exists public.classes (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  level       text,
  duration    text,                       -- e.g. '60–75 min' (leave empty to hide)
  summary     text,                       -- one-line description for cards
  description text,                       -- full text; blank line = new paragraph
  tag         text,                       -- small badge, e.g. 'Start here'
  image_url   text,
  sort        int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.timetable (
  id          uuid primary key default gen_random_uuid(),
  day_of_week smallint not null check (day_of_week between 1 and 7),  -- 1 = Monday … 7 = Sunday
  start_time  time not null,
  end_time    time,
  class_name  text not null,
  class_slug  text references public.classes (slug) on update cascade on delete set null,
  teacher     text,
  level       text,
  notes       text,
  book_url    text,                       -- usually the Momence booking link
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.prices (
  id          uuid primary key default gen_random_uuid(),
  category    text not null check (category in ('membership', 'drop_in', 'chair', 'class_pass', 'unlimited', 'private', 'other')),
  name        text not null,
  price       numeric(10, 2),
  price_label text,                       -- overrides the price display, e.g. '$120 / $160'
  period      text,                       -- e.g. 'fortnight'
  description text,
  features    text[] not null default '{}',
  terms       text,                       -- e.g. 'Minimum 12-week commitment'
  badge       text,                       -- e.g. 'All access'
  featured    boolean not null default false,
  cta_label   text,
  cta_url     text,
  sort        int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.shop_products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text,
  description text,
  price       numeric(10, 2),             -- leave empty to show 'Enquire in studio'
  image_url   text,
  buy_url     text,
  in_stock    boolean not null default true,
  sort        int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  starts_at   timestamptz not null,
  ends_at     timestamptz,
  teacher     text,
  location    text default 'The Yoga School, Piccones Village, Edge Hill',
  price_label text,
  description text,
  image_url   text,
  book_url    text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  author       text not null default 'The Yoga School',
  excerpt      text,
  body         text,                      -- blank line = new paragraph
  image_url    text,
  published_at timestamptz not null default now(),
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.gift_vouchers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price       numeric(10, 2),
  description text,
  buy_url     text default 'https://momence.com/gcc/23652',
  sort        int  not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (char_length(name) between 2 and 120),
  phone           text not null check (char_length(phone) between 6 and 40),
  email           text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  preferred_class text check (char_length(preferred_class) <= 120),
  message         text not null check (char_length(message) between 10 and 5000),
  status          text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists timetable_day_idx on public.timetable (day_of_week, start_time);
create index if not exists events_starts_idx on public.events (starts_at);
create index if not exists blog_published_idx on public.blog_posts (published_at desc);
create index if not exists messages_created_idx on public.contact_messages (created_at desc);

do $$
declare t text;
begin
  foreach t in array array['classes', 'timetable', 'prices', 'shop_products', 'events', 'blog_posts', 'gift_vouchers', 'contact_messages'] loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s', t);
    execute format('create trigger touch_%1$s before update on public.%1$s for each row execute function public.touch_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.admins           enable row level security;
alter table public.classes          enable row level security;
alter table public.timetable        enable row level security;
alter table public.prices           enable row level security;
alter table public.shop_products    enable row level security;
alter table public.events           enable row level security;
alter table public.blog_posts       enable row level security;
alter table public.gift_vouchers    enable row level security;
alter table public.contact_messages enable row level security;

-- Admins can see their own admin row (used by /admin to confirm access)
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select to authenticated using (user_id = auth.uid());

-- Content tables: everyone reads published rows, admins do everything
do $$
declare t text;
begin
  foreach t in array array['classes', 'timetable', 'prices', 'shop_products', 'events', 'blog_posts', 'gift_vouchers'] loop
    execute format('drop policy if exists "public read published" on public.%I', t);
    execute format('create policy "public read published" on public.%I for select to anon, authenticated using (published or public.is_admin())', t);
    execute format('drop policy if exists "admins manage" on public.%I', t);
    execute format('create policy "admins manage" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- Blog posts scheduled for the future stay hidden until their date
drop policy if exists "public read published" on public.blog_posts;
create policy "public read published" on public.blog_posts for select to anon, authenticated
  using ((published and published_at <= now()) or public.is_admin());

-- Contact messages: anyone can send, only admins can read / update / delete
drop policy if exists "anyone can send" on public.contact_messages;
create policy "anyone can send" on public.contact_messages for insert to anon, authenticated with check (status = 'new');
drop policy if exists "admins manage" on public.contact_messages;
create policy "admins manage" on public.contact_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: public "media" bucket for images uploaded from /admin
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());
