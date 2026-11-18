#!/usr/bin/env node
/**
 * journey smoke: walk the seven steps end to end on the owner's local stack.
 * not a UI rehearsal — it hits /api straight, asserts existence of routes and
 * sample-data pointers, and resolves loud on any failure.
 */
import { strict as assert } from "node:assert";
import { chromium } from "playwright";

const BASE = process.env.CAIRN_BASE ?? "http://127.0.0.1:3000";

const res = { ok: true, steps: [] };
const fail = (step, err) => { res.ok = false; res.steps.push({ step, status: "FAIL", err: String(err) }); };

const api = async (path, init) => {
  const r = await fetch(BASE + path, init);
  return { status: r.status, body: r.headers.get("content-type")?.includes("json") ? await r.json().catch(() => null) : null, headers: r.headers };
};

// 1. health
let h = await api("/health");
(h.status === 200 && h.body?.status === "ok") ? res.steps.push({ step: "health", status: "200" }) : fail("health", JSON.stringify(h));

// 2. stores list
let s = await api("/api/stores");
((Array.isArray(s.body) ? s.body.length : 0) > 0) ? res.steps.push({ step: "stores list", status: `${s.body.length} stores` }) : fail("stores list", "empty");

// 3. brief
s = await api("/api/stores/resin-miniatures/brief");
(s.body?.title?.length > 5) ? res.steps.push({ step: "brief", status: "200 + content" }) : fail("brief", JSON.stringify(s.body));

// 4. catalogue
s = await api("/api/stores/resin-miniatures/catalogue");
(s.body?.length > 0) ? res.steps.push({ step: "catalogue", status: `${s.body.length} rows` }) : fail("catalogue", JSON.stringify(s.body));

// 5. build log
s = await api("/api/stores/resin-miniatures/build");
(s.body?.length > 0) ? res.steps.push({ step: "build log", status: `${s.body.length} lines` }) : fail("build log", "empty");

// 6. insights
s = await api("/api/insights");
(s.body && typeof s.body.totalClicks === "number") ? res.steps.push({ step: "insights", status: `${s.body.totalClicks} clicks` }) : fail("insights", JSON.stringify(s.body));

// 7. browser: landing actually renders
const b = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const p = await b.newPage();
  const r = await p.goto(BASE, { waitUntil: "domcontentloaded", timeout: 30000 });
  const text = await p.locator("body").innerText();
  (r?.status() === 200 && text.length > 400) ? res.steps.push({ step: "landing renders", status: `${text.length}B body` }) : fail("landing renders", `status ${r?.status()}, ${text.length}B`);
} finally { await b.close(); }

if (res.ok) { console.log("journey OK:", JSON.stringify(res.steps, null, 2)); process.exit(0); }
else { console.error("journey FAILED:", JSON.stringify(res.steps, null, 2)); process.exit(1); }
