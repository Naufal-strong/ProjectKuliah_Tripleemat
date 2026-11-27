# Dokumen Teknis Modul 8 — RESTful API dengan Route Handlers

**Nama/NIM :** Naufal Fakhrianto Nugroho / 105224026  
**Repositori :** https://github.com/Naufal-strong/ProjectKuliah_Tripleemat  
**Entitas Produk :** Target Audit Keamanan (`Target`) & Temuan Kerentanan (`Temuan`) — *Tripleemat Security Assessor*  
**Teknologi :** Next.js 16.4.0 (App Router Route Handlers), Prisma ORM 7.10.1 (`@prisma/adapter-pg`), PostgreSQL 18, Zod 4.6.5, Redocly CLI 2.84.0  

> **Catatan Keamanan & Lingkungan:** Sesuai ketentuan modul, API pada tahap ini belum memiliki lapisan autentikasi (akan ditambahkan pada Modul 10) dan hanya dijalankan pada lingkungan lokal dengan data dummy sintetis. Endpoint mutasi tidak di-deploy ke publik sebelum Modul 10.

---

## 1. Daftar Endpoint

Enam operasi RESTful API dibangun di bawah `/api/v1` untuk entitas utama **`Target`** (`id: String` berformat `scan-YYYY-NNN`) dan entitas berelasinya **`Temuan`** (`targetId` merujuk ke `Target.id`). Metode `PUT` sengaja tidak diekspor sehingga otomatis dijawab `405 Method Not Allowed` oleh Next.js.

*(Catatan: Berkas `docs/kebutuhan.md` belum tersedia pada repositori saat ini, sehingga kolom Kebutuhan memakai kode kebutuhan fungsional `KB-01` s.d. `KB-06` yang dipetakan dari fitur CRUD `Target` & `Temuan` yang sudah berjalan.)*

| No | Metode | Path (`/api/v1`) | Kebutuhan | Deskripsi Singkat | Kode Status yang Mungkin |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/api/v1/target` | `KB-01` | Daftar target audit dengan paginasi (`halaman`, `batas`) dan filter (`auditScope`, `asvsLevel`) | `200`, `400` |
| 2 | `POST` | `/api/v1/target` | `KB-02` | Mendaftarkan target audit baru (`Location` disetel ke URL resource baru) | `201`, `400`, `409`, `422` |
| 3 | `GET` | `/api/v1/target/{id}` | `KB-03` | Mengambil detail satu target audit berdasarkan `id` | `200`, `400`, `404` |
| 4 | `PATCH` | `/api/v1/target/{id}` | `KB-04` | Memperbarui sebagian field target audit | `200`, `400`, `404`, `409`, `422` |
| 5 | `DELETE` | `/api/v1/target/{id}` | `KB-05` | Menghapus target audit yang belum memiliki temuan | `204`, `400`, `404`, `409` |
| 6 | `GET` | `/api/v1/target/{id}/temuan` | `KB-06` | Mengambil daftar temuan kerentanan milik target tertentu | `200`, `400`, `404` |

---

## 2. Implementasi Route Handler dan Validasi

### A. Struktur Folder `app/api/v1` dan Helper `lib/api/problem.ts`

```text
app/api/v1/
└── target/
    ├── route.ts                  # GET (koleksi + paginasi/filter), POST (create + Location)
    └── [id]/
        ├── route.ts              # GET (detail), PATCH (parsial), DELETE (cek relasi)
        └── temuan/
            └── route.ts          # GET (resource bersarang: daftar Temuan milik Target)

lib/api/
└── problem.ts                    # Helper RFC 9457: problem(), galatValidasi(), bacaJson(), bacaId()
```

Isi ringkas [`lib/api/problem.ts`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/lib/api/problem.ts):
* `problem(status, title, extra)`: mengembalikan `Response.json({ type: "about:blank", title, status, ...extra }, { status, headers: { "Content-Type": "application/problem+json" } })`.
* `galatValidasi(error)`: meratakan `z.ZodError` via `z.flattenError(error)` ke respons `422 Unprocessable Content` dengan properti `errors`.
* `bacaJson(request)`: mem-parsing `await request.json()` dan menolak JSON rusak, `null`, atau array/primitif dengan `400 Bad Request`.
* `bacaId(params)`: meng-`await params` (karena di Next.js 15/16 `params` bertipe `Promise<{ id: string }>`) lalu memvalidasi `id` memakai `skemaIdTarget`.

---

### B. Skema Zod yang Dipakai ([`lib/skema/target.ts`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/lib/skema/target.ts))

Aturan field dasar (`skemaLabel`, `skemaTargetUrl`, `skemaAuditScope`, `skemaAsvsLevel`, `skemaIntervalAngka`, `skemaAuditorEmail`, `skemaNotes`) dipisahkan agar dipakai bersama oleh formulir `skemaTarget` (Modul 5–6) dan skema API (Modul 8) tanpa merusak Server Actions lama:
* **Body `POST` (`skemaTargetBaru`):** `label` (3–80), `targetUrl` (URL `http/https` + domain valid, maks 200), `auditScope` (`"standard" | "full" | "ssl-only"`), `asvsLevel` (`"L1" | "L2" | "L3"`), opsional `intervalJam` (int 1–168), `auditorEmail`, `notes` (maks 300), dan `notifyOnComplete` (boolean, default `false`).
* **Body `PATCH` (`skemaTargetUbah`):** seluruh field `.partial()`, dilengkapi `.refine((o) => Object.values(o).some((v) => v !== undefined))` untuk menolak payload kosong `{}`.
* **Parameter Kueri (`skemaKueriTarget`):** `halaman` (`coerce` int $\ge 1$, default `1`), `batas` (`coerce` int $1$–$50$, default `10`), `auditScope` (opsional), `asvsLevel` (opsional).
* **Parameter Path (`skemaIdTarget`):** string sesuai tipe aktual `Target.id` dengan regex `/^scan-\d{4}-\d{3}$/`.

---

### C. Aturan Pemetaan Hasil ke Kode Status

| Kondisi / Sumber Kegagalan | Kode Status | Penanganan di Kode |
| :--- | :---: | :--- |
| Body bukan JSON / bukan objek JSON, parameter kueri invalid (`batas=500`), atau format `[id]` bukan `scan-YYYY-NNN` | **`400`** | `bacaJson()`, `skemaKueriTarget.safeParse()`, atau `bacaId()` $\rightarrow$ `problem(400, "Bad Request", ...)` |
| ID valid secara sintaks, namun baris tidak ditemukan di PostgreSQL (`findUnique` null atau Prisma `P2025`) | **`404`** | `tidakAda(id)` $\rightarrow$ `problem(404, "Not Found", ...)` |
| `DELETE /target/{id}` saat masih ada `Temuan` terkait (`temuan.count > 0` / `P2003`), atau `POST`/`PATCH` dengan `targetUrl` duplikat (`P2002`) | **`409`** | `problem(409, "Conflict", ...)` |
| JSON valid, tetapi isi field gagal validasi Zod (misal `auditScope: "pentest"` atau `PATCH` dengan `{}`) | **`422`** | `galatValidasi(hasil.error)` $\rightarrow$ `problem(422, "Unprocessable Content", ...)` |

---

## 3. Format Galat Problem Details (RFC 9457)

Semua respons galat menggunakan `Content-Type: application/problem+json` tanpa membocorkan stack trace, kueri SQL, atau detail internal Prisma ke klien:

### A. `400 Bad Request` (Body JSON Rusak / Parameter Kueri atau Path Invalid)
```http
HTTP/1.1 400 Bad Request
Content-Type: application/problem+json

{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Parameter kueri tidak valid.",
  "errors": {
    "batas": ["Too big: expected number to be <=50"]
  }
}
```

### B. `404 Not Found` (Target Tidak Ditemukan)
```http
HTTP/1.1 404 Not Found
Content-Type: application/problem+json

{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "Target scan-2026-999 tidak ditemukan."
}
```

### C. `409 Conflict` (Menghapus Target yang Masih Memiliki Temuan)
```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json

{
  "type": "about:blank",
  "title": "Conflict",
  "status": 409,
  "detail": "Target scan-2026-001 masih memiliki 2 temuan."
}
```

### D. `422 Unprocessable Content` (JSON Valid, Isi Melanggar Validasi Zod)
```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "about:blank",
  "title": "Unprocessable Content",
  "status": 422,
  "detail": "Data tidak lolos validasi.",
  "errors": {
    "label": ["Nama target minimal 3 karakter"],
    "auditScope": ["Pilih salah satu cakupan audit"],
    "asvsLevel": ["Pilih level verifikasi OWASP ASVS"]
  }
}
```

---

## 4. Spesifikasi OpenAPI

* **Berkas Spesifikasi:** [`docs/api/openapi.yaml`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/docs/api/openapi.yaml) (OpenAPI `3.1.0`)
* **Konfigurasi Lint:** [`redocly.yaml`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/redocly.yaml) (`extends: recommended`, `no-server-example.com: off`)
* **Dokumentasi HTML Statis:** [`docs/api/index.html`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/docs/api/index.html)

### Keluaran `npx @redocly/cli lint docs/api/openapi.yaml`
```text
validating docs\api\openapi.yaml...
docs\api\openapi.yaml: validated in 97ms

Woohoo! Your API description is valid. 🎉
```

### Selisih Spesifikasi & Kode yang Diselaraskan
1. **Tipe parameter `{id}` dan skema `Target.id`:** Contoh umum modul memakai `integer` autoincrement, sedangkan proyek ini memakai `string` berpola `^scan-\d{4}-\d{3}$`. `IdTarget` dan `Target.id` di `openapi.yaml` diselaraskan ke `type: string` dengan `pattern`.
2. **Respons `409 Conflict` pada `POST` dan `PATCH`:** Karena kolom `Target.targetUrl` memiliki constraint `@unique` di `prisma/schema.prisma`, operasi `POST /target` dan `PATCH /target/{id}` berpotensi memicu Prisma `P2002`. Respons `"409"` ditambahkan baik pada handler maupun pada kontrak `openapi.yaml`.
3. **Kolom opsional bernilai `null` di PostgreSQL:** Pada `Target` dan `Temuan`, field opsional (`intervalJam`, `auditorEmail`, `notes`, `cwe`, `asvsRef`) dikembalikan Prisma sebagai `null` saat kosong, sehingga di OpenAPI 3.1 didefinisikan sebagai tipe nullable (misal `type: [string, "null"]`).

---

## 5. Hasil Pengujian Manual

### A. Verifikasi Statis (Sudah Dijalankan)
* `npx tsc --noEmit` $\rightarrow$ **Lulus (0 error)**
* `npm run lint` $\rightarrow$ **Lulus (0 error, 0 warning)**
* `npx @redocly/cli lint docs/api/openapi.yaml` $\rightarrow$ **Lulus (`Woohoo! Your API description is valid. 🎉`)**

### B. Tabel Kasus Uji Manual (`curl` & Bruno / Thunder Client)
*(Catatan: Pengujian HTTP langsung ke `http://localhost:3000/api/v1` dijalankan terhadap basis data dummy lokal hasil `npx prisma db seed`. Kolom `Status Aktual` dan `Lulus/Gagal` diisi setelah server `npm run dev` dijalankan dan seluruh permintaan dieksekusi.)*

| No | Permintaan (`curl` / Bruno) | Status Harapan | Status Aktual | Lulus / Gagal |
| :-: | :--- | :---: | :---: | :---: |
| 1 | `GET /api/v1/target?halaman=1&batas=2` | `200` | | |
| 2 | `GET /api/v1/target?auditScope=full&asvsLevel=L2` | `200` | | |
| 3 | `GET /api/v1/target?batas=500` | `400` | | |
| 4 | `POST /api/v1/target` (JSON sah $\rightarrow$ catat `<NEW_ID>` dari `Location`) | `201` | | |
| 5 | `POST /api/v1/target` (JSON rusak `{"label":`) | `400` | | |
| 6 | `POST /api/v1/target` (JSON valid, `auditScope: "pentest"`, `asvsLevel: "L4"`) | `422` | | |
| 7 | `POST /api/v1/target` (`targetUrl` duplikat `https://portal.kampus.ac.id`) | `409` | | |
| 8 | `GET /api/v1/target/scan-2026-001` | `200` | | |
| 9 | `GET /api/v1/target/abc` | `400` | | |
| 10 | `GET /api/v1/target/scan-2026-999` | `404` | | |
| 11 | `PATCH /api/v1/target/<NEW_ID>` (`{"notes":"Diperiksa Modul 8"}`) | `200` | | |
| 12 | `PATCH /api/v1/target/scan-2026-001` (body kosong `{}`) | `422` | | |
| 13 | `PUT /api/v1/target/scan-2026-001` | `405` | | |
| 14 | `DELETE /api/v1/target/scan-2026-001` (masih punya `Temuan`) | `409` | | |
| 15 | `DELETE /api/v1/target/<NEW_ID>` (tanpa `Temuan`), lalu ulangi `DELETE` | `204`, lalu `404` | | |
| 16 | `GET /api/v1/target/scan-2026-001/temuan` | `200` | | |

* **Persentase Kelulusan:** *(Isi setelah pengujian langsung dijalankan; target minimal 90%, yaitu $\ge 15$ dari 16 kasus).*
* **Bukti Pengujian (Keluaran `curl -i` / Tangkapan Layar Bruno/Thunder Client):** *(Lampirkan keluaran terminal `curl -i` dan tangkapan layar runner Bruno/Thunder Client yang menampilkan minimal 6 assertion status lulus di `docs/Screenshot/Modul8/`).*

---

## 6. Keputusan Teknis dan Kendala

1. **Pemisahan `400 Bad Request` vs `422 Unprocessable Content` (RFC 9110 & RFC 9457):**  
   `400` dipakai saat struktur/sintaks pesan permintaan rusak sebelum evaluasi domain—yaitu body bukan JSON/bukan objek (`bacaJson`), parameter kueri paginasi/filter tidak valid, atau parameter path `[id]` tidak cocok pola `scan-YYYY-NNN`. Sebaliknya, `422` dipakai saat JSON sudah ter-parsing dengan benar, tetapi nilai semantiknya melanggar aturan skema bisnis Zod (misal nama target `< 3` karakter, `auditScope` di luar enum, atau `PATCH` dengan `{}`).
2. **Menolak `DELETE` dengan `409 Conflict` saat Masih Ada `Temuan`:**  
   Sesuai RFC 9110 bagian `15.5.10`, `409 Conflict` menunjukkan permintaan tidak dapat diselesaikan karena bertentangan dengan keadaan resource saat ini. Pada `prisma/schema.prisma`, relasi `Temuan.targetId` memakai `onDelete: Restrict`. Endpoint `DELETE /api/v1/target/{id}` memeriksa jumlah temuan lebih dahulu dan mengembalikan `409 Conflict` agar bukti temuan audit tidak terhapus diam-diam.
3. **Batas Maksimum Paginasi (`batas <= 50`):**  
   Parameter `batas` dibatasi maksimum `50` di server pada `skemaKueriTarget` (default `10`). Tanpa batas atas, klien dapat meminta `batas=1000000` yang memicu pembacaan tabel penuh dan membebani memori server serta basis data (risiko *unrestricted resource consumption* / OWASP API4:2023).
4. **Struktur Path `/api/v1/target`, `/api/v1/target/{id}`, dan `/api/v1/target/{id}/temuan`:**  
   Mengikuti pola REST berorientasi resource (kata benda jamak/tunggal konsisten di bawah prefix versi kontrak `/api/v1`) dan terpisah dari segmen `app/target/page.tsx` karena Next.js melarang `route.ts` berada satu segmen dengan `page.tsx`.
5. **Kendala yang Dihadapi & Penyelesaian:**  
   * *Pembuatan ID String Unik pada `POST`:* Berbeda dari contoh modul yang memakai integer autoincrement, `Target.id` bertipe `String` (`scan-YYYY-NNN`). Mengandalkan `count() + 1` dapat bentrok jika pernah ada target yang dihapus; solusinya di `app/api/v1/target/route.ts` dibuat `buatIdTargetBerikutnya()` yang membaca nomor ID terbesar saat ini untuk tahun berjalan lalu menaikkan urutannya.

---

## 7. Catatan Pemanfaatan AI

* **Alat yang Digunakan:** Antigravity AI Assistant.
* **Perintah Utama:**
  1. Inspeksi *read-only* skema Prisma, `lib/skema/target.ts`, `lib/data.ts`, dan Server Actions Modul 6.
  2. Penyusunan skema Zod API (`skemaTargetBaru`, `skemaTargetUbah`, `skemaKueriTarget`, `skemaIdTarget`) dan helper RFC 9457 `lib/api/problem.ts`.
  3. Implementasi 6 operasi Route Handlers di `app/api/v1/target/` tanpa `PUT`.
  4. Penyusunan kontrak OpenAPI `3.1.0` di `docs/api/openapi.yaml`, `redocly.yaml`, dan kerangka uji manual.
* **Bagian yang Dihasilkan / Diubah dengan Bantuan AI:**
  * [`lib/skema/target.ts`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/lib/skema/target.ts), [`lib/api/problem.ts`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/lib/api/problem.ts), [`app/api/v1/target/route.ts`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/app/api/v1/target/route.ts), [`app/api/v1/target/[id]/route.ts`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/app/api/v1/target/%5Bid%5D/route.ts), [`app/api/v1/target/[id]/temuan/route.ts`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/app/api/v1/target/%5Bid%5D/temuan/route.ts), [`redocly.yaml`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/redocly.yaml), [`docs/api/openapi.yaml`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/docs/api/openapi.yaml), dan [`docs/praktikum/modul-08.md`](file:///c:/Users/USER%20HP/Downloads/Tugas/codeblock/Project/TriplleeeMat/tripleemat/docs/praktikum/modul-08.md).
* **Cara Memverifikasi Mandiri:**
  * Menjalankan `npx tsc --noEmit` (0 galat tipe data).
  * Menjalankan `npm run lint` (0 galat/peringatan ESLint).
  * Menjalankan `npx @redocly/cli lint docs/api/openapi.yaml` (valid tanpa galat) dan `npx @redocly/cli build-docs docs/api/openapi.yaml -o docs/api/index.html`.
  * Menjalankan pengujian manual `curl` (16 kasus) dan Bruno/Thunder Client (6 assertion) terhadap server lokal (`npm run dev`) dan basis data dummy PostgreSQL.
