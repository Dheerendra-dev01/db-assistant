import api from './api';

const ACTIVITY_BASE_URL = '/api/activities';

export const activityApi = {
  // Create a new activity
  createActivity: async (activityData) => {
    const response = await api.post(`${ACTIVITY_BASE_URL}/create`, activityData);
    return response.data;
  },
  // Get all activities
  getActivities: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    const response = await api.get(`${ACTIVITY_BASE_URL}/all?${queryParams}`);
    return response.data;
  },
  // Get activity statistics
  getActivityStats: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    const response = await api.get(`${ACTIVITY_BASE_URL}/stats?${queryParams}`);
    return response.data;
  },
  // Get a single activity
  getActivity: async (activityId) => {
    const response = await api.get(`${ACTIVITY_BASE_URL}/${activityId}`);
    return response.data;
  },
  // Update an activity
  updateActivity: async (activityId, updateData) => {
    const response = await api.put(`${ACTIVITY_BASE_URL}/${activityId}`, updateData);
    return response.data;
  },
  // Delete an activity
  deleteActivity: async (activityId) => {
    const response = await api.delete(`${ACTIVITY_BASE_URL}/${activityId}`);
    return response.data;
  },
  // Mark activity as read
  markAsRead: async (activityId) => {
    const response = await api.patch(`${ACTIVITY_BASE_URL}/${activityId}/read`);
    return response.data;
  },
  // Mark all activities as read for a user
  markAllAsRead: async (userId) => {
    const response = await api.patch(`${ACTIVITY_BASE_URL}/user/${userId}/read-all`);
    return response.data;
  }
};

export default activityApi; 