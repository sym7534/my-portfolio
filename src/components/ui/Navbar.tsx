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
            "transition-all duration-200",
            "hover:scale-110 hover:-translate-y-0.5",
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

export function EmailIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M1.5 8.67V17.25C1.5 18.0456 1.81607 18.8087 2.37868 19.3713C2.94129 19.9339 3.70435 20.25 4.5 20.25H19.5C20.2956 20.25 21.0587 19.9339 21.6213 19.3713C22.1839 18.8087 22.5 18.0456 22.5 17.25V8.67L13.572 14.163C13.0992 14.4539 12.5551 14.6078 12 14.6078C11.4449 14.6078 10.9008 14.4539 10.428 14.163L1.5 8.67Z" fill="currentColor" />
      <path d="M22.5 6.908V6.75C22.5 5.95435 22.1839 5.19129 21.6213 4.62868C21.0587 4.06607 20.2956 3.75 19.5 3.75H4.5C3.70435 3.75 2.94129 4.06607 2.37868 4.62868C1.81607 5.19129 1.5 5.95435 1.5 6.75V6.908L11.214 12.886C11.4504 13.0314 11.7225 13.1084 12 13.1084C12.2775 13.1084 12.5496 13.0314 12.786 12.886L22.5 6.908Z" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166L20.447 20.452ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z" fill="currentColor" />
    </svg>
  );
}

export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 -2 20 20" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g transform="translate(-60, -7521)" fill="currentColor">
        <g transform="translate(56, 160)">
          <path d="M10.29,7377 C17.837,7377 21.965,7370.84365 21.965,7365.50546 C21.965,7365.33021 21.965,7365.15595 21.953,7364.98267 C22.756,7364.41163 23.449,7363.70276 24,7362.8915 C23.252,7363.21837 22.457,7363.433 21.644,7363.52751 C22.5,7363.02244 23.141,7362.2289 23.448,7361.2926 C22.642,7361.76321 21.761,7362.095 20.842,7362.27321 C19.288,7360.64674 16.689,7360.56798 15.036,7362.09796 C13.971,7363.08447 13.518,7364.55538 13.849,7365.95835 C10.55,7365.79492 7.476,7364.261 5.392,7361.73762 C4.303,7363.58363 4.86,7365.94457 6.663,7367.12996 C6.01,7367.11125 5.371,7366.93797 4.8,7366.62489 L4.8,7366.67608 C4.801,7368.5989 6.178,7370.2549 8.092,7370.63591 C7.488,7370.79836 6.854,7370.82199 6.24,7370.70483 C6.777,7372.35099 8.318,7373.47829 10.073,7373.51078 C8.62,7374.63513 6.825,7375.24554 4.977,7375.24358 C4.651,7375.24259 4.325,7375.22388 4,7375.18549 C5.877,7376.37088 8.06,7377 10.29,7376.99705" />
        </g>
      </g>
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
