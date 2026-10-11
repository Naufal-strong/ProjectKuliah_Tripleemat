import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Menghitung digest SHA-256 dari buffer/string masukan.
 */
export function calculateSHA256(data: string | Uint8Array): string {
    const buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : Buffer.from(data);
    return createHash('sha256').update(buffer).digest('hex');
}

/**
 * Memverifikasi integritas data dengan membandingkan hash SHA-256 secara safe-time.
 */
export function verifyIntegrity(data: string | Uint8Array, expectedHashHex: string): boolean {
    const actualHashHex = calculateSHA256(data);
    const actualBuffer = Buffer.from(actualHashHex, 'hex');
    const expectedBuffer = Buffer.from(expectedHashHex, 'hex');

    if (actualBuffer.length !== expectedBuffer.length) {
        return false;
    }
    return timingSafeEqual(actualBuffer, expectedBuffer);
}

/**
 * Menghitung HMAC SHA-256 untuk otentikasi token/pesan.
 */
export function calculateHMAC(data: string, secretKey: string): string {
    return createHmac('sha256', secretKey).update(data, 'utf-8').digest('hex');
}