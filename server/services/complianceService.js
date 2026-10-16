const db = require('../db');

/**
 * WhatsApp Compliance & Consent Management Service
 * Strictly enforces Meta & WATI messaging policies, opt-outs, and customer suppression lists.
 */
class ComplianceService {
  /**
   * Keywords that trigger immediate automatic unsubscription & suppression
   */
  static OPT_OUT_KEYWORDS = [
    'stop',
    'unsubscribe',
    'opt out',
    'opt-out',
    'cancel',
    'remove',
    'delete my number',
    'do not message',
    'mat bhejo',
    'band karo',
    'msg mat karo',
    'message mat karo',
    'nahi chahiye',
    'spam'
  ];

  /**
   * Checks if incoming message content contains an opt-out intent
   */
  isOptOutMessage(text) {
    if (!text || typeof text !== 'string') return false;
    const clean = text.trim().toLowerCase();
    return ComplianceService.OPT_OUT_KEYWORDS.some(k => clean === k || clean.includes(k));
  }

  /**
   * Processes opt-out for a lead/phone number
   */
  processOptOut(phone, reason = 'Customer texted STOP keyword', leadId = null) {
    const cleanDigits = String(phone).replace(/[^0-9]/g, '');
    
    // 1. Add to suppression list
    const record = db.addToSuppressionList(phone, reason);

    // 2. Find and update associated lead
    const leads = db.getLeads();
    const targetLead = leadId 
      ? leads.find(l => l.id === leadId)
      : leads.find(l => l.clean_phone && l.clean_phone.endsWith(cleanDigits));

    if (targetLead) {
      const existingTags = targetLead.tags || [];
      const updatedTags = existingTags.filter(t => t !== 'Interested' && t !== 'Hot Lead');
      if (!updatedTags.includes('Do Not Contact')) {
        updatedTags.push('Do Not Contact');
      }

      db.updateLead(targetLead.id, {
        status: 'OPTED_OUT',
        consent_status: 'OPTED_OUT',
        tags: updatedTags,
        status_reason: reason
      });
    }

    db.addAuditLog('COMPLIANCE_OPTOUT_ENFORCED', `Enforced marketing suppression on ${phone}`, { reason, lead_id: targetLead?.id });

    return {
      success: true,
      phone: cleanDigits,
      suppression_record: record,
      lead_updated: targetLead?.id || null
    };
  }

  /**
   * Verifies if a recipient is eligible to receive marketing broadcasts
   */
  canSendMarketing(leadOrPhone) {
    const phone = typeof leadOrPhone === 'string' ? leadOrPhone : leadOrPhone.phone;
    if (!phone) return { eligible: false, reason: 'Missing phone number' };

    // 1. Suppression list check
    if (db.isPhoneSuppressed(phone)) {
      return { eligible: false, reason: 'Recipient is on Suppression / Opt-Out List' };
    }

    // 2. Lead consent check if lead object provided
    if (typeof leadOrPhone === 'object') {
      if (leadOrPhone.consent_status === 'OPTED_OUT' || leadOrPhone.status === 'OPTED_OUT') {
        return { eligible: false, reason: 'Lead status is marked as OPTED_OUT' };
      }
      if (Array.isArray(leadOrPhone.tags) && leadOrPhone.tags.includes('Do Not Contact')) {
        return { eligible: false, reason: 'Lead has Do Not Contact tag' };
      }
    }

    return { eligible: true };
  }

  /**
   * Checks if within 24-hour customer service window for free-form messaging
   */
  isWithin24HourServiceWindow(conversation) {
    if (!conversation || !conversation.service_window_expires_at) {
      return false;
    }
    const expiresAt = new Date(conversation.service_window_expires_at).getTime();
    return Date.now() < expiresAt;
  }
}

module.exports = new ComplianceService();
