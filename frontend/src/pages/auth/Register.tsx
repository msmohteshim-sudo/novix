import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { User, Mail, Lock, EyeOff, Eye, UserPlus } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import './auth.css';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [roleName, setRoleName] = useState('Employee');
  const [industry, setIndustry] = useState('TEXTILE');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const data = await authService.googleLogin(tokenResponse.access_token);
        login({ token: data.token, user: data.user });
        navigate(data.user?.industry === 'POULTRY_FARM' ? '/farm/dashboard' : '/dashboard');
      } catch (err: any) {
        setError(err.message || 'Google registration failed');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => setError('Google Sign-Up Failed: ' + error),
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.register({ firstName, lastName, email, password, roleName, industry });
      login({ token: data.token, user: data.user });
      navigate(data.user?.industry === 'POULTRY_FARM' ? '/farm/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
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
        <div className="auth-subtitle">Intelligence for Manufacturing.</div>
        
        <h2 className="auth-welcome">Create Account</h2>
        <p className="auth-welcome-sub">Sign up for your ERP Dashboard</p>
      </div>
      
      {error && <div className="auth-error">{error}</div>}
      
      <form onSubmit={handleRegister} className="auth-form">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="auth-form-group" style={{ flex: 1 }}>
            <label className="auth-label">First Name</label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" size={18} />
              <input 
                type="text" 
                className="auth-input"
                placeholder="John" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="auth-form-group" style={{ flex: 1 }}>
            <label className="auth-label">Last Name</label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" size={18} />
              <input 
                type="text" 
                className="auth-input"
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
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

        <div className="auth-form-group">
          <label className="auth-label">Industry Operations</label>
          <div className="auth-input-wrapper">
            <User className="auth-input-icon" size={18} />
            <select 
              className="auth-input"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            >
              <option value="TEXTILE">🏭 Textile Manufacturing</option>
              <option value="POULTRY_FARM">🐔 Poultry / Farm Operations</option>
            </select>
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Account Type</label>
          <div className="auth-input-wrapper">
            <User className="auth-input-icon" size={18} />
            <select 
              className="auth-input"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Seller">Seller</option>
              <option value="Buyer">Buyer</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
        </div>
        
        <div className="auth-form-group">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon" size={18} />
            <input 
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div 
              style={{ position: 'absolute', right: '1rem', cursor: 'pointer', color: '#94a3b8' }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>
        </div>

        <div className="auth-form-group">
          <label className="auth-label">Confirm Password</label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon" size={18} />
            <input 
              type={showConfirmPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div 
              style={{ position: 'absolute', right: '1rem', cursor: 'pointer', color: '#94a3b8' }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>
        </div>
        
        <button type="submit" className="auth-btn" disabled={loading} style={{ marginTop: '0.5rem' }}>
          <UserPlus size={18} />
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="auth-divider">OR</div>

      <button className="auth-google-btn" type="button" onClick={() => googleLogin()}>
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </button>

      <div className="auth-links">
        <p>Already have an account? <Link to="/auth/login" className="auth-link">Sign In</Link></p>
      </div>
    </div>
  );
};
