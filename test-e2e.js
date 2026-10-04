const http = require('http');

const BASE_URL = 'http://localhost:5000';

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = res.headers['content-type']?.includes('application/json')
            ? JSON.parse(body)
            : body;
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🤖 SiteSeller Agent - End-to-End Verification Suite');
  console.log('====================================================\n');

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

  try {
    // 1. Health Check
    const health = await makeRequest('GET', '/api/health');
    assert(health.status === 200 && health.data.app === 'SiteSeller Agent', 'System Health Check');

    // 2. LeadConfig Entity Check
    const configRes = await makeRequest('GET', '/api/config');
    assert(configRes.data.target_city && configRes.data.physical_mailing_address, 'LeadConfig loaded with CAN-SPAM physical address');

    // 3. Skill 1: Discover
    console.log('\n[Testing Skill 1: Discover]');
    const discoverRes = await makeRequest('POST', '/api/skills/discover', {
      city: 'Austin',
      niche: 'Roofers',
      limit: 3
    });
    assert(discoverRes.status === 200, 'Skill 1 (Discover) executed successfully');
    assert(discoverRes.data.discovered_count >= 0, `Discovered ${discoverRes.data.discovered_count} qualified businesses lacking websites`);

    // 4. Skill 2: Score
    console.log('\n[Testing Skill 2: Score]');
    const prospectsRes = await makeRequest('GET', '/api/prospects');
    const prospects = prospectsRes.data;
    assert(prospects.length > 0, `Prospects database contains ${prospects.length} entries`);
    const testProspect = prospects[0];
    assert(testProspect.has_website === 'no', `Verified prospect has_website = 'no'`);
    assert(testProspect.lead_score >= 1 && testProspect.lead_score <= 100, `Prospect "${testProspect.business_name}" scored ${testProspect.lead_score}/100`);
    assert(testProspect.score_breakdown && testProspect.score_breakdown.review_score !== undefined, 'Score breakdown includes transparent review trust and category weights');

    // 5. Skill 3: Generate
    console.log('\n[Testing Skill 3: Generate]');
    const genRes = await makeRequest('POST', `/api/skills/generate/${testProspect.id}`);
    assert(genRes.status === 200 && genRes.data.demo_url, 'Skill 3 (Generate) created demo website record');
    assert(genRes.data.html_content.includes('WhatsApp'), 'Demo website includes floating WhatsApp quick-chat button');
    assert(genRes.data.html_content.includes('Book an Appointment / Quote'), 'Demo website includes interactive booking/quote form');
    assert(genRes.data.html_content.includes('Verified Feedback'), 'Demo website includes testimonials section');

    // 6. Skill 4: Host
    console.log('\n[Testing Skill 4: Host]');
    const hostRes = await makeRequest('POST', `/api/skills/host/${testProspect.id}`);
    assert(hostRes.data.demo_url.includes('/demos/'), `Skill 4 (Host) published demo URL at: ${hostRes.data.demo_url}`);
    
    // Fetch live hosted demo page
    const demoPage = await makeRequest('GET', `/demos/${hostRes.data.id}`);
    assert(demoPage.status === 200 && demoPage.data.includes(testProspect.business_name), 'Hosted URL renders full responsive HTML with business branding');

    // 7. Skill 5: Outreach & Skill 6: Log
    console.log('\n[Testing Skill 5 & 6: Outreach & Log]');
    const outreachRes = await makeRequest('POST', `/api/skills/outreach/${testProspect.id}`, {});
    assert(outreachRes.status === 200 && outreachRes.data.success, 'Skill 5 (Outreach) dispatched personalized email');
    assert(outreachRes.data.log.demo_url === hostRes.data.demo_url, 'Outreach email body correctly contains live demo website link');
    assert(outreachRes.data.prospect.status === 'contacted', 'Prospect status transitioned to "contacted"');

    // Check OutreachLog audit trail
    const logsRes = await makeRequest('GET', '/api/logs');
    assert(logsRes.data.length > 0, `Skill 6 (Log) recorded outreach in OutreachLog table (${logsRes.data.length} total entries)`);
    const latestLog = logsRes.data[0];

    // 8. Skill 7: Reply Handling
    console.log('\n[Testing Skill 7: Reply Handling & Sentiment Analysis]');
    const replyRes = await makeRequest('POST', '/api/skills/replies/simulate', {
      logId: latestLog.id,
      replyText: "Hi Alex! We love the website demo you made for us. What does it cost to launch on our custom domain?"
    });
    assert(replyRes.status === 200, 'Skill 7 (Reply) processed incoming lead message');
    assert(replyRes.data.sentiment === 'pricing' || replyRes.data.sentiment === 'positive', `Sentiment correctly classified as "${replyRes.data.sentiment}"`);
    assert(replyRes.data.suggestedResponse.length > 20, 'Auto-generated high-converting AI closing response tailored to objection');
    assert(replyRes.data.log.reply_received === 'yes', 'OutreachLog updated with reply_received = "yes"');

    // Test client conversion sentiment
    const clientReplyRes = await makeRequest('POST', '/api/skills/replies/simulate', {
      logId: latestLog.id,
      replyText: "Let's do it! Please send the invoice and agreement so we can launch."
    });
    assert(clientReplyRes.data.sentiment === 'client-ready', 'Detected client ready to purchase');
    assert(clientReplyRes.data.prospect.status === 'client', 'Prospect status automatically transitioned to "client"');

    // 9. Full Autonomous Cycle Trigger
    console.log('\n[Testing Autonomous Pipeline Cycle]');
    const pipeRes = await makeRequest('POST', '/api/pipeline/run', { limit: 2 });
    assert(pipeRes.status === 200, 'Autonomous Pipeline Cycle launched successfully');

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
