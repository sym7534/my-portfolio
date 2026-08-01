"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  Container,
  Panel,
  Section,
  ExperienceCard,
  ThemeToggle,
  ProjectDetailModal,
  ScrollIndicator,
  TypedHeading,
  CursorTrail,
  AboutLi,
  InlineIcon,
} from "@/components";
import { PhotoCard } from "@/components/ui/PhotoCard";
import { DitherHand } from "@/components/DitherHand";
import { MotionConfig, motion } from "motion/react";
import type { Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { aboutItems, type AboutSegment } from "@/data/about";
import { BIO, RESUME_PATH, UWATERLOO_URL, WEBRING_BASE_URL, WEBRING_SITE } from "@/data/site";
import { useProjectModal } from "@/lib/useProjectModal";
import { useSendMessage } from "@/lib/useSendMessage";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

const scrollReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const MAX_EXPERIENCE_TITLE_SIZE = 21;

const inkLink =
  "text-text-primary underline decoration-1 underline-offset-[3px] decoration-text-muted/60 transition-colors hover:decoration-text-primary";
const quietLink =
  "text-text-muted underline decoration-1 underline-offset-[3px] decoration-text-muted/50 transition-colors hover:text-text-primary";

function renderAboutSegments(segments: AboutSegment[]) {
  return segments.map((segment, i) =>
    typeof segment === "string" ? (
      <Fragment key={i}>{segment}</Fragment>
    ) : (
      <span key={i} className="inline-flex items-baseline gap-1 ml-2">
        <InlineIcon icon={segment.icon} />
        {segment.label}
      </span>
    )
  );
}

/** Quiet section marker: lowercase serif, muted, trailing em dash. */
function QuietHeader({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline gap-4">
      <p className="font-serif text-[15px] text-text-muted">{label} —</p>
      {children}
    </div>
  );
}

export default function Home() {
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [experienceTitleSize, setExperienceTitleSize] = useState(
    MAX_EXPERIENCE_TITLE_SIZE
  );
  const [projectFilter, setProjectFilter] = useState<"all" | "software" | "mechanical">("all");
  const { selectedProject, openProject } = useProjectModal(projects);
  const { message, setMessage, isSending, handleSendMessage } = useSendMessage();
  const [sent, setSent] = useState(false);
  const [handGen, setHandGen] = useState(0);
  const [messed, setMessed] = useState(false);

  // Fire-and-forget visit notification
  useEffect(() => {
    fetch("/api/visit", { method: "POST" });
  }, []);

  const handleMouseEnter = (id: string) => setExpandedId(id);
  const handleMouseLeave = () => setExpandedId(null);
  const handleClick = (id: string) => {
    // For mobile tap-to-toggle
    setExpandedId((prev) => (prev === id ? null : id));
  };

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

  const send = async () => {
    const ok = await handleSendMessage();
    if (ok) {
      setSent(true);
      window.setTimeout(() => setSent(false), 2500);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
    <Container>
      {/* Left Panel - Main Content (sticky, doesn't scroll) */}
      <Panel side="left" className="flex flex-col">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {/* Hero Section */}
          <motion.div variants={fadeUp}>
          <Section className="mb-[clamp(1rem,3vh,2rem)]">
            <TypedHeading className="text-[clamp(2.1rem,1.8rem+1.2vw,2.5rem)] font-bold leading-[1.15]" />
            <div className="w-full max-w-md h-px bg-border-card my-[clamp(0.75rem,2.5vh,1.5rem)]" />
            <p className="font-serif text-[15px] text-text-secondary">
              <span>mechatronics engineering</span> @
              <span className="inline-flex items-baseline gap-1 ml-2">
                <InlineIcon icon="uwaterloo" />
                <Link href={UWATERLOO_URL} className={inkLink}>
                  UWaterloo
                </Link>
              </span>
            </p>
            <p className="font-serif text-[15px] leading-[1.63] text-text-secondary mt-2">
              {BIO}
            </p>
          </Section>
          </motion.div>

          {/* Links row */}
          <motion.div variants={fadeUp}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-[clamp(1rem,3vh,2rem)] font-serif text-[13px]">
            <a href="https://x.com/symm7534" className={quietLink}>
              x
            </a>
            <a href="https://www.linkedin.com/in/ryan-muxi-wang/" className={quietLink}>
              linkedin
            </a>
            <a href="https://github.com/sym7534" className={quietLink}>
              github
            </a>
            <a href="https://devpost.com/ryan-muxiwang" className={quietLink}>
              devpost
            </a>
            <a href="mailto:ryan.muxiwang@gmail.com" className={quietLink}>
              email
            </a>
            <Link href={RESUME_PATH} target="_blank" rel="noopener noreferrer" className={quietLink}>
              resume
            </Link>
            <span className="ml-auto opacity-60 [&_svg]:size-4">
              <ThemeToggle />
            </span>
          </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div variants={fadeUp}>
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
                onMouseEnter={() => handleMouseEnter(entry.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(entry.id)}
              />
            ))}
          </Section>
          </motion.div>

          {/* Message Input */}
          <motion.div variants={fadeUp}>
          <Section className="mt-[clamp(1.25rem,3.5vh,2.5rem)]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={sent ? "sent :)" : "leave me a message"}
                maxLength={500}
                aria-label="Leave a message"
                aria-busy={isSending}
                className={cn(
                  "w-full max-w-[280px] border-0 border-b border-border-card bg-transparent py-1.5",
                  "font-serif text-[15px] italic text-text-primary",
                  "placeholder:text-text-muted/70 focus:border-text-muted focus:outline-none",
                  "transition-colors"
                )}
              />
            </form>
          </Section>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between gap-4 font-serif text-[13px] text-text-muted mt-auto pt-4 pl-1 select-none"
        >
          <span>2026 &copy; Ryan Wang</span>
          <div className="flex items-center gap-3">
            <Link
              href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=prev`}
              aria-label="Previous site"
              className="group"
            >
              <span
                className="block w-[16px] h-[16px] bg-current opacity-50 group-hover:opacity-100 transition-opacity"
                style={{
                  maskImage: "url('/leftarrow.png')",
                  WebkitMaskImage: "url('/leftarrow.png')",
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                }}
              />
            </Link>
            <Link
              href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Tron Webring home"
              className="group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/tronchrome.png"
                alt="Tron Webring"
                className="block w-8 h-8 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <Link
              href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=next`}
              aria-label="Next site"
              className="group"
            >
              <span
                className="block w-[16px] h-[16px] bg-current opacity-50 group-hover:opacity-100 transition-opacity"
                style={{
                  maskImage: "url('/rightarrow.png')",
                  WebkitMaskImage: "url('/rightarrow.png')",
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                }}
              />
            </Link>
          </div>
        </motion.div>
      </Panel>

      {/* Right Panel - Art, About, Projects */}
      <Panel side="right" ref={rightPanelRef} className="lg:border-l lg:border-border-card">
        {/* Halftone masthead — his own robot hand */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="relative mb-10 h-[clamp(190px,26vh,280px)]"
        >
          <DitherHand
            key={handGen}
            src="/assets/projects/robot-hand/finalcad_hero.png"
            className="h-full w-full"
            onFirstSplit={() => setMessed(true)}
          />
          <span
            className={cn(
              "absolute bottom-0 right-0 font-serif text-xs transition-opacity duration-700",
              messed ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <button
              type="button"
              onClick={() => {
                setHandGen((g) => g + 1);
                setMessed(false);
              }}
              className={quietLink}
            >
              start over
            </button>
          </span>
        </motion.div>

        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
        <Section>
          <QuietHeader label="about" />
          <ul className="font-serif space-y-2 text-[14.5px] text-text-secondary">
            {aboutItems.map((item, i) => (
              <AboutLi key={i}>
                {item.subline ? (
                  <div className="flex flex-col gap-1">
                    <span>{renderAboutSegments(item.segments)}</span>
                    <span className="pl-4">{item.subline}</span>
                  </div>
                ) : (
                  <span>{renderAboutSegments(item.segments)}</span>
                )}
              </AboutLi>
            ))}
          </ul>
        </Section>
        </motion.div>

        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
        <Section className="mt-12">
          <QuietHeader label="projects">
            <button
              onClick={() => setProjectFilter(projectFilter === "software" ? "all" : "software")}
              className={cn(
                "font-serif text-[13px] transition-colors",
                projectFilter === "software"
                  ? "text-text-primary underline decoration-1 underline-offset-[3px]"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              software
            </button>
            <button
              onClick={() => setProjectFilter(projectFilter === "mechanical" ? "all" : "mechanical")}
              className={cn(
                "font-serif text-[13px] transition-colors",
                projectFilter === "mechanical"
                  ? "text-text-primary underline decoration-1 underline-offset-[3px]"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              mechanical
            </button>
          </QuietHeader>
          {(() => {
            const filtered = projects.filter(p => p.slug !== "atv" && (projectFilter === "all" || p.category === projectFilter || p.category === "both"));
            const marsRover = filtered.find(p => p.slug === "mars-rover");
            const rest = filtered.filter(p => p.slug !== "mars-rover");
            const leftCol: Project[] = [];
            const rightCol: Project[] = [];
            rest.forEach((p, i) => (i % 2 === 0 ? leftCol : rightCol).push(p));
            if (marsRover) rightCol.unshift(marsRover);
            const renderCard = (project: Project) => (
              <PhotoCard
                key={project.slug}
                project={project}
                onOpen={() => openProject(project)}
                className="mb-7"
              />
            );
            return (
              <div className="flex gap-6">
                <div className="min-w-0 flex-1 flex flex-col">{leftCol.map(renderCard)}</div>
                <div className="min-w-0 flex-1 flex flex-col">{rightCol.map(renderCard)}</div>
              </div>
            );
          })()}
        </Section>
        </motion.div>
      </Panel>

      <ScrollIndicator scrollRef={rightPanelRef} />

      <CursorTrail />

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => openProject(null)}
      />
    </Container>
    </MotionConfig>
  );
}
