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
  /** render the cover without its border and background, for transparent cutouts */
  bareImage?: boolean;
  /** shrink the cover to this fraction of the column width (0-1) and centre it */
  imageScale?: number;
  title: string;
  caption: string;
  href?: string;
  /** gated behind the secret link — only shown once the visitor has unlocked */
  hidden?: boolean;
  /** pinned to the top of the right column in the projects grid */
  pinned?: boolean;
  /** force the project into this grid column instead of the automatic placement */
  column?: "left" | "right";
  description?: string;
  techStack?: string[];
  links?: { label: string; url: string }[];
  images?: ProjectImage[];
  videoUrl?: string;
  videoAspect?: string;
}
