/**
 * sweep.mjs — render one project across a parameter sweep into a contact
 * sheet, so choices are made by looking rather than guessing.
 *
 * Usage:
 *   node tools/sweep.mjs canopi cols 40,56,72,84,110
 *   node tools/sweep.mjs smart-home contrast 0.8,1.0,1.3,1.6
 *   node tools/sweep.mjs vex mode TEXT,SHAPES,MIXED
 */
import { createCanvas, loadImage } from "./vendor/node_modules/@napi-rs/canvas/index.js";
import fs from "node:fs";
import path from "node:path";
import { sampleImage, buildToneField, applyDetailWeighting, autoFloor, renderCells } from "./ascii-cells.mjs";
import { THUMBS, DEFAULTS } from "./thumb-config.mjs";

const ROOT = process.cwd();
const [slug, param, listRaw] = process.argv.slice(2);
if (!slug || !param || !listRaw) {
  console.error("usage: node tools/sweep.mjs <slug> <param> <v1,v2,...>");
  process.exit(1);
}

const values = listRaw.split(",").map((v) => {
  if (v === "true") return true;
  if (v === "false") return false;
  const n = Number(v);
  return Number.isNaN(n) ? v : n;
});

const entry = THUMBS.find((t) => t.slug === slug);
if (!entry) {
  console.error(`unknown slug ${slug}`);
  process.exit(1);
}

const TILE_W = 420; // each variant is scaled to this width in the sheet
const LABEL_H = 22;

const tiles = [];
for (const v of values) {
  const cfg = { ...DEFAULTS, ...entry, [param]: v };

  const cutout = path.join(ROOT, "tools/cutouts", `${slug}.png`);
  const useCutout = cfg.isolate && fs.existsSync(cutout);
  const srcPath = useCutout
    ? cutout
    : path.join(ROOT, "public", cfg.src.replace(/^\//, ""));
  const img = await loadImage(srcPath);

  const cols = cfg.cols;
  const aspect = cfg.aspect ?? img.width / img.height;
  const rows = Math.max(1, Math.round(cols / aspect));
  const trimBox = useCutout && cfg.trim ? contentBox(img) : null;
  const sample = sampleImage(createCanvas, img, cols, aspect, { trimBox, pad: cfg.pad, crop: cfg.crop });

  const step = cfg.cellW + cfg.spacing;
  const W = cols * step;
  const H = rows * step;
  const c = createCanvas(W, H);
  const ctx = c.getContext("2d");
  ctx.fillStyle = cfg.paper;
  ctx.fillRect(0, 0, W, H);
  const field = applyDetailWeighting(buildToneField(sample, cfg), cfg.detail || 0, cfg.detailRadius || 2);
  const drawCfg = cfg.targetDensity != null ? { ...cfg, floorTone: Math.max(autoFloor(field, cfg.targetDensity), cfg.minFloor || 0) } : cfg;
  renderCells(ctx, field, drawCfg);

  tiles.push({ canvas: c, label: `${param}=${v}`, W, H });
}

// lay out horizontally, each scaled to TILE_W
const scaled = tiles.map((t) => ({
  ...t,
  dw: TILE_W,
  dh: Math.round((TILE_W * t.H) / t.W),
}));
const sheetH = Math.max(...scaled.map((s) => s.dh)) + LABEL_H;
const sheetW = TILE_W * scaled.length;

const sheet = createCanvas(sheetW, sheetH);
const sctx = sheet.getContext("2d");
sctx.fillStyle = "#ffffff";
sctx.fillRect(0, 0, sheetW, sheetH);
sctx.imageSmoothingEnabled = true;
sctx.imageSmoothingQuality = "high";

scaled.forEach((s, i) => {
  const x = i * TILE_W;
  sctx.drawImage(s.canvas, x, LABEL_H, s.dw, s.dh);
  sctx.fillStyle = "#171717";
  sctx.font = "13px sans-serif";
  sctx.textAlign = "left";
  sctx.textBaseline = "middle";
  sctx.fillText(s.label, x + 8, LABEL_H / 2);
  sctx.strokeStyle = "#cccccc";
  sctx.lineWidth = 1;
  sctx.strokeRect(x + 0.5, LABEL_H + 0.5, TILE_W - 1, s.dh - 1);
});

const dest = path.join(ROOT, "tools/preview", `sweep-${slug}-${param}.png`);
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, sheet.toBuffer("image/png"));
console.log(dest);

function contentBox(img) {
  const PW = 240;
  const ph = Math.max(1, Math.round((PW * img.height) / img.width));
  const c = createCanvas(PW, ph);
  const x = c.getContext("2d");
  x.drawImage(img, 0, 0, PW, ph);
  const d = x.getImageData(0, 0, PW, ph).data;
  let minX = PW, minY = ph, maxX = -1, maxY = -1;
  for (let yy = 0; yy < ph; yy++)
    for (let xx = 0; xx < PW; xx++)
      if (d[(yy * PW + xx) * 4 + 3] > 24) {
        if (xx < minX) minX = xx;
        if (xx > maxX) maxX = xx;
        if (yy < minY) minY = yy;
        if (yy > maxY) maxY = yy;
      }
  if (maxX < 0) return null;
  const rx = img.width / PW, ry = img.height / ph;
  return { x: minX * rx, y: minY * ry, w: (maxX - minX + 1) * rx, h: (maxY - minY + 1) * ry };
}
