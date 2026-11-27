import { z } from "zod";
import { skemaIdTarget } from "@/lib/skema";

/**
 * Helper respons galat standar RFC 9457 (Problem Details for HTTP APIs).
 */
export function problem(
  status: number,
  title: string,
  extra: Record<string, unknown> = {},
) {
  return Response.json(
    { type: "about:blank", title, status, ...extra },
    { status, headers: { "Content-Type": "application/problem+json" } },
  );
}

/**
 * Mengubah galat validasi Zod menjadi respons 422 Unprocessable Content.
 */
export function galatValidasi(error: z.ZodError) {
  const { formErrors, fieldErrors } = z.flattenError(error);
  return problem(422, "Unprocessable Content", {
    detail: formErrors[0] ?? "Data tidak lolos validasi.",
    errors: fieldErrors,
  });
}

/**
 * Membaca body JSON dari request; mengembalikan 400 Bad Request jika JSON rusak atau bukan objek.
 */
export async function bacaJson(request: Request) {
  try {
    const data: unknown = await request.json();
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      const res = problem(400, "Bad Request", {
        detail: "Body JSON harus berupa objek.",
      });
      return { ok: false as const, res };
    }
    return { ok: true as const, data };
  } catch {
    const res = problem(400, "Bad Request", {
      detail: "Body harus JSON yang valid.",
    });
    return { ok: false as const, res };
  }
}

/**
 * Membaca dan memvalidasi parameter path [id] (Promise di Next.js 15/16).
 * Mengembalikan string id jika valid, atau null jika tidak sesuai format scan-YYYY-NNN.
 */
export async function bacaId(params: Promise<{ id: string }>) {
  const hasil = skemaIdTarget.safeParse((await params).id);
  return hasil.success ? hasil.data : null;
}
