"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  Container,
  Panel,
  Section,
  ExperienceCard,
  Input,
  ArrowIcon,
  Navbar,
  DevpostIcon,
  EmailIcon,
  LinkedInIcon,
  GitHubIcon,
  TwitterIcon,
  ThemeToggle,
  ProjectDetailModal,
  ScrollIndicator,
  TypedHeading,
  CursorTrail,
  AboutLi,
  InlineIcon,
} from "@/components";
import { Plate } from "@/components/ui/Plate";
import { MotionConfig, motion } from "motion/react";
import type { Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { socialLinks as socialLinkData, type SocialIconKey } from "@/data/socials";
import { aboutItems, type AboutSegment } from "@/data/about";
import { BIO, RESUME_PATH, UWATERLOO_URL, WEBRING_BASE_URL, WEBRING_SITE } from "@/data/site";
import { useProjectModal } from "@/lib/useProjectModal";
import { useSendMessage } from "@/lib/useSendMessage";

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

const MAX_EXPERIENCE_TITLE_SIZE = 30;

const socialIcons: Record<SocialIconKey, React.ReactNode> = {
  devpost: <DevpostIcon />,
  email: <EmailIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  twitter: <TwitterIcon />,
};

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

export default function Home() {
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [experienceTitleSize, setExperienceTitleSize] = useState(
    MAX_EXPERIENCE_TITLE_SIZE
  );
  const [projectFilter, setProjectFilter] = useState<"all" | "software" | "mechanical">("all");
  const { selectedProject, openProject } = useProjectModal(projects);
  const { message, setMessage, isSending, handleSendMessage } = useSendMessage();

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

  const socialLinks = socialLinkData.map((link) => ({
    label: link.label,
    href: link.href,
    icon: socialIcons[link.iconKey],
  }));

  return (
    <MotionConfig reducedMotion="user">
    <Container>
      {/* Left Panel - Main Content (sticky, doesn't scroll) */}
      <Panel side="left" className="flex flex-col">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          {/* Hero Section */}
          <motion.div variants={fadeUp}>
          <Section className="mb-[clamp(1rem,3vh,2rem)]">
            <TypedHeading />
            <div className="w-full max-w-md h-px bg-text-secondary/20 my-[clamp(0.75rem,2.5vh,1.5rem)]" />
            <p className="font-sans font-light text-sm text-text-secondary">
              <span>mechatronics engineering</span> @
              <span className="inline-flex items-baseline gap-1 ml-2">
                <InlineIcon icon="uwaterloo" />
                <Link href={UWATERLOO_URL} className="font-medium">
                  UWaterloo
                </Link>
              </span>
            </p>
            <p className="font-sans font-light text-sm text-text-secondary mt-2">
              {BIO}
            </p>
          </Section>
          </motion.div>

          {/* Social Links - fixed below bio */}
          <motion.div variants={fadeUp}>
          <div className="flex items-center gap-4 mb-[clamp(1rem,3vh,2rem)]">
            <Navbar items={socialLinks} />
            <div className="ml-auto flex items-center gap-3">
              <Link
                href={RESUME_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                my resume
              </Link>
              <ThemeToggle />
            </div>
          </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div variants={fadeUp}>
          <Section className="space-y-[clamp(0.5rem,2vh,1rem)]">
            {experience.map((entry) => (
              <ExperienceCard
                key={entry.id}
                logo={
                  <Image
                    src={entry.logoSrc}
                    alt={entry.logoAlt}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
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
          <Section className="mt-[clamp(1.5rem,4vh,3rem)]">
            <Input
              placeholder="leave me a message"
              icon={<ArrowIcon />}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }}
              onIconClick={() => {
                void handleSendMessage();
              }}
              maxLength={500}
              aria-label="Leave a message"
              aria-busy={isSending}
            />
          </Section>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between gap-4 font-sans text-xs text-text-secondary/50 mt-auto pt-4 pl-1 select-none"
        >
          <span>2026 &copy; Ryan Wang</span>
          <div className="flex items-center gap-3">
            <Link
              href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=prev`}
              aria-label="Previous site"
              className="group"
            >
              <span
                className="block w-[18px] h-[18px] bg-current opacity-60 group-hover:opacity-100 transition-opacity"
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
                className="block w-9 h-9 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <Link
              href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=next`}
              aria-label="Next site"
              className="group"
            >
              <span
                className="block w-[18px] h-[18px] bg-current opacity-60 group-hover:opacity-100 transition-opacity"
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

      {/* Right Panel - Projects & Skills */}
      <Panel side="right" ref={rightPanelRef}>
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
        <Section title="ABOUT ME">
          <ul className="font-sans font-light space-y-2 text-sm text-text-secondary">
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
          <div className="flex items-center gap-4 mb-6">
            <h2 className="font-serif text-lg text-text-secondary tracking-wide">PROJECTS</h2>
            <button
              onClick={() => setProjectFilter(projectFilter === "software" ? "all" : "software")}
              className={`font-sans text-sm transition-colors ${
                projectFilter === "software"
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              software
            </button>
            <button
              onClick={() => setProjectFilter(projectFilter === "mechanical" ? "all" : "mechanical")}
              className={`font-sans text-sm transition-colors ${
                projectFilter === "mechanical"
                  ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              mechanical
            </button>
          </div>
          {(() => {
            const numbered = projects.filter(p => p.slug !== "atv");
            const numberOf = new Map(
              numbered.map((p, i) => [p.slug, String(i + 1).padStart(2, "0")])
            );
            const filtered = numbered.filter(p => projectFilter === "all" || p.category === projectFilter || p.category === "both");
            const marsRover = filtered.find(p => p.slug === "mars-rover");
            const rest = filtered.filter(p => p.slug !== "mars-rover");
            const leftCol: Project[] = [];
            const rightCol: Project[] = [];
            rest.forEach((p, i) => (i % 2 === 0 ? leftCol : rightCol).push(p));
            if (marsRover) rightCol.unshift(marsRover);
            const renderCard = (project: Project) => (
              <Plate
                key={project.slug}
                index={numberOf.get(project.slug) ?? "00"}
                project={project}
                onOpen={() => openProject(project)}
                className="mb-5"
              />
            );
            return (
              <div className="flex gap-5">
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
