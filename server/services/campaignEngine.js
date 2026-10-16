const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const whatsappProvider = require('./whatsappProvider');
const complianceService = require('./complianceService');

class CampaignEngine {
  constructor() {
    this.activeRunners = new Map(); // campaignId -> { paused: boolean, cancelled: boolean }
  }

  /**
   * Resolves audience list based on filter criteria
   */
  resolveAudience(audienceFilter) {
    const leads = db.getLeads();
    let candidates = [...leads];

    // Filter by Tags
    if (audienceFilter.tags && audienceFilter.tags.length > 0) {
      candidates = candidates.filter(l => 
        l.tags && l.tags.some(t => audienceFilter.tags.includes(t))
      );
    }

    // Filter by Status
    if (audienceFilter.statuses && audienceFilter.statuses.length > 0) {
      candidates = candidates.filter(l => 
        audienceFilter.statuses.includes(l.status)
      );
    }

    // Filter by City
    if (audienceFilter.city && audienceFilter.city !== 'all') {
      candidates = candidates.filter(l => 
        l.city && l.city.toLowerCase().includes(audienceFilter.city.toLowerCase())
      );
    }

    // Filter by Assigned Agent
    if (audienceFilter.assigned_to && audienceFilter.assigned_to !== 'all') {
      candidates = candidates.filter(l => 
        l.assigned_to?.id === audienceFilter.assigned_to
      );
    }

    // Direct recipient list (e.g. from CSV import)
    if (Array.isArray(audienceFilter.custom_recipients) && audienceFilter.custom_recipients.length > 0) {
      return audienceFilter.custom_recipients;
    }

    return candidates;
  }

  /**
   * Replaces variables in template text with actual lead attributes
   */
  personalizeText(textTemplate, lead, extraVars = {}) {
    if (!textTemplate) return '';
    let result = textTemplate;

    const demoSite = db.getSiteByProspectId(lead.id);
    const demoUrl = demoSite?.demo_url || `https://leads-gen-b3uj.onrender.com/demos/${lead.id}`;

    const vars = {
      name: lead.contact_person || lead.business_name || 'Business Owner',
      company: lead.business_name || 'your business',
      city: lead.city || 'your area',
      service: lead.category || 'Professional Services',
      assigned_agent: lead.assigned_to?.name || 'Client Success Team',
      demo_url: demoUrl,
      phone: lead.phone || '',
      ...extraVars
    };

    for (const [key, val] of Object.entries(vars)) {
      const reg = new RegExp(`{{${key}}}`, 'gi');
      result = result.replace(reg, String(val || ''));
    }

    return result;
  }

  /**
   * Launches a campaign with controlled batch queue
   */
  async launchCampaign(campaignId) {
    const campaign = db.getCampaignById(campaignId);
    if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

    if (campaign.status === 'IN_PROGRESS') {
      throw new Error('Campaign is already currently executing');
    }

    const template = db.getTemplates().find(t => t.id === campaign.template_id || t.name === campaign.template_name) || db.getTemplates()[0];
    const audience = this.resolveAudience(campaign.audience_filter || {});

    // Create recipient records if not already initialized
    let recipients = db.getCampaignRecipients(campaignId);
    if (recipients.length === 0) {
      recipients = audience.map(lead => {
        const eligibility = complianceService.canSendMarketing(lead);
        return {
          id: `recp-${uuidv4().slice(0, 8)}`,
          campaign_id: campaignId,
          lead_id: lead.id,
          phone: lead.phone,
          business_name: lead.business_name,
          city: lead.city,
          category: lead.category,
          status: eligibility.eligible ? 'queued' : 'suppressed',
          suppression_reason: eligibility.reason || null,
          message_id: null,
          sent_at: null,
          delivered_at: null,
          read_at: null,
          error: null
        };
      });
      db.addCampaignRecipients(recipients);
    }

    // Update campaign status
    db.updateCampaign(campaignId, {
      status: 'IN_PROGRESS',
      total_recipients: recipients.length,
      started_at: new Date().toISOString()
    });

    this.activeRunners.set(campaignId, { paused: false, cancelled: false });
    db.addAuditLog('CAMPAIGN_LAUNCHED', `Launched broadcast campaign: ${campaign.name}`, { campaign_id: campaignId, audience_count: recipients.length });

    // Run execution asynchronously
    this._processCampaignQueue(campaignId, template).catch(err => {
      console.error(`[CampaignEngine Error] in ${campaignId}:`, err);
    });

    return {
      success: true,
      campaign_id: campaignId,
      status: 'IN_PROGRESS',
      audience_count: recipients.length
    };
  }

  /**
   * Background queue worker processing batch sends with rate limiting
   */
  async _processCampaignQueue(campaignId, template) {
    const runner = this.activeRunners.get(campaignId);
    const BATCH_SIZE = 5;
    const BATCH_DELAY_MS = 600; // Controlled spacing to avoid provider throttling

    let recipients = db.getCampaignRecipients(campaignId);
    const eligibleRecipients = recipients.filter(r => r.status === 'queued');

    for (let i = 0; i < eligibleRecipients.length; i += BATCH_SIZE) {
      if (runner?.cancelled) {
        db.updateCampaign(campaignId, { status: 'CANCELLED' });
        break;
      }

      while (runner?.paused) {
        await new Promise(r => setTimeout(r, 1000));
        if (runner?.cancelled) break;
      }
      if (runner?.cancelled) break;

      const batch = eligibleRecipients.slice(i, i + BATCH_SIZE);

      await Promise.all(batch.map(async (recipient) => {
        try {
          const lead = db.getLeadById(recipient.lead_id) || recipient;
          const personalizedBody = this.personalizeText(template.body, lead);

          // Provider parameters
          const sendParams = {
            phone: recipient.phone,
            templateName: template.name,
            languageCode: template.language || 'en',
            broadcastName: `Campaign_${campaignId}`,
            customParams: [
              lead.contact_person || lead.business_name || 'Team',
              lead.business_name,
              lead.city || 'Toronto',
              lead.category || 'Services'
            ]
          };

          const result = await whatsappProvider.sendTemplateMessage(sendParams);

          if (result.success) {
            db.updateCampaignRecipient(recipient.id, {
              status: result.status || 'delivered',
              message_id: result.message_id,
              sent_at: new Date().toISOString(),
              delivered_at: result.status === 'delivered' ? new Date().toISOString() : null
            });

            // Update lead status to CONTACTED if it was NEW
            if (lead.id && lead.status === 'NEW') {
              db.updateLead(lead.id, {
                status: 'CONTACTED',
                last_outgoing_at: new Date().toISOString()
              });
            }

            // Sync with conversation thread in team inbox
            const conv = db.getConversationByPhone(recipient.phone) || db.saveConversation({
              lead_id: lead.id,
              lead_name: lead.business_name,
              phone: recipient.phone,
              status: 'OPEN',
              last_message: personalizedBody
            });

            db.addMessage({
              conversation_id: conv.id,
              sender_type: 'agent',
              sender_name: 'Campaign Broadcast',
              message_type: 'template',
              template_name: template.name,
              content: personalizedBody,
              status: result.status || 'delivered',
              external_id: result.message_id
            });

          } else {
            db.updateCampaignRecipient(recipient.id, {
              status: 'failed',
              error: result.error || 'Provider rejected send'
            });
          }
        } catch (err) {
          db.updateCampaignRecipient(recipient.id, {
            status: 'failed',
            error: err.message
          });
        }
      }));

      // Update real-time stats
      this._recalculateCampaignStats(campaignId);

      // Controlled inter-batch pause
      if (i + BATCH_SIZE < eligibleRecipients.length) {
        await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
      }
    }

    if (!runner?.cancelled) {
      db.updateCampaign(campaignId, { status: 'COMPLETED', completed_at: new Date().toISOString() });
      db.addAuditLog('CAMPAIGN_COMPLETED', `Campaign finished execution: ${campaignId}`, { campaign_id: campaignId });
    }

    this.activeRunners.delete(campaignId);
  }

  /**
   * Recalculates stats from actual recipient delivery records
   */
  _recalculateCampaignStats(campaignId) {
    const recps = db.getCampaignRecipients(campaignId);
    const stats = {
      queued: 0,
      submitted: 0,
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      failed: 0,
      opt_out: 0
    };

    for (const r of recps) {
      if (stats[r.status] !== undefined) {
        stats[r.status]++;
      }
      if (r.status === 'suppressed') {
        stats.opt_out++;
      }
    }

    db.updateCampaign(campaignId, { stats });
    return stats;
  }

  pauseCampaign(campaignId) {
    const runner = this.activeRunners.get(campaignId);
    if (runner) {
      runner.paused = true;
      db.updateCampaign(campaignId, { status: 'PAUSED' });
      db.addAuditLog('CAMPAIGN_PAUSED', `Paused broadcast campaign: ${campaignId}`, { campaign_id: campaignId });
      return { success: true, status: 'PAUSED' };
    }
    return { success: false, error: 'Campaign is not currently running' };
  }

  resumeCampaign(campaignId) {
    const runner = this.activeRunners.get(campaignId);
    if (runner && runner.paused) {
      runner.paused = false;
      db.updateCampaign(campaignId, { status: 'IN_PROGRESS' });
      db.addAuditLog('CAMPAIGN_RESUMED', `Resumed broadcast campaign: ${campaignId}`, { campaign_id: campaignId });
      return { success: true, status: 'IN_PROGRESS' };
    }
    // If not in memory (e.g. server restarted), resume from DB
    return this.launchCampaign(campaignId);
  }

  cancelCampaign(campaignId) {
    const runner = this.activeRunners.get(campaignId);
    if (runner) {
      runner.cancelled = true;
    }
    db.updateCampaign(campaignId, { status: 'CANCELLED' });
    db.addAuditLog('CAMPAIGN_CANCELLED', `Cancelled broadcast campaign: ${campaignId}`, { campaign_id: campaignId });
    return { success: true, status: 'CANCELLED' };
  }

  /**
   * Sends a test message to an authorized verification number before broadcast
   */
  async sendTestMessage(testPhone, templateId, sampleLead = null) {
    const template = db.getTemplates().find(t => t.id === templateId) || db.getTemplates()[0];
    const dummyLead = sampleLead || {
      business_name: 'Toronto Health Clinic Demo',
      contact_person: 'Dr. Smith',
      city: 'Toronto',
      category: 'Medical Clinic',
      id: 'test-lead-preview'
    };

    const personalized = this.personalizeText(template.body, dummyLead);
    const result = await whatsappProvider.sendTemplateMessage({
      phone: testPhone,
      templateName: template.name,
      languageCode: template.language || 'en',
      customParams: ['Dr. Smith', dummyLead.business_name, 'Toronto', 'Medical Clinic']
    });

    return {
      success: result.success,
      preview_text: personalized,
      result
    };
  }
}

module.exports = new CampaignEngine();
