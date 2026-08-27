import React, { useEffect, useState } from 'react';
import { Egg, Plus, Search } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_EGGS = [
  { id: 'ep-1', date: '2026-08-25', batch: { batchId: 'LY-2026-001' }, shed: { name: 'Layer Shed 1' }, goodEggs: 17400, damagedEggs: 150, totalEggs: 17550, notes: 'Peak morning collection' },
  { id: 'ep-2', date: '2026-08-25', batch: { batchId: 'LY-2026-002' }, shed: { name: 'Layer Shed 2' }, goodEggs: 12800, damagedEggs: 120, totalEggs: 12920, notes: 'Pre-peak flock production' },
  { id: 'ep-3', date: '2026-08-24', batch: { batchId: 'LY-2026-001' }, shed: { name: 'Layer Shed 1' }, goodEggs: 17350, damagedEggs: 160, totalEggs: 17510, notes: 'All trays packed in store' }
];

const SAMPLE_BATCHES = [
  { id: 'b-3', batchId: 'LY-2026-001', shedId: 'sh-3', shed: { name: 'Layer Shed 1' } },
  { id: 'b-4', batchId: 'LY-2026-002', shedId: 'sh-4', shed: { name: 'Layer Shed 2' } }
];

const EMPTY = { batchId: '', shedId: '', date: new Date().toISOString().split('T')[0], goodEggs: '', damagedEggs: '0', notes: '' };

export const EggProduction: React.FC = () => {
  const [records, setRecords] = useState<any[]>(SAMPLE_EGGS);
  const [batches, setBatches] = useState<any[]>(SAMPLE_BATCHES);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [eRes, bRes] = await Promise.all([
        fetch(`${API}/egg-production`, { headers: H() }),
        fetch(`${API}/batches`, { headers: H() })
      ]);
      if (eRes.ok) {
        const eData = await eRes.json();
        if (Array.isArray(eData) && eData.length > 0) setRecords(eData);
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        if (Array.isArray(bData) && bData.length > 0) setBatches(bData);
      }
    } catch {} finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setModal(true); };
  const close = () => setModal(false);

  const save = async () => {
    const safeBatches = Array.isArray(batches) ? batches : SAMPLE_BATCHES;
    const bMatch = safeBatches.find(b => b.id === form.batchId) || safeBatches[0];
    const good = Number(form.goodEggs) || 0;
    const damaged = Number(form.damagedEggs) || 0;
    const body = {
      ...form,
      batchId: bMatch.id,
      shedId: bMatch.shedId || 'sh-3',
      goodEggs: good,
      damagedEggs: damaged,
      totalEggs: good + damaged,
      batch: { batchId: bMatch.batchId },
      shed: bMatch.shed || { name: 'Layer Shed 1' }
    };

    const newRec = { ...body, id: `ep-${Date.now()}` };
    setRecords(prev => [newRec, ...prev]);

    try {
      await fetch(`${API}/egg-production`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
    } catch {}
    close();
  };

  const safeRecords = Array.isArray(records) ? records : SAMPLE_EGGS;

  const filtered = safeRecords.filter(r =>
    (r.batch?.batchId || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.shed?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.date || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Daily Egg Production</h1>
          <p className="farm-page-subtitle">Track egg collection yields, good eggs, damaged counts, and tray packing</p>
        </div>
        <button className="farm-btn farm-btn--primary" onClick={openNew}>
          <Plus size={15} /> Record Egg Collection
        </button>
      </div>

      <div className="farm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'0.5rem 0.85rem', border:'1px solid rgba(255,255,255,0.09)' }}>
          <Search size={15} color="#94a3b8" />
          <input className="farm-search-input" style={{ background:'none', border:'none', padding:0, minWidth:'180px', color: '#f8fafc' }} placeholder="Search batch ID, date or shed…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Showing {filtered.length} record(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading egg production logs...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr><th>Date</th><th>Batch ID</th><th>Shed</th><th>Good Eggs</th><th>Damaged</th><th>Total Eggs</th><th>Trays (30s)</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="farm-empty"><Egg size={32} className="farm-empty-icon" /><p>No egg production logs recorded.</p></div></td></tr>
              ) : filtered.map(r => {
                const total = r.totalEggs || ((r.goodEggs || 0) + (r.damagedEggs || 0));
                const trays = Math.floor((r.goodEggs || 0) / 30);
                return (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td><span style={{ fontFamily:'monospace', color:'#818cf8', fontWeight:600 }}>{r.batch?.batchId || 'LY-2026-001'}</span></td>
                    <td>{r.shed?.name || 'Layer Shed 1'}</td>
                    <td style={{ fontWeight:700, color:'#34d399' }}>{(r.goodEggs || 0).toLocaleString('en-IN')}</td>
                    <td style={{ color:'#ef4444' }}>{(r.damagedEggs || 0).toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight:700, color:'#f1f5f9' }}>{(total || 0).toLocaleString('en-IN')}</td>
                    <td><span style={{ backgroundColor:'rgba(139,92,246,0.18)', color:'#c084fc', padding:'2px 8px', borderRadius:'6px', fontSize:'0.8rem', fontWeight:600 }}>{trays} trays</span></td>
                    <td><span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>{r.notes || '—'}</span></td>
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
            <h3 className="farm-modal-title">Record Egg Collection</h3>
            <div className="farm-form-grid">
              <div className="farm-field"><label className="farm-label">Date *</label>
                <input className="farm-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Layer Flock Batch *</label>
                <select className="farm-select" value={form.batchId} onChange={e => setForm({...form, batchId: e.target.value})}>
                  <option value="">Select Layer Batch</option>
                  {(Array.isArray(batches) ? batches : SAMPLE_BATCHES).map(b => <option key={b.id} value={b.id}>{b.batchId} ({b.shed?.name || 'Shed'})</option>)}
                </select></div>
              <div className="farm-field"><label className="farm-label">Good Eggs Count *</label>
                <input className="farm-input" type="number" placeholder="15000" value={form.goodEggs} onChange={e => setForm({...form, goodEggs: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Damaged / Cracked Eggs</label>
                <input className="farm-input" type="number" placeholder="100" value={form.damagedEggs} onChange={e => setForm({...form, damagedEggs: e.target.value})} /></div>
              <div className="farm-field farm-field--full"><label className="farm-label">Notes</label>
                <textarea className="farm-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="farm-modal-actions">
              <button className="farm-btn farm-btn--ghost" onClick={close}>Cancel</button>
              <button className="farm-btn farm-btn--primary" onClick={save}>Save Collection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
