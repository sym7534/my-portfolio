"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/useMediaQuery";
import type { Project } from "@/types/project";

interface PlateProps {
  index: string;
  project: Project;
  onOpen: () => void;
  className?: string;
}

/**
 * A project as a mounted print: matte border, museum label underneath
 * (mono no. + serif italic title). On desktop fine-pointer devices the plate
 * is draggable — tethered to its mount, it strains against the pull and
 * springs home with momentum on release. Static on touch/mobile and under
 * reduced motion (drag would hijack touch scrolling via touch-action).
 */
export function Plate({ index, project, onOpen, className }: PlateProps) {
  const reduced = useReducedMotion();
  const canDrag =
    useMediaQuery("(min-width: 1024px) and (pointer: fine)") && !reduced;
  const [lifted, setLifted] = useState(false);
  const draggedRef = useRef(false);

  return (
    <motion.figure
      drag={canDrag}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.45}
      dragTransition={{ bounceStiffness: 320, bounceDamping: 24 }}
      whileDrag={{ scale: 1.03 }}
      onDragStart={() => {
        draggedRef.current = true;
        setLifted(true);
      }}
      onDragTransitionEnd={() => setLifted(false)}
      onClickCapture={(e) => {
        if (draggedRef.current) {
          e.stopPropagation();
          draggedRef.current = false;
        }
      }}
      onClick={onOpen}
      className={cn(
        "relative select-none border border-border-card bg-bg-white p-2.5 pb-2 rounded-[3px]",
        canDrag && "cursor-grab active:cursor-grabbing",
        lifted ? "z-30 shadow-xl shadow-black/10 dark:shadow-black/40" : "z-0 shadow-sm shadow-black/5",
        "transition-shadow duration-300",
        className
      )}
    >
      {project.imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.imageSrc}
          alt={project.altText ?? project.title}
          draggable={false}
          className="pointer-events-none w-full select-none rounded-[2px]"
        />
      ) : (
        /* text-only plate: a wall label without a print */
        <div className="flex min-h-20 items-center justify-center rounded-[2px] bg-bg-light px-4 py-8">
          <span className="font-serif text-lg italic text-text-secondary">
            {project.title}
          </span>
        </div>
      )}
      <figcaption className="flex items-baseline gap-2 pt-2">
        <span className="shrink-0 font-mono text-[10px] text-text-muted">
          no. {index}
        </span>
        <span className="truncate font-serif text-[15px] italic leading-snug text-text-primary">
          {project.title}
        </span>
        <span className="ml-auto hidden shrink-0 truncate pl-2 text-right font-sans text-[11px] font-light text-text-secondary lg:block max-w-[45%]">
          {project.caption}
        </span>
      </figcaption>
    </motion.figure>
  );
}
