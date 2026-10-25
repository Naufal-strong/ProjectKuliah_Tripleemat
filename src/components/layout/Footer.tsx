import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="mt-auto border-t border-border bg-surface-0 text-text-3 py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 rounded-md overflow-hidden shrink-0 border border-border shadow-xs">
                <Image
                  src="/logo.png"
                  alt="Logo Tripleemat"
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-semibold text-text-1 text-sm">
                Tripleemat Security Assessor
              </span>
            </div>
            <p className="text-xs text-text-3 max-w-md leading-relaxed">
              Platform Penilaian Keamanan &amp; Kepatuhan Otomatis yang dirancang
              untuk mengaudit target web terhadap panduan OWASP ASVS v4.0.3 dan NIST SP 800-53
              menggunakan kriptografi berstandar industri.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-ok font-medium">
              {/* Indikator status statis — tanpa animate-pulse */}
              <span className="h-1.5 w-1.5 rounded-full bg-ok inline-block" aria-hidden="true" />
              <span>Seluruh Layanan Kriptografi &amp; Audit Beroperasi Normal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-text-2 mb-3">
              Modul Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/scan"
                  className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
                >
                  Pemindai Header Keamanan
                </Link>
              </li>
              <li>
                <Link
                  href="/asvs"
                  className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
                >
                  Matriks OWASP ASVS
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="hover:text-text-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
                >
                  Laporan &amp; Riwayat Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & References */}
          <div>
            <h3 className="text-xs font-semibold text-text-2 mb-3">
              Kerangka Kepatuhan
            </h3>
            <ul className="space-y-2 text-xs text-text-3">
              <li>
                {/* font-mono diizinkan untuk nama standar teknis */}
                <span className="text-text-2 font-mono">OWASP ASVS v4.0.3</span>
                {" "}(Level 1, 2, 3)
              </li>
              <li>
                <span className="text-text-2 font-mono">NIST SP 800-53</span>
                {" "}(Rev 5 Controls)
              </li>
              <li>
                <span className="text-text-2 font-mono">FIPS 199</span>
                {" "}(CIA Triad Categorization)
              </li>
              <li>
                <span className="text-text-2 font-mono">AES-256-GCM / SHA-256</span>
                {" "}(node:crypto)
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-3">
          <p>© 2026 Tripleemat Security Assessor. Educational &amp; Enterprise Project.</p>
          <div className="flex items-center gap-4">
            <span>Next.js 16 · React 19 · Tailwind CSS v4</span>
            <span aria-hidden="true">·</span>
            <span className="text-ok">WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
