#!/usr/bin/env bash
# One command, five checks. Run before any claim about "done".
set -euo pipefail
cd "$(dirname "$0")/.."

echo "1/5 typecheck …"
npm run typecheck >/dev/null && echo "  ok"
echo "2/5 build …"
npm run build >/dev/null && echo "  ok"
echo "3/5 unit tests …"
npm run test >/dev/null 2>&1 && echo "  ok (6/6)" || (echo "  FAIL"; exit 1)
echo "4/5 bundle check …"
node scripts/check_build.mjs
echo "5/5 live smoke …"
for url in http://127.0.0.1:8787/health http://127.0.0.1:3000/health http://127.0.0.1:3000/; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 "$url" || true)
  echo "  $code  $url"
  [ "$code" = "200" ] || { echo "  FAIL: backend or dev server is down; run scripts/demo.sh first"; exit 1; }
done
echo "ALL GREEN"
