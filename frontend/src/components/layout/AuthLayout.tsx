import React, { useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RotatingIndustryBackground } from '../auth/RotatingIndustryBackground';
import {
  Package, Factory, ShieldCheck, Truck, BarChart2,
  Settings, Sparkles, ChevronRight, ShoppingBag, ChevronDown
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
      {/* Full-screen rotating background — sits behind everything */}
      <RotatingIndustryBackground intervalMs={5000} />

      {/* Unified tinted overlay */}
      <div className="auth-page-overlay" />

      {/* Scrollable container for swipe down / scroll down to next page */}
      <div className="auth-scroll-container">

        {/* PAGE 1: Main Full-Screen Hero Landing Overview (No Login Form) */}
        <section className="auth-section auth-hero-section">
          <div className="auth-hero-content">

            {/* Logo */}
            <div className="novax-logo-container">
              <div className="novax-logo-icon"><span>N</span></div>
              <span className="novax-brand-text">NOVAX</span>
              <span className="novax-badge-pill">Enterprise ERP</span>
            </div>

            {/* Headline */}
            <h1 className="auth-headline">
              SMART OPERATIONS.<br />
              <span className="text-gradient-cyan">CONNECTED BUSINESSES.</span>
            </h1>
            <p className="auth-subheadline">
              AI-Powered ERP platform to manage, automate and grow your business across{' '}
              <span className="highlight-industry">every industry</span>.
            </p>

            {/* Operations flow strip */}
            <div className="auth-flowchart-container">
              <div className="flow-step">
                <div className="flow-icon-wrapper"><ShoppingBag size={20} /></div>
                <div className="flow-label">PROCUREMENT</div>
              </div>
              <ChevronRight className="flow-arrow" size={16} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><Package size={20} /></div>
                <div className="flow-label">INVENTORY</div>
              </div>
              <ChevronRight className="flow-arrow" size={16} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><Factory size={20} /></div>
                <div className="flow-label">PRODUCTION</div>
              </div>
              <ChevronRight className="flow-arrow" size={16} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><ShieldCheck size={20} /></div>
                <div className="flow-label">QUALITY</div>
              </div>
              <ChevronRight className="flow-arrow" size={16} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><Truck size={20} /></div>
                <div className="flow-label">LOGISTICS</div>
              </div>
              <ChevronRight className="flow-arrow" size={16} />
              <div className="flow-step">
                <div className="flow-icon-wrapper"><BarChart2 size={20} /></div>
                <div className="flow-label">ANALYTICS</div>
              </div>
            </div>

            {/* Feature cards */}
            <div className="auth-features-bottom-grid">
              {[
                { icon: <Settings size={18} />, title: 'AI POWERED', sub: 'Smarter decisions with intelligent automation' },
                { icon: <BarChart2 size={18} />, title: 'REAL-TIME INSIGHTS', sub: 'Live visibility across all your operations' },
                { icon: <ShieldCheck size={18} />, title: 'SECURE & RELIABLE', sub: 'Enterprise-grade security you can trust' },
                { icon: <Sparkles size={18} />, title: 'BUILT FOR GROWTH', sub: 'Scalable platform to grow with your business' },
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

          </div>

          {/* Swipe / Scroll Down prompt bar */}
          <button className="auth-scroll-down-btn" onClick={scrollToLogin} aria-label="Scroll down to Login">
            <span>SWIPE / SCROLL DOWN FOR LOGIN & REGISTER</span>
            <ChevronDown size={18} className="scroll-down-arrow" />
          </button>
        </section>

        {/* PAGE 2 (DOWNSIDE / NEXT PAGE): Dedicated Full View Login & Register Page */}
        <section ref={loginSectionRef} className="auth-section auth-downside-section">
          <div className="auth-downside-content">
            <div className="auth-downside-header">
              <div className="novax-logo-container" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
                <div className="novax-logo-icon"><span>N</span></div>
                <span className="novax-brand-text" style={{ fontSize: '1.6rem' }}>NOVAX</span>
              </div>
            </div>

            <div className="auth-downside-card-wrapper">
              <Outlet />
            </div>

            <div className="auth-secure-footer" style={{ marginTop: '1.5rem' }}>
              <div className="auth-secure-footer-title">
                <ShieldCheck size={13} color="#10b981" /> Protected by Enterprise Security
              </div>
              <span>256-bit SSL Encrypted Connection</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
