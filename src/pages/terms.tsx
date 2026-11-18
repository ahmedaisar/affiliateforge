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
        <LegalDraft what="page" />
        <div className="prose" style={{ marginTop: "var(--sp-5)" }}>
          <h2 className="h3">What you are buying</h2>
          <p className="body-sm">
            A build: research, a catalogue, a storefront pushed to your own repository and deployed to
            your own host, and a nightly refresh for as long as the caretaker fee is paid.
          </p>
          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>What you own</h2>
          <p className="body-sm">
            The repository, the store, the domain and the affiliate accounts are yours. Cairn keeps no
            copy of the storefront after handing it over.
          </p>
          <h2 className="h3" style={{ marginTop: "var(--sp-5)" }}>What we do not promise</h2>
          <p className="body-sm">
            Search rankings, traffic or commission. The product&rsquo;s own hypothesis is that a store
            earns its first commission within sixty days; that is a hypothesis under test, not a term.
          </p>
        </div>
        <p className="meta" style={{ marginTop: "var(--sp-6)" }}><Link to="/">Back</Link></p>
      </main>
    </>
  );
}
