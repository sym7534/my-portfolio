"use client";

import type { ProjectImage } from "@/types/project";

interface ImageCarouselProps {
  images: ProjectImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  // 4 or fewer images: show at full natural aspect ratio
  if (images.length <= 4) {
    return (
      <div className="flex flex-col gap-2">
        {images.map((img, i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt ?? ""}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    );
  }

  // 5+ images: manual 4-column layout with hover expand
  const largeImages = images.filter((img) => img.span === "large");
  const smallImages = images.filter((img) => img.span !== "large");

  // Distribute small images round-robin into 4 columns
  const columns: ProjectImage[][] = [[], [], [], []];
  smallImages.forEach((img, i) => columns[i % 4].push(img));

  return (
    <div className="flex flex-col gap-2">
      {/* Large images: full width, no hover effect */}
      {largeImages.map((img, i) => (
        <div key={`large-${i}`} className="rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt ?? ""}
            className="w-full h-auto"
          />
        </div>
      ))}

      {/* Small images: 4 fixed-height columns, hover to claim 3/4 of space */}
      <div className="flex gap-2 h-[50vh]">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col gap-2 min-w-0">
            {col.map((img, i) => (
              <div
                key={i}
                className="relative flex-1 min-h-0 rounded-lg overflow-hidden transition-[flex] duration-300 ease-out hover:flex-[6] hover:z-10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt ?? ""}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
