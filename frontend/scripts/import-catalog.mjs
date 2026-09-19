/**
 * Imports the bundled spares catalog into Supabase.
 *
 *   npm run import:catalog
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local —
 * the service role key bypasses RLS, which a bulk import requires.
 *
 * Safe to re-run: every table is upserted on its primary key, so running it
 * again refreshes the catalog without duplicating rows or touching orders.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, '..', 'src', 'data', 'eauto');
const MODELS_DIR = join(DATA, 'models');

// --- env ---------------------------------------------------------------------
for (const file of ['.env.local', '.env']) {
  try {
    for (const line of readFileSync(join(HERE, '..', file), 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* file is optional */
  }
}

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error('\nMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in frontend/.env.local');
  console.error('Find the service_role key in Supabase → Project Settings → API.\n');
  process.exit(1);
}

const db = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'misc';

async function upsert(table, rows, conflict, label = table) {
  const CHUNK = 500;
  let done = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    const { error } = await db.from(table).upsert(slice, { onConflict: conflict });
    if (error) {
      console.error(`\n  ${label}: ${error.message}`);
      process.exit(1);
    }
    done += slice.length;
    process.stdout.write(`\r  ${label}: ${done}/${rows.length}`);
  }
  process.stdout.write(`\r  ${label}: ${rows.length} ✓            \n`);
}

// --- read the bundled catalog -------------------------------------------------
const index = JSON.parse(readFileSync(join(DATA, 'index.json'), 'utf8'));

const brands = index.brands.map((b, i) => ({
  id: b.id,
  name: b.name,
  tagline: b.tagline || '',
  logo: b.logo,
  hero_image: b.heroImage,
  sort_order: i,
  is_active: true
}));

const chunks = readdirSync(MODELS_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(join(MODELS_DIR, f), 'utf8')));

const models = [];
const categories = new Map();
const products = new Map();
const fitments = [];

for (const chunk of chunks) {
  models.push({
    brand_id: chunk.brandId,
    slug: chunk.modelId,
    name: chunk.modelName,
    type: chunk.type,
    vehicle_type: chunk.vehicleType,
    image: chunk.image,
    is_active: true
  });

  for (const part of chunk.parts) {
    const categoryId = slugify(part.category || 'Spare Parts');
    if (!categories.has(categoryId)) {
      categories.set(categoryId, {
        id: categoryId,
        name: part.category || 'Spare Parts',
        description: '',
        image: part.image || null,
        sort_order: categories.size,
        is_active: true
      });
    }

    // A part can appear under several models; keep one product row for it.
    if (!products.has(part.id)) {
      products.set(part.id, {
        id: part.id,
        name: part.name,
        sku: part.sku || '',
        brand_id: chunk.brandId,
        category_id: categoryId,
        vendor: part.vendor || '',
        description: part.description || '',
        price: part.price ?? 0,
        mrp: part.mrp ?? part.price ?? 0,
        // the source only reports in/out of stock, so seed a working quantity
        stock: part.available === false ? 0 : 25,
        images: (part.images && part.images.length ? part.images : [part.image]).filter(Boolean),
        fitment: part.fit || '',
        tags: part.tags || [],
        source_url: part.sourceUrl || null,
        is_active: true
      });
    }
    fitments.push({ product_id: part.id, brand_id: chunk.brandId, slug: chunk.modelId });
  }
}

console.log(`\nImporting into ${URL}`);
console.log(
  `  ${brands.length} brands · ${models.length} models · ${categories.size} categories · ` +
    `${products.size} products · ${fitments.length} fitment links\n`
);

// --- write --------------------------------------------------------------------
await upsert('brands', brands, 'id');
await upsert('models', models, 'brand_id,slug');
await upsert('categories', [...categories.values()], 'id');
await upsert('products', [...products.values()], 'id');

// model ids are generated server side, so map (brand, slug) -> uuid before linking
const { data: savedModels, error: modelErr } = await db.from('models').select('id, brand_id, slug');
if (modelErr) {
  console.error('  could not read back models:', modelErr.message);
  process.exit(1);
}
const modelId = new Map(savedModels.map((m) => [`${m.brand_id}::${m.slug}`, m.id]));

const links = [];
const seen = new Set();
for (const f of fitments) {
  const id = modelId.get(`${f.brand_id}::${f.slug}`);
  if (!id) continue;
  const key = `${f.product_id}::${id}`;
  if (seen.has(key)) continue;
  seen.add(key);
  links.push({ product_id: f.product_id, model_id: id });
}

await upsert('product_models', links, 'product_id,model_id', 'fitment links');

console.log('\nCatalog import complete.\n');
