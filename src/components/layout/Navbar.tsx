"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import TautanNav from "@/components/TautanNav";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Pemindai Keamanan", href: "/scan" },
    { label: "Matriks OWASP ASVS", href: "/asvs" },
    { label: "Laporan Audit", href: "/report" },
  ];

  return (
    <>
      {/* Tautan Pintasan Konten Utama untuk Aksesibilitas Keyboard */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-text focus:font-bold focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-text-1"
      >
        Lewati ke konten utama
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-border bg-surface-1/90 backdrop-blur-md">
        <nav
          aria-label="Navigasi Utama"
          className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16"
        >
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1 rounded-lg p-1"
            aria-label="Beranda Tripleemat Security Assessor"
          >
            <div className="relative h-9 w-9 rounded-lg overflow-hidden shrink-0 border border-border shadow-xs">
              <Image
                src="/logo.png"
                alt="Logo Tripleemat"
                width={36}
                height={36}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-semibold text-sm text-text-1">
                Tripleemat
              </span>
              <span className="font-semibold text-sm text-accent ml-1">
                Assessor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links via TautanNav (Client Component) */}
          <div className="hidden md:flex items-center">
            <TautanNav tautan={navLinks} />
          </div>

          {/* Desktop Actions: Theme Toggle & Quick CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/scan"
              id="header-scan-cta"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-accent text-accent-text text-xs font-semibold transition-all duration-150 hover:brightness-110 btn-3d-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Pindai Target</span>
            </Link>
          </div>

          {/* Mobile Right Controls: Theme Toggle & Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              id="mobile-menu-toggle"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-3 hover:text-text-1 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="md:hidden border-t border-border bg-surface-1 px-4 pt-2 pb-6 space-y-1"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-surface-2 text-accent font-semibold"
                      : "text-text-2 hover:text-text-1 hover:bg-surface-2"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                href="/scan"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-accent-text font-semibold text-sm"
              >
                <span>Pindai Target Sekarang</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
