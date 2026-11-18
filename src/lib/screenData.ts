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

export async function listDesignSpecimens(): Promise<DesignSpecimen[]> {
  return [
    { id: "field-notes", name: "Field Notes", kicker: "FIELD NOTES · NO. 12", line: "The resin printer that earns its bench space", pills: ["Warm paper", "Editorial serif"] },
    { id: "bench", name: "Bench", kicker: "BENCH · MATERIALS TEST 07", line: "Resin printers, measured on 14 prints", pills: ["Technical", "Data-dense"] },
    { id: "scout", name: "Scout", kicker: "SCOUT PICKS", line: "Buy once. Print for years.", pills: ["Photo-led", "Mobile-first"], dark: true },
  ];
}

export async function getGateState(): Promise<GateState> {
  return { merchant: "Amazon", threshold: "10 qualifying sales in 30 days before Creators API credentials", progressLabel: "6 of 10 in the last 30 days", progress: 0.6, state: "gated" };
}

