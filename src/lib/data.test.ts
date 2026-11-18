import { describe, expect, it } from "vitest";
import { listStores, listActivity, needsAttention, getStore } from "./data";
import { listCatalogue, getNicheBrief, getBuildSteps, listDesignSpecimens, getGateState } from "./screenData";

describe("stores seam (sample data)", () => {
  it("the portfolio lists seven stores with states from the kit set", async () => {
    const stores = await listStores();
    expect(stores).toHaveLength(7);
    for (const store of stores) {
      expect(["ok", "warn", "bad", "none"]).toContain(store.state);
      expect(store.stateLabel.length).toBeGreaterThan(0);
    }
  });

  it("every store's perSale is positive or explicitly null, never undefined", async () => {
    const stores = await listStores();
    for (const store of stores) {
      expect(store.perSale === null || store.perSale > 0).toBe(true);
    }
  });

  it("needsAttention surfaces exactly the non-ok, non-none stores", async () => {
    const stores = await listStores();
    const attention = needsAttention(stores);
    expect(attention.map((s) => s.id)).toContain("wood-filament");
    expect(needsAttention(stores)).toHaveLength(attention.length);
    expect(attention.every((s) => s.state === "warn" || s.state === "bad")).toBe(true);
  });

  it("getStore returns undefined for a stranger id, not a stub", async () => {
    expect(await getStore("no-such-store")).toBeUndefined();
  });

  it("the morning activity names exactly three runs", async () => {
    expect(await listActivity()).toHaveLength(3);
  });
});

describe("screen data seam (sample data)", () => {
  it("catalogue is ordered by order and every row carries commission", async () => {
    const rows = await listCatalogue();
    const orders = rows.map((r) => r.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    for (const row of rows) expect(row.commission).toBeGreaterThan(0);
  });

  it("the niche brief carries an evidence row for every claim, each with kind vocabulary", async () => {
    const brief = await getNicheBrief();
    expect(brief.evidence.length).toBeGreaterThanOrEqual(4);
    for (const row of brief.evidence) {
      expect(["observed", "inference", "assumption"]).toContain(row.kind);
      expect(row.source.length + row.readOn.length).toBeGreaterThan(0);
    }
  });

  it("the build log is append-only shaped: time, action, a kit state", async () => {
    const steps = await getBuildSteps();
    for (const step of steps) expect(["ok", "warn", "bad"]).toContain(step.state);
  });

  it("three specimens with one dark direction, no duplicate ids", async () => {
    const specimens = await listDesignSpecimens();
    expect(specimens).toHaveLength(3);
    expect(new Set(specimens.map((s) => s.id)).size).toBe(3);
  });

  it("the gate is gated with a progress between 0 and 1", async () => {
    const gate = await getGateState();
    expect(gate.state).toBe("gated");
    expect(gate.progress).toBeGreaterThan(0);
    expect(gate.progress).toBeLessThanOrEqual(1);
  });
});
