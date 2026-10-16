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

// Health & System Config
export const getHealth = () => api.get('/health');
export const getConfig = () => api.get('/config');
export const updateConfig = (data) => api.put('/config', data);
export const getUsers = () => api.get('/users');

// CRM Leads Management
export const getLeads = (params) => api.get('/crm/leads', { params });
export const getLeadById = (id) => api.get(`/crm/leads/${id}`);
export const addLead = (data) => api.post('/crm/leads', data);
export const updateLead = (id, data) => api.put(`/crm/leads/${id}`, data);
export const deleteLead = (id) => api.delete(`/crm/leads/${id}`);
export const bulkUpdateLeads = (data) => api.post('/crm/leads/bulk-update', data);
export const importLeads = (data) => api.post('/crm/leads/import', data);

// Backward Compatibility for Prospects
export const getProspects = (params) => api.get('/prospects', { params });
export const addProspect = (data) => api.post('/prospects', data);
export const updateProspect = (id, data) => api.put(`/prospects/${id}`, data);
export const deleteProspect = (id) => api.delete(`/prospects/${id}`);

// Tags & Segments
export const getTags = () => api.get('/crm/tags');
export const addTag = (data) => api.post('/crm/tags', data);
export const deleteTag = (id) => api.delete(`/crm/tags/${id}`);
export const getSegments = () => api.get('/crm/segments');
export const addSegment = (data) => api.post('/crm/segments', data);

// WhatsApp Broadcast Campaigns
export const getCampaigns = () => api.get('/campaigns');
export const getCampaignById = (id) => api.get(`/campaigns/${id}`);
export const saveCampaign = (data) => api.post('/campaigns', data);
export const updateCampaign = (id, data) => api.put(`/campaigns/${id}`, data);
export const launchCampaign = (id) => api.post(`/campaigns/${id}/launch`);
export const pauseCampaign = (id) => api.post(`/campaigns/${id}/pause`);
export const resumeCampaign = (id) => api.post(`/campaigns/${id}/resume`);
export const cancelCampaign = (id) => api.post(`/campaigns/${id}/cancel`);
export const testSendCampaign = (data) => api.post('/campaigns/test-send', data);
export const getCampaignRecipients = (id) => api.get(`/campaigns/${id}/recipients`);

// WATI-Style Shared Team Inbox
export const getConversations = (params) => api.get('/inbox/conversations', { params });
export const getConversationMessages = (id) => api.get(`/inbox/conversations/${id}/messages`);
export const sendInboxMessage = (id, data) => api.post(`/inbox/conversations/${id}/messages`, data);
export const addInboxNote = (id, data) => api.post(`/inbox/conversations/${id}/notes`, data);
export const assignConversation = (id, data) => api.put(`/inbox/conversations/${id}/assign`, data);
export const updateConversationStatus = (id, data) => api.put(`/inbox/conversations/${id}/status`, data);
export const simulateIncomingMessage = (data) => api.post('/inbox/simulate-incoming', data);

// WhatsApp Providers & Settings
export const getProviderConfig = () => api.get('/providers/config');
export const updateProviderConfig = (data) => api.put('/providers/config', data);
export const testProviderConnection = () => api.post('/providers/test-connection');
export const getProviderTemplates = () => api.get('/providers/templates');
export const syncProviderTemplates = () => api.post('/providers/templates/sync');
export const getSuppressionList = () => api.get('/compliance/suppression');
export const addToSuppressionList = (data) => api.post('/compliance/suppression', data);
export const removeFromSuppressionList = (phone) => api.delete(`/compliance/suppression/${encodeURIComponent(phone)}`);

// Automations & Workflows
export const getWorkflows = () => api.get('/workflows');
export const saveWorkflow = (data) => api.post('/workflows', data);
export const updateWorkflow = (id, data) => api.put(`/workflows/${id}`, data);
export const triggerTestWorkflow = (id) => api.post(`/workflows/${id}/trigger-test`);
export const getWorkflowExecutions = () => api.get('/workflows/executions');

// Follow-Up Tasks
export const getTasks = (params) => api.get('/crm/tasks', { params });
export const addTask = (data) => api.post('/crm/tasks', data);
export const updateTask = (id, data) => api.put(`/crm/tasks/${id}`, data);

// AI CRM Assistant
export const aiSummarizeChat = (data) => api.post('/ai/summarize', data);
export const aiClassifyIntent = (data) => api.post('/ai/classify', data);
export const aiSuggestReplies = (data) => api.post('/ai/suggest-reply', data);
export const aiRecommendAction = (data) => api.post('/ai/recommend-action', data);

// Executive Analytics & Audit Logs
export const getDashboardAnalytics = () => api.get('/analytics/dashboard');
export const getAuditLogs = () => api.get('/audit-logs');

// Skills (Discover, Score, Generate, Host, Outreach)
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

// Database reset & Verification
export const clearDatabase = () => api.post('/db/clear');
export const verifyLeadEmail = (data) => api.post('/leads/verify-email', data);

// Export Leads
export const getExportCsvUrl = () => `${getBaseURL()}/leads/export/csv`;
export const getExportJsonUrl = () => `${getBaseURL()}/leads/export/json`;

export default api;
