import { useEffect, useState } from "react";
import { OperatorShell } from "@/components/operator-shell";
import type { BuildStep } from "@/lib/screenData";
import { fetchBuild, startBuild } from "@/lib/api";
import type { StoreState } from "@/lib/data";

function lineState(state: BuildStep["state"]): { state: StoreState; label: string } {
  if (state === "ok") return { state: "ok", label: "Done" };
  if (state === "warn") return { state: "warn", label: "In progress" };
  return { state: "bad", label: "Stopped" };
}

export default function BuildPage() {
  const [steps, setSteps] = useState<BuildStep[]>([]);

  useEffect(() => {
    fetchBuild("resin-miniatures").then(setSteps).catch(() => {});
  }, []);

  return (
    <OperatorShell current="/stores/resin-miniatures/build">
      <div className="page-head">
        <div className="stack-sm">
          <p className="eyebrow">Build run · sample data</p>
          <h1 className="h1">Is it mine now?</h1>
          <p className="page-head__sub">The run writes to your GitHub and your Vercel — append-only, never updated after the fact.</p>
        </div>
      </div>

      <div className="table-wrap" style={{ marginTop: "var(--sp-5)" }}>
        <table className="table">
          <tbody>
            {steps.map((step) => {
              const { state, label } = lineState(step.state);
              return (
                <tr key={step.time}>
                  <td className="meta" style={{ width: "var(--sp-8)" }}>{step.time}</td>
                  <td>{step.what}</td>
                  <td style={{ width: "var(--sp-8)" }}><span className={`state state--${state}`}>{label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="stack-sm" style={{ marginTop: "var(--sp-6)" }}>
        <h2 className="h3">Handover</h2>
        <p className="body-sm">
          When this run turns green, the store is yours: repository, deployment and affiliate
          accounts, under your names. Delete your Cairn account and the store keeps running — it just
          stops refreshing.
        </p>
        <div className="cluster" style={{ marginTop: "var(--sp-2)" }}>
          <button className="btn btn--primary" onClick={() => startBuild("resin-miniatures").catch(() => {})}>Append a build line</button>
          <span className="mono">github.com/your-account/resin-miniatures.best</span>
          <span className="mono">vercel.com/your-account/…</span>
        </div>
        <p className="meta">Sample URLs — shown so you can judge the shape of handover before it exists.</p>
      </div>
    </OperatorShell>
  );
}
