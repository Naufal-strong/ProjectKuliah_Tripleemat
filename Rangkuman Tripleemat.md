# 🛡️ Rangkuman Proyek — Tripleemat Security Assessor

**Tripleemat Security Assessor** adalah platform *Automated Security & Compliance Assessment* terpadu tingkat enterprise yang dirancang untuk mengevaluasi, memindai, serta menilai tingkat kepatuhan siber aplikasi web berdasarkan standar **OWASP ASVS (Application Security Verification Standard v4.0.3)** dan **NIST SP 800-53**.

Platform ini menggabungkan antarmuka modern (Next.js 16 App Router & React 19), basis data relasional berintegritas tinggi (PostgreSQL 18 via Prisma ORM 7), mesin kriptografi pertahanan berlapis (`node:crypto` AEAD AES-256-GCM & HMAC-SHA256), serta infrastruktur container dan sistem operasi yang diperkeras (*Hardened Runtime*).

---

## 📌 Status & Perkembangan Seluruh Milestone

| Milestone | Mata Kuliah & Pekan | Luaran & Capaian Kunci | Status |
|---|---|---|:---:|
| **`sec-0.1`** | Keamanan Siber (Pekan 3) | • **Asset Inventory FIPS 199** (8 aset utama dengan rating CIA & penanda proteksi kriptografi).<br>• **DFD Level 0 Shostack** dengan 3 *Trust Boundaries* (Untrusted External, Application DMZ, Internal Storage).<br>• **Model Ancaman STRIDE** & pemetaan 5 risiko prioritas (`RR-01` s.d. `RR-05`) di `risk-register.md`. | ✅ **SELESAI** |
| **`v0.1`** | Kriptografi & PemWeb (Pekan 3) | • **Modul Kriptografi Dasar** di `src/lib/crypto/` (CSPRNG, SHA-256 digest, AES-256-GCM dasar).<br>• **Arsitektur Frontend & 6 UI Reusable Components** (Button, Card, Badge, Input, Alert, ProgressBar).<br>• **Audit Aksesibilitas WCAG 2.1 AA** (Skor Lighthouse $\ge 95/100$ di seluruh halaman). | ✅ **SELESAI** |
| **`web-0.4`** | PemWeb (Pekan 4) | • **Rute Dinamis Berparameter** `/report/[id]` dan `/target/[id]` dengan penanganan `await params`, regex `/^scan-\d{4}-\d{3}$/`, batas `notFound()`, dan isolasi data aman `server-only`.<br>• **Investigasi Lifecycle Layout vs Template** via `KolomCatatan.tsx`.<br>• Laporan Teknis Lengkap di `docs/praktikum/modul-04.md`. | ✅ **SELESAI** |
| **`web-0.5`** | PemWeb (Pekan 5) | • **Validasi Deklaratif Zod 4** (`skemaTarget`, `skemaMasuk`) dengan umpan balik inline field errors.<br>• **Server Actions Mutasi 5-Tahap** (`"use server"`) dan proteksi cookie sesi `HttpOnly` FIPS 199.<br>• Laporan Teknis Lengkap di `docs/praktikum/modul-05.md`. | ✅ **SELESAI** |
| **`v0.2`** | PemWeb & Kriptografi (Pekan 6) | • **Basis Data Relasional Persisten:** PostgreSQL 18.6 & Prisma ORM 7.10.1 (`Target` 1 ──< N `Temuan`), aturan ketat `onDelete: Restrict`, seed idempoten, dan transaksi rollback terbukti (10 skenario CRUD 100% PASS).<br>• **Kriptografi Lanjutan ($T1 \rightarrow T2$):** Kanonisasi JSON leksikografis & Unicode NFC ($T1$), HMAC-SHA256 berantai ($T2$), Derivasi Kunci HKDF RFC 5869 (*One key, one purpose*), AEAD AES-256-GCM dengan pengikatan AAD `targetId`, master key di luar repo (`~/.tripleemat/audit.key`), dan 22 unit test (100% PASS).<br>• Dokumen Resmi: `KEPUTUSAN.md` dan `docs/praktikum/modul-06.md`. | ✅ **SELESAI** |
| **`sec-0.2`** | Keamanan Siber (Pekan 6) | • **Kontrol Akses & Hashing Lambat:** Matriks RBAC 3 peran, 12 skenario uji akses seimbang (6 positif & 6 negatif), dan hashing kata sandi **Argon2id** ($m=65536, t=3, p=4$) di `security/access-tests.md`.<br>• **Hardening VM Linux:** SSH Key-only (`PasswordAuthentication no`, `PermitRootLogin no`), sysctl kernel hardening, dan skor audit **Lynis 76 / 100** ($\ge 70$).<br>• **Hardening Container:** Multi-stage `Dockerfile` non-root (UID 1001), `compose.yaml` berstatus `read_only: true`, `cap_drop: ALL`, `no-new-privileges: true`, dan port DB 5432 **tidak terekspos** ke host.<br>• **Supply Chain & Vulnerability:** Trivy scan sebelum vs sesudah (**0 Critical CVEs**), SBOM **CycloneDX 1.5 JSON** (`sbom.cdx.json`), dan pembaruan `security/risk-register.md`. | ✅ **SELESAI** |

---

## 🚀 Fitur Utama Platform

1. **Automated Passive HTTP Header & SSL/TLS Analyzer (`/scan`)**
   * Memindai header keamanan web target (`CSP`, `HSTS`, `X-Frame-Options`, `CORS`, `Referrer-Policy`, `Permissions-Policy`).
   * Validasi formulir sisi server tervalidasi Zod 4 dengan penanganan mutasi Server Action asinkron.
   * Menginspeksi metadata sertifikat SSL/TLS (validitas, penerbit, algoritma enkripsi, deteksi cipher lemah seperti MD5/SHA-1).

2. **OWASP ASVS Interactive Compliance Engine (`/asvs`)**
   * Matriks verifikasi kepatuhan interaktif berbasis standar OWASP ASVS v4.0.3 (Level 1, Level 2, dan Level 3).
   * Filter pencarian dinamis, kategorisasi bab (V1 hingga V14), dan pemetaan ke kontrol NIST SP 800-53.
   * Perhitungan skor kepatuhan (*Compliance Score*) secara *real-time*.

3. **Core Industrial Cryptography Vault (`src/lib/crypto/`)**
   * **Kanonisasi JSON Deterministik (`kanonis.ts`):** Mengurutkan properti objek secara alfabetis dan menormalkan karakter ke Unicode NFC agar representasi byte konsisten dan fail-closed terhadap `NaN`/`Infinity`.
   * **Derivasi Kunci HKDF-SHA256 (`kunci.ts`):** Mematuhi NIST SP 800-57 (*One key, one purpose*) untuk memisahkan domain `k_integritas` (HMAC) dan `k_arsip` (AES-GCM) dari satu kunci induk CSPRNG di luar repositori (`~/.tripleemat/audit.key`).
   * **Titik Sambungan $T1 \rightarrow T2$ (`vault.ts`):** Mengikat laporan audit publik dengan kanonisasi ($T1$) + SHA-256 digest ($T1$) + segel HMAC-SHA256 ($T2$).
   * **Enkripsi Terotentikasi AEAD AES-256-GCM (`encryption.ts`):** Mengenkripsi bukti temuan kerentanan sensitif dengan pengikatan AAD `targetId` guna menggagalkan serangan pemindahan ciphertext (*relocation attack*).

4. **Sistem Manajemen Target & Temuan Persisten (`/target` & `/target/[id]`)**
   * Pengelolaan data persisten berbasis **PostgreSQL 18** via **Prisma ORM 7** dengan driver adapter `@prisma/adapter-pg`.
   * Operasi CRUD penuh pada dua entitas berelasi (`Target` 1 ──< N `Temuan`) dengan aturan integritas `onDelete: Restrict`.
   * Transaksi atomik `prisma.$transaction` yang menjamin konsistensi *all-or-nothing rollback*.

5. **Infrastruktur Terisolasi & Hardened Runtime (`sec-0.2`)**
   * Container aplikasi Next.js multi-stage berjalan sebagai pengguna non-root `nextjs` (UID 1001) dengan filesystem *read-only* dan kapabilitas kernel nol (`CapEff: 0000000000000000`).
   * Basis data PostgreSQL terisolasi penuh di dalam jaringan internal bridge Compose tanpa ekspos port ke antarmuka publik host.
   * Sistem operasi VM host diamankan dengan otentikasi SSH berbasis kunci saja (menonaktifkan password dan root login) dengan indeks kepatuhan Lynis mencapai **76 / 100**.

---

## 📋 Tabel Kebutuhan Keamanan (CIA Triad & FIPS 199)

Mengacu pada dokumen [Asset Inventory](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/security/asset-inventory.md):

| # | Data / Komponen | Kategori | CIA FIPS 199 | Mekanisme Proteksi Keamanan |
|---|---|---|:---:|---|
| 1 | **Ruleset Vault** (`asvs-rules.json`) | Data / Config | **L - H - M** | **Integritas (Kanonisasi & SHA-256)**: Verifikasi digest kriptografis setiap pemuatan ruleset untuk mencegah manipulasi kriteria audit (`RR-01`). |
| 2 | **Audit Findings & DB** (Tabel `Target` & `Temuan`) | Data | **H - H - M** | **Kerahasiaan & Integritas (AEAD AES-256-GCM + AAD)**: Enkripsi at-rest dan pengikatan AAD `targetId` serta isolasi port internal Compose (`RR-03`). |
| 3 | **Session & API Token** | Secrets | **H - H - L** | **Keotentikan & Keunikan (CSPRNG 256-bit)**: Dihasilkan via `node:crypto.randomBytes(32)` dan disimpan dalam cookie `HttpOnly` stateful FIPS 199 (`RR-05`). |
| 4 | **Laporan Audit Publik** (Hasil Evaluasi) | Data | **M - H - L** | **Otentisitas & Anti-Tamper (HMAC-SHA256)**: Segel terotentikasi berantai berbasis kunci rahasia `k_integritas` untuk menangkal manipulasi nilai audit (`RR-01`). |
| 5 | **Kredensial Pengguna / Auditor** | Secrets | **H - H - M** | **Fungsi Hash Lambat (Argon2id)**: Memory-hard cost $m=65536\text{ KiB}, t=3, p=4$ ber-salt 16-byte CSPRNG untuk kebal offline brute-force (`RR-05`). |
| 6 | **Akses Host & Container VM** | Host / Infra | **H - H - H** | **Least Privilege & Hardening**: SSH key-only (`PermitRootLogin no`), non-root container UID 1001, `cap_drop: ALL`, dan Lynis Score 76 (`RR-02`, `RR-05`). |

---

## 🧪 Rangkuman Pengujian Otomatis

Platform Tripleemat divalidasi oleh tiga kelompok pengujian otomatis komprehensif:

```
Total Pengujian Otomatis: 44 Skenario (100% PASS)
├── 1. Pengujian Kriptografi Terintegrasi (test/crypto.test.ts) : 22 Skenario (100% PASS)
├── 2. Pengujian CRUD Database & Transaksi (test/crud-modul6.test.ts) : 10 Skenario (100% PASS)
└── 3. Pengujian Kontrol Akses Per Peran (security/access-tests.md) : 12 Skenario (6 Positif & 6 Negatif - 100% PASS)
```

1. **Pengujian Kriptografi (`npm run test:crypto` — 22 Uji Lulus 100%):**
   * Regresi v0.1: SHA-256, Avalanche effect, CSPRNG token uniqueness, AES-GCM dasar.
   * Komponen T1: Kanonisasi JSON deterministik (urutan key diabaikan), normalisasi Unicode NFC, penolakan NaN/Infinity fail-closed, dan validasi allowlist skema laporan.
   * Komponen T2: Ortogonalitas kunci HKDF-SHA256 (NIST SP 800-57), determinisme Known-Answer Test (KAT), dan penolakan master key pendek.
   * Sambungan T1 $\rightarrow$ T2: Segel & verifikasi sah, penolakan data tampered, penolakan tag palsu, penanganan anggun malformed tag, dan verifikasi kunci salah.
   * Vault AEAD: Enkripsi terikat AAD `targetId`, penolakan relokasi ciphertext ke target lain, dan penolakan manipulasi AuthTag.
   * Manajemen Kunci: Pembuatan file kunci CSPRNG, proteksi anti-overwrite flag `wx`, dan penolakan kunci rusak.

2. **Pengujian CRUD & Relasi Modul 6 (`npm run test:modul6` — 10 Uji Lulus 100%):**
   * Create, Read, Update, Delete pada `Target` dan `Temuan`.
   * Verifikasi constraint unik URL, validasi format regex `scan-YYYY-NNN`, dan pembuktian rollback transaksi atomik `prisma.$transaction`.

3. **Pengujian Kontrol Akses Per Peran (`security/access-tests.md` — 12 Uji Lulus 100%):**
   * Tepat **6 Uji Positif** (Tamu baca ASVS, Tamu scan pasif, Auditor baca target, Auditor buat target, Auditor buat temuan, Admin hapus target).
   * Tepat **6 Uji Negatif** (Tamu ditolak baca target 307, Tamu ditolak mutasi 401, Tamu ditolak detail temuan 307, Auditor ditolak hapus target 403, Auditor ditolak baca master key 403, Penyerang ditolak password salah 401).

---

## 📁 Struktur Direktori Proyek Lengkap

```text
tripleemat/
├── .dockerignore                       # Penyaringan berkas sensitif dari layer image Docker
├── Dockerfile                          # Multi-stage hardened build (deps, builder, runner UID 1001)
├── compose.yaml                        # Orchestration terisolasi (read_only, cap_drop ALL, DB no ports)
├── package.json                        # Definisi dependensi & skrip eksekusi
├── tsconfig.json                       # Konfigurasi TypeScript statis ketat
├── next.config.ts                      # Konfigurasi Next.js 16 (output: standalone)
├── KEPUTUSAN.md                        # Decision Log Kriptografi R2 (Kebutuhan -> Mekanisme -> Alasan)
├── AI_LOG.md                           # Log Resmi Tunggal Penggunaan AI (sec-0.1, v-0.1, v0.2, sec-0.2)
├── README.md                           # Panduan Repositori & Dokumentasi Utama
├── Rangkuman Tripleemat.md             # Rangkuman Eksekutif & Teknis Proyek (Dokumen ini)
├── app/                                # Next.js 16 App Router Pages & Actions
│   ├── page.tsx                        # Beranda Dasbor 3D Isometrik & Telemetri
│   ├── layout.tsx                      # Root Layout, Navbar, & Footer
│   ├── scan/page.tsx                   # Pemindai Keamanan Pasif HTTP Header & SSL
│   ├── asvs/page.tsx                   # Matriks Interaktif Kepatuhan OWASP ASVS v4.0.3
│   ├── target/                         # Halaman CRUD Modul 6 (Target & Temuan Relasional)
│   │   ├── page.tsx                    # Daftar Target Persisten PostgreSQL 18
│   │   ├── actions.ts                  # Server Actions Target (Create, Update, Atomic Delete)
│   │   ├── temuan-actions.ts           # Server Actions Temuan Anak (Create, Update, Delete)
│   │   └── [id]/page.tsx               # Rute Dinamis: Detail Target & Manajemen Temuan 1:N
│   └── report/                         # Scorecard Eksekutif & Riwayat Audit
│       ├── page.tsx                    # Executive Scorecard
│       └── [id]/page.tsx               # Detail Laporan Audit (Dynamic Route & server-only)
├── config/
│   └── 00-hardening.conf               # Konfigurasi Pengerasan SSH (Key-Only) & Kernel Sysctl
├── docs/                               # Dokumentasi Praktikum PemWeb
│   ├── praktikum/
│   │   ├── modul-04.md                 # Laporan Praktikum Modul 4 (App Router & Dynamic Route)
│   │   ├── modul-05.md                 # Laporan Praktikum Modul 5 (Zod 4, Form, Session, Cookie)
│   │   └── modul-06.md                 # Laporan Praktikum Modul 6 (PostgreSQL 18 & Prisma ORM 7)
│   └── Screenshot/                     # Bukti Tangkapan Layar Pengujian Praktikum
├── prisma/                             # Skema & Migrasi Basis Data PostgreSQL
│   ├── schema.prisma                   # Model Relasi Target (1) ──< Temuan (N)
│   ├── seed.ts                         # Skrip Seeding Idempoten (.upsert())
│   └── data-awal.ts                    # Dataset Awal Sintetis (7 Target, 10 Temuan)
├── security/                           # Artefak Keamanan Komputasi dan Siber (sec-0.1 & sec-0.2)
│   ├── access-tests.md                 # Matriks RBAC, 12 Uji Akses Seimbang, & Hash Argon2id
│   ├── hardening-notes.md              # Bukti Verifikasi UID 1001, CapEff 0, Read-Only, Port DB
│   ├── lynis-before.txt                # Audit OS Lynis Sebelum Hardening (Skor: 58)
│   ├── lynis-after.txt                 # Audit OS Lynis Sesudah Hardening (Skor: 76 >= 70)
│   ├── image-scan-before.txt           # Pemindaian Trivy Sebelum Hardening (2 Critical CVEs)
│   ├── image-scan-after.txt            # Pemindaian Trivy Sesudah Hardening (0 Critical CVEs)
│   ├── sbom.cdx.json                   # Software Bill of Materials Standar OWASP CycloneDX 1.5 JSON
│   ├── asset-inventory.md              # Inventaris Aset FIPS 199 CIA
│   ├── threat-modeling.md              # Pemodelan Ancaman STRIDE & Batas Kepercayaan
│   └── risk-register.md                # Register Risiko Prioritas RR-01 s.d. RR-05 Terverifikasi
├── src/
│   ├── components/                     # Komponen UI Reusable (Button, Card, Badge, Modal, Form)
│   └── lib/
│       └── crypto/                     # Engine Kriptografi FIPS 199 & NIST SP 800-57
│           ├── index.ts                # Central Barrel Export
│           ├── csprng.ts               # Generator Entropi OS Kernel
│           ├── integrity.ts            # Hashing SHA-256 & Constant-Time Comparison
│           ├── encryption.ts           # AEAD AES-256-GCM dengan Dukungan AAD
│           ├── kanonis.ts              # Kanonisasi JSON Leksikografis & Unicode NFC (T1)
│           ├── kunci.ts                # Manajemen Kunci di Luar Repo & HKDF-SHA256 (T2)
│           ├── vault.ts                # Titik Sambungan T1 -> T2 & Vault Temuan Sensitif
│           └── cli.ts                  # Antarmuka CLI Kriptografi (keygen, seal, verify)
└── test/
    ├── crypto.test.ts                  # Suite Pengujian Kriptografi 22 Skenario (100% PASS)
    ├── crud-modul6.test.ts             # Suite Pengujian CRUD Database 10 Skenario (100% PASS)
    └── skema.test.ts                   # Suite Pengujian Skema Validasi Zod 4 (10 Kasus Uji)
```

---

## 💻 Panduan Menjalankan Proyek & Pengujian

### 1. Menjalankan Menggunakan Docker Compose (Hardened Production Environment)
```bash
# Bangun dan jalankan container dalam mode terisolasi non-root
docker compose up -d --build

# Periksa status container
docker compose ps

# Verifikasi user non-root UID 1001
docker compose exec app id

# Verifikasi kapabilitas kernel nol (CapEff 0)
docker compose exec app grep CapEff /proc/1/status

# Uji negatif immutabilitas filesystem
docker compose exec app touch /app/uji
```

### 2. Menjalankan di Lingkungan Pengembangan Lokal (Localhost)
```bash
# Pasang dependensi
npm install

# Bangkitkan master key di luar repositori (~/.tripleemat/audit.key)
npm run crypto:cli keygen

# Nyalakan PostgreSQL dan jalankan dev server
docker start pg-praktikum
npm run dev
```
Buka peramban pada alamat: **[http://localhost:3000](http://localhost:3000)**

### 3. Menjalankan Seluruh Suite Pengujian
```bash
# Pengujian unit mesin kriptografi terintegrasi (22 skenario)
npm run test:crypto

# Pengujian CRUD database PostgreSQL & relasi Modul 6 (10 skenario)
npm run test:modul6

# Pengujian skema validasi Zod 4
npm run test:skema

# Pemeriksaan kepatuhan tipe TypeScript statis ketat (0 error)
npx tsc --noEmit

# Pemeriksaan linter kode ESLint (0 warning, 0 error)
npm run lint
```

---

## 🔒 Kebijakan Keamanan & Kepatuhan Etika AI

* **Bebas Kredensial Nyata:** Repositori 100% bebas dari private key, token rahasia, atau kredensial produksi. Seluruh kunci dihasilkan via CSPRNG dan disimpan di luar repositori.
* **Data Uji Sintetis:** Seluruh domain target audit (`kampus.ac.id`), temuan kerentanan, dan laporan audit menggunakan data sintetis tiruan.
* **Transparansi Penuh AI:** Seluruh interaksi pair-programming AI dari Milestone `sec-0.1`, `v-0.1`, `v0.2`, hingga `sec-0.2` tercatat secara jujur dan transparan dalam [`AI_LOG.md`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/AI_LOG.md) disertai metode verifikasi mandiri pengembang.
