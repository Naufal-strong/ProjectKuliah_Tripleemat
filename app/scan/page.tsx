"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../src/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Input } from "../../src/components/ui/Input";
import { Alert } from "../../src/components/ui/Alert";
import { ProgressBar } from "../../src/components/ui/ProgressBar";
import { PageHeader } from "../../src/components/ui/PageHeader";
import { ScanFormData, FormErrors, ScanResult } from "../../src/types";
import { defaultSecurityHeaders } from "../../src/data/mockSecurityHeaders";
import { sampleScanResults } from "../../src/data/mockScans";
import { skemaTarget } from "@/lib/skema";
import { z } from "zod";

export default function ScannerPage() {
  // Form State
  const [formData, setFormData] = useState<ScanFormData>({
    label: "",
    targetUrl: "",
    auditScope: "standard",
    asvsLevel: "L1",
    intervalJam: "",
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

  // Validasi Skema Zod 4 (Modul 5 — Validasi deklaratif tanpa if-else manual)
  const validateForm = (): boolean => {
    const hasil = skemaTarget.safeParse({
      ...formData,
      notifyOnComplete: formData.notifyOnComplete ? "on" : "false",
    });

    if (!hasil.success) {
      const fieldErrors = z.flattenError(hasil.error).fieldErrors;
      const newErrors: FormErrors = {};

      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          newErrors[key as keyof FormErrors] = messages[0];
        }
      }

      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
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

  const handleQuickUrlFill = (url: string, suggestedLabel: string) => {
    setFormData((prev) => ({
      ...prev,
      targetUrl: url,
      label: prev.label ? prev.label : suggestedLabel,
    }));
    if (errors.targetUrl) {
      setErrors((prev) => ({ ...prev, targetUrl: undefined }));
    }
    if (errors.label) {
      setErrors((prev) => ({ ...prev, label: undefined }));
    }
  };

  return (
    <main id="main-content" className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Pemindai Pasif Keamanan & Header"
        eyebrow="Modul Pemindai Utama"
        description="Jalankan evaluasi keamanan non-intrusif pada aplikasi web. Analisis header respons HTTP, verifikasi parameter enkripsi SSL/TLS, dan hasilkan catatan audit bertanda tangan kriptografis."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Konfigurasi Audit */}
        <section aria-labelledby="form-heading" className="lg:col-span-6 space-y-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle id="form-heading" as="h2" className="text-lg flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-accent"
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
                Masukkan alamat web target dan cakupan audit. Seluruh masukan diverifikasi langsung di sisi klien dengan skema Zod.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Form Level Error Alert */}
              {isSubmitted && Object.keys(errors).length > 0 && (
                <Alert
                  variant="fail"
                  title="Validasi Formulir Gagal"
                  className="mb-6"
                >
                  Silakan periksa dan perbaiki kesalahan yang tersorot di bawah ini sebelum melanjutkan pemindaian.
                </Alert>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Target Label (Nama Target) Input */}
                <div>
                  <Input
                    label="Nama / Label Target Audit"
                    id="target-label-input"
                    name="label"
                    isRequired
                    type="text"
                    value={formData.label}
                    onChange={(e) => {
                      setFormData({ ...formData, label: e.target.value });
                      if (errors.label) {
                        setErrors({ ...errors, label: undefined });
                      }
                    }}
                    error={errors.label}
                    helperText="Minimal 3 karakter, maksimal 80 karakter (contoh: Portal SIAKAD Kampus)"
                    placeholder="Portal Akademik Utama"
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    }
                  />
                </div>

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
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-text-3">
                    <span>Pilihan cepat:</span>
                    <button
                      type="button"
                      onClick={() => handleQuickUrlFill("https://portal.kampus.ac.id", "Portal Akademik Kampus")}
                      className="px-2 py-0.5 rounded bg-surface-2 hover:bg-surface-0 text-text-2 hover:text-text-1 border border-border transition-colors cursor-pointer"
                    >
                      portal.kampus.ac.id
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickUrlFill("https://library.kampus.ac.id", "Perpustakaan Digital Kampus")}
                      className="px-2 py-0.5 rounded bg-surface-2 hover:bg-surface-0 text-text-2 hover:text-text-1 border border-border transition-colors cursor-pointer"
                    >
                      library.kampus.ac.id
                    </button>
                  </div>
                </div>

                {/* Audit Scope Selection */}
                <div>
                  <label
                    htmlFor="audit-scope-select"
                    className="block text-sm font-medium text-text-2 mb-1.5"
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
                    className="w-full rounded-lg bg-surface-1 border border-border-control px-3.5 py-2.5 text-sm text-text-1 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option value="standard">Standar (Header Keamanan HTTP &amp; TLS)</option>
                    <option value="full">Penilaian Penuh (Header, SSL, &amp; Matriks ASVS)</option>
                    <option value="ssl-only">Hanya Inspeksi Sertifikat SSL/TLS</option>
                  </select>
                </div>

                {/* ASVS Verification Level */}
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-text-2">
                    Target Level Verifikasi OWASP ASVS
                  </legend>
                  <div className="grid grid-cols-3 gap-2">
                    {(["L1", "L2", "L3"] as const).map((level) => (
                      <label
                        key={level}
                        className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                          formData.asvsLevel === level
                            ? "bg-accent text-accent-text border-accent font-semibold"
                            : "bg-surface-2 border-border text-text-2 hover:text-text-1"
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
                  <p className="text-xs text-text-3">
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

                {/* Scan Interval Input (Optional) */}
                <Input
                  label="Interval Pemindaian Berulang (Jam, Opsional)"
                  id="interval-jam-input"
                  name="intervalJam"
                  type="number"
                  min={1}
                  max={168}
                  value={formData.intervalJam?.toString() ?? ""}
                  onChange={(e) => {
                    setFormData({ ...formData, intervalJam: e.target.value });
                    if (errors.intervalJam) {
                      setErrors({ ...errors, intervalJam: undefined });
                    }
                  }}
                  error={errors.intervalJam}
                  helperText="Rentang 1–168 jam (7 hari). Kosongkan jika hanya audit sekali jalan."
                  placeholder="24"
                  leftIcon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />

                {/* Notes Input (Optional) */}
                <div>
                  <label htmlFor="notes-input" className="block text-sm font-medium text-text-2 mb-1.5">
                    Catatan Tambahan Auditor (Opsional)
                  </label>
                  <textarea
                    id="notes-input"
                    name="notes"
                    rows={2}
                    value={formData.notes ?? ""}
                    onChange={(e) => {
                      setFormData({ ...formData, notes: e.target.value });
                      if (errors.notes) {
                        setErrors({ ...errors, notes: undefined });
                      }
                    }}
                    placeholder="Contoh: Fokus pada verifikasi CSP dan mitigasi TLS usang"
                    className={`w-full rounded-lg bg-surface-1 border px-3.5 py-2.5 text-sm text-text-1 placeholder:text-text-3 focus:outline-none transition-colors ${
                      errors.notes
                        ? "border-fail focus:border-fail focus:ring-1 focus:ring-fail"
                        : "border-border-control focus:border-accent focus:ring-1 focus:ring-accent"
                    }`}
                  />
                  {errors.notes ? (
                    <p className="mt-1 text-xs text-fail">{errors.notes}</p>
                  ) : (
                    <p className="mt-1 text-xs text-text-3">Maksimal 300 karakter.</p>
                  )}
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-2 border border-border">
                  <input
                    type="checkbox"
                    id="notify-checkbox"
                    checked={formData.notifyOnComplete}
                    onChange={(e) =>
                      setFormData({ ...formData, notifyOnComplete: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-border-control bg-surface-1 text-accent focus:ring-accent"
                  />
                  <label htmlFor="notify-checkbox" className="text-xs text-text-2 cursor-pointer">
                    <span className="font-semibold text-text-1 block">
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
                  Data Audit
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
                    className="p-3 rounded-lg bg-surface-2 border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-text-1 truncate">
                        {item.targetUrl}
                      </div>
                      <div className="text-text-3 text-xs mt-0.5">
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
                        <Button size="sm" variant="outline">
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
            <Card variant="default">
              <CardHeader>
                <CardTitle id="progress-heading" as="h2" className="text-lg text-text-1">
                  Audit Sedang Berlangsung
                </CardTitle>
                <CardDescription>
                  Memeriksa postur keamanan pada <span className="font-mono text-text-1">{formData.targetUrl}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressBar
                  value={scanProgress}
                  label="Kemajuan Pemindaian"
                  variant="info"
                  size="md"
                />
                <div className="flex items-center gap-2 text-xs font-mono text-accent bg-surface-2 p-3 rounded-lg border border-border">
                  <span className="h-2 w-2 rounded-full bg-accent inline-block animate-pulse" aria-hidden="true" />
                  <span>{scanStepText}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Display */}
          {activeResult && !isScanning ? (
            <div className="space-y-6">
              {/* Scorecard Summary Card */}
              <Card variant="default">
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
                    <div className="text-3xl font-bold text-accent font-mono tabular-nums">
                      {activeResult.overallScore}/100
                    </div>
                    <Badge
                      variant={activeResult.grade === "A" ? "ok" : activeResult.grade === "B" ? "warn" : "fail"}
                      size="sm"
                    >
                      Peringkat {activeResult.grade}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Status Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <div className="text-text-3">Header Lolos</div>
                      <div className="text-base font-bold text-ok mt-0.5 tabular-nums">
                        {activeResult.headersPassed} / {activeResult.headersAnalyzed}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <div className="text-text-3">Protokol TLS</div>
                      <div className="text-base font-bold text-accent mt-0.5">
                        {activeResult.sslInfo.protocol}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-border">
                      <div className="text-text-3">Total Temuan</div>
                      <div className="text-base font-bold text-warn mt-0.5 tabular-nums">
                        {activeResult.findings.length} Butir
                      </div>
                    </div>
                  </div>

                  {/* SHA-256 Report Signature */}
                  <div className="p-3 rounded-lg bg-surface-2 border border-border text-xs font-mono">
                    <div className="text-text-3 flex items-center gap-1.5 mb-1 font-sans">
                      <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Tanda Tangan Integritas Laporan (SHA-256):</span>
                    </div>
                    <span className="text-accent break-all">{activeResult.integrityHash}</span>
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
                        <tr className="border-b border-border text-text-3">
                          <th className="py-2.5 pr-4 font-semibold">Nama Header</th>
                          <th className="py-2.5 px-4 font-semibold">Status</th>
                          <th className="py-2.5 pl-4 font-semibold">Rekomendasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {activeResult.headers.map((h) => (
                          <tr key={h.name} className="hover:bg-surface-2 transition-colors">
                            <td className="py-2.5 pr-4 text-text-1 font-mono font-medium">
                              {h.name}
                            </td>
                            <td className="py-2.5 px-4">
                              <Badge
                                variant={h.status === "passed" ? "ok" : h.status === "warning" ? "warn" : "fail"}
                                size="sm"
                              >
                                {h.status === "passed"
                                  ? "Terpenuhi"
                                  : h.status === "warning"
                                  ? "Peringatan"
                                  : h.status === "failed"
                                  ? "Gagal"
                                  : "Tertunda"}
                              </Badge>
                            </td>
                            <td className="py-2.5 pl-4 text-text-2 text-xs">
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
            <Card variant="subtle" className="text-center py-16 border-dashed border-border">
              <div className="mx-auto h-12 w-12 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-text-3 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 id="results-heading" className="text-base font-semibold text-text-1">
                Belum Ada Hasil Pemindaian
              </h2>
              <p className="text-xs text-text-3 max-w-sm mx-auto mt-1">
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
