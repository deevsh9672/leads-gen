const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PROSPECTS_FILE = path.join(DATA_DIR, 'prospects.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const SITES_FILE = path.join(DATA_DIR, 'sites.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');
const WHATSAPP_CAMPAIGNS_FILE = path.join(DATA_DIR, 'whatsapp_campaigns.json');
const WHATSAPP_CONTACTS_FILE = path.join(DATA_DIR, 'whatsapp_contacts.json');
const WHATSAPP_WEBHOOKS_FILE = path.join(DATA_DIR, 'whatsapp_webhooks.json');

const DEFAULT_CONFIG = {
  target_city: 'Austin',
  target_country: 'United States',
  business_niche: 'Plumbers',
  max_leads_per_day: 25,
  discovery_source: 'auto',
  apify_api_token: '',
  apollo_api_key: '',
  sender_name: 'Alex Morgan',
  sender_email: 'alex@siteselleragent.com',
  sender_whatsapp: '918920608191',
  whatsapp_phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  whatsapp_business_account_id: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
  whatsapp_access_token: process.env.WHATSAPP_ACCESS_TOKEN || '',
  whatsapp_webhook_verify_token: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'siteseller_wa_webhook_verify_secret',
  whatsapp_app_secret: process.env.WHATSAPP_APP_SECRET || '',
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

Customers are searching online every day for {{category}} services, and you might be missing out on valuable jobs.

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

// In-memory / JSON persistence helpers
const db = {
  // Config
  getRawConfig() {
    return readJSON(CONFIG_FILE, DEFAULT_CONFIG);
  },
  getConfig() {
    const raw = this.getRawConfig();
    return {
      ...raw,
      whatsapp_access_token_configured: Boolean(raw.whatsapp_access_token || process.env.WHATSAPP_ACCESS_TOKEN),
      // Mask token if present for frontend security
      whatsapp_access_token: raw.whatsapp_access_token 
        ? `${raw.whatsapp_access_token.substring(0, 6)}••••••••${raw.whatsapp_access_token.slice(-4)}`
        : '',
      whatsapp_app_secret: raw.whatsapp_app_secret ? '••••••••' : ''
    };
  },
  updateConfig(updates) {
    const current = this.getRawConfig();
    const cleanUpdates = { ...updates };
    if (cleanUpdates.whatsapp_access_token && cleanUpdates.whatsapp_access_token.includes('••••')) {
      delete cleanUpdates.whatsapp_access_token;
    }
    if (cleanUpdates.whatsapp_app_secret && cleanUpdates.whatsapp_app_secret.includes('••••')) {
      delete cleanUpdates.whatsapp_app_secret;
    }
    const updated = { ...current, ...cleanUpdates };
    writeJSON(CONFIG_FILE, updated);
    return this.getConfig();
  },

  // Prospects
  getProspects() {
    return readJSON(PROSPECTS_FILE, []);
  },
  getProspectById(id) {
    const list = this.getProspects();
    return list.find(p => p.id === id);
  },
  saveProspects(prospects) {
    writeJSON(PROSPECTS_FILE, prospects);
    return prospects;
  },
  addProspect(prospectData) {
    const list = this.getProspects();
    const newProspect = {
      id: prospectData.id || uuidv4(),
      business_name: prospectData.business_name || 'Local Business',
      category: prospectData.category || 'General Service',
      city: prospectData.city || 'Toronto',
      state: prospectData.state || 'Ontario',
      country: prospectData.country || 'Canada',
      phone: prospectData.phone || '',
      clean_phone: prospectData.clean_phone || (prospectData.phone ? String(prospectData.phone).replace(/\D/g, '') : ''),
      email: prospectData.email || '',
      is_email_verified: prospectData.is_email_verified !== undefined ? prospectData.is_email_verified : true,
      email_status: prospectData.email_status || 'verified_deliverable_gmail',
      mail_server: prospectData.mail_server || 'gmail-smtp-in.l.google.com',
      website_url: prospectData.website_url || null,
      has_website: prospectData.has_website || 'no',
      lead_score: prospectData.lead_score || 85,
      score_breakdown: prospectData.score_breakdown || {
        review_count: prospectData.review_count || 35,
        category_demand: 90,
        website_need: 85,
        rating: prospectData.rating || 4.8
      },
      rating: prospectData.rating || 4.8,
      review_count: prospectData.review_count || 45,
      address: prospectData.address || `${prospectData.city || 'Toronto'}, Ontario, Canada`,
      google_maps_url: prospectData.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((prospectData.business_name || '') + ' ' + (prospectData.city || ''))}`,
      is_verified_real: prospectData.is_verified_real !== undefined ? prospectData.is_verified_real : true,
      discovery_source: prospectData.discovery_source || 'Live OpenStreetMap (Verified Real)',
      status: (prospectData.status || 'NEW').toUpperCase(),
      tags: prospectData.tags || ['Toronto Clinic', 'Hot Lead', 'Verified Real'],
      assigned_to: prospectData.assigned_to || {
        id: 'user-devesh',
        name: 'Devesh Kumar',
        email: 'deveshtesting9672@gmail.com',
        phone: '+91 8920608191',
        role: 'super_admin'
      },
      consent_status: prospectData.consent_status || 'CONSENTED',
      consent_source: prospectData.consent_source || 'Public Verified Directory',
      consent_date: prospectData.consent_date || new Date().toISOString(),
      custom_fields: prospectData.custom_fields || {},
      internal_notes: prospectData.internal_notes || [],
      timeline: prospectData.timeline || [
        {
          id: uuidv4(),
          type: 'LEAD_CREATED',
          title: 'Lead Discovered',
          description: `Discovered from ${prospectData.discovery_source || 'Live OpenStreetMap (Verified Real)'}`,
          timestamp: new Date().toISOString()
        }
      ],
      created_at: prospectData.created_at || new Date().toISOString(),
      updated_at: prospectData.updated_at || new Date().toISOString()
    };
    list.unshift(newProspect);
    writeJSON(PROSPECTS_FILE, list);
    return newProspect;
  },
  updateProspect(id, updates) {
    const list = this.getProspects();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      writeJSON(PROSPECTS_FILE, list);
      return list[idx];
    }
    return null;
  },
  deleteProspect(id) {
    let list = this.getProspects();
    list = list.filter(p => p.id !== id);
    writeJSON(PROSPECTS_FILE, list);
    return true;
  },

  // Generated Sites
  getSites() {
    return readJSON(SITES_FILE, []);
  },
  getSiteById(id) {
    const list = this.getSites();
    return list.find(s => s.id === id);
  },
  getSiteByProspectId(prospectId) {
    const list = this.getSites();
    return list.find(s => s.prospect_id === prospectId);
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

  // Outreach Logs
  getLogs() {
    return readJSON(LOGS_FILE, []);
  },
  addLog(logData) {
    const list = this.getLogs();
    const newLog = {
      id: uuidv4(),
      prospect_id: logData.prospect_id,
      prospect_name: logData.prospect_name || '',
      channel: logData.channel || 'email', // email or whatsapp
      recipient_email: logData.recipient_email || '',
      recipient_phone: logData.recipient_phone || '',
      email_subject: logData.email_subject || (logData.channel === 'whatsapp' ? 'WhatsApp Direct Outreach' : ''),
      email_body: logData.email_body || '',
      sent_date: new Date().toISOString(),
      reply_received: logData.reply_received || 'no', // yes / no
      reply_text: logData.reply_text || null,
      reply_sentiment: logData.reply_sentiment || null, // positive / pricing / skeptical / opt-out
      status: logData.status || 'sent', // draft / queued / sent / delivered / replied / bounced
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

  // WhatsApp Contacts
  getWhatsAppContacts() {
    return readJSON(WHATSAPP_CONTACTS_FILE, []);
  },
  getWhatsAppContactById(id) {
    const list = this.getWhatsAppContacts();
    return list.find(c => c.id === id);
  },
  addWhatsAppContact(contactData) {
    const list = this.getWhatsAppContacts();
    const cleanPhone = (contactData.clean_phone || contactData.phone || '').replace(/\D/g, '');
    const existing = list.find(c => c.clean_phone === cleanPhone);
    if (existing) {
      return { contact: existing, isDuplicate: true };
    }
    const newContact = {
      id: contactData.id || uuidv4(),
      name: contactData.name || 'Contact',
      phone: contactData.phone?.startsWith('+') ? contactData.phone : `+${cleanPhone}`,
      clean_phone: cleanPhone,
      email: contactData.email || '',
      company: contactData.company || '',
      city: contactData.city || '',
      category: contactData.category || '',
      consent_status: contactData.consent_status || 'CONSENTED',
      consent_source: contactData.consent_source || 'Manual Entry',
      consent_date: contactData.consent_date || new Date().toISOString(),
      opt_out_date: contactData.opt_out_date || null,
      tags: contactData.tags || [],
      custom_fields: contactData.custom_fields || {},
      created_at: new Date().toISOString()
    };
    list.unshift(newContact);
    writeJSON(WHATSAPP_CONTACTS_FILE, list);
    return { contact: newContact, isDuplicate: false };
  },
  importWhatsAppContacts(contactsArray) {
    const list = this.getWhatsAppContacts();
    const existingPhones = new Set(list.map(c => c.clean_phone));
    const added = [];
    let duplicates = 0;

    for (const item of contactsArray) {
      const cleanPhone = (item.clean_phone || item.phone || '').replace(/\D/g, '');
      if (!cleanPhone || existingPhones.has(cleanPhone)) {
        duplicates++;
        continue;
      }
      existingPhones.add(cleanPhone);
      const newContact = {
        id: item.id || uuidv4(),
        name: item.name || 'Contact',
        phone: item.phone?.startsWith('+') ? item.phone : `+${cleanPhone}`,
        clean_phone: cleanPhone,
        email: item.email || '',
        company: item.company || '',
        city: item.city || '',
        category: item.category || '',
        consent_status: item.consent_status || 'CONSENTED',
        consent_source: item.consent_source || 'Bulk Import',
        consent_date: item.consent_date || new Date().toISOString(),
        opt_out_date: null,
        tags: item.tags || [],
        custom_fields: item.custom_fields || {},
        created_at: new Date().toISOString()
      };
      list.unshift(newContact);
      added.push(newContact);
    }
    writeJSON(WHATSAPP_CONTACTS_FILE, list);
    return { total_imported: added.length, duplicates_skipped: duplicates, contacts: added };
  },
  updateWhatsAppContact(id, updates) {
    const list = this.getWhatsAppContacts();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      writeJSON(WHATSAPP_CONTACTS_FILE, list);
      return list[idx];
    }
    return null;
  },
  deleteWhatsAppContact(id) {
    let list = this.getWhatsAppContacts();
    list = list.filter(c => c.id !== id);
    writeJSON(WHATSAPP_CONTACTS_FILE, list);
    return true;
  },
  optOutWhatsAppContactByPhone(cleanPhone, reason = 'Direct user opt-out') {
    const normPhone = cleanPhone.replace(/\D/g, '');
    const list = this.getWhatsAppContacts();
    let updated = false;
    for (const c of list) {
      if (c.clean_phone === normPhone || c.clean_phone.endsWith(normPhone) || normPhone.endsWith(c.clean_phone)) {
        c.consent_status = 'OPTED_OUT';
        c.opt_out_date = new Date().toISOString();
        c.opt_out_reason = reason;
        updated = true;
      }
    }
    if (updated) {
      writeJSON(WHATSAPP_CONTACTS_FILE, list);
    }
    return updated;
  },

  // WhatsApp Campaigns
  getWhatsAppCampaigns() {
    return readJSON(WHATSAPP_CAMPAIGNS_FILE, []);
  },
  getWhatsAppCampaignById(id) {
    const list = this.getWhatsAppCampaigns();
    return list.find(c => c.id === id);
  },
  saveWhatsAppCampaign(campaignData) {
    const list = this.getWhatsAppCampaigns();
    const existingIdx = list.findIndex(c => c.id === campaignData.id);
    const campaignRecord = {
      id: campaignData.id || uuidv4(),
      name: campaignData.name || 'Untitled Broadcast',
      status: campaignData.status || 'DRAFT',
      type: campaignData.type || 'template',
      template_name: campaignData.template_name || '',
      template_language: campaignData.template_language || 'en_US',
      template_parameters: campaignData.template_parameters || [],
      message_text: campaignData.message_text || '',
      media_type: campaignData.media_type || null,
      media_url: campaignData.media_url || null,
      recipient_count: (campaignData.recipients || []).length,
      recipients: (campaignData.recipients || []).map(r => ({
        id: r.id || uuidv4(),
        contact_id: r.contact_id || null,
        name: r.name || 'Contact',
        phone: r.phone,
        status: r.status || 'QUEUED',
        wamid: r.wamid || null,
        error_code: r.error_code || null,
        error_message: r.error_message || null,
        sent_at: r.sent_at || null,
        delivered_at: r.delivered_at || null,
        read_at: r.read_at || null
      })),
      stats: campaignData.stats || {
        total: (campaignData.recipients || []).length,
        queued: (campaignData.recipients || []).length,
        accepted: 0,
        sent: 0,
        delivered: 0,
        read: 0,
        failed: 0
      },
      created_at: campaignData.created_at || new Date().toISOString(),
      started_at: campaignData.started_at || null,
      completed_at: campaignData.completed_at || null
    };

    if (existingIdx !== -1) {
      list[existingIdx] = { ...list[existingIdx], ...campaignRecord, updated_at: new Date().toISOString() };
      writeJSON(WHATSAPP_CAMPAIGNS_FILE, list);
      return list[existingIdx];
    } else {
      list.unshift(campaignRecord);
      writeJSON(WHATSAPP_CAMPAIGNS_FILE, list);
      return campaignRecord;
    }
  },
  updateWhatsAppCampaign(id, updates) {
    const list = this.getWhatsAppCampaigns();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
      if (Array.isArray(list[idx].recipients)) {
        const rList = list[idx].recipients;
        list[idx].stats = {
          total: rList.length,
          queued: rList.filter(r => r.status === 'QUEUED').length,
          accepted: rList.filter(r => r.status === 'ACCEPTED').length,
          sent: rList.filter(r => ['SENT', 'DELIVERED', 'READ'].includes(r.status)).length,
          delivered: rList.filter(r => ['DELIVERED', 'READ'].includes(r.status)).length,
          read: rList.filter(r => r.status === 'READ').length,
          failed: rList.filter(r => r.status === 'FAILED').length
        };
      }
      writeJSON(WHATSAPP_CAMPAIGNS_FILE, list);
      return list[idx];
    }
    return null;
  },
  deleteWhatsAppCampaign(id) {
    let list = this.getWhatsAppCampaigns();
    list = list.filter(c => c.id !== id);
    writeJSON(WHATSAPP_CAMPAIGNS_FILE, list);
    return true;
  },
  updateRecipientStatus(recipientId, status, details = {}) {
    const campaigns = this.getWhatsAppCampaigns();
    for (const c of campaigns) {
      const r = (c.recipients || []).find(rec => rec.id === recipientId);
      if (r) {
        r.status = status;
        if (details.wamid) r.wamid = details.wamid;
        if (details.sent_at) r.sent_at = details.sent_at;
        if (details.delivered_at) r.delivered_at = details.delivered_at;
        if (details.read_at) r.read_at = details.read_at;
        if (details.error_code) r.error_code = details.error_code;
        if (details.error_message) r.error_message = details.error_message;

        c.stats = {
          total: c.recipients.length,
          queued: c.recipients.filter(x => x.status === 'QUEUED').length,
          accepted: c.recipients.filter(x => x.status === 'ACCEPTED').length,
          sent: c.recipients.filter(x => ['SENT', 'DELIVERED', 'READ'].includes(x.status)).length,
          delivered: c.recipients.filter(x => ['DELIVERED', 'READ'].includes(x.status)).length,
          read: c.recipients.filter(x => x.status === 'READ').length,
          failed: c.recipients.filter(x => x.status === 'FAILED').length
        };

        writeJSON(WHATSAPP_CAMPAIGNS_FILE, campaigns);
        return r;
      }
    }
    return null;
  },
  findRecipientByWamid(wamid) {
    const campaigns = this.getWhatsAppCampaigns();
    for (const c of campaigns) {
      const r = (c.recipients || []).find(rec => rec.wamid === wamid);
      if (r) return r;
    }
    return null;
  },
  getWebhookLogs(limit = 50) {
    const list = readJSON(WHATSAPP_WEBHOOKS_FILE, []);
    return list.slice(0, limit);
  },
  addWebhookLog(logData) {
    const list = readJSON(WHATSAPP_WEBHOOKS_FILE, []);
    const entry = {
      id: uuidv4(),
      ...logData,
      created_at: new Date().toISOString()
    };
    list.unshift(entry);
    if (list.length > 200) list.length = 200;
    writeJSON(WHATSAPP_WEBHOOKS_FILE, list);
    return entry;
  },

  // Clear all leads, demo sites, and outreach logs
  clearDatabase() {
    writeJSON(PROSPECTS_FILE, []);
    writeJSON(SITES_FILE, []);
    writeJSON(LOGS_FILE, []);
    return { success: true, message: 'All prospects, demo sites, and outreach logs have been cleared.' };
  }
};

module.exports = db;
