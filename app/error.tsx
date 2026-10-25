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
 * Perubahan: tanpa gradient/backdrop-blur/blur dekoratif/shadow berwarna.
 * Satu aksi utama (retry), satu sekunder (kembali).
 */
export default function ErrorBoundary({ error, retry, reset }: ErrorProps) {
  useEffect(() => {
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
      className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center"
    >
      <div className="w-full rounded-lg border border-fail/25 bg-surface-1 p-8 text-center">
        {/* Ikon Peringatan */}
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-fail/10 border border-fail/20 text-fail">
          <svg
            className="w-7 h-7"
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

        {/* Judul & Deskripsi */}
        <h1 className="text-2xl font-semibold text-text-1 mb-3">
          Terjadi Kendala pada Sesi Audit
        </h1>
        <p className="text-sm text-text-2 max-w-md mx-auto mb-6 leading-relaxed">
          Sistem mengalami galat tak terduga saat memproses modul keamanan atau memuat data kepatuhan.
          Anda dapat mencoba memuat ulang segmen ini tanpa me-refresh seluruh peramban.
        </p>

        {/* Kode Digest Galat */}
        {error.digest && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-surface-2 border border-border text-xs font-mono text-text-3 mb-6 max-w-full overflow-x-auto">
            <span className="text-fail font-semibold">Digest:</span>
            <span>{error.digest}</span>
          </div>
        )}

        {/* Tombol Pemulihan */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-text font-semibold text-sm transition-colors duration-150 hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span>Coba Lagi</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-surface-2 hover:bg-surface-1 text-text-2 hover:text-text-1 font-medium text-sm border border-border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg
              className="w-4 h-4"
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
