import React, { useState } from 'react';
import { Search, Bell, Sparkles, Building, ChevronDown, LogOut, X, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './layout.css';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const searchLinks = [
    { title: 'Employees', path: '/employees', keywords: ['staff', 'workers', 'hr', 'people'] },
    { title: 'Attendance', path: '/attendance', keywords: ['time', 'clock', 'leave'] },
    { title: 'Production & Work Orders', path: '/production', keywords: ['manufacturing', 'jobs', 'orders', 'wo'] },
    { title: 'Machines & Equipment', path: '/machines', keywords: ['assets', 'maintenance', 'looms', 'vats'] },
    { title: 'Quality Inspections', path: '/quality', keywords: ['qc', 'testing', 'defects'] },
    { title: 'Logistics', path: '/logistics', keywords: ['shipping', 'delivery', 'transport'] },
    { title: 'Analytics', path: '/analytics', keywords: ['metrics', 'dashboard', 'charts'] },
    { title: 'Inventory', path: '/inventory', keywords: ['stock', 'materials', 'warehouse', 'raw'] },
    { title: 'Procurement', path: '/procurement', keywords: ['purchasing', 'po', 'suppliers'] },
    { title: 'Reports', path: '/reports', keywords: ['reorts', 'docs', 'export', 'pdf'] },
    { title: 'Roles & Permissions', path: '/admin/roles', keywords: ['access', 'security', 'users'] },
    { title: 'Settings', path: '/admin/settings', keywords: ['config', 'setup', 'preferences'] },
    { title: 'AI Business Advisor', path: '/ai-insights', keywords: ['help', 'bot', 'assistant', 'smart'] }
  ];

  const filteredLinks = searchQuery.trim() 
    ? searchLinks.filter(item => {
        const q = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(q) || item.keywords.some(k => k.includes(q));
      })
    : [];
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredLinks.length > 0) {
      navigate(filteredLinks[0].path);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`;
    if (firstName) return firstName[0];
    return 'U';
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const role = user?.role || 'User';

  return (
    <header className="erp-header">
      <div className="erp-header-left">
        {/* Global Search */}
        <div style={{ position: 'relative' }}>
          <form className="erp-search-container" onSubmit={handleSearch}>
            <Search className="erp-search-icon" size={18} />
            <input 
              type="text" 
              className="erp-search-input" 
              placeholder="Search employees, orders, materials..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            />
          </form>
          
          {showSearch && searchQuery.trim() && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              width: '100%',
              zIndex: 50,
              overflow: 'hidden'
            }}>
              {filteredLinks.length > 0 ? (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {filteredLinks.map((link, idx) => (
                    <div 
                      key={idx}
                      style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} 
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} 
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => {
                        navigate(link.path);
                        setSearchQuery('');
                        setShowSearch(false);
                      }}
                    >
                      <Search size={14} color="#94a3b8" />
                      <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 500 }}>{link.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Organization Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#0f172a', fontSize: '1.1rem', letterSpacing: '0.02em' }}>
          <Building size={20} color="#0284c7" />
          <span>{user?.organization || (user?.industry === 'POULTRY_FARM' ? 'NOVAX POULTRY FARM' : 'AVENZA TEXTILES')}</span>
        </div>
      </div>

      <div className="erp-header-right">
        {/* Theme Switcher Toggle Button */}
        <button 
          className="erp-icon-btn theme-toggle-btn" 
          title={`Switch theme (Current: ${theme === 'pink' ? 'Pink / Rose' : 'Dark Navy / Blue'})`} 
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            border: theme === 'pink' ? '1px solid #fbcfe8' : '1px solid #1e293b',
            background: theme === 'pink' ? '#fdf2f8' : '#0f172a',
            color: theme === 'pink' ? '#db2777' : '#38bdf8',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Palette size={16} />
          <span>{theme === 'pink' ? 'Pink Form' : 'Dark Blue Form'}</span>
        </button>

        {/* AI Assistant Shortcut */}
        <button className="erp-icon-btn" title="AI Assistant" onClick={() => navigate('/ai-insights')}>
          <Sparkles size={20} color={theme === 'pink' ? '#ec4899' : '#0ea5e9'} />
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button className="erp-icon-btn" title="Notifications" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            <span className="erp-badge">3</span>
          </button>
          
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              width: '320px',
              zIndex: 50,
              overflow: 'hidden'
            }}>
              <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>Notifications</h4>
                <button onClick={() => setShowNotifications(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Inventory Alert</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>Raw Cotton Grade A stock is low.</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: '#94a3b8' }}>10 mins ago</p>
                </div>
                <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Machine Offline</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>Weaving Loom M-02 is idle.</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: '#94a3b8' }}>1 hour ago</p>
                </div>
                <div style={{ padding: '1rem', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>Quality Report</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>Dyeing Vat D-01 inspection failed.</p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: '#94a3b8' }}>2 hours ago</p>
                </div>
              </div>
              <div style={{ padding: '0.75rem', borderTop: '1px solid #e2e8f0', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                <button 
                  onClick={() => {
                    navigate('/notifications');
                    setShowNotifications(false);
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#0ea5e9', fontWeight: 500 }}
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <div 
            className="erp-user-profile" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={fullName}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0ea5e9' }}
              />
            ) : (
              <div className="erp-avatar">
                {getInitials(user?.firstName, user?.lastName).toUpperCase()}
              </div>
            )}
            <div className="erp-user-info">
              <span className="erp-user-name">{fullName}</span>
              <span className="erp-user-role">{role}</span>
            </div>
            <ChevronDown size={16} color="#64748b" style={{marginLeft: '0.25rem'}} />
          </div>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '0.75rem',
              zIndex: 50,
              width: '240px'
            }}>
              {/* Dropdown Header Info */}
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={fullName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div className="erp-avatar" style={{ width: '40px', height: '40px' }}>{getInitials(user?.firstName, user?.lastName).toUpperCase()}</div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{fullName}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0ea5e9', backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
                      {role}
                    </span>
                  </div>
                </div>
                {user?.email && (
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px', wordBreak: 'break-all' }}>
                    {user.email}
                  </div>
                )}
                {user?.phone && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    📞 {user.phone}
                  </div>
                )}
              </div>

              {/* Navigation Actions */}
              <button 
                onClick={() => {
                  navigate('/my-profile');
                  setDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#334155',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  borderRadius: '4px',
                  marginBottom: '4px'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                👤 My Identity Profile
              </button>

              <button 
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  borderRadius: '4px'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
