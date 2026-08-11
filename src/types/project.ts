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
  /** intrinsic pixel size of imageSrc — lets next/image reserve layout and pick srcset */
  imageWidth?: number;
  imageHeight?: number;
  altText?: string;
  title: string;
  caption: string;
  href?: string;
  /** gated behind the secret link — only shown once the visitor has unlocked */
  hidden?: boolean;
  /** pinned to the top of the right column in the projects grid */
  pinned?: boolean;
  description?: string;
  techStack?: string[];
  links?: { label: string; url: string }[];
  images?: ProjectImage[];
  videoUrl?: string;
  videoAspect?: string;
}
