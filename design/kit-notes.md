# Cairn — design notes for the proposal artifact

The proposal (`docs/product/proposal.html`) is a document, not an app screen. It is built
the way the product's screens will be: values in tokens, primitives in a kit, screens
composed from them. These notes are the record the `ui-design` method asks for, so the
look survives the session that chose it.

Read 17 Nov 2026. Direction chosen before any screen was drawn.

## Direction

**Trade press.** The seed site is a buying guide; the people who buy this product are
publishers. So the artifact reads like a printed trade section rather than an AI SaaS
landing page: warm paper, a serif display face, hairline rules, tabular numbers, small
caps for eyebrows. The alternative considered and rejected: the category default —
violet gradient, Inter, glassy cards, which every AI builder ships and which would
undercut the one claim this proposal makes about design.

## Palette

| Role | Token | Value | Why |
|---|---|---|---|
| Paper | `--paper` | `#faf7f1` | Warm off-white; reads as stock, not as a screen |
| Panel | `--paper-2` | `#f3eee5` | One step off paper, so cards group without borders doing the work |
| Ink | `--ink` | `#1a1917` | Near-black, slightly warm; 15.9:1 on paper |
| Secondary ink | `--ink-2` | `#4e4a43` | Body copy; 8.1:1 |
| Tertiary ink | `--ink-3` | `#767065` | Meta only; 4.6:1, above the 4.5 floor |
| Accent | `--accent` | `#1d4e6f` | **Acts.** Blue is used by no state, so a blue control never reports health |
| State: ok | `--ok` / `--ok-wash` | `#2f6b45` / `#e3eee7` | Supported, live, connected |
| State: warn | `--warn` / `--warn-wash` | `#8a5a12` / `#f4ebd9` | Weakened, gated, needs a look |
| State: bad | `--bad` / `--bad-wash` | `#9b2c2c` / `#f6e4e2` | Refuted, dead link, failure |
| State: none | `--none` / `--none-wash` | `#6b665d` / `#ece8e0` | Untested, not connected, nothing built |

Every state is a **word plus a shape**: a filled disc (ok), a bar (warn), a square (bad),
a hollow ring (none). Colour is never the only carrier.

Charts carry entity colours (`--s-cairn`, `--s-fresh`, `--s-bolt`, `--s-diy`) plus neutral
data inks (`--data-1`, `--data-2`). The accent never draws a data series, so a saturated
line on the page always means "press this".

## Type

- Display and headings: `--serif` (Iowan Old Style → Palatino → Georgia). No webfont: the
  file must open from disk with no network.
- Reading: `--sans` (system UI stack) at 15/1.6, measure capped at 66ch.
- Machine text only: `--mono`, used for the picks output and nothing else.
- Scale: 11, 12, 13, 15, 17, 20, 25, 32, 44, 56 px, each with its line height token.
- Weights: 400 and 600 only. Weight does not carry state.

## Layout

- One column, 1120 px max, 64 px gutters above 720 px, 16 px below.
- Sections open with a 2 px ink rule and a numbered eyebrow, like a section head in print.
- Screens (the mocked app and storefronts) are drawn at **960 px minimum** inside a
  horizontally scrolling frame, because they are desktop app screens and shrinking them
  would misrepresent them. The page itself never scrolls sideways at any width, checked
  at 390 px.
- Wide charts (Figure 2) carry `min-width: 860px` inside their own scroll box so their
  labels stay legible on a phone rather than shrinking to nothing.

## Departures from the method, and why

1. **Two surfaces, one kit.** Screens 7 and 8 are a *different product* — a generated
   store in its "Field Notes" direction. Rather than invent one-off styles, `.store`
   re-declares the paper/ink/rule tokens locally and adds serif primitives. The Scou
   specimen in screen 2 does the same through `--scout-*` tokens. This is deliberate: a
   page showing three design directions must show three real looks.
2. **No dark set.** One palette. The artifact is a document read once; a second set would
   double the contrast work for no reader benefit. Recorded here so the design stage for
   the real app decides it explicitly rather than by drift.
3. **Sticky section nav with negative margin.** It sits on the page edge, not inside the
   1120 px column, so it never narrows the measure. Geometry only; no new colour.
4. **Table scroll boxes.** `.table-wrap > table` takes `min-width: 600px`. Without it the
   first column crushed to ~8 px on a 390 px phone and broke words mid-letter (observed
   in the rendered pass, 17 Nov 2026). The fix is a width floor, not an overflow hidden.

## Checks run

- Markup: balanced (no unclosed or mismatched tags).
- Rendered at 1440 × 1000 and 390 × 844 with headless Chromium; no horizontal overflow at
  390 (`scrollWidth === innerWidth === 390`).
- Contrast computed for every ink and state pair used (all ≥ 4.5:1 for small text; accent
  button 8.7:1).
- Colour literals: none outside the token block (grep), except the token definitions.
- **Not run:** the newcomer walkthrough with a fresh reader (needs a session that has not
  seen the brief), and the scored Impeccable audit. The copy-picks interaction was not
  clicked in-browser: Chromium was killed by the host's memory limit (about 100 MB free)
  before the click could be issued. Both are owed before this page is put in front of the
  owner as finished.
