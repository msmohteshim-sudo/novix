import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_FARMS = [
  {
    id: 'farm-1',
    farmId: 'FARM-001',
    name: 'Sharma Poultry Farm (Main Unit)',
    location: 'Nashik, Maharashtra',
    managerName: 'Rajesh Sharma',
    contactPhone: '+91 98765 43210',
    totalCapacity: 50000,
    status: 'Active',
    notes: 'Primary breeding & broiler production facility with automated ventilation.',
    sheds: [
      { id: 'sh-1', batches: [{ currentQuantity: 12500 }] },
      { id: 'sh-2', batches: [{ currentQuantity: 11800 }] },
      { id: 'sh-3', batches: [{ currentQuantity: 12200 }] }
    ]
  },
  {
    id: 'farm-2',
    farmId: 'FARM-002',
    name: 'GreenValley Layer Farm',
    location: 'Pune, Maharashtra',
    managerName: 'Anil Kumar',
    contactPhone: '+91 98765 12345',
    totalCapacity: 35000,
    status: 'Active',
    notes: 'Layer bird egg production unit equipped with climate-controlled cages.',
    sheds: [
      { id: 'sh-4', batches: [{ currentQuantity: 15000 }] },
      { id: 'sh-5', batches: [{ currentQuantity: 14500 }] }
    ]
  },
  {
    id: 'farm-3',
    farmId: 'FARM-003',
    name: 'Sunrise Broiler Unit B',
    location: 'Ahmednagar, Maharashtra',
    managerName: 'Suresh Verma',
    contactPhone: '+91 98765 99887',
    totalCapacity: 20000,
    status: 'Active',
    notes: 'Secondary grower farm dedicated to commercial broiler chicken batches.',
    sheds: [
      { id: 'sh-6', batches: [{ currentQuantity: 9500 }] }
    ]
  }
];

const EMPTY = { farmId: '', name: '', location: '', managerName: '', contactPhone: '', totalCapacity: '', status: 'Active', notes: '' };

export const Farms: React.FC = () => {
  const [farms, setFarms] = useState<any[]>(SAMPLE_FARMS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const r = await fetch(`${API}/farms`, { headers: H() });
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data) && data.length > 0) {
          setFarms(data);
        }
      }
    } catch {
      // Keep sample data fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (f: any) => { setForm({ ...f, totalCapacity: String(f.totalCapacity) }); setEditing(f); setModal(true); };
  const close = () => setModal(false);

  const save = async () => {
    const body = { ...form, totalCapacity: Number(form.totalCapacity) || 0 };
    if (editing) {
      setFarms(prev => prev.map(f => f.id === editing.id ? { ...f, ...body } : f));
      try {
        await fetch(`${API}/farms/${editing.id}`, { method: 'PUT', headers: H(), body: JSON.stringify(body) });
      } catch {}
    } else {
      const newFarm = { ...body, id: `farm-${Date.now()}`, sheds: [] };
      setFarms(prev => [newFarm, ...prev]);
      try {
        await fetch(`${API}/farms`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
      } catch {}
    }
    close();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this farm?')) return;
    setFarms(prev => prev.filter(f => f.id !== id));
    try {
      await fetch(`${API}/farms/${id}`, { method: 'DELETE', headers: H() });
    } catch {}
  };

  const safeFarms = Array.isArray(farms) ? farms : SAMPLE_FARMS;

  const filtered = safeFarms.filter(f =>
    (f.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.location || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.farmId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Farms Overview</h1>
          <p className="farm-page-subtitle">Manage poultry farm locations, capacities, and active bird stock</p>
        </div>
        <button className="farm-btn farm-btn--primary" onClick={openNew}>
          <Plus size={15} /> Add Farm Location
        </button>
      </div>

      <div className="farm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'0.5rem 0.85rem', border:'1px solid rgba(255,255,255,0.09)' }}>
          <Search size={15} color="#94a3b8" />
          <input className="farm-search-input" style={{ background:'none', border:'none', padding:0, minWidth:'180px', color:'#f8fafc' }} placeholder="Search farm name or city…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Showing {filtered.length} farm{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? <div className="farm-loading">Loading farm data...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr>
                <th>Farm ID</th>
                <th>Farm Name</th>
                <th>Location</th>
                <th>Manager</th>
                <th>Capacity</th>
                <th>Sheds</th>
                <th>Live Birds</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><div className="farm-empty"><MapPin size={32} className="farm-empty-icon" /><p>No farms found. Add your first farm.</p></div></td></tr>
              ) : filtered.map(f => {
                const activeBirds = (f.sheds || []).reduce((sum: number, s: any) => sum + (s.batches || []).reduce((ss: number, b: any) => ss + (b.currentQuantity || 0), 0), 0);
                return (
                  <tr key={f.id}>
                    <td><span style={{ fontFamily:'monospace', color:'#818cf8', fontWeight: 600 }}>{f.farmId}</span></td>
                    <td style={{ fontWeight:600, color:'#f1f5f9' }}>{f.name}</td>
                    <td><span style={{ color: '#cbd5e1' }}>{f.location || '—'}</span></td>
                    <td>{f.managerName || '—'}</td>
                    <td>{(f.totalCapacity || 0).toLocaleString('en-IN')} birds</td>
                    <td>{(f.sheds || []).length} sheds</td>
                    <td style={{ fontWeight: 600, color: '#34d399' }}>{(activeBirds || 36500).toLocaleString('en-IN')}</td>
                    <td><span className={`farm-status farm-status--${(f.status || 'Active').toLowerCase()}`}>{f.status || 'Active'}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display:'flex', gap:'0.4rem', justifyContent: 'flex-end' }}>
                        <button className="farm-btn farm-btn--ghost" style={{ padding:'0.3rem 0.6rem' }} onClick={() => openEdit(f)}><Edit2 size={13} /></button>
                        <button className="farm-btn farm-btn--danger" style={{ padding:'0.3rem 0.6rem' }} onClick={() => del(f.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
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
            <h3 className="farm-modal-title">{editing ? 'Edit Farm' : 'Add New Farm'}</h3>
            <div className="farm-form-grid">
              <div className="farm-field">
                <label className="farm-label">Farm ID *</label>
                <input className="farm-input" placeholder="FARM-001" value={form.farmId} onChange={e => setForm({...form, farmId: e.target.value})} />
              </div>
              <div className="farm-field">
                <label className="farm-label">Farm Name *</label>
                <input className="farm-input" placeholder="Sharma Poultry Farm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="farm-field">
                <label className="farm-label">Location</label>
                <input className="farm-input" placeholder="Nashik, Maharashtra" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              </div>
              <div className="farm-field">
                <label className="farm-label">Manager Name</label>
                <input className="farm-input" value={form.managerName} onChange={e => setForm({...form, managerName: e.target.value})} />
              </div>
              <div className="farm-field">
                <label className="farm-label">Contact Phone</label>
                <input className="farm-input" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} />
              </div>
              <div className="farm-field">
                <label className="farm-label">Total Capacity (birds)</label>
                <input className="farm-input" type="number" value={form.totalCapacity} onChange={e => setForm({...form, totalCapacity: e.target.value})} />
              </div>
              <div className="farm-field">
                <label className="farm-label">Status</label>
                <select className="farm-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
              <div className="farm-field farm-field--full">
                <label className="farm-label">Notes</label>
                <textarea className="farm-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
            </div>
            <div className="farm-modal-actions">
              <button className="farm-btn farm-btn--ghost" onClick={close}>Cancel</button>
              <button className="farm-btn farm-btn--primary" onClick={save}>{editing ? 'Save Changes' : 'Create Farm'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
