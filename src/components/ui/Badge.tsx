import React, { HTMLAttributes } from "react";
import { Severity, ComplianceStatus } from "../../types";

export type BadgeVariant =
  | Severity
  | ComplianceStatus
  | "default"
  | "outline"
  | "brand"
  | "cyan"
  | "ok"
  | "warn"
  | "fail";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

/**
 * Badge — Lencana status multi-aksen dengan adaptasi Dual-Theme
 * (Calm Titanium di Light Mode & Midnight Slate di Dark Mode).
 * Mendukung aksesibilitas kontras tinggi dan ramah pengguna buta warna.
 */
export function Badge({
  children,
  className = "",
  variant = "default",
  size = "md",
  dot = false,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-medium",
  };

  const variantStyles: Record<BadgeVariant, string> = {
    /* Status Lolos / Aman (Emerald Mint) */
    passed:   "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    ok:       "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    low:      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",

    /* Status Perhatian / Waspada (Amber Gold) */
    warning:  "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    warn:     "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    medium:   "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",

    /* Status Bahaya / Kritis (Coral Red) */
    critical: "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    high:     "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    failed:   "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    fail:     "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",

    /* Informasi & Standar Matriks (Amethyst Violet) */
    info:     "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",

    /* Brand & Modul Pemindai (Mengadopsi Palet #0A4174 / #7BBDE8) */
    brand:    "bg-[#0a4174]/10 text-[#0a4174] border-[#0a4174]/30 dark:bg-[#7bbde8]/15 dark:text-[#7bbde8] dark:border-[#7bbde8]/40",
    cyan:     "bg-[#4e8ea2]/15 text-[#001d39] border-[#4e8ea2]/30 dark:bg-[#4e8ea2]/25 dark:text-[#bdd8e9] dark:border-[#4e8ea2]/50",

    /* Netral & Pending (Mengadopsi Palet #BDD8E9 / #49769F) */
    pending:  "bg-[#bdd8e9]/25 text-[#001d39] border-[#bdd8e9] dark:bg-[#0a4174]/40 dark:text-[#bdd8e9] dark:border-[#49769f]",
    default:  "bg-[#bdd8e9]/25 text-[#001d39] border-[#bdd8e9] dark:bg-[#0a4174]/40 dark:text-[#bdd8e9] dark:border-[#49769f]",
    outline:  "bg-transparent text-[#001d39] border-[#bdd8e9] dark:text-[#bdd8e9] dark:border-[#49769f]",
  };

  const dotColors: Record<BadgeVariant, string> = {
    critical: "bg-rose-600 dark:bg-rose-400",
    high:     "bg-rose-600 dark:bg-rose-400",
    medium:   "bg-amber-600 dark:bg-amber-400",
    low:      "bg-emerald-600 dark:bg-emerald-400",
    info:     "bg-indigo-600 dark:bg-indigo-400",
    passed:   "bg-emerald-600 dark:bg-emerald-400",
    failed:   "bg-rose-600 dark:bg-rose-400",
    warning:  "bg-amber-600 dark:bg-amber-400",
    pending:  "bg-[#49769f] dark:bg-[#6ea2b3]",
    ok:       "bg-emerald-600 dark:bg-emerald-400",
    warn:     "bg-amber-600 dark:bg-amber-400",
    fail:     "bg-rose-600 dark:bg-rose-400",
    brand:    "bg-[#0a4174] dark:bg-[#7bbde8]",
    cyan:     "bg-[#4e8ea2] dark:bg-[#bdd8e9]",
    default:  "bg-[#49769f] dark:bg-[#6ea2b3]",
    outline:  "bg-[#49769f] dark:bg-[#6ea2b3]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]} shrink-0`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}
