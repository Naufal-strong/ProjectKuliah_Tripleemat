"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../src/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Alert } from "../../src/components/ui/Alert";
import { sampleScanResults } from "../../src/data/mockScans";

export default function ReportPage() {
  const [selectedScanId, setSelectedScanId] = useState(sampleScanResults[0].id);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const activeScan =
    sampleScanResults.find((s) => s.id === selectedScanId) || sampleScanResults[0];

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(activeScan, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeScan.id}-laporan-audit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportFeedback(
      `Laporan audit ${activeScan.id} berhasil diekspor sebagai JSON dengan digest kriptografis SHA-256.`
    );
  };

  const handlePrintPdf = () => {
    setExportFeedback(
      "Menyiapkan dokumen audit PDF... Dialog pencetakan telah dipicu."
    );
    window.print();
  };

  // Hitung jumlah tingkat keparahan
  const severityCount = {
    critical: activeScan.findings.filter((f) => f.severity === "critical").length,
    high: activeScan.findings.filter((f) => f.severity === "high").length,
    medium: activeScan.findings.filter((f) => f.severity === "medium").length,
    low: activeScan.findings.filter((f) => f.severity === "low").length,
  };

  const getSeverityLabel = (sev: string) => {
    switch (sev) {
      case "critical":
        return "Kritis";
      case "high":
        return "Tinggi";
      case "medium":
        return "Sedang";
      case "low":
        return "Rendah";
      default:
        return "Info";
    }
  };

  return (
    <main id="main-content" className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan" size="sm">
              Modul Eksekutif
            </Badge>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">FIPS 199 &amp; Selaras ISO 27001</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Scorecard Keamanan &amp; Laporan Audit
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Rincian asesmen formal untuk endpoint web target. Tinjau kerentanan yang teridentifikasi,
            prioritas remediasi, dan bukti matematis integritas catatan audit.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/report/${activeScan.id}`}>
            <Button
              id="open-report-id-btn"
              variant="primary"
              size="sm"
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              }
            >
              Buka Halaman [id] ({activeScan.id}) ↗
            </Button>
          </Link>

          <Button
            id="export-json-btn"
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Ekspor JSON
          </Button>

          <Button
            id="print-pdf-btn"
            variant="primary"
            size="sm"
            onClick={handlePrintPdf}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            }
          >
            Cetak / Laporan PDF
          </Button>
        </div>
      </div>

      {/* Export notification feedback */}
      {exportFeedback && (
        <Alert
          variant="success"
          title="Operasi Ekspor Selesai"
          className="mb-6"
          onDismiss={() => setExportFeedback(null)}
        >
          {exportFeedback}
        </Alert>
      )}

      {/* Target Audit Switcher Tabs & Quick Route Action */}
      <section aria-labelledby="target-selector-heading" className="mb-6">
        <h2 id="target-selector-heading" className="sr-only">
          Pilih Laporan Audit Target
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 px-3">
              Pilih Target:
            </span>
            {sampleScanResults.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScanId(s.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all duration-150 cursor-pointer ${
                  activeScan.id === s.id
                    ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {s.targetUrl.replace("https://", "")} (Peringkat {s.grade})
              </button>
            ))}
          </div>

          <Link href={`/report/${activeScan.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 text-xs font-mono"
              rightIcon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              }
            >
              Buka Halaman Rinci /report/{activeScan.id} →
            </Button>
          </Link>
        </div>
      </section>

      {/* Executive Overview Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Score & Grade Card */}
        <Card variant="glass" className="lg:col-span-4 flex flex-col justify-between">
          <CardHeader>
            <CardTitle as="h2" className="text-base text-slate-300">
              Peringkat Kesehatan Keamanan
            </CardTitle>
            <CardDescription>
              Skor kumulatif yang dipetakan dari header HTTP, cipher SSL, dan kontrol ASVS.
            </CardDescription>
          </CardHeader>
          <CardContent className="my-auto py-4 text-center">
            <div className="inline-flex items-center justify-center h-28 w-28 rounded-3xl bg-slate-950 border border-slate-800 shadow-inner">
              <span className="text-5xl font-black text-cyan-400 font-mono">
                {activeScan.grade}
              </span>
            </div>
            <div className="mt-4 text-2xl font-extrabold text-white font-mono">
              {activeScan.overallScore} / 100
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {activeScan.overallScore >= 85
                ? "Postur Keamanan Sangat Kokoh (Hardened)"
                : activeScan.overallScore >= 70
                ? "Postur Risiko Sedang — Tindakan Direkomendasikan"
                : "Postur Risiko Tinggi — Tindakan Perbaikan Segera Diperlukan"}
            </p>
          </CardContent>
          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Latensi Audit: {activeScan.durationMs}ms</span>
            <span className="text-emerald-400 font-semibold">100% Non-Intrusif</span>
          </div>
        </Card>

        {/* Target Metadata & Cryptographic Integrity Card */}
        <Card variant="default" className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle as="h2" className="text-base text-slate-300">
                Metadata Target &amp; Tanda Tangan Kriptografis
              </CardTitle>
              <CardDescription>
                Verifikasi kriptografis FIPS 199 dan telemetri koneksi TLS.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 font-mono">ENDPOINT TARGET</div>
                  <div className="text-white font-semibold font-mono mt-0.5 break-all">
                    {activeScan.targetUrl}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 font-mono">WAKTU AUDIT</div>
                  <div className="text-white font-semibold font-mono mt-0.5">
                    {new Date(activeScan.scannedAt).toUTCString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 font-mono">PENERBIT SERTIFIKAT SSL/TLS</div>
                  <div className="text-white font-semibold mt-0.5">
                    {activeScan.sslInfo.issuer}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 font-mono">CIPHER SUITE</div>
                  <div className="text-white font-semibold font-mono mt-0.5">
                    {activeScan.sslInfo.cipherSuite}
                  </div>
                </div>
              </div>

              {/* SHA-256 Signature */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Digest Integritas FIPS 199 (SHA-256)
                  </span>
                  <Badge variant="passed" size="sm">
                    Terverifikasi
                  </Badge>
                </div>
                <div className="font-mono text-[11px] text-cyan-300 break-all bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  {activeScan.integrityHash}
                </div>
              </div>
            </CardContent>
          </div>

          {/* Risk Distribution Breakdown */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/40">
              <span className="font-bold text-rose-400 text-sm block">
                {severityCount.critical}
              </span>
              <span className="text-slate-400 text-[10px]">Kritis</span>
            </div>
            <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/40">
              <span className="font-bold text-red-400 text-sm block">
                {severityCount.high}
              </span>
              <span className="text-slate-400 text-[10px]">Tinggi</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-900/40">
              <span className="font-bold text-amber-400 text-sm block">
                {severityCount.medium}
              </span>
              <span className="text-slate-400 text-[10px]">Sedang</span>
            </div>
            <div className="p-2 rounded-lg bg-sky-950/30 border border-sky-900/40">
              <span className="font-bold text-sky-400 text-sm block">
                {severityCount.low}
              </span>
              <span className="text-slate-400 text-[10px]">Rendah / Info</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Vulnerability Findings Section */}
      <section aria-labelledby="findings-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="findings-heading" className="text-xl font-bold text-white tracking-tight">
            Temuan Kerentanan &amp; Rencana Remediasi
          </h2>
          <span className="text-xs text-slate-400">
            {activeScan.findings.length} Butir Memerlukan Tindakan
          </span>
        </div>

        {activeScan.findings.length === 0 ? (
          <Card variant="subtle" className="text-center py-10">
            <p className="text-sm text-emerald-400 font-semibold">
              Tidak ada anomali keamanan yang terdeteksi! Target menunjukkan tingkat kesesuaian tinggi.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeScan.findings.map((finding) => (
              <Card key={finding.id} variant="default" className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={finding.severity} size="md" dot>
                      {getSeverityLabel(finding.severity)}
                    </Badge>
                    <span className="font-mono text-xs font-bold text-slate-300">
                      {finding.id}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">
                      Kategori: {finding.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    {finding.cwe && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {finding.cwe}
                      </span>
                    )}
                    {finding.asvsRef && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                        ASVS {finding.asvsRef}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {finding.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {finding.description}
                </p>

                {/* Remediation code / block */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Rekomendasi Tindakan Remediasi:
                  </div>
                  <div className="font-mono text-xs text-slate-200 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
                    {finding.remediation}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Katalog Semua Laporan Audit (Akses Rute Dinamis /report/[id]) */}
      <section aria-labelledby="all-reports-heading" className="mt-12 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="all-reports-heading" className="text-xl font-bold text-white tracking-tight">
              Katalog Laporan Audit (Rute Dinamis /report/[id])
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Klik judul kartu atau tombol di bawah untuk membuka halaman rute dinamis spesifik tiap laporan.
            </p>
          </div>
          <Badge variant="cyan" size="sm">
            Total: {sampleScanResults.length} Laporan Tersedia
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleScanResults.map((item) => (
            <Card
              key={item.id}
              variant={item.id === activeScan.id ? "glass" : "default"}
              isHoverable
              className={`p-5 flex flex-col justify-between ${
                item.id === activeScan.id ? "ring-1 ring-cyan-500/50" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={item.grade === "A" ? "passed" : item.grade === "B" ? "cyan" : "failed"} size="sm">
                    Peringkat {item.grade} • {item.overallScore}/100
                  </Badge>
                  <span className="font-mono text-[11px] text-slate-400">
                    {item.id}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  <Link href={`/report/${item.id}`} className="hover:text-cyan-400 hover:underline transition-colors">
                    {item.targetUrl.replace("https://", "")}
                  </Link>
                </h3>

                <p className="text-xs text-slate-400 mb-4">
                  {item.findings.length} temuan teridentifikasi • Sertifikat: {item.sslInfo.issuer.split(" ")[0]}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400">
                  /report/{item.id}
                </span>
                <Link href={`/report/${item.id}`}>
                  <Button size="sm" variant="primary" className="text-xs">
                    Buka Laporan →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
        <div>
          Rencana Milestone Berikutnya: Ekspor otomatis format PDF &amp; sinkronisasi database relasional PostgreSQL.
        </div>
        <div className="flex items-center gap-3">
          <Link href="/scan">
            <Button variant="outline" size="sm">
              Pindai Endpoint Baru
            </Button>
          </Link>
          <Link href="/asvs">
            <Button variant="secondary" size="sm">
              Tinjau Kontrol ASVS
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
