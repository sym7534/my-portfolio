import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

/**
 * Text input component matching the "leave me a message" design.
 * Includes an optional icon button (arrow) on the right side.
 * Features a blinking cursor effect in the placeholder.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, onIconClick, placeholder, onChange, ...props }, ref) => {
    const [hasValue, setHasValue] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      onChange?.(e);
    };

    return (
      <div className="relative flex items-center">
        <input
          ref={ref}
          className={cn(
            "w-full animate-shimmer rounded-sm px-4 py-3",
            "font-serif text-base text-text-primary",
            "focus:outline-none focus:ring-1 focus:ring-text-secondary",
            icon && "pr-14",
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {/* Custom placeholder with blinking cursor */}
        {!hasValue && placeholder && (
          <span className="absolute left-4 pointer-events-none font-serif text-base text-text-muted opacity-75">
            {placeholder}
            <span className="animate-blink">_</span>
          </span>
        )}
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            className={cn(
              "absolute right-3 flex items-center justify-center",
              "text-text-secondary hover:text-text-primary",
              "transition-colors duration-200",
              "focus:outline-none"
            )}
          >
            {icon}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/**
 * Arrow icon for the message input send button (points right)
 */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="45"
      height="18"
      viewBox="0 0 45 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 9H43M43 9L35 1M43 9L35 17"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
