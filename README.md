# 🛡️ Tripleemat Security Assessor

**Tripleemat Security Assessor** adalah platform *Automated Security & Compliance Assessment* yang dirancang untuk membantu *Security Auditor*, pengembang web, dan tim IT kampus dalam mengevaluasi, memindai, serta menilai tingkat kepatuhan siber suatu aplikasi web berdasarkan standar **OWASP ASVS (Application Security Verification Standard)** dan **NIST SP 800-53**.

Platform ini **tidak menggunakan cipher klasik** (seperti Caesar, Vigenère, atau XOR sederhana). Seluruh operasi kriptografi diimplementasikan menggunakan modul `node:crypto` bawaan Node.js — sebuah *maintained cryptographic library* berbasis OpenSSL yang memenuhi standar industri.

---

## 📋 Tabel Kebutuhan Keamanan

| # | Data / Komponen | Tujuan Keamanan (Security Objective) | Prioritas |
|---|---|---|---|
| 1 | **Ruleset Vault** — Basis data kontrol OWASP ASVS (`asvs-rules.json`) | **Integritas** — Ruleset tidak boleh dimodifikasi tanpa deteksi; diverifikasi dengan SHA-256 setiap kali dimuat. | 🔴 Tinggi |
| 2 | **Audit Report** — Hasil pemindaian header HTTP & SSL per target URL | **Kerahasiaan & Integritas** — Data laporan dienkripsi saat disimpan (AES-256-GCM) dan dilindungi dari pemalsuan via Auth Tag GCM. | 🔴 Tinggi |
| 3 | **Session / API Token** — Token akses antar modul internal | **Keotentikan & Keunikan** — Token dibangkitkan dari CSPRNG (`node:crypto.randomBytes`) sehingga tidak dapat ditebak atau diulang. | 🟡 Sedang |
| 4 | **API Response Cache** — Respons HTTP target yang di-cache sementara | **Integritas** — Cache divalidasi dengan HMAC-SHA256 untuk mendeteksi manipulasi data sebelum diproses lebih lanjut. | 🟡 Sedang |
| 5 | **SSL Certificate Metadata** — Data sertifikat TLS target (issuer, expiry, algorithm) | **Ketersediaan & Integritas** — Metadata diverifikasi terhadap profil kepercayaan; penggunaan algoritma lemah (MD5/SHA-1) ditandai sebagai temuan kritis. | 🟠 Sedang-Tinggi |

---

## 🏗️ Desain Komponen Kriptografi

### Arsitektur Input–Process–Output

```
┌─────────────────────────────────────────────────────────────────┐
│                    CRYPTOGRAPHIC MODULES                        │
│                  (src/lib/crypto/)                              │
│                                                                 │
│  INPUT                  PROCESS                   OUTPUT        │
│  ─────                  ───────                   ──────        │
│                                                                 │
│  Plaintext string   ──► AES-256-GCM Encrypt  ──► EncryptedPayload │
│  + 32-byte key          (AEAD cipher)             { ciphertextHex, │
│  + 12-byte IV (CSPRNG)                              ivHex,       │
│                                                     authTagHex } │
│                                                                 │
│  EncryptedPayload   ──► AES-256-GCM Decrypt  ──► Plaintext string │
│  + 32-byte key          (Auth Tag verified)       atau Error GCM │
│                                                                 │
│  String / Buffer    ──► SHA-256 Hash         ──► 64-char hex digest │
│                         (createHash)                            │
│                                                                 │
│  String / Buffer    ──► verifyIntegrity      ──► boolean (safe   │
│  + expected hash        (timingSafeEqual)        constant-time)  │
│                                                                 │
│  Secret key + data  ──► HMAC-SHA256          ──► 64-char hex MAC │
│                         (createHmac)                            │
│                                                                 │
│  length (bytes)     ──► CSPRNG               ──► Uint8Array /   │
│                         (randomBytes)             hex token      │
└─────────────────────────────────────────────────────────────────┘
```

### Representasi Data

| Format | Digunakan untuk | Alasan |
|---|---|---|
| `Uint8Array` | Kunci, IV, raw bytes CSPRNG | Representasi biner yang efisien dan portabel di Node.js |
| `hex string` | Ciphertext, IV, AuthTag, hash digest, token | Aman untuk disimpan/dikirim sebagai teks; mudah diverifikasi secara manual |
| `Buffer` | Antarmuka dengan `node:crypto` | API native Node.js menggunakan Buffer untuk operasi biner |
| `JSON.stringify` | Data uji sintetik dalam test | Format yang merepresentasikan struktur data nyata tanpa data sensitif |

### Sumber Keacakan (Source of Randomness)

| Komponen | Sumber Keacakan | Keterangan |
|---|---|---|
| `generateSecureBytes(n)` | `node:crypto.randomBytes(n)` — CSPRNG OS-level | Menggunakan entropy dari kernel OS (`/dev/urandom` di Linux, `CryptGenRandom` di Windows) |
| IV AES-256-GCM (12 bytes) | `generateSecureBytes(12)` | IV baru dibangkitkan setiap pemanggilan enkripsi — mencegah nonce reuse |
| Session Token | `generateSecureBytes(32)` → hex | 256-bit entropy; tidak dapat ditebak secara komputasional |
| **DILARANG** | `Math.random()` | PRNG deterministik — tidak aman untuk keperluan kriptografi |

---

## 🧪 Pengujian Otomatis

File pengujian: `test/crypto.test.ts`  
Framework: Node.js built-in test runner (`node:test`)

| # | Skenario | Tipe | Ekspektasi |
|---|---|---|---|
| 1 | SHA-256 hash ruleset asli harus valid | ✅ Positif | `verifyIntegrity()` mengembalikan `true` |
| 2 | Hash berubah total jika 1 byte input dimodifikasi (Avalanche Effect) | 🔴 Negatif | `verifyIntegrity()` mengembalikan `false` |
| 3 | CSPRNG menghasilkan 1.000 token yang 100% unik | 🔵 Batas/Stress | `Set.size === 1000` |
| 4 | Dekripsi AES-256-GCM harus gagal jika ciphertext dirusak | 🔴 Negatif | `decryptAES256GCM()` melempar error GCM |

---

## 🚀 Instruksi Menjalankan Program

### Prasyarat

- **Node.js** v22+ (untuk `node:test` dan `--import tsx`)
- **npm** v10+

```bash
# Clone / buka direktori proyek
cd tripleemat

# Install dependensi
npm install
```

### Menjalankan Development Server (Web UI)

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Menjalankan Pengujian Kriptografi

```bash
npm run test:crypto
```

Output yang diharapkan:

```
▶ 🛡️ Cryptographic Module Unit Tests (Milestone v0.1)
  ✔ Uji 1 (Positif): Harus berhasil memverifikasi hash SHA-256 dari data ruleset asli
  ✔ Uji 2 (Negatif): Harus menolak verifikasi hash jika 1 byte masukan diubah (Avalanche Effect)
  ✔ Uji 3 (Positif): Generator CSPRNG harus menghasilkan token acak yang unik dan tidak berulang
  ✔ Uji 4 (Negatif): Dekripsi AES-256-GCM harus melempar error jika ciphertext atau AuthTag dirusak
✔ 🛡️ Cryptographic Module Unit Tests (Milestone v0.1)
ℹ tests 4 | pass 4 | fail 0
```

### Perintah Lain

```bash
npm run build    # Build produksi Next.js
npm run lint     # Jalankan ESLint
```

---

## 🛠️ Stack Teknologi

| Layer | Teknologi |
|---|---|
| **Framework Web** | Next.js 16 (App Router, TypeScript) |
| **Styling & UI** | Tailwind CSS v4, inline SVG icons |
| **Kriptografi** | `node:crypto` (AES-256-GCM, SHA-256, HMAC-SHA256, CSPRNG) |
| **Test Runner** | `node:test` (built-in Node.js v22+) + `tsx` |
| **PDF Generator** *(planned)* | `jspdf` / `html2canvas` |

---

## 📁 Struktur Folder

```text
tripleemat/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing Page & Dashboard Utama
│   ├── layout.tsx              # Root Layout
│   └── globals.css
├── src/
│   └── lib/
│       └── crypto/             # Modul Kriptografi
│           ├── csprng.ts       # CSPRNG — generateSecureBytes, generateSecureToken
│           ├── integrity.ts    # SHA-256, HMAC-SHA256, verifyIntegrity
│           └── encryption.ts   # AES-256-GCM encrypt/decrypt
├── test/
│   └── crypto.test.ts          # 4 skenario uji otomatis (node:test)
├── security/                   # Dokumentasi KKS (Asset Inventory, DFD)
├── AI-Log .md                  # Catatan penggunaan AI (wajib)
├── README.md                   # Dokumentasi ini
└── package.json
```

---

## 🔒 Catatan Keamanan Repositori

- **Tidak ada** private key, token, password, secret, atau data pribadi di repositori ini.
- Seluruh data dalam pengujian adalah **data sintetik** (contoh: `kampus.ac.id`, `ASVS_LEVEL_1_PASSED`, `{ version: "4.0.3", control: "V5.1.1" }`).
- Cipher klasik (Caesar, Vigenère, XOR) **tidak digunakan** untuk melindungi data produk.
- Semua operasi kriptografi menggunakan `node:crypto` — modul yang dikelola aktif oleh tim Node.js dan diaudit secara berkala.

---

> 📄 Penggunaan AI dalam proyek ini didokumentasikan di [`AI-Log .md`](./AI-Log%20.md).
