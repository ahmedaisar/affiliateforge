import { useEffect, useState } from "react";
import { OperatorShell } from "@/components/operator-shell";
import { useParams, Link } from "react-router-dom";
import type { BuildStep } from "@/lib/screenData";
import { fetchBuild, startBuild, type BuildResult, type ApiFailure } from "@/lib/api";
import type { StoreState } from "@/lib/data";

function lineState(state: BuildStep["state"]): { state: StoreState; label: string } {
  if (state === "ok") return { state: "ok", label: "Done" };
  if (state === "warn") return { state: "warn", label: "In progress" };
  return { state: "bad", label: "Stopped" };
}

export default function BuildPage() {
  const [steps, setSteps] = useState<BuildStep[]>([]);
  const [result, setResult] = useState<BuildResult | null>(null);
  const [missing, setMissing] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { id = "resin-miniatures" } = useParams<{ id: string }>();

  useEffect(() => {
    fetchBuild(id).then(setSteps).catch(() => {});
  }, [id]);

  const run = async () => {
    setBusy(true); setError(null); setMissing(null); setResult(null);
    try {
      const r = await startBuild(id);
      setResult(r);
      setSteps(await fetchBuild(id));
    } catch (e) {
      const err = e as ApiFailure;
      if (err.missing && err.missing.length) setMissing(err.missing);
      else setError(err.message ?? "build failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <OperatorShell>
      <div className="page-head">
        <div className="stack-sm">
          <p className="eyebrow">Build run · local generation, no deploy yet</p>
          <h1 className="h1">Is it mine now?</h1>
          <p className="page-head__sub">The run reads your approved catalogue and frozen brief, writes a static storefront into <code>dist-stores/</code>, and stops there — deploy is a later step you do not have yet.</p>
        </div>
      </div>

      <div className="table-wrap" style={{ marginTop: "var(--sp-5)" }}>
        <table className="table">
          <tbody>
            {steps.map((step, i) => {
              const { state, label } = lineState(step.state);
              return (
                <tr key={`${step.time}-${i}`}>
                  <td className="meta" style={{ width: "var(--sp-8)" }}>{step.time}</td>
                  <td>{step.what}</td>
                  <td style={{ width: "var(--sp-8)" }}><span className={`state state--${state}`}>{label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {missing && (
        <div className="card" style={{ marginTop: "var(--sp-5)" }} role="alert">
          <div className="card__body">
            <p className="body-sm"><span className="state state--warn">Not ready</span> <strong>Three or fewer things to close:</strong></p>
            <ul className="body-sm stack-sm" style={{ marginTop: "var(--sp-2)", paddingLeft: "1.2em" }}>
              {missing.map((m) => <li key={m}>{m}</li>)}
            </ul>
            <p className="meta" style={{ marginTop: "var(--sp-2)" }}>Close these and press “Run build” again.</p>
          </div>
        </div>
      )}
      {error && (
        <div className="card" style={{ marginTop: "var(--sp-5)" }} role="alert">
          <div className="card__body">
            <p className="body-sm"><span className="state state--bad">Failed</span> {error}</p>
          </div>
        </div>
      )}
      {result && (
        <div className="card" style={{ marginTop: "var(--sp-5)" }}>
          <div className="card__body">
            <p className="body-sm"><span className="state state--ok">Built</span> <strong>{result.products} offers, {result.evidence} sources cited.</strong></p>
            <p className="mono body-sm" style={{ marginTop: "var(--sp-2)" }}>{result.outDir}</p>
            <ul className="body-sm stack-sm" style={{ marginTop: "var(--sp-2)" }}>{result.files.map(f => <li key={f}>{f}</li>)}</ul>
            <p className="meta" style={{ marginTop: "var(--sp-2)" }}>To look at it: <code>npx --yes serve dist-stores/{id}</code> (this machine only)</p>
          </div>
        </div>
      )}

      <div className="cluster" style={{ marginTop: "var(--sp-6)" }}>
        <button className="btn btn--primary" disabled={busy} onClick={run}>{busy ? "Building…" : "Run build"}</button>
        <Link className="btn btn--ghost" to={`/stores/${id}/catalogue`}>Revisit catalogue</Link>
      </div>
      <p className="meta" style={{ marginTop: "var(--sp-2)" }}>Sample-data workspace — the generated site is an honest static render, not a deployed store.</p>
    </OperatorShell>
  );
}
