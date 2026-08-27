import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Plus } from 'lucide-react';
import '../dashboard/dashboard.css';

export const PurchaseOrders: React.FC = () => {
  const [pos, setPos] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [poRes, supRes] = await Promise.all([
        api.get('purchaseOrder'),
        api.get('supplier')
      ]);
      setPos(poRes);
      setSuppliers(supRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSupplierName = (id: string) => {
    const s = suppliers.find((s: any) => s.id === id);
    return s ? s.name : 'Unknown Supplier';
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Received': return 'success';
      case 'Shipped': return 'running';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'danger';
      default: return 'idle';
    }
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading Purchase Orders...</div>;

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Purchase Orders</h1>
          <p className="erp-page-subtitle">Manage procurement and supplier orders</p>
        </div>
        <div className="erp-header-actions">
          <button className="erp-btn erp-btn-outline" onClick={fetchData}>Refresh</button>
          <button className="erp-btn erp-btn-primary">
            <Plus size={16} style={{marginRight: '8px'}} /> Create PO
          </button>
        </div>
      </div>

      <div className="erp-panel-grid">
        <div className="erp-panel col-span-12">
          <div className="erp-panel-header">
            <h3 className="erp-panel-title">Recent Purchase Orders</h3>
          </div>
          <div className="erp-panel-content" style={{padding: 0}}>
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead style={{backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                <tr>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>PO Number</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Supplier</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Total Amount</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Status</th>
                  <th style={{padding: '12px 16px', color: '#64748b', fontWeight: 500}}>Delivery Date</th>
                </tr>
              </thead>
              <tbody>
                {pos.map((po: any) => (
                  <tr key={po.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                    <td style={{padding: '16px'}}>
                      <strong>PO-{po.id.substring(po.id.length - 4).toUpperCase()}</strong>
                    </td>
                    <td style={{padding: '16px'}}>{getSupplierName(po.supplierId)}</td>
                    <td style={{padding: '16px'}}>${(po.total || 0).toLocaleString()}</td>
                    <td style={{padding: '16px'}}>
                      <span className={`erp-status-badge ${getStatusClass(po.status)}`}>{po.status}</span>
                    </td>
                    <td style={{padding: '16px', fontSize: '0.85rem'}}>
                      {new Date(po.deliveryDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
