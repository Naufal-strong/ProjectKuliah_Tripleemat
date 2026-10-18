import React from "react";

/**
 * Next.js App Router Loading UI (Server Component)
 *
 * Membungkus segmen halaman dalam boundary <Suspense> dari server
 * dan menampilkan fallback visual berstandar aksesibilitas tinggi (WCAG 2.1 AA)
 * selama data dan komponen rute sedang dimuat (streaming).
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
      {/* Indikator Animasi Radar & Perisai Keamanan */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Lingkaran luar animasi pulse */}
        <div className="absolute -inset-4 rounded-full bg-cyan-500/10 animate-ping opacity-60" />
        <div className="absolute -inset-8 rounded-full bg-cyan-500/5 animate-pulse-subtle" />

        {/* Lingkaran radar tengah */}
        <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-cyan-400 animate-pulse"
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

          {/* Spinner putar di tepi */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-cyan-400 animate-spin" />
        </div>
      </div>

      {/* Teks Status Pemuatan */}
      <div className="text-center max-w-md mx-auto mb-10">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
          Memuat Sistem Asesmen Keamanan...
        </h2>
        <p className="text-sm text-slate-400">
          Menyiapkan modul verifikasi OWASP ASVS, inspeksi header HTTP, dan mesin kriptografi FIPS 199.
        </p>
      </div>

      {/* Skeleton Kartu Asesmen (Representasi Metrik) */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
              <div className="h-6 w-12 bg-slate-800/80 rounded-full animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-slate-800 rounded mb-2 animate-pulse" />
            <div className="h-3 w-32 bg-slate-800/60 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Skeleton Daftar Kontrol / Baris Audit */}
      <div className="w-full max-w-4xl rounded-xl border border-slate-800/80 bg-slate-900/30 p-6 backdrop-blur-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="h-5 w-40 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-slate-800/70 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0"
          >
            <div className="space-y-2">
              <div className="h-4 w-56 sm:w-80 bg-slate-800 rounded animate-pulse" />
              <div className="h-3 w-36 sm:w-48 bg-slate-800/60 rounded animate-pulse" />
            </div>
            <div className="h-7 w-20 bg-slate-800 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}
