import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main layout container implementing the split-panel design.
 * On desktop it occupies the centre 57.5% of the viewport (never narrower
 * than 64rem), leaving about 21% empty on each side.
 * Left panel: white background for main content
 * Right panel: light gray background for secondary content
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "grid min-h-screen lg:h-screen lg:overflow-hidden grid-cols-1 lg:grid-cols-[2fr_3fr] lg:mx-auto lg:w-[max(57.5vw,min(64rem,100%))]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface PanelProps {
  children: React.ReactNode;
  className?: string;
  side: "left" | "right";
}

/**
 * Panel component for left/right sections of the split layout
 * Left panel is sticky (doesn't scroll), right panel scrolls independently
 */
export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ children, className, side }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-8 lg:p-16",
        side === "left" && "bg-bg-white lg:h-full lg:overflow-y-auto",
        side === "right" && "bg-bg-light lg:h-full lg:overflow-y-auto",
        className
      )}
    >
      {children}
    </div>
  )
);

Panel.displayName = "Panel";
