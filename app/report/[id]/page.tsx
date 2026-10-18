import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "../../../src/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../src/components/ui/Card";
import { Button } from "../../../src/components/ui/Button";
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
    <main id="main-content" className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header Rute Dinamis */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/report"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>← Kembali ke Riwayat Audit</span>
            </Link>
            <span className="text-xs text-slate-500">•</span>
            <Badge variant="cyan" size="sm">
              Laporan Spesifik: {activeScan.id}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Laporan Hasil Audit: {activeScan.targetUrl.replace("https://", "")}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Rincian laporan hasil audit keamanan web terverifikasi kriptografis SHA-256 untuk ID sesi{" "}
            <span className="font-mono text-white">{activeScan.id}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/report">
            <Button variant="outline" size="sm">
              Semua Laporan
            </Button>
          </Link>
          <Link href="/scan">
            <Button variant="primary" size="sm">
              Audit Ulang
            </Button>
          </Link>
        </div>
      </div>

      {/* Navigasi / Switcher Cepat Antar Laporan [id] */}
      <div className="mb-8 p-3 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold px-2">
            Akses Langsung Laporan [id] Lain:
          </span>
          {daftarLaporan().map((s) => (
            <Link key={s.id} href={`/report/${s.id}`}>
              <Button
                size="sm"
                variant={s.id === activeScan.id ? "primary" : "outline"}
                className={`text-xs font-mono ${
                  s.id === activeScan.id ? "pointer-events-none shadow-md shadow-cyan-500/20" : ""
                }`}
              >
                {s.id === activeScan.id ? "✓ " : ""}{s.id} ({s.targetUrl.replace("https://", "")})
              </Button>
            </Link>
          ))}
        </div>
        <span className="text-[11px] font-mono text-slate-500 px-2">
          Segmen Aktif: /report/{activeScan.id}
        </span>
      </div>

      {/* Grid Informasi Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Kartu Skor & Peringkat */}
        <Card variant="glass" className="lg:col-span-4 flex flex-col justify-between">
          <CardHeader>
            <CardTitle as="h2" className="text-base text-slate-300">
              Peringkat Kesehatan Keamanan
            </CardTitle>
            <CardDescription>
              Skor agregat header HTTP, sertifikat SSL/TLS, dan kontrol kepatuhan ASVS.
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

        {/* Kartu Metadata & Kriptografi */}
        <Card variant="default" className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle as="h2" className="text-base text-slate-300">
                Metadata Target &amp; Tanda Tangan Kriptografis
              </CardTitle>
              <CardDescription>
                Verifikasi kriptografis FIPS 199 dan parameter jabat tangan TLS.
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
                  <div className="text-slate-500 font-mono">PENERBIT SERTIFIKAT</div>
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

          {/* Distribusi Risiko */}
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

      {/* Rincian Temuan Kerentanan */}
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

                {/* Blok Remediasi */}
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
    </main>
  );
}
