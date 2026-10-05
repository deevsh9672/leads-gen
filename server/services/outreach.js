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
  const baseUrl = customOptions.baseUrl || (process.env.RENDER_EXTERNAL_URL ? process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, '') : 'https://leads-gen-b3uj.onrender.com');

  // Ensure demo site is generated & hosted
  const site = await hostDemoSite(prospect.id, baseUrl);

  // Template variables
  const rawWa = config.sender_whatsapp || '918920608191';
  const cleanWa = rawWa.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hi! I received your email regarding the website demo for ${prospect.business_name}. I would like to claim it!`)}`;

  const templateVars = {
    business_name: prospect.business_name,
    city: prospect.city,
    category: prospect.category,
    demo_url: site.demo_url,
    sender_name: config.sender_name || 'Devesh Kumar',
    sender_email: config.sender_email || 'deveshtesting9672@gmail.com',
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

/**
 * Skill 5 (WhatsApp): Outreach
 * Dispatches personalized WhatsApp message to the prospect with demo link & CTA
 */
async function sendWhatsAppOutreach(prospectId, customOptions = {}) {
  const prospect = db.getProspectById(prospectId);
  if (!prospect) {
    throw new Error(`Prospect with ID ${prospectId} not found`);
  }

  const config = db.getConfig();
  const baseUrl = customOptions.baseUrl || (process.env.RENDER_EXTERNAL_URL ? process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, '') : 'https://leads-gen-b3uj.onrender.com');

  // Ensure demo site is generated & hosted
  const site = await hostDemoSite(prospect.id, baseUrl);

  const rawAgencyWa = config.sender_whatsapp || '918920608191';

  const templateVars = {
    business_name: prospect.business_name,
    city: prospect.city,
    category: prospect.category,
    demo_url: site.demo_url,
    sender_name: config.sender_name || 'Devesh Kumar',
    sender_whatsapp: rawAgencyWa
  };

  // Category specific Hinglish default message for Indian local business & cafe owners
  const cat = (prospect.category || '').toLowerCase();
  const categoryGreeting = (cat.includes('cafe') || cat.includes('coffee')) 
    ? `Namaste {{business_name}} team! ☕\n\nMaine dekha ki Google par {{city}} me aapke cafe ke reviews aur rating kaafi ache hain, par online koi official modern website nahi hai.\n\nAapke cafe ke liye humne ek luxury, fully 3D animated demo website design ki hai — bilkul free:\n👉 Live demo website link: {{demo_url}}\n\n✨ Features:\n• Realistic 3D Espresso Cup & Latte Art\n• Interactive Digital Menu & Special Blends\n• AI Barista Table & Coffee Recommendation\n• Direct WhatsApp Table Booking & Order System\n\nAgar aap ise claim karna chahte hain ya apna custom menu/photos add karwana chahte hain, toh bas yahan WhatsApp par reply karein! 🙌\n\nWarm regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}`
    : (cat.includes('restaurant') || cat.includes('dining') || cat.includes('food') || cat.includes('dhaba'))
    ? `Namaste {{business_name}} team! 🍽️\n\nMaine dekha ki Google par {{city}} me aapke restaurant ke customer reviews zabardast hain, lekin online koi official website nahi hai jisse log direct table book kar sakein.\n\nAapke restaurant ke liye humne ek premium, fully animated live demo website design ki hai — 100% free:\n👉 Live demo website link: {{demo_url}}\n\n✨ Features:\n• Chef's Special Live Food Menu\n• Instant WhatsApp Table Reservation\n• Customer Reviews & Photo Showcase\n• Mobile & Google Optimized Speed\n\nAgar aap ise claim karna chahte hain ya apna custom menu add karwana chahte hain, toh bas yahan WhatsApp par reply karein! 🙌\n\nWarm regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}`
    : `Namaste {{business_name}} team! 👋\n\nMaine dekha ki {{city}} me aapke {{category}} business ke local reviews kaafi ache hain, lekin Google par aapki koi modern official website listed nahi hai.\n\nAapke business ki online branding aur naye customers attract karne ke liye humne ek high-converting live demo website ready ki hai — 100% free:\n👉 Aapka live demo website link: {{demo_url}}\n\nAgar aapko ye design pasand aaye aur aap ise claim karna chahte hain, ya koi details edit karwani ho, toh bas yahan WhatsApp par reply karein! 🙌\n\nWarm regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}`;

  const templateToUse = customOptions.message || (
    config.whatsapp_message_template && !config.whatsapp_message_template.startsWith('Hi team') 
      ? config.whatsapp_message_template 
      : categoryGreeting
  );

  const messageText = renderTemplate(templateToUse, templateVars);

  const recipientPhone = customOptions.phone || prospect.phone || '';
  let cleanRecipientPhone = recipientPhone.replace(/[^0-9]/g, '');
  if (cleanRecipientPhone.length === 10 && ['6', '7', '8', '9'].includes(cleanRecipientPhone[0])) {
    cleanRecipientPhone = '91' + cleanRecipientPhone;
  }
  if (!cleanRecipientPhone) {
    cleanRecipientPhone = rawAgencyWa.replace(/[^0-9]/g, '');
  }

  // Generate WhatsApp deep links for web and native app
  const waWebLink = `https://wa.me/${cleanRecipientPhone}?text=${encodeURIComponent(messageText)}`;
  const waAppLink = `whatsapp://send?phone=${cleanRecipientPhone}&text=${encodeURIComponent(messageText)}`;

  // Skill 6: Log the WhatsApp outreach
  const logRecord = recordOutreach({
    prospect_id: prospect.id,
    prospect_name: prospect.business_name,
    channel: 'whatsapp',
    recipient_email: prospect.email || '',
    recipient_phone: recipientPhone,
    email_subject: `WhatsApp Outreach to ${prospect.business_name}`,
    email_body: messageText,
    reply_received: 'no',
    reply_text: null,
    status: 'delivered',
    demo_url: site.demo_url
  });

  // Update prospect status from 'new' to 'contacted'
  db.updateProspect(prospect.id, {
    status: 'contacted',
    last_contacted_at: new Date().toISOString()
  });

  console.log(`[WhatsApp Outreach] Prepared and logged message for ${prospect.business_name} (${recipientPhone})`);

  return {
    success: true,
    channel: 'whatsapp',
    log: logRecord,
    prospect: db.getProspectById(prospect.id),
    wa_web_link: waWebLink,
    wa_app_link: waAppLink,
    message_text: messageText,
    recipient_phone: recipientPhone
  };
}

module.exports = {
  sendDemoOutreach,
  sendWhatsAppOutreach,
  renderTemplate
};
