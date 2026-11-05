import { createCipheriv, createDecipheriv } from 'node:crypto';
import { generateSecureBytes } from './csprng';

export interface EncryptedPayload {
    ciphertextHex: string;
    ivHex: string;
    authTagHex: string;
    aadHex?: string;
}

/**
 * Enkripsi Terotentikasi AES-256-GCM dengan dukungan AAD (Additional Authenticated Data).
 */
export function encryptAES256GCM(
    plaintext: string,
    key32Bytes: Uint8Array,
    aad?: string | Buffer
): EncryptedPayload {
    if (key32Bytes.length !== 32) {
        throw new Error('Kunci AES-256 harus berukuran tepat 32 bytes (256 bits)');
    }

    // IV standar GCM adalah 12 bytes dari CSPRNG
    const iv = generateSecureBytes(12);
    const cipher = createCipheriv('aes-256-gcm', Buffer.from(key32Bytes), Buffer.from(iv));

    let aadBuffer: Buffer | undefined;
    if (aad) {
        aadBuffer = typeof aad === 'string' ? Buffer.from(aad, 'utf-8') : aad;
        cipher.setAAD(aadBuffer);
    }

    let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
        ciphertextHex: encrypted,
        ivHex: Buffer.from(iv).toString('hex'),
        authTagHex: authTag.toString('hex'),
        aadHex: aadBuffer ? aadBuffer.toString('hex') : undefined,
    };
}

/**
 * Dekripsi Terotentikasi AES-256-GCM dengan verifikasi AAD.
 */
export function decryptAES256GCM(
    payload: EncryptedPayload,
    key32Bytes: Uint8Array,
    aad?: string | Buffer
): string {
    if (key32Bytes.length !== 32) {
        throw new Error('Kunci AES-256 harus berukuran tepat 32 bytes (256 bits)');
    }

    const decipher = createDecipheriv(
        'aes-256-gcm',
        Buffer.from(key32Bytes),
        Buffer.from(payload.ivHex, 'hex')
    );

    if (aad) {
        const aadBuffer = typeof aad === 'string' ? Buffer.from(aad, 'utf-8') : aad;
        decipher.setAAD(aadBuffer);
    } else if (payload.aadHex) {
        decipher.setAAD(Buffer.from(payload.aadHex, 'hex'));
    }

    decipher.setAuthTag(Buffer.from(payload.authTagHex, 'hex'));

    let decrypted = decipher.update(payload.ciphertextHex, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}
