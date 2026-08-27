const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const api = {
  get: async (model: string) => {
    const res = await fetch(`${API_URL}/${model}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    
    if (model === 'workOrder') {
      const localOrders = JSON.parse(localStorage.getItem('demoWorkOrders') || '[]');
      return [...localOrders, ...data];
    }
    
    return data;
  },
  
  getById: async (model: string, id: string) => {
    const res = await fetch(`${API_URL}/${model}/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },

  create: async (model: string, data: any) => {
    if (model === 'workOrder') {
      const localOrders = JSON.parse(localStorage.getItem('demoWorkOrders') || '[]');
      const newOrder = { id: data.workOrderId, ...data, startDate: new Date().toISOString(), endDate: new Date().toISOString() };
      localStorage.setItem('demoWorkOrders', JSON.stringify([newOrder, ...localOrders]));
      return newOrder;
    }
    const res = await fetch(`${API_URL}/${model}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
  },

  update: async (model: string, id: string, data: any) => {
    const res = await fetch(`${API_URL}/${model}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
  },

  remove: async (model: string, id: string) => {
    const res = await fetch(`${API_URL}/${model}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete');
    return true;
  }
};
