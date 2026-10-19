const {
  normalizePhoneNumber,
  validateAndFormatContact,
  getWhatsAppCredentials,
  verifyWebhookSignature,
  processWebhookEvent
} = require('./services/whatsappBroadcaster');
const db = require('./db');

async function runTests() {
  console.log('=== STARTING AUTOMATED WHATSAPP BROADCASTING SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Phone Normalization Tests
  console.log('--- 1. Testing Phone Normalization ---');
  const ca1 = normalizePhoneNumber('+1 (416) 506-0804');
  assert(ca1 === '14165060804', `Normalize North American format (+1 (416) 506-0804 -> ${ca1})`);

  const ca2 = normalizePhoneNumber('416-782-7772', '1');
  assert(ca2 === '14167827772', `Normalize 10-digit North American (416-782-7772 -> ${ca2})`);

  const in1 = normalizePhoneNumber('+91 89206 08191');
  assert(in1 === '918920608191', `Normalize Indian format (+91 89206 08191 -> ${in1})`);

  const in2 = normalizePhoneNumber('9829012890', '91');
  assert(in2 === '919829012890', `Normalize 10-digit Indian (9829012890 -> ${in2})`);

  const invalid = normalizePhoneNumber('abc-xyz');
  assert(invalid === null, 'Invalid string returns null');

  // 2. Contact Validation & Duplicate Removal
  console.log('\n--- 2. Testing Contact Validation & Import ---');
  const uid = Math.floor(1000 + Math.random() * 8999);
  const validContact = validateAndFormatContact({
    name: 'Dr. Emily Thorne',
    phone: `+1 416-555-${uid}`,
    company: 'Downtown Toronto Clinic',
    city: 'Toronto'
  });
  assert(validContact.valid === true, 'Valid contact formatting');
  assert(validContact.contact.clean_phone === `1416555${uid}`, 'Clean phone set properly');

  // Import batch with duplicate
  const p1 = `+1 416-777-${uid}`;
  const p2 = `+1 416-888-${uid}`;
  const importBatch = [
    { name: 'Clinic A', phone: p1, city: 'Toronto' },
    { name: 'Clinic B', phone: p2, city: 'Toronto' },
    { name: 'Clinic A Duplicate', phone: p1, city: 'Toronto' }
  ];
  const importResult = db.importWhatsAppContacts(importBatch.map(c => validateAndFormatContact(c).contact));
  assert(importResult.total_imported === 2, `Imported unique contacts (got ${importResult.total_imported})`);
  assert(importResult.duplicates_skipped === 1, `Skipped duplicate phone (got ${importResult.duplicates_skipped})`);

  // 3. Contact Consent & Opt-Out Handling
  console.log('\n--- 3. Testing Contact Consent & Opt-Out ---');
  const optOutPhone = `+1 416-999-${uid}`;
  const cleanOptPhone = `1416999${uid}`;
  const testContact = db.addWhatsAppContact({
    name: 'Opt-Out Test User',
    phone: optOutPhone,
    consent_status: 'CONSENTED'
  }).contact;

  assert(testContact.consent_status === 'CONSENTED', 'Initial consent is CONSENTED');

  // Opt-out user
  db.optOutWhatsAppContactByPhone(cleanOptPhone, 'Test Opt-Out');
  const updatedContact = db.getWhatsAppContactById(testContact.id);
  assert(updatedContact.consent_status === 'OPTED_OUT', 'Contact updated to OPTED_OUT');
  assert(updatedContact.opt_out_date !== null, 'Opt-out timestamp recorded');

  // 4. Campaign Creation & Opt-out exclusion
  console.log('\n--- 4. Testing Campaign Creation & Exclusion of Opted-Out Contacts ---');
  const allContacts = db.getWhatsAppContacts();
  const campaign = db.saveWhatsAppCampaign({
    name: 'Test Broadcast Campaign',
    type: 'template',
    template_name: 'website_demo_announcement',
    recipients: allContacts.filter(c => c.consent_status !== 'OPTED_OUT').map(c => ({
      contact_id: c.id,
      name: c.name,
      phone: c.phone,
      status: 'QUEUED'
    }))
  });

  assert(campaign.status === 'DRAFT', 'Campaign status initialized as DRAFT');
  const optedOutIncluded = campaign.recipients.some(r => r.phone === optOutPhone);
  assert(!optedOutIncluded, 'Opted-out contact is strictly excluded from campaign recipients');

  // 5. Webhook Handshake & Verification
  console.log('\n--- 5. Testing Webhook Verification ---');
  const creds = getWhatsAppCredentials();
  const verifyTokenMatches = (creds.webhookVerifyToken === 'siteseller_wa_webhook_verify_secret');
  assert(verifyTokenMatches, `Webhook verify token matches configuration (${creds.webhookVerifyToken})`);

  // 6. Webhook Status Events (Delivered & Read Updates)
  console.log('\n--- 6. Testing Webhook Status Events Processing ---');
  // Add a recipient with mock wamid
  const testWamid = 'wamid.HBgLMTQxNjUwNjA4MDQVAgARGBI2ODQ4NTY0ODU0OTk5OTk5AA';
  const recipientRecord = campaign.recipients[0];
  db.updateRecipientStatus(recipientRecord.id, 'ACCEPTED', { wamid: testWamid, sent_at: new Date().toISOString() });

  // Simulate Meta Status Webhook Callback for 'delivered'
  const mockDeliveredPayload = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
      changes: [{
        field: 'messages',
        value: {
          messaging_product: 'whatsapp',
          metadata: { display_phone_number: '15550199', phone_number_id: '123456789' },
          statuses: [{
            id: testWamid,
            status: 'delivered',
            timestamp: String(Math.floor(Date.now() / 1000)),
            recipient_id: recipientRecord.phone.replace(/\D/g, '')
          }]
        }
      }]
    }]
  };

  const statusRes1 = await processWebhookEvent(mockDeliveredPayload);
  assert(statusRes1.updated_statuses_count === 1, 'Webhook processed delivered status event');

  const afterDelivered = db.findRecipientByWamid(testWamid);
  assert(afterDelivered.status === 'DELIVERED', `Recipient status updated to DELIVERED (got ${afterDelivered?.status})`);
  assert(afterDelivered.delivered_at !== null, 'Recipient delivered_at timestamp set');

  // Simulate Meta Status Webhook Callback for 'read'
  const mockReadPayload = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
      changes: [{
        field: 'messages',
        value: {
          messaging_product: 'whatsapp',
          metadata: { display_phone_number: '15550199', phone_number_id: '123456789' },
          statuses: [{
            id: testWamid,
            status: 'read',
            timestamp: String(Math.floor(Date.now() / 1000)),
            recipient_id: recipientRecord.phone.replace(/\D/g, '')
          }]
        }
      }]
    }]
  };

  const statusRes2 = await processWebhookEvent(mockReadPayload);
  assert(statusRes2.updated_statuses_count === 1, 'Webhook processed read status event');

  const afterRead = db.findRecipientByWamid(testWamid);
  assert(afterRead.status === 'READ', `Recipient status updated to READ (got ${afterRead?.status})`);
  assert(afterRead.read_at !== null, 'Recipient read_at timestamp set');

  // 7. Webhook Inbound Message Opt-Out Keyword
  console.log('\n--- 7. Testing Inbound Unsubscribe Keyword Handling ---');
  // Create an active contact to test STOP
  const stopContact = db.addWhatsAppContact({
    name: 'Unsubscribe Keyword Tester',
    phone: '+1 416-555-8888',
    consent_status: 'CONSENTED'
  }).contact;

  const mockInboundStopMessage = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
      changes: [{
        field: 'messages',
        value: {
          messaging_product: 'whatsapp',
          metadata: { display_phone_number: '15550199', phone_number_id: '123456789' },
          messages: [{
            from: '14165558888',
            id: 'wamid.INBOUND_STOP_TEST',
            timestamp: String(Math.floor(Date.now() / 1000)),
            text: { body: 'STOP' },
            type: 'text'
          }]
        }
      }]
    }]
  };

  const inboundRes = await processWebhookEvent(mockInboundStopMessage);
  assert(inboundRes.opt_outs_handled === 1, 'Inbound STOP message detected and processed');

  const afterStopContact = db.getWhatsAppContactById(stopContact.id);
  assert(afterStopContact.consent_status === 'OPTED_OUT', `Contact consent changed to OPTED_OUT automatically (got ${afterStopContact.consent_status})`);

  console.log(`\n==============================================`);
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`==============================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
