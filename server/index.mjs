/**
 * Cairn — local control-plane backend (slice of Phase 4).
 * One process, node:sqlite file, zero external services. Auth is a development
 * header (X-Cairn-Dev-Token) until Clerk/Postgres land in Phase 3+; it is a
 * local-development seam, never a production scheme.
 */
import { createServer } from "node:http";
import { openDb } from "./db.mjs";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.CAIRN_API_PORT ?? 8787);
const DEV_TOKEN = process.env.CAIRN_DEV_TOKEN; // unset → open (loopback only)
// Set when serving the demo to strangers: nothing changes, nothing is created.
const READ_ONLY = process.env.CAIRN_READ_ONLY === "1";
const db = openDb();

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
};
const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; if (raw.length > 1e6) { reject(new Error("too large")); req.destroy(); } });
    req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error("bad json")); } });
    req.on("error", reject);
  });

/** Validation failure → 400 with a reason, never a 500. */
class BadRequest extends Error {}

const row = (r) => ({
  id: r.id, domain: r.domain, niche: r.niche, offers: r.offers,
  perSale: r.per_sale, refreshedLabel: r.refreshed_label,
  state: r.state, stateLabel: r.state_label, detail: r.detail,
});

const STORE_COLS = "id, domain, niche, offers, per_sale, refreshed_label, state, state_label, detail";

function authed(req) {
  if (!DEV_TOKEN) return true; // loopback development default
  return req.headers["x-cairn-dev-token"] === DEV_TOKEN;
}

const OFFER = (m) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(m)}&mkcid=1&mkrid=711-53200-19255-0&siteid=0&campid=cairn`;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
  const path = url.pathname;
  const method = req.method;

  try {
    if (method === "GET" && path === "/health") {
      return json(res, 200, { status: "ok", stores: db.prepare("SELECT count(*) c FROM stores").get().c, time: new Date().toISOString() });
    }

    if (READ_ONLY && method !== "GET") {
      return json(res, 503, { error: "read-only demo", detail: "This public link is a read-only demo; no changes are accepted." });
    }

    // Clicks are open: they come from stranger phones, not from members.
    const click = path.match(/^\/go\/([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+)$/);
    if (method === "GET" && click) {
      const [, storeId, productId] = click;
      const product = db.prepare("SELECT name, merchant FROM catalogue WHERE store_id = ? AND id = ? AND removed = 0").get(storeId, productId);
      if (!product) return json(res, 404, { error: "unknown product" });
      db.prepare("INSERT INTO clicks (store_id, product_id, merchant, network) VALUES (?,?,?, 'ebay')").run(storeId, productId, product.merchant);
      res.writeHead(302, { location: OFFER(product.name) });
      return res.end();
    }

    if (!authed(req)) return json(res, 403, { error: "dev token required (set CAIRN_DEV_TOKEN)" });

    if (method === "GET" && path === "/api/stores") {
      const rows = db.prepare(`SELECT ${STORE_COLS} FROM stores ORDER BY state DESC, domain`).all();
      return json(res, 200, rows.map(row));
    }

    if (method === "POST" && path === "/api/stores") {
      const body = await readBody(req);
      const domain = String(body.domain ?? "").trim().toLowerCase();
      const niche = String(body.niche ?? "").trim();
      if (!domain || !niche) return json(res, 400, { error: "domain and niche are required" });
      if (domain.length > 253 || !/^(?:[a-z0-9-]{1,63}\.)+[a-z]{2,}$/.test(domain)) return json(res, 400, { error: "domain is not a domain" });
      if (niche.length > 140) return json(res, 400, { error: "niche is too long" });
      const base = domain.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "store";
      let id = base;
      for (let n = 2; db.prepare("SELECT 1 FROM stores WHERE id = ?").get(id); n += 1) id = `${base}-${n}`;
      db.prepare("INSERT INTO stores (id, domain, niche, offers, state, state_label, detail) VALUES (?,?,?,0,'none','Nothing built','Created by you; no brief yet')")
        .run(id, domain, niche);
      return json(res, 201, row(db.prepare(`SELECT ${STORE_COLS} FROM stores WHERE id = ?`).get(id)));
    }

    const one = path.match(/^\/api\/stores\/([A-Za-z0-9._-]+)$/);
    if (method === "GET" && one) {
      const store = db.prepare(`SELECT ${STORE_COLS} FROM stores WHERE id = ?`).get(one[1]);
      return store ? json(res, 200, row(store)) : json(res, 404, { error: "not found" });
    }

    const catalogue = path.match(/^\/api\/stores\/([A-Za-z0-9._-]+)\/catalogue$/);
    if (catalogue) {
      const storeId = catalogue[1];
      if (method === "GET") {
        const rows = db.prepare("SELECT id, name, merchant, commission, position FROM catalogue WHERE store_id = ? AND removed = 0 ORDER BY position").all(storeId);
        return json(res, 200, rows.map((r) => ({ id: r.id, name: r.name, merchant: r.merchant, commission: r.commission, order: r.position })));
      }
      if (method === "POST" && url.searchParams.get("action") === "approve") {
        db.prepare("INSERT INTO build_log (store_id, time, what, state) VALUES (?,?,?, 'ok')").run(storeId, new Date().toTimeString().slice(0, 5), "Catalogue approved by the operator");
        return json(res, 200, { approved: true });
      }
    }

    const product = path.match(/^\/api\/stores\/([A-Za-z0-9._-]+)\/catalogue\/([A-Za-z0-9._-]+)$/);
    if (method === "DELETE" && product) {
      db.prepare("UPDATE catalogue SET removed = 1 WHERE store_id = ? AND id = ?").run(product[1], product[2]);
      return json(res, 200, { removed: true });
    }

    const build = path.match(/^\/api\/stores\/([A-Za-z0-9._-]+)\/build$/);
    if (method === "GET" && build) {
      const rows = db.prepare("SELECT time, what, state FROM build_log WHERE store_id = ? ORDER BY rowid").all(build[1]);
      return json(res, 200, rows);
    }
    if (method === "POST" && build) {
      db.prepare("INSERT INTO build_log (store_id, time, what, state) VALUES (?,?, 'Build started by the operator', 'warn')")
        .run(build[1], new Date().toTimeString().slice(0, 5));
      return json(res, 202, { started: true });
    }

    const brief = path.match(/^\/api\/stores\/([A-Za-z0-9._-]+)\/brief$/);
    if (method === "GET" && brief) {
      const meta = db.prepare("SELECT title, score, score_label, argument, counter, money_line, order_line FROM brief_meta WHERE store_id = ?").get(brief[1]);
      if (!meta) return json(res, 404, { error: "no brief" });
      const evidence = db.prepare("SELECT claim, source, read_on AS readOn, kind FROM brief_evidence WHERE store_id = ?").all(brief[1]);
      return json(res, 200, { title: meta.title, score: meta.score, scoreLabel: meta.score_label, argument: meta.argument, counter: meta.counter, moneyLine: meta.money_line, orderLine: meta.order_line, evidence });
    }

    const choice = path.match(/^\/api\/stores\/([A-Za-z0-9._-]+)\/choices$/);
    if (choice) {
      const target = choice[1] === "workspace" ? null : choice[1]; // workspace: account-level choices, no store FK
      if (method === "GET") {
        const rows = target === null
          ? db.prepare("SELECT key, value FROM workspace_choices").all()
          : db.prepare("SELECT key, value FROM store_choices WHERE store_id = ?").all(target);
        return json(res, 200, Object.fromEntries(rows.map((r) => [r.key, r.value])));
      }
      if (method === "PUT") {
        const body = await readBody(req);
        const saved = [];
        for (const [key, value] of Object.entries(body)) {
          if (typeof value !== "string") continue;
          if (!/^[a-z_]{1,32}$/.test(key)) continue;
          if (value.length > 64) continue;
          if (target === null) {
            db.prepare("INSERT INTO workspace_choices (key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);
          } else {
            db.prepare("INSERT INTO store_choices (store_id, key, value) VALUES (?,?,?) ON CONFLICT(store_id, key) DO UPDATE SET value = excluded.value").run(target, key, value);
          }
          saved.push(key);
        }
        return json(res, 200, { saved });
      }
    }

    if (method === "GET" && path === "/api/insights") {
      const top = db.prepare("SELECT product_id, count(*) AS clicks FROM clicks GROUP BY product_id ORDER BY clicks DESC LIMIT 5").all();
      const last = db.prepare("SELECT product_id, merchant, store_id, at FROM clicks ORDER BY id DESC LIMIT 3").all();
      return json(res, 200, { totalClicks: db.prepare("SELECT count(*) c FROM clicks").get().c, top, last });
    }

    const health = path.match(/^\/api\/activity$/);
    if (method === "GET" && health) {
      const rows = db.prepare("SELECT time, what, state FROM build_log ORDER BY rowid DESC LIMIT 3").all().reverse();
      const stateLabel = { ok: "Done", warn: "Your call", bad: "Stopped" };
      return json(res, 200, rows.map((r) => ({ time: r.time, what: r.what, state: r.state, stateLabel: stateLabel[r.state] })));
    }

    return json(res, 404, { error: "no such route" });
  } catch (err) {
    if (err instanceof BadRequest) return json(res, 400, { error: err.message });
    if (err?.message === "bad json" || err?.message === "too large") return json(res, 400, { error: err.message });
    console.error("[cairn-api]", err);
    return json(res, 500, { error: "internal error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`cairn-api listening on http://127.0.0.1:${PORT}${DEV_TOKEN ? " (dev token required)" : ""}`);
});
