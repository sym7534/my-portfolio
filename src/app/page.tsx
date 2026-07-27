"use client";

import { useEffect, useState } from "react";
import {
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
  TypedHeading,
  CursorTrail,
  AboutLi,
  InlineIcon,
} from "@/components";
import { SealMark } from "@/components/SealMark";
import { SealStamp } from "@/components/SealStamp";
import { ProjectIndexRow } from "@/components/ui/ProjectIndexRow";
import {
  MotionConfig,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import type { Project } from "@/types/project";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { socialLinks as socialLinkData, type SocialIconKey } from "@/data/socials";
import { aboutItems, type AboutSegment } from "@/data/about";
import { BIO_LONG, RESUME_PATH, UWATERLOO_URL, WEBRING_BASE_URL, WEBRING_SITE } from "@/data/site";
import { useProjectModal } from "@/lib/useProjectModal";
import { useSendMessage } from "@/lib/useSendMessage";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Fragment } from "react";
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

/** Hairline that inks itself across when scrolled into view. */
function Rule({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block h-px origin-left bg-border-card", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease }}
    />
  );
}

/** Mono section label with the red diamond tick and a trailing drawn rule. */
function SectionHeader({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span aria-hidden="true" className="h-[6px] w-[6px] rotate-45 bg-seal" />
      <h2 className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
        {label}
      </h2>
      {children}
      <Rule className="ml-2 flex-1" />
    </div>
  );
}

export default function Home() {
  const [projectFilter, setProjectFilter] = useState<"all" | "software" | "mechanical">("all");
  const { selectedProject, openProject } = useProjectModal(projects);
  const { message, setMessage, isSending, handleSendMessage } = useSendMessage();
  const [sealed, setSealed] = useState(false);

  // Fire-and-forget visit notification
  useEffect(() => {
    fetch("/api/visit", { method: "POST" });
  }, []);

  const sendAndSeal = async () => {
    const ok = await handleSendMessage();
    if (ok) {
      setSealed(true);
      window.setTimeout(() => setSealed(false), 1800);
    }
  };

  // Cursor-following image peek for the work index (desktop, fine pointers only)
  const canPeek = useMediaQuery("(pointer: fine)");
  const peekX = useMotionValue(0);
  const peekY = useMotionValue(0);
  const px = useSpring(peekX, { stiffness: 350, damping: 32 });
  const py = useSpring(peekY, { stiffness: 350, damping: 32 });
  const [peekSrc, setPeekSrc] = useState<string | null>(null);

  const peekHandlers = (project: Project) =>
    canPeek
      ? {
          onPeekEnter: (e: React.PointerEvent) => {
            setPeekSrc(project.imageSrc ?? null);
            peekX.jump(e.clientX + 36);
            peekY.jump(e.clientY - 150);
          },
          onPeekMove: (e: React.PointerEvent) => {
            peekX.set(e.clientX + 36);
            peekY.set(e.clientY - 150);
          },
          onPeekLeave: () => setPeekSrc(null),
        }
      : {};

  const socialLinks = socialLinkData.map((link) => ({
    label: link.label,
    href: link.href,
    icon: socialIcons[link.iconKey],
  }));

  // Stable catalog numbers: position in the full list (atv stays hidden)
  const numbered = projects.filter((p) => p.slug !== "atv");
  const numberOf = new Map(
    numbered.map((p, i) => [p.slug, String(i + 1).padStart(2, "0")])
  );
  const visibleProjects = numbered.filter(
    (p) =>
      projectFilter === "all" ||
      p.category === projectFilter ||
      p.category === "both"
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <div className="mx-auto max-w-[1000px] px-6 md:px-10">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-border-card py-5">
            <SealMark variant="glyph" size={24} />
            <div className="flex items-center gap-4">
              <Link
                href={RESUME_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs lowercase tracking-wide text-text-secondary transition-colors hover:text-text-primary"
              >
                my resume
              </Link>
              <ThemeToggle />
            </div>
          </header>

          {/* Hero */}
          <motion.section
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="pt-14 md:pt-24"
          >
            <motion.div variants={fadeUp}>
              <TypedHeading
                className="text-[clamp(3rem,2.2rem+3.5vw,5.25rem)] leading-[1.06] [font-variation-settings:'WONK'_1]"
                nameSuffix={<SealStamp size={40} className="ml-3 md:ml-4" />}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="mt-6 font-mono text-[13px] lowercase text-text-secondary">
                mechatronics engineering @
                <span className="ml-2 inline-flex items-baseline gap-1">
                  <InlineIcon icon="uwaterloo" />
                  <Link
                    href={UWATERLOO_URL}
                    className="text-text-primary transition-colors hover:text-seal"
                  >
                    uwaterloo
                  </Link>
                </span>
              </p>
              <p className="mt-5 max-w-[62ch] font-sans text-base font-light leading-relaxed text-text-secondary">
                {BIO_LONG}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8">
              <Navbar items={socialLinks} />
            </motion.div>
          </motion.section>

          {/* Experience */}
          <motion.section
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-20 md:mt-28"
          >
            <SectionHeader label="Experience" />
            <div>
              {experience.map((entry) => (
                <div
                  key={entry.id}
                  className="border-b border-border-card py-5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={entry.logoSrc}
                      alt={entry.logoAlt}
                      width={30}
                      height={30}
                      className="rounded-sm object-cover"
                    />
                    <span className="font-serif text-[1.35rem] leading-none text-text-primary">
                      {entry.title}
                    </span>
                    <span className="ml-auto whitespace-nowrap font-mono text-xs text-text-secondary">
                      {entry.date}
                    </span>
                  </div>
                  <p className="mt-1.5 font-mono text-[11px] lowercase tracking-wide text-text-muted">
                    {entry.subtitle}
                  </p>
                  <p className="mt-2 max-w-[60ch] font-sans text-sm font-light text-text-secondary">
                    {entry.description}
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] text-text-muted">
                    {entry.skills.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Selected work */}
          <motion.section
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-16 md:mt-24"
          >
            <SectionHeader label="Selected Work">
              <div className="ml-5 flex items-center gap-4">
                <button
                  onClick={() =>
                    setProjectFilter(projectFilter === "software" ? "all" : "software")
                  }
                  className={cn(
                    "font-mono text-xs lowercase transition-colors",
                    projectFilter === "software"
                      ? "text-seal"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  software
                </button>
                <button
                  onClick={() =>
                    setProjectFilter(projectFilter === "mechanical" ? "all" : "mechanical")
                  }
                  className={cn(
                    "font-mono text-xs lowercase transition-colors",
                    projectFilter === "mechanical"
                      ? "text-seal"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  mechanical
                </button>
              </div>
            </SectionHeader>
            <div>
              {visibleProjects.map((project) => (
                <ProjectIndexRow
                  key={project.slug}
                  index={numberOf.get(project.slug) ?? "00"}
                  project={project}
                  onOpen={() => openProject(project)}
                  {...peekHandlers(project)}
                />
              ))}
            </div>
          </motion.section>

          {/* About */}
          <motion.section
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-16 md:mt-24"
          >
            <SectionHeader label="About" />
            <ul className="space-y-2 font-sans text-sm font-light text-text-secondary">
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
          </motion.section>

          {/* Message */}
          <motion.section
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-16 md:mt-24"
          >
            <SectionHeader label="Leave a Note" />
            <div className="max-w-md">
              <Input
                placeholder="leave me a message"
                icon={sealed ? <SealStamp size={20} /> : <ArrowIcon />}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void sendAndSeal();
                  }
                }}
                onIconClick={() => {
                  void sendAndSeal();
                }}
                maxLength={500}
                aria-label="Leave a message"
                aria-busy={isSending}
              />
            </div>
          </motion.section>

          {/* Footer */}
          <footer className="mt-20 pb-10 md:mt-28">
            <Rule />
            <div className="flex items-center justify-between gap-4 pt-6 font-mono text-xs text-text-secondary/70 select-none">
              <span className="flex items-center gap-3">
                <SealMark variant="solid" size={20} className="-rotate-3" />
                2026 &copy; wang dynasty
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=prev`}
                  aria-label="Previous site"
                  className="group"
                >
                  <span
                    className="block h-[18px] w-[18px] bg-current opacity-60 transition-opacity group-hover:opacity-100"
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
                    className="block h-9 w-9 object-contain opacity-70 transition-opacity group-hover:opacity-100"
                  />
                </Link>
                <Link
                  href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=next`}
                  aria-label="Next site"
                  className="group"
                >
                  <span
                    className="block h-[18px] w-[18px] bg-current opacity-60 transition-opacity group-hover:opacity-100"
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
            </div>
          </footer>
        </div>

        {/* Cursor-following image peek (root level, outside transformed ancestors) */}
        <motion.div
          style={{ x: px, y: py }}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
        >
          {peekSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={peekSrc}
              alt=""
              className="h-28 w-44 rounded-sm border border-border-card object-cover shadow-lg"
            />
          )}
        </motion.div>

        <CursorTrail />

        <ProjectDetailModal
          project={selectedProject}
          onClose={() => openProject(null)}
        />
      </div>
    </MotionConfig>
  );
}
