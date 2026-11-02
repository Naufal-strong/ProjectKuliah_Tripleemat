"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaTemuan } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

/**
 * Server Action: tambahTemuan (Create Entitas Anak)
 * Menyimpan temuan kerentanan baru untuk target audit tertentu
 */
export async function tambahTemuan(
  targetId: string,
  _prev: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const hasil = skemaTemuan.safeParse(Object.fromEntries(formData));

  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }

  try {
    await prisma.temuan.create({
      data: {
        ...hasil.data,
        targetId,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Pelanggaran constraint unik gabungan @@unique([targetId, findingId])
      if (e.code === "P2002") {
        return {
          galat: {
            findingId: ["Kode temuan ini sudah tercatat pada target ini"],
          },
        };
      }
      // Pelanggaran foreign key constraint Target_fkey
      if (e.code === "P2003") {
        return { pesan: "Target tidak ditemukan." };
      }
    }
    throw e;
  }

  revalidatePath(`/target/${targetId}`);
  return { pesan: "Temuan audit berhasil disimpan." };
}

/**
 * Server Action: ubahTemuan (Update Entitas Anak)
 * Memperbarui data temuan kerentanan (judul, keparahan, deskripsi, remediasi)
 */
export async function ubahTemuan(
  id: number,
  targetId: string,
  _prev: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const hasil = skemaTemuan.safeParse(Object.fromEntries(formData));

  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }

  try {
    await prisma.temuan.update({
      where: { id },
      data: {
        findingId: hasil.data.findingId,
        title: hasil.data.title,
        category: hasil.data.category,
        severity: hasil.data.severity,
        description: hasil.data.description,
        remediation: hasil.data.remediation,
        cwe: hasil.data.cwe,
        asvsRef: hasil.data.asvsRef,
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          galat: {
            findingId: ["Kode temuan ini sudah tercatat pada target ini"],
          },
        };
      }
      if (e.code === "P2025") {
        return { pesan: "Temuan tidak ditemukan atau sudah dihapus." };
      }
    }
    throw e;
  }

  revalidatePath(`/target/${targetId}`);
  return { pesan: "Perubahan temuan audit berhasil disimpan." };
}

/**
 * Server Action: hapusTemuan (Delete Entitas Anak)
 * Menghapus temuan berdasarkan id dan targetId
 */
export async function hapusTemuan(id: number, targetId: string) {
  await prisma.temuan.deleteMany({ where: { id, targetId } });
  revalidatePath(`/target/${targetId}`);
}

// Alias sesuai konvensi modul (Ulasan -> Temuan)
export const tambahUlasan = tambahTemuan;
export const ubahUlasan = ubahTemuan;
export const hapusUlasan = hapusTemuan;
