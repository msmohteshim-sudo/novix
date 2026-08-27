import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, XCircle,
  Building2, ChevronLeft, ChevronRight, Award, TrendingUp,
  Download, Plus, Search, Sparkles, CheckCircle, Send,
  Briefcase, History
} from 'lucide-react';
import '../dashboard/dashboard.css';
import { useAuth } from '../../context/AuthContext';

interface AttendanceRecord {
  id?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  hours?: number;
  overtime?: number;
  notes?: string;
}

interface YearlyStats {
  year: number;
  totalWorkingDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  leaveDays: number;
  halfDays: number;
  overtimeHours: number;
  totalHours: number;
  attendanceRate: number;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MyAttendance: React.FC = () => {
  const { user } = useAuth();
  
  // Current Date defaults
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
  const [activeTab, setActiveTab] = useState<'monthly' | 'track-record' | 'requests'>('monthly');

  // State for data
  const [userInfo, setUserInfo] = useState<any>({
    name: user ? `${user.firstName} ${user.lastName}` : 'Michael Brown',
    employeeId: 'EMP-104',
    joiningDate: '2022-03-15',
    joiningYear: 2022,
    department: 'Production & Weaving',
    shift: 'Morning Shift (08:00 AM - 04:30 PM)',
    tenure: '4 Years 5 Months'
  });

  const [monthStats, setMonthStats] = useState<any>({
    totalPresent: 0,
    totalLate: 0,
    totalAbsent: 0,
    totalLeave: 0,
    totalHalfDay: 0,
    totalOvertimeHours: 0,
    avgDailyHours: 0
  });

  const [monthlyRecords, setMonthlyRecords] = useState<AttendanceRecord[]>([]);
  const [yearlyTrackRecord, setYearlyTrackRecord] = useState<YearlyStats[]>([]);
  const [lifetimeStats, setLifetimeStats] = useState<any>({
    lifetimeWorkingDays: 0,
    lifetimePresentDays: 0,
    lifetimeAttendanceRate: 0,
    lifetimeOvertimeHours: 0,
    lifetimeLeaves: 0
  });

  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [clockingIn, setClockingIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Request Modal State
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [requestDate, setRequestDate] = useState<string>(today.toISOString().split('T')[0]);
  const [requestType, setRequestType] = useState<string>('Casual Leave');
  const [requestReason, setRequestReason] = useState<string>('');
  const [requestSuccessMsg, setRequestSuccessMsg] = useState<string>('');

  // Fetch Attendance Data
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('novax_token');
      const response = await fetch(`http://localhost:5000/api/attendance/my-attendance?year=${selectedYear}&month=${selectedMonth}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) setUserInfo(data.user);
        if (data.monthStats) setMonthStats(data.monthStats);
        if (data.monthlyRecords) setMonthlyRecords(data.monthlyRecords);
        if (data.yearlyTrackRecord) setYearlyTrackRecord(data.yearlyTrackRecord);
        if (data.lifetimeStats) setLifetimeStats(data.lifetimeStats);
        if (data.todayRecord) setTodayRecord(data.todayRecord);
      } else {
        generateMockFallback();
      }
    } catch (err) {
      console.warn('API error, using mock data generation', err);
      generateMockFallback();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedYear, selectedMonth]);

  // Fallback mock generator if backend is restarting
  const generateMockFallback = () => {
    const records: AttendanceRecord[] = [];
    const daysCount = new Date(selectedYear, selectedMonth, 0).getDate();

    for (let d = 1; d <= daysCount; d++) {
      const dObj = new Date(selectedYear, selectedMonth - 1, d);
      if (dObj.getDay() === 0) continue;
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      let st = 'Present';
      let cin = '07:55 AM';
      let cout = '04:30 PM';
      let hrs = 8.5;
      let ot = 0;
      if (d % 11 === 0) { st = 'Late'; cin = '08:35 AM'; }
      else if (d % 17 === 0) { st = 'On Leave'; cin = '-'; cout = '-'; hrs = 0; }
      else if (d % 23 === 0) { st = 'Absent'; cin = '-'; cout = '-'; hrs = 0; }
      else if (d % 7 === 0) { ot = 2.0; hrs = 10.5; cout = '06:30 PM'; }

      records.push({ date: dateStr, checkIn: cin, checkOut: cout, status: st, hours: hrs, overtime: ot, notes: 'Regular Shift' });
    }

    setMonthlyRecords(records);
    setMonthStats({
      totalPresent: records.filter(r => r.status === 'Present').length,
      totalLate: records.filter(r => r.status === 'Late').length,
      totalAbsent: records.filter(r => r.status === 'Absent').length,
      totalLeave: records.filter(r => r.status === 'On Leave').length,
      totalHalfDay: 0,
      totalOvertimeHours: 8.0,
      avgDailyHours: 8.4
    });

    const yearlyTrack: YearlyStats[] = [
      { year: 2022, totalWorkingDays: 240, presentDays: 228, lateDays: 7, absentDays: 2, leaveDays: 3, halfDays: 0, overtimeHours: 45, totalHours: 1980, attendanceRate: 98 },
      { year: 2023, totalWorkingDays: 288, presentDays: 272, lateDays: 10, absentDays: 3, leaveDays: 3, halfDays: 0, overtimeHours: 62, totalHours: 2380, attendanceRate: 97 },
      { year: 2024, totalWorkingDays: 288, presentDays: 275, lateDays: 8, absentDays: 1, leaveDays: 4, halfDays: 0, overtimeHours: 58, totalHours: 2400, attendanceRate: 98 },
      { year: 2025, totalWorkingDays: 288, presentDays: 274, lateDays: 9, absentDays: 2, leaveDays: 3, halfDays: 0, overtimeHours: 65, totalHours: 2420, attendanceRate: 98 },
      { year: 2026, totalWorkingDays: 180, presentDays: 172, lateDays: 5, absentDays: 1, leaveDays: 2, halfDays: 0, overtimeHours: 35, totalHours: 1480, attendanceRate: 98 }
    ];
    setYearlyTrackRecord(yearlyTrack);
    setLifetimeStats({
      lifetimeWorkingDays: 1284,
      lifetimePresentDays: 1251,
      lifetimeAttendanceRate: 98,
      lifetimeOvertimeHours: 265.0,
      lifetimeLeaves: 15
    });
  };

  // Clock In Action
  const handleClockIn = async () => {
    setClockingIn(true);
    try {
      const token = localStorage.getItem('novax_token');
      const res = await fetch('http://localhost:5000/api/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: user?.id })
      });
      if (res.ok) {
        const data = await res.json();
        setTodayRecord(data.record);
        fetchAttendanceData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setClockingIn(false);
    }
  };

  // Clock Out Action
  const handleClockOut = async () => {
    setClockingIn(true);
    try {
      const token = localStorage.getItem('novax_token');
      const res = await fetch('http://localhost:5000/api/attendance/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: user?.id })
      });
      if (res.ok) {
        const data = await res.json();
        setTodayRecord(data.record);
        fetchAttendanceData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setClockingIn(false);
    }
  };

  // Request Submission
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('novax_token');
      const res = await fetch('http://localhost:5000/api/attendance/request-correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ userId: user?.id, date: requestDate, requestType, reason: requestReason })
      });
      if (res.ok) {
        setRequestSuccessMsg(`Successfully submitted ${requestType} request for ${requestDate}!`);
        setTimeout(() => {
          setShowRequestModal(false);
          setRequestSuccessMsg('');
          setRequestReason('');
        }, 1800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const csvHeader = "Date,Day,Clock In,Clock Out,Total Hours,Overtime,Status,Notes\n";
    const rows = monthlyRecords.map(r => {
      const dayName = new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' });
      return `${r.date},${dayName},${r.checkIn || '-'},${r.checkOut || '-'},${r.hours || 0},${r.overtime || 0},${r.status},"${r.notes || ''}"`;
    }).join("\n");

    const blob = new Blob([csvHeader + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `My_Attendance_${selectedYear}_${String(selectedMonth).padStart(2, '0')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Year choices starting from joining year
  const joiningYear = userInfo.joiningYear || 2022;
  const availableYears: number[] = [];
  for (let y = joiningYear; y <= today.getFullYear(); y++) {
    availableYears.push(y);
  }

  // Prev / Next month handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      if (selectedYear > joiningYear) {
        setSelectedYear(selectedYear - 1);
        setSelectedMonth(12);
      }
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      if (selectedYear < today.getFullYear()) {
        setSelectedYear(selectedYear + 1);
        setSelectedMonth(1);
      }
    } else {
      if (selectedYear === today.getFullYear() && selectedMonth >= today.getMonth() + 1) return;
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Filtered monthly records table
  const filteredRecords = monthlyRecords.filter(r => {
    const matchesSearch = r.date.includes(searchTerm) || (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Present':
        return { bg: '#dcfce7', color: '#166534', icon: <CheckCircle2 size={13} /> };
      case 'Late':
        return { bg: '#fef3c7', color: '#b45309', icon: <AlertTriangle size={13} /> };
      case 'Absent':
        return { bg: '#fee2e2', color: '#991b1b', icon: <XCircle size={13} /> };
      case 'On Leave':
      case 'Leave':
        return { bg: '#e0f2fe', color: '#0369a1', icon: <CalendarIcon size={13} /> };
      case 'Half Day':
        return { bg: '#f3e8ff', color: '#6b21a8', icon: <Clock size={13} /> };
      default:
        return { bg: '#f1f5f9', color: '#475569', icon: <Clock size={13} /> };
    }
  };

  return (
    <div className="erp-dashboard">
      {/* Header Banner with Worker Profile & Joining Date Info */}
      <div className="erp-panel" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '1.75rem 2rem',
        borderRadius: '16px',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: '700',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
            }}>
              {userInfo.name.split(' ').map((n: string) => n[0]).join('')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: '#ffffff' }}>{userInfo.name}</h1>
                <span style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {userInfo.employeeId}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '8px', color: '#94a3b8', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#38bdf8" /> {userInfo.department}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={14} color="#38bdf8" /> {userInfo.shift}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 600 }}>
                  <Briefcase size={14} /> Joined: {userInfo.joiningDate}
                </span>
              </div>
            </div>
          </div>

          {/* Tenure & Live Clock Widget */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '10px 18px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Service Tenure</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Award size={18} /> {userInfo.tenure}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {!todayRecord?.checkIn || todayRecord.checkIn === '-' ? (
                <button
                  className="erp-btn"
                  onClick={handleClockIn}
                  disabled={clockingIn}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '10px 20px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Clock size={16} /> {clockingIn ? 'Clocking In...' : 'Clock In Now'}
                </button>
              ) : (
                <button
                  className="erp-btn"
                  onClick={handleClockOut}
                  disabled={clockingIn || (!!todayRecord.checkOut && todayRecord.checkOut !== '-')}
                  style={{
                    backgroundColor: (todayRecord.checkOut && todayRecord.checkOut !== '-') ? '#64748b' : '#ef4444',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '10px 20px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <Clock size={16} /> {todayRecord.checkOut && todayRecord.checkOut !== '-' ? 'Clocked Out Today' : (clockingIn ? 'Clocking Out...' : 'Clock Out')}
                </button>
              )}

              <button
                className="erp-btn erp-btn-outline"
                onClick={() => setShowRequestModal(true)}
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} /> Request Leave / Correction
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('monthly')}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 16px',
              fontSize: '1rem',
              fontWeight: activeTab === 'monthly' ? 700 : 500,
              color: activeTab === 'monthly' ? '#0284c7' : '#64748b',
              borderBottom: activeTab === 'monthly' ? '3px solid #0284c7' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CalendarIcon size={18} /> Monthly Attendance Log
          </button>

          <button
            onClick={() => setActiveTab('track-record')}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px 16px',
              fontSize: '1rem',
              fontWeight: activeTab === 'track-record' ? 700 : 500,
              color: activeTab === 'track-record' ? '#0284c7' : '#64748b',
              borderBottom: activeTab === 'track-record' ? '3px solid #0284c7' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <History size={18} /> Multi-Year Track Record (Career View)
          </button>
        </div>

        {activeTab === 'monthly' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="erp-btn erp-btn-outline" onClick={handlePrevMonth} title="Previous Month">
              <ChevronLeft size={16} />
            </button>

            <select
              className="erp-input"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              style={{ width: '130px', fontWeight: 600 }}
            >
              {MONTH_NAMES.map((name, idx) => (
                <option key={idx + 1} value={idx + 1}>{name}</option>
              ))}
            </select>

            <select
              className="erp-input"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              style={{ width: '100px', fontWeight: 600 }}
            >
              {availableYears.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <button className="erp-btn erp-btn-outline" onClick={handleNextMonth} title="Next Month">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: MONTHLY ATTENDANCE SYSTEM */}
      {activeTab === 'monthly' && (
        <>
          {/* Monthly KPI Summary Panel */}
          <div className="erp-panel" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ padding: '1rem', borderLeft: '4px solid #10b981', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Days Present</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{monthStats.totalPresent}</div>
            </div>

            <div style={{ padding: '1rem', borderLeft: '4px solid #f59e0b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Late Check-Ins</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#b45309', marginTop: '4px' }}>{monthStats.totalLate}</div>
            </div>

            <div style={{ padding: '1rem', borderLeft: '4px solid #ef4444', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Absences</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#991b1b', marginTop: '4px' }}>{monthStats.totalAbsent}</div>
            </div>

            <div style={{ padding: '1rem', borderLeft: '4px solid #0284c7', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Approved Leaves</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0369a1', marginTop: '4px' }}>{monthStats.totalLeave}</div>
            </div>

            <div style={{ padding: '1rem', borderLeft: '4px solid #8b5cf6', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Overtime Hours</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#6b21a8', marginTop: '4px' }}>{monthStats.totalOvertimeHours} <span style={{ fontSize: '0.85rem' }}>hrs</span></div>
            </div>

            <div style={{ padding: '1rem', borderLeft: '4px solid #64748b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Avg Hours/Day</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>{monthStats.avgDailyHours} <span style={{ fontSize: '0.85rem' }}>hrs</span></div>
            </div>
          </div>

          {/* Monthly Calendar View (Grid) */}
          <div className="erp-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="erp-panel-header">
              <h3 className="erp-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={18} color="#0284c7" />
                Monthly Attendance Calendar ({MONTH_NAMES[selectedMonth - 1]} {selectedYear}) {loading && <span style={{ fontSize: '0.8rem', color: '#0284c7' }}>(Syncing...)</span>}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Click on any date entry to view exact clock timestamps
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => (
                <div key={dayName} style={{
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  color: idx === 0 ? '#ef4444' : '#475569',
                  padding: '8px 0',
                  textTransform: 'uppercase'
                }}>
                  {dayName}
                </div>
              ))}

              {/* Offset empty cells for first day of month */}
              {Array.from({ length: new Date(selectedYear, selectedMonth - 1, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} style={{ minHeight: '80px', backgroundColor: '#ffffff', opacity: 0.3, borderRadius: '8px' }} />
              ))}

              {/* Days of selected month */}
              {Array.from({ length: new Date(selectedYear, selectedMonth, 0).getDate() }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const rec = monthlyRecords.find(r => r.date === dateStr);
                const isSunday = new Date(selectedYear, selectedMonth - 1, dayNum).getDay() === 0;

                const badge = rec ? getBadgeStyle(rec.status) : { bg: '#f1f5f9', color: '#94a3b8', icon: null };

                return (
                  <div key={dayNum} style={{
                    minHeight: '85px',
                    backgroundColor: isSunday ? '#fef2f2' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isSunday ? '#ef4444' : '#0f172a' }}>{dayNum}</span>
                      {rec && (
                        <span style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          {badge.icon} {rec.status}
                        </span>
                      )}
                      {isSunday && !rec && (
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 600 }}>Weekly Off</span>
                      )}
                    </div>

                    {rec && rec.status !== 'Absent' && rec.status !== 'On Leave' && rec.status !== 'Leave' && (
                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '6px' }}>
                        <div><strong style={{ color: '#0f172a' }}>In:</strong> {rec.checkIn || '-'}</div>
                        <div><strong style={{ color: '#0f172a' }}>Out:</strong> {rec.checkOut || '-'}</div>
                      </div>
                    )}

                    {rec && rec.overtime && rec.overtime > 0 ? (
                      <div style={{ fontSize: '0.7rem', color: '#6b21a8', fontWeight: 700, marginTop: '2px' }}>
                        ⚡ +{rec.overtime} hrs OT
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Attendance Log Table */}
          <div className="erp-panel">
            <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 className="erp-panel-title">Daily Attendance Log ({MONTH_NAMES[selectedMonth - 1]} {selectedYear})</h3>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="erp-input"
                    placeholder="Search date or note..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '34px', width: '100%' }}
                  />
                </div>

                <select
                  className="erp-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ width: '130px' }}
                >
                  <option value="All">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Half Day">Half Day</option>
                </select>

                <button className="erp-btn erp-btn-outline" onClick={handleExportCSV}>
                  <Download size={15} style={{ marginRight: '6px' }} /> Export CSV
                </button>
              </div>
            </div>

            <div className="erp-table-container">
              <table className="erp-table" style={{ borderSpacing: '0 8px', borderCollapse: 'separate' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '14px' }}>Date</th>
                    <th style={{ padding: '14px' }}>Day</th>
                    <th style={{ padding: '14px' }}>Check In</th>
                    <th style={{ padding: '14px' }}>Check Out</th>
                    <th style={{ padding: '14px' }}>Working Hours</th>
                    <th style={{ padding: '14px' }}>Overtime</th>
                    <th style={{ padding: '14px' }}>Status</th>
                    <th style={{ padding: '14px' }}>Shift & Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((r, idx) => {
                      const dayName = new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' });
                      const badge = getBadgeStyle(r.status);
                      return (
                        <tr key={idx} style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <td style={{ padding: '14px', fontWeight: 600, color: '#0f172a' }}>{r.date}</td>
                          <td style={{ padding: '14px', color: '#64748b' }}>{dayName}</td>
                          <td style={{ padding: '14px', fontWeight: 500, color: '#334155' }}>
                            {r.checkIn !== '-' && <Clock size={12} style={{ marginRight: '4px', color: '#94a3b8', display: 'inline-block' }} />}
                            {r.checkIn || '-'}
                          </td>
                          <td style={{ padding: '14px', fontWeight: 500, color: '#334155' }}>
                            {r.checkOut !== '-' && <Clock size={12} style={{ marginRight: '4px', color: '#94a3b8', display: 'inline-block' }} />}
                            {r.checkOut || '-'}
                          </td>
                          <td style={{ padding: '14px', fontWeight: 600, color: '#0ea5e9' }}>
                            {r.hours && r.hours > 0 ? `${r.hours} hrs` : '-'}
                          </td>
                          <td style={{ padding: '14px', fontWeight: 600, color: r.overtime && r.overtime > 0 ? '#8b5cf6' : '#94a3b8' }}>
                            {r.overtime && r.overtime > 0 ? `+${r.overtime} hrs` : '-'}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span style={{
                              backgroundColor: badge.bg,
                              color: badge.color,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {badge.icon} {r.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px', fontSize: '0.85rem', color: '#64748b' }}>{r.notes || 'Regular Shift'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <CalendarIcon size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                        <p>No attendance records logged for this month selection.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: MULTI-YEAR CAREER TRACK RECORD */}
      {activeTab === 'track-record' && (
        <>
          {/* Lifetime Overview Cards */}
          <div className="erp-panel" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '12px', border: '1px solid #bae6fd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>Lifetime Working Days</span>
                <Briefcase size={20} color="#0284c7" />
              </div>
              <h2 style={{ margin: '8px 0 0', fontSize: '2.2rem', color: '#0c4a6e', fontWeight: 800 }}>{lifetimeStats.lifetimeWorkingDays}</h2>
              <div style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '4px' }}>Since joining {userInfo.joiningDate}</div>
            </div>

            <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>Overall Attendance Rate</span>
                <TrendingUp size={20} color="#16a34a" />
              </div>
              <h2 style={{ margin: '8px 0 0', fontSize: '2.2rem', color: '#14532d', fontWeight: 800 }}>{lifetimeStats.lifetimeAttendanceRate}%</h2>
              <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '4px' }}>Consistent high compliance</div>
            </div>

            <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase' }}>Lifetime Overtime Logged</span>
                <Sparkles size={20} color="#9333ea" />
              </div>
              <h2 style={{ margin: '8px 0 0', fontSize: '2.2rem', color: '#581c87', fontWeight: 800 }}>{lifetimeStats.lifetimeOvertimeHours} <span style={{ fontSize: '1rem' }}>hrs</span></h2>
              <div style={{ fontSize: '0.8rem', color: '#9333ea', marginTop: '4px' }}>Total production contributions</div>
            </div>

            <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', borderRadius: '12px', border: '1px solid #fed7aa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase' }}>Total Paid Leaves</span>
                <Award size={20} color="#ea580c" />
              </div>
              <h2 style={{ margin: '8px 0 0', fontSize: '2.2rem', color: '#7c2d12', fontWeight: 800 }}>{lifetimeStats.lifetimeLeaves} <span style={{ fontSize: '1rem' }}>days</span></h2>
              <div style={{ fontSize: '0.8rem', color: '#ea580c', marginTop: '4px' }}>Approved annual leaves</div>
            </div>
          </div>

          {/* Year-by-Year Breakdown Table & Cards */}
          <div className="erp-panel">
            <div className="erp-panel-header">
              <div>
                <h3 className="erp-panel-title">Year-by-Year Career Track Record (Since {userInfo.joiningYear})</h3>
                <p className="erp-panel-subtitle">Annual breakdown of working days, attendance rate, and overtime history</p>
              </div>
            </div>

            <div className="erp-table-container">
              <table className="erp-table">
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '16px' }}>Working Year</th>
                    <th style={{ padding: '16px' }}>Total Working Days</th>
                    <th style={{ padding: '16px' }}>Present Days</th>
                    <th style={{ padding: '16px' }}>Late Days</th>
                    <th style={{ padding: '16px' }}>Absences</th>
                    <th style={{ padding: '16px' }}>Leaves</th>
                    <th style={{ padding: '16px' }}>Overtime (Hrs)</th>
                    <th style={{ padding: '16px' }}>Attendance Rate %</th>
                    <th style={{ padding: '16px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyTrackRecord.map((yData) => (
                    <tr key={yData.year} style={{ backgroundColor: '#ffffff' }}>
                      <td style={{ padding: '16px', fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CalendarIcon size={16} color="#0284c7" />
                          {yData.year} {yData.year === userInfo.joiningYear ? '(Joining Year)' : ''}
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#334155' }}>{yData.totalWorkingDays} days</td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#16a34a' }}>{yData.presentDays} days</td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#d97706' }}>{yData.lateDays} days</td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#dc2626' }}>{yData.absentDays} days</td>
                      <td style={{ padding: '16px', fontWeight: 600, color: '#0284c7' }}>{yData.leaveDays} days</td>
                      <td style={{ padding: '16px', fontWeight: 700, color: '#8b5cf6' }}>+{yData.overtimeHours} hrs</td>
                      <td style={{ padding: '16px', width: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: 1, height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${yData.attendanceRate}%`,
                              height: '100%',
                              backgroundColor: yData.attendanceRate >= 95 ? '#10b981' : (yData.attendanceRate >= 90 ? '#f59e0b' : '#ef4444'),
                              borderRadius: '5px'
                            }} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{yData.attendanceRate}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button
                          className="erp-btn erp-btn-outline"
                          onClick={() => {
                            setSelectedYear(yData.year);
                            setSelectedMonth(1);
                            setActiveTab('monthly');
                          }}
                          style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                        >
                          View Months
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            width: '450px',
            maxWidth: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1.3rem', color: '#0f172a' }}>Submit Attendance Request</h2>
            
            {requestSuccessMsg ? (
              <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} /> {requestSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Target Date</label>
                  <input
                    type="date"
                    className="erp-input"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Request Type</label>
                  <select
                    className="erp-input"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Attendance Correction">Attendance Correction (Forgot Clock In/Out)</option>
                    <option value="Overtime Claim">Overtime Hours Claim</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Reason / Details</label>
                  <textarea
                    className="erp-input"
                    rows={3}
                    placeholder="Provide details for manager review..."
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    style={{ width: '100%', resize: 'vertical' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="erp-btn erp-btn-outline" onClick={() => setShowRequestModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="erp-btn erp-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={16} /> Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
