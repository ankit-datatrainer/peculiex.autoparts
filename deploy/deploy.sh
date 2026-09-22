#!/usr/bin/env bash
# =============================================================================
# One-command deploy for the PM2 host (autoparts.peculiex.com).
#
#   bash /var/www/autoparts.peculiex.com/deploy/deploy.sh
#
# Every step that has bitten a deploy before is checked explicitly and the
# script stops at the first failure with the step named, instead of leaving a
# half-built site running:
#
#   - `git pull` refuses when the server tree has local edits; we reset to
#     origin/main instead, which is what a deploy should mean.
#   - dependencies change between releases (pdfkit was added), so npm ci is
#     never optional.
#   - frontend/.env.local is gitignored on purpose; a fresh clone has none and
#     the site silently degrades to the bundled catalog without it.
#   - `next start` is not supported with output:'standalone' and returns 400
#     for /_next/static — so the health check fetches a real asset, not just
#     the page.
#   - the repo nginx.conf upstream is the Docker service name `web`; on this
#     host it must be 127.0.0.1:3000 or nginx answers 502.
# =============================================================================
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/autoparts.peculiex.com}"
PM2_APP="motomart-web"
PORT=3000

step() { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31mDEPLOY FAILED at: %s\033[0m\n' "$*" >&2; exit 1; }

cd "$APP_DIR" 2>/dev/null || fail "cd $APP_DIR (set APP_DIR if the site lives elsewhere)"

step "Checking tools"
command -v git  >/dev/null || fail "git is not installed"
command -v node >/dev/null || fail "node is not installed"
command -v pm2  >/dev/null || fail "pm2 is not installed  (npm i -g pm2)"
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 18 ] || fail "Node $(node -v) is too old — Next 14 and pdfkit need Node 18 or newer"
echo "node $(node -v), pm2 $(pm2 -v)"

step "Fetching latest code"
git fetch origin
git reset --hard origin/main
git log --oneline -1

step "Checking environment file"
[ -f frontend/.env.local ] || fail "frontend/.env.local is missing — it is not in git; recreate it from frontend/.env.example"
grep -Eq '^NEXT_PUBLIC_SUPABASE_URL=https://' frontend/.env.local \
  || fail "NEXT_PUBLIC_SUPABASE_URL is not set in frontend/.env.local"
grep -Eq '^NEXT_PUBLIC_SUPABASE_ANON_KEY=.{20,}' frontend/.env.local \
  || fail "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in frontend/.env.local"
echo "env ok"

step "Installing dependencies"
cd frontend
npm ci --no-audit --no-fund

step "Building"
rm -rf .next
# DOCKER_BUILD must NOT be set here: it switches on output:'standalone',
# which is what broke /_next/static under `next start`.
unset DOCKER_BUILD
npm run build

step "Restarting PM2"
cd "$APP_DIR"
mkdir -p logs
pm2 delete "$PM2_APP" >/dev/null 2>&1 || true
pm2 start deploy/ecosystem.config.js
pm2 save >/dev/null

step "Reloading nginx"
if grep -rqsE 'server[[:space:]]+web:3000' /etc/nginx/; then
  echo "WARNING: an nginx config under /etc/nginx still points its upstream at web:3000."
  echo "         That is the Docker service name. On this host it must read: server 127.0.0.1:3000;"
fi
if command -v nginx >/dev/null; then
  nginx -t 2>&1 | tail -2
  systemctl reload nginx || fail "nginx reload"
else
  echo "nginx not found on PATH — skipping reload"
fi

step "Health check"
for _ in $(seq 1 15); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/api/health" || true)
  if [ "$code" = "200" ]; then
    echo "app answering on :$PORT"

    # The 400 bug only showed on assets, so check one for real.
    asset=$(curl -s "http://127.0.0.1:$PORT/" | grep -oE '/_next/static/[^"]+\.css' | head -1 || true)
    if [ -n "$asset" ]; then
      acode=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT$asset" || true)
      [ "$acode" = "200" ] || fail "static asset $asset returned $acode (expected 200)"
      echo "static assets ok"
    fi

    printf '\n\033[1;32mDEPLOY OK\033[0m  %s\n' "$(git log --oneline -1)"
    exit 0
  fi
  sleep 2
done

fail "app did not answer on :$PORT within 30s — run:  pm2 logs $PM2_APP --lines 80"
