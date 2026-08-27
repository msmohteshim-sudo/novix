import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserProfile } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { Mail, Lock, EyeOff, Eye, LogIn, UserCheck, ShieldCheck, Briefcase, ShoppingCart, Factory, Calculator } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import './auth.css';

export const roleIdentities: UserProfile[] = [
  {
    role: 'Admin',
    firstName: 'Alex',
    lastName: 'Reynolds',
    email: 'admin@avenzatextiles.com',
    industry: 'TEXTILE',
    organization: 'AVENZA TEXTILES',
    phone: '+1 (555) 234-5678',
    department: 'Executive Board & Systems Admin',
    location: 'NOVAX HQ, New York',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: '2021-01-10',
    bio: 'Chief Operations Administrator with full system control and enterprise security management.'
  },
  {
    role: 'Manager',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'manager@avenzatextiles.com',
    industry: 'TEXTILE',
    organization: 'AVENZA TEXTILES',
    phone: '+1 (555) 345-6789',
    department: 'Plant Operations & Production',
    location: 'Main Production Facility, NY',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinDate: '2022-03-15',
    bio: 'Senior Operations Manager overseeing scheduling, quality inspections, and machine logistics.'
  },
  {
    role: 'Seller',
    firstName: 'David',
    lastName: 'Vance',
    email: 'seller@avenzatextiles.com',
    industry: 'TEXTILE',
    organization: 'AVENZA TEXTILES',
    phone: '+1 (555) 456-7890',
    department: 'Global Sales & CRM',
    location: 'Chicago Sales Branch',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-06-20',
    bio: 'Lead Account Executive managing wholesale quotations and enterprise client contracts.'
  },
  {
    role: 'Buyer',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'buyer@avenzatextiles.com',
    industry: 'TEXTILE',
    organization: 'AVENZA TEXTILES',
    phone: '+1 (555) 567-8901',
    department: 'Procurement & Supply Chain',
    location: 'Denver Logistics Hub',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-11-05',
    bio: 'Procurement Specialist sourcing raw materials and component inventory from global suppliers.'
  },
  {
    role: 'Employee',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'employee@avenzatextiles.com',
    industry: 'TEXTILE',
    organization: 'AVENZA TEXTILES',
    phone: '+1 (555) 678-9012',
    department: 'Floor Production & Operations',
    location: 'Main Production Facility, NY',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinDate: '2024-02-01',
    bio: 'Senior Operations Specialist handling daily work orders and output logs.'
  }
];

export const farmRoleIdentities: UserProfile[] = [
  {
    role: 'Admin',
    firstName: 'Rajesh',
    lastName: 'Sharma',
    email: 'admin@sharmapoultry.com',
    industry: 'POULTRY_FARM',
    organization: 'SHARMA POULTRY FARMS',
    phone: '+91 98765 43210',
    department: 'Farm Operations & Management',
    location: 'Nashik, Maharashtra',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinDate: '2022-01-01',
    bio: 'Chief Farm Operations Administrator overseeing multiple sheds, flocks, and hatcheries.'
  },
  {
    role: 'Manager',
    firstName: 'Anil',
    lastName: 'Kumar',
    email: 'manager@sharmapoultry.com',
    industry: 'POULTRY_FARM',
    organization: 'SHARMA POULTRY FARMS',
    phone: '+91 98765 12345',
    department: 'Flock & Feed Operations',
    location: 'Shed Complex 1, Nashik',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-04-10',
    bio: 'Senior Flock Manager tracking feed conversion ratios, mortality, and egg yields.'
  },
  {
    role: 'Seller',
    firstName: 'Vikram',
    lastName: 'Patel',
    email: 'sales@sharmapoultry.com',
    industry: 'POULTRY_FARM',
    organization: 'SHARMA POULTRY FARMS',
    phone: '+91 98765 67890',
    department: 'Poultry & Egg Wholesale Sales',
    location: 'Mumbai Wholesale Market',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: '2023-09-15',
    bio: 'Wholesale Manager handling broiler bird sales and daily egg distribution orders.'
  },
  {
    role: 'Buyer',
    firstName: 'Suresh',
    lastName: 'Verma',
    email: 'procurement@sharmapoultry.com',
    industry: 'POULTRY_FARM',
    organization: 'SHARMA POULTRY FARMS',
    phone: '+91 98765 99887',
    department: 'Feed & Chicks Procurement',
    location: 'Nashik HQ',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    joinDate: '2024-01-20',
    bio: 'Feed Procurement Manager sourcing high-protein feed stock, vaccines, and day-old chicks.'
  },
  {
    role: 'Employee',
    firstName: 'Ramesh',
    lastName: 'Pawar',
    email: 'worker@sharmapoultry.com',
    industry: 'POULTRY_FARM',
    organization: 'SHARMA POULTRY FARMS',
    phone: '+91 98765 11223',
    department: 'Shed Operations',
    location: 'Shed 3',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: '2024-06-01',
    bio: 'Shed Supervisor recording daily feed consumption, egg collection, and mortality logs.'
  }
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<'TEXTILE' | 'POULTRY_FARM'>('TEXTILE');
  const [selectedRole, setSelectedRole] = useState<string>('Admin');

  const activeIdentities = selectedIndustry === 'POULTRY_FARM' ? farmRoleIdentities : roleIdentities;

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const data = await authService.googleLogin(tokenResponse.access_token);
        const userProfile: UserProfile = {
          ...data.user,
          phone: data.user.phone || '+1 (555) 123-4567',
          avatarUrl: data.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        };
        login({ token: data.token, user: userProfile });
        navigate(userProfile.industry === 'POULTRY_FARM' ? '/farm/dashboard' : '/dashboard');
      } catch (err: any) {
        setError(err.message || 'Google login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => setError('Google Sign-In Failed: ' + error),
  });

  const handleRoleQuickLogin = (roleProfile: UserProfile) => {
    const fakeToken = `demo-token-${roleProfile.role.toLowerCase()}-${Date.now()}`;
    login({
      token: fakeToken,
      user: roleProfile
    });
    if (roleProfile.industry === 'POULTRY_FARM') {
      navigate('/farm/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      const roleMatch = activeIdentities.find(r => r.role === data.user.role) || activeIdentities[0];
      const userProfile: UserProfile = {
        ...data.user,
        phone: data.user.phone || roleMatch.phone,
        avatarUrl: data.user.avatarUrl || roleMatch.avatarUrl,
        department: data.user.department || roleMatch.department,
        location: data.user.location || roleMatch.location
      };
      login({ token: data.token, user: userProfile });
      navigate(userProfile.industry === 'POULTRY_FARM' ? '/farm/dashboard' : '/dashboard');
    } catch {
      // Fallback demo login for specified credentials/email
      const matchedIdentity = activeIdentities.find(r => r.email.toLowerCase() === email.toLowerCase() || r.role.toLowerCase() === selectedRole.toLowerCase()) || activeIdentities[0];
      login({
        token: `demo-token-${matchedIdentity.role.toLowerCase()}`,
        user: matchedIdentity
      });
      navigate(matchedIdentity.industry === 'POULTRY_FARM' ? '/farm/dashboard' : '/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'Admin': return <ShieldCheck size={15} color="#4f46e5" />;
      case 'Manager': return <UserCheck size={15} color="#0284c7" />;
      case 'Seller': return <Briefcase size={15} color="#d97706" />;
      case 'Buyer': return <ShoppingCart size={15} color="#9333ea" />;
      case 'Accountant': return <Calculator size={15} color="#059669" />;
      default: return <Factory size={15} color="#16a34a" />;
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header-center">
        <div className="auth-sub-badge">Smart Operations ERP</div>
        <h2 className="auth-welcome">Welcome Back!</h2>
        <p className="auth-welcome-sub">Choose your identity or sign in to your ERP account</p>
      </div>
      
      {error && <div className="auth-error">{error}</div>}

      {/* INDUSTRY & ROLE SWITCHER */}
      <div className="role-switcher-card">
        <label className="role-switcher-title">Select Industry & Role</label>
        
        {/* Industry selector tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem' }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid ' + (selectedIndustry === 'TEXTILE' ? '#6366f1' : 'rgba(255,255,255,0.1)'),
              background: selectedIndustry === 'TEXTILE' ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.04)',
              color: selectedIndustry === 'TEXTILE' ? '#818cf8' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
            onClick={() => setSelectedIndustry('TEXTILE')}
          >
            🏭 Textile Manufacturing
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid ' + (selectedIndustry === 'POULTRY_FARM' ? '#10b981' : 'rgba(255,255,255,0.1)'),
              background: selectedIndustry === 'POULTRY_FARM' ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.04)',
              color: selectedIndustry === 'POULTRY_FARM' ? '#34d399' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
            onClick={() => setSelectedIndustry('POULTRY_FARM')}
          >
            🐔 Poultry / Farm ERP
          </button>
        </div>

        <div className="role-pills-grid">
          {activeIdentities.map((item) => {
            const isSelected = selectedRole === item.role;
            return (
              <button
                key={item.role}
                type="button"
                className={`role-pill-button ${isSelected ? 'active' : ''}`}
                onClick={() => handleRoleQuickLogin(item)}
                onMouseEnter={() => setSelectedRole(item.role)}
              >
                <img src={item.avatarUrl} alt={item.role} className="role-avatar" />
                {getRoleIcon(item.role)}
                <span>{item.role}</span>
              </button>
            );
          })}
        </div>
        <div className="role-switcher-hint">
          💡 Click any role identity above to sign in instantly as <strong>{selectedIndustry === 'POULTRY_FARM' ? 'Poultry Farm Operations' : 'Textile Manufacturing'}</strong>.
        </div>
      </div>

      {/* STANDARD CREDENTIAL FORM */}
      <form onSubmit={handleLogin} className="auth-form">
        <div className="auth-form-group">
          <label className="auth-label">Email Address</label>
          <div className="auth-input-wrapper">
            <Mail className="auth-input-icon" size={18} />
            <input 
              type="email" 
              className="auth-input"
              placeholder="youremail@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="auth-form-group">
          <label className="auth-label">Password</label>
          <div className="auth-input-wrapper">
            <Lock className="auth-input-icon" size={18} />
            <input 
              type={showPassword ? 'text' : 'password'}
              className="auth-input"
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
        </div>

        <div className="auth-options">
          <label className="auth-checkbox-label">
            <input type="checkbox" className="auth-checkbox" defaultChecked />
            Remember me
          </label>
          <Link to="/auth/forgot-password" className="auth-forgot-link">Forgot Password?</Link>
        </div>
        
        <button type="submit" className="auth-btn" disabled={loading}>
          <LogIn size={18} />
          {loading ? 'Signing in...' : `Sign In as ${selectedRole}`}
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
        Sign in with Google
      </button>

      <div className="auth-links">
        <p>Don't have an account? <Link to="/auth/register" className="auth-link">Register Now</Link></p>
      </div>
    </div>
  );
};
