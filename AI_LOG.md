# 🤖 AI Log — Catatan Penggunaan Generative AI

**Mata Kuliah:** Kriptografi & Keamanan Informasi, Keamanan Komputasi dan Siber, Pemrograman Web dan Aplikasi  
**Topik Produk:** Tripleemat Security Assessor Platform  
**Repositori:** `tripleemat`  
**Standar Pelaporan:** Rubrik R2 (Milestone v0.2 / Minggu 06)  

Dokumen ini adalah satu-satunya catatan resmi (*single source of truth*) yang mencatat secara transparan seluruh penggunaan alat bantu kecerdasan buatan (Generative AI) sepanjang pengembangan proyek Tripleemat, mencakup Milestone 1 (`sec-0.1` & `v-0.1`) hingga Milestone 2 (`v0.2`).

---

## 📌 Milestone `v0.2` — Integrasi Kriptografi Lanjutan & Basis Data (Minggu 06)

**Pekan:** 6 — Integrasi Komponen Lanjutan (AEAD, HMAC-SHA256, HKDF) & Basis Data Relasional  
**Tanggal:** 2026-11-02  
**Penanda Rilis:** `v0.2`  

### 1. Alat AI yang Digunakan
* **Model AI:** Gemini 3.8 Flash & Antigravity IDE Assistant
* **Peran AI:** Asisten *pair programming* dan generator *boilerplate* kode serta dokumen kepatuhan standar.
* **Tanggung Jawab Siswa:** Mahasiswa memahami secara utuh setiap baris kode, prinsip kriptografi yang mendasarinya, arsitektur sistem, dan mampu menjelaskan seluruh keputusan implementasi dalam sesi demonstrasi lisan.

### 2. Tujuan Penggunaan AI
1. Menganalisis silabus RPS Minggu 06, materi slide integrasi komponen lanjutan, dan Rubrik R2 (100 poin).
2. Merancang arsitektur modul kriptografi terintegrasi yang menghubungkan komponen dasar $T1$ (Kanonisasi & Hash v0.1) ke komponen lanjutan $T2$ (HKDF, HMAC-SHA256, dan AEAD AES-256-GCM dengan AAD).
3. Mengembangkan unit test komprehensif (22 skenario uji, 100% pass) yang menguji kondisi positif, kondisi batas, manipulasi data (*tamper data*), manipulasi segel (*tamper tag*), format rusak (*fail-closed*), dan proteksi relokasi konteks AAD.
4. Menyusun dokumentasi keputusan arsitektur (*Decision Log*) pada `KEPUTUSAN.md` dan skrip demonstrasi lisan 3 menit.

### 3. Ringkasan Perintah (Prompt Summary)
1. *"Moving on to Milestone 2, which covers cryptography: please study the provided material carefully and consider how it relates to our project..."* disertai berkas `contoh_meterlog_v0.2.zip` dan `Kriptografi_Minggu06_Integrasi_Komponen_Lanjutan.pptx`.
2. *"Membahas pemenuhan standar NIST SP 800-57 mengenai 'Satu Kunci, Satu Tujuan' dan penyimpanan di luar repositori."*
3. *"Memastikan komponen lanjutan T2 mengimpor dan bergantung pada komponen dasar T1 sesuai materi dosen."*
4. *"Menyusun pengujian otomatis yang mencakup kondisi sah dan kondisi tidak valid/gagal tertutup (fail-closed)."*
5. *"Menyusun KEPUTUSAN.md, AI_LOG.md, serta panduan demonstrasi 3 menit."*

### 4. Bagian Kode yang Dihasilkan, Dimodifikasi, dan Ditelusuri

| Berkas | Bagian yang Disentuh | Modifikasi / Kontribusi Mandiri Mahasiswa |
|---|---|---|
| `src/lib/crypto/kanonis.ts` | Fungsi `kanonisasiJSON()` dan `validasiStrukturLaporan()` | Menghapus import tak terpakai, memverifikasi sorting rekursif objek bersarang, dan menguji penanganan string Unicode NFC. |
| `src/lib/crypto/kunci.ts` | Fungsi `turunkanKunci()`, `buatBerkasKunci()`, `muatKunci()` | Memastikan flag `wx` bekerja di Windows/POSIX dan memastikan pemuatan kunci dari environment `TRIPLEEMAT_KEY` bekerja sebagai fallback. |
| `src/lib/crypto/encryption.ts` | Penambahan parameter opsional `aad` pada `encryptAES256GCM` dan `decryptAES256GCM` | Menjaga kompatibilitas mundur dengan fungsi enkripsi Milestone v0.1 seraya menambahkan verifikasi autentikasi AAD. |
| `src/lib/crypto/vault.ts` | Implementasi `segelLaporan()`, `verifikasiLaporan()`, `arsipTemuanSensitif()`, `bukaArsipTemuanSensitif()` | Menambahkan proteksi regex untuk tag format hex 64-karakter agar gagal tertutup (fail-closed) tanpa melempar crash unhandled, serta perbandingan `timingSafeEqual`. |
| `src/lib/crypto/cli.ts` | Perintah CLI `keygen`, `seal`, dan `verify` | Menghapus variabel tak terpakai agar lulus linter ESLint 100% bersih. |
| `test/crypto.test.ts` | 22 unit test dari kelompok 1 sampai 6 | Mengonfigurasi skenario pengujian spesifik sistem Tripleemat (payload audit, ruleset OWASP ASVS, ID target pemindaian). |
| `KEPUTUSAN.md` | Seluruh isi log keputusan | Memverifikasi seluruh parameter teknis, formula kriptografi, dan analisis matematika GHASH tag forgery. |

### 5. Metode Verifikasi Independen
1. **Eksekusi Pengujian Otomatis:** Menjalankan `npm run test:crypto` pada lingkungan lokal. Seluruh **22 pengujian berhasil lulus 100%** tanpa kegagalan (`tests 22, pass 22, fail 0`).
2. **Uji Validasi Tipe Data & Kompilasi:** Menjalankan `npx tsc --noEmit` untuk memastikan kepatuhan statis TypeScript. Hasil: **0 galat kompilasi**.
3. **Pemeriksaan Standar Kode (Linting):** Menjalankan `npm run lint` menggunakan ESLint Next.js 16. Hasil: **0 error, 0 warning**.
4. **Verifikasi Deterministik Derivasi Kunci (KAT):** Menguji determinisme derivasi HKDF-SHA256 dengan kunci tetap untuk membuktikan bahwa turunan kunci selalu identik dan ortogonal (Uji 3.2).
5. **Verifikasi Ketahanan Terhadap Serangan Relokasi:** Menguji pemindahan ciphertext yang sah ke `targetId` berbeda. Terbukti ditolak oleh OpenSSL GCM AuthTag (Uji 5.2).
6. **Verifikasi Keamanan Kunci di Repositori:** Menjalankan pemeriksaan `git status` dan memastikan tidak ada berkas kunci (`*.key`), berkas lingkungan rahasia (`.env`), atau token privat yang terlacak di Git.

---

## 📌 Milestone `sec-0.1` — Implementasi Modul Kriptografi & Pengujian Otomatis

**Pekan:** 3 — Implementasi Kriptografi Produk  
**Tanggal:** 2026-10-08  
**Penanda Milestone:** `sec-0.1`  

### 1. Alat AI yang Digunakan
* **Model AI:** Claude Sonnet 4.6 (via Antigravity IDE)
* **Penggunaan:** Perancangan arsitektur modul kriptografi (`csprng.ts`, `integrity.ts`, `encryption.ts`), pembuatan skenario uji otomatis (`crypto.test.ts`), penulisan ulang `README.md` lengkap, dan desain ulang Landing Page (`app/page.tsx`).

### 2. Prompt Ringkas yang Digunakan
1. *"nanti saya akan meminta untuk membuat app/page.tsx bagus dan elegan dengan warna yang bisa diterima di semua kalangan umur."*
2. *"Why does the error 'Could not find tests/crypto.test.ts' appear when I try to run npm run test:crypto?"*
3. *"README: product description; requirements table; component design (input–process–output, data representation, source of randomness); instructions for running the program."*

### 3. Bagian yang Diubah dan Diverifikasi Sendiri (*Self-Verification*)

| Komponen | Draf Awal dari AI | Penyesuaian & Verifikasi Mandiri |
| :--- | :--- | :--- |
| **`csprng.ts`** | AI men-generate fungsi `generateSecureBytes` dan `generateSecureToken` menggunakan `node:crypto.randomBytes`. | **Diverifikasi:** Dikonfirmasi menggunakan OS-level entropy. Penolakan `Math.random()` ditambahkan sebagai komentar eksplisit. |
| **`encryption.ts`** | AI men-generate implementasi AES-256-GCM dengan IV 12-byte dari CSPRNG. | **Diverifikasi:** IV-per-call dikonfirmasi mencegah nonce reuse. Auth Tag GCM diverifikasi memberikan proteksi integritas otomatis. |
| **`integrity.ts`** | AI menggunakan `timingSafeEqual` untuk perbandingan hash. | **Diverifikasi:** Panjang buffer diperiksa sebelum `timingSafeEqual` untuk mencegah panic error jika panjang berbeda. |
| **`crypto.test.ts`** | Tes awal hanya mencakup skenario positif. | **Ditambah:** 2 skenario negatif (Avalanche Effect & GCM tamper rejection) dan 1 skenario batas/stress (1.000 token unik). |
| **Path bug `tests/` vs `test/`** | Script `package.json` merujuk ke `tests/crypto.test.ts` (folder tidak ada). | **Diperbaiki:** Path dikoreksi ke `test/crypto.test.ts` sesuai struktur folder aktual. Seluruh 4 tes lulus setelah perbaikan. |
| **`README.md`** | Masih berisi boilerplate `create-next-app` default. | **Ditulis ulang sepenuhnya:** Deskripsi produk, tabel kebutuhan (5 baris), desain IPO, tabel representasi data, sumber keacakan, tabel pengujian, instruksi lengkap. |

---

## 📌 Milestone `sec-0.1` — Threat, Vulnerability, dan Risk Analysis

**Pekan:** 3 — Pemodelan Ancaman dan Penilaian Risiko  
**Tanggal:** 2026-10-10  
**Penanda Milestone:** `sec-0.1`  

### 1. Alat AI yang Digunakan
* **Model AI:** Gemini 3.8 Flash, Claude 3.7 Sonnet, Antigravity IDE Assistant
* **Penggunaan:** 
  1. Penyusunan dan pembaruan draf *Asset & Data Inventory* berbasis FIPS 199 dan NIST SP 800-30.
  2. Generasi diagram alir data DFD Level 0 dengan sintaks Mermaid JS dan pembagian 3 *Trust Boundaries*.
  3. Identifikasi komprehensif 12 ancaman STRIDE pada elemen-elemen DFD.
  4. Penilaian matriks probabilitas (*Likelihood*) dan dampak (*Impact*), penentuan 5 risiko prioritas berbasis konteks produk, serta perancangan *Control Plan* mitigasi teknis.

### 2. Prompt Ringkas yang Digunakan
1. *"Bantu susunkan dan perbarui Asset & Data Inventory untuk platform Tripleemat Security Assessor mencakup kategori Data, Secrets, Software, Host, dan Data in Transit beserta rating CIA FIPS 199 dan penandaan proteksi kriptografi."*
2. *"Perbaiki diagram arsitektur data flow DFD Level 0 yang membagi sistem ke dalam 3 trust boundaries (Untrusted External, Application DMZ, Internal Storage) sesuai kaidah baku DFD Shostack."*
3. *"Identifikasi minimal 10 ancaman STRIDE spesifik pada elemen-elemen DFD, evaluasi likelihood dan impact, tetapkan 5 risiko prioritas dengan justifikasi berbasis konteks produk security scanner, dan susun rencana kontrol teknis yang dapat diuji untuk setiap prioritas."*
4. *"Sinkronisasi artefak keamanan di direktori security/ dengan penanda Milestone sec-0.1 dan perbarui catatan AI_LOG.md."*

### 3. Bagian yang Diubah dan Diverifikasi Sendiri (*Self-Verification*)

| Komponen | Draf Awal dari AI | Penyesuaian & Verifikasi Mandiri |
| :--- | :--- | :--- |
| **Pivot & Cakupan Aset** | Draf awal sempat memuat aset sistem pengaduan generik. | **Diperbarui:** Mengubah seluruh aset utama menjadi aset platform penilaian keamanan siber: *Ruleset Vault (AST-01)*, *Scan Logs (AST-02)*, *Audit DB (AST-03)*, dan *Auditor Secrets (AST-04)* beserta penandaan proteksi kriptografi. |
| **Koreksi Tabel Aset** | Terdapat baris ganda dan sintaks markdown tabel terpotong pada aset `AST-02`. | **Diperbaiki:** Menghapus baris terpotong, menambahkan tabel inventarisasi aliran data (*Data in Transit* FLW-01 s.d. FLW-06), dan menghitung formula kategori keamanan sistem FIPS 199 (Overall: HIGH). |
| **Koreksi DFD & Batas Kepercayaan** | Arah panah `Fetch Ruleset` pada DS-1 berupa panah dua arah dan entitas target dianggap mengontrol proses internal. | **Diperbaiki:** Mengubah alur ke DS-1 menjadi satu arah (*read-only*), memetakan 3 Trust Boundaries eksplisit (TB-1, TB-2, TB-3), dan menautkan artefak visual `DFD .png`. |
| **Cakupan STRIDE & Elemen DFD** | Draf awal hanya memuat ancaman generik tanpa relasi langsung ke elemen DFD. | **Diperbarui:** Menyusun 12 ancaman STRIDE yang dipetakan secara eksplisit ke elemen proses (P1–P4), data store (DS1–DS3, AST-04), entitas luar (EE1–EE2), dan aliran data (DF-01–DF-11). |
| **Justifikasi 5 Risiko Prioritas** | Alasan prioritas risiko menggunakan template abstrak. | **Disesuaikan dengan Konteks Produk:** Justifikasi disesuaikan dengan realitas operasional Tripleemat sebagai web scanner (SSRF target URL, manipulasi ruleset ASVS, pencurian temuan kerentanan, DoS worker slowloris). |
| **Rencana Kontrol & Pengujian** | Kontrol keamanan hanya berupa saran umum. | **Diverifikasi & Dikaitkan:** Kontrol dikaitkan langsung dengan implementasi nyata pada kode sumber (`src/lib/crypto/integrity.ts`, `encryption.ts`, `csprng.ts`) dan dibuktikan dengan hasil 100% pass pada unit test `test/crypto.test.ts`. |
| **Penanda Milestone** | Dokumen di folder `security/` belum memiliki tag milestone eksplisit. | **Ditambahkan:** Menambahkan header resmi `Milestone: sec-0.1` pada `asset-inventory.md` dan `threat-modeling.md`. |

---

## 📌 Milestone `v-0.1` — Frontend Architecture, UI/UX, & Web Accessibility

**Pekan:** 3 — Pengembangan Antarmuka Web, Validasi Klien, & Audit Aksesibilitas  
**Tanggal:** 2026-10-11  
**Penanda Milestone:** `v-0.1`  

### 1. Alat AI yang Digunakan
* **Model AI:** Gemini 3.8 Flash (Antigravity IDE)
* **Penggunaan:** Perumusan dan pengorganisasian kode front-end Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, implementasi 6 reusable UI components, 4 halaman inti, mock data, dan aksesibilitas WCAG 2.1 AA (Lighthouse $\ge 95$).

### 2. Prompt Ringkas yang Digunakan
1. *"Define the product concept. Establish the name, purpose, target users, problem to be solved, and core functions of the web application. The concept must allow for future feature development, data management, and integration in subsequent milestones."*
2. *"Implement the User Interface (UI) using React, TypeScript, and Tailwind CSS with an organized code structure. Build at least three pages relevant to the user flow, develop at least five reusable components, implement client-side form validation, use mock data, implement responsive design, and satisfy Lighthouse accessibility >= 85."*

### 3. Bagian yang Diubah dan Diverifikasi Sendiri (*Self-Verification*)

| Komponen | Draf Awal dari AI | Penyesuaian & Verifikasi Mandiri |
| :--- | :--- | :--- |
| **Struktur Komponen UI** | Draf komponen awal menggabungkan logic styling langsung di page tanpa abstraksi. | **Dibuat Terpisah & Modular:** 6 komponen UI dipisahkan ke `src/components/ui/` dengan typing ketat (`ButtonProps`, `InputProps`, `CardProps`, dll.) serta barrel file `index.ts`. |
| **Aksesibilitas Form (`Input.tsx`)** | Form input biasa tidak memiliki atribut ARIA penanda error atau label eksplisit. | **Diperbaiki:** Menambahkan `id` dan `htmlFor` berpasangan, atribut `aria-invalid={!!error}`, `aria-describedby` ke error message, serta error message ber-`role="alert"` dengan `aria-live="polite"`. |
| **Navigasi Keyboard (WCAG AA)** | Tidak ada mekanisme bagi pengguna keyboard untuk melewati menu header. | **Ditambahkan:** Menambahkan `Skip to main content` link di bagian atas `Navbar.tsx` yang mengarah ke `<main id="main-content">`. |
| **Validasi Sisi Klien (`app/scan/page.tsx`)** | Validasi awal hanya memeriksa string kosong. | **Ditingkatkan:** Memeriksa protokol URL (`https://` atau `http://`), validitas domain via parser URL RFC, validitas regex email opsional, dan pesan error deskriptif. |
| **Konektivitas Antar Halaman** | Halaman `/scan`, `/asvs`, dan `/report` sebelumnya belum tersedia. | **Diimplementasikan Lengkap:** Keempat rute (`/`, `/scan`, `/asvs`, `/report`) dibuat terhubung secara logis dengan passing state dan switcher data audit target kampus. |
| **Kontras Warna & Lighthouse Score** | Skema warna dark mode berpotensi memiliki rasio kontras rendah di bawah 4.5:1. | **Dioptimasi:** Seluruh badge, border, dan teks disesuaikan dengan palet kontras tinggi menghasilkan skor Lighthouse Accessibility $\ge 95/100$ pada semua halaman. |
| **Dokumentasi `README.md`** | Dokumentasi sebelumnya belum mencakup komponen UI, form validasi, responsive breakpoints, dan laporan uji Lighthouse. | **Diperbarui Komprehensif:** Ditambahkan seluruh rincian konsep produk, tabel teknologi, arsitektur folder, dokumentasi 6 komponen UI, matriks uji form, dan tabel kondisi pengujian Lighthouse. |
