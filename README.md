# 🛡️ Tripleemat Security Assessor

**Tripleemat Security Assessor** is an enterprise-grade **Automated Security & Compliance Assessment** web platform engineered to audit web applications against **OWASP ASVS (Application Security Verification Standard v4.0.3)** and **NIST SP 800-53** standards. 

The platform enables security auditors, web developers, campus IT administrators, and DevSecOps teams to perform non-intrusive passive scans of HTTP security headers, inspect SSL/TLS cipher suites, track compliance controls, and generate verifiable cryptographic audit reports.

---

## 📌 Table of Contents

1. [Product Concept](#-1-product-concept)
   - [Product Identity & Purpose](#product-identity--purpose)
   - [Target Users](#target-users)
   - [Problem Statement & Solution](#problem-statement--solution)
   - [Core Functions](#core-functions)
   - [Milestone Roadmap & Future Extensibility](#milestone-roadmap--future-extensibility)
2. [Technologies Used](#-2-technologies-used)
3. [Application Structure](#-3-application-structure)
4. [Reusable UI Components](#-4-reusable-ui-components)
5. [Forms & Client-Side Validation](#-5-forms--client-side-validation)
6. [Mock Data Architecture](#-6-mock-data-architecture)
7. [Responsive Design Implementation](#-7-responsive-design-implementation)
8. [Web Accessibility (WCAG 2.1 AA)](#-8-web-accessibility-wcag-21-aa)
9. [Testing Requirements & Lighthouse Report](#-9-testing-requirements--lighthouse-report)
   - [Navigation & Flow Verification](#navigation--flow-verification)
   - [Form Validation Test Matrix](#form-validation-test-matrix)
   - [Responsive Viewport Verification](#responsive-viewport-verification)
   - [Lighthouse Accessibility Audit Report](#lighthouse-accessibility-audit-report)
10. [Instructions for Running the Project](#-10-instructions-for-running-the-project)

---

## 💡 1. Product Concept

### Product Identity & Purpose
* **Product Name:** Tripleemat Security Assessor
* **Purpose:** To provide an automated, user-friendly, and mathematically verifiable web application security assessment tool that bridges the gap between raw HTTP header analysis and high-level compliance frameworks (OWASP ASVS, NIST SP 800-53, FIPS 199).

### Target Users
1. **Security Auditors:** Requiring standardized checklists, evidence tracking, and exportable executive scorecards.
2. **Web & Full-Stack Developers:** Needing immediate, actionable remediation snippets (e.g., exact CSP syntax, HSTS directives) to harden code before deploying to production.
3. **University / Campus IT Administrators:** Managing multiple portals (`portal.kampus.ac.id`, `library.kampus.ac.id`, legacy academic systems) that must comply with data protection regulations.
4. **DevSecOps Engineers:** Integrating lightweight passive checks into their software development lifecycles.

### Problem Statement & Solution
* **The Problem:** Many academic portals and enterprise web applications operate with missing or misconfigured HTTP headers (`Permissions-Policy`, `Content-Security-Policy`, `Strict-Transport-Security`), leaving them susceptible to Cross-Site Scripting (XSS), Clickjacking, and protocol downgrade attacks. Furthermore, conducting formal audits against hundreds of OWASP ASVS controls is manually exhausting, error-prone, and rarely accompanied by tamper-proof documentation.
* **The Solution:** Tripleemat Security Assessor offers:
  - Instant, non-intrusive passive scanning of endpoints.
  - Interactive ASVS checklist with live compliance score calculation.
  - Built-in FIPS 199 cryptographic verification using SHA-256 digests and AES-256-GCM ciphering (`node:crypto`), guaranteeing audit trail integrity.

### Core Functions
1. **Passive HTTP & SSL Analyzer (`/scan`):** Evaluates HTTP security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, CORS, Permissions-Policy) and validates TLS certificate validity and cipher suites.
2. **OWASP ASVS Interactive Matrix (`/asvs`):** Verifies technical controls across Chapters (Architecture, Authentication, Session Management, Validation, Cryptography, Communications). Allows users to filter by chapter, level, or search keyword, and dynamically toggle control statuses.
3. **Executive Security Scorecard & Reports (`/report`):** Visualizes overall security grades (A+ to F), numerical health scores (0-100), risk distributions, and identified vulnerability remediation plans with copyable fixes.
4. **Cryptographic Vault & Verification:** Signs audit records with SHA-256 hashes and AEAD ciphers to prove records have not been tampered with post-audit.

### Milestone Roadmap & Future Extensibility
* **Milestone 1 (Current):** Frontend Architecture, Reusable UI System, Core Page Flows (`/`, `/scan`, `/asvs`, `/report`), Client-Side Form Validation, Mock Data, Responsive Layouts, and Accessibility Optimization (Lighthouse ≥ 85).
* **Milestone 2 (Subsequent):** Relational Database Integration (PostgreSQL / SQLite via Prisma), asynchronous worker jobs for background network scanning, user authentication (RBAC for Auditor vs Developer), and PDF export generation.
* **Milestone 3 (Subsequent):** Automated CI/CD webhook integrations, active scanner module options, and multi-tenant university portal monitoring dashboards.

---

## 🛠️ 2. Technologies Used

| Category | Technology | Description |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | High-performance React framework with server and client components |
| **Language** | TypeScript 5 | Strict static typing for domain models, forms, and component props |
| **Library** | React 19 | Declarative UI library with concurrent rendering capabilities |
| **Styling** | Tailwind CSS v4 | Utility-first CSS engine configured with enterprise dark theme tokens |
| **Fonts** | Geist & Geist Mono (Google Fonts) | Modern, highly legible sans-serif and monospace typography |
| **Cryptography** | `node:crypto` (OpenSSL backend) | FIPS-compliant AES-256-GCM, SHA-256, HMAC, and OS-level CSPRNG |
| **Icons** | Accessible Inline SVG | Fully scalable, accessible icons equipped with `aria-hidden="true"` |
| **Test Runner** | Node.js Test Runner (`node:test`) | Built-in zero-dependency testing runner executed via `tsx` |

---

## 📁 3. Application Structure

```text
tripleemat/
├── app/                                # Next.js 16 App Router Pages
│   ├── globals.css                     # Tailwind v4 directives & color theme variables
│   ├── layout.tsx                      # Root application layout with Navbar & Footer
│   ├── page.tsx                        # Page 1: Overview & Product Concept Landing Page
│   ├── scan/
│   │   └── page.tsx                    # Page 2: Security Header & SSL Scanner (with validated form)
│   ├── asvs/
│   │   └── page.tsx                    # Page 3: OWASP ASVS v4.0.3 Compliance Matrix
│   └── report/
│       └── page.tsx                    # Page 4: Executive Security Scorecard & Audit History
├── src/
│   ├── components/
│   │   ├── ui/                         # Reusable UI Component Library
│   │   │   ├── Button.tsx              # Button with variants, sizes, loading & icons
│   │   │   ├── Card.tsx                # Card family (Header, Title, Description, Content, Footer)
│   │   │   ├── Badge.tsx               # Status & Severity badges with WCAG AA contrast
│   │   │   ├── Input.tsx               # Validated form text/url/email input with ARIA bindings
│   │   │   ├── Alert.tsx               # Status notification alert with role="alert"
│   │   │   ├── ProgressBar.tsx         # Accessible progress bar with aria-valuenow
│   │   │   └── index.ts                # Component barrel export
│   │   └── layout/
│   │       ├── Navbar.tsx              # Responsive navigation with skip link & mobile drawer
│   │       └── Footer.tsx              # Semantic footer with standards & system status
│   ├── data/                           # Mock Datasets for Milestone 1
│   │   ├── mockSecurityHeaders.ts      # HTTP security headers definition & recommendations
│   │   ├── mockAsvsControls.ts         # OWASP ASVS v4.0.3 controls with NIST mappings
│   │   └── mockScans.ts                # Realistic audit scan records (portal, library, siak)
│   ├── lib/
│   │   └── crypto/                     # Industrial Cryptographic Engine
│   │       ├── csprng.ts               # OS-level CSPRNG (CryptGenRandom / urandom)
│   │       ├── integrity.ts            # SHA-256, HMAC, and constant-time compare
│   │       └── encryption.ts           # AES-256-GCM AEAD authenticated encryption
│   └── types/
│       └── index.ts                    # TypeScript interfaces & domain types
├── security/                           # Milestone sec-0.1 documentation
│   ├── asset-inventory.md              # FIPS 199 CIA asset inventory
│   ├── threat-modeling.md              # STRIDE threat model & trust boundary diagrams
│   └── DFD .png                        # Level 0 Data Flow Diagram
├── test/
│   └── crypto.test.ts                  # Cryptographic unit tests (100% passing)
├── AI-Log .md                          # Gen-AI usage log & self-verification record
├── package.json                        # Project dependencies and npm scripts
└── tsconfig.json                       # TypeScript compiler configuration
```

---

## 🧩 4. Reusable UI Components

The application contains **six reusable, modular UI components** located in `src/components/ui/`:

### 1. `Button` (`src/components/ui/Button.tsx`)
* **Purpose:** Primary user action trigger.
* **Props:** `variant` (`primary`, `secondary`, `outline`, `danger`, `ghost`), `size` (`sm`, `md`, `lg`), `isLoading` (boolean), `leftIcon`, `rightIcon`, standard HTML button props.
* **Accessibility Features:** Native `<button>`, `aria-busy` during loading, visible high-contrast `:focus-visible` ring, disabled state styling.

### 2. `Card` (`src/components/ui/Card.tsx`)
* **Purpose:** Consistent content container for metrics, forms, findings, and modules.
* **Sub-components:** `CardHeader`, `CardTitle` (supports `as="h2" | "h3"`), `CardDescription`, `CardContent`, `CardFooter`.
* **Variants:** `default`, `glass` (backdrop blur), `subtle`, `glow` (cyan border highlight).

### 3. `Badge` (`src/components/ui/Badge.tsx`)
* **Purpose:** Visual representation of severity (`critical`, `high`, `medium`, `low`, `info`) and compliance status (`passed`, `failed`, `warning`, `pending`).
* **Accessibility Features:** Exceeds WCAG 2.1 AA 4.5:1 contrast requirements against dark background, optional status dot, uppercase monospace styling.

### 4. `Input` (`src/components/ui/Input.tsx`)
* **Purpose:** Form text, URL, and email inputs with integrated validation feedback.
* **Props:** `label`, `error`, `helperText`, `isRequired`, `leftIcon`, `rightIcon`.
* **Accessibility Features:** Unique `id` paired with `<label htmlFor>`, `aria-invalid={!!error}`, `aria-describedby` linking to error or helper text, error text wrapped in `role="alert"` with `aria-live="polite"`.

### 5. `Alert` (`src/components/ui/Alert.tsx`)
* **Purpose:** High-priority feedback and status messaging.
* **Props:** `variant` (`info`, `success`, `warning`, `danger`), `title`, `onDismiss`.
* **Accessibility Features:** `role="alert"`, semantic icons with `aria-hidden="true"`, accessible dismiss button with `aria-label="Dismiss alert"`.

### 6. `ProgressBar` (`src/components/ui/ProgressBar.tsx`)
* **Purpose:** Audit progress display and compliance scoring visualization.
* **Props:** `value`, `max`, `label`, `showValueLabel`, `colorScheme` (`dynamic`, `cyan`, `emerald`, `amber`, `rose`), `size`.
* **Accessibility Features:** `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `aria-label`.

---

## 📝 5. Forms & Client-Side Validation

The **Security Audit Target Configuration Form** on `/scan` implements strict client-side validation before executing the simulated security scan:

```text
┌─────────────────────────────────────────────────────────────────┐
│               FORM CLIENT-SIDE VALIDATION WORKFLOW              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User Submits Form                                              │
│          │                                                      │
│          ▼                                                      │
│  Validate Target URL:                                           │
│    • Is empty? ──────────────► Show error: URL required         │
│    • Missing http(s)? ───────► Show error: Protocol required    │
│    • Invalid hostname? ──────► Show error: Domain required      │
│          │ (Valid)                                              │
│          ▼                                                      │
│  Validate Auditor Email (if filled):                            │
│    • Matches email regex? ───► Invalid: Show format error       │
│          │ (Valid)                                              │
│          ▼                                                      │
│  Form Valid ─────────────────► Initiate Animated Audit Scan     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Specific Validation Error Messages
| Field | Condition | Clear Error Message |
|---|---|---|
| **Target URL** | Empty input | *"Target URL is required. Please specify a web application endpoint to audit."* |
| **Target URL** | Missing `http://` or `https://` | *"Invalid protocol. Target URL must begin with https:// or http:// (e.g., https://portal.kampus.ac.id)."* |
| **Target URL** | Malformed domain name | *"Invalid domain name. Please include a valid hostname (e.g., https://example.com)."* |
| **Auditor Email** | Invalid email format | *"Invalid email format. Please provide a valid address (e.g., auditor@kampus.ac.id) or clear the field."* |

---

## 📊 6. Mock Data Architecture

All mock data is strongly typed via TypeScript interfaces and organized in `src/data/`:

1. **`mockSecurityHeaders.ts`:**
   - 8 major security headers: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`.
   - Includes actual values, expected values, status, severity, and actionable remediation instructions.

2. **`mockAsvsControls.ts`:**
   - Covers 15 representative controls across OWASP ASVS v4.0.3 chapters (V1 Architecture, V2 Authentication, V3 Session Management, V5 Validation & Sanitization, V6 Cryptography, V9 Communications).
   - Maps each control to NIST SP 800-53 controls (e.g., SC-8, SC-13, IA-5, AC-6) and FIPS 199 objectives.

3. **`mockScans.ts`:**
   - Three distinct test target profiles:
     - `https://portal.kampus.ac.id` (Score: 82/100, Grade B — moderate posture)
     - `https://library.kampus.ac.id` (Score: 94/100, Grade A — hardened posture)
     - `https://legacy-siak.kampus.ac.id` (Score: 48/100, Grade F — vulnerable legacy ciphers & missing headers)

---

## 📱 7. Responsive Design Implementation

The interface is engineered with a mobile-first philosophy using Tailwind CSS v4 breakpoints:

| Breakpoint | Target Screen Width | Layout & Adaptations |
|---|---|---|
| **Mobile** | $\le 640\text{px}$ | • Single-column stacked layouts.<br>• Full-width touch-friendly buttons ($\ge 44\text{px}$ touch target).<br>• Mobile hamburger navigation drawer (`#mobile-menu-toggle`).<br>• Horizontally scrollable data tables for headers and findings.<br>• Responsive typography (`text-2xl` to `text-3xl`). |
| **Tablet** | $768\text{px}$ (`md:`) | • Two-column grid layouts for stats and module showcases.<br>• Side-by-side metric badges.<br>• Compact horizontal navigation bar.<br>• Adjusted padding ($1.5\text{rem}$ / $24\text{px}$). |
| **Desktop** | $\ge 1024\text{px}$ (`lg:`) | • Multi-column layouts (12-column grid systems on `/scan` and `/report`).<br>• Persistent side-by-side audit configuration and real-time results panel.<br>• Expanded navigation links with quick CTA buttons.<br>• Maximum width constraint (`max-w-7xl` / $1280\text{px}$) for balanced readability. |

---

## ♿ 8. Web Accessibility (WCAG 2.1 AA)

To satisfy modern accessibility benchmarks, the application incorporates:

* **Semantic HTML Structure:** Structured using `<header>`, `<nav>`, `<main id="main-content">`, `<section>`, `<article>`, `<aside>`, and `<footer role="contentinfo">`.
* **Single Heading Hierarchy:** Exactly one `<h1>` per page, followed by logical `<h2>` and `<h3>` parent-child relationships.
* **Skip to Main Content Link:** Keyboard shortcut link (`focus:not-sr-only`) positioned at the very top of `Navbar.tsx` allowing keyboard users to bypass repetitive header navigation directly to `#main-content`.
* **Form Accessibility:** All inputs explicitly linked via `htmlFor` and `id`. Dynamic validation states communicated through `aria-invalid`, `aria-required`, and `aria-describedby`.
* **ARIA Live Regions:** Error alerts and progress changes utilize `role="alert"` and `aria-live="polite"`.
* **Color Contrast:** All foreground text satisfies WCAG AA minimum contrast ratio (at least $4.5:1$ for regular text, $3:1$ for large headings) against dark background colors (`#020617` / `#0f172a`).
* **Focus Visibility:** Clear 2px cyan (`#22d3ee`) focus ring on all interactive elements via `:focus-visible`.

---

## 🧪 9. Testing Requirements & Lighthouse Report

### Navigation & Flow Verification
* ✅ **Home (`/`) ➔ Scanner (`/scan`):** Clicked "Launch Security Scanner" and "Audit Target"; navigation successfully transitioned with active tab state highlighted.
* ✅ **Scanner (`/scan`) ➔ ASVS Matrix (`/asvs`):** Navigation seamlessly preserved context and loaded ASVS controls.
* ✅ **Scanner (`/scan`) ➔ Report (`/report`):** Results link opened the full Executive Security Scorecard with matching target parameters.
* ✅ **Report (`/report`) Target Switcher:** Successfully toggled between `portal.kampus.ac.id`, `library.kampus.ac.id`, and `legacy-siak.kampus.ac.id`, recalculating scores and risk distributions immediately.

### Form Validation Test Matrix
| # | Test Scenario | Input Value | Expected Result | Actual Result | Status |
|---|---|---|---|---|:---:|
| 1 | **Empty Submission** | `""` | Displays *"Target URL is required"* under input; sets `aria-invalid="true"` | Error message displayed; focus maintained | **PASS** |
| 2 | **Missing Protocol** | `portal.kampus.ac.id` | Displays *"Invalid protocol. Target URL must begin with https:// or http://"* | Protocol error displayed | **PASS** |
| 3 | **Malformed Domain** | `https://invalid_url` | Displays *"Invalid domain name. Please include a valid hostname"* | Domain error displayed | **PASS** |
| 4 | **Invalid Email Format** | `auditor@bad` | Displays *"Invalid email format. Please provide a valid address"* | Email error displayed | **PASS** |
| 5 | **Valid Input & Submission** | `https://portal.kampus.ac.id` | Clears errors, triggers progress bar (0% ➔ 100%), renders simulated audit results | Audit completed; scorecard displayed | **PASS** |

### Responsive Viewport Verification
| Viewport | Tested Width | Verified Elements | Status |
|---|---|---|:---:|
| **Mobile** | $375\text{px}$ & $640\text{px}$ | Mobile drawer toggle, 1-col card grid, touch target size $\ge 44\text{px}$, no horizontal overflow | **PASS** |
| **Tablet** | $768\text{px}$ | 2-col stats grid, compact header, legible font sizes, balanced spacing | **PASS** |
| **Desktop** | $1024\text{px}$ & $1440\text{px}$ | 12-col side-by-side scanner layout, full desktop navbar, expanded scorecard | **PASS** |

### Lighthouse Accessibility Audit Report

Testing was conducted using Google Chrome Lighthouse across application routes to verify compliance with WCAG 2.1 Level AA accessibility standards.

#### Lighthouse Testing Conditions
* **Test Mode:** Navigation Mode (Full Page Audit)
* **Emulated Device:** Desktop & Mobile (Pixel 7 / Moto G Power)
* **Chrome Version:** Google Chrome 134.0+ (Incognito Window)
* **Test Environment:** Next.js Development Server (`http://localhost:3000`)
* **Audit Categories Tested:** Accessibility (Primary Milestone Objective)
* **Target Requirement:** Minimum Accessibility Score of $\ge 85 / 100$

#### Verified Lighthouse Audit Scores

| Page Tested | Route | Accessibility Score | Status | Key Verifications |
|---|---|:---:|:---:|---|
| **Executive Report Page** | `/report` | **96 / 100** | ✅ **EXCEEDED** | Semantic `<main>`, high-contrast badges, table structure, accessible buttons |
| **Overview Landing Page** | `/` | **96 / 100** | ✅ **EXCEEDED** | Single `<h1>`, Skip link, descriptive ARIA tabs, keyboard navigation |
| **Security Scanner Page** | `/scan` | **95 / 100** | ✅ **EXCEEDED** | Accessible labels, `role="alert"`, inline errors, `role="progressbar"` |
| **OWASP ASVS Matrix Page** | `/asvs` | **95 / 100** | ✅ **EXCEEDED** | Labeled search inputs, accessible status toggle buttons, clear landmarks |

#### Audit Result Evidence

Below is the verified Lighthouse Accessibility report generated on `http://localhost:3000/report`:

![Lighthouse Accessibility Score 96](./public/screenshots/lighthouse-accessibility-96.png)

*Figure 9.1: Chrome DevTools Lighthouse audit for the Executive Report route (`/report`) achieving an Accessibility score of **96 / 100**.*

---

#### Diagnostic Notes & Testing Best Practices

When running Lighthouse audits on local development servers, Chromium may occasionally report a diagnostic notice (`NO_FCP` / No First Contentful Paint):

![Lighthouse Diagnostic Notice](./public/screenshots/lighthouse-fcp-diagnostic.png)

*Figure 9.2: Chromium diagnostic notice regarding background tab throttling and IndexedDB caching.*

* **Resolution Procedure:**
  1. **Foreground Focus:** Chromium aggressively throttles rendering (to 0 FPS) when browser tabs lose focus or are minimized. Ensure the Chrome window remains in the active foreground while Lighthouse generates the report.
  2. **Incognito Mode:** Run the audit in an Incognito window (`Ctrl + Shift + N`) to bypass third-party browser extensions (password managers, React DevTools) that keep active IndexedDB connections.
  3. **Route Pre-warming:** Visit the route once before triggering the audit to allow Next.js on-demand route compilation to complete.

#### Accessibility Implementation Highlights
* **Semantic Landmark Elements:** Every page incorporates structured `<header>`, `<nav>`, `<main id="main-content">`, `<section>`, `<article>`, and `<footer role="contentinfo">`.
* **Contrast Compliance:** All text tokens (headings, paragraphs, badges, code snippets) maintain a contrast ratio $> 4.5:1$ against the dark background theme.
* **Form & Field Controls:** Every input is bound to an explicit `<label htmlFor="...">`, with validation errors announced via `role="alert"` and `aria-live="polite"`.
* **Keyboard Navigation:** Includes a skip link (`#main-content`) at the top of the DOM and visible `:focus-visible` rings on all interactive elements.

---

## 🚀 10. Instructions for Running the Project

### Prerequisites
* **Node.js** v20+ or v22+ (recommended for native `node:test` execution)
* **npm** v10+

### Step-by-Step Guide

```bash
# 1. Clone or open the repository folder
cd tripleemat

# 2. Install all required dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```

Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

### Additional Scripts

```bash
# Run automated cryptographic unit tests (Node.js test runner)
npm run test:crypto

# Run ESLint validation
npm run lint

# Compile production build
npm run build

# Start production server
npm run start
```

---

## 🔒 Security & AI Transparency

* **No Secrets Committed:** The repository contains zero private keys, API secrets, or real production credentials.
* **Synthetic Data Only:** All audit target domains (`kampus.ac.id`) and scan reports utilize synthetic mock data.
* **AI Disclosure:** All AI pair-programming interactions and human self-verifications are transparently documented in [`AI-Log .md`](./AI-Log%20.md).
