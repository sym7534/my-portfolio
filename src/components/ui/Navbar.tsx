import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavbarProps {
  items: NavItem[];
  className?: string;
}

/**
 * Social links navigation row.
 * Displays icons horizontally with consistent spacing.
 */
export function Navbar({ items, className }: NavbarProps) {
  return (
    <nav className={cn("flex items-center gap-6", className)}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={cn(
            "text-text-primary hover:text-text-secondary",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-text-secondary"
          )}
        >
          <span className="size-[var(--icon-social)] flex items-center justify-center">
            {item.icon}
          </span>
        </a>
      ))}
    </nav>
  );
}

// Social icons using exported Figma assets

export function DevpostIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.002 1.61L0 12.004L6.002 22.39H17.998L24 12.004L17.998 1.61H6.002ZM7.595 5.694H11.542C15.147 5.694 17.818 7.389 17.818 12.004C17.818 16.44 14.608 18.306 11.362 18.306H7.595V5.694ZM10.112 8.143V15.857H11.353C13.999 15.857 15.215 14.307 15.215 11.996C15.224 9.427 14.119 8.143 11.448 8.143H10.112Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Skill icons using exported Figma assets

export function CppIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-cpp.svg"
      alt="C++"
      width={35}
      height={35}
      className={className}
    />
  );
}

export function PythonIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-python.svg"
      alt="Python"
      width={35}
      height={35}
      className={className}
    />
  );
}

export function TypeScriptIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-typescript.svg"
      alt="TypeScript"
      width={35}
      height={35}
      className={className}
    />
  );
}

export function HtmlIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-html.svg"
      alt="HTML"
      width={35}
      height={35}
      className={className}
    />
  );
}

export function SolidWorksIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-solidworks.svg"
      alt="SolidWorks"
      width={35}
      height={35}
      className={className}
    />
  );
}

export function NextJsIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-nextjs.svg"
      alt="Next.js"
      width={35}
      height={35}
      className={className}
    />
  );
}

export function TailwindIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-tailwind.svg"
      alt="Tailwind CSS"
      width={35}
      height={35}
      className={className}
    />
  );
}

export function RosIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-ros.svg"
      alt="ROS"
      width={35}
      height={35}
      className={className}
    />
  );
}

export function UnrealIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-unreal.svg"
      alt="Unreal Engine"
      width={35}
      height={35}
      className={className}
    />
  );
}

export function UbuntuIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/skill-ubuntu.svg"
      alt="Ubuntu"
      width={35}
      height={35}
      className={className}
    />
  );
}
