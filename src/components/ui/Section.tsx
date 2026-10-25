import React, { HTMLAttributes, ReactNode } from "react";

export interface SectionProps {
  /** Judul seksi — h2, 20px */
  title?: string;
  /** Deskripsi opsional di bawah judul */
  description?: string;
  /** Satu aksi sekunder opsional di sisi kanan judul */
  action?: ReactNode;
  children: ReactNode;
  /** ID untuk aria-labelledby */
  id?: string;
  className?: string;
  as?: "section" | "div" | "article";
}

/**
 * Section — membungkus seksi halaman dengan judul h2 dan konten.
 * Tidak membuat kartu sendiri. Bila butuh latar, pakai bg-surface-1
 * dan maksimal satu tingkat.
 *
 * Tipografi:
 *   h2: 20px, font-semibold, text-text-1
 *   description: 13px, text-text-3
 *
 * Tidak ada: gradient, backdrop-blur, glow, uppercase
 */
export function Section({
  title,
  description,
  action,
  children,
  id,
  className = "",
  as: Component = "section",
}: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <Component
      id={id}
      aria-labelledby={title ? headingId : undefined}
      className={`space-y-4 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h2
                id={headingId}
                className="text-[20px] font-semibold text-text-1 leading-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-[13px] text-text-3 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="shrink-0 pt-0.5">{action}</div>
          )}
        </div>
      )}
      <div>{children}</div>
    </Component>
  );
}

/** Varian Section dengan kartu latar (surface-1) */
export function SectionCard({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface-1 p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
