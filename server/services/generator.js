const db = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * Builds tailored brand palettes, services, testimonials, menu items, and interactive elements
 * for each individual business lead and niche.
 */
function getBespokeNicheProfile(category = '', bizName = 'Local Business', city = 'Jaipur') {
  const cat = (category || '').toLowerCase();
  const name = bizName.toLowerCase();

  // 1. CAFE / COFFEE SHOP / TEA ROOM / ROASTERY (ULTRA-LUXURY BESPOKE EXPERIENCE)
  if (cat.includes('cafe') || cat.includes('coffee') || cat.includes('tea') || cat.includes('roast') || cat.includes('espresso') || name.includes('cafe') || name.includes('coffee')) {
    
    // Dynamic specialty depending on business name nuances
    let specialty1 = { title: 'Artisan Espresso & Manual Pour-Overs', desc: 'Single-estate Arabica, slow Chemex drips, silky flat whites, and nitro cold brews.', icon: 'fa-mug-hot' };
    if (name.includes('roast') || name.includes('brew')) {
      specialty1 = { title: 'In-House Micro-Batch Roastery', desc: 'Sustainably sourced green beans from Chikmagalur & Coorg, roasted on-site in small batches.', icon: 'fa-fire-burner' };
    }

    let specialty2 = { title: 'Oven-Fresh Artisanal Viennoiserie', desc: 'Twice-baked almond croissants, Belgian chocolate babkas, and warm sourdough brioche.', icon: 'fa-bread-slice' };
    if (name.includes('bake') || name.includes('crumb') || name.includes('cake')) {
      specialty2 = { title: 'Gourmet French Pastries & Celebration Cakes', desc: 'Crisp fruit tarts, layered macarons, and bespoke celebration cakes made fresh every morning.', icon: 'fa-cake-candles' };
    }

    let specialty3 = { title: 'Cozy Workspaces & High-Speed WiFi', desc: 'Dedicated quiet corners, ample power sockets, natural sunlit nooks, and serene background jazz.', icon: 'fa-laptop' };
    if (name.includes('garden') || name.includes('courtyard') || name.includes('heritage')) {
      specialty3 = { title: 'Lush Courtyard & Open-Air Garden', desc: 'Tranquil alfresco seating under fairy-lit trees with refreshing breezes and relaxed vibes.', icon: 'fa-tree' };
    }

    const specialty4 = { title: 'Chef’s Gourmet Brunch & Superfoods', desc: 'Hass avocado tartines, truffle scrambled brioche, acai bowls, and botanical coolers.', icon: 'fa-utensils' };

    // Rich Interactive Menu Items
    const menuCategories = [
      {
        id: 'brews',
        name: 'Specialty Brews',
        icon: 'fa-mug-saucer',
        items: [
          { name: 'Single-Origin Chemex Pour-Over', price: '₹220', notes: 'Ethiopian Yirgacheffe • Jasmine, Citrus & Stonefruit', badge: 'Barista Pick', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' },
          { name: 'Spanish Velvet Latte', price: '₹240', notes: 'Double ristretto, condensed milk, steamed microfoam, cinnamon', badge: 'Best Seller', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80' },
          { name: '18-Hour Slow Steeped Cold Brew', price: '₹210', notes: 'Zero bitterness, dark cocoa finish, served with orange slice', badge: 'House Signature', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80' },
          { name: 'Artisan Cortado & Flat White', price: '₹190', notes: 'Equal parts espresso & velvety steamed whole milk', badge: 'Classic', img: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      {
        id: 'bakes',
        name: 'Artisanal Bakes',
        icon: 'fa-bread-slice',
        items: [
          { name: 'Almond Butter Double Croissant', price: '₹180', notes: 'Twice-baked French butter croissant filled with frangipane', badge: 'Fresh Daily', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80' },
          { name: 'Belgian Dark Chocolate Babka', price: '₹210', notes: 'Swirled sourdough brioche with 70% dark melted Callebaut', badge: 'Chef Special', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80' },
          { name: 'Wild Berry Sourdough Danish', price: '₹195', notes: 'Crispy blistered golden crust with seasonal berry compote', badge: 'Organic', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
          { name: 'Truffle Mushroom Sourdough Melt', price: '₹260', notes: 'Woodfired sourdough with molten Gruyère & sautéed mushrooms', badge: 'Savory', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      {
        id: 'brunch',
        name: 'Gourmet Brunch',
        icon: 'fa-utensils',
        items: [
          { name: 'Hass Avocado & Poached Egg Brioche', price: '₹320', notes: 'Mashed Hass avocado, Danish feta, chili crunch, toasted brioche', badge: 'Must Try', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80' },
          { name: 'Burrata & Sun-Ripened Tomato Tartine', price: '₹340', notes: 'Creamy local burrata, basil walnut pesto, 12yr aged balsamic', badge: 'Gourmet', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80' },
          { name: 'Amazonian Acai Superfood Bowl', price: '₹290', notes: 'Organic acai, house granola, chia seeds, goji berries & honey', badge: 'Healthy', img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=300&q=80' },
          { name: 'Turkish Shakshuka Skillet', price: '₹310', notes: 'Spiced bell pepper & tomato ragu, poached eggs, sourdough pita', badge: 'Hot Plate', img: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      {
        id: 'coolers',
        name: 'Botanical Coolers',
        icon: 'fa-wine-glass',
        items: [
          { name: 'Yuzu Sparkling Cold Brew Tonic', price: '₹230', notes: 'Japanese yuzu citrus, artisanal tonic, espresso float', badge: 'Effervescent', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80' },
          { name: 'Ceremonial Uji Iced Matcha Latte', price: '₹260', notes: 'Kyoto stone-ground green tea whisked with oat milk', badge: 'Antioxidant', img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=300&q=80' },
          { name: 'Wild Hibiscus & Pink Rose Soda', price: '₹190', notes: 'Cold-steeped organic flowers with bubbly mountain soda', badge: 'Botanical', img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=300&q=80' },
          { name: 'Gourmet Belgian Hot Chocolate', price: '₹240', notes: 'Single-origin molten chocolate callets, sea salt, toasted cream', badge: 'Indulgent', img: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=300&q=80' }
        ]
      }
    ];

    return {
      nicheKey: 'cafe',
      themeColor: 'amber',
      accentHex: '#d97706',
      badge: `Luxury Specialty Cafe & Roastery in ${city}`,
      heroTagline: `${bizName} — Specialty Coffee, Fresh Bakes & Warm Vibe in ${city}`,
      heroSub: `Immerse yourself in velvety handcrafted espresso, slow-steeped single-origin roasts, and oven-fresh artisanal bakes. ${bizName} is ${city}'s premier neighborhood sanctuary.`,
      heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
      navCta: 'Reserve a Table',
      primaryCta: 'Explore Menu & Reserve',
      secondaryCta: 'Call Barista',
      servicesHeading: 'Signature Coffee & Culinary Craft',
      servicesSub: `Every creation is a tribute to passion, quality ingredients, and hospitality at ${bizName}.`,
      services: [specialty1, specialty2, specialty3, specialty4],
      menuCategories,
      galleryHeading: `Vibes, Brews & Ambiance at ${bizName}`,
      gallerySub: `A glimpse into our sunlit corners, barista artistry, and relaxing spaces waiting for you in ${city}.`,
      gallery: [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80'
      ],
      testimonials: [
        {
          name: 'Sarah J.',
          loc: `${city} Resident`,
          text: `Hands down the most refined coffee experience in ${city}! The baristas at ${bizName} are passionate masters, and the almond butter croissants are unmatched.`,
          rating: 5
        },
        {
          name: 'Rahul M.',
          loc: `Local Foodie & Writer`,
          text: `The ambiance at ${bizName} is an effortless 10/10. Warm aesthetic lighting, extraordinary cold brew floats, and calm welcoming energy. My daily sanctuary.`,
          rating: 5
        },
        {
          name: 'Priya S.',
          loc: `Architect & Designer`,
          text: `Exceptional design, flawless acoustics, and world-class coffee. The Spanish Velvet Latte at ${bizName} is worth traveling across ${city} for!`,
          rating: 5
        }
      ],
      contactBadge: 'Table Reservation',
      contactTitle: `Experience the Warmth of ${bizName}`,
      contactSub: `Reserve your preferred seating ahead of time for an intimate coffee date, business discussion, or weekend brunch.`,
      formTitle: `Reserve a Table or Pre-Order`,
      formSub: 'Instant booking • No wait time • WhatsApp confirmation',
      formServiceLabel: 'Seating Preference',
      formOptions: ['Indoor Cozy Lounge (Air-Conditioned)', 'Alfresco Garden & Courtyard', 'Quiet High-Top Workstation (Power & WiFi)', 'Private Gathering Corner (4–8 Guests)'],
      formSubmitText: `Confirm Reservation at ${bizName}`
    };
  }

  // 2. RESTAURANT
  if (cat.includes('restaurant') || cat.includes('dining') || cat.includes('food') || cat.includes('bistro')) {
    return {
      nicheKey: 'restaurant',
      themeColor: 'rose',
      accentHex: '#e11d48',
      badge: `#1 Fine Dining Destination in ${city}`,
      heroTagline: `Exquisite Flavors & Unforgettable Dining at ${bizName}`,
      heroSub: `Experience signature culinary creations prepared by master chefs using farm-fresh seasonal ingredients in an elegant, vibrant setting in ${city}.`,
      heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      navCta: 'Reserve a Table',
      primaryCta: 'Book Dining Table',
      secondaryCta: 'Call Restaurant',
      servicesHeading: 'Chef’s Signature Selections',
      servicesSub: `Immerse yourself in authentic gourmet dishes, candlelit ambiance, and personalized hospitality at ${bizName}.`,
      services: [
        { title: 'Chef’s Multi-Course Tasting Menu', desc: 'Curated culinary journeys honoring authentic regional heritage and modern gastronomy.', icon: 'fa-award' },
        { title: 'Intimate Candlelight Reservations', desc: 'Reserve your romantic table or family celebration with seamless confirmation.', icon: 'fa-champagne-glasses' },
        { title: 'Private Dining & Corporate Banquets', desc: 'Exclusive private halls, tailored banquet menus, and dedicated sommelier service.', icon: 'fa-users' },
        { title: 'Artisan Mixology & Pastry Cart', desc: 'Handcrafted botanical cocktails, mocktails, and decadent warm desserts.', icon: 'fa-heart' }
      ],
      galleryHeading: `Dining Ambiance at ${bizName}`,
      gallerySub: `An authentic taste of elegance, passion, and flavor in ${city}.`,
      gallery: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80'
      ],
      testimonials: [
        { name: 'Vikram M.', loc: `${city} Resident`, text: `Best dining experience in ${city}. Every dish at ${bizName} was plated with elegance and tasted sensational!`, rating: 5 },
        { name: 'Ananya S.', loc: `Food Critic`, text: `A masterclass in culinary balance. The ambiance and service at ${bizName} are truly world-class.`, rating: 5 },
        { name: 'David W.', loc: `Business Traveler`, text: `Flawless execution for our corporate dinner. All our guests were thoroughly impressed.`, rating: 5 }
      ],
      contactBadge: 'Reservations',
      contactTitle: `Reserve Your Table at ${bizName}`,
      contactSub: `Enjoy guaranteed seating with zero wait times during prime dinner hours in ${city}.`,
      formTitle: `Book a Dining Table`,
      formSub: 'Guaranteed seating • Instant WhatsApp confirmation',
      formServiceLabel: 'Dining Room Preference',
      formOptions: ['Main Dining Hall', 'Private Dining Room', 'Romantic Terrace Table', 'Family Lounge Section'],
      formSubmitText: `Book Table at ${bizName}`
    };
  }

  // 3. DEFAULT (HOME SERVICES, CLINICS, SALONS, TRADES)
  const cleanCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Professional';
  return {
    nicheKey: 'general',
    themeColor: 'indigo',
    accentHex: '#4f46e5',
    badge: `#1 Rated ${cleanCategory} in ${city}`,
    heroTagline: `Top-Rated ${cleanCategory} Services You Can Rely On in ${city} — ${bizName}`,
    heroSub: `Dedicated professionals committed to delivering exceptional craftsmanship, personalized customer care, and reliable results on every single project.`,
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    navCta: 'Get Free Quote',
    primaryCta: 'Request Free Estimate',
    secondaryCta: `Call ${bizName}`,
    servicesHeading: `Specialized ${cleanCategory} Services in ${city}`,
    servicesSub: `Our seasoned specialists handle projects of all sizes with modern techniques and guaranteed satisfaction at ${bizName}.`,
    services: [
      { title: `Expert ${cleanCategory} Consultations`, desc: `Honest, detailed assessments and clear upfront transparent pricing before any project begins.`, icon: 'fa-circle-check' },
      { title: 'Premium Craftsmanship & Execution', desc: 'Using high-grade materials, proven industry techniques, and obsessive attention to detail.', icon: 'fa-award' },
      { title: '100% Satisfaction Guarantee', desc: 'Every service is backed by our customer satisfaction promise and dependable local warranty.', icon: 'fa-shield-halved' },
      { title: 'Fast & Reliable Scheduling', desc: 'Flexible appointment times and rapid prompt response tailored to your schedule.', icon: 'fa-clock' }
    ],
    galleryHeading: `Recent Work & Projects in ${city}`,
    gallerySub: `A glimpse into the daily dedication and results delivered by ${bizName} throughout ${city}.`,
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80'
    ],
    testimonials: [
      { name: 'Sarah J.', loc: `${city} Resident`, text: `Called ${bizName} and they arrived right on time, explained everything clearly, and finished the work with zero mess. Highly recommend!`, rating: 5 },
      { name: 'Michael T.', loc: `${city} Homeowner`, text: `Absolute 5-star experience with ${bizName}. Best service in ${city} by a long shot. Transparent prices with no hidden surprises.`, rating: 5 },
      { name: 'Emily C.', loc: `Local Business Owner`, text: `Professional, courteous, and very experienced. Will definitely be our first call for any future projects!`, rating: 5 }
    ],
    contactBadge: 'Direct Booking',
    contactTitle: `Ready for Quality Service? Get Your Free Estimate Today`,
    contactSub: `Fill out the quick quote form and our team at ${bizName} will get back to you promptly with transparent pricing.`,
    formTitle: `Book an Appointment / Quote`,
    formSub: 'No obligation • 100% Free upfront evaluation',
    formServiceLabel: 'Service Needed',
    formOptions: [`Standard ${cleanCategory} Service`, `Custom ${cleanCategory} Project`, `Urgent / Same-Day Service`, 'Consultation & Inspection'],
    formSubmitText: `Submit Request to ${bizName}`
  };
}

/**
 * Builds the complete modern, luxury, fully animated HTML demo website for the prospect
 */
function generateSiteHTML(prospect, siteId, options = {}) {
  const city = prospect.city || 'Jaipur';
  const bizName = prospect.business_name || 'Local Business';
  const phone = prospect.phone || '+91 8920608191';
  const phoneDigits = phone.replace(/[^0-9]/g, '') || '918920608191';
  const rating = prospect.rating || 4.8;
  const reviews = prospect.review_count || 48;
  
  const baseUrlOption = options.baseUrl || 'https://leads-gen-b3uj.onrender.com';
  const baseUrl = (typeof baseUrlOption === 'object' && baseUrlOption?.baseUrl) 
    ? baseUrlOption.baseUrl 
    : (typeof baseUrlOption === 'string' ? baseUrlOption : 'https://leads-gen-b3uj.onrender.com');

  const config = db.getConfig();
  const rawSenderWa = config.sender_whatsapp || '918920608191';
  const agencyWhatsApp = rawSenderWa.replace(/[^0-9]/g, '') || '918920608191';
  const senderName = config.sender_name || 'Devesh Kumar';
  const senderEmail = config.sender_email || 'deveshtesting9672@gmail.com';

  // Get custom tailored profile matching this specific business and niche
  const profile = getBespokeNicheProfile(prospect.category, bizName, city);

  // WhatsApp quick text for customer to contact business
  const customerWaText = profile.nicheKey === 'cafe'
    ? `Hi ${bizName}! I saw your website and would like to reserve a table or ask about your menu.`
    : `Hi ${bizName}! I would like to inquire about your services.`;

  // WhatsApp claim text for business owner to claim from developer
  const claimWaText = `Hi ${senderName}! I am the owner of ${bizName} in ${city}. I saw the luxury website demo you built for us (${baseUrl}/demos/${siteId}) and I would like to claim, customize and launch it!`;

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${bizName} | Luxury Specialty Cafe & Coffee House (${city})</title>
  <meta name="description" content="${profile.heroTagline}">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    body { 
      font-family: 'Plus Jakarta Sans', sans-serif; 
      background-color: #070504; 
      color: #f5f5f4; 
      overflow-x: hidden;
    }
    .font-serif-luxury {
      font-family: 'Playfair Display', serif;
    }
    .font-cormorant {
      font-family: 'Cormorant Garamond', serif;
    }

    /* Ambient Warm Gold Glow & Deep Velvet Lighting */
    .glow-radial-gold {
      background: radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.22) 0%, rgba(180, 83, 9, 0.08) 45%, rgba(7, 5, 4, 0) 80%);
    }
    .glow-orb-1 {
      position: absolute;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(0, 0, 0, 0) 70%);
      filter: blur(90px);
      pointer-events: none;
      border-radius: 50%;
    }
    .glow-orb-2 {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(180, 83, 9, 0.14) 0%, rgba(0, 0, 0, 0) 70%);
      filter: blur(100px);
      pointer-events: none;
      border-radius: 50%;
    }

    /* 3D Perspective Containers */
    .perspective-container {
      perspective: 1200px;
    }

    /* 3D Interactive Card Tilt */
    .tilt-card-3d {
      transform-style: preserve-3d;
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
      will-change: transform;
      position: relative;
    }
    .tilt-card-3d:hover {
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px 2px rgba(245, 158, 11, 0.2);
    }
    .tilt-card-3d .depth-layer-1 {
      transform: translateZ(15px);
      transition: transform 0.2s ease;
    }
    .tilt-card-3d .depth-layer-2 {
      transform: translateZ(30px);
      transition: transform 0.2s ease;
    }
    .tilt-card-3d .depth-layer-3 {
      transform: translateZ(45px);
      transition: transform 0.2s ease;
    }

    /* Dynamic 3D Glare Overlay */
    .glare-3d {
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.3s ease;
      mix-blend-mode: overlay;
      z-index: 10;
    }

    /* 3D Holographic AI Barista Orbital Rings */
    @keyframes spinOrb1 {
      0% { transform: rotateX(65deg) rotateZ(0deg); }
      100% { transform: rotateX(65deg) rotateZ(360deg); }
    }
    @keyframes spinOrb2 {
      0% { transform: rotateY(65deg) rotateZ(0deg); }
      100% { transform: rotateY(65deg) rotateZ(-360deg); }
    }
    @keyframes float3d {
      0%, 100% { transform: translateY(0) rotateX(0deg) rotateY(0deg); }
      50% { transform: translateY(-12px) rotateX(4deg) rotateY(-4deg); }
    }
    .orbital-ring-1 {
      animation: spinOrb1 10s linear infinite;
      transform-style: preserve-3d;
    }
    .orbital-ring-2 {
      animation: spinOrb2 14s linear infinite;
      transform-style: preserve-3d;
    }
    .float-3d-element {
      animation: float3d 5s ease-in-out infinite;
    }

    /* Animated Coffee Steam Keyframes */
    @keyframes steamVapor {
      0% {
        transform: translateY(0) scaleX(1);
        opacity: 0;
      }
      15% {
        opacity: 0.85;
      }
      50% {
        transform: translateY(-20px) scaleX(1.4);
      }
      95% {
        opacity: 0.2;
      }
      100% {
        transform: translateY(-40px) scaleX(1.9);
        opacity: 0;
      }
    }
    .steam-line-1 { animation: steamVapor 2.8s infinite ease-out; }
    .steam-line-2 { animation: steamVapor 3.2s infinite ease-out 0.6s; }
    .steam-line-3 { animation: steamVapor 3.0s infinite ease-out 1.2s; }

    /* Shimmer Gold Animation */
    @keyframes shimmerGold {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .gold-shimmer-btn {
      background: linear-gradient(90deg, #d97706 0%, #fbbf24 35%, #ffd700 50%, #fbbf24 65%, #d97706 100%);
      background-size: 200% auto;
      animation: shimmerGold 4s linear infinite;
      box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
    }

    /* Floating Beacon Animation */
    @keyframes radarPulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 16px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .radar-pulse { animation: radarPulse 2s infinite; }

    /* Glassmorphism Cards */
    .glass-card {
      background: rgba(22, 16, 12, 0.72);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(245, 158, 11, 0.18);
    }
    .glass-card:hover {
      border-color: rgba(245, 158, 11, 0.5);
    }
  </style>
</head>
<body class="selection:bg-amber-500 selection:text-black">

  <!-- Top Sticky Agency Claim Banner -->
  <div class="bg-gradient-to-r from-[#17100b] via-[#24170e] to-[#17100b] text-white text-xs sm:text-sm py-2.5 px-4 shadow-2xl sticky top-0 z-50 border-b border-amber-500/30 backdrop-blur-md">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
      <div class="flex items-center gap-2 font-medium">
        <span class="inline-flex items-center justify-center bg-gradient-to-r from-amber-400 to-amber-600 text-black rounded-full w-5 h-5 text-xs font-black shadow animate-pulse">✨</span>
        <span class="text-amber-200/90"><strong>Luxury AI Website Demo</strong> handcrafted for <strong>${bizName}</strong></span>
      </div>
      <div class="flex items-center gap-3">
        <a href="https://wa.me/${agencyWhatsApp}?text=${encodeURIComponent(claimWaText)}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-4 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-105">
          <i class="fa-brands fa-whatsapp text-sm"></i>
          <span>Claim on WhatsApp (+91 8920608191)</span>
        </a>
        <button onclick="document.getElementById('claim-modal').classList.remove('hidden')" class="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold px-3.5 py-1.5 rounded-full text-xs transition hover:scale-105">
          Claim Demo
        </button>
      </div>
    </div>
  </div>

  <!-- Main Navigation -->
  <header class="bg-[#120d09]/90 backdrop-blur-xl border-b border-amber-950/60 sticky top-11 z-40 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      <!-- Brand Logo -->
      <a href="#" class="flex items-center gap-3.5 group">
        <div class="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 text-amber-100 flex items-center justify-center font-bold text-xl shadow-xl shadow-amber-950/40 border border-amber-500/30 group-hover:scale-105 transition duration-300">
          <i class="fa-solid fa-mug-hot text-amber-200"></i>
          <!-- Steam Lines Animation -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
            <span class="w-1 h-3 bg-amber-300/60 rounded-full steam-line-1"></span>
            <span class="w-1 h-4 bg-amber-200/80 rounded-full steam-line-2"></span>
            <span class="w-1 h-3 bg-amber-400/60 rounded-full steam-line-3"></span>
          </div>
        </div>
        <div>
          <span class="text-xl sm:text-2xl font-serif-luxury font-bold tracking-wide text-amber-50 block leading-tight group-hover:text-amber-300 transition">${bizName}</span>
          <span class="text-[11px] uppercase tracking-widest text-amber-500/90 font-semibold">${city} • Specialty Roastery & Cafe</span>
        </div>
      </a>
      
      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-8 font-medium text-stone-300 text-sm">
        <a href="#about" class="hover:text-amber-400 transition">Our Story</a>
        <a href="#menu" class="hover:text-amber-400 transition flex items-center gap-1.5">
          <span>Artisan Menu</span>
          <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">Live</span>
        </a>
        <a href="#ambiance" class="hover:text-amber-400 transition">Ambiance</a>
        <a href="#reviews" class="hover:text-amber-400 transition">Reviews</a>
        <a href="#reserve" class="hover:text-amber-400 transition">Table Booking</a>
      </nav>

      <!-- Header Action -->
      <div class="flex items-center gap-3">
        <a href="tel:${phone}" class="hidden lg:flex items-center gap-2 text-stone-300 font-medium hover:text-amber-400 text-xs px-3 py-2 rounded-xl border border-stone-800 hover:border-amber-500/30 transition">
          <i class="fa-solid fa-phone text-amber-400"></i>
          <span>${phone}</span>
        </a>
        <a href="#reserve" class="gold-shimmer-btn text-black font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-amber-900/40 transition hover:scale-105 active:scale-95">
          ${profile.navCta}
        </a>
      </div>

    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 glow-radial-gold">
    <!-- Ambient Glow Orbs -->
    <div class="glow-orb-1 top-10 left-1/4"></div>
    <div class="glow-orb-2 bottom-10 right-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        <!-- Left Hero Content -->
        <div class="lg:col-span-7 space-y-7">
          
          <div class="inline-flex items-center gap-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>${profile.badge}</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-amber-50 tracking-tight leading-[1.12]">
            ${bizName} <br/>
            <span class="font-cormorant italic text-amber-300 font-normal text-3xl sm:text-4xl lg:text-5xl">Where Precision Brews Meet Warm Ambiance</span>
          </h1>

          <p class="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-light">
            ${profile.heroSub}
          </p>

          <!-- Interactive Action Buttons -->
          <div class="flex flex-wrap items-center gap-4 pt-2">
            <a href="#menu" class="gold-shimmer-btn text-black font-extrabold px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-900/40 transition hover:scale-105 flex items-center gap-2 text-sm sm:text-base">
              <i class="fa-solid fa-mug-hot"></i>
              <span>Explore Artisan Menu</span>
            </a>
            <a href="#reserve" class="bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-amber-500/30 hover:border-amber-500/60 font-bold px-7 py-3.5 rounded-2xl transition flex items-center gap-2 text-sm sm:text-base backdrop-blur-md">
              <i class="fa-solid fa-calendar-check text-amber-400"></i>
              <span>Reserve a Table</span>
            </a>
          </div>

          <!-- Social Proof & Badges -->
          <div class="pt-6 border-t border-stone-800/80 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-stone-300">
            <div class="flex items-center gap-2">
              <div class="flex text-amber-400 text-sm">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <span class="font-bold text-white text-sm">${rating}</span>
              <span class="text-stone-400">(${reviews} Google Reviews)</span>
            </div>
            <div class="flex items-center gap-2 text-amber-300 font-medium">
              <i class="fa-solid fa-leaf text-amber-400"></i>
              <span>Single-Origin Arabica</span>
            </div>
            <div class="flex items-center gap-2 text-amber-300 font-medium">
              <i class="fa-solid fa-wifi text-amber-400"></i>
              <span>High-Speed Workspaces</span>
            </div>
          </div>

        </div>

        <!-- Right Hero 3D Interactive Studio with Live Three.js Experience -->
        <div class="lg:col-span-5 relative perspective-container">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/40 glass-card tilt-card-3d group">
            
            <!-- Dynamic 3D Glare Overlay -->
            <div class="glare-3d"></div>

            <!-- Top 3D Control Header -->
            <div class="px-5 py-3.5 border-b border-amber-500/20 bg-black/40 backdrop-blur-md flex items-center justify-between z-20 relative depth-layer-2">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span class="text-xs font-bold text-amber-300 font-mono tracking-wider">3D REAL-TIME STUDIO</span>
              </div>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Interactive 360°
              </span>
            </div>

            <!-- 3D Three.js Container -->
            <div id="canvas-3d-container" class="relative w-full h-[420px] sm:h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center bg-radial from-[#1e130b] via-[#100b07] to-[#070504]">
              <!-- Ambient 3D Rotating Rings Background -->
              <div class="absolute w-72 h-72 rounded-full border border-amber-500/20 orbital-ring-1 pointer-events-none"></div>
              <div class="absolute w-84 h-84 rounded-full border border-amber-400/10 orbital-ring-2 pointer-events-none"></div>

              <!-- Interactive Drag & Tap Prompt -->
              <div class="absolute top-4 left-4 z-10 pointer-events-none depth-layer-1">
                <span class="text-[10px] text-stone-300 bg-black/70 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                  <i class="fa-solid fa-arrows-up-down-left-right text-amber-400"></i>
                  <span>Drag 360° • Click cup for steam burst</span>
                </span>
              </div>
            </div>
            
            <!-- Floating Live Status Overlay with 3D Depth Layers -->
            <div class="absolute bottom-4 left-4 right-4 p-4 rounded-2xl glass-card text-white z-20 depth-layer-3 border border-amber-500/30 shadow-2xl">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Open Today In ${city}
                </span>
                <span class="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">Micro-Batch Roastery</span>
              </div>
              <h4 class="font-serif-luxury font-bold text-lg text-amber-100">${bizName}</h4>
              <p class="text-xs text-stone-300">${prospect.address || city + ' Downtown'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Interactive 3D Holographic AI Barista Concierge -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16 relative z-20 perspective-container">
    <div class="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1c130b] via-[#140e0a] to-[#070504] border border-amber-500/40 shadow-2xl relative overflow-hidden tilt-card-3d">
      <div class="glare-3d"></div>
      <div class="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-amber-900/30 depth-layer-1">
        <div class="flex items-start gap-4">
          <!-- 3D Holographic AI Avatar Orb -->
          <div class="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-950 flex items-center justify-center shrink-0 border border-amber-500/40 shadow-lg shadow-amber-950/60 float-3d-element">
            <i class="fa-solid fa-wand-magic-sparkles text-amber-300 text-xl"></i>
            <div class="absolute inset-0 rounded-2xl border border-amber-400/30 orbital-ring-1 pointer-events-none"></div>
          </div>
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <span>Interactive 3D AI Concierge</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-serif-luxury font-bold text-amber-50">
              Ask Barista AI: What Should You Order at ${bizName}?
            </h3>
            <p class="text-xs sm:text-sm text-stone-400 mt-1">
              Select your craving below to generate a tailored single-origin tasting pairing.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-semibold text-emerald-300">AI Concierge Online</span>
        </div>
      </div>

      <!-- Quick Mood Buttons with 3D Depth Layers -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 depth-layer-2">
        <button onclick="handleAiBarista('work')" class="p-3.5 rounded-2xl bg-stone-900/80 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/50 text-left transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/20">
          <div class="text-amber-400 text-lg mb-1 group-hover:scale-125 transition duration-300">⚡</div>
          <div class="font-bold text-xs sm:text-sm text-amber-100">Work & Deep Focus</div>
          <div class="text-[11px] text-stone-400 mt-0.5">High energy, low crash</div>
        </button>

        <button onclick="handleAiBarista('chill')" class="p-3.5 rounded-2xl bg-stone-900/80 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/50 text-left transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/20">
          <div class="text-amber-400 text-lg mb-1 group-hover:scale-125 transition duration-300">🌿</div>
          <div class="font-bold text-xs sm:text-sm text-amber-100">Light & Refreshing</div>
          <div class="text-[11px] text-stone-400 mt-0.5">Iced, floral & crisp</div>
        </button>

        <button onclick="handleAiBarista('sweet')" class="p-3.5 rounded-2xl bg-stone-900/80 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/50 text-left transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/20">
          <div class="text-amber-400 text-lg mb-1 group-hover:scale-125 transition duration-300">🥐</div>
          <div class="font-bold text-xs sm:text-sm text-amber-100">Sweet Pastry Craving</div>
          <div class="text-[11px] text-stone-400 mt-0.5">Warm oven indulgence</div>
        </button>

        <button onclick="handleAiBarista('brunch')" class="p-3.5 rounded-2xl bg-stone-900/80 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-500/50 text-left transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/20">
          <div class="text-amber-400 text-lg mb-1 group-hover:scale-125 transition duration-300">🥑</div>
          <div class="font-bold text-xs sm:text-sm text-amber-100">Artisanal Brunch</div>
          <div class="text-[11px] text-stone-400 mt-0.5">Wholesome & filling</div>
        </button>
      </div>

      <!-- Recommendation Display Box -->
      <div id="ai-response-box" class="mt-6 p-4 sm:p-5 rounded-2xl bg-[#0f0b08] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 depth-layer-3 shadow-xl">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
            <i class="fa-solid fa-robot text-lg"></i>
          </div>
          <div>
            <div class="text-[11px] uppercase tracking-wider text-amber-500 font-bold" id="ai-response-title">Barista AI Tip:</div>
            <p class="text-xs sm:text-sm text-stone-200 mt-0.5 leading-relaxed" id="ai-response-text">
              Looking for a perfect morning start? We recommend pairing our <strong>Double-Shot Spanish Cortado</strong> with our freshly baked <strong>Almond Butter Croissant</strong>!
            </p>
          </div>
        </div>
        <a id="ai-order-btn" href="https://wa.me/${phoneDigits}?text=Hi%20${encodeURIComponent(bizName)}!%20I%20would%20like%20to%20order%20the%20Double-Shot%20Spanish%20Cortado%20with%20Almond%20Croissant." target="_blank" rel="noopener noreferrer" class="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 hover:scale-105">
          <i class="fa-brands fa-whatsapp text-sm"></i>
          <span>Order on WhatsApp</span>
        </a>
      </div>

    </div>
  </section>

  <!-- Interactive Menu Section with Live Filter Tabs -->
  <section id="menu" class="py-20 bg-[#0e0a07] border-y border-amber-950/40 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-amber-500 font-bold uppercase tracking-widest text-xs flex items-center gap-1.5">
            <i class="fa-solid fa-mug-saucer"></i>
            <span>Carefully Roasted & Crafted</span>
          </span>
          <h2 class="text-3xl sm:text-4xl font-serif-luxury font-bold text-amber-50 mt-2">
            The Artisan Menu at ${bizName}
          </h2>
        </div>
        
        <!-- Menu Tabs -->
        <div class="flex flex-wrap items-center gap-2" id="menu-tabs">
          <button onclick="filterMenu('all', this)" class="menu-tab-btn active px-4 py-2 rounded-xl text-xs font-bold transition bg-amber-500 text-black shadow-md">
            All Items
          </button>
          <button onclick="filterMenu('brews', this)" class="menu-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-stone-900 text-stone-300 hover:text-amber-300 border border-stone-800">
            ☕ Specialty Brews
          </button>
          <button onclick="filterMenu('bakes', this)" class="menu-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-stone-900 text-stone-300 hover:text-amber-300 border border-stone-800">
            🥐 Artisanal Bakes
          </button>
          <button onclick="filterMenu('brunch', this)" class="menu-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-stone-900 text-stone-300 hover:text-amber-300 border border-stone-800">
            🥑 Gourmet Brunch
          </button>
          <button onclick="filterMenu('coolers', this)" class="menu-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition bg-stone-900 text-stone-300 hover:text-amber-300 border border-stone-800">
            ✨ Coolers & Tonics
          </button>
        </div>
      </div>

      <!-- Menu Grid with 3D Perspective Tilt -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container" id="menu-grid">
        ${(profile.menuCategories || []).flatMap(cat => cat.items.map(item => `
          <div class="menu-item-card glass-card tilt-card-3d rounded-2xl p-4 flex flex-col justify-between group border border-amber-500/20 hover:border-amber-500/60" data-category="${cat.id}">
            <div class="glare-3d"></div>
            <div>
              <div class="relative h-44 rounded-xl overflow-hidden mb-4 bg-stone-900 depth-layer-2 shadow-lg">
                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                <div class="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40 depth-layer-3 shadow">
                  ${item.badge}
                </div>
              </div>

              <div class="flex items-start justify-between gap-2 mb-1.5 depth-layer-1">
                <h4 class="font-serif-luxury font-bold text-base text-amber-50 group-hover:text-amber-300 transition leading-snug">
                  ${item.name}
                </h4>
                <span class="text-amber-400 font-extrabold text-sm shrink-0 font-mono">${item.price}</span>
              </div>
              <p class="text-xs text-stone-400 leading-relaxed depth-layer-1 font-light">${item.notes}</p>
            </div>

            <div class="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between depth-layer-2">
              <span class="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">${cat.name}</span>
              <a href="https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hi ${bizName}! I would like to order the ${item.name} (${item.price}).`)}" target="_blank" rel="noopener noreferrer" class="text-xs text-amber-400 hover:text-amber-200 font-bold flex items-center gap-1.5 transition py-1 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-black">
                <span>Order 3D</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>
          </div>
        `)).join('')}
      </div>

    </div>
  </section>

  <!-- Offerings & Specialties with 3D Tilt -->
  <section id="about" class="py-20 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-amber-500 font-bold uppercase tracking-widest text-xs">Uncompromising Craftsmanship</span>
        <h2 class="text-3xl sm:text-4xl font-serif-luxury font-bold text-amber-50 mt-2">
          ${profile.servicesHeading}
        </h2>
        <p class="text-stone-400 mt-3 text-sm sm:text-base leading-relaxed">
          ${profile.servicesSub}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
        ${profile.services.map(s => `
          <div class="glass-card tilt-card-3d rounded-2xl p-6 flex flex-col justify-between group border border-amber-500/20 hover:border-amber-500/50">
            <div class="glare-3d"></div>
            <div>
              <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xl mb-5 group-hover:bg-amber-500 group-hover:text-black transition duration-300 border border-amber-500/30 depth-layer-2 shadow-lg">
                <i class="fa-solid ${s.icon}"></i>
              </div>
              <h3 class="text-lg font-serif-luxury font-bold text-amber-100 group-hover:text-amber-300 transition depth-layer-1">${s.title}</h3>
              <p class="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed font-light depth-layer-1">${s.desc}</p>
            </div>
            <div class="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between text-xs font-semibold text-amber-400 depth-layer-2">
              <span>Experience at ${bizName}</span>
              <i class="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition duration-300"></i>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  </section>

  <!-- Photo Gallery & Ambiance -->
  <section id="ambiance" class="py-20 bg-[#0e0a07] border-y border-amber-950/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-amber-500 font-bold uppercase tracking-widest text-xs">Warm Aesthetics</span>
          <h2 class="text-3xl sm:text-4xl font-serif-luxury font-bold text-amber-50 mt-2">${profile.galleryHeading}</h2>
        </div>
        <p class="text-stone-400 max-w-md text-xs sm:text-sm">
          ${profile.gallerySub}
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
        ${profile.gallery.map((img, i) => `
          <div class="rounded-2xl overflow-hidden shadow-2xl group relative h-64 bg-stone-900 border border-amber-500/20 tilt-card-3d">
            <div class="glare-3d"></div>
            <img src="${img}" alt="Ambiance ${i+1}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700 depth-layer-1">
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 depth-layer-2">
              <span class="text-amber-200 font-serif-luxury font-bold text-sm drop-shadow">${bizName} • ${city}</span>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  </section>

  <!-- Verified Customer Reviews with 3D Tilt -->
  <section id="reviews" class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="text-amber-500 font-bold uppercase tracking-widest text-xs">Customer Stories</span>
        <h2 class="text-3xl sm:text-4xl font-serif-luxury font-bold text-amber-50 mt-2">Loved by Locals in ${city}</h2>
        <div class="flex items-center justify-center gap-2 mt-3">
          <div class="flex text-amber-400 text-sm">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <span class="font-bold text-stone-200 text-sm">Rated ${rating}/5 from ${reviews} verified Google reviews</span>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6 perspective-container">
        ${profile.testimonials.map(t => `
          <div class="glass-card tilt-card-3d rounded-2xl p-6 flex flex-col justify-between border border-amber-500/20 hover:border-amber-500/50">
            <div class="glare-3d"></div>
            <div>
              <div class="flex text-amber-400 text-xs mb-3.5 depth-layer-1">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
              <p class="text-stone-300 italic text-xs sm:text-sm leading-relaxed mb-6 font-light depth-layer-1">"${t.text}"</p>
            </div>
            <div class="flex items-center gap-3 pt-4 border-t border-stone-800 depth-layer-2">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-900 text-amber-100 font-bold flex items-center justify-center text-sm shadow">
                ${t.name.charAt(0)}
              </div>
              <div>
                <h4 class="font-serif-luxury font-bold text-sm text-amber-100">${t.name}</h4>
                <span class="text-[11px] text-stone-500">${t.loc}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  </section>

  <!-- Interactive Live Table Reservation System with 3D Seating Map -->
  <section id="reserve" class="py-20 bg-[#0d0906] border-t border-amber-950/40 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-12 gap-12 items-center">
        
        <div class="lg:col-span-6 space-y-6">
          <span class="text-amber-500 font-bold uppercase tracking-widest text-xs">${profile.contactBadge}</span>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-amber-50 leading-tight">
            ${profile.contactTitle}
          </h2>
          <p class="text-stone-400 text-sm sm:text-base leading-relaxed font-light">
            ${profile.contactSub}
          </p>

          <!-- 3D Interactive Floorplan Ambiance Selector -->
          <div class="space-y-3 pt-2">
            <label class="block text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <i class="fa-solid fa-cube text-amber-400"></i>
              <span>3D Seating Ambiance Selector</span>
            </label>
            <div class="grid grid-cols-2 gap-3 perspective-container">
              <div onclick="selectSeatingZone('Indoor Velvet Salon', this)" class="seating-zone-3d active p-3.5 rounded-2xl glass-card tilt-card-3d cursor-pointer border border-amber-500 bg-amber-500/10 shadow-lg">
                <div class="glare-3d"></div>
                <div class="flex items-center gap-2 depth-layer-2">
                  <span class="text-amber-400 text-base">👑</span>
                  <span class="text-xs font-bold text-amber-200">Velvet Salon</span>
                </div>
                <p class="text-[10px] text-stone-400 mt-1 depth-layer-1">Plush intimate booths</p>
                <span class="inline-block mt-2 text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold depth-layer-3">Available</span>
              </div>

              <div onclick="selectSeatingZone('Sunlit Courtyard Terrace', this)" class="seating-zone-3d p-3.5 rounded-2xl glass-card tilt-card-3d cursor-pointer border border-stone-800 hover:border-amber-500/50">
                <div class="glare-3d"></div>
                <div class="flex items-center gap-2 depth-layer-2">
                  <span class="text-amber-400 text-base">🌿</span>
                  <span class="text-xs font-bold text-stone-200">Garden Terrace</span>
                </div>
                <p class="text-[10px] text-stone-400 mt-1 depth-layer-1">Alfresco starlit canopy</p>
                <span class="inline-block mt-2 text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold depth-layer-3">Popular</span>
              </div>

              <div onclick="selectSeatingZone('Barista Pour-Over Bar', this)" class="seating-zone-3d p-3.5 rounded-2xl glass-card tilt-card-3d cursor-pointer border border-stone-800 hover:border-amber-500/50">
                <div class="glare-3d"></div>
                <div class="flex items-center gap-2 depth-layer-2">
                  <span class="text-amber-400 text-base">☕</span>
                  <span class="text-xs font-bold text-stone-200">Barista Bar</span>
                </div>
                <p class="text-[10px] text-stone-400 mt-1 depth-layer-1">Front row brew craft</p>
                <span class="inline-block mt-2 text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold depth-layer-3">Interactive</span>
              </div>

              <div onclick="selectSeatingZone('Acoustic Mezzanine Loft', this)" class="seating-zone-3d p-3.5 rounded-2xl glass-card tilt-card-3d cursor-pointer border border-stone-800 hover:border-amber-500/50">
                <div class="glare-3d"></div>
                <div class="flex items-center gap-2 depth-layer-2">
                  <span class="text-amber-400 text-base">🎷</span>
                  <span class="text-xs font-bold text-stone-200">Jazz Loft</span>
                </div>
                <p class="text-[10px] text-stone-400 mt-1 depth-layer-1">Vinyl jazz & acoustics</p>
                <span class="inline-block mt-2 text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold depth-layer-3">Available</span>
              </div>
            </div>
          </div>

          <div class="space-y-4 pt-2">
            <div class="flex items-center gap-4 p-3.5 rounded-2xl glass-card">
              <div class="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div>
                <div class="text-[11px] text-stone-400 uppercase tracking-wider">Direct Reservation Desk</div>
                <div class="font-bold text-amber-100">${phone}</div>
              </div>
            </div>

            <div class="flex items-center gap-4 p-3.5 rounded-2xl glass-card">
              <div class="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <div class="text-[11px] text-stone-400 uppercase tracking-wider">Cafe Address</div>
                <div class="font-bold text-amber-100">${prospect.address || city + ' Central'}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Reservation Form -->
        <div class="lg:col-span-6">
          <div class="rounded-3xl p-6 sm:p-8 bg-[#16100b] border border-amber-500/30 shadow-2xl relative">
            <h3 class="font-serif-luxury text-2xl font-bold text-amber-50 mb-1">${profile.formTitle}</h3>
            <p class="text-stone-400 text-xs mb-6">${profile.formSub}</p>

            <form onsubmit="handleReservationSubmit(event)" class="space-y-4">
              
              <!-- Guest Count Interactive Selector -->
              <div>
                <label class="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">Number of Guests</label>
                <div class="grid grid-cols-4 gap-2" id="guest-selector">
                  <button type="button" onclick="selectGuests(1, this)" class="guest-btn py-2 rounded-xl border border-amber-500/40 bg-amber-500/20 text-amber-300 text-xs font-bold transition">1 Person</button>
                  <button type="button" onclick="selectGuests(2, this)" class="guest-btn active py-2 rounded-xl border border-amber-500 bg-amber-500 text-black text-xs font-bold transition shadow">2 People</button>
                  <button type="button" onclick="selectGuests(3, this)" class="guest-btn py-2 rounded-xl border border-stone-800 bg-stone-900 text-stone-300 text-xs font-bold transition hover:border-amber-500/30">3-4 People</button>
                  <button type="button" onclick="selectGuests(5, this)" class="guest-btn py-2 rounded-xl border border-stone-800 bg-stone-900 text-stone-300 text-xs font-bold transition hover:border-amber-500/30">5+ Group</button>
                </div>
              </div>

              <!-- Contact Inputs -->
              <div class="grid sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label class="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Your Full Name</label>
                  <input type="text" id="res-name" required placeholder="Aarav Sharma" class="w-full bg-[#0c0907] px-3.5 py-2.5 rounded-xl border border-stone-800 focus:border-amber-500 focus:outline-none text-sm text-white">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">WhatsApp / Phone</label>
                  <input type="tel" id="res-phone" required placeholder="${phone}" class="w-full bg-[#0c0907] px-3.5 py-2.5 rounded-xl border border-stone-800 focus:border-amber-500 focus:outline-none text-sm text-white font-mono">
                </div>
              </div>

              <!-- Seating Preference -->
              <div>
                <label class="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">${profile.formServiceLabel}</label>
                <select id="res-seating" class="w-full bg-[#0c0907] px-3.5 py-2.5 rounded-xl border border-stone-800 focus:border-amber-500 focus:outline-none text-sm text-stone-200">
                  ${profile.formOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
              </div>

              <!-- Time Slot -->
              <div>
                <label class="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">Preferred Timing</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2" id="time-selector">
                  <button type="button" onclick="selectTime('09:30 AM', this)" class="time-btn py-1.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-300 text-[11px] font-bold transition hover:border-amber-500/40">09:30 AM</button>
                  <button type="button" onclick="selectTime('01:30 PM', this)" class="time-btn py-1.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-300 text-[11px] font-bold transition hover:border-amber-500/40">01:30 PM</button>
                  <button type="button" onclick="selectTime('05:30 PM', this)" class="time-btn active py-1.5 rounded-xl border border-amber-500 bg-amber-500 text-black text-[11px] font-bold transition shadow">05:30 PM</button>
                  <button type="button" onclick="selectTime('08:30 PM', this)" class="time-btn py-1.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-300 text-[11px] font-bold transition hover:border-amber-500/40">08:30 PM</button>
                </div>
              </div>

              <button type="submit" class="w-full py-3.5 gold-shimmer-btn text-black font-extrabold rounded-2xl shadow-xl shadow-amber-900/40 transition hover:scale-[1.02] text-sm mt-3">
                ${profile.formSubmitText}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-[#080604] text-stone-500 py-12 text-xs border-t border-amber-950/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2.5">
        <span class="font-serif-luxury font-bold text-amber-200 text-sm">${bizName}</span>
        <span>•</span>
        <span>${city}</span>
        <span>•</span>
        <span>Specialty Coffee & Kitchen</span>
      </div>
      <div>
        <p>&copy; ${new Date().getFullYear()} ${bizName}. All Rights Reserved. Handcrafted by SiteSeller Agent.</p>
      </div>
    </div>
  </footer>

  <!-- Floating Customer WhatsApp Chat with Animated Radar Ring -->
  <a href="https://wa.me/${phoneDigits}?text=${encodeURIComponent(customerWaText)}" 
     target="_blank" 
     rel="noopener noreferrer"
     class="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 radar-pulse group"
     title="Message ${bizName} on WhatsApp">
    <i class="fa-brands fa-whatsapp text-2xl"></i>
    <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs group-hover:ml-2">
      Chat with ${bizName}
    </span>
  </a>

  <!-- Claim Modal (For Business Owner to connect with Devesh) -->
  <div id="claim-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 hidden">
    <div class="bg-[#17100b] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 text-stone-100 shadow-2xl relative">
      <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="absolute top-4 right-4 text-stone-400 hover:text-white">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
      
      <div class="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center text-xl font-bold mb-4 border border-amber-500/30">
        ✨
      </div>
      
      <h3 class="font-serif-luxury text-2xl font-bold text-amber-50">Claim ${bizName}'s Website</h3>
      <p class="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
        This luxury, fully animated website was custom designed for <strong>${bizName}</strong>. Connect your domain, customize photos & prices, and accept online table reservations today!
      </p>

      <div class="bg-[#0d0906] p-3.5 rounded-2xl border border-amber-900/40 mt-4 text-xs text-amber-200/80 space-y-1">
        <div><strong>Includes:</strong> Free cloud deployment, custom domain connection, SEO optimization, and direct WhatsApp booking alerts.</div>
      </div>

      <div class="mt-6 flex flex-col gap-2.5">
        <a href="https://wa.me/${agencyWhatsApp}?text=${encodeURIComponent(claimWaText)}" target="_blank" rel="noopener noreferrer" class="w-full text-center py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-lg">
          <i class="fa-brands fa-whatsapp text-lg"></i>
          <span>Claim via WhatsApp (+91 8920608191)</span>
        </a>
        <a href="mailto:${senderEmail}?subject=${encodeURIComponent(`Claim Website for ${bizName}`)}&body=${encodeURIComponent(claimWaText)}" class="w-full text-center py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-bold rounded-2xl text-xs transition">
          Claim via Email
        </a>
        <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="w-full py-2 text-stone-400 hover:text-stone-200 text-xs font-semibold">
          Continue Previewing
        </button>
      </div>
    </div>
  </div>

  <!-- Interactive JavaScript Engine -->
  <script>
    // 1. AI Barista Concierge Logic
    const baristaRecommendations = {
      work: {
        title: "⚡ Focus & Energy Pairing:",
        text: "For sustained stamina with zero crash, order our <strong>Double-Shot Spanish Cortado</strong> alongside a warm, twice-baked <strong>Almond Butter Croissant</strong>!",
        waItem: "Double-Shot Spanish Cortado + Almond Croissant"
      },
      chill: {
        title: "🌿 Cold & Botanical Pairing:",
        text: "Beating the afternoon heat? Go for the sparkling <strong>Yuzu Cold Brew Tonic</strong> with a slice of our <strong>Wild Blueberry Sourdough Danish</strong>!",
        waItem: "Yuzu Cold Brew Tonic + Wild Blueberry Danish"
      },
      sweet: {
        title: "🥐 Sweet Indulgence Pairing:",
        text: "Craving decadent pastry craft? Try the <strong>Belgian Dark Chocolate Babka</strong> paired with our velvety <strong>Sea Salt Caramel Flat White</strong>.",
        waItem: "Belgian Dark Chocolate Babka + Sea Salt Caramel Flat White"
      },
      brunch: {
        title: "🥑 Artisanal Brunch Pairing:",
        text: "For a satisfying wholesome meal, order the <strong>Hass Avocado & Poached Egg Brioche</strong> with an iced <strong>Ceremonial Grade Matcha Latte</strong>!",
        waItem: "Avocado Poached Egg Brioche + Ceremonial Matcha Latte"
      }
    };

    function handleAiBarista(type) {
      const rec = baristaRecommendations[type] || baristaRecommendations.work;
      const titleEl = document.getElementById('ai-response-title');
      const textEl = document.getElementById('ai-response-text');
      const btnEl = document.getElementById('ai-order-btn');
      
      titleEl.innerText = rec.title;
      textEl.innerHTML = rec.text;
      btnEl.href = "https://wa.me/${phoneDigits}?text=" + encodeURIComponent("Hi ${bizName}! I would like to order the " + rec.waItem + " recommended by your AI Barista.");
      
      const box = document.getElementById('ai-response-box');
      box.classList.add('ring-2', 'ring-amber-500/50');
      setTimeout(() => box.classList.remove('ring-2', 'ring-amber-500/50'), 600);
    }

    // 2. Interactive Menu Filter Tabs
    function filterMenu(categoryId, btn) {
      document.querySelectorAll('.menu-tab-btn').forEach(b => {
        b.classList.remove('bg-amber-500', 'text-black', 'shadow-md');
        b.classList.add('bg-stone-900', 'text-stone-300');
      });
      btn.classList.add('bg-amber-500', 'text-black', 'shadow-md');
      btn.classList.remove('bg-stone-900', 'text-stone-300');

      const items = document.querySelectorAll('.menu-item-card');
      items.forEach(card => {
        if (categoryId === 'all' || card.getAttribute('data-category') === categoryId) {
          card.style.display = 'flex';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    }

    // 3. 3D Seating Zone Visualizer
    function selectSeatingZone(zoneName, el) {
      document.querySelectorAll('.seating-zone-3d').forEach(z => {
        z.classList.remove('active', 'border-amber-500', 'bg-amber-500/10', 'shadow-lg');
        z.classList.add('border-stone-800');
      });
      el.classList.add('active', 'border-amber-500', 'bg-amber-500/10', 'shadow-lg');
      el.classList.remove('border-stone-800');

      const seatingSelect = document.getElementById('res-seating');
      if (seatingSelect) {
        let found = false;
        for (let i = 0; i < seatingSelect.options.length; i++) {
          if (seatingSelect.options[i].text.toLowerCase().includes(zoneName.toLowerCase().split(' ')[0])) {
            seatingSelect.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          const opt = document.createElement('option');
          opt.value = zoneName;
          opt.text = zoneName;
          opt.selected = true;
          seatingSelect.appendChild(opt);
        }
      }
    }

    // 4. Guest & Time Selectors for Table Reservation
    let selectedGuestCount = 2;
    let selectedTimeSlot = '05:30 PM';

    function selectGuests(count, btn) {
      selectedGuestCount = count;
      document.querySelectorAll('.guest-btn').forEach(b => {
        b.classList.remove('bg-amber-500', 'text-black', 'border-amber-500', 'shadow');
        b.classList.add('bg-stone-900', 'text-stone-300', 'border-stone-800');
      });
      btn.classList.add('bg-amber-500', 'text-black', 'border-amber-500', 'shadow');
      btn.classList.remove('bg-stone-900', 'text-stone-300', 'border-stone-800');
    }

    function selectTime(time, btn) {
      selectedTimeSlot = time;
      document.querySelectorAll('.time-btn').forEach(b => {
        b.classList.remove('bg-amber-500', 'text-black', 'border-amber-500', 'shadow');
        b.classList.add('bg-stone-900', 'text-stone-300', 'border-stone-800');
      });
      btn.classList.add('bg-amber-500', 'text-black', 'border-amber-500', 'shadow');
      btn.classList.remove('bg-stone-900', 'text-stone-300', 'border-stone-800');
    }

    function handleReservationSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('res-name').value;
      const phone = document.getElementById('res-phone').value;
      const seating = document.getElementById('res-seating').value;
      
      const msg = "Hi ${bizName}! I would like to confirm my table reservation:%0A- Name: " + encodeURIComponent(name) + "%0A- Guests: " + selectedGuestCount + "%0A- Time: " + selectedTimeSlot + "%0A- Seating: " + encodeURIComponent(seating) + "%0A- Phone: " + encodeURIComponent(phone);
      
      window.open("https://wa.me/${phoneDigits}?text=" + msg, "_blank");
      alert("✨ Table Reservation Sent for " + name + "! In production, this directly notifies ${bizName} on WhatsApp.");
    }

    // 5. Smooth 3D Card Tilt Engine
    function init3dTiltEngine() {
      const cards = document.querySelectorAll('.tilt-card-3d');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -11;
          const rotateY = ((x - centerX) / centerX) * 11;
          card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale3d(1.025, 1.025, 1.025)";
          
          const glare = card.querySelector('.glare-3d');
          if (glare) {
            glare.style.background = "radial-gradient(circle at " + x + "px " + y + "px, rgba(251, 191, 36, 0.22) 0%, transparent 65%)";
            glare.style.opacity = '1';
          }
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          const glare = card.querySelector('.glare-3d');
          if (glare) glare.style.opacity = '0';
        });
      });
    }

    // 6. Three.js Interactive 3D Coffee Scene
    function init3dCoffeeScene() {
      const container = document.getElementById('canvas-3d-container');
      if (!container || typeof THREE === 'undefined') return;

      const width = container.clientWidth || 450;
      const height = container.clientHeight || 450;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 2.2, 5.6);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffeedd, 1.5);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffb74d, 2.8);
      keyLight.position.set(5, 8, 4);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0xffd54f, 1.8);
      rimLight.position.set(-5, 4, -4);
      scene.add(rimLight);

      const mouseLight = new THREE.PointLight(0xffa726, 2.5, 10);
      mouseLight.position.set(0, 3, 3);
      scene.add(mouseLight);

      // Main 3D Coffee Group
      const coffeeGroup = new THREE.Group();
      scene.add(coffeeGroup);

      // Materials
      const ceramicMaterial = new THREE.MeshStandardMaterial({
        color: 0x140e0a,
        roughness: 0.18,
        metalness: 0.85
      });

      const goldTrimMaterial = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.15,
        metalness: 0.95
      });

      const coffeeLiquidMaterial = new THREE.MeshStandardMaterial({
        color: 0x2b170c,
        roughness: 0.1,
        metalness: 0.3
      });

      const cremaMaterial = new THREE.MeshStandardMaterial({
        color: 0xb4763c,
        roughness: 0.45,
        metalness: 0.1
      });

      const beanMaterial = new THREE.MeshStandardMaterial({
        color: 0x3d2314,
        roughness: 0.35,
        metalness: 0.25
      });

      // Cup Body
      const cupGeo = new THREE.CylinderGeometry(1.2, 0.8, 1.4, 48, 1, false);
      const cup = new THREE.Mesh(cupGeo, ceramicMaterial);
      cup.position.y = 0.7;
      coffeeGroup.add(cup);

      // Gold Rim
      const rimGeo = new THREE.TorusGeometry(1.21, 0.05, 16, 48);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, goldTrimMaterial);
      rim.position.y = 1.4;
      coffeeGroup.add(rim);

      // Cup Handle
      const handleGeo = new THREE.TorusGeometry(0.5, 0.09, 16, 32, Math.PI * 1.2);
      const handle = new THREE.Mesh(handleGeo, goldTrimMaterial);
      handle.position.set(1.25, 0.7, 0);
      handle.rotation.z = -Math.PI / 4;
      coffeeGroup.add(handle);

      // Coffee Liquid
      const liquidGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.08, 48);
      const liquid = new THREE.Mesh(liquidGeo, coffeeLiquidMaterial);
      liquid.position.y = 1.32;
      coffeeGroup.add(liquid);

      // Crema Foam
      const foamGeo = new THREE.CircleGeometry(0.7, 32);
      foamGeo.rotateX(-Math.PI / 2);
      const foam = new THREE.Mesh(foamGeo, cremaMaterial);
      foam.position.y = 1.37;
      coffeeGroup.add(foam);

      // Saucer
      const saucerGeo = new THREE.CylinderGeometry(1.8, 1.2, 0.15, 48);
      const saucer = new THREE.Mesh(saucerGeo, ceramicMaterial);
      saucer.position.y = -0.05;
      coffeeGroup.add(saucer);

      const saucerRimGeo = new THREE.TorusGeometry(1.81, 0.04, 16, 48);
      saucerRimGeo.rotateX(Math.PI / 2);
      const saucerRim = new THREE.Mesh(saucerRimGeo, goldTrimMaterial);
      saucerRim.position.y = 0.03;
      coffeeGroup.add(saucerRim);

      // 3D Floating Coffee Beans
      const beans = [];
      const beanGeo = new THREE.SphereGeometry(0.22, 16, 12);
      beanGeo.scale(1.4, 0.85, 0.95);

      for (let i = 0; i < 9; i++) {
        const bean = new THREE.Mesh(beanGeo, beanMaterial);
        const angle = (i / 9) * Math.PI * 2;
        const radius = 2.2 + (i % 3) * 0.4;
        bean.position.set(
          Math.cos(angle) * radius,
          0.3 + ((i % 5) - 2) * 0.45,
          Math.sin(angle) * radius
        );
        bean.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        bean.userData = {
          orbitSpeed: 0.006 + (i % 4) * 0.002,
          orbitRadius: radius,
          angle: angle,
          rotSpeedX: 0.02,
          rotSpeedY: 0.015,
          baseY: bean.position.y
        };
        scene.add(bean);
        beans.push(bean);
      }

      // 3D Golden Floating Particles
      const particleCount = 75;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const speeds = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2.2;
        positions[i * 3 + 1] = 1.3 + Math.random() * 3.2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
        speeds[i] = 0.015 + Math.random() * 0.02;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0xfbbf24,
        size: 0.09,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Mouse Interaction
      let mouseX = 0;
      let mouseY = 0;
      let targetRotationX = 0.15;
      let targetRotationY = 0.35;
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };

      window.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
          targetRotationY = mouseX * 0.85 + 0.3;
          targetRotationX = -mouseY * 0.45 + 0.2;
          mouseLight.position.x = mouseX * 3;
          mouseLight.position.y = mouseY * 3 + 2;
        }
      });

      container.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      });
      window.addEventListener('mouseup', () => { isDragging = false; });
      container.addEventListener('mousemove', (e) => {
        if (isDragging) {
          const deltaX = e.clientX - previousMousePosition.x;
          const deltaY = e.clientY - previousMousePosition.y;
          coffeeGroup.rotation.y += deltaX * 0.01;
          coffeeGroup.rotation.x += deltaY * 0.01;
          previousMousePosition = { x: e.clientX, y: e.clientY };
        }
      });

      // Tap burst
      container.addEventListener('click', () => {
        const pos = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] = 1.35;
        }
        particleGeo.attributes.position.needsUpdate = true;
        coffeeGroup.position.y = 0.25;
        setTimeout(() => { coffeeGroup.position.y = 0; }, 300);
      });

      // Responsive Resize
      window.addEventListener('resize', () => {
        if (!container) return;
        const w = container.clientWidth || 450;
        const h = container.clientHeight || 450;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });

      // Render Loop
      let clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        if (!isDragging) {
          coffeeGroup.rotation.y += (targetRotationY - coffeeGroup.rotation.y) * 0.05;
          coffeeGroup.rotation.x += (targetRotationX - coffeeGroup.rotation.x) * 0.05;
        }
        coffeeGroup.position.y = Math.sin(time * 1.5) * 0.08;

        beans.forEach(b => {
          b.userData.angle += b.userData.orbitSpeed;
          b.position.x = Math.cos(b.userData.angle) * b.userData.orbitRadius;
          b.position.z = Math.sin(b.userData.angle) * b.userData.orbitRadius;
          b.position.y = b.userData.baseY + Math.sin(time * 2 + b.userData.angle) * 0.18;
          b.rotation.x += b.userData.rotSpeedX;
          b.rotation.y += b.userData.rotSpeedY;
        });

        const pos = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] += speeds[i];
          pos[i * 3] += Math.sin(time * 3 + i) * 0.005;
          if (pos[i * 3 + 1] > 4.2) {
            pos[i * 3 + 1] = 1.35;
            pos[i * 3] = (Math.random() - 0.5) * 1.4;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      }
      animate();
    }

    // Initialize 3D engines
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(() => {
        init3dTiltEngine();
        init3dCoffeeScene();
      }, 100);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        init3dTiltEngine();
        init3dCoffeeScene();
      });
    }
  </script>

</body>
</html>`;
}

/**
 * Skill 3: Generate
 * Builds complete modern demo website for the prospect
 */
async function generateWebsiteForProspect(prospectId, baseUrlOption = 'https://leads-gen-b3uj.onrender.com') {
  const prospect = db.getProspectById(prospectId);
  if (!prospect) {
    throw new Error(`Prospect with ID ${prospectId} not found`);
  }

  const baseUrl = (typeof baseUrlOption === 'object' && baseUrlOption?.baseUrl) 
    ? baseUrlOption.baseUrl 
    : (typeof baseUrlOption === 'string' ? baseUrlOption : 'https://leads-gen-b3uj.onrender.com');

  const siteId = uuidv4();
  const demoUrl = `${baseUrl.replace(/\/+$/, '')}/demos/${siteId}`;
  const htmlContent = generateSiteHTML(prospect, siteId, { baseUrl });

  const siteRecord = {
    id: siteId,
    prospect_id: prospect.id,
    demo_url: demoUrl,
    preview_screenshot: '',
    site_config: {
      business_name: prospect.business_name,
      category: prospect.category,
      city: prospect.city,
      phone: prospect.phone,
      rating: prospect.rating,
      reviews: prospect.review_count
    },
    html_content: htmlContent,
    generated_date: new Date().toISOString()
  };

  const saved = db.saveSite(siteRecord);
  return saved;
}

module.exports = {
  generateWebsiteForProspect,
  generateSiteHTML,
  getBespokeNicheProfile
};
