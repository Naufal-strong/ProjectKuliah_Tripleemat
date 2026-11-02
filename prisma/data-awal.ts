export interface DataTemuanAwal {
  findingId: string;
  title: string;
  category: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string;
  remediation: string;
  cwe?: string;
  asvsRef?: string;
}

export interface DataTargetAwal {
  id: string;
  label: string;
  targetUrl: string;
  auditScope: string;
  asvsLevel: string;
  intervalJam?: number;
  auditorEmail?: string;
  notifyOnComplete: boolean;
  notes?: string;
  temuanAwal: DataTemuanAwal[];
}

export const dataAwal: DataTargetAwal[] = [
  {
    id: "scan-2026-001",
    label: "Portal Akademik Kampus",
    targetUrl: "https://portal.kampus.ac.id",
    auditScope: "full",
    asvsLevel: "L2",
    intervalJam: 24,
    auditorEmail: "auditor@kampus.ac.id",
    notifyOnComplete: true,
    notes: "Audit triwulan sistem akademik portal mahasiswa",
    temuanAwal: [
      {
        findingId: "FIND-01",
        title: "Header Permissions-Policy Tidak Ditemukan",
        category: "Penguatan Header",
        severity: "high",
        description: "Aplikasi tidak menyediakan header Permissions-Policy, berpotensi membuka akses tidak sah ke API peramban.",
        remediation: "Tambahkan header: Permissions-Policy: camera=(), microphone=(), geolocation=()",
        cwe: "CWE-1021",
        asvsRef: "V14.4.7",
      },
      {
        findingId: "FIND-02",
        title: "Konfigurasi Referrer-Policy Lemah",
        category: "Pengungkapan Informasi",
        severity: "medium",
        description: "Referrer-Policy disetel no-referrer-when-downgrade, berisiko membocorkan URL sensitif.",
        remediation: "Konfigurasikan Referrer-Policy ke strict-origin-when-cross-origin",
        cwe: "CWE-200",
        asvsRef: "V14.4.3",
      },
    ],
  },
  {
    id: "scan-2026-002",
    label: "Perpustakaan Digital Terpadu",
    targetUrl: "https://library.kampus.ac.id",
    auditScope: "standard",
    asvsLevel: "L1",
    intervalJam: 48,
    auditorEmail: "perpustakaan@kampus.ac.id",
    notifyOnComplete: false,
    notes: "Audit keamanan rutin katalog e-library",
    temuanAwal: [
      {
        findingId: "FIND-01",
        title: "CORS Header Terlalu Permisif",
        category: "Cross-Origin Protection",
        severity: "medium",
        description: "Access-Control-Allow-Origin disetel ke wildcard (*), memungkinkan domain luar membaca respons internal.",
        remediation: "Batasi Access-Control-Allow-Origin hanya ke origin kampus yang sah",
        cwe: "CWE-346",
        asvsRef: "V14.5.3",
      },
    ],
  },
  {
    id: "scan-2026-003",
    label: "SIAK Legacy Warisan",
    targetUrl: "https://legacy-siak.kampus.ac.id",
    auditScope: "ssl-only",
    asvsLevel: "L3",
    intervalJam: 12,
    auditorEmail: "admin-siak@kampus.ac.id",
    notifyOnComplete: true,
    notes: "Sistem lama memerlukan pengerasan cipher suite SSL/TLS",
    temuanAwal: [
      {
        findingId: "FIND-01",
        title: "Dukungan Cipher Suite Lemah (3DES/RC4)",
        category: "Kriptografi & TLS",
        severity: "critical",
        description: "Server masih menegosiasikan cipher usang TLS 1.0/1.1 yang rentan serangan Sweet32.",
        remediation: "Nonaktifkan TLS 1.0 dan 1.1; wajibkan TLS 1.2 dan TLS 1.3 modern",
        cwe: "CWE-326",
        asvsRef: "V9.1.1",
      },
      {
        findingId: "FIND-02",
        title: "Header HSTS Tidak Diterapkan",
        category: "Penguatan Header",
        severity: "high",
        description: "Aplikasi tidak menyertakan Strict-Transport-Security, rentan serangan SSL stripping.",
        remediation: "Sertakan Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
        cwe: "CWE-319",
        asvsRef: "V9.2.1",
      },
    ],
  },
  {
    id: "scan-2026-004",
    label: "LMS Pembelajaran Daring",
    targetUrl: "https://elearning.kampus.ac.id",
    auditScope: "standard",
    asvsLevel: "L2",
    intervalJam: 24,
    auditorEmail: "lms@kampus.ac.id",
    notifyOnComplete: true,
    notes: "Sistem manajemen pembelajaran daring mahasiswa",
    temuanAwal: [
      {
        findingId: "FIND-01",
        title: "X-Content-Type-Options Tidak Ada",
        category: "MIME Sniffing",
        severity: "low",
        description: "Peramban dapat melakukan MIME-sniffing terhadap berkas materi kuliah yang diunggah.",
        remediation: "Tambahkan header X-Content-Type-Options: nosniff",
        cwe: "CWE-79",
        asvsRef: "V14.4.4",
      },
    ],
  },
  {
    id: "scan-2026-005",
    label: "Portal Penerimaan Mahasiswa Baru",
    targetUrl: "https://pmb.kampus.ac.id",
    auditScope: "full",
    asvsLevel: "L2",
    intervalJam: 12,
    auditorEmail: "pmb@kampus.ac.id",
    notifyOnComplete: true,
    notes: "Sistem pendaftaran calon mahasiswa baru bertrafik tinggi",
    temuanAwal: [
      {
        findingId: "FIND-01",
        title: "Content Security Policy (CSP) Tanpa Nonce",
        category: "Injeksi Konten",
        severity: "high",
        description: "Direktif script-src masih mengizinkan unsafe-inline untuk skrip analitik.",
        remediation: "Terapkan nonce acak kriptografis atau hash SHA-256 pada tag skrip",
        cwe: "CWE-79",
        asvsRef: "V14.4.1",
      },
    ],
  },
  {
    id: "scan-2026-006",
    label: "Portal Jaringan Alumni",
    targetUrl: "https://alumni.kampus.ac.id",
    auditScope: "standard",
    asvsLevel: "L1",
    intervalJam: 72,
    auditorEmail: "alumni@kampus.ac.id",
    notifyOnComplete: false,
    notes: "Pusat karir dan jejaring alumni kampus",
    temuanAwal: [
      {
        findingId: "FIND-01",
        title: "X-Frame-Options Tidak Dikonfigurasi",
        category: "Clickjacking",
        severity: "medium",
        description: "Situs dapat disematkan dalam <iframe> pada situs phishing untuk serangan clickjacking.",
        remediation: "Sertakan X-Frame-Options: SAMEORIGIN atau Content-Security-Policy: frame-ancestors 'self'",
        cwe: "CWE-1021",
        asvsRef: "V14.4.6",
      },
    ],
  },
];
