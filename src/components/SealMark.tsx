import { cn } from "@/lib/utils";

interface SealMarkProps {
  size?: number;
  variant?: "solid" | "outline" | "glyph";
  className?: string;
}

/**
 * Hand-drawn 王 seal mark — the site's monogram.
 * "solid" is the classic stamp (red field, paper glyph);
 * "outline" is the quiet version for chrome (header, footer).
 */
export function SealMark({ size = 32, variant = "solid", className }: SealMarkProps) {
  const glyph = (
    <g strokeWidth="5.5" strokeLinecap="round" fill="none">
      <path d="M21.5 21.5h21" />
      <path d="M24.5 32.5h15" />
      <path d="M18.5 44h27" />
      <path d="M32 21.5V44" />
    </g>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      {variant === "solid" ? (
        <>
          <rect x="2" y="2" width="60" height="60" rx="13" className="fill-seal" />
          <g className="stroke-[var(--color-bg-white)]">{glyph}</g>
        </>
      ) : variant === "glyph" ? (
        <g className="stroke-seal">{glyph}</g>
      ) : (
        <>
          <rect
            x="4"
            y="4"
            width="56"
            height="56"
            rx="12"
            strokeWidth="4"
            fill="none"
            className="stroke-seal"
          />
          <g className="stroke-seal">{glyph}</g>
        </>
      )}
    </svg>
  );
}
