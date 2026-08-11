export interface SocialLink {
  label: string;
  href: string;
}

/**
 * Social links rendered in the left-panel links row.
 * Single source of truth — components must render from this list.
 */
export const socialLinks: SocialLink[] = [
  { label: "x", href: "https://x.com/symm7534" },
  { label: "linkedin", href: "https://www.linkedin.com/in/ryan-muxi-wang/" },
  { label: "github", href: "https://github.com/sym7534" },
  { label: "devpost", href: "https://devpost.com/ryan-muxiwang" },
  { label: "email", href: "mailto:ryan.muxiwang@gmail.com" },
];
