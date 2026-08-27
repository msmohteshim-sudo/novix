import React, { useState } from 'react';
import { Building2, Factory, DollarSign, Bell, Shield, Save } from 'lucide-react';
import '../dashboard/dashboard.css';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 800);
  };

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">System Settings</h1>
          <p className="erp-page-subtitle">Manage company profile, operational preferences, and system configurations</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-primary" onClick={handleSave} disabled={isSaving}>
            <Save size={16} style={{marginRight: '8px'}} /> {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Settings Navigation Sidebar */}
        <div className="erp-panel" style={{ padding: '1rem 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'company', icon: <Building2 size={18} />, label: 'Company Profile' },
              { id: 'factory', icon: <Factory size={18} />, label: 'Factory & Shifts' },
              { id: 'financials', icon: <DollarSign size={18} />, label: 'Financials & Taxes' },
              { id: 'notifications', icon: <Bell size={18} />, label: 'Alerts & Notifications' },
              { id: 'security', icon: <Shield size={18} />, label: 'Security & Auth' }
            ].map(tab => (
              <li key={tab.id}>
                <button 
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 24px',
                    border: 'none',
                    backgroundColor: activeTab === tab.id ? '#f0f9ff' : 'transparent',
                    borderLeft: activeTab === tab.id ? '4px solid #0ea5e9' : '4px solid transparent',
                    color: activeTab === tab.id ? '#0369a1' : '#475569',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Settings Content Area */}
        <div className="erp-panel" style={{ minHeight: '600px' }}>
          
          {/* COMPANY PROFILE */}
          {activeTab === 'company' && (
            <div>
              <h3 className="erp-panel-title" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                Company Profile
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="erp-form-group">
                  <label>Legal Company Name</label>
                  <input type="text" className="erp-input" defaultValue="AVENZA TEXTILES LTD." />
                </div>
                <div className="erp-form-group">
                  <label>Registration Number (TIN/EIN)</label>
                  <input type="text" className="erp-input" defaultValue="AV-9938-1029-TX" />
                </div>
                
                <div className="erp-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Headquarters Address</label>
                  <textarea className="erp-input" rows={3} defaultValue="Plot 45, Textile Industrial Zone, Phase 2, Dhaka, Bangladesh" />
                </div>

                <div className="erp-form-group">
                  <label>Primary Contact Email</label>
                  <input type="email" className="erp-input" defaultValue="admin@avenzatextiles.com" />
                </div>
                <div className="erp-form-group">
                  <label>Primary Phone</label>
                  <input type="text" className="erp-input" defaultValue="+880 1711-000000" />
                </div>
                <div className="erp-form-group">
                  <label>Website</label>
                  <input type="text" className="erp-input" defaultValue="www.avenzatextiles.com" />
                </div>
              </div>
            </div>
          )}

          {/* FACTORY & SHIFTS */}
          {activeTab === 'factory' && (
            <div>
              <h3 className="erp-panel-title" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                Factory & Shift Configurations
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="erp-form-group">
                  <label>Default Quality Threshold (%)</label>
                  <input type="number" className="erp-input" defaultValue={98.5} step="0.1" />
                  <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>Minimum pass rate for QC inspections.</small>
                </div>
                <div className="erp-form-group">
                  <label>Machine Idle Alert Trigger (Mins)</label>
                  <input type="number" className="erp-input" defaultValue={15} />
                  <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>Trigger alert if machine is idle beyond this.</small>
                </div>
                
                <div className="erp-form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 1rem', color: '#334155' }}>Shift Timings</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>Shift A (Morning)</strong>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="time" className="erp-input" defaultValue="08:00" style={{ padding: '4px 8px' }} />
                        <span>to</span>
                        <input type="time" className="erp-input" defaultValue="16:00" style={{ padding: '4px 8px' }} />
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>Shift B (Evening)</strong>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="time" className="erp-input" defaultValue="16:00" style={{ padding: '4px 8px' }} />
                        <span>to</span>
                        <input type="time" className="erp-input" defaultValue="00:00" style={{ padding: '4px 8px' }} />
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>Shift C (Night)</strong>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="time" className="erp-input" defaultValue="00:00" style={{ padding: '4px 8px' }} />
                        <span>to</span>
                        <input type="time" className="erp-input" defaultValue="08:00" style={{ padding: '4px 8px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FINANCIALS */}
          {activeTab === 'financials' && (
            <div>
              <h3 className="erp-panel-title" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                Financials & Taxes
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="erp-form-group">
                  <label>Base Currency</label>
                  <select className="erp-input">
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                  </select>
                </div>
                <div className="erp-form-group">
                  <label>Default Tax Rate (%)</label>
                  <input type="number" className="erp-input" defaultValue={15} />
                </div>
                <div className="erp-form-group">
                  <label>Purchase Order Prefix</label>
                  <input type="text" className="erp-input" defaultValue="PO-AV-" />
                </div>
                <div className="erp-form-group">
                  <label>Sales Order Prefix</label>
                  <input type="text" className="erp-input" defaultValue="SO-AV-" />
                </div>
                <div className="erp-form-group">
                  <label>Invoice Prefix</label>
                  <input type="text" className="erp-input" defaultValue="INV-AV-" />
                </div>
                <div className="erp-form-group">
                  <label>Payment Terms (Days)</label>
                  <input type="number" className="erp-input" defaultValue={30} />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div>
              <h3 className="erp-panel-title" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                Alerts & Notifications
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Quality Inspection Failure Alerts', desc: 'Notify Quality Control Lead when an inspection fails.', checked: true },
                  { label: 'Purchase Order Approvals', desc: 'Email managers when a PO exceeds $10,000 threshold.', checked: true },
                  { label: 'Machine Downtime Alerts', desc: 'SMS Maintenance Team if a critical machine goes offline.', checked: true },
                  { label: 'Low Inventory Warnings', desc: 'Notify Procurement when raw materials fall below safety stock.', checked: true },
                  { label: 'Daily Shift Summary', desc: 'Email daily production yield report to General Manager.', checked: false }
                ].map((alert, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                    <input type="checkbox" defaultChecked={alert.checked} style={{ width: '18px', height: '18px', accentColor: '#0ea5e9', marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', color: '#0f172a', marginBottom: '4px' }}>{alert.label}</strong>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{alert.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div>
              <h3 className="erp-panel-title" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                Security & Authentication
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="erp-form-group">
                  <label>Session Timeout (Minutes)</label>
                  <select className="erp-input" style={{ width: '200px' }}>
                    <option>15 Minutes</option>
                    <option selected>30 Minutes</option>
                    <option>1 Hour</option>
                    <option>4 Hours</option>
                  </select>
                  <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>Automatically log out inactive users.</small>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#0ea5e9' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a' }}>Require Two-Factor Authentication (2FA)</strong>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Enforce 2FA for all users with 'Admin' or 'Manager' roles.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#0ea5e9' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a' }}>Strict Password Policy</strong>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Require uppercase, lowercase, numbers, and special characters (Min 8 chars).</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
