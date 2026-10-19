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
export const getNicheOutreachTemplate = (id) => api.get(`/skills/outreach/template/${id}`);
export const getLogs = () => api.get('/logs');
export const simulateReply = (data) => api.post('/skills/replies/simulate', data);

// Pipeline
export const runAutonomousPipeline = (data) => api.post('/pipeline/run', data);
export const getPipelineStatus = () => api.get('/pipeline/status');

// Sites
export const getSiteForProspect = (prospectId) => api.get(`/sites/prospect/${prospectId}`);
export const getSiteById = (siteId) => api.get(`/sites/${siteId}`);

// Database reset
export const clearDatabase = () => api.post('/db/clear');

// Email MX Verification
export const verifyLeadEmail = (data) => api.post('/leads/verify-email', data);

// Export Leads
export const getExportCsvUrl = () => `${getBaseURL()}/leads/export/csv`;
export const getExportJsonUrl = () => `${getBaseURL()}/leads/export/json`;

// WhatsApp Broadcasting
export const getBroadcastStatus = () => api.get('/whatsapp/broadcast/status');
export const getBroadcastTemplates = () => api.get('/whatsapp/broadcast/templates');
export const getBroadcastStats = () => api.get('/whatsapp/broadcast/stats');
export const getBroadcastContacts = (params) => api.get('/whatsapp/broadcast/contacts', { params });
export const addBroadcastContact = (data) => api.post('/whatsapp/broadcast/contacts', data);
export const importBroadcastContacts = (data) => api.post('/whatsapp/broadcast/contacts/import', data);
export const syncProspectsToBroadcastContacts = () => api.post('/whatsapp/broadcast/contacts/sync-prospects');
export const updateBroadcastContactConsent = (id, data) => api.put(`/whatsapp/broadcast/contacts/${id}/consent`, data);
export const deleteBroadcastContact = (id) => api.delete(`/whatsapp/broadcast/contacts/${id}`);

export const getBroadcastCampaigns = () => api.get('/whatsapp/broadcast/campaigns');
export const getBroadcastCampaignById = (id) => api.get(`/whatsapp/broadcast/campaigns/${id}`);
export const createBroadcastCampaign = (data) => api.post('/whatsapp/broadcast/campaigns', data);
export const sendBroadcastCampaign = (id) => api.post(`/whatsapp/broadcast/campaigns/${id}/send`);
export const pauseBroadcastCampaign = (id) => api.post(`/whatsapp/broadcast/campaigns/${id}/pause`);
export const deleteBroadcastCampaign = (id) => api.delete(`/whatsapp/broadcast/campaigns/${id}`);
export const getBroadcastWebhookLogs = () => api.get('/whatsapp/broadcast/webhooks/logs');

export default api;
