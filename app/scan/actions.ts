"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaTarget } from "@/lib/skema";
import { bacaSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

/**
 * Server Action: simpanTargetAudit (Modul 5 & 6)
 *
 * Alur Mutasi Data Ketat 5-Tahap:
 * 1. Verifikasi Sesi: bacaSesi()
 * 2. Validasi Bentuk Data (Zod 4 safeParse)
 * 3. Validasi Semantik & Penyimpanan Basis Data (Prisma PostgreSQL)
 * 4. Penanganan Galat Prisma (P2002: unique constraint targetUrl)
 * 5. Revalidasi & Redirect di luar blok try-catch
 */
export async function simpanTargetAudit(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  // 1. Pemeriksaan Sesi (Wajib di Server Action)
  const sesi = await bacaSesi();
  if (!sesi) {
    return {
      pesan: "Silakan masuk terlebih dahulu untuk memulai sesi audit.",
    };
  }

  const mentah = Object.fromEntries(formData);
  const nilai = {
    label: String(mentah.label ?? ""),
    targetUrl: String(mentah.targetUrl ?? ""),
    auditScope: String(mentah.auditScope ?? "standard"),
    asvsLevel: String(mentah.asvsLevel ?? "L1"),
    intervalJam: String(mentah.intervalJam ?? ""),
    auditorEmail: String(mentah.auditorEmail ?? ""),
    notes: String(mentah.notes ?? ""),
  };

  // 2. Validasi Bentuk Data (Zod 4 safeParse)
  const hasil = skemaTarget.safeParse({
    ...mentah,
    notifyOnComplete: mentah.notifyOnComplete ? "on" : "false",
  });

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Periksa kembali isian formulir target audit.",
      nilai,
    };
  }

  // 3 & 4. Mutasi Data ke PostgreSQL via Prisma ORM 7
  let idBaru: string;
  try {
    const totalTarget = await prisma.target.count();
    idBaru = `scan-2026-${String(totalTarget + 1).padStart(3, "0")}`;

    await prisma.target.create({
      data: {
        id: idBaru,
        label: hasil.data.label,
        targetUrl: hasil.data.targetUrl,
        auditScope: hasil.data.auditScope,
        asvsLevel: hasil.data.asvsLevel,
        intervalJam: hasil.data.intervalJam,
        auditorEmail: hasil.data.auditorEmail,
        notifyOnComplete: hasil.data.notifyOnComplete,
        notes: hasil.data.notes,
      },
    });
  } catch (err) {
    // Tangani pelanggaran unique constraint pada targetUrl (P2002)
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        galat: {
          targetUrl: ["Endpoint target ini sudah terdaftar dalam antrean audit aktif"],
        },
        nilai,
      };
    }
    console.error("Gagal menyimpan target audit ke PostgreSQL:", err);
    throw err;
  }

  // 5. Revalidasi & Redirect (Wajib di LUAR blok try-catch)
  revalidatePath("/report");
  revalidatePath("/target");
  redirect(`/report/${idBaru}`);
}

// Alias fungsi sesuai konvensi Modul 6 (tambahItem)
export const tambahTarget = simpanTargetAudit;
export const tambahItem = simpanTargetAudit;

/**
 * Server Action: simpanHasilScan
 * Menyimpan data pemindaian dari antarmuka klien /scan langsung ke tabel Target & Temuan di PostgreSQL.
 */
export async function simpanHasilScan(data: {
  label: string;
  targetUrl: string;
  auditScope: string;
  asvsLevel: string;
  intervalJam?: string | number | null;
  auditorEmail?: string | null;
  notifyOnComplete?: boolean;
  notes?: string | null;
}) {
  const parsed = skemaTarget.safeParse({
    ...data,
    notifyOnComplete: data.notifyOnComplete ? "on" : "false",
  });

  if (!parsed.success) {
    return {
      sukses: false,
      pesan: "Data scan tidak valid menurut skema Zod.",
      galat: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const existing = await prisma.target.findUnique({
      where: { targetUrl: parsed.data.targetUrl },
    });

    if (existing) {
      return {
        sukses: true,
        sudahAda: true,
        targetId: existing.id,
        pesan: `Target sudah terdaftar di PostgreSQL dengan ID ${existing.id}`,
      };
    }

    const totalTarget = await prisma.target.count();
    const idBaru = `scan-2026-${String(totalTarget + 1).padStart(3, "0")}`;

    await prisma.target.create({
      data: {
        id: idBaru,
        label: parsed.data.label,
        targetUrl: parsed.data.targetUrl,
        auditScope: parsed.data.auditScope,
        asvsLevel: parsed.data.asvsLevel,
        intervalJam: parsed.data.intervalJam,
        auditorEmail: parsed.data.auditorEmail,
        notifyOnComplete: parsed.data.notifyOnComplete,
        notes: parsed.data.notes,
      },
    });

    // Tambahkan 2 temuan awal otomatis untuk target baru
    await prisma.temuan.createMany({
      data: [
        {
          findingId: "FIND-01",
          title: "Missing Content-Security-Policy (CSP)",
          category: "Security Headers",
          severity: "high",
          description: "Header CSP tidak terpasang pada respon HTTP target.",
          remediation: "Pasang Content-Security-Policy dengan arahan default-src 'self'.",
          cwe: "CWE-1021",
          asvsRef: "V14.4.1",
          targetId: idBaru,
        },
        {
          findingId: "FIND-02",
          title: "Strict-Transport-Security (HSTS) Kurang Optimal",
          category: "SSL / TLS Configuration",
          severity: "medium",
          description: "Nilai max-age pada header HSTS kurang dari 31536000 detik.",
          remediation: "Tingkatkan nilai max-age=31536000; includeSubDomains.",
          cwe: "CWE-319",
          asvsRef: "V9.1.1",
          targetId: idBaru,
        },
      ],
    });

    revalidatePath("/target");
    revalidatePath("/report");

    return {
      sukses: true,
      sudahAda: false,
      targetId: idBaru,
      pesan: `Target berhasil disimpan ke PostgreSQL dengan ID ${idBaru}!`,
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return {
        sukses: false,
        pesan: "Endpoint target ini sudah terdaftar dalam antrean audit aktif (P2002).",
      };
    }
    console.error("Gagal simpan hasil scan:", err);
    return {
      sukses: false,
      pesan: "Terjadi kesalahan internal saat menyimpan ke basis data.",
    };
  }
}
