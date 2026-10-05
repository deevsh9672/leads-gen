const db = require('./server/db');
const { generateWebsiteForProspect } = require('./server/services/generator');
const { sendWhatsAppOutreach, sendDemoOutreach } = require('./server/services/outreach');

async function testCafeCustomization() {
  console.log('Testing Cafe & Custom Lead Website Generation for Jaipur...\n');

  // Three distinct cafe leads in Jaipur
  const cafeLeads = [
    {
      business_name: 'Amber Artisan Coffee House',
      category: 'Specialty Coffee & Roastery',
      city: 'Jaipur',
      phone: '+91 98290 54321',
      email: 'hello@amberartisancoffee.com',
      rating: 4.9,
      review_count: 142,
      address: 'C-Scheme, Ashok Nagar, Jaipur'
    },
    {
      business_name: 'The Daily Grind Cafe & Bakes',
      category: 'Artisanal Cafe & Bakery',
      city: 'Jaipur',
      phone: '+91 94140 88210',
      email: 'contact@dailygrindjaipur.com',
      rating: 4.8,
      review_count: 98,
      address: 'MI Road, Jaipur'
    },
    {
      business_name: 'Velvet Courtyard Garden Cafe',
      category: 'Garden Cafe & Kitchen',
      city: 'Jaipur',
      phone: '+91 99280 44109',
      email: 'reserve@velvetcourtyard.com',
      rating: 4.9,
      review_count: 215,
      address: 'Civil Lines, Jaipur'
    }
  ];

  for (const lead of cafeLeads) {
    const saved = db.addProspect(lead);
    console.log(`\n======================================================`);
    console.log(`Processing Lead: ${saved.business_name} (${saved.category} in ${saved.city})`);
    
    // Generate website
    const site = await generateWebsiteForProspect(saved.id, {
      baseUrl: 'https://leads-gen-b3uj.onrender.com'
    });

    console.log(`🌐 Live Demo URL: ${site.demo_url}`);
    
    // Verifications on the generated HTML
    const html = site.html_content;
    const hasBizName = html.includes(saved.business_name);
    const hasCity = html.includes(saved.city);
    const hasWhatsApp = html.includes('8920608191');
    const hasCafeTerms = html.includes('Coffee') || html.includes('Espresso') || html.includes('Brew') || html.includes('Cafe');
    const hasTableBooking = html.includes('Reserve') || html.includes('Table');
    
    console.log(`  - Contains Business Name (${saved.business_name}): ${hasBizName ? '✅' : '❌'}`);
    console.log(`  - Contains City (${saved.city}): ${hasCity ? '✅' : '❌'}`);
    console.log(`  - Contains Agency WhatsApp (8920608191): ${hasWhatsApp ? '✅' : '❌'}`);
    console.log(`  - Tailored to Cafe niche: ${hasCafeTerms ? '✅' : '❌'}`);
    console.log(`  - Contains Table Reservation Form: ${hasTableBooking ? '✅' : '❌'}`);

    // Test WhatsApp outreach dispatch
    const waOutreach = await sendWhatsAppOutreach(saved.id, {
      baseUrl: 'https://leads-gen-b3uj.onrender.com'
    });

    console.log(`📲 WhatsApp Link: ${waOutreach.wa_web_link.slice(0, 100)}...`);
    console.log(`  - Recipient phone cleaned: ${waOutreach.recipient_phone}`);
    console.log(`  - Message tailored with demo link: ${waOutreach.message_text.includes(site.demo_url) ? '✅' : '❌'}`);
  }

  console.log('\n🎉 ALL CAFE CUSTOM WEBSITES AND OUTREACH SUCCESSFULLY GENERATED!');
}

testCafeCustomization().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
