"use client";

import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState } from "react";

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
  /** mobile tap / keyboard toggle of the expanded state */
  onToggle?: () => void;
  className?: string;
}

const MAX_TITLE_SIZE = 21;
const MIN_TITLE_SIZE = 14;

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
  onToggle,
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

  const contentId = useId();

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-controls={description || skills ? contentId : undefined}
      className={cn(
        "[container-type:inline-size] cursor-pointer border-b border-border-card py-3 last:border-0",
        "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-text-muted",
        className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle?.();
        }
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 size-8 rounded-[3px] overflow-hidden">
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
          <p className="font-serif italic text-[13px] text-text-muted">
            {subtitle}
          </p>
        </div>
        <span className="flex-shrink-0 font-serif italic text-[13px] text-text-muted text-nowrap">
          {date}
        </span>
      </div>

      {/* Expandable content */}
      {(description || skills) && (
        <div
          id={contentId}
          className={cn(
            "grid transition-[grid-template-rows] ease-out",
            isExpanded ? "grid-rows-[1fr] duration-300" : "grid-rows-[0fr] duration-700"
          )}
        >
          <div className="overflow-hidden">
            <div className="pt-2.5">
              {description && (
                <p className="font-serif text-[14.5px] text-text-secondary leading-[1.55] mb-1.5">
                  {description}
                </p>
              )}
              {skills && skills.length > 0 && (
                <p className="font-serif italic text-[12.5px] text-text-muted">
                  {skills.join(" · ")}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
