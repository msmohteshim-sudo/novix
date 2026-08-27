import React, { useEffect, useState } from 'react';
import { Package, Plus, Search, Edit2 } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_FEED_STOCKS = [
  { id: 'fs-1', stockId: 'FS-001', feedType: 'Broiler Starter Crumbles', brand: 'Godrej Agrovet', currentStock: 4500, unit: 'kg', reorderLevel: 1000, costPerKg: 38, supplier: 'Maharashtra Feeds Ltd', warehouseLocation: 'Godown A-1', status: 'Healthy' },
  { id: 'fs-2', stockId: 'FS-002', feedType: 'Broiler Finisher Pellets', brand: 'Suguna Feeds', currentStock: 850, unit: 'kg', reorderLevel: 1500, costPerKg: 36, supplier: 'Suguna Foods Pvt Ltd', warehouseLocation: 'Godown A-2', status: 'Low' },
  { id: 'fs-3', stockId: 'FS-003', feedType: 'Layer Mash Phase 1', brand: 'Jubilee Feeds', currentStock: 6200, unit: 'kg', reorderLevel: 2000, costPerKg: 32, supplier: 'Deccan Agro Traders', warehouseLocation: 'Godown B-1', status: 'Healthy' },
  { id: 'fs-4', stockId: 'FS-004', feedType: 'Pre-Starter Micro Crumbs', brand: 'Godrej Agrovet', currentStock: 300, unit: 'kg', reorderLevel: 500, costPerKg: 42, supplier: 'Maharashtra Feeds Ltd', warehouseLocation: 'Godown A-1', status: 'Critical' },
  { id: 'fs-5', stockId: 'FS-005', feedType: 'Layer Mash Phase 2 (Peak Lay)', brand: 'Jubilee Feeds', currentStock: 5400, unit: 'kg', reorderLevel: 1800, costPerKg: 34, supplier: 'Deccan Agro Traders', warehouseLocation: 'Godown B-2', status: 'Healthy' },
  { id: 'fs-6', stockId: 'FS-006', feedType: 'Breeder Male Concentrate', brand: 'Cargill Animal Nutrition', currentStock: 2100, unit: 'kg', reorderLevel: 800, costPerKg: 45, supplier: 'Cargill India', warehouseLocation: 'Godown C-1', status: 'Healthy' },
  { id: 'fs-7', stockId: 'FS-007', feedType: 'Calcite / Oyster Shell Grit', brand: 'Deccan Minerals', currentStock: 1200, unit: 'kg', reorderLevel: 600, costPerKg: 14, supplier: 'Deccan Minerals Corp', warehouseLocation: 'Godown B-2', status: 'Healthy' },
  { id: 'fs-8', stockId: 'FS-008', feedType: 'Broiler Grower Pellets', brand: 'Suguna Feeds', currentStock: 950, unit: 'kg', reorderLevel: 1200, costPerKg: 37, supplier: 'Suguna Foods Pvt Ltd', warehouseLocation: 'Godown A-2', status: 'Low' },
];

const EMPTY = { stockId: '', feedType: '', brand: '', currentStock: '', unit: 'kg', reorderLevel: '500', costPerKg: '', supplier: '', warehouseLocation: '', status: 'Healthy' };

export const FeedStock: React.FC = () => {
  const [stocks, setStocks] = useState<any[]>(SAMPLE_FEED_STOCKS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch(`${API}/feed-stock`, { headers: H() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setStocks(data);
      }
    } catch {} finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (s: any) => { setForm({ ...s, currentStock: String(s.currentStock), reorderLevel: String(s.reorderLevel), costPerKg: String(s.costPerKg) }); setEditing(s); setModal(true); };
  const close = () => setModal(false);

  const save = async () => {
    const curStock = Number(form.currentStock) || 0;
    const reorder = Number(form.reorderLevel) || 500;
    const status = curStock <= reorder ? (curStock <= reorder / 2 ? 'Critical' : 'Low') : 'Healthy';
    const body = { ...form, currentStock: curStock, reorderLevel: reorder, costPerKg: Number(form.costPerKg) || 0, status };

    if (editing) {
      setStocks(prev => prev.map(s => s.id === editing.id ? { ...s, ...body } : s));
      try {
        await fetch(`${API}/feed-stock/${editing.id}`, { method: 'PUT', headers: H(), body: JSON.stringify(body) });
      } catch {}
    } else {
      const newStock = { ...body, id: `fs-${Date.now()}` };
      setStocks(prev => [newStock, ...prev]);
      try {
        await fetch(`${API}/feed-stock`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
      } catch {}
    }
    close();
  };

  const safeStocks = Array.isArray(stocks) ? stocks : SAMPLE_FEED_STOCKS;

  const filtered = safeStocks.filter(s =>
    (s.feedType || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.brand || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.stockId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Feed Stock Inventory</h1>
          <p className="farm-page-subtitle">Monitor feed warehouse stocks, reorder alert thresholds, and feed costs</p>
        </div>
        <button className="pf-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }} onClick={openNew}>
          <Plus size={16} /> Add Feed Item
        </button>
      </div>

      <div className="farm-toolbar">
        <div className="farm-search-box">
          <Search size={16} color="#64748b" />
          <input
            className="farm-search-input"
            placeholder="Search feed type, brand, or Stock ID…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>Showing {filtered.length} feed item(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading feed inventory...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr>
                <th>Stock ID</th>
                <th>Feed Type</th>
                <th>Brand / Supplier</th>
                <th>Available Stock</th>
                <th>Reorder Level</th>
                <th>Cost / Kg</th>
                <th>Warehouse Location</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><div className="farm-empty"><Package size={32} className="farm-empty-icon" /><p>No feed stock items found.</p></div></td></tr>
              ) : filtered.map(s => {
                const isLow = s.currentStock <= s.reorderLevel;
                const isCritical = s.currentStock <= s.reorderLevel / 2;
                return (
                  <tr key={s.id}>
                    <td><span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 700 }}>{s.stockId}</span></td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{s.feedType}</td>
                    <td style={{ color: '#334155' }}>{s.brand || 'Generic'} &bull; <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.supplier || 'Main Feed Supplier'}</span></td>
                    <td style={{ fontWeight: 800, color: isCritical ? '#dc2626' : isLow ? '#d97706' : '#16a34a' }}>
                      {(s.currentStock || 0).toLocaleString('en-IN')} kg
                    </td>
                    <td style={{ color: '#475569', fontWeight: 600 }}>{(s.reorderLevel || 0).toLocaleString('en-IN')} kg</td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>₹{s.costPerKg || 0}</td>
                    <td style={{ color: '#475569' }}>{s.warehouseLocation || 'Warehouse 1'}</td>
                    <td>
                      <span className={`farm-status farm-status--${s.status?.toLowerCase() || (isCritical ? 'critical' : isLow ? 'low' : 'healthy')}`}>
                        {s.status || (isCritical ? 'Critical' : isLow ? 'Low' : 'Healthy')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="farm-btn--ghost" style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer' }} onClick={() => openEdit(s)}>
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="pf-modal-backdrop" onClick={close}>
          <div className="pf-modal" onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3 className="pf-modal-title">{editing ? 'Edit Feed Stock Item' : 'Add New Feed Item'}</h3>
              <button className="pf-modal-close" onClick={close}>&times;</button>
            </div>
            <div className="pf-form-grid">
              <div className="pf-field"><label className="pf-label">Stock ID *</label>
                <input className="pf-input" placeholder="FS-001" value={form.stockId} onChange={e => setForm({...form, stockId: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Feed Type *</label>
                <input className="pf-input" placeholder="Broiler Starter Crumbles" value={form.feedType} onChange={e => setForm({...form, feedType: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Brand</label>
                <input className="pf-input" placeholder="Godrej Agrovet" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Current Stock (kg)</label>
                <input className="pf-input" type="number" value={form.currentStock} onChange={e => setForm({...form, currentStock: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Reorder Threshold (kg)</label>
                <input className="pf-input" type="number" value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Cost per Kg (₹)</label>
                <input className="pf-input" type="number" value={form.costPerKg} onChange={e => setForm({...form, costPerKg: e.target.value})} /></div>
              <div className="pf-field pf-field--full"><label className="pf-label">Warehouse Location</label>
                <input className="pf-input" placeholder="Godown A-1" value={form.warehouseLocation} onChange={e => setForm({...form, warehouseLocation: e.target.value})} /></div>
            </div>
            <div className="pf-modal-footer">
              <button className="pf-btn-secondary" onClick={close}>Cancel</button>
              <button className="pf-btn-primary" onClick={save}>{editing ? 'Save Changes' : 'Add Item'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
