# 🛡️ Asset & Data Inventory — Tripleemat Security Assessor

**Milestone:** `sec-0.1` — Threat, Vulnerability, and Risk Analysis  
**Tag:** `sec-0.1`  
**Standard Acuan:** FIPS 199, NIST SP 800-30, OWASP ASVS  
**Terakhir Diperbarui:** 2026-10-12  

Dokumen ini memuat inventarisasi aset dan aliran data utama pada platform evaluasi dan audit kepatuhan keamanan siber **Tripleemat Security Assessor**. Penilaian dampak kerahasiaan (*Confidentiality* / C), integritas (*Integrity* / I), dan ketersediaan (*Availability* / A) mengacu pada standar **FIPS 199** (*Standards for Security Categorization of Federal Information and Information Systems*) dan **NIST SP 800-30**.

Aset dan aliran data pada dokumen ini sesuai dengan implementasi produk saat ini: Next.js UI untuk `/scan`, `/asvs`, dan `/report`, serta modul kriptografi di `src/lib/crypto` yang mengecek integritas, menghasilkan token acak, dan mengenkripsi hasil audit.

*Catatan: Seluruh aset yang dilindungi atau divalidasi dengan mekanisme kriptografi industri (`node:crypto`) ditandai dengan label **[Proteksi Kriptografi]**.*

---

## 1. Inventarisasi Aset Utama (Data, Secrets, Software, & Host)

| ID Asset | Nama Asset | Kategori | Lokasi / Penyimpanan | Pemilik | C | I | A | Alasan Rating CIA & Proteksi Kriptografi |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **AST-01** | Assessment Rules & Criteria Vault (DS-1) **[Proteksi Kriptografi]** | Data / Config | File JSON / Internal DB (`asvs-rules.json`) | Security Engineer | **L** | **H** | **M** | **C:** Aturan audit berbasis publik (OWASP ASVS / NIST).<br>**I:** Manipulasi aturan langsung merusak validitas skor kepatuhan.<br>**A:** Ketersediaan sedang.<br>**Kriptografi:** Diverifikasi dengan **SHA-256 Hash Integrity** (`integrity.ts`) saat runtime. |
| **AST-02** | Scan Logs & Raw Response Headers (DS-2) **[Proteksi Kriptografi]** | Data | In-Memory / Redis / Temporary Cache | Security Analyst | **M** | **M** | **L** | **C:** Memuat respons header dan informasi endpoint target.<br>**I:** Manipulasi memicu kesalahan analisis scanner.<br>**A:** Log bersifat sementara (*ephemeral*).<br>**Kriptografi:** Divalidasi dengan **HMAC-SHA256** untuk menjamin integritas cache respons. |
| **AST-03** | Audit Results & Scorecard DB (DS-3) **[Proteksi Kriptografi]** | Data | PostgreSQL Database | Lead Security Auditor | **H** | **H** | **M** | **C:** Memuat daftar celah keamanan & temuan kerentanan aplikasi target.<br>**I:** Manipulasi merusak laporan audit dan status kelulusan.<br>**A:** Ketersediaan sedang.<br>**Kriptografi:** Enkripsi at-rest berbasis **AES-256-GCM** dengan IV 12-byte per panggilan dan 16-byte Auth Tag. |
| **AST-04** | Auditor Credentials & Session Tokens **[Proteksi Kriptografi]** | Secrets | `.env` / Token Store / Secure Cookie | System Administrator | **H** | **H** | **L** | **C:** Kebocoran memberi akses penuh ke laporan dan pemicuan scan.<br>**I:** Pemalsuan merusak mekanisme otentikasi.<br>**A:** Berdampak pada persistensi sesi.<br>**Kriptografi:** Hash password menggunakan Argon2/Bcrypt & token sesi 256-bit dibangkitkan dari **CSPRNG** kernel OS (`csprng.ts`). |
| **AST-05** | Assessment Dashboard UI Engine | Software | Next.js 16 Web Application | Frontend Dev | **L** | **H** | **H** | **C:** Antarmuka web pengguna evaluasi.<br>**I:** *Tampering/Defacement* merusak tampilan metrik evaluasi.<br>**A:** Downtime membuat auditor tidak dapat mengakses fungsi platform. |
| **AST-06** | Passive Scanner & Header Analyzer Worker | Software | Node.js Backend Service / Container | Backend Dev | **L** | **H** | **H** | **C:** Engine penguji header & SSL target.<br>**I:** Manipulasi logika menghasilkan *false positive/negative*.<br>**A:** Service down melumpuhkan fungsi audit otomatis. |
| **AST-07** | Report Generator & Scorecard Engine | Software | Backend PDF Service | Backend Dev | **L** | **M** | **M** | **C:** Modul pengekspor laporan audit PDF.<br>**I:** Kerusakan memicu cacat format sertifikat/laporan.<br>**A:** Menghambat penerbitan bukti fisik kepatuhan. |
| **AST-08** | Server Host Platform Assessment | Host | Cloud VM / Docker Host | DevOps / Sysadmin | **M** | **H** | **H** | **C:** Akses VM memberikan kendali atas seluruh database audit.<br>**I:** Kompromi host merusak integritas seluruh sistem.<br>**A:** Host mati menyebabkan kegagalan layanan total. |

---

## 2. Inventarisasi Aliran Data (Data in Transit)

| ID Aliran | Nama Aliran Data | Titik Asal | Titik Tujuan | Protokol | Klasifikasi | Kontrol Keamanan |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **FLW-01** | Target URL & Scope Configuration | Auditor Browser (EE1) | Target Setup Manager (P1) | HTTPS / TLS 1.3 | Internal | Validasi input skema URL, Anti-CSRF token |
| **FLW-02** | HTTP Scan Probe Request | Passive Scanner (P2) | Target Web App (EE2) | HTTP / HTTPS | Eksternal | Egress filter, pembatasan target IP privat (SSRF protection) |
| **FLW-03** | Raw Header & SSL Cert Response | Target Web App (EE2) | Passive Scanner (P2) | HTTP / HTTPS | Eksternal | Buffer limit (max 16KB), timeout 10s, parsing aman |
| **FLW-04** | Ruleset Benchmark Query | Rules Vault (DS-1) | Scanner / ASVS Evaluator | Local IPC / File IO | Rahasia Sistem | Verifikasi SHA-256 sebelum deserialisasi |
| **FLW-05** | Audit Scorecard & Findings Data | Compliance Evaluator (P3) | Results DB (DS-3) | TLS (DB Connection) | Sangat Rahasia | Enkripsi AES-256-GCM data at-rest & TLS in-transit |
| **FLW-06** | Generated Audit Report & PDF | Scorecard Engine (P4) | Auditor Browser (EE1) | HTTPS / TLS 1.3 | Rahasia | Otentikasi sesi berbasis cookie `HttpOnly` + CSPRNG token |

---

## 3. Ringkasan Kategori Keamanan FIPS 199

Secara keseluruhan, kategori keamanan sistem (*System Security Categorization*) berdasarkan formula FIPS 199:

$$\text{SC}_{\text{system}} = \{(\text{Confidentiality}, \text{High}), (\text{Integrity}, \text{High}), (\text{Availability}, \text{Moderate})\}$$

* **Dampak Keseluruhan (Overall Impact):** **HIGH (Tinggi)**, karena kompromi pada kerahasiaan hasil audit target (AST-03) atau integritas modul aturan penilaian (AST-01) dapat mengakibatkan kerugian reputasi, pelanggaran hukum privasi, dan validasi palsu terhadap sistem yang rentan.

---
*Keterangan Rating: H = High (Dampak Parah/Kritis), M = Moderate (Dampak Sedang), L = Low (Dampak Ringan)*