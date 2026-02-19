"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { ProjectImage } from "@/types/project";

interface ImageCarouselProps {
  images: ProjectImage[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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

  // 5+ images: grid with hover expand (span 3 cols + 2 rows)
  const largeImages = images.filter((img) => img.span === "large");
  const smallImages = images.filter((img) => img.span !== "large");

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

      {/* Small images: CSS Grid, hovered image spans 3/4 cols */}
      <div
        className="grid grid-cols-4 gap-2"
        style={{ gridAutoFlow: "dense", gridAutoRows: "minmax(120px, auto)" }}
        onMouseLeave={() => setHoveredIdx(null)}
      >
        {smallImages.map((img, i) => (
          <motion.div
            key={img.src}
            layout
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="rounded-lg overflow-hidden"
            style={{
              gridColumn: hoveredIdx === i ? "span 3" : "span 1",
              gridRow: hoveredIdx === i ? "span 2" : "span 1",
            }}
            onMouseEnter={() => setHoveredIdx(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt ?? ""}
              className={`w-full ${hoveredIdx === i ? "h-auto" : "h-full object-cover"}`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
