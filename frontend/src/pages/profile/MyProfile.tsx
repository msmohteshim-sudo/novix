import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, Phone, MapPin, ShieldCheck, 
  Camera, CheckCircle, Save, Briefcase, Edit3, X
} from 'lucide-react';
import '../dashboard/dashboard.css';

const presetAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
];

export const MyProfile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 000-0000');
  const [department, setDepartment] = useState(user?.department || 'Operations');
  const [location, setLocation] = useState(user?.location || 'Main Plant, New York');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || presetAvatars[0]);
  const [bio, setBio] = useState(user?.bio || 'NOVAX ERP team member managing daily manufacturing workflows.');

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      firstName,
      lastName,
      email,
      phone,
      department,
      location,
      avatarUrl,
      bio
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
        updateUser({ avatarUrl: base64 });
        setShowAvatarModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const role = user?.role || 'Employee';

  const getRoleBadgeStyle = (r: string) => {
    switch (r) {
      case 'Admin':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
      case 'Manager':
        return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' };
      case 'Seller':
        return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      case 'Buyer':
        return { bg: '#f3e8ff', text: '#6b21a8', border: '#d8b4fe' };
      default:
        return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
    }
  };

  const badgeStyle = getRoleBadgeStyle(role);

  return (
    <div className="erp-dashboard" style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div className="erp-page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="erp-page-title" style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>My Identity Profile</h1>
          <p className="erp-page-subtitle" style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            Manage your personal credentials, contact info, photo avatar, and role capabilities
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <CheckCircle size={18} /> Profile details and photo updated successfully!
        </div>
      )}

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
        {/* Left Side Card: Profile Photo & Key Info */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {/* Avatar Container */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <img 
              src={avatarUrl} 
              alt={`${firstName} ${lastName}`}
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #e0f2fe', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
            <button 
              onClick={() => setShowAvatarModal(true)}
              title="Change Profile Picture"
              style={{ 
                position: 'absolute', bottom: '4px', right: '4px', 
                backgroundColor: '#0ea5e9', color: '#ffffff', border: 'none', 
                borderRadius: '50%', width: '36px', height: '36px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' 
              }}
            >
              <Camera size={18} />
            </button>
          </div>

          <h2 style={{ margin: '0 0 4px', fontSize: '1.35rem', color: '#0f172a', fontWeight: 700 }}>
            {firstName} {lastName}
          </h2>

          <div style={{ margin: '4px 0 12px' }}>
            <span style={{ 
              backgroundColor: badgeStyle.bg, 
              color: badgeStyle.text, 
              border: `1px solid ${badgeStyle.border}`, 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              letterSpacing: '0.5px' 
            }}>
              {role} Account
            </span>
          </div>

          <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', lineHeight: 1.4 }}>
            "{bio}"
          </p>

          <div style={{ width: '100%', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
              <Mail size={16} color="#0ea5e9" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Email</div>
                <div style={{ fontWeight: 500, wordBreak: 'break-all' }}>{email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
              <Phone size={16} color="#0ea5e9" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Phone</div>
                <div style={{ fontWeight: 500 }}>{phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
              <Briefcase size={16} color="#0ea5e9" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Department</div>
                <div style={{ fontWeight: 500 }}>{department}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155' }}>
              <MapPin size={16} color="#0ea5e9" />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Location</div>
                <div style={{ fontWeight: 500 }}>{location}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form & Role Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Edit Profile Form Panel */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={18} color="#0ea5e9" /> Personal & Contact Details
            </h3>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Phone Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Department</label>
                  <input 
                    type="text" 
                    value={department} 
                    onChange={(e) => setDepartment(e.target.value)} 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Location / Facility</label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Bio / Summary</label>
                <textarea 
                  rows={3} 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button 
                  type="submit" 
                  style={{ 
                    backgroundColor: '#0ea5e9', color: '#ffffff', border: 'none', 
                    padding: '10px 24px', borderRadius: '6px', fontSize: '0.9rem', 
                    fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
                  }}
                >
                  <Save size={18} /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Role Access Capabilities Card */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} color="#10b981" /> Assigned Role Privileges: {role}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              As a logged-in <strong>{role}</strong>, you have access to module navigation, data dashboards, role-specific operations, and system alerts tailored to your organization profile.
            </p>
          </div>
        </div>
      </div>

      {/* AVATAR SELECTOR MODAL */}
      {showAvatarModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowAvatarModal(false)}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', maxWidth: '500px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>Choose Profile Picture</h3>
              <button onClick={() => setShowAvatarModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* Option 1: File Upload */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Upload Image from Computer</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileUpload}
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            {/* Option 2: Choose Presets */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>Or Select a Preset Avatar</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {presetAvatars.map((url, idx) => (
                  <img 
                    key={idx}
                    src={url}
                    alt={`Preset ${idx + 1}`}
                    onClick={() => {
                      setAvatarUrl(url);
                      updateUser({ avatarUrl: url });
                      setShowAvatarModal(false);
                    }}
                    style={{ 
                      width: '100%', height: '80px', borderRadius: '8px', 
                      objectFit: 'cover', cursor: 'pointer', 
                      border: avatarUrl === url ? '3px solid #0ea5e9' : '2px solid #e2e8f0',
                      transition: 'transform 0.15s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Option 3: Image URL */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Or Paste Image Web URL</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <button 
                  onClick={() => {
                    if (customUrlInput) {
                      setAvatarUrl(customUrlInput);
                      updateUser({ avatarUrl: customUrlInput });
                      setShowAvatarModal(false);
                    }
                  }}
                  style={{ backgroundColor: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
