import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "icon";
  size?: "sm" | "md" | "lg";
}

/**
 * Button component with multiple variants.
 * - default: Standard button styling
 * - ghost: Transparent background with hover effect
 * - icon: Minimal styling for icon-only buttons (like the arrow)
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-serif transition-colors duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-text-secondary focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "default" && "bg-bg-card text-text-primary hover:bg-bg-light rounded-sm",
          variant === "ghost" && "bg-transparent text-text-primary hover:bg-bg-light rounded-sm",
          variant === "icon" && "bg-transparent text-text-secondary hover:text-text-primary",
          // Sizes
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-4 py-2 text-base",
          size === "lg" && "px-6 py-3 text-lg",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
