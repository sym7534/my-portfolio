"use client";

import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectRowProps {
  index: string;
  project: Project;
  onOpen: () => void;
}

/**
 * Huge-type work row: on hover/focus an orange fill sweeps up behind the
 * text and the type flips to canvas color for contrast. Transform-only.
 */
export function ProjectRow({ index, project, onOpen }: ProjectRowProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative isolate block w-full overflow-hidden border-b border-border-card px-1 py-4 text-left md:py-5",
        "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-accent",
        "before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:before:scale-y-100 focus-visible:before:scale-y-100",
        "focus-visible:outline-none active:translate-x-1 transition-transform duration-150",
        "motion-reduce:before:transition-none"
      )}
    >
      <div className="flex items-baseline gap-4 md:gap-6">
        <span className="shrink-0 font-mono text-xs text-text-muted transition-colors duration-300 group-hover:text-bg-white group-focus-visible:text-bg-white motion-reduce:transition-none">
          {index}
        </span>
        <span className="font-archivo font-black uppercase leading-none tracking-tight text-[clamp(1.45rem,4.5vw,3.6rem)] text-text-primary transition-colors duration-300 group-hover:text-bg-white group-focus-visible:text-bg-white motion-reduce:transition-none">
          {project.title}
        </span>
        <span className="ml-auto hidden shrink-0 pl-4 text-right font-mono text-[11px] lowercase text-text-secondary transition-colors duration-300 group-hover:text-bg-white/80 group-focus-visible:text-bg-white/80 sm:block motion-reduce:transition-none">
          {project.caption}
        </span>
      </div>
    </button>
  );
}
