import type { Metadata } from "next";
import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../src/components/layout/Navbar";
import { Footer } from "../src/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tripleemat Security Assessor | Platform Penilaian Kepatuhan OWASP ASVS & NIST",
  description:
    "Platform Penilaian Keamanan & Kepatuhan Otomatis untuk mengaudit aplikasi web terhadap standar OWASP ASVS v4.0.3 dan NIST SP 800-53. Pindai header keamanan, validasi SSL/TLS, dan hasilkan laporan audit kriptografis terverifikasi.",
  keywords: [
    "Pemindai Keamanan",
    "OWASP ASVS",
    "NIST SP 800-53",
    "Audit Keamanan Siber",
    "HTTP Security Headers",
    "Penilaian SSL TLS",
    "Keamanan Web",
  ],
  authors: [{ name: "Tim Keamanan Tripleemat" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Skrip Pencegah FOUC (Flash of Unstyled Theme) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("tripleemat-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface-0 text-text-1 font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
