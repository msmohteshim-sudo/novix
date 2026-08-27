import React, { useState } from 'react';
import { Calendar, Search, Clock, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import '../dashboard/dashboard.css';

const mockAttendance = [
  { id: 'ATT-001', employeeId: 'EMP-001', name: 'John Doe', department: 'Production', date: new Date().toISOString().split('T')[0], clockIn: '07:55 AM', clockOut: '04:05 PM', status: 'Present', hours: 8.1 },
  { id: 'ATT-002', employeeId: 'EMP-002', name: 'Jane Smith', department: 'Quality Control', date: new Date().toISOString().split('T')[0], clockIn: '08:02 AM', clockOut: '04:10 PM', status: 'Present', hours: 8.1 },
  { id: 'ATT-003', employeeId: 'EMP-003', name: 'Robert Johnson', department: 'Supply Chain', date: new Date().toISOString().split('T')[0], clockIn: '08:30 AM', clockOut: '05:00 PM', status: 'Late', hours: 8.5 },
  { id: 'ATT-004', employeeId: 'EMP-004', name: 'Emily Davis', department: 'Sales & CRM', date: new Date().toISOString().split('T')[0], clockIn: '-', clockOut: '-', status: 'On Leave', hours: 0 },
  { id: 'ATT-005', employeeId: 'EMP-005', name: 'Michael Brown', department: 'Production', date: new Date().toISOString().split('T')[0], clockIn: '07:50 AM', clockOut: '04:00 PM', status: 'Present', hours: 8.1 },
  { id: 'ATT-006', employeeId: 'EMP-006', name: 'Sarah Wilson', department: 'Logistics', date: new Date().toISOString().split('T')[0], clockIn: '-', clockOut: '-', status: 'Absent', hours: 0 },
  { id: 'ATT-007', employeeId: 'EMP-007', name: 'David Lee', department: 'Human Resources', date: new Date().toISOString().split('T')[0], clockIn: '08:55 AM', clockOut: '05:10 PM', status: 'Present', hours: 8.2 },
  { id: 'ATT-008', employeeId: 'EMP-008', name: 'Amanda Taylor', department: 'Analytics', date: new Date().toISOString().split('T')[0], clockIn: '09:05 AM', clockOut: '05:30 PM', status: 'Late', hours: 8.4 },
];

export const Attendance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAttendance = mockAttendance.filter(att => {
    const matchSearch = att.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        att.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || att.status === statusFilter;
    const matchDate = att.date === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Present':
        return <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><CheckCircle size={12}/> Present</span>;
      case 'Late':
        return <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><AlertTriangle size={12}/> Late</span>;
      case 'Absent':
        return <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><XCircle size={12}/> Absent</span>;
      case 'On Leave':
        return <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}><Calendar size={12}/> On Leave</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const handleExport = () => {
    const csvContent = "Employee,Department,Clock In,Clock Out,Total Hours,Status\n" 
      + filteredAttendance.map(a => `${a.name},${a.department},${a.clockIn},${a.clockOut},${a.hours},${a.status}`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Attendance_Report_${dateFilter}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Employee Attendance</h1>
          <p className="erp-page-subtitle">Track daily clock-ins, absences, and logged hours</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-outline" onClick={handleExport}>
            <FileText size={16} style={{marginRight: '8px'}} /> Export Report
          </button>
        </div>
      </div>

      <div className="erp-panel" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', borderLeft: '4px solid #10b981', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Present Today</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>218</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #f59e0b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Late Arrivals</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>12</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #ef4444', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Absent</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>5</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #64748b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>On Leave</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>13</h2>
        </div>
      </div>

      <div className="erp-panel">
        <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="erp-panel-title">Daily Attendance Log</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="date" 
              className="erp-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: '150px' }}
            />
            <select 
              className="erp-input" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              style={{ width: '140px' }}
            >
              <option value="All">All Status</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
            </select>
            <div style={{ position: 'relative', width: '250px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="erp-input" 
                placeholder="Search employee..." 
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
                <th style={{ padding: '16px' }}>Department</th>
                <th style={{ padding: '16px' }}>Clock In</th>
                <th style={{ padding: '16px' }}>Clock Out</th>
                <th style={{ padding: '16px' }}>Total Hours</th>
                <th style={{ padding: '16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length > 0 ? filteredAttendance.map(att => (
                <tr key={att.id} style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b', fontSize: '0.85rem' }}>
                        {att.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{att.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{att.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#475569' }}>{att.department}</td>
                  <td style={{ padding: '16px', fontWeight: 500, color: '#334155' }}>
                    {att.clockIn !== '-' && <Clock size={12} style={{marginRight: '4px', color: '#94a3b8', display: 'inline-block'}}/>}
                    {att.clockIn}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 500, color: '#334155' }}>
                    {att.clockOut !== '-' && <Clock size={12} style={{marginRight: '4px', color: '#94a3b8', display: 'inline-block'}}/>}
                    {att.clockOut}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#0ea5e9' }}>
                    {att.hours > 0 ? `${att.hours} hrs` : '-'}
                  </td>
                  <td style={{ padding: '16px' }}>{getStatusBadge(att.status)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <Calendar size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p>No attendance records found for this criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
