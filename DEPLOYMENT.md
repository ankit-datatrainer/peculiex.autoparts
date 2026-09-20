# MotoMart — setup and deployment

One Next.js app talking directly to Supabase. Supabase handles the database, auth,
row level security and image storage; there is no separate API server to keep alive.

---

## 1. Apply the database schema

Open your Supabase project → **SQL Editor** → paste the whole of
`supabase/migrations/0001_motomart_init.sql` → **Run**.

It is safe to re-run. It creates:

| | |
| --- | --- |
| `profiles` | one row per account, carrying `role` (`customer` / `admin`) |
| `brands`, `models`, `categories` | the catalog taxonomy |
| `products`, `product_models` | parts, and which models each part fits |
| `orders`, `order_items`, `order_events` | orders and their tracking history |
| `settings` | store name, delivery charges, cart message |
| RLS policies | customers see only their own orders; admins manage everything |
| `product-images` bucket | public read, admin write |
| `place_order()` | recomputes prices and stock server side at checkout |

With the CLI instead: `supabase db push`.

### If you already ran the old `backend/supabase-schema.sql`

The migration handles it. That earlier script created `products`, `categories` and
`orders` with a different shape; section 0 **renames** them to `products_legacy`,
`categories_legacy` and `orders_legacy` (nothing is deleted) and then builds the new
tables. `garage_models`, `trade_ins` and `chatbot_qa` are left alone.

Once you are happy the store works, the renamed tables can go:

```sql
drop table if exists public.products_legacy, public.categories_legacy, public.orders_legacy;
```

If a query complains that a table is "not found in the schema cache" right after
migrating, nudge PostgREST:

```sql
notify pgrst, 'reload schema';
```

## 2. Configure the app

```bash
cd frontend
cp .env.example .env.local
```

Fill in from **Supabase → Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

The service role key is only read by the two scripts below. It must never reach the
browser and must never be committed.

## 3. Load the catalog

```bash
npm install
npm run import:catalog
```

Imports 14 brands, 139 models, ~86 categories, 5,163 products and 6,555 fitment links.
Re-running refreshes the catalog without duplicating rows or touching orders.

## 4. Create the super admin

**Option A — no service role key needed (fastest).**

1. Supabase Dashboard → **Authentication → Users → Add user**
2. Enter your email and password, and **tick "Auto Confirm User"**
   (this project has email confirmation switched on, so without that tick the
   account cannot sign in until it confirms by email)
3. SQL Editor → paste `supabase/promote-admin.sql`, change the email on the
   `v_email` line to yours, **Run**

It prints `OK: … is now a super admin` and lists the admin account.

**Option B — one command, needs the service role key in `.env.local`.**

```bash
npm run make:admin -- admin@yourstore.in "a-long-password"
```

Creates the account already confirmed and sets the admin role in one step. To
promote an account that already exists, leave the password off:

```bash
npm run make:admin -- someone@yourstore.in
```

Either way: sign in at `/signin`, then open `/admin`.

### Let customers sign up without email

Email confirmation is on by default, and the built-in SMTP on the free plan is
rate limited to a few messages an hour — so real customers will get stuck at
`/signup`. Before launch, either:

- **Dashboard → Authentication → Providers → Email → turn off "Confirm email"**
  (simplest; accounts work immediately), or
- **Dashboard → Authentication → Emails → SMTP Settings** and plug in a real
  sender (Resend, SendGrid, Amazon SES…) so confirmation mails actually arrive.

## 5. Run it

```bash
npm run dev     # http://localhost:3000
npm run build && npm start
```

---

## Deploying to a VPS (`autoparts.peculiex.com`)

### Initial Setup on Server

```bash
cd /var/www && rm -rf autoparts.peculiex.com && git clone https://github.com/ankit-datatrainer/peculiex.autoparts.git autoparts.peculiex.com
cd /var/www/autoparts.peculiex.com
```

### Option A — Docker (recommended)

```bash
# on the server, from the repo root (/var/www/autoparts.peculiex.com)
cp frontend/.env.example frontend/.env.local   # then edit it with Supabase credentials
export $(grep -E '^NEXT_PUBLIC_' frontend/.env.local | xargs)
docker compose up -d --build
```

`NEXT_PUBLIC_*` values are compiled into the browser bundle, so they are passed as
build args as well as runtime env — that is what the `export` line above is for.

Then issue a certificate for `autoparts.peculiex.com`:

```bash
docker run --rm -v ./deploy/certbot/conf:/etc/letsencrypt \
  -v ./deploy/certbot/www:/var/www/certbot certbot/certbot \
  certonly --webroot -w /var/www/certbot -d autoparts.peculiex.com -d www.autoparts.peculiex.com
docker compose restart nginx
```

### Option B — PM2, no Docker

```bash
cd /var/www/autoparts.peculiex.com/frontend
cp .env.example .env.local # ensure NEXT_PUBLIC_SUPABASE_URL & ANON_KEY are set
npm ci && npm run build
cd /var/www/autoparts.peculiex.com && pm2 start deploy/ecosystem.config.js && pm2 save && pm2 startup
```

Install nginx on the host, copy `deploy/nginx.conf` to
`/etc/nginx/conf.d/autoparts.peculiex.com.conf`, change `server web:3000` to `server 127.0.0.1:3000`,
then `nginx -t && systemctl reload nginx`. Use certbot for TLS:

```bash
certbot --nginx -d autoparts.peculiex.com -d www.autoparts.peculiex.com
```

### Health check

`GET /api/health` returns `200` with `{"status":"ok","database":"ok"}`. Docker and the
nginx config already use it; point your uptime monitor at it too.

---

## What lives where

| Route | Who can open it |
| --- | --- |
| `/`, `/brands/**`, `/product/**`, `/cart` | everyone |
| `/signin`, `/signup` | signed out |
| `/checkout`, `/account/**` | signed-in customers |
| `/admin/**` | `profiles.role = 'admin'` only |

`src/middleware.js` redirects signed-out visitors to `/signin` and non-admins away
from `/admin`. The database enforces the same rules again through RLS, so a crafted
request cannot bypass the UI.

## Operational notes

- **No payment gateway.** Every order is placed as pay-on-delivery. Adding a gateway
  later means one more step between `/checkout` and `place_order()`.
- **Stock** is decremented inside `place_order()` in a single transaction, so two
  shoppers cannot buy the same last unit.
- **Prices are never trusted from the browser.** `place_order()` re-reads them from
  `products`, so a tampered cart cannot change what an order costs.
- **Product images** uploaded in the admin panel go to the `product-images` bucket.
  Imported parts still reference the source CDN until you replace them; run
  `python scripts/catalog/localize_part_images.py` to self-host them instead.
- **The old Express backend in `backend/` is no longer used.** Leave `LEGACY_API_URL`
  empty unless you still run it.
