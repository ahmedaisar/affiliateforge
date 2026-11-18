# DEPRECATED 2026-11-18 — migration done

This checklist belongs to the Vite migration and is all done: build green, preview
serving, routes verified, docs updated (`AGENTS.md` §1.3) and committed. The current
verification gate is `scripts/check_build.mjs` / `npm run check`. See
`docs/work/prd-audit.md` for today's line-by-line status.
# Todo — finish the Vite migration (17 Nov 2026)

The reference is the plan written in this session: every step below names its target and the
command that proves it landed. A step is done when its check passes on the agent's own run —
never when the code merely looks right. No test or verification asset is edited to make a
check pass; if a check fails, the code changes.

| # | Step | Target | Verification |
|---|---|---|---|
| 1 | Kit imports and scripts resolve | `src/styles/app.css` (`../../design/*.css`), `package.json` (`tsc --noEmit`, not `tsc -b --noEmit`), `.gitignore` (`dist/`) | `grep -n "@import" src/styles/app.css`; `grep -n '"build"' package.json`; `grep -n dist .gitignore` |
| 2 | Typecheck passes | `src/pages/stores.tsx` (`type` import), any `noUnusedLocals`/`verbatimModuleSyntax` error, fixed at source | `npx tsc --noEmit` → exit 0, no `error TS` |
| 3 | Production build | `dist/` from `vite build` | exit 0 + `✓ built in`; `--accent` and `state--warn` present in `dist/assets/*.css`; `Ridge Media` in `dist/assets/*.js` |
| 4 | Routes answer | `vite preview` on 3100, `vite` dev on 3101 | node fetch of `/`, `/pricing`, `/stores`, `/legal/terms`, `/legal/privacy` → 200 + `<div id="root">`; dev log `ready in`; `/src/main.tsx` contains `createRoot` |
| 5 | Docs tell the truth | `AGENTS.md` §1.3 + §1.8 router row; `docs/product/decisions.md` new entry superseding the stack entry; `docs/product/plan.md` phases 2/3/5 + backlog | `grep -n "Vite" AGENTS.md`; `grep -n "Next.js" AGENTS.md` (generated stores only); `head -20 docs/product/decisions.md`; `grep -n "Edge Function" docs/product/plan.md` |
| 6 | Committed, clean tree | code commit, then docs commit | `git log --oneline -2`; `git status --porcelain` empty |

Owed and not claimable on this host: screenshots, the Phase 2 visual pass and the scored
audit. No Chrome binary (removed with agent-browser) and no display server for
`agent-desktop` (`PLATFORM_NOT_SUPPORTED`).
