"use client";

import { useState } from "react";
import type { ProjectImage } from "@/types/project";

interface ImageCarouselProps {
  images: ProjectImage[];
}

const COLS = 4;
const EXPAND_FR = 3;

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [hovered, setHovered] = useState<{ col: number; row: number } | null>(null);

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

  // 5+ images: grid with hover expand
  const largeImages = images.filter((img) => img.span === "large");
  const smallImages = images.filter((img) => img.span !== "large");
  const rowCount = Math.ceil(smallImages.length / COLS);

  // Build grid templates
  const colTemplate = Array.from({ length: COLS }, (_, c) =>
    hovered && hovered.col === c ? `${EXPAND_FR}fr` : "1fr"
  ).join(" ");

  const rowTemplate = Array.from({ length: rowCount }, (_, r) =>
    hovered && hovered.row === r ? `${EXPAND_FR}fr` : "1fr"
  ).join(" ");

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

      {/* Small images: CSS Grid with animated templates */}
      <div
        className="grid gap-2 h-[50vh] transition-[grid-template-columns,grid-template-rows] duration-300 ease-out"
        style={{
          gridTemplateColumns: colTemplate,
          gridTemplateRows: rowTemplate,
        }}
        onMouseLeave={() => setHovered(null)}
      >
        {smallImages.map((img, i) => {
          const col = i % COLS;
          const row = Math.floor(i / COLS);

          return (
            <div
              key={i}
              className="rounded-lg overflow-hidden"
              style={{
                gridColumn: col + 1,
                gridRow: row + 1,
              }}
              onMouseEnter={() => setHovered({ col, row })}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt ?? ""}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
