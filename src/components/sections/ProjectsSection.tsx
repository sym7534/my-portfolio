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
  rest.forEach((p, i) => (i % 2 === 0 ? leftCol : rightCol).push(p));
  // pinned projects sit at the top of the right column
  rightCol.unshift(...pinned);

  const renderCard = (project: Project) => (
    <PhotoCard
      key={project.slug}
      project={project}
      onOpen={() => openProject(project)}
      className="mb-7"
    />
  );

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
        {filterButton("software")}
        {filterButton("mechanical")}
      </QuietHeader>
      <div className="flex gap-6">
        <div className="min-w-0 flex-1 flex flex-col">{leftCol.map(renderCard)}</div>
        <div className="min-w-0 flex-1 flex flex-col">{rightCol.map(renderCard)}</div>
      </div>
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => openProject(null)}
      />
    </Section>
  );
}
