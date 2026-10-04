const db = require('../db');
const { generateWebsiteForProspect } = require('./generator');

/**
 * Skill 4: Host
 * Publishes the demo site and saves its public URL to GeneratedSite
 */
async function hostDemoSite(prospectId, baseUrl = 'http://localhost:5000') {
  // Check if site already exists for prospect
  let existingSite = db.getSiteByProspectId(prospectId);
  
  if (!existingSite) {
    existingSite = await generateWebsiteForProspect(prospectId, baseUrl);
  } else {
    // Ensure demo_url matches current baseUrl
    const correctUrl = `${baseUrl}/demos/${existingSite.id}`;
    if (existingSite.demo_url !== correctUrl) {
      existingSite = db.saveSite({
        ...existingSite,
        demo_url: correctUrl
      });
    }
  }

  console.log(`[Host Skill] Published demo site for prospect ${prospectId} at: ${existingSite.demo_url}`);
  return existingSite;
}

module.exports = {
  hostDemoSite
};
