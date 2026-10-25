"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../src/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "../src/components/ui/Card";
import { Badge } from "../src/components/ui/Badge";
import { Section } from "../src/components/ui/Section";

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
      badgeVariant: "info" as const,
      colorAccent: "#4E8EA2",
      icon: (
        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
      badgeVariant: "ok" as const,
      colorAccent: "#0A4174",
      icon: (
        <svg className="w-5 h-5 text-ok" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
      badgeVariant: "warn" as const,
      colorAccent: "#7BBDE8",
      icon: (
        <svg className="w-5 h-5 text-warn" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const quickStats = [
    { label: "Kontrol OWASP ASVS", value: "200+", detail: "Mencakup Level 1 & 2", color: "#0A4174" },
    { label: "Header Keamanan Diinspeksi", value: "12", detail: "CSP, HSTS, XFO & Lainnya", color: "#49769F" },
    { label: "Standar Kriptografi", value: "FIPS 199", detail: "node:crypto AES-256-GCM", color: "#4E8EA2" },
    { label: "Rata-rata Latensi Audit", value: "< 2.5s", detail: "Mesin Non-Intrusif Cepat", color: "#7BBDE8" },
  ];

  // Spotlight mouse tracking untuk kartu desktop
  const handleSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <main id="main-content" className="flex-1 flex flex-col">
      {/* 3D Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="relative pt-12 pb-16 md:pt-20 md:pb-28 border-b border-border bg-surface-0 overflow-hidden"
      >
        {/* Cyber Grid 3D Background & Ambient Glow Orbs */}
        <div className="absolute inset-0 cyber-grid-bg pointer-events-none opacity-80" aria-hidden="true" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#0A4174]/20 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#7BBDE8]/15 blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headline & Action Buttons */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Eyebrow Tagline */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface-1 text-text-2 text-xs font-medium shadow-xs">
                <span className="h-2 w-2 rounded-full bg-accent inline-block animate-pulse" aria-hidden="true" />
                <span>Tripleemat Security Assessor • 3D Oceanic Edition</span>
              </div>

              {/* Primary Page Heading */}
              <h1
                id="hero-heading"
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-1 leading-tight sm:leading-tight"
              >
                Penilaian Keamanan &amp; Kepatuhan Otomatis untuk{" "}
                <span className="text-accent underline decoration-accent/40 decoration-wavy">
                  Aplikasi Web Modern
                </span>
              </h1>

              <p className="text-base sm:text-lg text-text-2 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Evaluasi aplikasi web Anda terhadap standar <strong className="text-text-1">OWASP ASVS v4.0.3</strong> dan{" "}
                <strong className="text-text-1">NIST SP 800-53</strong>. Dilengkapi analisis header pasif, audit cipher SSL/TLS,
                dan penandatanganan integritas kriptografis berstandar FIPS 199.
              </p>

              {/* Primary 3D Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/scan" className="w-full sm:w-auto touch-tactile">
                  <Button
                    id="hero-cta-scan"
                    size="lg"
                    variant="primary"
                    className="w-full sm:w-auto text-base"
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    }
                  >
                    Buka Pemindai Keamanan
                  </Button>
                </Link>

                <Link href="/asvs" className="w-full sm:w-auto touch-tactile">
                  <Button
                    id="hero-cta-asvs"
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto text-base card-3d"
                    leftIcon={
                      <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    }
                  >
                    Jelajahi Matriks ASVS
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-text-3">
                <span className="flex items-center gap-1.5">
                  <span className="text-ok font-bold">✓</span> Non-Intrusif 100%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-ok font-bold">✓</span> FIPS 199 SHA-256
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-ok font-bold">✓</span> Zero Vulnerability
                </span>
              </div>
            </div>

            {/* Right Column: 3D Perspective Security Dashboard */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center perspective-container w-full">
              <div className="relative w-full max-w-md mx-auto">
                {/* 3D Floating Official Brand Shield with Sonar Pulse */}
                <div className="absolute -top-7 -right-3 z-30 floating-3d-top">
                  <div className="relative">
                    <div className="radar-sonar-ring" aria-hidden="true" />
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-[#7BBDE8]/60 shadow-2xl bg-surface-1 p-2 card-3d">
                      <Image
                        src="/logo.png"
                        alt="Logo Resmi Tripleemat"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover rounded-xl"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* 3D Main Terminal Board with Spotlight effect */}
                <div
                  onMouseMove={handleSpotlight}
                  className="hero-3d-board spotlight-card rounded-2xl border border-border bg-surface-1 p-4 sm:p-5 overflow-hidden"
                >
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-500 inline-block shadow-xs" />
                      <span className="h-3 w-3 rounded-full bg-amber-500 inline-block shadow-xs" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
                      <span className="ml-2 font-mono text-[11px] font-semibold text-text-3 truncate max-w-[140px] sm:max-w-none">
                        tripleemat://audit.v2
                      </span>
                    </div>
                    <Badge variant="ok" size="sm" dot>
                      Aktif
                    </Badge>
                  </div>

                  {/* Target URL Status Bar */}
                  <div className="mt-3.5 p-2.5 rounded-lg bg-surface-2 border border-border flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-accent font-bold shrink-0">TARGET:</span>
                      <span className="font-mono text-text-1 truncate">https://app.corp.internal</span>
                    </div>
                    <span className="font-mono text-[10px] text-ok bg-ok/10 px-2 py-0.5 rounded font-bold shrink-0">
                      TLS 1.3
                    </span>
                  </div>

                  {/* 3D Metrics Grid */}
                  <div className="mt-3.5 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-surface-2 border border-border card-3d touch-tactile">
                      <div className="text-[11px] text-text-3 font-medium">Skor Keamanan</div>
                      <div className="text-xl font-extrabold text-accent mt-0.5">A+ (98/100)</div>
                      <div className="w-full bg-border rounded-full h-1.5 mt-2 overflow-hidden">
                        <div className="bg-accent h-full rounded-full w-[98%]" />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-2 border border-border card-3d touch-tactile">
                      <div className="text-[11px] text-text-3 font-medium">Kepatuhan ASVS</div>
                      <div className="text-xl font-extrabold text-ok mt-0.5">100% L1/L2</div>
                      <div className="text-[10px] text-text-3 mt-1.5">48/48 Kontrol Lolos</div>
                    </div>
                  </div>

                  {/* Live Security Telemetry Console Feed */}
                  <div className="mt-3.5 p-3 rounded-xl bg-[#001D39] text-[#BDD8E9] font-mono text-[11px] space-y-1.5 border border-[#0A4174] overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] text-[#7BBDE8] pb-1 border-b border-[#0A4174]/60">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        TELEMETRI KONSOL
                      </span>
                      <span>SHA-256 NONCE</span>
                    </div>
                    <div className="space-y-1 pt-1 text-[10.5px]">
                      <div className="flex items-start gap-1.5 text-emerald-400">
                        <span>✓</span>
                        <span className="truncate">HSTS: max-age=31536000; includeSubDomains</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-emerald-400">
                        <span>✓</span>
                        <span className="truncate">CSP: default-src &apos;self&apos;; strict-dynamic</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-emerald-400">
                        <span>✓</span>
                        <span className="truncate">Session: HttpOnly; SameSite=Lax; Secure</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-[#7BBDE8]">
                        <span>ℹ</span>
                        <span className="truncate">Digest: 9f86d081884c7d659a2feaa0c55...</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Quick Action */}
                  <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-text-3 font-medium">
                      Audit Pasif Non-Intrusif
                    </span>
                    <Link
                      href="/scan"
                      className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 touch-tactile"
                    >
                      Jalankan Pemindaian →
                    </Link>
                  </div>
                </div>

                {/* 3D Floating Pill Badge (Bottom-Left) */}
                <div className="absolute -bottom-5 -left-3 z-20 floating-3d-bottom">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-surface-1 border border-border shadow-xl text-xs font-semibold text-text-1 card-3d">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>0 Kerentanan Kritis Terdeteksi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Quick Stats Grid */}
      <section
        aria-labelledby="stats-heading"
        className="py-10 bg-surface-1 border-b border-border"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="stats-heading" className="sr-only">
            Kemampuan Platform &amp; Metrik Verifikasi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-xl bg-surface-0 border border-border card-3d text-center"
              >
                <div
                  style={{ color: stat.color }}
                  className="text-2xl sm:text-3xl font-bold font-mono tracking-tight tabular-nums"
                >
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-text-1 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-text-3 mt-0.5">{stat.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Modules Showcase with 3D Elevation */}
      <section
        aria-labelledby="modules-heading"
        className="py-16 md:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full"
      >
        <Section
          title="Fungsi Utama &amp; Alur Kerja Audit"
          description="Tiga tahapan siklus penilaian keamanan yang terintegrasi: Pindai endpoint target, verifikasi kontrol kepatuhan, dan telusuri laporan audit bertanda tangan digital."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreModules.map((module) => (
              <Card
                key={module.id}
                variant="default"
                isHoverable
                className="flex flex-col justify-between card-3d"
              >
                <div>
                  <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                    <div
                      style={{ backgroundColor: `${module.colorAccent}18` }}
                      className="p-2.5 rounded-lg border border-border"
                    >
                      {module.icon}
                    </div>
                    <Badge variant={module.badgeVariant} size="sm">
                      {module.badgeText}
                    </Badge>
                  </CardHeader>
                  <CardTitle as="h3" className="mt-2 text-base text-text-1">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-text-2">
                    {module.description}
                  </CardDescription>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {module.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2 py-0.5 rounded bg-surface-2 text-text-2 border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
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
        </Section>
      </section>

      {/* Target Users & Concept Tabs */}
      <section
        aria-labelledby="overview-tabs-heading"
        className="py-14 bg-surface-1 border-y border-border"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2
                id="overview-tabs-heading"
                className="text-xl sm:text-2xl font-bold text-text-1 tracking-tight"
              >
                Konsep Produk &amp; Arsitektur
              </h2>
              <p className="text-text-3 text-xs sm:text-sm mt-1">
                Direkayasa untuk kepatuhan keamanan dan ekspansi database serta layanan masa depan.
              </p>
            </div>

            {/* Accessible Tab List */}
            <div
              role="tablist"
              aria-label="Detail Konsep"
              className="inline-flex rounded-lg bg-surface-2 border border-border p-1"
            >
              <button
                role="tab"
                id="tab-features"
                aria-selected={activeTab === "features"}
                aria-controls="panel-features"
                onClick={() => setActiveTab("features")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer ${
                  activeTab === "features"
                    ? "bg-accent text-accent-text font-semibold shadow-xs"
                    : "text-text-2 hover:text-text-1"
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer ${
                  activeTab === "standards"
                    ? "bg-accent text-accent-text font-semibold shadow-xs"
                    : "text-text-2 hover:text-text-1"
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer ${
                  activeTab === "architecture"
                    ? "bg-accent text-accent-text font-semibold shadow-xs"
                    : "text-text-2 hover:text-text-1"
                }`}
              >
                Ekstensibilitas Arsitektur
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
                <div className="p-6 rounded-lg bg-surface-0 border border-border card-3d">
                  <div className="text-accent font-semibold text-xs uppercase tracking-wider mb-2">
                    Target Pengguna
                  </div>
                  <h3 className="text-base font-semibold text-text-1 mb-2">
                    Auditor Keamanan &amp; Tim IT Kampus
                  </h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    Dirancang untuk tim IT universitas, DevSecOps enterprise, dan auditor independen yang membutuhkan verifikasi aplikasi web secara berulang dan sistematis sesuai tolok ukur resmi.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-surface-0 border border-border card-3d">
                  <div className="text-fail font-semibold text-xs uppercase tracking-wider mb-2">
                    Masalah yang Diselesaikan
                  </div>
                  <h3 className="text-base font-semibold text-text-1 mb-2">
                    Audit Tidak Konsisten &amp; Konfigurasi Lemah
                  </h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    Verifikasi keamanan manual memakan waktu lama dan rawan kesalahan. Banyak portal beroperasi tanpa HSTS, CSP terlalu longgar, dan kontrol ASVS yang tidak terverifikasi.
                  </p>
                </div>

                <div className="p-6 rounded-lg bg-surface-0 border border-border card-3d">
                  <div className="text-ok font-semibold text-xs uppercase tracking-wider mb-2">
                    Solusi Kami
                  </div>
                  <h3 className="text-base font-semibold text-text-1 mb-2">
                    Penilaian Pasif, Otomatis &amp; Terverifikasi
                  </h3>
                  <p className="text-xs text-text-2 leading-relaxed">
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
                <div className="p-6 rounded-lg bg-surface-0 border border-border card-3d">
                  <h3 className="text-base font-semibold text-text-1 mb-2">
                    Kesesuaian OWASP ASVS v4.0.3
                  </h3>
                  <p className="text-xs text-text-2 leading-relaxed mb-4">
                    Standar Verifikasi Keamanan Aplikasi yang menjadi dasar pengujian kontrol keamanan teknis aplikasi web:
                  </p>
                  <ul className="space-y-2 text-xs text-text-2">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span><strong className="text-text-1">Level 1 (Opportunistic):</strong> Standar minimum mutlak untuk seluruh perangkat lunak web.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span><strong className="text-text-1">Level 2 (Standard):</strong> Untuk aplikasi yang menangani data bisnis krusial dan informasi pribadi (PII).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      <span><strong className="text-text-1">Level 3 (Advanced):</strong> Untuk infrastruktur militer, layanan kesehatan, dan sistem kritikal.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-lg bg-surface-0 border border-border card-3d">
                  <h3 className="text-base font-semibold text-text-1 mb-2">
                    NIST SP 800-53 &amp; FIPS 199
                  </h3>
                  <p className="text-xs text-text-2 leading-relaxed mb-4">
                    Pemetaan Standar Pemrosesan Informasi Federal guna menjamin kepatuhan tingkat institusi:
                  </p>
                  <ul className="space-y-2 text-xs text-text-2">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-ok mt-1.5 shrink-0" />
                      <span><strong className="text-text-1">SC-8 / SC-13:</strong> Perlindungan Kriptografi &amp; Integritas Transmisi Data.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-ok mt-1.5 shrink-0" />
                      <span><strong className="text-text-1">AC-3 / AC-6:</strong> Penegakan Akses &amp; Prinsip Hak Akses Terendah (Least Privilege).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-ok mt-1.5 shrink-0" />
                      <span><strong className="text-text-1">Kategorisasi Triad CIA:</strong> Disesuaikan untuk perlindungan aset digital institusi.</span>
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
                className="p-6 rounded-lg bg-surface-0 border border-border card-3d"
              >
                <h3 className="text-base font-semibold text-text-1 mb-3">
                  Arsitektur Dirancang untuk Ekspansi Milestone Selanjutnya
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-text-2">
                  <div className="p-4 rounded-lg bg-surface-1 border border-border">
                    <strong className="text-text-1 block mb-1">Integrasi Database</strong>
                    Model domain (ScanResult, AsvsControl, SecurityHeader) memiliki tipe ketat yang dapat dipetakan 1:1 ke skema database relasional.
                  </div>
                  <div className="p-4 rounded-lg bg-surface-1 border border-border">
                    <strong className="text-text-1 block mb-1">Worker Audit Latar Belakang</strong>
                    Masukan pemindai dirancang terpisah dengan muatan standar, siap dihubungkan ke antrean pemrosesan asinkron.
                  </div>
                  <div className="p-4 rounded-lg bg-surface-1 border border-border">
                    <strong className="text-text-1 block mb-1">Kriptografi Handal</strong>
                    Integrasi native dengan node:crypto untuk enkripsi laporan AES-256-GCM dan digest SHA-256 FIPS 199.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3D Call to Action Banner */}
      <section aria-labelledby="cta-heading" className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl border border-border bg-surface-1 p-8 sm:p-14 text-center card-3d">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 id="cta-heading" className="text-2xl sm:text-3xl font-extrabold text-text-1 tracking-tight">
              Siap memverifikasi endpoint web Anda?
            </h2>
            <p className="text-text-2 text-sm sm:text-base leading-relaxed">
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
