# Product plan

The phases and stages that carry the product from its first screen to release and beyond,
each with its scope and status. Read it when planning the next stage, when asked what is
done or what comes next, and at every release. **The status lives here.** `AGENTS.md` § 2.7
carries at most three lines of it with a link back, and the story of what each release
shipped moves to `docs/RELEASE-HISTORY.md` at the next release.

Stage numbers are the `app-lifecycle` skill's defaults; a phase merges or splits them where
this product's order differs, and says so.

## Status

**Stage 2 (design) is in flight; Phase 1 is the active phase.** Nothing is in production;
nothing is deployed; the repository holds documents, the design kit and artboards and no app
code. **Decided 2026-11-17:** D1 B (build and hand over), D2 portfolio operators, D3 $299 +
$9/month, D4 billing only, D5 eBay first with Amazon gated, D6 Cairn. **Still to read:** the five provisional picks in `decisions.md` — the shape switches,
`billing: none`, the stack, the phase order and the storefront direction. **Phase 1 is
complete**: the shell is Trade press (owner's pick, 17 Nov 2026) and the artboards are
rendered. **Next: Phase 2**, screens on sample data with the front door beside them.

## Assumptions this plan rests on — the owner should confirm or refute these first

1. **The reader is a stranger on a phone, not the operator.** If the operator is the main
   visitor (they shop through their own links), the store's design priorities invert and
   Phase 2's artboards change.
2. **The operator's own affiliate accounts stay theirs.** This is what keeps a credential
   out of our database and makes direction B possible. If the owner wants us to hold keys
   (direction A), Phase 3 gains a secrets vault and its threat model, and the plan grows a
   phase.
3. **A build is a day, not a minute.** The agents research, generate and verify; a queue and
   a progress screen are enough. If builds must finish in five minutes to compete with
   FreshStore, Phase 6 splits and the agent budgets change.
4. **Price history is the differentiator worth paying for.** It is the one thing a rival
   cannot copy from a template, and the reason the refresh job exists. If the owner would
   rather ship breadth (more merchants, more pages), Phase 5's order changes.
5. **The niche brief's quality decides everything downstream.** Phase 5 is the largest
   single block of work for that reason, and it is scheduled before generation, not after.

## Phases

### Phase 0 — The review (this turn's output)

- **Owner review** — the proposal, these documents and the four provisional picks. Done
  when: D1–D6 are answered and the provisional picks are either read or corrected.
  Status: done (17 Nov 2026) for the six picks; the four provisional picks are still unread.

### Phase 1 — Design (stage 2)

- **The jobs map** — each of the eight jobs as a screen, the one question that screen
  answers, its primary action. Drawn from `brief.md` § Jobs to be done. Done when: every job
  has a screen and no screen answers two questions. Status: drafted (`design/jobs-map.md`).
- **The kit** — `design/tokens.css` (every raw value), `design/kit.css` (primitives built
  from tokens), `design/README.md` (the design record; `design/kit-notes.md` becomes its
  evidence). Done when: no colour, size or space literal exists outside `tokens.css`, and
  the kit renders a specimen page of its own controls and states. Status: in flight —
  `design/tokens.css`, `design/kit.css` and `design/README.md` landed with the artboards.
- **Artboards** — two app-shell directions at 1440 and 390, plus the three storefront
  directions from the proposal rebuilt from the kit (Field Notes, Bench, Scout). Done when:
  the owner picks one app direction and one storefront direction, recorded in
  `decisions.md`. Status: **done (17 Nov 2026)** — the owner picked **Trade press**; the
  other shell was deleted. The storefront direction (Field Notes) is recorded provisionally
  in `decisions.md` for one read, and is confirmed or corrected when the first store is
  generated in Phase 6.

### Phase 2 — Screens on sample data, and the front door (stage 3)

- **The screens** — `/stores` (portfolio), `/stores/[id]/niche` (brief + evidence),
  `/stores/[id]/look` (three specimens), `/stores/[id]/catalogue`, `/stores/[id]/gate`
  (price gate), `/stores/[id]/build` (run), and a storefront preview at
  `/stores/[id]/preview/…`. Sample data fills every state, behind the seams the real system
  will use. Done when: the newcomer walkthrough, the rendered pass at 1440/768/390, the
  screenshot critique and the scored audit pass with P0 and P1 fixed, and the owner has
  clicked through every state at phone and desktop width. Status: not started.
- **The front door** — `/`, `/pricing` (price as copy; no plan table, per `billing: none`),
  `/legal/terms`, `/legal/privacy` (placeholders marked as such), a footer. Reads no
  session. Done when: a stranger can read all of it signed out at 390 px and no page names
  a price the product does not charge. Status: not started.

### Phase 3 — Setup (stage 4)

- **Clerk and Supabase** — a development Clerk application with organizations enabled, a
  development Supabase project, keys in `.env`, `.env.example`, a row each in
  `docs/variables.md`, the env schema failing at build. Done when: the app boots on the
  development keys and sign-up creates an organization. Status: not started.

### Phase 4 — The first real slice (stage 5)

- **Workspaces and stores** — sign-in landing on `/stores`, `workspaces` and
  `memberships`, the first migration, RLS on every table, store create/rename/delete, niche
  briefs stored with their evidence rows, the three access functions from `AGENTS.md` § 1.1.
  Done when: two operators in different workspaces cannot see each other's stores or briefs
  (a test per route), a store with no niche cannot be built, and `docs/permissions.md` and
  `docs/architecture.md` describe what is there. Status: not started.

### Phase 5 — The research agents

- **Scout (niche research)** — a server-side job that takes a niche, searches, and returns a
  brief with a score and evidence lines carrying source URL and fetch date; a per-run token
  and time budget; every claim stored as a row, never only as prose. Done when: three real
  niches produce briefs whose evidence lines all open, a refuted claim shows as refuted, and
  the cost per brief is recorded in `docs/flows.md`. Status: not started.
- **Broker (offers)** — network adapters for eBay Partner Network and one specialist
  network, returning products with commission per sale, the affiliate link, and each
  merchant's state; the catalogue is approved and frozen by the operator. Done when: a
  catalogue for one niche shows live links that resolve, the gate state for Amazon is
  represented as a state rather than an error, and a network outage degrades one merchant,
  not the catalogue. Status: not started.

### Phase 6 — Generation and handover

- **Mason (store build)** — writes the storefront from the chosen direction and the frozen
  catalogue, pushes to a repository in the operator's GitHub via their token, deploys to
  their Vercel via their token, returns URL, repo and commit; the run log is append-only and
  visible while it runs. Done when: one generated store is live on the operator's own
  domain with disclosure above the first link, a method page with sources, a sitemap, and
  every price carrying its source and timestamp. Status: not started.
- **The nightly caretaker** — price and offer refresh, the dead-link state, one summary line
  per change. Done when: a price change on a real product reaches the live page within a
  day, a deliberately dead link renders as a state, and the run costs under $2 per store per
  month. Status: not started.
- **The H1 trial** — three stores in two niches on real domains, measuring indexation at 14
  days, impressions at 45 and commission at 60 (proposal § 9). Done when: the numbers are
  recorded and H1 is marked supported or refuted. This trial is the product's real gate:
  two of three earning a commission keeps direction B; zero of three moves the product to a
  research-and-export tool at $29/month. Status: not started.

### Phase 7 — Browser proof (stage 6)

- **The suite** — Playwright: the signed-out journey (landing → pricing → legal), the
  signed-in journey (sign-in → `/stores` → create → brief → catalogue → build), and the
  permission matrix, one test per route that touches data. Done when: the gate, including
  the authenticated mile, is green on the agent's own run, and `docs/test-coverage.md` is
  written by whoever ran it. Status: not started.

### Phase 8 — Publish (stage 7)

- **The first deploy** — repository, Netlify site with its environment, `/health` reporting
  the database. The URL is shared with nobody yet. Done when: the deployed `/health` answers
  ok on the development keys. Status: not started.

### Phase 9 — The front door made true (stage 8)

- **Legal and price copy** — real terms and privacy text, approved by the owner; the
  disclosure policy the generated stores will carry; the pricing page true to what is
  charged. Done when: a stranger could sign up and see true legal pages whose text the owner
  approved. Status: not started.

### Phase 10 — Go live (stage 9)

- Production Clerk instance and Supabase project, production branch, custom domain, the
  first release reviewed over the whole product, the environment record, the token cleanup
  and the production checks — the `release-gate` skill's go-live list. Done when: the
  production URL serves the reviewed commit, a stranger can sign up on a phone with legal
  consent shown, and that account reads back in production's identity instance and database.
  Status: not started.

### Phase 11 — After the first release

Proposed when each trigger fires, never pasted in advance (the `app-lifecycle` skill's
capability table):

| Capability | Trigger |
|---|---|
| Uptime monitor + status page | go-live's done-when holds |
| Error tracking | first real users, or the first 500 nobody saw |
| Cookieless analytics | a landing page exists and the privacy page can promise it |
| Edge flood limits | first deploy done and a public `POST` exists (the affiliate redirect is one) |
| Hosted CI gate | a second person pushes, or at go-live |
| Transactional email | a flow must reach someone outside the session (build finished, refresh failed) |
| Deletion webhooks + personal data | before the first paying customer |
| Retention job | the first retention promise on a legal page |

## Backlog — deferred, each with the trigger that reopens it

- **Own-product checkout in generated stores** (D4 option B) — reopen: a customer asks, or
  ten customers exist.
- **White-label for agencies** (D1 option C) — reopen: three agencies ask for the same build
  with their own badge.
- **Hosted portfolio product** (D1 option A) — reopen: H2 fails (0–1 of 10 pre-pay).
- **WordPress export instead of a store** — reopen: ten operators say WordPress plus plugins
  is the competitor, not FreshStore.
- **Second merchant network beyond one specialist** — reopen: the first network's commission
  per sale is under the build's cost per page.
- **Amazon price display** — reopen: the operator's Associates account clears the gate
  (10 qualifying sales in 30 days), which is the buyer's action, not ours.
