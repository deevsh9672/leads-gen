const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { discoverLeads, resolveRealValidEmail } = require('./services/discover');
const { scoreProspect } = require('./services/score');
const { generateWebsiteForProspect } = require('./services/generator');
const { hostDemoSite } = require('./services/host');
const { sendDemoOutreach, sendWhatsAppOutreach, getNicheOutreachTemplates } = require('./services/outreach');
const { recordOutreach, getOutreachLogs } = require('./services/logger');
const { handleIncomingReply } = require('./services/replies');
const { runAutonomousPipeline, getPipelineStatus } = require('./services/pipeline');
const {
  normalizePhoneNumber,
  validateAndFormatContact,
  getWhatsAppCredentials,
  fetchWhatsAppTemplates,
  executeBroadcastCampaign,
  pauseBroadcastCampaign,
  verifyWebhookSignature,
  processWebhookEvent
} = require('./services/whatsappBroadcaster');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

function getAppBaseUrl(req) {
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, '');
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/+$/, '');
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  return `${proto}://${req.get('host')}`;
}

// Initialize seed data if database is empty so user has immediate rich data
function ensureSeedData() {
  const prospects = db.getProspects();
  if (prospects.length === 0) {
    console.log('[Seed] Populating initial demo prospects...');
    const seedData = [
      {
        business_name: 'Apex Rapid Plumbers',
        category: 'Plumbing',
        city: 'Austin',
        phone: '(512) 555-0199',
        email: 'service@apexrapidplumbing.com',
        website_url: null,
        has_website: 'no',
        review_count: 68,
        rating: 4.9,
        address: '1201 S Congress Ave, Austin'
      },
      {
        business_name: 'Heritage Oaks Dental Studio',
        category: 'Dental Clinic',
        city: 'Austin',
        phone: '(512) 555-0233',
        email: 'appointments@heritageoaksdental.com',
        website_url: null,
        has_website: 'no',
        review_count: 135,
        rating: 4.9,
        address: '1114 Barton Springs Rd, Austin'
      },
      {
        business_name: 'Sweet Crumb Artisan Bakery',
        category: 'Bakery',
        city: 'Austin',
        phone: '(512) 555-0311',
        email: 'hello@sweetcrumbartisanbakery.com',
        website_url: null,
        has_website: 'no',
        review_count: 92,
        rating: 4.8,
        address: '1402 S 1st St, Austin'
      },
      {
        business_name: 'Summit Shield Roofing',
        category: 'Roofing',
        city: 'Austin',
        phone: '(512) 555-0422',
        email: 'contact@summitshieldroofing.com',
        website_url: null,
        has_website: 'no',
        review_count: 84,
        rating: 4.9,
        address: '3500 Research Blvd, Austin'
      }
    ];

    for (const item of seedData) {
      const scored = scoreProspect(item);
      db.addProspect(scored);
    }
  }
}
ensureSeedData();

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'SiteSeller Agent', timestamp: new Date().toISOString() });
});

// Config Endpoints
app.get('/api/config', (req, res) => {
  res.json(db.getConfig());
});

app.put('/api/config', (req, res) => {
  const updated = db.updateConfig(req.body);
  res.json(updated);
});

// Prospects Endpoints
app.get('/api/prospects', (req, res) => {
  const { status, category, search } = req.query;
  let list = db.getProspects();

  if (status && status !== 'all') {
    list = list.filter(p => p.status === status);
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

// Live Email DNS MX Verification Endpoint
app.post('/api/leads/verify-email', async (req, res) => {
  try {
    const { email, business_name, city } = req.body;
    const result = await resolveRealValidEmail(business_name, city, email);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export Leads as CSV (Excel / Google Sheets compatible)
app.get('/api/leads/export/csv', (req, res) => {
  try {
    const list = db.getProspects();
    const headers = [
      'Business Name',
      'Category',
      'City',
      'Phone',
      'Email',
      'Lead Score',
      'Rating',
      'Reviews Count',
      'Address',
      'Google Maps URL',
      'Has Website',
      'Status',
      'Discovery Source',
      'Created At'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = list.map(p => [
      escapeCsv(p.business_name),
      escapeCsv(p.category),
      escapeCsv(p.city),
      escapeCsv(p.phone),
      escapeCsv(p.email),
      escapeCsv(p.lead_score),
      escapeCsv(p.rating),
      escapeCsv(p.review_count),
      escapeCsv(p.address),
      escapeCsv(p.google_maps_url),
      escapeCsv(p.has_website),
      escapeCsv(p.status),
      escapeCsv(p.discovery_source),
      escapeCsv(p.created_at)
    ].join(','));

    // UTF-8 BOM for clean Excel display of phone numbers & regional names
    const csvContent = '\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="leads_export_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.status(200).send(csvContent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export Leads as JSON
app.get('/api/leads/export/json', (req, res) => {
  try {
    const list = db.getProspects();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="leads_export_${new Date().toISOString().slice(0, 10)}.json"`);
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

// SKILL 4: HOST (Get/publish demo site)
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

// Get site by ID or prospect ID
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

// SKILL 5 (WhatsApp): DIRECT WHATSAPP OUTREACH
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

// SKILL 5 (Multi-Channel): BOTH EMAIL & WHATSAPP SIMULTANEOUS OUTREACH
app.post('/api/skills/outreach/both/:id', async (req, res) => {
  try {
    const baseUrl = getAppBaseUrl(req);
    // Send email outreach
    const emailRes = await sendDemoOutreach(req.params.id, {
      baseUrl,
      subject: req.body.subject,
      body: req.body.body,
      email: req.body.email
    });
    // Send WhatsApp outreach
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

// GET NICHE-TAILORED OUTREACH TEMPLATES FOR A PROSPECT
app.get('/api/skills/outreach/template/:id', (req, res) => {
  try {
    const prospect = db.getProspectById(req.params.id);
    if (!prospect) return res.status(404).json({ error: 'Prospect not found' });
    const config = db.getConfig();
    const tmpl = getNicheOutreachTemplates(prospect, config);
    res.json({ success: true, ...tmpl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/logs', (req, res) => {
  res.json(getOutreachLogs());
});

// SKILL 7: REPLY HANDLING & SIMULATION
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

// AUTONOMOUS SUPERAGENT PIPELINE
app.post('/api/pipeline/run', (req, res) => {
  const baseUrl = getAppBaseUrl(req);
  // Run asynchronously so frontend receives instant kickoff
  runAutonomousPipeline({ ...req.body, baseUrl });
  res.json({ message: 'Pipeline cycle launched', status: getPipelineStatus() });
});

app.get('/api/pipeline/status', (req, res) => {
  res.json(getPipelineStatus());
});

// ==========================================
// WHATSAPP BROADCASTING ROUTES
// ==========================================

// Get API Connection & Configuration Status
app.get('/api/whatsapp/broadcast/status', (req, res) => {
  const creds = getWhatsAppCredentials();
  const baseUrl = getAppBaseUrl(req);
  res.json({
    configured: creds.isConfigured,
    phone_number_id: creds.phoneNumberId || null,
    business_account_id: creds.businessAccountId || null,
    api_version: creds.apiVersion,
    webhook_url: `${baseUrl}/api/whatsapp/webhook`,
    webhook_verify_token: creds.webhookVerifyToken
  });
});

// Get Templates
app.get('/api/whatsapp/broadcast/templates', async (req, res) => {
  try {
    const templates = await fetchWhatsAppTemplates();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Contacts CRUD
app.get('/api/whatsapp/broadcast/contacts', (req, res) => {
  const { search, consent, category } = req.query;
  let list = db.getWhatsAppContacts();

  if (consent && consent !== 'all') {
    list = list.filter(c => c.consent_status === consent);
  }
  if (category && category !== 'all') {
    list = list.filter(c => (c.category || '').toLowerCase().includes(category.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      (c.city || '').toLowerCase().includes(q)
    );
  }

  res.json(list);
});

app.post('/api/whatsapp/broadcast/contacts', (req, res) => {
  const result = validateAndFormatContact(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: result.error });
  }
  const saved = db.addWhatsAppContact(result.contact);
  res.status(201).json(saved);
});

app.post('/api/whatsapp/broadcast/contacts/import', (req, res) => {
  const { contacts, default_country_code } = req.body;
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return res.status(400).json({ error: 'Valid contacts array required' });
  }

  const validContacts = [];
  const errors = [];

  for (let i = 0; i < contacts.length; i++) {
    const item = contacts[i];
    const validation = validateAndFormatContact(item, default_country_code || '1');
    if (validation.valid) {
      validContacts.push(validation.contact);
    } else {
      errors.push({ index: i, item, error: validation.error });
    }
  }

  const importResult = db.importWhatsAppContacts(validContacts);
  res.json({
    success: true,
    total_received: contacts.length,
    valid_count: validContacts.length,
    invalid_count: errors.length,
    imported_count: importResult.total_imported,
    duplicates_count: importResult.duplicates_skipped,
    errors: errors.slice(0, 10)
  });
});

app.post('/api/whatsapp/broadcast/contacts/sync-prospects', (req, res) => {
  try {
    const prospects = db.getProspects();
    const formatted = prospects
      .filter(p => p.phone)
      .map(p => ({
        name: p.contact_person || p.business_name,
        company: p.business_name,
        phone: p.phone,
        email: p.email,
        city: p.city,
        category: p.category,
        consent_status: 'CONSENTED',
        consent_source: 'SiteSeller Verified Directory',
        tags: ['Verified Lead', p.category || 'General']
      }));

    const validContacts = [];
    for (const item of formatted) {
      const v = validateAndFormatContact(item);
      if (v.valid) validContacts.push(v.contact);
    }

    const result = db.importWhatsAppContacts(validContacts);
    res.json({
      success: true,
      message: `Synced ${result.total_imported} prospects into WhatsApp broadcast contacts (${result.duplicates_skipped} duplicates skipped).`,
      imported_count: result.total_imported,
      duplicates_skipped: result.duplicates_skipped
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/whatsapp/broadcast/contacts/:id/consent', (req, res) => {
  const { consent_status, opt_out_reason } = req.body;
  if (!['CONSENTED', 'OPTED_OUT', 'UNCONFIRMED'].includes(consent_status)) {
    return res.status(400).json({ error: 'Invalid consent status' });
  }
  const updates = {
    consent_status,
    updated_at: new Date().toISOString()
  };
  if (consent_status === 'OPTED_OUT') {
    updates.opt_out_date = new Date().toISOString();
    updates.opt_out_reason = opt_out_reason || 'Manual user opt-out in CRM';
  } else {
    updates.opt_out_date = null;
    updates.opt_out_reason = null;
  }

  const updated = db.updateWhatsAppContact(req.params.id, updates);
  if (!updated) return res.status(404).json({ error: 'Contact not found' });
  res.json(updated);
});

app.delete('/api/whatsapp/broadcast/contacts/:id', (req, res) => {
  const success = db.deleteWhatsAppContact(req.params.id);
  res.json({ success });
});

// Campaigns CRUD & Execution
app.get('/api/whatsapp/broadcast/campaigns', (req, res) => {
  const campaigns = db.getWhatsAppCampaigns();
  res.json(campaigns);
});

app.get('/api/whatsapp/broadcast/campaigns/:id', (req, res) => {
  const campaign = db.getWhatsAppCampaignById(req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json(campaign);
});

app.post('/api/whatsapp/broadcast/campaigns', (req, res) => {
  try {
    const {
      name,
      type = 'template',
      template_name,
      template_language = 'en_US',
      template_parameters = [],
      message_text,
      media_type,
      media_url,
      recipient_ids = [],
      recipient_contacts = []
    } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Campaign name is required' });
    }

    let targetContacts = [];
    if (Array.isArray(recipient_ids) && recipient_ids.length > 0) {
      const allContacts = db.getWhatsAppContacts();
      const idSet = new Set(recipient_ids);
      targetContacts = allContacts.filter(c => idSet.has(c.id));
    } else if (Array.isArray(recipient_contacts) && recipient_contacts.length > 0) {
      targetContacts = recipient_contacts;
    } else {
      return res.status(400).json({ error: 'Please select at least one recipient for this broadcast' });
    }

    // STRICT CONSENT RULE: Exclude any opted-out contacts
    const eligibleRecipients = targetContacts.filter(c => c.consent_status !== 'OPTED_OUT');
    if (eligibleRecipients.length === 0) {
      return res.status(400).json({ error: 'All selected recipients have opted out. Broadcast cannot proceed.' });
    }

    const campaignRecord = db.saveWhatsAppCampaign({
      name: name.trim(),
      status: 'DRAFT',
      type: type === 'text' ? 'text' : 'template',
      template_name: template_name || '',
      template_language: template_language || 'en_US',
      template_parameters: Array.isArray(template_parameters) ? template_parameters : [],
      message_text: message_text || '',
      media_type: media_type || null,
      media_url: media_url || null,
      recipients: eligibleRecipients.map(c => ({
        contact_id: c.id,
        name: c.name,
        company: c.company,
        phone: c.phone,
        city: c.city,
        category: c.category,
        status: 'QUEUED'
      }))
    });

    res.status(201).json(campaignRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/whatsapp/broadcast/campaigns/:id/send', async (req, res) => {
  try {
    const result = await executeBroadcastCampaign(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/whatsapp/broadcast/campaigns/:id/pause', (req, res) => {
  try {
    const updated = pauseBroadcastCampaign(req.params.id);
    res.json({ success: true, campaign: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/whatsapp/broadcast/campaigns/:id', (req, res) => {
  const success = db.deleteWhatsAppCampaign(req.params.id);
  res.json({ success });
});

// Aggregated Broadcast Analytics
app.get('/api/whatsapp/broadcast/stats', (req, res) => {
  const campaigns = db.getWhatsAppCampaigns();
  const contacts = db.getWhatsAppContacts();

  let totalDispatched = 0;
  let totalAccepted = 0;
  let totalSent = 0;
  let totalDelivered = 0;
  let totalRead = 0;
  let totalFailed = 0;

  for (const c of campaigns) {
    const s = c.stats || {};
    totalDispatched += (s.total || 0);
    totalAccepted += (s.accepted || 0);
    totalSent += (s.sent || 0);
    totalDelivered += (s.delivered || 0);
    totalRead += (s.read || 0);
    totalFailed += (s.failed || 0);
  }

  res.json({
    total_campaigns: campaigns.length,
    total_contacts: contacts.length,
    consented_contacts: contacts.filter(c => c.consent_status === 'CONSENTED').length,
    opted_out_contacts: contacts.filter(c => c.consent_status === 'OPTED_OUT').length,
    stats: {
      total_dispatched: totalDispatched,
      total_accepted: totalAccepted,
      total_sent: totalSent,
      total_delivered: totalDelivered,
      total_read: totalRead,
      total_failed: totalFailed,
      delivery_rate: totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0,
      read_rate: totalDelivered > 0 ? Math.round((totalRead / totalDelivered) * 100) : 0
    }
  });
});

// Webhook Logs
app.get('/api/whatsapp/broadcast/webhooks/logs', (req, res) => {
  res.json(db.getWebhookLogs());
});

// ==========================================
// OFFICIAL WHATSAPP CLOUD API WEBHOOK
// ==========================================

// Webhook Verification Handshake
app.get('/api/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const creds = getWhatsAppCredentials();

  if (mode === 'subscribe' && token === creds.webhookVerifyToken) {
    console.log('[WhatsApp Webhook] Handshake verified successfully with Meta!');
    return res.status(200).send(challenge);
  }

  console.warn('[WhatsApp Webhook] Verification handshake failed. Token mismatch.');
  return res.status(403).send('Forbidden');
});

// Incoming Webhook Events (Statuses & Inbound Messages)
app.post('/api/whatsapp/webhook', async (req, res) => {
  try {
    const creds = getWhatsAppCredentials();
    const signature = req.headers['x-hub-signature-256'];

    if (creds.appSecret && signature) {
      const isValid = verifyWebhookSignature(JSON.stringify(req.body), signature, creds.appSecret);
      if (!isValid) {
        console.warn('[WhatsApp Webhook] Signature verification failed!');
        return res.status(401).send('Invalid signature');
      }
    }

    const result = await processWebhookEvent(req.body);
    res.status(200).json({ status: 'ok', ...result });
  } catch (err) {
    console.error('[WhatsApp Webhook] Error processing event:', err);
    res.status(200).json({ status: 'error_logged', error: err.message });
  }
});

// DATABASE RESET / CLEAR
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
const fs = require('fs');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/demos')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🤖 SiteSeller Agent Superagent running on port ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`===============================================`);
});
