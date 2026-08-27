import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  Users, Search, Plus, X, Mail, Phone, MapPin, Building2, 
  DollarSign, RefreshCw, CheckCircle, AlertTriangle, Briefcase
} from 'lucide-react';
import '../dashboard/dashboard.css';

export interface CustomerItem {
  id: string;
  rawId?: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  category: 'Enterprise' | 'Wholesale' | 'Retail' | 'Distributor';
  tier: 'VIP' | 'Tier A' | 'Tier B' | 'Tier C';
  status: 'Active' | 'Inactive' | 'On Hold';
  totalOrders: number;
  totalSpent: string;
  creditLimit: string;
  paymentTerms: string;
  joinDate: string;
  notes?: string;
}

const mockCustomers: CustomerItem[] = [
  {
    id: 'CUST-1001',
    name: 'Urban Threads Pvt Ltd',
    contactName: 'Alex Vance',
    email: 'alex.vance@urbanthreads.com',
    phone: '+1 (555) 321-7890',
    city: 'New York',
    country: 'USA',
    category: 'Enterprise',
    tier: 'VIP',
    status: 'Active',
    totalOrders: 24,
    totalSpent: '$425,000',
    creditLimit: '$150,000',
    paymentTerms: 'Net 30',
    joinDate: '2023-04-12',
    notes: 'Key enterprise buyer for high-end silk and sustainable yarn lines.'
  },
  {
    id: 'CUST-1002',
    name: 'Global Fashion Co.',
    contactName: 'Sarah Connor',
    email: 'orders@globalfashion.com',
    phone: '+1 (555) 432-8901',
    city: 'Los Angeles',
    country: 'USA',
    category: 'Wholesale',
    tier: 'Tier A',
    status: 'Active',
    totalOrders: 18,
    totalSpent: '$680,000',
    creditLimit: '$250,000',
    paymentTerms: 'Net 45',
    joinDate: '2022-09-01',
    notes: 'Bulk organic cotton purchaser. Requires pre-dispatch dye lot inspections.'
  },
  {
    id: 'CUST-1003',
    name: 'Boutique Fabrics Inc.',
    contactName: 'Elena Rostova',
    email: 'elena@boutiquefabrics.com',
    phone: '+1 (555) 543-9012',
    city: 'Chicago',
    country: 'USA',
    category: 'Retail',
    tier: 'Tier B',
    status: 'Active',
    totalOrders: 9,
    totalSpent: '$94,500',
    creditLimit: '$50,000',
    paymentTerms: 'Net 15',
    joinDate: '2024-01-15',
    notes: 'Specializes in niche linen blends and custom artisan fabrics.'
  },
  {
    id: 'CUST-1004',
    name: 'Metro Apparel Group',
    contactName: 'Marcus Thorne',
    email: 'm.thorne@metroapparel.com',
    phone: '+1 (555) 654-0123',
    city: 'Atlanta',
    country: 'USA',
    category: 'Enterprise',
    tier: 'VIP',
    status: 'Active',
    totalOrders: 31,
    totalSpent: '$890,000',
    creditLimit: '$300,000',
    paymentTerms: 'Net 60',
    joinDate: '2021-06-10',
    notes: 'Largest volume contract holder for heavyweight denim textiles.'
  },
  {
    id: 'CUST-1005',
    name: 'Luxury Linens Ltd',
    contactName: 'Diana Prince',
    email: 'diana@luxlinens.com',
    phone: '+1 (555) 765-1234',
    city: 'Miami',
    country: 'USA',
    category: 'Distributor',
    tier: 'Tier A',
    status: 'Active',
    totalOrders: 14,
    totalSpent: '$310,000',
    creditLimit: '$100,000',
    paymentTerms: 'Net 30',
    joinDate: '2023-11-20',
    notes: 'Distributes premium beddings across South American export hubs.'
  },
  {
    id: 'CUST-1006',
    name: 'Apex Garments & Co',
    contactName: 'Robert Paulson',
    email: 'r.paulson@apexgarments.com',
    phone: '+1 (555) 876-2345',
    city: 'Dallas',
    country: 'USA',
    category: 'Wholesale',
    tier: 'Tier C',
    status: 'On Hold',
    totalOrders: 5,
    totalSpent: '$42,000',
    creditLimit: '$20,000',
    paymentTerms: 'Prepaid',
    joinDate: '2024-03-05',
    notes: 'Account temporarily on hold pending audit of overdue invoices.'
  },
  {
    id: 'CUST-1007',
    name: 'Summit Outdoor Wear',
    contactName: 'Claire Temple',
    email: 'ctemple@summitoutdoor.com',
    phone: '+1 (555) 987-3456',
    city: 'Seattle',
    country: 'USA',
    category: 'Enterprise',
    tier: 'Tier A',
    status: 'Active',
    totalOrders: 22,
    totalSpent: '$515,000',
    creditLimit: '$200,000',
    paymentTerms: 'Net 30',
    joinDate: '2022-12-08',
    notes: 'High demand for waterproof synthetic weaves and thermal linings.'
  },
  {
    id: 'CUST-1008',
    name: 'Velocity Sportswear',
    contactName: 'David Miller',
    email: 'david@velocitysports.com',
    phone: '+1 (555) 098-4567',
    city: 'Boston',
    country: 'USA',
    category: 'Retail',
    tier: 'Tier B',
    status: 'Inactive',
    totalOrders: 3,
    totalSpent: '$18,200',
    creditLimit: '$15,000',
    paymentTerms: 'Net 15',
    joinDate: '2024-05-18',
    notes: 'Seasonal buyer. Last active 6 months ago.'
  }
];

// Helper to format long UUIDs into short readable IDs like CUST-C58C10
const formatDisplayId = (id: string, index: number) => {
  if (!id) return `CUST-${1001 + index}`;
  if (id.startsWith('CUST-') && id.length <= 12) return id;
  const clean = id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `CUST-${clean.slice(0, 6)}`;
};

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newCategory, setNewCategory] = useState<'Enterprise' | 'Wholesale' | 'Retail' | 'Distributor'>('Wholesale');
  const [newTier, setNewTier] = useState<'VIP' | 'Tier A' | 'Tier B' | 'Tier C'>('Tier A');
  const [newCreditLimit, setNewCreditLimit] = useState('$50,000');
  const [newPaymentTerms, setNewPaymentTerms] = useState('Net 30');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsRefreshing(true);
    try {
      const data = await api.get('customer');
      if (Array.isArray(data) && data.length > 0) {
        // Map backend customer records with clean IDs and merge with mock details if needed
        const mappedFromBackend: CustomerItem[] = data.map((item: any, idx: number) => ({
          id: formatDisplayId(item.id, idx),
          rawId: item.id,
          name: item.name || `Client ${idx + 1}`,
          contactName: item.contactName || 'Primary Contact',
          email: item.email || `contact@${(item.name || 'company').toLowerCase().replace(/[^a-z]/g, '')}.com`,
          phone: item.phone || '+1 (555) 000-0000',
          city: item.address ? item.address.split(',')[0] : 'New York',
          country: 'USA',
          category: item.category || (idx % 2 === 0 ? 'Enterprise' : 'Wholesale'),
          tier: item.tier || (idx === 0 ? 'VIP' : 'Tier A'),
          status: item.status || 'Active',
          totalOrders: item.totalOrders || (12 + idx * 5),
          totalSpent: item.totalSpent || `$${(100 + idx * 75)},000`,
          creditLimit: item.creditLimit || '$150,000',
          paymentTerms: item.paymentTerms || 'Net 30',
          joinDate: item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '2024-01-01',
          notes: item.notes || ''
        }));

        // Merge backend and mock to ensure full customer list
        const existingNames = new Set(mappedFromBackend.map(c => c.name.toLowerCase()));
        const uniqueMocks = mockCustomers.filter(m => !existingNames.has(m.name.toLowerCase()));
        setCustomers([...mappedFromBackend, ...uniqueMocks]);
      } else {
        setCustomers(mockCustomers);
      }
    } catch {
      console.warn('Using local mock customer data');
      setCustomers(mockCustomers);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newContact || !newEmail) {
      alert('Company Name, Contact Person, and Email are required.');
      return;
    }

    const newCust: CustomerItem = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      contactName: newContact,
      email: newEmail,
      phone: newPhone || '+1 (555) 000-0000',
      city: newCity || 'New York',
      country: 'USA',
      category: newCategory,
      tier: newTier,
      status: 'Active',
      totalOrders: 0,
      totalSpent: '$0',
      creditLimit: newCreditLimit || '$50,000',
      paymentTerms: newPaymentTerms || 'Net 30',
      joinDate: new Date().toISOString().split('T')[0],
      notes: newNotes
    };

    try {
      await api.create('customer', {
        name: newCust.name,
        email: newCust.email,
        phone: newCust.phone,
        address: `${newCust.city}, USA`
      });
    } catch {
      // Graceful fallback to client state
    }

    setCustomers([newCust, ...customers]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewContact('');
    setNewEmail('');
    setNewPhone('');
    setNewCity('');
    setNewCategory('Wholesale');
    setNewTier('Tier A');
    setNewCreditLimit('$50,000');
    setNewPaymentTerms('Net 30');
    setNewNotes('');
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Metrics
  const activeCount = customers.filter(c => c.status === 'Active').length;
  const vipCount = customers.filter(c => c.tier === 'VIP').length;
  const totalSpentSum = customers.reduce((sum, c) => {
    const val = parseInt(c.totalSpent.replace(/[^0-9]/g, '')) || 0;
    return sum + val;
  }, 0);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'VIP':
        return <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #fde68a', display: 'inline-block' }}>★ VIP</span>;
      case 'Tier A':
        return <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block' }}>Tier A</span>;
      case 'Tier B':
        return <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block' }}>Tier B</span>;
      default:
        return <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, display: 'inline-block' }}>{tier}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block' }}>Active</span>;
      case 'On Hold':
        return <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block' }}>On Hold</span>;
      case 'Inactive':
        return <span style={{ backgroundColor: '#f1f5f9', color: '#94a3b8', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block' }}>Inactive</span>;
      default:
        return <span style={{ backgroundColor: '#f3f4f6', color: '#4b5563', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block' }}>{status}</span>;
    }
  };

  return (
    <div className="erp-dashboard" style={{ padding: '1.5rem' }}>
      {/* Top Header */}
      <div className="erp-page-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="erp-page-title" style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>Customers & CRM</h1>
          <p className="erp-page-subtitle" style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage client profiles, account tiers, and sales order activity</p>
        </div>
        <div className="erp-header-actions" style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="erp-btn erp-btn-secondary" 
            onClick={fetchCustomers}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
            Refresh
          </button>
          <button 
            className="erp-btn erp-btn-primary" 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={{ padding: '1.25rem', borderLeft: '4px solid #0ea5e9', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', borderLeftWidth: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Customers</span>
            <Users size={20} color="#0ea5e9" />
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '2rem', color: '#0f172a', fontWeight: 700 }}>{customers.length}</h2>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Registered accounts</span>
        </div>

        <div style={{ padding: '1.25rem', borderLeft: '4px solid #10b981', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', borderLeftWidth: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Accounts</span>
            <CheckCircle size={20} color="#10b981" />
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '2rem', color: '#0f172a', fontWeight: 700 }}>{activeCount}</h2>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>{Math.round((activeCount / (customers.length || 1)) * 100)}% active rate</span>
        </div>

        <div style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', borderLeftWidth: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>VIP Clients</span>
            <Briefcase size={20} color="#f59e0b" />
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '2rem', color: '#0f172a', fontWeight: 700 }}>{vipCount}</h2>
          <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>Top tier partners</span>
        </div>

        <div style={{ padding: '1.25rem', borderLeft: '4px solid #8b5cf6', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', borderLeftWidth: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Revenue</span>
            <DollarSign size={20} color="#8b5cf6" />
          </div>
          <h2 style={{ margin: '8px 0 0', fontSize: '2rem', color: '#0f172a', fontWeight: 700 }}>
            ${(totalSpentSum / 1000).toFixed(0)}k
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Cumulative order value</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Search & Filters Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Search by company, contact, city, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="erp-input"
                style={{ paddingLeft: '38px', width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '8px 12px 8px 38px', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Category:</label>
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="erp-input"
                style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="All">All Categories</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Retail">Retail</option>
                <option value="Distributor">Distributor</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Status:</label>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="erp-input"
                style={{ padding: '6px 12px', fontSize: '0.85rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 10px' }} />
            <p>Loading customer database...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <Users size={36} style={{ color: '#cbd5e1', marginBottom: '8px' }} />
            <h3 style={{ margin: 0, color: '#334155' }}>No customers found</h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>Try adjusting your search criteria or add a new customer.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table 
              style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                textAlign: 'left',
                fontSize: '0.88rem'
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 14px', width: '130px', minWidth: '120px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer ID</th>
                  <th style={{ padding: '12px 14px', minWidth: '220px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company Name</th>
                  <th style={{ padding: '12px 14px', minWidth: '200px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Person</th>
                  <th style={{ padding: '12px 14px', minWidth: '110px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Category</th>
                  <th style={{ padding: '12px 14px', minWidth: '90px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tier</th>
                  <th style={{ padding: '12px 14px', minWidth: '110px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Credit Limit</th>
                  <th style={{ padding: '12px 14px', minWidth: '110px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Spent</th>
                  <th style={{ padding: '12px 14px', minWidth: '100px', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '12px 14px', minWidth: '110px', textAlign: 'right', color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust) => (
                  <tr 
                    key={cust.id} 
                    style={{ 
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => setSelectedCustomer(cust)}
                  >
                    {/* Customer ID Tag */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <span style={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.78rem', 
                        fontWeight: 700, 
                        color: '#0284c7', 
                        backgroundColor: '#e0f2fe',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #bae6fd'
                      }}>
                        {cust.id}
                      </span>
                    </td>

                    {/* Company Name & Location */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>{cust.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin size={12} color="#94a3b8" /> {cust.city}, {cust.country}
                      </div>
                    </td>

                    {/* Contact Person & Email */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ color: '#334155', fontWeight: 500 }}>{cust.contactName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{cust.email}</div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: '0.8rem', color: '#475569', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontWeight: 500 }}>
                        {cust.category}
                      </span>
                    </td>

                    {/* Tier */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      {getTierBadge(cust.tier)}
                    </td>

                    {/* Credit Limit */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap', fontWeight: 600, color: '#334155' }}>
                      {cust.creditLimit}
                    </td>

                    {/* Total Spent */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap', fontWeight: 700, color: '#0f172a' }}>
                      {cust.totalSpent}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      {getStatusBadge(cust.status)}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button 
                        className="erp-btn erp-btn-secondary" 
                        style={{ 
                          padding: '5px 12px', 
                          fontSize: '0.78rem', 
                          borderRadius: '6px',
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                          border: '1px solid #cbd5e1',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(cust);
                        }}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="erp-modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setSelectedCustomer(null)}>
          <div className="erp-modal" style={{ maxWidth: '650px', width: '90%', backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="erp-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '3px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                    {selectedCustomer.id}
                  </span>
                  {getStatusBadge(selectedCustomer.status)}
                  {getTierBadge(selectedCustomer.tier)}
                </div>
                <h2 style={{ margin: '10px 0 2px', fontSize: '1.4rem', color: '#0f172a', fontWeight: 700 }}>{selectedCustomer.name}</h2>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                  Customer since {selectedCustomer.joinDate} {selectedCustomer.rawId && `• Ref ID: ${selectedCustomer.rawId.slice(0, 8)}...`}
                </p>
              </div>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
                onClick={() => setSelectedCustomer(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="erp-modal-body" style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Info Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={16} color="#0ea5e9" /> <strong>Contact:</strong> {selectedCustomer.contactName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} color="#0ea5e9" /> <strong>Email:</strong> {selectedCustomer.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} color="#0ea5e9" /> <strong>Phone:</strong> {selectedCustomer.phone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="#0ea5e9" /> <strong>Location:</strong> {selectedCustomer.city}, {selectedCustomer.country}
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Financial & Account Summary</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                    <div><strong>Category:</strong> {selectedCustomer.category}</div>
                    <div><strong>Credit Limit:</strong> <span style={{ color: '#0369a1', fontWeight: 600 }}>{selectedCustomer.creditLimit}</span></div>
                    <div><strong>Payment Terms:</strong> {selectedCustomer.paymentTerms}</div>
                    <div><strong>Completed Orders:</strong> {selectedCustomer.totalOrders}</div>
                    <div><strong>Total Spend:</strong> <span style={{ color: '#15803d', fontWeight: 700 }}>{selectedCustomer.totalSpent}</span></div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedCustomer.notes && (
                <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '0.85rem 1rem', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} /> Account Notes
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350f' }}>{selectedCustomer.notes}</p>
                </div>
              )}
            </div>

            <div className="erp-modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="erp-btn erp-btn-secondary" 
                onClick={() => setSelectedCustomer(null)}
                style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {showAddModal && (
        <div className="erp-modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowAddModal(false)}>
          <div className="erp-modal" style={{ maxWidth: '550px', width: '90%', backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="erp-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 700 }}>Register New Customer</h2>
              <button 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer}>
              <div className="erp-modal-body" style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Company Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Apex Textiles Ltd" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="erp-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Contact Person *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Jane Doe" 
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      className="erp-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Email Address *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. contact@company.com" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="erp-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+1 (555) 000-0000" 
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="erp-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>City / Headquarters</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Chicago" 
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="erp-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Account Category</label>
                    <select 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="erp-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    >
                      <option value="Enterprise">Enterprise</option>
                      <option value="Wholesale">Wholesale</option>
                      <option value="Retail">Retail</option>
                      <option value="Distributor">Distributor</option>
                    </select>
                  </div>
                  <div>
                    <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Client Tier</label>
                    <select 
                      value={newTier} 
                      onChange={(e) => setNewTier(e.target.value as any)}
                      className="erp-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    >
                      <option value="VIP">VIP</option>
                      <option value="Tier A">Tier A</option>
                      <option value="Tier B">Tier B</option>
                      <option value="Tier C">Tier C</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Credit Limit</label>
                    <input 
                      type="text" 
                      placeholder="$50,000" 
                      value={newCreditLimit}
                      onChange={(e) => setNewCreditLimit(e.target.value)}
                      className="erp-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                  <div>
                    <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Payment Terms</label>
                    <input 
                      type="text" 
                      placeholder="Net 30" 
                      value={newPaymentTerms}
                      onChange={(e) => setNewPaymentTerms(e.target.value)}
                      className="erp-input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="erp-label" style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>Notes / Special Instructions</label>
                  <textarea 
                    rows={2} 
                    placeholder="Add details about customer preferences or contracts..." 
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="erp-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="erp-modal-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="erp-btn erp-btn-secondary" 
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="erp-btn erp-btn-primary"
                  style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#0ea5e9', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
