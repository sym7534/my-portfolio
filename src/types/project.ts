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
  description?: string;
  techStack?: string[];
  links?: { label: string; url: string }[];
  images?: ProjectImage[];
  videoUrl?: string;
  videoAspect?: string;
}
