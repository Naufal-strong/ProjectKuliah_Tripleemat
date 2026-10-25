/**
 * Tipe StatusForm bersama untuk nilai kembalian setiap aksi formulir (Server Action)
 * Sesuai Modul 5 Bagian 1 Langkah 2:
 * - galat: berisi pesan kesalahan per kolom/field
 * - pesan: berisi pesan status/ringkasan umum (sukses/gagal)
 * - nilai: isian mentah yang dikembalikan ke formulir agar input tidak hilang saat validasi gagal
 */
export type StatusForm = {
  galat?: Record<string, string[] | undefined>;
  pesan?: string;
  nilai?: Record<string, string>;
};
