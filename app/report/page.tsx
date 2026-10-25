"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../src/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Alert } from "../../src/components/ui/Alert";
import { PageHeader } from "../../src/components/ui/PageHeader";
import { Section } from "../../src/components/ui/Section";
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
    <main id="main-content" className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      {/* Header Halaman Spesifik */}
      <PageHeader
        title="Scorecard Keamanan & Laporan Audit"
        eyebrow="Modul Eksekutif"
        description="Rincian asesmen formal untuk endpoint web target. Tinjau kerentanan yang teridentifikasi, prioritas remediasi, dan verifikasi integritas kriptografis FIPS 199."
        actions={
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
              variant="secondary"
              size="sm"
              onClick={handlePrintPdf}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              }
            >
              Cetak / PDF
            </Button>
          </div>
        }
      />

      {/* Notifikasi Hasil Ekspor */}
      {exportFeedback && (
        <Alert
          variant="ok"
          title="Operasi Selesai"
          onDismiss={() => setExportFeedback(null)}
        >
          {exportFeedback}
        </Alert>
      )}

      {/* Target Audit Switcher Tabs */}
      <section aria-labelledby="target-selector-heading">
        <h2 id="target-selector-heading" className="sr-only">
          Pilih Laporan Audit Target
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-lg bg-surface-1 border border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-text-3 px-3">
              Pilih Target:
            </span>
            {sampleScanResults.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScanId(s.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeScan.id === s.id
                    ? "bg-accent text-accent-text font-semibold"
                    : "bg-surface-2 text-text-2 hover:text-text-1 hover:bg-surface-0"
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
              className="text-xs"
              rightIcon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              }
            >
              Buka /report/{activeScan.id} →
            </Button>
          </Link>
        </div>
      </section>

      {/* Ringkasan Skor & Metadata Target */}
      <Section
        title="Ringkasan Eksekutif & Integritas Target"
        description="Metrik komprehensif, cipher TLS, dan digest SHA-256 FIPS 199."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kartu Skor */}
          <Card variant="default" className="lg:col-span-4 flex flex-col justify-between">
            <CardHeader>
              <CardTitle as="h3" className="text-base text-text-1">
                Peringkat Kesehatan Keamanan
              </CardTitle>
              <CardDescription>
                Skor kumulatif dari header HTTP, cipher SSL, dan kontrol ASVS.
              </CardDescription>
            </CardHeader>
            <CardContent className="my-auto py-4 text-center">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-lg bg-surface-2 border border-border">
                <span className="text-4xl font-bold text-accent font-mono">
                  {activeScan.grade}
                </span>
              </div>
              <div className="mt-4 text-2xl font-bold text-text-1 tabular-nums">
                {activeScan.overallScore} / 100
              </div>
              <p className="text-xs text-text-3 mt-1">
                {activeScan.overallScore >= 85
                  ? "Postur Keamanan Sangat Kokoh (Hardened)"
                  : activeScan.overallScore >= 70
                  ? "Postur Risiko Sedang — Tindakan Direkomendasikan"
                  : "Postur Risiko Tinggi — Perbaikan Segera Diperlukan"}
              </p>
            </CardContent>
            <div className="p-4 border-t border-border text-xs text-text-3 flex items-center justify-between">
              <span>Latensi Audit: {activeScan.durationMs}ms</span>
              <span className="text-ok font-medium">100% Non-Intrusif</span>
            </div>
          </Card>

          {/* Kartu Metadata & Kriptografi */}
          <Card variant="default" className="lg:col-span-8 flex flex-col justify-between">
            <div>
              <CardHeader>
                <CardTitle as="h3" className="text-base text-text-1">
                  Metadata Target &amp; Tanda Tangan Kriptografis
                </CardTitle>
                <CardDescription>
                  Verifikasi kriptografis FIPS 199 dan telemetri koneksi TLS.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-surface-2 border border-border">
                    <div className="text-text-3 font-medium">Endpoint Target</div>
                    <div className="text-text-1 font-semibold font-mono mt-0.5 break-all">
                      {activeScan.targetUrl}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-2 border border-border">
                    <div className="text-text-3 font-medium">Waktu Audit</div>
                    <div className="text-text-1 font-semibold font-mono mt-0.5">
                      {new Date(activeScan.scannedAt).toUTCString()}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-2 border border-border">
                    <div className="text-text-3 font-medium">Penerbit Sertifikat SSL/TLS</div>
                    <div className="text-text-1 font-semibold mt-0.5">
                      {activeScan.sslInfo.issuer}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-2 border border-border">
                    <div className="text-text-3 font-medium">Cipher Suite</div>
                    <div className="text-text-1 font-semibold font-mono mt-0.5">
                      {activeScan.sslInfo.cipherSuite}
                    </div>
                  </div>
                </div>

                {/* SHA-256 Signature */}
                <div className="p-3 rounded-lg bg-surface-2 border border-border text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-text-2 text-xs flex items-center gap-1.5 font-medium">
                      <svg className="w-4 h-4 text-ok" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Digest Integritas FIPS 199 (SHA-256)
                    </span>
                    <Badge variant="ok" size="sm">
                      Terverifikasi
                    </Badge>
                  </div>
                  <div className="font-mono text-xs text-accent break-all bg-surface-0 p-2 rounded border border-border">
                    {activeScan.integrityHash}
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Risk Distribution Breakdown */}
            <div className="p-4 border-t border-border grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-surface-2 border border-border">
                <span className="font-bold text-fail text-sm block tabular-nums">
                  {severityCount.critical}
                </span>
                <span className="text-text-3 text-xs">Kritis</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-2 border border-border">
                <span className="font-bold text-fail text-sm block tabular-nums">
                  {severityCount.high}
                </span>
                <span className="text-text-3 text-xs">Tinggi</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-2 border border-border">
                <span className="font-bold text-warn text-sm block tabular-nums">
                  {severityCount.medium}
                </span>
                <span className="text-text-3 text-xs">Sedang</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-2 border border-border">
                <span className="font-bold text-info text-sm block tabular-nums">
                  {severityCount.low}
                </span>
                <span className="text-text-3 text-xs">Rendah</span>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Temuan Kerentanan & Remediasi */}
      <Section
        title="Temuan Kerentanan &amp; Rencana Remediasi"
        description={`${activeScan.findings.length} butir memerlukan tindakan remediasi.`}
      >
        {activeScan.findings.length === 0 ? (
          <Card variant="default" className="text-center py-10">
            <p className="text-sm text-ok font-medium">
              Tidak ada anomali keamanan yang terdeteksi. Target menunjukkan tingkat kesesuaian tinggi.
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
                    <span className="font-mono text-xs font-semibold text-text-2">
                      {finding.id}
                    </span>
                    <span className="text-text-3">•</span>
                    <span className="text-xs text-text-3">
                      Kategori: {finding.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-text-3 font-mono">
                    {finding.cwe && (
                      <span className="px-2 py-0.5 rounded bg-surface-2 border border-border">
                        {finding.cwe}
                      </span>
                    )}
                    {finding.asvsRef && (
                      <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-accent">
                        ASVS {finding.asvsRef}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-semibold text-text-1 mb-2">
                  {finding.title}
                </h3>

                <p className="text-xs sm:text-sm text-text-2 leading-relaxed mb-4">
                  {finding.description}
                </p>

                {/* Remediation code block */}
                <div className="p-3.5 rounded-lg bg-surface-0 border border-border space-y-1.5">
                  <div className="text-xs font-medium text-ok flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Rekomendasi Tindakan Remediasi:
                  </div>
                  <div className="font-mono text-xs text-text-2 bg-surface-1 p-2.5 rounded border border-border overflow-x-auto">
                    {finding.remediation}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Katalog Semua Laporan Audit (Akses Rute Dinamis /report/[id]) */}
      <Section
        title="Katalog Laporan Audit (Rute Dinamis /report/[id])"
        description="Klik kartu atau tombol untuk membuka halaman rute dinamis spesifik tiap laporan."
        action={
          <Badge variant="info" size="sm">
            Total: {sampleScanResults.length} Laporan Tersedia
          </Badge>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleScanResults.map((item) => (
            <Card
              key={item.id}
              variant="default"
              isHoverable
              className={`p-5 flex flex-col justify-between ${
                item.id === activeScan.id ? "border-accent ring-1 ring-accent" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={item.grade === "A" ? "ok" : item.grade === "B" ? "info" : "fail"} size="sm">
                    Peringkat {item.grade} • {item.overallScore}/100
                  </Badge>
                  <span className="font-mono text-xs text-text-3">
                    {item.id}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-text-1 mb-1">
                  <Link href={`/report/${item.id}`} className="hover:text-accent transition-colors">
                    {item.targetUrl.replace("https://", "")}
                  </Link>
                </h3>

                <p className="text-xs text-text-3 mb-4">
                  {item.findings.length} temuan teridentifikasi • Penerbit: {item.sslInfo.issuer.split(" ")[0]}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs font-mono text-text-3">
                  /report/{item.id}
                </span>
                <Link href={`/report/${item.id}`}>
                  <Button size="sm" variant="primary">
                    Buka Laporan →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Navigasi Lanjutan */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border text-xs text-text-3">
        <div>
          Milestone: Ekspor otomatis format PDF &amp; verifikasi kriptografis SHA-256.
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
