import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Search, Edit2 } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_SALES = [
  { id: 'so-1', soId: 'FSO-2026-001', customer: { name: 'Mumbai Poultry Wholesale Hub' }, productType: 'Live Birds', quantity: 4500, unit: 'kg', unitPrice: 110, totalAmount: 495000, orderDate: '2026-08-20', deliveryDate: '2026-08-22', orderStatus: 'Delivered', paymentStatus: 'Paid', notes: 'Broiler batch BR-2026-001 sale' },
  { id: 'so-2', soId: 'FSO-2026-002', customer: { name: 'Royal Egg Distributors' }, productType: 'Eggs', quantity: 1500, unit: 'trays', unitPrice: 160, totalAmount: 240000, orderDate: '2026-08-23', deliveryDate: '2026-08-24', orderStatus: 'Delivered', paymentStatus: 'Paid', notes: 'Layer Shed C fresh egg collection dispatch' },
  { id: 'so-3', soId: 'FSO-2026-003', customer: { name: 'Star Hotel Chain' }, productType: 'Dressed Chicken', quantity: 800, unit: 'kg', unitPrice: 180, totalAmount: 144000, orderDate: '2026-08-25', deliveryDate: '2026-08-26', orderStatus: 'Confirmed', paymentStatus: 'Unpaid', notes: 'HACCP cold chain transport required' },
  { id: 'so-4', soId: 'FSO-2026-004', customer: { name: 'Metro Supermarket Chain' }, productType: 'Eggs (Table Grade A)', quantity: 2200, unit: 'trays', unitPrice: 165, totalAmount: 363000, orderDate: '2026-08-24', deliveryDate: '2026-08-25', orderStatus: 'Delivered', paymentStatus: 'Paid', notes: 'Weekly grocery retail supply' },
  { id: 'so-5', soId: 'FSO-2026-005', customer: { name: 'Apex Hatcheries Ltd' }, productType: 'Hatching Eggs', quantity: 8000, unit: 'pcs', unitPrice: 28, totalAmount: 224000, orderDate: '2026-08-22', deliveryDate: '2026-08-23', orderStatus: 'Delivered', paymentStatus: 'Paid', notes: 'Parent breeder flock fertile eggs' },
  { id: 'so-6', soId: 'FSO-2026-006', customer: { name: 'Southern Meat Processors' }, productType: 'Live Birds', quantity: 6000, unit: 'kg', unitPrice: 108, totalAmount: 648000, orderDate: '2026-08-25', deliveryDate: '2026-08-27', orderStatus: 'Confirmed', paymentStatus: 'Unpaid', notes: 'Contract slaughtering lot' },
  { id: 'so-7', soId: 'FSO-2026-007', customer: { name: 'City Poultry Traders' }, productType: 'Cull Birds', quantity: 1200, unit: 'birds', unitPrice: 140, totalAmount: 168000, orderDate: '2026-08-21', deliveryDate: '2026-08-22', orderStatus: 'Delivered', paymentStatus: 'Paid', notes: 'End-of-lay layer hen liquidation' },
];

const SAMPLE_CUSTOMERS = [
  { id: 'c-1', name: 'Mumbai Poultry Wholesale Hub' },
  { id: 'c-2', name: 'Royal Egg Distributors' },
  { id: 'c-3', name: 'Star Hotel Chain' },
  { id: 'c-4', name: 'Metro Supermarket Chain' },
  { id: 'c-5', name: 'Apex Hatcheries Ltd' }
];

const EMPTY = { soId: '', customerId: '', productType: 'Live Birds', quantity: '', unit: 'kg', unitPrice: '', orderDate: new Date().toISOString().split('T')[0], deliveryDate: '', orderStatus: 'Confirmed', paymentStatus: 'Unpaid', notes: '' };

export const FarmSales: React.FC = () => {
  const [orders, setOrders] = useState<any[]>(SAMPLE_SALES);
  const [customers, setCustomers] = useState<any[]>(SAMPLE_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        fetch(`${API}/sales`, { headers: H() }),
        fetch(`${API}/customers`, { headers: H() })
      ]);
      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData) && sData.length > 0) setOrders(sData);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        if (Array.isArray(cData) && cData.length > 0) setCustomers(cData);
      }
    } catch {} finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (o: any) => { setForm({ ...o, quantity: String(o.quantity), unitPrice: String(o.unitPrice) }); setEditing(o); setModal(true); };
  const close = () => setModal(false);

  const save = async () => {
    const safeCustomers = Array.isArray(customers) ? customers : SAMPLE_CUSTOMERS;
    const cMatch = safeCustomers.find(c => c.id === form.customerId) || safeCustomers[0];
    const qty = Number(form.quantity) || 0;
    const price = Number(form.unitPrice) || 0;
    const body = {
      ...form,
      quantity: qty,
      unitPrice: price,
      totalAmount: qty * price,
      customer: { name: cMatch.name }
    };

    if (editing) {
      setOrders(prev => prev.map(o => o.id === editing.id ? { ...o, ...body } : o));
      try {
        await fetch(`${API}/sales/${editing.id}`, { method: 'PUT', headers: H(), body: JSON.stringify(body) });
      } catch {}
    } else {
      const newOrder = { ...body, id: `so-${Date.now()}` };
      setOrders(prev => [newOrder, ...prev]);
      try {
        await fetch(`${API}/sales`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
      } catch {}
    }
    close();
  };

  const safeOrders = Array.isArray(orders) ? orders : SAMPLE_SALES;

  const filtered = safeOrders.filter(o =>
    (o.soId || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.productType || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.customer?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Poultry Sales Orders</h1>
          <p className="farm-page-subtitle">Track wholesale broiler sales, egg distribution orders, and revenue</p>
        </div>
        <button className="pf-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }} onClick={openNew}>
          <Plus size={16} /> Create Sales Order
        </button>
      </div>

      <div className="farm-toolbar">
        <div className="farm-search-box">
          <Search size={16} color="#64748b" />
          <input
            className="farm-search-input"
            placeholder="Search SO ID, product or buyer name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>Showing {filtered.length} order(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading sales orders...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr>
                <th>SO ID</th>
                <th>Customer / Buyer</th>
                <th>Product Type</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Revenue</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10}><div className="farm-empty"><Briefcase size={32} className="farm-empty-icon" /><p>No sales orders logged.</p></div></td></tr>
              ) : filtered.map(o => (
                <tr key={o.id}>
                  <td><span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 700 }}>{o.soId}</span></td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{o.customer?.name || 'Mumbai Wholesale Hub'}</td>
                  <td><span className="pf-badge info">{o.productType}</span></td>
                  <td style={{ fontWeight: 600, color: '#334155' }}>{(o.quantity || 0).toLocaleString('en-IN')} {o.unit || 'kg'}</td>
                  <td style={{ color: '#475569', fontWeight: 600 }}>₹{o.unitPrice || 0}</td>
                  <td style={{ fontWeight: 800, color: '#16a34a' }}>₹{(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td style={{ color: '#64748b' }}>{o.orderDate}</td>
                  <td>
                    <span className={`farm-status farm-status--${(o.orderStatus || 'Confirmed').toLowerCase()}`}>
                      {o.orderStatus || 'Confirmed'}
                    </span>
                  </td>
                  <td>
                    <span className={`pf-badge ${o.paymentStatus === 'Paid' ? 'healthy' : 'warning'}`}>
                      {o.paymentStatus || 'Unpaid'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="farm-btn--ghost" style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', cursor: 'pointer' }} onClick={() => openEdit(o)}>
                      <Edit2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="pf-modal-backdrop" onClick={close}>
          <div className="pf-modal" onClick={e => e.stopPropagation()}>
            <div className="pf-modal-header">
              <h3 className="pf-modal-title">{editing ? 'Edit Sales Order' : 'Create New Sales Order'}</h3>
              <button className="pf-modal-close" onClick={close}>&times;</button>
            </div>
            <div className="pf-form-grid">
              <div className="pf-field"><label className="pf-label">SO ID *</label>
                <input className="pf-input" placeholder="FSO-2026-001" value={form.soId} onChange={e => setForm({...form, soId: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Customer / Buyer *</label>
                <select className="pf-select" value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})}>
                  <option value="">Select Customer</option>
                  {(Array.isArray(customers) ? customers : SAMPLE_CUSTOMERS).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select></div>
              <div className="pf-field"><label className="pf-label">Product Type</label>
                <select className="pf-select" value={form.productType} onChange={e => setForm({...form, productType: e.target.value})}>
                  <option>Live Birds</option>
                  <option>Eggs</option>
                  <option>Dressed Chicken</option>
                  <option>Hatching Eggs</option>
                  <option>Cull Birds</option>
                </select></div>
              <div className="pf-field"><label className="pf-label">Quantity</label>
                <input className="pf-input" type="number" placeholder="1000" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Unit Price (₹)</label>
                <input className="pf-input" type="number" placeholder="110" value={form.unitPrice} onChange={e => setForm({...form, unitPrice: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Order Date</label>
                <input className="pf-input" type="date" value={form.orderDate} onChange={e => setForm({...form, orderDate: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Status</label>
                <select className="pf-select" value={form.orderStatus} onChange={e => setForm({...form, orderStatus: e.target.value})}>
                  <option>Confirmed</option><option>Ready</option><option>Delivered</option><option>Cancelled</option>
                </select></div>
              <div className="pf-field pf-field--full"><label className="pf-label">Notes</label>
                <textarea className="pf-textarea" placeholder="Operational details" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="pf-modal-footer">
              <button className="pf-btn-secondary" onClick={close}>Cancel</button>
              <button className="pf-btn-primary" onClick={save}>{editing ? 'Save Changes' : 'Create Order'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
