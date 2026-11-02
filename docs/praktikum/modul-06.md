# Dokumen Teknis Modul 6 — PostgreSQL dan Prisma ORM

**Nama/NIM :** Naufal Fakhrianto Nugroho / 105224026  
**Repositori :** https://github.com/Naufal-strong/ProjectKuliah_Tripleemat  
**Entitas Produk :** Target Audit Keamanan (`Target`) & Temuan Kerentanan (`Temuan`) — *Tripleemat Security Assessor*  
**Teknologi :** Next.js 16.4.0, React 19.3.0, Prisma ORM 7.10.1, PostgreSQL 18.6 (Docker), @prisma/adapter-pg, Zod 4.6.5  

---

## 1. Rancangan Data

### A. Diagram Dua Entitas, Relasi, Kunci, dan Constraint Unik

Model data mengimplementasikan relasi **satu-ke-banyak (1:N)** antara target aplikasi web yang diaudit (`Target`) dan rincian bukti temuan kerentanan (`Temuan`).

```text
Target (1) ──────────────────────────< (N) Temuan
┌────────────────────────────────┐       ┌────────────────────────────────┐
│ id: String (PK, scan-YYYY-NNN) │       │ id: Int (PK, Serial)           │
│ label: String                  │◄──────┤ targetId: String (FK -> Target)│
│ targetUrl: String (@unique)    │       │ findingId: String              │
│ auditScope: String             │       │ title: String                  │
│ asvsLevel: String              │       │ category: String               │
│ intervalJam: Int?              │       │ severity: Severity (Enum)      │
│ auditorEmail: String?          │       │ description: String            │
│ notifyOnComplete: Boolean      │       │ remediation: String            │
│ notes: String?                 │       │ cwe: String?                   │
│ dibuatPada: DateTime           │       │ asvsRef: String?               │
└────────────────────────────────┘       │ dibuatPada: DateTime           │
                                         ├────────────────────────────────┤
                                         │ @@unique([targetId, findingId])│
                                         │ onDelete: Restrict             │
                                         └────────────────────────────────┘
```

#### Penjelasan Atribut, Kunci, dan Padanan Kolom:
1. **Entitas Induk (`Target`)**:
   * `id`: `String @id`. Menggunakan format pengenal publik `scan-YYYY-NNN` (misal `scan-2026-001`) yang divalidasi oleh pola regex `/^scan-\d{4}-\d{3}$/` pada rute dinamis Modul 4.
   * `targetUrl`: `String @unique`. Mencegah URL target yang sama didaftarkan lebih dari sekali.
   * `auditScope` & `asvsLevel`: `String`. Tetap string untuk menghindari kendala tanda hubung pada nilai seperti `"ssl-only"`, dengan validasi nilai dijaga oleh `z.enum` di Zod 4.
   * `intervalJam`, `auditorEmail`, `notes`: Kolom opsional bernilai `NULL` di PostgreSQL jika tidak diisi.
2. **Entitas Anak (`Temuan`)**:
   * `id`: `Int @id @default(autoincrement())`. Kunci primer internal serial.
   * `findingId`: `String`. Kode temuan lokal per target (misal `FIND-01`, `FIND-02`).
   * `targetId`: `String`. Kunci asing (*Foreign Key*) yang merujuk pada `Target.id`.
   * `severity`: `enum Severity` (`critical`, `high`, `medium`, `low`, `info`), selaras persis dengan tipe TypeScript di `src/types/index.ts`.
   * `@@unique([targetId, findingId])`: Constraint unik gabungan. Kode `FIND-01` dapat digunakan ulang pada target berbeda, tetapi dilarang tercatat dua kali pada target yang sama.

---

### B. Alasan Pemilihan Aturan `onDelete: Restrict`

Pada produk **Tripleemat Security Assessor**, aturan referensial yang dipilih adalah **`onDelete: Restrict`**.

1. **Integritas Bukti Audit (Audit Trail Integrity)**:  
   Temuan kerentanan bukanlah sekadar data katalog pelengkap yang boleh hilang tanpa jejak. Temuan kerentanan adalah **bukti hukum kepatuhan (*compliance evidence*)** yang diserahkan auditor kepada pemilik sistem. Jika menggunakan `Cascade`, penghapusan satu target audit secara tidak sengaja akan melenyapkan seluruh rekam bukti temuan secara diam-diam.
2. **Perlindungan Terhadap Ancaman Tampering**:  
   Aturan `Restrict` melindungi aplikasi dari risiko penghapusan bukti secara ilegal (*Ruleset tampering* `RR-01` dan *Audit findings disclosure* `RR-03` pada `security/risk-register.md`).
3. **Memaksa Penghapusan Sadar Melalui Transaksi**:  
   Penghapusan target audit yang masih memiliki temuan tetap dimungkinkan, namun **harus dilakukan secara eksplisit dan atomik** melalui transaksi 2-tahap (`prisma.$transaction([deleteMany temuan, delete target])`).

---

## 2. Skema dan Migrasi

### A. Berkas `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

/// Selaras dengan union `Severity` di src/types/index.ts baris 1
enum Severity {
  critical
  high
  medium
  low
  info
}

/// Kolom disamakan persis dengan `ScanFormData` di src/types/index.ts baris 65-74
model Target {
  id               String    @id
  label            String
  targetUrl        String    @unique
  auditScope       String
  asvsLevel        String
  intervalJam      Int?
  auditorEmail     String?
  notifyOnComplete Boolean   @default(false)
  notes            String?
  dibuatPada       DateTime  @default(now())
  temuan           Temuan[]
}

/// Kolom disamakan persis dengan `ScanFinding` di src/types/index.ts baris 27-36
model Temuan {
  id          Int      @id @default(autoincrement())
  findingId   String
  title       String
  category    String
  severity    Severity
  description String
  remediation String
  cwe         String?
  asvsRef     String?
  dibuatPada  DateTime @default(now())
  targetId    String
  target      Target   @relation(fields: [targetId], references: [id], onDelete: Restrict)

  @@unique([targetId, findingId])
}
```

---

### B. Daftar Folder `prisma/migrations` dan Potongan `migration.sql`

Folder migrasi: `prisma/migrations/20261029120701_init/`

```sql
-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('critical', 'high', 'medium', 'low', 'info');

-- CreateTable
CREATE TABLE "Target" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "auditScope" TEXT NOT NULL,
    "asvsLevel" TEXT NOT NULL,
    "intervalJam" INTEGER,
    "auditorEmail" TEXT,
    "notifyOnComplete" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Temuan" (
    "id" SERIAL NOT NULL,
    "findingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "description" TEXT NOT NULL,
    "remediation" TEXT NOT NULL,
    "cwe" TEXT,
    "asvsRef" TEXT,
    "dibuatPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetId" TEXT NOT NULL,

    CONSTRAINT "Temuan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Target_targetUrl_key" ON "Target"("targetUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Temuan_targetId_findingId_key" ON "Temuan"("targetId", "findingId");

-- AddForeignKey
ALTER TABLE "Temuan" ADD CONSTRAINT "Temuan_targetId_fkey" 
FOREIGN KEY ("targetId") REFERENCES "Target"("id") 
ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

### C. Inspeksi Struktur Tabel Langsung dari `psql` (`\d "Temuan"`)

Keluaran terminal eksekusi `docker exec pg-praktikum psql -U praktikum -d produk -c '\d "Temuan"'`:

```text
                                           Table "public.Temuan"
   Column    |              Type              | Collation | Nullable |               Default                
-------------+--------------------------------+-----------+----------+--------------------------------------
 id          | integer                        |           | not null | nextval('"Temuan_id_seq"'::regclass)
 findingId   | text                           |           | not null | 
 title       | text                           |           | not null | 
 category    | text                           |           | not null | 
 severity    | "Severity"                     |           | not null | 
 description | text                           |           | not null | 
 remediation | text                           |           | not null | 
 cwe         | text                           |           |          | 
 asvsRef     | text                           |           |          | 
 dibuatPada  | timestamp(3) without time zone |           | not null | CURRENT_TIMESTAMP
 targetId    | text                           |           | not null | 
Indexes:
    "Temuan_pkey" PRIMARY KEY, btree (id)
    "Temuan_targetId_findingId_key" UNIQUE, btree ("targetId", "findingId")
Foreign-key constraints:
    "Temuan_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"(id) ON UPDATE CASCADE ON DELETE RESTRICT
```

---

## 3. Seed dan Prisma Client

### A. Eksekusi `npx prisma db seed` Dua Kali (Bukti Idempotensi)

Skrip `prisma/seed.ts` menggunakan operasi `.upsert()` bertingkat. Berikut adalah bukti eksekusi berturut-turut pada terminal:

```text
# Eksekusi Pertama:
$ npx prisma db seed
Loaded Prisma config from prisma.config.ts.
Running seed command `tsx prisma/seed.ts` ...
Seed selesai: 6 target, 8 temuan
The seed command has been executed.

# Eksekusi Kedua:
$ npx prisma db seed
Loaded Prisma config from prisma.config.ts.
Running seed command `tsx prisma/seed.ts` ...
Seed selesai: 6 target, 8 temuan
The seed command has been executed.
```

> **Analisis Idempotensi:**  
> Pada eksekusi kedua, metode `.upsert()` mencari data berdasarkan klausa `where` (`targetUrl` untuk Target, dan unik gabungan `targetId_findingId` untuk Temuan). Karena baris sudah ada, Prisma menjalankan blok `update: {}` (no-op) tanpa menambahkan baris baru dan tanpa menimbulkan galat `P2002`.

---

### B. Alasan `seed.ts` Tidak Boleh Mengimpor `lib/prisma.ts`

1. **Directif `import "server-only"`**:  
   Modul [`lib/prisma.ts`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/lib/prisma.ts) diproteksi dengan direktif `server-only` agar tidak pernah terkirim ke bundel browser Next.js. Namun, `seed.ts` dieksekusi secara mandiri di luar lingkungan Next.js melalui runtime `tsx` (`node`). Jika `seed.ts` mengimpor `lib/prisma.ts`, eksekusi skrip akan langsung gagal melempar galat resolusi `server-only`.
2. **Kemandirian Koneksi & Lifecycle**:  
   Skrip seed memerlukan instans `PrismaClient` yang mandiri dengan koneksi langsung via adapter `@prisma/adapter-pg`, membaca variabel `.env` via `dotenv/config`, serta menutup koneksi secara bersih di akhir eksekusi menggunakan `prisma.$disconnect()`.

---

## 4. Operasi CRUD

### A. Tabel Matriks Operasi CRUD

| Entitas | Aksi / Halaman | Metode Prisma Client | Penanganan Galat Prisma | Umpan Balik Pengguna |
| :--- | :--- | :--- | :--- | :--- |
| **`Target`** | Tambah Target (`/scan` & `/target`) | `prisma.target.create()` | `P2002` (Unique Constraint `targetUrl`) | *"Endpoint target ini sudah terdaftar dalam antrean audit aktif"* |
| **`Target`** | Ubah Catatan (`/target/[id]`) | `prisma.target.update()` | `P2025` (Record Not Found)<br>`P2002` (Unique URL) | *"Target tidak ditemukan atau sudah dihapus"*<br>*"Endpoint target sudah terdaftar"* |
| **`Temuan`** | Tambah Temuan (`/target/[id]`) | `prisma.temuan.create()` | `P2002` (Unik `targetId, findingId`)<br>`P2003` (Foreign Key Failed) | *"Kode temuan ini sudah tercatat pada target ini"*<br>*"Target tidak ditemukan"* |
| **`Temuan`** | Ubah Temuan (`/target/[id]`) | `prisma.temuan.update()` | `P2002` (Unik findingId)<br>`P2025` (Temuan Not Found) | *"Kode temuan ini sudah tercatat"*<br>*"Temuan tidak ditemukan"* |
| **`Temuan`** | Hapus Temuan (`/target/[id]`) | `prisma.temuan.deleteMany()` | Menghapus berdasar `id` dan `targetId` | Temuan terhapus instan dari daftar |
| **`Target`** | Hapus Target (`/target/[id]`) | `prisma.$transaction([deleteMany, delete])` | Menolak hapus tanpa transaksi (`RESTRICT`) | Target beserta seluruh temuannya terhapus atomik |

---

## 5. Transaksi dan Rollback

### A. Galat Saat Menghapus Tanpa Transaksi (`ON DELETE RESTRICT`)

Ketika target audit yang memiliki temuan dihapus secara langsung tanpa menghapus anak terlebih dahulu (`await prisma.target.delete({ where: { id } })`), PostgreSQL secara tegas menolak perintah dan melempar exception:

```text
PrismaClientKnownRequestError: 
Invalid `prisma.target.delete()` invocation:
Foreign key constraint violated on the constraint: `Temuan_targetId_fkey`
  code: 'P2003',
  meta: {
    modelName: 'Target',
    driverAdapterError: DriverAdapterError: ForeignKeyConstraintViolation
  }
```

---

### B. Bukti Rollback Sebelum dan Sesudah Pengujian

Pada pengujian rollback (Skenario 8), perintah kedua dalam transaksi sengaja digagalkan dengan mencari ID fiktif yang tidak ada (`scan-2026-999-fiktif`):

```typescript
await prisma.$transaction([
  prisma.temuan.deleteMany({ where: { targetId: testTargetId } }), // Perintah 1: Berhasil di memori transaksi
  prisma.target.delete({ where: { id: "scan-2026-999-fiktif" } }), // Perintah 2: Sengaja gagal P2025
]);
```

**Hasil Verifikasi Database PostgreSQL:**
* Jumlah temuan sebelum transaksi: **2 baris**.
* Eksekusi transaksi: Perintah kedua gagal dengan kode `P2025`.
* Jumlah temuan sesudah transaksi dibatalkan: **2 baris** (`SELECT COUNT(*) FROM "Temuan" WHERE "targetId" = 'scan-2026-901'` $\rightarrow$ **tetap 2**).

> **Kesimpulan:** Transaksi terbukti atomik secara *all-or-nothing*. Kegagalan pada perintah kedua membatalkan eksekusi `deleteMany` pada perintah pertama, sehingga integritas data temuan tetap aman dari penghapusan parsial.

---

## 6. Skenario Uji

Hasil pengujian otomatis 10 kasus uji pada [`test/crud-modul6.test.ts`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/test/crud-modul6.test.ts) dieksekusi menggunakan test runner native Node.js (`node:test`) dan `tsx`:

```bash
npm run test:modul6
```

| No | Skenario Uji | Tindakan / Parameter | Hasil yang Diharapkan | Hasil Aktual | Status |
| :-: | :--- | :--- | :--- | :--- | :-: |
| 1 | **Tambah target sah** | Mengirimkan form target valid lengkap dengan Zod | Validasi lolos, tersimpan di PostgreSQL | Target tersimpan dengan ID `scan-2026-901` | **PASS** |
| 2 | **Tambah target URL duplikat** | Mengirim targetUrl yang sama dua kali | Ditolak oleh constraint unik `Target_targetUrl_key` (P2002) | Melempar `P2002`, ditangkap & ditampilkan ramah | **PASS** |
| 3 | **Tambah target URL salah** | Input `targetUrl: "bukan-sebuah-url"` | Dicegat oleh Zod sebelum menyentuh Prisma | Form invalid, tidak ada kueri ke basis data | **PASS** |
| 4 | **Ubah notes sebuah target** | Update notes target menjadi *"Diperiksa ulang 30 Okt 2026"* | Berhasil update dan tersimpan di database | Nilai kolom `notes` berubah di PostgreSQL | **PASS** |
| 5 | **Ubah target yang tidak ada** | Update pada ID target fiktif `scan-2026-999` | Melempar galat `P2025` (Record not found) | Ditangkap dan menghasilkan pesan ramah | **PASS** |
| 6 | **Validasi regex format ID** | Akses format ID acak `scan-abc` | Ditolak pola regex `/^scan-\d{4}-\d{3}$/` $\rightarrow$ `notFound()` | Menolak format ID acak, memicu 404 | **PASS** |
| 7 | **Hapus target bersih (transaksi)** | Hapus target beserta 2 temuan via `prisma.$transaction` | Temuan anak dan target induk terhapus bersih | Target dan 2 temuannya terhapus tuntas | **PASS** |
| 8 | **Uji rollback transaksi** | Perintah kedua sengaja digagalkan ID palsu | Transaksi dibatalkan, temuan tetap utuh | Jumlah temuan tetap 2 (Rollback terbukti) | **PASS** |
| 9 | **Unik gabungan temuan** | Tambah temuan dengan `findingId: "FIND-01"` duplikat pada target yang sama | Ditolak oleh `@@unique([targetId, findingId])` (P2002) | Melempar `P2002`, dicegah duplikasi kode temuan | **PASS** |
| 10 | **Pelanggaran Foreign Key** | Tambah temuan dengan `targetId: "scan-2026-nonexistent"` | Ditolak oleh constraint `Temuan_targetId_fkey` (P2003) | Melempar `P2003` (Foreign key constraint violated) | **PASS** |

> **Persentase Kelulusan:** $\frac{10}{10} \times 100\% = \mathbf{100\%}$ *(Melampaui ambang batas kelulusan $\ge 90\%$)*.

---

## 7. Kendala dan Penyelesaian

1. **Jebakan Prisma 7 Pemisahan Perintah**:  
   * *Kendala:* Pada versi Prisma lama, perintah `migrate dev` otomatis menjalankan `generate` dan `seed`. Pada Prisma 7, perilaku tersebut dihilangkan.  
   * *Penyelesaian:* Selalu menjalankan tiga perintah secara eksplisit dan berurutan: `npx prisma migrate dev`, disusul `npx prisma generate`, dan diakhiri `npx prisma db seed`.
2. **Karakter Tanda Hubung pada Enum**:  
   * *Kendala:* Nilai cakupan audit `"ssl-only"` memuat tanda hubung (*hyphen*) yang dilarang sebagai pengenal enum native di Prisma tanpa *mapping layer*.  
   * *Penyelesaian:* Kolom `auditScope` dan `asvsLevel` dipertahankan sebagai tipe `String` di Prisma, sedangkan validasi nilai legal tetap dijaga ketat oleh deklarasi `z.enum` Zod 4.
3. **Pemberian ID String Non-Autoincrement**:  
   * *Kendala:* Berbeda dengan modul acuan yang memakai integer serial, model `Target` mempertahankan ID string publik `scan-YYYY-NNN`. Akibatnya, operasi `create` dan `seed` wajib menyediakan ID secara eksplisit.  
   * *Penyelesaian:* Menghitung jumlah record dengan `prisma.target.count()` di Server Action sebelum pembuatan ID baru `scan-2026-${String(count + 1).padStart(3, "0")}`.

---

## 8. Catatan Pemanfaatan AI

* **Alat yang Digunakan:** Antigravity AI Assistant (Google DeepMind Gemini 3.8 Flash).
* **Perintah Utama:**
  * Validasi keselarasan skema dua entitas dengan data domain *Tripleemat Security Assessor*.
  * Penyusunan skrip seed idempoten bertingkat `.upsert()` pada `prisma/seed.ts`.
  * Pembentukan suite pengujian otomatis 10 kasus uji pada `test/crud-modul6.test.ts`.
* **Bagian yang Dikerjakan dengan Bantuan AI:**
  * Penulisan skema relasional `Target` dan `Temuan` di `prisma/schema.prisma`.
  * Pembuatan Server Action transaksi atomik di `app/target/actions.ts` dan `app/target/temuan-actions.ts`.
  * Integrasi data access layer `lib/data.ts` berbasis Prisma Client 7.
* **Cara Memverifikasi Mandiri:**
  * Menjalankan kueri SQL langsung ke database PostgreSQL 18 di dalam container via `docker exec -it pg-praktikum psql` untuk memverifikasi foreign key constraint `ON DELETE RESTRICT` dan indeks unik.
  * Menjalankan runner pengujian otomatis `npm run test:modul6` (seluruh 10 skenario lulus 100%).
  * Memverifikasi tipe data statis dengan `npx tsc --noEmit` (0 error) dan validasi linter dengan `npm run lint` (0 warning, 0 error).
