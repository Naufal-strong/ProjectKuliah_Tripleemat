# 🛡️ Rangkuman Proyek — Tripleemat Security Assessor

**Tripleemat Security Assessor** adalah platform *Automated Security & Compliance Assessment* yang dirancang untuk membantu *Security Auditor*, pengembang web, dan tim IT kampus dalam mengevaluasi, memindai, serta menilai tingkat kepatuhan siber suatu aplikasi web berdasarkan standar **OWASP ASVS (Application Security Verification Standard)** dan **NIST SP 800-53**.

Platform ini mengintegrasikan pemindaian pasif HTTP/SSL dengan modul kriptografi industri berstandar modern (`node:crypto` berbasis OpenSSL), memastikan seluruh data audit, integritas aturan, dan pertukaran token terlindungi secara ketat tanpa kompromi cipher klasik.

---

## 📌 Status & Perkembangan Milestone (KKS & Praktikum)

| Milestone | Topik / Fokus | Luaran & Capaian Kunci |
|---|---|---|
| **`sec-0.1`** (Pekan 2) | Threat, Vulnerability, & Risk Analysis | • **Asset Inventory FIPS 199** (8 aset utama dengan CIA rating & label proteksi kriptografi).<br>• **DFD Level 0 Shostack** dengan 3 *Trust Boundaries* (Untrusted External, Application DMZ, Internal Storage).<br>• **Model Ancaman STRIDE** & penentuan 5 risiko prioritas beserta rencana kontrol keamanan. |
| **`sec-0.2`** (Pekan 3) | Implementasi Kriptografi Produk & Unit Testing | • **Modul Kriptografi Produksi** di `src/lib/crypto/` (CSPRNG, SHA-256/HMAC, AES-256-GCM).<br>• **Pengujian Otomatis** di `test/crypto.test.ts` (4 skenario: positif, negatif, batas/stress — 100% lolos).<br>• **Landing Page & Interactive Playground** di `app/page.tsx` dengan antarmuka modern & live crypto engine. |
| **`web-0.4`** (Pekan 4) | Next.js 16 App Router & Dynamic Routing Architecture | • **Rute Dinamis Berparameter** di `app/report/[id]/page.tsx` dengan penanganan asinkron (`await params`), validasi format regex `/^scan-\d{4}-\d{3}$/`, penanganan error 404 (`notFound()`), dan kompilasi statis via `generateStaticParams()`.<br>• **Investigasi Lifecycle Layout vs Template** di `app/report/layout.tsx` dan `app/report/template.tsx` menggunakan komponen pemantau state `components/KolomCatatan.tsx`.<br>• **Pemisahan Server/Client Component & Proteksi Data** via paket `server-only` di `lib/data.ts` serta navigasi aktif aksesibel dengan `components/TautanNav.tsx` (`usePathname`, `aria-current="page"`).<br>• **Laporan Teknis Komprehensif** di `docs/praktikum/modul-04.md` dilengkapi matriks pengujian dan bukti tangkapan layar. |

---

## 🚀 Fitur Utama Platform

1. **Automated Passive HTTP Header & SSL/TLS Analyzer (`/scan`)**
   * Memindai header keamanan web target (`CSP`, `HSTS`, `X-Frame-Options`, `CORS`, `Referrer-Policy`, `Permissions-Policy`).
   * Validasi formulir sisi klien yang ketat (skema URL, domain, email auditor opsional).
   * Menginspeksi metadata sertifikat SSL/TLS (validitas, penerbit, algoritma enkripsi, deteksi cipher lemah seperti MD5/SHA-1).

2. **OWASP ASVS Interactive Compliance Engine (`/asvs`)**
   * Matriks verifikasi kepatuhan interaktif berbasis standar OWASP ASVS v4.0.3 (Level 1 & Level 2).
   * Filter pencarian dinamis, kategorisasi bab (V1 hingga V14), dan pemetaan ke kontrol NIST SP 800-53.
   * Perhitungan skor kepatuhan (*Compliance Score*) secara *real-time*.

3. **Core Industrial Cryptography Engine (`node:crypto`)**
   * Perlindungan integritas *Ruleset Vault* dan *API Cache* via SHA-256 & HMAC-SHA256 berpembanding *constant-time* (`timingSafeEqual`).
   * Enkripsi data hasil audit dengan cipher simetris terotentikasi **AES-256-GCM** (dilengkapi IV 12-byte per panggilan dan 16-byte Auth Tag).
   * Pembangkitan token sesi dan kunci menggunakan **CSPRNG tingkat kernel OS** (`randomBytes`), sepenuhnya menolak generator tidak aman (`Math.random()`).

4. **Executive Security Scorecard & Dynamic Audit Report (`/report` & `/report/[id]`)**
   * Dasbor eksekutif untuk meninjau riwayat audit, agregasi skor keamanan (A+ hingga F), dan distribusi kerentanan.
   * Rute dinamis terisolasi `/report/[id]` untuk inspeksi mendalam per target audit (`scan-2025-001`, `scan-2025-002`, `scan-2025-003`).
   * Akses data terproteksi di sisi server (*Server-Only Data Access Layer*) via `lib/data.ts` untuk mencegah kebocoran logika internal ke bundle klien.
   * Prapengambilan rute instan (*Instant static pre-rendering*) berkat `generateStaticParams()`.

---

## 📋 Tabel Kebutuhan Keamanan (CIA Triad & FIPS 199)

Mengacu pada dokumen [Asset Inventory](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/security/asset-inventory.md):

| # | Data / Komponen | Kategori | CIA FIPS 199 | Mekanisme Proteksi Keamanan |
|---|---|---|:---:|---|
| 1 | **Ruleset Vault** (`asvs-rules.json`) | Data / Config | **L - H - M** | **Integritas (SHA-256)**: Verifikasi hash kriptografis setiap pemuatan ruleset untuk mencegah manipulasi kriteria audit. |
| 2 | **Audit Report & DB** (Hasil scan target) | Data | **H - H - M** | **Kerahasiaan & Integritas (AES-256-GCM)**: Enkripsi penyimpanan at-rest dan verifikasi Auth Tag terhadap ancaman modifikasi ciphertext. |
| 3 | **Session & API Token** | Secrets | **H - H - L** | **Keotentikan & Keunikan (CSPRNG 256-bit)**: Dihasilkan via `node:crypto.randomBytes(32)` agar kebal dari prediksi komputasional. |
| 4 | **API Response Cache** (Data sementara) | Data | **M - M - L** | **Integritas (HMAC-SHA256)**: Pengesahan pesan berantai berbasis kunci rahasia untuk menangkal data tampering di memori/cache. |
| 5 | **SSL Certificate Metadata** | Data | **L - H - M** | **Ketersediaan & Integritas**: Validasi rantai sertifikat; penolakan dan pemberian peringatan kritis terhadap algoritma usang. |

---

## 🏗️ Desain Komponen Kriptografi

### Arsitektur Aliran Data (Input–Process–Output)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   CRYPTOGRAPHIC MODULES (src/lib/crypto/)              │
│                                                                        │
│  INPUT                   PROCESS                     OUTPUT            │
│  ─────                   ───────                     ──────            │
│                                                                        │
│  Plaintext (string)  ──► AES-256-GCM Encrypt    ──► EncryptedPayload   │
│  + 32-byte key           (AEAD Mode)                { ciphertextHex,   │
│  + 12-byte IV (CSPRNG)                                ivHex,           │
│                                                       authTagHex }     │
│                                                                        │
│  EncryptedPayload    ──► AES-256-GCM Decrypt    ──► Plaintext (string) │
│  + 32-byte key           (Validasi Auth Tag)        atau GCM Error     │
│                                                                        │
│  String / Buffer     ──► SHA-256 Hash           ──► 64-char Hex Digest │
│                          (createHash)                                  │
│                                                                        │
│  Data + Expected Hash──► verifyIntegrity        ──► Boolean            │
│                          (timingSafeEqual)          (Aman Timing Attack)│
│                                                                        │
│  Data + Secret Key   ──► HMAC-SHA256            ──► 64-char Hex MAC    │
│                          (createHmac)                                  │
│                                                                        │
│  Panjang byte (n)    ──► CSPRNG Kernel          ──► Uint8Array /       │
│                          (randomBytes)              Hex Token Acak     │
└────────────────────────────────────────────────────────────────────────┘
```

### Rincian Modul & Kebijakan Keacakan

* **[csprng.ts](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/src/lib/crypto/csprng.ts):** Memanfaatkan entropi sistem operasi (`CryptGenRandom` di Windows / `/dev/urandom` di POSIX). Digunakan untuk IV AES-GCM (12 byte) dan token sesi (32 byte). `Math.random()` dilarang secara tegas karena bersifat PRNG deterministik.
* **[integrity.ts](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/src/lib/crypto/integrity.ts):** Menghasilkan hash SHA-256 dan HMAC-SHA256. Fungsi verifikasi memanfaatkan `crypto.timingSafeEqual` yang diawali validasi panjang buffer untuk mencegah peretasan *Side-Channel Timing Attack*.
* **[encryption.ts](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/src/lib/crypto/encryption.ts):** Mengimplementasikan AEAD (Authenticated Encryption with Associated Data) AES-256-GCM. Setiap pemanggilan enkripsi selalu menghasilkan IV baru 12-byte untuk mengeliminasi risiko *nonce reuse*.

---

## 🧪 Pengujian Otomatis (`test/crypto.test.ts`)

Pengujian unit otomatis dijalankan menggunakan runner native Node.js (`node:test`) dan TypeScript executor (`tsx`):

| Skenario Uji | Kategori | Deskripsi Verifikasi | Status |
|---|---|---|:---:|
| **Uji 1** | ✅ Positif | Memastikan hash SHA-256 ruleset asli terverifikasi secara valid (`verifyIntegrity() === true`). | **PASS** |
| **Uji 2** | 🔴 Negatif | Membuktikan efek longsoran (*Avalanche Effect*): modifikasi 1 byte data mengubah drastis hash dan verifikasi gagal (`verifyIntegrity() === false`). | **PASS** |
| **Uji 3** | 🔵 Batas / Stress | Membangkitkan 1.000 token acak berturut-turut dari CSPRNG dan memvalidasi keunikannya (`tokenSet.size === 1000`, 0% tabrakan). | **PASS** |
| **Uji 4** | 🔴 Negatif | Menolak manipulasi ciphertext/AuthTag pada dekripsi AES-256-GCM dengan melempar error autentikasi AEAD resmi. | **PASS** |

---

## 📁 Struktur Direktori Proyek

```text
tripleemat/
├── app/                                # Next.js 16 App Router
│   ├── favicon.ico                     # Asset Icon
│   ├── globals.css                     # Tailwind CSS v4 directives
│   ├── layout.tsx                      # Root Application Layout & Fonts
│   ├── template.tsx                    # Dynamic wrapper (Server Component)
│   ├── loading.tsx                     # Global fallback pemuatan berbasis Suspense
│   ├── error.tsx                       # Global error boundary (Client Component)
│   ├── not-found.tsx                   # Global 404 handler (Server Component)
│   ├── page.tsx                        # Enterprise Security Landing Page (Beranda)
│   ├── scan/                           # Halaman Pemindai Keamanan Pasif
│   │   └── page.tsx
│   ├── asvs/                           # Halaman Matriks Kepatuhan OWASP ASVS
│   │   └── page.tsx
│   └── report/                         # Subtree Laporan Audit & Scorecard
│       ├── layout.tsx                  # Nested Layout (State Catatan Persisten)
│       ├── template.tsx                # Nested Template (State Catatan Direset per Navigasi)
│       ├── page.tsx                    # Executive Scorecard & Daftar Riwayat Audit
│       └── [id]/                       # Rute Dinamis: Detail Laporan Audit
│           └── page.tsx                # Server Component (await params, regex, notFound)
├── components/                         # Komponen Reusable Tambahan Modul 4
│   ├── KolomCatatan.tsx                # Client Component penguji persistensi layout vs template
│   └── TautanNav.tsx                   # Client Component navigasi aktif dengan aria-current
├── lib/
│   └── data.ts                         # Server-only Data Access Layer (import "server-only")
├── src/
│   ├── components/
│   │   ├── layout/                     # Komponen Layout Navigasi Global
│   │   │   ├── Navbar.tsx              # Navigasi responsif terintegrasi TautanNav
│   │   │   └── Footer.tsx
│   │   └── ui/                         # Pustaka 6 Komponen UI (Button, Card, Badge, Input, dll)
│   ├── data/                           # Mock data (mockScans, mockSecurityHeaders, mockAsvsControls)
│   ├── lib/
│   │   └── crypto/                     # Modul Kriptografi Inti (node:crypto)
│   │       ├── csprng.ts               # Generator acak berbasis CSPRNG OS
│   │       ├── integrity.ts            # Logika SHA-256, HMAC, & Constant-time Compare
│   │       └── encryption.ts           # Implementasi AEAD AES-256-GCM Enkripsi/Dekripsi
│   └── types/                          # Antarmuka TypeScript & Model Domain
├── test/
│   └── crypto.test.ts                  # Skenario uji unit otomatis (node:test)
├── security/                           # Dokumentasi Keamanan & KKS (Milestone sec-0.1)
│   ├── DFD .png                        # Diagram visual Aliran Data Level 0
│   ├── asset-inventory.md              # Inventaris 8 Aset FIPS 199 CIA
│   └── threat-modeling.md              # Model Ancaman STRIDE & Diagram Trust Boundary
├── docs/                               # Dokumentasi Praktikum & Bukti Pengujian
│   ├── praktikum/
│   │   └── modul-04.md                 # Dokumentasi Teknis Praktikum Modul 4 (App Router)
│   └── Screenshot/                     # Tangkapan Layar Pengujian
│       └── Modul4/                     # Bukti pengujian rute dinamis, layout, & template
├── AI-Log .md                          # Catatan Penggunaan Gen-AI & Verifikasi Mandiri
├── README.md                           # Dokumentasi Utama Repositori
├── Rangkuman Tripleemat.md             # Rangkuman Eksekutif & Teknis Proyek (Dokumen ini)
├── package.json                        # Definisi dependensi & skrip eksekusi
└── tsconfig.json                       # Konfigurasi TypeScript
```

---

## 🛠️ Stack Teknologi

* **Framework Inti:** Next.js 16 (App Router, React 19, TypeScript 5)
* **Styling & Tampilan:** Tailwind CSS v4, Responsive Dark-slate & Emerald Security Theme
* **Proteksi Server Boundary:** `server-only` (Isolasi modul data sisi server dari bundle browser)
* **Mesin Kriptografi:** Node.js Built-in `node:crypto` (OpenSSL standard, FIPS-compliant cipher)
* **Test Runner:** Node.js Test Runner (`node:test`, `node:assert/strict`) via `tsx`
* **Manajemen Repositori:** Git, Node.js v22+

---

## 💻 Panduan Menjalankan Proyek

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Dashboard Web (Development Server)
```bash
npm run dev
```
Akses antarmuka di peramban pada alamat: [http://localhost:3000](http://localhost:3000)

### 3. Menjalankan Pengujian Unit Kriptografi
```bash
npm run test:crypto
```
*Hasil eksekusi diharapkan: 4 skenario lolos (`pass 4 | fail 0`).*

### 4. Build & Linting
```bash
npm run build    # Kompilasi aplikasi Next.js untuk produksi (termasuk static generation rute dinamis)
npm run lint     # Pengecekan standar kode via ESLint
```

---

## 📚 Tautan Dokumentasi Terkait

* **Dokumentasi Teknis Modul 4 (App Router & Rute Dinamis):** [`docs/praktikum/modul-04.md`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/docs/praktikum/modul-04.md)
* **Dokumentasi Lengkap Repositori:** [`README.md`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/README.md)
* **Inventaris Aset Keamanan (FIPS 199):** [`security/asset-inventory.md`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/security/asset-inventory.md)
* **Model Ancaman (STRIDE):** [`security/threat-modeling.md`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/security/threat-modeling.md)
* **Log Penggunaan Gen-AI & Verifikasi:** [`AI-Log .md`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/AI-Log%20.md)

---

## 🔒 Kebijakan Keamanan & Etika AI

* **Bebas Kredensial:** Repositori ini tidak menyimpan secret, API key privat, password, atau credential asli.
* **Data Uji Sintetik:** Seluruh masukan pada unit test dan data pemindaian menggunakan data tiruan (*mock synthetic data*).
* **Transparansi AI:** Setiap penggunaan piranti AI (Claude, Gemini, Antigravity IDE) didokumentasikan beserta verifikasi mandiri (*self-verification*) pada file [`AI-Log .md`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/AI-Log%20.md).