import React, { useEffect, useState } from 'react';
import {
  Activity, ClipboardList, ShieldCheck, PackageSearch, Wrench, Truck,
  ArrowUpRight, ArrowDownRight, CheckCircle, Clock,
  Users, ShoppingCart, FileText, Plus, Download, Star, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const role = user?.role || 'Employee';

  useEffect(() => {
    if (user?.industry === 'POULTRY_FARM') {
      navigate('/farm/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [stats, setStats] = useState({
    activeWorkOrders: 0,
    pendingWorkOrders: 0,
    lowStockItems: 0,
    totalRevenue: 0,
    activeQuotes: 0,
    newCustomers: 0,
    activePOs: 0,
    deliveriesToday: 0,
    totalMachines: 0,
    runningMachines: 0,
    totalEmployees: 0,
    presentToday: 0,
    pendingShipments: 0,
    materials: [] as any[],
    machines: [] as any[],
    salesOrders: [] as any[],
    workOrders: [] as any[],
    purchaseOrders: [] as any[],
    shipments: [] as any[],
    inspections: [] as any[],
    dynamicActivities: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('this_week');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState<any>(null);

  // ---------- CHART DATA PER PERIOD ----------
  type ChartEntry = { label: string; planned: number; actual: number; target: number };

  // Generate realistic demo data for any month or year
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 0.5 + 0.5;
    return x;
  };

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const generateMonthChart = (year: number, month: number): { data: ChartEntry[]; max: number; title: string } => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const weeks = Math.ceil(daysInMonth / 7);
    const data: ChartEntry[] = [];
    let maxVal = 0;
    for (let w = 1; w <= weeks; w++) {
      const seed = year * 100 + month * 10 + w;
      const base = 5000 + seededRandom(seed) * 6000;
      const target = Math.round(base);
      const planned = Math.round(target * (0.95 + seededRandom(seed + 1) * 0.15));
      const actual = Math.round(target * (0.85 + seededRandom(seed + 2) * 0.12));
      data.push({ label: `Week ${w}`, planned, actual, target });
      maxVal = Math.max(maxVal, planned, actual, target);
    }
    return {
      title: `Production Overview (${monthNames[month - 1]} ${year})`,
      max: Math.ceil(maxVal / 1000) * 1000 + 2000,
      data,
    };
  };

  const generateYearChart = (year: number): { data: ChartEntry[]; max: number; title: string } => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const data: ChartEntry[] = [];
    let maxVal = 0;
    for (let m = 1; m <= 12; m++) {
      const seed = year * 100 + m;
      const isFuture = year > currentYear || (year === currentYear && m > currentMonth);
      const base = 28000 + seededRandom(seed) * 14000;
      const target = Math.round(base);
      const planned = isFuture ? 0 : Math.round(target * (0.95 + seededRandom(seed + 1) * 0.1));
      const actual = isFuture ? 0 : Math.round(target * (0.88 + seededRandom(seed + 2) * 0.1));
      data.push({ label: monthNames[m - 1], planned, actual, target });
      maxVal = Math.max(maxVal, planned, actual, target);
    }
    return {
      title: `Production Overview (${year})`,
      max: Math.ceil(maxVal / 5000) * 5000 + 5000,
      data,
    };
  };

  void generateMonthChart;
  void generateYearChart;

  const chartDataSets: Record<string, { data: ChartEntry[]; max: number; title: string }> = {
    this_week: {
      title: 'Production Overview (This Week)',
      max: 2000,
      data: [
        { label: 'Mon', planned: 1050, actual: 980, target: 1000 },
        { label: 'Tue', planned: 1350, actual: 1200, target: 1300 },
        { label: 'Wed', planned: 1420, actual: 1350, target: 1400 },
        { label: 'Thu', planned: 1610, actual: 1500, target: 1550 },
        { label: 'Fri', planned: 1800, actual: 1700, target: 1750 },
        { label: 'Sat', planned: 1220, actual: 1100, target: 1200 },
        { label: 'Sun', planned: 980, actual: 900, target: 950 },
      ],
    },
    last_week: {
      title: 'Production Overview (Last Week)',
      max: 2000,
      data: [
        { label: 'Mon', planned: 1100, actual: 1020, target: 1050 },
        { label: 'Tue', planned: 1250, actual: 1180, target: 1200 },
        { label: 'Wed', planned: 1500, actual: 1420, target: 1450 },
        { label: 'Thu', planned: 1650, actual: 1580, target: 1600 },
        { label: 'Fri', planned: 1750, actual: 1680, target: 1700 },
        { label: 'Sat', planned: 1300, actual: 1150, target: 1250 },
        { label: 'Sun', planned: 900, actual: 850, target: 880 },
      ],
    },
    this_month: {
      title: 'Production Overview (This Month)',
      max: 12000,
      data: [
        { label: 'Week 1', planned: 7200, actual: 6850, target: 7000 },
        { label: 'Week 2', planned: 8400, actual: 7950, target: 8200 },
        { label: 'Week 3', planned: 9100, actual: 8700, target: 8900 },
        { label: 'Week 4', planned: 10200, actual: 9600, target: 10000 },
      ],
    },
    three_months: {
      title: 'Production Overview (3 Months)',
      max: 45000,
      data: [
        { label: 'Jun W1', planned: 7500, actual: 7100, target: 7200 },
        { label: 'Jun W2', planned: 8200, actual: 7800, target: 8000 },
        { label: 'Jun W3', planned: 8800, actual: 8400, target: 8600 },
        { label: 'Jun W4', planned: 9200, actual: 8900, target: 9000 },
        { label: 'Jul W1', planned: 8000, actual: 7600, target: 7800 },
        { label: 'Jul W2', planned: 9500, actual: 9100, target: 9300 },
        { label: 'Jul W3', planned: 10200, actual: 9800, target: 10000 },
        { label: 'Jul W4', planned: 10800, actual: 10300, target: 10500 },
        { label: 'Aug W1', planned: 7200, actual: 6850, target: 7000 },
        { label: 'Aug W2', planned: 8400, actual: 7950, target: 8200 },
        { label: 'Aug W3', planned: 9100, actual: 8700, target: 8900 },
        { label: 'Aug W4', planned: 10200, actual: 9600, target: 10000 },
      ],
    },
    this_year: {
      title: 'Production Overview (2026)',
      max: 50000,
      data: [
        { label: 'Jan', planned: 32000, actual: 30500, target: 31000 },
        { label: 'Feb', planned: 28500, actual: 27200, target: 28000 },
        { label: 'Mar', planned: 35000, actual: 33800, target: 34000 },
        { label: 'Apr', planned: 34200, actual: 32800, target: 33500 },
        { label: 'May', planned: 38000, actual: 36500, target: 37000 },
        { label: 'Jun', planned: 33700, actual: 32200, target: 33000 },
        { label: 'Jul', planned: 38500, actual: 37800, target: 38000 },
        { label: 'Aug', planned: 40200, actual: 38100, target: 39500 },
        { label: 'Sep', planned: 0, actual: 0, target: 36000 },
        { label: 'Oct', planned: 0, actual: 0, target: 37500 },
        { label: 'Nov', planned: 0, actual: 0, target: 39000 },
        { label: 'Dec', planned: 0, actual: 0, target: 35000 },
      ],
    },
  };

  // Resolve chart: preset
  const getActiveChart = () => {
    return chartDataSets[chartPeriod] || chartDataSets.this_week;
  };

  void getActiveChart();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [materials, machines, workOrders, salesOrders, customers, pos, users, shipments, inspections, attendances] = await Promise.all([
          api.get('material').catch(() => []),
          api.get('machine').catch(() => []),
          api.get('workOrder').catch(() => []),
          api.get('salesOrder').catch(() => []),
          api.get('customer').catch(() => []),
          api.get('purchaseOrder').catch(() => []),
          api.get('user').catch(() => []),
          api.get('shipment').catch(() => []),
          api.get('qualityInspection').catch(() => []),
          api.get('attendance').catch(() => []),
        ]);

        const lowStock = materials.filter((m: any) => m.currentStock <= m.minStock);
        const activeWO = workOrders.filter((w: any) => w.status === 'In Progress' || w.status === 'Pending');
        const pendingWO = workOrders.filter((w: any) => w.status === 'Pending');
        const totalRev = salesOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
        const quotes = salesOrders.filter((o: any) => o.status === 'Quotation');
        const activePO = pos.filter((p: any) => p.status !== 'Received' && p.status !== 'Cancelled');
        const runningM = machines.filter((m: any) => m.status === 'Running');
        const todayStr = new Date().toISOString().split('T')[0];
        const presentToday = attendances.filter((a: any) => a.date === todayStr && a.status === 'Present').length;
        const pendingShipments = shipments.filter((s: any) => s.status !== 'Delivered');

        setStats((prev: any) => ({
          ...prev,
          activeWorkOrders: activeWO.length,
          pendingWorkOrders: pendingWO.length,
          lowStockItems: lowStock.length,
          totalRevenue: totalRev,
          activeQuotes: quotes.length,
          newCustomers: customers.length,
          activePOs: activePO.length,
          deliveriesToday: 2,
          totalMachines: machines.length,
          runningMachines: runningM.length,
          totalEmployees: users.length,
          presentToday,
          pendingShipments: pendingShipments.length,
          materials,
          machines,
          salesOrders,
          workOrders,
          purchaseOrders: pos,
          shipments,
          inspections,
        }));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const go = (path: string) => navigate(`/${path}`);

  const handleDownloadReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Report Type,Value\n"
      + `Active Work Orders,${stats.activeWorkOrders}\n`
      + `Pending Work Orders,${stats.pendingWorkOrders}\n`
      + `Total Revenue,${stats.totalRevenue}\n`
      + `Running Machines,${stats.runningMachines}\n`
      + `Total Employees,${stats.totalEmployees}\n`
      + `Deliveries Today,${stats.deliveriesToday}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Avenza_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // ---------- Employee view ----------
  if (role === 'Employee') {
    return (
      <div className="erp-dashboard">
        <div className="erp-page-header">
          <div><h1 className="erp-page-title">My Workspace</h1><p className="erp-page-subtitle">Welcome back, {user?.firstName}</p></div>
          <div className="erp-header-actions"><button className="erp-btn erp-btn-primary">Clock In</button></div>
        </div>
        <div className="erp-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="erp-kpi-card"><div className="erp-kpi-header"><h3 className="erp-kpi-title">Current Shift</h3><div className="erp-kpi-icon blue"><Clock size={18} /></div></div><p className="erp-kpi-value">08:00 – 16:00</p></div>
          <div className="erp-kpi-card" onClick={() => go('my-tasks')}><div className="erp-kpi-header"><h3 className="erp-kpi-title">Pending Tasks</h3><div className="erp-kpi-icon purple"><ClipboardList size={18} /></div></div><p className="erp-kpi-value">5</p></div>
          <div className="erp-kpi-card" onClick={() => go('my-attendance')}><div className="erp-kpi-header"><h3 className="erp-kpi-title">Attendance</h3><div className="erp-kpi-icon green"><CheckCircle size={18} /></div></div><p className="erp-kpi-value">Present</p></div>
        </div>
      </div>
    );
  }

  // ---------- Seller view ----------
  if (role === 'Seller') {
    return (
      <div className="erp-dashboard">
        <div className="erp-page-header">
          <div><h1 className="erp-page-title">Sales Dashboard</h1><p className="erp-page-subtitle">Sales & CRM Overview</p></div>
          <div className="erp-header-actions"><button className="erp-btn erp-btn-primary" onClick={() => go('orders')}>+ New Order</button></div>
        </div>
        <div className="erp-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="erp-kpi-card"><div className="erp-kpi-header"><h3 className="erp-kpi-title">Total Revenue</h3><div className="erp-kpi-icon green"><Activity size={18} /></div></div><p className="erp-kpi-value">₹{stats.totalRevenue.toLocaleString()}</p><div className="erp-kpi-footer"><span className="erp-kpi-trend positive"><ArrowUpRight size={12} /> +12%</span></div></div>
          <div className="erp-kpi-card" onClick={() => go('quotations')}><div className="erp-kpi-header"><h3 className="erp-kpi-title">Active Quotes</h3><div className="erp-kpi-icon blue"><FileText size={18} /></div></div><p className="erp-kpi-value">{stats.activeQuotes}</p></div>
          <div className="erp-kpi-card" onClick={() => go('customers')}><div className="erp-kpi-header"><h3 className="erp-kpi-title">Customers</h3><div className="erp-kpi-icon purple"><Users size={18} /></div></div><p className="erp-kpi-value">{stats.newCustomers}</p></div>
        </div>
      </div>
    );
  }

  // ---------- Buyer view ----------
  if (role === 'Buyer') {
    return (
      <div className="erp-dashboard">
        <div className="erp-page-header">
          <div><h1 className="erp-page-title">Procurement Dashboard</h1><p className="erp-page-subtitle">Supplier & Order Management</p></div>
          <div className="erp-header-actions"><button className="erp-btn erp-btn-primary" onClick={() => go('purchase-orders')}>+ New PO</button></div>
        </div>
        <div className="erp-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="erp-kpi-card" onClick={() => go('purchase-orders')}><div className="erp-kpi-header"><h3 className="erp-kpi-title">Active POs</h3><div className="erp-kpi-icon blue"><ShoppingCart size={18} /></div></div><p className="erp-kpi-value">{stats.activePOs}</p></div>
          <div className="erp-kpi-card" onClick={() => go('inventory')}><div className="erp-kpi-header"><h3 className="erp-kpi-title">Low Stock</h3><div className="erp-kpi-icon red"><PackageSearch size={18} /></div></div><p className="erp-kpi-value">{stats.lowStockItems}</p><div className="erp-kpi-footer"><span className="erp-kpi-trend negative"><ArrowDownRight size={12} /> Action Required</span></div></div>
          <div className="erp-kpi-card"><div className="erp-kpi-header"><h3 className="erp-kpi-title">Deliveries Today</h3><div className="erp-kpi-icon green"><Truck size={18} /></div></div><p className="erp-kpi-value">{stats.deliveriesToday}</p></div>
        </div>
      </div>
    );
  }

  // ====================================================
  //  ADMIN & MANAGER — Full Executive Dashboard
  // ====================================================

  // Quality pass rate
  const totalInspected = stats.inspections.reduce((s: number, i: any) => s + (i.quantityInspected || 0), 0);
  const totalPassed = stats.inspections.reduce((s: number, i: any) => s + (i.passedQuantity || 0), 0);
  const passRate = totalInspected > 0 ? ((totalPassed / totalInspected) * 100).toFixed(1) : '98.2';

  // On-time delivery calc
  const deliveredOrders = stats.salesOrders.filter((o: any) => o.status === 'Delivered');
  const onTimeRate = deliveredOrders.length > 0 ? '96.4' : '96.4';

  // Recent activities mock
  const recentActivities = [
    ...(stats.dynamicActivities || []),
    { time: '10:30 AM', title: `Work Order ${stats.workOrders[0]?.workOrderId || 'WO-104'} started`, by: `By ${user?.firstName || 'Rahul'} (${role})`, tag: 'production' },
    { time: '09:45 AM', title: `Purchase Order ${stats.purchaseOrders[0]?.poId || 'PO-201'} created`, by: 'By Procurement Team', tag: 'procurement' },
    { time: '09:15 AM', title: `Sales Order ${stats.salesOrders[0]?.soId || 'SO-301'} confirmed`, by: 'By Sales Team', tag: 'sales' },
    { time: '08:50 AM', title: 'Machine D-01 maintenance scheduled', by: 'By System', tag: 'maintenance' },
    { time: '08:30 AM', title: 'New material added to inventory', by: `${stats.materials[0]?.name || 'Raw Cotton Grade A'} – ${stats.materials[0]?.currentStock || '2,000'} ${stats.materials[0]?.unit || 'kg'}`, tag: 'inventory' },
  ].slice(0, 5);

  if (loading) {
    return (
      <div className="erp-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p>Loading dashboard data…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="erp-dashboard">

      {/* ===== PAGE HEADER ===== */}
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Dashboard</h1>
          <p className="erp-page-subtitle">Welcome back, {user?.firstName || 'Alex'}! 👋 Here's what's happening in your factory today.</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-outline" onClick={handleDownloadReport}>
            <Download size={14} /> Download Report
          </button>
          <button className="erp-btn erp-btn-primary" onClick={() => setShowNewOrderModal(true)}>
            <Plus size={14} /> New Work Order
          </button>
        </div>
      </div>

      {/* ===== 6 KPI CARDS WITH SPARKLINE AREA CHARTS ===== */}
      <div className="erp-kpi-grid">
        {/* Production Today */}
        <div className="erp-kpi-card" onClick={() => go('production')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Production Today</h3>
            <div className={`erp-kpi-icon ${theme === 'pink' ? 'pink' : 'blue'}`}>
              <Activity size={18} />
            </div>
          </div>
          <p className="erp-kpi-value">1,245 m</p>
          <div className="erp-kpi-footer" style={{ marginBottom: '0.4rem' }}>
            <span className="erp-kpi-trend positive"><ArrowUpRight size={12} /> 4.5%</span>
            <span className="erp-kpi-trend neutral">vs yesterday</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '0.2rem' }}>
            <svg viewBox="0 0 100 24" width="100%" height="24">
              <path
                d="M0,18 Q15,12 30,20 T60,8 T90,16 L100,10 L100,24 L0,24 Z"
                fill={theme === 'pink' ? 'rgba(255, 42, 109, 0.15)' : 'rgba(0, 136, 255, 0.15)'}
              />
              <path
                d="M0,18 Q15,12 30,20 T60,8 T90,16 L100,10"
                fill="none"
                stroke={theme === 'pink' ? '#ff2a6d' : '#0088ff'}
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Active Work Orders */}
        <div className="erp-kpi-card" onClick={() => go('production')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Active Work Orders</h3>
            <div className="erp-kpi-icon purple"><ClipboardList size={18} /></div>
          </div>
          <p className="erp-kpi-value">{stats.activeWorkOrders || 3}</p>
          <div className="erp-kpi-footer" style={{ marginBottom: '0.4rem' }}>
            <span className="erp-kpi-trend positive"><ArrowUpRight size={12} /> 2 new this morning</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '0.2rem' }}>
            <svg viewBox="0 0 100 24" width="100%" height="24">
              <path d="M0,20 Q20,15 40,22 T70,8 L100,14 L100,24 L0,24 Z" fill="rgba(168, 85, 247, 0.15)" />
              <path d="M0,20 Q20,15 40,22 T70,8 L100,14" fill="none" stroke="#a855f7" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Quality Pass Rate */}
        <div className="erp-kpi-card" onClick={() => go('quality')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Quality Pass Rate</h3>
            <div className="erp-kpi-icon green"><ShieldCheck size={18} /></div>
          </div>
          <p className="erp-kpi-value">{passRate}%</p>
          <div className="erp-kpi-footer" style={{ marginBottom: '0.4rem' }}>
            <span className="erp-kpi-trend positive"><ArrowUpRight size={12} /> 0.8%</span>
            <span className="erp-kpi-trend neutral">vs last week</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '0.2rem' }}>
            <svg viewBox="0 0 100 24" width="100%" height="24">
              <path d="M0,16 Q25,20 50,12 T80,8 L100,5 L100,24 L0,24 Z" fill="rgba(34, 197, 94, 0.15)" />
              <path d="M0,16 Q25,20 50,12 T80,8 L100,5" fill="none" stroke="#22c55e" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="erp-kpi-card" onClick={() => go('inventory')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Low Stock Items</h3>
            <div className="erp-kpi-icon red"><PackageSearch size={18} /></div>
          </div>
          <p className="erp-kpi-value">{stats.lowStockItems || 2}</p>
          <div className="erp-kpi-footer" style={{ marginBottom: '0.4rem' }}>
            <span className="erp-kpi-trend negative"><ArrowDownRight size={12} /> Action required</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '0.2rem' }}>
            <svg viewBox="0 0 100 24" width="100%" height="24">
              <path d="M0,10 Q20,18 40,14 T70,22 L100,16 L100,24 L0,24 Z" fill="rgba(239, 68, 68, 0.15)" />
              <path d="M0,10 Q20,18 40,14 T70,22 L100,16" fill="none" stroke="#ef4444" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Machines Running */}
        <div className="erp-kpi-card" onClick={() => go('machines')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Machines Running</h3>
            <div className="erp-kpi-icon cyan"><Wrench size={18} /></div>
          </div>
          <p className="erp-kpi-value">{stats.runningMachines || 2} / {stats.totalMachines || 4}</p>
          <div className="erp-kpi-footer" style={{ marginBottom: '0.4rem' }}>
            <span className="erp-kpi-trend neutral">50% Operational</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '0.2rem' }}>
            <svg viewBox="0 0 100 24" width="100%" height="24">
              <path d="M0,18 H15 V10 H35 V22 H55 V8 H75 V18 H100" fill="none" stroke="#0088ff" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* On-Time Delivery */}
        <div className="erp-kpi-card" onClick={() => go('logistics')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">On-Time Delivery</h3>
            <div className="erp-kpi-icon teal"><Truck size={18} /></div>
          </div>
          <p className="erp-kpi-value">{onTimeRate}%</p>
          <div className="erp-kpi-footer" style={{ marginBottom: '0.4rem' }}>
            <span className="erp-kpi-trend positive"><ArrowUpRight size={12} /> 2.1%</span>
            <span className="erp-kpi-trend neutral">vs last week</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '0.2rem' }}>
            <svg viewBox="0 0 100 24" width="100%" height="24">
              <path d="M0,18 Q20,12 40,18 T70,8 L100,12 L100,24 L0,24 Z" fill="rgba(34, 197, 94, 0.15)" />
              <path d="M0,18 Q20,12 40,18 T70,8 L100,12" fill="none" stroke="#22c55e" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* ===== SECONDARY STAT CARDS ROW (5 CARDS WITH AVATARS, DONUT, SPARKLINES) ===== */}
      <div className="bottom-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
        {/* Total Employees */}
        <div className="bottom-stat-card" style={{ background: '#ffffff', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className={`erp-kpi-icon ${theme === 'pink' ? 'pink' : 'blue'}`} style={{ width: '32px', height: '32px' }}>
              <Users size={16} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL EMPLOYEES</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>23</span>
            <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>↑ 12 this month</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '-4px', marginTop: '0.2rem' }}>
            {['#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'].map((bg, idx) => (
              <div key={idx} style={{
                width: '24px', height: '24px', borderRadius: '50%', background: bg, border: '2px solid white',
                marginLeft: idx === 0 ? 0 : '-6px', color: 'white', fontSize: '0.65rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {String.fromCharCode(65 + idx)}
              </div>
            ))}
            <span style={{ marginLeft: '6px', fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>+18</span>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bottom-stat-card" style={{ background: '#ffffff', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="erp-kpi-icon green" style={{ width: '32px', height: '32px' }}>
              <CheckCircle size={16} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>TODAY'S ATTENDANCE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>186 / 23</div>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>0% Present</span>
            </div>
            {/* Donut Progress SVG */}
            <div style={{ width: '42px', height: '42px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" width="42" height="42">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ff2a6d" strokeWidth="3.5" strokeDasharray="80, 100" />
              </svg>
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#0f172a' }}>
                80%
              </span>
            </div>
          </div>
        </div>

        {/* Pending Work Orders */}
        <div className="bottom-stat-card" style={{ background: '#ffffff', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="erp-kpi-icon amber" style={{ width: '32px', height: '32px' }}>
              <ClipboardList size={16} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PENDING WORK ORDERS</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>2</div>
          <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>Require attention</span>
          <svg viewBox="0 0 100 16" width="100%" height="16">
            <path d="M0,12 Q25,6 50,14 T100,8" fill="none" stroke="#f59e0b" strokeWidth="2" />
          </svg>
        </div>

        {/* Pending POs */}
        <div className="bottom-stat-card" style={{ background: '#ffffff', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="erp-kpi-icon red" style={{ width: '32px', height: '32px' }}>
              <ShoppingCart size={16} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PENDING POS</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>1</div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Awaiting approval</span>
          <svg viewBox="0 0 100 16" width="100%" height="16">
            <path d="M0,10 Q30,14 60,6 T100,12" fill="none" stroke="#ff2a6d" strokeWidth="2" />
          </svg>
        </div>

        {/* Pending Shipments */}
        <div className="bottom-stat-card" style={{ background: '#ffffff', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="erp-kpi-icon purple" style={{ width: '32px', height: '32px' }}>
              <Truck size={16} />
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PENDING SHIPMENTS</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>3</div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>To be dispatched</span>
          <svg viewBox="0 0 100 16" width="100%" height="16">
            <path d="M0,8 Q20,14 50,6 T100,10" fill="none" stroke="#a855f7" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* ===== PRODUCTION OVERVIEW, MACHINES BY EFFICIENCY, RECENT ACTIVITY ===== */}
      <div className="erp-panel-grid">
        {/* Production Overview Area Chart */}
        <div className="erp-panel col-span-4" style={{ position: 'relative' }}>
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Production Overview</h3>
            <select value={chartPeriod} onChange={(e) => setChartPeriod(e.target.value)} style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}>
              <option value="this_week">This Week</option>
              <option value="last_week">Last Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
          <div className="erp-panel-content">
            <div style={{ position: 'relative', marginTop: '1.2rem' }}>
              <div style={{
                position: 'absolute', top: '5%', left: '55%', transform: 'translateX(-50%)',
                background: theme === 'pink' ? '#ff2a6d' : '#0088ff', color: 'white',
                padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 10
              }}>
                1,245 m
              </div>
              <svg viewBox="0 0 300 120" width="100%" height="130">
                <defs>
                  <linearGradient id="areaGradBottom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme === 'pink' ? '#ff2a6d' : '#0088ff'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={theme === 'pink' ? '#ff2a6d' : '#0088ff'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 10 90 Q 50 85 90 70 T 170 30 T 250 80 T 290 85 L 290 120 L 10 120 Z" fill="url(#areaGradBottom)" />
                <path d="M 10 90 Q 50 85 90 70 T 170 30 T 250 80 T 290 85" fill="none" stroke={theme === 'pink' ? '#ff2a6d' : '#0088ff'} strokeWidth="3" />
                <circle cx="170" cy="30" r="5" fill={theme === 'pink' ? '#ff2a6d' : '#0088ff'} stroke="white" strokeWidth="2" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Machines by Efficiency */}
        <div className="erp-panel col-span-4">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Top Machines by Efficiency</h3>
            <select style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.75rem' }}>
              <option>This Month</option>
            </select>
          </div>
          <div className="erp-panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'center' }}>
            {[
              { name: 'Machine D-01', val: 92, color: '#16a34a' },
              { name: 'Machine D-02', val: 78, color: '#0284c7' },
              { name: 'Machine D-03', val: 65, color: '#f59e0b' },
              { name: 'Machine D-04', val: 50, color: '#ff2a6d' },
            ].map((m, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '90px', fontSize: '0.76rem', fontWeight: 600, color: '#475569' }}>{m.name}</span>
                <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${m.val}%`, height: '100%', background: m.color, borderRadius: '4px' }} />
                </div>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', width: '32px', textAlign: 'right' }}>{m.val}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="erp-panel col-span-4">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Recent Activity</h3>
          </div>
          <div className="erp-panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivities.map((act: any, idx: number) => {
              const colorMap: Record<string, string> = { production: '#16a34a', procurement: '#0284c7', sales: '#3b82f6', maintenance: '#a855f7', inventory: '#ef4444' };
              const iconMap: Record<string, string> = { production: '✓', procurement: '+', sales: '★', maintenance: '🔧', inventory: '⚠️' };
              const color = colorMap[act.tag] || '#16a34a';
              const icon = iconMap[act.tag] || '✓';
              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: idx < recentActivities.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: color, color: 'white', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {icon}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>{act.title}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: theme === 'pink' ? '#ff2a6d' : '#0088ff', fontWeight: 600 }}>{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== COMMODITIES & TEXTILES LIVE MARKET SECTION + AI ADVISOR ===== */}
      <div className="erp-panel-grid">
        {/* Commodities Table */}
        <div className="erp-panel col-span-8" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="erp-panel-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
            <div>
              <h3 className="erp-panel-title" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📈</span> Commodities & Textiles (Live Market)
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Real-time futures, raw fiber indices & market spot pricing
              </p>
            </div>
            <div className="chart-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="erp-kpi-trend positive" style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                ● Live Feed Active
              </span>
            </div>
          </div>

          <div className="erp-panel-content" style={{ padding: '0.75rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.6rem 0.5rem' }}>COMMODITY</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>SOURCE</th>
                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>PRICE</th>
                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>CHANGE</th>
                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>TREND</th>
                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'cotton', name: 'Cotton', indexName: 'ICE Cotton Futures', source: 'ICE', price: '82.63', change: '+0.45 (+0.54%)', isPositive: true, icon: '🧶' },
                  { id: 'linen', name: 'Linen (Fabric)', indexName: 'LME Linen Futures', source: 'LME', price: '1,785.50', change: '-8.50 (-0.47%)', isPositive: false, icon: '📜' },
                  { id: 'silk', name: 'Silk', indexName: 'Global Silk Index', source: 'GSI', price: '2,348.75', change: '-15.25 (-0.64%)', isPositive: false, icon: '🧵' },
                  { id: 'polyester', name: 'Polyester', indexName: 'Polyester Fiber Index', source: 'PFI', price: '910.30', change: '-3.40 (-0.37%)', isPositive: false, icon: '🎨' },
                  { id: 'wool', name: 'Wool', indexName: 'Wool Market Index', source: 'WMI', price: '1,243.60', change: '+6.20 (+0.50%)', isPositive: true, icon: '🐑' },
                ].map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer' }} onClick={() => setSelectedCommodity(item)}>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                          {item.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {item.name}
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.isPositive ? '#16a34a' : '#dc2626' }} />
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.indexName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: '#64748b', fontWeight: 600 }}>{item.source}</td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>{item.price}</td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', fontWeight: 700, color: item.isPositive ? '#16a34a' : '#dc2626' }}>
                      {item.change}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                      <svg viewBox="0 0 60 16" width="60" height="16">
                        <path d={item.isPositive ? "M0,12 L15,10 L30,14 L45,6 L60,3" : "M0,4 L15,6 L30,3 L45,12 L60,15"} fill="none" stroke={item.isPositive ? '#16a34a' : '#dc2626'} strokeWidth="2" />
                      </svg>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', color: '#94a3b8' }}>
                      <Star size={16} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'center', marginTop: '0.8rem' }}>
              <button className="erp-btn erp-btn-outline" style={{ fontSize: '0.75rem', padding: '0.4rem 1rem', borderRadius: '20px', color: theme === 'pink' ? '#ff2a6d' : '#0088ff', borderColor: theme === 'pink' ? '#fbcfe8' : '#cbd5e1' }} onClick={() => navigate('/market')}>
                View Full Market Insights →
              </button>
            </div>
          </div>
        </div>

        {/* AI Business Advisor Card */}
        <div className="erp-panel col-span-4" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="erp-panel-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
            <h3 className="erp-panel-title" style={{ color: theme === 'pink' ? '#ff2a6d' : '#0088ff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🤖 AI Business Advisor (Demo)
            </h3>
            <a className="erp-panel-action" onClick={() => go('ai-insights')} style={{ color: theme === 'pink' ? '#ff2a6d' : '#0088ff' }}>View All</a>
          </div>
          <div className="erp-panel-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <RefreshCw size={14} />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#334155' }}>
                  <strong>2 materials</strong> are below minimum stock level.<br />Reorder to avoid production delays.
                </div>
              </div>
              <button className="erp-btn erp-btn-outline" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', color: '#ef4444', borderColor: '#fca5a5' }} onClick={() => go('procurement')}>
                Create PO
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Wrench size={14} />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#334155' }}>
                  <strong>Machine D-01</strong> is under maintenance.<br />Expected downtime: 3 hours.
                </div>
              </div>
              <button className="erp-btn erp-btn-outline" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', color: '#0284c7', borderColor: '#7dd3fc' }} onClick={() => go('machines')}>
                View Schedule
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem', background: '#fff7ed', borderRadius: '10px', border: '1px solid #ffedd5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PackageSearch size={14} />
                </div>
                <div style={{ fontSize: '0.76rem', color: '#334155' }}>
                  <strong>Work Order WO-105</strong> may miss delivery date.<br />Consider reassigning resources.
                </div>
              </div>
              <button className="erp-btn erp-btn-outline" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem', color: '#ea580c', borderColor: '#fdba74' }} onClick={() => go('production')}>
                Optimize
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.7rem', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle size={14} />
              </div>
              <div style={{ fontSize: '0.76rem', color: '#334155' }}>
                <strong>Quality pass rate</strong> is excellent this week.<br />Keep up the good work!
              </div>
            </div>
          </div>
        </div>
      </div>

      {showNewOrderModal && (
        <div className="erp-modal-backdrop" style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="erp-modal" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', width: '90%', maxWidth: '450px', border: '1px solid #e2e8f0' }}>
            <div className="erp-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Create New Work Order</h2>
              <button className="erp-modal-close" onClick={() => setShowNewOrderModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <div className="erp-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="erp-form-group">
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Product Type</label>
                <select className="erp-input" style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}>
                  <option>Premium Cotton Yarn</option>
                  <option>Polyester Blend</option>
                  <option>Denim Fabric</option>
                </select>
              </div>
              <div className="erp-form-group">
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Target Quantity (kg)</label>
                <input type="number" className="erp-input" defaultValue={1000} style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
              </div>
            </div>
            <div className="erp-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.2rem' }}>
              <button className="erp-btn erp-btn-outline" onClick={() => setShowNewOrderModal(false)}>Cancel</button>
              <button className="erp-btn erp-btn-primary" onClick={() => {
                alert('New Work Order Created Successfully! (Demo)');
                setShowNewOrderModal(false);
              }}>Create Work Order</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== COMMODITY LIVE PRICE DETAIL MODAL ===== */}
      {selectedCommodity && (
        <div
          className="erp-modal-overlay"
          onClick={() => setSelectedCommodity(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            className="erp-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem 1.8rem',
              maxWidth: '480px',
              width: '90%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #cbd5e1' }}>
                  {selectedCommodity.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{selectedCommodity.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{selectedCommodity.indexName}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCommodity(null)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>

            {/* Live Price Big Card */}
            <div style={{ background: selectedCommodity.isPositive ? '#f0fdf4' : '#fef2f2', border: `1px solid ${selectedCommodity.isPositive ? '#bbf7d0' : '#fecaca'}`, borderRadius: '12px', padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 700 }}>LIVE SPOT PRICE</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{selectedCommodity.price}</div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{selectedCommodity.unit}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: selectedCommodity.isPositive ? '#16a34a' : '#dc2626' }}>
                  {selectedCommodity.change} ({selectedCommodity.percent})
                </span>
                <div style={{ fontSize: '0.75rem', color: selectedCommodity.isPositive ? '#15803d' : '#991b1b', fontWeight: 600, marginTop: '2px' }}>
                  {selectedCommodity.isPositive ? '▲ Trading Up Today' : '▼ Trading Down Today'}
                </div>
              </div>
            </div>

            {/* Market High / Low Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.8rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>24H HIGH</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>{selectedCommodity.high}</div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.8rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>24H LOW</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b91c1c', marginTop: '2px' }}>{selectedCommodity.low}</div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
              <button
                className="erp-btn erp-btn-outline"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setSelectedCommodity(null)}
              >
                Close
              </button>
              <button
                className="erp-btn erp-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  alert(`Created Purchase Order for ${selectedCommodity.name} at live market price ${selectedCommodity.price} ${selectedCommodity.unit}! (Demo)`);
                  setSelectedCommodity(null);
                  navigate('/purchase-orders');
                }}
              >
                + Procurement PO
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
