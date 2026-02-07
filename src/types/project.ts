export interface Project {
  category: "software" | "mechanical" | "both";
  imageSrc?: string;
  altText?: string;
  aspectRatio?: string;
  title: string;
  caption: string;
  href?: string;
  description?: string;
  techStack?: string[];
  links?: { label: string; url: string }[];
}
