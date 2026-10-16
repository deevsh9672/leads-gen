const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File definitions for all collections
const PROSPECTS_FILE = path.join(DATA_DIR, 'prospects.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const SITES_FILE = path.join(DATA_DIR, 'sites.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');
const TAGS_FILE = path.join(DATA_DIR, 'tags.json');
const SEGMENTS_FILE = path.join(DATA_DIR, 'segments.json');
const CAMPAIGNS_FILE = path.join(DATA_DIR, 'campaigns.json');
const CAMPAIGN_RECIPIENTS_FILE = path.join(DATA_DIR, 'campaign_recipients.json');
const CONVERSATIONS_FILE = path.join(DATA_DIR, 'conversations.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const WORKFLOWS_FILE = path.join(DATA_DIR, 'workflows.json');
const WORKFLOW_EXECUTIONS_FILE = path.join(DATA_DIR, 'workflow_executions.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');
const CONSENT_FILE = path.join(DATA_DIR, 'consent_records.json');
const SUPPRESSION_FILE = path.join(DATA_DIR, 'suppression_list.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const AUDIT_LOGS_FILE = path.join(DATA_DIR, 'audit_logs.json');
const PROVIDER_CONFIG_FILE = path.join(DATA_DIR, 'provider_config.json');

const DEFAULT_CONFIG = {
  target_city: 'Toronto',
  target_country: 'Canada',
  business_niche: 'clinic',
  max_leads_per_day: 75,
  discovery_source: 'auto',
  apify_api_token: '',
  apollo_api_key: '',
  sender_name: 'Devesh Kumar',
  sender_email: 'deveshtesting9672@gmail.com',
  sender_whatsapp: '918920608191',
  physical_mailing_address: '100 Congress Ave, Suite 2000, Austin, TX 78701, USA',
  smtp_host: 'smtp.gmail.com',
  smtp_port: 587,
  smtp_user: '',
  smtp_pass: '',
  auto_pilot: false,
  email_subject_template: 'Free modern website demo for {{business_name}}',
  whatsapp_message_template: `Hi team at {{business_name}}! 👋 I noticed you don't have a website listed on Google for {{category}} services in {{city}}, even though you have great local reviews!

To help out, my team and I built you a complete, high-converting demo website — 100% free with no strings attached:
👉 View your live website demo here: {{demo_url}}

If you'd like to claim this design, customize the text/photos, or connect your domain, just reply here!`,
  email_body_template: `Hi team at {{business_name}},

I noticed you don't have a website listed for {{business_name}} in {{city}}, even though you have great local reviews!

To help out, my team and I built you a complete, high-converting demo website — 100% free with no strings attached:
👉 View your live website demo here: {{demo_url}}

If you'd like to claim this design, customize the text/photos, or connect it to your own custom domain:
💬 Quick WhatsApp: {{whatsapp_link}}
Or simply reply directly to this email!

Best regards,
{{sender_name}}
Growth & Web Development
WhatsApp: +91 8920608191

---
CAN-SPAM Notice: You are receiving this because your business is publicly listed in {{city}}.
Physical Address: {{physical_mailing_address}}
To opt out, reply with 'UNSUBSCRIBE' or click here to unsubscribe.`
};

const DEFAULT_PROVIDER_CONFIG = {
  active_provider: 'sandbox', // 'sandbox' | 'wati' | 'meta'
  test_phone_number: '+91 8920608191',
  wati: {
    endpoint_url: 'https://live-server-XXXXX.wati.io',
    access_token: '',
    phone_number: '',
    webhook_secret: 'wati_secret_token_123'
  },
  meta: {
    waba_id: '',
    phone_number_id: '',
    access_token: '',
    app_secret: '',
    verify_token: 'meta_verify_token_siteseller_2026'
  },
  sandbox: {
    simulate_delivery_speed_ms: 800,
    simulate_read_receipts: true,
    simulate_customer_replies: false
  }
};

const DEFAULT_USERS = [
  {
    id: 'user-devesh',
    name: 'Devesh Kumar',
    email: 'deveshtesting9672@gmail.com',
    phone: '+91 8920608191',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'user-alex',
    name: 'Alex Morgan',
    email: 'alex@siteselleragent.com',
    phone: '+1 512-555-0144',
    role: 'sales_agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya@siteselleragent.com',
    phone: '+91 98290 12890',
    role: 'sales_manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    active: true,
    created_at: new Date().toISOString()
  }
];

const DEFAULT_TAGS = [
  { id: 'tag-hot-lead', name: 'Hot Lead', color: '#f43f5e', bg: '#ffe4e6', description: 'Urgent need, high interest' },
  { id: 'tag-warm-lead', name: 'Warm Lead', color: '#f59e0b', bg: '#fef3c7', description: 'Interested, evaluating options' },
  { id: 'tag-cold-lead', name: 'Cold Lead', color: '#64748b', bg: '#f1f5f9', description: 'Unresponsive or low priority' },
  { id: 'tag-interested', name: 'Interested', color: '#10b981', bg: '#d1fae5', description: 'Direct positive response' },
  { id: 'tag-followup', name: 'Follow-Up Due', color: '#8b5cf6', bg: '#ede9fe', description: 'Follow-up scheduled or needed' },
  { id: 'tag-demo-req', name: 'Demo Requested', color: '#06b6d4', bg: '#cffafe', description: 'Wants full custom demo or walkthrough' },
  { id: 'tag-pricing-req', name: 'Pricing Requested', color: '#d946ef', bg: '#fae8ff', description: 'Inquired about cost & packages' },
  { id: 'tag-high-priority', name: 'High Priority', color: '#ef4444', bg: '#fee2e2', description: 'High value or decision maker' },
  { id: 'tag-toronto', name: 'Toronto Clinic', color: '#0284c7', bg: '#e0f2fe', description: 'Discovered healthcare clinic in Toronto' },
  { id: 'tag-opt-out', name: 'Do Not Contact', color: '#475569', bg: '#e2e8f0', description: 'Customer requested opt-out' }
];

const DEFAULT_TEMPLATES = [
  {
    id: 'tmpl-website-demo',
    name: 'website_demo_offer',
    category: 'MARKETING',
    language: 'en',
    status: 'APPROVED',
    provider: 'meta',
    header: { type: 'IMAGE', preview_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80' },
    body: 'Hi {{name}}! 👋 I noticed {{company}} has great customer reviews for {{service}} in {{city}}, but does not have a modern mobile website.\n\nWe built a free, high-converting live demo website for you:\n👉 {{demo_url}}\n\nWould you like to claim this design and customize your photos/services?',
    variables: ['name', 'company', 'service', 'city', 'demo_url'],
    buttons: [
      { type: 'URL', text: 'View Live Demo', url: '{{demo_url}}' },
      { type: 'QUICK_REPLY', text: 'Claim Demo' },
      { type: 'QUICK_REPLY', text: 'Not Interested' }
    ],
    updated_at: new Date().toISOString()
  },
  {
    id: 'tmpl-clinic-outreach',
    name: 'clinic_website_showcase',
    category: 'MARKETING',
    language: 'en',
    status: 'APPROVED',
    provider: 'wati',
    header: { type: 'TEXT', text: '🏥 Modern Website for {{company}}' },
    body: 'Hello {{name}} team! We noticed that patients in {{city}} search daily for {{service}}, but cannot easily book online without a modern clinic site.\n\nWe prepared a 100% free live preview clinic website for {{company}}:\n👉 {{demo_url}}\n\nReply YES if you would like us to connect your domain!',
    variables: ['name', 'company', 'city', 'service', 'demo_url'],
    buttons: [
      { type: 'QUICK_REPLY', text: 'Yes, Connect Domain' },
      { type: 'QUICK_REPLY', text: 'Request Call' }
    ],
    updated_at: new Date().toISOString()
  },
  {
    id: 'tmpl-follow-up',
    name: 'gentle_followup_reminder',
    category: 'UTILITY',
    language: 'en',
    status: 'APPROVED',
    provider: 'meta',
    header: null,
    body: 'Hi {{name}}, just following up regarding the demo website we shared for {{company}}.\n\nDid you get a chance to review it? Let us know if you have any questions or need revisions.',
    variables: ['name', 'company'],
    buttons: [
      { type: 'QUICK_REPLY', text: 'Looks Great!' },
      { type: 'QUICK_REPLY', text: 'Call Me' }
    ],
    updated_at: new Date().toISOString()
  }
];

const DEFAULT_WORKFLOWS = [
  {
    id: 'wf-auto-qualify',
    name: 'Auto-Qualify High Rating Leads',
    enabled: true,
    trigger: 'lead.created',
    conditions: [
      { field: 'lead_score', operator: 'gte', value: 75 }
    ],
    actions: [
      { type: 'add_tag', tag: 'Hot Lead' },
      { type: 'update_status', status: 'QUALIFIED' },
      { type: 'assign_agent', user_id: 'user-devesh' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'wf-reply-received',
    name: 'On Customer Reply -> Notify & Move to REPLIED',
    enabled: true,
    trigger: 'whatsapp.message_received',
    conditions: [],
    actions: [
      { type: 'update_status', status: 'REPLIED' },
      { type: 'create_task', title: 'Reply to WhatsApp message', priority: 'high', due_hours: 2 },
      { type: 'add_tag', tag: 'Interested' }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 'wf-optout-protection',
    name: 'Instant Opt-Out Suppression on STOP',
    enabled: true,
    trigger: 'whatsapp.opt_out_detected',
    conditions: [],
    actions: [
      { type: 'update_status', status: 'OPTED_OUT' },
      { type: 'add_to_suppression_list' },
      { type: 'add_tag', tag: 'Do Not Contact' }
    ],
    created_at: new Date().toISOString()
  }
];

function readJSON(file, defaultVal) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2), 'utf8');
      return defaultVal;
    }
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return defaultVal;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${file}:`, err);
  }
}

// Migrate raw prospect into rich standardized CRM Lead
function normalizeLeadRecord(p) {
  if (!p) return null;
  const statusMap = {
    'new': 'NEW',
    'contacted': 'CONTACTED',
    'replied': 'REPLIED',
    'client': 'WON',
    'client-ready': 'INTERESTED',
    'opt-out': 'OPTED_OUT',
    'opted-out': 'OPTED_OUT'
  };

  const currentStatus = p.status ? (statusMap[p.status.toLowerCase()] || p.status.toUpperCase()) : 'NEW';

  // Normalize phone to E.164-compatible clean format
  const rawPhone = p.phone || '';
  const cleanDigits = rawPhone.replace(/[^0-9]/g, '');

  return {
    id: p.id || uuidv4(),
    business_name: p.business_name || 'Local Business',
    contact_person: p.contact_person || p.business_name || 'Business Owner',
    category: p.category || 'General Service',
    industry: p.industry || p.category || 'Healthcare / Local Service',
    city: p.city || 'Toronto',
    state: p.state || (p.city && p.city.toLowerCase().includes('toronto') ? 'Ontario' : ''),
    country: p.country || (p.city && p.city.toLowerCase().includes('toronto') ? 'Canada' : 'India'),
    phone: rawPhone,
    clean_phone: cleanDigits,
    email: p.email || '',
    website_url: p.website_url || null,
    has_website: p.has_website || 'no',
    lead_score: p.lead_score || 50,
    score_breakdown: p.score_breakdown || {
      review_count: p.review_count || 25,
      category_demand: 70,
      website_need_score: 85,
      rating: p.rating || 4.7
    },
    rating: p.rating || 4.8,
    review_count: p.review_count || 35,
    address: p.address || `${p.city || 'Toronto'}, Center`,
    google_maps_url: p.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((p.business_name || '') + ' ' + (p.city || ''))}`,
    is_verified_real: p.is_verified_real !== undefined ? p.is_verified_real : true,
    discovery_source: p.discovery_source || 'Live OpenStreetMap (Verified Real)',
    status: currentStatus,
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? p.tags : (p.city && p.city.toLowerCase().includes('toronto') ? ['Toronto Clinic', 'Hot Lead'] : ['Hot Lead']),
    assigned_to: p.assigned_to || DEFAULT_USERS[0],
    consent_status: p.consent_status || 'CONSENTED',
    consent_source: p.consent_source || 'Public Verified Directory',
    consent_date: p.consent_date || p.created_at || new Date().toISOString(),
    custom_fields: p.custom_fields || {},
    internal_notes: Array.isArray(p.internal_notes) ? p.internal_notes : [],
    timeline: Array.isArray(p.timeline) ? p.timeline : [
      {
        id: uuidv4(),
        type: 'LEAD_CREATED',
        title: 'Lead Discovered',
        description: `Discovered from ${p.discovery_source || 'Google Maps / OSM'}`,
        timestamp: p.created_at || new Date().toISOString()
      }
    ],
    last_incoming_at: p.last_incoming_at || null,
    last_outgoing_at: p.last_outgoing_at || p.last_contacted_at || null,
    next_follow_up_at: p.next_follow_up_at || null,
    created_at: p.created_at || new Date().toISOString(),
    updated_at: p.updated_at || new Date().toISOString()
  };
}

// In-memory / JSON persistence helpers
const db = {
  // Config
  getConfig() {
    return readJSON(CONFIG_FILE, DEFAULT_CONFIG);
  },
  updateConfig(updates) {
    const current = this.getConfig();
    const updated = { ...current, ...updates };
    writeJSON(CONFIG_FILE, updated);
    return updated;
  },

  // Provider Config (WATI / Meta / Sandbox)
  getProviderConfig() {
    return readJSON(PROVIDER_CONFIG_FILE, DEFAULT_PROVIDER_CONFIG);
  },
  updateProviderConfig(updates) {
    const current = this.getProviderConfig();
    const updated = { ...current, ...updates };
    writeJSON(PROVIDER_CONFIG_FILE, updated);
    this.addAuditLog('PROVIDER_CONFIG_UPDATED', 'Updated WhatsApp provider configuration', { provider: updated.active_provider });
    return updated;
  },

  // Users & Team
  getUsers() {
    return readJSON(USERS_FILE, DEFAULT_USERS);
  },
  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },
  addUser(userData) {
    const list = this.getUsers();
    const newUser = {
      id: userData.id || `user-${uuidv4().slice(0, 8)}`,
      name: userData.name || 'Team Member',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'sales_agent',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      active: true,
      created_at: new Date().toISOString()
    };
    list.push(newUser);
    writeJSON(USERS_FILE, list);
    return newUser;
  },

  // Prospects & Leads (100% synchronized)
  getProspects() {
    const raw = readJSON(PROSPECTS_FILE, []);
    return raw.map(normalizeLeadRecord);
  },
  getLeads(filters = {}) {
    let list = this.getProspects();
    if (filters.status && filters.status !== 'all') {
      list = list.filter(l => l.status.toUpperCase() === filters.status.toUpperCase());
    }
    if (filters.tag && filters.tag !== 'all') {
      list = list.filter(l => l.tags.some(t => t.toLowerCase() === filters.tag.toLowerCase()));
    }
    if (filters.city && filters.city !== 'all') {
      list = list.filter(l => l.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.assigned_to && filters.assigned_to !== 'all') {
      list = list.filter(l => l.assigned_to?.id === filters.assigned_to);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(l => 
        l.business_name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q))
      );
    }
    return list;
  },
  getProspectById(id) {
    const list = this.getProspects();
    return list.find(p => p.id === id);
  },
  getLeadById(id) {
    return this.getProspectById(id);
  },
  saveProspects(prospects) {
    const normalized = prospects.map(normalizeLeadRecord);
    writeJSON(PROSPECTS_FILE, normalized);
    return normalized;
  },
  addProspect(prospectData) {
    const list = this.getProspects();
    const normalized = normalizeLeadRecord(prospectData);
    list.unshift(normalized);
    writeJSON(PROSPECTS_FILE, list);
    this.addAuditLog('LEAD_CREATED', `Created lead: ${normalized.business_name}`, { id: normalized.id });
    return normalized;
  },
  addLead(leadData) {
    return this.addProspect(leadData);
  },
  updateProspect(id, updates) {
    const list = this.getProspects();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      const prevStatus = list[idx].status;
      const updated = {
        ...list[idx],
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Record timeline if status changed
      if (updates.status && updates.status !== prevStatus) {
        updated.timeline = updated.timeline || [];
        updated.timeline.unshift({
          id: uuidv4(),
          type: 'STATUS_CHANGED',
          title: `Status changed to ${updates.status}`,
          description: updates.status_reason || `Previous status: ${prevStatus}`,
          timestamp: new Date().toISOString()
        });
      }

      list[idx] = updated;
      writeJSON(PROSPECTS_FILE, list);
      return list[idx];
    }
    return null;
  },
  updateLead(id, updates) {
    return this.updateProspect(id, updates);
  },
  deleteProspect(id) {
    let list = this.getProspects();
    const target = list.find(p => p.id === id);
    list = list.filter(p => p.id !== id);
    writeJSON(PROSPECTS_FILE, list);
    if (target) {
      this.addAuditLog('LEAD_DELETED', `Deleted lead: ${target.business_name}`, { id });
    }
    return true;
  },
  deleteLead(id) {
    return this.deleteProspect(id);
  },

  // Tags
  getTags() {
    return readJSON(TAGS_FILE, DEFAULT_TAGS);
  },
  addTag(tagData) {
    const list = this.getTags();
    const newTag = {
      id: tagData.id || `tag-${uuidv4().slice(0, 8)}`,
      name: tagData.name || 'Custom Tag',
      color: tagData.color || '#3b82f6',
      bg: tagData.bg || '#dbeafe',
      description: tagData.description || ''
    };
    list.push(newTag);
    writeJSON(TAGS_FILE, list);
    return newTag;
  },
  deleteTag(tagId) {
    let list = this.getTags();
    list = list.filter(t => t.id !== tagId);
    writeJSON(TAGS_FILE, list);
    return true;
  },

  // Saved Segments
  getSegments() {
    return readJSON(SEGMENTS_FILE, [
      {
        id: 'seg-toronto-hot',
        name: 'Toronto Hot Clinics',
        description: 'Clinics in Toronto with Lead Score > 80',
        filters: { city: 'Toronto', tag: 'Hot Lead' },
        created_at: new Date().toISOString()
      },
      {
        id: 'seg-followup-needed',
        name: 'Follow-ups Required',
        description: 'Leads in FOLLOW_UP or REPLIED stage',
        filters: { status: 'FOLLOW_UP' },
        created_at: new Date().toISOString()
      }
    ]);
  },
  addSegment(segmentData) {
    const list = this.getSegments();
    const newSeg = {
      id: segmentData.id || `seg-${uuidv4().slice(0, 8)}`,
      name: segmentData.name || 'New Segment',
      description: segmentData.description || '',
      filters: segmentData.filters || {},
      created_at: new Date().toISOString()
    };
    list.unshift(newSeg);
    writeJSON(SEGMENTS_FILE, list);
    return newSeg;
  },

  // WhatsApp Broadcast Campaigns
  getCampaigns() {
    return readJSON(CAMPAIGNS_FILE, []);
  },
  getCampaignById(id) {
    return this.getCampaigns().find(c => c.id === id);
  },
  saveCampaign(campaignData) {
    const list = this.getCampaigns();
    const existingIdx = list.findIndex(c => c.id === campaignData.id);
    const newCampaign = {
      id: campaignData.id || `camp-${uuidv4().slice(0, 8)}`,
      name: campaignData.name || 'WhatsApp Broadcast Campaign',
      description: campaignData.description || '',
      template_id: campaignData.template_id || 'tmpl-website-demo',
      template_name: campaignData.template_name || 'website_demo_offer',
      audience_filter: campaignData.audience_filter || {},
      status: campaignData.status || 'DRAFT', // DRAFT, SCHEDULED, IN_PROGRESS, PAUSED, COMPLETED, CANCELLED
      total_recipients: campaignData.total_recipients || 0,
      stats: campaignData.stats || {
        queued: 0,
        submitted: 0,
        sent: 0,
        delivered: 0,
        read: 0,
        replied: 0,
        failed: 0,
        opt_out: 0
      },
      scheduled_for: campaignData.scheduled_for || null,
      created_at: campaignData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      list[existingIdx] = { ...list[existingIdx], ...newCampaign };
    } else {
      list.unshift(newCampaign);
    }
    writeJSON(CAMPAIGNS_FILE, list);
    return newCampaign;
  },
  updateCampaign(id, updates) {
    const list = this.getCampaigns();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      writeJSON(CAMPAIGNS_FILE, list);
      return list[idx];
    }
    return null;
  },

  // Campaign Recipients Logs
  getCampaignRecipients(campaignId) {
    const all = readJSON(CAMPAIGN_RECIPIENTS_FILE, []);
    return campaignId ? all.filter(r => r.campaign_id === campaignId) : all;
  },
  addCampaignRecipients(recipients) {
    const list = readJSON(CAMPAIGN_RECIPIENTS_FILE, []);
    list.unshift(...recipients);
    writeJSON(CAMPAIGN_RECIPIENTS_FILE, list);
    return recipients;
  },
  updateCampaignRecipient(id, updates) {
    const list = readJSON(CAMPAIGN_RECIPIENTS_FILE, []);
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      writeJSON(CAMPAIGN_RECIPIENTS_FILE, list);
      return list[idx];
    }
    return null;
  },

  // Conversations & Messages (WATI-Style Team Inbox)
  getConversations(filters = {}) {
    let list = readJSON(CONVERSATIONS_FILE, []);
    if (filters.status && filters.status !== 'all') {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters.assigned_to && filters.assigned_to !== 'all') {
      list = list.filter(c => c.assigned_to?.id === filters.assigned_to);
    }
    if (filters.unread_only) {
      list = list.filter(c => c.unread_count > 0);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c => 
        (c.lead_name && c.lead_name.toLowerCase().includes(q)) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.last_message && c.last_message.toLowerCase().includes(q))
      );
    }
    return list;
  },
  getConversationById(id) {
    const list = this.getConversations();
    return list.find(c => c.id === id);
  },
  getConversationByPhone(phone) {
    const cleanDigits = String(phone || '').replace(/[^0-9]/g, '');
    const list = this.getConversations();
    return list.find(c => {
      const cDigits = String(c.phone || '').replace(/[^0-9]/g, '');
      return cDigits.endsWith(cleanDigits) || cleanDigits.endsWith(cDigits);
    });
  },
  saveConversation(convData) {
    const list = readJSON(CONVERSATIONS_FILE, []);
    const existingIdx = list.findIndex(c => c.id === convData.id);
    const newConv = {
      id: convData.id || `conv-${uuidv4().slice(0, 8)}`,
      lead_id: convData.lead_id || null,
      lead_name: convData.lead_name || 'Customer',
      phone: convData.phone || '',
      status: convData.status || 'OPEN', // OPEN, PENDING, RESOLVED
      assigned_to: convData.assigned_to || DEFAULT_USERS[0],
      unread_count: convData.unread_count || 0,
      last_message: convData.last_message || '',
      last_message_at: convData.last_message_at || new Date().toISOString(),
      service_window_expires_at: convData.service_window_expires_at || null,
      internal_notes: convData.internal_notes || [],
      created_at: convData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      list[existingIdx] = { ...list[existingIdx], ...newConv };
    } else {
      list.unshift(newConv);
    }
    writeJSON(CONVERSATIONS_FILE, list);
    return newConv;
  },
  updateConversation(id, updates) {
    const list = readJSON(CONVERSATIONS_FILE, []);
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      writeJSON(CONVERSATIONS_FILE, list);
      return list[idx];
    }
    return null;
  },

  // Messages
  getMessages(conversationId) {
    const all = readJSON(MESSAGES_FILE, []);
    return conversationId ? all.filter(m => m.conversation_id === conversationId) : all;
  },
  addMessage(msgData) {
    const list = readJSON(MESSAGES_FILE, []);
    const newMsg = {
      id: msgData.id || `msg-${uuidv4().slice(0, 8)}`,
      conversation_id: msgData.conversation_id,
      sender_type: msgData.sender_type || 'agent', // 'agent' | 'customer' | 'system'
      sender_name: msgData.sender_name || 'System',
      message_type: msgData.message_type || 'text', // 'text' | 'template' | 'media'
      content: msgData.content || '',
      template_name: msgData.template_name || null,
      media_url: msgData.media_url || null,
      status: msgData.status || 'sent', // 'queued' | 'sent' | 'delivered' | 'read' | 'failed'
      external_id: msgData.external_id || null,
      created_at: new Date().toISOString()
    };
    list.push(newMsg);
    writeJSON(MESSAGES_FILE, list);

    // Update conversation last_message preview & timestamp
    this.updateConversation(msgData.conversation_id, {
      last_message: newMsg.content,
      last_message_at: newMsg.created_at
    });

    return newMsg;
  },
  updateMessageStatus(messageId, status, externalId = null) {
    const list = readJSON(MESSAGES_FILE, []);
    const idx = list.findIndex(m => m.id === messageId || (externalId && m.external_id === externalId));
    if (idx !== -1) {
      list[idx].status = status;
      list[idx].updated_at = new Date().toISOString();
      writeJSON(MESSAGES_FILE, list);
      return list[idx];
    }
    return null;
  },

  // Follow-Up Tasks
  getTasks(filters = {}) {
    let list = readJSON(TASKS_FILE, []);
    if (filters.completed !== undefined) {
      list = list.filter(t => t.completed === filters.completed);
    }
    if (filters.assigned_to && filters.assigned_to !== 'all') {
      list = list.filter(t => t.assigned_to?.id === filters.assigned_to);
    }
    return list;
  },
  addTask(taskData) {
    const list = this.getTasks();
    const newTask = {
      id: taskData.id || `task-${uuidv4().slice(0, 8)}`,
      lead_id: taskData.lead_id || null,
      lead_name: taskData.lead_name || 'Lead Follow-up',
      title: taskData.title || 'Follow up with lead',
      priority: taskData.priority || 'medium', // low, medium, high
      due_date: taskData.due_date || new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      assigned_to: taskData.assigned_to || DEFAULT_USERS[0],
      completed: false,
      completed_at: null,
      created_at: new Date().toISOString()
    };
    list.unshift(newTask);
    writeJSON(TASKS_FILE, list);
    return newTask;
  },
  updateTask(id, updates) {
    const list = this.getTasks();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      writeJSON(TASKS_FILE, list);
      return list[idx];
    }
    return null;
  },

  // Workflows & Automations
  getWorkflows() {
    return readJSON(WORKFLOWS_FILE, DEFAULT_WORKFLOWS);
  },
  saveWorkflow(workflowData) {
    const list = this.getWorkflows();
    const existingIdx = list.findIndex(w => w.id === workflowData.id);
    const newWf = {
      id: workflowData.id || `wf-${uuidv4().slice(0, 8)}`,
      name: workflowData.name || 'Automated Workflow',
      enabled: workflowData.enabled !== undefined ? workflowData.enabled : true,
      trigger: workflowData.trigger || 'lead.created',
      conditions: workflowData.conditions || [],
      actions: workflowData.actions || [],
      created_at: workflowData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    if (existingIdx !== -1) {
      list[existingIdx] = { ...list[existingIdx], ...newWf };
    } else {
      list.push(newWf);
    }
    writeJSON(WORKFLOWS_FILE, list);
    return newWf;
  },
  getWorkflowExecutions() {
    return readJSON(WORKFLOW_EXECUTIONS_FILE, []);
  },
  logWorkflowExecution(executionData) {
    const list = readJSON(WORKFLOW_EXECUTIONS_FILE, []);
    const log = {
      id: `exec-${uuidv4().slice(0, 8)}`,
      workflow_id: executionData.workflow_id,
      workflow_name: executionData.workflow_name || 'Workflow',
      trigger_event: executionData.trigger_event,
      target_lead_id: executionData.target_lead_id || null,
      target_lead_name: executionData.target_lead_name || 'Lead',
      status: executionData.status || 'success', // success / failed
      details: executionData.details || '',
      executed_at: new Date().toISOString()
    };
    list.unshift(log);
    if (list.length > 200) list.pop();
    writeJSON(WORKFLOW_EXECUTIONS_FILE, list);
    return log;
  },

  // Templates
  getTemplates() {
    return readJSON(TEMPLATES_FILE, DEFAULT_TEMPLATES);
  },
  saveTemplates(templates) {
    writeJSON(TEMPLATES_FILE, templates);
    return templates;
  },

  // Compliance & Suppression Lists
  getSuppressionList() {
    return readJSON(SUPPRESSION_FILE, []);
  },
  addToSuppressionList(phone, reason = 'Customer requested opt-out (STOP)') {
    const list = this.getSuppressionList();
    const cleanDigits = String(phone).replace(/[^0-9]/g, '');
    if (!cleanDigits) return null;
    const existing = list.find(s => s.phone === cleanDigits);
    if (!existing) {
      const record = {
        id: `supp-${uuidv4().slice(0, 8)}`,
        phone: cleanDigits,
        raw_phone: phone,
        reason,
        opt_out_at: new Date().toISOString()
      };
      list.unshift(record);
      writeJSON(SUPPRESSION_FILE, list);
      this.addAuditLog('SUPPRESSION_ADDED', `Number added to suppression list: ${phone}`, { phone, reason });
      return record;
    }
    return existing;
  },
  removeFromSuppressionList(phone) {
    let list = this.getSuppressionList();
    const cleanDigits = String(phone).replace(/[^0-9]/g, '');
    list = list.filter(s => s.phone !== cleanDigits);
    writeJSON(SUPPRESSION_FILE, list);
    this.addAuditLog('SUPPRESSION_REMOVED', `Number removed from suppression list: ${phone}`, { phone });
    return true;
  },
  isPhoneSuppressed(phone) {
    const list = this.getSuppressionList();
    const cleanDigits = String(phone).replace(/[^0-9]/g, '');
    return list.some(s => s.phone === cleanDigits || cleanDigits.endsWith(s.phone));
  },

  // Audit Logs
  getAuditLogs() {
    return readJSON(AUDIT_LOGS_FILE, []);
  },
  addAuditLog(action, description, metadata = {}, user = 'Devesh Kumar') {
    const list = readJSON(AUDIT_LOGS_FILE, []);
    const entry = {
      id: `audit-${uuidv4().slice(0, 8)}`,
      action,
      description,
      user,
      metadata,
      timestamp: new Date().toISOString()
    };
    list.unshift(entry);
    if (list.length > 500) list.pop();
    writeJSON(AUDIT_LOGS_FILE, list);
    return entry;
  },

  // Existing SiteSeller Agent collections (Preserved for 100% backward compatibility)
  getSites() {
    return readJSON(SITES_FILE, []);
  },
  getSiteById(id) {
    return this.getSites().find(s => s.id === id);
  },
  getSiteByProspectId(prospectId) {
    return this.getSites().find(s => s.prospect_id === prospectId);
  },
  saveSite(siteData) {
    const list = this.getSites();
    const existingIdx = list.findIndex(s => s.prospect_id === siteData.prospect_id);
    const newSite = {
      id: siteData.id || uuidv4(),
      prospect_id: siteData.prospect_id,
      demo_url: siteData.demo_url,
      preview_screenshot: siteData.preview_screenshot || '',
      site_config: siteData.site_config || {},
      html_content: siteData.html_content || '',
      generated_date: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      list[existingIdx] = { ...list[existingIdx], ...newSite };
    } else {
      list.unshift(newSite);
    }
    writeJSON(SITES_FILE, list);
    return newSite;
  },

  getLogs() {
    return readJSON(LOGS_FILE, []);
  },
  addLog(logData) {
    const list = this.getLogs();
    const newLog = {
      id: uuidv4(),
      prospect_id: logData.prospect_id,
      prospect_name: logData.prospect_name || '',
      channel: logData.channel || 'email',
      recipient_email: logData.recipient_email || '',
      recipient_phone: logData.recipient_phone || '',
      email_subject: logData.email_subject || (logData.channel === 'whatsapp' ? 'WhatsApp Direct Outreach' : ''),
      email_body: logData.email_body || '',
      sent_date: new Date().toISOString(),
      reply_received: logData.reply_received || 'no',
      reply_text: logData.reply_text || null,
      reply_sentiment: logData.reply_sentiment || null,
      status: logData.status || 'sent',
      demo_url: logData.demo_url || ''
    };
    list.unshift(newLog);
    writeJSON(LOGS_FILE, list);
    return newLog;
  },
  updateLog(id, updates) {
    const list = this.getLogs();
    const idx = list.findIndex(l => l.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      writeJSON(LOGS_FILE, list);
      return list[idx];
    }
    return null;
  },

  clearDatabase() {
    writeJSON(PROSPECTS_FILE, []);
    writeJSON(SITES_FILE, []);
    writeJSON(LOGS_FILE, []);
    writeJSON(CAMPAIGNS_FILE, []);
    writeJSON(CAMPAIGN_RECIPIENTS_FILE, []);
    writeJSON(CONVERSATIONS_FILE, []);
    writeJSON(MESSAGES_FILE, []);
    writeJSON(TASKS_FILE, []);
    return { success: true, message: 'All prospects, demo sites, campaigns, and conversations have been reset.' };
  }
};

module.exports = db;
