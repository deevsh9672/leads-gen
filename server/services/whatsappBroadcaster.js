const axios = require('axios');
const crypto = require('crypto');
const db = require('../db');

const META_GRAPH_VERSION = 'v21.0';
const DEFAULT_VERIFY_TOKEN = 'siteseller_wa_webhook_verify_secret';

/**
 * Normalizes phone numbers to standard E.164 digits-only format required by WhatsApp Cloud API.
 * e.g. "+1 (416) 506-0804" -> "14165060804"
 * e.g. "+91 89206 08191" -> "918920608191"
 * e.g. "8920608191" with default country code "91" -> "918920608191"
 */
function normalizePhoneNumber(phone, defaultCountryCode = '1') {
  if (!phone || typeof phone !== 'string') return null;
  
  // Extract all digits
  let digits = phone.replace(/\D/g, '');
  if (!digits) return null;

  // If starts with 00, replace with nothing
  if (digits.startsWith('00')) {
    digits = digits.substring(2);
  }

  // If 10 digits without country code:
  if (digits.length === 10) {
    const cleanDefault = defaultCountryCode.replace(/\D/g, '') || '1';
    // If Indian 10-digit mobile starting with 6,7,8,9
    if (['6', '7', '8', '9'].includes(digits[0]) && (cleanDefault === '91' || cleanDefault === '')) {
      return `91${digits}`;
    }
    // North American 10-digit number
    return `${cleanDefault}${digits}`;
  }

  // If 11 digits starting with 1 (US/Canada)
  if (digits.length === 11 && digits.startsWith('1')) {
    return digits;
  }

  // If 12 digits starting with 91 (India)
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }

  // Minimum valid international number is 8 digits, max 15 digits
  if (digits.length >= 8 && digits.length <= 15) {
    return digits;
  }

  return null;
}

/**
 * Validates and formats a contact object
 */
function validateAndFormatContact(rawContact, defaultCountryCode = '1') {
  const normalizedPhone = normalizePhoneNumber(rawContact.phone || rawContact.mobile || rawContact.contact_number, defaultCountryCode);
  if (!normalizedPhone) {
    return { valid: false, error: 'Invalid or missing phone number' };
  }

  const name = (rawContact.name || rawContact.business_name || rawContact.contact_name || 'Contact').trim();
  const consent = (rawContact.consent_status || 'CONSENTED').toUpperCase();

  return {
    valid: true,
    contact: {
      id: rawContact.id || undefined,
      name,
      phone: `+${normalizedPhone}`,
      clean_phone: normalizedPhone,
      email: (rawContact.email || '').trim().toLowerCase(),
      company: (rawContact.company || rawContact.business_name || '').trim(),
      city: (rawContact.city || '').trim(),
      category: (rawContact.category || '').trim(),
      consent_status: ['CONSENTED', 'OPTED_OUT', 'UNCONFIRMED'].includes(consent) ? consent : 'CONSENTED',
      consent_source: rawContact.consent_source || 'Manual Entry / Import',
      consent_date: rawContact.consent_date || new Date().toISOString(),
      opt_out_date: consent === 'OPTED_OUT' ? (rawContact.opt_out_date || new Date().toISOString()) : null,
      tags: Array.isArray(rawContact.tags) ? rawContact.tags : (rawContact.tags ? [rawContact.tags] : []),
      custom_fields: rawContact.custom_fields || {}
    }
  };
}

/**
 * Retrieves the active WhatsApp Cloud API credentials securely from env / config.
 * Never exposed to frontend!
 */
function getWhatsAppCredentials() {
  const rawConfig = typeof db.getRawConfig === 'function' ? db.getRawConfig() : db.getConfig();
  const token = rawConfig.whatsapp_access_token || process.env.WHATSAPP_ACCESS_TOKEN || '';
  const phoneNumberId = rawConfig.whatsapp_phone_number_id || process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  const businessAccountId = rawConfig.whatsapp_business_account_id || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';
  const webhookVerifyToken = rawConfig.whatsapp_webhook_verify_token || process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || DEFAULT_VERIFY_TOKEN;
  const appSecret = rawConfig.whatsapp_app_secret || process.env.WHATSAPP_APP_SECRET || '';

  return {
    isConfigured: Boolean(token && phoneNumberId),
    token,
    phoneNumberId,
    businessAccountId,
    webhookVerifyToken,
    appSecret,
    apiVersion: META_GRAPH_VERSION
  };
}

/**
 * Tests live connection to Meta WhatsApp Cloud API using current or provided credentials.
 */
async function testWhatsAppConnection(customCreds = null) {
  const creds = customCreds || getWhatsAppCredentials();
  const { token, phoneNumberId, apiVersion } = creds;

  if (!token || !phoneNumberId) {
    return {
      connected: false,
      status: 'UNCONFIGURED',
      error_message: 'WhatsApp Access Token or Phone Number ID is missing.'
    };
  }

  try {
    const res = await axios.get(`https://graph.facebook.com/${apiVersion}/${phoneNumberId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    });

    const data = res.data || {};
    return {
      connected: true,
      status: 'ACTIVE',
      phone_id: phoneNumberId,
      verified_name: data.verified_name || 'Verified Business',
      display_phone_number: data.display_phone_number || '',
      quality_rating: data.quality_rating || 'GREEN',
      code_verification_status: data.code_verification_status || 'VERIFIED'
    };
  } catch (err) {
    const errDetails = err.response?.data?.error || {};
    const code = errDetails.code || err.response?.status;
    const subcode = errDetails.error_subcode;
    const isExpired = code === 190 || subcode === 463;

    return {
      connected: false,
      status: isExpired ? 'EXPIRED' : 'ERROR',
      error_code: code,
      error_subcode: subcode,
      error_message: isExpired
        ? 'Meta WhatsApp Access Token has expired (OAuth 190). Please generate a new token from developers.facebook.com.'
        : (errDetails.message || err.message),
      raw_error: errDetails
    };
  }
}

/**
 * Fetches approved WhatsApp message templates from Meta Graph API
 */
async function fetchWhatsAppTemplates() {
  const { isConfigured, token, businessAccountId, apiVersion } = getWhatsAppCredentials();
  
  if (!isConfigured || !businessAccountId) {
    // Return standard templates catalog for offline/sandbox configuration
    return [
      {
        name: 'hello_world',
        language: 'en_US',
        status: 'APPROVED',
        category: 'UTILITY',
        components: [
          { type: 'BODY', text: 'Welcome and congratulations! This message confirms that your WhatsApp Business account is active.' }
        ]
      },
      {
        name: 'website_demo_announcement',
        language: 'en_US',
        status: 'APPROVED',
        category: 'MARKETING',
        components: [
          { type: 'HEADER', format: 'IMAGE' },
          { type: 'BODY', text: 'Hello {{1}}, we have built a custom modern demo website for {{2}} in {{3}}. View it live here: {{4}}.' },
          { type: 'FOOTER', text: 'Reply STOP to unsubscribe' }
        ]
      },
      {
        name: 'appointment_reminder',
        language: 'en_US',
        status: 'APPROVED',
        category: 'UTILITY',
        components: [
          { type: 'BODY', text: 'Hi {{1}}, this is a friendly reminder of your upcoming appointment with {{2}} on {{3}}.' },
          { type: 'FOOTER', text: 'Reply STOP to cancel' }
        ]
      }
    ];
  }

  try {
    const url = `https://graph.facebook.com/${apiVersion}/${businessAccountId}/message_templates?fields=name,status,category,language,components&limit=100`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 10000
    });

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map(tpl => ({
        name: tpl.name,
        language: tpl.language,
        status: tpl.status,
        category: tpl.category,
        components: tpl.components || []
      }));
    }
    return [];
  } catch (err) {
    console.warn('[WhatsApp Broadcaster] Warning fetching live templates:', err.response?.data?.error?.message || err.message);
    // Return fallback catalog
    return [
      {
        name: 'hello_world',
        language: 'en_US',
        status: 'APPROVED',
        category: 'UTILITY',
        components: [
          { type: 'BODY', text: 'Welcome and congratulations! This message confirms that your WhatsApp Business account is active.' }
        ]
      }
    ];
  }
}

/**
 * Builds the official WhatsApp Cloud API payload
 */
function buildWhatsAppPayload(recipient, campaign) {
  const cleanTo = recipient.phone.replace(/\D/g, '');

  // 1. Template Message
  if (campaign.type === 'template' && campaign.template_name) {
    const components = [];

    // Media header component
    if (campaign.media_url && campaign.media_type) {
      const mediaObject = {};
      mediaObject[campaign.media_type] = { link: campaign.media_url };
      components.push({
        type: 'header',
        parameters: [mediaObject]
      });
    }

    // Body variable parameters
    const bodyParams = [];
    if (Array.isArray(campaign.template_parameters) && campaign.template_parameters.length > 0) {
      for (const param of campaign.template_parameters) {
        let value = param;
        // Interpolate contact variables
        value = value.replace(/\{\{name\}\}/gi, recipient.name || 'there');
        value = value.replace(/\{\{business_name\}\}/gi, recipient.company || recipient.name || 'your business');
        value = value.replace(/\{\{city\}\}/gi, recipient.city || 'your city');
        value = value.replace(/\{\{category\}\}/gi, recipient.category || 'services');
        value = value.replace(/\{\{demo_url\}\}/gi, recipient.demo_url || campaign.demo_url || 'https://siteseller.agent');
        
        bodyParams.push({
          type: 'text',
          text: value
        });
      }
    } else {
      // Default standard variables if body has parameters
      bodyParams.push({ type: 'text', text: recipient.name || 'Client' });
      if (recipient.company) bodyParams.push({ type: 'text', text: recipient.company });
      if (recipient.city) bodyParams.push({ type: 'text', text: recipient.city });
    }

    if (bodyParams.length > 0) {
      components.push({
        type: 'body',
        parameters: bodyParams
      });
    }

    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanTo,
      type: 'template',
      template: {
        name: campaign.template_name,
        language: {
          code: campaign.template_language || 'en_US'
        },
        components: components.length > 0 ? components : undefined
      }
    };
  }

  // 2. Direct Media Message
  if (campaign.media_url && campaign.media_type) {
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanTo,
      type: campaign.media_type
    };
    payload[campaign.media_type] = {
      link: campaign.media_url,
      caption: campaign.message_text ? interpolateText(campaign.message_text, recipient) : undefined
    };
    return payload;
  }

  // 3. Direct Text Message (Customer Service / Session Window)
  const renderedBody = interpolateText(campaign.message_text || 'Hello from our team!', recipient);
  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanTo,
    type: 'text',
    text: {
      preview_url: true,
      body: renderedBody
    }
  };
}

function interpolateText(template, recipient) {
  if (!template) return '';
  return template
    .replace(/\{\{name\}\}/gi, recipient.name || 'there')
    .replace(/\{\{business_name\}\}/gi, recipient.company || recipient.name || 'your business')
    .replace(/\{\{city\}\}/gi, recipient.city || 'your city')
    .replace(/\{\{category\}\}/gi, recipient.category || 'services')
    .replace(/\{\{demo_url\}\}/gi, recipient.demo_url || 'https://siteseller.agent');
}

/**
 * Dispatches a single message via WhatsApp Cloud API with retry on 429/5xx
 */
async function dispatchWhatsAppMessage(recipient, campaign, creds, maxRetries = 2) {
  const { token, phoneNumberId, apiVersion } = creds;
  const endpoint = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
  const payload = buildWhatsAppPayload(recipient, campaign);

  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    attempt++;
    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      const messageData = response.data?.messages?.[0];
      const wamid = messageData?.id;

      if (!wamid) {
        throw new Error('No WhatsApp message ID returned in API response');
      }

      // API accepted the message for delivery!
      // Status is marked as 'ACCEPTED' or 'SENT' (not DELIVERED yet until webhook confirms)
      return {
        success: true,
        status: 'ACCEPTED',
        wamid,
        sent_at: new Date().toISOString()
      };
    } catch (err) {
      lastError = err;
      const statusCode = err.response?.status;
      const errDetails = err.response?.data?.error || {};
      const errorCode = errDetails.code;
      const errorSubcode = errDetails.error_subcode;
      const errorMessage = errDetails.message || err.message;

      // Rate limit or server error: eligible for retry with exponential backoff
      const isRetryable = statusCode === 429 || statusCode >= 500 || errorCode === 130429 || errorCode === 131056;
      if (isRetryable && attempt <= maxRetries) {
        const delayMs = Math.pow(2, attempt) * 500;
        console.warn(`[WhatsApp Broadcaster] Temporary API error (${statusCode}/${errorCode}). Retrying attempt ${attempt} in ${delayMs}ms...`);
        await new Promise(r => setTimeout(r, delayMs));
        continue;
      }

      // Permanent failure (e.g. 131026 not on WhatsApp, 131047 session window closed, 131051 template not found)
      return {
        success: false,
        status: 'FAILED',
        error_code: errorCode || statusCode || 'API_ERROR',
        error_message: errorMessage,
        error_details: errDetails
      };
    }
  }

  return {
    success: false,
    status: 'FAILED',
    error_code: 'MAX_RETRIES_EXCEEDED',
    error_message: lastError ? lastError.message : 'Unknown dispatch error'
  };
}

// In-memory campaign queue locks to prevent concurrent duplicate executions
const activeCampaignJobs = new Map();

/**
 * Executes a broadcast campaign through a controlled rate-paced background queue.
 */
async function executeBroadcastCampaign(campaignId) {
  const campaign = db.getWhatsAppCampaignById(campaignId);
  if (!campaign) {
    throw new Error(`Campaign ${campaignId} not found`);
  }

  // Prevent duplicate execution
  if (activeCampaignJobs.has(campaignId) || campaign.status === 'SENDING') {
    return { status: 'already_running', campaign: db.getWhatsAppCampaignById(campaignId) };
  }

  const creds = getWhatsAppCredentials();
  if (!creds.isConfigured) {
    db.updateWhatsAppCampaign(campaignId, {
      status: 'FAILED',
      failure_reason: 'WhatsApp Business Cloud API credentials not configured. Please provide Phone Number ID and Access Token.'
    });
    throw new Error('WhatsApp API credentials not configured on server.');
  }

  // Pre-flight check: verify token is active and not expired before starting queue
  const conn = await testWhatsAppConnection(creds);
  if (!conn.connected) {
    const errorMsg = conn.status === 'EXPIRED' 
      ? 'Meta WhatsApp Access Token has expired (OAuth 190). Please generate a new token from developers.facebook.com and update it in the API & Webhooks tab.'
      : `Meta API Connection Failed: ${conn.error_message || 'Access token invalid'}`;

    db.updateWhatsAppCampaign(campaignId, {
      status: 'FAILED',
      failure_reason: errorMsg
    });

    const camp = db.getWhatsAppCampaignById(campaignId);
    if (camp && Array.isArray(camp.recipients)) {
      camp.recipients.forEach(r => {
        if (r.status === 'QUEUED') {
          db.updateRecipientStatus(r.id, 'FAILED', {
            error_code: conn.error_code || 'AUTH_EXPIRED',
            error_message: errorMsg
          });
        }
      });
    }
    throw new Error(errorMsg);
  }

  // Set running lock
  activeCampaignJobs.set(campaignId, { isCancelled: false, isPaused: false });

  // Update campaign status
  db.updateWhatsAppCampaign(campaignId, {
    status: 'SENDING',
    started_at: new Date().toISOString()
  });

  // Run queue asynchronously so endpoint returns immediately
  (async () => {
    try {
      console.log(`[WhatsApp Broadcast] Starting campaign execution '${campaign.name}' (${campaignId}) with ${campaign.recipients.length} recipients...`);

      const recipients = campaign.recipients || [];
      let acceptedCount = 0;
      let failedCount = 0;

      for (let i = 0; i < recipients.length; i++) {
        const r = recipients[i];

        // Check if job was paused or cancelled
        const jobState = activeCampaignJobs.get(campaignId);
        if (!jobState || jobState.isCancelled) {
          console.log(`[WhatsApp Broadcast] Campaign ${campaignId} was cancelled.`);
          db.updateWhatsAppCampaign(campaignId, { status: 'PAUSED' });
          break;
        }

        // Skip already processed recipients (idempotent resume support)
        if (['ACCEPTED', 'SENT', 'DELIVERED', 'READ'].includes(r.status)) {
          continue;
        }

        // Exclude opted-out contacts
        const contact = db.getWhatsAppContacts().find(c => c.clean_phone === r.phone.replace(/\D/g, ''));
        if (contact && contact.consent_status === 'OPTED_OUT') {
          console.log(`[WhatsApp Broadcast] Skipping recipient ${r.phone} because contact is OPTED_OUT.`);
          db.updateRecipientStatus(r.id, 'FAILED', {
            error_code: 'OPTED_OUT',
            error_message: 'Recipient has unsubscribed or opted out from WhatsApp campaigns'
          });
          failedCount++;
          continue;
        }

        // Pacing delay between requests (150ms = ~6-7 requests/sec, well within Cloud API limits)
        if (i > 0) {
          await new Promise(res => setTimeout(res, 150));
        }

        // Dispatch via Cloud API
        const result = await dispatchWhatsAppMessage(r, campaign, creds);

        if (result.success) {
          acceptedCount++;
          db.updateRecipientStatus(r.id, result.status, {
            wamid: result.wamid,
            sent_at: result.sent_at
          });
          failedCount++;
          db.updateRecipientStatus(r.id, 'FAILED', {
            error_code: result.error_code,
            error_message: result.error_message
          });

          // If authentication expired, halt the queue instead of continuing to fail all contacts
          if (result.error_code === 190 || result.error_code === 401 || result.error_subcode === 463) {
            console.error(`[WhatsApp Broadcast] Meta access token expired. Halting remaining queue for campaign ${campaignId}.`);
            db.updateWhatsAppCampaign(campaignId, {
              status: 'FAILED',
              failure_reason: 'Meta WhatsApp Access Token has expired. Please update token in API & Webhooks tab.'
            });
            break;
          }
        }
      }

      // Check final state
      const finalCampaign = db.getWhatsAppCampaignById(campaignId);
      const remainingQueued = finalCampaign.recipients.filter(r => r.status === 'QUEUED').length;

      const finalStatus = remainingQueued === 0 ? 'COMPLETED' : 'PAUSED';
      db.updateWhatsAppCampaign(campaignId, {
        status: finalStatus,
        completed_at: finalStatus === 'COMPLETED' ? new Date().toISOString() : null
      });

      console.log(`[WhatsApp Broadcast] Campaign ${campaignId} finished. Status: ${finalStatus}. Accepted: ${acceptedCount}, Failed: ${failedCount}.`);
    } catch (err) {
      console.error(`[WhatsApp Broadcast] Fatal error in campaign ${campaignId}:`, err);
      db.updateWhatsAppCampaign(campaignId, {
        status: 'FAILED',
        failure_reason: err.message
      });
    } finally {
      activeCampaignJobs.delete(campaignId);
    }
  })();

  return { status: 'started', campaign: db.getWhatsAppCampaignById(campaignId) };
}

/**
 * Pauses an active sending campaign
 */
function pauseBroadcastCampaign(campaignId) {
  const job = activeCampaignJobs.get(campaignId);
  if (job) {
    job.isCancelled = true;
    activeCampaignJobs.delete(campaignId);
  }
  const updated = db.updateWhatsAppCampaign(campaignId, { status: 'PAUSED' });
  return updated;
}

/**
 * Verifies webhook payload authenticity using Meta's HMAC-SHA256 signature
 */
function verifyWebhookSignature(payloadBuffer, signatureHeader, appSecret) {
  if (!appSecret) return true; // If no app secret configured, bypass
  if (!signatureHeader) return false;

  const parts = signatureHeader.split('sha256=');
  if (parts.length !== 2) return false;
  const signature = parts[1];

  const expectedSignature = crypto
    .createHmac('sha256', appSecret)
    .update(payloadBuffer)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
}

/**
 * Processes incoming WhatsApp Cloud API webhook events idempotently
 */
async function processWebhookEvent(body) {
  if (!body || body.object !== 'whatsapp_business_account') {
    return { processed: false, reason: 'Not a whatsapp_business_account event' };
  }

  // Record audit log
  db.addWebhookLog({
    event_type: 'whatsapp_webhook',
    raw_payload: body,
    received_at: new Date().toISOString()
  });

  const entries = body.entry || [];
  let updatedStatuses = 0;
  let optOutsHandled = 0;

  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      if (change.field !== 'messages') continue;
      const value = change.value || {};

      // 1. Delivery & Read Status Updates
      const statuses = value.statuses || [];
      for (const st of statuses) {
        const wamid = st.id;
        const statusStr = (st.status || '').toUpperCase(); // 'SENT', 'DELIVERED', 'READ', 'FAILED'
        const recipientPhone = st.recipient_id;
        const errors = st.errors;

        if (wamid) {
          const recipientRecord = db.findRecipientByWamid(wamid);
          if (recipientRecord) {
            const updates = {
              status: statusStr
            };
            if (statusStr === 'DELIVERED') updates.delivered_at = new Date(parseInt(st.timestamp) * 1000).toISOString();
            if (statusStr === 'READ') updates.read_at = new Date(parseInt(st.timestamp) * 1000).toISOString();
            if (statusStr === 'FAILED' && errors && errors.length > 0) {
              updates.error_code = errors[0].code;
              updates.error_message = errors[0].message || errors[0].title;
            }

            db.updateRecipientStatus(recipientRecord.id, statusStr, updates);
            updatedStatuses++;
            console.log(`[WhatsApp Webhook] Updated message ${wamid} to status '${statusStr}'.`);
          }
        }
      }

      // 2. Incoming Messages (Handle Unsubscribe & Opt-out keywords)
      const messages = value.messages || [];
      for (const msg of messages) {
        const fromPhone = msg.from;
        const textBody = (msg.text?.body || '').trim().toLowerCase();

        // Check if user requested unsubscribe
        const optOutKeywords = ['stop', 'unsubscribe', 'opt out', 'optout', 'cancel', 'end'];
        if (optOutKeywords.some(kw => textBody === kw || textBody.startsWith(`${kw} `))) {
          console.log(`[WhatsApp Webhook] Contact +${fromPhone} requested OPT-OUT via keyword '${textBody}'.`);
          db.optOutWhatsAppContactByPhone(fromPhone, `User sent opt-out keyword: ${textBody}`);
          optOutsHandled++;
        }
      }
    }
  }

  return {
    processed: true,
    updated_statuses_count: updatedStatuses,
    opt_outs_handled: optOutsHandled
  };
}

module.exports = {
  normalizePhoneNumber,
  validateAndFormatContact,
  getWhatsAppCredentials,
  testWhatsAppConnection,
  fetchWhatsAppTemplates,
  buildWhatsAppPayload,
  dispatchWhatsAppMessage,
  executeBroadcastCampaign,
  pauseBroadcastCampaign,
  verifyWebhookSignature,
  processWebhookEvent
};
