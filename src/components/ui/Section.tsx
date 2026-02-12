import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
}

/**
 * Content section with optional header.
 * Headers use the section text color (#7d7575) and 30px font size.
 */
export function Section({
  children,
  className,
  title,
  titleClassName,
}: SectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      {title && (
        <h2
          className={cn(
            "mb-6 font-serif text-lg text-text-primary tracking-wide",
            titleClassName
          )}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
