/**
 * contact-sheet.mjs — lay every generated thumbnail out at the size it will
 * actually be displayed (the projects grid is two columns of ~370px inside
 * the right panel), so judgements are made at the real viewing size instead
 * of on 600px-wide renders that flatter the effect.
 */
import { createCanvas, loadImage } from "./vendor/node_modules/@napi-rs/canvas/index.js";
import fs from "node:fs";
import path from "node:path";
import { THUMBS } from "./thumb-config.mjs";

const ROOT = process.cwd();
const SRC = process.argv[2] || "tools/preview";
const CARD_W = Number(process.argv[3] || 370); // real card width in the grid
const COLS = 3;
const GAP = 18;
const LABEL = 18;

const items = [];
for (const t of THUMBS) {
  const p = path.join(ROOT, SRC, `${t.slug}.png`);
  if (!fs.existsSync(p)) continue;
  const img = await loadImage(p);
  items.push({ slug: t.slug, img, h: Math.round((CARD_W * img.height) / img.width) });
}

const rows = Math.ceil(items.length / COLS);
const rowH = [];
for (let r = 0; r < rows; r++) {
  const slice = items.slice(r * COLS, r * COLS + COLS);
  rowH.push(Math.max(...slice.map((i) => i.h)) + LABEL + GAP);
}

const W = COLS * CARD_W + (COLS + 1) * GAP;
const H = rowH.reduce((a, b) => a + b, 0) + GAP;

const c = createCanvas(W, H);
const ctx = c.getContext("2d");
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, W, H);
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

let y = GAP;
items.forEach((it, i) => {
  const r = Math.floor(i / COLS);
  const col = i % COLS;
  if (col === 0 && i > 0) y += rowH[r - 1];
  const x = GAP + col * (CARD_W + GAP);

  ctx.drawImage(it.img, x, y, CARD_W, it.h);
  // hairline frame, like the real PhotoCard border
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, CARD_W - 1, it.h - 1);

  ctx.fillStyle = "#171717";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(it.slug, x, y + it.h + 4);
});

const dest = path.join(ROOT, "tools/preview", `contact-${CARD_W}.png`);
fs.writeFileSync(dest, c.toBuffer("image/png"));
console.log(dest, `${items.length} thumbs @ ${CARD_W}px`);
