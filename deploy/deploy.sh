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

# pids currently listening on the app port
port_pids() { ss -ltnpH "sport = :$PORT" 2>/dev/null | grep -oE 'pid=[0-9]+' | cut -d= -f2 | sort -u; }
# the PM2 app name that owns a pid, or nothing if PM2 does not manage it
pm2_name_of() {
  pm2 jlist 2>/dev/null | node -e '
    const pid = Number(process.argv[1]);
    const list = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const app = list.find((a) => a.pid === pid);
    if (app) process.stdout.write(app.name);
  ' "$1" 2>/dev/null || true
}

# Cluster-mode apps do not bind the port themselves: the PM2 daemon ("God")
# listens and hands connections to the workers, so ss reports the daemon's
# pid and jlist cannot attribute it. Identify those by configured port.
is_pm2_daemon() { ps -o args= -p "$1" 2>/dev/null | grep -qiE 'pm2.*god'; }
cluster_apps_on_port() {
  pm2 jlist 2>/dev/null | node -e '
    const port = String(process.argv[1]);
    const list = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const hit = new Set();
    for (const a of list) {
      const e = a.pm2_env || {};
      if (e.exec_mode !== "cluster_mode") continue;
      const args = [].concat(e.args || []).join(" ");
      const envPort = String(e.PORT ?? (e.env && e.env.PORT) ?? "");
      // No backslashes here on purpose: args are space-joined, and an escaped
      // class inside a shell-quoted one-liner is too easy to mangle.
      const argPort = new RegExp("(^| )(-p|--port)[ =]" + port + "( |$)").test(args);
      if (envPort === port || argPort) hit.add(a.name);
    }
    process.stdout.write([...hit].join(" "));
  ' "$PORT" 2>/dev/null || true
}

# Give PM2 a moment to close the old app's socket before judging the port —
# checking straight after `pm2 delete` sees a socket that is mid-teardown.
for _ in $(seq 1 15); do [ -z "$(port_pids)" ] && break; sleep 1; done

# Anything else still bound to the port would keep answering instead of the
# build we are about to start — a leftover app under an old name did exactly
# that and served new HTML with a stale asset table. Clear it first.
# This box hosts other sites. A deploy must never stop an app it did not
# start: an earlier version of this script deleted another site's process
# because its PM2 config named port 3000. Report the conflict and let the
# operator decide — it is one command for them and unrecoverable for us.
for pid in $(port_pids); do
  if is_pm2_daemon "$pid"; then
    others=$(cluster_apps_on_port | tr ' ' '\n' | grep -vx "$PM2_APP" | tr '\n' ' ')
    if [ -n "${others// /}" ]; then
      fail "port $PORT is held by the PM2 daemon for cluster app(s): $others. If that app should not be on port $PORT, run:  pm2 delete <name>  and re-run. If it should, change PORT in deploy/ecosystem.config.js and the nginx upstream."
    fi
    fail "port $PORT is held by the PM2 daemon for a cluster app I could not identify — run: pm2 list, then:  ss -ltnp 'sport = :$PORT'"
  else
    owner=$(pm2_name_of "$pid")
    if [ -n "$owner" ] && [ "$owner" != "$PM2_APP" ]; then
      fail "port $PORT is held by PM2 app '$owner' (pid $pid). If it is an old copy of this site, run:  pm2 delete $owner  and re-run."
    elif [ -z "$owner" ]; then
      fail "port $PORT is held by pid $pid ($(ps -o args= -p "$pid" 2>/dev/null | head -c 80)), which PM2 does not manage — stop it, then re-run"
    fi
  fi
done
for _ in $(seq 1 15); do [ -z "$(port_pids)" ] && break; sleep 1; done
[ -z "$(port_pids)" ] || fail "port $PORT is still in use — run:  ss -ltnp 'sport = :$PORT'  to see the holder"

pm2 start deploy/ecosystem.config.js
pm2 save >/dev/null

# A process that crashes on boot still shows "online" for a moment; give it a
# few seconds and then refuse to call a restart-looping app a deploy.
sleep 5
pm2 jlist 2>/dev/null | node -e '
  const want = process.argv[1];
  const list = JSON.parse(require("fs").readFileSync(0, "utf8")).filter((a) => a.name === want);
  const bad = list.filter((a) => a.pm2_env.status !== "online" || a.pm2_env.restart_time > 0);
  if (!list.length || bad.length) {
    for (const a of list) console.error(`  ${a.name} pid=${a.pid} status=${a.pm2_env.status} restarts=${a.pm2_env.restart_time}`);
    process.exit(1);
  }
  console.log(`${list.length} instance(s) online, 0 restarts`);
' "$PM2_APP" || { pm2 logs "$PM2_APP" --lines 40 --nostream 2>/dev/null || true; fail "$PM2_APP is not running cleanly (see logs above)"; }

step "Installing nginx site config"
DOMAIN="${DOMAIN:-autoparts.peculiex.com}"
if command -v nginx >/dev/null; then
  # deploy/nginx.conf is the source of truth, but it was never copied to the
  # host, so a fix to its /_next/static/ block (the missing Host header that
  # made Next answer 400 and the browser show "Application error") never took
  # effect. Install it into whichever ONE file under /etc/nginx names this
  # domain — this box hosts other sites, so nothing else is touched — with a
  # backup, validation, and automatic restore if validation fails.
  mapfile -t SITE_FILES < <(grep -rlsE "server_name[[:space:]].*$DOMAIN" /etc/nginx/ 2>/dev/null | grep -v '[.]bak[.]' | sort -u)
  render_site() { sed 's/server web:3000;/server 127.0.0.1:3000;/' deploy/nginx.conf; }

  if [ "${#SITE_FILES[@]}" -eq 1 ]; then
    SITE="${SITE_FILES[0]}"
    if diff -q <(render_site) "$SITE" >/dev/null 2>&1; then
      echo "$SITE already matches deploy/nginx.conf"
    else
      BAK="$SITE.bak.$(date +%Y%m%d%H%M%S)"
      cp "$SITE" "$BAK"
      render_site > "$SITE"
      if nginx -t >/dev/null 2>&1; then
        echo "updated $SITE  (backup: $BAK)"
      else
        cp "$BAK" "$SITE"
        nginx -t 2>&1 | tail -3
        fail "new nginx config failed validation — original restored from $BAK"
      fi
    fi
  else
    echo "found ${#SITE_FILES[@]} nginx file(s) naming $DOMAIN — not changing nginx automatically:"
    [ "${#SITE_FILES[@]}" -gt 0 ] && printf '  %s\n' "${SITE_FILES[@]}"
    echo "  install deploy/nginx.conf by hand (upstream 127.0.0.1:3000) and re-run"
  fi

  nginx -t 2>&1 | tail -1
  systemctl reload nginx || fail "nginx reload"
else
  echo "nginx not found on PATH — skipping"
fi

step "Health check"
for _ in $(seq 1 15); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT/api/health" || true)
  if [ "$code" = "200" ]; then
    # Make sure the thing answering is the app we just started. In cluster
    # mode the listener is the PM2 daemon acting for the workers we already
    # verified online above, so that pid is accepted.
    for pid in $(port_pids); do
      is_pm2_daemon "$pid" && continue
      owner=$(pm2_name_of "$pid")
      [ "$owner" = "$PM2_APP" ] || fail "port $PORT is being answered by '${owner:-an unmanaged process}' (pid $pid), not $PM2_APP"
    done
    echo "app answering on :$PORT ($PM2_APP)"

    # The 400 bug only showed on assets, so check one for real.
    asset=$(curl -s "http://127.0.0.1:$PORT/" | grep -oE '/_next/static/[^"]+\.css' | head -1 || true)
    if [ -n "$asset" ]; then
      acode=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$PORT$asset" || true)
      [ "$acode" = "200" ] || fail "static asset $asset returned $acode (expected 200)"
      echo "static assets ok (direct)"
    fi

    # The direct check passed once while the site was still broken, because
    # nginx — not Next — was answering 400 for assets. So check the way the
    # browser does: through the public URL.
    PUBLIC_URL="${PUBLIC_URL:-https://$DOMAIN}"
    pcode=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$PUBLIC_URL/" || true)
    if [ "$pcode" = "200" ]; then
      passet=$(curl -s --max-time 15 "$PUBLIC_URL/" | grep -oE '/_next/static/[^"]+[.]css' | head -1 || true)
      if [ -n "$passet" ]; then
        pacode=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$PUBLIC_URL$passet" || true)
        [ "$pacode" = "200" ] || fail "through nginx, $PUBLIC_URL$passet returned $pacode — the browser will show 'Application error'. The nginx site config is not the one in deploy/nginx.conf (see the nginx step above)."
        echo "public site ok: $PUBLIC_URL (assets 200)"
      fi
    else
      echo "note: $PUBLIC_URL answered $pcode from this host — public check skipped"
    fi

    printf '\n\033[1;32mDEPLOY OK\033[0m  %s\n' "$(git log --oneline -1)"
    exit 0
  fi
  sleep 2
done

fail "app did not answer on :$PORT within 30s — run:  pm2 logs $PM2_APP --lines 80"
