import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "../../../src/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
import { PageHeader } from "../../../src/components/ui/PageHeader";
import { Section } from "../../../src/components/ui/Section";
import { cariLaporan, daftarLaporan } from "@/lib/data";

interface ReportDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Next.js Dynamic Route: /report/[id] (Server Component)
 *
 * Menampilkan rincian laporan audit keamanan individual berdasarkan ID pindaian.
 * Jika parameter ID tidak terdaftar atau tidak valid, memicu notFound()
 * yang secara otomatis merender app/not-found.tsx.
 */
export function generateStaticParams() {
  return daftarLaporan().map((s) => ({ id: s.id }));
}

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;

  // Validasi pola format ID: harus berupa scan-YYYY-XXX
  const isValidFormat = /^scan-\d{4}-\d{3}$/.test(id);
  if (!isValidFormat) {
    notFound();
  }

  // Cari data audit berdasarkan ID melalui modul khusus server (server-only)
  const activeScan = cariLaporan(id);
  if (!activeScan) {
    notFound();
  }

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
    <main id="main-content" className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header Halaman */}
      <PageHeader
        title={`Laporan Hasil Audit: ${activeScan.targetUrl.replace("https://", "")}`}
        eyebrow={`Laporan Spesifik: ${activeScan.id}`}
        description={`Rincian laporan hasil audit keamanan web terverifikasi kriptografis SHA-256 untuk sesi ${activeScan.id}.`}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/report">
              <Button variant="outline" size="sm">
                ← Kembali ke Semua Laporan
              </Button>
            </Link>
            <Link href="/scan">
              <Button variant="primary" size="sm">
                Audit Ulang
              </Button>
            </Link>
          </div>
        }
      />

      {/* Navigasi Switcher Antar Laporan */}
      <section aria-labelledby="report-switcher-heading">
        <h2 id="report-switcher-heading" className="sr-only">
          Pilih ID Laporan Lain
        </h2>
        <div className="p-3 rounded-lg bg-surface-1 border border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-text-3 font-medium px-2">
              Laporan Lain:
            </span>
            {daftarLaporan().map((s) => (
              <Link key={s.id} href={`/report/${s.id}`}>
                <Button
                  size="sm"
                  variant={s.id === activeScan.id ? "primary" : "outline"}
                  className={`text-xs ${
                    s.id === activeScan.id ? "pointer-events-none" : ""
                  }`}
                >
                  {s.id === activeScan.id ? "✓ " : ""}{s.id} ({s.targetUrl.replace("https://", "")})
                </Button>
              </Link>
            ))}
          </div>
          <span className="text-xs font-mono text-text-3 px-2">
            /report/{activeScan.id}
          </span>
        </div>
      </section>

      {/* Grid Informasi Utama */}
      <Section
        title="Ringkasan Eksekutif & Integritas Target"
        description="Hasil asesmen, cipher suite SSL/TLS, dan digest integritas SHA-256."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kartu Skor & Peringkat */}
          <Card variant="default" className="lg:col-span-4 flex flex-col justify-between">
            <CardHeader>
              <CardTitle as="h3" className="text-base text-text-1">
                Peringkat Kesehatan Keamanan
              </CardTitle>
              <CardDescription>
                Skor agregat header HTTP, sertifikat SSL/TLS, dan kontrol ASVS.
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
                  : "Postur Risiko Tinggi — Tindakan Perbaikan Segera Diperlukan"}
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
                  Verifikasi kriptografis FIPS 199 dan parameter koneksi TLS.
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
                    <div className="text-text-3 font-medium">Penerbit Sertifikat</div>
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

            {/* Distribusi Risiko */}
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

      {/* Rincian Temuan Kerentanan */}
      <Section
        title="Temuan Kerentanan &amp; Rencana Remediasi"
        description={`${activeScan.findings.length} butir memerlukan tindakan.`}
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

                {/* Blok Remediasi */}
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
    </main>
  );
}
