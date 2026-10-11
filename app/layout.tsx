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
  title: "Tripleemat Security Assessor | OWASP ASVS & NIST Compliance Platform",
  description:
    "Automated Security & Compliance Assessment platform for auditing web applications against OWASP ASVS v4.0.3 and NIST SP 800-53 standards. Scan security headers, SSL/TLS, and generate verifiable audit reports.",
  keywords: [
    "Security Scanner",
    "OWASP ASVS",
    "NIST SP 800-53",
    "Cybersecurity Audit",
    "HTTP Security Headers",
    "SSL TLS Assessment",
    "Web Security",
  ],
  authors: [{ name: "Tripleemat Security Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
