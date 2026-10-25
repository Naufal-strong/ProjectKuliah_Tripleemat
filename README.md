# 🛡️ Tripleemat Security Assessor

**Tripleemat Security Assessor** adalah platform web **Penilaian Keamanan & Kepatuhan Otomatis (Automated Security & Compliance Assessment)** tingkat enterprise yang dirancang untuk mengaudit aplikasi web terhadap standar **OWASP ASVS (Application Security Verification Standard v4.0.3)** dan **NIST SP 800-53**. 

Platform ini memungkinkan auditor keamanan, pengembang web, administrator IT kampus, dan tim DevSecOps untuk melakukan pemindaian pasif non-intrusif pada HTTP security headers, menginspeksi SSL/TLS cipher suites, melacak kontrol kepatuhan, serta menghasilkan laporan audit kriptografis yang dapat diverifikasi secara matematis.

---

## 📌 Daftar Isi

1. [Konsep Produk](#-1-konsep-produk)
   - [Identitas & Tujuan Produk](#identitas--tujuan-produk)
   - [Target Pengguna](#target-pengguna)
   - [Pernyataan Masalah & Solusi](#pernyataan-masalah--solusi)
   - [Fungsi Utama](#fungsi-utama)
   - [Peta Jalan Milestone & Ekstensibilitas Masa Depan](#peta-jalan-milestone--ekstensibilitas-masa-depan)
2. [Teknologi yang Digunakan](#-2-teknologi-yang-digunakan)
3. [Struktur Aplikasi](#-3-struktur-aplikasi)
4. [Sistem Desain Visual 3D & Palet 7 Warna Samudra](#-4-sistem-desain-visual-3d--palet-7-warna-samudra)
5. [Komponen UI Reusable](#-5-komponen-ui-reusable)
6. [Formulir, Validasi Zod 4, Server Actions & Session Cookie (Modul 5)](#-6-formulir-validasi-zod-4-server-actions--session-cookie-modul-5)
7. [Arsitektur Data Tiruan (Mock Data)](#-7-arsitektur-data-tiruan-mock-data)
8. [Implementasi Desain Responsif & Layar Sentuh](#-8-implementasi-desain-responsif--layar-sentuh)
9. [Aksesibilitas Web (WCAG 2.1 AA)](#-9-aksesibilitas-web-wcag-21-aa)
10. [Kebutuhan Pengujian & Bukti Uji](#-10-kebutuhan-pengujian--bukti-uji)
    - [Pengujian Unit Skema Validasi Zod (10 Kasus Uji)](#pengujian-unit-skema-validasi-zod-10-kasus-uji)
    - [Verifikasi Rute Dinamis, Error Handling, & Siklus Hidup (Modul 4)](#verifikasi-rute-dinamis-error-handling--siklus-hidup-modul-4)
    - [Laporan Audit Aksesibilitas Lighthouse](#laporan-audit-aksesibilitas-lighthouse)
11. [Panduan Menjalankan Proyek](#-11-panduan-menjalankan-proyek)
12. [Dokumentasi Praktikum Terkait](#-12-dokumentasi-praktikum-terkait)

---

## 💡 1. Konsep Produk

### Identitas & Tujuan Produk
* **Nama Produk:** Tripleemat Security Assessor
* **Tujuan:** Menyediakan platform penilaian keamanan aplikasi web yang terotomatisasi, ramah pengguna, dan dapat diverifikasi secara kriptografis, menjembatani kesenjangan antara analisis raw HTTP headers dan kerangka kerja kepatuhan tingkat tinggi (OWASP ASVS, NIST SP 800-53, FIPS 199).

### Target Pengguna
1. **Auditor Keamanan (Security Auditors):** Memerlukan daftar periksa (checklist) terstandarisasi, pelacakan bukti audit, dan scorecard eksekutif yang dapat diekspor.
2. **Pengembang Web & Full-Stack:** Memerlukan panduan remediasi langsung dan praktis (misalnya sintaks CSP yang tepat, arahan HSTS) untuk memperkuat kode sebelum rilis ke tahap produksi.
3. **Administrator IT Universitas / Kampus:** Mengelola banyak portal (`portal.kampus.ac.id`, `library.kampus.ac.id`, sistem akademik warisan/legacy) yang wajib mematuhi regulasi perlindungan data.
4. **DevSecOps Engineers:** Mengintegrasikan pemeriksaan pasif yang ringan ke dalam siklus hidup pengembangan perangkat lunak (SDLC/CI-CD).

### Pernyataan Masalah & Solusi
* **Masalah:** Banyak portal akademik dan aplikasi web enterprise beroperasi tanpa header HTTP keamanan yang tepat atau dengan konfigurasi yang salah (`Permissions-Policy`, `Content-Security-Policy`, `Strict-Transport-Security`), membuatnya rentan terhadap Cross-Site Scripting (XSS), Clickjacking, dan serangan penurunan protokol (protocol downgrade). Selain itu, melakukan audit formal terhadap ratusan kontrol OWASP ASVS secara manual sangat melelahkan, rentan kesalahan, dan jarang disertai dokumentasi yang tahan manipulasi (tamper-proof).
* **Solusi:** Tripleemat Security Assessor menawarkan:
  - Pemindaian pasif endpoint secara instan dan non-intrusif.
  - Daftar periksa ASVS interaktif dengan kalkulasi skor kepatuhan langsung (live compliance score).
  - Verifikasi kriptografis FIPS 199 bawaan menggunakan digest SHA-256 dan enkripsi terotentikasi AES-256-GCM (`node:crypto`), menjamin integritas jejak audit (audit trail).

### Fungsi Utama
1. **Penganalisis Pasif HTTP & SSL (`/scan`):** Mengevaluasi header keamanan HTTP (CSP, HSTS, X-Frame-Options, Referrer-Policy, CORS, Permissions-Policy) serta memvalidasi masa berlaku sertifikat TLS dan cipher suites. Terhubung dengan Server Action mutasi tervalidasi Zod 4.
2. **Matriks Interaktif OWASP ASVS (`/asvs`):** Memverifikasi kontrol teknis di berbagai bab (Arsitektur, Autentikasi, Manajemen Sesi, Validasi, Kriptografi, Komunikasi). Memungkinkan pengguna memfilter berdasarkan bab, level, atau kata kunci pencarian, serta mengubah status kontrol secara dinamis.
3. **Scorecard Keamanan Eksekutif & Riwayat Audit (`/report`):** Memvisualisasikan peringkat keamanan keseluruhan (A+ hingga F), skor kesehatan numerik (0–100), distribusi risiko, dan rencana remediasi kerentanan yang teridentifikasi beserta instruksi perbaikan yang dapat disalin langsung.
4. **Rute Dinamis Detail Audit Terisolasi (`/report/[id]`):** Menampilkan rincian audit mendalam per target pemindaian yang divalidasi dengan regex (`/^scan-\d{4}-\d{3}$/`), memanfaatkan pengambilan data sisi server terlindungi (`lib/data.ts` via `server-only`), dan terintegrasi dengan fallback 404 (`notFound()`).
5. **Autentikasi & Manajemen Sesi Auditor (`/masuk`):** Mengelola sesi auditor secara aman menggunakan cookie kriptografis berstatus stateful (`HttpOnly`, `SameSite=Lax`, `Max-Age=28800`), terintegrasi dengan filter gerbang `proxy.ts` Next.js 16.
6. **Vault Kriptografi & Verifikasi:** Menandatangani catatan audit dengan hash SHA-256 dan cipher AEAD untuk membuktikan bahwa data rekam audit belum dimanipulasi pasca-audit.

### Peta Jalan Milestone & Ekstensibilitas Masa Depan
* **Milestone 1 (Pekan 3 — UI & Desain Sistem):** Arsitektur Frontend, Sistem UI Reusable (6 komponen modular), Alur Halaman Inti (`/`, `/scan`, `/asvs`, `/report`), Validasi Formulir Sisi Klien, Data Tiruan (Mock Data), Tata Letak Responsif Mobile-First, dan Optimalisasi Aksesibilitas WCAG 2.1 AA (Lighthouse ≥ 95).
* **Milestone 2 (Pekan 4 — Modul 4 App Router & Rute Dinamis):** Penguatan Arsitektur Next.js 16 App Router — Rute Dinamis `/report/[id]` dengan penanganan `await params`, validasi format regex `/^scan-\d{4}-\d{3}$/`, `notFound()`, optimasi SSG via `generateStaticParams()`, proteksi data sisi server melalui paket `server-only` di `lib/data.ts`, analisis siklus hidup layout vs template via `KolomCatatan.tsx`, dan navigasi aktif aksesibel via `TautanNav.tsx` (`usePathname`, `aria-current="page"`). Laporan teknis lengkap di [`docs/praktikum/modul-04.md`](docs/praktikum/modul-04.md).
* **Milestone 3 (Pekan 5 — Modul 5: Formulir, Validasi, Server Action, Session & Cookie):** Implementasi skema validasi Zod 4 deklaratif (`skemaTarget`, `skemaMasuk`), alur Server Action mutasi 5-tahap dengan `useActionState` React 19, sistem manajemen cookie sesi kriptografis `server-only` (`HttpOnly`, `SameSite=Lax`, `Max-Age=28800`), penapisan rute terproteksi via `proxy.ts`, pengujian otomatis 10 kasus uji, serta penyusunan dokumen teknis lengkap di [`docs/praktikum/modul-05.md`](docs/praktikum/modul-05.md).
* **Milestone 4 (Desain Visual & Branding 3D):** Restrukturisasi desain visual dengan palet 7 warna samudra baja (`#001D39` hingga `#BDD8E9`), dasbor 3D isometrik dengan pendaran sonar radar dan live telemetry stream, transisi tema mulus dengan View Transitions API, transisi halaman sinematik, serta integrasi identitas logo perisai resmi.
* **Milestone 5 (Roadmap Selanjutnya):** Integrasi basis data relasional (PostgreSQL via Prisma), asynchronous worker jobs untuk audit jaringan real-time, dan ekspor laporan ke format PDF bersertifikat digital.

---

## 🛠️ 2. Teknologi yang Digunakan

| Kategori | Teknologi | Deskripsi |
|---|---|---|
| **Framework** | Next.js 16.4.0 (App Router) | Framework React berkinerja tinggi dengan server components, Server Actions & `proxy.ts` |
| **Bahasa** | TypeScript 5 | Pengetikan statis ketat untuk domain models, skema validasi, dan Server Actions |
| **Pustaka UI** | React 19.3.0 | Pustaka antarmuka deklaratif dengan hook form aksi modern `useActionState` & `useSyncExternalStore` |
| **Validasi Skema** | Zod 4.6.5 | Validasi deklaratif terpusat (`lib/skema/`) untuk formulir target audit dan autentikasi |
| **Styling** | Tailwind CSS v4 | Mesin CSS utility-first yang diselaraskan dengan palet 7 warna samudra & efek 3D |
| **Proteksi Server** | `server-only` | Paket resmi Next.js untuk mengunci modul sesi dan data agar tidak bocor ke peramban |
| **Tipografi / Font** | Geist & Geist Mono (Google Fonts) | Tipografi sans-serif dan monospace modern dengan keterbacaan tinggi |
| **Kriptografi** | `node:crypto` (OpenSSL backend) | AES-256-GCM, SHA-256 digest, HMAC, dan CSPRNG UUID tingkat OS berstandar FIPS 199 |
| **Ikon** | Accessible Inline SVG | Ikon yang dapat diskalakan penuh dan aksesibel dengan atribut `aria-hidden="true"` |
| **Transisi Peramban** | View Transitions API | Transisi pergantian tema gelap/terang dan rute halaman sinematik yang mulus |
| **Test Runner** | Node.js Test Runner (`node:test`) | Runner pengujian bawaan tanpa dependensi berat yang dijalankan via `tsx` |

---

## 📁 3. Struktur Aplikasi

```text
tripleemat/
├── app/                                # Halaman & Konvensi Rute Next.js 16 App Router
│   ├── globals.css                     # Arahan Tailwind v4, Palet 7 Warna Samudra, Efek 3D & Transisi
│   ├── layout.tsx                      # Root layout aplikasi dengan Navbar, Footer, & Favicon Perisai
│   ├── template.tsx                    # Pembungkus transisi halaman sinematik & top luminous beam
│   ├── loading.tsx                     # Fallback pemuatan berbasis Suspense (Server Component)
│   ├── error.tsx                       # Error boundary untuk galat tak terduga dengan retry (Client Component)
│   ├── not-found.tsx                   # Antarmuka 404 ketika notFound() atau rute tak cocok (Server Component)
│   ├── page.tsx                        # Halaman 1: Beranda Utama (Dasbor 3D Isometrik & Telemetri)
│   ├── scan/
│   │   ├── page.tsx                    # Halaman 2: Pemindai Header Keamanan & SSL (dengan form tervalidasi)
│   │   └── actions.ts                  # Server Action simpanTargetAudit (5 Tahap Mutasi Ketat)
│   ├── asvs/
│   │   └── page.tsx                    # Halaman 3: Matriks Kepatuhan OWASP ASVS v4.0.3
│   ├── masuk/
│   │   ├── page.tsx                    # Halaman Autentikasi Auditor (Deteksi Sesi Aktif)
│   │   └── actions.ts                  # Server Actions: masuk & keluar (Manajemen Cookie Sesi)
│   └── report/
│       ├── layout.tsx                  # Nested Layout: Menjaga state catatan tetap persisten
│       ├── template.tsx                # Nested Template: Me-reset state catatan per navigasi
│       ├── page.tsx                    # Halaman 4: Scorecard Keamanan Eksekutif & Riwayat Audit
│       └── [id]/
│           └── page.tsx                # Rute Dinamis: Detail Laporan Audit (await params, regex, notFound)
├── components/                         # Komponen Reusable Tambahan Modul 4 & Modul 5
│   ├── FormMasuk.tsx                   # Client Component form autentikasi (React 19 useActionState + ARIA)
│   ├── KolomCatatan.tsx                # Client Component penguji persistensi state layout vs template
│   └── TautanNav.tsx                   # Client Component navigasi aktif dengan aria-current="page"
├── lib/                                # Logika Bisnis, Data Access & Validasi Skema
│   ├── data.ts                         # Server-only Data Access Layer (import "server-only")
│   ├── sesi.ts                         # Server-only Session & Cookie Engine (crypto.randomUUID)
│   ├── status-form.ts                  # Tipe data kembalian Server Action (StatusForm)
│   ├── skema.ts                        # Re-ekspor modul skema Zod
│   └── skema/                          # Skema Validasi Zod 4 Terpisah
│       ├── index.ts                    # Barrel export skema
│       ├── target.ts                   # skemaTarget (Validasi 8 Atribut Target Audit)
│       └── masuk.ts                    # skemaMasuk (Validasi Kredensial Email & Sandi)
├── proxy.ts                            # Pemeriksaan optimistik cookie di Next.js 16 (Tepi / Edge Gate)
├── public/
│   └── logo.png                        # Logo resmi perisai produk Tripleemat Security Assessor
├── src/
│   ├── components/
│   │   ├── ui/                         # Pustaka Komponen UI yang Dapat Digunakan Kembali (Reusable)
│   │   │   ├── Button.tsx              # Tombol 3D tactile dengan varian palet samudra
│   │   │   ├── Card.tsx                # Keluarga Card (Header, Title, Description, Content, Footer)
│   │   │   ├── Badge.tsx               # Lencana status & keparahan terpadu 7 warna samudra
│   │   │   ├── Input.tsx               # Input form tervalidasi dengan binding ARIA lengkap
│   │   │   ├── Alert.tsx               # Notifikasi status dengan role="alert"
│   │   │   ├── ProgressBar.tsx         # Bilah progres aksesibel dengan aria-valuenow
│   │   │   └── index.ts                # Barrel export komponen
│   │   └── layout/
│   │       ├── Navbar.tsx              # Navigasi responsif terintegrasi logo perisai & tombol pemindai 3D
│   │       ├── ThemeToggle.tsx         # Pengalih tema gelap/terang mulus via View Transitions API
│   │       └── Footer.tsx              # Footer semantik dengan logo resmi & tautan modul
│   ├── data/                           # Kumpulan Data Tiruan (Mock Data)
│   │   ├── mockSecurityHeaders.ts      # Definisi header keamanan HTTP & rekomendasi remediasi
│   │   ├── mockAsvsControls.ts         # Kontrol OWASP ASVS v4.0.3 dengan pemetaan ke NIST
│   │   └── mockScans.ts                # Rekam data scan audit realistis (portal, library, siak)
│   ├── lib/
│   │   └── crypto/                     # Mesin Kriptografi Industri FIPS 199
│   └── types/
│       └── index.ts                    # Antarmuka TypeScript & tipe domain
├── security/                           # Dokumentasi Keamanan & KKS (Milestone sec-0.1)
├── docs/                               # Dokumentasi Teknis & Bukti Pengujian
│   ├── praktikum/
│   │   ├── modul-04.md                 # Dokumentasi Teknis Praktikum Modul 4 (App Router)
│   │   └── modul-05.md                 # Dokumentasi Teknis Praktikum Modul 5 (Formulir, Sesi, Cookie)
│   └── Screenshot/
│       ├── Modul4/                     # Bukti visual pengujian rute dinamis, layout, & template
│       └── Modul5/                     # Bukti visual validasi form, bypass novalidate, & cookie sesi
├── test/
│   ├── crypto.test.ts                  # Unit test kriptografi (100% lolos)
│   └── skema.test.ts                   # Unit test validasi skema Zod 4 (10/10 lolos)
├── .env.example                        # Contoh konfigurasi kredensial lingkungan demo
├── AI-Log .md                          # Log penggunaan Gen-AI & catatan verifikasi mandiri
├── package.json                        # Dependensi proyek dan npm scripts
└── tsconfig.json                       # Konfigurasi compiler TypeScript
```

---

## 🎨 4. Sistem Desain Visual 3D & Palet 7 Warna Samudra

Aplikasi ini mengadopsi **Palet 7 Warna Samudra Baja (Oceanic Steel Harmony)** yang harmonis untuk memberikan kesan keamanan siber enterprise yang kokoh dan modern, baik pada tema terang maupun gelap:

| Lapisan | Nilai Hex | Nuansa Visual | Peran Desain dalam Antarmuka |
| :---: | :---: | :--- | :--- |
| **L1** | `#001D39` | Deepest Midnight Ocean | Latar utama kanvas mode gelap, teks heading kontras tinggi mode terang, dan jangkar bayangan 3D |
| **L2** | `#0A4174` | Deep Marine Navy | Permukaan kartu mode gelap, tombol primer mode terang, border tegas |
| **L3** | `#49769F` | Muted Steel Blue | Garis batas (*border*) pemisah antarmuka, teks sekunder keterangan |
| **L4** | `#4E8EA2` | Ocean Teal | Lencana modul (*cyan badge*), aksen fokus interaktif, garis sorotan |
| **L5** | `#6EA2B3` | Glacier Slate | Garis kontrol input, pemisah netral, teks bantu (*helper text*) |
| **L6** | `#7BBDE8` | Sky Frost Blue | Pendaran aktif (*glow highlights*), fokus ring aksesibel, bilah progres audit |
| **L7** | `#BDD8E9` | Pale Ice Cloud | Latar inset mode terang, teks tubuh mode gelap, pantulan cahaya tepi atas 3D |

### Fitur Visual & Interaksi 3D Unggulan:
* **Dasbor 3D Isometrik Hero (`.hero-3d-board`):** Papan terminal berkedalaman 3D di halaman beranda yang menampilkan telemetri konsol langsung (*live console stream*), metrik skor keamanan A+ (98/100), dan kepatuhan OWASP ASVS.
* **Gelombang Radar Pemindai (*Sonar Pulse Ring*):** Pendaran radar konsentris animasi di sekeliling logo perisai resmi ([`public/logo.png`](public/logo.png)) yang berdenyut secara halus.
* **Kisi-Kisi Perspektif 3D (*Cyber Grid Background*):** Latar belakang beraksen kisi geometris futuristik murni akselerasi GPU (`.cyber-grid-bg`) dengan *radial mask*.
* **Umpan Balik Taktil Layar Sentuh (`.touch-tactile`):** Respons fisik membal (`transform: scale(0.98)`) saat tombol atau kartu ditekan di perangkat ponsel pintar atau tablet.
* **Transisi Tema Mulus (*Smooth Crossfade*):** Peralihan mode gelap/terang tanpa kedipan kasar menggunakan **View Transitions API** (`document.startViewTransition`) dan transisi warna `400ms`.
* **Transisi Halaman Sinematik:** Sapuan sinar luminous atas (`.page-transition-progress`) dan tirai sinematik transparan (`.cinematic-page-curtain`) yang mengalir halus saat berpindah antar rute aplikasi.

---

## 🧩 5. Komponen UI Reusable

Aplikasi ini memiliki **enam komponen antarmuka (UI) modular yang dapat digunakan kembali**, terletak di [`src/components/ui/`](src/components/ui/):

### 1. `Button` ([`src/components/ui/Button.tsx`](src/components/ui/Button.tsx))
* **Tujuan:** Pemicu aksi utama pengguna dengan elevasi 3D taktil (`.btn-3d-primary`).
* **Props:** `variant` (`primary`, `secondary`, `outline`, `danger`, `ghost`), `size` (`sm`, `md`, `lg`), `isLoading` (boolean), `leftIcon`, `rightIcon`, props tombol HTML standar.
* **Fitur Aksesibilitas:** `<button>` semantik asli, atribut `aria-busy` saat memuat, ring fokus berdaya kontras tinggi `:focus-visible`, penataan gaya status dinonaktifkan (*disabled*).

### 2. `Card` ([`src/components/ui/Card.tsx`](src/components/ui/Card.tsx))
* **Tujuan:** Kontainer konten bertingkat dengan bayangan 3D (`.card-3d`) untuk metrik, formulir, temuan audit, dan modul.
* **Sub-komponen:** `CardHeader`, `CardTitle` (mendukung `as="h2" | "h3"`), `CardDescription`, `CardContent`, `CardFooter`.
* **Varian:** `default`, `glass` (efek backdrop blur), `subtle`, `glow` (sorotan batas warna cyan).

### 3. `Badge` ([`src/components/ui/Badge.tsx`](src/components/ui/Badge.tsx))
* **Tujuan:** Representasi visual status kepatuhan dan keparahan yang diselaraskan dengan palet 7 warna samudra (`brand`, `cyan`, `ok`, `warn`, `fail`).
* **Fitur Aksesibilitas:** Melampaui rasio kontras minimum WCAG 2.1 AA 4.5:1 terhadap latar belakang gelap dan terang, titik status opsional (`dot`), gaya monospace berhuruf kapital.

### 4. `Input` ([`src/components/ui/Input.tsx`](src/components/ui/Input.tsx))
* **Tujuan:** Input formulir untuk teks, URL, dan email dengan umpan balik validasi terintegrasi.
* **Props:** `label`, `error`, `helperText`, `isRequired`, `leftIcon`, `rightIcon`.
* **Fitur Aksesibilitas:** `id` unik yang dipasangkan dengan `<label htmlFor>`, `aria-invalid={!!error}`, `aria-describedby` yang menautkan pesan kesalahan atau teks bantuan, teks error dibungkus dengan `role="alert"` dan `aria-live="polite"`.

### 5. `Alert` ([`src/components/ui/Alert.tsx`](src/components/ui/Alert.tsx))
* **Tujuan:** Pesan status dan umpan balik berprioritas tinggi.
* **Props:** `variant` (`info`, `success`, `warning`, `danger`), `title`, `onDismiss`.
* **Fitur Aksesibilitas:** `role="alert"`, ikon semantik dengan `aria-hidden="true"`, tombol penutup aksesibel dengan `aria-label="Tutup notifikasi"`.

### 6. `ProgressBar` ([`src/components/ui/ProgressBar.tsx`](src/components/ui/ProgressBar.tsx))
* **Tujuan:** Tampilan progres audit dan visualisasi skor kepatuhan.
* **Props:** `value`, `max`, `label`, `showValueLabel`, `colorScheme` (`dynamic`, `cyan`, `emerald`, `amber`, `rose`), `size`.
* **Fitur Aksesibilitas:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label`.

---

## 📝 6. Formulir, Validasi Zod 4, Server Actions & Session Cookie (Modul 5)

Pada **Milestone 3 (Pekan 5)**, sistem pemrosesan formulir ditingkatkan ke arsitektur mutasi data modern Next.js 16 berbasis **Server Actions** dan validasi deklaratif **Zod 4**:

### A. Skema Validasi Deklaratif Zod 4 (`lib/skema/`)
1. **`skemaTarget` (`lib/skema/target.ts`):** Memvalidasi 8 atribut target audit:
   - `label`: `string` (`.trim().min(3).max(80)`).
   - `targetUrl`: `string` (wajib protokol `http://` atau `https://`, domain bertitik FQDN).
   - `auditScope`: `enum` (`"standard" | "full" | "ssl-only"`).
   - `asvsLevel`: `enum` (`"L1" | "L2" | "L3"`).
   - `intervalJam`: `number` opsional (dipreproses string kosong $\rightarrow$ `undefined`, integer 1–168).
   - `auditorEmail`: `string` opsional (dipreproses string kosong $\rightarrow$ `undefined`, format email RFC).
   - `notifyOnComplete`: `boolean` (`z.stringbool().default(false)` untuk checkbox FormData).
   - `notes`: `string` opsional (maksimal 300 karakter).
2. **`skemaMasuk` (`lib/skema/masuk.ts`):** Memvalidasi kredensial login auditor (`email` valid, `kataSandi` $\ge 8$ karakter).

### B. Alur Mutasi Server Action 5-Tahap Berurutan
Server Action [`app/scan/actions.ts`](app/scan/actions.ts) dan [`app/masuk/actions.ts`](app/masuk/actions.ts) mengimplementasikan urutan mutasi ketat:
```text
[1. Verifikasi Sesi] ──► [2. Validasi Bentuk (Zod safeParse)] ──► [3. Validasi Semantik (Cek Duplikat)]
                                                                                  │
  [Pengalihan Rute (redirect)] ◄── [5. revalidatePath] ◄── [4. Mutasi Data (try-catch)]
```
* **Aturan Khusus Next.js:** Pemanggilan `revalidatePath()` dan `redirect()` wajib dieksekusi **di luar blok `try-catch`** karena Next.js memanfaatkan exception internal untuk pengalihan navigasi.

### C. Manajemen Sesi Kriptografis & Cookie (`lib/sesi.ts`)
* **Stateful Server Session:** Menggunakan `crypto.randomUUID()` berstandar FIPS 199 yang disimpan dalam memori server terisolasi.
* **Perlindungan `server-only`:** Menjamin fungsi pembacaan/penulisan cookie tidak pernah bocor ke bundel JavaScript klien.
* **Konfigurasi Cookie:**
  - `HttpOnly: true` — Melindungi cookie dari serangan pencurian sesi berbasis XSS (`document.cookie` selalu kosong `""`).
  - `SameSite: "lax"` — Menahan serangan pemalsuan permintaan lintas situs (CSRF).
  - `Max-Age: 28800` — Sesi otomatis kedaluwarsa setelah jam kerja auditor (8 jam).
  - `Path: "/"` — Token sesi konsisten untuk seluruh rute aplikasi.
* **Penyaring Gerbang Tepi (`proxy.ts`):** Menggantikan `middleware.ts` di Next.js 16 untuk pemeriksaan optimistik cookie pada rute terproteksi `/scan` sebelum peramban merender halaman.

### Pesan Kesalahan Validasi Spesifik
| Kolom | Kondisi | Pesan Kesalahan yang Jelas |
|---|---|---|
| **Target URL** | Input kosong | *"Target URL is required. Please specify a web application endpoint to audit."* |
| **Target URL** | Tanpa `http://` atau `https://` | *"Invalid protocol. Target URL must begin with https:// or http:// (e.g., https://portal.kampus.ac.id)."* |
| **Target URL** | Format domain tidak valid | *"Invalid domain name. Please include a valid hostname (e.g., https://example.com)."* |
| **Auditor Email** | Format email tidak valid | *"Invalid email format. Please provide a valid address (e.g., auditor@kampus.ac.id) or clear the field."* |

---

## 📊 7. Arsitektur Data Tiruan (Mock Data)

Semua data tiruan bertipe kuat (*strongly typed*) melalui antarmuka TypeScript dan diorganisasikan di dalam [`src/data/`](src/data/):

1. **[`mockSecurityHeaders.ts`](src/data/mockSecurityHeaders.ts):**
   - 8 header keamanan utama: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`.
   - Menyertakan nilai aktual, nilai yang diharapkan, status, tingkat keparahan (*severity*), dan instruksi remediasi perbaikan yang dapat langsung diterapkan.

2. **[`mockAsvsControls.ts`](src/data/mockAsvsControls.ts):**
   - Mencakup 15 kontrol representatif di seluruh bab OWASP ASVS v4.0.3 (V1 Arsitektur, V2 Autentikasi, V3 Manajemen Sesi, V5 Validasi & Sanitasi, V6 Kriptografi, V9 Komunikasi).
   - Memetakan setiap kontrol ke kontrol NIST SP 800-53 (misalnya SC-8, SC-13, IA-5, AC-6) dan sasaran FIPS 199.

3. **[`mockScans.ts`](src/data/mockScans.ts):**
   - Tiga profil target pengujian yang berbeda:
     - `https://portal.kampus.ac.id` (Skor: 82/100, Peringkat B — postur moderat)
     - `https://library.kampus.ac.id` (Skor: 94/100, Peringkat A — postur kokoh/hardened)
     - `https://legacy-siak.kampus.ac.id` (Skor: 48/100, Peringkat F — cipher lama rentan & header keamanan tidak lengkap)

---

## 📱 8. Implementasi Desain Responsif & Layar Sentuh

Antarmuka dirancang dengan filosofi *mobile-first* yang mengutamakan kenyamanan pengguna ponsel, tablet, maupun monitor desktop beresolusi tinggi:

| Breakpoint | Target Lebar Layar | Tata Letak & Adaptasi Responsif |
|---|---|---|
| **Mobile** | $\le 640\text{px}$ | • Tata letak tumpuk satu kolom (*single-column stacked*).<br>• Tombol ramah sentuhan selebar layar (target sentuh $\ge 44\text{px}$).<br>• Menu laci navigasi hamburger mobile (`#mobile-menu-toggle`).<br>• Tabel temuan audit dan kartu metrik yang dapat digeser secara horizontal.<br>• Tipografi proporsional (`text-xl` hingga `text-2xl`). |
| **Tablet** | $768\text{px}$ (`md:`) | • Tata letak grid dua kolom untuk statistik dan showcase modul.<br>• Lencana metrik berdampingan dengan jarak padding proporsional ($1.5\text{rem}$ / $24\text{px}$).<br>• Bar navigasi horizontal yang ringkas dan kontrol pengalih tema yang mudah dijangkau. |
| **Desktop** | $\ge 1024\text{px}$ (`lg:`) | • Tata letak multi-kolom (sistem grid 12 kolom pada `/scan` dan `/report`).<br>• Konfigurasi audit berdampingan yang persisten dengan panel telemetri konsol waktu nyata.<br>• Efek rotasi isometrik 3D penuh dan pendaran spotlight kursor (`.spotlight-card`).<br>• Batasan lebar maksimum (`max-w-7xl` / $1280\text{px}$) demi keterbacaan yang ergonomis. |

### Penanganan Khusus Perangkat Sentuh (Tablet & Mobile):
1. **Pencegahan Pemotongan Teks 3D (3D Flattening on Touch):** Pada layar sentuh atau resolusi $< 1024\text{px}$, transformasi 3D `perspective` dan `rotateX/rotateY` otomatis dinetralkan (`transform: none !important;`) melalui media query `@media (max-width: 1023px), (hover: none)` agar teks dan elemen tidak terpotong (*clipped*) atau memicu scrollbar horizontal tak diinginkan. Kedalaman visual tetap dipertahankan melalui bayangan bertingkat (*multi-layered shadow*).
2. **Umpan Balik Taktil Layar Sentuh (`.touch-tactile`):** Memberikan animasi mikro kompresi fisik elastis (`:active { transform: scale(0.98); }`) saat tombol atau kartu ditekan dengan jari, menghadirkan nuansa aplikasi native.

---

## ♿ 9. Aksesibilitas Web (WCAG 2.1 AA)

Untuk memenuhi tolok ukur aksesibilitas modern tingkat institusional, platform ini mengimplementasikan:

* **Struktur HTML Semantik:** Disusun menggunakan `<header>`, `<nav>`, `<main id="main-content">`, `<section>`, `<article>`, `<aside>`, dan `<footer role="contentinfo">`.
* **Hierarki Heading Tunggal:** Tepat satu `<h1>` per halaman, diikuti oleh hubungan hierarkis induk-anak `<h2>` dan `<h3>` yang logis tanpa loncatan level.
* **Tautan Langsung ke Konten Utama (Skip to Main Content):** Tautan pintasan keyboard (`focus:not-sr-only`) yang ditempatkan di posisi teratas pada [`Navbar.tsx`](src/components/layout/Navbar.tsx) sehingga pengguna keyboard dapat melompati navigasi header secara langsung menuju `#main-content`.
* **Aksesibilitas Formulir:** Semua input ditautkan secara eksplisit via `htmlFor` dan `id`. Status validasi dinamis dikomunikasikan melalui `aria-invalid`, `aria-required`, dan `aria-describedby`.
* **ARIA Live Regions:** Peringatan kesalahan dan pembaruan progres audit menggunakan `role="alert"` dan `aria-live="polite"`.
* **Kontras Warna Standar WCAG:** Seluruh teks foreground memenuhi rasio kontras minimum WCAG AA (minimal $4.5:1$ untuk teks biasa, $3:1$ untuk heading besar) terhadap palet 7 warna samudra baik mode gelap (`#001D39`) maupun mode terang (`#F4F8FB`).
* **Visibilitas Fokus:** Ring fokus 2px berwarna cyan langit (`#7BBDE8` / `#22d3ee`) yang jelas pada seluruh elemen interaktif melalui pseudo-class `:focus-visible`.

---

## 🧪 10. Kebutuhan Pengujian & Bukti Uji

### Pengujian Unit Skema Validasi Zod (10 Kasus Uji)
Pengujian unit otomatis untuk skema deklaratif Zod 4 di [`test/skema.test.ts`](test/skema.test.ts) dijalankan langsung menggunakan test runner native Node.js (`node:test`) dan `tsx`:

```bash
npx tsx test/skema.test.ts
```

| # | Skenario Kasus Uji Skema Zod | Parameter Input Uji | Ekspektasi | Hasil Pengujian | Status |
|---|---|---|---|---|:---:|
| 1 | **Label Valid** | Label 3–80 karakter, spasi diapit | `safeParse().success === true`, spasi ditrim rapi | Berhasil tervalidasi & sanitasi | **PASS** |
| 2 | **Label Tidak Valid** | String kosong `""` atau `< 3` karakter | `safeParse().success === false`, galat label muncul | Ditolak dengan pesan jelas | **PASS** |
| 3 | **Target URL Valid** | `https://portal.kampus.ac.id/siak` | `safeParse().success === true`, URL utuh | Berhasil tervalidasi | **PASS** |
| 4 | **Target URL Protokol Salah** | `ftp://portal.kampus.ac.id` / `portal.id` | Ditolak, wajib diawali `http://` atau `https://` | Ditolak dengan pesan protokol | **PASS** |
| 5 | **Target URL Domain Rusak** | `https://portal_kampus_tanpa_dot` | Ditolak, wajib memiliki hostname bertitik (FQDN) | Ditolak dengan pesan hostname | **PASS** |
| 6 | **Audit Scope Enum Valid** | `"standard"`, `"full"`, `"ssl-only"` | `safeParse().success === true`, tolak nilai sembarang | Diterima untuk ketiga nilai legal | **PASS** |
| 7 | **ASVS Level Enum Valid** | `"L1"`, `"L2"`, `"L3"` | `safeParse().success === true`, tolak level selain itu | Diterima untuk ketiga level | **PASS** |
| 8 | **Interval Jam Preprocessing** | String kosong `""` $\rightarrow$ `undefined`, integer 1–168 | Nilai kosong diabaikan, rentang 1–168 diizinkan | Berhasil diproses & tervalidasi | **PASS** |
| 9 | **Auditor Email Preprocessing** | String kosong `""` $\rightarrow$ `undefined`, format RFC valid | String kosong aman, format email valid diterima | Berhasil diproses & tervalidasi | **PASS** |
| 10 | **Skema Masuk Autentikasi** | Email valid + Sandi $\ge 8$ karakter | `safeParse().success === true`, tolak sandi pendek | Kredensial valid diterima | **PASS** |

> **Hasil Eksekusi:** `10 / 10 tests passed (100% SUCCESS, 0 failed)`.

---

### Verifikasi Rute Dinamis, Error Handling, & Siklus Hidup (Modul 4)

Pengujian arsitektur Next.js 16 App Router pada Milestone Pekan 4 (Modul 4) didokumentasikan secara rinci di [`docs/praktikum/modul-04.md`](docs/praktikum/modul-04.md):

| # | Skenario Pengujian | Rute / Komponen | Perilaku yang Diharapkan | Hasil Pengujian | Status |
|---|---|---|---|---|:---:|
| 1 | **Rute Dinamis Valid** | `/report/scan-2025-001` | Mengurai parameter asinkron `await params`, memanggil `cariLaporan()` dari modul data aman `lib/data.ts` (`server-only`), menampilkan detail audit lengkap | Header audit, skor 82, temuan kerentanan, dan rekomendasi berhasil ditampilkan | **PASS** |
| 2 | **Validasi Regex & 404** | `/report/scan-999` atau format non-regex | Menolak ID yang tidak sesuai pola `/^scan-\d{4}-\d{3}$/` atau data tidak ditemukan dengan memanggil `notFound()` | Menampilkan antarmuka khusus 404 (`app/not-found.tsx`) dengan link kembali ke Beranda | **PASS** |
| 3 | **Persistensi State Layout** | `app/report/layout.tsx` (`KolomCatatan`) | Input catatan pada layout mempertahankan nilainya saat navigasi antar laporan (`/report` ➔ `/report/scan-2025-001`) | Nilai input tetap tersimpan (*persistent*), instance komponen layout tidak di-remount | **PASS** |
| 4 | **Reset State Template** | `app/report/template.tsx` (`KolomCatatan`) | Input catatan pada template di-remount dan dikosongkan ulang setiap pergantian rute anak | Nilai input ter-reset ke string kosong, instance komponen template dibuat baru | **PASS** |
| 5 | **Suspense Loading Fallback** | `loading.tsx` / Suspense | Menampilkan animasi skeleton/spinner saat data laporan sedang di-resolve secara asinkron | Loading state muncul sebelum data siap, mencegah layout shift | **PASS** |
| 6 | **Error Boundary Recovery** | `error.tsx` (`"use client"`) | Menangkap runtime error tak terduga dan menyediakan tombol "Coba Lagi" (`reset()`) | Galat terisolasi tanpa merusak root layout dan navigasi | **PASS** |
| 7 | **Navigasi Aktif Aksesibel** | `TautanNav.tsx` (`usePathname`) | Menandai tab navigasi aktif dengan kelas visual tersorot dan atribut `aria-current="page"` | Screen reader mengumumkan halaman aktif, indikator visual cyan menyala | **PASS** |

---

### Laporan Audit Aksesibilitas Lighthouse

Pengujian dilakukan menggunakan Google Chrome Lighthouse di seluruh rute aplikasi untuk memverifikasi kepatuhan terhadap standar aksesibilitas WCAG 2.1 Level AA:

| Halaman yang Diuji | Rute | Skor Aksesibilitas | Status | Verifikasi Kunci |
|---|---|:---:|:---:|---|
| **Halaman Laporan Eksekutif** | `/report` | **96 / 100** | ✅ **MELAMPAUI TARGET** | `<main>` semantik, lencana kontras tinggi, struktur tabel, tombol aksesibel |
| **Halaman Beranda / Landing Page** | `/` | **96 / 100** | ✅ **MELAMPAUI TARGET** | `<h1>` tunggal, tautan Skip link, tab ARIA deskriptif, navigasi keyboard |
| **Halaman Pemindai Keamanan** | `/scan` | **95 / 100** | ✅ **MELAMPAUI TARGET** | Label aksesibel, `role="alert"`, inline errors, `role="progressbar"` |
| **Halaman Matriks OWASP ASVS** | `/asvs` | **95 / 100** | ✅ **MELAMPAUI TARGET** | Input pencarian berlabel, tombol toggle status aksesibel, landmark jelas |

---

## 🚀 11. Panduan Menjalankan Proyek

### Prasyarat
* **Node.js** v20+ atau v22+ (direkomendasikan untuk eksekusi native `node:test`)
* **npm** v10+

### Panduan Langkah demi Langkah

```bash
# 1. Masuk ke direktori proyek
cd tripleemat

# 2. Pasang seluruh dependensi yang diperlukan
npm install

# 3. Jalankan server pengembangan Next.js
npm run dev
```

Buka peramban Anda dan akses: **[http://localhost:3000](http://localhost:3000)**

### Skrip Pengujian & Validasi Kualitas

```bash
# 1. Jalankan pengujian unit skema validasi Zod 4 (10 kasus uji otomatis)
npx tsx test/skema.test.ts

# 2. Jalankan pengujian unit mesin kriptografi FIPS 199
npm run test:crypto

# 3. Jalankan pemeriksaan tipe statis TypeScript ketat
npx tsc --noEmit

# 4. Jalankan analisis linter kode ESLint
npm run lint

# 5. Kompilasi build produksi Next.js
npm run build

# 6. Jalankan server produksi
npm run start
```

---

## 📚 12. Dokumentasi Praktikum Terkait

* **Laporan Praktikum Modul 5 (Formulir, Validasi, Server Action, Sesi & Cookie):** [`docs/praktikum/modul-05.md`](docs/praktikum/modul-05.md) — Dokumentasi komprehensif implementasi formulir mutasi Server Action, skema validasi Zod 4 (`skemaTarget`, `skemaMasuk`), proteksi cookie sesi `HttpOnly` berstandar FIPS 199, penapisan rute `proxy.ts`, 10 matriks pengujian otomatis, serta 5 tangkapan layar pengujian teknis.
* **Laporan Praktikum Modul 4 (Next.js App Router):** [`docs/praktikum/modul-04.md`](docs/praktikum/modul-04.md) — Mengulas implementasi rute dinamis `/report/[id]`, klasifikasi Server vs Client Component, observasi perbedaan siklus hidup layout vs template, pembatasan eksekusi kode melalui `server-only`, serta 4 bukti tangkapan layar pengujian.
* **Rangkuman Proyek & Kriptografi:** [`Rangkuman Tripleemat.md`](Rangkuman%20Tripleemat.md) — Ringkasan eksekutif dan implementasi modul kriptografi FIPS 199.
* **Inventaris Aset Keamanan:** [`security/asset-inventory.md`](security/asset-inventory.md) — Tabel penilaian dampak CIA FIPS 199.
* **Model Ancaman STRIDE:** [`security/threat-modeling.md`](security/threat-modeling.md) — Analisis batas kepercayaan dan mitigasi ancaman.
* **Log Penggunaan Gen-AI:** [`AI-Log .md`](AI-Log%20.md) — Transparansi peran AI dan verifikasi mandiri pengembang.

---

## 🔒 Keamanan & Transparansi AI

* **Tidak Ada Kredensial Rahasia:** Repositori ini tidak memuat private key, API secret, maupun kredensial produksi nyata.
* **Hanya Data Sintetis:** Seluruh domain target audit (`kampus.ac.id`) dan laporan pemindaian menggunakan data tiruan sintetis.
* **Keterbukaan AI:** Seluruh interaksi pair-programming AI dan verifikasi mandiri manusia didokumentasikan secara transparan dalam [`AI-Log .md`](AI-Log%20.md).

