import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main layout container implementing the split-panel design.
 * Left panel: white background for main content
 * Right panel: light gray background for secondary content
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "grid min-h-screen grid-cols-1 lg:grid-cols-[2fr_3fr]",
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
export function Panel({ children, className, side }: PanelProps) {
  return (
    <div
      className={cn(
        "p-8 lg:p-16",
        side === "left" && "bg-bg-white lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden",
        side === "right" && "bg-bg-light",
        className
      )}
    >
      {children}
    </div>
  );
}
