import React, { useEffect, useState } from 'react';
import { DollarSign, Plus, Search } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_EXPENSES = [
  { id: 'exp-1', date: '2026-08-22', category: 'Feed', description: 'Broiler Starter Feed Procurement (5 Tonnes)', amount: 190000, paymentMode: 'Bank Transfer', referenceNo: 'TXN-987123', notes: 'Supplier: Maharashtra Feeds' },
  { id: 'exp-2', date: '2026-08-20', category: 'Electricity', description: 'Shed Climate Control & Ventilation Bill', amount: 35000, paymentMode: 'UPI', referenceNo: 'UPI-443311', notes: 'MSEDCL monthly billing' },
  { id: 'exp-3', date: '2026-08-18', category: 'Medicine', description: 'Newcastle & IBD Vaccines Stocking', amount: 28000, paymentMode: 'Cash', referenceNo: 'RCPT-1102', notes: 'Dr. Ramesh Kulkarni pharmacy' },
  { id: 'exp-4', date: '2026-08-15', category: 'Labour', description: 'Weekly Shed Workers Wages (Shed 1-3)', amount: 45000, paymentMode: 'Bank Transfer', referenceNo: 'PAYROLL-W33', notes: '12 farm hands paid' },
  { id: 'exp-5', date: '2026-08-10', category: 'Maintenance', description: 'Generator Diesel Fill (500 Litres)', amount: 48000, paymentMode: 'UPI', referenceNo: 'UPI-887711', notes: 'Backup power fuel station' }
];

const EMPTY = { date: new Date().toISOString().split('T')[0], category: 'Feed', description: '', amount: '', paymentMode: 'Bank Transfer', referenceNo: '', notes: '' };

export const FarmExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>(SAMPLE_EXPENSES);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch(`${API}/expenses`, { headers: H() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setExpenses(data);
      }
    } catch {} finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setModal(true); };
  const close = () => setModal(false);

  const save = async () => {
    const body = { ...form, amount: Number(form.amount) || 0 };
    const newExp = { ...body, id: `exp-${Date.now()}` };
    setExpenses(prev => [newExp, ...prev]);

    try {
      await fetch(`${API}/expenses`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
    } catch {}
    close();
  };

  const safeExpenses = Array.isArray(expenses) ? expenses : SAMPLE_EXPENSES;

  const filtered = safeExpenses.filter(e =>
    (e.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.referenceNo || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = safeExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Farm Expenses & Outlays</h1>
          <p className="farm-page-subtitle">Track operational expenditure across feed, medicine, labour, electricity, and fuel</p>
        </div>
        <button className="farm-btn farm-btn--primary" onClick={openNew}>
          <Plus size={15} /> Log Expense
        </button>
      </div>

      <div className="farm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'0.5rem 0.85rem', border:'1px solid rgba(255,255,255,0.09)' }}>
          <Search size={15} color="#94a3b8" />
          <input className="farm-search-input" style={{ background:'none', border:'none', padding:0, minWidth:'180px', color: '#f8fafc' }} placeholder="Search description or category…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ color:'#34d399', fontWeight: 700, fontSize:'0.9rem' }}>Total Expense: ₹{totalAmount.toLocaleString('en-IN')}</div>
      </div>

      {loading ? <div className="farm-loading">Loading expenses...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount (₹)</th><th>Payment Mode</th><th>Reference No</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><div className="farm-empty"><DollarSign size={32} className="farm-empty-icon" /><p>No expense logs found.</p></div></td></tr>
              ) : filtered.map(e => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td><span style={{ fontSize:'0.78rem', color:'#fca5a5', backgroundColor:'rgba(239,68,68,0.12)', padding:'2px 8px', borderRadius:'6px' }}>{e.category}</span></td>
                  <td style={{ fontWeight:600, color:'#f1f5f9' }}>{e.description}</td>
                  <td style={{ fontWeight:700, color:'#ef4444' }}>₹{(e.amount || 0).toLocaleString('en-IN')}</td>
                  <td>{e.paymentMode || 'Cash'}</td>
                  <td><span style={{ fontFamily:'monospace', color:'#94a3b8' }}>{e.referenceNo || '—'}</span></td>
                  <td><span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>{e.notes || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="farm-modal-overlay" onClick={close}>
          <div className="farm-modal" onClick={e => e.stopPropagation()}>
            <h3 className="farm-modal-title">Log Farm Expense</h3>
            <div className="farm-form-grid">
              <div className="farm-field"><label className="farm-label">Expense Date *</label>
                <input className="farm-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Expense Category</label>
                <select className="farm-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option>Feed</option>
                  <option>Medicine</option>
                  <option>Labour</option>
                  <option>Electricity</option>
                  <option>Transport</option>
                  <option>Maintenance</option>
                  <option>Other</option>
                </select></div>
              <div className="farm-field farm-field--full"><label className="farm-label">Description *</label>
                <input className="farm-input" placeholder="e.g. Generator Diesel Refill" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Amount (₹) *</label>
                <input className="farm-input" type="number" placeholder="25000" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Payment Mode</label>
                <select className="farm-select" value={form.paymentMode} onChange={e => setForm({...form, paymentMode: e.target.value})}>
                  <option>Bank Transfer</option>
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                </select></div>
              <div className="farm-field"><label className="farm-label">Txn / Ref Number</label>
                <input className="farm-input" placeholder="TXN-123456" value={form.referenceNo} onChange={e => setForm({...form, referenceNo: e.target.value})} /></div>
              <div className="farm-field farm-field--full"><label className="farm-label">Notes</label>
                <textarea className="farm-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="farm-modal-actions">
              <button className="farm-btn farm-btn--ghost" onClick={close}>Cancel</button>
              <button className="farm-btn farm-btn--primary" onClick={save}>Log Expense</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
