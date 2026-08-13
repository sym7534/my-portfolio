/**
 * ascii-cells.mjs — static ASCII/geometric cell mosaic renderer.
 *
 * A port of ascii-graphics/js/cellrenderer.js from a live Three.js frame
 * sampler to a still-image pipeline: instead of reading back a WebGL render
 * target each frame, it samples one image into a low-res RGBA grid and draws
 * each covered pixel as a glyph or pattern chip.
 *
 * Differences from the original, all driven by the portfolio's aesthetic
 * (book-serif minimalism, ink on paper, no chrome) and by what actually
 * survives at thumbnail size:
 *
 *   - Monochrome ink ramp instead of the 9-color Bauhaus palette.
 *   - Marks are ordered by INK COVERAGE and selected monotonically from tone.
 *     The original picks a glyph from a hash *within* a luminance band, which
 *     is fine at full-screen with color and motion carrying the read, but at
 *     ~600px it destroys the tonal gradient and the subject dissolves into
 *     noise. Here darkness of the mark tracks darkness of the source.
 *   - Alpha coverage gates cells, so isolated subjects float on paper.
 *   - No trails / explode / formation (static output).
 */

// Glyphs ordered by approximate inked area, lightest first. This ordering is
// the whole trick: index = tone, so the mosaic reproduces a tonal image.
const GLYPH_RAMP = [".", ":", "-", "I", "1", "L", "T", "V", "X", "F", "E", "H", "W", "0", "Ø"];

// Pattern chips, also ordered lightest -> heaviest by fill fraction.
// (indices into drawShape)
const SHAPE_RAMP = [0, 1, 2, 5, 3, 4, 6, 7, 8, 9, 10];

export function hash2(col, row, seed = 0) {
  let h = (col * 73856093) ^ (row * 19349663) ^ (seed * 83492791);
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 1274126177) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function hexToRgb(hex) {
  let s = String(hex || "#000000").trim();
  if (s[0] === "#") s = s.slice(1);
  if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixRgb(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

const rgbStr = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

/**
 * Sample an image into a `cols`-wide RGBA grid, contain-fit and centered.
 * Returns { data, cols, rows } like engine.sample() did.
 */
export function sampleImage(createCanvas, img, cols, aspect, opts = {}) {
  const { trimBox = null, pad = 1.0, crop = null } = opts;
  const rows = Math.max(1, Math.round(cols / aspect));
  const c = createCanvas(cols, rows);
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, cols, rows);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  let sx = 0, sy = 0, sw = img.width, sh = img.height;
  // fractional crop {x,y,w,h} in 0..1, applied before any trim
  if (crop) {
    sx = crop.x * img.width;
    sy = crop.y * img.height;
    sw = crop.w * img.width;
    sh = crop.h * img.height;
  }
  if (trimBox) {
    sx = trimBox.x;
    sy = trimBox.y;
    sw = trimBox.w;
    sh = trimBox.h;
  }

  const s = Math.min((cols * pad) / sw, (rows * pad) / sh);
  const dw = sw * s;
  const dh = sh * s;
  ctx.drawImage(img, sx, sy, sw, sh, (cols - dw) / 2, (rows - dh) / 2, dw, dh);

  return { data: ctx.getImageData(0, 0, cols, rows).data, cols, rows };
}

/**
 * Compute the per-cell tone field (0 = paper, 1 = full ink) plus coverage.
 * Separated from drawing so tone can be normalized across the whole image
 * before any mark is chosen — a photo that only spans 0.3..0.6 luminance
 * would otherwise render as flat mid-gray mush.
 */
export function buildToneField(sample, cfg) {
  const {
    gamma = 1.0,
    invert = false,
    alphaCut = 0.35,
    autoLevels = true,
    levelsLow = 0.02,
    levelsHigh = 0.98,
    contrast = 1.0,
  } = cfg;
  const { data, cols, rows } = sample;
  const n = cols * rows;
  const tone = new Float32Array(n);
  const cover = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    const p = i * 4;
    const a = data[p + 3] / 255;
    if (a < alphaCut) continue;
    cover[i] = 1;
    const lum =
      (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
    tone[i] = clamp01(invert ? lum : 1 - lum);
  }

  if (autoLevels) {
    // percentile stretch over covered cells only
    const vals = [];
    for (let i = 0; i < n; i++) if (cover[i]) vals.push(tone[i]);
    if (vals.length > 8) {
      vals.sort((a, b) => a - b);
      const lo = vals[Math.floor(vals.length * levelsLow)];
      const hi = vals[Math.min(vals.length - 1, Math.floor(vals.length * levelsHigh))];
      const span = hi - lo;
      if (span > 0.02) {
        for (let i = 0; i < n; i++) {
          if (cover[i]) tone[i] = clamp01((tone[i] - lo) / span);
        }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (!cover[i]) continue;
    let t = tone[i];
    if (contrast !== 1.0) t = clamp01((t - 0.5) * contrast + 0.5);
    tone[i] = clamp01(Math.pow(t, 1 / (gamma > 0.01 ? gamma : 0.01)));
  }

  return { tone, cover, cols, rows };
}

/**
 * Suppress flat regions and emphasise structure.
 *
 * Screenshots are mostly large areas of near-constant tone (page chrome, a
 * map's paper fill, an empty 3D viewport). Pure tone mapping renders those as
 * a uniform lattice of identical marks, which reads as noise rather than as
 * an image. Weighting each cell by its LOCAL deviation from a blurred copy
 * (an unsharp mask) keeps edges, text and object boundaries while letting
 * flat fills fall below the ink floor and drop out to paper.
 *
 * `detail` = 0 leaves tone untouched (right for isolated photo subjects,
 * where the silhouette already does this job).
 */
export function applyDetailWeighting(field, detail, radius = 2) {
  if (!detail) return field;
  const { tone, cover, cols, rows } = field;
  const n = cols * rows;
  const blur = new Float32Array(n);

  // separable box blur over covered cells
  const tmp = new Float32Array(n);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let s = 0, c = 0;
      for (let d = -radius; d <= radius; d++) {
        const xx = x + d;
        if (xx < 0 || xx >= cols) continue;
        const i = y * cols + xx;
        if (!cover[i]) continue;
        s += tone[i];
        c++;
      }
      tmp[y * cols + x] = c ? s / c : 0;
    }
  }
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let s = 0, c = 0;
      for (let d = -radius; d <= radius; d++) {
        const yy = y + d;
        if (yy < 0 || yy >= rows) continue;
        const i = yy * cols + x;
        if (!cover[i]) continue;
        s += tmp[i];
        c++;
      }
      blur[y * cols + x] = c ? s / c : 0;
    }
  }

  // local deviation, normalized against its own peak so `detail` means the
  // same thing regardless of how contrasty the source happens to be
  let peak = 0;
  const dev = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    if (!cover[i]) continue;
    const d = Math.abs(tone[i] - blur[i]);
    dev[i] = d;
    if (d > peak) peak = d;
  }
  if (peak <= 1e-6) return field;

  for (let i = 0; i < n; i++) {
    if (!cover[i]) continue;
    const local = dev[i] / peak; // 0 = flat, 1 = strongest edge in frame
    // blend between plain tone and tone gated by local structure
    tone[i] = clamp01(tone[i] * (1 - detail) + tone[i] * local * detail * 2.2);
  }
  return field;
}

/**
 * Choose `floorTone` so that a target fraction of covered cells actually get
 * a mark. This is auto-exposure for the mosaic: a washed-out UI screenshot
 * and a high-contrast product photo otherwise need wildly different hand-set
 * floors, and picking one by hand per image does not generalize. With this,
 * `targetDensity` ("how much of the frame is ink") is the knob, and it means
 * the same thing for every source.
 */
export function autoFloor(field, targetDensity) {
  const { tone, cover } = field;
  const vals = [];
  for (let i = 0; i < cover.length; i++) if (cover[i]) vals.push(tone[i]);
  if (vals.length < 8) return 0;
  vals.sort((a, b) => a - b);
  // keep the darkest `targetDensity` share of covered cells
  const idx = Math.floor((1 - targetDensity) * (vals.length - 1));
  return vals[Math.max(0, Math.min(vals.length - 1, idx))];
}

/** Draw the cell mosaic from a tone field. */
export function renderCells(ctx, field, cfg) {
  const {
    cellW = 7,
    spacing = 0,
    mode = "MIXED",
    cellOutline = false,
    chipAmount = 0.0,
    ink = "#171717",
    paper = "#ffffff",
    inkFloor = 0.18,
    inkCeil = 1.0,
    floorTone = 0.06,
    seed = 0,
    outlineAlpha = 0.25,
    glyphScale = 0.92,
    bold = false,
    originX = 0,
    originY = 0,
    jitter = 0,
  } = cfg;

  const { tone, cover, cols, rows } = field;
  const inkRgb = hexToRgb(ink);
  const paperRgb = hexToRgb(paper);

  const SHADES = 32;
  const ramp = new Array(SHADES);
  for (let i = 0; i < SHADES; i++) {
    const t = inkFloor + (inkCeil - inkFloor) * (i / (SHADES - 1));
    ramp[i] = rgbStr(mixRgb(paperRgb, inkRgb, t));
  }

  const step = cellW + spacing;
  const chipCut = Math.round(clamp01(chipAmount) * 15);
  const FONT = "'Arial Narrow', 'Helvetica Neue', Helvetica, Arial, sans-serif";
  const glyphPx = Math.max(3, cellW * glyphScale);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `${bold ? "bold " : ""}${glyphPx}px ${FONT}`;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      if (!cover[i]) continue;
      const t = tone[i];
      if (t < floorTone) continue; // paper stays paper

      const hh = hash2(col, row, seed);
      let x = originX + col * step;
      let y = originY + row * step;
      if (jitter) {
        x += (((hh & 255) / 255) - 0.5) * jitter;
        y += ((((hh >>> 8) & 255) / 255) - 0.5) * jitter;
      }

      let shade = Math.round(t * (SHADES - 1));
      if (shade < 0) shade = 0;
      else if (shade >= SHADES) shade = SHADES - 1;
      const rampColor = ramp[shade];

      const styleBucket = (hh >>> 5) & 15;
      const chip = chipCut > 0 && styleBucket >= 1 && styleBucket <= chipCut;

      let asGlyph;
      if (mode === "TEXT") asGlyph = true;
      else if (mode === "SHAPES") asGlyph = false;
      else asGlyph = ((hh >>> 3) & 1) === 0;

      if (chip) {
        // solid ink tile, mark knocked out in paper
        ctx.fillStyle = rampColor;
        ctx.fillRect(x, y, cellW, cellW);
        ctx.fillStyle = paper;
      } else {
        ctx.fillStyle = rampColor;
      }

      if (asGlyph) {
        // monotonic: darker tone -> heavier glyph
        let gi = Math.round(t * (GLYPH_RAMP.length - 1));
        if (gi < 0) gi = 0;
        else if (gi >= GLYPH_RAMP.length) gi = GLYPH_RAMP.length - 1;
        ctx.fillText(GLYPH_RAMP[gi], x + cellW * 0.5, y + cellW * 0.5);
      } else {
        let si = Math.round(t * (SHAPE_RAMP.length - 1));
        if (si < 0) si = 0;
        else if (si >= SHAPE_RAMP.length) si = SHAPE_RAMP.length - 1;
        drawShape(ctx, SHAPE_RAMP[si], x, y, cellW);
      }

      if (cellOutline) {
        ctx.save();
        ctx.globalAlpha = outlineAlpha;
        ctx.strokeStyle = ramp[Math.max(0, shade - 10)];
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, cellW - 1, cellW - 1);
        ctx.restore();
      }
    }
  }
}

function drawShape(ctx, b, x, y, s) {
  const h = s * 0.5;
  switch (b) {
    case 0: {
      const d = Math.max(0.7, s * 0.16);
      ctx.fillRect(x + (s - d) * 0.5, y + (s - d) * 0.5, d, d);
      break;
    }
    case 1: {
      const d = Math.max(0.7, s * 0.32);
      ctx.fillRect(x + (s - d) * 0.5, y + (s - d) * 0.5, d, d);
      break;
    }
    case 2: {
      const q = s / 4;
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
          if (((i + j) & 1) === 0) ctx.fillRect(x + i * q, y + j * q, q, q);
      break;
    }
    case 3: {
      const q = s / 5;
      for (let j = 0; j < 5; j += 2) ctx.fillRect(x, y + j * q, s, q);
      break;
    }
    case 4: {
      const q = s / 5;
      for (let i = 0; i < 5; i += 2) ctx.fillRect(x + i * q, y, q, s);
      break;
    }
    case 5:
      ctx.fillRect(x, y, h, h);
      ctx.fillRect(x + h, y + h, h, h);
      break;
    case 6:
      tri(ctx, x, y, x + s, y, x + h, y + s);
      break;
    case 7:
      tri(ctx, x + h, y, x + s, y + s, x, y + s);
      break;
    case 8:
      tri(ctx, x, y, x + s, y, x, y + s);
      break;
    case 9:
      tri(ctx, x + s, y, x + s, y + s, x, y + s);
      break;
    default:
      ctx.fillRect(x, y, s, s);
  }
}

function tri(ctx, x1, y1, x2, y2, x3, y3) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}
