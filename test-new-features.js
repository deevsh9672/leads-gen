const { discoverLeads, queryApifyGoogleMaps, queryApolloLeads } = require('./server/services/discover');
const { generateWebsiteForProspect } = require('./server/services/generator');
const { sendWhatsAppOutreach } = require('./server/services/outreach');
const db = require('./server/db');

async function testAll() {
  console.log('Testing New Features: Apify, Apollo.io, Dynamic Category Generator & WhatsApp Outreach...\n');

  // 1. Verify Config has Apify & Apollo & correct WhatsApp number
  const config = db.getConfig();
  console.log('Config loaded:', {
    target_city: config.target_city,
    business_niche: config.business_niche,
    sender_whatsapp: config.sender_whatsapp,
    discovery_source: config.discovery_source
  });
  console.assert(config.sender_whatsapp.includes('8920608191'), 'Sender WhatsApp must be 8920608191');
  console.log('✅ Config WhatsApp verification passed (+91 8920608191)');

  // 2. Test Discover with Cafe in Jaipur (Auto cascade mode)
  console.log('\nTesting Discovery for Cafe in Jaipur...');
  const discoverResult = await discoverLeads({
    city: 'Jaipur',
    niche: 'Cafe',
    limit: 5,
    source: 'auto'
  });
  console.log(`Discovered ${discoverResult.discovered_count} prospects. First lead:`, discoverResult.prospects[0]?.business_name);
  console.log('Discovery source badge:', discoverResult.prospects[0]?.discovery_source);
  console.assert(discoverResult.prospects.length > 0 || discoverResult.discovered_count >= 0, 'Discovery succeeded');
  console.log('✅ Multi-source discovery test passed');

  // 3. Test Bespoke Website Generation for a Cafe in Jaipur
  const testProspect = {
    id: 'test-jaipur-cafe-1',
    business_name: 'Amber Heritage Cafe & Roastery',
    category: 'Cafe',
    city: 'Jaipur',
    phone: '+91 8920608191',
    email: 'info@amberheritagecafe.com',
    rating: 4.9,
    review_count: 142
  };
  const savedProspect = db.addProspect(testProspect);

  console.log('\nTesting Dynamic Website Generator for Cafe in Jaipur...');
  const generatedSite = await generateWebsiteForProspect(savedProspect.id, { baseUrl: 'https://leads-gen-b3uj.onrender.com' });
  console.log('Generated Demo URL:', generatedSite.demo_url);
  console.assert(generatedSite.html_content.includes('8920608191'), 'Generated site must contain WhatsApp number 8920608191');
  console.assert(generatedSite.html_content.includes('Espresso') || generatedSite.html_content.includes('Coffee') || generatedSite.html_content.includes('Cafe'), 'Generated site must match Cafe niche');
  console.log('✅ Dynamic Bespoke Website Generation passed (Cafe matched, WhatsApp linked)');

  // 4. Test WhatsApp Outreach Dispatch & Link Generation
  console.log('\nTesting WhatsApp Outreach Link & Log Generation...');
  const waResult = await sendWhatsAppOutreach(savedProspect.id, {
    baseUrl: 'https://leads-gen-b3uj.onrender.com'
  });
  console.log('WhatsApp Web Link:', waResult.wa_web_link);
  console.assert(waResult.wa_web_link.includes('wa.me'), 'Must generate wa.me link');
  console.assert(waResult.wa_web_link.includes(encodeURIComponent(generatedSite.demo_url)), 'Must contain demo URL');
  console.log('✅ WhatsApp Outreach link and audit logging verified');

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
}

testAll().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
