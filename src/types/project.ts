export interface ProjectImage {
  src: string;
  alt?: string;
  caption?: string;
  span?: "large";
}

export interface Project {
  slug: string;
  category: "software" | "mechanical" | "both";
  imageSrc?: string;
  altText?: string;
  title: string;
  caption: string;
  href?: string;
  description?: string;
  techStack?: string[];
  links?: { label: string; url: string }[];
  images?: ProjectImage[];
}
