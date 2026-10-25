"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type Tautan = { href: string; label: string };

/**
 * Komponen TautanNav (Client Component)
 *
 * Menandai tautan halaman aktif dengan aria-current="page".
 * Menggunakan token desain sistem agar selaras dengan tema terang & dinamis.
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
              className={`block px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                aktif
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-text-2 hover:text-text-1 hover:bg-surface-2"
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
