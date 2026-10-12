import { FadeUp, ScrollReveal } from "@/components/Reveal";
import { ScrollPanels } from "@/components/ScrollPanels";
import { VisitPing } from "@/components/VisitPing";
import { NowPlaying } from "@/components/NowPlaying";
import { Section } from "@/components/ui/Section";
import { HeroSection } from "@/components/sections/HeroSection";
import { LinksRow } from "@/components/sections/LinksRow";
// Message box temporarily hidden — uncomment both this import and the
// <MessageForm /> below to restore it.
// import { MessageForm } from "@/components/sections/MessageForm";
import { FooterSection } from "@/components/sections/FooterSection";
// Masthead (halftone robot) temporarily hidden â€” uncomment both this import
// and the <Masthead /> below to restore it.
// import { Masthead } from "@/components/sections/Masthead";
import { ProjectsSection } from "@/components/sections/ProjectsSection";

// The original page-level stagger: delayChildren 0.15 + staggerChildren 0.08
// per section, reproduced as explicit delays so each section stays standalone.
const STAGGER_BASE = 0.15;
const STAGGER_STEP = 0.08;
const staggerDelay = (i: number) => STAGGER_BASE + i * STAGGER_STEP;

/**
 * Landing page â€” a server component. Static sections render as RSC; the
 * interactive bits (message box, projects modal,
 * masthead, animations) are isolated client islands.
 */
export default function Home() {
  return (
    <>
      <VisitPing />
      <ScrollPanels
        left={
          <>
            <div>
              <FadeUp delay={staggerDelay(0)}>
                <HeroSection />
              </FadeUp>
              <FadeUp delay={staggerDelay(1)}>
                <LinksRow />
              </FadeUp>
              {/* <MessageForm /> */}
              <FadeUp delay={staggerDelay(2)}>
                <Section className="mt-[clamp(0.75rem,2vh,1.25rem)]">
                  <NowPlaying />
                </Section>
              </FadeUp>
              <FooterSection />
            </div>
          </>
        }
        right={
          <>
            {/* <Masthead /> */}
            <ScrollReveal>
              <ProjectsSection />
            </ScrollReveal>
          </>
        }
      />
    </>
  );
}
