import "server-only";
import { sampleScanResults } from "@/src/data/mockScans";
import { ScanResult } from "@/src/types";

/**
 * Modul Data Server (Server-Only Data Access Layer)
 *
 * Sesuai Modul 4 Bagian 2 Langkah 1 & Bagian 4 Langkah 4:
 * Berkas ini diproteksi dengan direktif import "server-only" sehingga Next.js
 * secara otomatis memblokir impor modul ini dari Client Component mana pun.
 *
 * Pada Modul 6 mendatang, isi fungsi ini akan diganti dengan kueri Prisma ORM
 * ke PostgreSQL tanpa mengubah antarmuka komponen Server pemanggilnya.
 */

export function cariLaporan(id: string): ScanResult | undefined {
  return sampleScanResults.find((item) => item.id === id);
}

export function daftarLaporan(): ScanResult[] {
  return sampleScanResults;
}

// Alias sesuai konvensi Modul 4
export const daftarItem = sampleScanResults;
export function cariItem(id: string): ScanResult | undefined {
  return cariLaporan(id);
}
