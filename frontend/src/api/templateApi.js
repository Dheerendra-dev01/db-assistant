import api from './api';

const TEMPLATE_BASE_URL = '/api/templates';

export const templateApi = {
  // Create a new template
  createTemplate: async (templateData) => {
    try {
      const response = await api.post(`${TEMPLATE_BASE_URL}/create`, templateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all templates with filtering and pagination
  getTemplates: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all parameters to query string
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`${TEMPLATE_BASE_URL}/all?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single template by ID
  getTemplate: async (templateId) => {
    try {
      const response = await api.get(`${TEMPLATE_BASE_URL}/${templateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a template
  updateTemplate: async (templateId, updateData) => {
    try {
      const response = await api.put(`${TEMPLATE_BASE_URL}/${templateId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a template
  deleteTemplate: async (templateId) => {
    try {
      const response = await api.delete(`${TEMPLATE_BASE_URL}/${templateId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Use a template (increment usage)
  useTemplate: async (templateId) => {
    try {
      const response = await api.post(`${TEMPLATE_BASE_URL}/${templateId}/use`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Rate a template
  rateTemplate: async (templateId, rating) => {
    try {
      const response = await api.post(`${TEMPLATE_BASE_URL}/${templateId}/rate`, { rating });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Fork a template
  forkTemplate: async (templateId, forkData) => {
    try {
      const response = await api.post(`${TEMPLATE_BASE_URL}/${templateId}/fork`, forkData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search templates
  searchTemplates: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`${TEMPLATE_BASE_URL}/search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get template statistics
  getTemplateStats: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`${TEMPLATE_BASE_URL}/stats?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default templateApi; 