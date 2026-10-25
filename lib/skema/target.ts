import { z } from "zod";

/**
 * Skema formulir Tambah Target Audit.
 * Dipakai Server Action simpanLaporan() dan menghasilkan tipe MasukanTarget via z.infer.
 * Daftar cakupan dan levelAsvs WAJIB sama dengan union di src/types/index.ts
 * (ScanFormData["auditScope"] dan AsvsLevel).
 */
export const skemaTarget = z.object({
  label: z
    .string()
    .trim()
    .min(3, "Nama target minimal 3 karakter")
    .max(80, "Nama target maksimal 80 karakter"),

  targetUrl: z
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
    }, "Nama domain tidak valid (contoh: https://portal.kampus.ac.id)"),

  // Kolom pilihan (z.enum). Gaya Zod 4 memakai opsi { error: "..." },
  // bukan required_error/invalid_type_error yang sudah dihapus.
  auditScope: z.enum(["standard", "full", "ssl-only"], {
    error: "Pilih salah satu cakupan audit",
  }),

  // Kolom pilihan kedua, diselaraskan dengan union AsvsLevel.
  asvsLevel: z.enum(["L1", "L2", "L3"], {
    error: "Pilih level verifikasi OWASP ASVS",
  }),

  // Kolom rentang angka.
  // PENTING: z.coerce.number() tidak dipakai karena string kosong ("")
  // berubah menjadi 0 dan lolos min(0). Kita petakan "" -> undefined lebih dahulu.
  intervalJam: z.preprocess(
    (nilai) => (nilai === "" || nilai == null ? undefined : Number(nilai)),
    z
      .number({ error: "Interval harus berupa angka" })
      .int("Interval harus bilangan bulat")
      .min(1, "Interval minimal 1 jam")
      .max(168, "Interval maksimal 168 jam (7 hari)")
      .optional(),
  ),

  // Kolom email opsional. Format diperiksa lewat refine agar nilai kosong
  // dapat ditangani lebih dulu, lalu "" diubah menjadi undefined.
  auditorEmail: z
    .string()
    .trim()
    .max(120, "Email maksimal 120 karakter")
    .refine((nilai) => nilai === "" || z.email().safeParse(nilai).success, {
      error: "Format email tidak valid",
    })
    .transform((nilai) => (nilai === "" ? undefined : nilai))
    .optional(),

  // Kotak centang: "on"/"true"/"1" -> true; kunci tidak ada -> false (default).
  notifyOnComplete: z.stringbool().default(false),

  notes: z
    .string()
    .trim()
    .max(300, "Catatan maksimal 300 karakter")
    .optional(),
});

export type MasukanTarget = z.infer<typeof skemaTarget>;
