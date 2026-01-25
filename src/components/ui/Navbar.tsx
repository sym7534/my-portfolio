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
    <nav className={cn("flex items-center gap-20", className)}>
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
    <Image
      src="/assets/icons/devpost.svg"
      alt="Devpost"
      width={24}
      height={24}
      className={className}
    />
  );
}

export function EmailIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/email.svg"
      alt="Email"
      width={24}
      height={24}
      className={className}
    />
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/linkedin.svg"
      alt="LinkedIn"
      width={24}
      height={24}
      className={className}
    />
  );
}

export function GitHubIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/assets/icons/github.svg"
      alt="GitHub"
      width={24}
      height={24}
      className={className}
    />
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
