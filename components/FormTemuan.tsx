"use client";

import React, { useActionState } from "react";
import { tambahTemuan } from "@/app/target/temuan-actions";
import { Button } from "@/src/components/ui/Button";

interface FormTemuanProps {
  targetId: string;
}

export default function FormTemuan({ targetId }: FormTemuanProps) {
  const [state, formAction, isPending] = useActionState(
    tambahTemuan.bind(null, targetId),
    {}
  );

  return (
    <div className="mt-8 rounded-xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-cyan-400" />
        Tambah Temuan Audit Baru
      </h3>

      {state.pesan && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-sm text-emerald-300"
        >
          {state.pesan}
        </div>
      )}

      {state.galat && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-sm text-rose-300"
        >
          Periksa kembali isian formulir temuan.
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="findingId" className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Kode Temuan <span className="text-rose-400">*</span>
            </label>
            <input
              id="findingId"
              name="findingId"
              type="text"
              placeholder="FIND-03"
              required
              aria-invalid={Boolean(state.galat?.findingId)}
              aria-describedby={state.galat?.findingId ? "galat-findingId" : undefined}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            {state.galat?.findingId && (
              <p id="galat-findingId" className="mt-1 text-xs text-rose-400">
                {state.galat.findingId[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="severity" className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Tingkat Keparahan <span className="text-rose-400">*</span>
            </label>
            <select
              id="severity"
              name="severity"
              defaultValue="medium"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Judul Temuan <span className="text-rose-400">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Header Keamanan Tidak Ditemukan"
              required
              aria-invalid={Boolean(state.galat?.title)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            {state.galat?.title && (
              <p className="mt-1 text-xs text-rose-400">{state.galat.title[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Kategori <span className="text-rose-400">*</span>
            </label>
            <input
              id="category"
              name="category"
              type="text"
              placeholder="Penguatan Header / TLS"
              required
              aria-invalid={Boolean(state.galat?.category)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
            {state.galat?.category && (
              <p className="mt-1 text-xs text-rose-400">{state.galat.category[0]}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-mono text-slate-300 uppercase mb-1">
            Deskripsi Dampak Risiko <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            placeholder="Jelaskan dampak celah keamanan jika dieksploitasi..."
            required
            aria-invalid={Boolean(state.galat?.description)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
          {state.galat?.description && (
            <p className="mt-1 text-xs text-rose-400">{state.galat.description[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="remediation" className="block text-xs font-mono text-slate-300 uppercase mb-1">
            Instruksi Remediasi Perbaikan <span className="text-rose-400">*</span>
          </label>
          <textarea
            id="remediation"
            name="remediation"
            rows={2}
            placeholder="Langkah teknis rekomendasi perbaikan..."
            required
            aria-invalid={Boolean(state.galat?.remediation)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
          {state.galat?.remediation && (
            <p className="mt-1 text-xs text-rose-400">{state.galat.remediation[0]}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cwe" className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Rujukan CWE (Opsional)
            </label>
            <input
              id="cwe"
              name="cwe"
              type="text"
              placeholder="CWE-1021"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="asvsRef" className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Rujukan OWASP ASVS (Opsional)
            </label>
            <input
              id="asvsRef"
              name="asvsRef"
              type="text"
              placeholder="V14.4.7"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <Button type="submit" variant="primary" size="md" isLoading={isPending} className="mt-2">
          Simpan Temuan Audit
        </Button>
      </form>
    </div>
  );
}
