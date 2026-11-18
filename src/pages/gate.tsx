import { useEffect, useState } from "react";
import { OperatorShell } from "@/components/operator-shell";
import { useParams } from "react-router-dom";
import { getGateState, type GateState } from "@/lib/screenData";
import { fetchChoices, saveChoices } from "@/lib/api";

export default function GatePage() {
  const [gate, setGate] = useState<GateState | null>(null);
  const [recorded, setRecorded] = useState(false);
  const { id = "resin-miniatures" } = useParams<{ id: string }>();

  useEffect(() => {
    getGateState().then(setGate);
    fetchChoices(id).then((c) => { if (c.gate_progress) setRecorded(true); }).catch(() => {});
  }, [id]);

  return (
    <OperatorShell>
      <div className="page-head">
        <div className="stack-sm">
          <p className="eyebrow">The price gate · sample data</p>
          <h1 className="h1">What is {gate?.merchant ?? "this merchant"} allowed to say?</h1>
          <p className="page-head__sub">A feed is evidence, not a licence. Until the gate opens, the store never shows a price it cannot stamp.</p>
        </div>
      </div>

      {!gate ? (
        <p className="meta">Loading…</p>
      ) : (
        <div className="card" style={{ marginTop: "var(--sp-5)", maxWidth: "42rem" }}>
          <div className="card__head">
            <span className="state state--warn">Gated</span>
            <strong>{gate.merchant}</strong>
          </div>
          <div className="card__body stack-sm">
            <p className="body-sm">{gate.threshold}</p>
            <div className="meter" role="presentation">
              <div className="meter__fill meter__fill--warn" style={{ width: `${Math.round(gate.progress * 100)}%` }} />
            </div>
            <p className="meta num">{gate.progressLabel}</p>
            <p className="body-sm">
              The store renders "<strong>Check current price at {gate.merchant}</strong>" with the number
              hidden until this clears — and stamps it with source and time the first refresh after.
            </p>
          </div>
          <div className="card__foot">
            <div className="cluster">
              <button className="btn btn--primary" onClick={() => saveChoices(id, { gate_progress: "recorded" }).then(() => setRecorded(true)).catch(() => {})}>{recorded ? "Recorded — refresh will stamp prices" : "Record gate open (updates when the tenth sale lands)"}</button>
              <span className="meta">{recorded ? "Saved to the workspace." : "Your account's gate, not ours."}</span>
            </div>
          </div>
        </div>
      )}
    </OperatorShell>
  );
}
