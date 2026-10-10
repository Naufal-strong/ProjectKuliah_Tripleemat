"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

function ShieldIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ScanIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  );
}

function ChecklistIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function DatabaseIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}

function ReportIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ArrowRightIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ChevronDownIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (2000 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

const features = [
  {
    id: "scan", Icon: ScanIcon, title: "Passive HTTP & SSL Analyzer",
    description: "Automatically scans security headers (CSP, HSTS, X-Frame-Options, CORS) and validates SSL/TLS certificates — no active intrusion required.",
    tags: ["CSP", "HSTS", "SSL/TLS", "CORS"], href: "/scan",
    gradBg: "linear-gradient(135deg,#06b6d4,#2563eb)", accentColor: "#22d3ee",
  },
  {
    id: "asvs", Icon: ChecklistIcon, title: "OWASP ASVS Compliance Engine",
    description: "Interactive verification matrix based on OWASP ASVS Level 1 & 2. Get real-time compliance scores and actionable remediation steps.",
    tags: ["OWASP", "ASVS L1", "ASVS L2", "NIST"], href: "/asvs",
    gradBg: "linear-gradient(135deg,#8b5cf6,#7c3aed)", accentColor: "#a78bfa",
  },
  {
    id: "pii", Icon: DatabaseIcon, title: "PII & Data Leakage Audit",
    description: "Analyzes API responses for Personally Identifiable Information exposure, detecting sensitive data leakage before attackers do.",
    tags: ["PII", "API Audit", "GDPR", "Privacy"], href: "/scan",
    gradBg: "linear-gradient(135deg,#f59e0b,#ea580c)", accentColor: "#fbbf24",
  },
  {
    id: "report", Icon: ReportIcon, title: "Executive Security Scorecard",
    description: "Generate professional PDF audit reports with risk visualizations (High / Medium / Low) ready for formal documentation and stakeholder review.",
    tags: ["PDF Export", "Risk Score", "Audit Trail"], href: "/report",
    gradBg: "linear-gradient(135deg,#10b981,#0d9488)", accentColor: "#34d399",
  },
];

const stats = [
  { value: 200, suffix: "+", label: "ASVS Controls" },
  { value: 12, suffix: "", label: "Security Headers" },
  { value: 99, suffix: "%", label: "Detection Rate" },
  { value: 3, suffix: "s", label: "Avg Scan Time" },
];

const standards = ["OWASP ASVS", "NIST SP 800-53", "ISO 27001", "GDPR", "PCI-DSS"];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const [hovered, setHovered] = useState(false);
  const { Icon } = feature;
  return (
    <Link
      id={`feature-card-${feature.id}`}
      href={feature.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:"relative", padding:"1.75rem", borderRadius:"1.5rem",
        border:`1px solid ${hovered?"rgba(71,85,105,0.9)":"rgba(51,65,85,0.5)"}`,
        backgroundColor: hovered?"rgba(30,41,59,0.8)":"rgba(30,41,59,0.35)",
        backdropFilter:"blur(8px)", textDecoration:"none", display:"block",
        transition:"all 0.3s", overflow:"hidden",
        transform: hovered?"translateY(-6px)":"translateY(0)",
        boxShadow: hovered?"0 25px 50px -12px rgba(0,0,0,0.6)":"0 4px 6px -1px rgba(0,0,0,0.2)",
      }}
    >
      <div style={{
        position:"absolute", inset:0, borderRadius:"1.5rem",
        background:feature.gradBg, opacity: hovered?0.08:0, transition:"opacity 0.3s",
      }} />
      <div style={{
        display:"inline-flex", width:"3.5rem", height:"3.5rem", borderRadius:"1rem",
        background:feature.gradBg, alignItems:"center", justifyContent:"center",
        marginBottom:"1.25rem", boxShadow:"0 10px 25px rgba(0,0,0,0.3)",
        transform: hovered?"scale(1.12)":"scale(1)", transition:"transform 0.3s",
      }}>
        <Icon style={{ width:"1.75rem", height:"1.75rem", color:"white" }} />
      </div>
      <h3 style={{ fontSize:"1.2rem", fontWeight:700, color:"white", marginBottom:"0.75rem" }}>
        {feature.title}
      </h3>
      <p style={{ color: hovered?"#cbd5e1":"#94a3b8", fontSize:"0.9rem", lineHeight:1.7, marginBottom:"1.25rem", transition:"color 0.3s" }}>
        {feature.description}
      </p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"0.4rem", marginBottom:"1rem" }}>
        {feature.tags.map((tag) => (
          <span key={tag} style={{
            padding:"0.2rem 0.65rem", fontSize:"0.72rem", fontWeight:600, borderRadius:"9999px",
            border:"1px solid rgba(71,85,105,0.6)", backgroundColor:"rgba(51,65,85,0.5)", color:"#cbd5e1",
          }}>{tag}</span>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:"0.375rem", fontSize:"0.875rem", fontWeight:600, color:feature.accentColor }}>
        Explore Module
        <ArrowRightIcon style={{ width:"1rem", height:"1rem", transform: hovered?"translateX(4px)":"translateX(0)", transition:"transform 0.2s" }} />
      </div>
    </Link>
  );
}

function StandardBadge({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding:"0.65rem 1.4rem", borderRadius:"9999px",
        border:`1px solid ${hovered?"rgba(6,182,212,0.5)":"rgba(71,85,105,0.6)"}`,
        backgroundColor: hovered?"rgba(6,182,212,0.1)":"rgba(30,41,59,0.6)",
        backdropFilter:"blur(8px)", color: hovered?"#67e8f9":"#e2e8f0",
        fontWeight:600, fontSize:"0.875rem", cursor:"default",
        transition:"all 0.2s",
      }}
    >
      {label}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const [navHover, setNavHover] = useState(false);

  return (
    <nav id="navbar" style={{
      position:"fixed", top:0, left:0, right:0, zIndex:50,
      transition:"all 0.3s",
      backgroundColor: scrolled?"rgba(2,6,23,0.92)":"transparent",
      backdropFilter: scrolled?"blur(20px)":"none",
      borderBottom: scrolled?"1px solid rgba(51,65,85,0.5)":"1px solid transparent",
      boxShadow: scrolled?"0 20px 25px -5px rgba(0,0,0,0.4)":"none",
    }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding:"1rem 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:"2.25rem", height:"2.25rem", borderRadius:"0.75rem", background:"linear-gradient(135deg,#22d3ee,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 8px 20px rgba(34,211,238,0.3)" }}>
              <ShieldIcon style={{ width:"1.25rem", height:"1.25rem", color:"white" }} />
            </div>
            <div style={{ position:"absolute", top:"-2px", right:"-2px", width:"10px", height:"10px", backgroundColor:"#34d399", borderRadius:"50%", border:"2px solid #020617", animation:"tm-pulse 2s infinite" }} />
          </div>
          <div>
            <span style={{ color:"white", fontWeight:700, fontSize:"1.1rem", letterSpacing:"-0.02em" }}>Tripleemat</span>
            <span style={{ color:"#22d3ee", fontWeight:700, fontSize:"1.1rem" }}> SA</span>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"2rem" }}>
          {[{label:"Features",href:"#features"},{label:"Standards",href:"#standards"},{label:"Stats",href:"#stats"}].map((item) => (
            <a key={item.label} href={item.href} style={{ color:"#94a3b8", fontSize:"0.875rem", fontWeight:500, textDecoration:"none", transition:"color 0.2s" }}
              onMouseEnter={(e)=>e.currentTarget.style.color="white"}
              onMouseLeave={(e)=>e.currentTarget.style.color="#94a3b8"}
            >{item.label}</a>
          ))}
        </div>

        <Link id="navbar-start-scan" href="/scan"
          onMouseEnter={()=>setNavHover(true)} onMouseLeave={()=>setNavHover(false)}
          style={{
            display:"flex", alignItems:"center", gap:"0.5rem",
            padding:"0.6rem 1.25rem", background:"linear-gradient(135deg,#06b6d4,#2563eb)",
            color:"white", fontSize:"0.875rem", fontWeight:600, borderRadius:"9999px", textDecoration:"none",
            boxShadow: navHover?"0 15px 30px rgba(6,182,212,0.5)":"0 8px 20px rgba(6,182,212,0.3)",
            transform: navHover?"scale(1.05)":"scale(1)", transition:"all 0.2s",
          }}
        >
          <ScanIcon style={{ width:"1rem", height:"1rem" }} />
          Start Scan
        </Link>
      </div>
    </nav>
  );
}

function Hero() {
  const [scanHover, setScanHover] = useState(false);
  return (
    <section id="hero" style={{ position:"relative", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden", padding:"0 1.5rem" }}>
      <div style={{ position:"absolute", top:"20%", left:"15%", width:"28rem", height:"28rem", backgroundColor:"rgba(6,182,212,0.07)", borderRadius:"50%", filter:"blur(80px)", animation:"tm-pulse 5s ease-in-out infinite" }} />
      <div style={{ position:"absolute", bottom:"20%", right:"15%", width:"22rem", height:"22rem", backgroundColor:"rgba(124,58,237,0.07)", borderRadius:"50%", filter:"blur(80px)", animation:"tm-pulse 5s ease-in-out infinite 1.5s" }} />
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"50rem", height:"50rem", backgroundColor:"rgba(37,99,235,0.04)", borderRadius:"50%", filter:"blur(100px)" }} />

      <div style={{ position:"relative", zIndex:10, textAlign:"center", maxWidth:"64rem", margin:"0 auto", paddingTop:"5rem" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"0.5rem 1rem", borderRadius:"9999px", border:"1px solid rgba(6,182,212,0.3)", backgroundColor:"rgba(6,182,212,0.07)", backdropFilter:"blur(8px)", marginBottom:"2rem" }}>
          <span style={{ width:"0.5rem", height:"0.5rem", backgroundColor:"#34d399", borderRadius:"50%", display:"inline-block", animation:"tm-pulse 2s infinite" }} />
          <span style={{ color:"#67e8f9", fontSize:"0.875rem", fontWeight:500 }}>Automated Security &amp; Compliance Assessment</span>
        </div>

        <h1 style={{ fontSize:"clamp(2.75rem,8vw,5rem)", fontWeight:800, color:"white", marginBottom:"1.5rem", lineHeight:1.06, letterSpacing:"-0.03em" }}>
          Secure Your Web App<br />
          <span style={{ background:"linear-gradient(135deg,#22d3ee,#60a5fa,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            with Confidence
          </span>
        </h1>

        <p style={{ color:"#94a3b8", fontSize:"1.125rem", maxWidth:"42rem", margin:"0 auto 2.5rem", lineHeight:1.8 }}>
          Tripleemat Security Assessor is an{" "}
          <span style={{ color:"#e2e8f0", fontWeight:500 }}>all-in-one platform</span> for auditing web
          application security against{" "}
          <span style={{ color:"#22d3ee", fontWeight:600 }}>OWASP ASVS</span> and{" "}
          <span style={{ color:"#a78bfa", fontWeight:600 }}>NIST SP 800-53</span> — built for security
          auditors, developers, and IT teams.
        </p>

        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:"1rem", marginBottom:"4.5rem" }}>
          <Link id="hero-start-scan" href="/scan"
            onMouseEnter={()=>setScanHover(true)} onMouseLeave={()=>setScanHover(false)}
            style={{
              display:"inline-flex", alignItems:"center", gap:"0.5rem",
              padding:"1rem 2rem", background:"linear-gradient(135deg,#06b6d4,#2563eb)",
              color:"white", fontWeight:700, fontSize:"1rem", borderRadius:"1rem", textDecoration:"none",
              boxShadow: scanHover?"0 25px 50px rgba(6,182,212,0.55)":"0 15px 30px rgba(6,182,212,0.3)",
              transform: scanHover?"scale(1.05)":"scale(1)", transition:"all 0.3s",
            }}
          >
            <ScanIcon style={{ width:"1.25rem", height:"1.25rem" }} />
            Run Security Scan
            <ArrowRightIcon style={{ width:"1rem", height:"1rem", transform:scanHover?"translateX(4px)":"translateX(0)", transition:"transform 0.2s" }} />
          </Link>
          <Link id="hero-view-asvs" href="/asvs" style={{
            display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"1rem 2rem",
            backgroundColor:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
            backdropFilter:"blur(8px)", color:"white", fontWeight:600, fontSize:"1rem",
            borderRadius:"1rem", textDecoration:"none", transition:"all 0.3s",
          }}
            onMouseEnter={(e)=>{e.currentTarget.style.backgroundColor="rgba(255,255,255,0.1)";}}
            onMouseLeave={(e)=>{e.currentTarget.style.backgroundColor="rgba(255,255,255,0.05)";}}
          >
            <ChecklistIcon style={{ width:"1.25rem", height:"1.25rem", color:"#a78bfa" }} />
            OWASP ASVS Checklist
          </Link>
        </div>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem", color:"#475569", animation:"tm-bounce 2s ease-in-out infinite" }}>
          <span style={{ fontSize:"0.7rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase" }}>Explore Features</span>
          <ChevronDownIcon style={{ width:"1.25rem", height:"1.25rem" }} />
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section id="stats" style={{ padding:"4rem 1.5rem" }}>
      <div style={{ maxWidth:"64rem", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:"1rem" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign:"center", padding:"1.5rem", borderRadius:"1rem", border:"1px solid rgba(51,65,85,0.5)", backgroundColor:"rgba(15,23,42,0.5)", backdropFilter:"blur(8px)" }}>
              <div style={{ fontSize:"2.5rem", fontWeight:800, color:"white", marginBottom:"0.25rem" }}>
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ color:"#64748b", fontSize:"0.875rem", fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" style={{ padding:"6rem 1.5rem" }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"4rem" }}>
          <div style={{ display:"inline-flex", alignItems:"center", padding:"0.375rem 1rem", borderRadius:"9999px", border:"1px solid rgba(51,65,85,0.5)", backgroundColor:"rgba(15,23,42,0.5)", marginBottom:"1.25rem" }}>
            <span style={{ color:"#64748b", fontSize:"0.875rem", fontWeight:500 }}>Core Modules</span>
          </div>
          <h2 style={{ fontSize:"clamp(1.75rem,5vw,2.75rem)", fontWeight:700, color:"white", marginBottom:"1rem", letterSpacing:"-0.025em" }}>
            Everything You Need to{" "}
            <span style={{ background:"linear-gradient(135deg,#22d3ee,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Audit &amp; Remediate
            </span>
          </h2>
          <p style={{ color:"#64748b", fontSize:"1.1rem", maxWidth:"38rem", margin:"0 auto" }}>
            Four powerful modules, one unified platform — from passive scanning to formal PDF reports.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.5rem" }}>
          {features.map((f) => <FeatureCard key={f.id} feature={f} />)}
        </div>
      </div>
    </section>
  );
}

function StandardsSection() {
  return (
    <section id="standards" style={{ position:"relative", padding:"5rem 1.5rem", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent,rgba(15,23,42,0.4),transparent)" }} />
      <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:"50rem", height:"14rem", backgroundColor:"rgba(6,182,212,0.04)", borderRadius:"9999px", filter:"blur(60px)" }} />
      <div style={{ position:"relative", maxWidth:"56rem", margin:"0 auto", textAlign:"center" }}>
        <h2 style={{ fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, color:"white", marginBottom:"1rem", letterSpacing:"-0.025em" }}>
          Aligned With Industry Standards
        </h2>
        <p style={{ color:"#64748b", marginBottom:"3rem", maxWidth:"32rem", margin:"0 auto 3rem" }}>
          All assessments are mapped to globally recognized security frameworks and compliance requirements.
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:"1rem" }}>
          {standards.map((s) => <StandardBadge key={s} label={s} />)}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  const [scanHover, setScanHover] = useState(false);
  return (
    <section id="cta" style={{ padding:"6rem 1.5rem" }}>
      <div style={{ maxWidth:"56rem", margin:"0 auto" }}>
        <div style={{ position:"relative", borderRadius:"2rem", overflow:"hidden", border:"1px solid rgba(51,65,85,0.6)", background:"linear-gradient(135deg,rgba(15,23,42,0.9),rgba(30,41,59,0.7),rgba(2,6,23,0.9))", backdropFilter:"blur(20px)", padding:"4rem 2rem", textAlign:"center" }}>
          <div style={{ position:"absolute", top:0, left:"20%", width:"18rem", height:"18rem", backgroundColor:"rgba(6,182,212,0.12)", borderRadius:"50%", filter:"blur(60px)" }} />
          <div style={{ position:"absolute", bottom:0, right:"20%", width:"18rem", height:"18rem", backgroundColor:"rgba(124,58,237,0.12)", borderRadius:"50%", filter:"blur(60px)" }} />
          <div style={{ position:"relative", zIndex:10 }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:"1.5rem" }}>
              <div style={{ width:"5rem", height:"5rem", borderRadius:"1.5rem", background:"linear-gradient(135deg,#22d3ee,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 25px 50px rgba(6,182,212,0.4)" }}>
                <ShieldIcon style={{ width:"2.5rem", height:"2.5rem", color:"white" }} />
              </div>
            </div>
            <h2 style={{ fontSize:"clamp(2rem,5vw,3rem)", fontWeight:800, color:"white", marginBottom:"1rem", letterSpacing:"-0.025em" }}>
              Ready to Secure Your<br />
              <span style={{ background:"linear-gradient(135deg,#22d3ee,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Web Application?
              </span>
            </h2>
            <p style={{ color:"#64748b", fontSize:"1.1rem", maxWidth:"36rem", margin:"0 auto 2.5rem", lineHeight:1.8 }}>
              Run your first passive security assessment in seconds. No installation. No active intrusion. Just results.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"1rem", justifyContent:"center" }}>
              <Link id="cta-start-scan" href="/scan"
                onMouseEnter={()=>setScanHover(true)} onMouseLeave={()=>setScanHover(false)}
                style={{
                  display:"inline-flex", alignItems:"center", gap:"0.5rem",
                  padding:"1rem 2.5rem", background:"linear-gradient(135deg,#06b6d4,#2563eb)",
                  color:"white", fontWeight:700, fontSize:"1rem", borderRadius:"1rem", textDecoration:"none",
                  boxShadow: scanHover?"0 25px 50px rgba(6,182,212,0.55)":"0 15px 30px rgba(6,182,212,0.35)",
                  transform: scanHover?"scale(1.05)":"scale(1)", transition:"all 0.3s",
                }}
              >
                <ScanIcon style={{ width:"1.25rem", height:"1.25rem" }} />
                Start Free Scan
                <ArrowRightIcon style={{ width:"1rem", height:"1rem" }} />
              </Link>
              <Link id="cta-view-report" href="/report" style={{
                display:"inline-flex", alignItems:"center", gap:"0.5rem", padding:"1rem 2.5rem",
                backgroundColor:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)",
                color:"white", fontWeight:600, fontSize:"1rem", borderRadius:"1rem", textDecoration:"none", transition:"all 0.3s",
              }}
                onMouseEnter={(e)=>{e.currentTarget.style.backgroundColor="rgba(255,255,255,0.1)";}}
                onMouseLeave={(e)=>{e.currentTarget.style.backgroundColor="rgba(255,255,255,0.05)";}}
              >
                <ReportIcon style={{ width:"1.25rem", height:"1.25rem", color:"#34d399" }} />
                View Sample Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop:"1px solid rgba(15,23,42,1)", padding:"2.5rem 1.5rem" }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:"1rem" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.625rem" }}>
          <div style={{ width:"1.75rem", height:"1.75rem", borderRadius:"0.5rem", background:"linear-gradient(135deg,#22d3ee,#2563eb)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <ShieldIcon style={{ width:"1rem", height:"1rem", color:"white" }} />
          </div>
          <span style={{ color:"#475569", fontSize:"0.875rem" }}>
            <span style={{ color:"white", fontWeight:600 }}>Tripleemat Security Assessor</span>
            {" "}— OWASP ASVS &amp; NIST Compliance Platform
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"1.5rem", color:"#334155", fontSize:"0.875rem" }}>
          <span>Built with Next.js &amp; TypeScript</span>
          <span>•</span>
          <span>© {new Date().getFullYear()} Tripleemat</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#020617", color:"white", fontFamily:"var(--font-geist-sans),Inter,system-ui,sans-serif" }}>
      <style>{`
        @keyframes tm-pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes tm-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
      `}</style>
      <Navbar />
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <StandardsSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
