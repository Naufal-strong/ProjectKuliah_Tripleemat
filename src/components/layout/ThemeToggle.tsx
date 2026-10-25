"use client";

import React, { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", callback);
  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => {
    window.removeEventListener("storage", callback);
    observer.disconnect();
  };
}

function getSnapshot(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

/**
 * ThemeToggle (Client Component)
 *
 * Menggunakan useSyncExternalStore (standar React 19) untuk membaca
 * status tema langsung dari DOM tanpa memicu cascading render.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    const applyTheme = () => {
      // Tambahkan kelas transisi agar seluruh warna dan bayangan berpindah mulus
      document.documentElement.classList.add("theme-transitioning");

      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
        try {
          localStorage.setItem("tripleemat-theme", "dark");
        } catch {
          /* abaikan jika localStorage dibatasi peramban */
        }
      } else {
        document.documentElement.classList.remove("dark");
        try {
          localStorage.setItem("tripleemat-theme", "light");
        } catch {
          /* abaikan jika localStorage dibatasi peramban */
        }
      }

      // Bersihkan kelas transisi setelah durasi peralihan warna selesai
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 400);
    };

    // Gunakan View Transitions API jika didukung oleh peramban
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  };

  return (
    <button
      type="button"
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Beralih ke mode terang (Calm Titanium)"
          : "Beralih ke mode gelap (Midnight Slate)"
      }
      title={
        theme === "dark"
          ? "Mode Gelap aktif — Klik untuk beralih ke Mode Terang"
          : "Mode Terang aktif — Klik untuk beralih ke Mode Gelap"
      }
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface-1 text-text-2 hover:text-text-1 hover:border-border-control transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer shadow-xs"
    >
      {theme === "dark" ? (
        /* Ikon Matahari (Sun) — klik beralih ke mode terang */
        <svg
          className="w-4 h-4 text-warn transition-transform duration-200 rotate-0 hover:rotate-45"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" strokeWidth="2" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 2v2m0 16v2m10-10h-2M4 10H2m15.364-6.364-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0-1.414-1.414M6.05 6.05 4.636 4.636"
          />
        </svg>
      ) : (
        /* Ikon Bulan (Moon) — klik beralih ke mode gelap */
        <svg
          className="w-4 h-4 text-info transition-transform duration-200 rotate-0 hover:-rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          />
        </svg>
      )}
    </button>
  );
}
