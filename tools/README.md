# tools/ — ASCII thumbnail pipeline

Offline generator that renders each project's cover image as an ASCII/geometric
cell mosaic, in the site's ink-on-paper palette, for use as the projects-grid
thumbnail. Ported from the sibling `ascii-graphics` project's `cellrenderer.js`,
with the live Three.js frame sampler replaced by a still-image sampler.

Output is committed as static PNGs under `public/assets/projects/<slug>/ascii.png`
and referenced from `src/data/projects.ts` via `asciiSrc`. Nothing runs at
request time, and the site takes no new runtime dependency.

## Usage

```bash
node tools/gen-ascii-thumbs.mjs                    # regenerate all (writes to public/)
node tools/gen-ascii-thumbs.mjs canopi vex         # a subset
node tools/gen-ascii-thumbs.mjs --out tools/preview  # preview without touching public/

node tools/sweep.mjs <slug> <param> <v1,v2,...>    # contact sheet of one parameter
node tools/contact-sheet.mjs tools/preview 370     # all thumbs at real card width
node tools/show-crops.mjs [slug ...]               # verify crop rectangles
node tools/mock-card.mjs                           # PhotoCard mock, both themes
node tools/verify-page.mjs [url]                    # acceptance check vs the running site
python tools/cutouts.py [slug ...]                 # regenerate subject cutouts
```

A full run also writes `tools/ascii-dims.json` (intrinsic sizes), which is what
`src/data/projects.ts` mirrors so `next/image` can reserve layout.

## Files

| File | Role |
| --- | --- |
| `ascii-cells.mjs` | The renderer: sampling, tone field, detail weighting, auto-exposure, cell drawing |
| `thumb-config.mjs` | Per-project settings. **Tune here, not in the renderer** |
| `gen-ascii-thumbs.mjs` | CLI that writes the PNGs and the dimensions manifest |
| `sweep.mjs` | Renders one project across a parameter range into a contact sheet |
| `contact-sheet.mjs` | All thumbnails at true display size |
| `show-crops.mjs` | Cropped source regions, to check crops before judging output |
| `cutouts.py` | Subject isolation via rembg, writes `tools/cutouts/<slug>.png` |
| `probe-images.mjs` | Reports source dimensions and background uniformity |
| `mock-card.mjs` | Renders the thumbnails as PhotoCard does, in light and dark |
| `verify-page.mjs` | Drives headless Chrome against the running dev server and asserts R1-R7 |

## How it differs from ascii-graphics

Three changes were necessary to make the effect work at thumbnail size:

1. **Monotonic mark ramps.** The original picks a glyph by hash *within* a
   luminance band. At full screen, with color and motion, that reads as texture.
   At ~370px it destroys the tonal gradient and the subject dissolves into
   noise. Here glyphs and shapes are ordered by ink coverage and selected
   monotonically from tone, so darkness of the mark tracks darkness of the
   source. (An independent review of ascii-graphics flagged the same
   non-monotonic ramp as a real bug there, unrelated to this port.)
2. **Auto-exposure (`targetDensity` + `minFloor`).** Product photos and washed-out
   UI screenshots need very different ink floors. `targetDensity` sets what
   fraction of covered cells get ink; `minFloor` is an absolute backstop,
   because on very flat sources a large share of cells tie at nearly the same
   tone and a pure percentile lands inside that tie, printing a uniform dot
   lattice over the whole frame.
3. **Detail weighting (`detail`).** Screenshots are mostly flat fills. Weighting
   each cell by its local deviation from a blurred copy keeps edges and text
   while letting flat regions drop out to paper. Isolated photo subjects use
   `detail: 0` because their silhouette already does this.

## Source-material rules of thumb

- **Photo of one object** → `isolate: true` (rembg segmentation), `detail: 0`.
- **Screenshot** → `crop` to the interesting region, `detail` 0.35–0.55, and a
  `minFloor`. Segmentation does *not* work on screenshots; `mars-rover` was
  originally configured this way and the cutout was garbage.
- **Dark UI** → `invert: true`.
- If a source has no strong subject at all, use a different source. `tronring`
  renders its chrome star mark instead of a sparse dark webpage.

## Dependencies

`@napi-rs/canvas` is installed into `tools/vendor/` rather than the app's
`package.json`, deliberately: it is a native binary needed only by this offline
generator and must never enter the deployed dependency tree. `tools/vendor/` and
`tools/cutouts/` are gitignored; run `npm install` inside `tools/vendor/` to
restore, and `python -m pip install "rembg[cpu]" onnxruntime pillow` for cutouts.

## Verification

`verify-page.mjs` is the acceptance check. It drives headless Chrome against a
running `npm run dev` and maps each explicit requirement to an observed result:

| ID | Requirement | Check |
| --- | --- | --- |
| R1 | All projects visible in dev | Count rendered project cards |
| R2 | ASCII effect applied to thumbnails | Every card image resolves to an `ascii.png` |
| R3 | Thumbnails actually load | `naturalWidth > 0` after scrolling (they are `loading="lazy"`) |
| R4a | No layout shift | `width`/`height` attributes present on every card image |
| R5a | Dark mode reads correctly | Computed filter is `invert(1)` in dark, `none` in light |
| R6 | Detail modal unchanged | Dialog still shows photographic sources, not mosaics |
| R7 | No failed asset requests | No 4xx/5xx on non-API traffic |

Two gotchas it encodes, both found the hard way:

- `waitUntil: "networkidle"` never settles, because the page holds permanent
  rAF loops (`LenisScroll`, `CursorTrail`). Wait on `domcontentloaded`.
- Cards are `loading="lazy"` and the layout scrolls *panels*, not the window,
  so every scrollable element must be scrolled before sampling. Without this,
  below-the-fold cards report `0x0` and look broken when they are fine.

`/api/visit` returns 500 on a local machine with no `DISCORD_WEBHOOK_URL`
(`src/lib/api/discord.ts:8`). That is a pre-existing environment condition, so
R7 is scoped to asset traffic.

`playwright-core` lives in `tools/vendor/` alongside `@napi-rs/canvas` and uses
the system Chrome, so it never enters the app's dependency tree.

## Grid resolution is per source type

The single most important tuning decision, and it is not a slider:

- **Isolated photo subjects** (robot-hand, vex, card-dealer, smart-home,
  tronring) stay coarse at `cols: 58`. Their silhouette *is* the content. A
  fine grid turns them into a grey photograph and loses the typographic look.
- **Screenshots** need a fine grid, because their meaning lives in small
  detail. At 58 columns the portfolio cover was scattered marks; at
  `cols: 150, cellW: 4` it reads "hey, i'm Ryan Wang". Likewise waterloowash
  (phone frame and the "12"), canopi (map pill cluster) and self-driving-car
  (costmap blobs and the path line).

`cols` and `cellW` move together: raising columns while lowering cell width
keeps the output roughly the same physical size while letting structure
resolve.

**After changing `cols`/`cellW`, run `node tools/sync-dims.mjs`.** The output
PNG changes size, and `src/data/projects.ts` carries those dimensions for
`next/image` to reserve layout. A stale pair silently reintroduces layout
shift. R4b in `verify-page.mjs` now fails loudly if they drift.

## Safety: the dev-only unhide

`useUnlock` reveals `hidden` projects when `NODE_ENV === "development"` so the
full grid is reviewable locally. If that ever leaked into production it would
publicly expose every project the author deliberately gated, so it is checked
two independent ways:

- **Statically** (`recheck.mjs` RC1/RC2): scans the built chunks under
  `.next/static`. Next inlines `NODE_ENV` at build time, so in a production
  bundle the comparison should be folded away entirely. RC2 additionally
  asserts the real `location.hostname` guard survives, i.e. the gate was not
  replaced by an unconditional unlock.
- **Behaviourally** (`verify-prod-gate.mjs`): runs a real browser against
  `next start` and counts rendered cards as an ordinary visitor versus a
  visitor on the secret host. Observed: **1 card vs 12**. The gate still
  discriminates in production.

The behavioural test resolves the secret hostname to localhost with Chrome's
`--host-resolver-rules`. Patching `window.location` from a page script does not
work — it is non-configurable in Chrome and fails silently, which is how the
first version of this test produced a false FAIL.

## Why the glyph order is measured, not chosen

`verify-ramp.mjs` rasterizes every glyph in `GLYPH_RAMP` at the renderer's own
font and size, then pushes a synthetic gradient through the real pipeline.

It asserts two things: zero local inversions in the ramp (Spearman rho = 1.000
against measured ink) and that rendered ink tracks source tone end to end
(Pearson r = 0.968, ~11x ink between the lightest and darkest bands).

This caught a real defect. The ramp was originally ordered by eye and had four
local inversions (F/V, 0/X, H/E, W/0). End-to-end correlation was still 0.911,
so the output looked fine, but "ordered by ink coverage" is the single property
that makes this port legible where the original ascii-graphics renderer is not,
and it should be true rather than approximately true. Reordering by measurement
lifted the correlation to 0.968.
