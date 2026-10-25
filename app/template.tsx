import React from "react";

/**
 * Next.js App Router Template Component (Server Component)
 *
 * Berfungsi sebagai pembungkus yang dipasang ulang (remount) setiap kali
 * segmen rute navigasi anak berganti. Memastikan state komponen klien di-reset
 * dan animasi transisi halaman (animate-page-enter) dieksekusi secara mulus.
 */
export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="page-transition-progress" aria-hidden="true" />
      <div className="cinematic-page-curtain" aria-hidden="true" />
      <div className="w-full flex-1 flex flex-col animate-page-enter">
        {children}
      </div>
    </>
  );
}
