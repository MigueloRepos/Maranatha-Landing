-- ==============================================================================
-- MARANATHA SUPABASE DATABASE SCHEMA MIGRATION SCRIPT
-- Project ID: tfxvqcrzacmqzjpyrvym
-- Project URL: https://tfxvqcrzacmqzjpyrvym.supabase.co
-- ==============================================================================
-- Instructions:
-- 1. Go to your Supabase Project Dashboard: https://app.supabase.com/project/tfxvqcrzacmqzjpyrvym
-- 2. Navigate to "SQL Editor" on the left sidebar.
-- 3. Click "New Query", paste this entire script, and click "Run".
-- ==============================================================================

-- 1. Categories Table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Products Table (Stores shop products, weekly top, new designs)
create table if not exists products (
  id text primary key,
  title text not null,
  subtitle text,
  category text not null,
  price text not null,
  portions text,
  lead_time text,
  image_url text,
  alt text,
  description text,
  flavors text[],
  features text[],
  is_weekly_top boolean default false,
  weekly_rank integer default 1,
  weekly_orders_count integer default 10,
  is_new_design boolean default false,
  release_tag text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. WhatsApp Orders Log Table
create table if not exists whatsapp_orders (
  id uuid default gen_random_uuid() primary key,
  client_name text not null,
  client_contact text not null,
  item_summary text not null,
  full_message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================

alter table categories enable row level security;
alter table products enable row level security;
alter table whatsapp_orders enable row level security;

-- Categories policies
create policy "Public read categories" on categories for select using (true);
create policy "Public write categories" on categories for all using (true) with check (true);

-- Products policies
create policy "Public read products" on products for select using (true);
create policy "Public write products" on products for all using (true) with check (true);

-- WhatsApp orders policies
create policy "Public insert whatsapp_orders" on whatsapp_orders for insert with check (true);
create policy "Public read whatsapp_orders" on whatsapp_orders for select using (true);

-- ==============================================================================
-- SEED INITIAL DATA (Optional - populates default catalog if tables are empty)
-- ==============================================================================

insert into categories (name) values
  ('Tortas de celebración'),
  ('Dulces artesanales'),
  ('Postres especiales'),
  ('Galletas y masitas'),
  ('Bodas y eventos')
on conflict (name) do nothing;
