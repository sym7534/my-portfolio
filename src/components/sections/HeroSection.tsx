import Link from "next/link";
import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
// Typing animation temporarily off; restore this import and the
// <TypedHeading /> below (and remove the static <h1>) to bring it back.
// import { TypedHeading } from "@/components/TypedHeading";
import { TYPED_NAME } from "@/data/site";
import { InlineIcon } from "@/components/InlineIcon";
import { contact, intro, type IntroSegment } from "@/data/intro";
// import { lifetimeGoals, LIFETIME_LEAD } from "@/data/intro";
import { inkLink } from "@/lib/styles";

function renderSegments(segments: IntroSegment[]) {
  return segments.map((segment, i) => {
    if (typeof segment === "string") {
      return <Fragment key={i}>{segment}</Fragment>;
    }
    const label = segment.href ? (
      <Link
        href={segment.href}
        className={segment.plain ? "text-inherit no-underline" : inkLink}
      >
        {segment.text}
      </Link>
    ) : (
      segment.text
    );
    if (!segment.icon) return <Fragment key={i}>{label}</Fragment>;
    return (
      <span key={i} className="inline-flex items-baseline gap-1">
        <InlineIcon icon={segment.icon} />
        {label}
      </span>
    );
  });
}

const prose = "font-serif text-[15px] leading-[1.63] text-text-secondary";

/** Hero: name, handwritten intro, lifetime goals and contact line. Server component. */
export function HeroSection() {
  return (
    <Section className="mb-[clamp(1rem,3vh,2rem)]">
      {/* <TypedHeading className="text-[clamp(2.1rem,1.8rem+1.2vw,2.5rem)] font-bold leading-[1.15]" /> */}
      <h1 className="font-serif text-[clamp(2.1rem,1.8rem+1.2vw,2.5rem)] font-bold leading-[1.15] text-text-primary">
        {TYPED_NAME}
      </h1>
      {/* No rule under the name: spacing alone separates it from the intro,
          slightly more than the 12px between paragraphs. */}
      <div className="mt-5 space-y-3">
        {intro.map((paragraph, i) => (
          <p key={i} className={prose}>
            {renderSegments(paragraph)}
          </p>
        ))}
        {/* Lifetime goals temporarily hidden; uncomment this block and the
            imports above to restore.
        <div>
          <p className={prose}>{LIFETIME_LEAD}</p>
          <ul className={prose}>
            {lifetimeGoals.map((goal, i) => (
              <li key={i}>{renderSegments(goal)}</li>
            ))}
          </ul>
        </div>
        */}
        <p className={prose}>{renderSegments(contact)}</p>
      </div>
    </Section>
  );
}
