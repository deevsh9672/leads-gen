const db = require('../db');

function analyzeSentiment(replyText = '') {
  const lower = replyText.toLowerCase();

  // Opt-out detection (English + Hinglish)
  if (
    lower.includes('unsubscribe') ||
    lower.includes('stop') ||
    lower.includes('remove me') ||
    lower.includes('opt out') ||
    lower.includes('do not email') ||
    lower.includes('not interested') ||
    lower.includes('mat bhejo') ||
    lower.includes('msg mat karo') ||
    lower.includes('message mat karo') ||
    lower.includes('nahi chahiye') ||
    lower.includes('band karo')
  ) {
    return 'opt-out';
  }

  // Client conversion detection (English + Hinglish)
  if (
    lower.includes('lets do it') ||
    lower.includes("let's do it") ||
    lower.includes('send invoice') ||
    lower.includes('ready to sign') ||
    lower.includes('we want to buy') ||
    lower.includes('take our money') ||
    lower.includes('launch it') ||
    lower.includes('deal done') ||
    lower.includes('shuru karo') ||
    lower.includes('kaam shuru karo') ||
    lower.includes('start karo') ||
    lower.includes('invoice bhejo') ||
    lower.includes('ready hu') ||
    lower.includes('payment link')
  ) {
    return 'client-ready';
  }

  // Pricing inquiry detection (English + Hinglish)
  if (
    lower.includes('how much') ||
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('rates') ||
    lower.includes('fee') ||
    lower.includes('package') ||
    lower.includes('kitna') ||
    lower.includes('kitne') ||
    lower.includes('charges') ||
    lower.includes('kya rate hai')
  ) {
    return 'pricing';
  }

  // Positive interest detection (English + Hinglish)
  if (
    lower.includes('love this') ||
    lower.includes('looks great') ||
    lower.includes('looks awesome') ||
    lower.includes('interested') ||
    lower.includes('claim') ||
    lower.includes('yes') ||
    lower.includes('can we talk') ||
    lower.includes('call me') ||
    lower.includes('badiya') ||
    lower.includes('badhiya') ||
    lower.includes('accha hai') ||
    lower.includes('pasand aaya') ||
    lower.includes('call karo') ||
    lower.includes('baat karni hai') ||
    lower.includes('customize')
  ) {
    return 'positive';
  }

  return 'neutral';
}

function generateSuggestedResponse(sentiment, prospect, replyText) {
  const bizName = prospect?.business_name || 'team';
  const config = db.getConfig();
  const senderName = (config.sender_name || 'Devesh Kumar').trim();
  const rawSenderWa = (config.sender_whatsapp || '918920608191').replace(/[^0-9]/g, '');

  switch (sentiment) {
    case 'positive':
      return `Namaste ${bizName} team! 🙏

Bohot accha laga sunkar ki aapko 3D demo website pasand aayi! ☕✨

Aapke convenience ke hisaab se hum ek quick 10-minute call ya WhatsApp par discuss kar sakte hain, jisme hum aapka actual menu, photos aur direct WhatsApp ordering setup finalize kar denge.

Kya aap kal ya parso afternoon me free hain ek quick walkthrough ke liye?

Warm regards,
${senderName}
WhatsApp: +${rawSenderWa}`;

    case 'pricing':
      return `Namaste ${bizName} team! 🙏

Demo website bilkul free hai aapke dekhne ke liye! 

Agar aap ise apne custom domain (.com / .in) par live launch karna chahte hain with lifetime hosting, SSL security aur WhatsApp customer alerts, toh hamara complete setup package sirf ₹4,999 (one-time) ka hai — koi hidden monthly fees nahi.

Kya main aapke domain name ke sath finalize draft agreement share kar du?

Warm regards,
${senderName}
WhatsApp: +${rawSenderWa}`;

    case 'opt-out':
      return `Namaste,

Aapko hamari list se remove kar diya gaya hai. Aage se aapko koi promotional message nahi aayega. Inconvenience ke liye maafi chahte hain.

Warm regards,
${senderName}`;

    case 'client-ready':
      return `Namaste ${bizName} team! 🎉

Zabardast! Hum aapke sath kaam karne ke liye excited hain.

Aapka custom domain aur live setup 24 se 48 ghante me live ready ho jayega. 
Aap hume bas apna logo aur updated menu/details yahan share kar dijiye, hum turant live deploy kar denge!

Warm regards,
${senderName}
WhatsApp: +${rawSenderWa}`;

    default:
      return `Namaste ${bizName} team! 🙏

Aapke response ke liye shukriya! Demo website ke baare me agar aapko koi bhi changes karwane ho ya koi sawal ho, toh bejhijhak yahan WhatsApp par batayein.

Warm regards,
${senderName}
WhatsApp: +${rawSenderWa}`;
  }
}

/**
 * Skill 7: Reply handling
 * Process incoming replies, classify sentiment, update OutreachLog and Prospect status
 */
function handleIncomingReply(logId, replyText) {
  const logs = db.getLogs();
  const log = logs.find(l => l.id === logId);

  if (!log) {
    throw new Error(`Outreach log with ID ${logId} not found`);
  }

  const sentiment = analyzeSentiment(replyText);
  const prospect = db.getProspectById(log.prospect_id);

  let nextStatus = 'replied';
  if (sentiment === 'opt-out') {
    nextStatus = 'opted-out';
  } else if (sentiment === 'client-ready') {
    nextStatus = 'client';
  }

  // Update log
  const updatedLog = db.updateLog(log.id, {
    reply_received: 'yes',
    reply_text: replyText,
    reply_sentiment: sentiment,
    status: 'replied'
  });

  // Update prospect status
  if (prospect) {
    db.updateProspect(prospect.id, {
      status: nextStatus
    });
  }

  const suggestedResponse = prospect ? generateSuggestedResponse(sentiment, prospect, replyText) : '';
  const config = db.getConfig();

  // Generate 1-click WhatsApp reply URL for CRM
  let recipientPhone = (prospect?.phone || log.recipient_phone || '').replace(/[^0-9]/g, '');
  if (recipientPhone.length === 10 && ['6', '7', '8', '9'].includes(recipientPhone[0])) {
    recipientPhone = '91' + recipientPhone;
  }
  if (!recipientPhone) {
    recipientPhone = (config.sender_whatsapp || '918920608191').replace(/[^0-9]/g, '');
  }

  const waReplyUrl = `https://wa.me/${recipientPhone}?text=${encodeURIComponent(suggestedResponse)}`;

  console.log(`[Reply Skill] Processed reply for ${prospect ? prospect.business_name : 'Unknown'}. Sentiment: ${sentiment}. Status -> ${nextStatus}`);

  return {
    log: updatedLog,
    prospect: db.getProspectById(log.prospect_id),
    sentiment,
    suggestedResponse,
    wa_reply_url: waReplyUrl
  };
}

module.exports = {
  handleIncomingReply,
  analyzeSentiment,
  generateSuggestedResponse
};
