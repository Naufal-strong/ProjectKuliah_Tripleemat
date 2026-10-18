import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="mt-auto border-t border-slate-900 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="font-bold text-white text-base">
                Tripleemat Security Assessor
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Platform Penilaian Keamanan &amp; Kepatuhan Otomatis yang dirancang
              untuk mengaudit target web terhadap panduan OWASP ASVS v4.0.3 dan NIST SP 800-53
              menggunakan kriptografi berstandar industri.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Seluruh Layanan Kriptografi &amp; Audit Beroperasi Normal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Modul Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/scan"
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                >
                  Pemindai Header Keamanan
                </Link>
              </li>
              <li>
                <Link
                  href="/asvs"
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                >
                  Matriks OWASP ASVS
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 rounded"
                >
                  Laporan &amp; Riwayat Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & References */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Kerangka Kepatuhan
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300 font-mono">OWASP ASVS v4.0.3</span> (Level 1, 2, 3)
              </li>
              <li>
                <span className="text-slate-300 font-mono">NIST SP 800-53</span> (Rev 5 Controls)
              </li>
              <li>
                <span className="text-slate-300 font-mono">FIPS 199</span> (CIA Triad Categorization)
              </li>
              <li>
                <span className="text-slate-300 font-mono">AES-256-GCM / SHA-256</span> (node:crypto)
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 Tripleemat Security Assessor. Educational &amp; Enterprise Project.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Next.js 16 • React 19 • Tailwind CSS</span>
            <span>•</span>
            <span className="text-cyan-400">WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
