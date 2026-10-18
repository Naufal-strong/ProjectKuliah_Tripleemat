"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../src/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Input } from "../../src/components/ui/Input";
import { Alert } from "../../src/components/ui/Alert";
import { ProgressBar } from "../../src/components/ui/ProgressBar";
import { ScanFormData, FormErrors, ScanResult } from "../../src/types";
import { defaultSecurityHeaders } from "../../src/data/mockSecurityHeaders";
import { sampleScanResults } from "../../src/data/mockScans";

export default function ScannerPage() {
  // Form State
  const [formData, setFormData] = useState<ScanFormData>({
    targetUrl: "",
    auditScope: "standard",
    asvsLevel: "L1",
    auditorEmail: "",
    notifyOnComplete: false,
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStepText, setScanStepText] = useState("");
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);

  // Client-side Validation Logic
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validasi URL
    const urlTrimmed = formData.targetUrl.trim();
    if (!urlTrimmed) {
      newErrors.targetUrl = "URL target wajib diisi. Silakan tentukan endpoint aplikasi web yang akan diaudit.";
    } else if (!/^https?:\/\//i.test(urlTrimmed)) {
      newErrors.targetUrl = "Protokol tidak valid. URL target harus diawali dengan https:// atau http:// (contoh: https://portal.kampus.ac.id).";
    } else {
      try {
        const parsed = new URL(urlTrimmed);
        if (!parsed.hostname || parsed.hostname.indexOf(".") === -1) {
          newErrors.targetUrl = "Nama domain tidak valid. Pastikan menyertakan hostname yang valid (contoh: https://example.com).";
        }
      } catch {
        newErrors.targetUrl = "Format URL tidak valid. Masukkan URL yang mematuhi standar RFC.";
      }
    }

    // Validasi Email jika diisi
    if (formData.auditorEmail && formData.auditorEmail.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.auditorEmail.trim())) {
        newErrors.auditorEmail = "Format email tidak valid. Masukkan alamat email yang benar (contoh: auditor@kampus.ac.id) atau kosongkan kolom.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) {
      return;
    }

    // Mulai simulasi pemindaian audit
    setIsScanning(true);
    setScanProgress(10);
    setScanStepText("Memulai resolusi DNS & jabat tangan (handshake) TLS...");
    setActiveResult(null);

    setTimeout(() => {
      setScanProgress(40);
      setScanStepText("Mengumpulkan dan memeriksa header respons HTTP (CSP, HSTS, XFO)...");
    }, 600);

    setTimeout(() => {
      setScanProgress(75);
      setScanStepText(`Mengevaluasi kepatuhan terhadap kontrol OWASP ASVS ${formData.asvsLevel}...`);
    }, 1200);

    setTimeout(() => {
      setScanProgress(95);
      setScanStepText("Menghitung tanda tangan integritas kriptografis dengan SHA-256...");
    }, 1700);

    setTimeout(() => {
      setScanProgress(100);
      setIsScanning(false);
      setScanStepText("Audit berhasil diselesaikan.");

      // Bentuk hasil audit tiruan berdasarkan masukan
      const simulatedResult: ScanResult = {
        id: `scan-${Date.now().toString().slice(-6)}`,
        targetUrl: formData.targetUrl.trim(),
        scannedAt: new Date().toISOString(),
        durationMs: 1980,
        overallScore: formData.auditScope === "ssl-only" ? 92 : 84,
        grade: "B",
        headersAnalyzed: 8,
        headersPassed: 5,
        headers: defaultSecurityHeaders,
        sslInfo: {
          domain: new URL(formData.targetUrl.trim()).hostname,
          issuer: "Let's Encrypt Authority R3",
          validFrom: "2026-08-01",
          validTo: "2026-11-01",
          daysRemaining: 42,
          cipherSuite: "TLS_AES_256_GCM_SHA384",
          protocol: "TLSv1.3",
          isWeakCipher: false,
          status: "passed",
        },
        findings: sampleScanResults[0].findings,
        integrityHash: "a4f89d30c5e7b21908ef1234abcd567890ef1234567890abcdef123456789012",
      };

      setActiveResult(simulatedResult);
    }, 2200);
  };

  const handleQuickUrlFill = (url: string) => {
    setFormData((prev) => ({ ...prev, targetUrl: url }));
    if (errors.targetUrl) {
      setErrors((prev) => ({ ...prev, targetUrl: undefined }));
    }
  };

  return (
    <main id="main-content" className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="cyan" size="sm">
            Modul Pemindai Utama
          </Badge>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-400 font-mono">OWASP ASVS &amp; NIST SP 800-53</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Pemindai Pasif Keamanan &amp; Header
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          Jalankan evaluasi keamanan non-intrusif pada aplikasi web. Analisis header respons HTTP,
          verifikasi parameter enkripsi SSL/TLS, dan hasilkan catatan audit bertanda tangan kriptografis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Konfigurasi Audit */}
        <section aria-labelledby="form-heading" className="lg:col-span-6 space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle id="form-heading" as="h2" className="text-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Konfigurasi Target Audit
              </CardTitle>
              <CardDescription>
                Masukkan alamat web target dan cakupan audit. Seluruh masukan diverifikasi langsung di sisi klien.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Form Level Error Alert */}
              {isSubmitted && Object.keys(errors).length > 0 && (
                <Alert
                  variant="danger"
                  title="Validasi Formulir Gagal"
                  className="mb-6"
                >
                  Silakan periksa dan perbaiki kesalahan yang tersorot di bawah ini sebelum melanjutkan pemindaian.
                </Alert>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Target URL Input */}
                <div>
                  <Input
                    label="URL Aplikasi Web Target"
                    id="target-url-input"
                    name="targetUrl"
                    isRequired
                    type="url"
                    value={formData.targetUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, targetUrl: e.target.value });
                      if (errors.targetUrl) {
                        setErrors({ ...errors, targetUrl: undefined });
                      }
                    }}
                    error={errors.targetUrl}
                    helperText="Wajib menyertakan protokol (contoh: https://portal.kampus.ac.id)"
                    placeholder="https://domain-anda.ac.id"
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    }
                  />

                  {/* Quick Fill Suggestions */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-slate-500">Pilihan cepat:</span>
                    <button
                      type="button"
                      onClick={() => handleQuickUrlFill("https://portal.kampus.ac.id")}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                    >
                      portal.kampus.ac.id
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickUrlFill("https://library.kampus.ac.id")}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                    >
                      library.kampus.ac.id
                    </button>
                  </div>
                </div>

                {/* Audit Scope Selection */}
                <div>
                  <label
                    htmlFor="audit-scope-select"
                    className="block text-sm font-medium text-slate-200 mb-1.5"
                  >
                    Cakupan Audit
                  </label>
                  <select
                    id="audit-scope-select"
                    name="auditScope"
                    value={formData.auditScope}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        auditScope: e.target.value as ScanFormData["auditScope"],
                      })
                    }
                    className="w-full rounded-xl bg-slate-950/70 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  >
                    <option value="standard">Standar (Header Keamanan HTTP &amp; TLS)</option>
                    <option value="full">Penilaian Penuh (Header, SSL, &amp; Matriks ASVS)</option>
                    <option value="ssl-only">Hanya Inspeksi Sertifikat SSL/TLS</option>
                  </select>
                </div>

                {/* ASVS Verification Level */}
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-slate-200">
                    Target Level Verifikasi OWASP ASVS
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {(["L1", "L2", "L3"] as const).map((level) => (
                      <label
                        key={level}
                        className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          formData.asvsLevel === level
                            ? "bg-cyan-950/60 border-cyan-500/80 text-cyan-300 shadow-sm"
                            : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="asvsLevel"
                          value={level}
                          checked={formData.asvsLevel === level}
                          onChange={() => setFormData({ ...formData, asvsLevel: level })}
                          className="sr-only"
                        />
                        <span>Level {level.replace("L", "")}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    Level 1 adalah tolok ukur dasar; Level 2 direkomendasikan untuk aplikasi yang menangani data sensitif.
                  </p>
                </fieldset>

                {/* Auditor Email */}
                <Input
                  label="Email Notifikasi Auditor (Opsional)"
                  id="auditor-email-input"
                  name="auditorEmail"
                  type="email"
                  value={formData.auditorEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, auditorEmail: e.target.value });
                    if (errors.auditorEmail) {
                      setErrors({ ...errors, auditorEmail: undefined });
                    }
                  }}
                  error={errors.auditorEmail}
                  helperText="Kirimkan salinan ringkasan audit ke email ini setelah selesai"
                  placeholder="auditor@kampus.ac.id"
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />

                {/* Cryptographic Signing Checkbox */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                  <input
                    type="checkbox"
                    id="notify-checkbox"
                    checked={formData.notifyOnComplete}
                    onChange={(e) =>
                      setFormData({ ...formData, notifyOnComplete: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-950"
                  />
                  <label htmlFor="notify-checkbox" className="text-xs text-slate-300">
                    <span className="font-semibold text-white block">
                      Terapkan Penandatanganan Kriptografis FIPS 199
                    </span>
                    Tandatangani laporan audit dengan digest SHA-256 untuk mencegah pemalsuan temuan.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    id="submit-scan-btn"
                    size="lg"
                    variant="primary"
                    className="w-full"
                    isLoading={isScanning}
                    leftIcon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  >
                    {isScanning ? "Menjalankan Audit Keamanan..." : "Eksekusi Pemindaian Audit"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Recent Mock Scans Card */}
          <Card variant="default">
            <CardHeader>
              <CardTitle as="h3" className="text-base flex items-center justify-between">
                <span>Riwayat Audit Tersimpan</span>
                <Badge variant="info" size="sm">
                  Data Tiruan
                </Badge>
              </CardTitle>
              <CardDescription>
                Contoh rekaman asesmen historis yang disiapkan untuk integrasi database mendatang.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleScanResults.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white truncate">
                        {item.targetUrl}
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        Skor: {item.overallScore}/100 • Peringkat: {item.grade} • {item.findings.length} temuan
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setActiveResult(item);
                          setFormData((prev) => ({ ...prev, targetUrl: item.targetUrl }));
                        }}
                      >
                        Inspeksi
                      </Button>
                      <Link href={`/report/${item.id}`}>
                        <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/40">
                          Laporan [id] →
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Column: Live Scan Progress & Results */}
        <section aria-labelledby="results-heading" className="lg:col-span-6 space-y-6">
          {/* Scanning Progress Banner */}
          {isScanning && (
            <Card variant="glow" className="animate-pulse-subtle">
              <CardHeader>
                <CardTitle id="progress-heading" as="h2" className="text-lg text-cyan-300">
                  Audit Sedang Berlangsung
                </CardTitle>
                <CardDescription>
                  Memeriksa postur keamanan pada <span className="font-mono text-white">{formData.targetUrl}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressBar
                  value={scanProgress}
                  label="Kemajuan Pemindaian"
                  colorScheme="cyan"
                  size="md"
                />
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-slate-950/80 p-3 rounded-xl border border-cyan-500/20">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>{scanStepText}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Display */}
          {activeResult && !isScanning ? (
            <div className="space-y-6">
              {/* Scorecard Summary Card */}
              <Card variant="glass">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle id="results-heading" as="h2" className="text-xl">
                      Hasil Penilaian Audit
                    </CardTitle>
                    <CardDescription className="font-mono text-xs mt-0.5">
                      Target: {activeResult.targetUrl}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-cyan-400 font-mono">
                      {activeResult.overallScore}/100
                    </div>
                    <Badge
                      variant={activeResult.grade === "A" ? "passed" : activeResult.grade === "B" ? "warning" : "critical"}
                      size="sm"
                    >
                      Peringkat {activeResult.grade}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Status Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400">Header Lolos</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">
                        {activeResult.headersPassed} / {activeResult.headersAnalyzed}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400">Protokol TLS</div>
                      <div className="text-base font-bold text-cyan-400 mt-0.5">
                        {activeResult.sslInfo.protocol}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="text-slate-400">Total Temuan</div>
                      <div className="text-base font-bold text-amber-400 mt-0.5">
                        {activeResult.findings.length} Butir
                      </div>
                    </div>
                  </div>

                  {/* SHA-256 Report Signature */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono">
                    <div className="text-slate-400 flex items-center gap-1.5 mb-1">
                      <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Tanda Tangan Integritas Laporan (SHA-256):</span>
                    </div>
                    <span className="text-cyan-300 break-all">{activeResult.integrityHash}</span>
                  </div>

                  {/* Link to Full Executive Report */}
                  <div className="pt-2">
                    <Link href="/report">
                      <Button
                        id="view-full-report-btn"
                        size="md"
                        variant="primary"
                        className="w-full justify-between"
                        rightIcon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        }
                      >
                        Buka Laporan Eksekutif Lengkap &amp; Remediasi
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Security Headers Table */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle as="h3" className="text-base">
                    Verifikasi Header Keamanan HTTP
                  </CardTitle>
                  <CardDescription>
                    Evaluasi header sisi klien terhadap proteksi pertahanan peramban modern.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 pr-4 font-semibold">Nama Header</th>
                          <th className="py-2.5 px-4 font-semibold">Status</th>
                          <th className="py-2.5 pl-4 font-semibold">Rekomendasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {activeResult.headers.map((h) => (
                          <tr key={h.name} className="hover:bg-slate-900/50">
                            <td className="py-2.5 pr-4 text-white font-medium">
                              {h.name}
                            </td>
                            <td className="py-2.5 px-4">
                              <Badge variant={h.status} size="sm">
                                {h.status === "passed"
                                  ? "Terpenuhi"
                                  : h.status === "warning"
                                  ? "Peringatan"
                                  : h.status === "failed"
                                  ? "Gagal"
                                  : "Tertunda"}
                              </Badge>
                            </td>
                            <td className="py-2.5 pl-4 text-slate-300 font-sans text-xs">
                              {h.recommendation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : !isScanning ? (
            /* Empty State */
            <Card variant="subtle" className="text-center py-16 border-dashed border-slate-800">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-slate-500 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 id="results-heading" className="text-base font-semibold text-white">
                Belum Ada Hasil Pemindaian
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Tentukan parameter target pada formulir di sebelah kiri lalu klik &quot;Eksekusi Pemindaian Audit&quot;
                atau telusuri salah satu contoh audit tersimpan.
              </p>
            </Card>
          ) : null}
        </section>
      </div>
    </main>
  );
}
