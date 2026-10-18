"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
  reset?: () => void;
}

/**
 * Next.js App Router Error Boundary (Wajib Client Component)
 *
 * Menangkap galat yang tidak tertangani (unhandled runtime error) pada segmen
 * halaman dan menampilkan antarmuka pemulihan (fallback recovery UI).
 * Menerima properti error dan fungsi retry() untuk mencoba re-render segmen.
 */
export default function ErrorBoundary({ error, retry, reset }: ErrorProps) {
  useEffect(() => {
    // Catat detail galat ke konsol untuk kebutuhan audit dan debugging
    console.error("Tripleemat Security Assessor caught an unexpected error:", error);
  }, [error]);

  const handleRetry = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    }
  };

  return (
    <main
      id="main-content"
      role="alert"
      aria-live="assertive"
      className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center"
    >
      <div className="w-full rounded-2xl border border-rose-500/30 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl shadow-rose-950/30 text-center relative overflow-hidden">
        {/* Aksen visual latar belakang */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-rose-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Ikon Peringatan Galat */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-lg shadow-rose-500/10">
          <svg
            className="w-8 h-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        {/* Judul & Deskripsi Galat */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Terjadi Kendala pada Sesi Audit
        </h1>
        <p className="text-base text-slate-300 max-w-lg mx-auto mb-6">
          Sistem mengalami galat tak terduga saat memproses modul keamanan atau memuat data kepatuhan. Anda dapat mencoba memuat ulang segmen ini tanpa me-refresh seluruh peramban.
        </p>

        {/* Kode Digest Galat (jika ada dari Next.js) */}
        {error.digest && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400 mb-8 max-w-full overflow-x-auto">
            <span className="text-rose-400 font-semibold">Digest:</span>
            <span>{error.digest}</span>
          </div>
        )}

        {/* Tombol Aksi Pemulihan (Recovery Actions) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 transition-all duration-200 cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span>Coba Lagi (Retry)</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-medium text-sm border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all duration-200"
          >
            <svg
              className="w-4 h-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
