/**
 * mock-card.mjs — simulate the real PhotoCard in both themes.
 *
 * The browser bridge needs a manual extension install, so this reproduces
 * what the card actually looks like on the page: panel background, hairline
 * border, 3px radius, serif title and italic caption, at the true card width.
 * Dark mode applies the same `invert` filter the component uses, so the
 * dark:invert class can be judged instead of assumed.
 *
 * Colors come from src/app/globals.css:
 *   light: --color-bg-light #f7f7f7, --color-bg-white #ffffff,
 *          --color-border-card #e5e5e5, --color-text-primary #171717
 *   dark:  --color-bg-light #151515, --color-bg-white #0f0f0f,
 *          --color-border-card #262626, --color-text-primary #ededed
 */
import { createCanvas, loadImage } from "./vendor/node_modules/@napi-rs/canvas/index.js";
import fs from "node:fs";
import path from "node:path";
import { THUMBS } from "./thumb-config.mjs";

const ROOT = process.cwd();
const SRC = process.argv[2] || "public/assets/projects";
const CARD_W = Number(process.argv[3] || 370);

const THEMES = {
  light: {
    panel: "#f7f7f7",
    cardBg: "#ffffff",
    border: "#e5e5e5",
    title: "#171717",
    caption: "#737373",
    invert: false,
  },
  dark: {
    panel: "#151515",
    cardBg: "#0f0f0f",
    border: "#262626",
    title: "#ededed",
    caption: "#8a8a8a",
    invert: true,
  },
};

/** Apply the CSS `invert()` filter: inverts RGB, preserves alpha. */
function invertInPlace(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 255 - d[i];
    d[i + 1] = 255 - d[i + 1];
    d[i + 2] = 255 - d[i + 2];
  }
  ctx.putImageData(img, 0, 0);
}

const items = [];
for (const t of THUMBS) {
  const p = path.join(ROOT, SRC, t.slug, "ascii.png");
  if (!fs.existsSync(p)) continue;
  const img = await loadImage(p);
  items.push({
    slug: t.slug,
    img,
    h: Math.round((CARD_W * img.height) / img.width),
    title: t.slug,
  });
}

const COLS = 3;
const GAP = 26;
const CAP_H = 46;

for (const [name, th] of Object.entries(THEMES)) {
  const rows = Math.ceil(items.length / COLS);
  const rowH = [];
  for (let r = 0; r < rows; r++)
    rowH.push(
      Math.max(...items.slice(r * COLS, r * COLS + COLS).map((i) => i.h)) + CAP_H + GAP
    );

  const W = COLS * CARD_W + (COLS + 1) * GAP;
  const H = rowH.reduce((a, b) => a + b, 0) + GAP;

  const c = createCanvas(W, H);
  const ctx = c.getContext("2d");
  ctx.fillStyle = th.panel;
  ctx.fillRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  let y = GAP;
  items.forEach((it, i) => {
    const r = Math.floor(i / COLS);
    const col = i % COLS;
    if (col === 0 && i > 0) y += rowH[r - 1];
    const x = GAP + col * (CARD_W + GAP);

    // card image box: bg-bg-white + hairline border, like PhotoCard
    ctx.fillStyle = th.cardBg;
    ctx.fillRect(x, y, CARD_W, it.h);

    if (th.invert) {
      // draw to a scratch canvas, invert, then composite — matches the
      // CSS filter applying to the <img> only, not the card chrome
      const s = createCanvas(CARD_W, it.h);
      const sctx = s.getContext("2d");
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(it.img, 0, 0, CARD_W, it.h);
      invertInPlace(sctx, CARD_W, it.h);
      ctx.drawImage(s, x, y);
    } else {
      ctx.drawImage(it.img, x, y, CARD_W, it.h);
    }

    ctx.strokeStyle = th.border;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, CARD_W - 1, it.h - 1);

    ctx.fillStyle = th.title;
    ctx.font = "16px Georgia, serif";
    ctx.textBaseline = "top";
    ctx.fillText(it.title, x, y + it.h + 8);
    ctx.fillStyle = th.caption;
    ctx.font = "italic 13px Georgia, serif";
    ctx.fillText("caption text", x, y + it.h + 28);
  });

  const dest = path.join(ROOT, "tools/preview", `card-${name}.png`);
  fs.writeFileSync(dest, c.toBuffer("image/png"));
  console.log(dest);
}
