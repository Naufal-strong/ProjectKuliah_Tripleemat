"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../src/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"features" | "standards" | "architecture">("features");

  const coreModules = [
    {
      id: "scan",
      title: "Penganalisis Pasif HTTP & SSL",
      description:
        "Secara otomatis mengaudit header keamanan HTTP (CSP, HSTS, X-Frame-Options, CORS) dan memeriksa cipher suite SSL/TLS tanpa intrusi aktif yang mengganggu.",
      tags: ["CSP", "HSTS", "TLS 1.3", "CORS"],
      href: "/scan",
      badgeText: "Pemindai Waktu Nyata",
      badgeVariant: "cyan" as const,
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: "asvs",
      title: "Matriks Kepatuhan OWASP ASVS",
      description:
        "Matriks verifikasi kepatuhan interaktif berbasis OWASP ASVS v4.0.3 (Level 1 & 2). Mengevaluasi autentikasi, pengikatan sesi, dan prinsip hak akses terendah.",
      tags: ["OWASP ASVS", "NIST SP 800-53", "Triad CIA"],
      href: "/asvs",
      badgeText: "Mesin Kerangka Kerja",
      badgeVariant: "passed" as const,
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: "report",
      title: "Scorecard Keamanan Eksekutif",
      description:
        "Menghasilkan laporan audit terstruktur dengan tanda tangan integritas kriptografis (SHA-256), distribusi risiko, dan panduan remediasi yang praktis.",
      tags: ["Ringkasan Eksekutif", "Tanda Tangan SHA-256", "CWE / CVE"],
      href: "/report",
      badgeText: "Riwayat Audit",
      badgeVariant: "warning" as const,
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const quickStats = [
    { label: "Kontrol OWASP ASVS", value: "200+", detail: "Mencakup Level 1 & 2" },
    { label: "Header Keamanan Diinspeksi", value: "12", detail: "CSP, HSTS, XFO & Lainnya" },
    { label: "Standar Kriptografi", value: "FIPS 199", detail: "node:crypto AES-256-GCM" },
    { label: "Rata-rata Latensi Audit", value: "< 2.5s", detail: "Mesin Non-Intrusif Cepat" },
  ];

  return (
    <main id="main-content" className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/60"
      >
        {/* Glow backgrounds */}
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[45rem] h-[25rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-60 right-10 w-[25rem] h-[20rem] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
            <span>Tripleemat Security Assessor • Rilis Milestone v1.0</span>
          </div>

          {/* Primary Page Heading (Single H1) */}
          <h1
            id="hero-heading"
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight md:leading-tight"
          >
            Penilaian Keamanan &amp; Kepatuhan Otomatis untuk{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Aplikasi Web Modern
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Evaluasi aplikasi web Anda terhadap standar <strong className="text-white">OWASP ASVS</strong> dan{" "}
            <strong className="text-white">NIST SP 800-53</strong>. Analisis header HTTP pasif, audit cipher SSL/TLS,
            serta penandatanganan laporan kriptografis yang dirancang ramah untuk auditor dan pengembang dari segala kalangan.
          </p>

          {/* Primary Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/scan" className="w-full sm:w-auto">
              <Button
                id="hero-cta-scan"
                size="lg"
                variant="primary"
                className="w-full sm:w-auto"
                leftIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              >
                Buka Pemindai Keamanan
              </Button>
            </Link>

            <Link href="/asvs" className="w-full sm:w-auto">
              <Button
                id="hero-cta-asvs"
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                leftIcon={
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              >
                Jelajahi Matriks ASVS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section
        aria-labelledby="stats-heading"
        className="py-10 bg-slate-900/40 border-b border-slate-800/80"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="sr-only">
            Kemampuan Platform &amp; Metrik Verifikasi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-100 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Modules Showcase */}
      <section
        aria-labelledby="modules-heading"
        className="py-16 md:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="cyan" size="md">
            Rangkaian Terpadu
          </Badge>
          <h2
            id="modules-heading"
            className="text-2xl sm:text-3xl font-bold text-white mt-3 tracking-tight"
          >
            Fungsi Utama &amp; Alur Kerja Audit
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Tiga tahapan siklus penilaian keamanan yang terintegrasi: Pindai endpoint target, verifikasi kontrol kepatuhan, dan telusuri laporan audit bertanda tangan digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreModules.map((module) => (
            <Card
              key={module.id}
              variant="glass"
              isHoverable
              className="flex flex-col justify-between"
            >
              <div>
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {module.icon}
                  </div>
                  <Badge variant={module.badgeVariant} size="sm">
                    {module.badgeText}
                  </Badge>
                </CardHeader>
                <CardTitle as="h3" className="mt-2 text-lg">
                  {module.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {module.description}
                </CardDescription>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {module.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <Link href={module.href} className="w-full block">
                  <Button
                    id={`module-btn-${module.id}`}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between"
                    rightIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    }
                  >
                    Buka {module.title.split(" ")[0]}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Target Users & Problem Solved Tabs */}
      <section
        aria-labelledby="overview-tabs-heading"
        className="py-12 bg-slate-900/30 border-y border-slate-800/70"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2
                id="overview-tabs-heading"
                className="text-xl sm:text-2xl font-bold text-white tracking-tight"
              >
                Konsep Produk &amp; Arsitektur
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Direkayasa untuk kepatuhan keamanan dan ekspansi database serta layanan masa depan.
              </p>
            </div>

            {/* Accessible Tab List */}
            <div
              role="tablist"
              aria-label="Detail Konsep"
              className="inline-flex rounded-xl bg-slate-900 border border-slate-800 p-1"
            >
              <button
                role="tab"
                id="tab-features"
                aria-selected={activeTab === "features"}
                aria-controls="panel-features"
                onClick={() => setActiveTab("features")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer ${
                  activeTab === "features"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Target Pengguna &amp; Masalah
              </button>
              <button
                role="tab"
                id="tab-standards"
                aria-selected={activeTab === "standards"}
                aria-controls="panel-standards"
                onClick={() => setActiveTab("standards")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer ${
                  activeTab === "standards"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Standar &amp; Regulasi
              </button>
              <button
                role="tab"
                id="tab-architecture"
                aria-selected={activeTab === "architecture"}
                aria-controls="panel-architecture"
                onClick={() => setActiveTab("architecture")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400 cursor-pointer ${
                  activeTab === "architecture"
                    ? "bg-cyan-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Ekstensibilitas Masa Depan
              </button>
            </div>
          </div>

          {/* Tab Panels */}
          <div className="mt-4">
            {activeTab === "features" && (
              <div
                id="panel-features"
                role="tabpanel"
                aria-labelledby="tab-features"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-2">
                    Target Pengguna
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Auditor Keamanan &amp; Tim IT Kampus
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Dirancang untuk tim IT universitas, DevSecOps enterprise, dan auditor independen yang membutuhkan verifikasi aplikasi web secara berulang dan sistematis sesuai tolok ukur resmi.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-rose-400 font-bold text-sm uppercase tracking-wider mb-2">
                    Masalah yang Diselesaikan
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Audit Tidak Konsisten &amp; Konfigurasi Lemah
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verifikasi keamanan manual memakan waktu lama dan rawan kesalahan. Banyak portal beroperasi tanpa HSTS, CSP terlalu longgar, dan kontrol ASVS yang tidak terverifikasi.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <div className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">
                    Solusi Kami
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Penilaian Pasif, Otomatis &amp; Terverifikasi
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tripleemat menyajikan pemindaian instan non-intrusif, memetakan temuan ke OWASP ASVS dan NIST SP 800-53, serta menjamin integritas laporan dengan kriptografi SHA-256 dan AES-256-GCM.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "standards" && (
              <div
                id="panel-standards"
                role="tabpanel"
                aria-labelledby="tab-standards"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Kesesuaian OWASP ASVS v4.0.3
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Standar Verifikasi Keamanan Aplikasi yang menjadi dasar pengujian kontrol keamanan teknis aplikasi web:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      <span><strong>Level 1 (Opportunistic):</strong> Standar minimum mutlak untuk seluruh perangkat lunak web.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      <span><strong>Level 2 (Standard):</strong> Untuk aplikasi yang menangani data bisnis krusial dan informasi pribadi (PII).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      <span><strong>Level 3 (Advanced):</strong> Untuk infrastruktur militer, layanan kesehatan, dan sistem kritikal.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <h3 className="text-base font-semibold text-white mb-2">
                    NIST SP 800-53 &amp; FIPS 199
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Pemetaan Standar Pemrosesan Informasi Federal guna menjamin kepatuhan tingkat institusi:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span><strong>SC-8 / SC-13:</strong> Perlindungan Kriptografi &amp; Integritas Transmisi Data.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span><strong>AC-3 / AC-6:</strong> Penegakan Akses &amp; Prinsip Hak Akses Terendah (Least Privilege).</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span><strong>Kategorisasi Triad CIA:</strong> Disesuaikan untuk perlindungan aset digital institusi.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "architecture" && (
              <div
                id="panel-architecture"
                role="tabpanel"
                aria-labelledby="tab-architecture"
                className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800"
              >
                <h3 className="text-base font-semibold text-white mb-3">
                  Arsitektur Dirancang untuk Ekspansi Milestone Selanjutnya
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">Integrasi Database</strong>
                    Model domain (`ScanResult`, `AsvsControl`, `SecurityHeader`) memiliki tipe ketat yang dapat dipetakan 1:1 ke tabel Prisma / PostgreSQL.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">Worker Audit Latar Belakang</strong>
                    Masukan pemindai dirancang terpisah dengan muatan standar, siap dihubungkan ke antrean pemrosesan latar belakang Redis/BullMQ.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">Kriptografi Handal</strong>
                    Integrasi native dengan modul `src/lib/crypto` untuk enkripsi laporan AES-256-GCM dan pengelolaan token sesi CSPRNG.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section aria-labelledby="cta-heading" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-cyan-500/5 backdrop-blur-3xl" aria-hidden="true" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Siap memverifikasi endpoint web Anda?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Jalankan audit header dan evaluasi kepatuhan secara instan dalam hitungan detik bersama Tripleemat Security Assessor.
            </p>
            <div className="pt-2">
              <Link href="/scan">
                <Button id="cta-banner-scan" size="lg" variant="primary">
                  Mulai Audit Keamanan Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
