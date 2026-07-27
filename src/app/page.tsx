"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle, ProjectDetailModal, TypedHeading } from "@/components";
import { DitherHand } from "@/components/DitherHand";
import { projects } from "@/data/projects";
import { RESUME_PATH, UWATERLOO_URL, WEBRING_BASE_URL, WEBRING_SITE } from "@/data/site";
import { useProjectModal } from "@/lib/useProjectModal";
import { useSendMessage } from "@/lib/useSendMessage";
import { cn } from "@/lib/utils";

/** Small logo sitting inline in running text, like a favicon before a name. */
function OrgIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={16}
      height={16}
      className="relative top-[3px] mr-1 inline-block rounded-[3px] object-contain"
    />
  );
}

const prose = "font-serif text-lg leading-[1.63] text-text-secondary";
const inkLink =
  "text-text-primary underline decoration-1 underline-offset-[3px] decoration-text-muted/60 transition-colors hover:decoration-text-primary";
const quietLink =
  "text-text-muted underline decoration-1 underline-offset-[3px] decoration-text-muted/50 transition-colors hover:text-text-primary";

export default function Home() {
  const { selectedProject, openProject } = useProjectModal(projects);
  const { message, setMessage, isSending, handleSendMessage } = useSendMessage();
  const [sent, setSent] = useState(false);

  // Fire-and-forget visit notification
  useEffect(() => {
    fetch("/api/visit", { method: "POST" });
  }, []);

  const send = async () => {
    const ok = await handleSendMessage();
    if (ok) {
      setSent(true);
      window.setTimeout(() => setSent(false), 2500);
    }
  };

  const list = projects.filter((p) => p.slug !== "atv");
  const mid = Math.ceil(list.length / 2);
  const columns = [list.slice(0, mid), list.slice(mid)];

  return (
    <>
      <div className="fade-in grid min-h-screen lg:h-screen lg:grid-cols-2 lg:overflow-hidden">
        {/* Text */}
        <section className="flex items-center justify-center px-6 py-12 lg:h-full lg:py-0">
          <div className="w-full max-w-[460px]">
            <TypedHeading className="text-4xl font-bold leading-[2.75rem]" />

            <p className={cn(prose, "mt-7")}>
              I&apos;m a full-stack robotics engineer studying mechatronics at{" "}
              <OrgIcon src="/assets/icons/UWaterloo.png" alt="UWaterloo" />
              <a href={UWATERLOO_URL} className={inkLink}>
                UWaterloo
              </a>{" "}
              — ROS 2 to firmware to CAD to machined parts. I like taking
              systems from shower thought to fully fleshed autonomy.
            </p>

            <p className={cn(prose, "mt-5")}>
              This summer I&apos;m building humanoid robots at{" "}
              <OrgIcon src="/assets/images/AXIBO-logo.png" alt="AXIBO" />
              <a href="https://axibo.com" className={inkLink}>
                AXIBO
              </a>
              . Before that: perception and pathing on{" "}
              <OrgIcon src="/assets/images/wato-logo.png" alt="WATonomous" />
              <a href="https://watonomous.ca" className={inkLink}>
                WATonomous
              </a>
              &apos; rover, and I directed{" "}
              <OrgIcon
                src="/assets/images/churchill-logo.png"
                alt="Churchill Robotics"
              />
              Churchill Robotics — 10+ teams, 150+ members.
            </p>

            <p className={cn(prose, "mt-5")}>
              My goal is to contribute to{" "}
              <OrgIcon src="/assets/icons/neuralink.jpeg" alt="Neuralink" />
              <a href="https://neuralink.com" className={inkLink}>
                Neuralink
              </a>
              . Away from robots I play piano, violin, flute, and alto sax —
              and, currently,{" "}
              <OrgIcon src="/assets/icons/balatro.png" alt="Balatro" />
              Balatro.
            </p>

            <p className={cn(prose, "mt-7 text-[15px] text-text-muted")}>
              some things I&apos;ve built —
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-6">
              {columns.map((col, ci) => (
                <ul key={ci} className="space-y-[5px]">
                  {col.map((p) => (
                    <li key={p.slug}>
                      <button
                        type="button"
                        onClick={() => openProject(p)}
                        className={cn(
                          "text-left font-serif text-[15px] leading-snug",
                          inkLink
                        )}
                      >
                        {p.title}
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 font-serif text-xs">
              <a href="https://x.com/symm7534" className={quietLink}>
                x
              </a>
              <a
                href="https://www.linkedin.com/in/ryan-muxi-wang/"
                className={quietLink}
              >
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
              <Link href={RESUME_PATH} target="_blank" className={quietLink}>
                resume
              </Link>
            </div>

            <div className="mt-2 flex items-center gap-x-4 font-serif text-xs">
              <Link
                href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=prev`}
                aria-label="Previous site in tron webring"
                className={quietLink}
              >
                ←
              </Link>
              <Link
                href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}`}
                target="_blank"
                rel="noreferrer"
                className={quietLink}
              >
                tron webring
              </Link>
              <Link
                href={`${WEBRING_BASE_URL}/#${WEBRING_SITE}?nav=next`}
                aria-label="Next site in tron webring"
                className={quietLink}
              >
                →
              </Link>
              <span className="ml-auto opacity-60 [&_svg]:size-4">
                <ThemeToggle />
              </span>
            </div>

            <form
              className="mt-7"
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
          </div>
        </section>

        {/* Art — his own robot hand, halftoned */}
        <section className="relative flex min-h-[380px] items-center justify-center border-t border-border-card px-6 py-8 lg:h-full lg:min-h-0 lg:border-l lg:border-t-0 lg:py-0">
          <DitherHand
            src="/assets/projects/robot-hand/finalcad_hero.png"
            className="h-[70vh] max-h-[560px] w-full max-w-[620px] lg:h-[76%] lg:max-h-none"
          />
          <span className="absolute bottom-5 right-6 font-serif text-xs text-text-muted/70">
            the hand, 5-dof —{" "}
            <button
              type="button"
              onClick={() => {
                const hand = projects.find((p) => p.slug === "robot-hand");
                if (hand) openProject(hand);
              }}
              className={quietLink}
            >
              see it real
            </button>
          </span>
        </section>
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => openProject(null)}
      />
    </>
  );
}
