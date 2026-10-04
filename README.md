# 🤖 SiteSeller Agent

**SiteSeller Agent** is an autonomous AI superagent application engineered for web design agencies, freelancers, and growth consultants. It operates an automated lead-generation engine that finds local businesses without websites, builds each one a bespoke modern AI demo website, and delivers personalized outreach via Gmail to sell web development and hosting services.

---

## 🌟 The 7 Agent Skills (Full Pipeline)

1. **Discover** (`Skill 1`): Searches Google Maps / OpenStreetMap for businesses in the target city and niche that have **no website listed**.
2. **Score** (`Skill 2`): Algorithmic ranking (1–100) assessing review volume trust, high-ticket category demand (e.g., plumbers, roofers, dentists), and conversion opportunity.
3. **Generate** (`Skill 3`): Builds complete modern demo websites for top-scoring prospects with:
   - Sticky navigation & brand logo
   - Hero section with high-converting CTA
   - Category-specialized services grid
   - Visual craftsmanship gallery (high-res photography)
   - Verified 5-star customer testimonials
   - Direct appointment & quote booking form
   - Floating WhatsApp click-to-chat button
4. **Host** (`Skill 4`): Publishes the demo website to a live public URL (`/demos/:id`) and stores the link in `GeneratedSite`.
5. **Outreach** (`Skill 5`): Sends short, personalized cold emails mentioning the free custom demo website built specifically for their business, with live demo link and a clear call-to-action (*"Reply to claim it"*). Fully CAN-SPAM compliant.
6. **Log** (`Skill 6`): Records every email, recipient, timestamp, and delivery status in `OutreachLog`.
7. **Reply Handling & CRM** (`Skill 7`): Monitors incoming lead emails, detects sentiment (*Positive / Pricing / Skeptical / Opt-Out / Client-Ready*), generates AI closing follow-ups, and transitions lead status to `replied`, `client`, or `opted-out`.

---

## 🗄️ Core Entities

- **`Prospect`**: `id`, `business_name`, `category`, `city`, `phone`, `email`, `website_url`, `has_website` (yes/no), `lead_score` (1-100), `score_breakdown`, `status` (`new` / `contacted` / `replied` / `opted-out` / `client`).
- **`LeadConfig`**: `target_city`, `target_country`, `business_niche`, `max_leads_per_day`, `sender_name`, `sender_email`, `physical_mailing_address` (*required for CAN-SPAM compliance*), Gmail SMTP options, `auto_pilot`.
- **`GeneratedSite`**: `id`, `prospect_id`, `demo_url`, `site_config`, `html_content`, `generated_date`.
- **`OutreachLog`**: `id`, `prospect_id`, `recipient_email`, `email_subject`, `email_body`, `sent_date`, `reply_received` (yes/no), `reply_text`, `reply_sentiment`, `status`.

---

## 🚀 Quick Start Guide

### 1. Launch the Superagent
From the project folder:
```bash
# Start the unified full-stack application (backend + frontend)
npm start
```
Open your browser to:
👉 **`http://localhost:5000`**

### 2. Run Autonomous Pipeline
1. Click the pulsating **"Run Autonomous Cycle"** button in the top navigation.
2. Watch the live terminal telemetry and visual stepper progress through all 7 skills:
   - Discovering businesses without websites
   - Ranking 1–100
   - Generating tailored responsive demo sites
   - Publishing live URLs
   - Dispatching CAN-SPAM compliant outreach
   - Listening for replies

### 3. Explore Views
- **Superagent Ops**: Real-time KPI metrics, conversion funnel, revenue potential.
- **Prospects Hub**: Filter and search local leads, view transparent score breakdowns, add manual prospects.
- **AI Demo Studio**: Interactive live preview frame with Desktop, Tablet, and Mobile (iPhone) viewports, color customizer, and single-click HTML export.
- **Outreach & CAN-SPAM**: Email composer with merge tags (`{{business_name}}`, `{{demo_url}}`), compliance checklist, and audit logs.
- **Replies & CRM**: Simulated lead replies testbed, sentiment analysis badges, auto-suggested responses, and 1-click conversion to `$499` client deal.
- **LeadConfig**: Edit target city, country, niche, daily lead quota, sender info, CAN-SPAM postal address, and Gmail SMTP credentials.

### 4. Run Automated Verification Tests
```bash
node test-e2e.js
```
Expected result: **25 Passed, 0 Failed**.
