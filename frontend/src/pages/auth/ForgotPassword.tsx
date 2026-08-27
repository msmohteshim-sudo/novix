import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { authService } from '../../services/auth.service';
import './auth.css';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header-center">
        <div className="novax-logo-container">
          <div style={{ background: '#2563eb', padding: '0.25rem', borderRadius: '4px' }}>
            <span style={{ color: 'white', fontWeight: 900, fontSize: '1.25rem', lineHeight: 1 }}>N</span>
          </div>
          <span className="novax-brand-text" style={{ fontSize: '1.5rem' }}>NOVAX</span>
        </div>
        
        <h2 className="auth-welcome" style={{ fontSize: '1.5rem' }}>Reset Password</h2>
        <p className="auth-welcome-sub">Enter your email to receive a reset link</p>
      </div>

      {error && <div className="auth-error">{error}</div>}
      
      {success ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ color: '#10b981', marginBottom: '1rem' }}>
            <Send size={48} style={{ margin: '0 auto' }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>Link Sent!</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
          </p>
          <Link to="/auth/login" className="auth-btn" style={{ textDecoration: 'none' }}>
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input 
                type="email" 
                className="auth-input"
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '0.5rem' }}>
            <Send size={18} />
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      {!success && (
        <div className="auth-links" style={{ marginTop: '2rem' }}>
          <Link to="/auth/login" className="auth-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      )}
    </div>
  );
};
