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

const DEFAULT_CONFIG = {
  target_city: 'Austin',
  target_country: 'United States',
  business_niche: 'Plumbers',
  max_leads_per_day: 25,
  sender_name: 'Alex Morgan',
  sender_email: 'alex@siteselleragent.com',
  sender_whatsapp: '918929698191',
  physical_mailing_address: '100 Congress Ave, Suite 2000, Austin, TX 78701, USA',
  smtp_host: 'smtp.gmail.com',
  smtp_port: 587,
  smtp_user: '',
  smtp_pass: '',
  auto_pilot: false,
  email_subject_template: 'Free modern website demo for {{business_name}}',
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
  getConfig() {
    return readJSON(CONFIG_FILE, DEFAULT_CONFIG);
  },
  updateConfig(updates) {
    const current = this.getConfig();
    const updated = { ...current, ...updates };
    writeJSON(CONFIG_FILE, updated);
    return updated;
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
      id: uuidv4(),
      business_name: prospectData.business_name || 'Local Business',
      category: prospectData.category || 'General Service',
      city: prospectData.city || 'Austin',
      phone: prospectData.phone || '',
      email: prospectData.email || '',
      website_url: prospectData.website_url || null,
      has_website: prospectData.has_website || 'no',
      lead_score: prospectData.lead_score || 50,
      score_breakdown: prospectData.score_breakdown || {
        review_count: 15,
        category_demand: 70,
        website_need: 85,
        rating: 4.8
      },
      status: prospectData.status || 'new', // new / contacted / replied / opted-out / client
      created_at: new Date().toISOString()
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
      recipient_email: logData.recipient_email || '',
      email_subject: logData.email_subject || '',
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
  }
};

module.exports = db;
