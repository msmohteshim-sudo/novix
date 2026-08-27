import React, { useState } from 'react';
import { AlertCircle, Plus, X, Search } from 'lucide-react';
import '../dashboard/dashboard.css';

const initialMaterials = [
  { id: 1, sku: 'RAW-COT-A', name: 'Raw Cotton Grade A', type: 'Raw Material', currentStock: 12500, minStock: 5000, unit: 'kg' },
  { id: 2, sku: 'RAW-COT-B', name: 'Raw Cotton Grade B', type: 'Raw Material', currentStock: 8000, minStock: 4000, unit: 'kg' },
  { id: 3, sku: 'YRN-POLY', name: 'Polyester Yarn', type: 'Yarn', currentStock: 2500, minStock: 1000, unit: 'kg' },
  { id: 4, sku: 'DYE-REAC-BL', name: 'Reactive Dye Blue', type: 'Chemical', currentStock: 120, minStock: 200, unit: 'kg' },
  { id: 5, sku: 'PKG-ROLL', name: 'Packaging Rolls', type: 'Packaging', currentStock: 50, minStock: 100, unit: 'rolls' },
];

export const Inventory: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>(initialMaterials);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newMaterial, setNewMaterial] = useState({
    sku: '', name: '', type: 'Raw Material', currentStock: 0, minStock: 0, unit: 'kg'
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1;
    setMaterials([...materials, { id: newId, ...newMaterial }]);
    setShowAddModal(false);
    setNewMaterial({ sku: '', name: '', type: 'Raw Material', currentStock: 0, minStock: 0, unit: 'kg' });
  };

  const getStatusClass = (current: number, min: number) => {
    if (current === 0) return 'danger';
    if (current <= min) return 'warning';
    return 'success';
  };

  const getStatusText = (current: number, min: number) => {
    if (current === 0) return 'Out of Stock';
    if (current <= min) return 'Low Stock';
    return 'In Stock';
  };

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Inventory Management</h1>
          <p className="erp-page-subtitle">Track raw materials and finished goods</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="erp-btn erp-btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} style={{marginRight: '8px'}} /> Add Material
          </button>
        </div>
      </div>

      {materials.filter(m => m.currentStock <= m.minStock).length > 0 && (
        <div className="erp-panel erp-ai-panel" style={{marginBottom: '1.5rem', gridColumn: 'span 12'}}>
          <div className="erp-panel-header">
            <h3 className="erp-panel-title erp-ai-title" style={{color: '#b45309'}}><AlertCircle size={18} /> Inventory Alerts</h3>
          </div>
          <div className="erp-panel-content">
            <p>You have <strong>{materials.filter(m => m.currentStock <= m.minStock).length} items</strong> at or below minimum stock levels. Consider creating Purchase Orders.</p>
          </div>
        </div>
      )}

      <div className="erp-panel-grid">
        <div className="erp-panel col-span-12">
          <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="erp-panel-title">Materials List</h3>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '6px' }}>
              <Search size={16} color="#64748b" style={{ marginRight: '8px' }} />
              <input 
                type="text" 
                placeholder="Search by SKU or Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '250px' }}
              />
            </div>
          </div>
          <div className="erp-panel-content" style={{padding: 0}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead style={{backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                <tr>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>SKU</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Name</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Type</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Current Stock</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No materials found.</td></tr>
                ) : (
                  filteredMaterials.map((m: any) => (
                    <tr key={m.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                      <td style={{padding: '16px'}}>
                        <strong>{m.sku}</strong>
                      </td>
                      <td style={{padding: '16px'}}>{m.name}</td>
                      <td style={{padding: '16px'}}>{m.type}</td>
                      <td style={{padding: '16px'}}>
                        {m.currentStock} {m.unit}
                        <div style={{fontSize: '0.8rem', color: '#64748b'}}>Min: {m.minStock} {m.unit}</div>
                      </td>
                      <td style={{padding: '16px'}}>
                        <span className={`erp-status-badge ${getStatusClass(m.currentStock, m.minStock)}`}>
                          {getStatusText(m.currentStock, m.minStock)}
                        </span>
                      </td>
                    </tr>
                  ))
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
              <h2 className="erp-modal-title">Add New Material</h2>
              <button className="erp-btn erp-btn-outline" style={{ padding: '4px' }} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-content">
              <form onSubmit={handleAddMaterial} style={{ display: 'grid', gap: '1rem' }}>
                <div className="erp-form-group">
                  <label>SKU (Stock Keeping Unit)</label>
                  <input type="text" className="erp-input" required placeholder="e.g. RAW-COT-C" 
                    value={newMaterial.sku} onChange={e => setNewMaterial({...newMaterial, sku: e.target.value})} />
                </div>
                
                <div className="erp-form-group">
                  <label>Material Name</label>
                  <input type="text" className="erp-input" required placeholder="e.g. Raw Cotton Grade C"
                    value={newMaterial.name} onChange={e => setNewMaterial({...newMaterial, name: e.target.value})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="erp-form-group">
                    <label>Type</label>
                    <select className="erp-input" value={newMaterial.type} onChange={e => setNewMaterial({...newMaterial, type: e.target.value})}>
                      <option>Raw Material</option>
                      <option>Yarn</option>
                      <option>Fabric</option>
                      <option>Chemical</option>
                      <option>Packaging</option>
                      <option>Finished Good</option>
                    </select>
                  </div>
                  <div className="erp-form-group">
                    <label>Unit of Measurement</label>
                    <select className="erp-input" value={newMaterial.unit} onChange={e => setNewMaterial({...newMaterial, unit: e.target.value})}>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="lbs">Pounds (lbs)</option>
                      <option value="meters">Meters (m)</option>
                      <option value="rolls">Rolls</option>
                      <option value="pcs">Pieces (pcs)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="erp-form-group">
                    <label>Current Stock</label>
                    <input type="number" className="erp-input" required min="0"
                      value={newMaterial.currentStock} onChange={e => setNewMaterial({...newMaterial, currentStock: parseInt(e.target.value) || 0})} />
                  </div>
                  <div className="erp-form-group">
                    <label>Minimum Stock Alert Level</label>
                    <input type="number" className="erp-input" required min="0"
                      value={newMaterial.minStock} onChange={e => setNewMaterial({...newMaterial, minStock: parseInt(e.target.value) || 0})} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" className="erp-btn erp-btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="erp-btn erp-btn-primary">Save Material</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
