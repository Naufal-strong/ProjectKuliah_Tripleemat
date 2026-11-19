# Dokumen Teknis Modul 7 — Debugging dan Telaah Kode

**Nama/NIM :** Naufal Fakhrianto Nugroho / 105224026  
**Repositori :** https://github.com/Naufal-strong/ProjectKuliah_Tripleemat  
**Pull request :** https://github.com/Naufal-strong/ProjectKuliah_Tripleemat/pull/9  
**Branch Kerja :** `Week&Docs7`  
**Entitas Produk :** Target Audit Keamanan (`Target`) & Temuan Kerentanan (`Temuan`) — *Tripleemat Security Assessor*  

---

## 1. Lingkungan dan Konfigurasi Debugger

### A. Rincian Versi dan Lingkungan Eksekusi
* **Node.js :** `v26.7.0` (LTS Runtime)
* **Next.js :** `16.4.0` (App Router dengan Server Actions)
* **Prisma ORM :** `7.10.1` (`@prisma/client` & `@prisma/adapter-pg`)
* **Basis Data :** PostgreSQL 18.6 (Docker Container `pg-praktikum`)
* **Peramban :** Google Chrome 133.0 (x64 Windows)
* **Hash Commit Awal :** `6d79ea6` (*Merge pull request #8 from Naufal-strong/feature/sec-0.2-hardening-and-access*)

---

### B. Konfigurasi Debugger VS Code (`.vscode/launch.json`)

Berkas [`.vscode/launch.json`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/.vscode/launch.json) dikonfigurasi dengan tiga target penelusuran standar industri:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev -- --inspect"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithChrome",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}
```

#### Penjelasan Konfigurasi:
1. **`Next.js: debug server-side` (Tipe `node-terminal`):**  
   Meneruskan flag `--inspect` ke proses runtime Node.js Next.js. VS Code secara otomatis menyambungkan (*auto-attach*) debugger ke port default `9229`. Mode ini paling efisien untuk melacak logika pada Server Component, validasi masukan Zod, dan Server Actions (`app/target/actions.ts`).
2. **`Next.js: debug client-side` (Tipe `chrome`):**  
   Membuka peramban Google Chrome dengan Remote Debugging aktif untuk menelusuri interaksi React Client Component (`"use client"`), *event handler* formulir, dan inspeksi DOM/Console.
3. **`Next.js: debug full stack` (Tipe `node` + `serverReadyAction`):**  
   Meluncurkan server Next.js melalui binary `next` dan secara otomatis memicu peluncuran Chrome saat server siap menerima koneksi (pola regex `- Local:.+(https?://.+)`), memungkinkan penelusuran terpadu ujung-ke-ujung (*end-to-end*).

---

### C. Konfigurasi Log Kueri Prisma (`lib/prisma.ts`)

Untuk memantau setiap query SQL mentah yang dieksekusi oleh Prisma Client ke PostgreSQL, opsi `log: ["query", "warn", "error"]` diaktifkan pada lingkungan pengembangan (*development*):

```typescript
// lib/prisma.ts
import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalUntukPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma =
  globalUntukPrisma.prisma ??
  new PrismaClient({
    adapter,
    // Modul 7: Tampilkan setiap query SQL di terminal saat sesi debugging
    log: ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalUntukPrisma.prisma = prisma;
}
```

---

### D. Verifikasi Debugger Berhenti di Server Component

Saat breakpoint dipasang pada Server Component `app/target/page.tsx` pada baris pengambilan data target:
```typescript
// app/target/page.tsx (baris 12)
const targets = await prisma.target.findMany({ ... });
```
1. **Call Stack:** Menampilkan frame eksekusi server: `DaftarTargetPage` $\rightarrow$ `ServerComponentWrapper` $\rightarrow$ runtime internal Next.js `node:internal`.
2. **Variables Scope:**
   - `Local`: Memperlihatkan variabel `searchParams: {}`, `context: {}`.
   - `Closure`: Berisi referensi `prisma` client aktif.
3. **Debug Console:** Evaluasi ekspresi `await prisma.target.count()` langsung mengembalikan jumlah baris aktual di database.
4. **Log Terminal:** Menampilkan kueri SQL Prisma yang dieksekusi secara instan:
   ```text
   prisma:query SELECT "public"."Target"."id", "public"."Target"."label", "public"."Target"."targetUrl", "public"."Target"."asvsLevel" FROM "public"."Target" WHERE 1=1 ORDER BY "public"."Target"."dibuatPada" DESC
   ```

---

## 2. Daftar Galat

Ringkasan 4 galat yang ditemukan, direproduksi, diisolasi akar penyebabnya, dan diperbaiki:

| No | Issue | Gejala | Lapisan | Akar Penyebab | Commit Perbaikan |
| :-: | :--- | :--- | :--- | :--- | :--- |
| **1** | **#11** | Status boolean ketersediaan/notifikasi (`notifyOnComplete`) tidak pernah berubah menjadi `false` meskipun dipilih *"Tidak aktif / false"* | Server (Validasi Masukan Zod) | `z.coerce.boolean()` memanggil `Boolean(input)` bawaan JS; setiap string non-kosong termasuk `"false"` selalu bernilai truthy (`true`) | `fix(target): status notifyOnComplete selalu true akibat z.coerce.boolean (#11)` |
| **2** | **#12** | Halaman detail tidak berpindah ke `/target` setelah penghapusan, log mencetak *"Gagal menghapus"*, padahal data terhapus | Server (Server Action Next.js) | Fungsi `redirect()` melempar kontrol galat khusus `NEXT_REDIRECT` yang tertangkap oleh blok `catch (e)` umum | `fix(target): redirect tertelan dalam blok try-catch pada hapusTarget (#12)` |
| **3** | **#13** | Menghapus target yang memiliki temuan kerentanan gagal diam-diam tanpa pesan ke pengguna; data tetap ada | Basis Data (Prisma ORM & PostgreSQL) | Pelanggaran Foreign Key `onDelete: Restrict` (`P2003`) ditelan oleh blok `catch` kosong / umum tanpa penjelasan ke pengguna | `fix(target): tangani transaksi atomik hapus target berelasi dan eliminasi penelanan galat P2003 (#13)` |
| **4** | **#14** | Penghitung sisa karakter catatan temuan tidak berubah berapa pun karakter yang diketik di textarea | Peramban (Client Component React) | State `sisa` dikelola dengan `useState` dan disinkronkan via `useEffect` dengan larik dependensi kosong `[]` | `fix(temuan): sisa karakter dihitung langsung sebagai nilai turunan saat render (#14)` |

---

## 3. Catatan Penelusuran (Deep-Dive Bug Investigation)

---

### A. Galat 1 (Issue #11): Status Boolean Selalu Bernilai True Akibat Coercion

#### 1. Langkah Reproduksi
1. Jalankan sesi debug: pilih konfigurasi `"Next.js: debug server-side"` di VS Code (`F5`).
2. Buka halaman ubah target di peramban: `http://localhost:3000/target/scan-2026-001`.
3. Pada elemen select **Notifikasi Selesai**, ubah pilihan dari *"Aktif (true)"* menjadi *"Tidak aktif (false)"*.
4. Klik tombol **"Simpan Perubahan"**.
5. Buka kembali halaman detail target `/target/scan-2026-001`.
* **Hasil yang Diharapkan:** Nilai notifikasi berubah menjadi *"Tidak aktif"* (`false`).
* **Hasil Aktual:** Status notifikasi tetap bernilai *"Aktif"* (`true`); pesan toast *"Perubahan disimpan"* tetap muncul.
* **Frekuensi Terjadi:** 5 dari 5 percobaan (100%).

#### 2. Bukti Sebelum Perbaikan
* **Tab Network DevTools:** Payload form mengirimkan: `notifyOnComplete: "false"`. Peramban sudah mengirim data string yang benar.
* **Debug Console & Variables Panel (VS Code):**
  Evaluasi ekspresi pada breakpoint baris eksekusi Server Action:
  ```text
  > Object.fromEntries(formData)
  { label: 'Audit Siakad', notifyOnComplete: 'false' }
  > hasil.data.notifyOnComplete
  true
  > Boolean("false")
  true
  > Boolean("")
  false
  ```

#### 3. Akar Penyebab & Perbaikan Kode
* **Akar Penyebab:** Kode validasi usulan AI menggunakan `z.coerce.boolean()`. Berdasarkan spesifikasi ECMAScript (ECMA-262 Bagian 7.1.2: `ToBoolean`), operasi konversi string hanya menghasilkan `false` jika string berpanjang 0 (`""`). String `"false"` berpanjang 5 karakter sehingga dievaluasi menjadi `true`.
* **Perbaikan Kode (`lib/skema.ts`):**

```typescript
// SEBELUM (Salah - Usulan AI):
export const skemaTarget = z.object({
  label: z.string().trim().min(3),
  targetUrl: z.string().url(),
  notifyOnComplete: z.coerce.boolean(), // <-- Menghasilkan true untuk string "false"
});

// SESUDAH (Benar - Perbaikan):
import { z } from "zod";

export const skemaTarget = z.object({
  label: z.string().trim().min(3, "Label target minimal 3 karakter"),
  targetUrl: z.string().url("Format URL target tidak valid"),
  // z.stringbool() memetakan string "true" -> true, "false" -> false, dan menolak nilai lain
  notifyOnComplete: z.stringbool(),
});
```

#### 4. Bukti Sesudah Perbaikan
Langkah reproduksi diulang sebanyak 5 kali. Saat memilih *"Tidak aktif"*, objek `hasil.data.notifyOnComplete` kini menghasilkan nilai `false`, kueri SQL Prisma memperbarui kolom basis data menjadi `FALSE`, dan antarmuka kartu target menampilkan status *"Tidak aktif"* pada 5 dari 5 percobaan.

---

### B. Galat 2 (Issue #12): Fungsi `redirect()` Tertelan dalam Blok `try/catch`

#### 1. Langkah Reproduksi
1. Masuk ke halaman detail target yang **tidak memiliki temuan kerentanan** (misal `/target/scan-2026-004`).
2. Klik tombol merah **"Hapus Target"**.
3. Amati respons antarmuka dan terminal.
* **Hasil yang Diharapkan:** Target terhapus dan halaman langsung dialihkan (*redirect*) kembali ke daftar utama `/target`.
* **Hasil Aktual:** Halaman tidak berpindah URL sama sekali; muncul notifikasi galat merah di UI *"Gagal menghapus target"*; namun saat halaman `/target` dibuka manual di tab lain, target sebenarnya sudah terhapus dari basis data.
* **Frekuensi Terjadi:** 5 dari 5 percobaan (100%).

#### 2. Bukti Sebelum Perbaikan
Breakpoint dipasang pada baris `catch (e)` di Server Action `hapusTargetAction`. Panel Variables dan Debug Console memperlihatkan objek `e`:
```text
> e.message
'NEXT_REDIRECT'
> e.digest
'NEXT_REDIRECT;replace;/target;307;'
> typeof e
'object'
```
*Panel Call Stack:* `hapusTargetAction` di `app/target/actions.ts:28`.

#### 3. Akar Penyebab & Perbaikan Kode
* **Akar Penyebab:** Di Next.js App Router, fungsi navigasi `redirect()` bekerja dengan **sengaja melempar galat khusus internal** bertipe `NEXT_REDIRECT` (membawa digest HTTP 307/303). Jika `redirect()` dipanggil di dalam blok `try { ... }`, blok `catch (e)` akan menangkap pengecualian ini sebagai error tak terduga, menelan proses navigasi, dan mencetak kegagalan semu.
* **Perbaikan Kode (`app/target/actions.ts`):**

```typescript
// SEBELUM (Salah - Usulan AI):
export async function hapusTargetAction(id: string) {
  try {
    await prisma.target.delete({ where: { id } });
    revalidatePath("/target");
    redirect("/target"); // <-- Melempar NEXT_REDIRECT dan tertangkap catch di bawah!
  } catch (e) {
    console.log("Gagal menghapus");
    return { error: "Gagal menghapus target" };
  }
}

// SESUDAH (Benar - Perbaikan):
export async function hapusTargetAction(id: string) {
  try {
    await prisma.target.delete({ where: { id } });
    revalidatePath("/target");
  } catch (e) {
    // Galat database nyata ditangani di sini
    return { error: "Terjadi kesalahan saat menghapus data di database" };
  }

  // Pemanggilan redirect WAJIB berada di luar blok try/catch!
  redirect("/target");
}
```

#### 4. Bukti Sesudah Perbaikan
Langkah reproduksi diulang 5 kali pada target tanpa temuan. Setelah tombol klik ditekan, peramban seketika menerima respons HTTP 303/307 dan mulus berpindah ke rute `/target` tanpa pesan galat palsu pada 5 dari 5 pengujian.

---

### C. Galat 3 (Issue #13): Hapus Target Berelasi Gagal Diam-diam (Prisma `P2003`)

#### 1. Langkah Reproduksi
1. Buka target audit yang **memiliki bukti temuan kerentanan** (misal `scan-2026-001` yang memiliki 2 temuan kerentanan).
2. Klik tombol **"Hapus Target"**.
3. Amati terminal server dan status basis data.
* **Hasil yang Diharapkan:** Muncul pesan konfirmasi yang jelas bahwa target tidak dapat dihapus karena memiliki temuan, ATAU sistem menghapus target beserta seluruh temuan anaknya secara atomik.
* **Hasil Aktual:** Tombol loading berhenti, antarmuka tidak menampilkan perubahan apa pun, data target dan temuan tetap utuh di basis data, dan terminal server hanya mencetak satu baris teks generik: `"Gagal menghapus"` (galat ditelan mentah-mentah).
* **Frekuensi Terjadi:** 5 dari 5 percobaan (100%).

#### 2. Bukti Sebelum Perbaikan
Mengganti sementara `console.log("Gagal menghapus")` menjadi `console.error(e)`. Terminal server langsung memuntahkan stack trace Prisma:
```text
PrismaClientKnownRequestError: 
Invalid `prisma.target.delete()` invocation in
.../app/target/actions.ts:25:21

Foreign key constraint violated on the constraint: `Temuan_targetId_fkey`
  code: 'P2003',
  clientVersion: '7.10.1',
  meta: {
    modelName: 'Target',
    driverAdapterError: DriverAdapterError: ForeignKeyConstraintViolation
  }
  at async hapusTargetAction (.../app/target/actions.ts:25:5)
```

#### 3. Akar Penyebab & Perbaikan Kode
* **Akar Penyebab:** Integritas referensial PostgreSQL pada skema `prisma/schema.prisma` menerapkan aturan `onDelete: Restrict` demi melindungi jejak bukti audit (*audit trail*). Operasi `prisma.target.delete()` langsung ditolak oleh PostgreSQL dengan kode galat `P2003`. Karena kode asisten AI sebelumnya menelan objek galat tanpa logging rincian (`console.log("Gagal menghapus")`), pengembang kehilangan visibilitas masalah (tergolong kerentanan *OWASP Top 10:2025 A10 - Mishandling of Exceptional Conditions*).
* **Perbaikan Kode (`app/target/actions.ts`):**

```typescript
// PERBAIKAN DENGAN TRANSAKSI ATOMIK PRISMA (All-or-Nothing):
export async function hapusTargetAction(id: string) {
  try {
    // Keputusan Produk: Temuan anak ikut dihapus bersama target induknya
    // dalam satu transaksi database atomik agar tidak meninggalkan data yatim (orphan)
    await prisma.$transaction([
      prisma.temuan.deleteMany({ where: { targetId: id } }),
      prisma.target.delete({ where: { id } }),
    ]);
    
    revalidatePath("/target");
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      // Diteruskan jika data target sudah terhapus oleh auditor lain
      throw err;
    }
    console.error("[ERROR HAPUS TARGET]", err);
    return { error: "Gagal memproses penghapusan data audit dan bukti temuan." };
  }

  redirect("/target");
}
```

#### 4. Bukti Sesudah Perbaikan
Langkah reproduksi diulang 5 kali pada target audit yang memiliki temuan. Seluruh temuan anak dan target induk berhasil terhapus secara atomik dari tabel `Temuan` dan `Target` dalam satu transaksi PostgreSQL. Ketika diuji tab ganda (target sudah terhapus di tab 1 lalu diklik di tab 2), sistem menangkap galat `P2025` dan menampilkannya secara ramah via `app/target/[id]/error.tsx`.

---

### D. Galat 4 (Issue #14): Penghitung Sisa Karakter Ulasan/Catatan Macet

#### 1. Langkah Reproduksi
1. Buka halaman target audit pada bagian formulir tambah temuan / ulasan audit (`FormUbahTemuan` atau `FormTemuan`).
2. Perhatikan indikator teks *"280 karakter tersisa"*.
3. Ketikkan kalimat audit sepanjang 20 karakter di dalam kotak `textarea`.
* **Hasil yang Diharapkan:** Teks indikator berkurang secara dinamis menjadi *"260 karakter tersisa"*.
* **Hasil Aktual:** Teks indikator tetap macet menampilkan *"280 karakter tersisa"*.
* **Frekuensi Terjadi:** 5 dari 5 percobaan (100%).

#### 2. Bukti Sebelum Perbaikan
* **React Developer Tools (Tab Components):** Memilih komponen `FormUbahTemuan` / `FormUlasan`:
  - Nilai State 1 (`isi`): Berubah mengikuti setiap ketikan keyboard (misal `"Temuan SQL Injection"`).
  - Nilai State 2 (`sisa`): Tetap bernilai `280` (tidak pernah ter-update).
* **Tab Sources (Chrome DevTools):** Memasang breakpoint di dalam fungsi `useEffect`. Breakpoint hanya tersentuh tepat 1 kali saat komponen pertama kali dipasang (*mount*), dan tidak pernah tersentuh kembali saat pengguna mengetik.

#### 3. Akar Penyebab & Perbaikan Kode
* **Akar Penyebab:** Kode usulan AI mendefinisikan state lokal redundan `const [sisa, setSisa] = useState(280)` dan memperbaruinya melalui `useEffect(() => { setSisa(280 - isi.length) }, [])`. Karena array dependensi diberikan tanda kosong `[]`, effect tidak pernah dijalankan ulang ketika variabel `isi` berubah. Ini merupakan *anti-pattern* pengelolaan state React.
* **Perbaikan Kode (`components/FormUbahTemuan.tsx`):**

```typescript
// SEBELUM (Salah - Usulan AI):
const [isi, setIsi] = useState("");
const [sisa, setSisa] = useState(280);

useEffect(() => {
  setSisa(280 - isi.length);
}, []); // <-- Larik dependensi kosong menyebabkan sisa tidak pernah dihitung ulang!

// SESUDAH (Benar - Perbaikan Nilai Turunan / Derived State):
const [isi, setIsi] = useState("");
// Nilai turunan dihitung langsung secara deklaratif pada setiap siklus render
const sisa = 280 - isi.length;
// Tanpa useEffect, tanpa useState tambahan, 0 risiko desinkronisasi state!
```

#### 4. Bukti Sesudah Perbaikan
Mengetik string 20 karakter langsung memperbarui teks menjadi *"260 karakter tersisa"* secara seketika (*instant*). Pengujian linter `npm run lint` dan pemeriksa tipe `npx tsc --noEmit` lulus bersih dengan 0 peringatan (*warning*) dan 0 galat (*error*).

---

## 4. Keputusan Teknis

### A. `z.stringbool()` Dibanding Alternatif Lain
* **Alternatif 1 (`z.coerce.boolean()`):** Sangat berbahaya untuk form HTML karena memanggil `Boolean(val)`. String `"false"` dikonversi menjadi `true`.
* **Alternatif 2 (`z.preprocess()` kustom):** Membutuhkan fungsi parser kustom bertingkat (mengecek string `"true"`, `"false"`, `"0"`, `"1"`), yang menambah boilerplate kode dan rawan kesalahan pemeliharaan.
* **Keputusan Terpilih (`z.stringbool()`):** Merupakan fitur bawaan standar Zod 4. Secara ketat hanya menerima string literal `"true"` (menjadi boolean `true`) dan `"false"` (menjadi boolean `false`), serta menolak string acak lain dengan pesan validasi yang jelas. Pendekatan ini paling ringkas, deklaratif, dan aman dari kerentanan *type confusion*.

---

### B. Aturan Hapus Data Berelasi: Transaksi Atomik vs Cascade vs Tolak
* **Alternatif 1 (`onDelete: Cascade` di Level Database):** Otomatis menghapus seluruh temuan anak saat target dihapus. Namun, pada aplikasi keamanan siber (*Tripleemat Security Assessor*), bukti kerentanan adalah artefak penting kepatuhan (*compliance audit trail*). Penghapusan cascade berisiko tinggi melenyapkan riwayat audit tanpa disengaja.
* **Alternatif 2 (Menolak Penghapusan Secara Mutlak):** Memaksa pengguna menghapus temuan satu per satu secara manual. Hal ini memperburuk pengalaman pengguna (*user experience*) jika target memiliki puluhan temuan kerentanan.
* **Keputusan Terpilih (Transaksi Atomik `prisma.$transaction`):** Mempertahankan constraint `onDelete: Restrict` di database PostgreSQL, namun menyediakan operasi penghapusan sadar melalui Server Action yang membungkus `prisma.temuan.deleteMany` dan `prisma.target.delete` dalam satu transaksi atomik. Jika salah satu query gagal, seluruh operasi di-rollback secara otomatis (*all-or-nothing*).

---

### C. Nilai Turunan (*Derived State*) Saat Render Dibanding `useEffect`
* **Mengapa Menghindari `useEffect` untuk State Turunan:** Menyimpan sisa karakter dalam `useState` terpisah dan menyinkronkannya lewat `useEffect` menghasilkan:
  1. *Double rendering:* Render pertama dengan sisa karakter lama, disusul render kedua setelah effect berjalan.
  2. Risiko desinkronisasi state (*stale state* / *race condition*).
  3. Peringatan linter `react-hooks/exhaustive-deps`.
* **Keputusan Terpilih:** Menghitung sisa karakter secara langsung pada saat render: `const sisa = 280 - isi.length;`. Sesuai dengan panduan resmi dokumentasi React (*"You Might Not Need an Effect"*), nilai yang dapat dikalkulasi secara murni dari props atau state lain tidak boleh disimpan dalam state tersendiri.

---

### D. Penanganan Galat: Kapan Ditangani di Server Action vs Diteruskan ke `error.tsx`
* **Ditangani di Server Action (Mengembalikan Objek `{ error: string }`):**  
  Digunakan untuk galat yang **dapat dipulihkan (*recoverable errors*)** dan galat ekspektasi pengguna, seperti:
  1. Gagal validasi form (Zod validation errors).
  2. Pelanggaran batasan unik (`P2002`, misalnya URL target sudah pernah didaftarkan).
  3. Masukan field yang tidak lengkap.  
  *Alasan:* Pengguna tidak boleh kehilangan konteks form yang sudah diisi; antarmuka cukup menampilkan pesan error merah lokal di samping field terkait.
* **Diteruskan ke `error.tsx` (Melempar `throw err`):**  
  Digunakan untuk kegagalan fatal yang **tidak dapat dipulihkan (*unrecoverable / exceptional errors*)**, seperti:
  1. Database server down / koneksi jaringan PostgreSQL terputus.
  2. Mencoba mengakses atau menghapus ID target yang sudah lenyap dari database (`P2025`).
  3. Kerusakan data referensial internal tak terduga.  
  *Alasan:* Next.js menyediakan batas kesalahan (*Error Boundary*) `error.tsx` yang secara otomatis mengisolasi komponen yang rusak tanpa menyebabkan seluruh aplikasi *crash*, menyamarkan detail sensitif di lingkungan produksi (`error.digest`), dan menyediakan tombol `retry()` untuk memulihkan segmen halaman.

---

## 5. Telaah Kode (Code Review)

### A. Informasi Peer Review
* **Rekan yang Ditelaah :** Ahmad Zaki (NIM: 105224012)
* **Tautan Pull Request Pasangan :** `https://github.com/ahmadzaki-id/paw-tripleemat/pull/5`
* **Branch yang Direview :** `praktikum/modul-07` menuju `main`
* **Keputusan Telaah :** *Approved with Suggestions* (Disetujui dengan Catatan Perbaikan)

---

### B. Ringkasan Komentar Telaah yang Diberikan

| Baris Kode | Kategori | Identifikasi Masalah | Rekomendasi Perbaikan (Suggestion) |
| :--- | :--- | :--- | :--- |
| **`app/target/actions.ts: L18`** | **Validasi** | Penggunaan `z.coerce.number()` mengubah string kosong `""` menjadi angka `0`, sehingga validasi batas minimum nilai lolos secara keliru. | Tambahkan constraint rentang integer eksplisit: `.int().min(1).max(5)`.<br>```suggestion<br>nilai: z.coerce.number().int().min(1).max(5),<br>``` |
| **`app/target/actions.ts: L45`** | **Kinerja** | Loop `for-of` memanggil kueri Prisma secara sekuensial untuk setiap target (potensi masalah $N+1$ query ke PostgreSQL). | Gunakan relasi eager loading Prisma dalam 1 kali kueri: `prisma.target.findMany({ include: { temuan: true } })`. |
| **`app/target/actions.ts: L72`** | **Penanganan Galat** | Fungsi `redirect()` diletakkan di dalam blok `try { ... } catch`, menyebabkan navigasi terhenti akibat pengecualian `NEXT_REDIRECT`. | Pindahkan fungsi `redirect("/target")` ke baris paling bawah di luar blok `try/catch`. |
| **`components/FormTemuan.tsx: L9`** | **Keterbacaan** | *Nit:* Nama parameter `d` pada fungsi transformer data kurang deskriptif dan menyulitkan pembacaan kode. | Usulkan mengganti nama variabel menjadi `dataTemuan` atau `payloadForm`. |

---

### C. Ringkasan Umpan Balik yang Diterima dan Tindak Lanjut

1. **Umpan Balik dari Pasangan:**  
   *"Pada berkas `app/target/actions.ts`, penanganan galat P2002 sebaiknya memeriksa `err.meta.target` secara spesifik agar pengguna tahu apakah duplikasi terjadi pada kolom `targetUrl` atau pada kombinasi kode temuan `findingId`."*
   - **Tanggapan & Tindak Lanjut:** **Diterapkan.** Logika `handlePrismaError` diperbarui dengan menginspeksi array properti `err.meta.target` untuk mengembalikan pesan kontekstual spesifik (*"URL Target sudah terdaftar"* vs *"Kode temuan sudah ada pada target ini"*).
2. **Umpan Balik dari Pasangan:**  
   *"Nit: Pada `FormUbahTemuan.tsx`, tambahkan aria-live='polite' pada pesan error validasi agar ramah pembaca layar (screen reader)."*
   - **Tanggapan & Tindak Lanjut:** **Diterapkan.** Atribut aksesibilitas ARIA ditambahkan pada kontainer pesan galat form.

---

## 6. Kendala dan Penyelesaian

1. **Kendala Pemetaan Source Map pada Debugging Server Action:**  
   * *Kendala:* Titik henti (*breakpoint*) pada berkas `app/target/actions.ts` sempat berstatus abu-abu (*Unbound Breakpoint*) saat server Next.js baru dinyalakan.  
   * *Penyelesaian:* Berkas Server Action baru dikompilasi oleh engine Turbopack saat pertama kali diakses. Solusinya adalah memicu permintaan dari peramban satu kali agar berkas dikompilasi, setelah itu breakpoint langsung aktif (*bound*).
2. **Port Inspector Node.js Sibuk (`EADDRINUSE: 127.0.0.1:9229`):**  
   * *Kendala:* Pesan kesalahan `Starting inspector on 127.0.0.1:9229 failed: address already in use` muncul saat memulai ulang sesi debugging.  
   * *Penyelesaian:* Sesi debug sebelumnya masih menggantung di background. Masalah diselesaikan dengan menghentikan sesi debug aktif via `Shift+F5` dan mematikan proses node orphaned sebelum menjalankan ulang.
3. **Pengecualian `NEXT_REDIRECT` yang Tertangkap Blok Catch Global:**  
   * *Kendala:* Menghapus item memicu toast error `"Gagal menghapus"` meskipun data di database berhasil terhapus.  
   * *Penyelesaian:* Mengidentifikasi karakteristik internal Next.js di mana `redirect()` melempar objek error dengan digest khusus, sehingga penempatan `redirect()` dipindahkan ke luar blok `try/catch`.

---

## 7. Catatan Pemanfaatan AI

* **Alat AI yang Digunakan :** Antigravity AI Assistant (Google DeepMind Gemini 3.8 Flash).
* **Perintah Utama :**
  1. *"Studi kasus Modul 7 Praktikum PAW: susun langkah reproduksi sistematis dan analisis akar penyebab 4 galat klasik Next.js, Prisma, Zod, dan React."*
  2. *"Bantu formulasikan konfigurasi launch.json VS Code terpadu untuk server-side dan full-stack debugging."*
  3. *"Identifikasi mengapa Boolean('false') menghasilkan true dan implikasinya pada form HTML & Zod coercion."*
* **Bagian Kode yang Dihasilkan / Ditelusuri Bantuan AI :**
  - Penyusunan skenario 4 issue reproduksi galat (#11 s.d. #14).
  - Skema validasi `z.stringbool()` pada `lib/skema.ts`.
  - Transaksi atomik `prisma.$transaction` dan perbaikan `redirect()` pada `app/target/actions.ts`.
  - Komponen penanganan galat tak terduga `app/target/[id]/error.tsx`.
* **Cara Memverifikasi Mandiri :**
  - **Uji Debugger:** Mengonfirmasi eksekusi berhenti di breakpoint VS Code dan membaca nilai variabel lokal di panel Variables.
  - **Uji Reproduksi:** Menjalankan ulang skenario pengujian pada issue sebanyak 5 kali sebelum dan 5 kali sesudah perbaikan kode (hasil 100% konsisten).
  - **Pemeriksaan Statis:** Menjalankan `npm run lint` (0 error, 0 warning) dan `npx tsc --noEmit` (0 kesalahan kompilasi tipe data).
  - **Uji Regresi Otomatis:** Memastikan 22 unit test kriptografi dan CRUD database pada `npm run test:crypto` tetap lulus 100%.
