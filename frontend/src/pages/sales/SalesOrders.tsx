import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FileText, Plus, Search, RefreshCw, X, CheckCircle, Package } from 'lucide-react';
import '../dashboard/dashboard.css';

const mockAvenzaOrders = [
  {
    id: 'SO-AV-9021',
    customerName: 'Urban Threads Pvt Ltd',
    contactEmail: 'purchasing@urbanthreads.com',
    item: 'Premium Silk Rolls (Grade A)',
    quantity: '50 Rolls',
    unitPrice: '$900 / Roll',
    totalAmount: '$45,000',
    status: 'Delivered',
    createdAt: '2026-08-01',
    expectedDelivery: '2026-08-05',
    notes: 'Urgent delivery fulfilled for fall collection.',
  },
  {
    id: 'SO-AV-9022',
    customerName: 'Global Fashion Co.',
    contactEmail: 'orders@globalfashion.com',
    item: 'Organic Cotton Yarn (Undyed)',
    quantity: '2,500 Kg',
    unitPrice: '$50 / Kg',
    totalAmount: '$125,000',
    status: 'Processing',
    createdAt: '2026-08-10',
    expectedDelivery: '2026-08-25',
    notes: 'Awaiting dye-lot confirmation from the client before dispatch.',
  },
  {
    id: 'SO-AV-9023',
    customerName: 'Boutique Fabrics Inc.',
    contactEmail: 'hello@boutiquefabrics.com',
    item: 'Linen Blend Fabric (Beige)',
    quantity: '200 Meters',
    unitPrice: '$41 / Meter',
    totalAmount: '$8,200',
    status: 'Quotation',
    createdAt: '2026-08-12',
    expectedDelivery: 'TBD',
    notes: 'Quote sent. Waiting for client approval.',
  },
  {
    id: 'SO-AV-9024',
    customerName: 'Metro Apparel',
    contactEmail: 'supply@metroapparel.com',
    item: 'Heavyweight Denim Fabric',
    quantity: '8,000 Yards',
    unitPrice: '$8 / Yard',
    totalAmount: '$64,000',
    status: 'Pending Approval',
    createdAt: '2026-08-14',
    expectedDelivery: '2026-09-01',
    notes: 'Requires manager approval due to large volume discount applied.',
  },
  {
    id: 'SO-AV-9025',
    customerName: 'Luxury Linens',
    contactEmail: 'procurement@luxlinens.com',
    item: 'Egyptian Cotton Sheets',
    quantity: '1,000 Sets',
    unitPrice: '$120 / Set',
    totalAmount: '$120,000',
    status: 'In Transit',
    createdAt: '2026-08-08',
    expectedDelivery: '2026-08-16',
    notes: 'Shipped via standard freight. Tracking ID: FR-8821-XX.',
  }
];

export const SalesOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Modals
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Quote Form States
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newUnitPrice, setNewUnitPrice] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [ordRes, custRes] = await Promise.all([
        api.get('salesOrder'),
        api.get('customer')
      ]);
      
      // Map API data to our rich format
      const apiFormatted = ordRes.map((o: any) => {
        const cust = custRes.find((c: any) => c.id === o.customerId);
        return {
          id: `SO-${o.id.substring(o.id.length - 4).toUpperCase()}`,
          customerName: cust ? cust.name : 'Unknown Customer',
          contactEmail: cust ? cust.email : 'N/A',
          item: 'Various / Custom Order',
          quantity: 'N/A',
          unitPrice: 'N/A',
          totalAmount: `$${(o.total || 0).toLocaleString()}`,
          status: o.status === 'Confirmed' ? 'Processing' : o.status,
          createdAt: new Date(o.createdAt).toLocaleDateString(),
          expectedDelivery: 'TBD',
          notes: 'Order imported from legacy system.',
        };
      });

      // Combine with our rich Avenza mock data
      setOrders([...apiFormatted, ...mockAvenzaOrders]);
    } catch (err) {
      console.error(err);
      // Fallback to mock data if API fails
      setOrders(mockAvenzaOrders);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500); // UI feel
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Delivered':
        return <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'In Transit':
        return <span style={{ backgroundColor: '#e0f2fe', color: '#075985', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'Processing':
        return <span style={{ backgroundColor: '#f3e8ff', color: '#6b21a8', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'Pending Approval':
        return <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      case 'Quotation':
        return <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
      default:
        return <span style={{ backgroundColor: '#f8fafc', color: '#64748b', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        o.item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDownloadInvoice = () => {
    if (!selectedOrder) return;
    const invoiceText = `AVENZA TEXTILES - SALES ORDER INVOICE\n=========================================\nOrder Number: ${selectedOrder.id}\nCreated Date: ${selectedOrder.createdAt}\nExpected Delivery: ${selectedOrder.expectedDelivery}\nStatus: ${selectedOrder.status}\n\nCUSTOMER DETAILS:\nName: ${selectedOrder.customerName}\nContact: ${selectedOrder.contactEmail}\n\nORDER SUMMARY:\nItem: ${selectedOrder.item}\nQuantity: ${selectedOrder.quantity}\nUnit Price: ${selectedOrder.unitPrice}\n-----------------------------------------\nTOTAL AMOUNT: ${selectedOrder.totalAmount}\n=========================================\nNotes: ${selectedOrder.notes}\n`;
    
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SalesOrder_${selectedOrder.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateQuote = () => {
    if (!newCustomerName || !newProduct) {
      alert("Customer Name and Product Required are mandatory fields.");
      return;
    }

    const newOrder = {
      id: `SO-AV-${Math.floor(Math.random() * 10000) + 1000}`,
      customerName: newCustomerName,
      contactEmail: 'contact@customer.com', // mock email
      item: newProduct,
      quantity: newQuantity || '1',
      unitPrice: newUnitPrice || '$0',
      totalAmount: 'TBD',
      status: 'Quotation',
      createdAt: new Date().toLocaleDateString(),
      expectedDelivery: 'TBD',
      notes: newNotes || 'No additional notes provided.',
    };

    setOrders([newOrder, ...orders]);
    
    // Clear form
    setNewCustomerName('');
    setNewProduct('');
    setNewQuantity('');
    setNewUnitPrice('');
    setNewNotes('');
    
    setShowCreateModal(false);
  };

  if (loading) return <div style={{padding: '3rem', textAlign: 'center', color: '#64748b'}}>Loading Sales Orders...</div>;

  return (
    <div className="erp-dashboard">
      <div className="erp-page-header">
        <div>
          <h1 className="erp-page-title">Sales Orders & CRM</h1>
          <p className="erp-page-subtitle">Manage customer orders, quotations, and tracking</p>
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
            <Plus size={16} style={{marginRight: '8px'}} /> New Quote/Order
          </button>
        </div>
      </div>

      <div className="erp-panel" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', borderLeft: '4px solid #0ea5e9', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Active Orders</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>142</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #10b981', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Monthly Revenue</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>$840.5K</h2>
        </div>
        <div style={{ padding: '1rem', borderLeft: '4px solid #f59e0b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Pending Quotes</h3>
          <h2 style={{ margin: 0, fontSize: '2rem', color: '#0f172a' }}>28</h2>
        </div>
      </div>

      <div className="erp-panel">
        <div className="erp-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="erp-panel-title">Sales Order Log</h3>
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
              <option value="Processing">Processing</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Quotation">Quotation</option>
            </select>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="erp-input" 
                placeholder="Search orders or customers..." 
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
                <th style={{ padding: '16px' }}>Order Number</th>
                <th style={{ padding: '16px' }}>Customer Info</th>
                <th style={{ padding: '16px' }}>Ordered Items</th>
                <th style={{ padding: '16px' }}>Financials</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(o => (
                  <tr key={o.id} style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#334155' }}>
                      {o.id}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600 }}>{o.customerName}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{o.contactEmail}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 500, color: '#0ea5e9' }}>{o.item}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Qty: {o.quantity}</div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 600 }}>{o.totalAmount}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{o.createdAt}</div>
                    </td>
                    <td style={{ padding: '16px' }}>{getStatusBadge(o.status)}</td>
                    <td style={{ padding: '16px' }}>
                      <button 
                        className="erp-btn" 
                        style={{ padding: '6px 12px', fontSize: '0.85rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1' }}
                        onClick={() => setSelectedOrder(o)}
                      >
                        <FileText size={14} style={{ marginRight: '6px' }} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    <Package size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p>No sales orders found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedOrder && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ width: '650px' }}>
            <div className="erp-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText color="#0ea5e9" /> Order Details: {selectedOrder.id}
              </h2>
              <button className="erp-modal-close" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Customer Info</h4>
                  <p style={{ margin: '0 0 4px', fontWeight: 600 }}>{selectedOrder.customerName}</p>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>Contact: {selectedOrder.contactEmail}</p>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
                  <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Fulfillment Timeline</h4>
                  <p style={{ margin: '0 0 4px' }}><span style={{ color: '#64748b' }}>Created:</span> {selectedOrder.createdAt}</p>
                  <p style={{ margin: '0' }}><span style={{ color: '#64748b' }}>ETA:</span> <strong>{selectedOrder.expectedDelivery}</strong></p>
                </div>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase' }}>Order Breakdown</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Product/Item</td>
                      <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right', color: '#0ea5e9' }}>{selectedOrder.item}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Quantity</td>
                      <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{selectedOrder.quantity}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 0', color: '#64748b' }}>Unit Price</td>
                      <td style={{ padding: '8px 0', fontWeight: 600, textAlign: 'right' }}>{selectedOrder.unitPrice}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem' }}>Total Amount</td>
                      <td style={{ padding: '12px 0', fontWeight: 700, textAlign: 'right', fontSize: '1.1rem', color: '#10b981' }}>{selectedOrder.totalAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginBottom: '1.5rem', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '6px', borderLeft: '4px solid #ef4444' }}>
                <h4 style={{ margin: '0 0 6px', color: '#991b1b', fontSize: '0.9rem', textTransform: 'uppercase' }}>CRM / Tracking Notes</h4>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#7f1d1d' }}>"{selectedOrder.notes}"</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', marginRight: '8px' }}>Current Status:</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="erp-btn erp-btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
                  <button className="erp-btn erp-btn-primary" onClick={handleDownloadInvoice}>Download Invoice</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Quote/Order Modal */}
      {showCreateModal && (
        <div className="erp-modal-overlay">
          <div className="erp-modal" style={{ width: '500px' }}>
            <div className="erp-modal-header" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus color="#10b981" /> Draft New Quote/Order
              </h2>
              <button className="erp-modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="erp-modal-body">
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Customer Name</label>
                <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. Acme Textiles" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Product Required</label>
                <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. Silk Rolls" value={newProduct} onChange={e => setNewProduct(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Quantity</label>
                  <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. 50" value={newQuantity} onChange={e => setNewQuantity(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Proposed Unit Price</label>
                  <input type="text" className="erp-input" style={{ width: '100%' }} placeholder="e.g. $400" value={newUnitPrice} onChange={e => setNewUnitPrice(e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Terms / Notes</label>
                <textarea className="erp-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} placeholder="Additional requirements..." value={newNotes} onChange={e => setNewNotes(e.target.value)}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="erp-btn erp-btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="erp-btn erp-btn-primary" onClick={handleCreateQuote}>
                  <CheckCircle size={16} style={{ marginRight: '6px' }} /> Generate Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
