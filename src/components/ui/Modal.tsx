"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  aside,
  className,
  ariaLabel,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay — layered haze without backdrop-blur */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Close button — fixed top-left on mobile */}
          <button
            onClick={onClose}
            className="fixed top-4 left-4 z-[60] lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white/80 hover:text-white transition-colors pointer-events-auto"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>

          {/* Content container */}
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto lg:overflow-visible lg:flex lg:items-center lg:justify-center p-0 lg:p-4 pointer-events-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className={cn("relative pointer-events-auto flex flex-col lg:flex-row lg:items-start gap-0 lg:gap-6", aside ? "w-full lg:max-w-4xl" : "w-full lg:max-w-2xl")}>
              {/* Aside — top on mobile, right side on desktop */}
              {aside && (
                <div className="order-first lg:order-last shrink-0 w-full lg:w-96 lg:max-h-[80vh] lg:overflow-y-auto pointer-events-auto px-4 pt-14 pb-4 lg:p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" onClick={(e) => e.stopPropagation()}>
                  {aside}
                </div>
              )}

              {/* Modal box */}
              <div className={cn("relative", aside ? "flex-1 min-w-0" : "w-full")}>
                {/* Close button — desktop only, floats outside top-right corner */}
                <button
                  onClick={onClose}
                  className="absolute -top-10 -right-1 z-10 w-8 h-8 hidden lg:flex items-center justify-center rounded-sm text-white/70 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <line x1="3" y1="3" x2="13" y2="13" />
                    <line x1="13" y1="3" x2="3" y2="13" />
                  </svg>
                </button>

                <div
                  ref={contentRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={ariaLabel}
                  className={cn(
                    "bg-bg-white lg:rounded-md lg:border lg:border-border-card lg:shadow-lg lg:max-h-[80vh] lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                    className
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
