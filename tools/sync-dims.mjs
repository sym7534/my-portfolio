/**
 * sync-dims.mjs — rewrite asciiWidth/asciiHeight in src/data/projects.ts from
 * tools/ascii-dims.json.
 *
 * These must match the generated PNGs exactly: next/image uses them to reserve
 * layout, so a stale pair reserves the wrong box and reintroduces the CLS the
 * asciiWidth/Height fields exist to prevent. Regenerating at a different grid
 * resolution changes the output size, so this runs after every generate.
 *
 * Usage: node tools/sync-dims.mjs
 */
import fs from "node:fs";

const dims = JSON.parse(fs.readFileSync("tools/ascii-dims.json", "utf8"));
const p = "src/data/projects.ts";
let t = fs.readFileSync(p, "utf8");

let changed = 0;
for (const [slug, v] of Object.entries(dims)) {
  // anchor on the asciiSrc line, then rewrite the two lines that follow
  const lines = t.split("\n");
  const idx = lines.findIndex((l) => l.includes(`asciiSrc: "${v.src}"`));
  if (idx === -1) {
    console.log(`  no asciiSrc entry for ${slug}`);
    continue;
  }
  const wLine = lines[idx + 1];
  const hLine = lines[idx + 2];
  if (!/asciiWidth:/.test(wLine) || !/asciiHeight:/.test(hLine)) {
    console.log(`  unexpected shape after ${slug}`);
    continue;
  }
  const oldW = Number(wLine.match(/(\d+)/)[1]);
  const oldH = Number(hLine.match(/(\d+)/)[1]);
  if (oldW === v.w && oldH === v.h) continue;
  lines[idx + 1] = wLine.replace(/\d+/, v.w);
  lines[idx + 2] = hLine.replace(/\d+/, v.h);
  t = lines.join("\n");
  console.log(`  ${slug}: ${oldW}x${oldH} -> ${v.w}x${v.h}`);
  changed++;
}

fs.writeFileSync(p, t);
console.log(changed ? `synced ${changed} project(s)` : "already in sync");
