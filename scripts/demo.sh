#!/usr/bin/env bash
# Start the local demo on 0.0.0.0:3000 (backend + Vite dev). If a healthy
# tunnel to 127.0.0.1:3000 already exists, report it instead of restarting;
# --tunnel forces a new one.
set -euo pipefail
cd "$(dirname "$0")/.."

pkill -f "node server/index.mjs" 2>/dev/null || true
pkill -f "bin/vite" 2>/dev/null || true
sleep 1
existing=$(pgrep -af "cloudflared tunnel --no-autoupdate --url http://127.0.0.1:3000" || true)
if [ -n "$existing" ] && [ "${1:-}" != "--tunnel" ]; then
  echo "tunnel already running; leaving it alone. Use --tunnel to force a new one."
fi
if [ "${1:-}" = "--tunnel" ]; then
  # Public tunnel = strangers. Read-only is not optional for them — the stray
  # 'bikerental.mv' cost us a seed slot before this existed.
  (CAIRN_READ_ONLY=1 nohup node server/index.mjs > /tmp/cairn-api.log 2>&1 &)
  (VITE_DEMO_READ_ONLY=1 nohup npm run dev > /tmp/cairn-dev.log 2>&1 &)
  pkill -f "cloudflared tunnel --no-autoupdate --url http://127.0.0.1:3000" 2>/dev/null || true
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
