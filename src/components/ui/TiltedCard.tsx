"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  title?: string;
  caption?: string;
  className?: string;
  aspectRatio?: string;
}

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

/**
 * 3D tilting card with spring physics.
 * Tilts based on mouse position, scales on hover, and shows overlay content.
 */
export function TiltedCard({
  imageSrc,
  altText = "Project image",
  scaleOnHover = 1.05,
  rotateAmplitude = 12,
  title,
  caption,
  className,
  aspectRatio,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  function handleMouse(e: React.MouseEvent) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <figure
      ref={ref}
      className={cn("relative cursor-pointer [perspective:800px]", className)}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full rounded-md overflow-hidden bg-gradient-to-b from-transparent from-[60%] to-card-caption"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image container with aspect ratio */}
        <div className="relative" style={{ aspectRatio: aspectRatio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover"
          />
          {/* Gradient fade at bottom of image */}
          {(title || caption) && (
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-card-caption to-transparent pointer-events-none" />
          )}
        </div>

        {/* Caption area below image */}
        {(title || caption) && (
          <div className="bg-card-caption px-3 py-2 sm:px-4 sm:py-3 -mt-px">
            {title && (
              <h3 className="font-serif text-[clamp(14px,4vw,25px)] text-text-primary leading-tight">
                {title}
              </h3>
            )}
            {caption && (
              <p className="font-serif text-[clamp(11px,2.5vw,16px)] text-text-secondary leading-tight hidden sm:block">
                {caption}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </figure>
  );
}
