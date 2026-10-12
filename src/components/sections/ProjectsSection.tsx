"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/ui/Section";
import { QuietHeader } from "@/components/ui/QuietHeader";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { ProjectDetailModal } from "@/components/ui/ProjectDetailModal";
import { projects } from "@/data/projects";
import { useProjectModal } from "@/lib/useProjectModal";
import { useUnlock } from "@/lib/useUnlock";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

type ProjectFilter = "all" | "software" | "mechanical";

/**
 * Projects grid with category filter and detail modal. Client component:
 * owns the filter state, the secret-link unlock, and the ?project= modal.
 *
 * Hidden projects are excluded from `visible` until unlocked, and the modal
 * hook only sees `visible` — so hidden projects are not deep-linkable
 * via ?project= unless the visitor has unlocked them.
 */
export function ProjectsSection() {
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  // reveals projects flagged `hidden` once the visitor arrives via the secret link
  const unlocked = useUnlock();

  const visible = useMemo(
    () => projects.filter((p) => !p.hidden || unlocked),
    [unlocked]
  );
  const { selectedProject, openProject } = useProjectModal(visible);

  const filtered = visible.filter(
    (p) =>
      projectFilter === "all" ||
      p.category === projectFilter ||
      p.category === "both"
  );
  const pinned = filtered.filter((p) => p.pinned);
  const rest = filtered.filter((p) => !p.pinned);
  const leftCol: Project[] = [];
  const rightCol: Project[] = [];
  // projects with a thumbnail fill two independent columns; text-only
  // projects go in a separate grid underneath so their rows line up
  const withImage = rest.filter((p) => p.imageSrc);
  const textOnly = rest.filter((p) => !p.imageSrc);
  // a project with `column` set goes there; the rest go to whichever
  // column has fewer cards (left on a tie), which alternates by default
  withImage.forEach((p) => {
    const col =
      p.column ?? (leftCol.length <= rightCol.length ? "left" : "right");
    (col === "left" ? leftCol : rightCol).push(p);
  });
  // pinned projects sit at the top of the right column
  rightCol.unshift(...pinned);

  const renderCard = (project: Project) => (
    <PhotoCard
      key={project.slug}
      project={project}
      onOpen={() => openProject(project)}
      className="mb-12"
    />
  );

  // kept for the category filters, which are commented out in the header below
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filterButton = (filter: Exclude<ProjectFilter, "all">) => (
    <button
      onClick={() => setProjectFilter(projectFilter === filter ? "all" : filter)}
      className={cn(
        "font-serif text-[13px] transition-colors",
        projectFilter === filter
          ? "text-text-primary underline decoration-1 underline-offset-[3px]"
          : "text-text-muted hover:text-text-primary"
      )}
    >
      {filter}
    </button>
  );

  return (
    <Section className="mt-12">
      <QuietHeader label="projects">
        {/* Category filters temporarily hidden; uncomment to restore.
        {filterButton("software")}
        {filterButton("mechanical")} */}
      </QuietHeader>
      <div className="flex gap-6">
        <div className="min-w-0 flex-1 flex flex-col">{leftCol.map(renderCard)}</div>
        <div className="min-w-0 flex-1 flex flex-col">{rightCol.map(renderCard)}</div>
      </div>
      {/* Text-only projects: a ruled two-column list. A shared grid keeps each
          row aligned across both columns. -mt-8 offsets the 48px card margin
          above so the first rule sits 16px under the last caption, matching
          the 16px padding inside each row. */}
      {textOnly.length > 0 && (
        <div className="-mt-8 grid grid-cols-2 gap-x-6">
          {textOnly.map((project, i) => (
            <PhotoCard
              key={project.slug}
              project={project}
              onOpen={() => openProject(project)}
              className={cn("border-b border-border-card", i < 2 && "border-t")}
            />
          ))}
        </div>
      )}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => openProject(null)}
      />
    </Section>
  );
}
