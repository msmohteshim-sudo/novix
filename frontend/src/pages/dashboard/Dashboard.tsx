import React, { useEffect, useState } from 'react';
import {
  Activity, ClipboardList, ShieldCheck, PackageSearch, Wrench, Truck,
  ArrowUpRight, ArrowDownRight, CheckCircle, Clock,
  Users, ShoppingCart, FileText, Plus, Download, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
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
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customMonth, setCustomMonth] = useState(''); // '' = full year, '01'-'12' = specific month
  const [customYear, setCustomYear] = useState(new Date().getFullYear());
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

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

  // Resolve chart: preset or custom
  const getActiveChart = () => {
    if (chartPeriod === 'custom') {
      if (customMonth) {
        return generateMonthChart(customYear, parseInt(customMonth));
      }
      return generateYearChart(customYear);
    }
    return chartDataSets[chartPeriod] || chartDataSets.this_week;
  };

  const currentChart = getActiveChart();

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
          <h1 className="erp-page-title">Executive Dashboard</h1>
          <p className="erp-page-subtitle">Welcome back, {user?.firstName || 'its nobody'}! Here's what's happening in your factory today.</p>
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

      {/* ===== 6 KPI CARDS ===== */}
      <div className="erp-kpi-grid">
        <div className="erp-kpi-card" onClick={() => go('production')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Production Today</h3>
            <div className="erp-kpi-icon blue"><Activity size={18} /></div>
          </div>
          <p className="erp-kpi-value">1,245 m</p>
          <div className="erp-kpi-footer">
            <span className="erp-kpi-trend positive"><ArrowUpRight size={12} /> 4.5%</span>
            <span className="erp-kpi-trend neutral">vs yesterday</span>
          </div>
        </div>

        <div className="erp-kpi-card" onClick={() => go('production')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Active Work Orders</h3>
            <div className="erp-kpi-icon purple"><ClipboardList size={18} /></div>
          </div>
          <p className="erp-kpi-value">{stats.activeWorkOrders || 12}</p>
          <div className="erp-kpi-footer">
            <span className="erp-kpi-trend positive"><ArrowUpRight size={12} /> 2 new this morning</span>
          </div>
        </div>

        <div className="erp-kpi-card" onClick={() => go('quality')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Quality Pass Rate</h3>
            <div className="erp-kpi-icon green"><ShieldCheck size={18} /></div>
          </div>
          <p className="erp-kpi-value">{passRate}%</p>
          <div className="erp-kpi-footer">
            <span className="erp-kpi-trend positive"><ArrowUpRight size={12} /> 0.8%</span>
            <span className="erp-kpi-trend neutral">vs last week</span>
          </div>
        </div>

        <div className="erp-kpi-card" onClick={() => go('inventory')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Low Stock Items</h3>
            <div className="erp-kpi-icon red"><PackageSearch size={18} /></div>
          </div>
          <p className="erp-kpi-value">{stats.lowStockItems || 5}</p>
          <div className="erp-kpi-footer">
            <span className="erp-kpi-trend negative"><ArrowDownRight size={12} /> Action required</span>
          </div>
        </div>

        <div className="erp-kpi-card" onClick={() => go('machines')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">Machines Running</h3>
            <div className="erp-kpi-icon cyan"><Wrench size={18} /></div>
          </div>
          <p className="erp-kpi-value">{stats.runningMachines} / {stats.totalMachines || 24}</p>
          <div className="erp-kpi-footer">
            <span className="erp-kpi-trend neutral">{stats.totalMachines > 0 ? Math.round((stats.runningMachines / stats.totalMachines) * 100) : 75}% Operational</span>
          </div>
        </div>

        <div className="erp-kpi-card" onClick={() => go('logistics')}>
          <div className="erp-kpi-header">
            <h3 className="erp-kpi-title">On-Time Delivery</h3>
            <div className="erp-kpi-icon teal"><Truck size={18} /></div>
          </div>
          <p className="erp-kpi-value">{onTimeRate}%</p>
          <div className="erp-kpi-footer">
            <span className="erp-kpi-trend positive"><ArrowUpRight size={12} /> 2.1%</span>
            <span className="erp-kpi-trend neutral">vs last week</span>
          </div>
        </div>
      </div>

      {/* ===== PRODUCTION CHART + AI ADVISOR ===== */}
      <div className="erp-panel-grid">
        <div className="erp-panel col-span-8">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">{currentChart.title}</h3>
            <div className="chart-controls">
              <select
                className="chart-period-select"
                value={chartPeriod}
                onChange={(e) => {
                  setChartPeriod(e.target.value);
                  if (e.target.value !== 'custom') setShowCustomPicker(false);
                }}
              >
                <option value="this_week">This Week</option>
                <option value="last_week">Last Week</option>
                <option value="this_month">This Month</option>
                <option value="three_months">3 Months</option>
                <option value="this_year">This Year</option>
                {chartPeriod === 'custom' && <option value="custom">Custom</option>}
              </select>
              <button
                className={`chart-custom-btn ${chartPeriod === 'custom' ? 'active' : ''}`}
                title="Select custom month / year"
                onClick={() => {
                  setShowCustomPicker((prev: boolean) => !prev);
                  if (chartPeriod !== 'custom') setChartPeriod('custom');
                }}
              >
                <Calendar size={14} />
                <span>Custom</span>
              </button>
            </div>
          </div>

          {/* Custom month/year picker row */}
          {showCustomPicker && (
            <div className="chart-custom-picker">
              <div className="chart-picker-group">
                <label className="chart-picker-label">Year</label>
                <div className="chart-picker-stepper">
                  <button onClick={() => setCustomYear((y: number) => y - 1)}>‹</button>
                  <span className="chart-picker-value">{customYear}</span>
                  <button onClick={() => setCustomYear((y: number) => y + 1)}>›</button>
                </div>
              </div>
              <div className="chart-picker-group">
                <label className="chart-picker-label">Month</label>
                <select
                  className="chart-period-select"
                  value={customMonth}
                  onChange={(e) => setCustomMonth(e.target.value)}
                >
                  <option value="">Full Year</option>
                  {monthNames.map((m, i) => (
                    <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                  ))}
                </select>
              </div>
              <button
                className="chart-picker-apply"
                onClick={() => setShowCustomPicker(false)}
              >
                Apply
              </button>
            </div>
          )}
          <div className="erp-panel-content">
            <div className="chart-legend">
              <div className="chart-legend-item"><div className="chart-legend-dot" style={{ background: '#bfdbfe' }} /> Planned (m)</div>
              <div className="chart-legend-item"><div className="chart-legend-dot" style={{ background: '#2563eb' }} /> Actual (m)</div>
              <div className="chart-legend-item"><div className="chart-legend-dot" style={{ background: '#10b981' }} /> Target (m)</div>
            </div>
            <div className="chart-container">
              <div className="chart-bars">
                {currentChart.data.map((d) => (
                  <div className="chart-day-group" key={d.label}>
                    <div className="chart-bars-wrapper">
                      {d.planned > 0 && (
                        <div className="chart-bar planned" style={{ height: `${(d.planned / currentChart.max) * 180}px` }} />
                      )}
                      {d.actual > 0 && (
                        <div className="chart-bar actual" style={{ height: `${(d.actual / currentChart.max) * 180}px` }}>
                          <span className="chart-value-label">{d.actual.toLocaleString()}</span>
                        </div>
                      )}
                      <div
                        className="chart-bar target"
                        style={{
                          height: `${(d.target / currentChart.max) * 180}px`,
                          opacity: d.actual === 0 ? 0.4 : 1,
                        }}
                      />
                      {d.actual === 0 && d.target > 0 && (
                        <span style={{ fontSize: '0.6rem', color: '#94a3b8', position: 'absolute', top: -16, whiteSpace: 'nowrap' }}>—</span>
                      )}
                    </div>
                    <span className="chart-day-label">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Business Advisor */}
        {role === 'Admin' && (
          <div className="erp-panel erp-ai-panel col-span-4">
            <div className="erp-panel-header">
              <h3 className="erp-panel-title erp-ai-title">AI Business Advisor (Demo)</h3>
              <a className="erp-panel-action" onClick={() => go('ai-insights')} style={{ cursor: 'pointer' }}>View All</a>
            </div>
            <div className="erp-panel-content">
              <div className="erp-ai-list">
                <div className="erp-ai-item">
                  <div className="erp-ai-dot warning" />
                  <div className="erp-ai-content">
                    <p><strong>{stats.lowStockItems || 5} materials</strong> are below minimum stock level.<br />Reorder to avoid production delays.</p>
                  </div>
                  <button className="erp-ai-action-btn" onClick={() => go('procurement')}>Create PO</button>
                </div>
                <div className="erp-ai-item">
                  <div className="erp-ai-dot info" />
                  <div className="erp-ai-content">
                    <p><strong>Machine D-01</strong> is under maintenance.<br />Expected downtime: 3 hours.</p>
                  </div>
                  <button className="erp-ai-action-btn" onClick={() => go('machines')}>View Schedule</button>
                </div>
                <div className="erp-ai-item">
                  <div className="erp-ai-dot danger" />
                  <div className="erp-ai-content">
                    <p><strong>Work Order WO-105</strong> may miss delivery date.<br />Consider reassigning resources.</p>
                  </div>
                  <button className="erp-ai-action-btn" onClick={() => go('production')}>Optimize</button>
                </div>
                <div className="erp-ai-item">
                  <div className="erp-ai-dot success" />
                  <div className="erp-ai-content">
                    <p><strong>Quality pass rate</strong> is excellent this week.<br />Keep up the good work!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {role === 'Manager' && (
          <div className="erp-panel col-span-4">
            <div className="erp-panel-header">
              <h3 className="erp-panel-title">Alerts & Notifications</h3>
            </div>
            <div className="erp-panel-content">
              <div className="erp-ai-list">
                <div className="erp-ai-item">
                  <div className="erp-ai-dot warning" />
                  <div className="erp-ai-content"><p><strong>{stats.lowStockItems}</strong> items are low on stock.</p></div>
                  <button className="erp-ai-action-btn" onClick={() => go('inventory')}>View</button>
                </div>
                <div className="erp-ai-item">
                  <div className="erp-ai-dot info" />
                  <div className="erp-ai-content"><p><strong>{stats.pendingWorkOrders}</strong> work orders pending approval.</p></div>
                  <button className="erp-ai-action-btn" onClick={() => go('production')}>Review</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MACHINE STATUS + INVENTORY SNAPSHOT + RECENT ACTIVITIES ===== */}
      <div className="erp-panel-grid">
        {/* Machine Status */}
        <div className="erp-panel col-span-4">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Machine Status</h3>
            <a className="erp-panel-action" onClick={() => go('machines')} style={{ cursor: 'pointer' }}>View All</a>
          </div>
          <div className="erp-panel-content" style={{ padding: 0 }}>
            <table className="dash-table">
              <tbody>
                {(stats.machines.length > 0 ? stats.machines.slice(0, 5) : [
                  { id: '1', name: 'Weaving Loom M-01', type: 'Weaving Loom', status: 'Running', oee: 82 },
                  { id: '2', name: 'Weaving Loom M-02', type: 'Weaving Loom', status: 'Idle', oee: 60 },
                  { id: '3', name: 'Dyeing Machine D-01', type: 'Dyeing Machine', status: 'Maintenance', oee: 0 },
                  { id: '4', name: 'Spinning Machine S-01', type: 'Spinning Machine', status: 'Running', oee: 78 },
                  { id: '5', name: 'Finishing Machine F-01', type: 'Finishing Machine', status: 'Running', oee: 85 },
                ]).map((m: any, idx: number) => (
                  <tr key={m.id || idx}>
                    <td>
                      <div className="machine-info">
                        <span className="machine-name">{m.name}</span>
                        <span className="machine-type">{m.type}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`erp-status-badge ${m.status.toLowerCase()}`}>{m.status}</span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'right' }}>
                      OEE {m.oee ?? Math.floor(Math.random() * 30 + 60)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Snapshot */}
        <div className="erp-panel col-span-4">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Inventory Snapshot</h3>
            <a className="erp-panel-action" onClick={() => go('inventory')} style={{ cursor: 'pointer' }}>View All</a>
          </div>
          <div className="erp-panel-content" style={{ padding: 0 }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Stock</th>
                  <th>Min. Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(stats.materials.length > 0 ? stats.materials.slice(0, 5) : [
                  { id: '1', name: 'Raw Cotton Grade A', currentStock: 12500, unit: 'kg', minStock: 5000, status: 'Healthy' },
                  { id: '2', name: 'Raw Cotton Grade B', currentStock: 8000, unit: 'kg', minStock: 4000, status: 'Healthy' },
                  { id: '3', name: 'Polyester Yarn', currentStock: 2500, unit: 'kg', minStock: 2000, status: 'Healthy' },
                  { id: '4', name: 'Reactive Dye Blue', currentStock: 120, unit: 'kg', minStock: 200, status: 'Low Stock' },
                  { id: '5', name: 'Reactive Dye Black', currentStock: 180, unit: 'kg', minStock: 200, status: 'Low Stock' },
                ]).map((m: any, idx: number) => {
                  const isLow = m.currentStock <= m.minStock;
                  return (
                    <tr key={m.id || idx}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{m.name}</td>
                      <td>{m.currentStock.toLocaleString()} {m.unit}</td>
                      <td>{m.minStock.toLocaleString()} {m.unit}</td>
                      <td>
                        <span className={`erp-status-badge ${isLow ? 'low-stock' : 'healthy'}`}>
                          {isLow ? 'Low Stock' : 'Healthy'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="erp-panel col-span-4">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Recent Activities</h3>
            <a className="erp-panel-action" style={{ cursor: 'pointer' }}>View All</a>
          </div>
          <div className="erp-panel-content">
            <div className="activity-list">
              {recentActivities.map((a, idx) => (
                <div className="activity-item" key={idx}>
                  <span className="activity-time">{a.time}</span>
                  <div className="activity-info">
                    <p className="activity-title">{a.title}</p>
                    <p className="activity-by">{a.by}</p>
                  </div>
                  <span className={`activity-tag ${a.tag}`}>{a.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== BOTTOM STATS BAR ===== */}
      <div className="bottom-stats-row">
        <div className="bottom-stat-card">
          <div className="bottom-stat-icon blue"><Users size={20} /></div>
          <div className="bottom-stat-info">
            <span className="bottom-stat-label">Total Employees</span>
            <span className="bottom-stat-value">{stats.totalEmployees || 236}</span>
            <span className="bottom-stat-sub">+ 12 this month</span>
          </div>
        </div>

        <div className="bottom-stat-card">
          <div className="bottom-stat-icon green"><CheckCircle size={20} /></div>
          <div className="bottom-stat-info">
            <span className="bottom-stat-label">Today's Attendance</span>
            <span className="bottom-stat-value">{stats.presentToday || 186} / {stats.totalEmployees || 236}</span>
            <span className="bottom-stat-sub">{stats.totalEmployees > 0 ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 79}% Present</span>
          </div>
        </div>

        <div className="bottom-stat-card">
          <div className="bottom-stat-icon amber"><ClipboardList size={20} /></div>
          <div className="bottom-stat-info">
            <span className="bottom-stat-label">Pending Work Orders</span>
            <span className="bottom-stat-value">{stats.pendingWorkOrders || 4}</span>
            <span className="bottom-stat-sub neutral">Require attention</span>
          </div>
        </div>

        <div className="bottom-stat-card">
          <div className="bottom-stat-icon red"><ShoppingCart size={20} /></div>
          <div className="bottom-stat-info">
            <span className="bottom-stat-label">Pending POs</span>
            <span className="bottom-stat-value">{stats.activePOs || 7}</span>
            <span className="bottom-stat-sub neutral">Awaiting approval</span>
          </div>
        </div>

        <div className="bottom-stat-card">
          <div className="bottom-stat-icon purple"><Truck size={20} /></div>
          <div className="bottom-stat-info">
            <span className="bottom-stat-label">Pending Shipments</span>
            <span className="bottom-stat-value">{stats.pendingShipments || 3}</span>
            <span className="bottom-stat-sub neutral">To be dispatched</span>
          </div>
        </div>
      </div>

      {showNewOrderModal && (
        <div className="erp-modal-backdrop">
          <div className="erp-modal">
            <div className="erp-modal-header">
              <h2>Create New Work Order</h2>
              <button className="erp-modal-close" onClick={() => setShowNewOrderModal(false)}>&times;</button>
            </div>
            <div className="erp-modal-body">
              <div className="erp-form-group">
                <label>Product Type</label>
                <select className="erp-input">
                  <option>Premium Cotton Yarn</option>
                  <option>Polyester Blend</option>
                  <option>Denim Fabric</option>
                </select>
              </div>
              <div className="erp-form-group">
                <label>Target Quantity (kg)</label>
                <input type="number" className="erp-input" defaultValue={1000} />
              </div>
              <div className="erp-form-group">
                <label>Deadline</label>
                <input type="date" className="erp-input" />
              </div>
            </div>
            <div className="erp-modal-footer">
              <button className="erp-btn erp-btn-outline" onClick={() => setShowNewOrderModal(false)}>Cancel</button>
              <button className="erp-btn erp-btn-primary" onClick={async () => {
                const newId = `WO-${1000 + Math.floor(Math.random() * 9000)}`;
                try {
                  await api.create('workOrder', { workOrderId: newId, quantity: 5000, status: 'Pending' });
                } catch (e) {
                  console.error(e);
                }
                
                setStats((prev: any) => ({
                  ...prev,
                  activeWorkOrders: prev.activeWorkOrders + 1,
                  workOrders: [{ workOrderId: newId, status: 'Pending' }, ...prev.workOrders],
                  dynamicActivities: [
                    { 
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }), 
                      title: `Work Order ${newId} created`, 
                      by: `By ${user?.firstName || 'Rahul'} (${role})`, 
                      tag: 'production' 
                    },
                    ...(prev.dynamicActivities || [])
                  ]
                }));
                alert(`Work Order ${newId} created successfully! (Demo)`);
                setShowNewOrderModal(false);
              }}>Create Work Order</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
