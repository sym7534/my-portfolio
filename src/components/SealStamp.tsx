"use client";

import { motion, useReducedMotion } from "motion/react";
import { SealMark } from "./SealMark";
import { cn } from "@/lib/utils";

interface SealStampProps {
  size?: number;
  className?: string;
}

/**
 * The 王 seal, stamped: mounts scaled-up and slightly rotated, presses down
 * with a stiff spring (natural squash + settle), and leaves a brief ink-bleed
 * halo. Static under reduced motion. Re-mounting replays the stamp.
 */
export function SealStamp({ size = 36, className }: SealStampProps) {
  const reduced = useReducedMotion();

  return (
    <span
      className={cn("relative inline-block align-baseline", className)}
      style={{ width: size, height: size }}
    >
      {!reduced && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-seal)_35%,transparent),transparent_70%)]"
          initial={{ scale: 0.5, opacity: 0.6 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
        />
      )}
      <motion.span
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.4, rotate: -11, opacity: 0 }}
        animate={{ scale: 1, rotate: -4, opacity: 1 }}
        transition={{
          scale: { type: "spring", stiffness: 900, damping: 24, mass: 0.7 },
          rotate: { type: "spring", stiffness: 900, damping: 24, mass: 0.7 },
          opacity: { duration: 0.06 },
        }}
      >
        <SealMark size={size} variant="solid" />
      </motion.span>
    </span>
  );
}
