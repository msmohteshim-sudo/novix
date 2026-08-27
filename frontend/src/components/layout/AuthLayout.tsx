import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RotatingIndustryBackground } from '../auth/RotatingIndustryBackground';
import {
  Package, Factory, ShieldCheck, Truck, BarChart2,
  Settings, Sparkles, ChevronRight, ShoppingBag
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
      {/* Full-screen rotating background — sits behind everything */}
      <RotatingIndustryBackground intervalMs={5000} />

      {/* Unified tinted overlay so both columns share the same look */}
      <div className="auth-page-overlay" />

      {/* Content columns — both transparent, same background shows through */}
      <div className="auth-columns">

        {/* LEFT — Marketing / branding column */}
        <div className="auth-left">
          <div className="auth-left-inner">

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

            {/* Spacer — pushes feature cards to the bottom */}
            <div className="auth-left-spacer" />

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
          </div>
        </div>

        {/* RIGHT — Login card column */}
        <div className="auth-right">
          <Outlet />
          <div className="auth-secure-footer">
            <div className="auth-secure-footer-title">
              <ShieldCheck size={13} color="#10b981" /> Protected by Enterprise Security
            </div>
            <span>256-bit SSL Encrypted Connection</span>
          </div>
        </div>

      </div>
    </div>
  );
};
