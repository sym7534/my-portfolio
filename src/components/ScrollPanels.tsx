"use client";

import { useRef } from "react";
import { MotionConfig } from "motion/react";
import { Container, Panel, ScrollIndicator } from "@/components";
import { CursorTrail } from "@/components/CursorTrail";
import { LenisScroll } from "@/components/LenisScroll";

/**
 * Client shell for the two-panel layout: owns the right-panel ref shared by
 * Lenis smooth scrolling and the scroll indicator, and hosts MotionConfig so
 * every animation respects prefers-reduced-motion. Panel content is passed in
 * as children, so the sections themselves can stay server components.
 */
export function ScrollPanels({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  const rightPanelRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      <LenisScroll scrollRef={rightPanelRef} />
      <Container>
        <Panel side="left" className="flex flex-col">
          {left}
        </Panel>
        <Panel
          side="right"
          ref={rightPanelRef}
          className="lg:border-l lg:border-border-card"
        >
          {right}
        </Panel>
      </Container>
      <ScrollIndicator scrollRef={rightPanelRef} />
      <CursorTrail />
    </MotionConfig>
  );
}
