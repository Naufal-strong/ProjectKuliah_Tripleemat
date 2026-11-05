# Log Keputusan Desain Kriptografi (KEPUTUSAN.md) — Milestone v0.2

**Proyek:** Tripleemat Security Assessor  
**Modul:** Kriptografi & Keamanan Data (Minggu 06 — Sub-CPMK 3 / Rubrik R2)  
**Versi Rilis:** `v0.2`  
**Tanggal:** 2 November 2026  

---

## 1. Pemetaan Kebutuhan ke Mekanisme Kriptografi (K1)

| Kebutuhan Sistem | Ancaman / Risiko (STRIDE) | Mekanisme Terpilih | Alasan & Rationale Desain |
|---|---|---|---|
| **Otentikasi & Integritas Laporan Publik** | *Tampering* (pengubahan skor kepatuhan audit dari D menjadi A) & *Repudiation* | **Kanonisasi JSON (T1) + Digest SHA-256 (T1) + HMAC-SHA256 (T2)** | Menjamin data tidak dapat diubah oleh pihak yang tidak memiliki kunci rahasia. Kanonisasi memastikan variasi penulisan (*whitespace*, urutan properti) tidak merusak verifikasi integritas. |
| **Kerahasiaan & Otentikasi Temuan Sensitif** | *Information Disclosure* (bocoran PoC eksploitasi, token, password) & *Tampering* | **AEAD (AES-256-GCM) dengan Pengikatan Konteks AAD (`targetId`)** | Menyediakan kerahasiaan (*confidentiality*) dan otentikasi data (*integrity*) secara simultan. AAD mengikat ciphertext secara kriptografis ke identitas target pemindaian guna mencegah serangan pemindahan/relokasi (*relocation attack*). |
| **Pemisahan Kunci Multi-Fungsi** | *Cross-Protocol Attacks* & kebocoran kunci akibat pemakaian ganda | **HKDF-SHA256 (RFC 5869)** | Mematuhi prinsip NIST SP 800-57 *"One key, one purpose"*. Menurunkan kunci terpisah secara ortogonal: `k_integritas` (untuk HMAC) dan `k_arsip` (untuk AES-GCM) dari satu kunci induk tanpa risiko interferensi matematis antar-primitif. |
| **Penyediaan Entropi & Keacakan** | *Spoofing* & tebakan nonce/kunci (*cryptanalytic prediction*) | **CSPRNG (`node:crypto` `randomBytes`)** | Menggunakan generator acak semu kriptografis berbasis OS kernel CSPRNG (Windows CryptGenRandom / BCryptGenRandom) dengan entropi tinggi dan proteksi terhadap perulangan status (*forward/backward secrecy*). |
| **Pustaka Kriptografi** | Celah rantai pasok (*supply-chain vulnerability*) pada pustaka eksternal pihak ketiga | **`node:crypto` (OpenSSL 3.x LTS Engine)** | Pustaka bawaan runtime Node.js LTS, teruji secara formal, diaudit berkala oleh komunitas global, tanpa dependensi *npm package* pihak ketiga yang rentan ditinggalkan atau disusupi. |

---

## 2. Parameter Teknis & Analisis Keamanan (K2)

### 2.1 Ringkasan Parameter Kriptografi

| Komponen | Parameter | Nilai / Ukuran | Standar / Referensi |
|---|---|---|---|
| **Kunci Induk ($K_{master}$)** | Panjang Kunci | 32 byte (256 bit) | Rekomendasi NIST SP 800-131A (Security Strength $\ge 128$ bit) |
| **Inisialisasi IV / Nonce** | Ukuran Nonce | 12 byte (96 bit) unik per enkripsi | NIST SP 800-38D (Optimal untuk mode Galois/Counter) |
| **Tag Otentikasi GCM** | Ukuran AuthTag | 16 byte (128 bit) | Ukuran penuh GHASH tag untuk mencegah *tag guessing attack* |
| **Segel Integritas HMAC** | Ukuran Tag HMAC | 32 byte (256 bit / 64 karakter hex) | FIPS PUB 198-1 (HMAC-SHA256) |
| **Konteks AAD** | Isi Data | `targetId` (misal: `scan-2026-001`) | Pengikatan konteks data agar ciphertext tidak dapat dipindahkan |
| **Derivasi Kunci (HKDF)** | Algoritma & Info | HKDF-SHA256; Info: `tripleemat v0.2 <tujuan>` | RFC 5869 |

### 2.2 Analisis Dampak Pengulangan Nonce/IV pada AES-256-GCM

Mode AES-GCM menggabungkan mode enkripsi *Counter* (CTR) dengan fungsi otentikasi Galois MAC (GHASH). Jika Nonce/IV digunakan ulang dua kali pada kunci yang sama:
1. **Kehilangan Kerahasiaan (Two-Time Pad):**
   $$C_1 \oplus C_2 = (P_1 \oplus K_S) \oplus (P_2 \oplus K_S) = P_1 \oplus P_2$$
   XOR dari dua *ciphertext* menghasilkan XOR dari dua *plaintext*. Penyerang dapat memulihkan informasi teks asli menggunakan analisis frekuensi atau masukan yang diketahui (*known-plaintext attack*).
2. **Kehancuran Integritas (Pemulihan Kunci GHASH $H$):**
   GHASH adalah fungsi autentikasi berbasis evaluasi polinomial atas lapangan $GF(2^{128})$. Dari dua tag otentikasi berbeda yang dihasilkan dengan nonce yang sama, penyerang dapat memecahkan persamaan polinomial untuk menemukan kunci hash rahasia $H = E_K(0^{128})$. Setelah $H$ diketahui, penyerang dapat **memalsukan tag otentikasi untuk sembarang ciphertext**, menghancurkan seluruh garansi integritas sistem secara permanen.
3. **Mitigasi di Tripleemat:**
   Setiap pemanggilan `encryptAES256GCM()` secara deterministik mengeksekusi `generateSecureBytes(12)` dari CSPRNG. Tidak pernah menerima IV statis dari pengguna atau parameter luar.

### 2.3 Justifikasi "Satu Kunci, Satu Tujuan" (NIST SP 800-57 §5.2)

NIST SP 800-57 Bagian 1 Revisi 5, Subbab 5.2 menegaskan:
> *"A single key shall be used for only one purpose (e.g., encryption, authentication, key wrapping, random number generation, or digital signatures)."*

Alasan kriptografis:
- **Mencegah Interaksi Antar-Primitif:** Jika kunci yang sama digunakan untuk HMAC-SHA256 dan enkripsi AES-256-GCM, relasi struktural antar operasi matematika (misalnya padding atau representasi internal) dapat menciptakan titik bocor saluran samping (*side-channel*) atau eksploitasi berbasis aljabar.
- **Isolasi Kegagalan (Fault Isolation):** Jika kunci arsip temuan sensitif terkompromi (misalnya melalui kesalahan penanganan memori pada operasi dekripsi), kunci integritas segel laporan publik tetap terlindungi dan independen.
- **Implementasi:** Melalui modul `kunci.ts`, fungsi `turunkanKunci(kunciInduk, tujuan)` membagi domain:
  - `k_integritas = HKDF-Expand(PRK, "tripleemat v0.2 integritas", 32)`
  - `k_arsip = HKDF-Expand(PRK, "tripleemat v0.2 arsip", 32)`

---

## 3. Penanganan Masukan, Kunci, dan Keandalan (K3)

### 3.1 Penyimpanan Kunci di Luar Repositori
- **Lokasi Default:** `~/.tripleemat/audit.key` (pada sistem Windows: `C:\Users\<User>\.tripleemat\audit.key`).
- **Alternatif Lingkungan:** Variabel lingkungan `TRIPLEEMAT_KEY` (string 64 karakter heksadesimal).
- **Perlindungan Berkas:**
  - Pembuatan berkas memanfaatkan flag sistem `wx` (`O_CREAT | O_EXCL`). Jika berkas kunci sudah ada, operasi **menolak menimpa** guna mencegah kehilangan kunci enkripsi arsip terdahulu.
  - Pada sistem bertipe POSIX, direktori dibuat dengan izin `0o700` dan berkas dengan izin `0o600` (hanya pengguna pemilik yang berhak membaca). Modul `muatKunci()` menolak membaca jika izin berkas lebih terbuka dari `0o600`.
- **Kebersihan Repositori:**
  - `.gitignore` menyaring pola `*.key`, `.tripleemat/`, dan `.env`.
  - Repositori 100% bebas dari kunci rahasia privat, token nyata, atau data produksi. Seluruh pengujian menggunakan data sintesis (*synthetic test vectors*).

### 3.2 Batas Kepercayaan & Validasi Masukan Gagal-Tertutup (Fail-Closed)
- **Kanonisasi JSON Deterministik (`kanonis.ts`):**
  - Mengurutkan semua *key* objek secara leksikografis (A-Z) pada setiap tingkat kedalaman.
  - Menolak nilai `NaN` dan `Infinity` secara tegas (melempar `MasukanKriptoTidakValid`).
  - Menormalkan string teks ke bentuk **Unicode NFC** (`val.normalize('NFC')`), sehingga representasi aksen (misalnya `é` precomposed vs decomposed) menghasilkan deretan byte yang identik.
- **Validasi Skema Laporan Allowlist:**
  - Fungsi `validasiStrukturLaporan` memverifikasi kehadiran atribut wajib (`targetUrl`, `overallScore`, `grade`).
  - Membatasi rentang nilai (skor 0-100, format peringkat `[A-F][+-]?`).
- **Pemeriksaan Segel Fail-Closed (`vault.ts`):**
  - Validasi ketat sintaksis tag: segel HMAC wajib berupa string 64-karakter heksadesimal valid (`^[0-9a-fA-F]{64}$`).
  - Jika segel cacat (*malformed*, non-hex, atau panjang tidak tepat), fungsi `verifikasiLaporan()` **tidak crash/melempar uncaught exception**, melainkan mengembalikan objek status `{ valid: false, alasan: 'Format segel HMAC tidak sah ...' }`.
  - Menggunakan `crypto.timingSafeEqual()` untuk membandingkan tag otentikasi demi memitigasi serangan waktu (*timing attack*).

---

## 4. Evaluasi Skenario Uji (K4)

Pengujian kriptografi dijalankan melalui Node.js Test Runner terintegrasi: `npm run test:crypto`.  
**Hasil Pengujian:** 22/22 skenario berhasil (100% Pass, 0 Gagal, 0 Dibatalkan).

| ID Uji | Kategori | Skenario Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **1.1** | Regresi v0.1 | Verifikasi hash SHA-256 ruleset asli | `valid === true` | ✅ PASS |
| **1.2** | Regresi v0.1 | Deteksi manipulasi 1 byte masukan (*Avalanche Effect*) | Hash berubah drastis, `valid === false` | ✅ PASS |
| **1.3** | Regresi v0.1 | Pembangkitan 1.000 token acak dari CSPRNG | 1.000 token 100% unik tanpa tabrakan | ✅ PASS |
| **1.4** | Regresi v0.1 | Enkripsi dasar AES-256-GCM | Ciphertext dimanipulasi melempar galat otentikasi | ✅ PASS |
| **2.1** | T1 Kanonis | Urutan properti objek terbalik | Menghasilkan string byte kanonis identik | ✅ PASS |
| **2.2** | T1 Kanonis | Normalisasi Unicode NFC (aksen decomposed vs precomposed) | Menghasilkan byte identik | ✅ PASS |
| **2.3** | T1 Batas | Masukan berisi `NaN` atau `Infinity` | Ditolak melempar `MasukanKriptoTidakValid` | ✅ PASS |
| **2.4** | T1 Batas | Struktur laporan tanpa atribut wajib | Ditolak oleh allowlist sebelum diproses | ✅ PASS |
| **3.1** | T2 HKDF | Ortogonalitas kunci `k_integritas` vs `k_arsip` | Byte kunci berbeda total dari kunci induk dan satu sama lain | ✅ PASS |
| **3.2** | T2 HKDF | Known-Answer Test (KAT) HKDF deterministik | Menghasilkan 32-byte hash yang stabil dan berulang | ✅ PASS |
| **3.3** | T2 HKDF | Panjang master key < 32 byte | Ditolak melempar `KunciTidakValid` | ✅ PASS |
| **4.1** | T1 $\rightarrow$ T2 | Alur penuh: Kanonis + SHA-256 + HMAC-SHA256 | Laporan asli terverifikasi `valid === true` | ✅ PASS |
| **4.2** | T1 $\rightarrow$ T2 | Manipulasi isi data laporan (*Tamper Data*) | Terdeteksi, `valid === false`, pesan alasan jelas | ✅ PASS |
| **4.3** | T1 $\rightarrow$ T2 | Manipulasi 1 karakter segel HMAC (*Tamper Tag*) | Terdeteksi, `valid === false` | ✅ PASS |
| **4.4** | T1 $\rightarrow$ T2 | Segel HMAC rusak / non-hex / salah ukuran (*Malformed*) | Gagal tertutup (fail-closed) tanpa unhandled exception | ✅ PASS |
| **4.5** | T1 $\rightarrow$ T2 | Verifikasi menggunakan kunci induk berbeda | Ditolak, `valid === false` | ✅ PASS |
| **5.1** | T2 AEAD Vault | Enkripsi & dekripsi arsip terikat `targetId` (AAD) | Dekripsi berhasil mengembalikan objek JSON identik | ✅ PASS |
| **5.2** | T2 AEAD Vault | Serangan pemindahan ciphertext ke `targetId` lain (*Relocation Attack*) | Ditolak oleh OpenSSL GCM AuthTag | ✅ PASS |
| **5.3** | T2 AEAD Vault | Manipulasi GCM AuthTag | Dekripsi melempar galat otentikasi | ✅ PASS |
| **6.1** | Kunci Sistem | Pembuatan berkas kunci dan pemuatan kembali | Berkas tersimpan di filesystem, terbaca tepat 32 byte | ✅ PASS |
| **6.2** | Kunci Sistem | Pencegahan penimpaan berkas kunci lama via flag `wx` | Melempar `KunciTidakValid` jika berkas telah ada | ✅ PASS |
| **6.3** | Kunci Sistem | Pemuatan berkas kunci berkas korup / bukan hex | Ditolak fail-closed dengan pesan galat sanitasi | ✅ PASS |

---

## 5. Prosedur Darurat & Siklus Hidup Kunci

### 5.1 Masa Pakai Kunci (Key Cryptoperiod)
- Kunci induk audit memiliki masa aktif operasional 1 tahun kalender atau maksimal $2^{32}$ pemanggilan enkripsi AES-GCM (sesuai rekomendasi NIST SP 800-38D untuk batas penggunaan nonce 96-bit acak).

### 5.2 Penanganan Kompromi Kunci (Key Compromise Procedure)
Jika berkas kunci `audit.key` atau variabel `TRIPLEEMAT_KEY` dicurigai bocor ke pihak tidak berhak:
1. **Pencabutan (*Revocation*):** Segera hapus berkas kunci dari server/lingkungan produksi.
2. **Karantina Data:** Tandai seluruh laporan audit terdahulu sebagai *"Kunci Kadaluarsa/Perlu Rekonfirmasi"*.
3. **Penerbitan Kunci Baru:** Jalankan generator kunci `npm run crypto:cli keygen` untuk membuat berkas kunci baru di luar repositori.
4. **Re-sealing & Re-encryption:** Lakukan ekspor dan penyegelan ulang data historis dengan kunci induk yang baru.

### 5.3 Kehilangan Kunci (Key Loss)
Jika berkas kunci hilang tanpa cadangan, data laporan publik tetap dapat dibaca (karena hanya ditandai HMAC), namun status keaslian laporan tidak dapat diverifikasi ulang. Temuan sensitif yang dienkripsi dengan AES-256-GCM akan **hilang secara permanen** (*cryptographic erasure*). Oleh karena itu, administrator wajib melakukan pencadangan berkas `audit.key` di tempat penyimpanan aman luring (*air-gapped secure storage*).

---

## 6. Keterbatasan Sistem Saat Ini & Rencana Roadmap ke v0.3

1. **Ketiadaan Sifat Nirsangkal (Non-Repudiation):**
   - *Keterbatasan v0.2:* Sistem saat ini menggunakan kriptografi simetris (HMAC dan AES-GCM). Setiap pihak yang memegang kunci simetris dapat memverifikasi sekaligus **memalsukan** segel laporan.
   - *Rencana v0.3 (Tugas 3 / Asimetris):* Mengganti atau menambahkan tanda tangan digital berbasis kunci privat-publik (**ECDSA P-256** atau **Ed25519**). Dengan tanda tangan digital, auditor dapat membuktikan keaslian laporan kepada pihak ketiga (klien, penguji, publik) tanpa memberikan hak untuk membuat atau memalsukan tanda tangan baru.
2. **Distribusi & Rotasi Kunci:**
   - *Keterbatasan v0.2:* Distribusi kunci masih berbasis berkas lokal atau variabel lingkungan manual.
   - *Rencana Minggu 11:* Mengintegrasikan mekanisme pertukaran kunci terotentikasi (*Authenticated Key Exchange* / ECDH) atau KMS (Key Management Service).

---

## 7. Panduan Demonstrasi Lisan 3 Menit (K5)

Demonstrasi individual sesi Minggu 06 (durasi $\pm 3$ menit) dapat dilakukan dengan alur berikut:

1. **Menit 0:00 - 0:45: Menunjukkan Penyimpanan Kunci di Luar Repositori**
   - Buka terminal PowerShell / Terminal:
     ```powershell
     npm run crypto:cli keygen
     ```
   - Tunjukkan berkas kunci yang terbuat di profil pengguna `~/.tripleemat/audit.key`.
   - Buka file `.gitignore` untuk membuktikan bahwa berkas kunci maupun folder tersebut **tidak pernah terlacak atau tersimpan di repositori Git**.

2. **Menit 0:45 - 1:45: Menjelaskan Arsitektur & Sambungan T1 $\rightarrow$ T2**
   - Buka file `src/lib/crypto/vault.ts`:
     - Tunjukkan bagaimana fungsi `segelLaporan()` mengimpor dan memanfaatkan Kanonisasi JSON (T1), SHA-256 (T1), HKDF Derivasi Kunci `k_integritas` (T2), dan menghasilkan segel HMAC-SHA256 (T2).
     - Tunjukkan fungsi `arsipTemuanSensitif()` yang menggunakan AEAD AES-256-GCM dengan parameter AAD (`targetId`) untuk mengunci identitas target.
   - Tunjukkan implementasi prinsip *"Satu Kunci, Satu Tujuan"* pada `src/lib/crypto/kunci.ts` via HKDF-SHA256.

3. **Menit 1:45 - 3:00: Menjalankan Pengujian Otomatis & Kondisi Gagal-Tertutup**
   - Jalankan seluruh suite uji kriptografi di terminal:
     ```powershell
     npm run test:crypto
     ```
   - Jelaskan kepada dosen bahwa 22 uji telah mencakup:
     - Uji Positif verifikasi laporan dan enkripsi.
     - Uji Negatif manipulasi data laporan (*tamper data* ditolak).
     - Uji Negatif manipulasi tag otentikasi (*tamper tag* ditolak).
     - Uji Fail-Closed terhadap segel rusak (*malformed tag* tidak mengakibatkan crash).
     - Uji Serangan Relokasi Konteks AAD (mismatch target ID ditolak OpenSSL).

