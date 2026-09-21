-- =============================================================================
-- MOTOMART 0002 — shopper-facing category groups + catalog counts
--
-- 1. category_groups: the 86 flat part categories roll up into a handful of
--    groups a rider actually shops by ("Front wheel parts", "Lights", …).
-- 2. catalog_counts(): counting by fetching rows hits PostgREST's 1000-row cap,
--    which under-reported every brand. Counting in the database fixes that and
--    returns brand, model and category totals in a single round trip.
--
-- Safe to re-run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Category groups
-- -----------------------------------------------------------------------------
create table if not exists public.category_groups (
  id          text primary key,
  name        text not null,
  description text not null default '',
  image       text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.categories
  add column if not exists group_id text references public.category_groups on delete set null;

create index if not exists idx_categories_group on public.categories (group_id);

insert into public.category_groups (id, name, description, sort_order) values
  ('handle-steering',  'Handle & Steering',      'Handlebars, tees, levers, switches and steering hardware.', 1),
  ('front-wheel',      'Front Wheel Parts',      'Forks, rims, discs, drums, mudguards and front axle parts.', 2),
  ('handle',           'Handle',                 'Handlebars, grips and handle assemblies.',                   3),
  ('oil-seals',        'Oil, Seals & Lubricants','Engine oil, gear oil, oil seals and O-rings.',               4),
  ('bearing',          'Bearings & Bushes',      'Wheel bearings, ball racer sets, bushes and kits.',          5),
  ('lights',           'Lights & Indicators',    'Head lamps, tail lamps, indicators and bulbs.',              6),
  ('fuel-supply',      'Fuel Supply System',     'Carburettors, injectors, pumps, tanks and throttle bodies.', 7),
  ('pipes-hoses',      'Pipes & Hoses',          'Fork pipes, fuel lines, brake hoses and silencers.',         8)
on conflict (id) do update
  set name = excluded.name,
      description = excluded.description,
      sort_order = excluded.sort_order;

-- Map the existing flat categories onto those groups. Ordered most specific
-- first so, e.g., "Fork Pipe" lands in front-wheel rather than pipes-hoses.
do $$
declare
  rule record;
begin
  for rule in
    select * from (values
      ('handle-steering', '(handle|steering|yoke|tee|grip|lever|switch)'),
      ('front-wheel',     '(front|fork|wheel|rim|spoke|axle|mudguard|disc|drum|caliper|master cylinder)'),
      ('oil-seals',       '(^oil|lubric|seal|o.?ring|gasket)'),
      ('bearing',         '(bearing|racer|bush)'),
      ('lights',          '(light|lamp|indicator|bulb|blinker)'),
      ('fuel-supply',     '(fuel|carburet|carburat|petrol|tank|injector|pump|throttle|choke)'),
      ('pipes-hoses',     '(pipe|hose|tube|silencer|exhaust|manifold)')
    ) as t(gid, pattern)
  loop
    update public.categories c
       set group_id = rule.gid
     where c.group_id is null
       and c.name ~* rule.pattern;
  end loop;
end $$;

-- "Handle" is a narrower view inside Handle & Steering, so point it at both:
-- the dedicated group takes precedence for the handful of pure handle parts.
update public.categories
   set group_id = 'handle'
 where name in ('Handle', 'Handle Bar Switch', 'Handle Tee');

-- Give every group a real photo, borrowed from a product inside it.
update public.category_groups g
   set image = sub.img
  from (
    select c.group_id, (array_agg(p.images[1] order by p.created_at))[1] as img
      from public.categories c
      join public.products p on p.category_id = c.id
     where c.group_id is not null
       and p.images is not null
       and array_length(p.images, 1) > 0
     group by c.group_id
  ) sub
 where g.id = sub.group_id
   and (g.image is null or g.image = '');

alter table public.category_groups enable row level security;

drop policy if exists category_groups_read on public.category_groups;
create policy category_groups_read on public.category_groups for select using (true);

drop policy if exists category_groups_admin_write on public.category_groups;
create policy category_groups_admin_write on public.category_groups
  for all using (public.is_admin()) with check (public.is_admin());

grant select on public.category_groups to anon, authenticated;
grant insert, update, delete on public.category_groups to authenticated;

-- -----------------------------------------------------------------------------
-- 2. Catalog counts
-- -----------------------------------------------------------------------------
create or replace function public.catalog_counts()
returns jsonb
language sql
stable
as $$
  with brand_counts as (
    select brand_id, count(*)::int n
      from public.products
     where is_active and brand_id is not null
     group by brand_id
  ),
  model_counts as (
    select pm.model_id, count(*)::int n
      from public.product_models pm
      join public.products p on p.id = pm.product_id
     where p.is_active
     group by pm.model_id
  ),
  category_counts as (
    select category_id, count(*)::int n
      from public.products
     where is_active and category_id is not null
     group by category_id
  ),
  group_counts as (
    select c.group_id, count(*)::int n
      from public.products p
      join public.categories c on c.id = p.category_id
     where p.is_active and c.group_id is not null
     group by c.group_id
  ),
  model_top as (
    select model_id, jsonb_agg(name order by n desc) as cats
      from (
        select pm.model_id, c.name, count(*)::int n,
               row_number() over (partition by pm.model_id order by count(*) desc, c.name) rn
          from public.product_models pm
          join public.products p   on p.id = pm.product_id
          join public.categories c on c.id = p.category_id
         where p.is_active
         group by pm.model_id, c.name
      ) ranked
     where rn <= 3
     group by model_id
  )
  select jsonb_build_object(
    'brands',     coalesce((select jsonb_object_agg(brand_id, n)            from brand_counts),    '{}'::jsonb),
    'models',     coalesce((select jsonb_object_agg(model_id::text, n)      from model_counts),    '{}'::jsonb),
    'categories', coalesce((select jsonb_object_agg(category_id, n)         from category_counts), '{}'::jsonb),
    'groups',     coalesce((select jsonb_object_agg(group_id, n)            from group_counts),    '{}'::jsonb),
    'modelTop',   coalesce((select jsonb_object_agg(model_id::text, cats)   from model_top),       '{}'::jsonb),
    'total',      (select count(*)::int from public.products where is_active)
  );
$$;

grant execute on function public.catalog_counts() to anon, authenticated;
