-- DigitalVault baseline schema (Postgres + Supabase)
-- Run with service role. Adjust bucket name via env (STORAGE_BUCKET).

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  price_web2 int,
  price_web3 numeric,
  storage_path text not null,
  file_name text,
  mime_type text,
  created_at timestamptz default now()
);

-- users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  wallet text unique,
  login_type text check (login_type in ('web2','web3')),
  created_at timestamptz default now()
);

-- purchases (audit-friendly)
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  product_id uuid references products(id),
  amount numeric,
  payment_type text check (payment_type in ('web2','web3')),
  status text default 'paid',
  tx_hash text,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

-- user_files (effective access map)
create table if not exists user_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  product_id uuid references products(id),
  storage_path text not null,
  created_at timestamptz default now()
);

-- audit trail
create table if not exists audit_chain (
  id uuid primary key default gen_random_uuid(),
  purchase_id uuid references purchases(id),
  payload jsonb not null,
  payload_hash text not null,
  created_at timestamptz default now()
);

-- RLS policies
alter table products enable row level security;
alter table users enable row level security;
alter table purchases enable row level security;
alter table user_files enable row level security;
alter table audit_chain enable row level security;

-- products: public select
create policy if not exists products_public_select on products
  for select using (true);

-- Everything else: service role only (no anon insert/update/delete)
-- If using Supabase, service role bypasses RLS. You may add restrictive policies if needed.

-- helper indexes
create index if not exists purchases_user_product on purchases (user_id, product_id);
create index if not exists user_files_user_product on user_files (user_id, product_id);
