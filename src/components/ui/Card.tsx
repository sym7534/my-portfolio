"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "solid" | "gradient" | "translucent";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

/**
 * Card component with multiple variants matching Figma design.
 * - solid: Plain background (#f9f9f9)
 * - gradient: Gradient from #f9f9f9 to white (experience cards)
 * - translucent: Semi-transparent for project cards
 */
export function Card({
  children,
  className,
  variant = "solid",
  onMouseEnter,
  onMouseLeave,
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md p-4",
        variant === "solid" && "bg-bg-card",
        variant === "gradient" && "bg-gradient-to-r from-bg-card to-bg-white",
        variant === "translucent" && "bg-card-translucent",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface ExperienceCardProps {
  logo: React.ReactNode;
  title: string;
  subtitle: string;
  date: string;
  description?: string;
  skills?: string[];
  isExpanded?: boolean;
  titleSize?: number;
  onTitleSizeChange?: (size: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  className?: string;
}

const MAX_TITLE_SIZE = 30;
const MIN_TITLE_SIZE = 14;

/**
 * Skill tag pill for experience cards.
 */
function SkillTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-white rounded-sm px-2 py-0.5 text-[12px] text-[#777] font-serif">
      {children}
    </span>
  );
}

/**
 * Experience card with logo, title, subtitle, and date.
 * Expands on hover/tap to show description and skills.
 */
export function ExperienceCard({
  logo,
  title,
  subtitle,
  date,
  description,
  skills,
  isExpanded = false,
  titleSize,
  onTitleSizeChange,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
}: ExperienceCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isControlled = typeof titleSize === "number";
  const [titleFontSize, setTitleFontSize] = useState(MAX_TITLE_SIZE);
  const effectiveTitleSize = isControlled ? titleSize : titleFontSize;
  const currentSizeRef = useRef(effectiveTitleSize);

  useEffect(() => {
    currentSizeRef.current = effectiveTitleSize;
  }, [effectiveTitleSize]);

  useEffect(() => {
    const element = titleRef.current;
    if (!element) {
      return;
    }

    let frameId: number | null = null;

    const fitTitle = () => {
      frameId = null;
      const available = element.clientWidth;
      const required = element.scrollWidth;
      if (!available || !required) {
        return;
      }

      const currentSize = currentSizeRef.current;
      const requiredAtMax = required * (MAX_TITLE_SIZE / currentSize);
      if (requiredAtMax <= available) {
        if (!isControlled && currentSize !== MAX_TITLE_SIZE) {
          setTitleFontSize(MAX_TITLE_SIZE);
        }
        return;
      }

      const nextSize = Math.max(
        MIN_TITLE_SIZE,
        Math.floor(currentSize * (available / required))
      );

      if (nextSize < currentSize) {
        if (isControlled) {
          onTitleSizeChange?.(nextSize);
          return;
        }

        setTitleFontSize(nextSize);
        onTitleSizeChange?.(nextSize);
      }
    };

    const scheduleFit = () => {
      if (frameId !== null) {
        return;
      }
      frameId = window.requestAnimationFrame(fitTitle);
    };

    scheduleFit();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(scheduleFit);
      observer.observe(element);

      return () => {
        if (frameId !== null) {
          window.cancelAnimationFrame(frameId);
        }
        observer.disconnect();
      };
    }

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isControlled, onTitleSizeChange, title, titleSize]);

  return (
    <Card
      variant="gradient"
      className={cn(
        "[container-type:inline-size] border transition-colors duration-200 cursor-pointer p-2",
        isExpanded ? "border-[#e7e7e7]" : "border-transparent hover:border-text-secondary/30",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* Header row */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 size-[var(--icon-logo)] rounded-md overflow-hidden">
          {logo}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            ref={titleRef}
            className="font-serif text-text-primary leading-snug whitespace-nowrap"
            style={{ fontSize: `${effectiveTitleSize}px` }}
          >
            {title}
          </h3>
          <p className="font-serif text-xs text-text-muted italic">
            {subtitle}
          </p>
        </div>
        <span className="flex-shrink-0 font-serif text-xs text-text-secondary underline text-nowrap">
          {date}
        </span>
      </div>

      {/* Expandable content */}
      {(description || skills) && (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="pt-3">
              {description && (
                <p className="font-serif text-[14px] text-text-secondary leading-normal mb-2">
                  {description}
                </p>
              )}
              {skills && skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <SkillTag key={skill}>{skill}</SkillTag>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
