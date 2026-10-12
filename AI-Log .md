# 🤖 AI Log — Catatan Penggunaan Generative AI

**Mata Kuliah:** Keamanan Komputasi dan Siber, Kriptografi, Pemrograman Web dan Aplikasi
**Topik Produk:** Tripleemat Security Assessor Platform  
**Tag:** `sec-0.1`  
**Status Update:** Dokumen ini telah disesuaikan dengan implementasi produk Tripleemat yang sedang berjalan, bukan template generik.

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
5. *"Perbaiki dan validasi Asset & Data Inventory berdasarkan prompt"*
6. *"Perbaiki dan validasi Diagram Arsitektur Data Flow DFD Level 0 berdasarkan prompt"*
7. *"Perbaiki dan validasi Threat, Vulnerability, dan Risk Analysis berdasarkan prompt"*

### 3. Bagian yang Diubah dan Diverifikasi Sendiri (*Self-Verification*)

| Komponen | Draf Awal dari AI | Penyesuaian & Verifikasi Mandiri |
| :--- | :--- | :--- |
| **Pivot & Cakupan Aset** | Draf awal sempat memuat aset sistem pengaduan generik. | **Diperbarui:** Mengubah seluruh aset utama menjadi aset platform penilaian keamanan siber: *Ruleset Vault (AST-01)*, *Scan Logs (AST-02)*, *Audit DB (AST-03)*, dan *Auditor Secrets (AST-04)* beserta penandaan proteksi kriptografi. |
| **Koreksi Tabel Aset** | Terdapat baris ganda dan sintaks markdown tabel terpotong pada aset `AST-02`. | **Diperbaiki:** Menghapus baris terpotong, menambahkan tabel inventarisasi aliran data (*Data in Transit* FLW-01 s.d. FLW-06), dan menghitung formula kategori keamanan sistem FIPS 199 (Overall: HIGH). |
| **Koreksi DFD & Batas Kepercayaan** | Arah panah `Fetch Ruleset` pada DS-1 berupa panah dua arah dan entitas target dianggap mengontrol proses internal. | **Diperbaiki:** Mengubah alur ke DS-1 menjadi satu arah (*read-only*), memetakan 3 Trust Boundaries eksplisit (TB-1, TB-2, TB-3), dan menautkan artefak visual `DFD .png`. |
| **Cakupan STRIDE & Elemen DFD** | Draf awal hanya memuat ancaman generik tanpa relasi langsung ke elemen DFD. | **Diperbarui:** Menyusun 12 ancaman STRIDE yang dipetakan secara eksplisit ke elemen proses (P1–P4), data store (DS1–DS3, AST-04), entitas luar (EE1–EE2), dan aliran data (DF-01–DF-11). |
| **Justifikasi 5 Risiko Prioritas** | Alasan prioritas risiko menggunakan template abstrak (misal: "data penting harus aman"). | **Disesuaikan dengan Konteks Produk:** Justifikasi disesuaikan dengan realitas operasional Tripleemat sebagai web scanner (misal: SSRF dari input target URL, manipulasi integritas ruleset ASVS yang merusak kredibilitas audit, pencurian temuan kerentanan target yang belum ditambal, dan DoS worker akibat target slowloris). |
| **Rencana Kontrol & Pengujian** | Kontrol keamanan hanya berupa saran umum (misal: "gunakan enkripsi"). | **Diverifikasi & Dikaitkan:** Kontrol dikaitkan langsung dengan implementasi nyata pada kode sumber (`src/lib/crypto/integrity.ts`, `encryption.ts`, `csprng.ts`) dan dibuktikan dengan hasil 100% pass pada unit test `test/crypto.test.ts`. |
| **Penanda Milestone** | Dokumen di folder `security/` belum memiliki tag milestone eksplisit. | **Ditambahkan:** Menambahkan header resmi `Milestone: sec-0.1` pada `asset-inventory.md` dan `threat-modeling.md`. |

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

## 📌 Milestone `v-0.1` — Frontend Architecture, UI/UX, Reusable Components, & Web Accessibility

**Pekan:** 3 — Pengembangan Antarmuka Web, Validasi Klien, & Audit Aksesibilitas  
**Tanggal:** 2026-10-11  
**Penanda Milestone:** `v-0.1`  

### 1. Alat AI yang Digunakan
* **Model AI:** Gemini 3.8 Flash (Antigravity IDE)
* **Penggunaan:** 
  1. Perumusan dan pengorganisasian kode front-end Next.js 16 (App Router), React 19, TypeScript, dan Tailwind CSS v4.
  2. Implementasi 6 komponen UI dapat dipakai ulang (*Reusable Components*) di direktori `src/components/ui/` (`Button`, `Card`, `Badge`, `Input`, `Alert`, `ProgressBar`).
  3. Pengembangan 4 halaman inti aplikasi berorientasi alur pengguna: Beranda (`/`), Security Scanner (`/scan`), OWASP ASVS Matrix (`/asvs`), dan Executive Scorecard (`/report`).
  4. Implementasi form pemindaian target dengan validasi sisi klien (*client-side validation*) dan pesan error deskriptif.
  5. Penyusunan dataset mock data komprehensif di `src/data/` (`mockSecurityHeaders.ts`, `mockAsvsControls.ts`, `mockScans.ts`).
  6. Optimalisasi desain responsif (mobile $\le 640\text{px}$, tablet $768\text{px}$, desktop $\ge 1024\text{px}$) dan aksesibilitas web WCAG 2.1 AA (Lighthouse Accessibility $\ge 95$).

### 2. Prompt Ringkas yang Digunakan
1. *"Define the product concept. Establish the name, purpose, target users, problem to be solved, and core functions of the web application. The concept must allow for future feature development, data management, and integration in subsequent milestones."*
2. *"Implement the User Interface (UI) using React, TypeScript, and Tailwind CSS with an organized code structure. Build at least three pages relevant to the user flow, develop at least five reusable components, implement client-side form validation, use mock data, implement responsive design, and satisfy Lighthouse accessibility >= 85."*

### 3. Bagian yang Diubah dan Diverifikasi Sendiri (*Self-Verification*)

| Komponen | Draf Awal dari AI | Penyesuaian & Verifikasi Mandiri |
| :--- | :--- | :--- |
| **Struktur Komponen UI** | Draf komponen awal menggabungkan logic styling langsung di page tanpa abstraksi. | **Dibuat Terpisah & Modular:** 6 komponen UI dipisahkan ke `src/components/ui/` dengan typing ketat (`ButtonProps`, `InputProps`, `CardProps`, `BadgeVariant`, dll.) serta barrel file `index.ts`. |
| **Aksesibilitas Form (`Input.tsx`)** | Form input biasa tidak memiliki atribut ARIA penanda error atau label eksplisit. | **Diperbaiki:** Menambahkan `id` dan `htmlFor` berpasangan, atribut `aria-invalid={!!error}`, `aria-describedby` ke error message, serta error message ber-`role="alert"` dengan `aria-live="polite"`. |
| **Navigasi Keyboard (WCAG AA)** | Tidak ada mekanisme bagi pengguna keyboard untuk melewati menu header. | **Ditambahkan:** Menambahkan `Skip to main content` link di bagian atas `Navbar.tsx` (`focus:not-sr-only focus:fixed focus:top-4 focus:left-4`) yang mengarah ke `<main id="main-content">`. |
| **Validasi Sisi Klien (`app/scan/page.tsx`)** | Validasi awal hanya memeriksa string kosong. | **Ditingkatkan:** Memeriksa protokol URL (`https://` atau `http://`), validitas domain/hostname via parser URL RFC, validitas regex email opsional, dan menampilkan pesan error bahasa manusia yang mudah dipahami. |
| **Konektivitas Antar Halaman** | Halaman `/scan`, `/asvs`, dan `/report` sebelumnya belum tersedia (hanya mockup di landing page). | **Diimplementasikan Lengkap:** Keempat rute (`/`, `/scan`, `/asvs`, `/report`) dibuat terhubung secara logis dengan passing state dan switcher data audit target kampus. |
| **Kontras Warna & Lighthouse Score** | Skema warna dark mode berpotensi memiliki rasio kontras rendah di bawah 4.5:1 untuk teks sekunder. | **Dioptimasi:** Seluruh badge, border, dan teks telah disesuaikan dengan palet kontras tinggi (`#f8fafc`, `#22d3ee`, `#34d399`, `#f87171` pada slate-950) menghasilkan skor Lighthouse Accessibility $\ge 95/100$ pada semua halaman. |
| **Dokumentasi `README.md`** | Dokumentasi sebelumnya belum mencakup komponen UI, form validasi, responsive breakpoints, dan laporan uji Lighthouse. | **Diperbarui Komprehensif:** Ditambahkan seluruh rincian konsep produk, tabel teknologi, arsitektur folder, dokumentasi 6 komponen UI, matriks uji form, dan tabel kondisi pengujian Lighthouse. |
