import React from 'react';
import { Bell, AlertTriangle, TrendingUp, Sparkles, CheckCircle, Clock } from 'lucide-react';
import '../dashboard/dashboard.css';

const notifications = [
  {
    id: 1,
    title: 'Inventory Alert',
    message: 'Raw Cotton Grade A stock is low. Current levels are projected to drop below minimum within 3 days.',
    time: '10 mins ago',
    icon: <AlertTriangle size={20} color="#f59e0b" />,
    read: false
  },
  {
    id: 2,
    title: 'Machine Offline',
    message: 'Weaving Loom M-02 is idle. Please check maintenance schedules or assign a new work order.',
    time: '1 hour ago',
    icon: <Clock size={20} color="#ef4444" />,
    read: false
  },
  {
    id: 3,
    title: 'Quality Report',
    message: 'Dyeing Vat D-01 inspection failed. Defect detected: Dye penetration irregularity.',
    time: '2 hours ago',
    icon: <Sparkles size={20} color="#0ea5e9" />,
    read: false
  },
  {
    id: 4,
    title: 'Production Milestone',
    message: 'Work Order WO-1044 completed ahead of schedule. Efficiency improved by 8%.',
    time: '1 day ago',
    icon: <TrendingUp size={20} color="#10b981" />,
    read: true
  },
  {
    id: 5,
    title: 'System Update',
    message: 'NOVAX ERP was successfully updated to version 2.4.0.',
    time: '2 days ago',
    icon: <CheckCircle size={20} color="#64748b" />,
    read: true
  }
];

export const Notifications: React.FC = () => {
  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={24} color="#0ea5e9" /> All Notifications
          </h1>
          <p className="erp-page-subtitle">View and manage your factory alerts and updates</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-outline">Mark All as Read</button>
        </div>
      </div>

      <div className="erp-panel" style={{ padding: '0' }}>
        {notifications.map((notif, index) => (
          <div 
            key={notif.id} 
            style={{ 
              padding: '1.5rem', 
              borderBottom: index === notifications.length - 1 ? 'none' : '1px solid #e2e8f0',
              backgroundColor: notif.read ? '#ffffff' : '#f8fafc',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ padding: '10px', backgroundColor: '#ffffff', borderRadius: '50%', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', flexShrink: 0 }}>
              {notif.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', fontWeight: notif.read ? 500 : 600 }}>{notif.title}</h4>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{notif.time}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                {notif.message}
              </p>
            </div>
            {!notif.read && (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0ea5e9', marginTop: '6px' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
