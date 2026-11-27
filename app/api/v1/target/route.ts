import type { NextRequest } from "next/server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { kolomTarget } from "@/lib/data";
import { bacaJson, galatValidasi, problem } from "@/lib/api/problem";
import { skemaKueriTarget, skemaTargetBaru } from "@/lib/skema";

async function buatIdTargetBerikutnya(): Promise<string> {
  const tahun = new Date().getFullYear();
  const prefiks = `scan-${tahun}-`;
  const terakhir = await prisma.target.findFirst({
    where: { id: { startsWith: prefiks } },
    orderBy: { id: "desc" },
    select: { id: true },
  });

  const nomorTerakhir = terakhir
    ? Number.parseInt(terakhir.id.slice(prefiks.length), 10) || 0
    : 0;
  return `${prefiks}${String(nomorTerakhir + 1).padStart(3, "0")}`;
}

// GET /api/v1/target?halaman=1&batas=10&auditScope=full&asvsLevel=L2
export async function GET(request: NextRequest) {
  const kueri = skemaKueriTarget.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!kueri.success) {
    return problem(400, "Bad Request", {
      detail: "Parameter kueri tidak valid.",
      errors: z.flattenError(kueri.error).fieldErrors,
    });
  }

  const { halaman, batas, auditScope, asvsLevel } = kueri.data;
  const where = {
    ...(auditScope ? { auditScope } : {}),
    ...(asvsLevel ? { asvsLevel } : {}),
  };

  const [data, total] = await prisma.$transaction([
    prisma.target.findMany({
      where,
      select: kolomTarget,
      orderBy: { id: "asc" },
      skip: (halaman - 1) * batas,
      take: batas,
    }),
    prisma.target.count({ where }),
  ]);

  return Response.json({ data, meta: { halaman, batas, total } });
}

// POST /api/v1/target
export async function POST(request: Request) {
  const body = await bacaJson(request);
  if (!body.ok) return body.res;

  const hasil = skemaTargetBaru.safeParse(body.data);
  if (!hasil.success) return galatValidasi(hasil.error);

  try {
    const id = await buatIdTargetBerikutnya();
    const target = await prisma.target.create({
      data: {
        id,
        label: hasil.data.label,
        targetUrl: hasil.data.targetUrl,
        auditScope: hasil.data.auditScope,
        asvsLevel: hasil.data.asvsLevel,
        intervalJam: hasil.data.intervalJam,
        auditorEmail: hasil.data.auditorEmail,
        notifyOnComplete: hasil.data.notifyOnComplete,
        notes: hasil.data.notes,
      },
      select: kolomTarget,
    });

    return Response.json(target, {
      status: 201,
      headers: { Location: `/api/v1/target/${target.id}` },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return problem(409, "Conflict", {
        detail: "URL target ini sudah terdaftar dalam antrean audit.",
      });
    }
    throw e;
  }
}
