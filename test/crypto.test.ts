import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateSecureBytes, generateSecureToken } from '../src/lib/crypto/csprng';
import { calculateSHA256, verifyIntegrity } from '../src/lib/crypto/integrity';
import { encryptAES256GCM, decryptAES256GCM } from '../src/lib/crypto/encryption';

describe('🛡️ Cryptographic Module Unit Tests (Milestone v0.1)', () => {
    // Uji 1 (Positif): Integrity Verification (SHA-256)
    it('Uji 1 (Positif): Harus berhasil memverifikasi hash SHA-256 dari data ruleset asli', () => {
        const rulesetData = JSON.stringify({ version: '4.0.3', control: 'V5.1.1' });
        const expectedHash = calculateSHA256(rulesetData);

        const isValid = verifyIntegrity(rulesetData, expectedHash);
        assert.equal(isValid, true, 'Hash ruleset asli harus valid');
    });

    // Uji 2 (Negatif / Batas): Tampered Input Detection (Avalanche Effect)
    it('Uji 2 (Negatif): Harus menolak verifikasi hash jika 1 byte masukan diubah (Avalanche Effect)', () => {
        const originalData = 'ASVS_LEVEL_1_PASSED';
        const originalHash = calculateSHA256(originalData);

        const tamperedData = 'ASVS_LEVEL_1_PASSEE';
        const tamperedHash = calculateSHA256(tamperedData);

        assert.notEqual(originalHash, tamperedHash, 'Hash harus berubah total meski hanya 1 byte berubah');
        const isValid = verifyIntegrity(tamperedData, originalHash);
        assert.equal(isValid, false, 'Verifikasi integritas harus gagal untuk data yang dimodifikasi');
    });

    // Uji 3 (Positif): CSPRNG Token Uniqueness
    it('Uji 3 (Positif): Generator CSPRNG harus menghasilkan token acak yang unik dan tidak berulang', () => {
        const tokenSet = new Set<string>();
        const totalTokens = 1000;

        for (let i = 0; i < totalTokens; i++) {
            const token = generateSecureToken(32);
            tokenSet.add(token);
        }

        assert.equal(tokenSet.size, totalTokens, '1.000 token acak dari CSPRNG harus 100% unik');
    });

    // Uji 4 (Negatif): AES-256-GCM Tampered Ciphertext / Auth Tag Rejection
    it('Uji 4 (Negatif): Dekripsi AES-256-GCM harus melempar error jika ciphertext atau AuthTag dirusak', () => {
        const secretKey = generateSecureBytes(32);
        const auditReport = JSON.stringify({ target: 'https://kampus.ac.id', vulns: ['XSS', 'SQLi'] });

        const encrypted = encryptAES256GCM(auditReport, secretKey);

        // Memastikan ciphertext dimodifikasi secara deterministik (menghindari collision jika karakter sama)
        const firstChar = encrypted.ciphertextHex[0];
        const tamperedChar = firstChar === 'a' ? 'b' : 'a';
        const tamperedCiphertext = tamperedChar + encrypted.ciphertextHex.slice(1);
        const tamperedPayload = { ...encrypted, ciphertextHex: tamperedCiphertext };

        assert.throws(
            () => {
                decryptAES256GCM(tamperedPayload, secretKey);
            },
            /Unsupported state or unable to authenticate data/,
            'Proses dekripsi harus gagal akibat kegagalan otentikasi GCM Auth Tag'
        );
    });
});