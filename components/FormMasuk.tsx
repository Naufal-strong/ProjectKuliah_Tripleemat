"use client";

import React, { useActionState } from "react";
import { masuk } from "@/app/masuk/actions";
import { Button } from "@/src/components/ui/Button";
import { Alert } from "@/src/components/ui/Alert";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};

/**
 * FormMasuk (Client Component)
 *
 * Menggunakan React 19 useActionState untuk memproses Server Action
 * lengkap dengan penanganan galat per kolom dan atribut aksesibilitas ARIA.
 */
export default function FormMasuk() {
  const [status, aksi, pending] = useActionState(masuk, awal);
  const g = status.galat;
  const n = status.nilai;

  return (
    <form action={aksi} className="space-y-5" noValidate>
      {status.pesan && (
        <Alert
          variant="fail"
          title="Autentikasi Gagal"
          role="status"
          aria-live="polite"
        >
          {status.pesan}
        </Alert>
      )}

      {/* Kolom Email */}
      <div>
        <label
          htmlFor="email-input"
          className="block text-sm font-medium text-text-2 mb-1.5"
        >
          Email Auditor <span className="text-fail font-bold">*</span>
        </label>
        <input
          id="email-input"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={n?.email ?? ""}
          aria-invalid={!!g?.email}
          aria-describedby="galat-email"
          placeholder="auditor@contoh.ac.id"
          className={`w-full rounded-lg bg-surface-1 border px-3.5 py-2.5 text-sm text-text-1 placeholder-text-3 transition-colors duration-150 focus:outline-none focus:ring-2 ${
            g?.email
              ? "border-fail focus:border-fail focus:ring-fail/20"
              : "border-border-control focus:border-accent focus:ring-accent/15"
          }`}
        />
        {g?.email && (
          <p
            id="galat-email"
            role="alert"
            className="text-xs text-fail font-medium mt-1.5 flex items-center gap-1"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeWidth="2" strokeLinecap="round" d="m15 9-6 6m0-6 6 6" />
            </svg>
            <span>{g.email[0]}</span>
          </p>
        )}
      </div>

      {/* Kolom Kata Sandi */}
      <div>
        <label
          htmlFor="katasandi-input"
          className="block text-sm font-medium text-text-2 mb-1.5"
        >
          Kata Sandi <span className="text-fail font-bold">*</span>
        </label>
        <input
          id="katasandi-input"
          name="kataSandi"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={!!g?.kataSandi}
          aria-describedby="galat-sandi"
          placeholder="Minimal 8 karakter"
          className={`w-full rounded-lg bg-surface-1 border px-3.5 py-2.5 text-sm text-text-1 placeholder-text-3 transition-colors duration-150 focus:outline-none focus:ring-2 ${
            g?.kataSandi
              ? "border-fail focus:border-fail focus:ring-fail/20"
              : "border-border-control focus:border-accent focus:ring-accent/15"
          }`}
        />
        {g?.kataSandi && (
          <p
            id="galat-sandi"
            role="alert"
            className="text-xs text-fail font-medium mt-1.5 flex items-center gap-1"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeWidth="2" strokeLinecap="round" d="m15 9-6 6m0-6 6 6" />
            </svg>
            <span>{g.kataSandi[0]}</span>
          </p>
        )}
      </div>

      {/* Petunjuk Akun Demo */}
      <div className="p-3 rounded-lg bg-surface-2 border border-border text-xs text-text-3 space-y-1">
        <div className="font-semibold text-text-2">Akun Demo Praktikum:</div>
        <div className="font-mono text-[11px] text-accent">
          Email: auditor@contoh.ac.id
        </div>
        <div className="font-mono text-[11px] text-accent">
          Kata Sandi: Tripleemat2026!
        </div>
      </div>

      {/* Tombol Masuk */}
      <Button
        type="submit"
        id="submit-login-btn"
        size="md"
        variant="primary"
        className="w-full"
        isLoading={pending}
      >
        {pending ? "Memverifikasi Kredensial..." : "Masuk ke Sesi Audit"}
      </Button>
    </form>
  );
}
