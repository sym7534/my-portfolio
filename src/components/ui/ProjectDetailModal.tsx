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

  const allLinks = [
    ...(project.links ?? []),
    ...(project.href ? [{ label: "View", url: project.href }] : []),
  ];

  return (
    <Modal isOpen ariaLabel={project.title} onClose={onClose}>
      <div className="p-6 pt-10">
        {/* Image */}
        {project.imageSrc && (
          <div
            className="relative w-full rounded-md overflow-hidden mb-5"
            style={{ aspectRatio: project.aspectRatio }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageSrc}
              alt={project.altText ?? project.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title + category badge */}
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-serif text-base text-text-primary leading-tight">
            {project.title}
          </h2>
          <span className="bg-bg-card rounded-sm px-2 py-0.5 text-[12px] text-skill-tag-text font-serif shrink-0">
            {project.category}
          </span>
        </div>

        {/* Caption */}
        <p className="font-serif text-sm text-text-secondary mb-4">
          {project.caption}
        </p>

        {/* Description */}
        <div className="mb-4">
          <h3 className="font-serif text-xs text-text-section tracking-wide mb-2">
            DESCRIPTION
          </h3>
          {project.description ? (
            <p className="font-serif text-sm text-text-secondary leading-relaxed">
              {project.description}
            </p>
          ) : (
            <p className="font-serif text-sm text-text-muted italic">
              Detailed project description coming soon...
            </p>
          )}
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          <h3 className="font-serif text-xs text-text-section tracking-wide mb-2">
            TECH STACK
          </h3>
          {project.techStack && project.techStack.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-bg-card rounded-sm px-2 py-0.5 text-[12px] text-skill-tag-text font-serif"
                >
                  {tech}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-serif text-sm text-text-muted italic">
              Tech stack coming soon...
            </p>
          )}
        </div>

        {/* Links */}
        <div>
          <h3 className="font-serif text-xs text-text-section tracking-wide mb-2">
            LINKS
          </h3>
          {allLinks.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {allLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-serif text-sm text-text-secondary underline hover:text-text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : (
            <p className="font-serif text-sm text-text-muted italic">
              Links coming soon...
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
