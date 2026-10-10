# 🤖 AI Log — Catatan Penggunaan Generative AI

**Mata Kuliah:** Keamanan Komputasi dan Siber, Kriptografi, Pemrograman Web dan Aplikasi
**Topik Produk:** Tripleemat Security Assessor Platform  

---

## 📌 Milestone `sec-0.1` — Threat, Vulnerability, dan Risk Analysis

**Pekan:** 2 — Pemodelan Ancaman dan Penilaian Risiko  
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

## 📌 Milestone `sec-0.2` — Implementasi Modul Kriptografi & Pengujian Otomatis

**Pekan:** 3 — Implementasi Kriptografi Produk  
**Tanggal:** 2026-10-08  
**Penanda Milestone:** `sec-0.2`  

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
