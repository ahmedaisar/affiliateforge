import { Link } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { LegalDraft } from "@/components/legal-draft";

export default function Terms() {
  return (
    <>
      <SiteHeader current="/legal/terms" />
      <main className="page">
        <header className="page-head--front">
          <p className="eyebrow">Terms of service</p>
          <h1 className="h1" style={{ marginTop: "var(--sp-3)" }}>Terms</h1>
        </header>
        <LegalDraft what="page — text written against the shipped code 18 Nov 2026; not yet approved by the owner" />

        <div className="prose" style={{ marginTop: "var(--sp-5)" }}>
          <h2 className="h3">What you get and what you don't</h2>
          <p className="body-sm">
            A build: a sourced niche brief, an offer list ordered by commission per sale, a
            storefront pushed to your repository and deployed on your host, and a nightly
            refresh of prices and links while the caretaker fee is paid. Not included:
            rankings, traffic, commissions, or any guarantee that a merchant accepts your
            application. Those are yours to pursue with the merchant.
          </p>

          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>Your store, your accounts</h2>
          <p className="body-sm">
            The repository, generated files and domain belong to you. Your affiliate accounts
            are yours; the networks you work with set their own terms, including Amazon's ten
            qualifying sales in thirty days before any API access exists. We do not hold
            credentials for networks.
          </p>

          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>What "$299 + $9 a month" means today</h2>
          <p className="body-sm">
            The build fee is a one-time payment made outside this app after a scoping call.
            The caretaker fee is $9 a month while we refresh offer data and links nightly.
            Cancellation stops the refresh, not the store; there is nothing to cancel right
            now because there is no self-serve billing in this dev build.
          </p>

          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>Also known as</h2>
          <ul className="body-sm">
            <li>Affiliate links disclose commissions in the storefront, above the first link.</li>
            <li>Prices and offers are stamped with the feed's time; a gated merchant shows "check current price" rather than inventing one.</li>
            <li>Cairn does not operate, repair or secure the merchant's own checkout.</li>
          </ul>
        </div>
        <p className="meta" style={{ marginTop: "var(--sp-6)" }}><Link to="/">Back</Link></p>
      </main>
    </>
  );
}
