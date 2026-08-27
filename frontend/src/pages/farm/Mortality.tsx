import React, { useEffect, useState } from 'react';
import { Heart, Plus, Search } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_MORTALITY = [
  { id: 'm-1', date: '2026-08-25', batch: { batchId: 'BR-2026-004', shed: { name: 'Broiler Shed A' } }, quantity: 12, reason: 'Natural / Heat Stress', notes: 'Recorded during morning 8:00 AM inspection', recordedBy: { firstName: 'Ramesh', lastName: 'Pawar' } },
  { id: 'm-2', date: '2026-08-25', batch: { batchId: 'BR-2026-005', shed: { name: 'Broiler Shed B' } }, quantity: 8, reason: 'Natural', notes: 'Routine daily mortality', recordedBy: { firstName: 'Ramesh', lastName: 'Pawar' } },
  { id: 'm-3', date: '2026-08-25', batch: { batchId: 'LY-2025-012', shed: { name: 'Layer Shed C' } }, quantity: 6, reason: 'Age related', notes: 'Normal culling in week 20 lay', recordedBy: { firstName: 'Anil', lastName: 'Kumar' } },
  { id: 'm-4', date: '2026-08-24', batch: { batchId: 'BR-2026-004', shed: { name: 'Broiler Shed A' } }, quantity: 10, reason: 'Trampling', notes: 'Disinfected feeding area', recordedBy: { firstName: 'Ramesh', lastName: 'Pawar' } },
  { id: 'm-5', date: '2026-08-24', batch: { batchId: 'BR-2026-005', shed: { name: 'Broiler Shed B' } }, quantity: 14, reason: 'Heat Stress', notes: 'High afternoon temp recorded', recordedBy: { firstName: 'Suresh', lastName: 'Patil' } },
  { id: 'm-6', date: '2026-08-23', batch: { batchId: 'LY-2025-013', shed: { name: 'Layer Shed D' } }, quantity: 4, reason: 'Natural', notes: 'Routine check', recordedBy: { firstName: 'Anil', lastName: 'Kumar' } },
  { id: 'm-7', date: '2026-08-22', batch: { batchId: 'BR-2026-004', shed: { name: 'Broiler Shed A' } }, quantity: 7, reason: 'Natural', notes: 'Normal mortality curve', recordedBy: { firstName: 'Ramesh', lastName: 'Pawar' } },
];

const SAMPLE_BATCHES = [
  { id: 'b-1', batchId: 'BR-2026-004', shed: { name: 'Broiler Shed A' } },
  { id: 'b-2', batchId: 'BR-2026-005', shed: { name: 'Broiler Shed B' } },
  { id: 'b-3', batchId: 'LY-2025-012', shed: { name: 'Layer Shed C' } }
];

const EMPTY = { batchId: '', date: new Date().toISOString().split('T')[0], quantity: '', reason: 'Natural', notes: '' };

export const Mortality: React.FC = () => {
  const [records, setRecords] = useState<any[]>(SAMPLE_MORTALITY);
  const [batches, setBatches] = useState<any[]>(SAMPLE_BATCHES);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [mRes, bRes] = await Promise.all([
        fetch(`${API}/mortality`, { headers: H() }),
        fetch(`${API}/batches`, { headers: H() })
      ]);
      if (mRes.ok) {
        const mData = await mRes.json();
        if (Array.isArray(mData) && mData.length > 0) setRecords(mData);
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
      quantity: Number(form.quantity) || 0,
      batch: { batchId: bMatch.batchId, shed: bMatch.shed || { name: 'Shed 1' } }
    };

    const newRec = { ...body, id: `m-${Date.now()}`, recordedBy: { firstName: 'Shed', lastName: 'Supervisor' } };
    setRecords(prev => [newRec, ...prev]);

    try {
      await fetch(`${API}/mortality`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
    } catch {}
    close();
  };

  const safeRecords = Array.isArray(records) ? records : SAMPLE_MORTALITY;

  const filtered = safeRecords.filter(r =>
    (r.reason || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.batch?.batchId || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.date || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.batch?.shed?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Mortality Tracking</h1>
          <p className="farm-page-subtitle">Record daily bird mortalities and monitor flock health status</p>
        </div>
        <button className="pf-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }} onClick={openNew}>
          <Plus size={16} /> Log Mortality
        </button>
      </div>

      <div className="farm-toolbar">
        <div className="farm-search-box">
          <Search size={16} color="#64748b" />
          <input
            className="farm-search-input"
            placeholder="Search batch ID, shed, date or reason…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>Showing {filtered.length} record(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading mortality records...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Batch ID</th>
                <th>Shed Location</th>
                <th>Birds Dead</th>
                <th>Reason / Cause</th>
                <th>Recorded By</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><div className="farm-empty"><Heart size={32} className="farm-empty-icon" /><p>No mortality records logged.</p></div></td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: '#475569' }}>{r.date}</td>
                  <td><span style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 700 }}>{r.batch?.batchId || 'BR-2026-004'}</span></td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{r.batch?.shed?.name || 'Shed A'}</td>
                  <td style={{ fontWeight: 800, color: '#dc2626' }}>{r.quantity} birds</td>
                  <td><span className="pf-badge critical">{r.reason || 'Natural'}</span></td>
                  <td style={{ color: '#334155', fontWeight: 600 }}>{r.recordedBy ? `${r.recordedBy.firstName} ${r.recordedBy.lastName}` : 'Supervisor'}</td>
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
              <h3 className="pf-modal-title">Record Bird Mortality</h3>
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
              <div className="pf-field"><label className="pf-label">Number of Dead Birds *</label>
                <input className="pf-input" type="number" placeholder="10" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
              <div className="pf-field"><label className="pf-label">Reason / Diagnosis</label>
                <select className="pf-select" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}>
                  <option>Natural</option>
                  <option>Heat Stress</option>
                  <option>Disease / Infection</option>
                  <option>Injury / Trampling</option>
                  <option>Unknown</option>
                </select></div>
              <div className="pf-field pf-field--full"><label className="pf-label">Notes</label>
                <textarea className="pf-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="pf-modal-footer">
              <button className="pf-btn-secondary" onClick={close}>Cancel</button>
              <button className="pf-btn-primary" onClick={save}>Log Mortality</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
