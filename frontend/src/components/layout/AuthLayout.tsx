import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RotatingIndustryBackground } from '../auth/RotatingIndustryBackground';
import {
  Package, Factory, ShieldCheck, Truck, BarChart2,
  ChevronRight, ShoppingBag, ChevronDown,
  Cpu, CheckCircle2, Building2
} from 'lucide-react';
import '../../pages/auth/auth.css';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-loading">
        <p>Loading NOVAX ERP…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-page">

      {/* ── SCROLL CONTAINER — transparent passthrough, body scrolls ── */}
      <div className="auth-scroll-container">

        {/* ══════════════════════════════════════════════
            PAGE 1 — HERO SECTION (100vh)
            ══════════════════════════════════════════════ */}
        <section id="home" className="auth-section auth-hero-section">

          {/* Full-screen rotating photo background */}
          <RotatingIndustryBackground intervalMs={5500} showControls={true} />

          {/* Dark overlay — keeps image visible, text readable */}
          <div className="auth-page-overlay" />

          {/* ── NAVBAR ─────────────────────────────────── */}
          <header className="landing-navbar">
            <div className="novax-logo-container">
              <div className="novax-logo-icon"><span>N</span></div>
              <span className="novax-brand-text">NOVAX</span>
              <span className="novax-badge-pill">Enterprise ERP</span>
            </div>

            <nav className="landing-nav-links">
              <a href="#home" className="nav-link active">Home</a>
              <a href="#app-overview" className="nav-link">Industries</a>
              <a href="#app-overview" className="nav-link">Features</a>
              <a href="#app-overview" className="nav-link">Resources</a>
              <a href="#app-overview" className="nav-link">About Us</a>
              <a href="#app-overview" className="nav-get-started-btn">
                Get Started
              </a>
            </nav>
          </header>

          {/* ── HERO CONTENT — SPLIT GRID ──────────────── */}
          <div className="auth-hero-split-grid">

            {/* LEFT COLUMN — Executive Branding Headline */}
            <div className="auth-hero-left-content">

              {/* Eyebrow Badge */}
              <div className="hero-eyebrow-badge">
                <span>⚡ NEXT-GEN ENTERPRISE ERP</span>
              </div>

              {/* Main Headline */}
              <h1 className="auth-headline">
                Smart Operations.<br />
                <span className="text-gradient-cyan">Connected Businesses.</span>
              </h1>

              {/* Refined Sub-caption */}
              <p className="hero-tagline-sub">
                Real-time intelligence and automated multi-role workflows engineered for modern enterprise productivity.
              </p>

            </div>

            {/* RIGHT COLUMN — Login Card */}
            <div className="auth-hero-right-login-column">
              <Outlet />
              <div className="auth-secure-footer">
                <div className="auth-secure-footer-title">
                  <ShieldCheck size={13} color="#10b981" /> Protected by Enterprise Security
                </div>
                <span>256-bit SSL Encrypted Connection</span>
              </div>
            </div>

          </div>{/* /auth-hero-split-grid */}

          {/* ── HERO BOTTOM BAR — Process flow + Scroll indicator ── */}
          <div className="hero-bottom-bar">

            {/* Operations Process Flow */}
            <div className="auth-flowchart-container">
              <div className="flow-step">
                <div className="flow-icon-wrapper"><ShoppingBag size={13} /></div>
                <span className="flow-label">PROCUREMENT</span>
              </div>
              <ChevronRight className="flow-arrow" size={12} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><Package size={13} /></div>
                <span className="flow-label">INVENTORY</span>
              </div>
              <ChevronRight className="flow-arrow" size={12} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><Factory size={13} /></div>
                <span className="flow-label">PRODUCTION</span>
              </div>
              <ChevronRight className="flow-arrow" size={12} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><ShieldCheck size={13} /></div>
                <span className="flow-label">QUALITY</span>
              </div>
              <ChevronRight className="flow-arrow" size={12} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><Truck size={13} /></div>
                <span className="flow-label">LOGISTICS</span>
              </div>
              <ChevronRight className="flow-arrow" size={12} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><BarChart2 size={13} /></div>
                <span className="flow-label">ANALYTICS</span>
              </div>
            </div>

            {/* Scroll Down Anchor Button */}
            <a href="#app-overview" className="auth-scroll-down-btn" aria-label="Scroll down for app overview">
              <span>SCROLL DOWN FOR APP OVERVIEW &amp; HIGHLIGHTS</span>
              <ChevronDown size={16} className="scroll-down-arrow" />
            </a>

          </div>{/* /hero-bottom-bar */}

          {/* Smooth Fade Transition Overlay at bottom of hero */}
          <div className="hero-bottom-fade-gradient" />

        </section>{/* /auth-hero-section */}

        {/* ══════════════════════════════════════════════
            PAGE 2 — STRUCTURED NOVAX PLATFORM OVERVIEW
            ══════════════════════════════════════════════ */}
        <section id="app-overview" className="auth-section auth-downside-section">
          <div className="auth-downside-grid-container" style={{ gridTemplateColumns: '1fr' }}>

            {/* Full-width Structured App Overview Panel */}
            <div className="auth-app-info-panel" style={{ maxWidth: '1000px', margin: '0 auto', gap: '2rem' }}>
              
              {/* Header */}
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                <div className="novax-badge-pill" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }}>
                  🚀 PLATFORM OVERVIEW
                </div>
                <h2 className="info-panel-title" style={{ fontSize: '2.2rem', textAlign: 'center' }}>
                  NEXT-GENERATION ENTERPRISE ARCHITECTURE
                </h2>
                <p className="info-panel-desc" style={{ textAlign: 'center', maxWidth: '750px', fontSize: '1rem', color: '#94a3b8' }}>
                  NOVAX unites shop-floor machine intelligence, multi-warehouse logistics, financial ledgers, and automated workforce management into a single real-time enterprise platform.
                </p>
              </div>

              {/* 6 Core Modules Grid */}
              <div className="info-section-label" style={{ marginTop: '0.5rem' }}>
                <Cpu size={15} color="#38bdf8" /> CORE ENTERPRISE MODULES
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
                {[
                  {
                    icon: <Factory size={22} color="#38bdf8" />,
                    title: 'Manufacturing Control',
                    desc: 'Real-time spinning & loom tracking, work order scheduling, yield analytics, and machine OEE diagnostics.'
                  },
                  {
                    icon: <Package size={22} color="#818cf8" />,
                    title: 'Inventory & Supply Chain',
                    desc: 'Multi-location warehouse tracking, batch lot traceability, barcode scanning, and automated reorder alerts.'
                  },
                  {
                    icon: <ShoppingBag size={22} color="#c084fc" />,
                    title: 'Procurement & B2B Sales',
                    desc: 'Supplier purchase order management, wholesale B2B quotation engine, and buyer/seller portals.'
                  },
                  {
                    icon: <BarChart2 size={22} color="#34d399" />,
                    title: 'Financials & AI Insights',
                    desc: 'General ledger accounting, operational cost-center tracking, profit margins, and AI demand forecasting.'
                  },
                  {
                    icon: <Building2 size={22} color="#fbbf24" />,
                    title: 'Workforce Governance',
                    desc: 'Multi-role portal access for Admins, Managers, Buyers, Sellers, and Employees with granular permissions.'
                  },
                  {
                    icon: <ShieldCheck size={22} color="#f43f5e" />,
                    title: 'Security & Compliance',
                    desc: '256-bit SSL encryption, immutable audit logging, role segregation, and 99.99% high-availability uptime.'
                  }
                ].map((mod, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                      borderRadius: '14px',
                      padding: '1.3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      backdropFilter: 'blur(12px)'
                    }}
                  >
                    <div style={{ background: 'rgba(255, 255, 255, 0.06)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {mod.icon}
                    </div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>{mod.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>{mod.desc}</div>
                  </div>
                ))}
              </div>

              {/* 3-Step Enterprise Deployment Workflow */}
              <div className="info-section-label" style={{ marginTop: '1rem' }}>
                <CheckCircle2 size={15} color="#34d399" /> HOW NOVAX OPERATES IN 3 STEPS
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { step: '01', title: 'Connect & Ingest', text: 'Integrate floor machinery, warehouse stock, and department roles into unified digital ledgers.' },
                  { step: '02', title: 'Automate & Optimize', text: 'AI engines detect bottlenecks, auto-dispatch purchase orders, and optimize machine scheduling.' },
                  { step: '03', title: 'Execute & Scale', text: 'Empower Admins, Managers, Sellers, Buyers, and Employees with real-time role-tailored dashboards.' }
                ].map((st) => (
                  <div
                    key={st.step}
                    style={{
                      background: 'rgba(10, 15, 30, 0.50)',
                      border: '1px solid rgba(56, 189, 248, 0.20)',
                      borderRadius: '12px',
                      padding: '1.1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.1em' }}>STEP {st.step}</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f1f5f9' }}>{st.title}</span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.45 }}>{st.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust & SLA Metrics Banner */}
              <div className="info-metrics-row" style={{ marginTop: '1rem' }}>
                <div className="metric-box">
                  <div className="metric-value">99.99%</div>
                  <div className="metric-label">Uptime SLA Guarantee</div>
                </div>
                <div className="metric-box">
                  <div className="metric-value">256-Bit</div>
                  <div className="metric-label">SSL & Role-Based Access</div>
                </div>
                <div className="metric-box">
                  <div className="metric-value">Real-Time</div>
                  <div className="metric-label">Multi-Role Operation Sync</div>
                </div>
              </div>

            </div>
          </div>
        </section>{/* /app-overview */}

      </div>{/* /auth-scroll-container */}
    </div>
  );
};
