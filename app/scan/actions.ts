"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { skemaTarget } from "@/lib/skema";
import { bacaSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

// Penyimpanan target audit sementara di memori
const g = globalThis as unknown as { targetTersimpan?: Array<{ id: string; targetUrl: string; label: string }> };
const daftarTarget = (g.targetTersimpan ??= []);

/**
 * Server Action: simpanTargetAudit
 * Sesuai Urutan Pemeriksaan Modul 5 (Tabel 1):
 * 1. Verifikasi Sesi: bacaSesi()
 * 2. Validasi Bentuk (Sintaksis): skemaTarget.safeParse()
 * 3. Validasi Semantik: Pemeriksaan aturan bisnis di luar jangkauan skema
 * 4. Mutasi Data: Penyimpanan ke basis data / memori
 * 5. Revalidasi & Pengalihan: revalidatePath & redirect di luar try-catch
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

  // 3. Validasi Semantik: URL target tidak boleh duplikat dengan target yang sedang aktif diaudit
  const targetDuplikat = daftarTarget.some(
    (t) => t.targetUrl.toLowerCase() === hasil.data.targetUrl.toLowerCase()
  );

  if (targetDuplikat) {
    return {
      galat: {
        targetUrl: ["Endpoint target ini sudah terdaftar dalam antrean audit aktif"],
      },
      nilai,
    };
  }

  // 4. Mutasi Data
  let idBaru: string;
  try {
    idBaru = `scan-2026-${String(daftarTarget.length + 1).padStart(3, "0")}`;
    daftarTarget.push({
      id: idBaru,
      targetUrl: hasil.data.targetUrl,
      label: hasil.data.label,
    });
  } catch (err) {
    console.error("Gagal menyimpan target audit:", err);
    return {
      pesan: "Terjadi kesalahan internal saat menyimpan target audit. Coba lagi.",
      nilai,
    };
  }

  // 5. Revalidasi & Redirect (Wajib di LUAR blok try-catch)
  revalidatePath("/report");
  redirect(`/report/${idBaru}`);
}
