"use client";

import { useEffect, useState, type RefObject } from "react";

interface ScrollIndicatorProps {
  scrollRef: RefObject<HTMLDivElement | null>;
}

const RANGE_TOP = 15;
const RANGE_BOTTOM = 85;

export function ScrollIndicator({ scrollRef }: ScrollIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const max = scrollHeight - clientHeight;
      setVisible(max > 0);
      setProgress(max > 0 ? scrollTop / max : 0);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [scrollRef]);

  if (!visible) return null;

  const topVh = RANGE_TOP + progress * (RANGE_BOTTOM - RANGE_TOP);

  return (
    <div
      className="hidden lg:block fixed right-3 z-50 w-[3px] h-10 bg-text-secondary dark:bg-bg-white rounded-full -translate-y-1/2"
      style={{ top: `${topVh}vh` }}
    />
  );
}
