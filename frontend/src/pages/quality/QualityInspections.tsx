import React, { useState } from 'react';
import { ShieldCheck, Plus, CheckCircle, XCircle, AlertTriangle, Search, X } from 'lucide-react';
import '../dashboard/dashboard.css';

const initialInspections = [
  {
    id: 'QI-7392',
    workOrder: 'WO-1054',
    product: 'Premium Cotton Yarn',
    batch: 'B-8821',
    inspector: 'Sarah Jenkins',
    date: '2026-08-14T09:30:00Z',
    metrics: {
      tensileStrength: 'Pass (4.2g/D)',
      dyePenetration: 'Pass (98%)',
      threadCount: 'Pass'
    },
    status: 'Passed',
    notes: 'Excellent consistency across the batch. Ready for dispatch.'
  },
  {
    id: 'QI-7391',
    workOrder: 'WO-1052',
    product: 'Silk Blend Fabric',
    batch: 'B-8819',
    inspector: 'David Chen',
    date: '2026-08-13T14:15:00Z',
    metrics: {
      tensileStrength: 'Pass (3.8g/D)',
      dyePenetration: 'Fail (82%)',
      threadCount: 'Pass'
    },
    status: 'Failed',
    notes: 'Dye penetration below 90% threshold. Sent for reprocessing in Vat 4.'
  },
  {
    id: 'QI-7390',
    workOrder: 'WO-1051',
    product: 'Polyester Thread',
    batch: 'B-8815',
    inspector: 'Maria Garcia',
    date: '2026-08-13T10:05:00Z',
    metrics: {
      tensileStrength: 'Pass (5.1g/D)',
      dyePenetration: 'Pass (95%)',
      threadCount: 'Pass'
    },
    status: 'Passed',
    notes: 'Standard quality.'
  },
  {
    id: 'QI-7389',
    workOrder: 'WO-1050',
    product: 'Denim Twill',
    batch: 'B-8812',
    inspector: 'Sarah Jenkins',
    date: '2026-08-12T16:45:00Z',
    metrics: {
      tensileStrength: 'Pass (6.5g/D)',
      dyePenetration: 'Pass (99%)',
      threadCount: 'Pass'
    },
    status: 'Passed',
    notes: 'Exceeds standard requirements. Exceptional batch.'
  },
  {
    id: 'QI-7388',
    workOrder: 'WO-1049',
    product: 'Organic Linen',
    batch: 'B-8805',
    inspector: 'David Chen',
    date: '2026-08-12T11:20:00Z',
    metrics: {
      tensileStrength: 'Warning (3.1g/D)',
      dyePenetration: 'Pass (94%)',
      threadCount: 'Fail'
    },
    status: 'Pending',
    notes: 'Awaiting secondary review from Quality Manager. Potential loom calibration issue.'
  }
];

export const QualityInspections: React.FC = () => {
  const [inspections, setInspections] = useState(initialInspections);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [newInspection, setNewInspection] = useState({
    workOrder: '', product: '', batch: '', inspector: 'Sarah Jenkins',
    tensileStrength: '', dyePenetration: '', threadCount: '',
    status: 'Passed', notes: ''
  });

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const nextId = Math.max(...inspections.map(i => parseInt(i.id.split('-')[1]))) + 1;
    
    const inspectionRecord = {
      id: `QI-${nextId}`,
      workOrder: newInspection.workOrder,
      product: newInspection.product,
      batch: newInspection.batch,
      inspector: newInspection.inspector,
      date: new Date().toISOString(),
      metrics: {
        tensileStrength: newInspection.tensileStrength || 'Pass',
        dyePenetration: newInspection.dyePenetration || 'Pass',
        threadCount: newInspection.threadCount || 'Pass'
      },
      status: newInspection.status,
      notes: newInspection.notes || 'Routine check completed.'
    };

    setInspections([inspectionRecord, ...inspections]);
    setShowModal(false);
    setNewInspection({
      workOrder: '', product: '', batch: '', inspector: 'Sarah Jenkins',
      tensileStrength: '', dyePenetration: '', threadCount: '', status: 'Passed', notes: ''
    });
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Passed': return 'success';
      case 'Failed': return 'danger';
      case 'Pending': return 'warning';
      default: return 'idle';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Passed': return <CheckCircle size={14} style={{ marginRight: '4px' }} />;
      case 'Failed': return <XCircle size={14} style={{ marginRight: '4px' }} />;
      case 'Pending': return <AlertTriangle size={14} style={{ marginRight: '4px' }} />;
      default: return null;
    }
  };

  const filteredInspections = inspections.filter(i => 
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Quality Control</h1>
          <p className="erp-page-subtitle">Track and manage product quality inspections for Avenza Textiles</p>
        </div>
        <div className="erp-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input 
              type="text" 
              className="erp-input" 
              placeholder="Search ID, Product, Batch..." 
              style={{ paddingLeft: '32px', width: '250px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="erp-btn erp-btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} style={{marginRight: '8px'}} /> New Inspection
          </button>
        </div>
      </div>

      <div className="erp-panel-grid" style={{ marginBottom: '2rem' }}>
        <div className="erp-panel">
          <div className="erp-panel-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <div style={{ padding: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', borderRadius: '8px' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Inspections (This Week)</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{inspections.length + 119}</div>
            </div>
          </div>
        </div>
        <div className="erp-panel">
          <div className="erp-panel-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <div style={{ padding: '12px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '8px' }}>
              <CheckCircle size={28} />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Pass Rate</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
                {((inspections.filter(i => i.status === 'Passed').length / inspections.length) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
        <div className="erp-panel">
          <div className="erp-panel-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px' }}>
              <XCircle size={28} />
            </div>
            <div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Critical Failures</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{inspections.filter(i => i.status === 'Failed').length + 3}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="erp-panel-grid">
        <div className="erp-panel col-span-12">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Quality Inspection Log</h3>
          </div>
          <div className="erp-panel-content" style={{padding: 0, overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px'}}>
              <thead style={{backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                <tr>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem'}}>Inspection Details</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem'}}>Product & Batch</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem'}}>Textile Metrics</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem'}}>Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.map((i) => (
                  <tr key={i.id} style={{borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s'}} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{padding: '16px', verticalAlign: 'top'}}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: '#0f172a' }}>{i.id}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{i.workOrder}</span>
                      </div>
                      <div style={{fontSize: '0.85rem', color: '#64748b', marginTop: '4px'}}>{new Date(i.date).toLocaleString()}</div>
                      <div style={{fontSize: '0.85rem', color: '#64748b', marginTop: '2px'}}>Inspector: {i.inspector}</div>
                    </td>
                    <td style={{padding: '16px', verticalAlign: 'top'}}>
                      <strong style={{ color: '#334155' }}>{i.product}</strong>
                      <div style={{fontSize: '0.85rem', color: '#64748b', marginTop: '4px'}}>Batch: {i.batch}</div>
                    </td>
                    <td style={{padding: '16px', verticalAlign: 'top'}}>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '4px', fontSize: '0.85rem' }}>
                        <span style={{ color: '#64748b' }}>Tensile Strength:</span>
                        <span style={{ color: i.metrics.tensileStrength.includes('Pass') ? '#10b981' : i.metrics.tensileStrength.includes('Warning') ? '#f59e0b' : '#ef4444', fontWeight: 500 }}>
                          {i.metrics.tensileStrength}
                        </span>
                        
                        <span style={{ color: '#64748b' }}>Dye Penetration:</span>
                        <span style={{ color: i.metrics.dyePenetration.includes('Pass') ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                          {i.metrics.dyePenetration}
                        </span>
                        
                        <span style={{ color: '#64748b' }}>Thread Count:</span>
                        <span style={{ color: i.metrics.threadCount.includes('Pass') ? '#10b981' : '#ef4444', fontWeight: 500 }}>
                          {i.metrics.threadCount}
                        </span>
                      </div>
                    </td>
                    <td style={{padding: '16px', verticalAlign: 'top'}}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                        <span className={`erp-status-badge ${getStatusClass(i.status)}`} style={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(i.status)} {i.status}
                        </span>
                      </div>
                      <div style={{fontSize: '0.85rem', color: '#475569', maxWidth: '250px', lineHeight: 1.4}}>
                        {i.notes}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInspections.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      No inspections found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="erp-modal-backdrop">
          <div className="erp-modal" style={{ maxWidth: '600px' }}>
            <div className="erp-modal-header">
              <h2 className="erp-modal-title">Log New Quality Inspection</h2>
              <button className="erp-btn erp-btn-outline" style={{ padding: '4px' }} onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-content">
              <form onSubmit={handleAddInspection} style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="erp-form-group">
                    <label>Work Order ID</label>
                    <input type="text" className="erp-input" required placeholder="e.g. WO-1055" 
                      value={newInspection.workOrder} onChange={e => setNewInspection({...newInspection, workOrder: e.target.value})} />
                  </div>
                  <div className="erp-form-group">
                    <label>Batch Number</label>
                    <input type="text" className="erp-input" required placeholder="e.g. B-8825"
                      value={newInspection.batch} onChange={e => setNewInspection({...newInspection, batch: e.target.value})} />
                  </div>
                </div>

                <div className="erp-form-group">
                  <label>Product Name</label>
                  <input type="text" className="erp-input" required placeholder="e.g. Premium Cotton Yarn"
                    value={newInspection.product} onChange={e => setNewInspection({...newInspection, product: e.target.value})} />
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#334155' }}>Textile Metrics</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div className="erp-form-group">
                      <label>Tensile Strength</label>
                      <input type="text" className="erp-input" placeholder="e.g. Pass (4.2g/D)"
                        value={newInspection.tensileStrength} onChange={e => setNewInspection({...newInspection, tensileStrength: e.target.value})} />
                    </div>
                    <div className="erp-form-group">
                      <label>Dye Penetration</label>
                      <input type="text" className="erp-input" placeholder="e.g. Pass (98%)"
                        value={newInspection.dyePenetration} onChange={e => setNewInspection({...newInspection, dyePenetration: e.target.value})} />
                    </div>
                    <div className="erp-form-group">
                      <label>Thread Count</label>
                      <input type="text" className="erp-input" placeholder="e.g. Pass"
                        value={newInspection.threadCount} onChange={e => setNewInspection({...newInspection, threadCount: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="erp-form-group">
                  <label>Final Status</label>
                  <select className="erp-input" value={newInspection.status} onChange={e => setNewInspection({...newInspection, status: e.target.value})}>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Pending">Pending Review</option>
                  </select>
                </div>

                <div className="erp-form-group">
                  <label>Inspector Notes</label>
                  <textarea className="erp-input" rows={3} placeholder="Add any comments or observations..."
                    value={newInspection.notes} onChange={e => setNewInspection({...newInspection, notes: e.target.value})}></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="erp-btn erp-btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="erp-btn erp-btn-primary">Submit Inspection</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
