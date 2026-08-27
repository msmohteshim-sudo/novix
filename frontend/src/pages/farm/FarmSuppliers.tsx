import React, { useEffect, useState } from 'react';
import { Building2, Plus, Search } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_SUPPLIERS = [
  { id: 's-1', name: 'Maharashtra Feeds Pvt Ltd', category: 'Feed', contactPerson: 'Suresh More', phone: '+91 98220 11223', email: 'sales@mahafeeds.com', address: 'Plot 42, MIDC Ambad, Nashik', gstNumber: '27AAAAA0000A1Z5', status: 'Active' },
  { id: 's-2', name: 'Venkateshwara Hatcheries (Venky’s)', category: 'Chicks', contactPerson: 'Dr. Nitin Deshmukh', phone: '+91 98220 44556', email: 'orders@venkys.com', address: 'Pune-Bangalore Highway, Pune', gstNumber: '27BBBBB1111B1Z2', status: 'Active' },
  { id: 's-3', name: 'Suguna Foods Pvt Ltd', category: 'Feed', contactPerson: 'Rajiv Menon', phone: '+91 98220 77889', email: 'contact@sugunafoods.com', address: 'Coimbatore, Tamil Nadu', gstNumber: '33CCCCC2222C1Z8', status: 'Active' },
  { id: 's-4', name: 'PoultryMed Pharma', category: 'Medicine', contactPerson: 'Dr. Vikas Shinde', phone: '+91 98220 99001', email: 'info@poultrymed.in', address: 'Thane, Mumbai', gstNumber: '27DDDDD3333D1Z4', status: 'Active' }
];

const EMPTY = { name: '', category: 'Feed', contactPerson: '', phone: '', email: '', address: '', gstNumber: '', status: 'Active' };

export const FarmSuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>(SAMPLE_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch(`${API}/suppliers`, { headers: H() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setSuppliers(data);
      }
    } catch {} finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setModal(true); };
  const close = () => setModal(false);

  const save = async () => {
    const newSup = { ...form, id: `s-${Date.now()}` };
    setSuppliers(prev => [newSup, ...prev]);
    try {
      await fetch(`${API}/suppliers`, { method: 'POST', headers: H(), body: JSON.stringify(form) });
    } catch {}
    close();
  };

  const safeSuppliers = Array.isArray(suppliers) ? suppliers : SAMPLE_SUPPLIERS;

  const filtered = safeSuppliers.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.contactPerson || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Farm Suppliers</h1>
          <p className="farm-page-subtitle">Manage feed vendors, chick hatcheries, and pharmaceutical suppliers</p>
        </div>
        <button className="farm-btn farm-btn--primary" onClick={openNew}>
          <Plus size={15} /> Add Supplier
        </button>
      </div>

      <div className="farm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'0.5rem 0.85rem', border:'1px solid rgba(255,255,255,0.09)' }}>
          <Search size={15} color="#94a3b8" />
          <input className="farm-search-input" style={{ background:'none', border:'none', padding:0, minWidth:'180px', color: '#f8fafc' }} placeholder="Search supplier name, category or contact…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Showing {filtered.length} supplier(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading suppliers directory...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr><th>Supplier Name</th><th>Category</th><th>Contact Person</th><th>Phone</th><th>Email</th><th>Address</th><th>Status</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><div className="farm-empty"><Building2 size={32} className="farm-empty-icon" /><p>No suppliers registered.</p></div></td></tr>
              ) : filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight:600, color:'#f1f5f9' }}>{s.name}</td>
                  <td><span style={{ fontSize:'0.8rem', color:'#cbd5e1', backgroundColor:'rgba(255,255,255,0.06)', padding:'2px 8px', borderRadius:'6px' }}>{s.category}</span></td>
                  <td>{s.contactPerson || '—'}</td>
                  <td>{s.phone || '—'}</td>
                  <td>{s.email || '—'}</td>
                  <td><span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>{s.address || '—'}</span></td>
                  <td><span className={`farm-status farm-status--${(s.status || 'Active').toLowerCase()}`}>{s.status || 'Active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="farm-modal-overlay" onClick={close}>
          <div className="farm-modal" onClick={e => e.stopPropagation()}>
            <h3 className="farm-modal-title">Register Farm Supplier</h3>
            <div className="farm-form-grid">
              <div className="farm-field"><label className="farm-label">Company / Supplier Name *</label>
                <input className="farm-input" placeholder="Maharashtra Feeds Pvt Ltd" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Supply Category</label>
                <select className="farm-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option>Feed</option>
                  <option>Chicks</option>
                  <option>Medicine</option>
                  <option>Equipment</option>
                  <option>Other</option>
                </select></div>
              <div className="farm-field"><label className="farm-label">Contact Person</label>
                <input className="farm-input" placeholder="Suresh More" value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Phone Number</label>
                <input className="farm-input" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Email Address</label>
                <input className="farm-input" placeholder="sales@company.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">GST Number</label>
                <input className="farm-input" placeholder="27AAAAA0000A1Z5" value={form.gstNumber} onChange={e => setForm({...form, gstNumber: e.target.value})} /></div>
              <div className="farm-field farm-field--full"><label className="farm-label">Address</label>
                <textarea className="farm-textarea" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
            </div>
            <div className="farm-modal-actions">
              <button className="farm-btn farm-btn--ghost" onClick={close}>Cancel</button>
              <button className="farm-btn farm-btn--primary" onClick={save}>Register Supplier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
