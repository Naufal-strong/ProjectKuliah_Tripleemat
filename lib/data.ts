import "server-only";
import { prisma } from "@/lib/prisma";
import { sampleScanResults } from "@/src/data/mockScans";
import { ScanResult } from "@/src/types";

/**
 * Modul Akses Data Server (Server-Only Data Access Layer) — Modul 6
 * Mengakses basis data relasional PostgreSQL via Prisma ORM 7
 */

// Kolom proyeksi aman untuk Target
export const kolomTarget = {
  id: true,
  label: true,
  targetUrl: true,
  auditScope: true,
  asvsLevel: true,
  intervalJam: true,
  auditorEmail: true,
  notifyOnComplete: true,
  notes: true,
  dibuatPada: true,
} as const;

/**
 * Mengambil daftar seluruh target audit dari PostgreSQL
 */
export async function ambilDaftarTarget() {
  return prisma.target.findMany({
    select: {
      ...kolomTarget,
      temuan: {
        select: {
          id: true,
          findingId: true,
          title: true,
          category: true,
          severity: true,
          description: true,
          remediation: true,
          cwe: true,
          asvsRef: true,
          dibuatPada: true,
        },
        orderBy: { dibuatPada: "desc" },
      },
    },
    orderBy: { dibuatPada: "desc" },
  });
}

/**
 * Mengambil satu target audit beserta temuan kerentanannya berdasarkan ID
 */
export async function ambilTarget(id: string) {
  return prisma.target.findUnique({
    where: { id },
    select: {
      ...kolomTarget,
      temuan: {
        select: {
          id: true,
          findingId: true,
          title: true,
          category: true,
          severity: true,
          description: true,
          remediation: true,
          cwe: true,
          asvsRef: true,
          dibuatPada: true,
        },
        orderBy: { dibuatPada: "desc" },
      },
    },
  });
}

// Alias sesuai konvensi Modul 6 (Item -> Target)
export const ambilDaftarItem = ambilDaftarTarget;
export const ambilItem = ambilTarget;

// Kompatibilitas dengan modul 4 (Laporan / Mock Data)
export function cariLaporan(id: string): ScanResult | undefined {
  return sampleScanResults.find((item) => item.id === id);
}

export function daftarLaporan(): ScanResult[] {
  return sampleScanResults;
}

export const daftarItem = sampleScanResults;
export function cariItem(id: string): ScanResult | undefined {
  return cariLaporan(id);
}
