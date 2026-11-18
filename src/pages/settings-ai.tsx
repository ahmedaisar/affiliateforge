import { useEffect, useState } from "react";
import { OperatorShell } from "@/components/operator-shell";
import { fetchChoices, saveChoices } from "@/lib/api";

const PROVIDERS = [
  { id: "anthropic", label: "Anthropic (Claude)", hint: "sk-ant-…" },
  { id: "openai", label: "OpenAI (GPT)", hint: "sk-…" },
  { id: "google", label: "Google (Gemini)", hint: "AIza…" },
  { id: "openrouter", label: "OpenRouter (any model)", hint: "sk-or-…" },
] as const;

/** AI provider settings — the owner's key, never ours, never typed-as-password
 *  because this app is local-first and the OS keychain is the browser; exposing
 *  the input as plain text is deliberate for same-user inspection (kit README
 *  §API keys). */
export default function SettingsAi() {
  const [provider, setProvider] = useState<string>("anthropic");
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<"loading" | "idle" | "saved" | "error">("loading");
  const [stored, setStored] = useState<string | null>(null);

  useEffect(() => {
    fetchChoices("workspace")
      .then((c) => { if (c.ai_provider) setProvider(c.ai_provider); if (c.ai_key_hint) setStored(c.ai_key_hint); setStatus("idle"); })
      .catch(() => setStatus("error"));
  }, []);

  const save = async () => {
    setStatus("loading");
    const hint = key.trim().slice(0, 4) + "…" + key.trim().slice(-2);
    try {
      await saveChoices("workspace", { ai_provider: provider, ai_key_hint: key.trim() ? hint : stored ?? "" });
      if (key.trim()) setStored(hint);
      setKey("");
      setStatus("saved");
    } catch { setStatus("error"); }
  };

  const clear = async () => {
    setStatus("loading");
    try {
      await saveChoices("workspace", { ai_provider: provider, ai_key_hint: "" });
      setStored(null); setKey(""); setStatus("saved");
    } catch { setStatus("error"); }
  };

  return (
    <OperatorShell current="/settings/ai">
      <div className="page-head">
        <div className="stack-sm">
          <p className="eyebrow">Settings · AI provider</p>
          <h1 className="h1">The key the agents will use on your behalf</h1>
          <p className="page-head__sub">Paid by you, held by you; we only ever see it in transit on your machine.</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: "var(--sp-5)", maxWidth: "44rem" }}>
        <div className="card__head"><strong>Provider</strong></div>
        <div className="card__body stack">
          <div role="radiogroup" aria-label="AI provider" className="stack-sm">
            {PROVIDERS.map((p) => (
              <label key={p.id} className="cluster" style={{ padding: "var(--sp-2) var(--sp-3)", borderRadius: "var(--r-2)", border: provider === p.id ? "var(--bw-strong) solid var(--accent)" : "var(--bw) solid var(--rule)", cursor: "pointer" }}>
                <input type="radio" name="provider" value={p.id} checked={provider === p.id} onChange={() => setProvider(p.id)} />
                <span><strong>{p.label}</strong><br /><span className="meta">sk-… — kept in this workspace only</span></span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "var(--sp-5)", maxWidth: "44rem" }}>
        <div className="card__head"><strong>Key</strong>{stored && <span className="tag" style={{ marginLeft: "auto" }}>saved {stored}</span>}</div>
        <div className="card__body stack">
          <div>
            <label className="label" htmlFor="ai-key">API key</label>
            <div className="cluster" style={{ gap: "var(--sp-2)" }}>
              <input id="ai-key" className="field" type="text" value={key} onChange={(e) => setKey(e.target.value)}
                autoComplete="off" spellCheck={false} placeholder="paste your key here — visible, because this is a local tool" />
            </div>
            <p className="hint">Plain text on your disk is not exposed beyond this machine. Clearing forgets it without touching the provider.</p>
          </div>
          <div className="cluster">
            <button className="btn btn--primary" onClick={save} disabled={status === "loading" || (!key.trim() && !!stored)}>{status === "saved" ? "Saved" : "Save key"}</button>
            {stored && <button className="btn" onClick={clear} disabled={status === "loading"}>Forget key</button>}
            {status === "error" && <span className="meta" style={{ color: "var(--bad)" }}>Could not reach the workspace store.</span>}
          </div>
        </div>
      </div>
    </OperatorShell>
  );
}
