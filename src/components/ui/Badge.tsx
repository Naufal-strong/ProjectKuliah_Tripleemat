import React, { HTMLAttributes } from "react";
import { Severity, ComplianceStatus } from "../../types";

export type BadgeVariant =
  | Severity
  | ComplianceStatus
  | "default"
  | "outline"
  | "cyan";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  className = "",
  variant = "default",
  size = "md",
  dot = false,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-semibold",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  const variantStyles: Record<BadgeVariant, string> = {
    critical: "bg-rose-950/80 text-rose-300 border-rose-700/60",
    high: "bg-red-950/80 text-red-300 border-red-700/60",
    medium: "bg-amber-950/80 text-amber-300 border-amber-700/60",
    low: "bg-sky-950/80 text-sky-300 border-sky-700/60",
    info: "bg-slate-800/80 text-slate-300 border-slate-700/60",
    passed: "bg-emerald-950/80 text-emerald-300 border-emerald-700/60",
    failed: "bg-rose-950/80 text-rose-300 border-rose-700/60",
    warning: "bg-amber-950/80 text-amber-300 border-amber-700/60",
    pending: "bg-slate-800/80 text-slate-400 border-slate-700/60",
    cyan: "bg-cyan-950/80 text-cyan-300 border-cyan-700/60",
    default: "bg-slate-800 text-slate-200 border-slate-700",
    outline: "bg-transparent text-slate-300 border-slate-700",
  };

  const dotColors: Record<BadgeVariant, string> = {
    critical: "bg-rose-400",
    high: "bg-red-400",
    medium: "bg-amber-400",
    low: "bg-sky-400",
    info: "bg-slate-400",
    passed: "bg-emerald-400",
    failed: "bg-rose-400",
    warning: "bg-amber-400",
    pending: "bg-slate-400",
    cyan: "bg-cyan-400",
    default: "bg-slate-300",
    outline: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
