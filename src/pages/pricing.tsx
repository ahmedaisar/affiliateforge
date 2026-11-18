import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";

const INCLUDED = [
  "A sourced niche brief, and the evidence behind every claim",
  "A catalogue ordered by what each sale pays, from networks you already belong to",
  "The store built, pushed to your GitHub and deployed to your Vercel",
  "Affiliate disclosure above the first link, a method page and a sitemap",
  "Nightly price and link refresh, with dead links shown as a state on the page",
];

const NOT_INCLUDED = [
  "Your domain — you buy it, so you keep it",
  "Your affiliate accounts — the gate on Amazon is yours, and so is the commission",
  "Editorial writing after the build beyond prices, offers and links",
  "A cart or checkout: an affiliate store earns commission, it does not sell",
];

export default function Pricing() {
  return (
    <>
      <SiteHeader current="/pricing" />
      <main className="page">
        <header className="page-head--front">
          <p className="eyebrow">Pricing</p>
          <h1 className="h1" style={{ marginTop: "var(--sp-3)" }}>$299, then $9 a month</h1>
          <p className="lede" style={{ marginTop: "var(--sp-4)", maxWidth: "var(--measure)" }}>
            One price, the same for a portfolio of three stores or thirty. There is no plan table, no
            per-site rate and no revenue share.
          </p>
        </header>

        <section className="front-section">
          <div className="grid-3">
            <div>
              <h2 className="h3">Included</h2>
              <ul className="stack-sm body-sm" style={{ marginTop: "var(--sp-3)" }}>
                {INCLUDED.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="h3">Not included</h2>
              <ul className="stack-sm body-sm" style={{ marginTop: "var(--sp-3)" }}>
                {NOT_INCLUDED.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="h3">How payment works</h2>
              <p className="body-sm" style={{ marginTop: "var(--sp-3)" }}>
                We talk about the niche first. If the brief is worth building, you get a payment link for
                the $299; the build starts when it clears. The $9 a month starts the month after the store
                is live, and cancellable at any time — the store keeps working, it stops refreshing.
              </p>
              <p className="meta" style={{ marginTop: "var(--sp-3)" }}>
                No card is taken on this site.
              </p>
            </div>
          </div>
        </section>

        <section className="front-section">
          <div className="split">
            <p className="body-sm" style={{ maxWidth: "var(--measure)" }}>
              The niche brief is free. If it says the niche is not worth a store, no build is offered and
              nothing is charged.
            </p>
            <a className="btn btn--primary" href="mailto:build@cairn.example?subject=Build%20a%20store">
              Request a build
            </a>
          </div>
          <p className="meta" style={{ marginTop: "var(--sp-4)" }}>
            <Link to="/">Back to what Cairn is</Link>
          </p>
        </section>
      </main>
    </>
  );
}
