import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { hkdfSync } from 'node:crypto';
import { generateSecureBytes } from './csprng';

/**
 * Modul Manajemen Kunci Kriptografi — Milestone v0.2
 * 
 * Standar:
 * - NIST SP 800-57 Part 1 Rev. 5, §5.2: "Satu kunci, satu tujuan".
 * - RFC 5869: HMAC-based Extract-and-Expand Key Derivation Function (HKDF).
 * - Penyimpanan aman di luar repositori dengan izin terbatas (mode 0o600).
 */

export const PANJANG_KUNCI_BYTE = 32; // 256 bits
export const PANJANG_KUNCI_HEX = 64;
export const NAMA_ENV_KUNCI = 'TRIPLEEMAT_KEY';

export class KunciTidakValid extends Error {
    constructor(pesan: string) {
        super(pesan);
        this.name = 'KunciTidakValid';
    }
}

/**
 * Mendapatkan lokasi default berkas kunci di direktori profil pengguna (di luar repositori).
 */
export function getLokasiDefaultKunci(): string {
    const homeDir = os.homedir();
    return path.join(homeDir, '.tripleemat', 'audit.key');
}

/**
 * Membangkitkan kunci induk baru 32-byte dari CSPRNG dan menyimpannya ke berkas di luar repositori.
 * Menggunakan flag 'wx' (O_CREAT | O_EXCL) agar kunci yang sudah ada tidak pernah tertimpa.
 */
export function buatBerkasKunci(lokasiPath?: string): string {
    const targetPath = lokasiPath || getLokasiDefaultKunci();
    const folder = path.dirname(targetPath);

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true, mode: 0o700 });
    }

    const kunciBytes = generateSecureBytes(PANJANG_KUNCI_BYTE);
    const kunciHex = Buffer.from(kunciBytes).toString('hex');

    // Flag 'wx': gagal jika berkas sudah ada (O_EXCL)
    // Mode 0o600: hanya pemilik yang berhak membaca/menulis
    try {
        fs.writeFileSync(targetPath, kunciHex, { encoding: 'ascii', flag: 'wx', mode: 0o600 });
    } catch (err: unknown) {
        const error = err as { code?: string };
        if (error.code === 'EEXIST') {
            throw new KunciTidakValid(`Berkas kunci sudah ada di ${targetPath}. Tidak boleh menimpa kunci lama.`);
        }
        throw err;
    }

    return targetPath;
}

/**
 * Memuat kunci induk 32-byte dari berkas atau variabel lingkungan.
 * Menerapkan prinsip gagal tertutup (fail-closed) dan pesan galat tanpa membocorkan isi kunci.
 */
export function muatKunci(lokasiPath?: string): Uint8Array {
    let kunciHexRaw: string;

    if (!lokasiPath) {
        const envVal = process.env[NAMA_ENV_KUNCI];
        if (envVal) {
            kunciHexRaw = envVal.trim();
        } else {
            const defaultPath = getLokasiDefaultKunci();
            if (fs.existsSync(defaultPath)) {
                return muatKunci(defaultPath);
            }
            throw new KunciTidakValid(`Kunci tidak ditemukan di lingkungan ${NAMA_ENV_KUNCI} maupun berkas ${defaultPath}`);
        }
    } else {
        if (!fs.existsSync(lokasiPath)) {
            throw new KunciTidakValid(`Berkas kunci tidak ditemukan di path: ${lokasiPath}`);
        }

        // Pengecekan izin berkas di sistem operasi POSIX
        if (os.platform() !== 'win32') {
            const stats = fs.statSync(lokasiPath);
            const mode = stats.mode & 0o777;
            if ((mode & 0o077) !== 0) {
                throw new KunciTidakValid(`Izin berkas kunci terlalu terbuka (mode: 0o${mode.toString(8)}). Wajib 0o600.`);
            }
        }

        kunciHexRaw = fs.readFileSync(lokasiPath, 'ascii').trim();
    }

    // Validasi sintaksis kunci hex
    if (!/^[0-9a-fA-F]{64}$/.test(kunciHexRaw)) {
        throw new KunciTidakValid('Format kunci tidak valid: wajib berupa string hex tepat 64 karakter');
    }

    const kunciBytes = Buffer.from(kunciHexRaw, 'hex');
    if (kunciBytes.length !== PANJANG_KUNCI_BYTE) {
        throw new KunciTidakValid(`Panjang kunci harus tepat ${PANJANG_KUNCI_BYTE} byte (256 bit)`);
    }

    return new Uint8Array(kunciBytes);
}

/**
 * Menurunkan kunci terpisah per tujuan menggunakan HKDF-SHA256 (RFC 5869).
 * Menjamin prinsip "Satu kunci, satu tujuan" (NIST SP 800-57).
 * 
 * @param kunciInduk Kunci master 32-byte dari CSPRNG
 * @param tujuan Label konteks pengikatan ("integritas" untuk HMAC, "arsip" untuk AES-GCM)
 */
export function turunkanKunci(kunciInduk: Uint8Array, tujuan: 'integritas' | 'arsip'): Uint8Array {
    if (kunciInduk.length !== PANJANG_KUNCI_BYTE) {
        throw new KunciTidakValid('Kunci induk harus berukuran tepat 32 byte untuk HKDF');
    }

    const salt = Buffer.alloc(0); // Salt kosong diizinkan bila kunci induk sudah acak penuh CSPRNG
    const info = Buffer.from(`tripleemat v0.2 ${tujuan}`, 'utf-8');

    const derived = hkdfSync('sha256', Buffer.from(kunciInduk), salt, info, PANJANG_KUNCI_BYTE);
    return new Uint8Array(derived);
}

