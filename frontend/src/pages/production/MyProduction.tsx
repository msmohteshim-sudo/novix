import React, { useState } from 'react';
import {
  Factory, CheckCircle2, Plus, Search,
  TrendingUp, ShieldCheck, Send,
  BarChart3
} from 'lucide-react';
import '../dashboard/dashboard.css';

interface AssignedWorkOrder {
  id: string;
  workOrderId: string;
  customerName: string;
  product: string;
  targetQty: number;
  producedQty: number;
  unit: string;
  machineId: string;
  machineName: string;
  status: 'In Progress' | 'Completed' | 'Pending';
  priority: 'High' | 'Normal';
  startDate: string;
}

interface HourlyLog {
  id: string;
  timeSlot: string;
  workOrderId: string;
  machineId: string;
  product: string;
  producedMeters: number;
  targetMeters: number;
  efficiency: number;
  defects: number;
  notes: string;
}

const INITIAL_WORK_ORDERS: AssignedWorkOrder[] = [
  {
    id: 'wo-1',
    workOrderId: 'WO-102',
    customerName: 'Urban Threads Pvt Ltd',
    product: 'Cotton Premium Fabric (Grade A)',
    targetQty: 2500,
    producedQty: 1850,
    unit: 'm',
    machineId: 'M-01',
    machineName: 'Weaving Loom M-01',
    status: 'In Progress',
    priority: 'High',
    startDate: '2026-08-15'
  },
  {
    id: 'wo-2',
    workOrderId: 'WO-105',
    customerName: 'Mumbai Fashion House',
    product: 'Heavy Denim Fabric (14 oz)',
    targetQty: 5000,
    producedQty: 3450,
    unit: 'm',
    machineId: 'M-02',
    machineName: 'Weaving Loom M-02',
    status: 'In Progress',
    priority: 'Normal',
    startDate: '2026-08-16'
  },
  {
    id: 'wo-3',
    workOrderId: 'WO-108',
    customerName: 'Royal Garments',
    product: 'Polyester Blend Grey Fabric',
    targetQty: 1500,
    producedQty: 1500,
    unit: 'm',
    machineId: 'S-01',
    machineName: 'Spinning Machine S-01',
    status: 'Completed',
    priority: 'Normal',
    startDate: '2026-08-14'
  }
];

const INITIAL_HOURLY_LOGS: HourlyLog[] = [
  { id: 'hl-1', timeSlot: '08:00 AM - 09:00 AM', workOrderId: 'WO-102', machineId: 'M-01', product: 'Cotton Premium', producedMeters: 420, targetMeters: 400, efficiency: 105, defects: 3, notes: 'Smooth start, warp tension optimal' },
  { id: 'hl-2', timeSlot: '09:00 AM - 10:00 AM', workOrderId: 'WO-102', machineId: 'M-01', product: 'Cotton Premium', producedMeters: 410, targetMeters: 400, efficiency: 102, defects: 2, notes: 'Standard speed running' },
  { id: 'hl-3', timeSlot: '10:00 AM - 11:00 AM', workOrderId: 'WO-105', machineId: 'M-02', product: 'Heavy Denim', producedMeters: 380, targetMeters: 400, efficiency: 95, defects: 5, notes: 'Minor weft thread breakage resolved' },
  { id: 'hl-4', timeSlot: '11:00 AM - 12:00 PM', workOrderId: 'WO-105', machineId: 'M-02', product: 'Heavy Denim', producedMeters: 430, targetMeters: 400, efficiency: 107, defects: 1, notes: 'High efficiency post-tea break' },
  { id: 'hl-5', timeSlot: '01:00 PM - 02:00 PM', workOrderId: 'WO-102', machineId: 'M-01', product: 'Cotton Premium', producedMeters: 390, targetMeters: 400, efficiency: 97, defects: 4, notes: 'Bobbin replacement completed' },
  { id: 'hl-6', timeSlot: '02:00 PM - 03:00 PM', workOrderId: 'WO-105', machineId: 'M-02', product: 'Heavy Denim', producedMeters: 420, targetMeters: 400, efficiency: 105, defects: 2, notes: 'Optimal loom speed' }
];

export const MyProduction: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<AssignedWorkOrder[]>(INITIAL_WORK_ORDERS);
  const [hourlyLogs, setHourlyLogs] = useState<HourlyLog[]>(INITIAL_HOURLY_LOGS);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const [selectedWoId, setSelectedWoId] = useState<string>('WO-102');
  const [addedMeters, setAddedMeters] = useState<number>(100);
  const [defectMeters, setDefectMeters] = useState<number>(0);
  const [logNotes, setLogNotes] = useState<string>('');
  const [logSuccessMsg, setLogSuccessMsg] = useState<string>('');

  // Quick Production increment (+100m, +250m)
  const handleQuickAdd = (workOrderId: string, meters: number) => {
    setWorkOrders(prev => prev.map(wo => {
      if (wo.workOrderId !== workOrderId) return wo;
      const newProduced = Math.min(wo.targetQty, wo.producedQty + meters);
      const isCompleted = newProduced >= wo.targetQty;
      return {
        ...wo,
        producedQty: newProduced,
        status: isCompleted ? 'Completed' : 'In Progress'
      };
    }));

    // Add log entry
    const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const targetWO = workOrders.find(w => w.workOrderId === workOrderId);

    const newLog: HourlyLog = {
      id: `hl_${Date.now()}`,
      timeSlot: `${nowTime} (Manual Entry)`,
      workOrderId,
      machineId: targetWO?.machineId || 'M-01',
      product: targetWO?.product || 'Textile Fabric',
      producedMeters: meters,
      targetMeters: meters,
      efficiency: 100,
      defects: 0,
      notes: `Quick added +${meters}m output`
    };

    setHourlyLogs([newLog, ...hourlyLogs]);
  };

  // Submit Modal Production Log
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(addedMeters);
    if (isNaN(qty) || qty <= 0) return;

    handleQuickAdd(selectedWoId, qty);
    setLogSuccessMsg(`Logged +${qty}m production for ${selectedWoId}!`);

    setTimeout(() => {
      setShowLogModal(false);
      setLogSuccessMsg('');
      setAddedMeters(100);
      setDefectMeters(0);
      setLogNotes('');
    }, 1200);
  };

  // Metrics Calculations
  const totalMetersToday = hourlyLogs.reduce((sum, l) => sum + l.producedMeters, 0);
  const totalTargetToday = 3000;
  const targetCompletionPct = Math.min(100, Math.round((totalMetersToday / totalTargetToday) * 100));
  const activeWOs = workOrders.filter(w => w.status === 'In Progress').length;
  const avgEfficiency = Math.round(hourlyLogs.reduce((sum, l) => sum + l.efficiency, 0) / (hourlyLogs.length || 1));
  const totalDefects = hourlyLogs.reduce((sum, l) => sum + l.defects, 0);

  // Filtered Hourly Logs
  const filteredLogs = hourlyLogs.filter(l => 
    l.workOrderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.machineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="erp-dashboard">
      {/* Header Banner */}
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Factory size={28} color="#0284c7" />
            My Production & Shift Output Log
          </h1>
          <p className="erp-page-subtitle">Monitor assigned weaving orders, log hourly meterage output, and track shift efficiency</p>
        </div>
        <div className="erp-header-actions">
          <button
            className="erp-btn erp-btn-primary"
            onClick={() => setShowLogModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}
          >
            <Plus size={18} /> Log Production Output
          </button>
        </div>
      </div>

      {/* Production KPI Cards */}
      <div className="erp-panel" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
        <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>Total Output Today</span>
            <Factory size={20} color="#38bdf8" />
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '2.2rem', fontWeight: 800 }}>{totalMetersToday.toLocaleString()} <span style={{ fontSize: '1rem' }}>m</span></h2>
          <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '4px' }}>Target: {totalTargetToday.toLocaleString()} m ({targetCompletionPct}%)</div>
        </div>

        <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>Shift Efficiency</span>
            <TrendingUp size={20} color="#6ee7b7" />
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '2.2rem', fontWeight: 800 }}>{avgEfficiency}%</h2>
          <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '4px' }}>Optimal Target &gt; 90%</div>
        </div>

        <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', color: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>Active Work Orders</span>
            <BarChart3 size={20} color="#c084fc" />
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '2.2rem', fontWeight: 800 }}>{activeWOs} <span style={{ fontSize: '1rem' }}>assigned</span></h2>
          <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '4px' }}>Weaving & Spinning looms</div>
        </div>

        <div style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', color: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(234, 88, 12) 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.9 }}>Defect Count</span>
            <ShieldCheck size={20} color="#fdba74" />
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '2.2rem', fontWeight: 800 }}>{totalDefects} <span style={{ fontSize: '1rem' }}>m</span></h2>
          <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '4px' }}>Scrap Rate: 1.2% (Low)</div>
        </div>
      </div>

      {/* Assigned Work Orders Cards */}
      <div className="erp-panel" style={{ marginBottom: '1.5rem' }}>
        <div className="erp-panel-header">
          <h3 className="erp-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Factory size={18} color="#0284c7" />
            My Assigned Work Orders
          </h3>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Click +100m or +250m to log real-time production meterage</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', padding: '1.25rem' }}>
          {workOrders.map((wo) => {
            const pct = Math.min(100, Math.round((wo.producedQty / wo.targetQty) * 100));

            return (
              <div key={wo.id} style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#0284c7', fontSize: '1rem' }}>{wo.workOrderId}</span>
                    <span style={{
                      backgroundColor: wo.status === 'Completed' ? '#dcfce7' : '#e0f2fe',
                      color: wo.status === 'Completed' ? '#166534' : '#0369a1',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {wo.status}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', color: '#0f172a', fontWeight: 700 }}>
                    {wo.product}
                  </h4>

                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '12px' }}>
                    Customer: <strong>{wo.customerName}</strong> | Machine: <strong>{wo.machineName}</strong>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      <span>Production Progress</span>
                      <span>{wo.producedQty.toLocaleString()} / {wo.targetQty.toLocaleString()} {wo.unit} ({pct}%)</span>
                    </div>

                    <div style={{ width: '100%', height: '8px', backgroundColor: '#cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: pct >= 100 ? '#10b981' : '#0284c7', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                </div>

                {/* Quick Add Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <button
                    className="erp-btn erp-btn-outline"
                    onClick={() => handleQuickAdd(wo.workOrderId, 100)}
                    disabled={wo.status === 'Completed'}
                    style={{ flex: 1, fontSize: '0.78rem', padding: '6px' }}
                  >
                    +100m Log
                  </button>

                  <button
                    className="erp-btn erp-btn-outline"
                    onClick={() => handleQuickAdd(wo.workOrderId, 250)}
                    disabled={wo.status === 'Completed'}
                    style={{ flex: 1, fontSize: '0.78rem', padding: '6px' }}
                  >
                    +250m Log
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Shift Output Log Table */}
      <div className="erp-panel">
        <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 className="erp-panel-title">Hourly Shift Production Log</h3>
            <p className="erp-panel-subtitle">Real-time meterage output logs recorded during current shift</p>
          </div>

          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="erp-input"
              placeholder="Search WO, machine or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '34px' }}
            />
          </div>
        </div>

        <div className="erp-table-container">
          <table className="erp-table" style={{ borderSpacing: '0 8px', borderCollapse: 'separate' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '14px' }}>Time Slot</th>
                <th style={{ padding: '14px' }}>Work Order</th>
                <th style={{ padding: '14px' }}>Machine</th>
                <th style={{ padding: '14px' }}>Fabric Product</th>
                <th style={{ padding: '14px' }}>Produced Output</th>
                <th style={{ padding: '14px' }}>Hourly Target</th>
                <th style={{ padding: '14px' }}>Efficiency</th>
                <th style={{ padding: '14px' }}>Defects</th>
                <th style={{ padding: '14px' }}>Shift Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: '#0f172a' }}>{log.timeSlot}</td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#0284c7' }}>{log.workOrderId}</td>
                    <td style={{ padding: '14px', color: '#475569', fontWeight: 600 }}>{log.machineId}</td>
                    <td style={{ padding: '14px', color: '#334155', fontWeight: 500 }}>{log.product}</td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#059669' }}>{log.producedMeters} m</td>
                    <td style={{ padding: '14px', color: '#64748b' }}>{log.targetMeters} m</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        backgroundColor: log.efficiency >= 100 ? '#dcfce7' : '#fef3c7',
                        color: log.efficiency >= 100 ? '#166534' : '#b45309',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700
                      }}>
                        {log.efficiency}%
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: log.defects > 3 ? '#dc2626' : '#64748b', fontWeight: log.defects > 3 ? 700 : 500 }}>
                      {log.defects} m
                    </td>
                    <td style={{ padding: '14px', fontSize: '0.85rem', color: '#64748b' }}>{log.notes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <Factory size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                    <p>No production logs found matching your search term.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG PRODUCTION MODAL */}
      {showLogModal && (
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
            width: '480px',
            maxWidth: '92%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.4rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={22} color="#0284c7" /> Log Production Meterage Output
            </h2>

            {logSuccessMsg ? (
              <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} /> {logSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleModalSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Select Work Order</label>
                  <select
                    className="erp-input"
                    value={selectedWoId}
                    onChange={(e) => setSelectedWoId(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {workOrders.map(w => (
                      <option key={w.workOrderId} value={w.workOrderId}>
                        {w.workOrderId} - {w.product} ({w.machineName})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Produced Output (m) *</label>
                    <input
                      type="number"
                      className="erp-input"
                      value={addedMeters}
                      onChange={(e) => setAddedMeters(Number(e.target.value))}
                      style={{ width: '100%' }}
                      min={10}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Defects / Scrap (m)</label>
                    <input
                      type="number"
                      className="erp-input"
                      value={defectMeters}
                      onChange={(e) => setDefectMeters(Number(e.target.value))}
                      style={{ width: '100%' }}
                      min={0}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>Shift Notes / Observations</label>
                  <textarea
                    className="erp-input"
                    rows={3}
                    placeholder="Note loom speed, yarn lot quality or adjustments..."
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="erp-btn erp-btn-outline" onClick={() => setShowLogModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="erp-btn erp-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={16} /> Log Production
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
