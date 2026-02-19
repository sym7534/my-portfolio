"use client";

import { Modal } from "./Modal";
import type { Project } from "@/types/project";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailModal({
  project,
  onClose,
}: ProjectDetailModalProps) {
  if (!project) return <Modal isOpen={false} onClose={onClose}><div /></Modal>;

  return (
    <Modal isOpen ariaLabel={project.title} onClose={onClose}>
      <div className="p-6">
        {/* Image */}
        {project.imageSrc && (
          <div className="relative w-full rounded-md overflow-hidden mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageSrc}
              alt={project.altText ?? project.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Title + category badge */}
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-serif text-base text-text-primary leading-tight">
            {project.title}
          </h2>
          <span className="bg-bg-card rounded-sm px-2 py-0.5 text-[12px] text-skill-tag-text font-sans shrink-0">
            {project.category}
          </span>
        </div>

        {/* Caption */}
        <p className="font-sans font-light text-sm text-text-secondary mb-4">
          {project.caption}
        </p>

        {/* Description */}
        <div className="mb-4">
          {project.description ? (
            <p className="font-sans font-light text-sm text-text-secondary leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          ) : (
            <p className="font-sans font-light text-sm text-text-muted italic">
              Detailed project description coming soon...
            </p>
          )}
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          {project.techStack && project.techStack.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-bg-card rounded-sm px-2 py-0.5 text-[12px] text-skill-tag-text font-sans"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-sans font-light text-sm text-text-muted italic">
              Tech stack coming soon...
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
