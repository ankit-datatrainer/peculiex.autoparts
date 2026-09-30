/**
 * Adds a "Digital Speedometer for <vehicle>" listing to every model that does
 * not already have a digital speedometer.
 *
 *   node scripts/add-digital-speedometers.mjs            dry run — prints the plan
 *   node scripts/add-digital-speedometers.mjs --write    writes to Supabase
 *
 * Every model already has a speedometer (real listings or the "Speedometer
 * Assembly" from the parts list); this adds the digital console as a separate
 * product, skipping the models where the catalog already sells one.
 *
 * Idempotent: ids are mm-digital-speedo-<brand>-<model>, so re-running updates
 * the same rows. Tagged motomart-parts-list like the rest of that batch.
 *
 * Price: median of real digital-speedometer listings for the same brand (3 or
 * more), else for the same vehicle type, else all of them; electric models get
 * the parts list's fixed 1.3x. Picture: the front and back photos of a real
 * digital speedometer of the same vehicle type (same brand first), else the
 * speedometer illustration.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WRITE = process.argv.includes('--write');
const TAG = 'motomart-parts-list';
const DIGITAL = /digital|tft|lcd|display/i;

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

const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const hash01 = (s) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 10000) / 10000;
};
const shopPrice = (n) => (n < 1000 ? Math.max(49, Math.round(n / 10) * 10 - 1) : Math.round(n / 10) * 10);

async function readAll(table, columns, filter) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    let q = db.from(table).select(columns).range(from, from + 999);
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...data);
    if (data.length < 1000) return out;
  }
}

const [models, speedos] = await Promise.all([
  readAll('models', 'id, brand_id, slug, name, type, vehicle_type'),
  readAll('products', 'id, name, brand_id, price, images, tags, is_active', (q) => q.eq('category_id', 'speedometer'))
]);
const links = [];
for (let i = 0; i < speedos.length; i += 200) {
  const ids = speedos.slice(i, i + 200).map((p) => p.id);
  const { data, error } = await db.from('product_models').select('product_id, model_id').in('product_id', ids);
  if (error) throw new Error(error.message);
  links.push(...data);
}

const vehicleClass = (m) => (/electric/i.test(m.vehicle_type || '') ? 'ev' : m.type === 'scooter' ? 'scooter' : 'bike');
const modelById = new Map(models.map((m) => [m.id, m]));
const byId = new Map(speedos.map((p) => [p.id, p]));

// Real (scraped) digital speedometers, with the vehicle type they are listed for.
const realDigital = [];
const hasDigital = new Set(); // model ids that already sell one (ours included)
for (const l of links) {
  const p = byId.get(l.product_id);
  const m = modelById.get(l.model_id);
  if (!p || !m || !DIGITAL.test(p.name)) continue;
  if (p.id !== `mm-digital-speedo-${m.brand_id}-${m.slug}`) hasDigital.add(m.id);
  if (p.id.startsWith('ea-') && !(p.tags || []).includes(TAG) && p.is_active) {
    realDigital.push({ ...p, cls: vehicleClass(m), model: m.id });
  }
}

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

function referencePrice(m) {
  const cls = vehicleClass(m);
  const sameBrand = realDigital.filter((p) => p.brand_id === m.brand_id).map((p) => Number(p.price));
  if (sameBrand.length >= 3) return median(sameBrand);
  const sameClass = realDigital.filter((p) => p.cls === (cls === 'ev' ? 'scooter' : cls)).map((p) => Number(p.price));
  const base = sameClass.length >= 5 ? median(sameClass) : median(realDigital.map((p) => Number(p.price)));
  return cls === 'ev' ? base * 1.3 : base;
}

function photosFor(m) {
  const cls = vehicleClass(m);
  const pool = realDigital.filter((p) => p.cls === cls && p.images?.length);
  const pick = pool.find((p) => p.brand_id === m.brand_id) || pool[0];
  if (pick) return { images: pick.images.slice(0, 2), kind: 'photo' };
  return { images: ['/assets/parts-art/speedo.svg'], kind: 'art' };
}

const rows = [];
const fits = [];
let skipped = 0;
for (const m of models) {
  if (hasDigital.has(m.id)) {
    skipped++;
    continue;
  }
  const vName = vehicleName(m);
  const id = `mm-digital-speedo-${m.brand_id}-${m.slug}`.slice(0, 120);
  const price = shopPrice(referencePrice(m));
  const off = 0.15 + hash01('digital-speedo' + m.id) * 0.17; // 15–32 % off, like the rest of the catalog
  const mrp = Math.max(price + 10, Math.round(price / (1 - off) / 10) * 10);
  const img = photosFor(m);
  const ev = vehicleClass(m) === 'ev';

  rows.push({
    id,
    name: `Digital Speedometer for ${vName}`,
    sku: `MM-DIGITAL-SPEEDO-${m.brand_id.slice(0, 3).toUpperCase()}-${hash01(id).toFixed(4).slice(2)}`,
    brand_id: m.brand_id,
    category_id: 'speedometer',
    vendor: 'MotoMart',
    description: `${
      ev
        ? 'Digital instrument display showing speed, trip and riding information.'
        : 'Digital speedometer console showing speed, odometer and trip readings.'
    } Listed for the ${vName}; compare the shape, mounting points and wiring coupler with your old meter before ordering.`,
    price,
    mrp,
    stock: 25,
    images: img.images,
    fitment: `Fits ${vName}`,
    tags: [TAG, 'digital-speedometer', img.kind],
    source_url: null,
    is_active: true
  });
  fits.push({ product_id: id, model_id: m.id });
}

const prices = rows.map((r) => r.price);
console.log(`\n${WRITE ? 'WRITING' : 'DRY RUN'} — ${models.length} models`);
console.log(`real digital speedometer listings: ${realDigital.length}`);
console.log(`models that already have one:      ${skipped}`);
console.log(`digital speedometers to add:       ${rows.length}  (${rows.filter((r) => r.tags.includes('photo')).length} real photos, ${rows.filter((r) => r.tags.includes('art')).length} illustrated)`);
if (rows.length) console.log(`price range:                       ₹${Math.min(...prices)}–₹${Math.max(...prices)}`);
for (const r of rows.slice(0, 6)) console.log(`  ${r.id}  ₹${r.price} (MRP ₹${r.mrp})  ${r.images.length} image(s)`);

if (!WRITE) {
  console.log('\nRe-run with --write to apply.\n');
  process.exit(0);
}

for (let i = 0; i < rows.length; i += 500) {
  const { error } = await db.from('products').upsert(rows.slice(i, i + 500), { onConflict: 'id' });
  if (error) throw new Error(`products: ${error.message}`);
}
const { error } = await db.from('product_models').upsert(fits, { onConflict: 'product_id,model_id' });
if (error) throw new Error(`product_models: ${error.message}`);
console.log(`\nAdded ${rows.length} digital speedometers.\n`);
