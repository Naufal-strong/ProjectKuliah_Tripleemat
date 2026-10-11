import { randomBytes } from 'node:crypto';

/**
 * Membangkitkan bytes acak menggunakan CSPRNG (Cryptographically Secure Pseudo-Random Number Generator).
 * Dilarang menggunakan Math.random() karena bersifat pseudo-random deterministik.
 */
export function generateSecureBytes(length: number): Uint8Array {
    if (length <= 0) {
        throw new Error('Panjang byte harus lebih besar dari 0');
    }
    return new Uint8Array(randomBytes(length));
}

export function generateSecureToken(lengthInBytes: number = 32): string {
    const bytes = generateSecureBytes(lengthInBytes);
    return Buffer.from(bytes).toString('hex');
}