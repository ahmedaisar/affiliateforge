# The kit

The design system for Cairn's control plane, in three files and one specimen page. Read it
before building or extending a screen (§ 1.8 of `AGENTS.md`: "a product's screens, or a mock
of one").

| File | Holds |
|---|---|
| `tokens.css` | **Every raw value in this repository.** Colour, type, space, form, layout, motion. |
| `kit.css` | The primitives, built only from those tokens. Compose screens from these. |
| `artboards.html` | Two app-shell directions, the same screen drawn in both at 1440 and 390. |
| `jobs-map.md` | Each job, the screen that does it, the one question it answers, its primary action. |

`kit-notes.md` is the record of the *proposal artifact's* design, written before this kit
existed. It is evidence, not a rule; where the two disagree, this file wins.

## The rule that matters

**If you need a number, it lives in `tokens.css` and you use its name.** A screen that
writes `padding: 13px` or `#333` is a bug, not a shortcut: the next screen cannot tell
whether 13 was a decision or a slip. The one exception is a media query width — CSS cannot
read a custom property there — so `--bp-phone` documents the value that `@media` restates.

Verified 17 Nov 2026: no hex literal and no `px` value exists in `kit.css`, `artboards.css`
or the artboards markup, except the breakpoint above.

## Direction (open until the owner picks)

Two shells are drawn, from the same tokens, on the same screen (`/stores`, the portfolio,
which is also the member home):

- **A — Trade press.** Warm paper, serif display, top bar, one wide ruled table, generous
  spacing. It continues the proposal's look: the product reads as the trade it serves.
- **B — Workbench.** Cooler stock, condensed grotesque, left rail with counts, tighter rows,
  tabular figures, and a state bar down the left edge of every row. It reads as an
  instrument: thirty stores scan in one pass.

A direction is a **set of token values**, never a second kit: `[data-direction="b"]` in
`tokens.css` overrides stock, display face, scale, radii and control height, and every
primitive follows. **The pick is recorded in `docs/product/decisions.md`, and the losing
direction is deleted rather than kept as a theme** — a product with two themes looks like a
product with none.

## What the kit guarantees, in both directions

- **State is a word plus a shape**, never colour alone: a disc for live (`--ok`), a vertical
  bar for needs-a-look (`--warn`), a square for failed (`--bad`), a ring for nothing built
  (`--none`). The `.state` primitive draws the shape from the modifier, so a new state is a
  new name, not a new icon set.
- **Blue acts, and no state uses blue.** A saturated blue element is always something to
  press. This is why `--accent` is absent from the state tokens.
- **Controls keep a 44 px floor when icon-only** (`--touch`), and are 34 px (`--control-h`)
  otherwise; direction B lowers the default but never the floor.
- **The focus ring is a real outline** (`--focus-w`, `--focus-offset`), not a shadow, so it
  survives forced-colors and high-contrast modes.
- **Text contrast is ≥ 4.5:1 for every ink and state pair on every surface it is used on**,
  computed and recorded below; `--ink-3` is meta only and never body copy.
- **Settings keep native inputs.** No custom select, checkbox or radio until a screen
  proves the native one cannot carry the meaning.

## Contrast, computed (17 Nov 2026)

Both directions, every pair the kit actually puts together: `ink`, `ink-2`, `ink-3` on
`paper`, `paper-2`, `paper-3`; `on-accent` on `accent`; each state ink on its own wash;
`accent` on `paper` and `accent-wash`. **Lowest ratio: 4.51:1** (`ink-3` on `paper-3`,
direction A) — the reason `--ink-3` was darkened from `#767065` to `#6a6458` in A and from
`#6f747c` to `#61666e` in B, and `--none` in B to `#5f646b`. Any new pair is computed before
it ships; a value that fails is changed, not annotated.

## Layout and density

- `--max` 1120 px content, `--measure` 66ch for reading, `--gutter` 64 px above 720 px.
- Direction A's main column is 48 px top / 48 px bottom padding; B's is 32 px, and B carries
  a `--rail-w` 208 px rail. Both collapse to full width below `--bp-phone`, where tables
  become card lists rather than scrolling horizontally.
- A wide figure or table scrolls inside `.scroll-x` or `.table-wrap`, never the page.

## Extending it

1. Add the value to `tokens.css` with a comment saying what it is for.
2. Add the primitive to `kit.css`, built from tokens, with its states in the same block.
3. Add the primitive to a specimen page before using it in a screen — a primitive nobody
   has seen rendered is a guess.
4. If the primitive needs a value that has no token yet, that is a missing token, not an
   inline override.

## Owed

- **The rendered pass.** Chromium cannot start on this host right now (about 110 MB free, no
  swap; the binary core-dumps at `--headless=new`). The artboards were verified structurally
  — markup balanced, every class styled, every value tokenised, contrast computed — but
  **nobody has looked at them**. Before the owner is asked to pick, take the screenshots at
  1440 and 390 and fix what they show.
- **The scored audit** from the `ui-design` skill, once the direction is picked.
- **The newcomer walkthrough**, with a reader who has not seen these documents.
