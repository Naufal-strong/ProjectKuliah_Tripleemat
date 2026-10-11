import { createCipheriv, createDecipheriv } from 'node:crypto';
import { generateSecureBytes } from './csprng';

export interface EncryptedPayload {
    ciphertextHex: string;
    ivHex: string;
    authTagHex: string;
}

/**
 * Enkripsi Terotentikasi AES-256-GCM.
 */
export function encryptAES256GCM(plaintext: string, key32Bytes: Uint8Array): EncryptedPayload {
    if (key32Bytes.length !== 32) {
        throw new Error('Kunci AES-256 harus berukuran tepat 32 bytes (256 bits)');
    }

    // IV standar GCM adalah 12 bytes dari CSPRNG
    const iv = generateSecureBytes(12);
    const cipher = createCipheriv('aes-256-gcm', Buffer.from(key32Bytes), Buffer.from(iv));

    let encrypted = cipher.update(plaintext, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
        ciphertextHex: encrypted,
        ivHex: Buffer.from(iv).toString('hex'),
        authTagHex: authTag.toString('hex'),
    };
}

/**
 * Dekripsi Terotentikasi AES-256-GCM.
 */
export function decryptAES256GCM(payload: EncryptedPayload, key32Bytes: Uint8Array): string {
    if (key32Bytes.length !== 32) {
        throw new Error('Kunci AES-256 harus berukuran tepat 32 bytes (256 bits)');
    }

    const decipher = createDecipheriv(
        'aes-256-gcm',
        Buffer.from(key32Bytes),
        Buffer.from(payload.ivHex, 'hex')
    );

    decipher.setAuthTag(Buffer.from(payload.authTagHex, 'hex'));

    let decrypted = decipher.update(payload.ciphertextHex, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}