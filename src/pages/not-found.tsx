import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";

export function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="page">
        <header className="page-head--front">
          <p className="eyebrow">404</p>
          <h1 className="h1" style={{ marginTop: "var(--sp-3)" }}>That page does not exist</h1>
          <p className="lede" style={{ marginTop: "var(--sp-4)" }}>
            <Link to="/">Back to what Cairn is</Link>
          </p>
        </header>
      </main>
    </>
  );
}
