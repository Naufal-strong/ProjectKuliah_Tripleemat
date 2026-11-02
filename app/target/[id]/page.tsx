import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ambilTarget } from "@/lib/data";
import { hapusTarget } from "@/app/target/actions";
import { hapusTemuan } from "@/app/target/temuan-actions";
import FormTemuan from "@/components/FormTemuan";
import FormUbahTarget from "@/components/FormUbahTarget";
import FormUbahTemuan from "@/components/FormUbahTemuan";
import { Badge } from "@/src/components/ui/Badge";
import { PageHeader } from "@/src/components/ui/PageHeader";

interface DetailTargetProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DetailTargetProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Detail Target ${id} | Tripleemat`,
  };
}

export default async function DetailTargetPage({ params }: DetailTargetProps) {
  const { id } = await params;

  // Validasi pola format ID publik: wajib scan-YYYY-NNN
  const isValidFormat = /^scan-\d{4}-\d{3}$/.test(id);
  if (!isValidFormat) {
    notFound();
  }

  const target = await ambilTarget(id);
  if (!target) {
    notFound();
  }

  const badgeVariantSeverity = (sev: string): "critical" | "high" | "medium" | "low" | "info" => {
    switch (sev) {
      case "critical":
        return "critical";
      case "high":
        return "high";
      case "medium":
        return "medium";
      case "low":
        return "low";
      default:
        return "info";
    }
  };

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link
          href="/target"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          &larr; Kembali ke Katalog Target
        </Link>
      </div>

      <PageHeader
        eyebrow={`ID TARGET: ${target.id}`}
        title={target.label}
        description={`Endpoint audit: ${target.targetUrl}`}
      />

      {/* Rincian Target */}
      <div className="mb-8 rounded-xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">
              Cakupan: <strong className="text-slate-100">{target.auditScope}</strong>
            </span>
            <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">
              Level ASVS: <strong className="text-cyan-300">{target.asvsLevel}</strong>
            </span>
            {target.intervalJam && (
              <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">
                Interval: <strong className="text-slate-100">{target.intervalJam} jam</strong>
              </span>
            )}
            {target.auditorEmail && (
              <span className="rounded bg-slate-800 px-2.5 py-1 text-slate-300">
                Auditor: <strong className="text-slate-100">{target.auditorEmail}</strong>
              </span>
            )}
          </div>

          <span className="text-xs text-slate-400">
            Terdaftar pada: {new Date(target.dibuatPada).toLocaleString("id-ID")}
          </span>
        </div>

        {target.notes && (
          <div className="mb-4 rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
            <p className="text-xs text-slate-400">
              <strong className="text-slate-300">Catatan Auditor:</strong> {target.notes}
            </p>
          </div>
        )}

        {/* Form Edit Target (Ubah Catatan / Label) */}
        <div className="mt-4">
          <FormUbahTarget target={target} />
        </div>
      </div>

      {/* Bagian Temuan Kerentanan (Entitas Anak) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Temuan Kerentanan Audit
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-cyan-400 font-mono">
              {target.temuan.length}
            </span>
          </h2>
        </div>

        {target.temuan.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-8 text-center">
            <p className="text-sm text-slate-400">Belum ada temuan kerentanan yang dicatat untuk target ini.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {target.temuan.map((t) => (
              <li
                key={t.id}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                      {t.findingId}
                    </span>
                    <Badge variant={badgeVariantSeverity(t.severity)} size="sm">
                      {t.severity.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-400">· {t.category}</span>
                  </div>

                  <form action={hapusTemuan.bind(null, t.id, target.id)}>
                    <button
                      type="submit"
                      className="text-xs text-rose-400 hover:text-rose-300 underline font-mono"
                    >
                      Hapus Temuan
                    </button>
                  </form>
                </div>

                <h3 className="text-base font-semibold text-slate-200 mb-1">{t.title}</h3>
                <p className="text-xs text-slate-300 mb-3">{t.description}</p>

                <div className="rounded bg-slate-950/80 p-3 border border-slate-800/80 text-xs">
                  <strong className="text-emerald-400">Rekomendasi Remediasi:</strong>
                  <p className="text-slate-300 mt-0.5">{t.remediation}</p>
                </div>

                {(t.cwe || t.asvsRef) && (
                  <div className="mt-3 flex gap-2 text-[11px] text-slate-400 font-mono">
                    {t.cwe && <span>Rujukan: {t.cwe}</span>}
                    {t.asvsRef && <span>ASVS: {t.asvsRef}</span>}
                  </div>
                )}

                {/* Form Ubah Temuan (Update Entitas Anak) */}
                <FormUbahTemuan temuan={t} targetId={target.id} />
              </li>
            ))}
          </ul>
        )}

        {/* Form Tambah Temuan Baru */}
        <FormTemuan targetId={target.id} />
      </div>

      {/* Bagian Hapus Target dengan Transaksi Atomik */}
      <div className="rounded-xl border border-rose-950/60 bg-rose-950/20 p-6 text-center">
        <h3 className="text-base font-semibold text-rose-300 mb-1">Zona Bahaya: Hapus Target Audit</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
          Menghapus target ini akan menghapus seluruh data target beserta {target.temuan.length} temuan terkait
          secara atomik dalam satu transaksi basis data.
        </p>

        <form action={hapusTarget.bind(null, target.id)}>
          <button
            type="submit"
            className="rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-rose-500 transition-colors"
          >
            Hapus Target Beserta Temuan
          </button>
        </form>
      </div>
    </main>
  );
}
