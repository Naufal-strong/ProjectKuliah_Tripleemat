import React, { HTMLAttributes } from "react";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  showValueLabel?: boolean;
  colorScheme?: "dynamic" | "cyan" | "emerald" | "amber" | "rose";
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValueLabel = true,
  colorScheme = "dynamic",
  size = "md",
  className = "",
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const getColorClass = () => {
    if (colorScheme === "cyan") return "bg-cyan-500 shadow-cyan-500/50";
    if (colorScheme === "emerald") return "bg-emerald-500 shadow-emerald-500/50";
    if (colorScheme === "amber") return "bg-amber-500 shadow-amber-500/50";
    if (colorScheme === "rose") return "bg-rose-500 shadow-rose-500/50";

    // Dynamic based on percentage
    if (percentage >= 80) return "bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-emerald-500/50";
    if (percentage >= 50) return "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-amber-500/50";
    return "bg-gradient-to-r from-rose-600 to-red-500 shadow-rose-500/50";
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`} {...props}>
      {(label || showValueLabel) && (
        <div className="flex justify-between items-center text-xs text-slate-300 font-medium">
          {label && <span>{label}</span>}
          {showValueLabel && (
            <span className="font-mono text-slate-200">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
        className={`w-full rounded-full bg-slate-800/80 overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 shadow-sm ${getColorClass()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
