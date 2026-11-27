import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { kolomTarget } from "@/lib/data";
import { bacaId, bacaJson, galatValidasi, problem } from "@/lib/api/problem";
import { skemaTargetUbah } from "@/lib/skema";

type Ctx = { params: Promise<{ id: string }> };

const idTidakSah = () =>
  problem(400, "Bad Request", {
    detail: "Format ID target harus scan-YYYY-NNN (contoh: scan-2026-001).",
  });

const tidakAda = (id: string) =>
  problem(404, "Not Found", { detail: `Target ${id} tidak ditemukan.` });

const rekamanTidakAda = (e: unknown) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025";

const konflikRelasi = (e: unknown) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2003";

const duplikatUnik = (e: unknown) =>
  e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

// GET /api/v1/target/{id}
export async function GET(_request: Request, { params }: Ctx) {
  const id = await bacaId(params);
  if (id === null) return idTidakSah();

  const target = await prisma.target.findUnique({
    where: { id },
    select: kolomTarget,
  });
  return target ? Response.json(target) : tidakAda(id);
}

// PATCH /api/v1/target/{id}
export async function PATCH(request: Request, { params }: Ctx) {
  const id = await bacaId(params);
  if (id === null) return idTidakSah();

  const body = await bacaJson(request);
  if (!body.ok) return body.res;

  const hasil = skemaTargetUbah.safeParse(body.data);
  if (!hasil.success) return galatValidasi(hasil.error);

  try {
    const target = await prisma.target.update({
      where: { id },
      data: hasil.data,
      select: kolomTarget,
    });
    return Response.json(target);
  } catch (e) {
    if (rekamanTidakAda(e)) return tidakAda(id);
    if (duplikatUnik(e)) {
      return problem(409, "Conflict", {
        detail: "URL target ini sudah terdaftar pada target lain.",
      });
    }
    throw e;
  }
}

// DELETE /api/v1/target/{id}
export async function DELETE(_request: Request, { params }: Ctx) {
  const id = await bacaId(params);
  if (id === null) return idTidakSah();

  // Sesuai aturan onDelete: Restrict di Modul 6, tolak penghapusan bila masih ada temuan
  const jumlahTemuan = await prisma.temuan.count({ where: { targetId: id } });
  if (jumlahTemuan > 0) {
    return problem(409, "Conflict", {
      detail: `Target ${id} masih memiliki ${jumlahTemuan} temuan.`,
    });
  }

  try {
    await prisma.target.delete({ where: { id } });
  } catch (e) {
    if (rekamanTidakAda(e)) return tidakAda(id);
    if (konflikRelasi(e)) {
      return problem(409, "Conflict", {
        detail: `Target ${id} masih memiliki temuan terkait.`,
      });
    }
    throw e;
  }

  return new Response(null, { status: 204 });
}
