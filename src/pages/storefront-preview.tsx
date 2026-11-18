import { Link } from "react-router-dom";
import { Brand } from "@/components/brand";
import { SAMPLE } from "@/lib/data";
import "@/styles/storefront.css";

/**
 * Job 8: the reader's screen — rendered by the generated store inside the owner's
 * repository, shown here as a preview. Disclosure sits above the first link,
 * every price carries its source and timestamp, and the merchant name is the
 * gate: no stamped number for a gated merchant.
 */
export default function StorefrontPreview() {
  return (
    <div className="store">
      <div className="store-topbar">
        <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
          <Brand />
        </Link>
        <span className="push" />
        <nav className="store-nav">
          <a href="#methodology">Method</a>
          <a href="#disclosure">Disclosure</a>
        </nav>
        {SAMPLE && <span className="tag">Sample</span>}
      </div>

      <article className="store-page">
        <p className="store-kicker">Field notes · no. 12</p>
        <h1 className="store-title">The resin printer that earns its bench space</h1>
        <p className="store-lede">
          We only review what we print on. Phrozen Mini 8K S was tested for 14 weeks on
          miniature work — thin walls, 28&nbsp;mm faces, supports that retouch cleanly.
        </p>

        <p className="store-disclosure" id="disclosure">
          Links on this page are affiliate links. If you buy through them, the seller pays us a
          commission. The price and the ranking account for it; the commission never changes our
          verdict. <a href="#method">How we decide →</a>
        </p>

        <div className="store-block">
          <p className="eyebrow">The stamp</p>
          <p className="store-price">$289 <span className="store-price-meta">at the specialist retailer — checked 17 Nov 2026, price stamped by the feed, not typed by us.</span></p>
          <div className="cluster" style={{ marginTop: "var(--sp-3)" }}>
            <a className="btn btn--primary" href="/go/resin-miniatures/elegoo-saturn">Check current price at the retailer →</a>
            <a className="btn" href="/go/resin-miniatures/elegoo-saturn">Elegoo Saturn 4 — $289 at the specialist</a>
          </div>
        </div>

        <div className="store-block">
          <p className="eyebrow">Also considered</p>
          <div className="store-block-grid">
            <div><strong>Elegoo Saturn 4</strong><p className="store-note">Runner-up. Bigger volume, same margin, same price band.</p></div>
            <div><strong>Anycubic Photon</strong><p className="store-note">Where most buyers start. Respectable, but the plate needs levelling every run.</p></div>
          </div>
        </div>

        <div className="store-block" id="method">
          <p className="eyebrow">How we decide</p>
          <p className="store-note" id="methodology">
            Three questions: does it print what mini painters ask from it; does it keep margin for
            the seller to honour its feed prices; does it age well (resin cost, consumables, the
            gate's own economics). Sources: our feeds and the merchant pages, refreshed nightly;
            we say what we do not know.
          </p>
        </div>

        <p className="store-foot"><Link to="/stores">Back to the workspace that built this preview.</Link></p>
      </article>
    </div>
  );
}
