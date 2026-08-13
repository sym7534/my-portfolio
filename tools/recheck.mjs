/**
 * recheck.mjs — independent re-verification of five completed items, written
 * to look for what the existing harness could be blind to rather than to
 * re-confirm what it already asserts.
 *
 * The highest-stakes question: I added a NODE_ENV==="development" bypass to
 * useUnlock so the whole grid is reviewable locally. If that bypass survived
 * into a production bundle it would publicly reveal every project the user
 * deliberately gated. verify-page.mjs runs against DEV, so it cannot catch
 * this. That is exactly the blind spot worth probing.
 *
 * Usage: node tools/recheck.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { createCanvas, loadImage } from "./vendor/node_modules/@napi-rs/canvas/index.js";
import { THUMBS } from "./thumb-config.mjs";

const ROOT = process.cwd();
const out = [];
const check = (id, what, pass, observed) => {
  out.push({ id, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id}  ${what}`);
  console.log(`        ${observed}\n`);
};

// ---------------------------------------------------------------------------
// RECHECK 1 — the dev unhide must NOT reach production
// ---------------------------------------------------------------------------
const nextDir = path.join(ROOT, ".next");
const chunks = [];
const walk = (d) => {
  let e;
  try { e = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
  for (const x of e) {
    const full = path.join(d, x.name);
    if (x.isDirectory()) walk(full);
    else if (/\.js$/.test(x.name)) chunks.push(full);
  }
};
walk(path.join(nextDir, "static"));

let devBypassFound = [];
let unlockHostFound = 0;
for (const f of chunks) {
  const src = fs.readFileSync(f, "utf8");
  // The dev branch, if it survived, would still reference NODE_ENV alongside
  // the unlock logic. Next inlines NODE_ENV at build time, so in a prod bundle
  // the comparison should be gone entirely (folded to false, branch dropped).
  if (/"development"===process\.env\.NODE_ENV|process\.env\.NODE_ENV==="development"/.test(src)) {
    devBypassFound.push(path.basename(f));
  }
  if (src.includes("portfolio.wangdynasty.ca")) unlockHostFound++;
}

check(
  "RC1",
  "dev-only unhide does NOT survive into the production bundle",
  devBypassFound.length === 0,
  devBypassFound.length
    ? `NODE_ENV==="development" comparison present in: ${devBypassFound.join(", ")}`
    : `scanned ${chunks.length} production chunks; no live NODE_ENV==="development" comparison. ` +
      `(unlock host string appears in ${unlockHostFound} chunk(s), which is the pre-existing ` +
      `easter-egg design, not something I introduced)`
);

// Prove the gate still works in prod by checking the compiled logic shape:
// the hostname comparison must still be present, i.e. I did not replace the
// real gate with an unconditional unlock.
let hostGateIntact = false;
for (const f of chunks) {
  const src = fs.readFileSync(f, "utf8");
  if (/location\.hostname!==|hostname!==["']portfolio/.test(src)) hostGateIntact = true;
}
check(
  "RC2",
  "production still gates on hostname (unlock not left unconditional)",
  hostGateIntact,
  hostGateIntact
    ? "compiled bundle still contains a location.hostname inequality guard"
    : "no hostname guard found in the production bundle — the gate may have been removed"
);

// ---------------------------------------------------------------------------
// RECHECK 3 — dark mode: verify the PNGs really are transparent
// ---------------------------------------------------------------------------
// The fix was "render on transparent paper so invert only affects ink". That
// claim is checkable directly on the files, independent of any browser.
const alphaReport = [];
for (const t of THUMBS) {
  const p = path.join(ROOT, "public/assets/projects", t.slug, "ascii.png");
  if (!fs.existsSync(p)) continue;
  const img = await loadImage(p);
  const c = createCanvas(img.width, img.height);
  const cx = c.getContext("2d");
  cx.drawImage(img, 0, 0);
  const d = cx.getImageData(0, 0, img.width, img.height).data;
  let transparent = 0, whitePixels = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] > 250) {
      if (d[i] > 250 && d[i + 1] > 250 && d[i + 2] > 250) whitePixels++;
    } else if (d[i + 3] < 5) transparent++;
  }
  const total = img.width * img.height;
  alphaReport.push({
    slug: t.slug,
    transparentPct: (transparent / total) * 100,
    opaqueWhitePct: (whitePixels / total) * 100,
  });
}
const notTransparent = alphaReport.filter((a) => a.transparentPct < 20);
const hasWhiteFill = alphaReport.filter((a) => a.opaqueWhitePct > 5);
check(
  "RC3",
  "mosaics have transparent paper (so dark:invert only flips ink)",
  notTransparent.length === 0 && hasWhiteFill.length === 0,
  notTransparent.length || hasWhiteFill.length
    ? `low-transparency: ${notTransparent.map((a) => a.slug).join(",") || "none"}; ` +
      `opaque-white fill: ${hasWhiteFill.map((a) => a.slug).join(",") || "none"}`
    : `all ${alphaReport.length} PNGs are mostly transparent ` +
      `(min ${Math.min(...alphaReport.map((a) => a.transparentPct)).toFixed(1)}% clear), ` +
      `zero have an opaque white background`
);

// ---------------------------------------------------------------------------
// RECHECK 4 — pipeline is genuinely static (no runtime dependency added)
// ---------------------------------------------------------------------------
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
const leaked = ["@napi-rs/canvas", "playwright-core", "rembg"].filter((d) => deps[d]);
// and nothing under src/ may import the tools
const srcFiles = [];
const walkSrc = (d) => {
  for (const x of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, x.name);
    if (x.isDirectory()) walkSrc(full);
    else srcFiles.push(full);
  }
};
walkSrc(path.join(ROOT, "src"));
const srcImportsTools = srcFiles.filter((f) =>
  /from ["'].*tools\//.test(fs.readFileSync(f, "utf8"))
);
check(
  "RC4",
  "generator adds no runtime dependency and src never imports tools/",
  leaked.length === 0 && srcImportsTools.length === 0,
  `package.json extra deps: ${leaked.length ? leaked.join(",") : "none"}; ` +
    `src files importing tools/: ${srcImportsTools.length}`
);

// ---------------------------------------------------------------------------
// RECHECK 5 — every configured project actually produced a current file
// ---------------------------------------------------------------------------
const dims = JSON.parse(fs.readFileSync(path.join(ROOT, "tools/ascii-dims.json"), "utf8"));
const stale = [];
const missing = [];
for (const t of THUMBS) {
  const p = path.join(ROOT, "public/assets/projects", t.slug, "ascii.png");
  if (!fs.existsSync(p)) { missing.push(t.slug); continue; }
  const img = await loadImage(p);
  const d = dims[t.slug];
  if (!d || d.w !== img.width || d.h !== img.height) {
    stale.push(`${t.slug} file=${img.width}x${img.height} manifest=${d ? d.w + "x" + d.h : "absent"}`);
  }
}
check(
  "RC5",
  "every configured project has a current PNG matching the manifest",
  missing.length === 0 && stale.length === 0,
  missing.length || stale.length
    ? `missing: ${missing.join(",") || "none"}; stale: ${stale.join(" | ") || "none"}`
    : `all ${THUMBS.length} PNGs exist and match tools/ascii-dims.json exactly`
);

// data layer must agree too (this is what next/image actually reads)
const projTs = fs.readFileSync(path.join(ROOT, "src/data/projects.ts"), "utf8");
const dataMismatch = [];
for (const [slug, v] of Object.entries(dims)) {
  const lines = projTs.split("\n");
  const i = lines.findIndex((l) => l.includes(`asciiSrc: "${v.src}"`));
  if (i === -1) { dataMismatch.push(`${slug}: no entry`); continue; }
  const w = Number((lines[i + 1].match(/(\d+)/) || [])[1]);
  const h = Number((lines[i + 2].match(/(\d+)/) || [])[1]);
  if (w !== v.w || h !== v.h) dataMismatch.push(`${slug}: data=${w}x${h} actual=${v.w}x${v.h}`);
}
check(
  "RC6",
  "src/data dimensions match the generated PNGs (CLS)",
  dataMismatch.length === 0,
  dataMismatch.length ? dataMismatch.join(" | ") : `all ${Object.keys(dims).length} entries agree`
);

// ---------------------------------------------------------------------------
// RECHECK 7 — before/after sheet covers every project and is current
// ---------------------------------------------------------------------------
const sheet = path.join(ROOT, "tools/preview/before-after.png");
let sheetOk = false, sheetNote = "not generated";
if (fs.existsSync(sheet)) {
  const sheetTime = fs.statSync(sheet).mtimeMs;
  const newestPng = Math.max(
    ...THUMBS.map((t) => {
      const p = path.join(ROOT, "public/assets/projects", t.slug, "ascii.png");
      return fs.existsSync(p) ? fs.statSync(p).mtimeMs : 0;
    })
  );
  sheetOk = sheetTime >= newestPng;
  sheetNote = sheetOk
    ? "sheet is newer than every thumbnail it depicts"
    : `sheet is STALE: regenerated thumbnails exist since it was built`;
}
check("RC7", "before/after sheet reflects the current thumbnails", sheetOk, sheetNote);

const failed = out.filter((r) => !r.pass).length;
console.log("=".repeat(68));
console.log(`${out.length - failed}/${out.length} rechecks passed`);
process.exit(failed ? 1 : 0);
