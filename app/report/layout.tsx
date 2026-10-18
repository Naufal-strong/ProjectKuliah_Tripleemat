import React from "react";
import KolomCatatan from "@/components/KolomCatatan";

/**
 * Layout Bersarang Segmen Laporan (Server Component)
 *
 * Sesuai Modul 4 Bagian 1 Langkah 4 & Checkpoint 1:
 * Layout ini membungkus rute /report dan seluruh rute dinamis di bawahnya (/report/[id]).
 * Layout dipertahankan saat navigasi, sehingga state Client Component di dalamnya (seperti KolomCatatan)
 * tetap tersimpan saat pengguna berpindah halaman detail laporan.
 */
export default function LayoutReport({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex-1 flex flex-col">
      {/* Panel Navigasi Segmen & Kolom Catatan Layout */}
      <div className="w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <p className="font-semibold text-xs text-white">
                Panel Segmen Laporan Audit (Nested Layout)
              </p>
              <p className="text-[11px] text-slate-400">
                Layout dipertahankan saat navigasi — teks di bawah tetap ada saat membuka detail [id].
              </p>
            </div>
          </div>
          <div className="w-full sm:w-80">
            <KolomCatatan label="Catatan di layout (Tetap Ada)" />
          </div>
        </div>
      </div>

      {/* Konten Halaman Segmen */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
