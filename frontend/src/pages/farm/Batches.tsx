import React, { useEffect, useState } from 'react';
import { Activity, Plus, Edit2, Search } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_BATCHES = [
  { id: 'b-1', batchId: 'BR-2026-001', shedId: 'sh-1', shed: { name: 'Broiler Shed A', farm: { name: 'Sharma Poultry Farm' } }, birdType: 'Broiler', breed: 'Cobb 500', initialQuantity: 13000, currentQuantity: 12500, totalMortality: 500, arrivalDate: '2026-07-15', ageInDays: 41, expectedMaturity: '2026-08-30', sourceSupplier: 'Venkateshwara Hatcheries', status: 'Active', notes: 'Targeting average weight 2.2 kg' },
  { id: 'b-2', batchId: 'BR-2026-002', shedId: 'sh-2', shed: { name: 'Broiler Shed B', farm: { name: 'Sharma Poultry Farm' } }, birdType: 'Broiler', breed: 'Ross 308', initialQuantity: 12200, currentQuantity: 11800, totalMortality: 400, arrivalDate: '2026-07-28', ageInDays: 28, expectedMaturity: '2026-09-10', sourceSupplier: 'Suguna Foods', status: 'Active', notes: 'Healthy growth, Starter feed complete' },
  { id: 'b-3', batchId: 'LY-2026-001', shedId: 'sh-3', shed: { name: 'Layer Shed 1', farm: { name: 'GreenValley Layer Farm' } }, birdType: 'Layer', breed: 'BV 300', initialQuantity: 19000, currentQuantity: 18500, totalMortality: 500, arrivalDate: '2026-03-10', ageInDays: 168, expectedMaturity: '2027-03-10', sourceSupplier: 'Hy-Line Hatcheries', status: 'Active', notes: '94% peak lay rate achieved' },
  { id: 'b-4', batchId: 'LY-2026-002', shedId: 'sh-4', shed: { name: 'Layer Shed 2', farm: { name: 'GreenValley Layer Farm' } }, birdType: 'Layer', breed: 'Bovans White', initialQuantity: 14800, currentQuantity: 14200, totalMortality: 600, arrivalDate: '2026-05-01', ageInDays: 116, expectedMaturity: '2027-05-01', sourceSupplier: 'Venkateshwara Hatcheries', status: 'Active', notes: 'Pre-lay stage transitioning to layer feed' }
];

const SAMPLE_SHEDS = [
  { id: 'sh-1', name: 'Broiler Shed A', farm: { name: 'Sharma Poultry Farm' } },
  { id: 'sh-2', name: 'Broiler Shed B', farm: { name: 'Sharma Poultry Farm' } },
  { id: 'sh-3', name: 'Layer Shed 1', farm: { name: 'GreenValley Layer Farm' } },
  { id: 'sh-4', name: 'Layer Shed 2', farm: { name: 'GreenValley Layer Farm' } }
];

const EMPTY = { batchId: '', shedId: '', birdType: 'Broiler', breed: 'Cobb 500', initialQuantity: '', currentQuantity: '', arrivalDate: new Date().toISOString().split('T')[0], ageInDays: '0', expectedMaturity: '', sourceSupplier: '', status: 'Active', notes: '' };

export const Batches: React.FC = () => {
  const [batches, setBatches] = useState<any[]>(SAMPLE_BATCHES);
  const [sheds, setSheds] = useState<any[]>(SAMPLE_SHEDS);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        fetch(`${API}/batches`, { headers: H() }),
        fetch(`${API}/sheds`, { headers: H() })
      ]);
      if (bRes.ok) {
        const bData = await bRes.json();
        if (Array.isArray(bData) && bData.length > 0) setBatches(bData);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData) && sData.length > 0) setSheds(sData);
      }
    } catch {} finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (b: any) => { setForm({ ...b, initialQuantity: String(b.initialQuantity), currentQuantity: String(b.currentQuantity), ageInDays: String(b.ageInDays) }); setEditing(b); setModal(true); };
  const close = () => setModal(false);

  const save = async () => {
    const selectedShed = (Array.isArray(sheds) ? sheds : SAMPLE_SHEDS).find(s => s.id === form.shedId) || SAMPLE_SHEDS[0];
    const body = {
      ...form,
      initialQuantity: Number(form.initialQuantity) || 0,
      currentQuantity: Number(form.currentQuantity) || Number(form.initialQuantity) || 0,
      ageInDays: Number(form.ageInDays) || 0,
      shed: selectedShed
    };

    if (editing) {
      setBatches(prev => prev.map(b => b.id === editing.id ? { ...b, ...body } : b));
      try {
        await fetch(`${API}/batches/${editing.id}`, { method: 'PUT', headers: H(), body: JSON.stringify(body) });
      } catch {}
    } else {
      const newBatch = { ...body, id: `b-${Date.now()}`, totalMortality: 0 };
      setBatches(prev => [newBatch, ...prev]);
      try {
        await fetch(`${API}/batches`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
      } catch {}
    }
    close();
  };

  const safeBatches = Array.isArray(batches) ? batches : SAMPLE_BATCHES;
  const safeSheds = Array.isArray(sheds) ? sheds : SAMPLE_SHEDS;

  const filtered = safeBatches.filter(b =>
    (b.batchId || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.breed || '').toLowerCase().includes(search.toLowerCase()) ||
    (b.shed?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Flocks & Batches</h1>
          <p className="farm-page-subtitle">Track active flock batches, bird age, breed details, and mortality rates</p>
        </div>
        <button className="farm-btn farm-btn--primary" onClick={openNew}>
          <Plus size={15} /> Add Batch
        </button>
      </div>

      <div className="farm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'0.5rem 0.85rem', border:'1px solid rgba(255,255,255,0.09)' }}>
          <Search size={15} color="#94a3b8" />
          <input className="farm-search-input" style={{ background:'none', border:'none', padding:0, minWidth:'180px', color: '#f8fafc' }} placeholder="Search batch ID, breed or shed…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Showing {filtered.length} batch(es)</span>
      </div>

      {loading ? <div className="farm-loading">Loading flock batches...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr><th>Batch ID</th><th>Shed</th><th>Type</th><th>Breed</th><th>Initial</th><th>Live Birds</th><th>Age (Days)</th><th>Mortality</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10}><div className="farm-empty"><Activity size={32} className="farm-empty-icon" /><p>No active batches found.</p></div></td></tr>
              ) : filtered.map(b => {
                const mortRate = b.initialQuantity > 0 ? (( (b.totalMortality || (b.initialQuantity - b.currentQuantity)) / b.initialQuantity) * 100).toFixed(1) : '0';
                return (
                  <tr key={b.id}>
                    <td><span style={{ fontFamily:'monospace', color:'#818cf8', fontWeight:600 }}>{b.batchId}</span></td>
                    <td style={{ fontWeight:600, color:'#f1f5f9' }}>{b.shed?.name || 'Shed 1'}</td>
                    <td><span style={{ fontSize:'0.78rem', color:'#cbd5e1' }}>{b.birdType}</span></td>
                    <td>{b.breed || '—'}</td>
                    <td>{(b.initialQuantity || 0).toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight:600, color:'#34d399' }}>{(b.currentQuantity || 0).toLocaleString('en-IN')}</td>
                    <td>{b.ageInDays || 0} days</td>
                    <td><span style={{ color: Number(mortRate) > 4 ? '#ef4444' : '#f59e0b' }}>{mortRate}%</span></td>
                    <td><span className={`farm-status farm-status--${(b.status || 'Active').toLowerCase()}`}>{b.status || 'Active'}</span></td>
                    <td style={{ textAlign: 'right' }}><button className="farm-btn farm-btn--ghost" style={{ padding:'0.3rem 0.6rem' }} onClick={() => openEdit(b)}><Edit2 size={13} /></button></td>
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
            <h3 className="farm-modal-title">{editing ? 'Edit Batch' : 'Create New Batch'}</h3>
            <div className="farm-form-grid">
              <div className="farm-field"><label className="farm-label">Batch ID *</label>
                <input className="farm-input" placeholder="BR-2026-001" value={form.batchId} onChange={e => setForm({...form, batchId: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Shed *</label>
                <select className="farm-select" value={form.shedId} onChange={e => setForm({...form, shedId: e.target.value})}>
                  <option value="">Select Shed</option>
                  {safeSheds.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select></div>
              <div className="farm-field"><label className="farm-label">Bird Type</label>
                <select className="farm-select" value={form.birdType} onChange={e => setForm({...form, birdType: e.target.value})}>
                  <option>Broiler</option><option>Layer</option><option>Breeder</option>
                </select></div>
              <div className="farm-field"><label className="farm-label">Breed</label>
                <input className="farm-input" placeholder="Cobb 500" value={form.breed} onChange={e => setForm({...form, breed: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Initial Birds</label>
                <input className="farm-input" type="number" value={form.initialQuantity} onChange={e => setForm({...form, initialQuantity: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Arrival Date</label>
                <input className="farm-input" type="date" value={form.arrivalDate} onChange={e => setForm({...form, arrivalDate: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Age in Days</label>
                <input className="farm-input" type="number" value={form.ageInDays} onChange={e => setForm({...form, ageInDays: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Supplier</label>
                <input className="farm-input" placeholder="Venkateshwara Hatcheries" value={form.sourceSupplier} onChange={e => setForm({...form, sourceSupplier: e.target.value})} /></div>
              <div className="farm-field farm-field--full"><label className="farm-label">Notes</label>
                <textarea className="farm-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="farm-modal-actions">
              <button className="farm-btn farm-btn--ghost" onClick={close}>Cancel</button>
              <button className="farm-btn farm-btn--primary" onClick={save}>{editing ? 'Save Changes' : 'Create Batch'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
