import React, { useState } from 'react';
import { ShoppingCart, Truck, DollarSign, Search, Filter, Plus, FileText, X, AlertCircle } from 'lucide-react';
import '../dashboard/dashboard.css';

const mockPurchaseOrders = [
  {
    id: 'PO-2026-801',
    supplier: 'Global Cotton Co.',
    contact: 'john.d@globalcotton.com',
    item: 'Organic Cotton Bales (Grade A)',
    quantity: '500 Tons',
    unitPrice: '$2,500 / Ton',
    totalCost: '$1,250,000',
    orderDate: '2026-08-01',
    expectedDelivery: '2026-08-18',
    status: 'In Transit',
    notes: 'Urgent delivery required for the upcoming winter line production.',
  },
  {
    id: 'PO-2026-802',
    supplier: 'ChemDye Industries',
    contact: 'sales@chemdye.com',
    item: 'Indigo Liquid Dye (Vat 4)',
    quantity: '2,000 Liters',
    unitPrice: '$22.50 / Liter',
    totalCost: '$45,000',
    orderDate: '2026-08-05',
    expectedDelivery: '2026-08-12',
    status: 'Delivered',
    notes: 'Quality checked and approved. Ready for vat 4.',
  },
  {
    id: 'PO-2026-803',
    supplier: 'Silk Route Suppliers',
    contact: 'orders@silkroute.net',
    item: 'Raw Mulberry Silk Threads',
    quantity: '50 Tons',
    unitPrice: '$17,000 / Ton',
    totalCost: '$850,000',
    orderDate: '2026-08-10',
    expectedDelivery: '2026-08-25',
    status: 'Pending Approval',
    notes: 'Awaiting finance sign-off due to high volume.',
  },
  {
    id: 'PO-2026-804',
    supplier: 'PolyTex Synthetics',
    contact: 'b2b@polytex.com',
    item: 'Polyester Blend Spools',
    quantity: '1,500 Cartons',
    unitPrice: '$80 / Carton',
    totalCost: '$120,000',
    orderDate: '2026-08-11',
    expectedDelivery: '2026-08-20',
    status: 'Processing',
    notes: 'Custom color blend matching SKU-9912.',
  },
  {
    id: 'PO-2026-805',
    supplier: 'WeaveTech Machinery Parts',
    contact: 'support@weavetech.com',
    item: 'Loom Replacement Needles',
    quantity: '10,000 Units',
    unitPrice: '$1.50 / Unit',
    totalCost: '$15,000',
    orderDate: '2026-08-12',
    expectedDelivery: '2026-08-16',
    status: 'In Transit',
    notes: 'Standard monthly maintenance parts.',
  }
];

export const Procurement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);

  const filteredOrders = mockPurchaseOrders.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          po.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          po.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadInvoice = () => {
    if (!selectedPO) return;
    const invoiceText = `AVENZA TEXTILES - PURCHASE ORDER INVOICE\n=========================================\nPO Number: ${selectedPO.id}\nOrder Date: ${selectedPO.orderDate}\nExpected Delivery: ${selectedPO.expectedDelivery}\nStatus: ${selectedPO.status}\n\nSUPPLIER DETAILS:\nName: ${selectedPO.supplier}\nContact: ${selectedPO.contact}\n\nMATERIAL & PRICING:\nItem: ${selectedPO.item}\nQuantity: ${selectedPO.quantity}\nUnit Price: ${selectedPO.unitPrice}\n-----------------------------------------\nTOTAL COST: ${selectedPO.totalCost}\n=========================================\nNotes: ${selectedPO.notes}\n`;
    
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice_${selectedPO.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'In Transit':
        return <span style={{ backgroundColor: '#e0f2fe', color: '#075985', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'Pending Approval':
        return <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'Processing':
        return <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      default:
        return <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
    }
  };

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Procurement</h1>
          <p className="erp-page-subtitle">Manage supplier orders, raw material acquisition, and costs for AVENZA TEXTILES</p>
        </div>
        <div className="erp-header-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={`erp-btn ${showFilters ? 'erp-btn-primary' : 'erp-btn-secondary'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} style={{marginRight: '8px'}} /> {showFilters ? 'Hide Filters' : 'Filter Options'}
          </button>
          <button className="erp-btn erp-btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} style={{marginRight: '8px'}} /> Create Purchase Order
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="erp-panel" style={{ marginBottom: '1.5rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, color: '#334155' }}>Status:</label>
            <select 
              className="erp-input" 
              style={{ width: '200px' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Processing">Processing</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <button className="erp-btn erp-btn-secondary" onClick={() => { setStatusFilter('All'); setSearchTerm(''); }}>Clear Filters</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="erp-panel" style={{ borderLeft: '4px solid #0ea5e9' }}>
          <div className="erp-panel-header">
            <h3 className="erp-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={18} color="#0ea5e9" /> Active POs
            </h3>
          </div>
          <div className="erp-panel-body" style={{ padding: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0', color: '#0f172a' }}>24</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>4 requiring approval</p>
          </div>
        </div>

        <div className="erp-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div className="erp-panel-header">
            <h3 className="erp-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={18} color="#f59e0b" /> Pending Deliveries
            </h3>
          </div>
          <div className="erp-panel-body" style={{ padding: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0', color: '#0f172a' }}>12</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>3 arriving this week</p>
          </div>
        </div>

        <div className="erp-panel" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="erp-panel-header">
            <h3 className="erp-panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} color="#10b981" /> Monthly Spend
            </h3>
          </div>
          <div className="erp-panel-body" style={{ padding: '1rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0', color: '#0f172a' }}>$2.8M</h2>
            <p style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem', marginTop: '4px' }}>-5% vs last month</p>
          </div>
        </div>
      </div>

      <div className="erp-panel">
        <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="erp-panel-title">Purchase Order Log</h3>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="erp-input" 
              placeholder="Search PO, supplier, or material..." 
              style={{ width: '100%', paddingLeft: '40px', paddingRight: '12px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="erp-table-container">
          <table className="erp-table" style={{ borderSpacing: '0 10px', borderCollapse: 'separate' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px' }}>PO Number</th>
                <th style={{ padding: '16px' }}>Supplier Details</th>
                <th style={{ padding: '16px' }}>Material Needed</th>
                <th style={{ padding: '16px' }}>Qty & Cost</th>
                <th style={{ padding: '16px' }}>Timeline</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(po => (
                  <tr key={po.id} style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#334155' }}>
                      {po.id}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600 }}>{po.supplier}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{po.contact}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 500, color: '#0ea5e9' }}>{po.item}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600 }}>{po.totalCost}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{po.quantity}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontSize: '0.85rem' }}><span style={{ color: '#64748b' }}>Ordered:</span> {po.orderDate}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500, marginTop: '2px' }}><span style={{ color: '#64748b' }}>ETA:</span> {po.expectedDelivery}</div>
                    </td>
                    <td style={{ padding: '16px' }}>{getStatusBadge(po.status)}</td>
                    <td style={{ padding: '16px' }}>
                      <button 
                        className="erp-btn" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}
                        onClick={() => setSelectedPO(po)}
                      >
                        <FileText size={14} style={{ marginRight: '6px' }} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <AlertCircle size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p>No purchase orders found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Details Modal */}
      {selectedPO && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ width: '600px' }}>
            <div className="erp-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText color="#0ea5e9" /> Purchase Order Details: {selectedPO.id}
              </h2>
              <button className="erp-modal-close" onClick={() => setSelectedPO(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Supplier Information</h4>
                  <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{selectedPO.supplier}</p>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>Contact: {selectedPO.contact}</p>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Order Timeline</h4>
                  <p style={{ margin: '0 0 4px' }}><span style={{ color: '#64748b' }}>Ordered:</span> {selectedPO.orderDate}</p>
                  <p style={{ margin: '0' }}><span style={{ color: '#64748b' }}>ETA:</span> <strong>{selectedPO.expectedDelivery}</strong></p>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Material & Pricing</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Item</td>
                      <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right', color: '#0ea5e9' }}>{selectedPO.item}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Quantity</td>
                      <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{selectedPO.quantity}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Unit Price</td>
                      <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{selectedPO.unitPrice}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Total Cost</td>
                      <td style={{ padding: '12px 0', fontWeight: 700, textAlign: 'right', fontSize: '1.1rem', color: '#10b981' }}>{selectedPO.totalCost}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginBottom: '1.5rem', backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #64748b' }}>
                <h4 style={{ margin: '0 0 6px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Internal Notes</h4>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#334155' }}>"{selectedPO.notes}"</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="erp-btn erp-btn-secondary" onClick={() => setSelectedPO(null)}>Close</button>
                <button className="erp-btn erp-btn-primary" onClick={handleDownloadInvoice}>Download Invoice</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showCreateModal && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ width: '500px' }}>
            <div className="erp-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus color="#10b981" /> Create New Purchase Order
              </h2>
              <button className="erp-modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Supplier</label>
                <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. Global Cotton Co." />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Material / Item</label>
                <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. Organic Cotton Bales" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Quantity</label>
                  <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. 500 Tons" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Expected Delivery</label>
                  <input type="date" className="erp-input" style={{ width: '100%' }} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Notes</label>
                <textarea className="erp-input" style={{ width: '100%', minHeight: '80px' }} placeholder="Any special instructions..."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="erp-btn erp-btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="erp-btn erp-btn-primary" onClick={() => setShowCreateModal(false)}>Submit PO</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
