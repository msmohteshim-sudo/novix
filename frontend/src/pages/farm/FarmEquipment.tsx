import React, { useEffect, useState } from 'react';
import { Cpu, Plus, Search, Edit2 } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_EQUIPMENT = [
  { id: 'eq-1', assetId: 'EQ-001', name: 'Automated Pan Feeder System 1', category: 'Feeder', farmLocation: 'Broiler Shed A', purchaseDate: '2023-05-10', purchaseCost: 250000, lastService: '2026-06-15', nextService: '2026-12-15', status: 'Operational', notes: 'Serviced by Big Dutchman India' },
  { id: 'eq-2', assetId: 'EQ-002', name: 'Nipple Drinker Line System', category: 'Waterer', farmLocation: 'Broiler Shed B', purchaseDate: '2023-06-20', purchaseCost: 180000, lastService: '2026-07-01', nextService: '2027-01-01', status: 'Operational', notes: 'Pressure regulators replaced' },
  { id: 'eq-3', assetId: 'EQ-003', name: '125 kVA Silent Diesel Generator', category: 'Generator', farmLocation: 'Main Power House', purchaseDate: '2022-01-15', purchaseCost: 650000, lastService: '2026-08-01', nextService: '2026-11-01', status: 'Operational', notes: 'Kirloskar Cummins engine' },
  { id: 'eq-4', assetId: 'EQ-004', name: 'Evaporative Cooling Pads (Shed 3)', category: 'Fan', farmLocation: 'Layer Shed 1', purchaseDate: '2024-03-12', purchaseCost: 120000, lastService: '2026-05-10', nextService: '2026-09-10', status: 'Under Maintenance', notes: 'Water circulation pump check' }
];

const EMPTY = { assetId: '', name: '', category: 'Feeder', farmLocation: '', purchaseDate: '', purchaseCost: '', lastService: '', nextService: '', status: 'Operational', notes: '' };

export const FarmEquipment: React.FC = () => {
  const [equipment, setEquipment] = useState<any[]>(SAMPLE_EQUIPMENT);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch(`${API}/equipment`, { headers: H() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setEquipment(data);
      }
    } catch {} finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (eq: any) => { setForm({ ...eq, purchaseCost: String(eq.purchaseCost) }); setEditing(eq); setModal(true); };
  const close = () => setModal(false);

  const save = async () => {
    const body = { ...form, purchaseCost: Number(form.purchaseCost) || 0 };
    if (editing) {
      setEquipment(prev => prev.map(eq => eq.id === editing.id ? { ...eq, ...body } : eq));
      try {
        await fetch(`${API}/equipment/${editing.id}`, { method: 'PUT', headers: H(), body: JSON.stringify(body) });
      } catch {}
    } else {
      const newEq = { ...body, id: `eq-${Date.now()}` };
      setEquipment(prev => [newEq, ...prev]);
      try {
        await fetch(`${API}/equipment`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
      } catch {}
    }
    close();
  };

  const safeEquipment = Array.isArray(equipment) ? equipment : SAMPLE_EQUIPMENT;

  const filtered = safeEquipment.filter(eq =>
    (eq.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (eq.assetId || '').toLowerCase().includes(search.toLowerCase()) ||
    (eq.farmLocation || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Farm Equipment & Machinery</h1>
          <p className="farm-page-subtitle">Track automated feeders, drinkers, generators, and shed ventilation assets</p>
        </div>
        <button className="farm-btn farm-btn--primary" onClick={openNew}>
          <Plus size={15} /> Add Equipment
        </button>
      </div>

      <div className="farm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'0.5rem 0.85rem', border:'1px solid rgba(255,255,255,0.09)' }}>
          <Search size={15} color="#94a3b8" />
          <input className="farm-search-input" style={{ background:'none', border:'none', padding:0, minWidth:'180px', color: '#f8fafc' }} placeholder="Search equipment or location…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Showing {filtered.length} asset(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading equipment inventory...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr><th>Asset ID</th><th>Equipment Name</th><th>Category</th><th>Location</th><th>Purchase Cost</th><th>Next Service</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="farm-empty"><Cpu size={32} className="farm-empty-icon" /><p>No equipment registered.</p></div></td></tr>
              ) : filtered.map(eq => (
                <tr key={eq.id}>
                  <td><span style={{ fontFamily:'monospace', color:'#818cf8', fontWeight:600 }}>{eq.assetId}</span></td>
                  <td style={{ fontWeight:600, color:'#f1f5f9' }}>{eq.name}</td>
                  <td><span style={{ fontSize:'0.78rem', color:'#cbd5e1' }}>{eq.category}</span></td>
                  <td>{eq.farmLocation || 'Shed 1'}</td>
                  <td style={{ fontWeight:700, color:'#34d399' }}>₹{(eq.purchaseCost || 0).toLocaleString('en-IN')}</td>
                  <td style={{ color:'#38bdf8' }}>{eq.nextService || '—'}</td>
                  <td><span className={`farm-status farm-status--${(eq.status || 'Operational').toLowerCase().replace(/\s+/g, '')}`}>{eq.status || 'Operational'}</span></td>
                  <td style={{ textAlign: 'right' }}><button className="farm-btn farm-btn--ghost" style={{ padding:'0.3rem 0.6rem' }} onClick={() => openEdit(eq)}><Edit2 size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="farm-modal-overlay" onClick={close}>
          <div className="farm-modal" onClick={e => e.stopPropagation()}>
            <h3 className="farm-modal-title">{editing ? 'Edit Equipment' : 'Add Equipment Asset'}</h3>
            <div className="farm-form-grid">
              <div className="farm-field"><label className="farm-label">Asset ID *</label>
                <input className="farm-input" placeholder="EQ-001" value={form.assetId} onChange={e => setForm({...form, assetId: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Equipment Name *</label>
                <input className="farm-input" placeholder="Automated Pan Feeder System" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Category</label>
                <select className="farm-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option>Feeder</option>
                  <option>Waterer</option>
                  <option>Generator</option>
                  <option>Fan</option>
                  <option>Motor</option>
                  <option>Egg Equipment</option>
                  <option>Other</option>
                </select></div>
              <div className="farm-field"><label className="farm-label">Farm / Shed Location</label>
                <input className="farm-input" placeholder="Broiler Shed A" value={form.farmLocation} onChange={e => setForm({...form, farmLocation: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Purchase Cost (₹)</label>
                <input className="farm-input" type="number" placeholder="250000" value={form.purchaseCost} onChange={e => setForm({...form, purchaseCost: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Next Service Date</label>
                <input className="farm-input" type="date" value={form.nextService} onChange={e => setForm({...form, nextService: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Status</label>
                <select className="farm-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option>Operational</option>
                  <option>Under Maintenance</option>
                  <option>Faulty</option>
                  <option>Retired</option>
                </select></div>
              <div className="farm-field farm-field--full"><label className="farm-label">Notes</label>
                <textarea className="farm-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="farm-modal-actions">
              <button className="farm-btn farm-btn--ghost" onClick={close}>Cancel</button>
              <button className="farm-btn farm-btn--primary" onClick={save}>{editing ? 'Save Changes' : 'Add Asset'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
