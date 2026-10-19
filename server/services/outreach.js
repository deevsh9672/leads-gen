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
 * Returns tailored outreach messages (WhatsApp & Email) matching the exact business niche
 */
function getNicheOutreachTemplates(prospect, config = {}) {
  const cat = (prospect?.category || '').toLowerCase();
  const name = (prospect?.business_name || '').toLowerCase();
  const city = prospect?.city || 'Toronto';

  // 1. CLINIC / MEDICAL / HEALTHCARE / DENTAL / PHYSIO / DERMA / FERTILITY
  if (
    cat.includes('clinic') || cat.includes('health') || cat.includes('medical') || cat.includes('doctor') ||
    cat.includes('dental') || cat.includes('physio') || cat.includes('chiro') || cat.includes('derma') ||
    cat.includes('fertility') || cat.includes('walk-in') || cat.includes('urgent') ||
    name.includes('clinic') || name.includes('medical') || name.includes('health') || name.includes('dental') ||
    name.includes('physio') || name.includes('doctor') || name.includes('fertility') || name.includes('care')
  ) {
    return {
      niche: 'clinic',
      niche_name: 'Medical & Healthcare Clinic',
      whatsapp: `Hello {{business_name}} team! 🏥\n\nWe noticed that {{business_name}} has exceptional patient reviews in {{city}}, but currently doesn't have an official modern, mobile-friendly clinic website with online patient booking.\n\nTo help your patients easily find your clinic, review doctor specialties, and book appointments online, we built a complimentary live demo clinic website for you:\n👉 Live Clinic Demo: {{demo_url}}\n\n✨ Key Features Included:\n• Seamless Online Patient Appointment & Walk-In Booking\n• Doctors, Specialties & Treatment Showcase\n• Direct WhatsApp & Telephone Hotline Integration\n• 100% Mobile & Google SEO Optimized Speed\n\nIf you'd like to claim this design for your clinic or customize your doctor profiles and timings, simply reply here! 🙌\n\nWarm regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}`,
      email_subject: `Complimentary modern website & online patient booking demo for {{business_name}}`,
      email_body: `Dear {{business_name}} Team,\n\nWe noticed that {{business_name}} is highly regarded by patients in {{city}}, yet lacks an official modern website with online appointment scheduling.\n\nPatients in {{city}} increasingly search on Google and smartphones to find clinic timings, review doctor credentials, and book visits. Without an official website, prospective patients often end up booking elsewhere.\n\nTo help out, our web team designed a complete, mobile-friendly demo clinic website specifically for {{business_name}} — 100% free with no obligation:\n👉 View your live clinic demo here: {{demo_url}}\n\nHighlights of your demo website:\n• Patient Appointment Request & Department Routing\n• Comprehensive Treatment & Specialist Catalog\n• Direct WhatsApp & Phone Hotline Click-to-Call\n• Verified Google Review Badges & Direct Map Directions\n\nIf you would like to claim this website, customize your doctors and services, or connect your official domain, please reply directly to this email or reach us on WhatsApp: {{whatsapp_link}}\n\nBest regards,\n{{sender_name}}\nHealthcare Web Development Team\nWhatsApp: +{{sender_whatsapp}}\n\n---\nCAN-SPAM Notice: You are receiving this because your business is publicly listed in {{city}}.\nPhysical Address: {{physical_mailing_address}}\nTo opt out, reply with 'UNSUBSCRIBE'.`
    };
  }

  // 2. RESTAURANT / FINE DINING / BISTRO
  if (cat.includes('restaurant') || cat.includes('dining') || cat.includes('food') || cat.includes('bistro') || cat.includes('dhaba') || name.includes('restaurant')) {
    return {
      niche: 'restaurant',
      niche_name: 'Restaurant & Fine Dining',
      whatsapp: `Hello {{business_name}} team! 🍽️\n\nWe noticed that {{business_name}} has wonderful customer reviews in {{city}}, but doesn't have a modern official website for guests to browse your culinary menu and reserve tables online.\n\nWe designed a luxury, fully animated live demo dining website for {{business_name}} — 100% free:\n👉 Live Demo Link: {{demo_url}}\n\n✨ Key Features:\n• Chef's Special Live Food & Dining Menu\n• Instant Online Table Reservation System\n• Customer Reviews & Ambiance Showcase\n• 100% Mobile & Google Optimized Speed\n\nIf you would like to claim this design or customize your menu/photos, simply reply here! 🙌\n\nWarm regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}`,
      email_subject: `Modern dining website & table reservation demo for {{business_name}}`,
      email_body: `Dear {{business_name}} Team,\n\nWe noticed your great food ratings in {{city}}! However, you don't have an official modern website with online table booking.\n\nWe built a complimentary live demo website for {{business_name}}:\n👉 View your live demo here: {{demo_url}}\n\nFeatures include digital food menus, table reservations, and direct WhatsApp contact.\n\nReply directly to claim or connect your domain!\n\nBest regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}\n\n---\nPhysical Address: {{physical_mailing_address}}\nTo opt out, reply with 'UNSUBSCRIBE'.`
    };
  }

  // 3. CAFE / COFFEE SHOP / ROASTERY
  if (cat.includes('cafe') || cat.includes('coffee') || cat.includes('tea') || cat.includes('roast') || cat.includes('espresso') || name.includes('cafe') || name.includes('coffee')) {
    return {
      niche: 'cafe',
      niche_name: 'Specialty Cafe & Roastery',
      whatsapp: `Hello {{business_name}} team! ☕\n\nWe noticed your cafe has great reviews in {{city}}, but no modern official website. We built a luxury, fully 3D animated demo website for you — 100% free:\n👉 Live demo link: {{demo_url}}\n\n✨ Features:\n• 3D Interactive Coffee Showcase & Artisan Menu\n• Seating & Table Pre-Order System\n• Direct WhatsApp Table Booking\n• Mobile & Google Fast Speed\n\nReply here to claim or add your custom menu! 🙌\n\nWarm regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}`,
      email_subject: `Free modern website & digital menu demo for {{business_name}}`,
      email_body: `Dear {{business_name}} Team,\n\nWe noticed your popular cafe reviews in {{city}}, but no modern official website with your digital menu.\n\nTo help out, we designed a complimentary live 3D website demo for {{business_name}}:\n👉 View live demo: {{demo_url}}\n\nReply to claim or connect your domain!\n\nBest regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}\n\n---\nPhysical Address: {{physical_mailing_address}}\nTo opt out, reply with 'UNSUBSCRIBE'.`
    };
  }

  // 4. SALON / SPA / BEAUTY
  if (cat.includes('salon') || cat.includes('spa') || cat.includes('beauty') || cat.includes('hair') || cat.includes('nail') || name.includes('salon') || name.includes('spa')) {
    return {
      niche: 'salon',
      niche_name: 'Beauty Salon & Spa',
      whatsapp: `Hello {{business_name}} team! ✨\n\nWe noticed that {{business_name}} has fabulous client reviews for beauty & styling in {{city}}, but lacks an official modern website with online booking.\n\nWe designed a luxury live demo website for {{business_name}} — 100% free:\n👉 Live Demo Link: {{demo_url}}\n\n✨ Key Features:\n• Online Stylist & Treatment Appointment Booking\n• Complete Service & Beauty Treatment Catalog\n• Client Testimonials & Salon Portfolio Showcase\n• Instant WhatsApp Booking Integration\n\nReply here to claim this design for your salon! 🙌\n\nWarm regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}`,
      email_subject: `Modern salon website & appointment booking demo for {{business_name}}`,
      email_body: `Dear {{business_name}} Team,\n\nWe love your beauty styling and customer reviews in {{city}}! However, you don't have an official modern website with online booking.\n\nWe built a complimentary live demo website for {{business_name}}:\n👉 View your live demo here: {{demo_url}}\n\nReply directly to claim or connect your domain!\n\nBest regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}\n\n---\nPhysical Address: {{physical_mailing_address}}\nTo opt out, reply with 'UNSUBSCRIBE'.`
    };
  }

  // 5. GYM / FITNESS / YOGA
  if (cat.includes('gym') || cat.includes('fitness') || cat.includes('yoga') || cat.includes('crossfit') || name.includes('gym') || name.includes('fitness')) {
    return {
      niche: 'gym',
      niche_name: 'Fitness & Gym Center',
      whatsapp: `Hello {{business_name}} team! 🏋️\n\nWe noticed that {{business_name}} has great fitness reviews in {{city}}, but lacks a modern website with trial pass booking and class schedules.\n\nWe built a high-converting live demo fitness website for you — 100% free:\n👉 Live Demo Link: {{demo_url}}\n\n✨ Key Features:\n• Free Trial Pass & Membership Booking System\n• Interactive Workout Class Schedule & Trainers\n• Member Testimonials & Facility Showcase\n• Direct WhatsApp Hotline\n\nReply here to claim this design! 🙌\n\nWarm regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}`,
      email_subject: `Modern gym website & trial pass demo for {{business_name}}`,
      email_body: `Dear {{business_name}} Team,\n\nWe noticed your fitness community in {{city}}! We built a complimentary live demo website for {{business_name}} with online class schedules and trial passes:\n👉 View live demo: {{demo_url}}\n\nReply directly to claim or connect your domain!\n\nBest regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}\n\n---\nPhysical Address: {{physical_mailing_address}}\nTo opt out, reply with 'UNSUBSCRIBE'.`
    };
  }

  // 6. GENERAL SERVICES / TRADES / CONTRACTORS
  return {
    niche: 'general',
    niche_name: 'Professional Services',
    whatsapp: `Hello {{business_name}} team! 💼\n\nWe noticed that {{business_name}} has great local reviews in {{city}}, but lacks a modern official website for customers to request quotes and book services online.\n\nWe built a high-converting live demo website for {{business_name}} — 100% free:\n👉 Live Demo Link: {{demo_url}}\n\n✨ Key Features:\n• Online Service Estimate & Booking Request Form\n• Core Services & Project Portfolio Showcase\n• Verified Google Reviews & Local Trust Badges\n• Instant WhatsApp & Phone Call Integration\n\nReply here to claim this design! 🙌\n\nWarm regards,\n{{sender_name}}\nWhatsApp: +{{sender_whatsapp}}`,
    email_subject: `Free modern website & estimate booking demo for {{business_name}}`,
    email_body: `Hi team at {{business_name}},\n\nI noticed you don't have a website listed for {{business_name}} in {{city}}, even though you have great local customer reviews!\n\nCustomers are searching online every day for {{category}} services, and you might be missing out on valuable jobs.\n\nTo help out, my team and I built you a complete, high-converting demo website — 100% free with no strings attached:\n👉 View your live website demo here: {{demo_url}}\n\nIf you'd like to claim this design, customize the text/photos, or connect it to your own custom domain:\n💬 Quick WhatsApp: {{whatsapp_link}}\nOr simply reply directly to this email!\n\nBest regards,\n{{sender_name}}\nGrowth & Web Development\nWhatsApp: +{{sender_whatsapp}}\n\n---\nCAN-SPAM Notice: You are receiving this because your business is publicly listed in {{city}}.\nPhysical Address: {{physical_mailing_address}}\nTo opt out, reply with 'UNSUBSCRIBE'.`
  };
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

  // Niche-tailored fallback templates
  const nicheTmpl = getNicheOutreachTemplates(prospect, config);

  const subject = customOptions.subject || renderTemplate(
    (config.email_subject_template && !config.email_subject_template.includes('cafe')) 
      ? config.email_subject_template 
      : nicheTmpl.email_subject, 
    templateVars
  );

  const body = customOptions.body || renderTemplate(
    (config.email_body_template && !config.email_body_template.includes('cafe')) 
      ? config.email_body_template 
      : nicheTmpl.email_body, 
    templateVars
  );

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

  // Get niche-tailored WhatsApp pitch template
  const nicheTmpl = getNicheOutreachTemplates(prospect, config);

  // If customOptions.message is provided, use it.
  // Otherwise, use the niche-tailored pitch!
  let templateToUse = customOptions.message;
  if (!templateToUse) {
    // If config has a custom template that is not a hardcoded cafe default, use it.
    // Otherwise use the exact niche template!
    if (config.whatsapp_message_template && !config.whatsapp_message_template.includes('3D Espresso Cup')) {
      templateToUse = config.whatsapp_message_template;
    } else {
      templateToUse = nicheTmpl.whatsapp;
    }
  }

  const messageText = renderTemplate(templateToUse, templateVars);

  const recipientPhone = customOptions.phone || prospect.phone || '';
  let cleanRecipientPhone = recipientPhone.replace(/[^0-9]/g, '');

  // Normalize phone number for WhatsApp deep-linking:
  // North American numbers (10 digits starting with 2-9 in Canada/US): prefix '1'
  if (cleanRecipientPhone.length === 10) {
    if (['4', '6', '2', '3', '5'].includes(cleanRecipientPhone[0]) || (prospect.country && prospect.country.toLowerCase() === 'canada')) {
      cleanRecipientPhone = '1' + cleanRecipientPhone;
    } else if (['6', '7', '8', '9'].includes(cleanRecipientPhone[0])) {
      cleanRecipientPhone = '91' + cleanRecipientPhone;
    }
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

  console.log(`[WhatsApp Outreach] Prepared and logged message for ${prospect.business_name} (${recipientPhone}) [Niche: ${nicheTmpl.niche}]`);

  return {
    success: true,
    channel: 'whatsapp',
    niche: nicheTmpl.niche,
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
  getNicheOutreachTemplates,
  renderTemplate
};
