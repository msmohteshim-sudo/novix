import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Plus, X } from 'lucide-react';
import '../dashboard/dashboard.css'; // Reuse dashboard styles for layout

export const Production: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [woRes, machRes] = await Promise.all([
        api.get('workOrder'),
        api.get('machine')
      ]);
      setWorkOrders(woRes);
      setMachines(machRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMachineName = (id: string) => {
    const mach = machines.find((m: any) => m.id === id);
    return mach ? mach.name : 'Unassigned';
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'running';
      case 'Pending': return 'idle';
      default: return 'idle';
    }
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading Production Data...</div>;

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Production & Work Orders</h1>
          <p className="erp-page-subtitle">Manage factory production runs</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-primary" onClick={() => setShowNewOrderModal(true)}>
            <Plus size={16} style={{marginRight: '8px'}} /> New Work Order
          </button>
        </div>
      </div>

      <div className="erp-panel-grid">
        <div className="erp-panel col-span-12">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Active & Recent Work Orders</h3>
          </div>
          <div className="erp-panel-content" style={{padding: 0}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead style={{backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                <tr>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Order No</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Machine</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Quantity</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Status</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Dates</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.map((wo: any) => (
                  <tr key={wo.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '16px'}}>
                      <strong>WO-{wo.id.substring(wo.id.length - 4).toUpperCase()}</strong>
                      <div style={{fontSize: '0.8rem', color: '#64748b'}}>Notes: {wo.notes || 'None'}</div>
                    </td>
                    <td style={{padding: '16px'}}>{getMachineName(wo.machineId)}</td>
                    <td style={{padding: '16px'}}>{wo.quantity} units</td>
                    <td style={{padding: '16px'}}>
                      <span className={`erp-status-badge ${getStatusClass(wo.status)}`}>{wo.status}</span>
                    </td>
                    <td style={{padding: '16px', fontSize: '0.85rem'}}>
                      <div>Start: {new Date(wo.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(wo.endDate).toLocaleDateString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showNewOrderModal && (
        <div className="erp-modal-overlay">
          <div className="erp-modal">
            <div className="erp-modal-header">
              <h2>Create New Work Order</h2>
              <button className="erp-modal-close" onClick={() => setShowNewOrderModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              <div className="erp-form-group">
                <label>Product Type</label>
                <select className="erp-input">
                  <option>Premium Cotton Yarn</option>
                  <option>Silk Blend Fabric</option>
                  <option>Polyester Thread</option>
                </select>
              </div>
              <div className="erp-form-group">
                <label>Quantity</label>
                <input type="number" className="erp-input" defaultValue={1000} />
              </div>
              <div className="erp-form-group">
                <label>Target Machine (Optional)</label>
                <select className="erp-input">
                  <option value="">Auto-assign</option>
                  {machines.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="erp-form-group">
                <label>Deadline</label>
                <input type="date" className="erp-input" />
              </div>
            </div>
            <div className="erp-modal-footer">
              <button className="erp-btn erp-btn-outline" onClick={() => setShowNewOrderModal(false)}>Cancel</button>
              <button className="erp-btn erp-btn-primary" onClick={async () => {
                const newId = `WO-${1000 + Math.floor(Math.random() * 9000)}`;
                const newOrder = { 
                  id: newId, 
                  workOrderId: newId, 
                  quantity: 5000, 
                  status: 'Pending',
                  machineId: null,
                  startDate: new Date().toISOString(),
                  endDate: new Date().toISOString()
                };

                try {
                  await api.create('workOrder', newOrder);
                } catch (e) {
                  console.error(e);
                }
                
                setWorkOrders(prev => [newOrder, ...prev]);
                alert(`Work Order ${newId} created successfully! (Demo)`);
                setShowNewOrderModal(false);
              }}>Create Work Order</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
