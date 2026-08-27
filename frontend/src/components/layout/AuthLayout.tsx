import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RotatingIndustryBackground } from '../auth/RotatingIndustryBackground';
import {
  Package, Factory, ShieldCheck, Truck, BarChart2,
  Settings, Sparkles, ChevronRight, ShoppingBag, ChevronDown,
  ArrowRight, Activity, CheckCircle2
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="auth-page">
      {/* Full-screen rotating background — fixed behind everything */}
      <RotatingIndustryBackground intervalMs={5000} />

      {/* Unified dark overlay */}
      <div className="auth-page-overlay" />

      {/* Sticky Navigation Header */}
      <header className="novax-navbar">
        <div className="novax-navbar-inner">
          <div className="novax-logo-container" onClick={() => scrollToSection('hero-section')} style={{ cursor: 'pointer' }}>
            <div className="novax-logo-icon"><span>N</span></div>
            <span className="novax-brand-text">NOVAX</span>
            <span className="novax-badge-pill">Enterprise ERP</span>
          </div>

          <nav className="novax-nav-links">
            <button className="nav-link" onClick={() => scrollToSection('hero-section')}>Home</button>
            <button className="nav-link" onClick={() => scrollToSection('industries-section')}>Industries</button>
            <button className="nav-link" onClick={() => scrollToSection('features-section')}>Features</button>
            <button className="nav-link nav-link-cta" onClick={() => scrollToSection('auth-section')}>Login / Register</button>
          </nav>
        </div>
      </header>

      {/* Main Landing Content Container */}
      <div className="landing-content">
        
        {/* SECTION 1: HERO (100vh) */}
        <section id="hero-section" className="novax-hero">
          <div className="novax-hero-inner">
            <div className="hero-badge">
              <Sparkles size={14} /> Next-Gen AI Industrial Operating System
            </div>

            <h1 className="auth-headline">
              SMART OPERATIONS.<br />
              <span className="text-gradient-cyan">CONNECTED BUSINESSES.</span>
            </h1>

            <p className="auth-subheadline">
              AI-Powered ERP platform to manage, automate and grow your business across{' '}
              <span className="highlight-industry">every industry</span>.
            </p>

            {/* Hero CTAs */}
            <div className="hero-cta-group">
              <button className="btn-hero-primary" onClick={() => scrollToSection('features-section')}>
                Explore NOVAX <ArrowRight size={18} />
              </button>
              <button className="btn-hero-secondary" onClick={() => scrollToSection('auth-section')}>
                Get Started / Login
              </button>
            </div>

            {/* Operations flow strip */}
            <div className="auth-flowchart-container">
              <div className="flow-step">
                <div className="flow-icon-wrapper"><ShoppingBag size={18} /></div>
                <div className="flow-label">PROCUREMENT</div>
              </div>
              <ChevronRight className="flow-arrow" size={14} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><Package size={18} /></div>
                <div className="flow-label">INVENTORY</div>
              </div>
              <ChevronRight className="flow-arrow" size={14} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><Factory size={18} /></div>
                <div className="flow-label">PRODUCTION</div>
              </div>
              <ChevronRight className="flow-arrow" size={14} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><ShieldCheck size={18} /></div>
                <div className="flow-label">QUALITY</div>
              </div>
              <ChevronRight className="flow-arrow" size={14} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><Truck size={18} /></div>
                <div className="flow-label">LOGISTICS</div>
              </div>
              <ChevronRight className="flow-arrow" size={14} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><BarChart2 size={18} /></div>
                <div className="flow-label">ANALYTICS</div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="auth-features-bottom-grid">
              {[
                { icon: <Settings size={16} />, title: 'AI POWERED', sub: 'Smarter decisions with intelligent automation' },
                { icon: <BarChart2 size={16} />, title: 'REAL-TIME INSIGHTS', sub: 'Live visibility across all your operations' },
                { icon: <ShieldCheck size={16} />, title: 'SECURE & RELIABLE', sub: 'Enterprise-grade security you can trust' },
                { icon: <Sparkles size={16} />, title: 'BUILT FOR GROWTH', sub: 'Scalable platform to grow with your business' },
              ].map((f) => (
                <div key={f.title} className="auth-feature-card">
                  <div className="feature-card-icon">{f.icon}</div>
                  <div className="feature-card-content">
                    <div className="feature-card-title">{f.title}</div>
                    <div className="feature-card-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator" onClick={() => scrollToSection('features-section')}>
              <span>Scroll to explore</span>
              <ChevronDown size={18} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* SECTION 2: NOVAX OVERVIEW & CAPABILITIES */}
        <section id="features-section" className="novax-overview-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-tag">COMPLETE OPERATIONAL SUITE</span>
              <h2 className="section-title">One Platform to Manage Your Entire Enterprise</h2>
              <p className="section-subtitle">
                NOVAX unifies shop-floor manufacturing, farm yield analytics, supply chains, and executive decisions into a single real-time intelligence hub.
              </p>
            </div>

            {/* Operational Benefits Grid */}
            <div className="benefits-grid">
              {[
                { icon: <Factory size={22} />, title: 'Manage Operations', desc: 'Unified control over machines, shifts, work orders, and shop-floor productivity.' },
                { icon: <Activity size={22} />, title: 'Monitor Production', desc: 'Real-time telemetry, batch outputs, machine downtime tracking, and yield analytics.' },
                { icon: <Package size={22} />, title: 'Track Inventory', desc: 'Automated stock management, raw material reorders, and batch traceability.' },
                { icon: <ShoppingBag size={22} />, title: 'Manage Procurement', desc: 'Supplier contracts, purchase orders, vendor evaluation, and cost optimization.' },
                { icon: <ShieldCheck size={22} />, title: 'Monitor Quality', desc: 'In-line inspections, defect detection, compliance logging, and quality metrics.' },
                { icon: <Truck size={22} />, title: 'Control Logistics', desc: 'Dispatch planning, fleet tracking, warehouse shipping, and distribution status.' },
                { icon: <BarChart2 size={22} />, title: 'Analyze Performance', desc: 'AI-driven executive dashboards, margin calculations, and predictive forecasts.' },
              ].map((b) => (
                <div key={b.title} className="benefit-card">
                  <div className="benefit-icon-box">{b.icon}</div>
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>

            {/* Supported Industries Showcase */}
            <div id="industries-section" className="industries-showcase">
              <h3 className="industries-title">Engineered For India's Flagship Industries</h3>
              <div className="industry-pills-grid">
                {[
                  'Textile Manufacturing',
                  'Poultry & Farm ERP',
                  'Steel & Metals',
                  'Automobile Assembly',
                  'Food Processing',
                  'Logistics & Warehousing',
                  'Sugar Mills',
                  'Pharmaceuticals',
                  'FMCG Production',
                  'Heavy Engineering'
                ].map((ind) => (
                  <div key={ind} className="industry-pill">
                    <CheckCircle2 size={16} color="#06b6d4" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: LOGIN / REGISTRATION WORKSPACE */}
        <section id="auth-section" className="novax-auth-section">
          <div className="auth-section-container">
            <div className="auth-section-header">
              <span className="auth-section-tag">SECURE ACCESS</span>
              <h2 className="auth-section-title">Access Your NOVAX Workspace</h2>
              <p className="auth-section-subtitle">Select your industry and role to continue.</p>
            </div>

            {/* Login / Register Card Container */}
            <div className="auth-card-container">
              <Outlet />
            </div>

            <div className="auth-secure-footer">
              <div className="auth-secure-footer-title">
                <ShieldCheck size={14} color="#10b981" /> Protected by Enterprise Security
              </div>
              <span>256-bit SSL Encrypted Connection</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="novax-footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="novax-logo-icon"><span>N</span></div>
              <span className="novax-brand-text">NOVAX</span>
              <span className="footer-copy">© 2026 NOVAX Enterprise ERP. All rights reserved.</span>
            </div>
            <div className="footer-status">
              <span className="status-dot"></span> System Operational • SSL Secured
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};
