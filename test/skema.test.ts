import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { skemaTarget, skemaMasuk } from "../lib/skema";

describe("📋 Validasi Skema Zod 4 — Tripleemat Security Assessor (Modul 5)", () => {
  // ==========================================
  // PENGUJIAN SKEMA TARGET AUDIT (skemaTarget)
  // ==========================================
  describe("1. skemaTarget (Formulir Tambah Target Audit)", () => {
    it("Positif: Harus lolos ketika semua data masukan valid dan lengkap", () => {
      const dataValid = {
        label: "Portal Akademik Kampus",
        targetUrl: "https://portal.kampus.ac.id",
        auditScope: "full",
        asvsLevel: "L2",
        intervalJam: "24",
        auditorEmail: "auditor@kampus.ac.id",
        notifyOnComplete: "on",
        notes: "Pemindaian berkala semester baru",
      };

      const hasil = skemaTarget.safeParse(dataValid);
      assert.equal(hasil.success, true, "Data valid harus lolos validasi");

      if (hasil.success) {
        assert.equal(hasil.data.label, "Portal Akademik Kampus");
        assert.equal(hasil.data.targetUrl, "https://portal.kampus.ac.id");
        assert.equal(hasil.data.auditScope, "full");
        assert.equal(hasil.data.asvsLevel, "L2");
        assert.equal(hasil.data.intervalJam, 24, "intervalJam harus berupa number");
        assert.equal(hasil.data.auditorEmail, "auditor@kampus.ac.id");
        assert.equal(hasil.data.notifyOnComplete, true, "'on' harus diubah jadi true");
      }
    });

    it("Positif: Harus lolos dengan field opsional kosong / tidak diisi", () => {
      const dataMinimal = {
        label: "SIAKAD Mobile API",
        targetUrl: "https://api.siakad.ac.id",
        auditScope: "standard",
        asvsLevel: "L1",
        intervalJam: "", // String kosong dipetakan ke undefined
        auditorEmail: "", // String kosong dipetakan ke undefined
        // notifyOnComplete tidak dikirim
      };

      const hasil = skemaTarget.safeParse(dataMinimal);
      assert.equal(hasil.success, true, "Field opsional kosong harus tetap lolos");

      if (hasil.success) {
        assert.equal(hasil.data.intervalJam, undefined);
        assert.equal(hasil.data.auditorEmail, undefined);
        assert.equal(hasil.data.notifyOnComplete, false, "Default checkbox harus false");
      }
    });

    it("Negatif: Harus menolak jika nama target (label) kurang dari 3 karakter", () => {
      const data = {
        label: "AB",
        targetUrl: "https://portal.kampus.ac.id",
        auditScope: "standard",
        asvsLevel: "L1",
      };

      const hasil = skemaTarget.safeParse(data);
      assert.equal(hasil.success, false);
      if (!hasil.success) {
        const errors = z.flattenError(hasil.error).fieldErrors;
        assert.ok(errors.label?.some((m) => m.includes("minimal 3 karakter")));
      }
    });

    it("Negatif: Harus menolak jika URL tidak memakai protokol https:// atau http://", () => {
      const data = {
        label: "Sistem Keuangan",
        targetUrl: "ftp://finance.kampus.ac.id",
        auditScope: "standard",
        asvsLevel: "L1",
      };

      const hasil = skemaTarget.safeParse(data);
      assert.equal(hasil.success, false);
      if (!hasil.success) {
        const errors = z.flattenError(hasil.error).fieldErrors;
        assert.ok(errors.targetUrl?.some((m) => m.includes("diawali https:// atau http://")));
      }
    });

    it("Negatif: Harus menolak domain tidak valid (tidak ada titik hostname)", () => {
      const data = {
        label: "Local Service",
        targetUrl: "http://localhost",
        auditScope: "standard",
        asvsLevel: "L1",
      };

      const hasil = skemaTarget.safeParse(data);
      assert.equal(hasil.success, false);
      if (!hasil.success) {
        const errors = z.flattenError(hasil.error).fieldErrors;
        assert.ok(errors.targetUrl?.some((m) => m.includes("Nama domain tidak valid")));
      }
    });

    it("Negatif: Harus menolak nilai enum yang tidak terdaftar", () => {
      const data = {
        label: "Audit Sistem",
        targetUrl: "https://valid.ac.id",
        auditScope: "super-scan", // Salah
        asvsLevel: "L9", // Salah
      };

      const hasil = skemaTarget.safeParse(data);
      assert.equal(hasil.success, false);
      if (!hasil.success) {
        const errors = z.flattenError(hasil.error).fieldErrors;
        assert.ok(errors.auditScope?.some((m) => m.includes("Pilih salah satu cakupan")));
        assert.ok(errors.asvsLevel?.some((m) => m.includes("Pilih level verifikasi")));
      }
    });

    it("Negatif: Harus menolak interval jam di luar rentang 1-168 jam", () => {
      const data = {
        label: "Audit Sistem",
        targetUrl: "https://valid.ac.id",
        auditScope: "standard",
        asvsLevel: "L1",
        intervalJam: "200", // Di atas 168
      };

      const hasil = skemaTarget.safeParse(data);
      assert.equal(hasil.success, false);
    });

    it("Negatif: Harus menolak format email yang salah jika diisi", () => {
      const data = {
        label: "Audit Sistem",
        targetUrl: "https://valid.ac.id",
        auditScope: "standard",
        asvsLevel: "L1",
        auditorEmail: "bukan-alamat-email",
      };

      const hasil = skemaTarget.safeParse(data);
      assert.equal(hasil.success, false);
      if (!hasil.success) {
        const errors = z.flattenError(hasil.error).fieldErrors;
        assert.ok(errors.auditorEmail?.some((m) => m.includes("Format email tidak valid")));
      }
    });
  });

  // ==========================================
  // PENGUJIAN SKEMA MASUK (skemaMasuk)
  // ==========================================
  describe("2. skemaMasuk (Formulir Masuk / Autentikasi)", () => {
    it("Positif: Harus lolos jika format email valid dan kata sandi >= 8 karakter", () => {
      const hasil = skemaMasuk.safeParse({
        email: "auditor@tripleemat.security",
        kataSandi: "RahasiaKuat123!",
      });

      assert.equal(hasil.success, true);
    });

    it("Negatif: Harus menolak email tidak valid dan kata sandi < 8 karakter", () => {
      const hasil = skemaMasuk.safeParse({
        email: "admin",
        kataSandi: "123",
      });

      assert.equal(hasil.success, false);
      if (!hasil.success) {
        const errors = z.flattenError(hasil.error).fieldErrors;
        assert.ok(errors.email?.some((m) => m.includes("Format email tidak valid")));
        assert.ok(errors.kataSandi?.some((m) => m.includes("minimal 8 karakter")));
      }
    });
  });
});
