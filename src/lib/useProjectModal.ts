"use client";

import { useCallback, useEffect, useState } from "react";
import type { Project } from "@/types/project";

/**
 * Modal state synced with the URL (?project=slug): deep links open the modal
 * on mount, and browser back/forward navigate it.
 */
export function useProjectModal(projects: Project[]) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openProject = useCallback((project: Project | null) => {
    setSelectedProject(project);
    const url = project ? `?project=${project.slug}` : window.location.pathname;
    window.history.pushState({}, "", url);
  }, []);

  // Open modal from URL on mount. State must start null to match the server
  // render, so adopting the deep link has to happen post-hydration.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("project");
    if (slug) {
      const match = projects.find((p) => p.slug === slug);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (match) setSelectedProject(match);
    }
  }, [projects]);

  // Handle browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("project");
      setSelectedProject(
        slug ? projects.find((p) => p.slug === slug) ?? null : null
      );
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [projects]);

  return { selectedProject, openProject };
}
