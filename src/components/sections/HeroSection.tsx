import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { TypedHeading } from "@/components/TypedHeading";
import { InlineIcon } from "@/components/InlineIcon";
import { BIO, UWATERLOO_URL } from "@/data/site";
import { inkLink } from "@/lib/styles";

/** Hero: typed name, divider, school line, bio. Server component. */
export function HeroSection() {
  return (
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
  );
}
