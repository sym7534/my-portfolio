import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { socialLinks } from "@/data/socials";
import { RESUME_PATH } from "@/data/site";
import { quietLink } from "@/lib/styles";

/** Social links row + resume + theme toggle. Server component. */
export function LinksRow() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-[clamp(1rem,3vh,2rem)] font-serif text-[13px]">
      {socialLinks.map((link) => (
        <a key={link.label} href={link.href} className={quietLink}>
          {link.label}
        </a>
      ))}
      <Link href={RESUME_PATH} target="_blank" rel="noopener noreferrer" className={quietLink}>
        resume
      </Link>
      <span className="ml-auto opacity-60 [&_svg]:size-4">
        <ThemeToggle />
      </span>
    </div>
  );
}
