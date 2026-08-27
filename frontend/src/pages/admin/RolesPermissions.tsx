import React, { useState } from 'react';
import { Shield, Plus, Save, UserCheck, ShieldAlert, Key, X, Clock } from 'lucide-react';
import '../dashboard/dashboard.css';

const INITIAL_ROLES = [
  { id: 'ROLE-01', name: 'System Administrator', users: 2, description: 'Full access to all system settings, modules, and billing.' },
  { id: 'ROLE-02', name: 'General Manager', users: 4, description: 'High-level access across all operational modules. Cannot modify system settings.' },
  { id: 'ROLE-03', name: 'Production Manager', users: 6, description: 'Full control over production lines, work orders, and machine states.' },
  { id: 'ROLE-04', name: 'Shift Supervisor', users: 18, description: 'Can start/stop work orders and view attendance during their shift.' },
  { id: 'ROLE-05', name: 'Quality Control Lead', users: 5, description: 'Can define QA metrics, submit inspections, and override fails.' },
  { id: 'ROLE-06', name: 'Quality Inspector', users: 32, description: 'Can submit daily quality inspections and flag defects.' },
  { id: 'ROLE-07', name: 'Supply Chain Director', users: 3, description: 'Oversees inventory, procurement, and supplier relationships.' },
  { id: 'ROLE-08', name: 'Procurement Specialist', users: 12, description: 'Can draft and submit purchase orders. Cannot approve POs over $10k.' },
  { id: 'ROLE-09', name: 'Buyer', users: 8, description: 'Can view inventory and draft purchase orders.' },
  { id: 'ROLE-10', name: 'Logistics Coordinator', users: 14, description: 'Can schedule shipments and update tracking statuses.' },
  { id: 'ROLE-11', name: 'Sales Director', users: 4, description: 'Full CRM access, quote approvals, and discount overrides.' },
  { id: 'ROLE-12', name: 'Sales Representative', users: 45, description: 'Can draft quotes and view customer profiles.' },
  { id: 'ROLE-13', name: 'HR Manager', users: 5, description: 'Can onboard employees, edit attendance, and approve leave.' },
  { id: 'ROLE-14', name: 'Data Analyst', users: 6, description: 'Read-only access across most modules. Full access to export reports.' },
  { id: 'ROLE-15', name: 'Machine Operator', users: 84, description: 'Read-only access to their assigned machine specs and work orders.' },
];

const PERMISSION_MODULES = [
  {
    name: 'User Management & HR',
    permissions: ['View Employees', 'Add/Edit Employees', 'Deactivate Employees', 'View Attendance', 'Edit Attendance', 'Approve Leave']
  },
  {
    name: 'Roles & Security',
    permissions: ['View Roles', 'Create/Edit Roles', 'Assign Roles to Users', 'View Audit Logs']
  },
  {
    name: 'Production & Manufacturing',
    permissions: ['View Production Lines', 'Start/Stop Lines', 'Configure Machine Params', 'View Work Orders', 'Create/Edit Work Orders', 'Delete Work Orders']
  },
  {
    name: 'Quality Assurance',
    permissions: ['View Quality Metrics', 'Submit Inspections', 'Flag Defects', 'Override Quality Fails']
  },
  {
    name: 'Inventory & Warehousing',
    permissions: ['View Inventory', 'Adjust Stock Levels', 'Initiate Stock Transfer', 'Perform Cycle Count']
  },
  {
    name: 'Procurement & Supply Chain',
    permissions: ['View Purchase Orders', 'Create PO', 'Edit PO', 'Approve PO (Tier 1)', 'Approve PO (Tier 2)', 'Manage Suppliers']
  },
  {
    name: 'Sales & CRM',
    permissions: ['View Customers', 'Manage Customers', 'View Sales Orders', 'Create Quotes', 'Approve Quotes', 'Override Discounts']
  },
  {
    name: 'Logistics',
    permissions: ['View Shipments', 'Schedule Shipments', 'Update Tracking', 'Manage Carriers']
  },
  {
    name: 'Analytics & Reporting',
    permissions: ['View Dashboards', 'Export CSV/PDF', 'Create Custom Reports', 'View Financial KPIs']
  },
  {
    name: 'System Settings',
    permissions: ['View Configuration', 'Modify App Settings', 'Manage Integrations', 'Manage Billing']
  }
];

export const RolesPermissions: React.FC = () => {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState(INITIAL_ROLES[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [activePermissions, setActivePermissions] = useState<Record<string, boolean>>({});

  // Modals
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);

  // New Role Form
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role);
    const newPerms: Record<string, boolean> = {};
    PERMISSION_MODULES.forEach(mod => {
      mod.permissions.forEach(p => {
        newPerms[p] = role.name === 'System Administrator' ? true : Math.random() > 0.5;
      });
    });
    setActivePermissions(newPerms);
  };

  const togglePermission = (perm: string) => {
    setActivePermissions(prev => ({
      ...prev,
      [perm]: !prev[perm]
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`Permissions saved successfully for ${selectedRole.name}.`);
    }, 800);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;

    const newRole = {
      id: `ROLE-${roles.length + 1}`,
      name: newRoleName,
      users: 0,
      description: newRoleDesc || 'Custom defined role.'
    };

    setRoles([newRole, ...roles]);
    setShowRoleModal(false);
    setNewRoleName('');
    setNewRoleDesc('');
    handleRoleSelect(newRole);
  };

  React.useEffect(() => {
    handleRoleSelect(roles[0]);
  }, []);

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Roles & Permissions</h1>
          <p className="erp-page-subtitle">Granular access control and security configurations</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-outline" onClick={() => setShowAuditModal(true)}>
            <ShieldAlert size={16} style={{marginRight: '8px'}} /> View Audit Logs
          </button>
          <button className="erp-btn erp-btn-primary" onClick={() => setShowRoleModal(true)}>
            <Plus size={16} style={{marginRight: '8px'}} /> Create Custom Role
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Roles List */}
        <div className="erp-panel" style={{ padding: 0 }}>
          <div className="erp-panel-header" style={{ borderBottom: '1px solid #e2e8f0', padding: '1.25rem' }}>
            <h3 className="erp-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield color="#0ea5e9" size={20} /> System Roles
            </h3>
          </div>
          <div style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
            {roles.map(role => (
              <div 
                key={role.id}
                onClick={() => handleRoleSelect(role)}
                style={{ 
                  padding: '1rem 1.25rem', 
                  borderBottom: '1px solid #f1f5f9', 
                  cursor: 'pointer',
                  backgroundColor: selectedRole.id === role.id ? '#f0f9ff' : 'transparent',
                  borderLeft: selectedRole.id === role.id ? '4px solid #0ea5e9' : '4px solid transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 600, color: selectedRole.id === role.id ? '#0369a1' : '#334155' }}>
                    {role.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <UserCheck size={10} /> {role.users}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {role.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="erp-panel">
          <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 className="erp-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
                <Key color="#10b981" /> {selectedRole.name} Privileges
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>Configure access levels across all modules</p>
            </div>
            <button 
              className="erp-btn erp-btn-primary" 
              onClick={handleSave}
              disabled={isSaving}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {PERMISSION_MODULES.map((module, mIdx) => (
              <div key={mIdx} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 1rem', color: '#0f172a', fontSize: '1rem', borderBottom: '2px solid #cbd5e1', paddingBottom: '6px' }}>
                  {module.name}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {module.permissions.map((perm, pIdx) => (
                    <label key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={activePermissions[perm] || false}
                        onChange={() => togglePermission(perm)}
                        disabled={selectedRole.name === 'System Administrator'}
                        style={{ width: '16px', height: '16px', accentColor: '#0ea5e9' }}
                      />
                      <span style={{ fontSize: '0.9rem', color: '#334155', opacity: selectedRole.name === 'System Administrator' ? 0.7 : 1 }}>
                        {perm}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs Modal */}
      {showAuditModal && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ maxWidth: '700px' }}>
            <div className="erp-modal-header">
              <h2>Security Audit Logs</h2>
              <button className="erp-btn-icon" onClick={() => setShowAuditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-content" style={{ padding: '1.5rem' }}>
              <table className="erp-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Timestamp</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>User</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Action</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px' }}><Clock size={12} style={{marginRight:'4px', display:'inline'}}/> Just now</td>
                    <td style={{ padding: '16px' }}><span style={{fontWeight: 600}}>its nobuddy</span></td>
                    <td style={{ padding: '16px' }}>Modified permissions for <span style={{backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem'}}>Production Manager</span></td>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: '#64748b' }}>192.168.1.45</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px' }}><Clock size={12} style={{marginRight:'4px', display:'inline'}}/> 2 hours ago</td>
                    <td style={{ padding: '16px' }}><span style={{fontWeight: 600}}>System</span></td>
                    <td style={{ padding: '16px' }}>Created new role <span style={{backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem'}}>Intern</span></td>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: '#64748b' }}>127.0.0.1</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '16px' }}><Clock size={12} style={{marginRight:'4px', display:'inline'}}/> Yesterday, 14:30</td>
                    <td style={{ padding: '16px' }}><span style={{fontWeight: 600}}>Jane Smith</span></td>
                    <td style={{ padding: '16px' }}>Assigned <span style={{backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem'}}>Sales Rep</span> to user EMP-092</td>
                    <td style={{ padding: '16px', fontFamily: 'monospace', color: '#64748b' }}>10.0.0.22</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showRoleModal && (
        <div className="erp-modal-overlay">
          <div className="erp-modal">
            <div className="erp-modal-header">
              <h2>Create Custom Role</h2>
              <button className="erp-btn-icon" onClick={() => setShowRoleModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateRole}>
              <div className="erp-modal-content">
                <div className="erp-form-group">
                  <label>Role Name</label>
                  <input 
                    type="text" 
                    className="erp-input" 
                    required 
                    value={newRoleName}
                    onChange={e => setNewRoleName(e.target.value)}
                    placeholder="e.g. Regional Manager" 
                  />
                </div>
                <div className="erp-form-group">
                  <label>Description</label>
                  <textarea 
                    className="erp-input" 
                    rows={3} 
                    value={newRoleDesc}
                    onChange={e => setNewRoleDesc(e.target.value)}
                    placeholder="Brief description of the role's purpose..."
                  />
                </div>
              </div>
              <div className="erp-modal-footer">
                <button type="button" className="erp-btn erp-btn-outline" onClick={() => setShowRoleModal(false)}>Cancel</button>
                <button type="submit" className="erp-btn erp-btn-primary">Create Role</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
