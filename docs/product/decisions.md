# Product decisions

A dated log of the product decisions that had real options: what was considered, what was
picked, why, and what would reopen it. Read it before reopening a decision, or before
choosing between options an earlier entry already weighed.

Newest first, one entry per decision. An entry is a receipt: a later reversal is a **new**
entry naming the one it replaces. A question not yet decided is an **open** entry —
**Picked:** open — and is filled in, not replaced, when the owner picks. A pick the agent
made under a blanket go is **provisional** until the owner has read it.

Evidence behind these: `proposal.html` in this folder (sources S1–S21, § 1 and § 2).

---

## 2026-11-18 — the control plane's stack: Vite, not Next.js

- **Options considered:** keep Next.js (App Router) as proposed; **Vite + React Router as a
  static SPA** with agent jobs as Supabase Edge Functions; Next.js with reduced output
  (static export only, no server components).
- **Picked:** **Vite + React Router (TypeScript SPA), static hosting, Edge Functions for
  agents** — by **the agent, provisionally**, under the owner's instruction on 17 Nov 2026
  after the build repeatedly died on this host (~950 MB RAM, no swap until that day; Next's
  dev/build toolchains and `tsc -b` were the memory ceiling). Listed for one read.
- **Why:** the framework was the wrong shape, not the product. A static SPA builds in about
  a second on this machine and is trivially hostable; Next's value here (server components,
  route handlers, middleware) would only be used by Phase 5's agents, which can live in Edge
  Functions against the same Postgres. This entry supersedes the "2026-11-17 — the stack for
  the control plane and for generated stores" entry, which stays as written.
- **Consequences, stated honestly:** the browser holds the Supabase anon key, so **RLS is
  the only authorization boundary in the control plane's wire path**; anything that needs a
  secret never happens in the client. Clerk's client SDK signs the user in; the browser
  forwards that token, and Edge Functions verify it. Static hosts need an SPA rewrite
  (`/* -> /index.html`); deep links otherwise 404. No server-side rendering; SEO of the
  landing page is a trade accepted in exchange for the machine that exists.
- **Reopen when:** a screen genuinely requires SSR or secrets in-page (release gate go/no-go
  would be the likely trigger), or the machine gains memory and a Tauri/Electron shell is
  wanted, or the 2 GB swap makes Next free again. Then a new entry; this one stays.

## 2026-11-17 — the generated storefront's direction

- **Options considered:** *Field Notes* (editorial serif, warm paper, footnoted — the proposal's
  recommendation); *Bench* (technical, data-dense, no photos); *Scout* (photo-led, bold,
  mobile-first). All three are drawn at 1:1 in the proposal's screen 2.
- **Picked:** **Field Notes** — by **the agent, provisionally**, since the proposal recommended
  it and the owner's acceptance of the proposal did not exclude it. Listed for one read.
- **Why:** the niche's rivals look like Bench, and readers arrive from forums where a
  publication voice travels further than a spec sheet. It is also the direction that looks
  least like a FreshStore site, which is the whole claim (§ 2.2 of `AGENTS.md`).
- **Reopen when:** the owner says otherwise, or the H1 trial's three stores show a Bench-shaped
  rival outranking a Field Notes store on the same niche.

## 2026-11-17 — the app shell's direction

- **Options considered:** A, *Trade press* — warm paper, serif display, top bar, one wide
  ruled table, generous spacing, continuing the proposal's look; B, *Workbench* — cool
  stock, condensed grotesque, left rail with counts, tighter rows, a state bar on every
  row's left edge; and a third drawn from halves of each.
- **Picked:** **A — Trade press**, by **the owner**: "Proceed ahead with A" (2026-11-17).
  **B was deleted** with its `[data-direction]` overrides, so no second theme can return by
  accident; `design/artboards.html` now draws the chosen shell alone at 1440 and 390.
- **Why A:** the product's whole claim is that a generated store should look like a
  publication a person would link to. A control plane that looks like every AI dashboard
  undercuts that claim before the first screen of a store is seen; B is quieter and scans
  better at thirty rows, which is a real advantage, and is closer to what the market
  already sells.
- **Reopen when:** a real portfolio reaches thirty stores and the ruled table stops scanning
  — then A keeps its type and stock and takes the left rail and the 39 px rows that lost here.
  That is the cost this entry accepted: the choice was made on what the product says about
  itself, not on density.

## 2026-11-17 — whether the product has in-app billing

- **Options considered:** the identity provider's billing (Clerk Billing subscriptions, the
  default); Stripe Checkout/Billing in-app; no in-app billing, the fee collected outside it.
- **Picked:** none in v1 — by **the agent, provisionally**. The price is real ($299 build,
  $9/month caretaker) but it is charged by a Stripe Payment Link the owner clicks through
  after a build call, not by a table in the app. **The owner's D4 answer ("billing only")**
  settles the question this entry asked: no in-app billing in v1.
- **Why:** the billing default assumes a subscription per workspace and a plan table that
  gates capacities. This product's first charge is a **one-time** fee for work an agent
  and a person do, which the provider's subscription model cannot express, and its
  capacities are not tier-limited (one owner can run 30 stores or 3). Building
  concurrency-safe billing behind a product nobody has bought yet puts hard logic in front
  of the cheap visible thing. Declaring `none` also means the app ships no entitlement
  slugs, no plan module and no pricing table — the landing states the price as copy, which
  is honest because the price is not enforced anywhere in code.
- **Reopen when:** the caretaker fee must be enforced in-app (a lapsed payer's stores stop
  being refreshed), self-serve checkout is wanted, or more than three customers ask for a
  card form instead of a payment link.

## 2026-11-17 — the shape switches (workspace model, anonymous public, embedded agents, member home)

- **Options considered:** organization vs individual workspace; anonymous public yes vs no;
  embedded agents yes vs no; member home `/dashboard` vs the product's own noun.
- **Picked:** **organization**, **anonymous public yes**, **embedded agents yes**, member
  home **`/stores`** — by **the agent, provisionally**, from the skill defaults. Reopen on read.
- **Why:** organization is the default and the product's third direction (white-label for
  agencies, D1 option C) needs roles later; a solo portfolio operator is an organization of
  one and pays nothing for that. Anonymous public is yes because the landing, the legal
  pages and — critically — **the generated storefront itself** are read by strangers with
  no account; a store is the product's proof and it must be readable signed-out.
  Embedded agents are yes because the three agents *are* the product. `/stores` is the
  owner's noun: the thing they come back to is their portfolio, not a dashboard.
- **Reopen when:** an agency customer needs a second member role (organization stays), or a
  self-serve hosted direction (D1 option A) is picked — that direction would make
  workspaces pay per store, which is where in-app billing returns.

## 2026-11-17 — the stack for the control plane and for generated stores

- **Options considered:** the skill's default stack; a single Next.js app that also serves
  generated stores by path; a static-site generator per store.
- **Picked:** control plane on **Next.js (App Router, TypeScript) · Supabase Postgres ·
  Clerk · Netlify · Vitest + Playwright**, the default. Generated stores are a **separate
  Next.js repository** (static export) pushed to the owner's GitHub and deployed to the
  owner's Vercel account — by **the agent, provisionally**.
- **Why:** the default stack is chosen for the SaaS. The store must not live in the control
  plane, because the product's central promise (direction B) is that the owner owns the
  code: a store served by our app is a store they do not have. A generated repo also keeps
  the Amazon-gate logic in one place per store rather than one place for all of them, so a
  gate that closes degrades one store, not the fleet.
- **Reopen when:** the first ten customers say the handover is friction rather than a
  feature (they want a URL, not a repo) — that is D1 option A returning, and it changes
  this entry, not just a phase.

## 2026-11-17 — D6 · the name

- **Options considered:** Cairn; a descriptive name; naming it later.
- **Picked:** **Cairn**, by **the owner**: "D1 B, D2 operators, D3 keep, D4 billing only,
  D5 keep, D6 Cairn" (2026-11-17).
- **Why:** a stack of stones marking a path — built once, stays. Short, ownable, no AI
  cliché. The internal artifacts already used it, so nothing is renamed.
- **Reopen when:** a trademark search or the domain blocks it — then a new entry here, never
  an edit to this one.

## 2026-11-17 — D5 · which merchants come first

- **Options considered:** eBay + specialist networks with Amazon gated; Amazon first;
  any merchant with a public feed.
- **Picked:** **eBay + specialist networks first, Amazon gated**, by **the owner** ("D5
  keep", 2026-11-17).
- **Why:** Amazon's PA-API was retired 15 May 2026 and its successor (Creators API) issues
  credentials only after an Associates account has **10 qualifying sales in 30 days** — a
  gate held by the buyer's account, not by us. A first build that shows no price anywhere
  reads as broken. eBay's core APIs need no extra approval; a specialist network's feed
  arrives in days and pays 8% against Amazon's 3%.
- **Reopen when:** the owner's own Associates account clears the gate, or the first
  stores' commissions show Amazon is where the money is despite the gate.

## 2026-11-17 — D4 · what "payments" meant in the brief

- **Options considered:** subscription billing for our customers only; also supporting
  own-product checkout in generated stores; deferring.
- **Picked:** **billing only**, by **the owner** ("D4 billing only", 2026-11-17): an
  affiliate store has no cart, because affiliate revenue arrives as commission, never as a
  sale. This also settles the meaning of "payments" in the original brief.
- **Why:** own-product checkout adds Stripe, tax, refunds, fraud and shipping — a second
  company, not a feature. The word "payments" in the original brief is read as "the store
  is paid" (commissions) and "you are paid" (the fee).
- **Reopen when:** a customer asks to sell their own product, or ten customers exist,
  whichever is first.

## 2026-11-17 — D3 · how it is priced

- **Options considered:** $299 build + $9/month caretaker; $19/site/month with no build
  fee; free build in exchange for a share of commission.
- **Picked:** **$299 build + $9/month caretaker**, by **the owner** ("D3 keep",
  2026-11-17).
- **Why:** the market already buys this way (a plugin's yearly, an agency's one-off, a $199
  done-for-you blog), a store earns hundreds not thousands in its first months, so $19/month
  is 20–40% of early income, and a one-time fee is a capital decision the operator is used
  to making. The caretaker fee stays above the ~$2/month an agent refresh actually costs.
- **Reopen when:** three of the first ten operators pre-paying (H2) declines the build fee,
  or the refresh cost per store exceeds $4/month on real runs.

## 2026-11-17 — D2 · who the first ten customers are

- **Options considered:** portfolio operators running 3–30 sites; first-time builders;
  small agencies.
- **Picked:** **portfolio operators running 3–30 sites**, by **the owner** ("D2
  operators", 2026-11-17).
- **Why:** they already pay $25–128/month for the job, decide in an evening, hold their own
  Associates accounts (so the gate is theirs and no credential reaches us), and their
  pain — thirty sites that all look like FreshStore — is the pain this product answers.
  First-time builders churn before the first commission; agencies add roles and SLAs
  before the build is proven.
- **Reopen when:** ten operators say the WordPress stack, not FreshStore, is the real
  competitor — then the wedge is an export tool, and the segment entry changes with it.

## 2026-11-17 — D1 · which shape is built first

- **Options considered:** A hosted portfolio builder ($10/site/month, our hosting and
  credentials); B build & hand over ($299 + $9/month, code in the owner's GitHub and
  Vercel); C white-label for agencies.
- **Picked:** **B — build and hand over** ($299 + $9/month caretaker, code in the owner's
  GitHub and Vercel), by **the owner** ("D1 B", 2026-11-17). **With this pick, direction B
  is the product and directions A and C move to the backlog**: A as H2's fallback, C as the
  agency direction. Every later document reads B as decided, not as a recommendation.
- **Why:** A competes with an incumbent that already has merchant plumbing, six designs and
  years of reviews, at a price where our own refresh cost eats the margin, and it puts
  customers' affiliate keys in our database. B sells the two things the incumbent cannot:
  a look of its own, and a repository in the owner's name. No customer credential ever
  reaches us.
- **Reopen when:** H2's deposits fail (0–1 of 10 pre-pay) — then A is the fallback, with
  the cost model in the proposal's § 1.4.

## 2026-11-17 — the plan's phase order

- **Options considered:** front door first with every other screen; the agents first, since
  they are the product; the design kit first, then screens on sample data.
- **Picked:** **design kit → screens on sample data (including the front door) → setup →
  first real slice (portfolio, niches) → the research agents → store generation and
  handover → browser proof → publish → front door made true → go live** — by **the agent,
  provisionally**, from the `app-lifecycle` order.
- **Why:** the agents are the expensive part and their value is unproven (H1). Screens on
  sample data let the owner judge the product in a day, and the design kit is what stops
  the generated stores from looking like every other store — which is the moat (H3). The
  front door ships with the sample screens and is made true before any further feature
  phase.
- **Reopen when:** H1 is tested early (three real stores in two niches) by another route,
  or the owner wants a paid build before the portfolio screen exists.
