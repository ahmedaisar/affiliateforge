import { useEffect, useRef, useState } from "react";
import type { Store } from "@/lib/data";

/** Inline modal form for creating a store: no window.prompt, real validation,
 *  server error surfaces in the form rather than failing silently. */
export function NewStoreDialog({ onCreated, onError, onClose }: {
  onCreated: (store: Store) => void;
  onError: (message: string) => void;
  onClose: () => void;
}) {
  const [domain, setDomain] = useState("");
  const [niche, setNiche] = useState("");
  const [busy, setBusy] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const domainRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    domainRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setFieldError(null);
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ domain: domain.trim(), niche: niche.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setFieldError(body.error ?? "The store could not be created.");
        setBusy(false);
        return;
      }
      onCreated(await res.json());
    } catch {
      setFieldError("The server did not answer. Is it running?");
      onError("The server did not answer.");
      setBusy(false);
    }
  };

  return (
    <dialog ref={dialogRef} aria-labelledby="new-store-title" onClose={onClose}
      style={{ border: 0, borderRadius: "var(--r-3)", padding: 0, background: "var(--paper)", color: "inherit", maxWidth: "32rem", width: "calc(100% - var(--sp-6))" }}>
      <form onSubmit={submit} method="dialog">
        <div className="card__head">
          <h2 id="new-store-title" className="h3" style={{ margin: 0 }}>New store</h2>
          <button type="button" className="btn btn--quiet push" aria-label="Close" onClick={onClose}>Close</button>
        </div>
        <div className="card__body stack">
          <div>
            <label className="label" htmlFor="new-domain">Domain</label>
            <input id="new-domain" ref={domainRef} className="field" value={domain} onChange={(e) => setDomain(e.target.value)}
              placeholder="resin-bench.com" required autoComplete="off" spellCheck={false} />
            <p className="hint">Barely a site — you buy it from any registrar. Not used until you own it.</p>
          </div>
          <div>
            <label className="label" htmlFor="new-niche">Niche</label>
            <textarea id="new-niche" className="field" rows={2} value={niche} onChange={(e) => setNiche(e.target.value)}
              placeholder="Miniature tank photography for wargamers" required />
            <p className="hint">What you would write about for years, whether or not you sold anything.</p>
          </div>
          {fieldError && <p className="body-sm" style={{ color: "var(--bad)" }}>{fieldError}</p>}
        </div>
        <div className="card__foot cluster">
          <button type="button" className="btn" onClick={onClose} disabled={busy}>Cancel</button>
          <button type="submit" className="btn btn--primary push" disabled={busy || !domain.trim() || !niche.trim()}>
            {busy ? "Creating…" : "Create store"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
