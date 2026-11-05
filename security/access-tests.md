# Laporan Pengujian Kontrol Akses & Hashing Kredensial (`access-tests.md`)

**Mata Kuliah:** Keamanan Komputasi dan Siber (052353) — Pekan 6  
**Topik:** Autentikasi, Otorisasi, dan Least Privilege  
**Milestone:** `sec-0.2`  
**Kepatuhan:** Rubrik Penilaian Kriteria 1 (35 Poin)  

---

## 1. Matriks Hak Akses Berdasarkan Peran (Role-Based Access Control Matrix)

Sistem **Tripleemat Security Assessor** mengimplementasikan prinsip *Least Privilege* dengan membagi otorisasi ke dalam 3 peran (*Roles*):
1. **Tamu / Publik (`Anonymous`):** Pengguna luar tanpa autentikasi; hanya dapat melihat halaman umum, membaca matriks ASVS, dan menjalankan simulasi pemindaian pasif non-persisten.
2. **Auditor Keamanan (`Auditor`):** Pengguna terotentikasi; memiliki hak mengelola target audit organisasi miliknya, menambah temuan kerentanan, dan menyegel laporan kriptografis.
3. **Administrator Sistem (`Admin`):** Lead auditor dengan kewenangan penuh mengelola akun auditor, menghapus target, mengakses vault temuan sensitif tingkat tinggi, dan mengelola infrastruktur.

| Sumber Daya / Fungsi Aplikasi | Endpoint / Tindakan | Tamu (`Anonymous`) | Auditor (`Auditor`) | Admin (`Admin`) | Rujukan Risiko Task 1 |
|---|---|:---:|:---:|:---:|:---:|
| **Halaman Beranda & Matriks ASVS** | `GET /`, `GET /asvs` | ✅ BACA | ✅ BACA | ✅ BACA | — |
| **Pemindai Pasif HTTP Header** | `GET /scan`, `POST /scan` | ✅ EKSEKUSI | ✅ EKSEKUSI | ✅ EKSEKUSI | `RR-02` (SSRF filter) |
| **Daftar Target Persisten** | `GET /target` | ❌ DITOLAK | ✅ BACA | ✅ BACA | `RR-03` (Temuan DB) |
| **Tambah Target Pemindaian** | `POST /target (tambahTargetAction)` | ❌ DITOLAK | ✅ BUAT | ✅ BUAT | `RR-03`, `RR-05` |
| **Ubah Catatan Target** | `POST /target (ubahTargetAction)` | ❌ DITOLAK | ✅ UBAH | ✅ UBAH | `RR-03` |
| **Hapus Target (Cascade Transaksi)**| `POST /target (hapusTargetAction)` | ❌ DITOLAK | ❌ DITOLAK | ✅ HAPUS | `RR-01`, `RR-03` |
| **Lihat Detail Temuan Kerentanan** | `GET /target/[id]` | ❌ DITOLAK | ✅ BACA | ✅ BACA | `RR-03` (Data Disclosure) |
| **Tambah & Kelola Temuan Anak** | `POST /target/temuan-actions` | ❌ DITOLAK | ✅ BUAT/UBAH | ✅ BUAT/UBAH | `RR-03` |
| **Penyegelan Laporan Kriptografis** | `POST /api/vault/segel` | ❌ DITOLAK | ✅ SEGEL | ✅ SEGEL | `RR-01` (Tampering) |
| **Ekspor Master Key & Konfigurasi** | `GET /api/admin/secrets` | ❌ DITOLAK | ❌ DITOLAK | ✅ BACA | `RR-05` (Credential Theft) |

---

## 2. Pelaksanaan Pengujian Akses (12 Skenario Terverifikasi)

> **Syarat Mutlak Pengujian:** Jumlah pengujian akses negatif (*attempts that should be denied*) harus **tepat sama** dengan jumlah pengujian akses positif (*attempts allowed*).  
> **Total Skenario:** 12 Pengujian (6 Uji Positif dan 6 Uji Negatif).

```
Total Skenario: 12 Uji
├── Positif (Allowed): 6 Skenario (50%)
└── Negatif (Denied) : 6 Skenario (50%)
```

### Akun Uji Sintetis yang Digunakan:
* Akun Tamu: `Anonymous Session` (tanpa cookie sesi).
* Akun Auditor Uji: `auditor.test@tripleemat.id` (Peran: `Auditor`, Organisasi: `Lab Siber`).
* Akun Admin Uji: `admin.test@tripleemat.id` (Peran: `Admin`, Hak Akses: `Root Lead`).

---

### Tabel Log Pengujian Akses Per Peran

| ID Uji | Tipe Uji | Peran Akun | Aksi / Endpoint yang Diuji | Hasil yang Diharapkan | Kode HTTP / Status Aktual | Keterangan Verifikasi | Status |
|:---:|:---:|:---:|---|---|:---:|---|:---:|
| **UJI-POS-01** | **Positif** | Tamu | Mengakses halaman publik matriks ASVS (`GET /asvs`) | Akses diberikan (200 OK) | `200 OK` | Tamu berhasil membaca daftar kontrol ASVS publik | **PASS** |
| **UJI-POS-02** | **Positif** | Tamu | Melakukan pemindaian pasif publik (`POST /scan`) | Berhasil diproses, hasil ditampilkan | `200 OK` | Pemindaian pasif dijalankan tanpa menyimpan ke basis data persisten | **PASS** |
| **UJI-POS-03** | **Positif** | Auditor | Mengakses daftar target organisasi (`GET /target`) | Akses diberikan (200 OK) | `200 OK` | Sesi auditor valid diverifikasi melalui cookie `HttpOnly` FIPS 199 | **PASS** |
| **UJI-POS-04** | **Positif** | Auditor | Menambah target baru (`POST /target/actions`) | Target tersimpan di PostgreSQL | `303 Redirect` ➔ `/target` | Validasi Zod lulus dan record berhasil disimpan ke tabel `Target` | **PASS** |
| **UJI-POS-05** | **Positif** | Auditor | Menambah temuan kerentanan (`POST /target/temuan-actions`) | Temuan tersimpan terikat `targetId` | `200 OK` (Sukses) | Record tersimpan pada tabel relasional `Temuan` | **PASS** |
| **UJI-POS-06** | **Positif** | Admin | Menghapus target beserta seluruh temuan (`hapusTargetAction`) | Berhasil dihapus dalam transaksi atomik | `303 Redirect` ➔ `/target` | Transaksi `prisma.$transaction` berhasil mengeksekusi cascading clean-up | **PASS** |
| **UJI-NEG-01** | **Negatif** | Tamu | Mencoba membuka daftar target persisten (`GET /target`) | Akses ditolak, dialihkan ke halaman login | `307 Temporary Redirect` ➔ `/masuk` | Gerbang tepi `proxy.ts` mencegat akses tidak sah pengguna tanpa sesi | **PASS** |
| **UJI-NEG-02** | **Negatif** | Tamu | Menembak Server Action tambah target langsung (`POST /target`) | Ditolak dengan status otorisasi gagal | `401 Unauthorized` | Server Action memvalidasi sesi auditor sebelum memproses mutasi | **PASS** |
| **UJI-NEG-03** | **Negatif** | Tamu | Mengakses rute detail temuan internal (`GET /target/scan-2026-001`) | Ditolak, diarahkan ke login | `307 Temporary Redirect` ➔ `/masuk` | Rute dinamis terlindungi oleh validasi sesi di sisi server | **PASS** |
| **UJI-NEG-04** | **Negatif** | Auditor | Mencoba menghapus entitas target tanpa wewenang Admin | Ditolak: hak akses tidak mencukupi | `403 Forbidden` | Server Action menolak aksi: *"Hanya Administrator yang berhak menghapus target"* | **PASS** |
| **UJI-NEG-05** | **Negatif** | Auditor | Mencoba mengakses endpoint raw master key (`GET /api/admin/secrets`) | Ditolak oleh policy kontrol akses | `403 Forbidden` | Modul `kunci.ts` melarang pembacaan kunci mentah oleh peran non-admin | **PASS** |
| **UJI-NEG-06** | **Negatif** | Penyerang | Mencoba login dengan kata sandi acak / salah 5 kali | Otentikasi gagal, percobaan dibatasi | `401 Unauthorized` | Skema `skemaMasuk` menolak kredensial palsu dan mencatat log upaya intrusi | **PASS** |

> **Kesimpulan Kuantitatif:**  
> • Uji Positif: **6 / 6 Lulus (100%)**  
> • Uji Negatif: **6 / 6 Lulus (100%)**  
> • Seluruh upaya akses tidak sah (*unauthorized access attempts*) **100% tertolak**.

---

## 3. Bukti Penyimpanan Kata Sandi Menggunakan Fungsi Hash Lambat (Argon2id)

### 3.1 Justifikasi Pemilihan Fungsi Hash Lambat
Sesuai rekomendasi standar **NIST SP 800-63B (Digital Identity Guidelines)** dan **OWASP Password Storage Cheat Sheet**, fungsi hash cepat (seperti MD5, SHA-1, atau SHA-256 murni) **dilarang keras** untuk penyimpanan kata sandi karena rentan terhadap serangan komputasi paralel masif menggunakan GPU/ASIC (*offline brute-force*).

Tripleemat Security Assessor mengimplementasikan fungsi hash lambat bertipe memory-hard: **Argon2id (RFC 9106)**.

| Parameter Argon2id | Nilai Konfigurasi | Alasan Kriptografis |
|---|---|---|
| **Varian** | `Argon2id` (v=19) | Gabungan optimal proteksi serangan *side-channel cache* (Argon2i) dan *memory-bandwidth cracking* (Argon2d). |
| **Memory Cost ($m$)** | `65536` KiB (64 MiB) | Memaksa pemakaian RAM tinggi per iterasi; membuat penyerang GPU/ASIC kehabisan memori untuk cracking paralel. |
| **Time Cost ($t$)** | `3` Iterasi | Menjamin durasi hashing $\approx 250\text{--}350\text{ ms}$, tidak terasa bagi login pengguna sah namun melumpuhkan serangan tebakan massal. |
| **Parallelism ($p$)** | `4` Threads | Mengoptimalkan pemrosesan pada CPU modern multi-core. |
| **Ukuran Salt** | `16` Byte (128 bit) | Dibangkitkan secara independen per kata sandi menggunakan **CSPRNG** (`node:crypto.randomBytes`). Menghilangkan risiko serangan *Rainbow Tables*. |
| **Panjang Hash** | `32` Byte (256 bit) | Menjamin ketahanan terhadap tabrakan (*collision resistance*). |

### 3.2 Bukti Representasi Hash pada Basis Data (Data Sintetis Tanpa Bocoran Rahasia)

Tabel berikut membuktikan struktur penyimpanan kredensial pada tabel pengguna, diverifikasi menggunakan data uji sintetis tanpa membocorkan kata sandi plaintext maupun identitas pengguna nyata:

```text
Contoh Format Baku Hash yang Tersimpan di Basis Data:
$argon2id$v=19$m=65536,t=3,p=4$q3l8W7eZ...[Salt 16B Base64]...$B8y2Q9mK...[Digest 32B Base64]...
```

| Atribut | Nilai Uji Sintetis | Status Keamanan |
|---|---|---|
| **User ID** | `usr-test-2026-auditor` | Data sintetis |
| **Email Uji** | `auditor.demo@tripleemat.id` | Identitas sintetis |
| **Peran** | `Auditor` | Valid RBAC |
| **Status Password** | **Tersimpan dalam format Argon2id** | ✅ Terverifikasi |
| **Panjang String Hash** | 97 Karakter | Sesuai spesifikasi modular crypt format |
| **Plaintext Leak** | **0% (Nol)** | Kata sandi asli tidak pernah dicatat di log maupun database |

---

## 4. Keterkaitan dengan Register Risiko Task 1 (`sec-0.1`)

| Kontrol yang Diterapkan | Rujukan Risiko Task 1 | Ancaman yang Dimitigasi |
|---|:---:|---|
| **Otorisasi Berbasis Peran (RBAC)** | `RR-03` | Mencegah kebocoran hasil temuan audit (*Audit findings disclosure from DS-3*) kepada pihak tamu tanpa hak akses. |
| **Gerbang Tepi (`proxy.ts`) & Sesi Stateful** | `RR-05` | Mencegah impersonasi dan pembajakan sesi auditor (*Auditor credential compromise and impersonation*). |
| **Fungsi Hash Lambat Argon2id** | `RR-05` | Memitigasi serangan pencurian hash basis data; penyerang tidak dapat melakukan cracking kata sandi secara praktis meskipun dump database bocor. |
| **Prinsip Least Privilege Admin vs Auditor** | `RR-01` & `RR-03` | Membatasi hak modifikasi destruktif (penghapusan target / penulisan ulang ruleset) hanya kepada Lead Administrator. |

