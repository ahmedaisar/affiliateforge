# Jobs map

One row per job from `docs/product/brief.md` § Jobs to be done: the screen that does it, the
single question that screen answers, and the one primary action it offers. A screen with two
questions is two screens; a screen with two primary actions has no primary action.

Phase 1 of `docs/product/plan.md`. The columns are fixed; only the row count may grow.

| # | Job (when… I want… so…) | Screen | Route | The one question | Primary action |
|---|---|---|---|---|---|
| 1 | …I have spare budget and no new niche… find one with real volume and weak rivals… | Niche brief | `/stores/[id]/niche` | *Is there money in this niche?* | **Build this store** (accept the brief) |
| 2 | …I know the niche… see whether commission per sale covers the work… | Catalogue | `/stores/[id]/catalogue` | *What will I earn per sale here?* | **Approve catalogue** |
| 3 | …I have the niche… a store that looks like a publication, not a template… | Look | `/stores/[id]/look` | *Which of these is mine?* | **Choose this look** |
| 4 | …prices change… pages stay true without editing thirty sites… | Caretaker report | `/stores/[id]` (activity) | *What changed while I wasn't looking?* | **Revert** / **Accept** a change |
| 5 | …a merchant API is gated… the store degrades honestly… | Gate | `/stores/[id]/gate` | *What is this merchant allowed to say?* | **Record gate open** |
| 6 | …I have thirty stores… one screen that tells me which needs me today… | Portfolio | `/stores` | *Which store needs me today?* | **Open it** |
| 7 | …I sell or stop paying… the code is mine… | Build run | `/stores/[id]/build` | *Is it mine now?* | **Copy the repository link** |
| 8 | …a reader arrives on a phone… disclosure and choice clear in one screen… | Storefront | `/s/[domain]/…` (the generated store) | *Should I buy this one, and what do I pay for that answer?* | **Check current price** |

## Notes on the rows

- **Row 1 is the product.** If the brief is not worth reading, nothing after it is bought. Its
  screen carries evidence rows, not prose: each claim opens its source.
- **Row 6 is the retention screen** and the member home (`/stores`, § 2.3 of `AGENTS.md`). It
  is the screen the operator sees first after sign-in, so it answers with states, not counts.
- **Row 8 belongs to a different product** — the generated store, in the owner's own
  repository. It is drawn here because the control plane shows a preview of it, and because
  its disclosure rule (§ 2.6) is the product's legal surface.
- **Rows 3 and 5 are the two that can block a build**: no look chosen, or a gate state not
  recorded, and the build cannot start. The build screen says which is missing rather than
  failing at the first deploy.
- **No row for settings.** Tokens are connected from the build screen, which is the moment
  they are needed (§ 1.8, the operator's tokens row).
