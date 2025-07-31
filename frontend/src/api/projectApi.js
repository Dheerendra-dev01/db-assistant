import api from './api';

const PROJECT_BASE_URL = '/api/projects';

export const projectApi = {
  // Create a new project
  createProject: async (projectData) => {
    try {
      const response = await api.post(`${PROJECT_BASE_URL}/create`, projectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all projects with filtering and pagination
  getProjects: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all parameters to query string
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`${PROJECT_BASE_URL}/all?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single project by ID
  getProject: async (projectId) => {
    try {
      const response = await api.get(`${PROJECT_BASE_URL}/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a project
  updateProject: async (projectId, updateData) => {
    try {
      const response = await api.put(`${PROJECT_BASE_URL}/${projectId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a project
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`${PROJECT_BASE_URL}/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Toggle star status
  toggleStar: async (projectId) => {
    try {
      const response = await api.patch(`${PROJECT_BASE_URL}/${projectId}/star`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Archive/Unarchive project
  toggleArchive: async (projectId) => {
    try {
      const response = await api.patch(`${PROJECT_BASE_URL}/${projectId}/archive`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add member to project
  addMember: async (projectId, email) => {
    try {
      const response = await api.post(`${PROJECT_BASE_URL}/${projectId}/members`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove member from project
  removeMember: async (projectId, email) => {
    try {
      const response = await api.delete(`${PROJECT_BASE_URL}/${projectId}/members`, { 
        data: { email } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get project statistics
  getProjectStats: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const response = await api.get(`${PROJECT_BASE_URL}/stats?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default projectApi; 