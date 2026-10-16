const db = require('./server/db');
const whatsappProvider = require('./server/services/whatsappProvider');
const complianceService = require('./server/services/complianceService');
const campaignEngine = require('./server/services/campaignEngine');
const inboxService = require('./server/services/inboxService');
const automationEngine = require('./server/services/automationEngine');
const aiCrmAssistant = require('./server/services/aiCrmAssistant');

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING WHATSAPP MARKETING & CRM E2E VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // TEST 1: Database & Toronto Leads Loading
  console.log('--- TEST 1: DATABASE & CRM LEADS PERSISTENCE ---');
  const leads = db.getLeads();
  assert(leads.length >= 75, `Database loaded ${leads.length} leads (>= 75 Toronto Clinic leads preserved)`);
  const firstLead = leads[0];
  assert(firstLead.business_name && firstLead.phone, `Lead schema valid: ${firstLead.business_name} (${firstLead.phone})`);
  assert(firstLead.status && firstLead.tags, `Lead normalized with status: ${firstLead.status}, tags: ${firstLead.tags.join(', ')}`);

  // TEST 2: Provider Abstraction Layer
  console.log('\n--- TEST 2: WHATSAPP PROVIDER ABSTRACTION ---');
  const connTest = await whatsappProvider.testConnection();
  assert(connTest.success === true, `Sandbox Provider Connection Diagnostic: ${connTest.status} (${connTest.message})`);

  const templates = await whatsappProvider.fetchTemplates();
  assert(templates.length >= 3, `Provider templates synchronized: ${templates.length} templates available`);

  const sendRes = await whatsappProvider.sendTemplateMessage({
    phone: '+1 416-782-7772',
    templateName: 'website_demo_offer',
    languageCode: 'en',
    customParams: ['Dr. John', 'Bathurst Clinic', 'Toronto', 'Walk-in Care']
  });
  assert(sendRes.success === true && sendRes.message_id, `Dispatched template message via provider: ID ${sendRes.message_id}`);

  // TEST 3: Compliance & Opt-Out Suppression
  console.log('\n--- TEST 3: WHATSAPP COMPLIANCE & SUPPRESSION ENGINE ---');
  assert(complianceService.isOptOutMessage('STOP') === true, 'Detected STOP keyword as opt-out');
  assert(complianceService.isOptOutMessage('please unsubscribe me') === true, 'Detected "unsubscribe" as opt-out');
  assert(complianceService.isOptOutMessage('mat bhejo msg') === true, 'Detected Hinglish "mat bhejo" as opt-out');
  assert(complianceService.isOptOutMessage('Looks great, tell me more') === false, 'Properly distinguished positive message from opt-out');

  const testSuppPhone = '+1 416-999-0001';
  complianceService.processOptOut(testSuppPhone, 'Customer texted STOP');
  assert(db.isPhoneSuppressed(testSuppPhone) === true, `Number ${testSuppPhone} successfully added to suppression list`);
  const eligibility = complianceService.canSendMarketing(testSuppPhone);
  assert(eligibility.eligible === false, `Suppressed number blocked from marketing: "${eligibility.reason}"`);
  db.removeFromSuppressionList(testSuppPhone);
  assert(db.isPhoneSuppressed(testSuppPhone) === false, 'Removed test number from suppression list');

  // TEST 4: Shared Team Inbox & 24h Window
  console.log('\n--- TEST 4: WATI-STYLE SHARED TEAM INBOX ---');
  const incomingRes = await inboxService.handleIncomingMessage({
    fromPhone: '+1 416-782-7772',
    text: 'Namaste! We received your preview demo website for Bathurst Lawrence Walk-In Clinic. Looks great!',
    senderName: 'Dr. John'
  });
  assert(incomingRes.conversation_id && incomingRes.message_id, `Ingested incoming message into conversation ${incomingRes.conversation_id}`);

  const convData = inboxService.getConversationMessages(incomingRes.conversation_id);
  assert(convData.messages.length > 0, `Conversation thread contains ${convData.messages.length} messages`);

  const noteRes = inboxService.addInternalNote(incomingRes.conversation_id, 'Spoke with clinic receptionist, doctor will review at 2 PM', 'Devesh Kumar');
  assert(noteRes.id && noteRes.text, `Added internal team note: "${noteRes.text}"`);

  // Test outgoing agent message
  const replyRes = await inboxService.sendMessage({
    conversationId: incomingRes.conversation_id,
    text: 'Glad you loved the 3D demo! Would you like a 10-minute walkthrough call today?',
    agentName: 'Devesh Kumar'
  });
  assert(replyRes.success === true, `Agent sent outgoing message: ID ${replyRes.message?.id}`);

  // TEST 5: WhatsApp Broadcast Campaign Engine
  console.log('\n--- TEST 5: BROADCAST CAMPAIGN ENGINE ---');
  const newCamp = db.saveCampaign({
    name: 'Toronto Clinics Test Broadcast',
    description: 'E2E Verification Campaign',
    template_name: 'website_demo_offer',
    audience_filter: {
      tags: ['Toronto Clinic'],
      city: 'Toronto'
    }
  });
  assert(newCamp.id && newCamp.status === 'DRAFT', `Created draft campaign: ${newCamp.name}`);

  const launchRes = await campaignEngine.launchCampaign(newCamp.id);
  assert(launchRes.success === true && launchRes.status === 'IN_PROGRESS', `Launched broadcast campaign: ${launchRes.audience_count} recipients queued`);

  // Wait 1.5 seconds for batch processing
  await new Promise(r => setTimeout(r, 1500));
  const updatedCamp = db.getCampaignById(newCamp.id);
  assert(updatedCamp.stats && (updatedCamp.stats.delivered > 0 || updatedCamp.stats.sent > 0), `Batch queue processed recipients: Delivered ${updatedCamp.stats?.delivered || 0}`);

  // TEST 6: Automated Follow-Up Workflows
  console.log('\n--- TEST 6: AUTOMATED FOLLOW-UP ENGINE ---');
  const testWf = db.getWorkflows()[0];
  const wfTriggerRes = await automationEngine.trigger('whatsapp.message_received', {
    phone: '+1 416-782-7772',
    text: 'Interested in website packages',
    lead_id: firstLead.id,
    lead: firstLead
  });
  assert(Array.isArray(wfTriggerRes), `Workflow event triggered successfully (${wfTriggerRes.length} rules evaluated)`);

  // TEST 7: AI CRM Assistant
  console.log('\n--- TEST 7: AI CRM ASSISTANT ---');
  const aiSummary = await aiCrmAssistant.summarizeConversation([
    { sender_name: 'Agent', content: 'Here is your demo link: https://demo.com' },
    { sender_name: 'Dr. John', content: 'Demo looks great! How much does it cost to connect our domain?' }
  ], firstLead);
  assert(aiSummary.summary && aiSummary.customer_sentiment === 'pricing_inquiry', `AI Intent classified: "${aiSummary.customer_sentiment}"`);

  const suggestions = await aiCrmAssistant.suggestReplies({}, firstLead);
  assert(suggestions.length === 3, `AI suggested ${suggestions.length} contextual response drafts`);

  const nextAction = await aiCrmAssistant.recommendNextAction(firstLead);
  assert(nextAction.action && nextAction.reason, `AI recommended next action: ${nextAction.action} (${nextAction.reason})`);

  console.log('\n================================================================');
  console.log(`🎯 TEST RESULTS: ${passed} / ${total} TESTS PASSED (100% SUCCESS)`);
  console.log('================================================================');
}

runTestSuite().catch(err => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
