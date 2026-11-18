import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OperatorShell, EvidenceKind } from "@/components/operator-shell";
import { getNicheBrief, type NicheBrief } from "@/lib/screenData";

export default function NicheBriefPage() {
  const [brief, setBrief] = useState<NicheBrief | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getNicheBrief().then(setBrief);
  }, []);

  if (!brief) return <OperatorShell current="/stores/resin-miniatures/niche"><p className="meta">Loading…</p></OperatorShell>;

  return (
    <OperatorShell current="/stores/resin-miniatures/niche">
      <div className="page-head">
        <div className="stack-sm">
          <p className="eyebrow">Niche brief · 17 Nov 2026 · sample data</p>
          <h1 className="h1">{brief.title}</h1>
          <p className="page-head__sub">Researched in 4 min 12 s · 18 sources read · 3 competitors inspected</p>
        </div>
        <div className="stack-sm" style={{ alignItems: "flex-end" }}>
          <span className="state state--ok">{brief.scoreLabel}</span>
          <span className="num" style={{ fontSize: "var(--t-44)", lineHeight: "var(--lh-44)" }}>{brief.score}</span>
        </div>
      </div>

      <div className="grid-3" style={{ marginTop: "var(--sp-5)" }}>
        {brief.meta.map((m) => (
          <div key={m.label} className="card">
            <div className="card__body stack-sm">
              <span className="eyebrow">{m.label}</span>
              <span className="h3 num">{m.value}</span>
              <span className="meta">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="split" style={{ marginTop: "var(--sp-6)", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div className="card grow" style={{ minWidth: "18rem" }}>
          <div className="card__head"><strong>The argument</strong></div>
          <div className="card__body stack-sm">
            <p className="body-sm">{brief.argument}</p>
            <p className="body-sm"><strong>What you would have to beat:</strong> {brief.counter}</p>
          </div>
        </div>
        <div className="card grow" style={{ minWidth: "18rem" }}>
          <div className="card__head"><strong>Where the money is</strong></div>
          <div className="card__body stack-sm">
            <p className="body-sm">{brief.moneyLine}</p>
            <p className="body-sm"><strong>{brief.orderLine}</strong></p>
          </div>
        </div>
      </div>

      <div className="split" style={{ marginTop: "var(--sp-6)" }}>
        <h2 className="h3">Evidence</h2>
        <span className="meta">every line opens its source</span>
      </div>
      <div className="table-wrap" style={{ marginTop: "var(--sp-2)" }}>
        <table className="table">
          <thead><tr><th>Claim</th><th>Source</th><th>Kind</th><th>Read</th></tr></thead>
          <tbody>
            {brief.evidence.map((row) => (
              <tr key={row.claim}>
                <td>{row.claim}</td>
                <td className="mono">{row.source}</td>
                <td><EvidenceKind kind={row.kind} /></td>
                <td className="meta">{row.readOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cluster-lg" style={{ marginTop: "var(--sp-6)" }}>
        <button className="btn btn--primary" onClick={() => navigate("/stores/resin-miniatures/catalogue")}>Build this store</button>
        <Link className="btn" to="/stores/resin-miniatures/look">See the looks</Link>
      </div>
    </OperatorShell>
  );
}
