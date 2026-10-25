import React, { ReactNode } from "react";

export interface PageHeaderMeta {
  label: string;
  value: string;
}

export interface PageHeaderProps {
  /** Label kecil di atas judul (misal: nama modul atau ID) */
  eyebrow?: string;
  /** Satu-satunya h1 di halaman */
  title: string;
  /** Kalimat deskripsi di bawah judul */
  description?: string;
  /** Metadata ringkas: label–nilai mendatar, bukan badge beruntun */
  meta?: PageHeaderMeta[];
  /** Aksi utama atau sekunder */
  actions?: ReactNode;
  className?: string;
}

/**
 * PageHeader — komponen header halaman yang unik per halaman.
 *
 * Tipografi:
 *   eyebrow: 12px, text-accent font-medium
 *   h1: 24–28px, font-semibold
 *   description: 14px, text-text-3
 *   meta label: 12px, text-text-3
 *   meta value: 13px, text-text-2
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <div className="text-xs font-medium text-accent mb-1 tracking-normal">
              {eyebrow}
            </div>
          )}
          <h1 className="text-2xl sm:text-[28px] font-semibold text-text-1 tracking-tight leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-text-3 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
          {meta && meta.length > 0 && (
            <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
              {meta.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <dt className="text-xs text-text-3">{item.label}:</dt>
                  <dd className="text-[13px] text-text-2 font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
