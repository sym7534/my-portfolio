"use client";

import { useEffect, type RefObject } from "react";
import Lenis from "lenis";

/**
 * Tuned feel — snappy, not drifty (duration lowered from Lenis's 1.2 default).
 * Exponential ease-out so each gesture starts punchy and lands softly; the
 * multipliers push each wheel notch / touch drag ~40% further before easing.
 */
const OPTIONS = {
  duration: 0.9,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  wheelMultiplier: 1.4,
  touchMultiplier: 1.4,
  smoothWheel: true,
};

const DESKTOP = "(min-width: 1024px)";

/**
 * Momentum smooth-scroll (Lenis) — render-nothing, mounted on the landing page
 * only (not the layout), so its RAF loop and wheel interception never run on
 * other routes or land in their bundles.
 *
 * This site's scroll container is responsive: on desktop the Container is
 * h-screen / overflow-hidden and the RIGHT PANEL scrolls internally, while on
 * mobile the window scrolls. So Lenis binds to whichever is live and re-binds
 * when the breakpoint flips. prefers-reduced-motion → plain native scrolling
 * (Lenis is never instantiated).
 */
export function LenisScroll({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: Lenis | null = null;
    let raf = 0;

    // one RAF loop drives the interpolation toward the target each frame
    const rafLoop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(rafLoop);
    };

    const start = () => {
      const el = scrollRef.current;
      const desktop = window.matchMedia(DESKTOP).matches;
      // desktop → smooth the internal right-panel scroller; mobile → the window
      lenis =
        desktop && el
          ? new Lenis({ wrapper: el, content: el, ...OPTIONS })
          : new Lenis({ ...OPTIONS });
      raf = requestAnimationFrame(rafLoop);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lenis?.destroy();
      lenis = null;
    };

    start();

    // the scroll container swaps at the lg breakpoint → rebind Lenis to it
    const mq = window.matchMedia(DESKTOP);
    const onBreakpoint = () => {
      stop();
      start();
    };
    mq.addEventListener("change", onBreakpoint);

    return () => {
      mq.removeEventListener("change", onBreakpoint);
      stop();
    };
  }, [scrollRef]);

  return null;
}
