import "server-only";
import { cookies } from "next/headers";

type Sesi = {
  email: string;
  kedaluwarsa: number;
};

const DELAPAN_JAM = 60 * 60 * 8; // 28800 detik

// Penyimpanan sementara di memori dengan globalThis agar tidak hilang saat Fast Refresh
const g = globalThis as unknown as { sesiTiruan?: Map<string, Sesi> };
const penyimpanan = (g.sesiTiruan ??= new Map<string, Sesi>());

/**
 * Membuat sesi baru dan memasang cookie HTTP-only
 */
export async function buatSesi(email: string) {
  const id = crypto.randomUUID();
  penyimpanan.set(id, {
    email,
    kedaluwarsa: Date.now() + DELAPAN_JAM * 1000,
  });

  const cookieStore = await cookies();
  cookieStore.set("sesi", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DELAPAN_JAM,
  });
}

/**
 * Membaca data sesi aktif dari cookie
 */
export async function bacaSesi() {
  const cookieStore = await cookies();
  const id = cookieStore.get("sesi")?.value;
  const sesi = id ? penyimpanan.get(id) : undefined;

  if (!sesi || sesi.kedaluwarsa < Date.now()) {
    return null;
  }

  return sesi;
}

/**
 * Menghapus sesi dari penyimpanan dan mencabut cookie
 */
export async function hapusSesi() {
  const cookieStore = await cookies();
  const id = cookieStore.get("sesi")?.value;

  if (id) {
    penyimpanan.delete(id);
  }

  cookieStore.delete("sesi");
}
