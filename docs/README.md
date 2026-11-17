# Docs index

Everything the repository keeps that has no moment in `AGENTS.md` § 1.8 lives here. A doc
marked *planned* does not exist yet; the phase in `docs/product/plan.md` that creates it is
named beside it. Do not link a planned doc as if it exists.

## Product

| Doc | What it is |
|---|---|
| [`product/proposal.html`](product/proposal.html) | The accepted proposal: research with sources, alternatives, segment, value curve, recommendation, the eight key screens as static mocks, six decisions, five hypotheses. Open it in a browser. |
| [`product/brief.md`](product/brief.md) | Segments, value propositions, jobs to be done, the ten use cases. |
| [`product/plan.md`](product/plan.md) | The phases and stages, each with its done-when. **The status lives here.** |
| [`product/decisions.md`](product/decisions.md) | Dated decisions that had real options; open entries for what the owner has not picked. |

## Design

| Doc | What it is |
|---|---|
| [`../design/jobs-map.md`](../design/jobs-map.md) | Each job, its screen, the one question that screen answers and its primary action. |
| [`../design/kit-notes.md`](../design/kit-notes.md) | The design record for the proposal artifact: direction, palette, type, layout, departures, checks. Becomes `design/README.md` at Phase 1, when it covers the app's kit too. |

## Engineering *(all planned)*

| Doc | Created in | What it will hold |
|---|---|---|
| `architecture.md` | Phase 4 | The three functions, the tables and their RLS, the job boundaries. |
| `permissions.md` | Phase 4 | The permission strings, the role map, and the cross-tenant tests per route. |
| `flows.md` | Phase 5 | The side-effecting journeys: a brief run, a catalogue approval, a build, the nightly refresh, the redirect. |
| `variables.md` | Phase 3 | Every environment variable, with what it is for and what breaks without it. |
| `integrations.md` | Phase 5 | Per integration: the account, the gotcha that fails silently, how it is verified. |
| `test-coverage.md` | Phase 7 | Written by whoever ran the gate, by nobody else. |
| `RELEASE.md` · `environments.md` | Phase 10 | The release steps the owner keeps, and the environment record. |
| `RELEASE-HISTORY.md` | first release | One dated section per release, never rewritten. |

## Evidence and working files

| Path | What it is |
|---|---|
| `../screenshots/` | The rendered-pass screenshots of the proposal artifact at 1440 and 390 px. |
| `../docs/product/` | Product docs. Phase briefs, once they exist, live in `docs/work/`. |
