const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { discoverLeads } = require('./services/discover');
const { scoreProspect } = require('./services/score');
const { generateWebsiteForProspect } = require('./services/generator');
const { hostDemoSite } = require('./services/host');
const { sendDemoOutreach, sendWhatsAppOutreach } = require('./services/outreach');
const { recordOutreach, getOutreachLogs } = require('./services/logger');
const { handleIncomingReply } = require('./services/replies');
const { runAutonomousPipeline, getPipelineStatus } = require('./services/pipeline');

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

// SKILL 1: DISCOVER
app.post('/api/skills/discover', async (req, res) => {
  try {
    const { city, niche, limit } = req.body;
    const result = await discoverLeads({ city, niche, limit });
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
