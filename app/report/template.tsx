import React from "react";
import KolomCatatan from "@/components/KolomCatatan";

/**
 * Template Segmen Laporan (Server Component)
 *
 * Sesuai Modul 4 Bagian 3 Langkah 1:
 * Berbeda dengan layout, template menerima key unik per segmen anak, sehingga
 * isinya dipasang ulang (remount) setiap kali rute anak berganti.
 * State di dalam KolomCatatan pada template ini akan kosong kembali ketika berpindah rute.
 */
export default function TemplateReport({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex-1 flex flex-col space-y-4">
      {/* Panel Template & Kolom Catatan Template */}
      <div className="w-full border-b border-dashed border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <div>
              <p className="font-semibold text-xs text-white">
                Template Segmen Laporan (Auto-Remount)
              </p>
              <p className="text-[11px] text-slate-400">
                Template dipasang ulang saat navigasi — teks di bawah otomatis kosong kembali saat pindah rute.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-80">
            <KolomCatatan label="Catatan di template (Direset)" />
          </div>
        </div>
      </div>

      {/* Konten Halaman */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
