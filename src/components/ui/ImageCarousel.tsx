"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ProjectImage } from "@/types/project";
import { useIsMobile } from "@/lib/useMediaQuery";

interface ImageCarouselProps {
  images: ProjectImage[];
}

interface Spans { colSpan: number; rowSpan: number }

function getSpans(w: number, h: number, cols: number): Spans {
  const r = w / h;
  if (r > 2.2) return { colSpan: cols, rowSpan: 1 };
  if (r > 1.3) return { colSpan: Math.min(2, cols), rowSpan: 1 };
  if (r < 0.7) return { colSpan: 1, rowSpan: 2 };
  return { colSpan: 1, rowSpan: 1 };
}

const HOVER_COL_SPAN = 2;

export function ImageCarousel({ images }: ImageCarouselProps) {
  const isMobile = useIsMobile();
  const gridCols = isMobile ? 2 : 3;

  const [aspectMap, setAspectMap]   = useState<Record<number, Spans>>({});
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [pinnedPos, setPinnedPos]   = useState<Record<number, { col: number; row: number }>>({});
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Close on Escape
  useEffect(() => {
    if (selectedIdx === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedIdx(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIdx]);

  const handleLoad = useCallback((idx: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setAspectMap(prev => ({ ...prev, [idx]: getSpans(img.naturalWidth, img.naturalHeight, gridCols) }));
  }, [gridCols]);

  const handleMouseEnter = useCallback((idx: number) => {
    if (isMobile) return;
    const el = itemRefs.current[idx];
    if (el) {
      const s = window.getComputedStyle(el);
      const col = parseInt(s.gridColumnStart);
      const row = parseInt(s.gridRowStart);
      if (!isNaN(col) && !isNaN(row)) {
        const clampedCol = Math.min(col, gridCols - HOVER_COL_SPAN + 1);
        setPinnedPos(prev => ({ ...prev, [idx]: { col: clampedCol, row } }));
      }
    }
    setHoveredIdx(idx);
  }, [isMobile, gridCols]);

  const allImages  = images;
  const largeImages = allImages.filter(img => img.span === "large");
  const gridImages  = allImages.filter(img => img.span !== "large");

  const selectedImg = selectedIdx !== null ? gridImages[selectedIdx] : null;

  // ≤4 images: simple stacked list
  if (images.length <= 4) {
    return (
      <div className="flex flex-col gap-2">
        {images.map((img, i) => (
          <div key={i} className="rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt ?? ""} className="w-full h-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Large hero images */}
        {largeImages.map((img, i) => (
          <div key={`large-${i}`} className="rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.alt ?? ""} className="w-full h-auto" />
          </div>
        ))}

        {/* Aspect-ratio grid */}
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gridAutoFlow: "dense",
            alignItems: "start",
          }}
          onMouseLeave={() => { if (!isMobile) setHoveredIdx(null); }}
        >
          {gridImages.map((img, i) => {
            const spans     = aspectMap[i] ?? { colSpan: 1, rowSpan: 1 };
            const isHovered = !isMobile && hoveredIdx === i;
            const pos       = pinnedPos[i];

            const gridColumn = isHovered && pos
              ? `${pos.col} / span ${HOVER_COL_SPAN}`
              : `span ${spans.colSpan}`;

            return (
              <div
                key={img.src}
                ref={el => { itemRefs.current[i] = el; }}
                className="rounded-lg overflow-hidden cursor-pointer"
                style={{ gridColumn, position: "relative", zIndex: isHovered ? 10 : 1 }}
                onMouseEnter={() => handleMouseEnter(i)}
                onClick={() => setSelectedIdx(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt ?? ""}
                  className="w-full h-auto"
                  style={{
                    filter: isHovered ? "brightness(1.06)" : "brightness(1)",
                    transform: isHovered ? "scale(1.03)" : "scale(1)",
                    transition: "filter 0.2s ease, transform 0.2s ease",
                    transformOrigin: "center",
                  }}
                  onLoad={e => handleLoad(i, e)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && selectedImg && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[200] bg-black/60 cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedIdx(null)}
            />

            {/* Expanded image — shared layout from grid */}
            <div
              className="fixed inset-0 z-[201] flex items-center justify-center pointer-events-none p-4 lg:p-8"
            >
              <motion.img
                key={selectedIdx}
                src={selectedImg.src}
                alt={selectedImg.alt ?? ""}
                className="max-w-full max-h-[85vh] rounded-lg object-contain pointer-events-auto cursor-pointer shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSelectedIdx(null)}
              />
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
