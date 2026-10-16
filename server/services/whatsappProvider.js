const axios = require('axios');
const crypto = require('crypto');
const db = require('../db');

/**
 * WhatsApp Provider Abstraction Layer
 * Supports WATI Official API, Meta WhatsApp Business Platform Cloud API, and Developer Sandbox Simulator.
 */
class WhatsAppProvider {
  /**
   * Dispatches an approved WhatsApp template message
   */
  async sendTemplateMessage(params) {
    const config = db.getProviderConfig();
    const activeProvider = config.active_provider || 'sandbox';

    if (activeProvider === 'wati') {
      return this._sendWatiTemplate(params, config.wati);
    } else if (activeProvider === 'meta') {
      return this._sendMetaTemplate(params, config.meta);
    } else {
      return this._sendSandboxTemplate(params, config.sandbox);
    }
  }

  /**
   * Dispatches a free-form session message (only within 24h customer window)
   */
  async sendSessionMessage(params) {
    const config = db.getProviderConfig();
    const activeProvider = config.active_provider || 'sandbox';

    if (activeProvider === 'wati') {
      return this._sendWatiSession(params, config.wati);
    } else if (activeProvider === 'meta') {
      return this._sendMetaSession(params, config.meta);
    } else {
      return this._sendSandboxSession(params, config.sandbox);
    }
  }

  /**
   * Fetches approved message templates from the active provider
   */
  async fetchTemplates() {
    const config = db.getProviderConfig();
    const activeProvider = config.active_provider || 'sandbox';

    if (activeProvider === 'wati' && config.wati.access_token) {
      try {
        const url = `${config.wati.endpoint_url.replace(/\/+$/, '')}/api/v1/getMessageTemplates`;
        const res = await axios.get(url, {
          headers: { 'Authorization': `Bearer ${config.wati.access_token}` },
          timeout: 10000
        });
        if (res.data?.messageTemplates) {
          const mapped = res.data.messageTemplates.map(t => ({
            id: t.id || t.templateName,
            name: t.templateName,
            category: t.category || 'MARKETING',
            language: t.language || 'en',
            status: t.status || 'APPROVED',
            provider: 'wati',
            body: t.body,
            buttons: t.buttons || []
          }));
          db.saveTemplates(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('[WhatsAppProvider: WATI] Template sync failed:', err.message);
      }
    } else if (activeProvider === 'meta' && config.meta.access_token && config.meta.waba_id) {
      try {
        const url = `https://graph.facebook.com/v20.0/${config.meta.waba_id}/message_templates`;
        const res = await axios.get(url, {
          headers: { 'Authorization': `Bearer ${config.meta.access_token}` },
          timeout: 10000
        });
        if (res.data?.data) {
          const mapped = res.data.data.map(t => ({
            id: t.id,
            name: t.name,
            category: t.category,
            language: t.language,
            status: t.status,
            provider: 'meta',
            body: t.components?.find(c => c.type === 'BODY')?.text || '',
            buttons: t.components?.find(c => c.type === 'BUTTONS')?.buttons || []
          }));
          db.saveTemplates(mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('[WhatsAppProvider: Meta] Template sync failed:', err.message);
      }
    }

    // Return stored templates if live fetch is offline or in sandbox
    return db.getTemplates();
  }

  /**
   * Tests connection health and diagnostic ping
   */
  async testConnection() {
    const config = db.getProviderConfig();
    const provider = config.active_provider || 'sandbox';

    if (provider === 'sandbox') {
      return {
        success: true,
        provider: 'sandbox',
        status: 'READY',
        message: 'Sandbox simulator active. Real-time delivery, read receipts, and replies ready.'
      };
    }

    if (provider === 'wati') {
      if (!config.wati.endpoint_url || !config.wati.access_token) {
        return { success: false, provider: 'wati', error: 'Missing WATI Endpoint URL or Access Token' };
      }
      try {
        const url = `${config.wati.endpoint_url.replace(/\/+$/, '')}/api/v1/getTemplates`;
        await axios.get(url, {
          headers: { 'Authorization': `Bearer ${config.wati.access_token}` },
          timeout: 8000
        });
        return { success: true, provider: 'wati', status: 'CONNECTED', message: 'Successfully connected to WATI API' };
      } catch (err) {
        return { success: false, provider: 'wati', error: err.response?.data?.message || err.message };
      }
    }

    if (provider === 'meta') {
      if (!config.meta.phone_number_id || !config.meta.access_token) {
        return { success: false, provider: 'meta', error: 'Missing Meta Phone Number ID or Access Token' };
      }
      try {
        const url = `https://graph.facebook.com/v20.0/${config.meta.phone_number_id}`;
        const res = await axios.get(url, {
          headers: { 'Authorization': `Bearer ${config.meta.access_token}` },
          timeout: 8000
        });
        return { 
          success: true, 
          provider: 'meta', 
          status: 'CONNECTED', 
          verified_name: res.data?.verified_name || res.data?.display_phone_number || 'Meta WABA Verified' 
        };
      } catch (err) {
        return { success: false, provider: 'meta', error: err.response?.data?.error?.message || err.message };
      }
    }

    return { success: false, error: 'Unknown provider' };
  }

  // --- Private Provider Implementations ---

  async _sendWatiTemplate(params, watiConfig) {
    const { phone, templateName, customParams = [] } = params;
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const endpoint = `${watiConfig.endpoint_url.replace(/\/+$/, '')}/api/v1/sendTemplateMessage?whatsappNumber=${cleanPhone}`;
    const payload = {
      template_name: templateName,
      broadcast_name: params.broadcastName || 'SiteSeller_Broadcast',
      parameters: customParams.map((val, idx) => ({ name: String(idx + 1), value: String(val) }))
    };

    try {
      const res = await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${watiConfig.access_token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      return {
        success: true,
        provider: 'wati',
        message_id: res.data?.messageId || `wati-${Date.now()}`,
        status: 'submitted',
        details: res.data
      };
    } catch (err) {
      console.error('[WhatsAppProvider: WATI Error]:', err.response?.data || err.message);
      return {
        success: false,
        provider: 'wati',
        status: 'failed',
        error: err.response?.data?.message || err.message
      };
    }
  }

  async _sendWatiSession(params, watiConfig) {
    const { phone, message } = params;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const endpoint = `${watiConfig.endpoint_url.replace(/\/+$/, '')}/api/v1/sendSessionMessage/${cleanPhone}?messageText=${encodeURIComponent(message)}`;

    try {
      const res = await axios.post(endpoint, {}, {
        headers: { 'Authorization': `Bearer ${watiConfig.access_token}` },
        timeout: 10000
      });
      return { success: true, provider: 'wati', message_id: res.data?.messageId || `wati-${Date.now()}`, status: 'sent' };
    } catch (err) {
      return { success: false, provider: 'wati', error: err.response?.data?.message || err.message };
    }
  }

  async _sendMetaTemplate(params, metaConfig) {
    const { phone, templateName, languageCode = 'en', components = [] } = params;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const endpoint = `https://graph.facebook.com/v20.0/${metaConfig.phone_number_id}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components
      }
    };

    try {
      const res = await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${metaConfig.access_token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      const msgId = res.data?.messages?.[0]?.id || `wamid.${Date.now()}`;
      return {
        success: true,
        provider: 'meta',
        message_id: msgId,
        status: 'submitted',
        details: res.data
      };
    } catch (err) {
      console.error('[WhatsAppProvider: Meta Error]:', err.response?.data || err.message);
      return {
        success: false,
        provider: 'meta',
        status: 'failed',
        error: err.response?.data?.error?.message || err.message
      };
    }
  }

  async _sendMetaSession(params, metaConfig) {
    const { phone, message } = params;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const endpoint = `https://graph.facebook.com/v20.0/${metaConfig.phone_number_id}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: { body: message }
    };

    try {
      const res = await axios.post(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${metaConfig.access_token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      return { success: true, provider: 'meta', message_id: res.data?.messages?.[0]?.id, status: 'sent' };
    } catch (err) {
      return { success: false, provider: 'meta', error: err.response?.data?.error?.message || err.message };
    }
  }

  async _sendSandboxTemplate(params, sandboxConfig) {
    // Realistic developer simulation with zero cost
    const delay = sandboxConfig?.simulate_delivery_speed_ms || 200;
    if (delay > 0) {
      await new Promise(r => setTimeout(r, delay));
    }

    const msgId = `sbox_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      provider: 'sandbox',
      message_id: msgId,
      status: 'delivered',
      simulated: true,
      recipient: params.phone
    };
  }

  async _sendSandboxSession(params, sandboxConfig) {
    const msgId = `sbox_sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      provider: 'sandbox',
      message_id: msgId,
      status: 'delivered',
      simulated: true,
      recipient: params.phone
    };
  }

  /**
   * Meta Webhook Signature Verification
   */
  verifyMetaSignature(rawBody, signature, appSecret) {
    if (!signature || !appSecret) return false;
    const [algorithm, hash] = signature.split('=');
    if (algorithm !== 'sha256') return false;
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(rawBody, 'utf-8');
    const expected = hmac.digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected));
  }
}

module.exports = new WhatsAppProvider();
