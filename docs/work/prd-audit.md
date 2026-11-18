# PRD / Plan audit — 18 Nov 2026

Checked against `docs/product/brief.md` (UC1–UC10), `docs/product/plan.md` phases 2–7 and
`docs/product/decisions.md`. "Built" means code runs and answers; "Wired" means the frontend
reads it instead of a fixture.

| Requirement (source) | Status | Note |
|---|---|---|
| Landing, pricing, legal drafts (UC1, plan P2) | Built, static | Session-free, no entitlements; price as copy |
| Member home `/stores` with states (UC8, P2) | Built, wired | Reads `/api/stores` and `/api/activity` |
| Niche brief + evidence (UC2, P5 Scout) | Built, wired (sample) | Served by the backend from seeded rows; no agent, no research budget, every claim still marked sample |
| Look choice & gate progress (UC3, UC5) | Built, persisted | `store_choices` table; UI reads and writes it, verified round-trip via PUT/GET |
| Build run + handover (UC6, P6 Mason) | Partial | The picker persists; the run log persists; there is no build engine and no GitHub/Vercel push yet |
| Catalogue ordered by commission (UC4, P5 Broker) | Built, wired end-to-end | Row-level DELETE survives refresh; Approve writes one build-log line that appears the following morning and cannot be undone from the UI |
| Amazon/specialist price gate (UC5) | Built, UI only | Gate is display; no merchant adapter |
| Reader storefront `/preview` (UC9) | Built + wired + visible | CTA hits `/go/...`; UI shows tracked clicks on `/stores` (verified: 2 rows logged, portfolio strip renders, `/api/insights` 200) |
| Auth / workspaces / RLS (UC1, UC10, P4–5) | **Parked — owner instruction of 18 Nov 2026** | No Clerk, no Postgres; the local API has an optional dev token and no tenant boundary. Owner explicitly chose SQLite + no auth for development. See decisions 2026-11-18 |

**Owner-reported defects (18 Nov 2026, evening pass):** two were found only by doing
the phone pass the owner asked for — a foreign-key violation on account-level choices was
silently swallowing every `/api/stores/workspace/choices` write (the settings screens had
been writing to a `store_id = 'workspace'` row that did not exist; `ERR_SQLITE_ERROR 787`,
surfaces none in the UI), which is why the key always looked empty and the click feedback
appeared to work but did not persist. Fixed by splitting the table. Also fixed: dead-looking
inert nav spans in `/stores` (linked through to real routes), a topbar that refused to wrap
at 390 px (kit-level `@media` at 720 px), and the screenshot set — all 10 app images this pass
came from the phone-unfriendly build; all recaptured against the fix.

**Defect log 18 Nov 2026 (evening):** a `bikerental.mv` store appeared in the
portfolio via the public tunnel before the comment was withdrawn and deleted at
08:27 UTC — exactly the failure mode an unauthenticated quick tunnel produces.
Fixed by deletion and noted here; no action was required beyond removing the
row; Phase 3 is parked by owner's 2026-11-18 instruction — reopen only by a dated decision entry before inviting
strangers.

**Defect log 18 Nov 2026 (evening, round 2):** settings pages (`/settings/ai`,
`/settings/profile`) shipped but silently dropped every write — the back-end's
`store_choices` foreign key to `stores(id)` rejects the `"workspace"` pseudo-store.
`ERR_SQLITE_ERROR 787` logged, UI showed nothing. Split to `workspace_choices`.

**Input-abuse pass (18 Nov 2026):**
**Input-abuse pass (18 Nov 2026):** malformed JSON, oversized bodies, SQL-ish choice keys,
XSS-shaped strings and path-traversal ids — all handled (400 or silently ignored); the seed
resets to seven demo stores. No 500s remain on any probed route. Method: a fuzz script that
hits `/api/stores`, `/go/`, `/api/stores/:id/brief`, YAML-safe choices. Gaps found and fixed
in the same session: the 500 on bad JSON, the `GET 000` on oversized queries, the missing
caps and the unvalidated choices keys. This is not a security audit; it is what stood between a bug and a crash.
| Backend / anything with state | **Built, local** | Node + node:sqlite on `127.0.0.1:8787`: stores, catalogue (approve, remove), build log, morning activity, outbound click logging with 302 to merchant |
| Agents (Scout/Broker/Mason) | **Missing** | Phase 5–6 |
| Real affiliate feeds | **Missing** | Keys, networks, approval flows |
| Tests | 6 unit (fixture contracts only) | Browser gate absent — the operator flow is manually exercised in Playwright but not yet automated in CI |
| Legal pages | Built, wired, **not approved** | Text is honest about what exists; nobody approved it |

**Backend now exists and is the source of truth for stores, catalogue, build log and click
counts.** The frontend reads `/api` (proxied in development); the niche brief is served from the backend's seeded rows — no Scout agent exists yet. Phase 3 is **parked by the owner's 2026-11-18 instruction**: development remains on the local SQLite file with no auth;
the local backend stays on SQLite and gains the workspace
column — owner's call. Agents (Phase 5) remain the largest unbuilt block.

**Verification, 18 Nov 2026 (final evening pass):** all 14 app routes at 390x844,
zero pageerrors; the public tunnel now runs read-only end-to-end (writes 503 via
`CAIRN_READ_ONLY=1`; nine routes 200, one probe 503); `verify.sh` five gates green;
no stray demo store remains — the tunnel-created `bikerental.mv` was deleted.

**Verification, 18 Nov 2026 (whole day):** `/health` 200, `/api/stores` 200 with seven seeded stores, `/api/stores/:id/brief` 200, catalogue DELETE 200, approval 200 after fix, input-hardening fuzz pass clean, Playwright flow walk clean, build clean.

**18 Nov 2026 — a fix called a feature, caught the same day:** an owner-driven 581-line change
built a self-contained static storefront generator (`server/build-store.mjs`) that emits
`index.html`, `method.html`, `404.html` and `sitemap.xml` into `dist-stores/` with FTC
disclosure above the merchant links, nothing that reads as a stale price, and claims you can
click to a source. The base `./` work that preceded it is shown up by this just as cleanly:
the owner flagged it, the generator proves deep routes load, and README now names the command
(`scripts/demo.sh --tunnel`) rather than any single link.

**Verification this turn:** `/health` 200, `/api/stores` 200 with seven seeded stores, an
unknown route returns 404 JSON, a 302 redirect logs a click and forwards with the intended
tag, duplicate-domain create succeeds with suffixed id, invalid domain returns 400.
Unit suite: 6 passing (down from 10 — fixture-contract tests rewritten for the new seam).
