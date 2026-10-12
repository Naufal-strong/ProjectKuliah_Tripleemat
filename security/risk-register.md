# Risk Register — Tripleemat Security Assessor

Tag: `sec-0.1`

## Priority risk selection

The following five risks were selected because they combine realistic exploitability in the current product with material impact on audit trust, scanner reliability, or data protection.

| Risk ID | Threat | Likelihood | Impact | Overall | Priority |
|---|---|---|---|---|---|
| RR-01 | Ruleset tampering against DS-1 | Medium | High | High | 1 |
| RR-02 | SSRF / internal metadata probing via target URL | High | High | High | 2 |
| RR-03 | Audit findings disclosure from DS-3 | Medium | High | High | 3 |
| RR-04 | Scanner DoS caused by slow or malicious target responses | High | Medium | High | 4 |
| RR-05 | Auditor credential compromise and impersonation | Medium | High | High | 5 |

## Risk register details

### RR-01 — Ruleset tampering against DS-1
- Affected asset: DS-1 (ruleset vault)
- DFD elements: DS-1, P2, P3
- Risk statement: If ASVS criteria or scoring rules are modified without validation, the application can produce false compliance results.
- Likelihood: Medium — local configuration files and rules are relatively static, but direct file modification or unsafe deployments could change them.
- Impact: High — it damages the trustworthiness of reports and may mislead auditors or stakeholders.
- Control plan: Add a signed ruleset manifest, verify SHA-256 at runtime, reject untrusted schema changes, and store production rules in an immutable or versioned store. Map to Task 2 (cryptographic integrity controls) and Task 3 (verification policy).

### RR-02 — SSRF / internal metadata probing via target URL
- Affected asset: EE-2 / target metadata / host exposure
- DFD elements: P1, EE-2, DF-02, DF-03
- Risk statement: User-controlled URLs can cause the scanner to probe internal or sensitive endpoints such as localhost or cloud metadata services.
- Likelihood: High — the app accepts arbitrary URL input, and there is no strict outbound allowlist or network boundary control in the current design.
- Impact: High — internal metadata or private services may be exposed to the scanner, creating confidentiality loss or lateral access.
- Control plan: Validate target hostname against an allowlist, block private/reserved IP ranges and localhost, enforce HTTP client restrictions, and reject non-public destinations or metadata endpoints. Map to Task 2 (input validation and safe outbound restrictions) and Task 3 (security design review).

### RR-03 — Audit findings disclosure from DS-3
- Affected asset: DS-3 (audit results DB)
- DFD elements: DS-3, P4, DF-10, DF-11
- Risk statement: If report data or database contents are exposed, sensitive details about weaknesses or unpatched parts of the target environment are leaked.
- Likelihood: Medium — exposures can happen through misconfiguration, weak auth, or report export without proper permission checks.
- Impact: High — the information is highly valuable to attackers and damages customer trust and compliance posture.
- Control plan: Encrypt data at rest with AES-256-GCM, protect exports with signed URLs or restricted sessions, apply RBAC to who can view reports, and log access. Map to Task 2 (cryptographic data protection) and Task 3 (report access hardening).

### RR-04 — Scanner DoS caused by slow or malicious target responses
- Affected asset: P2 processing capacity and DS-2 cache
- DFD elements: P2, EE-2, DF-02, DF-03, DS-2
- Risk statement: Targets can delay or consume connections, leading to worker exhaustion and a denial of service for the scanner workflow.
- Likelihood: High — the system accepts arbitrary target URLs and performs passive outbound probing without strict timeouts or concurrency limits.
- Impact: Medium — the app can degrade or delay reports, but the immediate business effect is usually operational rather than full system compromise.
- Control plan: Enforce connection timeout, read timeout, max response size, concurrency limits, and queue backpressure; isolate scan jobs in workers; and record abnormal target behavior. Map to Task 2 (scanner resilience) and Task 3 (operational hardening).

### RR-05 — Auditor credential compromise and impersonation
- Affected asset: AST-04 (credentials and session tokens)
- DFD elements: EE-1, P1, AST-04
- Risk statement: Compromised secrets or session tokens allow attackers to impersonate auditors, trigger scans, or view confidential reports.
- Likelihood: Medium — the application relies on browser-based session handling and secrets that may be exposed via logs or weak config.
- Impact: High — successful impersonation gives broad access to the audit system and its data.
- Control plan: Require strong authentication, rotate secrets, cookies with secure/HttpOnly/SameSite attributes, short-lived tokens, and centralized secret storage. Map to Task 2 (secure credential management) and Task 3 (identity and access control review).

## Control mapping summary

| Risk | Primary control focus | Task mapping |
|---|---|---|
| RR-01 | Integrity verification for ruleset and report artifacts | Task 2 |
| RR-02 | Host validation and outbound network restrictions | Task 3 |
| RR-03 | Encryption and RBAC for report data | Task 2 |
| RR-04 | Timeout, throttling, and worker isolation | Task 3 |
| RR-05 | Strong auth, secure token handling, secret hygiene | Task 2 |

## Overall assessment

The highest-value risks in this product are the ones that impact audit trust and scanner safety: ruleset manipulation, outbound target abuse, and credential compromise. These are realistic for a web-based security scanner, and they are directly connected to the current architecture and code paths present in the product implementation.
