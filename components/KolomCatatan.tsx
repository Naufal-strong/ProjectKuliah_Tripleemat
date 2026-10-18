"use client";

import React, { useId, useState } from "react";

/**
 * Komponen Uji KolomCatatan (Client Component)
 *
 * Sesuai Modul 4 Bagian 1 Langkah 3:
 * Komponen kecil ini menyimpan teks di state lokal dan dipakai untuk mengamati
 * perbedaan perilaku layout (state bertahan) dan template (state direset).
 * useId membuat id unik agar label tetap terhubung ke input meskipun komponen dipakai berulang kali.
 */
export default function KolomCatatan({ label }: { label: string }) {
  const id = useId();
  const [catatan, setCatatan] = useState("");

  return (
    <div className="rounded-xl border border-dashed border-cyan-500/40 bg-slate-950/70 p-3 text-xs">
      <label htmlFor={id} className="block font-semibold text-slate-300">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={catatan}
        onChange={(e) => setCatatan(e.target.value)}
        placeholder="Ketik catatan sesi di sini..."
        className="mt-1.5 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </div>
  );
}
