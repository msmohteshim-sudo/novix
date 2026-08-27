import React, { useEffect, useState } from 'react';
import { Syringe, Plus, Search } from 'lucide-react';
import './farm.css';

const API = 'http://localhost:5000/api/farm';
const H = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` });

const SAMPLE_VACCINATIONS = [
  { id: 'v-1', date: '2026-07-16', vaccineName: 'Marek Disease Vaccine (HVT)', batch: { batchId: 'BR-2026-001' }, birdAge: 1, nextDueDate: '2026-07-22', veterinarian: 'Dr. Ramesh Kulkarni', notes: 'Subcutaneous injection at day 1 in hatchery' },
  { id: 'v-2', date: '2026-07-22', vaccineName: 'Newcastle Disease (LaSota)', batch: { batchId: 'BR-2026-001' }, birdAge: 7, nextDueDate: '2026-08-05', veterinarian: 'Dr. Ramesh Kulkarni', notes: 'Administered via drinking water' },
  { id: 'v-3', date: '2026-07-29', vaccineName: 'Infectious Bursal Disease (IBD Gumboro)', batch: { batchId: 'BR-2026-001' }, birdAge: 14, nextDueDate: '2026-08-20', veterinarian: 'Dr. Ramesh Kulkarni', notes: 'Eye drop administration completed' },
  { id: 'v-4', date: '2026-08-05', vaccineName: 'Fowl Pox Vaccine', batch: { batchId: 'BR-2026-002' }, birdAge: 9, nextDueDate: '2026-08-30', veterinarian: 'Dr. Priya Patil', notes: 'Wing web stab method' }
];

const SAMPLE_BATCHES = [
  { id: 'b-1', batchId: 'BR-2026-001' },
  { id: 'b-2', batchId: 'BR-2026-002' },
  { id: 'b-3', batchId: 'LY-2026-001' }
];

const EMPTY = { batchId: '', vaccineName: 'Newcastle Disease (LaSota)', date: new Date().toISOString().split('T')[0], nextDueDate: '', birdAge: '7', veterinarian: 'Dr. Ramesh Kulkarni', notes: '' };

export const Vaccinations: React.FC = () => {
  const [records, setRecords] = useState<any[]>(SAMPLE_VACCINATIONS);
  const [batches, setBatches] = useState<any[]>(SAMPLE_BATCHES);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [vRes, bRes] = await Promise.all([
        fetch(`${API}/vaccinations`, { headers: H() }),
        fetch(`${API}/batches`, { headers: H() })
      ]);
      if (vRes.ok) {
        const vData = await vRes.json();
        if (Array.isArray(vData) && vData.length > 0) setRecords(vData);
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
      birdAge: Number(form.birdAge) || 0,
      batch: { batchId: bMatch.batchId }
    };

    const newRec = { ...body, id: `v-${Date.now()}` };
    setRecords(prev => [newRec, ...prev]);

    try {
      await fetch(`${API}/vaccinations`, { method: 'POST', headers: H(), body: JSON.stringify(body) });
    } catch {}
    close();
  };

  const safeRecords = Array.isArray(records) ? records : SAMPLE_VACCINATIONS;

  const filtered = safeRecords.filter(r =>
    (r.vaccineName || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.batch?.batchId || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.veterinarian || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="farm-page">
      <div className="farm-page-header">
        <div>
          <h1 className="farm-page-title">Vaccination & Medication Schedule</h1>
          <p className="farm-page-subtitle">Track poultry vaccination doses, booster schedules, and veterinarian approvals</p>
        </div>
        <button className="farm-btn farm-btn--primary" onClick={openNew}>
          <Plus size={15} /> Log Vaccination
        </button>
      </div>

      <div className="farm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'0.5rem 0.85rem', border:'1px solid rgba(255,255,255,0.09)' }}>
          <Search size={15} color="#94a3b8" />
          <input className="farm-search-input" style={{ background:'none', border:'none', padding:0, minWidth:'180px', color: '#f8fafc' }} placeholder="Search vaccine name, batch ID, or vet…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>Showing {filtered.length} record(s)</span>
      </div>

      {loading ? <div className="farm-loading">Loading vaccination logs...</div> : (
        <div className="farm-table-wrapper">
          <table className="farm-table">
            <thead>
              <tr><th>Vaccination Date</th><th>Vaccine Name</th><th>Batch ID</th><th>Bird Age</th><th>Next Due Date</th><th>Veterinarian</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}><div className="farm-empty"><Syringe size={32} className="farm-empty-icon" /><p>No vaccination records found.</p></div></td></tr>
              ) : filtered.map(r => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td style={{ fontWeight:600, color:'#f1f5f9' }}>{r.vaccineName}</td>
                  <td><span style={{ fontFamily:'monospace', color:'#818cf8', fontWeight:600 }}>{r.batch?.batchId || 'BR-2026-001'}</span></td>
                  <td>Day {r.birdAge || 1}</td>
                  <td style={{ color:'#38bdf8' }}>{r.nextDueDate || '—'}</td>
                  <td>{r.veterinarian || 'Dr. Ramesh Kulkarni'}</td>
                  <td><span style={{ color:'#94a3b8', fontSize:'0.82rem' }}>{r.notes || '—'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="farm-modal-overlay" onClick={close}>
          <div className="farm-modal" onClick={e => e.stopPropagation()}>
            <h3 className="farm-modal-title">Log Vaccination Record</h3>
            <div className="farm-form-grid">
              <div className="farm-field"><label className="farm-label">Vaccination Date *</label>
                <input className="farm-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Vaccine Name *</label>
                <input className="farm-input" placeholder="Newcastle Disease (LaSota)" value={form.vaccineName} onChange={e => setForm({...form, vaccineName: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Flock Batch *</label>
                <select className="farm-select" value={form.batchId} onChange={e => setForm({...form, batchId: e.target.value})}>
                  <option value="">Select Batch</option>
                  {(Array.isArray(batches) ? batches : SAMPLE_BATCHES).map(b => <option key={b.id} value={b.id}>{b.batchId}</option>)}
                </select></div>
              <div className="farm-field"><label className="farm-label">Bird Age (Days)</label>
                <input className="farm-input" type="number" placeholder="7" value={form.birdAge} onChange={e => setForm({...form, birdAge: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Next Booster Due Date</label>
                <input className="farm-input" type="date" value={form.nextDueDate} onChange={e => setForm({...form, nextDueDate: e.target.value})} /></div>
              <div className="farm-field"><label className="farm-label">Attending Veterinarian</label>
                <input className="farm-input" placeholder="Dr. Ramesh Kulkarni" value={form.veterinarian} onChange={e => setForm({...form, veterinarian: e.target.value})} /></div>
              <div className="farm-field farm-field--full"><label className="farm-label">Notes</label>
                <textarea className="farm-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
            </div>
            <div className="farm-modal-actions">
              <button className="farm-btn farm-btn--ghost" onClick={close}>Cancel</button>
              <button className="farm-btn farm-btn--primary" onClick={save}>Log Vaccination</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
