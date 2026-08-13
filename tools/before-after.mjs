/**
 * before-after.mjs — put the original cover and the ASCII mosaic side by side
 * at true card width, so the aesthetic judgement (the user's call, not mine)
 * can be made in one glance instead of by opening 22 files.
 *
 * Every other check in tools/ is mechanical: does it load, does it invert,
 * does it shift layout. None of them answer "does this look good", which is
 * the actual acceptance criterion. This exists to make that question cheap.
 *
 * Usage: node tools/before-after.mjs [cardWidth]
 */
import { createCanvas, loadImage } from "./vendor/node_modules/@napi-rs/canvas/index.js";
import fs from "node:fs";
import path from "node:path";
import { THUMBS, DEFAULTS } from "./thumb-config.mjs";

const ROOT = process.cwd();
const CARD_W = Number(process.argv[2] || 330);
const GAP = 20;
const LABEL = 34;
const HEAD = 44;

const rows = [];
for (const t of THUMBS) {
  const cfg = { ...DEFAULTS, ...t };
  const origPath = path.join(ROOT, "public", cfg.src.replace(/^\//, ""));
  const asciiPath = path.join(ROOT, "public/assets/projects", t.slug, "ascii.png");
  if (!fs.existsSync(origPath) || !fs.existsSync(asciiPath)) continue;

  const orig = await loadImage(origPath);
  const ascii = await loadImage(asciiPath);

  // The mosaic sets the row height; the original is fitted into the same box
  // so the comparison is like-for-like at the size the card actually renders.
  const h = Math.round((CARD_W * ascii.height) / ascii.width);
  rows.push({ slug: t.slug, orig, ascii, h });
}

const W = GAP + CARD_W + GAP + CARD_W + GAP;
const H = HEAD + rows.reduce((s, r) => s + r.h + LABEL + GAP, 0) + GAP;

const c = createCanvas(W, H);
const ctx = c.getContext("2d");
ctx.fillStyle = "#f7f7f7"; // --color-bg-light, the panel the cards sit on
ctx.fillRect(0, 0, W, H);
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

ctx.fillStyle = "#171717";
ctx.font = "600 15px sans-serif";
ctx.textBaseline = "middle";
ctx.fillText("BEFORE  (current cover)", GAP, HEAD / 2);
ctx.fillText("AFTER  (ASCII mosaic)", GAP + CARD_W + GAP, HEAD / 2);

let y = HEAD;
for (const r of rows) {
  // left: original, contain-fitted into the same box on a white card
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(GAP, y, CARD_W, r.h);
  const s = Math.min(CARD_W / r.orig.width, r.h / r.orig.height);
  const dw = r.orig.width * s;
  const dh = r.orig.height * s;
  ctx.drawImage(r.orig, GAP + (CARD_W - dw) / 2, y + (r.h - dh) / 2, dw, dh);
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;
  ctx.strokeRect(GAP + 0.5, y + 0.5, CARD_W - 1, r.h - 1);

  // right: the mosaic, drawn exactly as PhotoCard does
  const rx = GAP + CARD_W + GAP;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(rx, y, CARD_W, r.h);
  ctx.drawImage(r.ascii, rx, y, CARD_W, r.h);
  ctx.strokeStyle = "#e5e5e5";
  ctx.strokeRect(rx + 0.5, y + 0.5, CARD_W - 1, r.h - 1);

  ctx.fillStyle = "#171717";
  ctx.font = "15px Georgia, serif";
  ctx.fillText(r.slug, GAP, y + r.h + LABEL / 2);

  y += r.h + LABEL + GAP;
}

const dest = path.join(ROOT, "tools/preview", "before-after.png");
fs.writeFileSync(dest, c.toBuffer("image/png"));
console.log(`${dest}  (${rows.length} pairs at ${CARD_W}px)`);
