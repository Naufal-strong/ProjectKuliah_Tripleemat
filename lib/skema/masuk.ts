import { z } from "zod";

/**
 * Skema halaman masuk (dipakai pada Bagian 4 praktikum).
 */
export const skemaMasuk = z.object({
  email: z.email("Format email tidak valid"),
  kataSandi: z.string().min(8, "Kata sandi minimal 8 karakter"),
});

export type MasukanMasuk = z.infer<typeof skemaMasuk>;
