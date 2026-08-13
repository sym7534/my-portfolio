/**
 * verify-ramp.mjs — prove the thumbnail renderer's core claim by measurement.
 *
 * The whole port rests on one assertion: unlike the original ascii-graphics
 * renderer, marks here are ordered by ink coverage and selected monotonically
 * from tone, so a darker source region produces a darker cell. That is the fix
 * that made the mosaics legible, and it was asserted in comments and commit
 * messages but never measured in this repo.
 *
 * Method: rasterize each glyph in GLYPH_RAMP at the renderer's own font, then
 * render a synthetic linear gradient through the real pipeline and correlate
 * source tone against measured output ink.
 *
 * Usage: node tools/verify-ramp.mjs
 */
import { createCanvas } from "./vendor/node_modules/@napi-rs/canvas/index.js";
import fs from "node:fs";
import { buildToneField, renderCells } from "./ascii-cells.mjs";

const src = fs.readFileSync("tools/ascii-cells.mjs", "utf8");
const GLYPH_RAMP = JSON.parse(
  src.match(/const GLYPH_RAMP = (\[[^\]]+\])/)[1].replace(/'/g, '"')
);
const FONT = "'Arial Narrow', 'Helvetica Neue', Helvetica, Arial, sans-serif";

// ---- 1. is GLYPH_RAMP actually ordered by ink coverage? -------------------
const CW = 64;
const px = Math.round(CW * 0.95);
const cov = GLYPH_RAMP.map((g) => {
  const c = createCanvas(CW, CW);
  const x = c.getContext("2d");
  x.fillStyle = "#fff";
  x.fillRect(0, 0, CW, CW);
  x.fillStyle = "#000";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.font = `bold ${px}px ${FONT}`;
  x.fillText(g, CW / 2, CW / 2);
  const d = x.getImageData(0, 0, CW, CW).data;
  let ink = 0;
  for (let i = 0; i < d.length; i += 4) ink += (255 - d[i]) / 255;
  return { g, ink: ink / (CW * CW) };
});

console.log("Ink coverage of GLYPH_RAMP, in declared order:");
console.log("  " + cov.map((c) => `${c.g}=${(c.ink * 100).toFixed(1)}%`).join("  "));

let inversions = 0;
for (let i = 1; i < cov.length; i++) if (cov[i].ink < cov[i - 1].ink) inversions++;
const sorted = [...cov].sort((a, b) => a.ink - b.ink).map((c) => c.g).join("");
const declared = cov.map((c) => c.g).join("");
console.log(`  declared: ${declared}`);
console.log(`  by ink:   ${sorted}`);
console.log(`  local inversions: ${inversions}/${cov.length - 1}`);

// Spearman rank correlation between declared position and measured ink.
const n = cov.length;
const rankInk = new Map([...cov].sort((a, b) => a.ink - b.ink).map((c, i) => [c.g, i]));
let dsq = 0;
cov.forEach((c, i) => { dsq += (i - rankInk.get(c.g)) ** 2; });
const rho = 1 - (6 * dsq) / (n * (n * n - 1));
console.log(`  Spearman rho(declared order, ink) = ${rho.toFixed(3)}\n`);

// ---- 2. end-to-end: does a gradient in produce a gradient out? -----------
// Build a synthetic left-to-right linear ramp and push it through the real
// tone field + cell renderer, then measure ink per column band.
const COLS = 64, ROWS = 16, CELL = 10;
const data = new Uint8ClampedArray(COLS * ROWS * 4);
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const i = (r * COLS + c) * 4;
    const v = Math.round(255 * (1 - c / (COLS - 1))); // left dark -> right light
    data[i] = data[i + 1] = data[i + 2] = v;
    data[i + 3] = 255;
  }
}
const field = buildToneField({ data, cols: COLS, rows: ROWS }, {
  gamma: 1.0, invert: false, alphaCut: 0.35, autoLevels: false, contrast: 1.0,
});

const W = COLS * CELL, H = ROWS * CELL;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");
renderCells(ctx, field, {
  cellW: CELL, spacing: 0, mode: "TEXT", cellOutline: false, chipAmount: 0,
  ink: "#000000", paper: "#ffffff", inkFloor: 1.0, inkCeil: 1.0,
  floorTone: 0, glyphScale: 0.95, bold: true,
});

const img = ctx.getImageData(0, 0, W, H).data;
const bandInk = [];
for (let c = 0; c < COLS; c++) {
  let ink = 0;
  for (let y = 0; y < H; y++) {
    for (let x = c * CELL; x < (c + 1) * CELL; x++) {
      const i = (y * W + x) * 4;
      const a = img[i + 3] / 255;
      ink += ((255 - img[i]) / 255) * a;
    }
  }
  bandInk.push(ink / (CELL * H));
}

// correlate source tone (which falls left->right) with rendered ink
const srcTone = bandInk.map((_, c) => 1 - (255 * (1 - c / (COLS - 1))) / 255);
const mx = srcTone.reduce((a, b) => a + b, 0) / COLS;
const my = bandInk.reduce((a, b) => a + b, 0) / COLS;
let num = 0, dx = 0, dy = 0;
for (let i = 0; i < COLS; i++) {
  num += (srcTone[i] - mx) * (bandInk[i] - my);
  dx += (srcTone[i] - mx) ** 2;
  dy += (bandInk[i] - my) ** 2;
}
const r = num / Math.sqrt(dx * dy);

const first = bandInk.slice(0, 8).reduce((a, b) => a + b, 0) / 8;
const last = bandInk.slice(-8).reduce((a, b) => a + b, 0) / 8;

console.log("End-to-end gradient test (source: dark left -> light right):");
console.log(`  mean ink, darkest 8 columns: ${(last * 100).toFixed(1)}%`);
console.log(`  mean ink, lightest 8 columns: ${(first * 100).toFixed(1)}%`);
console.log(`  Pearson r(source tone, rendered ink) = ${r.toFixed(3)}\n`);

const pass = rho > 0.95 && inversions === 0 && r > 0.9;
console.log(
  pass
    ? "PASS — marks are ordered by ink and output tracks input monotonically."
    : "FAIL — the density ramp is not behaving monotonically."
);
process.exit(pass ? 0 : 1);
