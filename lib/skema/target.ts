import { z } from "zod";

export const AUDIT_SCOPE = ["standard", "full", "ssl-only"] as const;
export const ASVS_LEVEL = ["L1", "L2", "L3"] as const;

const skemaLabel = z
  .string()
  .trim()
  .min(3, "Nama target minimal 3 karakter")
  .max(80, "Nama target maksimal 80 karakter");

const skemaTargetUrl = z
  .string()
  .trim()
  .min(1, "URL target wajib diisi")
  .max(200, "URL target maksimal 200 karakter")
  .refine(
    (nilai) => /^https?:\/\//i.test(nilai),
    "URL harus diawali https:// atau http://",
  )
  .refine((nilai) => {
    try {
      const url = new URL(nilai);
      return Boolean(url.hostname) && url.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Nama domain tidak valid (contoh: https://portal.kampus.ac.id)");

const skemaAuditScope = z.enum(AUDIT_SCOPE, {
  error: "Pilih salah satu cakupan audit",
});

const skemaAsvsLevel = z.enum(ASVS_LEVEL, {
  error: "Pilih level verifikasi OWASP ASVS",
});

const skemaIntervalAngka = z
  .number({ error: "Interval harus berupa angka" })
  .int("Interval harus bilangan bulat")
  .min(1, "Interval minimal 1 jam")
  .max(168, "Interval maksimal 168 jam (7 hari)");

const skemaAuditorEmail = z
  .string()
  .trim()
  .max(120, "Email maksimal 120 karakter")
  .refine((nilai) => nilai === "" || z.email().safeParse(nilai).success, {
    error: "Format email tidak valid",
  })
  .transform((nilai) => (nilai === "" ? undefined : nilai));

const skemaNotes = z
  .string()
  .trim()
  .max(300, "Catatan maksimal 300 karakter");

/**
 * Skema formulir Tambah Target Audit (FormData / Server Actions Modul 5-6).
 * Dipertahankan agar formulir dan Server Actions tetap berjalan tanpa perubahan.
 */
export const skemaTarget = z.object({
  label: skemaLabel,
  targetUrl: skemaTargetUrl,
  auditScope: skemaAuditScope,
  asvsLevel: skemaAsvsLevel,

  // PENTING: z.coerce.number() tidak dipakai karena string kosong ("")
  // berubah menjadi 0 dan lolos min(0). Kita petakan "" -> undefined lebih dahulu.
  intervalJam: z.preprocess(
    (nilai) => (nilai === "" || nilai == null ? undefined : Number(nilai)),
    skemaIntervalAngka.optional(),
  ),

  auditorEmail: skemaAuditorEmail.optional(),

  // Kotak centang: menerima boolean atau "on"/"true"/"1" -> true; kunci tidak ada -> false.
  notifyOnComplete: z.preprocess(
    (v) => (typeof v === "boolean" ? (v ? "on" : "false") : v),
    z.stringbool().default(false),
  ),

  notes: skemaNotes.optional(),
});

export type MasukanTarget = z.infer<typeof skemaTarget>;

/**
 * Skema API Modul 8 (JSON bertipe untuk Route Handlers /api/v1/target)
 */
export const skemaTargetDasar = z.object({
  label: skemaLabel,
  targetUrl: skemaTargetUrl,
  auditScope: skemaAuditScope,
  asvsLevel: skemaAsvsLevel,
  intervalJam: skemaIntervalAngka.optional(),
  auditorEmail: skemaAuditorEmail.optional(),
  notes: skemaNotes.optional(),
});

// POST /api/v1/target: JSON bertipe, notifyOnComplete default false
export const skemaTargetBaru = skemaTargetDasar.extend({
  notifyOnComplete: z
    .boolean({ error: "notifyOnComplete harus berupa boolean" })
    .default(false),
});

// PATCH /api/v1/target/[id]: semua field opsional, minimal 1 field dikirim
export const skemaTargetUbah = skemaTargetDasar
  .extend({
    notifyOnComplete: z.boolean({
      error: "notifyOnComplete harus berupa boolean",
    }),
  })
  .partial()
  .refine((o) => Object.values(o).some((v) => v !== undefined), {
    error: "Kirim minimal satu field yang diubah.",
  });

// Query GET /api/v1/target?halaman=1&batas=10&auditScope=...&asvsLevel=...
export const skemaKueriTarget = z.object({
  halaman: z.coerce.number().int().min(1).default(1),
  batas: z.coerce.number().int().min(1).max(50).default(10),
  auditScope: z
    .enum(AUDIT_SCOPE, { error: "Cakupan audit tidak dikenal" })
    .optional(),
  asvsLevel: z
    .enum(ASVS_LEVEL, { error: "Level ASVS tidak dikenal" })
    .optional(),
});

// Parameter path [id] sesuai tipe aktual Target.id (String format scan-YYYY-NNN)
export const skemaIdTarget = z
  .string()
  .trim()
  .regex(
    /^scan-\d{4}-\d{3}$/,
    "Format ID target tidak valid (harus scan-YYYY-NNN, contoh: scan-2026-001)",
  );
