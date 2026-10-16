const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

const db = require('./db');
const { discoverLeads, resolveRealValidEmail } = require('./services/discover');
const { scoreProspect } = require('./services/score');
const { generateWebsiteForProspect } = require('./services/generator');
const { hostDemoSite } = require('./services/host');
const { sendDemoOutreach, sendWhatsAppOutreach } = require('./services/outreach');
const { recordOutreach, getOutreachLogs } = require('./services/logger');
const { handleIncomingReply } = require('./services/replies');
const { runAutonomousPipeline, getPipelineStatus } = require('./services/pipeline');

// New WhatsApp Marketing, CRM & Automation Services
const whatsappProvider = require('./services/whatsappProvider');
const campaignEngine = require('./services/campaignEngine');
const inboxService = require('./services/inboxService');
const automationEngine = require('./services/automationEngine');
const aiCrmAssistant = require('./services/aiCrmAssistant');
const complianceService = require('./services/complianceService');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Socket.IO for real-time CRM and Inbox updates
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Broadcast helper for real-time frontend reactivity
function emitRealtimeEvent(event, data) {
  io.emit(event, data);
}

app.set('trust proxy', 1);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Hub-Signature-256']
}));

// Capture raw body for webhook verification if needed
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

function getAppBaseUrl(req) {
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, '');
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/+$/, '');
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  return `${proto}://${req.get('host')}`;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'SiteSeller WhatsApp Marketing & CRM Platform',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Config Endpoints
app.get('/api/config', (req, res) => res.json(db.getConfig()));
app.put('/api/config', (req, res) => res.json(db.updateConfig(req.body)));

// Users & Team Endpoints
app.get('/api/users', (req, res) => res.json(db.getUsers()));
app.post('/api/users', (req, res) => res.status(201).json(db.addUser(req.body)));

// -------------------------------------------------------------
// CRM LEADS MANAGEMENT API
// -------------------------------------------------------------
app.get('/api/crm/leads', (req, res) => {
  try {
    const list = db.getLeads(req.query);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/crm/leads/:id', (req, res) => {
  const lead = db.getLeadById(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

app.post('/api/crm/leads', (req, res) => {
  try {
    const scored = scoreProspect(req.body);
    const created = db.addLead(scored);
    emitRealtimeEvent('lead:created', created);
    automationEngine.trigger('lead.created', { lead: created });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/crm/leads/:id', (req, res) => {
  try {
    const prevLead = db.getLeadById(req.params.id);
    const updated = db.updateLead(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Lead not found' });

    emitRealtimeEvent('lead:updated', updated);

    // Trigger workflow if status changed
    if (prevLead && req.body.status && req.body.status !== prevLead.status) {
      automationEngine.trigger('lead.status_changed', { lead: updated, prev_status: prevLead.status, new_status: req.body.status });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/crm/leads/:id', (req, res) => {
  const success = db.deleteLead(req.params.id);
  emitRealtimeEvent('lead:deleted', { id: req.params.id });
  res.json({ success });
});

// Bulk Lead Operations (Bulk Tag, Bulk Status, Bulk Assign, Bulk Delete)
app.post('/api/crm/leads/bulk-update', (req, res) => {
  try {
    const { lead_ids, status, assigned_to_id, add_tags, remove_tags } = req.body;
    if (!Array.isArray(lead_ids) || lead_ids.length === 0) {
      return res.status(400).json({ error: 'lead_ids array is required' });
    }

    const assignedUser = assigned_to_id ? db.getUserById(assigned_to_id) : null;
    const updatedLeads = [];

    for (const id of lead_ids) {
      const lead = db.getLeadById(id);
      if (lead) {
        let tags = lead.tags || [];
        if (Array.isArray(add_tags)) {
          for (const t of add_tags) {
            if (!tags.includes(t)) tags.push(t);
          }
        }
        if (Array.isArray(remove_tags)) {
          tags = tags.filter(t => !remove_tags.includes(t));
        }

        const updates = { tags };
        if (status) updates.status = status;
        if (assignedUser) updates.assigned_to = assignedUser;

        const u = db.updateLead(id, updates);
        if (u) updatedLeads.push(u);
      }
    }

    emitRealtimeEvent('leads:bulk_updated', updatedLeads);
    db.addAuditLog('LEADS_BULK_UPDATED', `Bulk updated ${updatedLeads.length} leads`, { count: updatedLeads.length });
    res.json({ success: true, updated_count: updatedLeads.length, leads: updatedLeads });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CSV / Excel Lead Import with Column Mapping & Deduplication
app.post('/api/crm/leads/import', (req, res) => {
  try {
    const { leads: rawRows, mapping = {}, default_tags = [] } = req.body;
    if (!Array.isArray(rawRows) || rawRows.length === 0) {
      return res.status(400).json({ error: 'Rows array is required' });
    }

    const existingLeads = db.getLeads();
    const importedLeads = [];
    let duplicatesSkipped = 0;

    for (const row of rawRows) {
      const name = row[mapping.business_name || 'Business Name'] || row.name || row.business_name || 'Imported Lead';
      const phone = row[mapping.phone || 'Phone'] || row.phone || '';
      const email = row[mapping.email || 'Email'] || row.email || '';
      const city = row[mapping.city || 'City'] || row.city || 'Toronto';
      const category = row[mapping.category || 'Category'] || row.category || 'General Service';
      const address = row[mapping.address || 'Address'] || row.address || `${city}, Center`;

      const cleanDigits = phone.replace(/[^0-9]/g, '');
      const isDuplicate = existingLeads.some(l => 
        (cleanDigits && l.clean_phone && l.clean_phone.endsWith(cleanDigits)) ||
        (email && l.email && l.email.toLowerCase() === email.toLowerCase())
      );

      if (isDuplicate) {
        duplicatesSkipped++;
        continue;
      }

      const newLead = db.addLead({
        business_name: name,
        contact_person: name,
        phone,
        email,
        city,
        category,
        address,
        tags: default_tags.length > 0 ? default_tags : ['Imported Lead'],
        status: 'NEW',
        discovery_source: 'CSV Import'
      });

      importedLeads.push(newLead);
      automationEngine.trigger('lead.imported', { lead: newLead });
    }

    db.addAuditLog('LEADS_IMPORTED', `Imported ${importedLeads.length} leads (${duplicatesSkipped} duplicates skipped)`, { imported: importedLeads.length, duplicates: duplicatesSkipped });
    res.json({
      success: true,
      imported_count: importedLeads.length,
      duplicates_skipped: duplicatesSkipped,
      leads: importedLeads
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tags & Segments
app.get('/api/crm/tags', (req, res) => res.json(db.getTags()));
app.post('/api/crm/tags', (req, res) => res.status(201).json(db.addTag(req.body)));
app.delete('/api/crm/tags/:id', (req, res) => res.json({ success: db.deleteTag(req.params.id) }));

app.get('/api/crm/segments', (req, res) => res.json(db.getSegments()));
app.post('/api/crm/segments', (req, res) => res.status(201).json(db.addSegment(req.body)));

// -------------------------------------------------------------
// WHATSAPP BROADCAST CAMPAIGNS API
// -------------------------------------------------------------
app.get('/api/campaigns', (req, res) => res.json(db.getCampaigns()));
app.get('/api/campaigns/:id', (req, res) => {
  const c = db.getCampaignById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Campaign not found' });
  res.json(c);
});
app.post('/api/campaigns', (req, res) => res.status(201).json(db.saveCampaign(req.body)));
app.put('/api/campaigns/:id', (req, res) => {
  const updated = db.updateCampaign(req.params.id, req.body);
  res.json(updated);
});

app.post('/api/campaigns/:id/launch', async (req, res) => {
  try {
    const result = await campaignEngine.launchCampaign(req.params.id);
    emitRealtimeEvent('campaign:launched', result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campaigns/:id/pause', (req, res) => {
  const result = campaignEngine.pauseCampaign(req.params.id);
  emitRealtimeEvent('campaign:paused', { id: req.params.id });
  res.json(result);
});

app.post('/api/campaigns/:id/resume', (req, res) => {
  const result = campaignEngine.resumeCampaign(req.params.id);
  emitRealtimeEvent('campaign:resumed', { id: req.params.id });
  res.json(result);
});

app.post('/api/campaigns/:id/cancel', (req, res) => {
  const result = campaignEngine.cancelCampaign(req.params.id);
  emitRealtimeEvent('campaign:cancelled', { id: req.params.id });
  res.json(result);
});

app.post('/api/campaigns/test-send', async (req, res) => {
  try {
    const { test_phone, template_id, sample_lead } = req.body;
    if (!test_phone) return res.status(400).json({ error: 'test_phone is required' });
    const result = await campaignEngine.sendTestMessage(test_phone, template_id, sample_lead);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/campaigns/:id/recipients', (req, res) => {
  res.json(db.getCampaignRecipients(req.params.id));
});

// -------------------------------------------------------------
// WATI-STYLE SHARED TEAM INBOX API
// -------------------------------------------------------------
app.get('/api/inbox/conversations', (req, res) => {
  try {
    const list = inboxService.getConversations(req.query);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/inbox/conversations/:id/messages', (req, res) => {
  try {
    const data = inboxService.getConversationMessages(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inbox/conversations/:id/messages', async (req, res) => {
  try {
    const result = await inboxService.sendMessage({
      conversationId: req.params.id,
      text: req.body.text,
      agentName: req.body.agentName || 'Devesh Kumar',
      templateName: req.body.templateName || null,
      mediaUrl: req.body.mediaUrl || null
    });
    if (result.success) {
      emitRealtimeEvent('inbox:message_sent', { conversationId: req.params.id, message: result.message });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inbox/conversations/:id/notes', (req, res) => {
  try {
    const note = inboxService.addInternalNote(req.params.id, req.body.text, req.body.author);
    emitRealtimeEvent('inbox:note_added', { conversationId: req.params.id, note });
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/inbox/conversations/:id/assign', (req, res) => {
  try {
    const updated = inboxService.assignConversation(req.params.id, req.body.user_id);
    emitRealtimeEvent('inbox:assigned', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/inbox/conversations/:id/status', (req, res) => {
  try {
    const updated = inboxService.updateConversationStatus(req.params.id, req.body.status);
    emitRealtimeEvent('inbox:status_changed', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Simulate Incoming Message for zero-friction testing & demo
app.post('/api/inbox/simulate-incoming', async (req, res) => {
  try {
    const { phone, text, senderName } = req.body;
    if (!phone || !text) return res.status(400).json({ error: 'phone and text are required' });

    const result = await inboxService.handleIncomingMessage({
      fromPhone: phone,
      text,
      senderName: senderName || 'Customer',
      externalId: `sim_${Date.now()}`
    });

    emitRealtimeEvent('inbox:message_received', result);
    automationEngine.trigger('whatsapp.message_received', { phone, text, lead_id: result.lead_id });

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// WHATSAPP PROVIDER SETTINGS & WEBHOOKS
// -------------------------------------------------------------
app.get('/api/providers/config', (req, res) => res.json(db.getProviderConfig()));
app.put('/api/providers/config', (req, res) => res.json(db.updateProviderConfig(req.body)));

app.post('/api/providers/test-connection', async (req, res) => {
  try {
    const test = await whatsappProvider.testConnection();
    res.json(test);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/providers/templates', async (req, res) => {
  try {
    const tmpls = await whatsappProvider.fetchTemplates();
    res.json(tmpls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/providers/templates/sync', async (req, res) => {
  try {
    const synced = await whatsappProvider.fetchTemplates();
    res.json({ success: true, count: synced.length, templates: synced });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Meta Webhook Verification (Hub Challenge)
app.get('/api/webhooks/whatsapp', (req, res) => {
  const config = db.getProviderConfig();
  const verifyToken = config.meta?.verify_token || 'meta_verify_token_siteseller_2026';

  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[Webhook: Meta] Webhook verified successfully!');
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }
  res.sendStatus(400);
});

// Meta Webhook Event Receiver (Incoming Messages & Status updates)
app.post('/api/webhooks/whatsapp', async (req, res) => {
  try {
    const body = req.body;
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;

          // Process status callbacks (sent, delivered, read, failed)
          if (value.statuses) {
            for (const statusObj of value.statuses) {
              const msgId = statusObj.id;
              const status = statusObj.status; // sent, delivered, read, failed
              db.updateMessageStatus(null, status, msgId);
              emitRealtimeEvent('whatsapp:status_update', { messageId: msgId, status });
            }
          }

          // Process incoming messages
          if (value.messages) {
            for (const msg of value.messages) {
              const fromPhone = msg.from;
              const text = msg.text?.body || msg.button?.text || '';
              const contact = value.contacts?.find(c => c.wa_id === fromPhone);
              const senderName = contact?.profile?.name || 'WhatsApp Customer';

              const ingested = await inboxService.handleIncomingMessage({
                fromPhone,
                text,
                senderName,
                externalId: msg.id,
                timestamp: new Date(Number(msg.timestamp) * 1000).toISOString()
              });

              emitRealtimeEvent('inbox:message_received', ingested);
              automationEngine.trigger('whatsapp.message_received', { phone: fromPhone, text, lead_id: ingested.lead_id });
            }
          }
        }
      }
      return res.status(200).send('EVENT_RECEIVED');
    }
    res.sendStatus(404);
  } catch (err) {
    console.error('[Webhook: Meta Error]:', err);
    res.sendStatus(500);
  }
});

// WATI Webhook Event Receiver
app.post('/api/webhooks/wati', async (req, res) => {
  try {
    const payload = req.body;
    const phone = payload.waId || payload.senderPhone;
    const text = payload.text || payload.messageText || '';
    const eventType = payload.eventType || payload.type;

    if (phone && text) {
      const ingested = await inboxService.handleIncomingMessage({
        fromPhone: phone,
        text,
        senderName: payload.senderName || 'WATI Customer',
        externalId: payload.id || `wati_${Date.now()}`
      });
      emitRealtimeEvent('inbox:message_received', ingested);
      automationEngine.trigger('whatsapp.message_received', { phone, text, lead_id: ingested.lead_id });
    }

    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Compliance & Suppression Endpoints
app.get('/api/compliance/suppression', (req, res) => res.json(db.getSuppressionList()));
app.post('/api/compliance/suppression', (req, res) => {
  const { phone, reason } = req.body;
  const rec = complianceService.processOptOut(phone, reason || 'Manual suppression add');
  res.json(rec);
});
app.delete('/api/compliance/suppression/:phone', (req, res) => {
  const success = db.removeFromSuppressionList(req.params.phone);
  res.json({ success });
});

// -------------------------------------------------------------
// AUTOMATIONS & WORKFLOWS API
// -------------------------------------------------------------
app.get('/api/workflows', (req, res) => res.json(db.getWorkflows()));
app.post('/api/workflows', (req, res) => res.status(201).json(db.saveWorkflow(req.body)));
app.put('/api/workflows/:id', (req, res) => res.json(db.saveWorkflow({ id: req.params.id, ...req.body })));
app.get('/api/workflows/executions', (req, res) => res.json(db.getWorkflowExecutions()));
app.post('/api/workflows/:id/trigger-test', async (req, res) => {
  try {
    const wf = db.getWorkflows().find(w => w.id === req.params.id);
    if (!wf) return res.status(404).json({ error: 'Workflow not found' });
    const dummyLead = db.getLeads()[0] || { id: 'test-lead', business_name: 'Sample Clinic' };
    const logs = await automationEngine._executeWorkflowActions(wf, { lead: dummyLead });
    res.json({ success: true, actions_executed: logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// FOLLOW-UP TASKS API
// -------------------------------------------------------------
app.get('/api/crm/tasks', (req, res) => res.json(db.getTasks(req.query)));
app.post('/api/crm/tasks', (req, res) => res.status(201).json(db.addTask(req.body)));
app.put('/api/crm/tasks/:id', (req, res) => res.json(db.updateTask(req.params.id, req.body)));

// -------------------------------------------------------------
// AI CRM ASSISTANT API
// -------------------------------------------------------------
app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { messages, lead } = req.body;
    const summary = await aiCrmAssistant.summarizeConversation(messages, lead);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/classify', async (req, res) => {
  try {
    const { text } = req.body;
    const classification = await aiCrmAssistant.classifyIntent(text);
    res.json(classification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/suggest-reply', async (req, res) => {
  try {
    const { conversation, lead } = req.body;
    const suggestions = await aiCrmAssistant.suggestReplies(conversation, lead);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ai/recommend-action', async (req, res) => {
  try {
    const { lead } = req.body;
    const recommendation = await aiCrmAssistant.recommendNextAction(lead);
    res.json(recommendation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// EXECUTIVE ANALYTICS & AUDIT LOGS
// -------------------------------------------------------------
app.get('/api/analytics/dashboard', (req, res) => {
  try {
    const leads = db.getLeads();
    const campaigns = db.getCampaigns();
    const convs = db.getConversations();
    const tasks = db.getTasks();

    // Calculate real numbers from live database
    const totalLeads = leads.length;
    const hotLeads = leads.filter(l => l.tags && l.tags.includes('Hot Lead')).length;
    const qualifiedLeads = leads.filter(l => l.status === 'QUALIFIED').length;
    const contactedLeads = leads.filter(l => l.status === 'CONTACTED').length;
    const repliedLeads = leads.filter(l => l.status === 'REPLIED' || l.status === 'INTERESTED').length;
    const wonClients = leads.filter(l => l.status === 'WON').length;
    const openConversations = convs.filter(c => c.status === 'OPEN').length;
    const unreadConversations = convs.filter(c => c.unread_count > 0).length;
    const pendingTasks = tasks.filter(t => !t.completed).length;

    // Aggregate campaign metrics
    let totalBroadcastsSent = 0;
    let totalDelivered = 0;
    let totalRead = 0;
    let totalFailed = 0;

    for (const c of campaigns) {
      if (c.stats) {
        totalBroadcastsSent += (c.stats.sent || 0) + (c.stats.delivered || 0);
        totalDelivered += c.stats.delivered || 0;
        totalRead += c.stats.read || 0;
        totalFailed += c.stats.failed || 0;
      }
    }

    const deliveryRate = totalBroadcastsSent > 0 ? Math.round((totalDelivered / totalBroadcastsSent) * 100) : 98;
    const replyRate = contactedLeads > 0 ? Math.round((repliedLeads / contactedLeads) * 100) : 18;

    res.json({
      total_leads: totalLeads,
      hot_leads: hotLeads,
      qualified_leads: qualifiedLeads,
      contacted_leads: contactedLeads,
      replied_leads: repliedLeads,
      won_clients: wonClients,
      open_conversations: openConversations,
      unread_conversations: unreadConversations,
      pending_tasks: pendingTasks,
      broadcasts_sent: totalBroadcastsSent,
      delivery_rate: deliveryRate,
      reply_rate: replyRate,
      active_campaigns_count: campaigns.filter(c => c.status === 'IN_PROGRESS').length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/audit-logs', (req, res) => res.json(db.getAuditLogs()));

// -------------------------------------------------------------
// PRESERVED PROSPECTS & SKILLS API (100% Backward Compatibility)
// -------------------------------------------------------------
app.get('/api/prospects', (req, res) => {
  const { status, category, search } = req.query;
  let list = db.getProspects();

  if (status && status !== 'all') {
    list = list.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }
  if (category && category !== 'all') {
    list = list.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.business_name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }
  res.json(list);
});

app.post('/api/prospects', (req, res) => {
  const scored = scoreProspect(req.body);
  const created = db.addProspect(scored);
  res.status(201).json(created);
});

app.put('/api/prospects/:id', (req, res) => {
  const updated = db.updateProspect(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Prospect not found' });
  res.json(updated);
});

app.delete('/api/prospects/:id', (req, res) => {
  const success = db.deleteProspect(req.params.id);
  res.json({ success });
});

app.post('/api/leads/verify-email', async (req, res) => {
  try {
    const { email, business_name, city } = req.body;
    const result = await resolveRealValidEmail(business_name, city, email);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/leads/export/csv', (req, res) => {
  try {
    const list = db.getLeads();
    const headers = ['Lead ID', 'Business Name', 'Category', 'City', 'Phone', 'Email', 'Lead Score', 'Rating', 'Address', 'Status', 'Tags', 'Created At'];
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      return `"${String(str).replace(/"/g, '""')}"`;
    };
    const rows = list.map(p => [
      escapeCsv(p.id),
      escapeCsv(p.business_name),
      escapeCsv(p.category),
      escapeCsv(p.city),
      escapeCsv(p.phone),
      escapeCsv(p.email),
      escapeCsv(p.lead_score),
      escapeCsv(p.rating),
      escapeCsv(p.address),
      escapeCsv(p.status),
      escapeCsv((p.tags || []).join('; ')),
      escapeCsv(p.created_at)
    ].join(','));

    const csvContent = '\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="crm_leads_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/leads/export/json', (req, res) => {
  try {
    const list = db.getLeads();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="crm_leads_${new Date().toISOString().slice(0, 10)}.json"`);
    res.status(200).send(JSON.stringify(list, null, 2));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SKILL 1: DISCOVER
app.post('/api/skills/discover', async (req, res) => {
  try {
    const { city, niche, limit, source, apify_api_token, apollo_api_key } = req.body;
    const result = await discoverLeads({ city, niche, limit, source, apify_api_token, apollo_api_key });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SKILL 2: SCORE
app.post('/api/skills/score/:id', (req, res) => {
  const prospect = db.getProspectById(req.params.id);
  if (!prospect) return res.status(404).json({ error: 'Prospect not found' });
  const scored = scoreProspect(prospect);
  const updated = db.updateProspect(prospect.id, scored);
  res.json(updated);
});

// SKILL 3: GENERATE
app.post('/api/skills/generate/:id', async (req, res) => {
  try {
    const baseUrl = getAppBaseUrl(req);
    const site = await generateWebsiteForProspect(req.params.id, baseUrl);
    res.json(site);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SKILL 4: HOST
app.post('/api/skills/host/:id', async (req, res) => {
  try {
    const baseUrl = getAppBaseUrl(req);
    const site = await hostDemoSite(req.params.id, baseUrl);
    res.json(site);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public Demo Website Server Endpoint
app.get('/demos/:siteId', (req, res) => {
  const site = db.getSiteById(req.params.siteId);
  if (!site || !site.html_content) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Demo Site Not Found</title><script src="https://cdn.tailwindcss.com"></script></head>
      <body class="bg-slate-900 text-white min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 class="text-4xl font-bold text-indigo-400 mb-2">Demo Site Not Found</h1>
          <p class="text-slate-400">The requested demo website has not been generated yet or has expired.</p>
        </div>
      </body>
      </html>
    `);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(site.html_content);
});

app.get('/api/sites/prospect/:prospectId', (req, res) => {
  const site = db.getSiteByProspectId(req.params.prospectId);
  if (!site) return res.status(404).json({ error: 'No site generated for this prospect yet' });
  res.json(site);
});

app.get('/api/sites/:siteId', (req, res) => {
  const site = db.getSiteById(req.params.siteId);
  if (!site) return res.status(404).json({ error: 'Site not found' });
  res.json(site);
});

// SKILL 5 & 6: OUTREACH & LOG
app.post('/api/skills/outreach/:id', async (req, res) => {
  try {
    const baseUrl = getAppBaseUrl(req);
    const result = await sendDemoOutreach(req.params.id, {
      baseUrl,
      subject: req.body.subject,
      body: req.body.body,
      email: req.body.email
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/skills/outreach/whatsapp/:id', async (req, res) => {
  try {
    const baseUrl = getAppBaseUrl(req);
    const result = await sendWhatsAppOutreach(req.params.id, {
      baseUrl,
      message: req.body.message,
      phone: req.body.phone
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/skills/outreach/both/:id', async (req, res) => {
  try {
    const baseUrl = getAppBaseUrl(req);
    const emailRes = await sendDemoOutreach(req.params.id, {
      baseUrl,
      subject: req.body.subject,
      body: req.body.body,
      email: req.body.email
    });
    const waRes = await sendWhatsAppOutreach(req.params.id, {
      baseUrl,
      message: req.body.waMessage || req.body.message,
      phone: req.body.phone
    });
    res.json({
      success: true,
      email: emailRes,
      whatsapp: waRes,
      wa_web_link: waRes.wa_web_link,
      wa_app_link: waRes.wa_app_link,
      prospect: waRes.prospect
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/logs', (req, res) => res.json(getOutreachLogs()));

app.post('/api/skills/replies/simulate', (req, res) => {
  try {
    const { logId, replyText } = req.body;
    if (!logId || !replyText) {
      return res.status(400).json({ error: 'logId and replyText are required' });
    }
    const result = handleIncomingReply(logId, replyText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pipeline/run', (req, res) => {
  const baseUrl = getAppBaseUrl(req);
  runAutonomousPipeline({ ...req.body, baseUrl });
  res.json({ message: 'Pipeline cycle launched', status: getPipelineStatus() });
});

app.get('/api/pipeline/status', (req, res) => res.json(getPipelineStatus()));

app.post('/api/db/clear', (req, res) => {
  try {
    const result = db.clearDatabase();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend assets if built
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/demos')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Start Server with Socket.IO support
server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 SiteSeller WhatsApp Marketing & CRM Platform running on port ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`⚡ Socket.IO real-time engine ready`);
  console.log(`================================================================`);
});
