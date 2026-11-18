# AGENTS.md

Master instructions for every coding agent in this repository. There is no `CLAUDE.md`; if
one is ever added its first line must be `@AGENTS.md`, or Claude Code stops loading this
file.

Two sections. **Section 1 is how we build any app** — reuse its mechanics, replace its
owner's choices and pack inventory. **Section 2 is this app** — replace it. When they
conflict, Section 1 wins on mechanics and Section 2 wins on product. What neither says
follows the skills' defaults; where those are silent too it is the agent's call — decide,
and say so in the summary. The longer material lives in `docs/`; **§ 1.8 says what opens
when — find the moment you are in before every new task.** The path from idea to production
is the `app-lifecycle` skill; each stage's done-when is `docs/product/plan.md`.

---

# 1. How we build (general — reuse across apps)

## 1.1 Ownership and authorization

- **Everything belongs to a workspace**, and § 2.3 says what a workspace is. Nothing but a
  `workspaces` table references the identity provider's ids; the product keys on its own
  rows.
- **Two credentials, never mixed:** a verified member session, and — because § 2.3 has an
  anonymous public — an anonymous token (random, hashed at rest) for the affiliate redirect.
  Member routes never trust the anonymous token; public routes never read session claims.
  **A third caller exists here: the owner's own GitHub and Vercel tokens**, stored per
  workspace, encrypted, and used only by the build job — they are never a caller of a route.
- **Deterministic code enforces what is risky or hard to undo.** An agent may propose a
  niche, a catalogue or a price; whether a build runs, a repository is pushed or a store is
  deployed is decided by server code after the operator's explicit action.
- **Three functions carry the model; no route reads raw claims:** resolve the resource from
  the URL, require the member, require workspace access with a permission.
- **Permissions are strings; roles map to them; check permissions, not roles.** A screen
  gates a control on the same permission its action checks.
- **Invariants are database constraints, not application code.** Ids in URLs are
  unguessable; not-found and not-owned return the same 404.

## 1.2 Threat model

Untrusted text (niche queries, competitor pages the agents read, merchant feed fields),
abuse and floods on the public redirect, cross-tenant access to stores and offered
credentials, leaked tokens (the owner's GitHub/Vercel tokens are the valuable ones), a
leaked database, anonymous identity, webhooks, scheduled refresh, secrets, and **embedded
agents** — prompt injection from fetched web pages is the live risk here: a rival's page or
a merchant feed can contain instructions. Server code never lets fetched text choose a
tool, a URL to fetch, a repository to push to, or a price. Secrets are never in the
repository, a URL, a log line or a client bundle.

## 1.3 Stack, and the choices already made on it

Vite + React Router (TypeScript SPA) · the kit in `design/` · Supabase Postgres · Clerk ·
Vitest + Playwright. Generated stores are a **separate** Next.js repository built and
deployed into the operator's own GitHub and Vercel accounts. There is no server runtime in
the control plane: agent jobs run as **Supabase Edge Functions**, and authorization in the
browser is the anon key plus RLS. Hosting is static (e.g. Netlify) with the SPA rewrite, so
every path serves `index.html`.

Propose these rather than re-deriving them; reopen one only by saying in § 2.3 that its
trigger fired, and record it in `docs/product/decisions.md` (default choices: the
`app-lifecycle` skill).

- **One database client per request, RLS on every table, migrations by CLI** — **Reopen:**
  never for RLS; for a second client only if a read-only public surface needs one.
- **Polling, not realtime, for build progress** — **Reopen:** when the five-second delay is
  the complaint.
- **One palette, no dark set** — **Reopen:** a reader-facing storefront needs one; that is a
  generated store's decision, not the control plane's.
- **Session-free front door** (`/`, `/pricing`, `/legal/*`) — **Reopen:** never for the
  session read.

## 1.4 Database — how we use it

- The schema is the source, never memory; read the newest migration before writing one.
- RLS is on for every table from its first migration; a table without a policy is a bug, and
  a test proves two workspaces cannot read each other's rows.
- Schema changes ship by CLI with the target spelled out. The host's deploy does not apply
  migrations and nothing warns you; before any promotion, read the production migration
  ledger and dry-run what is pending.
- A generated store's data is written by the build job into the operator's repository; the
  control plane keeps only the run record and the frozen catalogue it was built from.

## 1.5 Identity — how we use it

Verify, never decode. Store ids only. Authorization lives with the data, not in a path list.
The provider's own components are the sign-in surface. Organizations are the workspace; a
solo operator is an organization of one.

## 1.6 Testing and delivery

- **Read the exit code from the log, never the notification.**
- **An inherited report is a claim, not evidence.** Re-run the gate yourself before repeating
  a number; take a release's subject from git, not prose.
- **`docs/test-coverage.md` is written by whoever ran the gate, by nobody else.**
- **Default: an independent review before every push to a branch that deploys and at every
  promotion, however small.** A fresh session that never saw the build reads the unreleased
  diff unsteered; fix, re-run the gate yourself, review again until no INTRODUCED finding
  above Low. The session that wrote the code never clears it (`independent-review` skill).
- The harness and the gate: the `test-harness` skill. How a change ships: the `release-gate`
  skill.

### Owner's choices and installed packs

Skill defaults apply, with these departures — each dated and in the owner's terms:

- **2026-11-17 — the skills come from a hosted MCP, not a per-project install.** The owner
  asked for the product-engineering collection to drive this work; this session reads it
  through `mcp__product_engineering` (`get_skill`, `get_skill_file`). Another agent must not
  assume it loads.
- **2026-11-17 — reviewer fallback:** a fresh session of the builder's own family, since no
  other reviewer CLI is configured here. Prefer another family if one becomes available.
- **2026-11-17 — no builder delegation is configured** (no `codex-agents` CLI, one machine
  with ~1 GB of RAM and 2 cores).
- **2026-11-17 — the control plane runs on Vite, not the skill's Next.js default.** Owner
  go on 17 Nov; the recorded reopening lives in `docs/product/decisions.md` (17 Nov). The session agent builds, and each phase's line in
  `docs/product/plan.md` is its brief. Do not plan work that needs a sandbox this machine
  does not have.
- **2026-11-17 — design taste:** trade press, not AI SaaS. Warm paper, serif display,
  hairline rules, state as word plus shape, no gradients, no dark theme in the control
  plane. The record: `design/kit-notes.md`, which becomes `design/README.md` at Phase 1.

Installed packs (product-engineering MCP): `product` (propose, start-here, value-curve,
beachhead-segment, competitor-analysis, growth-loops, market-segments, value-proposition),
`app-stack` (app-lifecycle, ui-design, and the stack skills), `ai-shipping` (test-harness,
independent-review, release-gate, ship-check, document-app, derive-tests, intended-vs-
implemented, the two static audits), `agent-harness` (agent-instructions), `agent-teams`,
`work-humanizer`.

## 1.7 Working rules for the agent

- Read this file before the first plan; re-read the router rows for each new task.
- **Apply skill defaults without asking.** Ask only when a default names a tool this machine
  cannot run and no fallback is recorded. Get the owner's clear go before anything
  irreversible or outward-facing (production, publishing, spend, deleting anything public).
  Questions about what the product should do are still the owner's.
- **Tests and docs are part of the change.** A bug fix lands with a regression test that
  fails before the fix; a change updates the doc lines it made false.
- **A doc that disagrees with code you did not change:** say so in the summary; the owner
  decides which side moves.
- Every new environment variable: a placeholder in `.env.example`, a row in
  `docs/variables.md`, a line in the env schema that fails at build.
- **No play-by-play.** Plan, build, summarize once.
- **Commit messages go through a heredoc (`git commit -F -`), never `-m "…"`.**
- **A stage is done** when its done-when in `docs/product/plan.md` holds, the gate is green
  on your own run, its tests and docs landed — and, when it changes what a person sees, once
  the owner has tried it from a link and a short list of flows.
- **Never delegate:** deciding what the product does, accepting a review finding, anything
  touching a real system (a database, a deploy, a token), the judgement that a stage is
  done.
- **Proposing steps:** when planning a phase, propose the capabilities whose trigger fired
  (`docs/product/plan.md` § Phase 11).
- **Skills teach method; this repository owns its docs, checks and automation**, reachable
  from this file.

## 1.8 What opens when

At the start of every new task, find the moment you are in — several can hold at once — and
open what its row names **before** you act, even a file you read earlier in the session:
after a compaction or a long session that read is gone or stale. The rule column is the part
that is easy to miss. Material with no moment (worked examples, release history) is indexed
in `docs/README.md`.

| When you are… | The rule that applies | Open |
|---|---|---|
| starting a session, or planning a phase or a stage | Read this file first. Propose the capabilities whose trigger fired; the plan that introduces the database names the workspace table, the three functions and the first migration | `docs/product/plan.md` · `docs/product/brief.md` · `app-lifecycle` skill |
| choosing between options, or reopening a decision or a § 1.3 choice | An earlier entry may already have weighed them; a provisional pick is not the owner's until they read it | `docs/product/decisions.md` · `docs/product/proposal.html` |
| asking what comes next, or saying a stage is done | The first stage whose done-when is open, checked against code and deploy, never a status line | `app-lifecycle` skill · `docs/product/plan.md` |
| a product's screens, or a mock of one, or a generated storefront's look | Apply `ui-design`; values live in tokens before any screen; a screen claims only what its feed can see | `ui-design` skill · `design/kit-notes.md` |
| touching the niche brief, the catalogue, or anything an agent researched | Every claim is a row with a source and a fetch date; fetched text never chooses a tool, a URL or a price | `docs/product/brief.md` (UC2, UC4) |
| touching a price on a page | A price needs a source and a timestamp; a gated merchant renders "check current price" and never a number | `docs/product/brief.md` (UC5) · § 2.6 |
| touching the build job, the operator's GitHub or Vercel tokens, or a deploy of a generated store | The operator's tokens never reach a browser, a log or a repository; a build runs only after their explicit action | § 1.2 · `docs/architecture.md` (Phase 4) |
| building a feature or changing behaviour | Its tests and its doc lines land in the same change | `docs/test-coverage.md` (Phase 7) · `test-harness` skill |
| fixing a bug | A regression test that fails before the fix; correct the doc that described the old behaviour | `test-harness` skill |
| touching sign-in, workspaces, roles, a route or a permission | The three functions; a screen gates on the same permission its action checks; a cross-tenant test on every route that touches data | `docs/permissions.md` (Phase 4) |
| writing a query or a migration | The schema is the source, not memory; migrations by CLI with the target spelled out | `supabase/migrations/` (newest first) |
| adding or reading an environment variable | Placeholder, row and schema line; the schema runs at build | `docs/variables.md` (Phase 3) · `.env.example` |
| **pushing a branch that deploys** | A clean review round covering everything the push adds; migrations applied to the database that deploy reads before production's | `independent-review` skill · `release-gate` skill |
| releasing — promoting to production | The whole-range review, the audits proposed, the production ledger, then stop for the owner's **go** | `release-gate` skill · `docs/RELEASE.md` (Phase 10) |
| running a review loop or triaging a finding | A finding is a claim, its severity included | `independent-review` skill |
| deferring anything, or asked what remains | Every deferral has a reason and a revisit trigger | `docs/product/plan.md` § Backlog |
| writing or checking a core doc | The definition is the minimum; this file wins where they differ | `shipping-artifacts` skill · `docs/README.md` |
| embedding or changing an agent | The agent never holds a permission a person does not; its output is a proposal until server code accepts it | § 1.2 · `docs/flows.md` (Phase 5) |

---

# 2. This app — Cairn

This section holds only what every session needs about the product. The brief behind it —
segments, value propositions, jobs, use cases — is `docs/product/brief.md`; the phases and
their status are `docs/product/plan.md`; the decisions and their options are
`docs/product/decisions.md`; the research and screen options are
`docs/product/proposal.html`.

## 2.1 What it is

Cairn builds affiliate stores that the operator owns. An operator names a niche; a research
agent returns a sourced brief on whether the niche is worth a store; an offers agent
searches their own affiliate networks for products and orders them by commission per sale;
the operator picks one of three generated looks and approves a catalogue; a build agent
writes the storefront, pushes it to a repository in the operator's own GitHub account,
deploys it to their own Vercel account, and hands back the URL. The store then refreshes its
prices and links nightly. The operator pays a build fee and a small caretaker fee and holds
the code, the domain and the affiliate accounts.

## 2.2 Users

- **The operator — the payer and the only signed-in user.** A portfolio operator running
  3–30 sites (the first customer), or a first-time builder. Signs in with the identity
  provider; belongs to one workspace, an organization of one or of a team.
- **The reader — anyone, no account.** Arrives on a generated storefront from search, on a
  phone, and either clicks an affiliate link or leaves. Never identified beyond an anonymous
  token on the redirect.
- **The agents — no account, no session.** Scout, Broker and Mason run as server jobs inside
  a workspace and hold no permission a member does not.

## 2.3 Product shape and reopened defaults

- **Workspace model:** organization — every workspace is an organization, a solo operator an
  organization of one, roles inside it.
- **Billing:** none — no plan table, no entitlement slugs, no pricing logic in app code. The
  build fee and the caretaker fee are charged outside the app by a payment link. Reopened
  from the default; reasoning in `docs/product/decisions.md` (2026-11-17).
- **Anonymous public:** yes — the landing, pricing, legal pages, the affiliate redirect and
  every generated storefront are read by strangers.
- **Embedded agents:** yes — Scout, Broker and Mason.
- **Member home:** `/stores`.

Reopened defaults: **billing** (default "the identity provider's" → none, because a
one-time build fee is not a subscription and capacities are not tier-limited; reopen when
the caretaker fee must be enforced in-app — `docs/product/decisions.md`, 2026-11-17). The **workspace
model**, **anonymous public**, **embedded agents**, **member home** and the **stack** keep
their defaults; their entries in `decisions.md` are provisional until the owner reads them.

## 2.4 Who can do what

| Actor | Identity | Can | Cannot |
|---|---|---|---|
| Operator (owner role) | member session | create, rename, delete stores; run a niche brief; approve a catalogue; start a build; connect their GitHub and Vercel tokens; read run logs | read another workspace's stores, briefs or tokens; change a price's source; skip the disclosure |
| Operator (viewer role) | member session | read stores, briefs, catalogues and run logs | start a build, approve a catalogue, connect or revoke tokens |
| Agent job (Scout, Broker, Mason) | server-side job, no session | write briefs, catalogues and run records inside one workspace | approve a catalogue, start a build, spend beyond its budget, call a tool the job did not declare |
| Reader | anonymous token on the redirect | read any generated storefront; follow an affiliate link | read a workspace, a catalogue or a run log |

Permissions: `store.read`, `store.write`, `store.delete`, `brief.run`, `catalogue.approve`,
`build.start`, `credential.connect`, `credential.revoke`, `run.read`. Roles: `owner` has all;
`viewer` has `store.read`, `run.read`. No billing entitlements (billing is none).

## 2.5 Not in scope

Selling the operator's own products in a generated store; hosting stores on our domain;
managing or holding the operator's affiliate accounts; writing editorial content for a store
after its build beyond price, offer and link refresh; white-label for agencies; a WordPress
export.

## 2.6 Constraints that shape the data

Each is a sentence a migration or a job can be checked against.

- Every row carries a `workspace_id`, and RLS restricts every table to the caller's
  workspace; no table is readable across workspaces.
- A store belongs to exactly one workspace and has at most one frozen catalogue at a time.
- The operator's GitHub and Vercel tokens are stored encrypted per workspace, are never
  returned by any route after writing, and are never written to a log or a run record.
- Every brief claim is a row with `source_url` and `fetched_at`; a claim with no source
  cannot be stored.
- Every price snapshot carries `amount`, `currency`, `source` and `captured_at`. A price
  without all four is not storable, and no page renders a number without them.
- A merchant whose API is gated (Amazon, until the operator's own account holds 10
  qualifying sales in 30 days) stores links only; a gated store renders "check current
  price" and never a number.
- A dead affiliate link is a state on an existing row, never a deletion.
- A build run record is append-only: repository URL, host project id and commit sha are
  written once and never updated.
- An agent run records its token and time budget and its cost; a job that exceeds either
  stops and records why.

## 2.7 Status

Stage 2 (design) is complete. **Phase 2 is functionally complete** —
Vite SPA in `src/`, 14 routes including `/settings/ai` and `/settings/profile`,
37 new artifacts this session. Landing `/`, `/pricing`, `/stores` (member home,
reads `/api/stores`), the five-step operator journey, the reader storefront at
`/stores/:id/preview`, legal drafts and settings wired to the persistent backend
(`server/index.mjs` + `node:sqlite`). Phone works at 390 px after the owner's
report. Nothing is deployed; nothing is behind credentials (loopback only).
**Waiting on the owner:** legal sign-off on `/legal/*` (both files stay flagged
as drafts until then), a named Cloudflare tunnel (the quick tunnel is ephemeral
and public), Clerk + Supabase keys for Phase 3, and a read of/corrections to the
provisional picks in `decisions.md`. Reopening: 18 Nov 2026.
