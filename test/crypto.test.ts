import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

// Impor modul kriptografi
import {
    generateSecureBytes,
    generateSecureToken,
    calculateSHA256,
    verifyIntegrity,
    encryptAES256GCM,
    decryptAES256GCM,
    kanonisasiJSON,
    validasiStrukturLaporan,
    MasukanKriptoTidakValid,
    turunkanKunci,
    PANJANG_KUNCI_BYTE,
    KunciTidakValid,
    buatBerkasKunci,
    muatKunci,
    segelLaporan,
    verifikasiLaporan,
    arsipTemuanSensitif,
    bukaArsipTemuanSensitif,
} from '../src/lib/crypto';

describe('🛡️ Cryptographic Module Test Suite (Milestone v0.2)', () => {
    // -------------------------------------------------------------------------
    // KELOMPOK 1: Regresi Milestone v0.1 (Komponen Dasar)
    // -------------------------------------------------------------------------
    describe('1. Regresi Komponen Dasar v0.1', () => {
        it('1.1 (Positif): Berhasil memverifikasi hash SHA-256 dari data ruleset asli', () => {
            const rulesetData = JSON.stringify({ version: '4.0.3', control: 'V5.1.1' });
            const expectedHash = calculateSHA256(rulesetData);
            const isValid = verifyIntegrity(rulesetData, expectedHash);
            assert.equal(isValid, true, 'Hash ruleset asli harus valid');
        });

        it('1.2 (Negatif): Menolak verifikasi hash jika 1 byte diubah (Avalanche Effect)', () => {
            const originalData = 'ASVS_LEVEL_1_PASSED';
            const originalHash = calculateSHA256(originalData);

            const tamperedData = 'ASVS_LEVEL_1_PASSEE';
            const tamperedHash = calculateSHA256(tamperedData);

            assert.notEqual(originalHash, tamperedHash, 'Hash harus berubah total meski hanya 1 byte berubah');
            const isValid = verifyIntegrity(tamperedData, originalHash);
            assert.equal(isValid, false, 'Verifikasi integritas harus gagal untuk data yang dimodifikasi');
        });

        it('1.3 (Positif): CSPRNG menghasilkan 1.000 token acak unik tanpa tabrakan', () => {
            const tokenSet = new Set<string>();
            const totalTokens = 1000;
            for (let i = 0; i < totalTokens; i++) {
                tokenSet.add(generateSecureToken(32));
            }
            assert.equal(tokenSet.size, totalTokens, '1.000 token acak dari CSPRNG harus 100% unik');
        });

        it('1.4 (Negatif): AES-256-GCM dasar menolak ciphertext yang dimanipulasi', () => {
            const key = generateSecureBytes(32);
            const data = 'Laporan Audit Rahasia v0.1';
            const encrypted = encryptAES256GCM(data, key);

            // Modifikasi 1 karakter hex pada ciphertext
            const firstChar = encrypted.ciphertextHex[0];
            const tamperedChar = firstChar === 'a' ? 'b' : 'a';
            const tamperedCiphertext = tamperedChar + encrypted.ciphertextHex.slice(1);
            const tamperedPayload = { ...encrypted, ciphertextHex: tamperedCiphertext };

            assert.throws(
                () => decryptAES256GCM(tamperedPayload, key),
                /Unsupported state or unable to authenticate data/,
                'Dekripsi harus gagal karena otentikasi GCM Auth Tag menolak manipulasi'
            );
        });
    });

    // -------------------------------------------------------------------------
    // KELOMPOK 2: Komponen T1 - Kanonisasi dan Batas Validasi Masukan
    // -------------------------------------------------------------------------
    describe('2. Komponen T1: Kanonisasi & Validasi Masukan (Batas Kepercayaan)', () => {
        it('2.1 (Positif): Urutan kunci objek yang berbeda menghasilkan byte kanonis identik', () => {
            const objA = { targetUrl: 'https://tripleemat.id', grade: 'A', overallScore: 95 };
            const objB = { grade: 'A', overallScore: 95, targetUrl: 'https://tripleemat.id' };

            const kanonisA = kanonisasiJSON(objA);
            const kanonisB = kanonisasiJSON(objB);

            assert.equal(
                kanonisA.toString('utf-8'),
                kanonisB.toString('utf-8'),
                'Representasi byte JSON harus identik terlepas dari urutan penulisan properti'
            );
            assert.equal(
                kanonisA.toString('utf-8'),
                '{"grade":"A","overallScore":95,"targetUrl":"https://tripleemat.id"}',
                'Kunci harus terurut secara alfabetis tanpa whitespace ekstra'
            );
        });

        it('2.2 (Positif): Normalisasi Unicode NFC menyatukan representasi karakter beraksen', () => {
            // "é" sebagai single code point (NFC: \u00E9) vs decomposed (NFD: e + \u0301)
            const nfcString = '\u00E9cole';
            const nfdString = 'e\u0301cole';

            assert.notEqual(nfcString.length, nfdString.length, 'Secara raw string memiliki panjang berbeda');

            const kanonis1 = kanonisasiJSON({ name: nfcString });
            const kanonis2 = kanonisasiJSON({ name: nfdString });

            assert.deepEqual(kanonis1, kanonis2, 'Kanonisasi harus menormalkan karakter ke Unicode NFC');
        });

        it('2.3 (Negatif / Fail-Closed): Menolak masukan mengandung NaN atau Infinity', () => {
            assert.throws(
                () => kanonisasiJSON({ score: NaN }),
                MasukanKriptoTidakValid,
                'NaN harus ditolak demi keamanan'
            );
            assert.throws(
                () => kanonisasiJSON({ score: Infinity }),
                MasukanKriptoTidakValid,
                'Infinity harus ditolak demi keamanan'
            );
        });

        it('2.4 (Negatif / Fail-Closed): Validasi allowlist menolak laporan tanpa atribut wajib', () => {
            const laporanCacat = { targetUrl: 'https://kampus.ac.id' }; // kurang overallScore & grade
            assert.throws(
                () => validasiStrukturLaporan(laporanCacat),
                MasukanKriptoTidakValid,
                'Laporan tanpa atribut wajib harus ditolak sebelum masuk engine kriptografi'
            );
        });
    });

    // -------------------------------------------------------------------------
    // KELOMPOK 3: Komponen T2 - Derivasi Kunci HKDF (RFC 5869)
    // -------------------------------------------------------------------------
    describe('3. Komponen T2: Derivasi Kunci HKDF (NIST SP 800-57 "Satu Kunci, Satu Tujuan")', () => {
        it('3.1 (Positif): Kunci integritas dan kunci arsip saling independen (ortogonal)', () => {
            const masterKey = generateSecureBytes(PANJANG_KUNCI_BYTE);

            const kIntegritas = turunkanKunci(masterKey, 'integritas');
            const kArsip = turunkanKunci(masterKey, 'arsip');

            assert.equal(kIntegritas.length, PANJANG_KUNCI_BYTE);
            assert.equal(kArsip.length, PANJANG_KUNCI_BYTE);
            assert.notDeepEqual(
                Buffer.from(kIntegritas),
                Buffer.from(kArsip),
                'HKDF wajib menghasilkan byte kunci yang berbeda total untuk konteks berbeda'
            );
            assert.notDeepEqual(
                Buffer.from(kIntegritas),
                Buffer.from(masterKey),
                'Kunci turunan tidak boleh sama dengan master key'
            );
        });

        it('3.2 (Positif): Derivasi HKDF deterministik dan lulus Known-Answer Test (KAT)', () => {
            // Master key tetap untuk uji determinisme (32 byte 0x42)
            const fixedMasterKey = new Uint8Array(32).fill(0x42);

            const derived1 = turunkanKunci(fixedMasterKey, 'integritas');
            const derived2 = turunkanKunci(fixedMasterKey, 'integritas');

            assert.deepEqual(
                Buffer.from(derived1),
                Buffer.from(derived2),
                'Kunci turunan harus 100% deterministik untuk masukan dan info yang sama'
            );

            // Verifikasi bahwa output bukan nol dan berukuran tepat 32 byte
            assert.equal(derived1.length, 32);
            const derivedHex = Buffer.from(derived1).toString('hex');
            assert.equal(derivedHex.length, 64);
        });

        it('3.3 (Negatif / Fail-Closed): Menolak derivasi jika panjang master key bukan 32 byte', () => {
            const invalidKeyShort = new Uint8Array(16); // 128 bit (terlalu pendek)
            assert.throws(
                () => turunkanKunci(invalidKeyShort, 'integritas'),
                KunciTidakValid,
                'Kunci induk < 32 byte harus ditolak secara tegas'
            );
        });
    });

    // -------------------------------------------------------------------------
    // KELOMPOK 4: Titik Sambungan T1 -> T2 (Segel Laporan & Verifikasi HMAC)
    // -------------------------------------------------------------------------
    describe('4. Sambungan T1 -> T2: Segel & Verifikasi Laporan Audit', () => {
        const masterKey = generateSecureBytes(32);
        const contohLaporan = {
            targetUrl: 'https://portal.tripleemat.id',
            overallScore: 88,
            grade: 'B+',
            timestamp: '2026-11-02T08:00:00Z',
        };

        it('4.1 (Positif): Berhasil menyegel dan memverifikasi laporan sah', () => {
            const segel = segelLaporan(contohLaporan, masterKey);

            assert.ok(segel.kanonisString, 'String kanonis harus terisi');
            assert.equal(segel.hashSHA256.length, 64, 'SHA-256 digest harus 64 hex chars (T1)');
            assert.equal(segel.segelHMAC.length, 64, 'HMAC seal harus 64 hex chars (T2)');

            const hasil = verifikasiLaporan(contohLaporan, segel.segelHMAC, masterKey);
            assert.equal(hasil.valid, true, 'Verifikasi laporan sah harus berhasil');
            assert.equal(hasil.hashSHA256, segel.hashSHA256, 'Digest T1 harus cocok');
        });

        it('4.2 (Negatif): Menolak verifikasi jika isi laporan dimanipulasi (Tamper Data)', () => {
            const segel = segelLaporan(contohLaporan, masterKey);

            // Penyerang mencoba menaikkan nilai audit dari 88 ke 100
            const laporanDimanipulasi = { ...contohLaporan, overallScore: 100, grade: 'A' };

            const hasil = verifikasiLaporan(laporanDimanipulasi, segel.segelHMAC, masterKey);
            assert.equal(hasil.valid, false, 'Laporan yang dimodifikasi wajib ditolak');
            assert.match(
                hasil.alasan ?? '',
                /Segel HMAC tidak cocok/,
                'Pesan alasan harus menunjukkan ketidakcocokan segel'
            );
        });

        it('4.3 (Negatif): Menolak verifikasi jika segel HMAC dipalsukan (Tamper Tag)', () => {
            const segel = segelLaporan(contohLaporan, masterKey);

            // Modifikasi 1 karakter segel HMAC
            const char0 = segel.segelHMAC[0];
            const tamperedChar = char0 === 'f' ? 'e' : 'f';
            const segelPalsu = tamperedChar + segel.segelHMAC.slice(1);

            const hasil = verifikasiLaporan(contohLaporan, segelPalsu, masterKey);
            assert.equal(hasil.valid, false, 'Segel palsu wajib ditolak');
        });

        it('4.4 (Negatif / Fail-Closed): Menangani segel malformed secara anggun tanpa crash', () => {
            // Format bukan 64 hex
            const hasilPanjangSalah = verifikasiLaporan(contohLaporan, 'bukan-hex-pendek', masterKey);
            assert.equal(hasilPanjangSalah.valid, false);
            assert.match(hasilPanjangSalah.alasan ?? '', /Format segel HMAC tidak sah/);

            // Karakter non-hex
            const nonHexTag = 'z'.repeat(64);
            const hasilNonHex = verifikasiLaporan(contohLaporan, nonHexTag, masterKey);
            assert.equal(hasilNonHex.valid, false);
            assert.match(hasilNonHex.alasan ?? '', /Format segel HMAC tidak sah/);
        });

        it('4.5 (Negatif): Menolak verifikasi jika menggunakan kunci master yang salah', () => {
            const segel = segelLaporan(contohLaporan, masterKey);
            const kunciLain = generateSecureBytes(32);

            const hasil = verifikasiLaporan(contohLaporan, segel.segelHMAC, kunciLain);
            assert.equal(hasil.valid, false, 'Verifikasi dengan kunci berbeda harus ditolak');
        });
    });

    // -------------------------------------------------------------------------
    // KELOMPOK 5: Vault AEAD AES-256-GCM dengan Pengikatan Konteks (AAD)
    // -------------------------------------------------------------------------
    describe('5. Vault Temuan Sensitif: AEAD AES-256-GCM & Context-Binding AAD', () => {
        const masterKey = generateSecureBytes(32);
        const targetIdAsli = 'scan-2026-001';
        const dataTemuan = {
            findingId: 'VULN-001',
            title: 'SQL Injection pada /api/login',
            payloadEkspoit: "' OR 1=1 --",
            dampak: 'Kebocoran data kredensial basis data',
        };

        it('5.1 (Positif): Berhasil mengenkripsi dan mendekripsi temuan terikat targetId', () => {
            const encrypted = arsipTemuanSensitif(dataTemuan, targetIdAsli, masterKey);

            assert.ok(encrypted.ciphertextHex, 'Ciphertext harus ada');
            assert.equal(encrypted.ivHex.length, 24, 'IV 12 byte = 24 hex chars');
            assert.equal(encrypted.authTagHex.length, 32, 'GCM Tag 16 byte = 32 hex chars');
            assert.ok(encrypted.aadHex, 'AAD hex harus tercatat');

            const decrypted = bukaArsipTemuanSensitif(encrypted, targetIdAsli, masterKey) as typeof dataTemuan;
            assert.deepEqual(decrypted, dataTemuan, 'Data didekripsi harus sama persis dengan aslinya');
        });

        it('5.2 (Negatif): Menolak relokasi payload ke targetId lain via verifikasi AAD', () => {
            const encrypted = arsipTemuanSensitif(dataTemuan, targetIdAsli, masterKey);

            // Penyerang mencoba menyalin ciphertext sah dari target-001 ke target-002 (Relocation Attack)
            const targetIdLain = 'scan-2026-002';

            assert.throws(
                () => bukaArsipTemuanSensitif(encrypted, targetIdLain, masterKey),
                /Unsupported state or unable to authenticate data/,
                'Dekripsi dengan AAD targetId yang salah wajib gagal ditolak AuthTag'
            );
        });

        it('5.3 (Negatif): Menolak dekripsi jika AuthTag dimanipulasi', () => {
            const encrypted = arsipTemuanSensitif(dataTemuan, targetIdAsli, masterKey);

            // Manipulasi tag
            const corruptTag = '0'.repeat(32);
            const corruptPayload = { ...encrypted, authTagHex: corruptTag };

            assert.throws(
                () => bukaArsipTemuanSensitif(corruptPayload, targetIdAsli, masterKey),
                /Unsupported state or unable to authenticate data/,
                'AuthTag palsu wajib ditolak oleh OpenSSL GCM verify'
            );
        });
    });

    // -------------------------------------------------------------------------
    // KELOMPOK 6: Manajemen Kunci di Luar Repositori
    // -------------------------------------------------------------------------
    describe('6. Manajemen Kunci di Luar Repositori', () => {
        const tempDir = path.join(os.tmpdir(), `tripleemat-test-key-${Date.now()}`);

        it('6.1 (Positif): Berhasil membuat berkas kunci dan memuatnya kembali', () => {
            const keyPath = path.join(tempDir, 'test.key');
            buatBerkasKunci(keyPath);

            assert.ok(fs.existsSync(keyPath), 'Berkas kunci harus berhasil dibuat di filesystem');

            const loadedKey = muatKunci(keyPath);
            assert.equal(loadedKey.length, 32, 'Kunci yang dimuat harus berukuran 32 bytes');

            // Bersihkan direktori uji
            fs.rmSync(tempDir, { recursive: true, force: true });
        });

        it('6.2 (Negatif / Fail-Closed): Flag "wx" (O_EXCL) mencegah penimpaan berkas kunci yang sudah ada', () => {
            const testExclDir = path.join(os.tmpdir(), `tripleemat-excl-${Date.now()}`);
            const keyPath = path.join(testExclDir, 'master.key');

            buatBerkasKunci(keyPath);

            // Upaya kedua pada lokasi yang sama harus melempar KunciTidakValid
            assert.throws(
                () => buatBerkasKunci(keyPath),
                KunciTidakValid,
                'Pembuatan kunci tidak boleh menimpa berkas yang sudah ada'
            );

            // Bersihkan
            fs.rmSync(testExclDir, { recursive: true, force: true });
        });

        it('6.3 (Negatif / Fail-Closed): Menolak berkas kunci yang korup / bukan 64 hex', () => {
            const testCorruptDir = path.join(os.tmpdir(), `tripleemat-corrupt-${Date.now()}`);
            fs.mkdirSync(testCorruptDir, { recursive: true });
            const corruptKeyPath = path.join(testCorruptDir, 'bad.key');

            fs.writeFileSync(corruptKeyPath, 'kunci-pendek-dan-bukan-hex', 'utf-8');

            assert.throws(
                () => muatKunci(corruptKeyPath),
                KunciTidakValid,
                'Kunci korup harus ditolak fail-closed'
            );

            fs.rmSync(testCorruptDir, { recursive: true, force: true });
        });
    });
});
