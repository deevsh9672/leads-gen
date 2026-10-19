const db = require('../db');
const { discoverLeads } = require('../services/discover');
const { verifyDomainMX } = require('../services/emailValidator');
const fs = require('fs');
const path = require('path');

async function runExtraction() {
  console.log('=== STARTING 75 TORONTO CLINIC LEADS EXTRACTION ===');
  
  // Clear any existing non-Canadian or old records so we have 75 pristine Toronto clinic leads
  db.saveProspects([]);

  // Set config to Toronto, Canada, Clinic
  db.updateConfig({
    target_city: 'Toronto',
    target_country: 'Canada',
    business_niche: 'clinic',
    max_leads_per_day: 75,
    discovery_source: 'osm'
  });

  const result = await discoverLeads({
    city: 'Toronto, Canada',
    niche: 'clinic',
    limit: 75,
    source: 'osm'
  });

  console.log(`Discovered ${result.discovered_count} leads.`);

  // Load saved prospects and verify quality
  let prospects = db.getProspects();
  console.log(`Total prospects in database: ${prospects.length}`);

  // Verification checks
  let validCount = 0;
  for (const p of prospects) {
    const isCanada = /canada|ontario|toronto/i.test(p.address) || p.country === 'Canada';
    const hasPhone = p.phone && (p.phone.includes('+1') || p.phone.includes('416') || p.phone.includes('647') || p.phone.includes('437'));
    const hasValidEmail = p.email && p.is_email_verified;
    if (isCanada && hasPhone && hasValidEmail) {
      validCount++;
    }
  }

  console.log(`Verified High-Quality Toronto Leads: ${validCount} / ${prospects.length}`);
  
  if (prospects.length > 0) {
    console.log('\n--- Sample Lead #1 ---');
    console.log(JSON.stringify(prospects[0], null, 2));
    console.log('\n--- Sample Lead #25 ---');
    console.log(JSON.stringify(prospects[Math.min(24, prospects.length - 1)], null, 2));
    console.log('\n--- Sample Lead #75 ---');
    console.log(JSON.stringify(prospects[prospects.length - 1], null, 2));
  }
}

runExtraction().catch(console.error);
