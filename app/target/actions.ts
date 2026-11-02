"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { skemaTarget } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

function bacaFormTarget(formData: FormData) {
  const mentah = Object.fromEntries(formData);
  const notifyRaw = formData.get("notifyOnComplete");
  return skemaTarget.safeParse({
    ...mentah,
    notifyOnComplete:
      notifyRaw === "on" || notifyRaw === "true" || notifyRaw === "1"
        ? "on"
        : "false",
  });
}

/**
 * Server Action: tambahTarget (Create)
 * Menyimpan data target baru ke tabel Target di PostgreSQL
 */
export async function tambahTarget(
  _prev: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const hasil = bacaFormTarget(formData);

  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }

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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return {
        galat: {
          targetUrl: ["Endpoint target ini sudah terdaftar dalam antrean audit aktif"],
        },
      };
    }
    throw e;
  }

  revalidatePath("/target");
  revalidatePath("/report");
  return { pesan: "Target audit berhasil tersimpan." };
}

/**
 * Server Action: ubahTarget (Update)
 * Memperbarui data target audit (misalnya notes / label)
 */
export async function ubahTarget(
  id: string,
  _prev: StatusForm,
  formData: FormData
): Promise<StatusForm> {
  const hasil = bacaFormTarget(formData);

  if (!hasil.success) {
    return { galat: z.flattenError(hasil.error).fieldErrors };
  }

  try {
    await prisma.target.update({
      where: { id },
      data: {
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          galat: {
            targetUrl: ["Endpoint target ini sudah terdaftar dalam antrean audit aktif"],
          },
        };
      }
      if (e.code === "P2025") {
        return { pesan: "Target tidak ditemukan atau sudah dihapus." };
      }
    }
    throw e;
  }

  revalidatePath("/target");
  revalidatePath(`/target/${id}`);
  revalidatePath("/report");
  return { pesan: "Perubahan target berhasil disimpan." };
}

/**
 * Server Action: hapusTarget (Delete dengan Transaksi Atomik)
 * Menghapus target beserta seluruh temuan auditnya dalam satu transaksi
 * (sesuai aturan onDelete: Restrict di Modul 6 Bagian 5)
 */
export async function hapusTarget(id: string) {
  await prisma.$transaction([
    prisma.temuan.deleteMany({ where: { targetId: id } }),
    prisma.target.delete({ where: { id } }),
  ]);

  revalidatePath("/target");
  revalidatePath("/report");
  redirect("/target");
}

// Alias sesuai konvensi modul (Item -> Target)
export const tambahItem = tambahTarget;
export const ubahItem = ubahTarget;
export const hapusItem = hapusTarget;
