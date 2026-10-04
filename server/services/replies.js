const db = require('../db');

function analyzeSentiment(replyText = '') {
  const lower = replyText.toLowerCase();

  // Opt-out detection
  if (
    lower.includes('unsubscribe') ||
    lower.includes('stop') ||
    lower.includes('remove me') ||
    lower.includes('opt out') ||
    lower.includes('do not email') ||
    lower.includes('not interested')
  ) {
    return 'opt-out';
  }

  // Client conversion detection
  if (
    lower.includes('lets do it') ||
    lower.includes("let's do it") ||
    lower.includes('send invoice') ||
    lower.includes('ready to sign') ||
    lower.includes('we want to buy') ||
    lower.includes('take our money') ||
    lower.includes('launch it')
  ) {
    return 'client-ready';
  }

  // Pricing inquiry detection
  if (
    lower.includes('how much') ||
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('rates') ||
    lower.includes('fee') ||
    lower.includes('package')
  ) {
    return 'pricing';
  }

  // Positive interest detection
  if (
    lower.includes('love this') ||
    lower.includes('looks great') ||
    lower.includes('looks awesome') ||
    lower.includes('interested') ||
    lower.includes('claim') ||
    lower.includes('yes') ||
    lower.includes('can we talk') ||
    lower.includes('call me')
  ) {
    return 'positive';
  }

  return 'neutral';
}

function generateSuggestedResponse(sentiment, prospect, replyText) {
  const bizName = prospect.business_name || 'there';

  switch (sentiment) {
    case 'positive':
      return `Hi team at ${bizName},

So glad you liked the demo! 

I'd love to hop on a quick 10-minute screen share this week to show you how easy it is to customize your text, photos, and hook up your lead notifications directly to your phone/WhatsApp.

Are you free this Wednesday or Thursday afternoon for a quick walk-through?

Best,
Alex`;

    case 'pricing':
      return `Hi team at ${bizName},

Great question! 

The demo site we built is completely free for you to review. To connect your custom domain (.com), set up professional hosting, SSL security, and WhatsApp lead routing, our standard local business package is just $499 one-time (or $49/mo all-inclusive).

Would you like me to reserve the domain and send a quick draft agreement?

Best,
Alex`;

    case 'opt-out':
      return `Hi,

You have been successfully removed from our list and will not receive any further correspondence. We apologize for any inconvenience.

Best regards,
Alex Morgan`;

    case 'client-ready':
      return `Hi team at ${bizName},

Fantastic news! We are thrilled to partner with you.

Here is the onboarding link where you can confirm your domain name and preferred business hours:
👉 [Secure Client Setup Link]

We can have your live site launched within 48 hours!

Best,
Alex`;

    default:
      return `Hi team at ${bizName},

Thank you for your reply! Let me know if you have any questions about the demo site or if you'd like us to tweak any of the services or phone numbers listed.

Best,
Alex`;
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

  console.log(`[Reply Skill] Processed reply for ${prospect ? prospect.business_name : 'Unknown'}. Sentiment: ${sentiment}. Status -> ${nextStatus}`);

  return {
    log: updatedLog,
    prospect: db.getProspectById(log.prospect_id),
    sentiment,
    suggestedResponse
  };
}

module.exports = {
  handleIncomingReply,
  analyzeSentiment,
  generateSuggestedResponse
};
