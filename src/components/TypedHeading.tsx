"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TYPED_PREFIX, TYPED_NAME, TYPED_SMILEY } from "@/data/site";

const TYPED_PAUSE = 1100;
const SMILEY_WAIT = 5000;
const SMILEY_PAUSE = 1600;
const START_DELAY = 750;

type TypingPhase =
  | "idle"
  | "typing"
  | "deleting"
  | "smiley-wait"
  | "smiley-typing"
  | "smiley-deleting"
  | "done";

/** Human-ish keystroke delay: mostly steady, with occasional hesitation. */
function typeDelay() {
  return Math.random() < 0.12
    ? 260 + Math.random() * 180 // brief hesitation
    : 95 + Math.random() * 80; // normal keystroke
}

/** Backspace rhythm: quick bursts broken up by pauses (delete... delete delete delete). */
function deleteDelay() {
  return Math.random() < 0.28
    ? 320 + Math.random() * 260 // pause between bursts
    : 75 + Math.random() * 55; // rapid presses within a burst
}

interface TypedHeadingProps {
  /** Classes for the h1. Defaults to the original hero styling. */
  className?: string;
  /** Classes for the name span. Defaults to the original text-text-primary. */
  nameClassName?: string;
  /** Rendered inside the heading, after the name, once the backspacing has settled. */
  nameSuffix?: React.ReactNode;
  /** Called once when the name settles (backspacing finished, or immediately under reduced motion). */
  onNameSettled?: () => void;
}

/**
 * Hero heading that types out "hey, i'm Ryan Wang", pauses, then
 * backspaces the "hey, i'm " part so only the name remains.
 */
export function TypedHeading({
  className,
  nameClassName,
  nameSuffix,
  onNameSettled,
}: TypedHeadingProps = {}) {
  const [prefixCount, setPrefixCount] = useState(0);
  const [nameCount, setNameCount] = useState(0);
  const [smileyCount, setSmileyCount] = useState(0);
  const [phase, setPhase] = useState<TypingPhase>("idle");

  const typedAll =
    prefixCount === TYPED_PREFIX.length && nameCount === TYPED_NAME.length;

  /** True the moment the backspacing finishes (and through the smiley easter egg). */
  const nameSettled =
    phase === "smiley-wait" ||
    phase === "smiley-typing" ||
    phase === "smiley-deleting" ||
    phase === "done";

  const settledCallbackFired = useRef(false);
  useEffect(() => {
    if (nameSettled && !settledCallbackFired.current) {
      settledCallbackFired.current = true;
      onNameSettled?.();
    }
  }, [nameSettled, onNameSettled]);

  useEffect(() => {
    if (phase === "done") return;

    // Reduced motion: skip straight to the final state
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => {
        setPrefixCount(0);
        setNameCount(TYPED_NAME.length);
        setSmileyCount(0);
        setPhase("done");
      }, 0);
      return () => window.clearTimeout(id);
    }

    let id: number;
    if (phase === "idle") {
      id = window.setTimeout(() => setPhase("typing"), START_DELAY);
    } else if (phase === "typing") {
      if (prefixCount < TYPED_PREFIX.length) {
        id = window.setTimeout(() => setPrefixCount((c) => c + 1), typeDelay());
      } else if (nameCount < TYPED_NAME.length) {
        id = window.setTimeout(() => setNameCount((c) => c + 1), typeDelay());
      } else {
        id = window.setTimeout(() => setPhase("deleting"), TYPED_PAUSE);
      }
    } else if (phase === "deleting") {
      if (prefixCount > 0) {
        id = window.setTimeout(() => setPrefixCount((c) => c - 1), deleteDelay());
      } else {
        id = window.setTimeout(() => setPhase("smiley-wait"), 0);
      }
    } else if (phase === "smiley-wait") {
      id = window.setTimeout(() => setPhase("smiley-typing"), SMILEY_WAIT);
    } else if (phase === "smiley-typing") {
      if (smileyCount < TYPED_SMILEY.length) {
        id = window.setTimeout(() => setSmileyCount((c) => c + 1), typeDelay());
      } else {
        id = window.setTimeout(() => setPhase("smiley-deleting"), SMILEY_PAUSE);
      }
    } else {
      if (smileyCount > 0) {
        id = window.setTimeout(() => setSmileyCount((c) => c - 1), deleteDelay());
      } else {
        id = window.setTimeout(() => setPhase("done"), 600);
      }
    }
    return () => window.clearTimeout(id);
  }, [phase, prefixCount, nameCount, smileyCount]);

  const blinking =
    phase === "idle" ||
    (phase === "typing" && typedAll) ||
    (phase === "smiley-typing" && smileyCount === TYPED_SMILEY.length);

  const cursor = (
    <span
      aria-hidden="true"
      className={`inline-block w-[3px] h-[0.7em] ml-[0.08em] bg-text-secondary ${
        blinking ? "animate-blink" : ""
      }`}
    />
  );

  return (
    <h1
      className={cn(
        "font-serif text-[clamp(2.75rem,2rem+2.5vw,3.75rem)] text-text-secondary leading-tight",
        className
      )}
    >
      <span className="sr-only">hey, i&apos;m Ryan Wang</span>
      <span aria-hidden="true">
        {TYPED_PREFIX.slice(0, prefixCount)}
        {phase === "deleting" && cursor}
        <span className={cn("text-text-primary", nameClassName)}>
          {TYPED_NAME.slice(0, nameCount)}
          {TYPED_SMILEY.slice(0, smileyCount)}
        </span>
        {phase !== "deleting" && phase !== "done" && phase !== "smiley-wait" && cursor}
        {nameSettled && nameSuffix}
      </span>
    </h1>
  );
}
