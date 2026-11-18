#!/usr/bin/env bash
# Start the local demo (backend + Vite dev) and optionally a public tunnel.
# Usage: scripts/demo.sh [--tunnel]
set -euo pipefail
cd "$(dirname "$0")/.."

pkill -f "node server/index.mjs" 2>/dev/null || true
pkill -f "bin/vite" 2>/dev/null || true
pkill -f "cloudflared tunnel --no-autoupdate --url http://127.0.0.1:3000" 2>/dev/null || true
sleep 1

if [ "${1:-}" = "--tunnel" ]; then
  (nohup node server/index.mjs > /tmp/cairn-api.log 2>&1 &)
  (nohup npm run dev > /tmp/cairn-dev.log 2>&1 &)
  (nohup cloudflared tunnel --no-autoupdate --url http://127.0.0.1:3000 > /tmp/cairn-tunnel.log 2>&1 &)
  for i in $(seq 1 20); do
    URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cairn-tunnel.log | head -1 || true)
    [ -n "$URL" ] && break
    sleep 1
  done
  echo "demo public at ${URL:-<see /tmp/cairn-tunnel.log>}"
  exit 0
fi

(nohup node server/index.mjs > /tmp/cairn-api.log 2>&1 &)
(nohup npm run dev > /tmp/cairn-dev.log 2>&1 &)
sleep 4
echo "local:  http://localhost:3000"
ip=$(hostname -I 2>/dev/null | awk '{print $1}') && echo "LAN:    http://${ip}:3000"
echo "health: http://127.0.0.1:8787/health"
