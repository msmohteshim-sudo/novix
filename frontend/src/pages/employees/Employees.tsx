import React, { useState } from 'react';
import { Users, Search, Plus, X, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import '../dashboard/dashboard.css';

const mockEmployees = [
  { id: 'EMP-001', name: 'John Doe', role: 'Plant Manager', department: 'Production', email: 'john.doe@avenzatextiles.com', phone: '+1 (555) 123-4567', location: 'Main Plant, New York', status: 'Active', joinDate: '2022-01-15' },
  { id: 'EMP-002', name: 'Jane Smith', role: 'Quality Inspector', department: 'Quality Control', email: 'jane.smith@avenzatextiles.com', phone: '+1 (555) 234-5678', location: 'Main Plant, New York', status: 'Active', joinDate: '2023-03-10' },
  { id: 'EMP-003', name: 'Robert Johnson', role: 'Procurement Specialist', department: 'Supply Chain', email: 'robert.j@avenzatextiles.com', phone: '+1 (555) 345-6789', location: 'HQ, Chicago', status: 'Active', joinDate: '2021-11-05' },
  { id: 'EMP-004', name: 'Emily Davis', role: 'Sales Executive', department: 'Sales & CRM', email: 'emily.d@avenzatextiles.com', phone: '+1 (555) 456-7890', location: 'HQ, Chicago', status: 'On Leave', joinDate: '2024-02-20' },
  { id: 'EMP-005', name: 'Michael Brown', role: 'Machine Operator', department: 'Production', email: 'michael.b@avenzatextiles.com', phone: '+1 (555) 567-8901', location: 'Main Plant, New York', status: 'Active', joinDate: '2020-07-12' },
  { id: 'EMP-006', name: 'Sarah Wilson', role: 'Logistics Coordinator', department: 'Logistics', email: 'sarah.w@avenzatextiles.com', phone: '+1 (555) 678-9012', location: 'Warehouse Facility, Denver', status: 'Active', joinDate: '2023-09-01' },
  { id: 'EMP-007', name: 'David Lee', role: 'HR Manager', department: 'Human Resources', email: 'david.lee@avenzatextiles.com', phone: '+1 (555) 789-0123', location: 'HQ, Chicago', status: 'Active', joinDate: '2019-04-18' },
  { id: 'EMP-008', name: 'Amanda Taylor', role: 'Data Analyst', department: 'Analytics', email: 'amanda.t@avenzatextiles.com', phone: '+1 (555) 890-1234', location: 'Remote', status: 'Active', joinDate: '2025-01-10' },
];

export const Employees: React.FC = () => {
  const [employeesList, setEmployeesList] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  // Add Employee Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('Production');
  const [newEmail, setNewEmail] = useState('');

  const handleAddEmployee = () => {
    if (!newName || !newRole || !newEmail) {
      alert("Name, Role, and Email are mandatory.");
      return;
    }
    const newEmp = {
      id: `EMP-0${Math.floor(Math.random() * 90) + 10}`,
      name: newName,
      role: newRole,
      department: newDept,
      email: newEmail,
      phone: '+1 (555) 000-0000',
      location: 'Main Plant, New York',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setEmployeesList([newEmp, ...employeesList]);
    setShowAddModal(false);
    setNewName('');
    setNewRole('');
    setNewEmail('');
  };

  const filteredEmployees = employeesList.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = departmentFilter === 'All' || emp.department === departmentFilter;
    return matchSearch && matchDept;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Active</span>;
    }
    return <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{status}</span>;
  };

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Employee Directory</h1>
          <p className="erp-page-subtitle">Manage staff, roles, and organizational structure</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} style={{marginRight: '8px'}} /> Add Employee
          </button>
        </div>
      </div>

      <div className="erp-panel" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', borderLeft: '4px solid #0ea5e9', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Total Employees</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>248</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #10b981', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Active Staff</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>235</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #f59e0b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>On Leave</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>13</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #8b5cf6', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Open Positions</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>6</h2>
        </div>
      </div>

      <div className="erp-panel">
        <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="erp-panel-title">Staff Roster</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              className="erp-input" 
              value={departmentFilter} 
              onChange={e => setDepartmentFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="All">All Departments</option>
              <option value="Production">Production</option>
              <option value="Quality Control">Quality Control</option>
              <option value="Supply Chain">Supply Chain</option>
              <option value="Sales & CRM">Sales & CRM</option>
              <option value="Logistics">Logistics</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Analytics">Analytics</option>
            </select>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="erp-input" 
                placeholder="Search name, ID, role..." 
                style={{ width: '100%', paddingLeft: '40px' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="erp-table-container">
          <table className="erp-table" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px' }}>Employee</th>
                <th style={{ padding: '16px' }}>Role / Department</th>
                <th style={{ padding: '16px' }}>Contact</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{emp.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{emp.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 500, color: '#334155' }}>{emp.role}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{emp.department}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#334155' }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '16px' }}>{getStatusBadge(emp.status)}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      className="erp-btn" 
                      style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedEmployee && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ width: '550px' }}>
            <div className="erp-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users color="#0ea5e9" /> Employee Profile
              </h2>
              <button className="erp-modal-close" onClick={() => setSelectedEmployee(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '2rem' }}>
                  {selectedEmployee.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.5rem', color: '#0f172a' }}>{selectedEmployee.name}</h3>
                  <div style={{ fontSize: '1rem', color: '#64748b', marginBottom: '8px' }}>{selectedEmployee.role} &bull; {selectedEmployee.department}</div>
                  {getStatusBadge(selectedEmployee.status)}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '4px', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <Briefcase size={14} /> Employee ID
                  </div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{selectedEmployee.id}</div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '4px', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <MapPin size={14} /> Location
                  </div>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{selectedEmployee.location}</div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>Contact Information</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Mail size={16} color="#94a3b8" />
                  <span style={{ color: '#334155' }}>{selectedEmployee.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={16} color="#94a3b8" />
                  <span style={{ color: '#334155' }}>{selectedEmployee.phone}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="erp-btn erp-btn-secondary" onClick={() => setSelectedEmployee(null)}>Close Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ width: '500px' }}>
            <div className="erp-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus color="#10b981" /> Add New Employee
              </h2>
              <button className="erp-modal-close" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Full Name</label>
                <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. Jane Doe" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Email Address</label>
                <input type="email" className="erp-input" style={{ width: '100%' }} placeholder="e.g. jane.doe@avenzatextiles.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Role / Job Title</label>
                  <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. Quality Inspector" value={newRole} onChange={e => setNewRole(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Department</label>
                  <select className="erp-input" style={{ width: '100%' }} value={newDept} onChange={e => setNewDept(e.target.value)}>
                    <option value="Production">Production</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Supply Chain">Supply Chain</option>
                    <option value="Sales & CRM">Sales & CRM</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="erp-btn erp-btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="erp-btn erp-btn-primary" onClick={handleAddEmployee}>
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
