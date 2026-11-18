import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { OperatorShell } from "@/components/operator-shell";
import { listDesignSpecimens, type DesignSpecimen } from "@/lib/screenData";
import { fetchChoices, saveChoices } from "@/lib/api";

export default function LookPage() {
  const [specimens, setSpecimens] = useState<DesignSpecimen[]>([]);
  const [picked, setPicked] = useState<string>("field-notes");
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const { id = "resin-miniatures" } = useParams<{ id: string }>();

  useEffect(() => {
    listDesignSpecimens().then(setSpecimens);
    fetchChoices(id).then((c) => { if (c.look) setPicked(c.look); }).catch(() => {});
  }, [id]);

  return (
    <OperatorShell>
      <div className="page-head">
        <div className="stack-sm">
          <p className="eyebrow">Step 3 of 4 · design direction · sample data</p>
          <h1 className="h1">Three directions, built from this niche</h1>
          <p className="page-head__sub">Each specimen is the store's own direction. Pick one; the rest is discarded.</p>
        </div>
        <span className="meta">Nothing built yet</span>
      </div>

      <div className="grid-3" style={{ marginTop: "var(--sp-5)" }}>
        {specimens.map((specimen) => (
          <button
            key={specimen.id}
            role="radio"
            aria-checked={picked === specimen.id}
            className="card"
            onClick={() => { setPicked(specimen.id); setSaved(false); saveChoices(id, { look: specimen.id }).then(() => setSaved(true)).catch(() => {}); }}
            style={{ textAlign: "left", cursor: "pointer", border: picked === specimen.id ? "var(--bw-strong) solid var(--accent)" : undefined }}
          >
            <div className="card__body">
              {specimen.dark ? (
                <div style={{ background: "var(--ink)", color: "var(--paper)", borderRadius: "var(--r-3)", padding: "var(--sp-4)" }}>
                  <p className="eyebrow" style={{ color: "var(--paper)" }}>{specimen.kicker}</p>
                  <p className="h3" style={{ marginTop: "var(--sp-2)" }}>{specimen.line}</p>
                  <div className="cluster" style={{ marginTop: "var(--sp-3)" }}>
                    {specimen.pills.map((pill) => (
                      <span key={pill} className="mono" style={{ border: "var(--bw) solid var(--rule-strong)", borderRadius: "var(--r-pill)", padding: "0 var(--sp-2)" }}>{pill}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ background: "var(--paper-2)", borderRadius: "var(--r-3)", padding: "var(--sp-4)" }}>
                  <p className="eyebrow">{specimen.kicker}</p>
                  <p className="h3" style={{ marginTop: "var(--sp-2)" }}>{specimen.line}</p>
                  <div className="cluster" style={{ marginTop: "var(--sp-3)" }}>
                    {specimen.pills.map((pill) => (
                      <span key={pill} className="mono" style={{ border: "var(--bw) solid var(--rule-strong)", borderRadius: "var(--r-pill)", padding: "0 var(--sp-2)" }}>{pill}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="h4" style={{ marginTop: "var(--sp-3)" }}>{specimen.name}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="cluster-lg" style={{ marginTop: "var(--sp-5)" }}>
        <button className="btn btn--primary" onClick={() => navigate(`/stores/${id}/build`)}>Choose {specimens.find((s) => s.id === picked)?.name ?? "this look"}</button>
        <a className="btn" href={`/stores/${id}/preview`}>Preview the storefront</a>
        <span className="meta">{saved ? "Choice saved to the workspace." : "Field Notes is backed by the rivals' look; your pick is saved to the backend."}</span>
      </div>
    </OperatorShell>
  );
}
