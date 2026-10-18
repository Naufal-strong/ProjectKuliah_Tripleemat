"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Input } from "../../src/components/ui/Input";
import { ProgressBar } from "../../src/components/ui/ProgressBar";
import { AsvsControl, ComplianceStatus } from "../../src/types";
import { mockAsvsControls } from "../../src/data/mockAsvsControls";

export default function AsvsMatrixPage() {
  const [controls, setControls] = useState<AsvsControl[]>(mockAsvsControls);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Bab unik dari data kontrol
  const chapters = useMemo(() => {
    const list = Array.from(new Set(mockAsvsControls.map((c) => c.chapter)));
    return ["ALL", ...list];
  }, []);

  // Filter kontrol aktif
  const filteredControls = useMemo(() => {
    return controls.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nistRef.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChapter =
        selectedChapter === "ALL" || item.chapter === selectedChapter;

      const matchesLevel =
        selectedLevel === "ALL" || item.level === selectedLevel;

      const matchesStatus =
        selectedStatus === "ALL" || item.status === selectedStatus;

      return matchesSearch && matchesChapter && matchesLevel && matchesStatus;
    });
  }, [controls, searchQuery, selectedChapter, selectedLevel, selectedStatus]);

  // Statistik Kepatuhan
  const stats = useMemo(() => {
    const total = controls.length;
    const passed = controls.filter((c) => c.status === "passed").length;
    const warning = controls.filter((c) => c.status === "warning").length;
    const failed = controls.filter((c) => c.status === "failed").length;
    const score = total > 0 ? Math.round((passed / total) * 100) : 0;
    return { total, passed, warning, failed, score };
  }, [controls]);

  // Handler toggle status kontrol
  const handleToggleStatus = (controlId: string) => {
    setControls((prev) =>
      prev.map((item) => {
        if (item.id === controlId) {
          const nextStatus: Record<ComplianceStatus, ComplianceStatus> = {
            passed: "warning",
            warning: "failed",
            failed: "passed",
            pending: "passed",
          };
          return { ...item, status: nextStatus[item.status] };
        }
        return item;
      })
    );
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedChapter("ALL");
    setSelectedLevel("ALL");
    setSelectedStatus("ALL");
  };

  const getStatusLabel = (status: ComplianceStatus) => {
    switch (status) {
      case "passed":
        return "Terpenuhi";
      case "warning":
        return "Peringatan";
      case "failed":
        return "Gagal";
      default:
        return "Tertunda";
    }
  };

  return (
    <main id="main-content" className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan" size="sm">
              Mesin Standar Kepatuhan
            </Badge>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">OWASP ASVS v4.0.3</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Matriks Kepatuhan OWASP ASVS
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Matriks verifikasi interaktif yang memetakan kriteria keamanan aplikasi ke
            Level OWASP ASVS dan kontrol NIST SP 800-53. Klik lencana status untuk mengubah status verifikasi secara langsung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/scan">
            <Button
              id="asvs-to-scan-btn"
              variant="outline"
              size="sm"
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              Pindai Header Langsung
            </Button>
          </Link>
          <Link href="/report">
            <Button
              id="asvs-to-report-btn"
              variant="secondary"
              size="sm"
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Laporan Eksekutif
            </Button>
          </Link>
        </div>
      </div>

      {/* Compliance Score Gauge & Stats Banner */}
      <section aria-labelledby="score-banner-heading" className="mb-8">
        <h2 id="score-banner-heading" className="sr-only">
          Status Kepatuhan Saat Ini
        </h2>
        <Card variant="glass" className="border-cyan-500/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Skor persentase */}
            <div className="md:col-span-4 flex items-center gap-5">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex flex-col items-center justify-center shrink-0">
                <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                  {stats.score}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Kepatuhan
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  Skor Verifikasi ASVS
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dihitung secara dinamis berdasarkan status verifikasi kontrol yang aktif.
                </p>
              </div>
            </div>

            {/* Progress bar & rincian */}
            <div className="md:col-span-8 space-y-3">
              <ProgressBar
                value={stats.score}
                label="Kesesuaian ASVS Keseluruhan"
                colorScheme="dynamic"
                size="md"
              />

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                  <span className="text-emerald-400 font-bold block text-sm">
                    {stats.passed}
                  </span>
                  <span className="text-slate-400 text-[11px]">Kontrol Terpenuhi</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/50">
                  <span className="text-amber-400 font-bold block text-sm">
                    {stats.warning}
                  </span>
                  <span className="text-slate-400 text-[11px]">Tindakan Diperlukan</span>
                </div>
                <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/50">
                  <span className="text-rose-400 font-bold block text-sm">
                    {stats.failed}
                  </span>
                  <span className="text-slate-400 text-[11px]">Tidak Sesuai</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Filter and Search Bar */}
      <section aria-labelledby="filters-heading" className="mb-6 space-y-4">
        <h2 id="filters-heading" className="sr-only">
          Filter Kontrol Verifikasi
        </h2>
        <Card variant="subtle" className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-5">
              <label htmlFor="search-asvs-input" className="sr-only">
                Cari kontrol verifikasi
              </label>
              <Input
                id="search-asvs-input"
                aria-label="Cari kontrol verifikasi"
                placeholder="Cari kontrol (contoh: kriptografi, sesi, V2.1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>

            {/* Chapter Filter */}
            <div className="lg:col-span-3">
              <label htmlFor="filter-chapter" className="sr-only">
                Filter berdasarkan Bab
              </label>
              <select
                id="filter-chapter"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                {chapters.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch === "ALL" ? "Semua Bab" : ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="lg:col-span-2">
              <label htmlFor="filter-level" className="sr-only">
                Filter berdasarkan Level
              </label>
              <select
                id="filter-level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">Semua Level</option>
                <option value="L1">Level 1 (L1)</option>
                <option value="L2">Level 2 (L2)</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            <div className="lg:col-span-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-slate-400 hover:text-white"
              >
                Atur Ulang Filter
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Controls List */}
      <section aria-labelledby="controls-heading" className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <h2 id="controls-heading" className="font-semibold text-slate-200">
            Menampilkan {filteredControls.length} dari {controls.length} Kriteria Verifikasi
          </h2>
          <span>Klik lencana status pada setiap kontrol untuk beralih status</span>
        </div>

        {filteredControls.length === 0 ? (
          <Card variant="subtle" className="text-center py-12">
            <p className="text-sm text-slate-300">
              Tidak ada kontrol ASVS yang cocok dengan kata kunci atau filter saat ini.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="mt-4"
            >
              Hapus Filter
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredControls.map((control) => (
              <Card
                key={control.id}
                variant="default"
                className="transition-colors hover:border-slate-700 p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-cyan-950 border border-cyan-800 text-cyan-300">
                        {control.id}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {control.chapter}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400">
                        Level {control.level.replace("L", "")}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        NIST: {control.nistRef}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-tight">
                      {control.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {control.description}
                    </p>

                    {control.notes && (
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-cyan-400 font-semibold shrink-0">
                          Bukti Audit:
                        </span>
                        <span>{control.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Status Toggle Action */}
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0">
                    <button
                      type="button"
                      id={`toggle-${control.id}`}
                      onClick={() => handleToggleStatus(control.id)}
                      className="cursor-pointer group flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-full"
                      aria-label={`Ubah status verifikasi untuk ${control.id}, saat ini ${getStatusLabel(control.status)}`}
                    >
                      <Badge variant={control.status} size="md" dot>
                        {getStatusLabel(control.status)}
                      </Badge>
                    </button>
                    <span className="text-[10px] text-slate-500 select-none hidden sm:inline">
                      Klik untuk beralih
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
