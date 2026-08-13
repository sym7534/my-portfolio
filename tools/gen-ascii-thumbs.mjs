/**
 * gen-ascii-thumbs.mjs — render project cover images as ASCII cell mosaics.
 *
 * Usage:
 *   node tools/gen-ascii-thumbs.mjs            # all configured projects
 *   node tools/gen-ascii-thumbs.mjs canopi vex # a subset
 *   node tools/gen-ascii-thumbs.mjs --out tools/preview   # alternate out dir
 *
 * Reads per-project settings from tools/thumb-config.mjs so tuning is data,
 * not code. Writes PNGs to public/assets/projects/<slug>/ascii.png.
 */
import { createCanvas, loadImage } from "./vendor/node_modules/@napi-rs/canvas/index.js";
import fs from "node:fs";
import path from "node:path";
import { sampleImage, buildToneField, applyDetailWeighting, autoFloor, renderCells } from "./ascii-cells.mjs";
import { THUMBS, DEFAULTS } from "./thumb-config.mjs";

const ROOT = process.cwd();
const args = process.argv.slice(2);

let outDir = null;
const slugs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out") outDir = args[++i];
  else slugs.push(args[i]);
}

const targets = THUMBS.filter((t) => slugs.length === 0 || slugs.includes(t.slug));
if (targets.length === 0) {
  console.error("no matching projects");
  process.exit(1);
}

// slug -> { src, w, h } for the generated files, so src/data/projects.ts can
// carry exact intrinsic sizes (next/image needs them to reserve layout)
const manifest = {};

for (const t of targets) {
  const cfg = { ...DEFAULTS, ...t };
  // isolated (background-removed) source if one exists, else the original
  const cutout = path.join(ROOT, "tools/cutouts", `${t.slug}.png`);
  const useCutout = cfg.isolate && fs.existsSync(cutout);
  const srcPath = useCutout
    ? cutout
    : path.join(ROOT, "public", cfg.src.replace(/^\//, ""));

  if (!fs.existsSync(srcPath)) {
    console.log(`${t.slug}: MISSING ${srcPath}`);
    continue;
  }

  const img = await loadImage(srcPath);

  const cols = cfg.cols;
  const aspect = cfg.aspect ?? img.width / img.height;
  const rows = Math.max(1, Math.round(cols / aspect));

  const trimBox = useCutout && cfg.trim ? contentBox(img) : null;

  const sample = sampleImage(createCanvas, img, cols, aspect, {
    trimBox,
    pad: cfg.pad,
    crop: cfg.crop,
  });

  const step = cfg.cellW + cfg.spacing;
  const W = cols * step;
  const H = rows * step;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = cfg.paper;
  ctx.fillRect(0, 0, W, H);

  const field = applyDetailWeighting(buildToneField(sample, cfg), cfg.detail || 0, cfg.detailRadius || 2);
  // Auto-exposure: pick the ink floor from a target density so screenshots and
  // product photos land at comparable weight without hand-set floors.
  // `minFloor` is an absolute backstop: on very flat sources (a mostly-white
  // page) a huge share of cells share nearly the same tone, so the percentile
  // lands inside that tie and the whole frame passes, printing a uniform dot
  // lattice. The absolute floor cuts that tie off.
  const drawCfg =
    cfg.targetDensity != null
      ? {
          ...cfg,
          floorTone: Math.max(autoFloor(field, cfg.targetDensity), cfg.minFloor || 0),
        }
      : cfg;
  renderCells(ctx, field, drawCfg);

  const dest = outDir
    ? path.join(ROOT, outDir, `${t.slug}.png`)
    : path.join(ROOT, "public/assets/projects", t.slug, "ascii.png");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, canvas.toBuffer("image/png"));

  const kb = (fs.statSync(dest).size / 1024).toFixed(0);
  console.log(
    `${t.slug.padEnd(18)} ${String(cols).padStart(3)}x${String(rows).padEnd(3)} cells  ` +
      `${String(W).padStart(4)}x${String(H).padEnd(4)}px  ${kb.padStart(4)}KB  ` +
      `${useCutout ? "cutout" : "full"}`
  );

  manifest[t.slug] = {
    src: `/assets/projects/${t.slug}/ascii.png`,
    w: W,
    h: H,
  };
}

// Written on full runs only (a partial run would drop entries).
if (!outDir && slugs.length === 0) {
  fs.writeFileSync(
    path.join(ROOT, "tools/ascii-dims.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );
  console.log("wrote tools/ascii-dims.json");
}

/** Tight bounding box of non-transparent pixels, for centering a cutout. */
function contentBox(img) {
  const PW = 240;
  const ph = Math.max(1, Math.round((PW * img.height) / img.width));
  const c = createCanvas(PW, ph);
  const x = c.getContext("2d");
  x.drawImage(img, 0, 0, PW, ph);
  const d = x.getImageData(0, 0, PW, ph).data;
  let minX = PW, minY = ph, maxX = -1, maxY = -1;
  for (let yy = 0; yy < ph; yy++) {
    for (let xx = 0; xx < PW; xx++) {
      if (d[(yy * PW + xx) * 4 + 3] > 24) {
        if (xx < minX) minX = xx;
        if (xx > maxX) maxX = xx;
        if (yy < minY) minY = yy;
        if (yy > maxY) maxY = yy;
      }
    }
  }
  if (maxX < 0) return null;
  const rx = img.width / PW;
  const ry = img.height / ph;
  return {
    x: minX * rx,
    y: minY * ry,
    w: (maxX - minX + 1) * rx,
    h: (maxY - minY + 1) * ry,
  };
}
