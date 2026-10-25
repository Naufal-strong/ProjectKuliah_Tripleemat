import React from "react";
import Link from "next/link";

/**
 * Next.js App Router Not Found UI (Server Component)
 *
 * Perubahan: tanpa gradient, bg-clip-text, blur dekoratif, animate-pulse.
 * "404" ditampilkan sebagai angka besar tanpa teks gradient.
 */
export default function NotFound() {
  const quickLinks = [
    {
      title: "Beranda Utama",
      description: "Pelajari konsep produk, standar kepatuhan, dan arsitektur kriptografi.",
      href: "/",
      icon: (
        <svg
          className="w-4 h-4 text-text-3"
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
      ),
    },
    {
      title: "Pemindai Keamanan",
      description: "Jalankan pemindaian pasif HTTP headers dan validasi sertifikat SSL/TLS.",
      href: "/scan",
      icon: (
        <svg
          className="w-4 h-4 text-text-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Matriks OWASP ASVS",
      description: "Audit kepatuhan kontrol teknis v4.0.3 dengan pemetaan NIST SP 800-53.",
      href: "/asvs",
      icon: (
        <svg
          className="w-4 h-4 text-text-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      title: "Laporan Audit",
      description: "Tinjau scorecard keamanan terverifikasi SHA-256 dan riwayat pemindaian.",
      href: "/report",
      icon: (
        <svg
          className="w-4 h-4 text-text-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <main
      id="main-content"
      className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center"
    >
      <div className="w-full text-center mb-10">
        {/* Kode 404 — tanpa gradient teks */}
        <p className="text-xs font-mono text-text-3 mb-4 tracking-widest uppercase">
          404 · Halaman Tidak Ditemukan
        </p>

        <h1 className="text-6xl sm:text-8xl font-bold text-text-1 tabular-nums select-none mb-4">
          404
        </h1>

        <p className="text-base text-text-2 max-w-md mx-auto leading-relaxed">
          Halaman atau sumber daya audit yang Anda tuju berada di luar jangkauan pemetaan sistem
          Tripleemat Security Assessor.
        </p>
      </div>

      {/* Navigasi Cepat ke Modul Utama */}
      <div className="w-full mb-8">
        <p className="text-xs text-text-3 font-medium mb-4 text-center">
          Modul yang tersedia
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-4 rounded-lg border border-border bg-surface-1 hover:border-border-control transition-colors duration-150 flex items-start gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="p-2 rounded bg-surface-2 border border-border mt-0.5 shrink-0">
                {item.icon}
              </div>
              <div className="text-left min-w-0">
                <div className="font-medium text-sm text-text-1 group-hover:text-accent transition-colors">
                  {item.title}
                </div>
                <p className="text-xs text-text-3 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Satu aksi utama */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-accent-text font-semibold text-sm transition-colors duration-150 hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
        <span>Kembali ke Beranda Utama</span>
      </Link>
    </main>
  );
}
