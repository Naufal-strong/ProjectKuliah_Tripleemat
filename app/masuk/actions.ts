"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { skemaMasuk } from "@/lib/skema";
import { buatSesi, hapusSesi } from "@/lib/sesi";
import type { StatusForm } from "@/lib/status-form";

/**
 * Server Action Masuk (Autentikasi Auditor)
 * Sesuai Modul 5 Bagian 4:
 * 1. Validasi bentuk input menggunakan skemaMasuk (Zod 4 safeParse)
 * 2. Validasi kredensial terhadap variabel lingkungan
 * 3. Pembuatan cookie sesi ber-HttpOnly
 * 4. Pengalihan rute (redirect) di luar blok try-catch
 */
export async function masuk(
  _sebelumnya: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const mentah = Object.fromEntries(formData);
  const hasil = skemaMasuk.safeParse(mentah);

  if (!hasil.success) {
    return {
      galat: z.flattenError(hasil.error).fieldErrors,
      pesan: "Format masukan tidak valid. Periksa email dan kata sandi Anda.",
      nilai: {
        email: String(mentah.email ?? ""),
      },
    };
  }

  const { email, kataSandi } = hasil.data;

  // Verifikasi terhadap akun demo lingkungan
  const demoEmail = process.env.DEMO_EMAIL || "auditor@contoh.ac.id";
  const demoSandi = process.env.DEMO_KATA_SANDI || "Tripleemat2026!";

  if (email !== demoEmail || kataSandi !== demoSandi) {
    return {
      pesan: "Email atau kata sandi salah.",
      nilai: { email },
    };
  }

  await buatSesi(email);
  redirect("/scan");
}

/**
 * Server Action Keluar (Logout)
 * Mencabut sesi dari memori dan menghapus cookie
 */
export async function keluar() {
  await hapusSesi();
  redirect("/");
}
