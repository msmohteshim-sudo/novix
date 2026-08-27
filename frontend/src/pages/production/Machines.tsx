import React, { useState } from 'react';
import { Plus, X, Search, Activity, PowerOff, AlertTriangle } from 'lucide-react';
import '../dashboard/dashboard.css';

const initialMachines = [
  { id: '943157B7', name: 'Weaving Loom M-01', type: 'Weaving Loom', status: 'Running', operator: 'John Doe', lastMaintenance: '2026-07-15' },
  { id: 'FF7A8D82', name: 'Weaving Loom M-02', type: 'Weaving Loom', status: 'Idle', operator: 'Jane Smith', lastMaintenance: '2026-07-10' },
  { id: 'BC770B1D', name: 'Dyeing Vat D-01', type: 'Dyeing Machine', status: 'Maintenance', operator: '-', lastMaintenance: '2026-08-14' },
  { id: '8022493A', name: 'Spinning Machine S-01', type: 'Spinning Machine', status: 'Running', operator: 'Robert Johnson', lastMaintenance: '2026-08-01' },
  { id: 'A1B2C3D4', name: 'Embroidery Unit E-05', type: 'Embroidery Machine', status: 'Running', operator: 'Maria Garcia', lastMaintenance: '2026-07-28' },
  { id: 'E5F6G7H8', name: 'Fabric Cutter C-02', type: 'Cutting Machine', status: 'Offline', operator: '-', lastMaintenance: '2026-05-20' },
  { id: 'I9J0K1L2', name: 'Knitting Machine K-01', type: 'Knitting Machine', status: 'Running', operator: 'David Chen', lastMaintenance: '2026-08-10' },
  { id: 'M3N4O5P6', name: 'Drying Stenter DS-01', type: 'Finishing Machine', status: 'Running', operator: 'Sarah Jenkins', lastMaintenance: '2026-08-05' },
];

export const Machines: React.FC = () => {
  const [machines, setMachines] = useState<any[]>(initialMachines);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newMachine, setNewMachine] = useState({
    name: '', type: 'Weaving Loom', status: 'Running', operator: '', lastMaintenance: ''
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.random().toString(16).substring(2, 10).toUpperCase();
    
    setMachines([{ id: newId, ...newMachine }, ...machines]);
    setShowAddModal(false);
    setNewMachine({ name: '', type: 'Weaving Loom', status: 'Running', operator: '', lastMaintenance: '' });
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Running': return 'success';
      case 'Maintenance': return 'warning';
      case 'Offline': return 'danger';
      case 'Idle': return 'idle';
      default: return 'idle';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Running': return <Activity size={14} style={{ marginRight: '4px' }} />;
      case 'Maintenance': return <AlertTriangle size={14} style={{ marginRight: '4px' }} />;
      case 'Offline': return <PowerOff size={14} style={{ marginRight: '4px' }} />;
      default: return null;
    }
  };

  const filteredMachines = machines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Machines & Equipment</h1>
          <p className="erp-page-subtitle">Monitor factory machinery status</p>
        </div>
        <div className="erp-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input 
              type="text" 
              className="erp-input" 
              placeholder="Search ID, Name, or Type..." 
              style={{ paddingLeft: '32px', width: '250px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="erp-btn erp-btn-outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="erp-btn erp-btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} style={{marginRight: '8px'}} /> Add Machine
          </button>
        </div>
      </div>

      <div className="erp-panel-grid" style={{ marginBottom: '2rem' }}>
        <div className="erp-panel">
          <div className="erp-panel-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '8px' }}>
              <Activity size={28} />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Running</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{machines.filter(m => m.status === 'Running').length}</div>
            </div>
          </div>
        </div>
        <div className="erp-panel">
          <div className="erp-panel-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', color: '#d97706', borderRadius: '8px' }}>
              <AlertTriangle size={28} />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>In Maintenance</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{machines.filter(m => m.status === 'Maintenance').length}</div>
            </div>
          </div>
        </div>
        <div className="erp-panel">
          <div className="erp-panel-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
              <PowerOff size={28} />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Offline</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{machines.filter(m => m.status === 'Offline').length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="erp-panel-grid">
        <div className="erp-panel col-span-12">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Equipment List</h3>
          </div>
          <div className="erp-panel-content" style={{padding: 0, overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px'}}>
              <thead style={{backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                <tr>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Machine ID</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Name & Type</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Current Operator</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Last Maintenance</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMachines.map((m: any) => (
                  <tr key={m.id} style={{borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s'}} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{padding: '16px', fontFamily: 'monospace', fontSize: '1.05rem', color: '#334155'}}>
                      <strong>{m.id}</strong>
                    </td>
                    <td style={{padding: '16px'}}>
                      <div style={{ fontWeight: 500, color: '#0f172a' }}>{m.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>{m.type}</div>
                    </td>
                    <td style={{padding: '16px', color: '#475569'}}>{m.operator || '-'}</td>
                    <td style={{padding: '16px', color: '#475569'}}>{m.lastMaintenance || '-'}</td>
                    <td style={{padding: '16px'}}>
                      <span className={`erp-status-badge ${getStatusClass(m.status)}`} style={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                        {getStatusIcon(m.status)} {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredMachines.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      No machines found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="erp-modal-backdrop">
          <div className="erp-modal">
            <div className="erp-modal-header">
              <h2 className="erp-modal-title">Register New Machine</h2>
              <button className="erp-btn erp-btn-outline" style={{ padding: '4px' }} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-content">
              <form onSubmit={handleAddMachine} style={{ display: 'grid', gap: '1rem' }}>
                <div className="erp-form-group">
                  <label>Machine Name</label>
                  <input type="text" className="erp-input" required placeholder="e.g. Weaving Loom M-03" 
                    value={newMachine.name} onChange={e => setNewMachine({...newMachine, name: e.target.value})} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="erp-form-group">
                    <label>Machine Type</label>
                    <select className="erp-input" value={newMachine.type} onChange={e => setNewMachine({...newMachine, type: e.target.value})}>
                      <option>Weaving Loom</option>
                      <option>Spinning Machine</option>
                      <option>Dyeing Machine</option>
                      <option>Knitting Machine</option>
                      <option>Embroidery Machine</option>
                      <option>Cutting Machine</option>
                      <option>Finishing Machine</option>
                    </select>
                  </div>
                  <div className="erp-form-group">
                    <label>Initial Status</label>
                    <select className="erp-input" value={newMachine.status} onChange={e => setNewMachine({...newMachine, status: e.target.value})}>
                      <option value="Running">Running</option>
                      <option value="Idle">Idle</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="erp-form-group">
                    <label>Current Operator (Optional)</label>
                    <input type="text" className="erp-input" placeholder="e.g. John Doe"
                      value={newMachine.operator} onChange={e => setNewMachine({...newMachine, operator: e.target.value})} />
                  </div>
                  <div className="erp-form-group">
                    <label>Date Installed / Last Maintenance</label>
                    <input type="date" className="erp-input" required
                      value={newMachine.lastMaintenance} onChange={e => setNewMachine({...newMachine, lastMaintenance: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="erp-btn erp-btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="erp-btn erp-btn-primary">Register Machine</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
