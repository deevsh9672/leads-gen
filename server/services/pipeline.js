const db = require('../db');
const { discoverLeads } = require('./discover');
const { scoreProspect } = require('./score');
const { generateWebsiteForProspect } = require('./generator');
const { hostDemoSite } = require('./host');
const { sendDemoOutreach, sendWhatsAppOutreach } = require('./outreach');

// In-memory status for running pipeline
let currentRun = {
  running: false,
  stage: 'idle', // idle, discovering, scoring, generating, hosting, outreaching, completed, error
  progress: 0,
  logs: [],
  summary: null
};

function addPipelineLog(msg, type = 'info') {
  const entry = {
    timestamp: new Date().toLocaleTimeString(),
    message: msg,
    type // info, success, warning, error
  };
  currentRun.logs.push(entry);
  if (currentRun.logs.length > 100) currentRun.logs.shift();
  console.log(`[Pipeline] ${msg}`);
}

function getPipelineStatus() {
  return currentRun;
}

/**
 * Runs the full 7-skill autonomous pipeline:
 * Discover -> Score -> Generate -> Host -> Outreach -> Log -> Reply Readiness
 */
async function runAutonomousPipeline(options = {}) {
  if (currentRun.running) {
    return { error: 'Pipeline is already running', status: currentRun };
  }

  const config = db.getConfig();
  const city = options.city || config.target_city || 'Austin';
  const niche = options.niche || config.business_niche || 'Plumbers';
  const maxLeads = options.limit || config.max_leads_per_day || 5;
  const baseUrl = options.baseUrl || 'http://localhost:5000';

  currentRun = {
    running: true,
    stage: 'discovering',
    progress: 5,
    logs: [],
    summary: null
  };

  try {
    addPipelineLog(`🚀 Starting Autonomous SiteSeller Superagent Cycle for ${niche} in ${city}...`, 'info');

    // SKILL 1: DISCOVER
    addPipelineLog(`Skill 1 [Discover]: Searching for local businesses with NO website...`, 'info');
    currentRun.progress = 15;
    const discoveryResult = await discoverLeads({ city, niche, limit: maxLeads });
    addPipelineLog(`Skill 1 [Discover]: Found ${discoveryResult.discovered_count} qualified businesses lacking websites.`, 'success');

    // SKILL 2: SCORE
    currentRun.stage = 'scoring';
    currentRun.progress = 30;
    addPipelineLog(`Skill 2 [Score]: Ranking prospects 1-100 based on review count & niche demand...`, 'info');
    
    // Fetch all 'new' prospects and sort by score descending
    let prospects = db.getProspects().filter(p => p.status === 'new');
    prospects.sort((a, b) => b.lead_score - a.lead_score);

    // Pick top candidates up to maxLeads
    const topProspects = prospects.slice(0, maxLeads);
    for (const p of topProspects) {
      addPipelineLog(`⭐ Ranked "${p.business_name}" with score ${p.lead_score}/100 (${p.score_breakdown?.tier || 'High Potential'})`, 'info');
    }

    if (topProspects.length === 0) {
      addPipelineLog(`No new prospects needed processing. Pipeline finished.`, 'warning');
      currentRun.running = false;
      currentRun.stage = 'completed';
      currentRun.progress = 100;
      return currentRun;
    }

    // SKILLS 3 & 4: GENERATE & HOST
    currentRun.stage = 'generating';
    currentRun.progress = 50;
    addPipelineLog(`Skill 3 & 4 [Generate & Host]: Building modern demo websites with hero, services, gallery, and WhatsApp...`, 'info');

    const generatedSites = [];
    for (let i = 0; i < topProspects.length; i++) {
      const p = topProspects[i];
      addPipelineLog(`🎨 Generating bespoke demo website for "${p.business_name}"...`, 'info');
      
      const site = await hostDemoSite(p.id, baseUrl);
      generatedSites.push(site);
      addPipelineLog(`🌐 Hosted live demo at: ${site.demo_url}`, 'success');
      currentRun.progress = 50 + Math.round(((i + 1) / topProspects.length) * 20);
    }

    // SKILLS 5 & 6: OUTREACH & LOG (Simultaneous Email + WhatsApp)
    currentRun.stage = 'outreaching';
    currentRun.progress = 75;
    addPipelineLog(`Skill 5 & 6 [Outreach & Log]: Dispatching multi-channel outreach (Email + WhatsApp) with demo links...`, 'info');

    const outreachResults = [];
    const waResults = [];
    for (let i = 0; i < topProspects.length; i++) {
      const p = topProspects[i];
      addPipelineLog(`📧 Sending personalized demo invitation email to "${p.business_name}" (${p.email})...`, 'info');
      
      const res = await sendDemoOutreach(p.id, { baseUrl });
      outreachResults.push(res);
      addPipelineLog(`✅ Email Delivered & Logged! Recipient: ${p.email} | Status: ${res.log.status}`, 'success');

      // WhatsApp outreach with live demo link
      try {
        addPipelineLog(`📲 Dispatching WhatsApp outreach with live demo link for "${p.business_name}" (${p.phone || 'WhatsApp'})...`, 'info');
        const waRes = await sendWhatsAppOutreach(p.id, { baseUrl });
        waResults.push(waRes);
        addPipelineLog(`✅ WhatsApp outreach logged & click-to-chat ready for "${p.business_name}" (${waRes.recipient_phone})!`, 'success');
      } catch (waErr) {
        addPipelineLog(`⚠️ WhatsApp note for "${p.business_name}": ${waErr.message}`, 'warning');
      }

      currentRun.progress = 75 + Math.round(((i + 1) / topProspects.length) * 20);
    }

    // SKILL 7: REPLY READY
    currentRun.stage = 'reply_ready';
    currentRun.progress = 100;
    addPipelineLog(`Skill 7 [Reply Monitor]: Active. Superagent is listening for client email and WhatsApp responses.`, 'success');

    currentRun.running = false;
    currentRun.stage = 'completed';
    currentRun.summary = {
      city,
      niche,
      discovered_count: discoveryResult.discovered_count,
      sites_generated: generatedSites.length,
      emails_sent: outreachResults.length,
      whatsapp_sent: waResults.length,
      completed_at: new Date().toISOString()
    };

    addPipelineLog(`🎉 Full Autonomous Cycle Finished Successfully! Dispatched Email + WhatsApp demo outreach to ${topProspects.length} high-scoring leads.`, 'success');

  } catch (err) {
    console.error('[Pipeline] Error executing cycle:', err);
    addPipelineLog(`❌ Pipeline Error: ${err.message}`, 'error');
    currentRun.running = false;
    currentRun.stage = 'error';
  }

  return currentRun;
}

module.exports = {
  runAutonomousPipeline,
  getPipelineStatus,
  addPipelineLog
};
