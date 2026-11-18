import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { LegalDraft } from "@/components/legal-draft";

export default function Privacy() {
  return (
    <>
      <SiteHeader current="/legal/privacy" />
      <main className="page">
        <header className="page-head--front">
          <p className="eyebrow">Privacy</p>
          <h1 className="h1" style={{ marginTop: "var(--sp-3)" }}>Privacy</h1>
        </header>
        <LegalDraft what="page" />
        <div className="prose" style={{ marginTop: "var(--sp-5)" }}>
          <h2 className="h3">What we hold</h2>
          <p className="body-sm">
            An account: your email, your workspace and the stores you have built. Tokens you connect for
            GitHub and Vercel are stored encrypted and never returned by any page.
          </p>
          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>What a reader leaves</h2>
          <p className="body-sm">
            A reader of a generated store leaves nothing. The outbound click is counted by our redirect
            with the network, the store, the product and the time — no identifier, no cookie, no profile.
          </p>
          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>What we do not do</h2>
          <p className="body-sm">
            No analytics cookies, no advertising trackers, no sale of any data. This page is a draft
            because that promise has to be true of the built product before it is published.
          </p>
        </div>
        <p className="meta" style={{ marginTop: "var(--sp-6)" }}><Link to="/">Back</Link></p>
      </main>
    </>
  );
}
