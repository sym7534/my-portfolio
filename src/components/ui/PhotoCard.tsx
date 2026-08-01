"use client";

import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface PhotoCardProps {
  project: Project;
  onOpen: () => void;
  className?: string;
}

/**
 * A project as a photo in an essay: hairline-framed image with a serif
 * title and an italic caption beneath. No card chrome, no tilt — the
 * hover is a whisper (slight brightness, underline fades in).
 */
export function PhotoCard({ project, onOpen, className }: PhotoCardProps) {
  return (
    <figure
      className={cn("group cursor-pointer", className)}
      onClick={onOpen}
    >
      {project.imageSrc && (
        <div className="overflow-hidden rounded-[3px] border border-border-card bg-bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageSrc}
            alt={project.altText ?? project.title}
            className="block w-full transition duration-300 group-hover:brightness-[1.04]"
          />
        </div>
      )}
      <figcaption className={cn(project.imageSrc ? "mt-2" : "border-b border-border-card pb-3")}>
        <span className="font-serif text-[16px] leading-snug text-text-primary underline decoration-transparent decoration-1 underline-offset-[3px] transition-colors duration-200 group-hover:decoration-text-muted">
          {project.title}
        </span>
        {project.caption && (
          <span className="mt-0.5 block font-serif text-[13px] italic text-text-muted">
            {project.caption}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
