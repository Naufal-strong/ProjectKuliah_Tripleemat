import { createHmac, timingSafeEqual } from 'node:crypto';
import { calculateSHA256 } from './integrity';
import { kanonisasiJSON, validasiStrukturLaporan, MasukanKriptoTidakValid } from './kanonis';
import { turunkanKunci } from './kunci';
import { encryptAES256GCM, decryptAES256GCM, EncryptedPayload } from './encryption';

/**
 * Vault Kriptografi Terintegrasi (Titik Sambungan T1 -> T2) — Milestone v0.2
 * 
 * Mengintegrasikan:
 * - T1 (v0.1): Bentuk kanonis deterministik & digest integritas SHA-256
 * - T2 (v0.2): Otentikasi HMAC-SHA256 berantai & Enkripsi Terotentikasi (AEAD) AES-256-GCM
 */

export interface SegelLaporanResult {
    kanonisString: string;
    hashSHA256: string;
    segelHMAC: string;
}

export interface HasilVerifikasi {
    valid: boolean;
    alasan?: string;
    hashSHA256?: string;
}

/**
 * Menyegel laporan audit dengan kombinasi Kanonisasi (T1), SHA-256 (T1), dan HMAC-SHA256 (T2).
 * 
 * Alur:
 * [Laporan Mentah] -> validasi allowlist -> kanonisasi JSON (T1)
 *                  -> SHA-256 digest (T1)
 *                  -> HKDF "integritas" (T2) -> HMAC-SHA256 seal (T2)
 */
export function segelLaporan(laporan: unknown, kunciInduk: Uint8Array): SegelLaporanResult {
    // 1. Validasi batas masukan
    const laporanValid = validasiStrukturLaporan(laporan);

    // 2. Bentuk kanonis deterministik (T1)
    const kanonisBuffer = kanonisasiJSON(laporanValid);

    // 3. Hitung digest SHA-256 integritas dasar (T1)
    const hashSHA256 = calculateSHA256(kanonisBuffer);

    // 4. Turunkan kunci khusus integritas melalui HKDF (T2)
    const kIntegritas = turunkanKunci(kunciInduk, 'integritas');

    // 5. Hitung segel terotentikasi HMAC-SHA256 (T2)
    const segelHMAC = createHmac('sha256', Buffer.from(kIntegritas))
        .update(kanonisBuffer)
        .digest('hex');

    return {
        kanonisString: kanonisBuffer.toString('utf-8'),
        hashSHA256,
        segelHMAC,
    };
}

/**
 * Memverifikasi keaslian dan integritas laporan audit secara gagal tertutup (fail-closed).
 * Jika masukan atau segel cacat, sistem mengembalikan status tidak valid tanpa crash.
 */
export function verifikasiLaporan(
    laporan: unknown,
    segelHMAC: string,
    kunciInduk: Uint8Array
): HasilVerifikasi {
    // Pengecekan format segel (wajib 64 karakter hex valid ASCII)
    if (typeof segelHMAC !== 'string' || !/^[0-9a-fA-F]{64}$/.test(segelHMAC)) {
        return {
            valid: false,
            alasan: 'Format segel HMAC tidak sah (wajib 64 karakter heksadesimal)',
        };
    }

    let kanonisBuffer: Buffer;
    try {
        const laporanValid = validasiStrukturLaporan(laporan);
        kanonisBuffer = kanonisasiJSON(laporanValid);
    } catch (err) {
        return {
            valid: false,
            alasan: err instanceof MasukanKriptoTidakValid ? err.message : 'Struktur data laporan cacat',
        };
    }

    let kIntegritas: Uint8Array;
    try {
        kIntegritas = turunkanKunci(kunciInduk, 'integritas');
    } catch {
        return {
            valid: false,
            alasan: 'Kunci induk tidak valid untuk derivasi kunci',
        };
    }

    // Hitung ulang segel yang diharapkan
    const expectedHMAC = createHmac('sha256', Buffer.from(kIntegritas))
        .update(kanonisBuffer)
        .digest('hex');

    const expectedBuf = Buffer.from(expectedHMAC, 'hex');
    const actualBuf = Buffer.from(segelHMAC, 'hex');

    // Perbandingan waktu konstan (constant-time) untuk mencegah timing attack
    const isCocok = timingSafeEqual(expectedBuf, actualBuf);

    if (!isCocok) {
        return {
            valid: false,
            alasan: 'Segel HMAC tidak cocok: data laporan telah dimanipulasi atau kunci salah',
            hashSHA256: calculateSHA256(kanonisBuffer),
        };
    }

    return {
        valid: true,
        hashSHA256: calculateSHA256(kanonisBuffer),
    };
}

/**
 * Mengenkripsi temuan audit sensitif menggunakan AEAD AES-256-GCM.
 * Mengikat payload ke targetId melalui AAD (Additional Authenticated Data).
 */
export function arsipTemuanSensitif(
    temuanData: unknown,
    targetId: string,
    kunciInduk: Uint8Array
): EncryptedPayload {
    if (!targetId || typeof targetId !== 'string') {
        throw new MasukanKriptoTidakValid('targetId wajib disertakan sebagai AAD');
    }

    // Turunkan kunci terpisah untuk arsip enkripsi (Satu Kunci, Satu Tujuan)
    const kArsip = turunkanKunci(kunciInduk, 'arsip');

    // Kanonisasi data temuan
    const kanonisPlaintext = kanonisasiJSON(temuanData).toString('utf-8');

    // AAD mengikat data ke identitas target (mencegah relokasi payload ke target lain)
    const aad = Buffer.from(targetId, 'utf-8');

    return encryptAES256GCM(kanonisPlaintext, kArsip, aad);
}

/**
 * Mendekripsi arsip temuan sensitif dan memverifikasi integritas autentikasinya via GCM AuthTag dan AAD.
 */
export function bukaArsipTemuanSensitif(
    payload: EncryptedPayload,
    expectedTargetId: string,
    kunciInduk: Uint8Array
): unknown {
    if (!expectedTargetId || typeof expectedTargetId !== 'string') {
        throw new MasukanKriptoTidakValid('expectedTargetId wajib disertakan untuk verifikasi AAD');
    }

    const kArsip = turunkanKunci(kunciInduk, 'arsip');
    const aad = Buffer.from(expectedTargetId, 'utf-8');

    // Dekripsi dengan verifikasi AAD dan AuthTag
    const decryptedJsonString = decryptAES256GCM(payload, kArsip, aad);
    return JSON.parse(decryptedJsonString);
}

