# 🛡️ Rangkuman Proyek — Tripleemat Security Assessor

**Tripleemat Security Assessor** adalah platform *Automated Security & Compliance Assessment* yang dirancang untuk membantu *Security Auditor*, pengembang web, dan tim IT kampus dalam mengevaluasi, memindai, serta menilai tingkat kepatuhan siber suatu aplikasi web berdasarkan standar **OWASP ASVS (Application Security Verification Standard)** dan **NIST SP 800-53**.

Platform ini mengintegrasikan pemindaian pasif HTTP/SSL dengan modul kriptografi industri berstandar modern (`node:crypto` berbasis OpenSSL), memastikan seluruh data audit, integritas aturan, dan pertukaran token terlindungi secara ketat tanpa kompromi cipher klasik.

---

## 📌 Status & Perkembangan Milestone (KKS)

| Milestone | Topik / Fokus | Luaran & Capaian Kunci |
|---|---|---|
| **`sec-0.1`** (Pekan 2) | Threat, Vulnerability, & Risk Analysis | • **Asset Inventory FIPS 199** (8 aset utama dengan CIA rating & label proteksi kriptografi).<br>• **DFD Level 0 Shostack** dengan 3 *Trust Boundaries* (Untrusted External, Application DMZ, Internal Storage).<br>• **Model Ancaman STRIDE** & penentuan 5 risiko prioritas beserta rencana kontrol keamanan. |
| **`sec-0.2`** (Pekan 3) | Implementasi Kriptografi Produk & Unit Testing | • **Modul Kriptografi Produksi** di `src/lib/crypto/` (CSPRNG, SHA-256/HMAC, AES-256-GCM).<br>• **Pengujian Otomatis** di `test/crypto.test.ts` (4 skenario: positif, negatif, batas/stress — 100% lolos).<br>• **Landing Page & Interactive Playground** di `app/page.tsx` dengan antarmuka modern & live crypto engine. |

---

## 🚀 Fitur Utama Platform

1. **Automated Passive HTTP Header & SSL/TLS Analyzer**
   * Memindai header keamanan web target (`CSP`, `HSTS`, `X-Frame-Options`, `CORS`, `Referrer-Policy`).
   * Menginspeksi metadata sertifikat SSL/TLS (validitas, penerbit, algoritma enkripsi, deteksi cipher lemah seperti MD5/SHA-1).

2. **OWASP ASVS Interactive Compliance Engine**
   * Matriks verifikasi kepatuhan interaktif berbasis standar OWASP ASVS (Level 1 & Level 2).
   * Perhitungan skor kepatuhan (*Compliance Score*) secara *real-time*.

3. **Core Industrial Cryptography Engine (`node:crypto`)**
   * Perlindungan integritas *Ruleset Vault* dan *API Cache* via SHA-256 & HMAC-SHA256 berpembanding *constant-time* (`timingSafeEqual`).
   * Enkripsi data hasil audit dengan cipher simetris terotentikasi **AES-256-GCM** (dilengkapi IV 12-byte per panggilan dan 16-byte Auth Tag).
   * Pembangkitan token sesi dan kunci menggunakan **CSPRNG tingkat kernel OS** (`randomBytes`), sepenuhnya menolak generator tidak aman (`Math.random()`).

4. **Executive Security Scorecard & PDF Report Generator** *(Planned / Roadmapped)*
   * Visualisasi tingkat risiko aplikasi (High, Medium, Low).
   * Ekspor laporan hasil audit berformat PDF secara instan untuk kebutuhan dokumentasi formal dan evaluasi tim pengembang.

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
│   └── page.tsx                        # Enterprise Security Landing Page & Interactive Crypto Playground
├── src/
│   └── lib/
│       └── crypto/                     # Modul Kriptografi Inti (node:crypto)
│           ├── csprng.ts               # Generator acak berbasis CSPRNG OS
│           ├── integrity.ts            # Logika SHA-256, HMAC, & Constant-time Compare
│           └── encryption.ts           # Implementasi AEAD AES-256-GCM Enkripsi/Dekripsi
├── test/
│   └── crypto.test.ts                  # Skenario uji unit otomatis (node:test)
├── security/                           # Dokumentasi Keamanan & KKS (Milestone sec-0.1)
│   ├── DFD .png                        # Diagram visual Aliran Data Level 0
│   ├── asset-inventory.md              # Inventaris 8 Aset FIPS 199 CIA
│   └── threat-modeling.md              # Model Ancaman STRIDE & Diagram Trust Boundary Mermaid
├── AI-Log .md                          # Catatan Penggunaan Gen-AI & Verifikasi Mandiri (Milestone sec-0.1 & sec-0.2)
├── README.md                           # Dokumentasi Utama Repositori
├── Rangkuman Tripleemat.md             # Rangkuman Eksekutif & Teknis Proyek (Dokumen ini)
├── package.json                        # Definisi dependensi & skrip eksekusi
└── tsconfig.json                       # Konfigurasi TypeScript
```

---

## 🛠️ Stack Teknologi

* **Framework Inti:** Next.js 16 (App Router, React 19, TypeScript 5)
* **Styling & Tampilan:** Tailwind CSS v4, Responsive Dark-slate & Emerald Security Theme
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
npm run build    # Kompilasi aplikasi Next.js untuk produksi
npm run lint     # Pengecekan standar kode via ESLint
```

---

## 🔒 Kebijakan Keamanan & Etika AI

* **Bebas Kredensial:** Repositori ini tidak menyimpan secret, API key privat, password, atau credential asli.
* **Data Uji Sintetik:** Seluruh masukan pada unit test menggunakan data tiruan (*mock synthetic data*).
* **Transparansi AI:** Setiap penggunaan piranti AI (Claude, Gemini, Antigravity IDE) didokumentasikan beserta verifikasi mandiri (*self-verification*) pada file [`AI-Log .md`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/AI-Log%20.md).