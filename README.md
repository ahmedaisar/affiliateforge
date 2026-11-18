# Cairn

An affiliate-store build for operators who want a store that sells and stays true —
researched by agents, reviewed by you, owned by you. The brief and research live in
[`docs/product/proposal.html`](docs/product/proposal.html); this file is the runbook.

> **A work in progress, not a release.** Locally runnable; nothing is deployed; no
> store has been put on a live domain.

## Run it

```bash
npm install
npm run api        # backend on 127.0.0.1:8787 (stdlib Node + node:sqlite, seeded demo)
npm run dev        # Vite on 0.0.0.0:3000 — serves the SPA and proxies /api, /go, /health
# or both:
npm run dev:full
```

Open `http://localhost:3000` (on the LAN, `http://10.138.0.2:3000`).

`npm run test` for the small unit suite, `npm run build` for the static bundle,
`npm run preview` to serve `dist/` on 3100. `.env.example` documents the local
controls (`CAIRN_API_PORT`, `CAIRN_DEV_TOKEN`) and `scripts/demo.sh` resurrects the
demo (with `--tunnel` for a public link, which is ephemeral and exposed on purpose
for review). Phase 3 needs external accounts; the exact steps are in
[`docs/work/phase-3-setup.md`](docs/work/phase-3-setup.md).

## What is real today

| Piece | Status |
|---|---|
| Design system (`design/tokens.css`, `design/kit.css`) | One palette, Trade press direction; every value lives in tokens |
| Vite + React Router SPA | 11 routes, landing through the reader storefront |
| Back-end service (`server/`) | Node stdlib HTTP + `node:sqlite`, seeded with seven demo stores |
| `/api/stores`, catalogue, `/api/stores/:id/brief`, build log | Read and write against SQLite |
| Affiliate redirect `/go/:store/:product` | 302 to merchant, click counted |
| Legal pages | Honest drafts; **owner approval required before any release** |
| Unit tests | 6 passing (sample-data seam); no browser suite |

## What is missing (read [the audit](docs/work/prd-audit.md))

Phase 3 — Clerk (organizations) and Postgres — has not been done. No multi-tenant
authorization exists; the tunnel that was live on 2026-11-18 exposed one demo workspace
to anyone with the link. Legal text is a draft. The rendered pass has now happened —
six screenshots in `screenshots/`, taken with headless Chromium at 1440 and 390, and the
Playwright route walk reports no console errors — but the scored `ui-design` audit has not
been performed. No release has shipped.

## Documents in this repo

| File | Read it for |
|---|---|
| `docs/product/proposal.html` | The research, the alternatives, the screen options, the decisions list |
| `docs/product/brief.md` | Who it is for, the eight jobs, UC1–UC10 |
| `docs/product/plan.md` | Phases, done-whens and the current status |
| `docs/product/decisions.md` | Every decision with options, owner pick, reopen trigger |
| `AGENTS.md` | How the agent works here: shape switches, router, working rules |
| `docs/work/prd-audit.md` | Line-by-line PRD/plan audit with verification notes |

## Direction of travel

**Phase 2 is functionally complete.** The next unblocked step is Phase 3 (identity +
database), which needs a Clerk application and a Supabase project — see the plan.

## Restart cleanly

```bash
scripts/demo.sh            # backend + dev server locally (no restart of a live tunnel)
scripts/demo.sh --tunnel   # forces a new quick public link (random *.trycloudflare.com)
```

The tunnel is ephemeral and public; treat any URL it prints as public-on-the-internet.
