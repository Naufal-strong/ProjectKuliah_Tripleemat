"use client";

import React, { useState, useActionState } from "react";
import { ubahTemuan } from "@/app/target/temuan-actions";
import { Button } from "@/src/components/ui/Button";

interface FormUbahTemuanProps {
  temuan: {
    id: number;
    findingId: string;
    title: string;
    category: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    description: string;
    remediation: string;
    cwe: string | null;
    asvsRef: string | null;
  };
  targetId: string;
}

export default function FormUbahTemuan({ temuan, targetId }: FormUbahTemuanProps) {
  const [buka, setBuka] = useState(false);
  const [state, formAction, isPending] = useActionState(
    ubahTemuan.bind(null, temuan.id, targetId),
    {}
  );

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setBuka(!buka)}
        className="text-xs text-cyan-400 hover:text-cyan-300 underline font-mono cursor-pointer"
      >
        {buka ? "Batal Ubah" : "Ubah Temuan"}
      </button>

      {buka && (
        <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950/80 p-4">
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wide mb-3">
            Perbarui Temuan {temuan.findingId}
          </h4>

          {state.pesan && (
            <div className="mb-3 rounded bg-emerald-950/40 border border-emerald-500/30 p-2 text-xs text-emerald-300">
              {state.pesan}
            </div>
          )}

          {state.galat && (
            <div className="mb-3 rounded bg-rose-950/40 border border-rose-500/30 p-2 text-xs text-rose-300">
              Periksa kembali isian formulir temuan.
            </div>
          )}

          <form action={formAction} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Kode Temuan *
                </label>
                <input
                  name="findingId"
                  defaultValue={temuan.findingId}
                  required
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
                {state.galat?.findingId && (
                  <p className="mt-1 text-[11px] text-rose-400">{state.galat.findingId[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Keparahan *
                </label>
                <select
                  name="severity"
                  defaultValue={temuan.severity}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="info">Info</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Judul Temuan *
                </label>
                <input
                  name="title"
                  defaultValue={temuan.title}
                  required
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
                {state.galat?.title && (
                  <p className="mt-1 text-[11px] text-rose-400">{state.galat.title[0]}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Kategori *
                </label>
                <input
                  name="category"
                  defaultValue={temuan.category}
                  required
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
                {state.galat?.category && (
                  <p className="mt-1 text-[11px] text-rose-400">{state.galat.category[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Deskripsi Dampak Risiko *
              </label>
              <textarea
                name="description"
                rows={2}
                defaultValue={temuan.description}
                required
                className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
              {state.galat?.description && (
                <p className="mt-1 text-[11px] text-rose-400">{state.galat.description[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Instruksi Remediasi Perbaikan *
              </label>
              <textarea
                name="remediation"
                rows={2}
                defaultValue={temuan.remediation}
                required
                className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
              {state.galat?.remediation && (
                <p className="mt-1 text-[11px] text-rose-400">{state.galat.remediation[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Rujukan CWE (Opsional)
                </label>
                <input
                  name="cwe"
                  defaultValue={temuan.cwe ?? ""}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Rujukan ASVS (Opsional)
                </label>
                <input
                  name="asvsRef"
                  defaultValue={temuan.asvsRef ?? ""}
                  className="w-full rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="secondary" size="sm" isLoading={isPending} className="mt-2">
              Simpan Perubahan Temuan
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

