// Probe source images: dimensions, border-color uniformity, and whether a
// flood-fill background removal is likely to work (photo/render on a plain
// backdrop) vs a UI screenshot that should keep its full frame.
import { createCanvas, loadImage } from "./vendor/node_modules/@napi-rs/canvas/index.js";
import path from "node:path";
import fs from "node:fs";

const ROOT = process.cwd();
const files = process.argv.slice(2);

for (const rel of files) {
  const abs = path.join(ROOT, "public", rel.replace(/^\//, ""));
  if (!fs.existsSync(abs)) { console.log(rel, "MISSING"); continue; }
  const img = await loadImage(abs);
  const W = 200;
  const H = Math.max(1, Math.round((W * img.height) / img.width));
  const c = createCanvas(W, H);
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, W, H);
  const d = ctx.getImageData(0, 0, W, H).data;

  const at = (x, y) => { const i = (y * W + x) * 4; return [d[i], d[i + 1], d[i + 2], d[i + 3]]; };

  // sample the border ring
  const border = [];
  for (let x = 0; x < W; x++) { border.push(at(x, 0)); border.push(at(x, H - 1)); }
  for (let y = 0; y < H; y++) { border.push(at(0, y)); border.push(at(W - 1, y)); }

  let mr = 0, mg = 0, mb = 0, ma = 0;
  for (const [r, g, b, a] of border) { mr += r; mg += g; mb += b; ma += a; }
  const n = border.length;
  mr /= n; mg /= n; mb /= n; ma /= n;

  // how much the border deviates from its own mean = uniformity
  let dev = 0;
  for (const [r, g, b] of border) {
    dev += Math.abs(r - mr) + Math.abs(g - mg) + Math.abs(b - mb);
  }
  dev /= n * 3;

  // transparency present?
  let transparent = 0;
  for (let i = 3; i < d.length; i += 4) if (d[i] < 250) transparent++;
  const transPct = (transparent / (W * H)) * 100;

  console.log(
    rel.padEnd(52),
    `${String(img.width).padStart(5)}x${String(img.height).padEnd(5)}`,
    `border=rgb(${mr | 0},${mg | 0},${mb | 0}) a=${ma | 0}`,
    `dev=${dev.toFixed(1)}`.padEnd(10),
    `alpha<250=${transPct.toFixed(1)}%`,
    dev < 12 ? " <- UNIFORM BG (isolatable)" : ""
  );
}
