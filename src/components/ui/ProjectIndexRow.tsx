"use client";

import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectIndexRowProps {
  index: string;
  project: Project;
  onOpen: () => void;
  onPeekEnter?: (e: React.PointerEvent) => void;
  onPeekMove?: (e: React.PointerEvent) => void;
  onPeekLeave?: () => void;
}

/**
 * One line of the numbered work index: mono numeral, serif title, quiet
 * caption. Hovering inks the hairline across; pressing nudges the row.
 * The image peek layer lives at page root and is fed via the peek handlers.
 */
export function ProjectIndexRow({
  index,
  project,
  onOpen,
  onPeekEnter,
  onPeekMove,
  onPeekLeave,
}: ProjectIndexRowProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      onPointerEnter={onPeekEnter}
      onPointerMove={onPeekMove}
      onPointerLeave={onPeekLeave}
      className={cn(
        "group relative flex w-full items-baseline gap-4 md:gap-6 py-4 md:py-[1.15rem] text-left",
        "border-b border-border-card transition-transform duration-150",
        "active:translate-x-1 focus-visible:outline-none",
        // ink line draws across the hairline on hover/focus
        "after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-text-primary",
        "after:origin-left after:scale-x-0 after:transition-transform after:duration-300",
        "after:ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:after:scale-x-100 focus-visible:after:scale-x-100"
      )}
    >
      <span className="w-7 shrink-0 font-mono text-xs text-text-muted transition-colors duration-200 group-hover:text-seal group-focus-visible:text-seal">
        {index}
      </span>
      <span className="font-serif text-[clamp(1.3rem,1.05rem+1.2vw,1.9rem)] leading-tight text-text-primary">
        {project.title}
      </span>
      <span className="ml-auto hidden shrink-0 pl-4 text-right font-sans text-sm font-light text-text-secondary sm:block">
        {project.caption}
      </span>
    </button>
  );
}
