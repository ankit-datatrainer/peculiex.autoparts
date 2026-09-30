-- =============================================================================
-- MOTOMART 0003 — GST, minimum order quantity, product reference numbers,
-- gallery view labels, 3D models, and prices shown only to verified buyers.
--
-- 1. products: reference_no (unique, auto-numbered MM-100001…), moq, gst_rate,
--    image_labels (Front / Back / Side … per image), model_3d_url (.glb).
-- 2. store settings: gstRate (18) and defaultMoq (10) — editable in the admin.
-- 3. profiles: email_verified_at / verified_email. Customers cannot set these
--    (or their own role) themselves; only the server and admins can.
-- 4. email_otps: one-time codes for email verification. Server-only table.
-- 5. orders: GST is stored per line and on the order.
-- 6. place_order(): enforces MOQ and verified email, adds GST, and no longer
--    caps quantity at the stock count.
--
-- Run once in the Supabase SQL editor. Safe to re-run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Products
-- -----------------------------------------------------------------------------
create sequence if not exists public.product_ref_seq start 100001;

alter table public.products
  add column if not exists reference_no text,
  add column if not exists moq integer check (moq is null or moq >= 1),
  add column if not exists gst_rate numeric(5,2) check (gst_rate is null or (gst_rate >= 0 and gst_rate <= 100)),
  add column if not exists image_labels text[] not null default '{}',
  add column if not exists model_3d_url text;

-- Next free reference number. Skips any number an admin already typed by hand,
-- so a new product can never collide with an edited one.
create or replace function public.next_product_ref()
returns text
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v text;
begin
  loop
    v := 'MM-' || nextval('public.product_ref_seq');
    exit when not exists (select 1 from public.products where reference_no = v);
  end loop;
  return v;
end;
$$;

-- Number every existing product once, oldest first. The updated_at trigger is
-- paused so this bookkeeping does not look like 13,000 product edits.
do $$
declare
  v_base  bigint;
  v_count bigint;
begin
  select case when is_called then last_value else last_value - 1 end
    into v_base
  from public.product_ref_seq;

  alter table public.products disable trigger products_touch_updated_at;

  with todo as (
    select id, row_number() over (order by created_at, id) as n
    from public.products
    where reference_no is null or btrim(reference_no) = ''
  )
  update public.products p
     set reference_no = 'MM-' || (v_base + todo.n)
    from todo
   where p.id = todo.id;
  get diagnostics v_count = row_count;

  alter table public.products enable trigger products_touch_updated_at;

  if v_count > 0 then
    perform setval('public.product_ref_seq', v_base + v_count, true);
  end if;
end $$;

alter table public.products alter column reference_no set default public.next_product_ref();
alter table public.products alter column reference_no set not null;
create unique index if not exists products_reference_no_key on public.products (reference_no);

-- -----------------------------------------------------------------------------
-- 2. Store settings: GST % and default MOQ (existing values are kept)
-- -----------------------------------------------------------------------------
update public.settings
   set value = jsonb_build_object('gstRate', 18, 'defaultMoq', 10) || value,
       updated_at = now()
 where key = 'store'
   and not (value ? 'gstRate' and value ? 'defaultMoq');

-- -----------------------------------------------------------------------------
-- 3. Email verification on the profile
-- -----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists email_verified_at timestamptz,
  add column if not exists verified_email text;

-- A signed-in customer can edit their own profile row (name, phone). Without
-- this trigger they could also promote themselves to admin or mark their own
-- email verified. Those columns now only change for the server (service role),
-- an admin, or a direct SQL session.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') in ('anon', 'authenticated') and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.role := 'customer';
      new.email_verified_at := null;
      new.verified_email := null;
    else
      new.role := old.role;
      new.email_verified_at := old.email_verified_at;
      new.verified_email := old.verified_email;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_protect_privileges on public.profiles;
create trigger profiles_protect_privileges
  before insert or update on public.profiles
  for each row execute function public.protect_profile_privileges();

-- -----------------------------------------------------------------------------
-- 4. One-time codes (read and written by the server with the service role only)
-- -----------------------------------------------------------------------------
create table if not exists public.email_otps (
  user_id      uuid primary key references auth.users on delete cascade,
  email        text not null,
  code_hash    text not null,
  expires_at   timestamptz not null,
  attempts     integer not null default 0,
  sent_count   integer not null default 1,
  window_start timestamptz not null default now(),
  last_sent_at timestamptz not null default now()
);

alter table public.email_otps enable row level security;
revoke all on public.email_otps from anon, authenticated;

-- -----------------------------------------------------------------------------
-- 5. GST on orders
-- -----------------------------------------------------------------------------
alter table public.orders
  add column if not exists tax numeric(12,2) not null default 0;

alter table public.order_items
  add column if not exists gst_rate numeric(5,2) not null default 0,
  add column if not exists tax numeric(12,2) not null default 0,
  add column if not exists reference_no text;

-- -----------------------------------------------------------------------------
-- 6. Checkout
-- Prices, MOQ and GST are recomputed from the products table, so a tampered
-- client payload cannot change what an order costs. Quantity is no longer
-- limited by the stock count; a stock of 0 still means "out of stock".
-- -----------------------------------------------------------------------------
create or replace function public.place_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user        uuid := auth.uid();
  v_profile     public.profiles%rowtype;
  v_store       jsonb;
  v_order_id    uuid;
  v_number      text;
  v_subtotal    numeric(12,2) := 0;
  v_tax         numeric(12,2) := 0;
  v_shipping    numeric(12,2) := 0;
  v_free_above  numeric(12,2);
  v_fee         numeric(12,2);
  v_store_gst   numeric(5,2);
  v_store_moq   integer;
  v_item        jsonb;
  v_product     public.products%rowtype;
  v_qty         integer;
  v_moq         integer;
  v_rate        numeric(5,2);
  v_line        numeric(12,2);
  v_line_tax    numeric(12,2);
  v_items       jsonb := '[]'::jsonb;
begin
  if v_user is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into v_profile from public.profiles where id = v_user;
  if not found or (v_profile.role <> 'admin' and v_profile.email_verified_at is null) then
    raise exception 'EMAIL_NOT_VERIFIED';
  end if;

  if jsonb_array_length(coalesce(payload -> 'items', '[]'::jsonb)) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  select value into v_store from public.settings where key = 'store';
  v_free_above := coalesce((v_store ->> 'freeShippingAbove')::numeric, 999);
  v_fee        := coalesce((v_store ->> 'shippingFee')::numeric, 59);
  v_store_gst  := coalesce((v_store ->> 'gstRate')::numeric, 18);
  v_store_moq  := greatest(1, coalesce((v_store ->> 'defaultMoq')::int, 10));

  for v_item in select * from jsonb_array_elements(payload -> 'items')
  loop
    v_qty := coalesce((v_item ->> 'qty')::int, 0);

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id') and is_active;

    if not found then
      raise exception 'PRODUCT_UNAVAILABLE: %', v_item ->> 'product_id';
    end if;

    if v_product.stock <= 0 then
      raise exception 'OUT_OF_STOCK: %', v_product.name;
    end if;

    v_moq := coalesce(v_product.moq, v_store_moq);
    if v_qty < v_moq then
      raise exception 'BELOW_MOQ: % (minimum %)', v_product.name, v_moq;
    end if;

    if v_qty > 99999 then
      raise exception 'QTY_TOO_LARGE: %', v_product.name;
    end if;

    v_rate     := coalesce(v_product.gst_rate, v_store_gst);
    v_line     := round(v_product.price * v_qty, 2);
    v_line_tax := round(v_line * v_rate / 100, 2);
    v_subtotal := v_subtotal + v_line;
    v_tax      := v_tax + v_line_tax;

    v_items := v_items || jsonb_build_object(
      'product_id',   v_product.id,
      'reference_no', v_product.reference_no,
      'name',         v_product.name,
      'image',        coalesce(v_product.images[1], ''),
      'price',        v_product.price,
      'qty',          v_qty,
      'line_total',   v_line,
      'gst_rate',     v_rate,
      'tax',          v_line_tax
    );
  end loop;

  -- The free-delivery threshold is on the goods value, before GST.
  v_shipping := case when v_subtotal >= v_free_above then 0 else v_fee end;
  v_number := public.next_order_number();

  insert into public.orders (
    order_number, user_id, subtotal, tax, shipping, total, payment_method,
    customer_name, customer_email, customer_phone,
    address_line1, address_line2, city, state, pincode, notes
  ) values (
    v_number, v_user, v_subtotal, v_tax, v_shipping, v_subtotal + v_tax + v_shipping, 'cod',
    payload ->> 'customer_name', payload ->> 'customer_email', payload ->> 'customer_phone',
    payload ->> 'address_line1', payload ->> 'address_line2',
    payload ->> 'city', payload ->> 'state', payload ->> 'pincode', payload ->> 'notes'
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id, product_id, reference_no, name, image, price, qty, line_total, gst_rate, tax
  )
  select v_order_id,
         i ->> 'product_id',
         i ->> 'reference_no',
         i ->> 'name',
         i ->> 'image',
         (i ->> 'price')::numeric,
         (i ->> 'qty')::int,
         (i ->> 'line_total')::numeric,
         (i ->> 'gst_rate')::numeric,
         (i ->> 'tax')::numeric
  from jsonb_array_elements(v_items) i;

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_number,
    'subtotal', v_subtotal,
    'tax', v_tax,
    'shipping', v_shipping,
    'total', v_subtotal + v_tax + v_shipping
  );
end;
$$;

revoke all on function public.place_order(jsonb) from public, anon;
grant execute on function public.place_order(jsonb) to authenticated;
