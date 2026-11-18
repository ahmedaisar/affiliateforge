/** Legal pages are drafts until the owner approves their text (plan, Phase 9).
 *  The banner exists so a stranger is never shown an unreviewed promise as if
 *  it were final. */
export function LegalDraft({ what }: { what: string }) {
  return (
    <div className="banner" style={{ marginTop: "var(--sp-4)" }}>
      <div className="stack-sm grow">
        <p><strong>Draft — not yet reviewed.</strong></p>
        <p>This {what} is a placeholder written to be replaced. It is not legal advice and it is not yet in force.</p>
      </div>
    </div>
  );
}
