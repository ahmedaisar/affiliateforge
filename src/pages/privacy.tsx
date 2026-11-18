import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { LegalDraft } from "@/components/legal-draft";

export const metadata = { title: "Privacy — Cairn" };

export default function Privacy() {
  return (
    <>
      <SiteHeader current="/legal/privacy" />
      <main className="page">
        <header className="page-head--front">
          <p className="eyebrow">Privacy</p>
          <h1 className="h1" style={{ marginTop: "var(--sp-3)" }}>Privacy</h1>
        </header>
        <LegalDraft what="page — text written against the shipped code 18 Nov 2026; not yet approved by the owner" />

        <div className="prose" style={{ marginTop: "var(--sp-5)" }}>
          <h2 className="h3">What we hold about visitors to a store</h2>
          <p className="body-sm">
            Nothing with a name on it. When a reader clicks an affiliate link, one row is stored:
            the store, the product id, the merchant, the network, and the time. There is no
            identifier, no cookie from us, no fingerprint. If you clear your other cookies,
            your row here clears nothing — there is nothing on your device to clear.
          </p>

          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>What we hold about operators</h2>
          <p className="body-sm">
            An email address (Clerk will hold it once Phase 3 lands), a workspace with a name you
            chose, and the stores you build. Credentials you connect — your GitHub and Vercel
            tokens — are stored encrypted, are never returned by any screen or API after you
            connect them, and are used only by the build step to push and deploy your store.
            Delete the workspace and the creds go with it; the repository in your GitHub account
            stays yours.
          </p>

          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>What we never do</h2>
          <p className="body-sm">
            No analytics cookies, no advertising trackers, no sale or sharing of reader or
            operator data. The affiliate link itself may drop the network's cookie on the
            network's domain — that cookie belongs to the network, not to us, and is the
            normal shape of this industry.
          </p>

          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>Your rights</h2>
          <p className="body-sm">
            You can ask for a copy of what the local database holds (currently: nothing beyond
            sample-data builds and one development workspace) and for the operator credentials
            to be deleted. Clicking the affiliate link is a contract between you and the retailer, not between you and us; we hold no order information.
          </p>
        </div>
        <p className="meta" style={{ marginTop: "var(--sp-6)" }}><Link to="/">Back</Link></p>
      </main>
    </>
  );
}
