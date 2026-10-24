/**
 * Removes eauto.co.in's name and copy from the catalog that was imported from
 * their store: vendor "Eauto" becomes "MotoMart", the "Eauto " prefix leaves
 * product names, descriptions written by eauto are replaced with a short
 * neutral one, and the hidden source links back to their site are cleared.
 *
 *   node scripts/remove-eauto-text.mjs            dry run
 *   node scripts/remove-eauto-text.mjs --write    apply (writes a backup first)
 */
import { createClient } from '@supabase/supabase-js';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WRITE = process.argv.includes('--write');
for (const line of readFileSync(join(HERE, '..', '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const rows = [];
for (let from = 0; ; from += 1000) {
  const { data, error } = await db
    .from('products')
    .select('id, name, vendor, description, fitment, source_url, categories(name)')
    .range(from, from + 999);
  if (error) throw error;
  rows.push(...data);
  if (data.length < 1000) break;
}

const EAUTO = /\be-?auto\b/i;
const changes = [];
for (const r of rows) {
  const next = {};
  if (EAUTO.test(r.vendor || '')) next.vendor = 'MotoMart';
  if (EAUTO.test(r.name || '')) next.name = r.name.replace(/\be-?auto\b\s*/gi, '').replace(/\s{2,}/g, ' ').trim();
  if (EAUTO.test(r.description || '')) {
    const part = r.categories?.name || 'spare part';
    const fits = (r.fitment || '').replace(/^fits\s+/i, '').trim();
    next.description =
      `${part} replacement${fits ? ` for the ${fits}` : ''}. ` +
      'Compare with your old part or check your chassis number before ordering.';
  }
  if (r.source_url && /eauto/i.test(r.source_url)) next.source_url = null;
  if (Object.keys(next).length) changes.push({ id: r.id, next, before: { name: r.name, vendor: r.vendor, description: r.description, source_url: r.source_url } });
}

const count = (k) => changes.filter((c) => k in c.next).length;
console.log(`${WRITE ? 'WRITING' : 'DRY RUN'}: ${changes.length} products — vendor ${count('vendor')}, name ${count('name')}, description ${count('description')}, source link ${count('source_url')}`);
for (const c of changes.filter((c) => c.next.name).slice(0, 3)) console.log(`  "${c.before.name}" -> "${c.next.name}"`);
if (!WRITE) process.exit(0);

mkdirSync(join(HERE, 'backups'), { recursive: true });
const file = join(HERE, 'backups', `eauto-text-before-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
writeFileSync(file, JSON.stringify(Object.fromEntries(changes.map((c) => [c.id, c.before]))));
console.log('backup:', file);

// Group identical updates (vendor/source only) to keep the request count low.
const simple = new Map();
let done = 0;
for (const c of changes) {
  if (c.next.name || c.next.description) {
    const { error } = await db.from('products').update(c.next).eq('id', c.id);
    if (error) throw new Error(`${c.id}: ${error.message}`);
  } else {
    const key = JSON.stringify(c.next);
    if (!simple.has(key)) simple.set(key, []);
    simple.get(key).push(c.id);
  }
  if (++done % 250 === 0) process.stdout.write(`\r  ${done}/${changes.length}`);
}
for (const [key, ids] of simple) {
  for (let i = 0; i < ids.length; i += 200) {
    const { error } = await db.from('products').update(JSON.parse(key)).in('id', ids.slice(i, i + 200));
    if (error) throw new Error(error.message);
  }
}
console.log(`\nDone: ${changes.length} products.`);
