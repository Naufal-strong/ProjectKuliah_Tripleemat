# DFD — Tripleemat Security Assessor

Tag: `sec-0.1`

DFD ini merefleksikan implementasi produk Tripleemat saat ini: aplikasi web Next.js dengan validasi form scan, analisis HTTP/TLS pasif, evaluasi matriks OWASP ASVS, pembuatan laporan, dan verifikasi kriptografi yang diimplementasikan di `src/lib/crypto`.

## Diagram Aliran Data

```mermaid
flowchart LR
    subgraph TB1 ["Trust Boundary 1: Lingkungan eksternal yang tidak tepercaya"]
        E1["EE-1\nSecurity Auditor"]
        E2["EE-2\nTarget Web Application"]
    end

    subgraph TB2 ["Trust Boundary 2: Runtime aplikasi / DMZ"]
        P1["P1\nTarget Setup & Scope Manager"]
        P2["P2\nPassive Scan Engine"]
        P3["P3\nASVS Compliance Evaluator"]
        P4["P4\nReport & Scorecard Generator"]
    end

    subgraph TB3 ["Trust Boundary 3: Lapisan data internal yang aman"]
        DS1[("DS-1\nRuleset Vault\n[SHA-256 verified]")]
        DS2[("DS-2\nScan log cache\n[HMAC-SHA256]")]
        DS3[("DS-3\nAudit results DB\n[AES-256-GCM]")]
        AST4[("AST-04\nAuditor secrets & session tokens\n[Argon2 / CSPRNG]")]
    end

    E1 -->|"DF-01\nURL, scope, dan profil ASVS"| P1
    P1 -->|"DF-02\nPermintaan scan ke target"| E2
    E2 -->|"DF-03\nHeader HTTP dan metadata TLS"| P2

    DS1 -->|"DF-04\nRuleset dan kriteria ASVS"| P2
    P2 -->|"DF-05\nLog scan mentah"| DS2
    DS2 -->|"DF-06\nBukti cache untuk laporan"| P4

    E1 -->|"DF-07\nChecklist dan input kepatuhan"| P3
    DS1 -->|"DF-08\nModel ruleset dan skor"| P3
    P3 -->|"DF-09\nTemuan dan pembaruan skor"| DS3
    DS3 -->|"DF-10\nTemuan final dan catatan audit"| P4
    P4 -->|"DF-11\nEkspor laporan PDF / scorecard final"| E1

    P1 -->|"DF-12\nMetadata autentikasi & sesi"| AST4
    P4 -->|"DF-13\nPayload audit yang ditandatangani"| DS3
```

## Inventaris Elemen

- EE-1: Security Auditor / pengguna yang memasukkan URL target dan menerima laporan.
- EE-2: Aplikasi web target yang sedang diaudit.
- P1: Target setup and scope manager, termasuk validasi nilai URL/host pada alur form `/scan`.
- P2: Passive security and SSL scanner engine, yang membaca header HTTP dan metadata TLS.
- P3: ASVS compliance evaluator, yang membandingkan temuan target dengan control ASVS dan menghasilkan bukti skor.
- P4: Report and scorecard generator yang membuat output yang dapat diekspor untuk auditor.
- DS-1: Ruleset vault yang menyimpan kriteria ASVS dan definisi scoring.
- DS-2: Raw scan cache untuk metadata respons dan temuan sementara.
- DS-3: Database hasil audit persisten dengan artefak laporan yang ditandatangani.
- AST-04: Penyimpanan secret auditor dan token sesi.

## Batas Kepercayaan (Trust Boundaries)

1. TB-1: Batas eksternal yang tidak tepercaya antara browser auditor dan aplikasi target jarak jauh.
2. TB-2: Batas runtime aplikasi yang berisi Next.js runtime, logic scanner, dan engine evaluasi kepatuhan.
3. TB-3: Batas data internal yang aman yang berisi ruleset vault, cache scan, database hasil, dan material secret.

## Aset yang Dilindungi Kriptografi

- DS-1: Diverifikasi dengan hash SHA-256 sebelum digunakan.
- DS-2: Melindungi bukti scan mentah dengan tanda tangan HMAC-SHA256.
- DS-3: Menyimpan temuan dengan enkripsi AES-256-GCM dan authenticated tag.
- AST-04: Menggunakan token CSPRNG OS dan hashing password berbasis Argon2 untuk secret dan material sesi.

## Catatan

- DFD ini menunjukkan alur permintaan dan data aktual dari produk, bukan platform penilaian keamanan generik.
- Data dianggap sensitif saat disimpan atau diekspor, terutama temuan audit, scorecard, dan material secret.
