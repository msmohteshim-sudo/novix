import React, { useEffect, useState } from 'react';
import { ShoppingCart, Plus, Search, Edit2 } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_PURCHASES = [
  { id: 'po-1', poId: 'FPO-2026-001', supplier: { name: 'Maharashtra Feeds Pvt Ltd' }, itemName: 'Broiler Starter Crumbles', category: 'Feed', quantity: 5000, unit: 'kg', unitPrice: 38, totalAmount: 190000, orderDate: '2026-08-10', expectedDelivery: '2026-08-12', deliveryStatus: 'Delivered', paymentStatus: 'Paid', notes: 'Quality verified on receipt' },
  { id: 'po-2', poId: 'FPO-2026-002', supplier: { name: 'Venkateshwara Hatcheries' }, itemName: 'Day-Old Chicks (Cobb 500)', category: 'Chicks', quantity: 12000, unit: 'birds', unitPrice: 35, totalAmount: 420000, orderDate: '2026-08-18', expectedDelivery: '2026-08-20', deliveryStatus: 'Delivered', paymentStatus: 'Paid', notes: 'Vaccinated at hatchery' },
  { id: 'po-3', poId: 'FPO-2026-003', supplier: { name: 'Suguna Foods Pvt Ltd' }, itemName: 'Broiler Finisher Pellets', category: 'Feed', quantity: 8000, unit: 'kg', unitPrice: 36, totalAmount: 288000, orderDate: '2026-08-22', expectedDelivery: '2026-08-26', deliveryStatus: 'Pending', paymentStatus: 'Partial', notes: 'Scheduled for Delivery Shed A' }
];

const SAMPLE_SUPPLIERS = [
  { id: 's-1', name: 'Maharashtra Feeds Pvt Ltd' },
  { id: 's-2', name: 'Venkateshwara Hatcheries' },
  { id: 's-3', name: 'Suguna Foods Pvt Ltd' }
];

const EMPTY = { poId: '', supplierId: '', itemName: '', category: 'Feed', quantity: '', unit: 'kg', unitPrice: '', orderDate: new Date().toISOString().split('T')[0], expectedDelivery: '', deliveryStatus: 'Pending', paymentStatus: 'Unpaid', notes: '' };

export const FarmPurchases: React.FC = () => {
  const [orders, setOrders] = useState<any[]>(SAMPLE_PURCHASES);
  const [suppliers, setSuppliers] = useState<any[]>(SAMPLE_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${API}/purchases`, { headers: H() }),
        fetch(`${API}/suppliers`, { headers: H() })
      ]);
      if (pRes.ok) {
        const pData = await pRes.json();
        if (Array.isArray(pData) && pData.length > 0) setOrders(pData);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData) && sData.length > 0) setSuppliers(sData);
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
    const safeSuppliers = Array.isArray(suppliers) ? suppliers : SAMPLE_SUPPLIERS;
    const supMatch = safeSuppliers.find(s => s.id === form.supplierId) || safeSuppliers[0];
    const qty = Number(form.quantity) || 0;
    const price = Number(form.unitPrice) || 0;
    const body = {
      ...form,
      quantity: qty,
      unitPrice: price,
      totalAmount: qty * price,
      supplier: { name: supMatch.name }
    };

    if (editing) {
      setOrders(prev => prev.map(o => o.id === editing.id ? { ...o, ...body } : o));
      try {
        await fetch(`${API}/purchases/${editing.id}`, { method: 'PUT', headers: H(), body: JSON.stringify(body) });
      } catch {}
    } else {
      const newOrder = { ...body, id: `po-${Date.now()}` };
      setOrders(prev => [newOrder, ...prev]);
      try {
        await fetch(`${API}/purchases`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
      } catch {}
    }
    close();
  };

  const safeOrders = Array.isArray(orders) ? orders : SAMPLE_PURCHASES;

  const filtered = safeOrders.filter(o =>
    (o.poId || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.itemName || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.supplier?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Farm Purchase Orders</h1>
          <p className="farm-page-subtitle">Manage feed, chick batch, and equipment purchase requisitions</p>
        </div>
        <button className="farm-btn farm-btn--primary" onClick={openNew}>
          <Plus size={15} /> Create Purchase Order
        </button>
      </div>

      <div className="farm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'0.5rem 0.85rem', border:'1px solid rgba(255,255,255,0.09)' }}>
          <Search size={15} color="#94a3b8" />
          <input className="farm-search-input" style={{ background:'none', border:'none', padding:0, minWidth:'180px', color: '#f8fafc' }} placeholder="Search PO ID, item or supplier…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Showing {filtered.length} order(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading purchase orders...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr><th>PO ID</th><th>Item Name</th><th>Supplier</th><th>Category</th><th>Quantity</th><th>Total Cost</th><th>Order Date</th><th>Delivery</th><th>Payment</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10}><div className="farm-empty"><ShoppingCart size={32} className="farm-empty-icon" /><p>No purchase orders found.</p></div></td></tr>
              ) : filtered.map(o => (
                <tr key={o.id}>
                  <td><span style={{ fontFamily:'monospace', color:'#818cf8', fontWeight:600 }}>{o.poId}</span></td>
                  <td style={{ fontWeight:600, color:'#f1f5f9' }}>{o.itemName}</td>
                  <td>{o.supplier?.name || 'Maharashtra Feeds'}</td>
                  <td><span style={{ fontSize:'0.78rem', color:'#cbd5e1' }}>{o.category}</span></td>
                  <td>{(o.quantity || 0).toLocaleString('en-IN')} {o.unit}</td>
                  <td style={{ fontWeight:700, color:'#34d399' }}>₹{(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td>{o.orderDate}</td>
                  <td><span className={`farm-status farm-status--${(o.deliveryStatus || 'Pending').toLowerCase()}`}>{o.deliveryStatus || 'Pending'}</span></td>
                  <td><span style={{ color: o.paymentStatus === 'Paid' ? '#34d399' : '#f59e0b', fontSize:'0.8rem', fontWeight:600 }}>{o.paymentStatus || 'Unpaid'}</span></td>
                  <td style={{ textAlign: 'right' }}><button className="farm-btn farm-btn--ghost" style={{ padding:'0.3rem 0.6rem' }} onClick={() => openEdit(o)}><Edit2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="farm-modal-overlay" onClick={close}>
          <div className="farm-modal" onClick={e => e.stopPropagation()}>
            <h3 className="farm-modal-title">{editing ? 'Edit Purchase Order' : 'New Purchase Order'}</h3>
            <div className="farm-form-grid">
              <div className="farm-field"><label className="farm-label">PO ID *</label>
                <input className="farm-input" placeholder="FPO-2026-001" value={form.poId} onChange={e => setForm({...form, poId: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Supplier *</label>
                <select className="farm-select" value={form.supplierId} onChange={e => setForm({...form, supplierId: e.target.value})}>
                  <option value="">Select Supplier</option>
                  {(Array.isArray(suppliers) ? suppliers : SAMPLE_SUPPLIERS).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select></div>
              <div className="farm-field"><label className="farm-label">Item Description *</label>
                <input className="farm-input" placeholder="Broiler Starter Feed" value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Category</label>
                <select className="farm-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option>Feed</option>
                  <option>Chicks</option>
                  <option>Medicine</option>
                  <option>Vaccine</option>
                  <option>Equipment</option>
                </select></div>
              <div className="farm-field"><label className="farm-label">Quantity</label>
                <input className="farm-input" type="number" placeholder="5000" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Unit Price (₹)</label>
                <input className="farm-input" type="number" placeholder="38" value={form.unitPrice} onChange={e => setForm({...form, unitPrice: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Order Date</label>
                <input className="farm-input" type="date" value={form.orderDate} onChange={e => setForm({...form, orderDate: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Delivery Status</label>
                <select className="farm-select" value={form.deliveryStatus} onChange={e => setForm({...form, deliveryStatus: e.target.value})}>
                  <option>Pending</option><option>Delivered</option>
                </select></div>
              <div className="farm-field farm-field--full"><label className="farm-label">Notes</label>
                <textarea className="farm-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="farm-modal-actions">
              <button className="farm-btn farm-btn--ghost" onClick={close}>Cancel</button>
              <button className="farm-btn farm-btn--primary" onClick={save}>{editing ? 'Save Changes' : 'Create Order'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
