/**
 * show-crops.mjs — write the cropped source region for each project as a
 * plain image, so crop rectangles can be verified before judging the ASCII
 * output. Rendering the mosaic of a wrong crop and trying to reverse-engineer
 * what went wrong is much slower than just looking at the crop.
 */
import { createCanvas, loadImage } from "./vendor/node_modules/@napi-rs/canvas/index.js";
import fs from "node:fs";
import path from "node:path";
import { THUMBS, DEFAULTS } from "./thumb-config.mjs";

const ROOT = process.cwd();
const only = process.argv.slice(2);

const OUT = path.join(ROOT, "tools/preview/crops");
fs.mkdirSync(OUT, { recursive: true });

const W = 360;
const items = [];

for (const t of THUMBS) {
  if (only.length && !only.includes(t.slug)) continue;
  const cfg = { ...DEFAULTS, ...t };
  const cutout = path.join(ROOT, "tools/cutouts", `${t.slug}.png`);
  const useCutout = cfg.isolate && fs.existsSync(cutout);
  const src = useCutout ? cutout : path.join(ROOT, "public", cfg.src.replace(/^\//, ""));
  const img = await loadImage(src);

  let sx = 0, sy = 0, sw = img.width, sh = img.height;
  if (cfg.crop) {
    sx = cfg.crop.x * img.width;
    sy = cfg.crop.y * img.height;
    sw = cfg.crop.w * img.width;
    sh = cfg.crop.h * img.height;
  }

  const h = Math.round((W * sh) / sw);
  const c = createCanvas(W, h);
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, h);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, h);
  fs.writeFileSync(path.join(OUT, `${t.slug}.png`), c.toBuffer("image/png"));
  items.push({ slug: t.slug, canvas: c, h });
}

// one sheet so all crops can be judged together
const COLS = 4, GAP = 14, LABEL = 16;
const rows = Math.ceil(items.length / COLS);
const rowH = [];
for (let r = 0; r < rows; r++)
  rowH.push(Math.max(...items.slice(r * COLS, r * COLS + COLS).map((i) => i.h)) + LABEL + GAP);

const SW = COLS * W + (COLS + 1) * GAP;
const SH = rowH.reduce((a, b) => a + b, 0) + GAP;
const sheet = createCanvas(SW, SH);
const sctx = sheet.getContext("2d");
sctx.fillStyle = "#ffffff";
sctx.fillRect(0, 0, SW, SH);

let y = GAP;
items.forEach((it, i) => {
  const r = Math.floor(i / COLS), col = i % COLS;
  if (col === 0 && i > 0) y += rowH[r - 1];
  const x = GAP + col * (W + GAP);
  sctx.drawImage(it.canvas, x, y);
  sctx.strokeStyle = "#cccccc";
  sctx.strokeRect(x + 0.5, y + 0.5, W - 1, it.h - 1);
  sctx.fillStyle = "#171717";
  sctx.font = "12px sans-serif";
  sctx.textBaseline = "top";
  sctx.fillText(it.slug, x, y + it.h + 3);
});

const dest = path.join(ROOT, "tools/preview", "crops.png");
fs.writeFileSync(dest, sheet.toBuffer("image/png"));
console.log(dest, `${items.length} crops`);
