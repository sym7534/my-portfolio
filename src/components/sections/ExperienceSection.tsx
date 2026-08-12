"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { ExperienceCard } from "@/components/ui/ExperienceCard";
import { experience } from "@/data/experience";

const MAX_EXPERIENCE_TITLE_SIZE = 21;

/**
 * Experience list. Client component: owns the hover/tap expansion state and
 * the shared title auto-fit size (all cards shrink together).
 */
export function ExperienceSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [experienceTitleSize, setExperienceTitleSize] = useState(
    MAX_EXPERIENCE_TITLE_SIZE
  );

  useEffect(() => {
    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        setExperienceTitleSize(MAX_EXPERIENCE_TITLE_SIZE);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleExperienceTitleSize = (size: number) => {
    setExperienceTitleSize((current) => Math.min(current, size));
  };

  return (
    <Section>
      {experience.map((entry) => (
        <ExperienceCard
          key={entry.id}
          logo={
            <Image
              src={entry.logoSrc}
              alt={entry.logoAlt}
              width={32}
              height={32}
              className="rounded-[3px] object-cover"
            />
          }
          title={entry.title}
          subtitle={entry.subtitle}
          date={entry.date}
          description={entry.description}
          skills={entry.skills}
          isExpanded={expandedId === entry.id}
          titleSize={experienceTitleSize}
          onTitleSizeChange={handleExperienceTitleSize}
          onMouseEnter={() => setExpandedId(entry.id)}
          onMouseLeave={() => setExpandedId(null)}
          onToggle={() =>
            setExpandedId((prev) => (prev === entry.id ? null : entry.id))
          }
        />
      ))}
    </Section>
  );
}
