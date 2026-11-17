# The kit

The design system for Cairn's control plane, in three files and one specimen page. Read it
before building or extending a screen (§ 1.8 of `AGENTS.md`: "a product's screens, or a mock
of one").

| File | Holds |
|---|---|
| `tokens.css` | **Every raw value in this repository.** Colour, type, space, form, layout, motion. |
| `kit.css` | The primitives, built only from those tokens. Compose screens from these. |
| `artboards.html` | The chosen shell: the same screen at 1440 and 390, plus the primitives strip. |
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

## Direction — Trade press (chosen 17 Nov 2026)

Warm paper, serif display, a top bar, one wide ruled table, activity in words. The store is a
publication and the product looks like the trade it serves. Chosen by the owner from two
shells drawn on the same screen (`/stores`, the portfolio, which is also the member home).

The shell that lost — cool stock, condensed grotesque, left rail with counts, 39 px rows, a
state bar on each row's edge — **was deleted, not kept behind a switch.** It scanned better at
thirty rows, and that is recorded in `docs/product/decisions.md` as the cost of the choice;
if thirty rows ever become the complaint, that entry is where to reopen it.

A direction is a **set of token values**, never a second kit. `[data-direction]` overrides
existed only while two shells were being compared and are gone with the loser: `:root` in
`tokens.css` is now the whole theme, so a second theme cannot creep back in by accident.

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

- `--max` 1120 px content, `--measure` 66ch for reading.
- Direction A's main column is 48 px top / 48 px bottom padding; B's is 32 px, and B carries
  a `--rail-w` 208 px rail. Both collapse to full width below `--bp-phone`, where tables
  become card lists rather than scrolling horizontally.
- **Row density is a token, not a padding habit**: `--row-pad` is `--sp-3` in A and `--sp-2`
  in B, so a row measures 47 px in A and 39 px in B — measured in the browser, and the only
  difference the artboards' own comparison table states as a number.
- A wide figure or table scrolls inside `.scroll-x` or `.table-wrap`, never the page.

## Extending it

1. Add the value to `tokens.css` with a comment saying what it is for.
2. Add the primitive to `kit.css`, built from tokens, with its states in the same block.
3. Add the primitive to a specimen page before using it in a screen — a primitive nobody
   has seen rendered is a guess.
4. If the primitive needs a value that has no token yet, that is a missing token, not an
   inline override.

## The rendered pass — done 17 Nov 2026

Chromium came back after the agent-browser sessions were closed. Screenshots at 1400 and 390
(`screenshots/20-` to `screenshots/29-`). What the pass found and what changed:

1. **Banners collapsed their text.** `.stack-sm` spaces its children with margins, and
   `<strong>`/`<span>` are inline, so a two-line banner rendered as one run-on line. Both
   banners are now `<p>` children. *(Kit rule learned: `.stack-*` expects block children.)*
2. **The fold ended in white space.** Both desktop frames showed a table and then nothing.
   Each now carries the screen's second block — A an activity list in words, B a run strip in
   mono lines — which also made the two shells comparable below the table.
3. **B claimed a density it did not have.** The comparison table said "14 rows fit" while the
   markup gave B the same 47 px rows as A. Fixed at the source: `--row-pad` is now a token,
   `--sp-3` in A and `--sp-2` in B, and rows measure 47 px and 39 px. The claim now matches
   the measurement, and the measurement is in the table.
4. **A 1440 px frame does not survive a 390 px window.** The phone mock was 390 px wide
   inside a 358 px frame, clipped on the right, with the menu button half outside it. Below
   `--bp-phone` the desktop frames are hidden with a line saying why, and the phone mock
   takes the full width. The media query had to move to the end of `artboards.css`: an
   equally specific rule later in the file was overriding it.
5. **B's phone had no way into the rail.** It gained the menu button A already had.

Page-level checks after the fixes: `scrollWidth === innerWidth` at 390 (no sideways scroll),
both directions render at 1440 and 390, and the primitives strip (buttons, field, four
states, tags) renders in both.

## Owed

- **The scored audit** from the `ui-design` skill (now that the direction is picked).
- **The newcomer walkthrough**, with a reader who has not seen these documents.
