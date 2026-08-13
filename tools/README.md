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
