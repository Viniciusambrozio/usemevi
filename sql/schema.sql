-- Mevi Catálogo — Schema Supabase

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null,
  category text,
  stock integer default 0,
  featured boolean default false,
  variations jsonb,
  images jsonb,
  created_at timestamp with time zone default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  notes text,
  tags text[],
  created_at timestamp with time zone default now()
);

create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  products jsonb not null,
  total numeric not null,
  status text check (status in ('pendente','pago','entregue')) default 'pendente',
  date timestamp with time zone default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password text not null,
  role text check (role in ('admin','vendedor')) default 'vendedor',
  created_at timestamp with time zone default now()
);

create table if not exists config (
  id uuid primary key default gen_random_uuid(),
  whatsapp_number text,
  logo_url text,
  color_primary text default '#fc0055',
  color_secondary text default '#FFE472'
);

-- Índices
create index if not exists idx_products_category on products (category);
create index if not exists idx_sales_date on sales (date);

-- Storage bucket
-- Execute no SQL do Supabase:
-- select storage.create_bucket('product-images', public := true);

-- Políticas RLS (exemplo simplificado; ajuste conforme necessidade)
-- alter table products enable row level security;
-- create policy "public read products" on products for select using (true);
-- create policy "admin insert/update/delete products" on products for all to authenticated using (true) with check (true);
