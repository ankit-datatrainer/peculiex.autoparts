/**
 * Adds the shop parts list (scripts/parts-list/parts.mjs) to every model.
 *
 *   node scripts/add-parts-list.mjs            dry run — prints the plan
 *   node scripts/add-parts-list.mjs --write    writes to Supabase
 *
 * Idempotent: product ids are derived from (part, model), so re-running
 * updates the same rows instead of adding copies.
 *
 * Rules
 *   - A part is listed only on vehicles it exists on (no spark plug on an EV,
 *     no clutch plate on a scooter, carburettor parts only on carburetted
 *     model families, …).
 *   - Where a model already has a real scraped listing in the same category,
 *     that listing is kept and nothing is added for it.
 *   - Price: the real median price of that part type across the catalog for
 *     the same brand, else the whole catalog, else the sheet baseline — then
 *     scaled by how expensive this model's parts are relative to the rest.
 *   - Picture: a real photo of the same part type (same brand and vehicle type
 *     first), or a themed illustration where the catalog has no photo of it.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PARTS, GROUPS, FI_ONLY, BS6_ERA, BIKE, SCOOTER, EV } from './parts-list/parts.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WRITE = process.argv.includes('--write');
const TAG = 'motomart-parts-list';

for (const file of ['.env.local', '.env']) {
  try {
    for (const line of readFileSync(join(HERE, '..', file), 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* optional */
  }
}
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'misc';

const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Deterministic 0..1 from a string, so prices and discounts are stable run to run.
const hash01 = (s) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10000) / 10000;
};

// ₹ values that look like shop prices: 179, 249, 1,290 …
const shopPrice = (n) => {
  if (n < 1000) return Math.max(49, Math.round(n / 10) * 10 - 1);
  return Math.round(n / 10) * 10;
};

async function readAll(table, columns) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(columns).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...data);
    if (data.length < 1000) return out;
  }
}

// ---- load ----------------------------------------------------------------------
const [brands, models, categories, products, links] = await Promise.all([
  readAll('brands', 'id, name'),
  readAll('models', 'id, brand_id, slug, name, type, vehicle_type'),
  readAll('categories', 'id, name, group_id'),
  readAll('products', 'id, brand_id, category_id, price, images, tags'),
  readAll('product_models', 'product_id, model_id')
]);

const categoryIds = new Set(categories.map((c) => c.id));
for (const p of PARTS) {
  const id = slugify(p.category);
  if (p.existing && !categoryIds.has(id)) throw new Error(`"${p.name}": expected existing category ${id}`);
  if (p.photoFrom && !categoryIds.has(p.photoFrom)) throw new Error(`"${p.name}": no category ${p.photoFrom}`);
}

// Real scraped listings only — our own rows and the synthetic EV rows are
// never used as a price or photo source.
const real = products.filter((p) => p.id.startsWith('ea-') && !(p.tags || []).includes(TAG));
const realById = new Map(real.map((p) => [p.id, p]));

const modelById = new Map(models.map((m) => [m.id, m]));
const modelCats = new Map(); // model uuid -> Set(category ids with a real listing)
for (const l of links) {
  const p = realById.get(l.product_id);
  if (!p) continue;
  if (!modelCats.has(l.model_id)) modelCats.set(l.model_id, new Set());
  modelCats.get(l.model_id).add(p.category_id);
}

const vehicleClass = (m) => (/electric/i.test(m.vehicle_type || '') ? EV : m.type === 'scooter' ? SCOOTER : BIKE);

// ---- how pricey is each model's catalog? ---------------------------------------
// For each real listing: its price relative to the median of its category.
// A model's factor is the median of those ratios — mix-independent.
const catMedian = new Map();
{
  const byCat = new Map();
  for (const p of real) (byCat.get(p.category_id) || byCat.set(p.category_id, []).get(p.category_id)).push(Number(p.price));
  // One or two listings are an anecdote, not a price: the category median is
  // only trusted with five or more real listings behind it.
  for (const [c, xs] of byCat) if (xs.length >= 5) catMedian.set(c, median(xs));
}
const modelFactor = new Map();
{
  const ratios = new Map();
  for (const l of links) {
    const p = realById.get(l.product_id);
    const cm = p && catMedian.get(p.category_id);
    if (!cm) continue;
    (ratios.get(l.model_id) || ratios.set(l.model_id, []).get(l.model_id)).push(Number(p.price) / cm);
  }
  const brandRatios = new Map();
  for (const [mid, rs] of ratios) {
    const b = modelById.get(mid)?.brand_id;
    (brandRatios.get(b) || brandRatios.set(b, []).get(b)).push(...rs);
  }
  for (const m of models) {
    const rs = ratios.get(m.id) || [];
    let f = rs.length >= 3 ? median(rs) : median(brandRatios.get(m.brand_id) || []) ?? 1;
    if (vehicleClass(m) === EV) f = 1.3; // EV rows are synthetic; fixed premium
    modelFactor.set(m.id, Math.min(2.2, Math.max(0.8, f)));
  }
}

// ---- reference prices and photos per part type ---------------------------------
function referencePrice(part, brandId) {
  const src = part.existing ? slugify(part.category) : part.photoFrom;
  if (src) {
    const sameBrand = real.filter((p) => p.category_id === src && p.brand_id === brandId).map((p) => Number(p.price));
    if (sameBrand.length >= 3) return { price: median(sameBrand), from: 'brand' };
    const any = catMedian.get(src);
    if (any) return { price: any, from: 'catalog' };
  }
  return { price: part.base, from: 'baseline' };
}

const photoPool = new Map(); // category -> [{brand, cls, url}]
for (const l of links) {
  const p = realById.get(l.product_id);
  const m = modelById.get(l.model_id);
  const url = p?.images?.[0];
  if (!p || !m || !url) continue;
  (photoPool.get(p.category_id) || photoPool.set(p.category_id, []).get(p.category_id)).push({
    brand: m.brand_id,
    cls: vehicleClass(m),
    url
  });
}
function photoFor(part, model) {
  if (part.photoFrom) {
    const pool = photoPool.get(part.photoFrom) || [];
    const cls = vehicleClass(model);
    // A bike's part photographed on a scooter listing misleads more than a
    // clean illustration does, so the vehicle type has to match.
    const pick =
      pool.filter((x) => x.brand === model.brand_id && x.cls === cls)[0] ||
      pool.filter((x) => x.cls === cls)[0];
    if (pick) return { url: pick.url, kind: 'photo' };
  }
  return { url: `/assets/parts-art/${part.art || ART_FALLBACK[part.key] || 'generic'}.svg`, kind: 'art' };
}

// Illustration for photo-sourced parts when no same-type photo exists.
const ART_FALLBACK = {
  'fuel-pump-assy': 'pump', 'fuel-pump-motor': 'pump', injector: 'injector-cap', carburettor: 'carb',
  'self-motor': 'motor', 'disc-plate': 'disc', caliper: 'caliper', 'master-cylinder': 'lever',
  'one-way-clutch': 'clutch-disc', 'piston-kit': 'piston', 'cylinder-block': 'piston', 'footrest-assy': 'bracket',
  'handle-tee': 'handlebar', 'ball-racer': 'bearing', 'chain-sprocket': 'chain', 'clutch-plate': 'clutch-disc',
  'ignition-lock': 'lock', 'head-light': 'headlight', 'speedo-machine': 'speedo', 'speedo-assy': 'speedo',
  'headlight-dome': 'headlight', valve: 'valve', 'rocker-arm': 'lever', 'cam-shaft': 'camshaft',
  'clutch-assembly': 'clutch-disc', 'gear-lever': 'lever', 'gear-shaft': 'shaft', 'kick-shaft': 'shaft',
  'kick-lever': 'lever', 'kick-boss': 'gear', 'brake-drum': 'disc', 'shocker-assy': 'shocker',
  shocker: 'shocker', jhula: 'bracket', 'silent-block-bush': 'rubber'
};

// ---- display names -----------------------------------------------------------
const BRAND_LABEL = {
  bajaj: 'Bajaj', hero: 'Hero', tvs: 'TVS', honda: 'Honda', yamaha: 'Yamaha', suzuki: 'Suzuki',
  'royal-enfield': 'Royal Enfield', mahindra: 'Mahindra', ola: 'Ola', ather: 'Ather',
  iqube: 'TVS', vida: 'Vida', kawasaki: 'Kawasaki', ktm: 'KTM'
};
function vehicleName(m) {
  const brand = BRAND_LABEL[m.brand_id] || m.brand_id;
  let name = m.name.replace(/\s+spare parts$/i, '').trim();
  if (m.brand_id === 'ktm' && /^ktm$/i.test(name)) name = 'Duke & RC';
  if (m.brand_id === 'kawasaki' && /^kawasaki$/i.test(name)) name = 'Ninja';
  const first = name.split(/\s+/)[0].toLowerCase();
  return first === brand.toLowerCase() || name.toLowerCase().startsWith(brand.toLowerCase() + ' ')
    ? name
    : `${brand} ${name}`;
}

// ---- plan ----------------------------------------------------------------------
const fuelOf = (m) => {
  const cats = modelCats.get(m.id) || new Set();
  const carbEvidence = cats.has('carburetor') || cats.has('carburetor-repair-kit');
  const fiEvidence = ['fuel-injector', 'fuel-pump-assembly', 'fuel-pump-motor', 'throttle-sensor', 'body-throttle-assembly'].some((c) => cats.has(c));
  const fiOnly = FI_ONLY.test(m.brand_id) || FI_ONLY.test(m.name);
  return {
    fi: fiOnly || fiEvidence || BS6_ERA.test(m.name),
    carb: !fiOnly || carbEvidence
  };
};

const rows = [];
const fits = [];
const skipped = [];
const perPart = new Map(PARTS.map((p) => [p.key, { added: 0, kept: 0, n_a: 0, photo: 0, art: 0, prices: [] }]));

for (const m of models) {
  const cls = vehicleClass(m);
  const fuel = fuelOf(m);
  const have = modelCats.get(m.id) || new Set();
  const vName = vehicleName(m);

  for (const part of PARTS) {
    const stat = perPart.get(part.key);
    const applies =
      part.fits.includes(cls) &&
      !(part.noBrands || []).includes(m.brand_id) &&
      !(part.fuel === 'fi' && !fuel.fi) &&
      !(part.fuel === 'carb' && !fuel.carb);
    if (!applies) {
      stat.n_a++;
      continue;
    }

    const categoryId = slugify(part.category);
    if (part.existing && have.has(categoryId)) {
      stat.kept++;
      skipped.push(`${part.name} · ${vName}`);
      continue;
    }

    const ref = referencePrice(part, m.brand_id);
    // Two parts share a category (e.g. speedometer machine vs assembly); the
    // cheaper sub-unit is priced below the reference.
    // Lock Set listings bundle ignition, tank and seat locks.
    const SHARE = { 'speedo-machine': 0.8, shocker: 0.55, 'ignition-lock': 0.65 };
    const share = SHARE[part.key] || 1;
    const price = shopPrice(ref.price * share * (ref.from === 'brand' ? 1 : modelFactor.get(m.id)));
    const off = 0.15 + hash01(part.key + m.id) * 0.17; // 15–32 % off, like the rest of the catalog
    const mrp = Math.max(price + 10, Math.round(price / (1 - off) / 10) * 10);

    const img = photoFor(part, m);
    stat.added++;
    stat[img.kind]++;
    stat.prices.push(price);

    // "Combi Brake Cable | Left Hand" -> "Combi Brake Cable for X | Left Hand"
    const [head, qualifier] = part.name.split(' | ');
    const name = `${head} for ${vName}${qualifier ? ` | ${qualifier}` : ''}`;
    const id = `mm-${part.key}-${m.brand_id}-${m.slug}`.slice(0, 120);

    rows.push({
      id,
      name,
      sku: `MM-${part.key.toUpperCase().slice(0, 14)}-${m.brand_id.slice(0, 3).toUpperCase()}-${hash01(id).toFixed(4).slice(2)}`,
      brand_id: m.brand_id,
      category_id: categoryId,
      vendor: 'MotoMart',
      description: `${part.desc} Listed for the ${vName}; compare with your old part or check your chassis number before ordering.`,
      price,
      mrp,
      stock: 25,
      images: [img.url],
      fitment: `Fits ${vName}`,
      tags: [TAG, `sheet-${part.sheet}`, img.kind],
      source_url: null,
      is_active: true
    });
    fits.push({ product_id: id, model_id: m.id });
  }
}

// ---- new categories ------------------------------------------------------------
const newCategories = new Map();
for (const part of PARTS) {
  if (part.existing) continue;
  const id = slugify(part.category);
  if (categoryIds.has(id) || newCategories.has(id)) continue;
  const firstRow = rows.find((r) => r.category_id === id);
  newCategories.set(id, {
    id,
    name: part.category,
    description: part.desc,
    image: firstRow?.images?.[0] || null,
    sort_order: 200 + newCategories.size,
    is_active: true,
    group_id: part.group
  });
}

// Existing categories that were filed under a group that does not exist yet.
const groupIds = new Set((await readAll('category_groups', 'id')).map((g) => g.id).concat(GROUPS.map((g) => g.id)));
const { groupForCategory } = await import('../src/lib/categoryGroupRules.js');
const regroup = categories
  .filter((c) => !c.group_id || !groupIds.has(c.group_id))
  .map((c) => ({ id: c.id, group_id: groupForCategory(c.name) }))
  .filter((c) => c.group_id && groupIds.has(c.group_id));

// ---- report --------------------------------------------------------------------
console.log(`\n${WRITE ? 'WRITING' : 'DRY RUN'} — ${models.length} models, ${PARTS.length} part types\n`);
console.log('line  part                                     added  kept  n/a  photo  art   price range');
for (const part of PARTS) {
  const s = perPart.get(part.key);
  const lo = s.prices.length ? Math.min(...s.prices) : '-';
  const hi = s.prices.length ? Math.max(...s.prices) : '-';
  console.log(
    `${String(part.sheet).padStart(4)}  ${part.name.slice(0, 40).padEnd(40)} ${String(s.added).padStart(5)} ${String(s.kept).padStart(5)} ${String(s.n_a).padStart(4)} ${String(s.photo).padStart(6)} ${String(s.art).padStart(4)}   ₹${lo}–₹${hi}`
  );
}
const photos = rows.filter((r) => r.tags.includes('photo')).length;
console.log(`\nproducts to add:        ${rows.length}  (${photos} with a real photo, ${rows.length - photos} illustrated)`);
console.log(`real listings kept:     ${skipped.length}`);
console.log(`new categories:         ${newCategories.size}`);
console.log(`groups to add:          ${GROUPS.filter((g) => !groupIds.has(g.id) || true).length}`);
console.log(`categories regrouped:   ${regroup.length}`);

if (!WRITE) {
  console.log('\nsample rows:');
  for (const r of [rows[0], rows[Math.floor(rows.length / 3)], rows[Math.floor(rows.length / 2)], rows[rows.length - 1]])
    console.log(`  ${r.id}\n    ${r.name}  ₹${r.price} (MRP ₹${r.mrp})  ${r.category_id}  ${r.images[0].slice(0, 70)}`);
  console.log('\nRe-run with --write to apply.\n');
  process.exit(0);
}

// ---- write ---------------------------------------------------------------------
async function upsert(table, data, onConflict) {
  for (let i = 0; i < data.length; i += 500) {
    const { error } = await db.from(table).upsert(data.slice(i, i + 500), { onConflict });
    if (error) throw new Error(`${table}: ${error.message}`);
    process.stdout.write(`\r  ${table}: ${Math.min(i + 500, data.length)}/${data.length}`);
  }
  process.stdout.write(`\r  ${table}: ${data.length} ✓          \n`);
}

await upsert('category_groups', GROUPS.map((g) => ({ ...g, is_active: true })), 'id');
await upsert('categories', [...newCategories.values()], 'id');
for (const c of regroup) {
  const { error } = await db.from('categories').update({ group_id: c.group_id }).eq('id', c.id);
  if (error) throw new Error(`regroup ${c.id}: ${error.message}`);
}
console.log(`  categories regrouped: ${regroup.length} ✓`);
await upsert('products', rows, 'id');
await upsert('product_models', fits, 'product_id,model_id');
console.log('\nDone.\n');
