import axios from 'axios';

export const BACKEND_URL = 'https://leads-gen-b3uj.onrender.com';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`;
  }
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return '/api';
  }
  return `${BACKEND_URL}/api`;
};

const api = axios.create({
  baseURL: getBaseURL()
});

export const getHealth = () => api.get('/health');
export const getConfig = () => api.get('/config');
export const updateConfig = (data) => api.put('/config', data);

export const getProspects = (params) => api.get('/prospects', { params });
export const addProspect = (data) => api.post('/prospects', data);
export const updateProspect = (id, data) => api.put(`/prospects/${id}`, data);
export const deleteProspect = (id) => api.delete(`/prospects/${id}`);

// Skills
export const runDiscoverSkill = (data) => api.post('/skills/discover', data);
export const runScoreSkill = (id) => api.post(`/skills/score/${id}`);
export const runGenerateSkill = (id) => api.post(`/skills/generate/${id}`);
export const runHostSkill = (id) => api.post(`/skills/host/${id}`);
export const runOutreachSkill = (id, data) => api.post(`/skills/outreach/${id}`, data);
export const runWhatsAppOutreachSkill = (id, data) => api.post(`/skills/outreach/whatsapp/${id}`, data);
export const runBothOutreachSkill = (id, data) => api.post(`/skills/outreach/both/${id}`, data);
export const getLogs = () => api.get('/logs');
export const simulateReply = (data) => api.post('/skills/replies/simulate', data);

// Pipeline
export const runAutonomousPipeline = (data) => api.post('/pipeline/run', data);
export const getPipelineStatus = () => api.get('/pipeline/status');

// Sites
export const getSiteForProspect = (prospectId) => api.get(`/sites/prospect/${prospectId}`);
export const getSiteById = (siteId) => api.get(`/sites/${siteId}`);

export default api;
