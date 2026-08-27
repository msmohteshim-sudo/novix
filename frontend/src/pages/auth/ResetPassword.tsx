import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { authService } from '../../services/auth.service';
import './auth.css';

export const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL search params (e.g. ?token=abc)
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
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
        
        <h2 className="auth-welcome" style={{ fontSize: '1.5rem' }}>Create New Password</h2>
        <p className="auth-welcome-sub">Please enter your new password below</p>
      </div>

      {error && <div className="auth-error">{error}</div>}
      
      {success ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '50%', 
            background: '#dcfce7', color: '#16a34a', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 1rem', fontSize: '1.5rem'
          }}>
            ✓
          </div>
          <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>Password Reset Successful!</h3>
          <p style={{ color: '#64748b', margin: 0 }}>You will be redirected to the login page shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter new password"
                required
                disabled={!token || loading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm new password"
                required
                disabled={!token || loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={!token || loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      )}
    </div>
  );
};
