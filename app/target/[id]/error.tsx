"use client";

import { useEffect } from "react";

export default function GalatTarget({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[GalatTarget Boundary]", error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto max-w-xl p-6 bg-red-950/40 border border-red-500/30 rounded-xl my-8">
      <h2 className="text-xl font-bold text-red-200">Target Audit Gagal Diproses</h2>
      <p className="mt-2 text-sm text-slate-300">
        Terjadi kesalahan saat memuat atau memproses data target audit ini.
      </p>
      <p className="mt-1 text-xs font-mono text-slate-400">
        Kode rujukan (digest): {error.digest ?? "tidak ada"}
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-4 rounded bg-red-600 hover:bg-red-500 text-white font-medium px-4 py-2 text-sm transition"
      >
        Coba lagi
      </button>
    </div>
  );
}
