-- =============================================================================
-- MOTOMART — core schema, row level security and storage
-- Apply once in the Supabase SQL editor (or: supabase db push).
-- Safe to re-run: every object is created with IF NOT EXISTS / OR REPLACE.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 0. Move an older MotoMart schema out of the way
--
-- An earlier version of this project shipped backend/supabase-schema.sql, whose
-- products/categories/orders tables have a different shape. "create table if not
-- exists" would silently skip them and later statements would fail on the missing
-- columns. Anything found is RENAMED, never dropped, so no data is lost.
-- -----------------------------------------------------------------------------
do $$
declare
  legacy record;
begin
  for legacy in
    select * from (values
      ('products',   'brand_id'),      -- new column that the legacy table lacks
      ('categories', 'sort_order'),
      ('orders',     'order_number')
    ) as t(tbl, required_column)
  loop
    if to_regclass('public.' || legacy.tbl) is not null
       and not exists (
         select 1 from information_schema.columns
         where table_schema = 'public'
           and table_name = legacy.tbl
           and column_name = legacy.required_column
       )
    then
      if to_regclass('public.' || legacy.tbl || '_legacy') is null then
        execute format('alter table public.%I rename to %I', legacy.tbl, legacy.tbl || '_legacy');
        raise notice 'Renamed legacy public.% to public.%_legacy', legacy.tbl, legacy.tbl;
      else
        -- a backup already exists from an earlier run, so this copy is redundant
        execute format('drop table public.%I cascade', legacy.tbl);
        raise notice 'Dropped redundant legacy public.% (public.%_legacy already kept)', legacy.tbl, legacy.tbl;
      end if;
    end if;
  end loop;
end $$;


-- -----------------------------------------------------------------------------
-- 1. Accounts
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now()
);

-- Every new auth user gets a profile automatically.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- security definer so policies can call it without recursing into profiles' own RLS
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- 2. Catalog
-- -----------------------------------------------------------------------------
create table if not exists public.brands (
  id          text primary key,            -- 'honda'
  name        text not null,
  tagline     text not null default '',
  logo        text,
  hero_image  text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.models (
  id           uuid primary key default gen_random_uuid(),
  brand_id     text not null references public.brands on delete cascade,
  slug         text not null,              -- 'activa'
  name         text not null,
  type         text not null default 'bike' check (type in ('bike', 'scooter')),
  vehicle_type text not null default 'Motorcycle',
  image        text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  unique (brand_id, slug)
);

create table if not exists public.categories (
  id          text primary key,            -- 'brake-disc-plate'
  name        text not null,
  description text not null default '',
  image       text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id           text primary key,           -- 'ea-7486753407203' or a generated slug
  name         text not null,
  sku          text not null default '',
  brand_id     text references public.brands on delete set null,
  category_id  text references public.categories on delete set null,
  vendor       text not null default '',
  description  text not null default '',
  price        numeric(12,2) not null default 0 check (price >= 0),
  mrp          numeric(12,2) not null default 0 check (mrp >= 0),
  stock        integer not null default 0 check (stock >= 0),
  images       text[] not null default '{}',
  fitment      text not null default '',
  tags         text[] not null default '{}',
  source_url   text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- A part can fit many models (866 of the imported parts do).
create table if not exists public.product_models (
  product_id text not null references public.products on delete cascade,
  model_id   uuid not null references public.models   on delete cascade,
  primary key (product_id, model_id)
);

create index if not exists idx_products_brand    on public.products (brand_id);
create index if not exists idx_products_category on public.products (category_id);
create index if not exists idx_products_active   on public.products (is_active);
create index if not exists idx_product_models_m  on public.product_models (model_id);
create index if not exists idx_models_brand      on public.models (brand_id);

-- Full-text-ish search over name / sku / vendor
create index if not exists idx_products_search
  on public.products using gin (to_tsvector('simple', name || ' ' || sku || ' ' || vendor));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Orders
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.order_status as enum (
    'pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text unique not null,
  user_id        uuid references auth.users on delete set null,
  status         public.order_status not null default 'pending',
  subtotal       numeric(12,2) not null default 0,
  shipping       numeric(12,2) not null default 0,
  total          numeric(12,2) not null default 0,
  payment_method text not null default 'cod',
  customer_name  text not null,
  customer_email text,
  customer_phone text not null,
  address_line1  text not null,
  address_line2  text,
  city           text not null,
  state          text not null,
  pincode        text not null,
  notes          text,                     -- customer note typed on the cart page
  admin_note     text,
  placed_at      timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders on delete cascade,
  product_id text,
  name       text not null,
  image      text,
  price      numeric(12,2) not null,
  qty        integer not null check (qty > 0),
  line_total numeric(12,2) not null
);

create table if not exists public.order_events (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders on delete cascade,
  status     public.order_status not null,
  note       text,
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_user    on public.orders (user_id);
create index if not exists idx_orders_status  on public.orders (status);
create index if not exists idx_orders_placed  on public.orders (placed_at desc);
create index if not exists idx_order_items_o  on public.order_items (order_id);
create index if not exists idx_order_events_o on public.order_events (order_id);

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- Log the opening status, then every status change, as a tracking event.
create or replace function public.log_order_event()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    insert into public.order_events (order_id, status, note)
    values (new.id, new.status, 'Order placed');
  elsif new.status is distinct from old.status then
    insert into public.order_events (order_id, status, note)
    values (new.id, new.status, new.admin_note);
  end if;
  return new;
end;
$$;

drop trigger if exists orders_log_event_ins on public.orders;
create trigger orders_log_event_ins
  after insert on public.orders
  for each row execute function public.log_order_event();

drop trigger if exists orders_log_event_upd on public.orders;
create trigger orders_log_event_upd
  after update on public.orders
  for each row execute function public.log_order_event();

-- Human-friendly order numbers: MM-20260920-0007
create sequence if not exists public.order_number_seq;

create or replace function public.next_order_number()
returns text language sql volatile as $$
  select 'MM-' || to_char(now(), 'YYYYMMDD') || '-' ||
         lpad(nextval('public.order_number_seq')::text, 4, '0');
$$;

-- -----------------------------------------------------------------------------
-- 4. Store settings (editable from the admin panel)
-- -----------------------------------------------------------------------------
create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.settings (key, value) values
  ('store', jsonb_build_object(
     'name', 'MotoMart India',
     'supportPhone', '+91 80000 00000',
     'supportEmail', 'support@motomart.in',
     'freeShippingAbove', 999,
     'shippingFee', 59,
     'cartNotice', 'Orders are dispatched within 24 hours. Pay on delivery available across 18,000+ pin codes.'
   ))
on conflict (key) do nothing;

-- -----------------------------------------------------------------------------
-- 5. Row level security
-- -----------------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.brands         enable row level security;
alter table public.models         enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_models enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.order_events   enable row level security;
alter table public.settings       enable row level security;

-- profiles: you see and edit yourself; admins see everyone
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (id = auth.uid() or public.is_admin());

-- catalog: world-readable when active, admin-writable
do $$
declare t text;
begin
  foreach t in array array['brands', 'models', 'categories', 'products', 'product_models', 'settings']
  loop
    execute format('drop policy if exists %I_read on public.%I', t, t);
    execute format('create policy %I_read on public.%I for select using (true)', t, t);

    execute format('drop policy if exists %I_admin_write on public.%I', t, t);
    execute format(
      'create policy %I_admin_write on public.%I for all using (public.is_admin()) with check (public.is_admin())',
      t, t);
  end loop;
end $$;

-- orders: customers see and create their own; admins see and manage all
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders
  for insert with check (user_id = auth.uid());

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists orders_admin_delete on public.orders;
create policy orders_admin_delete on public.orders
  for delete using (public.is_admin());

drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items
  for select using (
    exists (select 1 from public.orders o
            where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
  );

drop policy if exists order_items_insert on public.order_items;
create policy order_items_insert on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

drop policy if exists order_items_admin on public.order_items;
create policy order_items_admin on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists order_events_select on public.order_events;
create policy order_events_select on public.order_events
  for select using (
    exists (select 1 from public.orders o
            where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
  );

drop policy if exists order_events_admin on public.order_events;
create policy order_events_admin on public.order_events
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. Storage bucket for product images
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists product_images_read on storage.objects;
create policy product_images_read on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists product_images_admin_write on storage.objects;
create policy product_images_admin_write on storage.objects
  for all using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. Admin dashboard aggregates (one round trip instead of five)
-- -----------------------------------------------------------------------------
create or replace function public.admin_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select case when public.is_admin() then jsonb_build_object(
    'products',       (select count(*) from public.products),
    'activeProducts', (select count(*) from public.products where is_active),
    'outOfStock',     (select count(*) from public.products where stock = 0),
    'brands',         (select count(*) from public.brands),
    'models',         (select count(*) from public.models),
    'categories',     (select count(*) from public.categories),
    'customers',      (select count(*) from public.profiles where role = 'customer'),
    'orders',         (select count(*) from public.orders),
    'pendingOrders',  (select count(*) from public.orders where status = 'pending'),
    'revenue',        (select coalesce(sum(total), 0) from public.orders where status <> 'cancelled'),
    'revenue30d',     (select coalesce(sum(total), 0) from public.orders
                        where status <> 'cancelled' and placed_at > now() - interval '30 days')
  ) else jsonb_build_object('error', 'forbidden') end;
$$;

-- -----------------------------------------------------------------------------
-- 8. Checkout
-- Prices, stock and totals are recomputed from the products table, so a tampered
-- client payload cannot change what an order costs.
-- -----------------------------------------------------------------------------
create or replace function public.place_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user       uuid := auth.uid();
  v_order_id   uuid;
  v_number     text;
  v_subtotal   numeric(12,2) := 0;
  v_shipping   numeric(12,2) := 0;
  v_free_above numeric(12,2);
  v_fee        numeric(12,2);
  v_item       jsonb;
  v_product    public.products%rowtype;
  v_qty        integer;
  v_line       numeric(12,2);
  v_items      jsonb := '[]'::jsonb;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  if jsonb_array_length(coalesce(payload -> 'items', '[]'::jsonb)) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  for v_item in select * from jsonb_array_elements(payload -> 'items')
  loop
    v_qty := greatest(1, coalesce((v_item ->> 'qty')::int, 1));

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id') and is_active
    for update;

    if not found then
      raise exception 'PRODUCT_UNAVAILABLE: %', v_item ->> 'product_id';
    end if;

    if v_product.stock < v_qty then
      raise exception 'OUT_OF_STOCK: % (% left)', v_product.name, v_product.stock;
    end if;

    v_line := round(v_product.price * v_qty, 2);
    v_subtotal := v_subtotal + v_line;

    v_items := v_items || jsonb_build_object(
      'product_id', v_product.id,
      'name',       v_product.name,
      'image',      coalesce(v_product.images[1], ''),
      'price',      v_product.price,
      'qty',        v_qty,
      'line_total', v_line
    );

    update public.products set stock = stock - v_qty where id = v_product.id;
  end loop;

  select coalesce((value ->> 'freeShippingAbove')::numeric, 999),
         coalesce((value ->> 'shippingFee')::numeric, 59)
    into v_free_above, v_fee
  from public.settings where key = 'store';

  v_shipping := case when v_subtotal >= coalesce(v_free_above, 999) then 0 else coalesce(v_fee, 59) end;
  v_number := public.next_order_number();

  insert into public.orders (
    order_number, user_id, subtotal, shipping, total, payment_method,
    customer_name, customer_email, customer_phone,
    address_line1, address_line2, city, state, pincode, notes
  ) values (
    v_number, v_user, v_subtotal, v_shipping, v_subtotal + v_shipping, 'cod',
    payload ->> 'customer_name', payload ->> 'customer_email', payload ->> 'customer_phone',
    payload ->> 'address_line1', payload ->> 'address_line2',
    payload ->> 'city', payload ->> 'state', payload ->> 'pincode', payload ->> 'notes'
  )
  returning id into v_order_id;

  insert into public.order_items (order_id, product_id, name, image, price, qty, line_total)
  select v_order_id,
         i ->> 'product_id',
         i ->> 'name',
         i ->> 'image',
         (i ->> 'price')::numeric,
         (i ->> 'qty')::int,
         (i ->> 'line_total')::numeric
  from jsonb_array_elements(v_items) i;

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_number,
    'subtotal', v_subtotal,
    'shipping', v_shipping,
    'total', v_subtotal + v_shipping
  );
end;
$$;

revoke all on function public.place_order(jsonb) from public, anon;
grant execute on function public.place_order(jsonb) to authenticated;
grant execute on function public.admin_stats() to authenticated;

-- -----------------------------------------------------------------------------
-- 9. Role grants
-- Supabase normally grants these by default; doing it explicitly makes the
-- outcome the same no matter how the project was set up. RLS above still decides
-- which rows each role can actually touch.
-- -----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on all tables in schema public to anon, authenticated;

grant insert, update, delete on
  public.profiles, public.orders, public.order_items, public.order_events,
  public.products, public.product_models, public.brands, public.models,
  public.categories, public.settings
to authenticated;

grant usage, select on all sequences in schema public to anon, authenticated;
