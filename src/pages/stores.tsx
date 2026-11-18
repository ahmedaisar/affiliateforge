import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brand } from "@/components/brand";
import { needsAttention, SAMPLE, type StoreState, type Store, type ActivityLine } from "@/lib/data";
import { fetchActivity, fetchStores } from "@/lib/api";

const money = (n: number) => `$${n.toFixed(2)}`;

function State({ state, label }: { state: StoreState; label: string }) {
  const modifier = state === "ok" ? "state--ok" : state === "warn" ? "state--warn" : state === "bad" ? "state--bad" : "state--none";
  return <span className={`state ${modifier}`}>{label}</span>;
}

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [activity, setActivity] = useState<ActivityLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchStores(), fetchActivity()])
      .then(([s, a]) => { setStores(s); setActivity(a); })
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  const totalOffers = stores.reduce((n, s) => n + s.offers, 0);
  const attention = needsAttention(stores);

  if (error) {
    return (
      <div className="page">
        <h1 className="h2" style={{ marginTop: "var(--sp-6)" }}>The backend is not answering</h1>
        <p className="lede">{error}</p>
        <p className="body-sm">Expected: <span className="mono">node server/index.mjs</span> on port 8787. In development it is proxied by Vite; the screens read <span className="mono">/api</span>, never a fixture.</p>
      </div>
    );
  }

  return (
    <>
      <div className="topbar">
        <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
          <Brand />
        </Link>
        <nav className="nav">
          <Link to="/stores" aria-current="page">Stores</Link>
          <span className="meta" style={{ padding: "var(--sp-2) 0" }}>Briefs</span>
          <span className="meta" style={{ padding: "var(--sp-2) 0" }}>Catalogues</span>
          <span className="meta" style={{ padding: "var(--sp-2) 0" }}>Merchants</span>
        </nav>
        <span className="push" />
        {SAMPLE && <span className="tag">Sample data</span>}
        <span className="workspace-chip" style={{ marginLeft: "var(--sp-2)" }}>
          <span className="avatar">R</span> Ridge Media
        </span>
      </div>

      <div className="body-row">
        <div className="main">
          <div className="page-head">
            <div className="stack-sm">
              <h1 className="h1">Stores</h1>
              <p className="page-head__sub">
                {stores.length} stores · {attention.length} need you today · {totalOffers} offers
              </p>
            </div>
            <button className="btn btn--primary" disabled title="Phase 4 adds store creation">
              New store
            </button>
          </div>

          {attention.length > 0 && (
            <div className="banner" style={{ marginTop: "var(--sp-5)" }}>
              <div className="stack-sm grow">
                <p><strong>{attention[0].domain} — {attention[0].stateLabel}</strong></p>
                <p>{attention[0].detail}</p>
              </div>
              <button className="btn" disabled title="Phase 6 adds link repair">Review</button>
            </div>
          )}

          <div className="table-wrap" style={{ marginTop: "var(--sp-5)" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Store</th><th>Niche</th><th>Refreshed</th>
                  <th className="num">Offers</th><th className="num">Per sale</th><th>State</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td style={{ fontWeight: "var(--w-strong)" }}>{store.domain}</td>
                    <td>{store.niche}</td>
                    <td className="meta">{store.refreshedLabel}</td>
                    <td className="num">{store.offers}</td>
                    <td className="num">{store.perSale === null ? "—" : money(store.perSale)}</td>
                    <td><State state={store.state} label={store.stateLabel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="meta" style={{ marginTop: "var(--sp-4)" }}>
            Every state is a word with a shape beside it: disc live, bar needs a look, square failed, ring
            nothing built. Colour is never the only carrier.
          </p>

          <div className="split" style={{ marginTop: "var(--sp-6)" }}>
            <h2 className="h3">This morning</h2>
            <span className="meta">{activity.length} runs</span>
          </div>
          <div className="table-wrap" style={{ marginTop: "var(--sp-2)" }}>
            <table className="table">
              <tbody>
                {activity.map((line) => (
                  <tr key={line.time}>
                    <td className="meta" style={{ width: "var(--sp-8)" }}>{line.time}</td>
                    <td>{line.what}</td>
                    <td style={{ width: "var(--sp-8)" }}><State state={line.state} label={line.stateLabel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
