import React from "react";

/**
 * Next.js App Router Loading UI (Server Component)
 *
 * Fallback visual berstandar aksesibilitas (WCAG 2.1 AA) selama
 * data dan komponen rute sedang dimuat.
 *
 * Perubahan: tanpa animate-ping, tanpa backdrop-blur, tanpa gradient.
 * Skeleton pakai animate-pulse (state loading yang benar-benar berlangsung).
 */
export default function Loading() {
  return (
    <main
      id="main-content"
      role="status"
      aria-live="polite"
      aria-label="Sedang memuat data asesmen keamanan"
      className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center justify-center min-h-[60vh]"
    >
      {/* Indikator memuat — spinner tunggal, tanpa animasi infinite background */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative h-16 w-16 rounded-lg bg-surface-1 border border-border flex items-center justify-center">
          <svg
            className="w-8 h-8 text-text-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          {/* Spinner: satu animasi yang sedang aktif, bukan infinite dekorasi */}
          <div className="absolute inset-0 rounded-lg border-2 border-transparent border-t-accent animate-spin" />
        </div>
      </div>

      {/* Teks Status Pemuatan */}
      <div className="text-center max-w-md mx-auto mb-10">
        <h2 className="text-xl font-semibold text-text-1 mb-2">
          Memuat Sistem Asesmen Keamanan...
        </h2>
        <p className="text-sm text-text-3">
          Menyiapkan modul verifikasi OWASP ASVS, inspeksi header HTTP, dan mesin kriptografi FIPS 199.
        </p>
      </div>

      {/* Skeleton Kartu Asesmen */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-lg border border-border bg-surface-1 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-3 w-24 bg-surface-2 rounded animate-pulse" />
              <div className="h-5 w-12 bg-surface-2 rounded animate-pulse" />
            </div>
            <div className="h-7 w-16 bg-surface-2 rounded mb-2 animate-pulse" />
            <div className="h-3 w-32 bg-surface-2 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Skeleton Daftar Kontrol / Baris Audit */}
      <div className="w-full max-w-4xl rounded-lg border border-border bg-surface-1 p-5 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="h-4 w-40 bg-surface-2 rounded animate-pulse" />
          <div className="h-3 w-20 bg-surface-2 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="space-y-2">
              <div className="h-3.5 w-56 sm:w-80 bg-surface-2 rounded animate-pulse" />
              <div className="h-3 w-36 sm:w-48 bg-surface-2 rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-surface-2 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}
