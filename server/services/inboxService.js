const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const whatsappProvider = require('./whatsappProvider');
const complianceService = require('./complianceService');

class InboxService {
  /**
   * Retrieves conversation list with enriched lead attributes
   */
  getConversations(filters = {}) {
    const convs = db.getConversations(filters);
    const leads = db.getLeads();

    return convs.map(conv => {
      const linkedLead = conv.lead_id ? leads.find(l => l.id === conv.lead_id) : null;
      const isWindowActive = complianceService.isWithin24HourServiceWindow(conv);
      return {
        ...conv,
        lead: linkedLead || null,
        is_service_window_active: isWindowActive
      };
    });
  }

  /**
   * Retrieves all messages for a specific conversation
   */
  getConversationMessages(conversationId) {
    const conv = db.getConversationById(conversationId);
    if (!conv) throw new Error(`Conversation ${conversationId} not found`);

    // Reset unread count when opened
    if (conv.unread_count > 0) {
      db.updateConversation(conversationId, { unread_count: 0 });
    }

    const messages = db.getMessages(conversationId);
    return {
      conversation: conv,
      messages
    };
  }

  /**
   * Sends an outgoing message from a human agent
   */
  async sendMessage(params) {
    const { conversationId, text, agentName = 'Devesh Kumar', templateName = null, mediaUrl = null } = params;
    const conv = db.getConversationById(conversationId);
    if (!conv) throw new Error(`Conversation ${conversationId} not found`);

    const isWindowActive = complianceService.isWithin24HourServiceWindow(conv);

    // If outside 24h window and no template specified, flag warning
    if (!isWindowActive && !templateName) {
      return {
        success: false,
        requires_template: true,
        error: 'The 24-hour customer service window has expired. WhatsApp policy requires sending an approved template to re-initiate conversation.'
      };
    }

    let sendResult;
    if (templateName) {
      sendResult = await whatsappProvider.sendTemplateMessage({
        phone: conv.phone,
        templateName,
        languageCode: 'en'
      });
    } else {
      sendResult = await whatsappProvider.sendSessionMessage({
        phone: conv.phone,
        message: text
      });
    }

    if (!sendResult.success) {
      return { success: false, error: sendResult.error || 'Failed to dispatch message' };
    }

    // Save message record
    const msgRecord = db.addMessage({
      conversation_id: conv.id,
      sender_type: 'agent',
      sender_name: agentName,
      message_type: templateName ? 'template' : (mediaUrl ? 'media' : 'text'),
      template_name: templateName,
      media_url: mediaUrl,
      content: text,
      status: sendResult.status || 'sent',
      external_id: sendResult.message_id
    });

    // Update conversation timestamp
    db.updateConversation(conv.id, {
      last_message: text,
      last_message_at: msgRecord.created_at
    });

    // Update lead last_outgoing_at
    if (conv.lead_id) {
      db.updateLead(conv.lead_id, {
        last_outgoing_at: msgRecord.created_at
      });
    }

    return {
      success: true,
      message: msgRecord
    };
  }

  /**
   * Ingests an incoming WhatsApp message (e.g. from Webhook)
   */
  async handleIncomingMessage(params) {
    const { fromPhone, text, senderName, externalId, timestamp } = params;
    const cleanDigits = String(fromPhone).replace(/[^0-9]/g, '');

    // 1. Check if message is an opt-out keyword (STOP, UNSUBSCRIBE, etc.)
    const isOptOut = complianceService.isOptOutMessage(text);

    // 2. Locate or create lead
    const leads = db.getLeads();
    let lead = leads.find(l => l.clean_phone && l.clean_phone.endsWith(cleanDigits));

    if (isOptOut) {
      complianceService.processOptOut(fromPhone, 'Texted STOP keyword', lead?.id);
    }

    // 3. Locate or create conversation
    let conv = db.getConversationByPhone(fromPhone);
    const windowExpiry = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

    if (!conv) {
      conv = db.saveConversation({
        lead_id: lead?.id || null,
        lead_name: lead?.business_name || senderName || `WhatsApp User (+${cleanDigits})`,
        phone: fromPhone,
        status: 'OPEN',
        unread_count: 1,
        last_message: text,
        last_message_at: timestamp || new Date().toISOString(),
        service_window_expires_at: windowExpiry
      });
    } else {
      db.updateConversation(conv.id, {
        unread_count: (conv.unread_count || 0) + 1,
        last_message: text,
        last_message_at: timestamp || new Date().toISOString(),
        service_window_expires_at: windowExpiry,
        status: conv.status === 'RESOLVED' ? 'OPEN' : conv.status
      });
    }

    // 4. Save incoming message
    const msg = db.addMessage({
      conversation_id: conv.id,
      sender_type: 'customer',
      sender_name: senderName || lead?.business_name || 'Customer',
      message_type: 'text',
      content: text,
      status: 'delivered',
      external_id: externalId
    });

    // 5. Update lead status if not already won or opted out
    if (lead && lead.status !== 'OPTED_OUT' && lead.status !== 'WON') {
      const newStatus = isOptOut ? 'OPTED_OUT' : 'REPLIED';
      db.updateLead(lead.id, {
        status: newStatus,
        last_incoming_at: new Date().toISOString()
      });
    }

    db.addAuditLog('WHATSAPP_MESSAGE_RECEIVED', `Received WhatsApp message from ${fromPhone}`, { text: text.substring(0, 60), is_opt_out: isOptOut });

    return {
      conversation_id: conv.id,
      message_id: msg.id,
      is_opt_out: isOptOut,
      lead_id: lead?.id || null
    };
  }

  /**
   * Adds an internal team note (never sent to customer)
   */
  addInternalNote(conversationId, noteText, authorName = 'Devesh Kumar') {
    const conv = db.getConversationById(conversationId);
    if (!conv) throw new Error(`Conversation ${conversationId} not found`);

    const note = {
      id: `note-${uuidv4().slice(0, 8)}`,
      author: authorName,
      text: noteText,
      created_at: new Date().toISOString()
    };

    const notes = Array.isArray(conv.internal_notes) ? conv.internal_notes : [];
    notes.unshift(note);

    db.updateConversation(conversationId, { internal_notes: notes });

    // Also mirror to lead's internal_notes if linked
    if (conv.lead_id) {
      const lead = db.getLeadById(conv.lead_id);
      if (lead) {
        const leadNotes = Array.isArray(lead.internal_notes) ? lead.internal_notes : [];
        leadNotes.unshift(note);
        db.updateLead(conv.lead_id, { internal_notes: leadNotes });
      }
    }

    db.addAuditLog('INTERNAL_NOTE_ADDED', `Added team note on conversation ${conversationId}`, { author: authorName });
    return note;
  }

  /**
   * Assigns conversation to a team member
   */
  assignConversation(conversationId, userId) {
    const user = db.getUserById(userId);
    if (!user) throw new Error(`User ${userId} not found`);

    const updated = db.updateConversation(conversationId, {
      assigned_to: user
    });

    if (updated.lead_id) {
      db.updateLead(updated.lead_id, { assigned_to: user });
    }

    db.addAuditLog('CONVERSATION_ASSIGNED', `Assigned conversation to ${user.name}`, { conversation_id: conversationId, user_id: userId });
    return updated;
  }

  /**
   * Updates conversation resolution status (OPEN, PENDING, RESOLVED)
   */
  updateConversationStatus(conversationId, status) {
    const updated = db.updateConversation(conversationId, { status });
    db.addAuditLog('CONVERSATION_STATUS_UPDATED', `Updated conversation status to ${status}`, { conversation_id: conversationId });
    return updated;
  }
}

module.exports = new InboxService();
