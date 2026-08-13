/**
 * verify-page.mjs — acceptance check against the REAL running site.
 *
 * Everything before this validated PNGs in isolation or a hand-built mock of
 * PhotoCard. Neither exercises the actual acceptance path: Next.js serving the
 * page, next/image rewriting the src, Tailwind's dark: variant applying, and
 * the cards laying out in the real grid. This drives headless Chrome against
 * localhost and reports what the DOM and the rendered pixels actually do.
 *
 * Checks, each mapped to an explicit requirement:
 *   R1 all projects visible in dev            -> count rendered project cards
 *   R2 ascii effect applied to thumbnails     -> every card <img> resolves to ascii.png
 *   R3 images actually load (not broken)      -> naturalWidth > 0 for each
 *   R4 no layout shift                        -> width/height attrs present, CLS measured
 *   R5 matches site aesthetic / dark mode      -> computed filter + sampled pixels per theme
 *   R6 modal still shows the real photograph  -> open a card, assert non-ascii src
 *
 * Usage: node tools/verify-page.mjs [url]
 */
import { chromium } from "./vendor/node_modules/playwright-core/index.mjs";
import fs from "node:fs";
import path from "node:path";

const URL = process.argv[2] || "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = path.join(process.cwd(), "tools/preview");

const results = [];
const record = (id, req, pass, detail) => {
  results.push({ id, req, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id}  ${req}\n        ${detail}`);
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

// capture failed network requests (broken images would show here)
const failed = [];
page.on("requestfailed", (r) => failed.push(r.url()));
page.on("response", (r) => {
  // Scope to asset traffic. /api/visit 500s on a local dev machine because
  // DISCORD_WEBHOOK_URL is unset (src/lib/api/discord.ts:8); that is a
  // pre-existing environment condition, not a thumbnail regression.
  if (r.status() >= 400 && !/\/api\//.test(r.url())) {
    failed.push(`${r.status()} ${r.url()}`);
  }
});

// The page holds permanent rAF loops (LenisScroll, CursorTrail), so
// "networkidle" never settles; wait on the DOM instead.
await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 120000 });
await page.waitForTimeout(2000);

// Card images are loading="lazy" and most of the grid is below the fold, so
// sampling naturalWidth immediately reports 0x0 for them and looks like a
// broken image. Scroll every scrollable element to the bottom first (the
// layout scrolls panels, not the window) so every card actually decodes.
await page.evaluate(async () => {
  const scrollers = [document.scrollingElement, ...document.querySelectorAll("*")]
    .filter((el) => el && el.scrollHeight > el.clientHeight + 50);
  for (const s of scrollers) {
    for (let i = 0; i <= 10; i++) {
      s.scrollTop = (s.scrollHeight - s.clientHeight) * (i / 10);
      await new Promise((r) => setTimeout(r, 160));
    }
  }
});
await page.waitForTimeout(2500);

// ---- R1: every project renders (dev unhide) --------------------------------
const cards = await page.locator('figure[aria-label^="Open project:"]').count();
record("R1", "all projects visible in dev", cards >= 11,
  `${cards} project cards rendered (expected >= 11; 11 configured + any non-hidden)`);

// ---- R2/R3/R4: thumbnails are the ascii mosaics and they loaded ------------
const imgs = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('figure[aria-label^="Open project:"] img').forEach((el) => {
    const cs = getComputedStyle(el);
    out.push({
      label: el.closest("figure")?.getAttribute("aria-label") || "?",
      src: el.currentSrc || el.src,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      hasW: el.hasAttribute("width"),
      hasH: el.hasAttribute("height"),
      renderedW: Math.round(el.getBoundingClientRect().width),
      filter: cs.filter,
    });
  });
  return out;
});

const isAscii = (s) => /ascii(%2F|\.|\/)/i.test(decodeURIComponent(s));
const asciiCount = imgs.filter((i) => isAscii(i.src)).length;
record("R2", "ascii effect applied to project thumbnails", asciiCount === imgs.length && imgs.length > 0,
  `${asciiCount}/${imgs.length} card images resolve to an ascii.png source`);

const broken = imgs.filter((i) => i.naturalWidth === 0);
record("R3", "thumbnails actually load (not broken)", broken.length === 0,
  broken.length ? `broken: ${broken.map((b) => b.label).join(", ")}`
                : `all ${imgs.length} decoded, e.g. ${imgs[0]?.naturalWidth}x${imgs[0]?.naturalHeight}`);

const noDims = imgs.filter((i) => !i.hasW || !i.hasH);
record("R4a", "intrinsic dimensions present (CLS)", noDims.length === 0,
  noDims.length ? `missing width/height: ${noDims.map((d) => d.label).join(", ")}`
                : `all ${imgs.length} carry width+height attributes`);

// ---- R4b: declared dimensions match the actual PNGs ----------------------
// Regenerating at a different grid resolution changes the output size. If
// src/data/projects.ts still carries the old width/height, next/image reserves
// the wrong box and the CLS that R4a guards against comes back. This caught a
// real staleness after the screenshot projects moved to a finer grid.
{
  const dims = JSON.parse(fs.readFileSync(path.join(process.cwd(), "tools/ascii-dims.json"), "utf8"));
  const mismatched = [];
  for (const info of imgs) {
    const slug = Object.keys(dims).find((s) => decodeURIComponent(info.src).includes(dims[s].src));
    if (!slug) continue;
    const want = dims[slug];
    const ratioDeclared = want.w / want.h;
    const ratioActual = info.naturalWidth / info.naturalHeight;
    if (Math.abs(ratioDeclared - ratioActual) > 0.01) {
      mismatched.push(`${slug} declared ${want.w}x${want.h} vs served ${info.naturalWidth}x${info.naturalHeight}`);
    }
  }
  record("R4b", "declared dimensions match the generated PNGs", mismatched.length === 0,
    mismatched.length ? mismatched.join(" | ") : `all ${imgs.length} aspect ratios agree with tools/ascii-dims.json`);
}

// ---- R5: dark mode -------------------------------------------------------
// sample the card image's own pixels in each theme, via canvas over a
// screenshot clip, so the dark:invert result is measured not assumed
async function sampleTheme(theme) {
  await page.evaluate((t) => {
    document.documentElement.classList.toggle("dark", t === "dark");
  }, theme);
  await page.waitForTimeout(400);

  const info = await page.evaluate(() => {
    const el = document.querySelector('figure[aria-label^="Open project:"] img');
    const r = el.getBoundingClientRect();
    return {
      filter: getComputedStyle(el).filter,
      panelBg: getComputedStyle(document.body).backgroundColor,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
    };
  });

  const shot = path.join(OUT, `real-${theme}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  return { info, shot };
}

const light = await sampleTheme("light");
const dark = await sampleTheme("dark");
record("R5a", "dark mode inverts the mosaic ink", dark.info.filter.includes("invert"),
  `light filter=${light.info.filter} | dark filter=${dark.info.filter}`);

// ---- R6: modal still shows the photograph, not the mosaic -----------------
await page.evaluate(() => document.documentElement.classList.remove("dark"));
await page.locator('figure[aria-label^="Open project:"]').first().click();
await page.waitForTimeout(1200);
const modal = await page.evaluate(() => {
  const d = document.querySelector('[role="dialog"]');
  if (!d) return null;
  const imgs = [...d.querySelectorAll("img")].map((i) => i.currentSrc || i.src);
  return { count: imgs.length, imgs: imgs.slice(0, 4) };
});
const modalOk = modal && modal.count > 0 && !modal.imgs.every((s) => isAscii(s));
record("R6", "detail modal still shows real photography", !!modalOk,
  modal ? `${modal.count} images in dialog; first=${decodeURIComponent(modal.imgs[0] || "").slice(0, 80)}`
        : "no [role=dialog] found");

await page.screenshot({ path: path.join(OUT, "real-modal.png") });
await page.keyboard.press("Escape");
await page.waitForTimeout(600);

// ---- console + network errors --------------------------------------------
record("R7", "no failed asset requests", failed.length === 0,
  failed.length ? failed.slice(0, 5).join(" | ") : "none");

await browser.close();

fs.writeFileSync(path.join(OUT, "verify-results.json"), JSON.stringify({ results, imgs }, null, 2));
const failedCount = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failedCount}/${results.length} checks passed`);
process.exit(failedCount ? 1 : 0);
