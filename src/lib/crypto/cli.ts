import fs from 'node:fs';
import { buatBerkasKunci, muatKunci } from './kunci';
import { segelLaporan, verifikasiLaporan } from './vault';

function printHelp() {
    console.log(`
🛡️ Tripleemat Cryptographic CLI (Milestone v0.2)
Penggunaan:
  npx tsx src/lib/crypto/cli.ts keygen [lokasi-file]
      Membangkitkan master key 32-byte CSPRNG dan menyimpannya di luar repositori.
      Default: ~/.tripleemat/audit.key (izin 0o600 / profil pengguna)

  npx tsx src/lib/crypto/cli.ts seal <file-laporan.json> [lokasi-kunci]
      Menyegel laporan audit dengan Kanonisasi (T1), SHA-256 (T1), dan HMAC-SHA256 (T2).

  npx tsx src/lib/crypto/cli.ts verify <file-laporan.json> <segel-hmac> [lokasi-kunci]
      Memverifikasi keaslian dan integritas laporan audit secara fail-closed.
`);
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command || command === '--help' || command === '-h') {
        printHelp();
        process.exit(0);
    }

    try {
        if (command === 'keygen') {
            const targetPath = args[1];
            const createdPath = buatBerkasKunci(targetPath);
            console.log(`✅ Kunci induk CSPRNG 256-bit berhasil dibuat!`);
            console.log(`📁 Lokasi berkas (di luar repositori): ${createdPath}`);
            console.log(`🔒 Izin berkas: 0o600 (Hanya pemilik akun sistem yang berhak membaca)`);
            console.log(`💡 Atau ekspor ke lingkungan: $env:TRIPLEEMAT_KEY = "<isi_kunci_hex>"`);
            process.exit(0);
        }

        if (command === 'seal') {
            const filePath = args[1];
            const keyPath = args[2];
            if (!filePath) {
                console.error('❌ Harap tentukan berkas JSON laporan audit.');
                process.exit(2);
            }
            const raw = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(raw);
            const kunci = muatKunci(keyPath);
            const hasil = segelLaporan(data, kunci);

            console.log('✅ Laporan berhasil disegel!');
            console.log(`📄 String Kanonis (T1): ${hasil.kanonisString}`);
            console.log(`🔑 SHA-256 Digest (T1): ${hasil.hashSHA256}`);
            console.log(`🛡️ Segel HMAC-SHA256 (T2): ${hasil.segelHMAC}`);
            process.exit(0);
        }

        if (command === 'verify') {
            const filePath = args[1];
            const segel = args[2];
            const keyPath = args[3];
            if (!filePath || !segel) {
                console.error('❌ Harap tentukan berkas JSON dan segel HMAC.');
                process.exit(2);
            }
            const raw = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(raw);
            const kunci = muatKunci(keyPath);
            const hasil = verifikasiLaporan(data, segel, kunci);

            if (hasil.valid) {
                console.log('✅ STATUS: VALID. Laporan otentik dan integritas data terjamin.');
                console.log(`🔑 SHA-256 Digest: ${hasil.hashSHA256}`);
                process.exit(0);
            } else {
                console.error(`❌ STATUS: TIDAK VALID! Alasan: ${hasil.alasan}`);
                process.exit(1);
            }
        }

        console.error(`Perintah tidak dikenal: ${command}`);
        printHelp();
        process.exit(2);
    } catch (err: unknown) {
        const error = err as Error;
        console.error(`❌ Gagal: ${error.message}`);
        process.exit(2);
    }
}

main();
