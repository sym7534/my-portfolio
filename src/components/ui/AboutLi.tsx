"use client";

import { useEffect, useRef, useState } from "react";

const ABOUT_ENTER_DURATION = 500;

/**
 * About-list item with the animated diamond bullet: hovering rotates the
 * bullet and nudges the text; a minimum "dwell" keeps the motion from
 * flickering on fast passes.
 */
export function AboutLi({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const enterTimeRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleEnter = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    enterTimeRef.current = Date.now();
    setIsActive(true);
  };

  const handleLeave = () => {
    const elapsed = Date.now() - enterTimeRef.current;
    const remaining = Math.max(0, ABOUT_ENTER_DURATION - elapsed);
    timeoutRef.current = window.setTimeout(() => {
      setIsActive(false);
      timeoutRef.current = null;
    }, remaining);
  };

  return (
    <li
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative flex items-start gap-4 pl-4 transition-transform after:content-[''] after:absolute after:-inset-y-1 after:left-full after:w-5 lg:after:w-12 ${
        isActive ? "translate-x-3 duration-300" : "duration-500"
      }`}
    >
      <div
        className={`absolute left-0 top-[8px] w-[6px] h-[6px] transform transition-all ${
          isActive
            ? "rotate-90 scale-110 bg-text-primary duration-500"
            : "rotate-45 bg-text-secondary duration-500"
        }`}
      />
      {children}
    </li>
  );
}
