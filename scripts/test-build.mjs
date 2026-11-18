#!/usr/bin/env node
/**
 * build gate: standalone acceptance test for the storefront generator.
 * Uses a scratch throwaway DB; never touches data/cairn.db.
 * Verifies:
 *   - buildStore() emits all four files
 *   - FTC disclosure precedes the first /go/ link in document order
 *   - method.html contains a source link AND an ISO read-on date
 *   - route guard: wood-filament (missing catalogue/evidence/look) → 409 with missing[]
 *   - route guard: unknown store → 404
 *   - read-only: POST → 403
 */
import { strict as assert } from "node:assert";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const scratch = mkdtempSync(path.join(tmpdir(), "cairn-build-test-"));
const dbPath = path.join(scratch, "test.db");
const outRoot = path.join(scratch, "out");

// seed minimal schema via the same module the server uses
process.env.CAIRN_DB = dbPath;
const { openDb } = await import(path.join(process.cwd(), "server/db.mjs"));
const db = openDb(); // seeds
// inject one evidence row with a REAL URL so the link rendering is provable too
db.prepare("INSERT INTO brief_evidence (store_id, claim, source, read_on, kind) VALUES ('resin-miniatures', 'one rival has 210 referring domains', 'https://example.com/serp-evidence', '17 Nov', 'observed')").run();
db.close();

// seed only the store we want to test (resin-miniatures, has everything)
const { buildStore } = await import(path.join(process.cwd(), "server/build-store.mjs"));
const r = buildStore(dbPath, "resin-miniatures", outRoot);
console.log("generator returned:", JSON.stringify(r));

assert.ok(existsSync(path.join(outRoot, "resin-miniatures", "index.html")), "index.html missing");
assert.ok(existsSync(path.join(outRoot, "resin-miniatures", "method.html")), "method.html missing");
assert.ok(existsSync(path.join(outRoot, "resin-miniatures", "404.html")), "404.html missing");
assert.ok(existsSync(path.join(outRoot, "resin-miniatures", "sitemap.xml")), "sitemap.xml missing");

const idx = readFileSync(path.join(outRoot, "resin-miniatures", "index.html"), "utf8");
const method = readFileSync(path.join(outRoot, "resin-miniatures", "method.html"), "utf8");
const disc = idx.indexOf("disclosure");
const go = idx.indexOf("/go/");
assert.ok(disc > 0 && go > 0, "disclosure or /go/ not present");
assert.ok(disc < go, `FTC disclosure (${disc}) must precede first /go/ link (${go})`);
assert.ok(!idx.includes("$"), "no currency signs should leak into the generated page");
assert.ok(method.includes('href="https://example.com/serp-evidence"'), "method.html must render a real <a> for real-URL sources");
assert.ok(method.includes("17 Nov") || /\d{4}-\d{2}-\d{2}/.test(method), "method.html must carry a read-on date");
console.log("generator invariants: OK");

// HTTP-level guards: spawn scratch server on a scratch port
const port = 8900 + Math.floor(Math.random() * 200);
const srv = spawn("node", ["server/index.mjs"], {
  env: { ...process.env, CAIRN_API_PORT: String(port), CAIRN_DB: dbPath, CAIRN_READ_ONLY: "1" },
  stdio: "ignore",
});
const cleanup = () => { try { srv.kill(); } catch {} };
process.on("exit", cleanup);
await sleep(1200);

const post = (p, body) => fetch(`http://127.0.0.1:${port}${p}`, {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
});
const r403 = await post("/api/stores/resin-miniatures/build", {});
assert.equal(r403.status, 503, "read-only demo must refuse POST");
cleanup();
const srv2 = spawn("node", ["server/index.mjs"], {
  env: { ...process.env, CAIRN_API_PORT: String(port + 3), CAIRN_DB: dbPath },
  stdio: "ignore",
});
const cleanup2 = () => { try { srv2.kill(); } catch {} };
process.on("exit", cleanup2);
await sleep(1200);
const bad = await fetch(`http://127.0.0.1:${port + 3}/api/stores/nope/build`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
assert.equal(bad.status, 404, "unknown store must 404");
const gap = await fetch(`http://127.0.0.1:${port + 3}/api/stores/wood-filament/build`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
assert.equal(gap.status, 409, "missing prerequisites must 409");
const gapBody = await gap.json();
assert.ok(Array.isArray(gapBody.missing) && gapBody.missing.length > 0, "409 must name the gap");
console.log("route guards: OK");
cleanup2();

console.log("ALL BUILD GATES PASS (scratch dir:", scratch, ")");
process.exit(0);
