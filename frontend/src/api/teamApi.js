import api from './api';

const TEAM_BASE_URL = '/api/teams';

export const teamApi = {
  // Create a new team
  createTeam: async (teamData) => {
    const response = await api.post(`${TEAM_BASE_URL}/create`, teamData);
    return response.data;
  },
  // Get all teams
  getTeams: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    const response = await api.get(`${TEAM_BASE_URL}/all?${queryParams}`);
    return response.data;
  },
  // Get a single team
  getTeam: async (teamId) => {
    const response = await api.get(`${TEAM_BASE_URL}/${teamId}`);
    return response.data;
  },
  // Update a team
  updateTeam: async (teamId, updateData) => {
    const response = await api.put(`${TEAM_BASE_URL}/${teamId}`, updateData);
    return response.data;
  },
  // Delete a team
  deleteTeam: async (teamId) => {
    const response = await api.delete(`${TEAM_BASE_URL}/${teamId}`);
    return response.data;
  },
  // Add member
  addMember: async (teamId, member) => {
    const response = await api.post(`${TEAM_BASE_URL}/${teamId}/members`, member);
    return response.data;
  },
  // Remove member
  removeMember: async (teamId, email) => {
    const response = await api.delete(`${TEAM_BASE_URL}/${teamId}/members`, { data: { email } });
    return response.data;
  }
};

export default teamApi;