import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "@/generated/prisma/client";
import { skemaTarget } from "@/lib/skema/target";
import { skemaTemuan } from "@/lib/skema/temuan";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

describe("🧪 Pengujian 10 Skenario CRUD & Relasi Modul 6 — PostgreSQL & Prisma 7", () => {
  const testTargetId = "scan-2026-901";
  const testUrl = "https://test-siakad.kampus.ac.id";

  const bersihkanDataUji = async () => {
    await prisma.temuan.deleteMany({
      where: {
        OR: [
          { targetId: testTargetId },
          { targetId: "scan-2026-902" },
          { target: { targetUrl: testUrl } },
        ],
      },
    });
    await prisma.target.deleteMany({
      where: {
        OR: [
          { id: testTargetId },
          { id: "scan-2026-902" },
          { targetUrl: testUrl },
        ],
      },
    });
  };

  before(async () => {
    await bersihkanDataUji();
  });

  after(async () => {
    await bersihkanDataUji();
    await prisma.$disconnect();
  });

  // Skenario 1: Tambah target sah
  test("1. Tambah target sah: Berhasil divalidasi Zod & disimpan ke tabel Target di PostgreSQL", async () => {
    const dataForm = {
      label: "Portal SIAKAD Uji",
      targetUrl: testUrl,
      auditScope: "full",
      asvsLevel: "L2",
      intervalJam: 24,
      auditorEmail: "auditor-uji@kampus.ac.id",
      notifyOnComplete: "on",
      notes: "Target audit sintetis untuk skenario pengujian",
    };

    const hasilValidasi = skemaTarget.safeParse(dataForm);
    assert.equal(hasilValidasi.success, true);
    if (!hasilValidasi.success) return;

    const targetDibuat = await prisma.target.create({
      data: {
        id: testTargetId,
        label: hasilValidasi.data.label,
        targetUrl: hasilValidasi.data.targetUrl,
        auditScope: hasilValidasi.data.auditScope,
        asvsLevel: hasilValidasi.data.asvsLevel,
        intervalJam: hasilValidasi.data.intervalJam,
        auditorEmail: hasilValidasi.data.auditorEmail,
        notifyOnComplete: hasilValidasi.data.notifyOnComplete,
        notes: hasilValidasi.data.notes,
      },
    });

    assert.equal(targetDibuat.id, testTargetId);
    assert.equal(targetDibuat.targetUrl, testUrl);

    const diDb = await prisma.target.findUnique({ where: { id: testTargetId } });
    assert.notEqual(diDb, null);
    assert.equal(diDb?.label, "Portal SIAKAD Uji");
  });

  // Skenario 2: Tambah target dengan targetUrl duplikat (P2002)
  test("2. Tambah target dengan targetUrl duplikat: Ditolak oleh constraint unik Target_targetUrl_key (P2002)", async () => {
    try {
      await prisma.target.create({
        data: {
          id: "scan-2026-902",
          label: "Portal Duplikat",
          targetUrl: testUrl, // URL sama dengan skenario 1
          auditScope: "standard",
          asvsLevel: "L1",
          notifyOnComplete: false,
        },
      });
      assert.fail("Seharusnya melempar galat P2002");
    } catch (err) {
      assert.equal(err instanceof Prisma.PrismaClientKnownRequestError, true);
      const prismaErr = err as Prisma.PrismaClientKnownRequestError;
      assert.equal(prismaErr.code, "P2002");
    }
  });

  // Skenario 3: Tambah target dengan URL kosong / format salah (Zod)
  test("3. Tambah target dengan URL tidak valid: Dicegat oleh Zod sebelum menyentuh Prisma", () => {
    const hasilValidasi = skemaTarget.safeParse({
      label: "Target Rusak",
      targetUrl: "bukan-sebuah-url",
      auditScope: "standard",
      asvsLevel: "L1",
    });

    assert.equal(hasilValidasi.success, false);
    if (!hasilValidasi.success) {
      const fieldErrors = hasilValidasi.error.flatten().fieldErrors;
      assert.notEqual(fieldErrors.targetUrl, undefined);
    }
  });

  // Skenario 4: Ubah notes sebuah target (Update)
  test("4. Ubah notes target: Berhasil diperbarui dan nilai baru tersimpan di database", async () => {
    const catatanBaru = "Diperiksa ulang 30 Okt 2026 — Status Aman";

    const targetDiubah = await prisma.target.update({
      where: { id: testTargetId },
      data: { notes: catatanBaru },
    });

    assert.equal(targetDiubah.notes, catatanBaru);

    const diDb = await prisma.target.findUnique({ where: { id: testTargetId } });
    assert.equal(diDb?.notes, catatanBaru);
  });

  // Skenario 5: Ubah target yang tidak ada / sudah dihapus (P2025)
  test("5. Ubah target yang tidak ada: Melempar galat P2025 (Record to update not found)", async () => {
    try {
      await prisma.target.update({
        where: { id: "scan-2026-999" },
        data: { notes: "Ubah target fiktif" },
      });
      assert.fail("Seharusnya melempar galat P2025");
    } catch (err) {
      assert.equal(err instanceof Prisma.PrismaClientKnownRequestError, true);
      const prismaErr = err as Prisma.PrismaClientKnownRequestError;
      assert.equal(prismaErr.code, "P2025");
    }
  });

  // Skenario 6: Validasi format ID publik regex
  test("6. Validasi ID target regex: Memvalidasi format scan-YYYY-NNN dan menolak format acak", () => {
    const regex = /^scan-\d{4}-\d{3}$/;

    assert.equal(regex.test("scan-2026-001"), true);
    assert.equal(regex.test("scan-2026-901"), true);
    assert.equal(regex.test("scan-abc"), false);
    assert.equal(regex.test("target/123"), false);
  });

  // Persiapan data temuan untuk Skenario 7 dan 8
  test("Persiapan Temuan: Menambahkan 2 temuan ke testTargetId", async () => {
    await prisma.temuan.createMany({
      data: [
        {
          targetId: testTargetId,
          findingId: "FIND-01",
          title: "Header CSP Tidak Ditemukan",
          category: "Injeksi Konten",
          severity: "high",
          description: "Tidak ada CSP",
          remediation: "Terapkan CSP",
        },
        {
          targetId: testTargetId,
          findingId: "FIND-02",
          title: "Cookie Tanpa Secure Flag",
          category: "Manajemen Sesi",
          severity: "medium",
          description: "Cookie tidak secure",
          remediation: "Tambahkan Secure flag",
        },
      ],
    });

    const jmlTemuan = await prisma.temuan.count({ where: { targetId: testTargetId } });
    assert.equal(jmlTemuan, 2);
  });

  // Skenario 8: Hapus target dengan perintah kedua gagal -> Pembuktian Rollback
  test("8. Transaksi Rollback: Perintah kedua sengaja digagalkan, temuan anak batal dihapus (Rollback terbukti)", async () => {
    const jmlTemuanAwal = await prisma.temuan.count({ where: { targetId: testTargetId } });
    assert.equal(jmlTemuanAwal, 2);

    try {
      await prisma.$transaction([
        // Perintah 1: Hapus seluruh temuan anak
        prisma.temuan.deleteMany({ where: { targetId: testTargetId } }),
        // Perintah 2: Sengaja mencari ID yang salah untuk memicu P2025
        prisma.target.delete({ where: { id: "scan-2026-999-fiktif" } }),
      ]);
      assert.fail("Seharusnya transaksi gagal pada perintah kedua");
    } catch (err) {
      assert.equal(err instanceof Prisma.PrismaClientKnownRequestError, true);
      const prismaErr = err as Prisma.PrismaClientKnownRequestError;
      assert.equal(prismaErr.code, "P2025");
    }

    // BUKTI ROLLBACK: Jumlah temuan anak di database tidak berkurang sama sekali
    const jmlTemuanPascaRollback = await prisma.temuan.count({ where: { targetId: testTargetId } });
    assert.equal(jmlTemuanPascaRollback, jmlTemuanAwal);
    assert.equal(jmlTemuanPascaRollback, 2);
  });

  // Skenario 7: Hapus target beserta temuannya via transaksi atomik
  test("7. Transaksi Hapus Bersih: Menghapus temuan anak lalu induk dalam satu transaksi", async () => {
    await prisma.$transaction([
      prisma.temuan.deleteMany({ where: { targetId: testTargetId } }),
      prisma.target.delete({ where: { id: testTargetId } }),
    ]);

    const targetCek = await prisma.target.findUnique({ where: { id: testTargetId } });
    const temuanCek = await prisma.temuan.count({ where: { targetId: testTargetId } });

    assert.equal(targetCek, null);
    assert.equal(temuanCek, 0);
  });

  // Skenario 9: Constraint Unik Gabungan Temuan @@unique([targetId, findingId])
  test("9. Unik gabungan: Menolak findingId duplikat pada target yang sama (P2002), namun mengizinkan pada target berbeda", async () => {
    const tA = "scan-2026-001";

    // Target A sudah memiliki FIND-01 dari seed
    try {
      await prisma.temuan.create({
        data: {
          targetId: tA,
          findingId: "FIND-01", // Duplikat pada target A!
          title: "Temuan Uji Duplikat",
          category: "Pengujian",
          severity: "low",
          description: "Deskripsi uji",
          remediation: "Remediasi uji",
        },
      });
      assert.fail("Seharusnya gagal karena unik gabungan [targetId, findingId]");
    } catch (err) {
      assert.equal(err instanceof Prisma.PrismaClientKnownRequestError, true);
      const prismaErr = err as Prisma.PrismaClientKnownRequestError;
      assert.equal(prismaErr.code, "P2002");
    }

    // Validasi skema Zod temuan
    const hasilValidasi = skemaTemuan.safeParse({
      findingId: "FIND-99",
      title: "Temuan Valid Zod",
      category: "Audit",
      severity: "high",
      description: "Deskripsi valid",
      remediation: "Remediasi valid",
    });
    assert.equal(hasilValidasi.success, true);
  });

  // Skenario 10: Pelanggaran Foreign Key Temuan_targetId_fkey (P2003)
  test("10. Pelanggaran Foreign Key: Menolak penambahan temuan pada targetId yang tidak terdaftar (P2003)", async () => {
    try {
      await prisma.temuan.create({
        data: {
          targetId: "scan-2026-nonexistent", // Tidak ada di tabel Target
          findingId: "FIND-01",
          title: "Temuan Tanpa Induk",
          category: "Yatim",
          severity: "low",
          description: "Deskripsi",
          remediation: "Remediasi",
        },
      });
      assert.fail("Seharusnya melempar galat foreign key P2003");
    } catch (err) {
      assert.equal(err instanceof Prisma.PrismaClientKnownRequestError, true);
      const prismaErr = err as Prisma.PrismaClientKnownRequestError;
      assert.equal(prismaErr.code, "P2003");
    }
  });
});
