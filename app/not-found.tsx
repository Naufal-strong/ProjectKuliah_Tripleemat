import React from "react";
import Link from "next/link";

/**
 * Next.js App Router Not Found UI (Server Component)
 *
 * Ditampilkan saat fungsi notFound() dipanggil atau ketika pengguna
 * mengakses URL yang tidak cocok dengan rute mana pun di aplikasi.
 */
export default function NotFound() {
  const quickLinks = [
    {
      title: "Beranda Utama",
      description: "Pelajari konsep produk, standar kepatuhan, dan arsitektur kriptografi.",
      href: "/",
      icon: (
        <svg
          className="w-5 h-5 text-cyan-400"
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
          className="w-5 h-5 text-emerald-400"
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
          className="w-5 h-5 text-blue-400"
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
      title: "Laporan Audit Eksekutif",
      description: "Tinjau scorecard keamanan terverifikasi SHA-256 dan riwayat pemindaian.",
      href: "/report",
      icon: (
        <svg
          className="w-5 h-5 text-indigo-400"
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
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
  ];

  return (
    <main
      id="main-content"
      className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center"
    >
      <div className="w-full text-center mb-12">
        {/* Lencana Status Kode 404 */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase mb-6 shadow-sm shadow-cyan-500/10">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Status 404 • Resource Not Found</span>
        </div>

        {/* Angka 404 Cyber Gradient */}
        <div className="relative inline-block mb-4">
          <span className="text-7xl sm:text-9xl font-black tracking-tighter bg-gradient-to-b from-slate-200 via-slate-400 to-slate-700 bg-clip-text text-transparent select-none">
            404
          </span>
          <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full -z-10" />
        </div>

        {/* Heading dan Pesan Penjelasan */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Endpoint Target Tidak Ditemukan
        </h1>
        <p className="text-base text-slate-300 max-w-xl mx-auto">
          Halaman atau sumber daya audit yang Anda tuju berada di luar jangkauan pemetaan sistem Tripleemat Security Assessor.
        </p>
      </div>

      {/* Navigasi Cepat ke Modul Utama */}
      <div className="w-full max-w-3xl mb-10">
        <h2 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">
          Jalur Navigasi Modul yang Tersedia
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/60 hover:border-cyan-500/40 transition-all duration-200 flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 group-hover:border-slate-700 transition-colors">
                {item.icon}
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <span>{item.title}</span>
                  <svg
                    className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tombol Utama */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 transition-all duration-200"
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
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Kembali ke Beranda Utama</span>
      </Link>
    </main>
  );
}
