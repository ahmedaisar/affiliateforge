import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OperatorShell } from "@/components/operator-shell";
import type { CatalogueRow } from "@/lib/screenData";
import { fetchCatalogue, removeProduct, approveCatalogue } from "@/lib/api";

const money = (n: number) => `$${n.toFixed(2)}`;

export default function CataloguePage() {
  const [rows, setRows] = useState<CatalogueRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  void error;
  const [approved, setApproved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCatalogue("resin-miniatures")
      .then((data) => setRows([...data].sort((a, b) => a.order - b.order)))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  const total = rows.reduce((n, r) => n + r.commission, 0);

  return (
    <OperatorShell current="/stores/resin-miniatures/catalogue">
      <div className="page-head">
        <div className="stack-sm">
          <p className="eyebrow">Catalogue · step 2 of 4 · sample data</p>
          <h1 className="h1">What will you earn per sale?</h1>
          <p className="page-head__sub">Ordered by commission per sale. Remove what you wouldn't sell; approve freezes the build.</p>
        </div>
      </div>

      <div className="table-wrap" style={{ marginTop: "var(--sp-5)" }}>
        <table className="table">
          <thead><tr><th>Order</th><th>Product</th><th>Merchant</th><th className="num">Commission</th><th>Note</th><th></th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="meta num">{row.order}</td>
                <td style={{ fontWeight: "var(--w-strong)" }}>{row.name}</td>
                <td>{row.merchant}</td>
                <td className="num">{money(row.commission)}</td>
                <td className="meta">{row.note}</td>
                <td>
                  <button
                    className="btn btn--quiet"
                    onClick={() => { setRows((list) => list.filter((r) => r.id !== row.id)); removeProduct("resin-miniatures", row.id).catch(() => {}); }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="meta" style={{ marginTop: "var(--sp-4)" }}>
        Composite commission, sample data, first sale: {money(total)}. A gate doesn't block approval —
        it changes what those links can say, see <a href="/stores/resin-miniatures/gate">the gate</a>.
      </p>

      <div className="cluster-lg" style={{ marginTop: "var(--sp-5)" }}>
        <button
          className="btn btn--primary"
          onClick={() => approveCatalogue("resin-miniatures").then(() => setApproved(true)).catch((err) => setError(String(err)))}
        >{approved ? "Approved — catalogue frozen" : "Approve catalogue"}</button>
        <button className="btn" onClick={() => navigate("/stores/resin-miniatures/niche")}>Back to the brief</button>
      </div>
    </OperatorShell>
  );
}
