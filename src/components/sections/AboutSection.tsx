import { Fragment } from "react";
import { Section } from "@/components/ui/Section";
import { QuietHeader } from "@/components/ui/QuietHeader";
import { AboutLi } from "@/components/ui/AboutLi";
import { InlineIcon } from "@/components/InlineIcon";
import { aboutItems, type AboutSegment } from "@/data/about";

function renderAboutSegments(segments: AboutSegment[]) {
  return segments.map((segment, i) =>
    typeof segment === "string" ? (
      <Fragment key={i}>{segment}</Fragment>
    ) : (
      <span
        key={i}
        className={`inline-flex items-baseline gap-1 ${i === 0 ? "" : "ml-2"}`}
      >
        <InlineIcon icon={segment.icon} />
        {segment.label}
      </span>
    )
  );
}

/** About list. Server component (AboutLi handles its own hover state). */
export function AboutSection() {
  return (
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
  );
}
