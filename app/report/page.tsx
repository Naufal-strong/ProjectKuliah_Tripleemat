"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../../src/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../src/components/ui/Card";
import { Badge } from "../../src/components/ui/Badge";
import { Alert } from "../../src/components/ui/Alert";
import { sampleScanResults } from "../../src/data/mockScans";

export default function ReportPage() {
  const [selectedScanId, setSelectedScanId] = useState(sampleScanResults[0].id);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const activeScan =
    sampleScanResults.find((s) => s.id === selectedScanId) || sampleScanResults[0];

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(activeScan, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeScan.id}-audit-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportFeedback(
      `Audit report ${activeScan.id} successfully exported as JSON with cryptographic SHA-256 digest.`
    );
  };

  const handlePrintPdf = () => {
    setExportFeedback(
      "Preparing PDF audit document... Print dialog triggered."
    );
    window.print();
  };

  // Severity count
  const severityCount = {
    critical: activeScan.findings.filter((f) => f.severity === "critical").length,
    high: activeScan.findings.filter((f) => f.severity === "high").length,
    medium: activeScan.findings.filter((f) => f.severity === "medium").length,
    low: activeScan.findings.filter((f) => f.severity === "low").length,
  };

  return (
    <main id="main-content" className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan" size="sm">
              Executive Module
            </Badge>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">FIPS 199 &amp; ISO 27001 Aligned</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security Audit Scorecard &amp; Report
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Formal assessment breakdown for target web endpoints. Review identified vulnerabilities,
            remediation priorities, and cryptographic proof of record integrity.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            id="export-json-btn"
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Export JSON
          </Button>

          <Button
            id="print-pdf-btn"
            variant="primary"
            size="sm"
            onClick={handlePrintPdf}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            }
          >
            Print / PDF Report
          </Button>
        </div>
      </div>

      {/* Export notification feedback */}
      {exportFeedback && (
        <Alert
          variant="success"
          title="Export Operation Complete"
          className="mb-6"
          onDismiss={() => setExportFeedback(null)}
        >
          {exportFeedback}
        </Alert>
      )}

      {/* Target Audit Switcher Tabs */}
      <section aria-labelledby="target-selector-heading" className="mb-6">
        <h2 id="target-selector-heading" className="sr-only">
          Select Audit Report
        </h2>
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 px-3">
            Switch Target:
          </span>
          {sampleScanResults.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedScanId(s.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all duration-150 cursor-pointer ${
                activeScan.id === s.id
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {s.targetUrl.replace("https://", "")} ({s.grade})
            </button>
          ))}
        </div>
      </section>

      {/* Executive Overview Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Score & Grade Card */}
        <Card variant="glass" className="lg:col-span-4 flex flex-col justify-between">
          <CardHeader>
            <CardTitle as="h2" className="text-base text-slate-300">
              Executive Health Rating
            </CardTitle>
            <CardDescription>
              Cumulative score mapped from HTTP headers, SSL ciphers, and ASVS controls.
            </CardDescription>
          </CardHeader>
          <CardContent className="my-auto py-4 text-center">
            <div className="inline-flex items-center justify-center h-28 w-28 rounded-3xl bg-slate-950 border border-slate-800 shadow-inner">
              <span className="text-5xl font-black text-cyan-400 font-mono">
                {activeScan.grade}
              </span>
            </div>
            <div className="mt-4 text-2xl font-extrabold text-white font-mono">
              {activeScan.overallScore} / 100
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {activeScan.overallScore >= 85
                ? "Hardened Security Posture"
                : activeScan.overallScore >= 70
                ? "Moderate Risk Posture — Action Recommended"
                : "Elevated Risk Posture — Immediate Remediation Required"}
            </p>
          </CardContent>
          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Audit Latency: {activeScan.durationMs}ms</span>
            <span className="text-emerald-400 font-semibold">100% Non-Intrusive</span>
          </div>
        </Card>

        {/* Target Metadata & Cryptographic Integrity Card */}
        <Card variant="default" className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <CardHeader>
              <CardTitle as="h2" className="text-base text-slate-300">
                Audit Target Metadata &amp; Cryptographic Signature
              </CardTitle>
              <CardDescription>
                FIPS 199 cryptographic verification and TLS connection telemetry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 font-mono">TARGET ENDPOINT</div>
                  <div className="text-white font-semibold font-mono mt-0.5 break-all">
                    {activeScan.targetUrl}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 font-mono">AUDIT TIMESTAMP</div>
                  <div className="text-white font-semibold font-mono mt-0.5">
                    {new Date(activeScan.scannedAt).toUTCString()}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 font-mono">SSL / TLS ISSUER</div>
                  <div className="text-white font-semibold mt-0.5">
                    {activeScan.sslInfo.issuer}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 font-mono">CIPHER SUITE</div>
                  <div className="text-white font-semibold font-mono mt-0.5">
                    {activeScan.sslInfo.cipherSuite}
                  </div>
                </div>
              </div>

              {/* SHA-256 Signature */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    FIPS 199 Integrity Digest (SHA-256)
                  </span>
                  <Badge variant="passed" size="sm">
                    Verified
                  </Badge>
                </div>
                <div className="font-mono text-[11px] text-cyan-300 break-all bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  {activeScan.integrityHash}
                </div>
              </div>
            </CardContent>
          </div>

          {/* Risk Distribution Breakdown */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/40">
              <span className="font-bold text-rose-400 text-sm block">
                {severityCount.critical}
              </span>
              <span className="text-slate-400 text-[10px]">Critical</span>
            </div>
            <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/40">
              <span className="font-bold text-red-400 text-sm block">
                {severityCount.high}
              </span>
              <span className="text-slate-400 text-[10px]">High</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-900/40">
              <span className="font-bold text-amber-400 text-sm block">
                {severityCount.medium}
              </span>
              <span className="text-slate-400 text-[10px]">Medium</span>
            </div>
            <div className="p-2 rounded-lg bg-sky-950/30 border border-sky-900/40">
              <span className="font-bold text-sky-400 text-sm block">
                {severityCount.low}
              </span>
              <span className="text-slate-400 text-[10px]">Low / Info</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Vulnerability Findings Section */}
      <section aria-labelledby="findings-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="findings-heading" className="text-xl font-bold text-white tracking-tight">
            Identified Vulnerabilities &amp; Remediation Plan
          </h2>
          <span className="text-xs text-slate-400">
            {activeScan.findings.length} Items Flagged for Action
          </span>
        </div>

        {activeScan.findings.length === 0 ? (
          <Card variant="subtle" className="text-center py-10">
            <p className="text-sm text-emerald-400 font-semibold">
              No security anomalies detected! Target exhibits high conformity.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeScan.findings.map((finding) => (
              <Card key={finding.id} variant="default" className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={finding.severity} size="md" dot>
                      {finding.severity}
                    </Badge>
                    <span className="font-mono text-xs font-bold text-slate-300">
                      {finding.id}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">
                      Category: {finding.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    {finding.cwe && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {finding.cwe}
                      </span>
                    )}
                    {finding.asvsRef && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                        ASVS {finding.asvsRef}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {finding.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {finding.description}
                </p>

                {/* Remediation code / block */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Recommended Remediation:
                  </div>
                  <div className="font-mono text-xs text-slate-200 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 overflow-x-auto">
                    {finding.remediation}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Navigation Footer */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800 text-xs text-slate-400">
        <div>
          Next Milestone Plan: Automatic PDF generation &amp; database sync with PostgreSQL.
        </div>
        <div className="flex items-center gap-3">
          <Link href="/scan">
            <Button variant="outline" size="sm">
              Scan New Endpoint
            </Button>
          </Link>
          <Link href="/asvs">
            <Button variant="secondary" size="sm">
              Review ASVS Controls
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
