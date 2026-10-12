"use client";

import Image from "next/image";
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
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`Open project: ${project.title}`}
      data-text-only={project.imageSrc ? undefined : ""}
      className={cn(
        "group cursor-pointer",
        // Text-only cards are ruled above and below, with the same 16px gap
        // on both sides of every rule: they pull up so the top rule sits
        // 16px under the previous card (whose margin is 48px), and their own
        // bottom margin is 16px. In a run of them, each later card pulls up
        // flush and drops its top rule, so neighbours share a single line.
        !project.imageSrc &&
          "border-y border-border-card -mt-8 [[data-text-only]+&]:-mt-4 [[data-text-only]+&]:border-t-0",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-text-muted",
        className
      )}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      {project.imageSrc && (
        <div
          className={cn(
            !project.bareImage &&
              "overflow-hidden rounded-[3px] border border-border-card bg-bg-white",
            project.imageScale && "mx-auto"
          )}
          style={
            project.imageScale
              ? { width: `${project.imageScale * 100}%` }
              : undefined
          }
        >
          {project.imageWidth && project.imageHeight ? (
            <Image
              src={project.imageSrc}
              alt={project.altText ?? project.title}
              width={project.imageWidth}
              height={project.imageHeight}
              sizes="(min-width: 1024px) 26vw, 44vw"
              className="block h-auto w-full transition duration-300 group-hover:brightness-[1.04]"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.imageSrc}
              alt={project.altText ?? project.title}
              loading="lazy"
              className="block w-full transition duration-300 group-hover:brightness-[1.04]"
            />
          )}
        </div>
      )}
      <figcaption className={cn(project.imageSrc ? "mt-3" : "py-4")}>
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
