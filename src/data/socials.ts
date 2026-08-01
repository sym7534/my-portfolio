export type SocialIconKey =
  | "devpost"
  | "email"
  | "linkedin"
  | "github"
  | "twitter";

export interface SocialLink {
  label: string;
  href: string;
  iconKey: SocialIconKey;
}

export const socialLinks: SocialLink[] = [
  { label: "Devpost", href: "https://devpost.com/ryan-muxiwang", iconKey: "devpost" },
  { label: "Email", href: "mailto:ryan.muxiwang@gmail.com", iconKey: "email" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ryan-muxi-wang/", iconKey: "linkedin" },
  { label: "GitHub", href: "https://github.com/sym7534", iconKey: "github" },
  { label: "Twitter", href: "https://x.com/symm7534", iconKey: "twitter" },
];
