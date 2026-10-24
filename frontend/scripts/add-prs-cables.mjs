/**
 * Adds the PRS control-cable price list (scripts/prs/prs-cables.mjs).
 *
 *   node scripts/add-prs-cables.mjs            dry run — prints the plan
 *   node scripts/add-prs-cables.mjs --write    writes to Supabase
 *
 * One product per PRS part number, linked to every model on the site that the
 * "vehicle details" column names. The PRS part number is the product's
 * reference number; the OEM number is kept in the SKU field.
 *
 * Price: the list MRP is the MRP. The selling price stored is MRP minus the
 * store's bulk discount (60 %), which is what 10+ pieces cost; the storefront
 * and place_order() charge MRP below 10 pieces.
 * MOQ: the standard pack from the list (10, or 5 for combi and rear brake).
 *
 * Idempotent: ids are prs-<part no>.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PRS_ROWS, MODEL_RULES, SIZED_RULES } from './prs/prs-cables.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const WRITE = process.argv.includes('--write');
const TAG = 'prs-price-list';
const BULK_DISCOUNT = 60;

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

const { data: models, error: modelError } = await db.from('models').select('id, brand_id, slug, name');
if (modelError) throw modelError;
const modelByKey = new Map(models.map((m) => [`${m.brand_id}/${m.slug}`, m]));

const CATEGORY = [
  [/combi/i, 'combi-brake-cable'],
  [/clutch/i, 'clutch-cable'],
  [/accelerator/i, 'accelerator-cable'],
  [/front brake/i, 'front-brake-cable'],
  [/rear brake/i, 'rear-brake-cable'],
  [/choke/i, 'choke-cable'],
  [/seat lock/i, 'seat-lock-cable'],
  [/speedometer/i, 'speedometer-cable'],
  [/.*/, 'cables']
];

const BRAND_LABEL = { hero: 'Hero', honda: 'Honda', yamaha: 'Yamaha', bajaj: 'Bajaj', mahindra: 'Mahindra' };

/** The part of `text` that belongs to keyword `re` — up to the next "/ Name" that is not a size. */
function segmentAfter(text, re) {
  const m = text.match(re);
  if (!m) return '';
  const rest = text.slice(m.index + m[0].length);
  const stop = rest.search(/\/\s*(?!\d|\(|ug|dts|st\b|es\b|h[\s-]*gear|comfortec|bs\d|digital)[a-z]{2,}/i);
  return stop === -1 ? rest : rest.slice(0, stop);
}

function modelsFor(vehicles) {
  const keys = new Set();
  for (const [re, brand, slug] of MODEL_RULES) if (re.test(vehicles)) keys.add(`${brand}/${slug}`);
  for (const [re, brand, sizes] of SIZED_RULES) {
    if (!re.test(vehicles)) continue;
    const seg = segmentAfter(vehicles, re);
    const found = Object.keys(sizes).filter((n) => new RegExp(`(^|\\D)${n}(\\D|$)`).test(seg));
    for (const n of found.length ? found : Object.keys(sizes)) keys.add(`${brand}/${sizes[n]}`);
  }
  return [...keys].map((k) => modelByKey.get(k)).filter(Boolean);
}

const sectionBrand = (part) => {
  const n = Number(part.replace(/\D/g, ''));
  if (n >= 5500) return 'honda';
  if (n >= 2000) return 'bajaj';
  if (n >= 500) return 'yamaha';
  return 'hero';
};

const shortModel = (m) =>
  m.name.replace(/\s*\(.*$/, '').replace(/^Hero\s+/i, '').replace(/\bHf\b/, 'HF').trim();
const round2 = (n) => Math.round(n * 100) / 100;

const rows = [];
const links = [];
const unlinked = [];
for (const [part, oem, desc, vehicles, mrp, pack] of PRS_ROWS) {
  const fits = modelsFor(vehicles);
  const counts = {};
  for (const m of fits) counts[m.brand_id] = (counts[m.brand_id] || 0) + 1;
  const brand =
    Object.entries(counts).sort((a, b) => b[1] - a[1] || (a[0] === sectionBrand(part) ? -1 : 1))[0]?.[0] ||
    sectionBrand(part);

  const names = [...new Set(fits.filter((m) => m.brand_id === brand).map(shortModel))];
  const others = [...new Set(fits.filter((m) => m.brand_id !== brand).map((m) => `${BRAND_LABEL[m.brand_id] || m.brand_id} ${shortModel(m)}`))];
  const all = [...names.map((n, i) => (i === 0 ? `${BRAND_LABEL[brand]} ${n}` : n)), ...others];
  const vehicleTitle = all.length
    ? all.slice(0, 3).join(', ')
    : `${BRAND_LABEL[brand]} ${vehicles.split('/')[0].trim()}`;
  if (!fits.length) unlinked.push(`${part} (${vehicles.slice(0, 50)})`);

  const id = `prs-${part.toLowerCase()}`;
  rows.push({
    id,
    reference_no: part,
    name: `PRS ${desc} for ${vehicleTitle}`,
    sku: oem,
    brand_id: brand,
    category_id: CATEGORY.find(([re]) => re.test(desc))[1],
    vendor: 'PRS',
    description:
      `PRS control cable${oem ? `, OEM part no. ${oem}` : ''}. ` +
      `Fits ${vehicles}. Sold in a standard pack of ${pack}.`,
    price: round2(mrp * (1 - BULK_DISCOUNT / 100)),
    mrp,
    moq: pack,
    stock: 100,
    // the cable photo (Wikimedia Commons, credited on /image-credits)
    images: ['/assets/parts-photos/control-cable.jpg'],
    fitment: `Fits ${vehicles}`,
    tags: [TAG, 'prs', `std-pack-${pack}`],
    is_active: true
  });
  for (const m of fits) links.push({ product_id: id, model_id: m.id });
}

console.log(`\n${WRITE ? 'WRITING' : 'DRY RUN'} — ${rows.length} PRS cables, ${links.length} model links`);
const byBrand = {};
for (const r of rows) byBrand[r.brand_id] = (byBrand[r.brand_id] || 0) + 1;
console.log('by brand:', byBrand);
console.log(`no matching model on the site (${unlinked.length}): ${unlinked.join(' | ')}`);
for (const r of rows.filter((r, i) => [1, 25, 100, 140, 160, rows.length - 1].includes(i) || process.argv.includes(r.reference_no))) {
  const n = links.filter((l) => l.product_id === r.id).length;
  console.log(`  ${r.reference_no}  ${r.name}  [${r.category_id}]  MRP ₹${r.mrp} → ₹${r.price} (10+)  ${n} models: ${links.filter((l) => l.product_id === r.id).map((l) => models.find((m) => m.id === l.model_id).slug).join(', ')}`);
}

if (!WRITE) {
  console.log('\nRe-run with --write to apply.\n');
  process.exit(0);
}

const { error } = await db.from('products').upsert(rows, { onConflict: 'id' });
if (error) throw new Error(`products: ${error.message}`);
// Replace each cable's fitment links so an edited rule set does not leave stale ones.
for (let i = 0; i < rows.length; i += 100) {
  const ids = rows.slice(i, i + 100).map((r) => r.id);
  const { error: delError } = await db.from('product_models').delete().in('product_id', ids);
  if (delError) throw new Error(`product_models: ${delError.message}`);
}
for (let i = 0; i < links.length; i += 500) {
  const { error: linkError } = await db.from('product_models').insert(links.slice(i, i + 500));
  if (linkError) throw new Error(`product_models: ${linkError.message}`);
}
console.log(`\nAdded ${rows.length} PRS cables with ${links.length} model links.\n`);
