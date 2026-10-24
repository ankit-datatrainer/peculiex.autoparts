-- =============================================================================
-- MOTOMART 0004 — bulk pricing on MRP
--
-- 1-9 pieces of a part are sold at MRP; 10 or more at 60 % off MRP. Both
-- numbers live in the store settings (Admin -> Settings): bulkDiscount (%)
-- and bulkMinQty. A discount of 0 switches it off and the product's own
-- selling price is charged, as before.
--
-- place_order() computes the unit price the same way as the storefront, so a
-- tampered cart cannot change what an order costs.
--
-- Run once in the Supabase SQL editor (after 0003). Safe to re-run.
-- =============================================================================

update public.settings
   set value = jsonb_build_object('bulkDiscount', 60, 'bulkMinQty', 10) || value,
       updated_at = now()
 where key = 'store'
   and not (value ? 'bulkDiscount' and value ? 'bulkMinQty');

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
  v_bulk_pct    numeric(5,2);
  v_bulk_min    integer;
  v_unit        numeric(12,2);
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
  v_bulk_pct   := least(100, greatest(0, coalesce((v_store ->> 'bulkDiscount')::numeric, 60)));
  v_bulk_min   := greatest(1, coalesce((v_store ->> 'bulkMinQty')::int, 10));

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

    -- Bulk pricing on MRP: below the threshold the piece costs MRP, at or
    -- above it MRP minus the bulk discount. Off (0 %) or no MRP: selling price.
    v_unit := case
      when v_bulk_pct > 0 and v_product.mrp > 0 then
        case when v_qty >= v_bulk_min
             then round(v_product.mrp * (1 - v_bulk_pct / 100), 2)
             else v_product.mrp end
      else v_product.price
    end;

    v_rate     := coalesce(v_product.gst_rate, v_store_gst);
    v_line     := round(v_unit * v_qty, 2);
    v_line_tax := round(v_line * v_rate / 100, 2);
    v_subtotal := v_subtotal + v_line;
    v_tax      := v_tax + v_line_tax;

    v_items := v_items || jsonb_build_object(
      'product_id',   v_product.id,
      'reference_no', v_product.reference_no,
      'name',         v_product.name,
      'image',        coalesce(v_product.images[1], ''),
      'price',        v_unit,
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
