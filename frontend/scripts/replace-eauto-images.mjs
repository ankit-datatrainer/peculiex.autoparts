/**
 * Replaces every product, category and category-group picture that came from
 * eauto.co.in's store (cdn.shopify.com/s/files/1/0415/7846/...). Those photos
 * carry eauto's watermark ("eauto.co.in" text and their blue "A" logo) or their
 * baked-in disclaimer text, and they are eauto's copyright either way.
 *
 * Replacements, per part type:
 *   1. a freely licensed photo from Wikimedia Commons (public/assets/parts-photos,
 *      credited on /image-credits), else
 *   2. the shop's own illustration (public/assets/parts-art).
 * Products that only had an illustration get the photo too when one exists.
 * Images uploaded through the admin (Supabase storage) are never touched.
 *
 *   node scripts/replace-eauto-images.mjs            dry run
 *   node scripts/replace-eauto-images.mjs --write    apply (writes a backup first)
 */
import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const WRITE = process.argv.includes('--write');
const EAUTO = /cdn\.shopify\.com\/s\/files\/1\/0415\/7846\//;
const ART = /^\/assets\/parts-art\//;

for (const file of ['.env.local', '.env']) {
  try {
    for (const line of readFileSync(join(ROOT, file), 'utf8').split('\n')) {
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

// category id -> [Commons photo key, illustration fallback]
const CATEGORY_IMAGE = {
  'accelerator-cable': ['control-cable', 'cable'], 'accelerator-throttle': ['throttle', 'handlebar'],
  'air-filter': ['air-filter', 'filter'], axle: ['axle', 'shaft'], 'ball-racer-set': ['ball-racer', 'bearing'],
  bearing: ['bearing', 'bearing'], 'body-control-unit': ['cdi', 'generic'], 'body-throttle-assembly': [null, 'pump'],
  brake: ['brake-disc', 'disc'], 'brake-disc-caliper': ['brake-caliper', 'caliper'], 'brake-disc-plate': ['brake-disc', 'disc'],
  'brake-drum': ['brake-drum', 'disc'], 'brake-lever': ['lever', 'lever'], 'brake-shoe': ['brake-shoe', 'brake-shoe'],
  bulb: ['bulb', 'bulb'], bush: ['bush', 'rubber'], buzzer: ['buzzer', 'horn'], cables: ['control-cable', 'cable'],
  'cam-shaft-assembly': ['camshaft', 'camshaft'], 'carbon-brush': ['carbon-brush', 'carbon'],
  'carbon-brush-kit': ['carbon-brush', 'carbon'], carburetor: ['carburetor', 'carb'],
  'carburetor-repair-kit': ['carburetor', 'carb'], cdi: ['cdi', 'generic'], 'chain-cover': ['chain-cover', 'chain-cover'],
  'chain-guide': ['chain-tensioner', 'chain-guide'], 'chain-sprocket': ['chain-sprocket', 'chain'],
  'chain-tensioner': ['chain-tensioner', 'chain-guide'], 'choke-cable': ['control-cable', 'cable'],
  clutch: ['clutch-assembly', 'clutch-disc'], 'clutch-assembly': ['clutch-assembly', 'clutch-disc'],
  'clutch-cable': ['control-cable', 'cable'], 'clutch-centre': ['clutch-hub', 'clutch-disc'],
  'clutch-cover': ['clutch-housing', 'clutch-disc'], 'clutch-housing': ['clutch-housing', 'clutch-disc'],
  'clutch-hub': ['clutch-hub', 'clutch-disc'], 'clutch-lever': ['lever', 'lever'], 'clutch-plate': ['clutch-plate', 'clutch-disc'],
  'clutch-pulley': ['clutch-pulley', 'gear'], 'clutch-shoe': ['clutch-pulley', 'clutch-disc'],
  'combi-brake-cable': ['control-cable', 'cable'], 'connecting-rod-kit': ['connecting-rod', 'piston'],
  'crank-shaft': ['crankshaft', 'shaft'], 'cylinder-block': ['cylinder-block', 'piston'],
  'disc-brake-master-cylinder-assembly': ['master-cylinder', 'lever'], 'disc-pad': ['disc-pad', 'disc-pad'],
  'drum-rubber': ['bush', 'rubber'], ecu: ['cdi', 'generic'], engine: ['engine', 'piston'], 'engine-belt': ['v-belt', 'generic'],
  'engine-guard': ['engine-guard', 'bracket'], 'engine-valve-set': ['valve', 'valve'], flasher: ['flasher', 'generic'],
  'floor-platform': ['side-panel', 'generic'], 'foam-filter': ['foam-filter', 'filter'], 'footrest-bracket': ['footrest', 'bracket'],
  'footrest-rubber': ['footrest', 'rubber'], 'fork-leg-assembly': ['front-fork', 'shocker'], 'fork-pipe': ['front-fork', 'shocker'],
  'front-brake-cable': ['control-cable', 'cable'], 'front-brake-drum': ['brake-drum', 'disc'],
  'front-drum-plate': ['brake-plate', 'brake-shoe'], 'front-foot-rest-rod': ['footrest', 'bracket'],
  'front-fork-assembly': ['front-fork', 'shocker'], 'front-fork-leg': ['front-fork', 'shocker'],
  'front-mudguard': ['mudguard', 'generic'], 'fuel-filter': ['fuel-filter', 'filter'], 'fuel-injector': ['fuel-injector', 'injector-cap'],
  'fuel-pump-assembly': ['fuel-pump', 'pump'], 'fuel-pump-motor': ['fuel-pump', 'pump'], fuse: ['fuse', 'generic'],
  'gasket-set': ['gasket', 'gasket'], 'gear-lever': ['kick-starter', 'lever'], 'gear-pinion-set': ['gear', 'gear'],
  'gear-shaft': ['shaft', 'shaft'], handle: ['handlebar', 'handlebar'], 'handle-bar-switch': ['handlebar-switch', 'generic'],
  'handle-tee': ['triple-clamp', 'handlebar'], 'head-light-set': ['headlight', 'headlight'], horn: ['horn', 'horn'],
  'ht-coil': ['ignition-coil', 'generic'], 'ignition-lock-set': ['lock', 'lock'], ignitor: ['ignition-coil', 'generic'],
  'indicator-assembly': ['indicator', 'indicator'], 'injector-cap': ['fuel-injector', 'injector-cap'],
  'injector-pipe': ['fuel-pipe', 'pipe'], 'kick-boss': ['gear', 'gear'], 'kick-lever': ['kick-starter', 'lever'],
  'kick-rachet': ['gear', 'gear'], 'kick-shaft': ['shaft', 'shaft'], 'lever-yoke': ['lever-holder', 'lever'],
  lights: ['headlight', 'headlight'], 'main-stand': ['main-stand', 'main-stand'], 'meter-worm': ['speedometer-gear', 'worm-box'],
  'meter-worm-box': ['speedometer-gear', 'worm-box'], monogram: [null, 'generic'], oil: ['engine-oil', 'generic'],
  'oil-seal': ['oil-seal', 'seal'], 'one-way-clutch': ['one-way-clutch', 'clutch-disc'], 'petrol-tank': ['petrol-tank', 'generic'],
  'petrol-tank-lock': ['lock', 'lock'], 'piston-cylinder-kit': ['piston', 'piston'], 'piston-kit': ['piston', 'piston'],
  'pressure-plate': ['clutch-plate', 'clutch-disc'], radiator: ['radiator', 'generic'], 'rear-brake-cable': ['control-cable', 'cable'],
  'rear-brake-drum': ['brake-drum', 'disc'], 'rear-drum-plate': ['brake-plate', 'brake-shoe'],
  'rear-suspension-u-fork': [null, 'bracket'], 'rear-view-mirror': ['mirror', 'generic'], relay: ['relay', 'generic'],
  'rocker-arm-set': ['rocker-arm', 'lever'], 'rocker-screw': ['rocker-arm', 'screw'], 'roller-weights': ['roller-weights', 'generic'],
  'rr-unit': ['regulator-rectifier', 'generic'], 'seat-lock-cable': ['control-cable', 'cable'],
  'self-armature': ['starter-motor', 'motor'], 'shock-absorber': ['shock-absorber', 'shocker'], shocker: ['shock-absorber', 'shocker'],
  'shocker-seal': ['oil-seal', 'seal'], 'side-panel': ['side-panel', 'generic'], 'side-stand': ['side-stand', 'side-stand'],
  silencer: ['silencer', 'pipe'], 'spark-plug': ['spark-plug', 'spark-plug'], 'speed-sensor': [null, 'generic'],
  speedometer: ['speedometer', 'speedo'], 'speedometer-cable': ['control-cable', 'cable'], 'speedometer-case': ['speedometer', 'speedo'],
  spokes: ['spokes', 'spokes'], 'starter-motor': ['starter-motor', 'motor'], 'stator-coil-plate': ['stator-coil', 'generic'],
  'sticker-set': [null, 'generic'], 'tail-light-set': ['tail-light', 'headlight'], 'tank-cover': ['tank-cover', 'generic'],
  tci: ['cdi', 'generic'], 'throttle-sensor': [null, 'generic'], 'timing-chain': ['timing-chain', 'chain'], tpfc: [null, 'generic'],
  'valve-seal': ['valve-seal', 'seal'], visor: ['visor', 'headlight'], 'wheel-rim': ['wheel-rim', 'spokes'],
  wheels: ['wheel-rim', 'spokes'], 'wiring-harness': ['wiring-harness', 'generic']
};

const credits = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'imageCredits.json'), 'utf8'));
const photoKeys = new Set(
  credits.filter((c) => existsSync(join(ROOT, 'public', 'assets', 'parts-photos', `${c.key}.jpg`))).map((c) => c.key)
);

function cleanImage(categoryId) {
  const [photo, art] = CATEGORY_IMAGE[categoryId] || [null, 'generic'];
  if (photo && photoKeys.has(photo)) return { url: `/assets/parts-photos/${photo}.jpg`, kind: 'photo' };
  return { url: `/assets/parts-art/${art}.svg`, kind: 'art' };
}

async function readAll(table, columns) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(columns).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...data);
    if (data.length < 1000) return out;
  }
}

const products = await readAll('products', 'id, category_id, images');
const categories = await readAll('categories', 'id, image');
const groups = await readAll('category_groups', 'id, image');

// ---- plan -----------------------------------------------------------------------
const plan = new Map(); // new image url -> product ids
const backup = {};
let fromEauto = 0;
let fromArt = 0;
let kept = 0;
for (const p of products) {
  const images = p.images || [];
  const hasEauto = images.some((u) => EAUTO.test(u));
  const artOnly = images.length > 0 && images.every((u) => ART.test(u));
  if (!hasEauto && !artOnly && images.length) {
    kept++;
    continue;
  }
  const own = images.filter((u) => !EAUTO.test(u) && !ART.test(u)); // admin uploads stay first
  const target = cleanImage(p.category_id);
  if (artOnly && target.kind === 'art' && images[0] === target.url) continue; // nothing better yet
  const next = [...own, target.url];
  if (JSON.stringify(next) === JSON.stringify(images)) continue;
  backup[p.id] = images;
  if (hasEauto) fromEauto++;
  else fromArt++;
  const key = JSON.stringify(next);
  if (!plan.has(key)) plan.set(key, []);
  plan.get(key).push(p.id);
}

const catPlan = categories
  .filter((c) => !c.image || EAUTO.test(c.image) || ART.test(c.image))
  .map((c) => ({ id: c.id, image: cleanImage(c.id).url, old: c.image }))
  .filter((c) => c.image !== c.old);

// A group's picture: the photo of its first category that has one.
const { data: catGroups } = await db.from('categories').select('id, group_id').order('sort_order');
const groupPlan = groups
  .filter((g) => !g.image || EAUTO.test(g.image) || ART.test(g.image))
  .map((g) => {
    const members = (catGroups || []).filter((c) => c.group_id === g.id).map((c) => cleanImage(c.id));
    const pick = members.find((m) => m.kind === 'photo') || members[0] || { url: '/assets/parts-art/generic.svg' };
    return { id: g.id, image: pick.url, old: g.image };
  })
  .filter((g) => g.image !== g.old);

const remaining = products.filter((p) => !backup[p.id] && (p.images || []).some((u) => EAUTO.test(u))).length;
console.log(`\n${WRITE ? 'WRITING' : 'DRY RUN'}`);
console.log(`Commons photos available:          ${photoKeys.size} part types`);
console.log(`products with eauto images:        ${fromEauto} -> replaced`);
console.log(`products upgraded art -> photo:    ${fromArt}`);
console.log(`products left as they are:         ${kept} (own uploads or other clean images)`);
console.log(`categories re-pictured:            ${catPlan.length}`);
console.log(`category groups re-pictured:       ${groupPlan.length}`);
console.log(`eauto images still left afterwards: ${remaining}`);
const tally = {};
for (const [key, ids] of plan) tally[JSON.parse(key).slice(-1)[0]] = (tally[JSON.parse(key).slice(-1)[0]] || 0) + ids.length;
console.log(Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([u, n]) => `${n} ${u.split('/').pop()}`).join(' | '));

if (!WRITE) {
  console.log('\nRe-run with --write to apply.\n');
  process.exit(0);
}

mkdirSync(join(HERE, 'backups'), { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = join(HERE, 'backups', `images-before-${stamp}.json`);
writeFileSync(
  backupFile,
  JSON.stringify({ products: backup, categories: catPlan.map(({ id, old }) => ({ id, image: old })), groups: groupPlan.map(({ id, old }) => ({ id, image: old })) })
);
console.log(`backup: ${backupFile}`);

let done = 0;
for (const [key, ids] of plan) {
  const images = JSON.parse(key);
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const { error } = await db.from('products').update({ images, image_labels: [] }).in('id', chunk);
    if (error) throw new Error(`products: ${error.message}`);
    done += chunk.length;
  }
  process.stdout.write(`\r  products: ${done}`);
}
console.log('');
for (const c of catPlan) {
  const { error } = await db.from('categories').update({ image: c.image }).eq('id', c.id);
  if (error) throw new Error(`categories: ${error.message}`);
}
for (const g of groupPlan) {
  const { error } = await db.from('category_groups').update({ image: g.image }).eq('id', g.id);
  if (error) throw new Error(`category_groups: ${error.message}`);
}
console.log(`Done: ${done} products, ${catPlan.length} categories, ${groupPlan.length} groups.\n`);
