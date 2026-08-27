import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, Search } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_SHEDS = [
  { id: 'sh-1', shedId: 'SH-001', name: 'Broiler Shed A', farmId: 'farm-1', farm: { name: 'Sharma Poultry Farm' }, shedType: 'Broiler', capacity: 15000, currentBirds: 12500, status: 'Active', notes: 'Automated feeding & cooling system' },
  { id: 'sh-2', shedId: 'SH-002', name: 'Broiler Shed B', farmId: 'farm-1', farm: { name: 'Sharma Poultry Farm' }, shedType: 'Broiler', capacity: 15000, currentBirds: 11800, status: 'Active', notes: 'Standard environmental controls' },
  { id: 'sh-3', shedId: 'SH-003', name: 'Layer Shed 1', farmId: 'farm-2', farm: { name: 'GreenValley Layer Farm' }, shedType: 'Layer', capacity: 20000, currentBirds: 18500, status: 'Active', notes: 'Automatic egg collection belts' },
  { id: 'sh-4', shedId: 'SH-004', name: 'Layer Shed 2', farmId: 'farm-2', farm: { name: 'GreenValley Layer Farm' }, shedType: 'Layer', capacity: 15000, currentBirds: 14200, status: 'Active', notes: 'Controlled lighting cycle' },
  { id: 'sh-5', shedId: 'SH-005', name: 'Broiler Grower 1', farmId: 'farm-3', farm: { name: 'Sunrise Broiler Unit B' }, shedType: 'Broiler', capacity: 20000, currentBirds: 9500, status: 'Active', notes: 'Deep litter system' },
];

const SAMPLE_FARMS = [
  { id: 'farm-1', name: 'Sharma Poultry Farm' },
  { id: 'farm-2', name: 'GreenValley Layer Farm' },
  { id: 'farm-3', name: 'Sunrise Broiler Unit B' }
];

const EMPTY = { shedId: '', farmId: '', name: '', capacity: '', currentBirds: '', shedType: 'Broiler', status: 'Active', notes: '' };

export const Sheds: React.FC = () => {
  const [sheds, setSheds] = useState<any[]>(SAMPLE_SHEDS);
  const [farms, setFarms] = useState<any[]>(SAMPLE_FARMS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [sRes, fRes] = await Promise.all([
        fetch(`${API}/sheds`, { headers: H() }),
        fetch(`${API}/farms`, { headers: H() })
      ]);
      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData) && sData.length > 0) setSheds(sData);
      }
      if (fRes.ok) {
        const fData = await fRes.json();
        if (Array.isArray(fData) && fData.length > 0) setFarms(fData);
      }
    } catch {} finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (s: any) => { setForm({ ...s, capacity: String(s.capacity), currentBirds: String(s.currentBirds) }); setEditing(s); setModal(true); };
  const close = () => setModal(false);

  const save = async () => {
    const selectedFarm = (Array.isArray(farms) ? farms : SAMPLE_FARMS).find(f => f.id === form.farmId) || { name: 'Sharma Poultry Farm' };
    const body = { ...form, capacity: Number(form.capacity) || 0, currentBirds: Number(form.currentBirds) || 0, farm: selectedFarm };
    
    if (editing) {
      setSheds(prev => prev.map(s => s.id === editing.id ? { ...s, ...body } : s));
      try {
        await fetch(`${API}/sheds/${editing.id}`, { method: 'PUT', headers: H(), body: JSON.stringify(body) });
      } catch {}
    } else {
      const newShed = { ...body, id: `sh-${Date.now()}` };
      setSheds(prev => [newShed, ...prev]);
      try {
        await fetch(`${API}/sheds`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
      } catch {}
    }
    close();
  };

  const safeSheds = Array.isArray(sheds) ? sheds : SAMPLE_SHEDS;
  const safeFarms = Array.isArray(farms) ? farms : SAMPLE_FARMS;

  const filtered = safeSheds.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.farm?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.shedId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Farm Sheds</h1>
          <p className="farm-page-subtitle">Track poultry sheds, bird capacities, and occupancy rates</p>
        </div>
        <button className="farm-btn farm-btn--primary" onClick={openNew}>
          <Plus size={15} /> Add Shed
        </button>
      </div>

      <div className="farm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'0.5rem 0.85rem', border:'1px solid rgba(255,255,255,0.09)' }}>
          <Search size={15} color="#94a3b8" />
          <input className="farm-search-input" style={{ background:'none', border:'none', padding:0, minWidth:'180px', color: '#f8fafc' }} placeholder="Search sheds or farm..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Showing {filtered.length} shed(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading shed records...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr><th>Shed ID</th><th>Shed Name</th><th>Farm</th><th>Type</th><th>Capacity</th><th>Current Birds</th><th>Occupancy</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><div className="farm-empty"><Layers size={32} className="farm-empty-icon" /><p>No sheds found.</p></div></td></tr>
              ) : filtered.map(s => {
                const occ = s.capacity > 0 ? Math.round(((s.currentBirds || 0) / s.capacity) * 100) : 0;
                return (
                  <tr key={s.id}>
                    <td><span style={{ fontFamily:'monospace', color:'#818cf8', fontWeight: 600 }}>{s.shedId}</span></td>
                    <td style={{ fontWeight:600, color:'#f1f5f9' }}>{s.name}</td>
                    <td>{s.farm?.name || 'Sharma Poultry Farm'}</td>
                    <td><span style={{ fontSize:'0.78rem', color:'#cbd5e1' }}>{s.shedType || 'Broiler'}</span></td>
                    <td>{(s.capacity || 0).toLocaleString('en-IN')}</td>
                    <td>{(s.currentBirds || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <div style={{ flex:1, background:'rgba(255,255,255,0.06)', borderRadius:'99px', height:'6px' }}>
                          <div style={{ width:`${Math.min(occ, 100)}%`, height:'100%', borderRadius:'99px', background: occ > 90 ? '#ef4444' : occ > 70 ? '#f59e0b' : '#22c55e' }} />
                        </div>
                        <span style={{ fontSize:'0.75rem', color:'#94a3b8', minWidth:'35px' }}>{occ}%</span>
                      </div>
                    </td>
                    <td><span className={`farm-status farm-status--${(s.status || 'Active').toLowerCase()}`}>{s.status || 'Active'}</span></td>
                    <td style={{ textAlign: 'right' }}><button className="farm-btn farm-btn--ghost" style={{ padding:'0.3rem 0.6rem' }} onClick={() => openEdit(s)}><Edit2 size={13} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="farm-modal-overlay" onClick={close}>
          <div className="farm-modal" onClick={e => e.stopPropagation()}>
            <h3 className="farm-modal-title">{editing ? 'Edit Shed' : 'Add New Shed'}</h3>
            <div className="farm-form-grid">
              <div className="farm-field"><label className="farm-label">Shed ID *</label>
                <input className="farm-input" placeholder="SH-001" value={form.shedId} onChange={e => setForm({...form, shedId: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Shed Name *</label>
                <input className="farm-input" placeholder="Broiler Shed A" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Farm *</label>
                <select className="farm-select" value={form.farmId} onChange={e => setForm({...form, farmId: e.target.value})}>
                  <option value="">Select Farm</option>
                  {safeFarms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select></div>
              <div className="farm-field"><label className="farm-label">Shed Type</label>
                <select className="farm-select" value={form.shedType} onChange={e => setForm({...form, shedType: e.target.value})}>
                  <option>Broiler</option><option>Layer</option>
                </select></div>
              <div className="farm-field"><label className="farm-label">Capacity (birds)</label>
                <input className="farm-input" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Status</label>
                <select className="farm-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option>Active</option><option>Empty</option><option>Maintenance</option><option>Closed</option>
                </select></div>
              <div className="farm-field farm-field--full"><label className="farm-label">Notes</label>
                <textarea className="farm-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="farm-modal-actions">
              <button className="farm-btn farm-btn--ghost" onClick={close}>Cancel</button>
              <button className="farm-btn farm-btn--primary" onClick={save}>{editing ? 'Save Changes' : 'Create Shed'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
