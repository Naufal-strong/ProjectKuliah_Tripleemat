"use client";

import React, { useActionState } from "react";
import { ubahTarget } from "@/app/target/actions";
import { Button } from "@/src/components/ui/Button";

interface FormUbahTargetProps {
  target: {
    id: string;
    label: string;
    targetUrl: string;
    auditScope: string;
    asvsLevel: string;
    intervalJam: number | null;
    auditorEmail: string | null;
    notifyOnComplete: boolean;
    notes: string | null;
  };
}

export default function FormUbahTarget({ target }: FormUbahTargetProps) {
  const [state, formAction, isPending] = useActionState(
    ubahTarget.bind(null, target.id),
    {}
  );

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-cyan-400" />
        Ubah Informasi & Catatan Target Audit
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
          className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-sm text-rose-300 space-y-1"
        >
          <p className="font-semibold">Periksa kembali isian formulir target:</p>
          {Object.entries(state.galat).map(([kolom, pesan]) => (
            <p key={kolom} className="text-xs">
              &bull; <strong className="font-mono">{kolom}</strong>: {pesan?.join(", ")}
            </p>
          ))}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="edit-label" className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Nama / Label Target <span className="text-rose-400">*</span>
            </label>
            <input
              id="edit-label"
              name="label"
              type="text"
              defaultValue={target.label}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="edit-targetUrl" className="block text-xs font-mono text-slate-300 uppercase mb-1">
              URL Endpoint Target <span className="text-rose-400">*</span>
            </label>
            <input
              id="edit-targetUrl"
              name="targetUrl"
              type="url"
              defaultValue={target.targetUrl}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
            {state.galat?.targetUrl && (
              <p className="mt-1 text-xs text-rose-400">{state.galat.targetUrl[0]}</p>
            )}
          </div>
        </div>

        <input type="hidden" name="auditScope" value={target.auditScope} />
        <input type="hidden" name="asvsLevel" value={target.asvsLevel} />
        <input type="hidden" name="intervalJam" value={target.intervalJam ?? ""} />
        <input type="hidden" name="auditorEmail" value={target.auditorEmail ?? ""} />
        <input type="hidden" name="notifyOnComplete" value={target.notifyOnComplete ? "on" : "false"} />

        <div>
          <label htmlFor="edit-notes" className="block text-xs font-mono text-slate-300 uppercase mb-1">
            Catatan Auditor
          </label>
          <textarea
            id="edit-notes"
            name="notes"
            rows={2}
            defaultValue={target.notes ?? ""}
            placeholder="Catatan inspeksi atau jadwal evaluasi ulang..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <Button type="submit" variant="secondary" size="md" isLoading={isPending}>
          Simpan Perubahan
        </Button>
      </form>
    </div>
  );
}
