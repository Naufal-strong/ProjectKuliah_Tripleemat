import React, { forwardRef, ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isEffectivelyDisabled = disabled || isLoading;

    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 select-none cursor-pointer aria-disabled:opacity-50 aria-disabled:cursor-not-allowed";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-sm px-4 py-2.5 gap-2 min-h-[40px]",
      lg: "text-base px-6 py-3 gap-2.5 min-h-[48px]",
    };

    /**
     * Variant styles — sem gradient, sem shadow berwarna.
     * Tombol primer: latar aksen SOLID, teks accent-text (#020617).
     * Kontras #60A5FA vs #020617 = 7.93 ✅ WCAG AA.
     * DILARANG teks putih di atas aksen (kontras hanya 2.54 ❌).
     */
    const variantStyles = {
      primary:
        "bg-accent text-accent-text hover:brightness-110 btn-3d-primary",
      secondary:
        "bg-surface-2 hover:brightness-95 text-text-1 border border-border active:brightness-90 card-3d",
      outline:
        "bg-surface-1 hover:bg-surface-2 text-text-1 border border-border-control hover:border-accent card-3d",
      danger:
        "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:bg-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      ghost:
        "bg-transparent hover:bg-surface-2 text-text-2 hover:text-text-1",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={isEffectivelyDisabled}
        aria-disabled={isEffectivelyDisabled}
        aria-busy={isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && (
          <span className="shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
