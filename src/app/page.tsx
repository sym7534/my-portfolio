"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Input,
  ArrowIcon,
  Navbar,
  DevpostIcon,
  EmailIcon,
  LinkedInIcon,
  GitHubIcon,
  TwitterIcon,
  ProjectDetailModal,
  TypedHeading,
  CursorTrail,
  AboutLi,
  InlineIcon,
} from "@/components";
import { Marquee } from "@/components/ui/Marquee";
import { ProjectRow } from "@/components/ui/ProjectRow";
import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { socialLinks as socialLinkData, type SocialIconKey } from "@/data/socials";
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

const socialIcons: Record<SocialIconKey, React.ReactNode> = {
  devpost: <DevpostIcon />,
  email: <EmailIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
  twitter: <TwitterIcon />,
};

const TICKER_ITEMS = [
  "calgary",
  "waterloo",
  "axibo",
  "watonomous",
  "churchill robotics",
  "cswp certified",
  "ros 2",
  "solidworks",
  "4 instruments",
  "neuralink, someday",
];

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

/** Mono section label with the orange square tick. */
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span aria-hidden="true" className="h-[6px] w-[6px] bg-accent" />
      <h2 className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
        {label}
      </h2>
      <span aria-hidden="true" className="ml-2 h-px flex-1 bg-border-card" />
    </div>
  );
}

export default function Home() {
  const [projectFilter, setProjectFilter] = useState<"all" | "software" | "mechanical">("all");
  const { selectedProject, openProject } = useProjectModal(projects);
  const { message, setMessage, isSending, handleSendMessage } = useSendMessage();
  const [slammed, setSlammed] = useState(false);

  // Fire-and-forget visit notification
  useEffect(() => {
    fetch("/api/visit", { method: "POST" });
  }, []);

  const socialLinks = socialLinkData.map((link) => ({
    label: link.label,
    href: link.href,
    icon: socialIcons[link.iconKey],
  }));

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
        {/* Header */}
        <div className="mx-auto max-w-[1100px] px-6 md:px-10">
          <header className="flex items-center justify-between border-b border-border-card py-5">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-3 w-3 bg-accent" />
              <span className="font-mono text-xs lowercase tracking-[0.2em] text-text-primary">
                ryan wang
              </span>
            </span>
            <Link
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs lowercase tracking-wide text-text-secondary transition-colors hover:text-accent"
            >
              my resume
            </Link>
          </header>
        </div>

        {/* Hero */}
        <div className="mx-auto max-w-[1100px] px-6 md:px-10">
          <motion.section
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="pt-14 md:pt-20"
          >
            <motion.div variants={fadeUp}>
              <TypedHeading
                className="font-archivo font-black uppercase tracking-tight text-[clamp(3.2rem,8vw,7.25rem)] leading-[0.95] text-text-secondary"
                nameClassName={cn("hero-name text-text-primary", slammed && "slam")}
                onNameSettled={() => setSlammed(true)}
              />
              <div
                aria-hidden="true"
                className={cn(
                  "mt-5 h-[6px] w-full max-w-[540px] origin-left bg-accent",
                  "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:280ms]",
                  slammed ? "scale-x-100" : "scale-x-0",
                  "motion-reduce:transition-none motion-reduce:scale-x-100"
                )}
              />
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="mt-7 font-mono text-[13px] lowercase text-text-secondary">
                mechatronics engineering @
                <span className="ml-2 inline-flex items-baseline gap-1">
                  <InlineIcon icon="uwaterloo" />
                  <Link
                    href={UWATERLOO_URL}
                    className="text-text-primary transition-colors hover:text-accent"
                  >
                    uwaterloo
                  </Link>
                </span>
              </p>
              <p className="mt-4 max-w-[52ch] font-sans text-base font-light leading-relaxed text-text-secondary">
                {BIO}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 pb-12">
              <Navbar items={socialLinks} />
            </motion.div>
          </motion.section>
        </div>

        {/* Ticker — full bleed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
        >
          <Marquee items={TICKER_ITEMS} />
        </motion.div>

        <div className="mx-auto max-w-[1100px] px-6 md:px-10">
          {/* Experience */}
          <motion.section
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-16 md:mt-24"
          >
            <SectionHeader label="Experience" />
            <div>
              {experience.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-1 gap-x-8 border-b border-border-card py-5 last:border-0 sm:grid-cols-[150px_1fr]"
                >
                  <span className="whitespace-nowrap pt-1 font-mono text-xs text-accent">
                    {entry.date}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-archivo text-xl font-bold uppercase tracking-tight text-text-primary">
                        {entry.title}
                      </span>
                      <span className="font-mono text-[11px] lowercase text-text-secondary">
                        {entry.subtitle}
                      </span>
                    </div>
                    <p className="mt-2 max-w-[60ch] font-sans text-sm font-light text-text-secondary">
                      {entry.description}
                    </p>
                    <p className="mt-1.5 font-mono text-[11px] text-text-muted">
                      {entry.skills.join(" · ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Work */}
          <motion.section
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-16 md:mt-24"
          >
            <div className="mb-6 flex items-center gap-3">
              <span aria-hidden="true" className="h-[6px] w-[6px] bg-accent" />
              <h2 className="whitespace-nowrap font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
                Work
              </h2>
              <div className="ml-5 flex items-center gap-4">
                <button
                  onClick={() =>
                    setProjectFilter(projectFilter === "software" ? "all" : "software")
                  }
                  className={cn(
                    "font-mono text-xs lowercase transition-colors",
                    projectFilter === "software"
                      ? "text-accent"
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
                      ? "text-accent"
                      : "text-text-muted hover:text-text-primary"
                  )}
                >
                  mechanical
                </button>
              </div>
              <span aria-hidden="true" className="ml-2 h-px flex-1 bg-border-card" />
            </div>
            <div>
              {visibleProjects.map((project) => (
                <ProjectRow
                  key={project.slug}
                  index={numberOf.get(project.slug) ?? "00"}
                  project={project}
                  onOpen={() => openProject(project)}
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
            <SectionHeader label="Transmit" />
            <div className="max-w-md">
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
            </div>
          </motion.section>

          {/* Footer */}
          <footer className="mt-20 pb-10 md:mt-28">
            <span aria-hidden="true" className="block h-px w-full bg-border-card" />
            <div className="flex items-center justify-between gap-4 pt-6 font-mono text-xs text-text-secondary/70 select-none">
              <span className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-2.5 w-2.5 bg-accent" />
                2026 &copy; ryan wang
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

        <CursorTrail />

        <ProjectDetailModal
          project={selectedProject}
          onClose={() => openProject(null)}
        />
      </div>
    </MotionConfig>
  );
}
