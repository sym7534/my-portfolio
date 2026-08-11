"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { DitherHand } from "@/components/DitherHand";
import { quietLink } from "@/lib/styles";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Halftone masthead — waving robot. Client component: tracks whether the
 * visitor has "messed with" the dither field and offers a reset.
 */
export function Masthead() {
  const [handGen, setHandGen] = useState(0);
  const [messed, setMessed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3, ease }}
      className="relative mb-10 h-[clamp(285px,39vh,420px)]"
    >
      <DitherHand
        key={handGen}
        src="/robot-wave.png"
        className="h-full w-full"
        onFirstSplit={() => setMessed(true)}
      />
      <span
        className={cn(
          "absolute bottom-0 right-0 font-serif text-xs transition-opacity duration-700",
          messed ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <button
          type="button"
          onClick={() => {
            setHandGen((g) => g + 1);
            setMessed(false);
          }}
          className={quietLink}
        >
          start over
        </button>
      </span>
    </motion.div>
  );
}
