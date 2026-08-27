import React, { useEffect, useState } from 'react';
import { Stethoscope, Plus, Search } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_CONSUMPTION = [
  { id: 'fc-1', date: '2026-08-25', batch: { batchId: 'BR-2026-004' }, shed: { name: 'Broiler Shed A' }, feedType: 'Broiler Finisher Pellets', quantityKg: 650, notes: 'Morning feed intake (120g/bird)' },
  { id: 'fc-2', date: '2026-08-25', batch: { batchId: 'BR-2026-005' }, shed: { name: 'Broiler Shed B' }, feedType: 'Broiler Starter Crumbles', quantityKg: 420, notes: 'Starter feed week 4' },
  { id: 'fc-3', date: '2026-08-25', batch: { batchId: 'LY-2025-012' }, shed: { name: 'Layer Shed C' }, feedType: 'Layer Mash Phase 1', quantityKg: 1100, notes: '110g per bird daily average' },
  { id: 'fc-4', date: '2026-08-25', batch: { batchId: 'LY-2025-013' }, shed: { name: 'Layer Shed D' }, feedType: 'Layer Mash Phase 2', quantityKg: 950, notes: 'Peak lay phase intake' },
  { id: 'fc-5', date: '2026-08-24', batch: { batchId: 'BR-2026-004' }, shed: { name: 'Broiler Shed A' }, feedType: 'Broiler Finisher Pellets', quantityKg: 640, notes: 'Evening feed recorded' },
  { id: 'fc-6', date: '2026-08-24', batch: { batchId: 'BR-2026-005' }, shed: { name: 'Broiler Shed B' }, feedType: 'Broiler Starter Crumbles', quantityKg: 415, notes: 'Normal growth intake' },
  { id: 'fc-7', date: '2026-08-24', batch: { batchId: 'BD-2026-001' }, shed: { name: 'Breeder Shed 1' }, feedType: 'Breeder Male Concentrate', quantityKg: 320, notes: 'Breeder ration allocation' },
  { id: 'fc-8', date: '2026-08-23', batch: { batchId: 'LY-2025-012' }, shed: { name: 'Layer Shed C' }, feedType: 'Layer Mash Phase 1', quantityKg: 1080, notes: 'Standard daily distribution' },
];

const SAMPLE_BATCHES = [
  { id: 'b-1', batchId: 'BR-2026-004', shedId: 'sh-1', shed: { name: 'Broiler Shed A' } },
  { id: 'b-2', batchId: 'BR-2026-005', shedId: 'sh-2', shed: { name: 'Broiler Shed B' } },
  { id: 'b-3', batchId: 'LY-2025-012', shedId: 'sh-3', shed: { name: 'Layer Shed C' } },
  { id: 'b-4', batchId: 'LY-2025-013', shedId: 'sh-4', shed: { name: 'Layer Shed D' } }
];

const EMPTY = { batchId: '', shedId: '', date: new Date().toISOString().split('T')[0], feedType: 'Broiler Starter Crumbles', quantityKg: '', notes: '' };

export const FeedConsumption: React.FC = () => {
  const [records, setRecords] = useState<any[]>(SAMPLE_CONSUMPTION);
  const [batches, setBatches] = useState<any[]>(SAMPLE_BATCHES);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [cRes, bRes] = await Promise.all([
        fetch(`${API}/feed-consumption`, { headers: H() }),
        fetch(`${API}/batches`, { headers: H() })
      ]);
      if (cRes.ok) {
        const cData = await cRes.json();
        if (Array.isArray(cData) && cData.length > 0) setRecords(cData);
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
    const body = {
      ...form,
      batchId: bMatch.id,
      shedId: bMatch.shedId || 'sh-1',
      quantityKg: Number(form.quantityKg) || 0,
      batch: { batchId: bMatch.batchId },
      shed: bMatch.shed || { name: 'Broiler Shed A' }
    };

    const newRec = { ...body, id: `fc-${Date.now()}` };
    setRecords(prev => [newRec, ...prev]);

    try {
      await fetch(`${API}/feed-consumption`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
    } catch {}
    close();
  };

  const safeRecords = Array.isArray(records) ? records : SAMPLE_CONSUMPTION;

  const filtered = safeRecords.filter(r =>
    (r.feedType || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.batch?.batchId || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.date || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.shed?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Daily Feed Consumption</h1>
          <p className="farm-page-subtitle">Track daily feed distribution across sheds and flocks</p>
        </div>
        <button className="pf-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }} onClick={openNew}>
          <Plus size={16} /> Log Feed Entry
        </button>
      </div>

      <div className="farm-toolbar">
        <div className="farm-search-box">
          <Search size={16} color="#64748b" />
          <input
            className="farm-search-input"
            placeholder="Search batch ID, shed, date or feed type…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>Showing {filtered.length} record(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading consumption records...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Batch ID</th>
                <th>Shed Location</th>
                <th>Feed Type Distributed</th>
                <th>Quantity (kg)</th>
                <th>Operational Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}><div className="farm-empty"><Stethoscope size={32} className="farm-empty-icon" /><p>No consumption logs found.</p></div></td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: '#475569' }}>{r.date}</td>
                  <td><span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 700 }}>{r.batch?.batchId || 'BR-2026-004'}</span></td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{r.shed?.name || 'Broiler Shed A'}</td>
                  <td style={{ fontWeight: 600, color: '#334155' }}>{r.feedType}</td>
                  <td style={{ fontWeight: 800, color: '#d97706' }}>{(r.quantityKg || 0).toLocaleString('en-IN')} kg</td>
                  <td><span style={{ color: '#64748b', fontSize: '0.82rem' }}>{r.notes || '—'}</span></td>
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
              <h3 className="pf-modal-title">Log Daily Feed Consumption</h3>
              <button className="pf-modal-close" onClick={close}>&times;</button>
            </div>
            <div className="pf-form-grid">
              <div className="pf-field"><label className="pf-label">Date *</label>
                <input className="pf-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Flock Batch *</label>
                <select className="pf-select" value={form.batchId} onChange={e => setForm({...form, batchId: e.target.value})}>
                  <option value="">Select Batch</option>
                  {(Array.isArray(batches) ? batches : SAMPLE_BATCHES).map(b => <option key={b.id} value={b.id}>{b.batchId} ({b.shed?.name || 'Shed'})</option>)}
                </select></div>
              <div className="pf-field"><label className="pf-label">Feed Type</label>
                <select className="pf-select" value={form.feedType} onChange={e => setForm({...form, feedType: e.target.value})}>
                  <option>Broiler Starter Crumbles</option>
                  <option>Broiler Finisher Pellets</option>
                  <option>Layer Mash Phase 1</option>
                  <option>Layer Mash Phase 2</option>
                  <option>Breeder Male Concentrate</option>
                </select></div>
              <div className="pf-field"><label className="pf-label">Quantity (kg) *</label>
                <input className="pf-input" type="number" placeholder="500" value={form.quantityKg} onChange={e => setForm({...form, quantityKg: e.target.value})} /></div>
              <div className="pf-field pf-field--full"><label className="pf-label">Operational Notes</label>
                <textarea className="pf-textarea" placeholder="e.g. Normal morning feed intake" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="pf-modal-footer">
              <button className="pf-btn-secondary" onClick={close}>Cancel</button>
              <button className="pf-btn-primary" onClick={save}>Log Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
