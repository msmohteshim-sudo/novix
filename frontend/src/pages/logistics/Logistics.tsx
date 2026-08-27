import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Truck, Plus, Search, RefreshCw, X, CheckCircle, Package } from 'lucide-react';
import '../dashboard/dashboard.css';

const mockAvenzaShipments = [
  {
    id: 'SHP-9021',
    trackingNumber: 'TRK-GLB-44921',
    salesOrder: 'SO-AV-9021',
    carrier: 'Global Freight Ltd',
    status: 'Delivered',
    dispatchDate: '2026-08-02',
    deliveryDate: '2026-08-05',
    destination: 'Urban Threads Pvt Ltd, New York, NY',
    notes: 'Signed for by receiving dock manager.',
  },
  {
    id: 'SHP-9022',
    trackingNumber: 'TRK-EXP-11045',
    salesOrder: 'SO-AV-9022',
    carrier: 'Express Logistics',
    status: 'Pending',
    dispatchDate: 'TBD',
    deliveryDate: 'TBD',
    destination: 'Global Fashion Co., Los Angeles, CA',
    notes: 'Awaiting final QA check before dispatch.',
  },
  {
    id: 'SHP-9025',
    trackingNumber: 'TRK-STD-99832',
    salesOrder: 'SO-AV-9025',
    carrier: 'Standard Freight',
    status: 'In Transit',
    dispatchDate: '2026-08-10',
    deliveryDate: '2026-08-16',
    destination: 'Luxury Linens, Chicago, IL',
    notes: 'Currently at sorting facility in Denver.',
  }
];

export const Logistics: React.FC = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modals
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Shipment Form States
  const [newTracking, setNewTracking] = useState('');
  const [newSalesOrder, setNewSalesOrder] = useState('');
  const [newCarrier, setNewCarrier] = useState('');
  const [newDestination, setNewDestination] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get('shipment');
      
      const apiFormatted = res.map((s: any) => ({
        id: s.id,
        trackingNumber: s.trackingNumber || `TRK-${s.id.substring(s.id.length - 4).toUpperCase()}`,
        salesOrder: `SO-${s.salesOrderId.substring(s.salesOrderId.length - 4).toUpperCase()}`,
        carrier: s.carrier || 'Standard Freight',
        status: s.status,
        dispatchDate: new Date(s.dispatchDate).toLocaleDateString(),
        deliveryDate: 'TBD',
        destination: 'Unknown Destination',
        notes: 'Legacy system data.',
      }));

      setShipments([...apiFormatted, ...mockAvenzaShipments]);
    } catch (err) {
      console.error(err);
      setShipments(mockAvenzaShipments);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleCreateShipment = () => {
    if (!newTracking || !newSalesOrder) {
      alert("Tracking Number and Sales Order are mandatory.");
      return;
    }

    const newShipment = {
      id: `SHP-${Math.floor(Math.random() * 10000) + 1000}`,
      trackingNumber: newTracking,
      salesOrder: newSalesOrder,
      carrier: newCarrier || 'Standard Freight',
      status: 'Pending',
      dispatchDate: 'TBD',
      deliveryDate: 'TBD',
      destination: newDestination || 'TBD',
      notes: 'Newly scheduled shipment.',
    };

    setShipments([newShipment, ...shipments]);
    
    setNewTracking('');
    setNewSalesOrder('');
    setNewCarrier('');
    setNewDestination('');
    
    setShowCreateModal(false);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Delivered':
        return <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'In Transit':
        return <span style={{ backgroundColor: '#e0f2fe', color: '#075985', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'Pending':
        return <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      default:
        return <span style={{ backgroundColor: '#f8fafc', color: '#64748b', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchSearch = s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.salesOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div style={{padding: '3rem', textAlign: 'center', color: '#64748b'}}>Loading Shipments...</div>;

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Logistics & Shipments</h1>
          <p className="erp-page-subtitle">Manage deliveries, tracking, and carrier operations</p>
        </div>
        <div className="erp-header-actions">
          <button 
            className="erp-btn erp-btn-outline" 
            onClick={fetchData}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={16} className={isRefreshing ? "spin-animation" : ""} /> 
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="erp-btn erp-btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} style={{marginRight: '8px'}} /> New Shipment
          </button>
        </div>
      </div>

      <div className="erp-panel" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', borderLeft: '4px solid #f59e0b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Pending Dispatch</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>14</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #0ea5e9', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>In Transit</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>32</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #10b981', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Delivered (This Week)</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>89</h2>
        </div>
      </div>

      <div className="erp-panel">
        <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="erp-panel-title">Active Shipments</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              className="erp-input" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              style={{ width: '180px' }}
            >
              <option value="All">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="In Transit">In Transit</option>
              <option value="Pending">Pending</option>
            </select>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="erp-input" 
                placeholder="Search tracking, SO, or carrier..." 
                style={{ width: '100%', paddingLeft: '40px' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="erp-table-container">
          <table className="erp-table" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px' }}>Tracking / Carrier</th>
                <th style={{ padding: '16px' }}>Sales Order</th>
                <th style={{ padding: '16px' }}>Destination</th>
                <th style={{ padding: '16px' }}>Timeline</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length > 0 ? (
                filteredShipments.map(s => (
                  <tr key={s.id} style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600, color: '#334155' }}>{s.trackingNumber}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.carrier}</div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#0ea5e9' }}>
                      {s.salesOrder}
                    </td>
                    <td style={{ padding: '16px', fontSize: '0.9rem', color: '#334155' }}>
                      {s.destination}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.85rem' }}><span style={{ color: '#64748b' }}>Dispatch:</span> {s.dispatchDate}</div>
                      <div style={{ fontSize: '0.85rem', marginTop: '2px' }}><span style={{ color: '#64748b' }}>Delivery:</span> {s.deliveryDate}</div>
                    </td>
                    <td style={{ padding: '16px' }}>{getStatusBadge(s.status)}</td>
                    <td style={{ padding: '16px' }}>
                      <button 
                        className="erp-btn" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}
                        onClick={() => setSelectedShipment(s)}
                      >
                        <Truck size={14} style={{ marginRight: '6px' }} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <Package size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p>No shipments found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedShipment && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ width: '600px' }}>
            <div className="erp-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck color="#0ea5e9" /> Shipment Details: {selectedShipment.trackingNumber}
              </h2>
              <button className="erp-modal-close" onClick={() => setSelectedShipment(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Routing Info</h4>
                  <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{selectedShipment.carrier}</p>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>Dest: {selectedShipment.destination}</p>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Associated Order</h4>
                  <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#0ea5e9' }}>{selectedShipment.salesOrder}</p>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Logistics Timeline</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Dispatch Date</td>
                      <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{selectedShipment.dispatchDate}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Estimated/Actual Delivery</td>
                      <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{selectedShipment.deliveryDate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginBottom: '1.5rem', backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #64748b' }}>
                <h4 style={{ margin: '0 0 6px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Tracking Notes</h4>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#334155' }}>"{selectedShipment.notes}"</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', marginRight: '8px' }}>Status:</span>
                  {getStatusBadge(selectedShipment.status)}
                </div>
                <button className="erp-btn erp-btn-secondary" onClick={() => setSelectedShipment(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Shipment Modal */}
      {showCreateModal && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ width: '500px' }}>
            <div className="erp-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck color="#10b981" /> Schedule New Shipment
              </h2>
              <button className="erp-modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Tracking Number</label>
                <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. TRK-EXP-12345" value={newTracking} onChange={e => setNewTracking(e.target.value)} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Sales Order Reference</label>
                <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. SO-AV-9024" value={newSalesOrder} onChange={e => setNewSalesOrder(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Carrier</label>
                  <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. DHL Express" value={newCarrier} onChange={e => setNewCarrier(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Destination City</label>
                  <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. Los Angeles, CA" value={newDestination} onChange={e => setNewDestination(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button className="erp-btn erp-btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="erp-btn erp-btn-primary" onClick={handleCreateShipment}>
                  <CheckCircle size={16} style={{ marginRight: '6px' }} /> Create Shipment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
