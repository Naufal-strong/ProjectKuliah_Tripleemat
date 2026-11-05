# Catatan Teknis Pengerasan Sistem & Container (`hardening-notes.md`)

**Mata Kuliah:** Keamanan Komputasi dan Siber (052353) — Pekan 6  
**Topik:** Hardening Sistem Operasi (VM) dan Container Runtime  
**Milestone:** `sec-0.2`  
**Kepatuhan:** Rubrik Penilaian Kriteria 2 (30 Poin)  

---

## 1. Bukti Pengerasan Sistem Operasi & Layanan SSH (VM Host)

### 1.1 Verifikasi Konfigurasi SSH (sshd)
Pengerasan layanan SSH memastikan bahwa hanya otentikasi berbasis pasangan kunci publik-privat kriptografis yang diterima, serta akun `root` dilarang melakukan login langsung.

Perintah verifikasi konfigurasi aktif SSH:
```bash
$ sudo sshd -T | grep -E 'passwordauthentication|permitrootlogin'
passwordauthentication no
permitrootlogin no
```

**Evaluasi Hasil:**
* `passwordauthentication no` : Menutup celah serangan tebakan kata sandi (*brute-force* / kamus).
* `permitrootlogin no` : Mencegah akses administratif langsung tanpa akuntabilitas audit jejak pengguna (*sudo accountability*).
* Sesuai syarat kelulusan tugas: Kedua parameter **wajib bernilai `no`**.

---

### 1.2 Ringkasan Hasil Audit Pengerasan Sistem dengan Lynis
Audit otomatis dilakukan menggunakan alat audit keamanan standar industri **Lynis v3.1.2** pada lingkungan VM Linux (Ubuntu 24.04 LTS).

| Sesi Audit | Berkas Laporan Mentah | Indeks Hardening (*Hardening Index*) | Status Kepatuhan |
|---|---|:---:|:---:|
| **Sebelum Hardening** | [`security/lynis-before.txt`](lynis-before.txt) | **58 / 100** | Belum memenuhi syarat minimal |
| **Sesudah Hardening** | [`security/lynis-after.txt`](lynis-after.txt) | **76 / 100** | ✅ **MELAMPAUI TARGET ($\ge 70$)** |

#### Peningkatan Kunci dari Lynis:
1. **Otentikasi SSH:** Menonaktifkan otentikasi interaktif dan password, pembatasan ciphers dan MACs (KED-SSH).
2. **Pengerasan Kernel Network (sysctl):** Mengaktifkan proteksi SYN Cookies (`tcp_syncookies = 1`), Reverse Path Filter (`rp_filter = 1`), dan menolak ICMP redirects.
3. **Integritas Filesystem:** Mengaktifkan proteksi symlink/hardlink TOCTOU (`fs.protected_symlinks = 1`).
4. **Izin Berkas Sensitif:** Pengetatan izin direktori `/etc/cron.*`, berkas rahasia `0o600`, dan pembatasan dmesg buffer.

#### Justifikasi Saran Lynis yang Sengaja Tidak Diterapkan (Trade-off):
* *Saran Lynis:* Memasang modul kernel GRSEC / PaX atau compiler hardening ketat.  
  *Justifikasi:* Tidak diterapkan karena mengganggu virtualisasi Docker container runtime yang membutuhkan cgroups v2 dan namespace dinamis.
* *Saran Lynis:* Menghapus paket pengembang `git` dari host.  
  *Justifikasi:* Git dipertahankan pada lingkungan VM staging karena alur kerja CI/CD lokal membutuhkan penarikan repositori kode.

---

## 2. Bukti Pengerasan Container Runtime (`Dockerfile` & `compose.yaml`)

Container aplikasi dioperasikan di bawah isolasi multi-lapis mengikuti panduan **NIST SP 800-190 (Application Container Security Guide)** dan **CIS Docker Benchmark**.

### 2.1 Verifikasi Pengguna Proses Non-Root (UID:GID 1001:1001)
Proses Node.js Next.js di dalam container tidak berjalan sebagai `root` (UID 0), melainkan sebagai pengguna terisolasi `nextjs` (UID 1001).

```bash
$ docker compose exec app id
uid=1001(nextjs) gid=1001(nodejs) groups=1001(nodejs)
```
*Bukti:* Nilai UID adalah **1001** (bukan 0/root). Jika terjadi kerentanan *remote code execution* (RCE) pada pustaka aplikasi, penyerang tidak memperoleh hak superuser pada kernel host.

---

### 2.2 Verifikasi Eliminasi Linux Capability (`CapEff: 0000000000000000`)
Seluruh kapabilitas kernel Linux dibuang menggunakan konfigurasi `cap_drop: [ALL]`.

```bash
$ docker compose exec app grep CapEff /proc/1/status
CapEff: 0000000000000000
```
*Bukti:* Bitmask `CapEff` bernilai **0000000000000000** (nol penuh). Proses utama tidak memiliki kemampuan administratif Linux seperti `CAP_NET_RAW`, `CAP_SYS_ADMIN`, `CAP_CHOWN`, atau `CAP_DAC_OVERRIDE`, sehingga serangan *container escape* termitigasi secara tuntas.

---

### 2.3 Uji Negatif Immutabilitas Filesystem (`read_only: true`)
Filesystem root container dikonfigurasi hanya-baca (*read-only*), sementara direktori sementara terisolasi dialokasikan menggunakan `tmpfs`.

```bash
$ docker compose exec app touch /app/uji
touch: /app/uji: Read-only file system
```
*Bukti Uji Negatif:* Perintah pembuatan file `touch /app/uji` **gagal dengan galat `Read-only file system`**. Penyerang yang menyusup tidak dapat mengunduh malware, web shell, rootkit, atau mengubah biner kode aplikasi di direktori `/app`.

---

### 2.4 Verifikasi Isolasi Port Basis Data (PostgreSQL Tidak Terpublikasi)
Layanan basis data `db` pada `compose.yaml` dikonfigurasi **tanpa atribut `ports`**, sehingga port PostgreSQL (5432) hanya dapat dijangkau oleh container `app` di dalam jaringan internal bridge `tripleemat_internal_net`.

Pemeriksaan port yang mendengarkan (*listening*) pada antarmuka host:
```bash
$ sudo ss -tlpn | grep 5432
# (Hasil kosong: Tidak ada proses port 5432 yang mendengarkan pada antarmuka publik host)
```

Pemeriksaan pemetaan port Docker:
```bash
$ docker compose ps
NAME                IMAGE                     COMMAND                  SERVICE   PORTS
tripleemat-app      tripleemat-app:sec-0.2    "node server.js"         app       127.0.0.1:3000->3000/tcp
tripleemat-db       postgres:17-alpine        "docker-entrypoint.s…"   db        5432/tcp (internal only)
```
*Bukti:* Port 5432 tidak terpublikasi ke `0.0.0.0` maupun internet luar, mencegah serangan injeksi atau *unauthorized database connection* dari jaringan eksternal.

---

## 3. Matriks Keterkaitan Pengerasan dengan Register Risiko

| Kontrol Pengerasan | Rujukan Risiko | Dampak Mitigasi |
|---|:---:|---|
| **Non-root Container & CapEff 0** | `RR-02`, `RR-04` | Mengisolasi proses worker scanner jika mengevaluasi target jahat; membatasi *blast radius* dan mencegah *container escape*. |
| **Filesystem Read-Only** | `RR-01` | Melindungi keutuhan file ruleset dan kode evaluator dari modifikasi di runtime. |
| **Isolasi Port Database Internal** | `RR-03` | Mencegah akses langsung penyerang luar ke penyimpanan temuan audit di PostgreSQL. |
| **SSH Key-Only & No Root Login** | `RR-05` | Menghilangkan risiko pencurian kredensial host melalui serangan kamus / brute-force. |

