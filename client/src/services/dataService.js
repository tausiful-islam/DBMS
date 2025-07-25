import api from './api';

export const dataService = {
  // Get all data with pagination and filters
  getData: async (params = {}) => {
    const response = await api.get('/data', { params });
    return response.data;
  },

  // Get single data entry
  getDataById: async (id) => {
    const response = await api.get(`/data/${id}`);
    return response.data;
  },

  // Create new data entry
  createData: async (data) => {
    const response = await api.post('/data', data);
    return response.data;
  },

  // Update data entry
  updateData: async (id, data) => {
    const response = await api.put(`/data/${id}`, data);
    return response.data;
  },

  // Delete data entry
  deleteData: async (id) => {
    const response = await api.delete(`/data/${id}`);
    return response.data;
  },

  // Upload CSV
  uploadCSV: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/data/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Export to CSV
  exportCSV: async () => {
    const response = await api.get('/data/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export const analyticsService = {
  // Dashboard data
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  // Price trends
  getPriceTrends: async (params = {}) => {
    const response = await api.get('/analytics/price-trends', { params });
    return response.data;
  },

  // Supply vs demand
  getSupplyDemand: async (params = {}) => {
    const response = await api.get('/analytics/supply-demand', { params });
    return response.data;
  },

  // Regional analysis
  getRegionalAnalysis: async (params = {}) => {
    const response = await api.get('/analytics/regional-analysis', { params });
    return response.data;
  },

  // Seasonal trends
  getSeasonalTrends: async (params = {}) => {
    const response = await api.get('/analytics/seasonal-trends', { params });
    return response.data;
  },

  // Market insights
  getMarketInsights: async () => {
    const response = await api.get('/analytics/market-insights');
    return response.data;
  },
};
