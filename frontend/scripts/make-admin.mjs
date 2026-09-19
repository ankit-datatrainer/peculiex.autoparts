/**
 * Creates the super admin account, or promotes an existing user to admin.
 *
 *   npm run make:admin -- admin@yourstore.in "StrongPassword123"
 *   npm run make:admin -- existing@user.com          (promote only)
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

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

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const [email, password] = process.argv.slice(2);

if (!URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in frontend/.env.local');
  process.exit(1);
}
if (!email) {
  console.error('Usage: npm run make:admin -- <email> [password]');
  process.exit(1);
}

const db = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

// Find the user, creating them when a password was supplied.
let userId = null;
const { data: list, error: listErr } = await db.auth.admin.listUsers({ perPage: 1000 });
if (listErr) {
  console.error('Could not list users:', listErr.message);
  process.exit(1);
}
const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

if (existing) {
  userId = existing.id;
  console.log(`Found existing user ${email}`);
  if (password) {
    const { error } = await db.auth.admin.updateUserById(userId, { password });
    if (error) console.warn('  could not reset password:', error.message);
    else console.log('  password updated');
  }
} else {
  if (!password) {
    console.error(`No user ${email} exists. Pass a password to create one.`);
    process.exit(1);
  }
  const { data, error } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Super Admin' }
  });
  if (error) {
    console.error('Could not create user:', error.message);
    process.exit(1);
  }
  userId = data.user.id;
  console.log(`Created user ${email}`);
}

// The signup trigger creates the profile; upsert covers users made before it existed.
const { error: profileErr } = await db
  .from('profiles')
  .upsert({ id: userId, role: 'admin', full_name: 'Super Admin' }, { onConflict: 'id' });

if (profileErr) {
  console.error('Could not set admin role:', profileErr.message);
  process.exit(1);
}

console.log(`\n${email} is now a super admin. Sign in at /signin then open /admin.\n`);
