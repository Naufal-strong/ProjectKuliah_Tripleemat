import { prisma } from "@/lib/prisma";
import { bacaId, problem } from "@/lib/api/problem";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/v1/target/{id}/temuan
export async function GET(_request: Request, { params }: Ctx) {
  const id = await bacaId(params);
  if (id === null) {
    return problem(400, "Bad Request", {
      detail: "Format ID target harus scan-YYYY-NNN (contoh: scan-2026-001).",
    });
  }

  const target = await prisma.target.findUnique({
    where: { id },
    select: {
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
        orderBy: { id: "desc" },
      },
    },
  });

  if (!target) {
    return problem(404, "Not Found", {
      detail: `Target ${id} tidak ditemukan.`,
    });
  }

  return Response.json({ data: target.temuan });
}
