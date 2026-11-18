/**
 * The seam between the screens and the real system.
 *
 * Every screen reads its data through a function here and never imports a
 * fixture directly. Today each function returns sample data; in Phase 4 the
 * bodies become tenant-scoped queries behind RLS, and no screen changes.
 *
 * Sample data is labelled as such wherever it reaches a page: the plan's
 * Phase 2 runs on sample data, and a screen that claims a live number it does
 * not have is the failure mode this file exists to prevent.
 */

export const SAMPLE = true;

export type StoreState = "ok" | "warn" | "bad" | "none";

export type Store = {
  id: string;
  domain: string;
  niche: string;
  offers: number;
  perSale: number | null;
  refreshedLabel: string;
  state: StoreState;
  stateLabel: string;
  /** Why this store is in the state it is in, in the operator's terms. */
  detail: string;
};

export type ActivityLine = {
  time: string;
  what: string;
  state: StoreState;
  stateLabel: string;
};

const STORES: Store[] = [
  { id: "resin-miniatures", domain: "resin-miniatures.best", niche: "Resin printers for miniature painters", offers: 24, perSale: 18.4, refreshedLabel: "2 h ago", state: "warn", stateLabel: "4 dead links", detail: "Two merchants stopped serving feeds 3 days ago. The pages still render, saying so." },
  { id: "fdm-under-300", domain: "fdm-under-300.com", niche: "FDM printers under $300", offers: 31, perSale: 12.1, refreshedLabel: "2 h ago", state: "ok", stateLabel: "Live", detail: "Every price carries its source and the time it was captured." },
  { id: "mini-wash-cure", domain: "mini-wash-cure.com", niche: "Wash and cure stations", offers: 9, perSale: 22.4, refreshedLabel: "2 h ago", state: "warn", stateLabel: "Gate open, not applied", detail: "Amazon's gate opened 3 days ago. Nine links are ready to show a stamped price after the next refresh." },
  { id: "desk-3d-scanners", domain: "desk-3d-scanners.io", niche: "Desktop 3D scanners", offers: 12, perSale: 26.8, refreshedLabel: "2 h ago", state: "ok", stateLabel: "Live", detail: "One merchant, 12 products, all prices stamped." },
  { id: "wood-filament", domain: "wood-filament.shop", niche: "Wood-fill filaments", offers: 0, perSale: null, refreshedLabel: "9 d ago", state: "bad", stateLabel: "Build failed", detail: "The catalogue has 0 offers, so the build stopped rather than ship a store with nothing on it." },
  { id: "budget-resin", domain: "budget-resin.store", niche: "Budget resin, 8 products", offers: 18, perSale: 9.6, refreshedLabel: "—", state: "none", stateLabel: "Nothing built", detail: "A catalogue is approved and no build has started." },
  { id: "printer-bench", domain: "printer-bench.tools", niche: "Bench tools for 3D printing", offers: 14, perSale: 7.2, refreshedLabel: "2 h ago", state: "ok", stateLabel: "Live", detail: "Commission per sale is the lowest in the portfolio; the traffic is the highest." },
];

const ACTIVITY: ActivityLine[] = [
  { time: "06:10", what: "Prices refreshed for 5 stores · 143 offers checked", state: "ok", stateLabel: "Done" },
  { time: "06:42", what: "mini-wash-cure.com reports its Amazon gate open · 9 links ready to stamp", state: "warn", stateLabel: "Your call" },
  { time: "07:15", what: "wood-filament.shop build stopped: the catalogue has 0 offers", state: "bad", stateLabel: "Stopped" },
];

export function staticStores(): Store[] {
  return STORES;
}

export function staticActivity(): ActivityLine[] {
  return ACTIVITY;
}

/** States that mean a person has to do something, used by the page's banner. */
export function needsAttention(stores: Store[]): Store[] {
  return stores.filter((s) => s.state === "warn" || s.state === "bad");
}
