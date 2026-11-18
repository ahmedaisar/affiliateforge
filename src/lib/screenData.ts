/**
 * Sample data for the operator journey screens (jobs 1–8 from design/jobs-map.md).
 * Same seam as `data.ts`: every screen reads through these functions; when the
 * agents land (Phase 5) their bodies become tenant-scoped Edge Function calls,
 * and no screen changes.
 */

export type EvidenceKind = "observed" | "inference" | "assumption";
export type EvidenceRow = { claim: string; source: string; readOn: string; kind: EvidenceKind };
export type NicheBrief = {
  niche: string;
  title: string;
  score: number;
  scoreLabel: string;
  meta: { label: string; value: string; sub: string }[];
  argument: string;
  counter: string;
  moneyLine: string;
  orderLine: string;
  evidence: EvidenceRow[];
};

export type DesignSpecimen = { id: string; name: string; kicker: string; line: string; pills: string[]; dark?: boolean };

export type CatalogueRow = { id: string; name: string; merchant: string; commission: number; order: number; note: string };

export type GateState = { merchant: string; threshold: string; progressLabel: string; progress: number; state: "gated" | "open" };

export type BuildStep = { time: string; what: string; state: "ok" | "warn" | "bad" };

export async function getNicheBrief(): Promise<NicheBrief> {
  return {
    niche: "resin-miniatures",
    title: "Resin printers for tabletop mini painters",
    score: 3.7,
    scoreLabel: "Worth building",
    meta: [
      { label: "US searches / mo", value: "14,800", sub: "sample estimate" },
      { label: "Commission / sale", value: "$22.40", sub: "8% at a specialist retailer" },
      { label: "Established rivals", value: "3 of 6", sub: "200+ referring domains" },
      { label: "To first page", value: "9–14 wks", sub: "if 8 guides ship" },
    ],
    argument:
      "Buyers are miniature painters, not printer hobbyists: they search by model and by “best resin for miniatures”. The three rivals all review printers generally and none covers wash-and-cure stations, which is where the margin sits in this niche.",
    counter:
      "What you would have to beat: two sites with printable comparison tables, one with a YouTube channel. Your edge: price history and a finder by miniature scale.",
    moneyLine: "Why not Amazon first: 3% × $299 is $8.97, and Amazon pays last here; a specialist pays 8% × $280 = $22.40 — and the reader trusts the specialist more, not less.",
    orderLine: "Order: specialist retailer → eBay → Amazon. Amazon pays least and is gated anyway.",
    evidence: [
      { claim: "Six sites rank for “best resin printer for miniatures”; three have 200+ referring domains", source: "serp.capture · sample", readOn: "17 Nov", kind: "observed" },
      { claim: "Rivals publish comparison tables; none publishes price history", source: "rival-crawl · sample", readOn: "17 Nov", kind: "observed" },
      { claim: "Reddit threads repeat “which resin” and “is it worth upgrading”", source: "reddit-thread-index · sample", readOn: "17 Nov", kind: "inference" },
      { claim: "Wash-and-cure stations are an under-served buying step", source: "niche-argument · hypothesis", readOn: "17 Nov", kind: "assumption" },
    ],
  };
}

export async function listDesignSpecimens(): Promise<DesignSpecimen[]> {
  return [
    { id: "field-notes", name: "Field Notes", kicker: "FIELD NOTES · NO. 12", line: "The resin printer that earns its bench space", pills: ["Warm paper", "Editorial serif"] },
    { id: "bench", name: "Bench", kicker: "BENCH · MATERIALS TEST 07", line: "Resin printers, measured on 14 prints", pills: ["Technical", "Data-dense"] },
    { id: "scout", name: "Scout", kicker: "SCOUT PICKS", line: "Buy once. Print for years.", pills: ["Photo-led", "Mobile-first"], dark: true },
  ];
}

export async function listCatalogue(): Promise<CatalogueRow[]> {
  return [
    { id: "phrozen-mini-8k", name: "Phrozen Mini 8K S", merchant: "Specialist retailer", commission: 22.4, order: 1, note: "The reference print" },
    { id: "elegoo-saturn", name: "Elegoo Saturn 4", merchant: "Specialist retailer", commission: 22.4, order: 2, note: "Runner-up, same margin" },
    { id: "wash-cure-station", name: "Wash & Cure Station", merchant: "Specialist retailer", commission: 18.7, order: 3, note: "Attach sale — earns on the first" },
    { id: "anycubic-resin-kit", name: "Anycubic ABS-like 3.0, 5 kg", merchant: "eBay", commission: 8.9, order: 4, note: "Consumables replenish" },
    { id: "zortrax-precision", name: "Zortrax Precision Resin", merchant: "eBay", commission: 6.4, order: 5, note: "Lower margin, higher velocity" },
  ];
}

export async function getGateState(): Promise<GateState> {
  return { merchant: "Amazon", threshold: "10 qualifying sales in 30 days before Creators API credentials", progressLabel: "6 of 10 in the last 30 days", progress: 0.6, state: "gated" };
}

export async function getBuildSteps(): Promise<BuildStep[]> {
  return [
    { time: "18:02", what: "Catalogue frozen: 5 products, 3 accepted, 2 pending you", state: "ok" },
    { time: "18:04", what: "Look chosen: Field Notes", state: "ok" },
    { time: "18:07", what: "Repository created: ahmed_aisar/resin-miniatures.best", state: "ok" },
    { time: "18:09", what: "Deploying to your Vercel project…", state: "warn" },
  ];
}
