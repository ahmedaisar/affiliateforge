import { DatabaseSync } from "node:sqlite";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

export const dbPath = process.env.CAIRN_DB ?? path.join(process.cwd(), "data", "cairn.db");

export function openDb() {
  if (!existsSync(path.dirname(dbPath))) {
    import("node:fs").then(({ mkdirSync }) => mkdirSync(path.dirname(dbPath), { recursive: true }));
  }
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id TEXT PRIMARY KEY,
      domain TEXT NOT NULL,
      niche TEXT NOT NULL,
      offers INTEGER NOT NULL DEFAULT 0,
      per_sale REAL,
      refreshed_label TEXT NOT NULL DEFAULT '—',
      state TEXT NOT NULL CHECK (state IN ('ok','warn','bad','none')),
      state_label TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS catalogue (
      id TEXT PRIMARY KEY,
      store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      merchant TEXT NOT NULL,
      commission REAL NOT NULL,
      position INTEGER NOT NULL,
      removed INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS build_log (
      store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      time TEXT NOT NULL,
      what TEXT NOT NULL,
      state TEXT NOT NULL CHECK (state IN ('ok','warn','bad'))
    );
    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      merchant TEXT NOT NULL,
      network TEXT NOT NULL DEFAULT 'ebay',
      at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  seed(db);
  return db;
}

function seed(db) {
  const row = db.prepare("SELECT value FROM meta WHERE key = 'seeded'").get();
  if (row) return;
  const insert = db.prepare(
    `INSERT INTO stores (id, domain, niche, offers, per_sale, refreshed_label, state, state_label, detail)
     VALUES (@id, @domain, @niche, @offers, @per_sale, @refreshed, @state, @state_label, @detail)`
  );
  const stores = [
    { id: "resin-miniatures", domain: "resin-miniatures.best", niche: "Resin printers for miniature painters", offers: 24, per_sale: 18.4, refreshed: "2 h ago", state: "warn", state_label: "4 dead links", detail: "Two merchants stopped serving feeds 3 days ago." },
    { id: "fdm-under-300", domain: "fdm-under-300.com", niche: "FDM printers under $300", offers: 31, per_sale: 12.1, refreshed: "2 h ago", state: "ok", state_label: "Live", detail: "Every price carries source and capture time." },
    { id: "mini-wash-cure", domain: "mini-wash-cure.com", niche: "Wash and cure stations", offers: 9, per_sale: 22.4, refreshed: "2 h ago", state: "warn", state_label: "Gate open, not applied", detail: "Amazon's gate opened 3 days ago. Nine links are ready to stamp." },
    { id: "desk-3d-scanners", domain: "desk-3d-scanners.io", niche: "Desktop 3D scanners", offers: 12, per_sale: 26.8, refreshed: "2 h ago", state: "ok", state_label: "Live", detail: "One merchant, 12 products, all prices stamped." },
    { id: "wood-filament", domain: "wood-filament.shop", niche: "Wood-fill filaments", offers: 0, per_sale: null, refreshed: "9 d ago", state: "bad", state_label: "Build failed", detail: "Catalogue has 0 offers." },
    { id: "budget-resin", domain: "budget-resin.store", niche: "Budget resin, 8 products", offers: 18, per_sale: 9.6, refreshed: "—", state: "none", state_label: "Nothing built", detail: "Catalogue approved; no build started." },
    { id: "printer-bench", domain: "printer-bench.tools", niche: "Bench tools for 3D printing", offers: 14, per_sale: 7.2, refreshed: "2 h ago", state: "ok", state_label: "Live", detail: "Commission lowest, traffic highest." },
  ];
  db.exec("BEGIN");
  try {
    for (const s of stores) insert.run(s);
    const insCat = db.prepare("INSERT INTO catalogue (id, store_id, name, merchant, commission, position) VALUES (?,?,?,?,?,?)");
    [
      ["phrozen-mini-8k", "resin-miniatures", "Phrozen Mini 8K S", "Specialist retailer", 22.4, 1],
      ["elegoo-saturn", "resin-miniatures", "Elegoo Saturn 4", "Specialist retailer", 22.4, 2],
      ["wash-cure-station", "resin-miniatures", "Wash & Cure Station", "Specialist retailer", 18.7, 3],
      ["anycubic-resin-kit", "resin-miniatures", "Anycubic ABS-like 3.0, 5 kg", "eBay", 8.9, 4],
      ["zortrax-precision", "resin-miniatures", "Zortrax Precision Resin", "eBay", 6.4, 5],
    ].forEach((r) => insCat.run(...r));
    const insBuild = db.prepare("INSERT INTO build_log (store_id, time, what, state) VALUES (?,?,?,?)");
    [
      ["resin-miniatures", "18:02", "Catalogue frozen: 5 products, 3 accepted, 2 pending you", "ok"],
      ["resin-miniatures", "18:04", "Look chosen: Field Notes", "ok"],
      ["resin-miniatures", "18:07", "Repository created: ahmed_aisar/resin-miniatures.best", "ok"],
      ["resin-miniatures", "18:09", "Deploying to your Vercel project…", "warn"],
    ].forEach((r) => insBuild.run(...r));
    db.prepare("INSERT INTO meta (key, value) VALUES ('seeded', datetime('now'))").run();
    db.exec("COMMIT");
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
}
