import { z } from "zod";

/**
 * Skema validasi Zod 4 untuk formulir Tambah Temuan Audit (Entitas Anak)
 */
export const skemaTemuan = z.object({
  findingId: z
    .string()
    .trim()
    .min(2, "Kode temuan minimal 2 karakter (contoh: FIND-01)")
    .max(20, "Kode temuan maksimal 20 karakter"),

  title: z
    .string()
    .trim()
    .min(3, "Judul temuan minimal 3 karakter")
    .max(120, "Judul temuan maksimal 120 karakter"),

  category: z
    .string()
    .trim()
    .min(2, "Kategori temuan minimal 2 karakter")
    .max(80, "Kategori temuan maksimal 80 karakter"),

  severity: z.enum(["critical", "high", "medium", "low", "info"], {
    error: "Pilih tingkat keparahan yang sah",
  }),

  description: z
    .string()
    .trim()
    .min(5, "Deskripsi temuan minimal 5 karakter")
    .max(1000, "Deskripsi temuan maksimal 1000 karakter"),

  remediation: z
    .string()
    .trim()
    .min(5, "Rekomendasi perbaikan minimal 5 karakter")
    .max(1000, "Rekomendasi perbaikan maksimal 1000 karakter"),

  cwe: z
    .string()
    .trim()
    .max(30, "Rujukan CWE maksimal 30 karakter")
    .optional()
    .transform((val) => (val === "" || val == null ? undefined : val)),

  asvsRef: z
    .string()
    .trim()
    .max(30, "Rujukan ASVS maksimal 30 karakter")
    .optional()
    .transform((val) => (val === "" || val == null ? undefined : val)),
});

export type MasukanTemuan = z.infer<typeof skemaTemuan>;
