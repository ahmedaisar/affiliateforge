import { describe, expect, it } from "vitest";
import { staticStores, staticActivity, needsAttention } from "./data";
import { listDesignSpecimens, getGateState } from "./screenData";

describe("stores seam (sample data)", () => {
  it("the portfolio fixture lists seven stores with states from the kit set", async () => {
    const stores = staticStores();
    expect(stores).toHaveLength(7);
    for (const store of stores) {
      expect(["ok", "warn", "bad", "none"]).toContain(store.state);
      expect(store.stateLabel.length).toBeGreaterThan(0);
    }
  });

  it("every store's perSale is positive or explicitly null, never undefined", async () => {
    const stores = staticStores();
    for (const store of stores) {
      expect(store.perSale === null || store.perSale > 0).toBe(true);
    }
  });

  it("needsAttention surfaces exactly the warn+bad stores", async () => {
    const stores = staticStores();
    const attention = needsAttention(stores);
    expect(attention.map((s) => s.id)).toContain("wood-filament");
    expect(needsAttention(stores)).toHaveLength(attention.length);
    expect(attention.every((s) => s.state === "warn" || s.state === "bad")).toBe(true);
  });

  it("the morning activity names exactly three runs", async () => {
    expect(staticActivity()).toHaveLength(3);
  });
});

describe("screen data seam (sample data, still client-side)", () => {
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
