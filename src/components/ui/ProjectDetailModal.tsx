"use client";

import { Modal } from "./Modal";
import { ImageCarousel } from "./ImageCarousel";
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

  const aside = (
    <div className="py-2">
      {/* Title + category badge */}
      <div className="flex items-center gap-3 mb-1">
        <h2 className="font-serif text-base text-white leading-tight">
          {project.title}
        </h2>
        <span className="bg-white/10 rounded-sm px-2 py-0.5 text-[12px] text-white/80 font-sans shrink-0">
          {project.category}
        </span>
      </div>

      {/* Caption */}
      <p className="font-sans font-light text-sm text-white/70 mb-4">
        {project.caption}
      </p>

      {/* Description */}
      <div className="mb-4">
        {project.description ? (
          <p className="font-sans font-light text-sm text-white/70 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        ) : (
          <p className="font-sans font-light text-sm text-white/40 italic">
            Detailed project description coming soon...
          </p>
        )}
      </div>

      {/* Tech Stack */}
      <div>
        {project.techStack && project.techStack.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-white/10 rounded-sm px-2 py-0.5 text-[12px] text-white/80 font-sans"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : (
          <p className="font-sans font-light text-sm text-white/40 italic">
            Tech stack coming soon...
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Modal isOpen ariaLabel={project.title} onClose={onClose} aside={aside}>
      <div className="p-2 lg:p-4">
        {/* Video embed, images, or fallback cover */}
        {project.videoUrl ? (
          <div
            className="relative w-full rounded-lg overflow-hidden"
            style={{ aspectRatio: project.videoAspect ?? "16 / 9" }}
          >
            <iframe
              src={project.videoUrl}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : project.images && project.images.length > 0 ? (
          <ImageCarousel images={project.images} />
        ) : project.imageSrc ? (
          <div className="relative w-full rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageSrc}
              alt={project.altText ?? project.title}
              className="w-full h-auto"
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
