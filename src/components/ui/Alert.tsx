import React, { HTMLAttributes } from "react";

export type AlertVariant =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "ok"
  | "warn"
  | "fail";

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
  const variantStyles: Record<AlertVariant, string> = {
    info:    "bg-blue-50   border-blue-200   text-blue-900   dark:bg-indigo-950/40  dark:border-indigo-800/80  dark:text-indigo-200",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-200",
    ok:      "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800/80 dark:text-emerald-200",
    warning: "bg-amber-50  border-amber-200  text-amber-900  dark:bg-amber-950/40   dark:border-amber-800/80   dark:text-amber-200",
    warn:    "bg-amber-50  border-amber-200  text-amber-900  dark:bg-amber-950/40   dark:border-amber-800/80   dark:text-amber-200",
    danger:  "bg-rose-50   border-rose-200   text-rose-900   dark:bg-rose-950/40    dark:border-rose-800/80    dark:text-rose-200",
    fail:    "bg-rose-50   border-rose-200   text-rose-900   dark:bg-rose-950/40    dark:border-rose-800/80    dark:text-rose-200",
  };

  const iconColorMap: Record<AlertVariant, string> = {
    info:    "text-blue-600 dark:text-indigo-400",
    success: "text-emerald-600 dark:text-emerald-400",
    ok:      "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    warn:    "text-amber-600 dark:text-amber-400",
    danger:  "text-rose-600 dark:text-rose-400",
    fail:    "text-rose-600 dark:text-rose-400",
  };

  const getIcon = (v: AlertVariant) => {
    if (v === "info") {
      return (
        <svg
          className={`w-4 h-4 ${iconColorMap[v]} shrink-0`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeWidth="2" strokeLinecap="round" d="M12 16v-4m0-4h.01" />
        </svg>
      );
    }
    if (v === "success" || v === "ok") {
      return (
        <svg
          className={`w-4 h-4 ${iconColorMap[v]} shrink-0`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    if (v === "warning" || v === "warn") {
      return (
        <svg
          className={`w-4 h-4 ${iconColorMap[v]} shrink-0`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );
    }
    // danger / fail
    return (
      <svg
        className={`w-4 h-4 ${iconColorMap[v]} shrink-0`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeWidth="2" strokeLinecap="round" d="m15 9-6 6m0-6 6 6" />
      </svg>
    );
  };

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 text-xs transition-colors duration-150 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon(variant)}</div>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-text-1 mb-1 text-sm">{title}</h4>
          )}
          <div className="leading-relaxed text-text-2">{children}</div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Tutup notifikasi"
            className="text-text-3 hover:text-text-1 transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
