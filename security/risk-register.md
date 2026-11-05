# Risk Register — Tripleemat Security Assessor

**Milestone:** `sec-0.2` — Access Control, System Hardening, & Supply Chain Security  
**Tag:** `sec-0.2` (Updated from `sec-0.1`)  
**Status:** Controls Implemented & Verified (Task 2 Milestone)  

---

## 1. Priority Risk Selection & Status Update (Milestone `sec-0.2`)

The following five risks were established in Task 1 (`sec-0.1`). In Task 2 (`sec-0.2`), concrete technical controls have been implemented, hardened, and verified to mitigate these risks.

| Risk ID | Threat Description | Inherent Risk | Implemented Control in Task 2 (`sec-0.2`) | Residual Risk | Status |
|---|---|:---:|---|:---:|:---:|
| **RR-01** | Ruleset & report tampering against DS-1 / DS-2 | **HIGH** | Kanonisasi JSON ($T1$) + SHA-256 + HMAC-SHA256 (`vault.ts`) + Read-only container rootfs (`compose.yaml`). | **LOW** | ✅ IMPLEMENTED |
| **RR-02** | SSRF / internal metadata probing via target URL | **HIGH** | URL parser allowlist validation (`skemaTarget`) + Worker non-root (UID 1001) + `cap_drop: ALL` (mencegah manipulasi raw socket). | **LOW** | ✅ IMPLEMENTED |
| **RR-03** | Audit findings disclosure from DS-3 (PostgreSQL) | **HIGH** | Enkripsi AEAD AES-256-GCM terikat AAD `targetId` (`vault.ts`) + Isolasi port DB internal (tanpa port 5432 terbit ke host) + RBAC (`access-tests.md`). | **LOW** | ✅ IMPLEMENTED |
| **RR-04** | Scanner DoS / Resource exhaustion by malicious targets | **HIGH** | Next.js fetch timeouts + Throttling + Isolasi container non-root dengan memori dibatasi tmpfs (64MB) + `CapEff: 0`. | **MEDIUM** | ✅ IMPLEMENTED |
| **RR-05** | Auditor credential compromise & host impersonation | **HIGH** | Hashing lambat Argon2id ($m=65536, t=3, p=4$) + Cookie sesi stateful FIPS 199 + SSH Key-only (`PasswordAuthentication no`, `PermitRootLogin no`) + Lynis Score 76. | **LOW** | ✅ IMPLEMENTED |

---

## 2. Detailed Verification of Controls (Task 2)

### RR-01 — Ruleset & Report Tampering against DS-1
- **Affected Asset:** DS-1 (Assessment Rules Vault) & DS-2 (Scan Logs)
- **Implemented Control (sec-0.2):**
  1. *Kriptografi:* Fungsi `segelLaporan()` di `src/lib/crypto/vault.ts` mengikat laporan dengan Kanonisasi leksikografis ($T1$) $\rightarrow$ SHA-256 ($T1$) $\rightarrow$ HMAC-SHA256 ($T2$).
  2. *Container Immutability:* Direktori kode dan ruleset di container di-mount dengan mode `read_only: true` (`compose.yaml`). Percobaan `touch /app/uji` terbukti ditolak dengan error `Read-only file system`.
- **Status Verifikasi:** 100% Lulus pada Unit Test Kriptografi 4.1 s.d. 4.5.

### RR-02 — SSRF / Internal Metadata Probing via Target URL
- **Affected Asset:** Host Network & Cloud Metadata Endpoint (EE-2)
- **Implemented Control (sec-0.2):**
  1. *Validasi Masukan:* Skema Zod 4 `skemaTarget` mewajibkan protokol HTTP/S dan memvalidasi Fully Qualified Domain Name (FQDN), menolak format IP privat dan domain lokal secara fail-closed.
  2. *Container Isolation:* Container aplikasi dijalankan dengan `cap_drop: - ALL` dan `security_opt: - no-new-privileges:true`. Bitmask `CapEff` bernilai `0000000000000000` sehingga penyerang tidak dapat memanfaatkan soket mentah (`CAP_NET_RAW`) untuk scanning jaringan internal.
- **Status Verifikasi:** Lulus verifikasi inspeksi bitmask kernel dan 10 skenario validasi Zod.

### RR-03 — Audit Findings Disclosure from DS-3
- **Affected Asset:** DS-3 (PostgreSQL Database) & Temuan Kerentanan
- **Implemented Control (sec-0.2):**
  1. *Kerahasiaan Kriptografis:* Seluruh bukti eksploitasi dan detail kerentanan dienkripsi dengan AEAD AES-256-GCM via `arsipTemuanSensitif()` yang mengikat ciphertext ke `targetId` melalui AAD.
  2. *Isolasi Port Basis Data:* Layanan `db` di `compose.yaml` dijalankan **tanpa arahan `ports`**. Port 5432 hanya terhubung ke bridge `tripleemat_internal_net` dan tidak terekspos ke host (`sudo ss -tlpn | grep 5432` kosong).
  3. *Otorisasi RBAC:* Hak akses detail temuan dibatasi hanya untuk peran `Auditor` dan `Admin` (`access-tests.md`). Tamu yang mencoba mengakses dialihkan ke halaman login.
- **Status Verifikasi:** Lulus Uji 5.1–5.3 Kriptografi dan Uji Akses UJI-NEG-01 s.d. UJI-NEG-03.

### RR-04 — Scanner DoS Caused by Malicious Target Responses
- **Affected Asset:** P2 Processing Capacity & DS-2 Cache
- **Implemented Control (sec-0.2):**
  1. *Isolasi Resource:* Container runtime dibatasi dengan filesystem read-only dan alokasi `tmpfs /tmp` maksimal 64 MB untuk mencegah pembengkakan disk akibat payload respon raksasa (*zip bomb / slowloris cache*).
  2. *Least Privilege:* Proses worker berjalan sebagai non-root (UID 1001) tanpa kapabilitas sistem, membatasi dampak jika worker terhenti karena timeout.
- **Status Verifikasi:** Terverifikasi pada pengujian runtime container dan simulasi abort controller timeout.

### RR-05 — Auditor Credential Compromise and Impersonation
- **Affected Asset:** AST-04 (Credentials & Session Tokens) & Host Access
- **Implemented Control (sec-0.2):**
  1. *Password Storage Hashing Lambat:* Kata sandi disimpan menggunakan **Argon2id (RFC 9106)** dengan parameter memory-hard $m=65536\text{ KiB}, t=3, p=4$ dan salt 16-byte CSPRNG (`access-tests.md`), kebal terhadap offline GPU brute-force.
  2. *Cookie Sesi Stateful:* Sesi auditor dikelola melalui cookie bertipe `HttpOnly`, `SameSite=Lax`, dan `Secure` berstandar FIPS 199.
  3. *Host SSH Hardening:* Login SSH pada VM diubah menjadi **Kunci Publik Saja** (`PasswordAuthentication no`, `PermitRootLogin no`), menghasilkan kepatuhan audit Lynis skor **76 / 100** (naik dari skor awal 58).
- **Status Verifikasi:** Verifikasi `sudo sshd -T` menghasilkan `passwordauthentication no` dan `permitrootlogin no`. Lulus uji akses UJI-NEG-06.

---

## 3. Control Mapping Summary

| Risk ID | Fokus Kontrol Primer | Implementasi Spesifik di sec-0.2 | Status Verifikasi |
|---|---|---|:---:|
| **RR-01** | Integritas Dokumen & Ruleset | Kanonisasi T1 + HMAC T2 + Filesystem Container Read-only | ✅ Lulus 100% |
| **RR-02** | Mitigasi SSRF & Privilese Jaringan | Skema Zod 4 + Container `cap_drop: ALL` (CapEff 0) | ✅ Lulus 100% |
| **RR-03** | Proteksi Data Temuan Sensitif | AEAD AES-256-GCM + DB Internal Tanpa Ports + RBAC | ✅ Lulus 100% |
| **RR-04** | Ketahanan Scanner & Isolasi | Batasan Resource `tmpfs` + User Non-root UID 1001 | ✅ Lulus 100% |
| **RR-05** | Keamanan Kredensial & VM | Hash Lambat Argon2id + SSH Kunci-Only + Lynis 76 | ✅ Lulus 100% |

---

## 4. Overall Assessment

Seluruh kontrol teknis mitigasi risiko prioritas `RR-01` sampai `RR-05` telah berhasil diterapkan secara komprehensif pada lapisan **Sistem Operasi (VM)**, **Container Runtime (Docker)**, **Basis Data (PostgreSQL)**, dan **Aplikasi Web (Next.js 16)**. Pengujian objektif membuktikan seluruh upaya akses tidak sah tertolak, indeks pengerasan Lynis melampaui target minimal ($\ge 70$), dan image container bersih dari kerentanan kritis (0 Critical CVEs).
