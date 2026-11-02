import type { Metadata } from "next";
import { connection } from "next/server";
import Link from "next/link";
import { ambilDaftarTarget } from "@/lib/data";
import { Badge } from "@/src/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/src/components/ui/Card";
import { PageHeader } from "@/src/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Katalog Target Audit | Tripleemat Security Assessor",
  description: "Daftar target aplikasi web yang terdaftar di basis data PostgreSQL 18 via Prisma ORM 7",
};

export default async function HalamanKatalogTarget() {
  await connection();
  const targets = await ambilDaftarTarget();

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <PageHeader
        eyebrow="MODUL 6 · PRISMA ORM 7 & POSTGRESQL 18"
        title="Katalog Target Audit"
        description="Data persistensi target keamanan dan riwayat temuan kerentanan yang tersimpan di PostgreSQL 18."
      />

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-slate-300">
            Terhubung ke Basis Data: <strong className="text-cyan-400">PostgreSQL 18 (Docker pg-praktikum)</strong>
          </span>
          <Badge variant="cyan" size="sm">
            {targets.length} Target Terdaftar
          </Badge>
        </div>

        <Link
          href="/scan"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-cyan-500 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Target Audit (/scan)
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>Daftar Target Audit di Basis Data</span>
            <span className="text-xs font-mono text-slate-400">({targets.length} target aktif)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {targets.map((t) => (
          <Card key={t.id} variant="default" className="flex flex-col justify-between hover:border-cyan-500/50 transition-all">
            <CardHeader>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {t.id}
                </span>
                <Badge variant={t.temuan.length > 0 ? "warn" : "ok"} size="sm">
                  {t.temuan.length} Temuan
                </Badge>
              </div>
              <CardTitle as="h2" className="text-lg line-clamp-1">
                {t.label}
              </CardTitle>
              <CardDescription className="font-mono text-xs text-slate-400 break-all">
                {t.targetUrl}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-slate-800 px-2 py-1 text-slate-300">
                  Cakupan: <strong className="text-slate-100">{t.auditScope}</strong>
                </span>
                <span className="rounded bg-slate-800 px-2 py-1 text-slate-300">
                  ASVS: <strong className="text-cyan-300">{t.asvsLevel}</strong>
                </span>
                {t.intervalJam && (
                  <span className="rounded bg-slate-800 px-2 py-1 text-slate-300">
                    {t.intervalJam} jam
                  </span>
                )}
              </div>

              {t.notes && (
                <p className="text-xs text-slate-400 line-clamp-2 italic bg-slate-900/40 p-2 rounded border border-slate-800">
                  &ldquo;{t.notes}&rdquo;
                </p>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-slate-400">
                  {new Date(t.dibuatPada).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <Link
                  href={`/target/${t.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Detail & Temuan &rarr;
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </main>
  );
}
