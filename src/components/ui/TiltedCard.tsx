"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  overlayContent?: React.ReactNode;
  className?: string;
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
  overlayContent,
  className,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const overlayOpacity = useSpring(0);

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
    overlayOpacity.set(1);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    overlayOpacity.set(0);
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
        className="relative w-full h-full rounded-md overflow-hidden"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: "preserve-3d",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={altText}
          className="w-full h-full object-cover"
        />

        {overlayContent && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-end p-4"
            style={{ opacity: overlayOpacity }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>
    </figure>
  );
}
