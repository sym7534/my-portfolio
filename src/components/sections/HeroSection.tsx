import Link from "next/link";
import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
import { TypedHeading } from "@/components/TypedHeading";
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

/** Hero: typed name, divider, handwritten intro, lifetime goals and contact line. Server component. */
export function HeroSection() {
  return (
    <Section className="mb-[clamp(1rem,3vh,2rem)]">
      <TypedHeading className="text-[clamp(2.1rem,1.8rem+1.2vw,2.5rem)] font-bold leading-[1.15]" />
      <div className="w-full max-w-md h-px bg-border-card my-[clamp(0.75rem,2.5vh,1.5rem)]" />
      <div className="space-y-3">
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
