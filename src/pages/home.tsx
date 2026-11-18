import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";


const AGENTS = [
  {
    name: "Scout",
    job: "Finds the niche",
    body:
      "A researched brief: search volume, commission per sale, who already ranks, and what you would have to beat. Every claim carries its source and the date it was read.",
  },
  {
    name: "Broker",
    job: "Finds the offers",
    body:
      "Your own affiliate networks, searched for products in that niche and ordered by what each sale pays. A merchant whose API is gated is offered as a link with a price gate, never as a number it cannot prove.",
  },
  {
    name: "Mason",
    job: "Builds and hands over",
    body:
      "The store writes itself into a repository in your GitHub, deploys to your Vercel, and is yours from the first push. Prices and links refresh nightly, and a dead link becomes a visible state, not a silent 404.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader current="/" />
      <main className="page">
        <header className="page-head--front">
          <p className="eyebrow">Affiliate stores, built and handed over</p>
          <h1 className="h1" style={{ marginTop: "var(--sp-3)", maxWidth: "18ch" }}>
            A store you own, built from evidence.
          </h1>
          <p className="lede" style={{ marginTop: "var(--sp-4)", maxWidth: "var(--measure)" }}>
            Research the niche, find the offers, build the store and hand it all to you — repository,
            domain, affiliate accounts. No templates, no lock-in, no credential of yours in our
            database. Today the build is done by the team behind Cairn working with you on a call;
            the three-crew workflow is the product's design, not a public feature yet.
          </p>
          <div className="cluster-lg" style={{ marginTop: "var(--sp-5)" }}>
            <a className="btn btn--primary" href="mailto:build@cairn.example?subject=Build%20a%20store">
              Request a build
            </a>
            <Link className="btn" to="/pricing">What it costs</Link>
            <span className="meta">Sample screens are linked below while the first build is in progress.</span>
          </div>
        </header>

        <section className="front-section">
          <h2 className="h3">What arrives after a day</h2>
          <div className="grid-3" style={{ marginTop: "var(--sp-4)" }}>
            {AGENTS.map((agent) => (
              <article key={agent.name} className="card">
                <div className="card__head">
                  <span className="tag">{agent.job}</span>
                  <span className="push" />
                  <strong>{agent.name}</strong>
                </div>
                <div className="card__body body-sm">{agent.body}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="front-section">
          <h2 className="h3">Two things this does not do</h2>
          <div className="grid-3" style={{ marginTop: "var(--sp-4)" }}>
            <div className="prose">
              <p className="body-sm">
                <strong>It does not show a price it cannot prove.</strong> Amazon&rsquo;s product API issues
                credentials only after an account has ten qualifying sales in thirty days. Until yours
                clears, an Amazon link says &ldquo;check current price&rdquo; rather than inventing one.
              </p>
            </div>
            <div className="prose">
              <p className="body-sm">
                <strong>It does not generate pages to fill a site.</strong> One store is a handful of pages
                with price history, a method and sources — the shape a search engine rewards and a reader
                links to.
              </p>
            </div>
            <div className="prose">
              <p className="body-sm">
                <strong>It does not hold your accounts.</strong> Your GitHub, your Vercel, your Associates
                account. The build uses tokens you connect, and deleting your Cairn account leaves the
                store running.
              </p>
            </div>
          </div>
        </section>

        <section className="front-section">
          <div className="split">
            <div>
              <h2 className="h3">$299 to build it, $9 a month to keep it true</h2>
              <p className="body-sm" style={{ marginTop: "var(--sp-2)", maxWidth: "var(--measure)" }}>
                The build fee is a one-time payment after a call. The caretaker fee covers the nightly
                price and link refresh; stop paying and the store keeps working, it just stops updating.
              </p>
            </div>
            <Link className="btn btn--primary" to="/pricing">See what is included</Link>
          </div>
        </section>

        <footer className="footer">
          <div className="split">
            <p className="meta">
              Cairn builds affiliate stores. Links on a generated store earn a commission, disclosed above
              the first link on every page.
            </p>
            <div className="cluster">
              <Link className="meta" to="/legal/terms">Terms</Link>
              <Link className="meta" to="/legal/privacy">Privacy</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
