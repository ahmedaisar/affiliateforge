# Phase 2 — status, 18 Nov 2026 (end of session)

**Functionally complete.** Every planned Phase 2 artefact now exists in the repository,
verified at 07:51 UTC by `scripts/verify.sh` (pass) and the headless-Chromium audit at
390 and 1440 (13 routes, 0 console errors). The two owner steps remain open — rendered
pass on a phone or desktop with your own eyes, and your legal approval of the legal
drafts — but the engineering you would otherwise have to review is now stable.

| Delivered this cycle | Commit | Status |
|---|---|---|
| Vite + React Router SPA replaces Next.js | `381ee31` | done |
| SQLite backend + API seam for stores, catalogue, brief, build log, clicks | `bb7be11` | done |
| `/legal/terms` and `/legal/privacy` written from shipped code | `35c0be2` | awaits your signature |
| Niche brief + evidence behind `/api` | `e7a2d9a` | done |
| `scripts/demo.sh --tunnel` — full public demo, **read-only** by default | `15b29ab` | done |
| `scripts/check_build.mjs` — bundle smoke test with no raw-palette checks | `d34b4bc` | done |
| Current commit head: docs reconciled with reality | `bf75e29` | done |

**What changed the demo posture:** visitors on the public link now get the whole front
door (landing, pricing, stores, brief, reader preview) but every write verb returns 503,
and the new-store control renders disabled. The stray `bikerental.mv` came through an
open tunnel; after the owner flagged it, non-owner mutations are no longer possible at
all from the public link.

**Still owed — yours only:**

1. **Legal review of the two drafts.** Not approval, review. The draft was written to
   describe the shipped code so it cannot be wrong about the product.
2. **An owner-side browser pass** of the public link — route by route, at phone width,
   on your own device. You already found one bug this way on the desktop build.
3. **Phase 3 decision:** Clerk test keys + Supabase project, or the $0 "demo-as-is" tag
   for indefinite public hosting.

**Reproduction:** `scripts/verify.sh` from the repo root. Anything not green is a bug;
anything green that is wrong is either yours to flag or mine to fix tomorrow.
