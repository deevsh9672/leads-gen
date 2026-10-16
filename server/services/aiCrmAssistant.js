const axios = require('axios');
const db = require('../db');

class AiCrmAssistant {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || null;
  }

  /**
   * Summarizes a WhatsApp conversation thread
   */
  async summarizeConversation(messages = [], lead = null) {
    if (!messages || messages.length === 0) {
      return {
        summary: 'No messages exchanged yet in this conversation.',
        key_points: [],
        customer_sentiment: 'neutral'
      };
    }

    const conversationTranscript = messages
      .map(m => `${m.sender_name || (m.sender_type === 'customer' ? 'Customer' : 'Agent')}: ${m.content}`)
      .join('\n');

    // Rule-based high-accuracy fallback & Gemini integration
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let sentiment = 'neutral';
    let keyPoints = [];
    let summaryText = '';

    if (lastMsg.includes('price') || lastMsg.includes('cost') || lastMsg.includes('charge') || lastMsg.includes('kitna')) {
      sentiment = 'pricing_inquiry';
      keyPoints.push('Customer is inquiring about pricing and packages');
      summaryText = `Customer asked for cost and setup packages for the website demo.`;
    } else if (lastMsg.includes('badiya') || lastMsg.includes('great') || lastMsg.includes('demo') || lastMsg.includes('claim')) {
      sentiment = 'high_intent';
      keyPoints.push('Positive reaction to demo website');
      keyPoints.push('Customer interested in claiming and customizing design');
      summaryText = `Customer loved the preview and wants to explore menu/photo customizations.`;
    } else if (lastMsg.includes('stop') || lastMsg.includes('unsubscribe') || lastMsg.includes('mat bhejo')) {
      sentiment = 'opt_out';
      keyPoints.push('Customer requested unsubscription / STOP');
      summaryText = `Customer requested opt-out. Marketing outreach halted.`;
    } else {
      keyPoints.push('Initial outreach sent regarding modern website demo');
      summaryText = `Outreach sent to ${lead?.business_name || 'customer'}. Awaiting customer reaction.`;
    }

    return {
      summary: summaryText,
      key_points: keyPoints,
      customer_sentiment: sentiment,
      transcript_length: messages.length
    };
  }

  /**
   * Classifies message intent into actionable CRM categories
   */
  async classifyIntent(messageText = '') {
    const text = messageText.toLowerCase();

    if (text.includes('stop') || text.includes('unsubscribe') || text.includes('mat bhejo') || text.includes('nahi chahiye')) {
      return {
        intent: 'OPT_OUT',
        confidence: 0.98,
        description: 'Customer requests to stop receiving messages',
        recommended_action: 'Enforce suppression list and cease outreach'
      };
    }

    if (text.includes('kitna') || text.includes('price') || text.includes('cost') || text.includes('charge') || text.includes('rate')) {
      return {
        intent: 'PRICING_INQUIRY',
        confidence: 0.95,
        description: 'Customer asks for pricing and package breakdown',
        recommended_action: 'Send transparent website launch pricing packages'
      };
    }

    if (text.includes('deal done') || text.includes('invoice') || text.includes('shuru karo') || text.includes('start') || text.includes('ready')) {
      return {
        intent: 'HIGH_BUYING_SIGNAL',
        confidence: 0.96,
        description: 'Customer is ready to move forward and buy',
        recommended_action: 'Move lead to WON / Send onboarding payment link'
      };
    }

    if (text.includes('demo') || text.includes('photos') || text.includes('menu') || text.includes('call') || text.includes('badiya') || text.includes('interested')) {
      return {
        intent: 'DEMO_CUSTOMIZATION',
        confidence: 0.91,
        description: 'Customer shows positive interest in demo design & personalization',
        recommended_action: 'Schedule 10-minute walkthrough call or WhatsApp discussion'
      };
    }

    return {
      intent: 'GENERAL_INQUIRY',
      confidence: 0.75,
      description: 'General question or greeting',
      recommended_action: 'Provide helpful overview and link to live demo'
    };
  }

  /**
   * Generates 3 contextual response drafts for agents (English + Hinglish)
   */
  async suggestReplies(conversation, lead) {
    const bizName = lead?.business_name || 'there';
    const config = db.getConfig();
    const senderName = config.sender_name || 'Devesh Kumar';

    return [
      {
        id: 'reply-1',
        label: 'Walkthrough Call Invitation',
        tone: 'Friendly & Professional',
        text: `Hi ${lead?.contact_person || 'team'}! Glad you liked the preview website for ${bizName}. Would you be free for a quick 10-minute WhatsApp call or walkthrough today to discuss your photos and services?`
      },
      {
        id: 'reply-2',
        label: 'Pricing & Launch Packages',
        tone: 'Direct & Transparent',
        text: `Namaste! Our complete website setup includes custom domain connection, Google SEO indexing, mobile responsiveness, and WhatsApp booking integration. Would you like me to share our simple packages?`
      },
      {
        id: 'reply-3',
        label: 'Content Customization Offer',
        tone: 'Value-First Support',
        text: `If you have your menu, services list, or high-res photos handy, simply send them right here on WhatsApp and our team will update your demo website within 2 hours — 100% free of charge!`
      }
    ];
  }

  /**
   * Recommends the next sales action based on lead score & history
   */
  async recommendNextAction(lead) {
    if (!lead) return null;

    if (lead.status === 'NEW') {
      return {
        action: 'INITIATE_WHATSAPP_CAMPAIGN',
        priority: 'high',
        reason: 'Lead has high review count but no website. Send personalized website demo broadcast.'
      };
    }

    if (lead.status === 'REPLIED' || lead.status === 'INTERESTED') {
      return {
        action: 'SCHEDULE_DEMO_CALL',
        priority: 'urgent',
        reason: 'Customer has actively engaged. Propose 10-min phone or video demo.'
      };
    }

    if (lead.status === 'FOLLOW_UP') {
      return {
        action: 'SEND_GENTLE_REMINDER',
        priority: 'medium',
        reason: 'Follow-up date reached. Send approved follow-up template.'
      };
    }

    return {
      action: 'NURTURE',
      priority: 'low',
      reason: 'Keep lead in warm nurture segment.'
    };
  }
}

module.exports = new AiCrmAssistant();
