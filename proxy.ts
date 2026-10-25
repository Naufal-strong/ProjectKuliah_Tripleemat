import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * proxy.ts (Pengganti middleware.ts di Next.js 16)
 *
 * Pemeriksaan optimistik: Memeriksa keberadaan cookie 'sesi' sebelum rute dirender.
 * Pengunjung yang mengakses rute terproteksi tanpa cookie sesi langsung dialihkan ke /masuk.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has("sesi")) {
    return NextResponse.redirect(new URL("/masuk", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/scan/:path*"],
};
