import React, { useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RotatingIndustryBackground } from '../auth/RotatingIndustryBackground';
import {
  Package, Factory, ShieldCheck, Truck, BarChart2,
  Settings, Sparkles, ChevronRight, ShoppingBag, ChevronDown,
  Cpu, CheckCircle2, Building2, Play, ArrowRight
} from 'lucide-react';
import '../../pages/auth/auth.css';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const loginSectionRef = useRef<HTMLDivElement>(null);

  const scrollToLogin = () => {
    loginSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

      {/* Scrollable container for swipe down / scroll down to next page */}
      <div className="auth-scroll-container">

        {/* PAGE 1: Main Full-Screen Hero Landing Page */}
        <section className="auth-section auth-hero-section">
          {/* Full-screen rotating photo background — strictly for Page 1 */}
          <RotatingIndustryBackground intervalMs={5000} showControls={true} />

          {/* Page 1 Tint Overlay */}
          <div className="auth-page-overlay" />

          {/* Top Header Navbar */}
          <header className="landing-navbar">
            <div className="novax-logo-container">
              <div className="novax-logo-icon"><span>N</span></div>
              <span className="novax-brand-text">NOVAX</span>
              <span className="novax-badge-pill">Enterprise ERP</span>
            </div>

            <nav className="landing-nav-links">
              <a href="#home" className="nav-link active">Home</a>
              <a href="#industries" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToLogin(); }}>Industries</a>
              <a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToLogin(); }}>Features</a>
              <a href="#resources" className="nav-link">Resources</a>
              <a href="#about" className="nav-link">About Us</a>
              <button className="nav-get-started-btn" onClick={scrollToLogin}>
                Get Started
              </button>
            </nav>
          </header>

          <div className="auth-hero-content">

            {/* Main Headline */}
            <h1 className="auth-headline">
              SMART OPERATIONS.<br />
              <span className="text-gradient-cyan">CONNECTED BUSINESSES.</span>
            </h1>

            {/* Subheadline */}
            <p className="auth-subheadline">
              AI-Powered ERP platform to manage, automate and grow your business across{' '}
              <span className="highlight-industry">every industry</span>.
            </p>

            {/* Hero Action Buttons */}
            <div className="hero-cta-buttons">
              <button className="hero-btn-primary" onClick={scrollToLogin}>
                <span>Explore NOVAX</span>
                <ArrowRight size={16} />
              </button>
              <button className="hero-btn-secondary" onClick={scrollToLogin}>
                <span>Watch Demo</span>
                <Play size={14} fill="currentColor" />
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

            {/* Middle Combined Row: Features + Platform Stats */}
            <div className="hero-features-stats-row">
              {/* Features (Left side) */}
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

              {/* Platform Stats (Right side) */}
              <div className="platform-stats-box">
                <div className="stat-item">
                  <div className="stat-num">25+</div>
                  <div className="stat-text">Industries</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-num">10K+</div>
                  <div className="stat-text">Businesses</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-num">1M+</div>
                  <div className="stat-text">Users</div>
                </div>
                <div className="stat-divider" />
                <div className="stat-item">
                  <div className="stat-num">99.9%</div>
                  <div className="stat-text">Uptime</div>
                </div>
              </div>
            </div>

            {/* Industry Cards Thumbnail Carousel Strip */}
            <div className="industry-thumbnails-strip-wrapper">
              <div className="strip-title-label">
                POWERING OPERATIONS ACROSS MULTIPLE <span className="highlight-blue">INDUSTRIES</span>
              </div>
              <div className="industry-cards-scroll-grid">
                {[
                  { name: 'Textile Manufacturing', img: '/images/textile-spinning.jpg' },
                  { name: 'Poultry / Farm ERP', img: '/images/poultry-farm.jpg' },
                  { name: 'Steel Manufacturing', img: '/images/steel-mill.jpg' },
                  { name: 'Automobile Manufacturing', img: '/images/auto-assembly.jpg' },
                  { name: 'Food Processing', img: '/images/food-processing.jpg' },
                  { name: 'Logistics & Warehouse', img: '/images/warehouse-logistics.jpg' },
                  { name: 'Sugar Manufacturing', img: '/images/sugarcane-mill.jpg' },
                  { name: 'Pharmaceutical Manufacturing', img: '/images/food-processing.jpg' },
                  { name: 'Cement Manufacturing', img: '/images/steel-mill.jpg' },
                  { name: 'Agriculture & Farming', img: '/images/sugarcane-mill.jpg' },
                  { name: 'Engineering Manufacturing', img: '/images/auto-assembly.jpg' },
                  { name: 'FMCG Manufacturing', img: '/images/footwear-factory.jpg' },
                ].map((ind) => (
                  <div key={ind.name} className="industry-thumb-card" onClick={scrollToLogin}>
                    <img src={ind.img} alt={ind.name} className="thumb-img" />
                    <div className="thumb-overlay" />
                    <span className="thumb-title">{ind.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Swipe / Scroll Down prompt bar */}
          <button className="auth-scroll-down-btn" onClick={scrollToLogin} aria-label="Scroll down to Login">
            <span>SWIPE / SCROLL DOWN FOR LOGIN & APP DETAILS</span>
            <ChevronDown size={18} className="scroll-down-arrow" />
          </button>
        </section>

        {/* PAGE 2 (DOWNSIDE / NEXT PAGE): Dedicated Dark Background with App Details & Login Card */}
        <section ref={loginSectionRef} className="auth-section auth-downside-section">
          <div className="auth-downside-grid-container">

            {/* LEFT — NOVAX App Info & Supported Industries */}
            <div className="auth-app-info-panel">
              <div className="novax-logo-container" style={{ marginBottom: '1rem' }}>
                <div className="novax-logo-icon"><span>N</span></div>
                <span className="novax-brand-text" style={{ fontSize: '1.7rem' }}>NOVAX</span>
                <span className="novax-badge-pill">App Overview</span>
              </div>

              <h2 className="info-panel-title">
                ENTERPRISE ERP POWERING<br />
                <span className="text-gradient-cyan">MULTI-INDUSTRY OPERATIONS</span>
              </h2>

              <p className="info-panel-desc">
                NOVAX seamlessly connects production, inventory, sales, logistics, and employee workflows into a single intelligent real-time control center.
              </p>

              {/* Supported Industries Badges */}
              <div className="info-section-label">
                <Building2 size={15} color="#38bdf8" /> INDUSTRIES CURRENTLY POWERED BY NOVAX
              </div>
              <div className="supported-industries-grid">
                {[
                  { name: 'Textile & Spinning Mills', icon: '🧵' },
                  { name: 'Poultry & Farm ERP', icon: '🐓' },
                  { name: 'Food & Beverage Processing', icon: '🥦' },
                  { name: 'Automotive & Assembly', icon: '🚗' },
                  { name: 'Steel & Heavy Manufacturing', icon: '🔩' },
                  { name: 'Warehousing & Logistics', icon: '📦' },
                  { name: 'Footwear & Consumer Goods', icon: '👟' },
                  { name: 'Pharmaceutical Cleanrooms', icon: '💊' },
                ].map((ind) => (
                  <div key={ind.name} className="industry-info-badge">
                    <span className="ind-icon">{ind.icon}</span>
                    <span className="ind-name">{ind.name}</span>
                  </div>
                ))}
              </div>

              {/* Key Platform Capabilities */}
              <div className="info-section-label" style={{ marginTop: '1.2rem' }}>
                <Cpu size={15} color="#818cf8" /> CORE PLATFORM HIGHLIGHTS
              </div>
              <div className="platform-highlights-list">
                {[
                  'Role-Based Portals for Admins, Managers, Buyers, Sellers & Employees',
                  'AI Advisor for Predictive Demand, Maintenance & Inventory Alerts',
                  'End-to-End Batch & Shed Tracking for Farm & Manufacturing Lines',
                  'Automated Procurement, Purchase Orders & Supplier Quality Inspections'
                ].map((item, idx) => (
                  <div key={idx} className="highlight-list-item">
                    <CheckCircle2 size={15} className="highlight-check-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Stat metrics pill */}
              <div className="info-metrics-row">
                <div className="metric-box">
                  <div className="metric-value">99.9%</div>
                  <div className="metric-label">Uptime Guarantee</div>
                </div>
                <div className="metric-box">
                  <div className="metric-value">256-Bit</div>
                  <div className="metric-label">SSL Security</div>
                </div>
                <div className="metric-box">
                  <div className="metric-value">Multi-Role</div>
                  <div className="metric-label">Smart Access</div>
                </div>
              </div>
            </div>

            {/* RIGHT — Dedicated Login / Register Card */}
            <div className="auth-downside-card-column">
              <Outlet />
              <div className="auth-secure-footer" style={{ marginTop: '1.2rem' }}>
                <div className="auth-secure-footer-title">
                  <ShieldCheck size={13} color="#10b981" /> Protected by Enterprise Security
                </div>
                <span>256-bit SSL Encrypted Connection</span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
