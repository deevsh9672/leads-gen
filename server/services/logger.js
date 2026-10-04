const db = require('../db');

/**
 * Skill 6: Log
 * Record every outreach attempt and email in OutreachLog
 */
function recordOutreach(logData) {
  const saved = db.addLog({
    prospect_id: logData.prospect_id,
    prospect_name: logData.prospect_name || '',
    channel: logData.channel || 'email',
    recipient_email: logData.recipient_email || '',
    recipient_phone: logData.recipient_phone || '',
    email_subject: logData.email_subject || '',
    email_body: logData.email_body || '',
    reply_received: logData.reply_received || 'no',
    reply_text: logData.reply_text || null,
    reply_sentiment: logData.reply_sentiment || null,
    status: logData.status || 'sent',
    demo_url: logData.demo_url || ''
  });

  console.log(`[Log Skill] Recorded outreach for ${saved.prospect_name} (${saved.recipient_email}) -> Status: ${saved.status}`);
  return saved;
}

function getOutreachLogs() {
  return db.getLogs();
}

function updateOutreachLog(id, updates) {
  return db.updateLog(id, updates);
}

module.exports = {
  recordOutreach,
  getOutreachLogs,
  updateOutreachLog
};
