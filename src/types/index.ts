export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type ComplianceStatus = "passed" | "failed" | "warning" | "pending";
export type AsvsLevel = "L1" | "L2" | "L3";

export interface SecurityHeader {
  name: string;
  expected: string;
  actual?: string;
  status: ComplianceStatus;
  description: string;
  recommendation: string;
  severity: Severity;
}

export interface SslCertificateInfo {
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  cipherSuite: string;
  protocol: string;
  isWeakCipher: boolean;
  status: ComplianceStatus;
}

export interface ScanFinding {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  description: string;
  remediation: string;
  cwe?: string;
  asvsRef?: string;
}

export interface ScanResult {
  id: string;
  targetUrl: string;
  scannedAt: string;
  durationMs: number;
  overallScore: number;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  headersAnalyzed: number;
  headersPassed: number;
  headers: SecurityHeader[];
  sslInfo: SslCertificateInfo;
  findings: ScanFinding[];
  integrityHash: string;
}

export interface AsvsControl {
  id: string;
  chapter: string;
  section: string;
  title: string;
  description: string;
  level: AsvsLevel;
  nistRef: string;
  status: ComplianceStatus;
  notes?: string;
}

export interface ScanFormData {
  targetUrl: string;
  auditScope: "standard" | "full" | "ssl-only";
  asvsLevel: AsvsLevel;
  auditorEmail?: string;
  notifyOnComplete: boolean;
  notes?: string;
}

export interface FormErrors {
  targetUrl?: string;
  auditorEmail?: string;
  auditScope?: string;
  general?: string;
}
