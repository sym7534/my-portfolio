"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface DitherHandProps {
  src: string;
  className?: string;
  /** initial dots across (and down) the image */
  grid?: number;
  /** fires once, on the first user-caused split */
  onFirstSplit?: () => void;
}

/** A leaf cell of the reveal quadtree, in display coordinates. */
interface Leaf {
  x: number; // cell top-left
  y: number;
  w: number; // cell size
  h: number;
  dark: number; // average darkness 0..1 of the region beneath
  born: number; // timestamp for the split-in animation
  px: number; // parent dot center (animation start)
  py: number;
}

const MIN_CELL = 6; // px — stop subdividing below this
const SPLIT = 2; // each dot splits into SPLIT x SPLIT finer dots
const POP_MS = 240;

/**
 * Subdivide-to-reveal dot grid (a from-scratch take on the classic
 * quadtree-reveal mechanic): the image starts as a coarse grid of
 * uniform, evenly spaced circles whose COLOR is the average of the
 * region beneath; sweeping the cursor splits a dot into finer dots,
 * progressively resolving the picture. Colors interpolate between the
 * panel paper and the ink color, so both themes read correctly.
 * Touch devices and reduced-motion get the fully resolved grid.
 */
export function DitherHand({ src, className, grid = 5, onFirstSplit }: DitherHandProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firstSplitRef = useRef(onFirstSplit);
  const firedRef = useRef(false);

  useEffect(() => {
    firstSplitRef.current = onFirstSplit;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const interactive = finePointer && !reduced;

    let leaves: Leaf[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let animating = false;

    // Luminance summed-area table over the sampled image, for O(1)
    // region averages during splits.
    let sat: Float64Array | null = null;
    let sw = 0;
    let sh = 0;
    // display-space rect the image occupies (contain fit)
    let fit = { x: 0, y: 0, w: 0, h: 0 };

    const img = new Image();
    img.src = src;

    /** square crop (source px) around the image's non-paper content, so the
     * subject fills the dot field instead of floating in white margins */
    const findContentCrop = () => {
      const PW = 160;
      const ph = Math.max(
        1,
        Math.round((PW * img.naturalHeight) / img.naturalWidth)
      );
      const probe = document.createElement("canvas");
      probe.width = PW;
      probe.height = ph;
      const pctx = probe.getContext("2d");
      if (!pctx) return null;
      pctx.drawImage(img, 0, 0, PW, ph);
      const d = pctx.getImageData(0, 0, PW, ph).data;
      let minX = PW;
      let minY = ph;
      let maxX = -1;
      let maxY = -1;
      for (let y = 0; y < ph; y++) {
        for (let x = 0; x < PW; x++) {
          const i = (y * PW + x) * 4;
          const a = d[i + 3] / 255;
          const lum =
            (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
          if ((1 - lum) * a > 0.08) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < 0) return null;
      const rx = img.naturalWidth / PW;
      const ry = img.naturalHeight / ph;
      const bx = minX * rx;
      const by = minY * ry;
      const bw = (maxX - minX + 1) * rx;
      const bh = (maxY - minY + 1) * ry;
      let side = Math.max(bw, bh) * 1.08;
      side = Math.min(side, img.naturalWidth, img.naturalHeight);
      const x = Math.max(
        0,
        Math.min(img.naturalWidth - side, bx + bw / 2 - side / 2)
      );
      const y = Math.max(
        0,
        Math.min(img.naturalHeight - side, by + bh / 2 - side / 2)
      );
      return { x, y, side };
    };

    const buildSat = () => {
      // sample into a SQUARE canvas so grid cells stay square and dot
      // spacing stays even everywhere; crop to content when possible
      const SIDE = 480;
      sw = SIDE;
      sh = SIDE;
      const off = document.createElement("canvas");
      off.width = sw;
      off.height = sh;
      const octx = off.getContext("2d");
      if (!octx) return;
      const crop = findContentCrop();
      if (crop) {
        octx.drawImage(img, crop.x, crop.y, crop.side, crop.side, 0, 0, SIDE, SIDE);
      } else {
        const s = Math.min(SIDE / img.naturalWidth, SIDE / img.naturalHeight);
        const dw = img.naturalWidth * s;
        const dh = img.naturalHeight * s;
        octx.drawImage(img, (SIDE - dw) / 2, (SIDE - dh) / 2, dw, dh);
      }
      const data = octx.getImageData(0, 0, sw, sh).data;
      sat = new Float64Array((sw + 1) * (sh + 1));
      for (let y = 1; y <= sh; y++) {
        let rowSum = 0;
        for (let x = 1; x <= sw; x++) {
          const i = ((y - 1) * sw + (x - 1)) * 4;
          const a = data[i + 3] / 255;
          const lum =
            (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) /
            255;
          // treat transparency as paper (white), then stretch contrast —
          // the CAD render is pale silver and needs the ink pushed
          const raw = (1 - lum) * a;
          const dark = Math.min(1, Math.max(0, (raw - 0.05) * 1.75));
          rowSum += dark;
          sat[y * (sw + 1) + x] = sat[(y - 1) * (sw + 1) + x] + rowSum;
        }
      }
    };

    /** average darkness of a display-space rect, via the SAT */
    const regionDark = (x: number, y: number, w: number, h: number) => {
      if (!sat) return 0;
      const x0 = Math.max(0, Math.min(sw, Math.round(((x - fit.x) / fit.w) * sw)));
      const x1 = Math.max(0, Math.min(sw, Math.round(((x + w - fit.x) / fit.w) * sw)));
      const y0 = Math.max(0, Math.min(sh, Math.round(((y - fit.y) / fit.h) * sh)));
      const y1 = Math.max(0, Math.min(sh, Math.round(((y + h - fit.y) / fit.h) * sh)));
      const area = (x1 - x0) * (y1 - y0);
      if (area <= 0) return 0;
      const S = (xx: number, yy: number) => sat![yy * (sw + 1) + xx];
      return (S(x1, y1) - S(x0, y1) - S(x1, y0) + S(x0, y0)) / area;
    };

    const makeLeaf = (
      x: number,
      y: number,
      w: number,
      h: number,
      px: number,
      py: number,
      born: number
    ): Leaf => ({ x, y, w, h, dark: regionDark(x, y, w, h), born, px, py });

    const build = () => {
      if (!img.naturalWidth) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      buildSat();

      // the dot field is a centered SQUARE (matching the square sample)
      const side = Math.min(width, height);
      fit = { x: (width - side) / 2, y: (height - side) / 2, w: side, h: side };

      leaves = [];
      const cw = fit.w / grid;
      const ch = fit.h / grid;
      for (let gy = 0; gy < grid; gy++) {
        for (let gx = 0; gx < grid; gx++) {
          const x = fit.x + gx * cw;
          const y = fit.y + gy * ch;
          leaves.push(makeLeaf(x, y, cw, ch, x + cw / 2, y + ch / 2, -POP_MS));
        }
      }

      if (!interactive) resolveAll();
    };

    const splitLeaf = (index: number, now: number): boolean => {
      const l = leaves[index];
      if (Math.min(l.w, l.h) / SPLIT < MIN_CELL) return false;
      const cx = l.x + l.w / 2;
      const cy = l.y + l.h / 2;
      const w2 = l.w / SPLIT;
      const h2 = l.h / SPLIT;
      let first = true;
      for (let gy = 0; gy < SPLIT; gy++) {
        for (let gx = 0; gx < SPLIT; gx++) {
          const kid = makeLeaf(l.x + gx * w2, l.y + gy * h2, w2, h2, cx, cy, now);
          if (first) {
            leaves[index] = kid;
            first = false;
          } else {
            leaves.push(kid);
          }
        }
      }
      return true;
    };

    const resolveAll = () => {
      let i = 0;
      while (i < leaves.length) {
        if (!splitLeaf(i, -POP_MS)) i++;
      }
    };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // Dots are uniform circles per level; the image lives in their COLOR,
    // interpolated between the panel paper and the ink color so both
    // themes read correctly (paper-colored dots vanish into the panel).
    const parseColor = (str: string): [number, number, number] | null => {
      ctx.fillStyle = "#000000";
      ctx.fillStyle = str;
      const s = String(ctx.fillStyle);
      if (s.startsWith("#")) {
        return [
          parseInt(s.slice(1, 3), 16),
          parseInt(s.slice(3, 5), 16),
          parseInt(s.slice(5, 7), 16),
        ];
      }
      const m = s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
      return m ? [+m[1], +m[2], +m[3]] : null;
    };

    const buildPalette = (): string[] => {
      const ink = parseColor(getComputedStyle(canvas).color) ?? [23, 23, 23];
      const paper =
        parseColor(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--color-bg-light")
            .trim() || "#fafafa"
        ) ?? [250, 250, 250];
      const steps = 32;
      return Array.from({ length: steps + 1 }, (_, i) => {
        const t = i / steps;
        const c = paper.map((p, ch) => Math.round(p + (ink[ch] - p) * t));
        return `rgb(${c[0]},${c[1]},${c[2]})`;
      });
    };

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const palette = buildPalette();
      animating = false;
      for (const l of leaves) {
        const shade = Math.round(Math.min(1, Math.max(0, l.dark)) * 32);
        if (shade === 0) continue; // paper on paper — invisible
        const r = Math.min(l.w, l.h) / 2;
        let t = (now - l.born) / POP_MS;
        let cx = l.x + l.w / 2;
        let cy = l.y + l.h / 2;
        let rr = r;
        if (t < 1) {
          animating = true;
          t = easeOutCubic(Math.max(0, t));
          cx = l.px + (cx - l.px) * t;
          cy = l.py + (cy - l.py) * t;
          rr = r * (0.4 + 0.6 * t);
        }
        ctx.fillStyle = palette[shade];
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (now: number) => {
      draw(now);
      raf = animating ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const now = performance.now();
      let didSplit = false;
      // pad the hit area a little so sweeping feels generous
      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        const pad = Math.min(l.w, l.h) * 0.2;
        if (
          mx >= l.x - pad &&
          mx <= l.x + l.w + pad &&
          my >= l.y - pad &&
          my <= l.y + l.h + pad
        ) {
          if (splitLeaf(i, now)) didSplit = true;
        }
      }
      if (didSplit) {
        if (!firedRef.current) {
          firedRef.current = true;
          firstSplitRef.current?.();
        }
        kick();
      }
    };

    img.onload = () => {
      build();
      draw(performance.now());
      if (interactive) canvas.addEventListener("pointermove", onMove);
    };

    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(canvas);

    // recolor when the theme class flips
    const mo = new MutationObserver(() => draw(performance.now()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("pointermove", onMove);
    };
  }, [src, grid]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("text-text-primary", className)}
    />
  );
}
