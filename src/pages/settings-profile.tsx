import { useEffect, useState } from "react";
import { OperatorShell } from "@/components/operator-shell";
import { fetchChoices, saveChoices } from "@/lib/api";

/** Workspace settings — the name you operate under, the email the notifications
 *  will use, the role you hold (read-only until Phase 3 puts a real account behind it). */
export default function SettingsProfile() {
  const [workspace, setWorkspace] = useState("Ridge Media");
  const [email, setEmail] = useState("founder@ridge-media.example");
  const [status, setStatus] = useState<"loading" | "idle" | "saved" | "error">("loading");

  useEffect(() => {
    fetchChoices("workspace")
      .then((c) => { if (c.workspace_name) setWorkspace(c.workspace_name); if (c.account_email) setEmail(c.account_email); setStatus("idle"); })
      .catch(() => setStatus("error"));
  }, []);

  const save = async () => {
    setStatus("loading");
    try { await saveChoices("workspace", { workspace_name: workspace.trim(), account_email: email.trim() }); setStatus("saved"); }
    catch { setStatus("error"); }
  };

  return (
    <OperatorShell current="/settings/profile">
      <div className="page-head">
        <div className="stack-sm">
          <p className="eyebrow">Settings · Workspace</p>
          <h1 className="h1">You, the operator</h1>
          <p className="page-head__sub">Everything that isn't the product's business is yours: name, reach, role.</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: "var(--sp-5)", maxWidth: "44rem" }}>
        <div className="card__head"><strong>Profile</strong></div>
        <div className="card__body stack">
          <div>
            <label className="label" htmlFor="ws-name">Workspace name</label>
            <input id="ws-name" className="field" value={workspace} onChange={(e) => setWorkspace(e.target.value)} autoComplete="off" spellCheck={false} />
            <p className="hint">Used on the portfolio, the build log and any exported handover.</p>
          </div>
          <div>
            <label className="label" htmlFor="ws-email">Contact email</label>
            <input id="ws-email" className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" spellCheck={false} />
            <p className="hint">Where build finishes and link-death alerts will go — once email exists in Phase 8.</p>
          </div>
          <div>
            <label className="label" htmlFor="ws-role">Role</label>
            <input id="ws-role" className="field" value="Owner (demo workspace — not an auth concept yet)" readOnly disabled />
            <p className="hint">No other members exist until Phase 3 introduces organizations.</p>
          </div>
          <div className="cluster">
            <button className="btn btn--primary" onClick={save} disabled={status === "loading"}>{status === "saved" ? "Saved" : "Save workspace"}</button>
            {status === "error" && <span className="meta" style={{ color: "var(--bad)" }}>Could not reach the workspace store.</span>}
          </div>
        </div>
      </div>
    </OperatorShell>
  );
}
