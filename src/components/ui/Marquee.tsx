import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
}

/**
 * CSS-only infinite ticker: two identical halves inside a max-content track,
 * translated -50% for a seamless loop. Pauses on hover/focus; renders as a
 * static scrollable row under prefers-reduced-motion.
 */
export function Marquee({ items, className }: MarqueeProps) {
  const half = (hidden: boolean) => (
    <ul className="marquee-half" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center">
          <span className="whitespace-nowrap py-3 font-mono text-xs lowercase tracking-[0.2em] text-text-secondary">
            {item}
          </span>
          <span aria-hidden="true" className="mx-10 text-[9px] text-accent">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee border-y border-border-card", className)}>
      <div className="marquee-track">
        {half(false)}
        {half(true)}
      </div>
    </div>
  );
}
