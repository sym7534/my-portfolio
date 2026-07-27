"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Dot {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  r: number;
}

interface DitherHandProps {
  src: string;
  className?: string;
  /** dots across the image width */
  grid?: number;
}

/**
 * Renders an image as a monochrome halftone dot field on canvas.
 * Dark pixels become larger dots (ink on paper). On fine pointers the dots
 * gently scatter away from the cursor and spring back home. Static under
 * reduced motion and on touch. Dot color follows the CSS `color` of the
 * canvas element, so it adapts to theme changes.
 */
export function DitherHand({ src, className, grid = 84 }: DitherHandProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    const pointer = { x: -9999, y: -9999 };

    const img = new Image();
    img.src = src;

    const build = () => {
      if (!img.naturalWidth) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const cols = grid;
      const rows = Math.max(
        1,
        Math.round(cols * (img.naturalHeight / img.naturalWidth))
      );
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, cols, rows);
      const data = octx.getImageData(0, 0, cols, rows).data;

      const scale = Math.min(width / cols, height / rows);
      const offsetX = (width - cols * scale) / 2;
      const offsetY = (height - rows * scale) / 2;

      dots = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          if (data[i + 3] < 40) continue;
          const lum =
            (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) /
            255;
          const darkness = 1 - lum;
          const r = Math.pow(darkness, 1.25) * scale * 0.5;
          if (r < scale * 0.07) continue;
          const px = offsetX + (x + 0.5) * scale;
          const py = offsetY + (y + 0.5) * scale;
          dots.push({ x: px, y: py, ox: px, oy: py, vx: 0, vy: 0, r });
        }
      }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(canvas).color;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      const RADIUS = 64;
      for (const d of dots) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < RADIUS * RADIUS && dist2 > 0.01) {
          const dist = Math.sqrt(dist2);
          const push = 1100 / Math.max(dist2, 60);
          d.vx += (dx / dist) * push;
          d.vy += (dy / dist) * push;
        }
        d.vx += (d.ox - d.x) * 0.06;
        d.vy += (d.oy - d.y) * 0.06;
        d.vx *= 0.86;
        d.vy *= 0.86;
        d.x += d.vx;
        d.y += d.vy;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    img.onload = () => {
      build();
      draw();
      if (!reduced && finePointer && !running) {
        running = true;
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerleave", onLeave);
        raf = requestAnimationFrame(tick);
      }
    };

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(canvas);

    // recolor when the theme class flips (static mode has no rAF to catch it)
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
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
