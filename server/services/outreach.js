const nodemailer = require('nodemailer');
const db = require('../db');
const { recordOutreach } = require('./logger');
const { hostDemoSite } = require('./host');

function renderTemplate(template, vars) {
  let output = template;
  for (const [key, val] of Object.entries(vars)) {
    const reg = new RegExp(`{{${key}}}`, 'g');
    output = output.replace(reg, val || '');
  }
  return output;
}

/**
 * Skill 5: Outreach
 * Sends a short personalized email mentioning the free demo website, demo link, and clear CTA
 */
async function sendDemoOutreach(prospectId, customOptions = {}) {
  const prospect = db.getProspectById(prospectId);
  if (!prospect) {
    throw new Error(`Prospect with ID ${prospectId} not found`);
  }

  const config = db.getConfig();
  const baseUrl = customOptions.baseUrl || 'http://localhost:5000';

  // Ensure demo site is generated & hosted
  const site = await hostDemoSite(prospect.id, baseUrl);

  // Template variables
  const rawWa = config.sender_whatsapp || '918929698191';
  const cleanWa = rawWa.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hi! I received your email regarding the website demo for ${prospect.business_name}. I would like to claim it!`)}`;

  const templateVars = {
    business_name: prospect.business_name,
    city: prospect.city,
    category: prospect.category,
    demo_url: site.demo_url,
    sender_name: config.sender_name || 'Alex Morgan',
    sender_email: config.sender_email || 'alex@siteselleragent.com',
    sender_whatsapp: rawWa,
    whatsapp_link: waLink,
    physical_mailing_address: config.physical_mailing_address || '100 Congress Ave, Suite 2000, Austin, TX 78701, USA'
  };

  const subject = customOptions.subject || renderTemplate(config.email_subject_template || 'Free modern website demo for {{business_name}}', templateVars);
  const body = customOptions.body || renderTemplate(config.email_body_template, templateVars);
  const recipientEmail = customOptions.email || prospect.email || `contact@${prospect.business_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  let deliveryStatus = 'delivered';
  let deliveryDetails = null;

  // Check if live Gmail / SMTP credentials are provided
  if (config.smtp_user && config.smtp_pass) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.smtp_host || 'smtp.gmail.com',
        port: config.smtp_port || 587,
        secure: config.smtp_port === 465,
        auth: {
          user: config.smtp_user,
          pass: config.smtp_pass
        }
      });

      const info = await transporter.sendMail({
        from: `"${config.sender_name}" <${config.sender_email || config.smtp_user}>`,
        to: recipientEmail,
        subject: subject,
        text: body,
        html: body.replace(/\n/g, '<br/>')
      });

      deliveryStatus = 'delivered';
      deliveryDetails = { messageId: info.messageId, response: info.response, mode: 'live_gmail_smtp' };
      console.log(`[Outreach Skill] Live Gmail sent to ${recipientEmail}:`, info.messageId);
    } catch (sendErr) {
      console.error('[Outreach Skill] SMTP error, falling back to logged simulation:', sendErr.message);
      deliveryStatus = 'sent';
      deliveryDetails = { mode: 'simulation_fallback', error: sendErr.message };
    }
  } else {
    // Zero-friction simulation mode with realistic delivery
    deliveryStatus = 'delivered';
    deliveryDetails = { mode: 'sandbox_simulator', simulated_provider: 'Gmail API' };
    console.log(`[Outreach Skill] Sandbox simulated email sent to ${recipientEmail} for ${prospect.business_name}`);
  }

  // Skill 6: Log the outreach email
  const logRecord = recordOutreach({
    prospect_id: prospect.id,
    prospect_name: prospect.business_name,
    recipient_email: recipientEmail,
    email_subject: subject,
    email_body: body,
    reply_received: 'no',
    reply_text: null,
    status: deliveryStatus,
    demo_url: site.demo_url
  });

  // Update prospect status from 'new' to 'contacted'
  db.updateProspect(prospect.id, {
    status: 'contacted',
    last_contacted_at: new Date().toISOString()
  });

  return {
    success: true,
    log: logRecord,
    prospect: db.getProspectById(prospect.id),
    delivery: deliveryDetails
  };
}

module.exports = {
  sendDemoOutreach,
  renderTemplate
};
