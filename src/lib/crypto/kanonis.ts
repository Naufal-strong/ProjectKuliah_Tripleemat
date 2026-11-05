/**
 * Modul Kanonisasi dan Validasi Masukan (Batas Kepercayaan) — Milestone v0.2
 * 
 * Mengimplementasikan normalisasi masukan agar "makna sama -> representasi byte sama",
 * serta menolak masukan buruk secara gagal tertutup (fail-closed).
 */

export class MasukanKriptoTidakValid extends Error {
    constructor(pesan: string) {
        super(pesan);
        this.name = 'MasukanKriptoTidakValid';
    }
}

/**
 * Menormalkan nilai dan menyaring hanya tipe data legal.
 * Menolak NaN, Infinity, dan memastikan string berada dalam bentuk Unicode NFC.
 */
function normalkanNilai(val: unknown): unknown {
    if (val === null || val === undefined) {
        return null;
    }

    if (typeof val === 'number') {
        if (!Number.isFinite(val)) {
            throw new MasukanKriptoTidakValid('Nilai numerik tidak valid (NaN atau Tak Hingga ditolak)');
        }
        return val;
    }

    if (typeof val === 'string') {
        // Normalisasi Unicode NFC (menghindari byte berbeda untuk karakter beraksen)
        return val.normalize('NFC');
    }

    if (typeof val === 'boolean') {
        return val;
    }

    if (Array.isArray(val)) {
        return val.map(normalkanNilai);
    }

    if (typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        const hasil: Record<string, unknown> = {};
        
        // Urutkan kunci secara leksikografis (alfabetis UTF-8)
        const keysTerurut = Object.keys(obj).sort();
        for (const k of keysTerurut) {
            hasil[k] = normalkanNilai(obj[k]);
        }
        return hasil;
    }

    throw new MasukanKriptoTidakValid(`Tipe data tidak didukung dalam kanonisasi: ${typeof val}`);
}

/**
 * Menghasilkan representasi byte kanonis JSON deterministik.
 * Aturan:
 * 1. Kunci objek diurutkan secara alfabetis (A-Z).
 * 2. Tanpa spasi ekstra / whitespace formatting.
 * 3. Nilai ternormalisasi (Unicode NFC, no NaN/Infinity).
 */
export function kanonisasiJSON(data: unknown): Buffer {
    if (data === undefined) {
        throw new MasukanKriptoTidakValid('Data masukan tidak boleh undefined');
    }
    const dataNormal = normalkanNilai(data);
    const jsonString = JSON.stringify(dataNormal);
    return Buffer.from(jsonString, 'utf-8');
}

/**
 * Validasi allowlist untuk laporan audit sebelum masuk ke mesin kriptografi.
 */
export function validasiStrukturLaporan(laporan: unknown): Record<string, unknown> {
    if (!laporan || typeof laporan !== 'object' || Array.isArray(laporan)) {
        throw new MasukanKriptoTidakValid('Laporan audit harus berupa objek valid');
    }

    const obj = laporan as Record<string, unknown>;
    const requiredKeys = ['targetUrl', 'overallScore', 'grade'];
    for (const key of requiredKeys) {
        if (!(key in obj)) {
            throw new MasukanKriptoTidakValid(`Atribut wajib "${key}" tidak ditemukan pada laporan audit`);
        }
    }

    if (typeof obj.targetUrl !== 'string' || !obj.targetUrl.trim()) {
        throw new MasukanKriptoTidakValid('targetUrl harus berupa string tidak kosong');
    }

    if (typeof obj.overallScore !== 'number' || !Number.isFinite(obj.overallScore) || obj.overallScore < 0 || obj.overallScore > 100) {
        throw new MasukanKriptoTidakValid('overallScore harus berupa angka 0 - 100');
    }

    if (typeof obj.grade !== 'string' || !/^[A-F][+-]?$/.test(obj.grade)) {
        throw new MasukanKriptoTidakValid('grade harus berupa notasi peringkat sah (A-F)');
    }

    return obj;
}
