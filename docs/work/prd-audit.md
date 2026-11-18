# PRD / Plan audit — 18 Nov 2026

Checked against `docs/product/brief.md` (UC1–UC10), `docs/product/plan.md` phases 2–7 and
`docs/product/decisions.md`. "Built" means code runs and answers; "Wired" means the frontend
reads it instead of a fixture.

| Requirement (source) | Status | Note |
|---|---|---|
| Landing, pricing, legal drafts (UC1, plan P2) | Built, static | Session-free, no entitlements; price as copy |
| Member home `/stores` with states (UC8, P2) | Built, fixture | Reads `lib/data.ts`; no workspace/auth boundary |
| Niche brief + evidence (UC2, P5 Scout) | Built, wired (sample) | Served by the backend; no agent, no research budget, every claim still marked sample |
| Look choice & gate progress (UC3, UC5) | Built, persisted | `store_choices` table; UI reads and writes it, verified round-trip via PUT/GET |
| Look choice (UC3) | Built, fixture | Choice not persisted |
| Catalogue ordered by commission (UC4, P5 Broker) | Built, wired | Removal is a DELETE; Approve writes one build-log line; network sends go to eBay sample links |
| Amazon/specialist price gate (UC5) | Built, UI only | Gate is display; no merchant adapter |
| Build run + handover (UC6, P6 Mason) | Built, fixture | No repo/deploy side effect; no tokens exist |
| Reader storefront `/preview` (UC9) | Built + wired + visible | CTA hits `/go/...`; UI shows tracked clicks on `/stores` (verified: 2 rows logged, portfolio strip renders, `/api/insights` 200) |
| Auth / workspaces / RLS (UC1, UC10, P4–5) | **Missing** | No Clerk, no Postgres; the local API has an optional dev token and no tenant boundary |
| Backend / anything with state | **Built, local** | Node + node:sqlite on `127.0.0.1:8787`: stores, catalogue (approve, remove), build log, morning activity, outbound click logging with 302 to merchant |
| Agents (Scout/Broker/Mason) | **Missing** | Phase 5–6 |
| Real affiliate feeds | **Missing** | Keys, networks, approval flows |
| Tests | 10 unit, skipped per owner | Browser gate absent |
| Legal text | Drafts, unapproved (P9) | Cannot launch without owner approval |

**Backend now exists and is the source of truth for stores, catalogue, build log and click
counts.** The frontend reads `/api` (proxied in development); fixtures remain for the niche
brief (`lib/screenData.ts`) because no Scout exists yet. Phase 3 next: Clerk (organizations)
and Supabase Postgres with RLS, or the local backend keeps SQLite and gains the workspace
column — owner's call. Agents (Phase 5) remain the largest unbuilt block.

**Verification this turn:** `/health` 200, `/api/stores` 200 with seven seeded stores, an
unknown route returns 404 JSON, a 302 redirect logs a click and forwards with the intended
tag, duplicate-domain create succeeds with suffixed id, invalid domain returns 400.
Unit suite: 6 passing (down from 10 — fixture-contract tests rewritten for the new seam).
