import React, { HTMLAttributes } from "react";

export type ProgressBarColor = "dynamic" | "ok" | "warn" | "fail" | "accent" | "info";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showValueLabel?: boolean;
  /**
   * colorScheme / variant:
   * - "dynamic": pilih warna status berdasarkan persentase (ok/warn/fail)
   * - "ok" / "warn" / "fail": warna status tetap
   * - "accent" / "info": warna brand/info (untuk progress non-status)
   */
  colorScheme?: ProgressBarColor;
  variant?: ProgressBarColor;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValueLabel = true,
  colorScheme,
  variant,
  size = "md",
  className = "",
  ...props
}: ProgressBarProps) {
  const activeColor: ProgressBarColor = colorScheme || variant || "dynamic";
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  const getColorClass = (): string => {
    if (activeColor === "ok")      return "bg-ok";
    if (activeColor === "warn")    return "bg-warn";
    if (activeColor === "fail")    return "bg-fail";
    if (activeColor === "accent" || activeColor === "info") return "bg-accent";

    // Dynamic berdasarkan persentase
    if (percentage >= 80) return "bg-ok";
    if (percentage >= 50) return "bg-warn";
    return "bg-fail";
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`} {...props}>
      {(label || showValueLabel) && (
        <div className="flex justify-between items-center text-xs text-text-2 font-medium">
          {label && <span>{label}</span>}
          {showValueLabel && (
            <span className="font-mono text-text-3 tabular-nums">
              {percentage}%
            </span>
          )}
        </div>
      )}

      {/* Track bar: bg-surface-2, border-border (WCAG 1.4.11 boundary) */}
      <div
        className={`w-full bg-surface-2 border border-border rounded-full overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || "Kemajuan"}
      >
        <div
          className={`${getColorClass()} h-full transition-[width] duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
