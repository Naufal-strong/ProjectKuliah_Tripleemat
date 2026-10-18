"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type Tautan = { href: string; label: string };

/**
 * Komponen TautanNav (Client Component)
 *
 * Sesuai Modul 4 Bagian 4 Langkah 1:
 * Menandai tautan halaman aktif dengan aria-current="page".
 * Hook usePathname hanya dapat dipakai di Client Component ("use client").
 */
export default function TautanNav({ tautan }: { tautan: Tautan[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col md:flex-row items-stretch md:items-center gap-1 lg:gap-2">
      {tautan.map((t) => {
        const aktif =
          t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);

        return (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={aktif ? "page" : undefined}
              className={`block px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                aktif
                  ? "bg-slate-800/80 text-cyan-400 font-semibold shadow-inner"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              {t.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
