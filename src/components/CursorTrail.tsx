"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle motion-blur trail for the mouse cursor. The native OS pointer is
 * left untouched — a soft, velocity-stretched smear is drawn behind it,
 * visible only while the pointer is moving.
 */
export function CursorTrail() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = -100;
    let ty = -100;
    let x = tx;
    let y = ty;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        x = tx;
        y = ty;
        visible = true;
      }
    };
    const onLeave = () => {
      visible = false;
    };

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (dt > 0) {
        const px = x;
        const py = y;
        // Exponential lerp toward the pointer — the lag is what creates the trail
        const k = 1 - Math.exp(-18 * dt);
        x += (tx - x) * k;
        y += (ty - y) * k;
        const vx = (x - px) / dt;
        const vy = (y - py) / dt;
        const speed = Math.hypot(vx, vy);
        const angle = Math.atan2(vy, vx);
        const stretch = Math.min(1 + speed / 900, 3.2);
        const squash = Math.max(1 - speed / 4000, 0.55);
        const opacity = visible ? Math.min(speed / 2500, 0.3) : 0;
        el.style.opacity = String(opacity);
        el.style.transform = `translate(${x - 6}px, ${y - 6}px) rotate(${angle}rad) scaleX(${stretch}) scaleY(${squash})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9999] w-3 h-3 rounded-full bg-text-secondary pointer-events-none blur-[5px] opacity-0"
    />
  );
}
