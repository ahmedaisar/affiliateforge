#!/usr/bin/env bash
# Two coherent worlds sharing one repo:
#   local (owner):    127.0.0.1:3000 -> API 8787 (full)
#   demo  (public):   127.0.0.1:3001 -> API 8788 (read-only, CAIRN_READ_ONLY=1)
# The public tunnel points at 3001 only.
set -euo pipefail
cd "$(dirname "$0")/.."

pkill -f "node server/index.mjs" 2>/dev/null || true
pkill -f "bin/vite" 2>/dev/null || true
pkill -f "cloudflared tunnel --no-autoupdate" 2>/dev/null || true
sleep 1

if [ "${1:-}" = "--tunnel" ]; then
  # Owner stack: full backend
  (nohup node server/index.mjs > /tmp/cairn-api.log 2>&1 &)
  (nohup npm run dev -- --port 3000 --host 127.0.0.1 > /tmp/cairn-dev.log 2>&1 &)
  # Demo stack: read-only backend on 8788, UI on 3001 (production bundle, not dev)
  (CAIRN_API_PORT=8788 CAIRN_READ_ONLY=1 nohup node server/index.mjs > /tmp/cairn-api-ro.log 2>&1 &)
  npm run build >/dev/null 2>&1 || { echo "build failed; stopping demo"; exit 1; }
  (VITE_API_TARGET=http://127.0.0.1:8788 VITE_DEMO_READ_ONLY=1 nohup npm run preview -- --port 3001 --host 127.0.0.1 > /tmp/cairn-demo.log 2>&1 &)
  (nohup cloudflared tunnel --no-autoupdate --url http://127.0.0.1:3001 > /tmp/cairn-tunnel.log 2>&1 &)
  for i in $(seq 1 20); do
    URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cairn-tunnel.log | head -1 || true)
    [ -n "$URL" ] && break
    sleep 1
  done
  echo "local:  http://127.0.0.1:3000  (full app for the owner)"
  echo "demo:   $URL  (read-only for the public)"
  echo "note:   demo and local are the same app on the same data; only the demo is read-only."
  exit 0
fi

# Local only: full stack, no tunnel
(nohup node server/index.mjs > /tmp/cairn-api.log 2>&1 &)
(nohup npm run dev -- --port 3000 --host 127.0.0.1 > /tmp/cairn-dev.log 2>&1 &)
sleep 4
echo "local:  http://localhost:3000"
echo "health: http://127.0.0.1:8787/health"
