import React, { HTMLAttributes } from "react";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  onDismiss?: () => void;
}

export function Alert({
  children,
  className = "",
  variant = "info",
  title,
  onDismiss,
  ...props
}: AlertProps) {
  const variantStyles = {
    info: "bg-cyan-950/40 border-cyan-700/60 text-cyan-200",
    success: "bg-emerald-950/40 border-emerald-700/60 text-emerald-200",
    warning: "bg-amber-950/40 border-amber-700/60 text-amber-200",
    danger: "bg-rose-950/40 border-rose-700/60 text-rose-200",
  };

  const iconMap = {
    info: (
      <svg
        className="w-5 h-5 text-cyan-400 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeWidth="2" strokeLinecap="round" d="M12 16v-4m0-4h.01" />
      </svg>
    ),
    success: (
      <svg
        className="w-5 h-5 text-emerald-400 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
    ),
    warning: (
      <svg
        className="w-5 h-5 text-amber-400 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    danger: (
      <svg
        className="w-5 h-5 text-rose-400 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
      </svg>
    ),
  };

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-2xl border p-4 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <div className="mt-0.5">{iconMap[variant]}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm mb-1 text-white">{title}</h4>}
        <div className="text-xs leading-relaxed text-slate-300">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
