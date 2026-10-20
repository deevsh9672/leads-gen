const db = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * Builds tailored brand palettes, services, testimonials, menu items, and interactive elements
 * for each individual business lead and niche.
 */
function getBespokeNicheProfile(category = '', bizName = 'Local Business', city = 'Toronto') {
  const cat = (category || '').toLowerCase();
  const name = bizName.toLowerCase();

  // 1. CLINIC / HEALTHCARE / MEDICAL / DENTAL / PHYSIO / DERMATOLOGY / FERTILITY
  if (
    cat.includes('clinic') || cat.includes('health') || cat.includes('medical') || cat.includes('doctor') ||
    cat.includes('dental') || cat.includes('physio') || cat.includes('chiro') || cat.includes('derma') ||
    cat.includes('fertility') || cat.includes('walk-in') || cat.includes('walk in') || cat.includes('urgent') ||
    name.includes('clinic') || name.includes('medical') || name.includes('health') || name.includes('dental') ||
    name.includes('physio') || name.includes('doctor') || name.includes('fertility') || name.includes('care')
  ) {
    let subNiche = 'Medical & Walk-In Clinic';
    if (name.includes('dental') || cat.includes('dental') || cat.includes('dentist')) {
      subNiche = 'Dental Care & Surgery Clinic';
    } else if (name.includes('physio') || cat.includes('physio') || cat.includes('chiro') || name.includes('stretch')) {
      subNiche = 'Physiotherapy & Rehabilitation Clinic';
    } else if (name.includes('fertility') || cat.includes('fertility')) {
      subNiche = 'Fertility & Reproductive Health Clinic';
    } else if (name.includes('eye') || cat.includes('eye') || cat.includes('optom') || name.includes('lasik')) {
      subNiche = 'Laser Eye Care & Optometry Clinic';
    } else if (name.includes('derma') || cat.includes('laser') || cat.includes('skin') || name.includes('skin')) {
      subNiche = 'Dermatology & Medical Aesthetic Clinic';
    }

    const specialty1 = { 
      title: 'Walk-In Urgent & Primary Care', 
      desc: 'Same-day doctor consultations, acute symptom care, minor injuries, and urgent healthcare triage with zero appointment barrier.', 
      icon: 'fa-stethoscope' 
    };
    const specialty2 = { 
      title: 'Family Practice & Annual Physicals', 
      desc: 'Comprehensive patient health assessments, preventive biometrics, immunization schedules, and chronic illness monitoring.', 
      icon: 'fa-user-doctor' 
    };
    const specialty3 = { 
      title: 'Advanced Diagnostic & Lab Screenings', 
      desc: 'On-site ultrasound coordination, rapid blood work panels, digital ECG, and confidential specialist referrals.', 
      icon: 'fa-heart-pulse' 
    };
    const specialty4 = { 
      title: 'Specialized Therapy & Direct Billing', 
      desc: 'Integrated physiotherapy, dental hygiene, direct insurance billing (OHIP & major private insurers), and telehealth consultations.', 
      icon: 'fa-hospital-user' 
    };

    const menuCategories = [
      {
        id: 'walkin',
        name: 'Walk-In & Urgent Care',
        icon: 'fa-notes-medical',
        items: [
          { name: 'Same-Day Physician Consultation', price: 'Direct Billing', notes: 'Acute illness, fever, respiratory distress, flu symptoms & prescription refills', badge: 'Walk-Ins Welcome', img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80' },
          { name: 'Minor Injury & Wound Triage', price: 'Covered', notes: 'Sprain assessment, laceration dressing, burn care, suture removal & splinting', badge: 'Urgent Care', img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80' },
          { name: 'Vaccination & Immunization Clinic', price: 'Covered', notes: 'Travel vaccines, annual flu shots, HPV, shingles & tetanus booster immunizations', badge: 'Preventive', img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=400&q=80' },
          { name: 'Prescription Renewal & Lab Requisition', price: 'Fast Access', notes: 'Immediate doctor prescription renewals, laboratory requisitions & blood work referrals', badge: 'Express', img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        id: 'family',
        name: 'Family & Preventive Health',
        icon: 'fa-hospital-user',
        items: [
          { name: 'Comprehensive Health Physical Exam', price: 'Full Assessment', notes: 'Complete biometric screening, vital signs, cardiovascular & metabolic review', badge: 'Annual Checkup', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80' },
          { name: 'Pediatric Well-Child Examination', price: 'Pediatric Care', notes: 'Infant growth tracking, developmental milestone checks, vaccinations & pediatric guidance', badge: 'Kids Health', img: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=400&q=80' },
          { name: 'Chronic Illness & Diabetes Management', price: 'Continuous Care', notes: 'Hypertension monitoring, glucose optimization, routine blood panels & dietary planning', badge: 'Specialist', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80' },
          { name: 'Women’s Health & Preventive Screening', price: 'Confidential Care', notes: 'Preventive gynecology exams, Pap smears, family planning & prenatal support', badge: 'Wellness', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        id: 'therapy',
        name: 'Dental & Rehabilitation Care',
        icon: 'fa-tooth',
        items: [
          { name: 'Complete Dental Exam & Ultrasonic Clean', price: 'Direct Insurance', notes: 'Ultrasonic plaque removal, enamel fluoride treatment, digital low-radiation X-rays', badge: 'Dental Care', img: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80' },
          { name: 'Physiotherapy & Spinal Decompression', price: 'Rehab Covered', notes: 'Targeted deep tissue release, postural realignment, spinal traction & pain relief', badge: 'Pain Relief', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80' },
          { name: 'Sports Injury Joint & Knee Rehabilitation', price: 'Fast Recovery', notes: 'Active rehabilitation protocols for ligament sprains, rotator cuff tears & knee trauma', badge: 'Sports Rehab', img: 'https://images.unsplash.com/photo-1597764690523-15bea4c581c9?auto=format&fit=crop&w=400&q=80' },
          { name: 'Clinical Dermatology & Skin Consultation', price: 'Specialized', notes: 'Full body mole mapping, acne treatment, eczema therapies & cosmetic skin checks', badge: 'Dermatology', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        id: 'diagnostics',
        name: 'Diagnostics & Telehealth',
        icon: 'fa-microscope',
        items: [
          { name: 'Diagnostic Ultrasound & Imaging Coordination', price: 'Requisition Ready', notes: 'Abdominal, pelvic, musculoskeletal and thyroid ultrasound scanning coordination', badge: 'High-Res Scan', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80' },
          { name: 'Rapid Diagnostic Blood & Urine Panels', price: 'Same-Day Lab', notes: 'Complete blood count (CBC), lipid profile, liver/kidney panels & metabolic screenings', badge: 'Fast Lab', img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=400&q=80' },
          { name: 'Cardiovascular 12-Lead Diagnostic ECG', price: 'Direct Reading', notes: 'Resting heart rhythm examination, arrhythmia detection & preoperative surgical clearance', badge: 'Cardiac Care', img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80' },
          { name: 'Secure Virtual Doctor Telehealth Visit', price: 'Covered Visit', notes: 'HIPAA/PHIPA compliant secure video consultation from your smartphone with prescription dispatch', badge: 'Telehealth', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80' }
        ]
      }
    ];

    return {
      nicheKey: 'clinic',
      subNiche,
      themeColor: 'cyan',
      accentHex: '#0ea5e9',
      themeBg: '#070f1e',
      badge: `Premier ${subNiche} in ${city}`,
      heroTagline: `${bizName} — Comprehensive Healthcare & Modern Patient Care in ${city}`,
      heroSub: `Experience compassionate patient consultations, experienced board-certified physicians, and rapid walk-in urgent care. ${bizName} is ${city}'s premier health sanctuary dedicated to your family's health and wellness.`,
      heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80',
      logoIcon: 'fa-heart-pulse',
      heroBadge1: 'Board-Certified Physicians',
      heroBadge2: 'Direct Insurance & Walk-Ins',
      navCta: 'Book Consultation',
      primaryCta: 'Explore Specialties',
      secondaryCta: 'Call Clinic Hotline',
      servicesHeading: 'Comprehensive Medical Specialties & Patient Care',
      servicesSub: `Every consultation at ${bizName} is guided by clinical excellence, modern diagnostic technology, and genuine compassion for our ${city} community.`,
      services: [specialty1, specialty2, specialty3, specialty4],
      menuCategories,
      catalogHeading: `Medical Specialties & Clinic Services at ${bizName}`,
      catalogSub: `Explore our primary care services, walk-in consultations, and specialized healthcare treatments in ${city}.`,
      galleryHeading: `Modern Clinical Facilities at ${bizName}`,
      gallerySub: `A glimpse into our comfortable consultation suites, state-of-the-art diagnostic labs, and serene patient reception in ${city}.`,
      gallery: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=600&q=80'
      ],
      testimonials: [
        {
          name: 'Jennifer K.',
          loc: `${city} Resident`,
          text: `The physicians and nursing team at ${bizName} are truly extraordinary. Minimal wait times for our walk-in visit, empathetic listening, and a clear, comforting treatment plan!`,
          rating: 5
        },
        {
          name: 'Robert T.',
          loc: `Local Family Father`,
          text: `Easily the cleanest and most professional medical clinic in ${city}. The appointment booking was seamless and the doctor took genuine time to explain my test results thoroughly.`,
          rating: 5
        },
        {
          name: 'Dr. Michael S.',
          loc: `Healthcare Professional`,
          text: `As a fellow clinician, I have the highest respect for ${bizName}. Outstanding diagnostics, spotless medical equipment, and top-tier patient care standards.`,
          rating: 5
        }
      ],
      contactBadge: 'Appointments & Walk-Ins',
      contactTitle: `Schedule Your Consultation at ${bizName}`,
      contactSub: `Book an in-person or virtual consultation with our licensed physicians. Walk-ins are always warmly welcomed.`,
      formTitle: `Book a Medical Consultation`,
      formSub: 'Rapid confirmation • Same-day appointments • Direct insurance billing',
      formServiceLabel: 'Select Medical Department',
      formOptions: [
        'Walk-In Urgent Consultation',
        'Family Medicine & Annual Physical',
        'Dental Care & Cleaning Examination',
        'Physiotherapy & Spine Rehabilitation',
        'Dermatology & Skin Health Review',
        'Pediatric Well-Child Consultation',
        'Virtual Telehealth Video Consultation'
      ],
      formSubmitText: `Confirm Appointment Request at ${bizName}`,
      aiConcierge: {
        title: `Interactive Patient Care & Triage Assistant`,
        sub: `Select your consultation need below to connect with the right department at ${bizName}.`,
        tipTitle: `Clinic Care Coordinator Tip:`,
        tipText: `Need urgent medical attention today? ${bizName} accepts same-day walk-ins during open clinic hours with direct insurance billing.`,
        orderBtnText: `Book on WhatsApp`,
        options: [
          { icon: '⚡', title: 'Urgent Walk-In Care', sub: 'Fever, cough, sprains & minor illnesses' },
          { icon: '🩺', title: 'Family Practice Checkup', sub: 'Annual exam, prescription renewals & blood work' },
          { icon: '🦷', title: 'Dental & Oral Health', sub: 'Cleaning, checkup, tooth pain & whitening' },
          { icon: '🏃', title: 'Physiotherapy & Rehab', sub: 'Back pain, joint stiffness & sports recovery' }
        ]
      }
    };
  }

  // 2. CAFE / COFFEE SHOP / TEA ROOM / ROASTERY
  if (cat.includes('cafe') || cat.includes('coffee') || cat.includes('tea') || cat.includes('roast') || cat.includes('espresso') || name.includes('cafe') || name.includes('coffee')) {
    let specialty1 = { title: 'Artisan Espresso & Manual Pour-Overs', desc: 'Single-estate Arabica, slow Chemex drips, silky flat whites, and nitro cold brews.', icon: 'fa-mug-hot' };
    let specialty2 = { title: 'Oven-Fresh Artisanal Viennoiserie', desc: 'Twice-baked almond croissants, Belgian chocolate babkas, and warm sourdough brioche.', icon: 'fa-bread-slice' };
    let specialty3 = { title: 'Cozy Workspaces & High-Speed WiFi', desc: 'Dedicated quiet corners, ample power sockets, natural sunlit nooks, and serene background jazz.', icon: 'fa-laptop' };
    let specialty4 = { title: 'Chef’s Gourmet Brunch & Superfoods', desc: 'Hass avocado tartines, truffle scrambled brioche, acai bowls, and botanical coolers.', icon: 'fa-utensils' };

    const menuCategories = [
      {
        id: 'brews',
        name: 'Specialty Brews',
        icon: 'fa-mug-saucer',
        items: [
          { name: 'Single-Origin Chemex Pour-Over', price: '$4.50', notes: 'Ethiopian Yirgacheffe • Jasmine, Citrus & Stonefruit', badge: 'Barista Pick', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' },
          { name: 'Spanish Velvet Latte', price: '$5.25', notes: 'Double ristretto, condensed milk, steamed microfoam, cinnamon', badge: 'Best Seller', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80' },
          { name: '18-Hour Slow Steeped Cold Brew', price: '$4.75', notes: 'Zero bitterness, dark cocoa finish, served with orange slice', badge: 'House Signature', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80' },
          { name: 'Artisan Cortado & Flat White', price: '$4.25', notes: 'Equal parts espresso & velvety steamed whole milk', badge: 'Classic', img: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      {
        id: 'bakes',
        name: 'Artisanal Bakes',
        icon: 'fa-bread-slice',
        items: [
          { name: 'Almond Butter Double Croissant', price: '$4.20', notes: 'Twice-baked French butter croissant filled with frangipane', badge: 'Fresh Daily', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80' },
          { name: 'Belgian Dark Chocolate Babka', price: '$4.80', notes: 'Swirled sourdough brioche with 70% dark melted Callebaut', badge: 'Chef Special', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80' },
          { name: 'Wild Berry Sourdough Danish', price: '$4.50', notes: 'Crispy blistered golden crust with seasonal berry compote', badge: 'Organic', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80' },
          { name: 'Truffle Mushroom Sourdough Melt', price: '$6.50', notes: 'Woodfired sourdough with molten Gruyère & sautéed mushrooms', badge: 'Savory', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      {
        id: 'brunch',
        name: 'Gourmet Brunch',
        icon: 'fa-utensils',
        items: [
          { name: 'Hass Avocado & Poached Egg Brioche', price: '$12.50', notes: 'Mashed Hass avocado, Danish feta, chili crunch, toasted brioche', badge: 'Must Try', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=300&q=80' },
          { name: 'Burrata & Sun-Ripened Tomato Tartine', price: '$13.00', notes: 'Creamy local burrata, basil walnut pesto, 12yr aged balsamic', badge: 'Gourmet', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80' },
          { name: 'Amazonian Acai Superfood Bowl', price: '$11.00', notes: 'Organic acai, house granola, chia seeds, goji berries & honey', badge: 'Healthy', img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=300&q=80' },
          { name: 'Turkish Shakshuka Skillet', price: '$12.00', notes: 'Spiced bell pepper & tomato ragu, poached eggs, sourdough pita', badge: 'Hot Plate', img: 'https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=300&q=80' }
        ]
      },
      {
        id: 'coolers',
        name: 'Botanical Coolers',
        icon: 'fa-wine-glass',
        items: [
          { name: 'Yuzu Sparkling Cold Brew Tonic', price: '$5.50', notes: 'Japanese yuzu citrus, artisanal tonic, espresso float', badge: 'Effervescent', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80' },
          { name: 'Ceremonial Uji Iced Matcha Latte', price: '$5.80', notes: 'Kyoto stone-ground green tea whisked with oat milk', badge: 'Antioxidant', img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=300&q=80' },
          { name: 'Wild Hibiscus & Pink Rose Soda', price: '$4.50', notes: 'Cold-steeped organic flowers with bubbly mountain soda', badge: 'Botanical', img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=300&q=80' },
          { name: 'Gourmet Belgian Hot Chocolate', price: '$5.20', notes: 'Single-origin molten chocolate callets, sea salt, toasted cream', badge: 'Indulgent', img: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=300&q=80' }
        ]
      }
    ];

    return {
      nicheKey: 'cafe',
      subNiche: 'Specialty Cafe & Roastery',
      themeColor: 'amber',
      accentHex: '#d97706',
      themeBg: '#070504',
      badge: `Luxury Specialty Cafe & Roastery in ${city}`,
      heroTagline: `${bizName} — Specialty Coffee, Fresh Bakes & Warm Vibe in ${city}`,
      heroSub: `Immerse yourself in velvety handcrafted espresso, slow-steeped single-origin roasts, and oven-fresh artisanal bakes. ${bizName} is ${city}'s premier neighborhood sanctuary.`,
      heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
      logoIcon: 'fa-mug-hot',
      heroBadge1: 'Single-Origin Arabica',
      heroBadge2: 'Fresh Daily Bakes & WiFi',
      navCta: 'Reserve a Table',
      primaryCta: 'Explore Menu & Reserve',
      secondaryCta: 'Call Barista',
      servicesHeading: 'Signature Coffee & Culinary Craft',
      servicesSub: `Every creation is a tribute to passion, quality ingredients, and hospitality at ${bizName}.`,
      services: [specialty1, specialty2, specialty3, specialty4],
      menuCategories,
      catalogHeading: `The Artisan Menu at ${bizName}`,
      catalogSub: `Carefully roasted beans, fresh viennoiserie, and hearty gourmet brunch in ${city}.`,
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
      formSubmitText: `Confirm Reservation at ${bizName}`,
      aiConcierge: {
        title: `Interactive 3D AI Barista Concierge`,
        sub: `Ask Barista AI: What should you order at ${bizName}? Select your craving below.`,
        tipTitle: `Barista AI Tip:`,
        tipText: `Looking for a perfect morning start? We recommend pairing our Double-Shot Spanish Cortado with our freshly baked Almond Butter Croissant!`,
        orderBtnText: `Order on WhatsApp`,
        options: [
          { icon: '⚡', title: 'Work & Deep Focus', sub: 'High energy, low crash espresso' },
          { icon: '🌿', title: 'Light & Refreshing', sub: 'Iced, floral & crisp cold brews' },
          { icon: '🥐', title: 'Sweet Pastry Craving', sub: 'Warm oven French indulgence' },
          { icon: '🥑', title: 'Artisanal Brunch', sub: 'Wholesome & filling superfood plates' }
        ]
      }
    };
  }

  // 3. RESTAURANT / FINE DINING / BISTRO
  if (cat.includes('restaurant') || cat.includes('dining') || cat.includes('food') || cat.includes('bistro') || cat.includes('dhaba') || name.includes('restaurant')) {
    return {
      nicheKey: 'restaurant',
      subNiche: 'Fine Dining & Bistro',
      themeColor: 'rose',
      accentHex: '#e11d48',
      themeBg: '#0a0505',
      badge: `#1 Fine Dining Destination in ${city}`,
      heroTagline: `Exquisite Flavors & Unforgettable Dining at ${bizName}`,
      heroSub: `Experience signature culinary creations prepared by master chefs using farm-fresh seasonal ingredients in an elegant, vibrant setting in ${city}.`,
      heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      logoIcon: 'fa-utensils',
      heroBadge1: 'Master Chef Signatures',
      heroBadge2: 'Candlelit Ambiance & Wine',
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
      menuCategories: [
        {
          id: 'starters',
          name: 'Appetizers & Starters',
          icon: 'fa-bowl-food',
          items: [
            { name: 'Pan-Seared Truffle Scallops', price: '$18', notes: 'Cauliflower mousseline, crisped pancetta, microgreens', badge: 'Chef Choice', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80' },
            { name: 'Artisan Burrata Caprese', price: '$16', notes: 'Heirloom tomatoes, balsamic reduction, basil oil, warm focaccia', badge: 'Popular', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=300&q=80' }
          ]
        },
        {
          id: 'mains',
          name: 'Chef Signature Mains',
          icon: 'fa-utensils',
          items: [
            { name: 'Dry-Aged Prime Ribeye Steak', price: '$42', notes: 'Bone marrow butter, roasted fingerling potatoes, rosemary jus', badge: 'House Signature', img: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=300&q=80' },
            { name: 'Pan-Roasted Atlantic Halibut', price: '$36', notes: 'Saffron risotto, braised baby fennel, citrus emulsion', badge: 'Fresh Catch', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=300&q=80' }
          ]
        }
      ],
      catalogHeading: `Culinary Creations at ${bizName}`,
      catalogSub: `Carefully crafted dishes combining authentic flavors and modern artistry.`,
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
      formSubmitText: `Book Table at ${bizName}`,
      aiConcierge: {
        title: `Chef's AI Dining & Wine Pairing Guide`,
        sub: `Select your culinary mood to receive an instant recommended pairing at ${bizName}.`,
        tipTitle: `Chef's Recommendation:`,
        tipText: `Join us for our signature 5-course tasting menu paired with curated sommelier wine selections.`,
        orderBtnText: `Reserve on WhatsApp`,
        options: [
          { icon: '🍷', title: 'Romantic Dinner', sub: 'Candlelight, vintage wines & tasting courses' },
          { icon: '🥩', title: 'Steak & Prime Cuts', sub: 'Dry-aged cuts & full-bodied reds' },
          { icon: '🐟', title: 'Fresh Seafood', sub: 'Oysters, Atlantic catch & sparkling whites' },
          { icon: '🍰', title: 'Dessert & Digestif', sub: 'Warm molten tortes & artisan cocktails' }
        ]
      }
    };
  }

  // 4. FASHION / CLOTHING / ETHNIC WEAR / BOUTIQUE / BRIDAL COUTURE
  if (
    cat.includes('fashion') || cat.includes('cloth') || cat.includes('boutique') || cat.includes('saree') ||
    cat.includes('lehenga') || cat.includes('apparel') || cat.includes('ethnic') || cat.includes('tailor') ||
    name.includes('fashion') || name.includes('boutique') || name.includes('saree') || name.includes('ethnic') ||
    name.includes('couture') || name.includes('apparel') || name.includes('cloth')
  ) {
    let subNiche = 'Haute Couture & Royal Ethnic Studio';
    if (name.includes('saree') || cat.includes('saree')) {
      subNiche = 'Heritage Sarees & Handloom Atelier';
    } else if (name.includes('bridal') || cat.includes('bridal') || name.includes('lehenga')) {
      subNiche = 'Bridal Lehengas & Wedding Couture';
    }

    const specialty1 = {
      title: 'Handcrafted Bridal Lehengas & Reception Gowns',
      desc: 'Exclusive handcrafted Zardozi, Resham, and cutdana bridal ensembles tailored with custom drapes and double dupattas.',
      icon: 'fa-gem'
    };
    const specialty2 = {
      title: 'Pure Silk, Bandhani & Leheriya Sarees',
      desc: 'Authentic Jaipuri handlooms, pure Georgette Bandhej, Gota-Patti borders, and heritage Banarasi silk bridal drapes.',
      icon: 'fa-wand-magic-sparkles'
    };
    const specialty3 = {
      title: 'Bespoke Fitting & Personalized Master Styling',
      desc: 'One-on-one appointments with master stylists for personalized sizing, custom color palettes, and blouse embroideries.',
      icon: 'fa-scissors'
    };
    const specialty4 = {
      title: 'Global Video Shopping & Express Dispatch',
      desc: 'High-definition WhatsApp video call walkthrough of all store collections with insured doorstep delivery worldwide.',
      icon: 'fa-truck-fast'
    };

    const menuCategories = [
      {
        id: 'bridal',
        name: 'Bridal Lehengas & Gowns',
        icon: 'fa-crown',
        items: [
          { name: 'Royal Crimson Heritage Bridal Lehenga', price: '₹48,000+', notes: 'Heavy velvet Zardozi embroidery, hand-set micro-pearls & double designer dupatta', badge: 'Bridal Masterpiece', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80' },
          { name: 'Rose Quartz Pastel Reception Lehenga', price: '₹36,500', notes: 'Blush pink raw silk with Swarovski cutdana work, feather-light flare & can-can', badge: 'Trendsetter', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80' },
          { name: 'Midnight Emerald Velvet Sangeet Lehenga', price: '₹32,000', notes: 'Deep emerald velvet skirt with intricate antique peacock zari and sequin motifs', badge: 'Sangeet Special', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80' },
          { name: 'Sculpted Cocktail Indo-Western Gown', price: '₹24,500', notes: 'Metallic champagne shimmer organza with hand-pleated corset & dramatic trail', badge: 'Reception Chic', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        id: 'sarees',
        name: 'Heritage Sarees & Drapes',
        icon: 'fa-wand-magic-sparkles',
        items: [
          { name: 'Pure Georgette Jaipuri Bandhani Saree', price: '₹14,500', notes: 'Hand-knotted authentic Bandhej with heavy scalloped gold Gota-Patti border', badge: 'Jaipuri Classic', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80' },
          { name: 'Pure Kanjeevaram & Banarasi Silk Saree', price: '₹22,000', notes: 'Woven in pure zari with royal temple border, heavy pallu & unstitched silk blouse', badge: 'Pure Silk Mark', img: 'https://images.unsplash.com/photo-1610030469668-93510cb28666?auto=format&fit=crop&w=400&q=80' },
          { name: 'Designer Organza Pastel Floral Saree', price: '₹8,900', notes: 'Translucent Italian organza with hand-painted floral bouquets & zari border', badge: 'Daytime Festive', img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80' },
          { name: 'Authentic Mothra Leheriya Chiffon Saree', price: '₹6,500', notes: 'Traditional Rajasthani diagonal striped silk chiffon with mirror-embellished pallu', badge: 'Handloom', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80' }
        ]
      },
      {
        id: 'festive',
        name: 'Anarkalis & Sharara Sets',
        icon: 'fa-shirt',
        items: [
          { name: 'Floor-Length Zari Work Georgette Anarkali', price: '₹12,800', notes: '32-kali voluminous flared silhouette with heavily embroidered neck yoke & dupatta', badge: 'Festive Luxury', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80' },
          { name: 'Silk Peplum Kurti & Flared Sharara Set', price: '₹9,500', notes: 'Mulberry silk peplum with Gota-Patti trims, paired with twirling tiered sharara', badge: 'Best Seller', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80' },
          { name: 'Chanderi Hand-Block Print Festive Kurta Set', price: '₹5,800', notes: 'Hand-block printed Chanderi kurta with straight cigarette pants & Kota Doria drape', badge: 'Summer Festive', img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80' },
          { name: 'Mirror-Work Indo-Western Co-Ord Ensemble', price: '₹8,200', notes: 'Embroidered bustier, flared palazzo pants & matching fluid georgette cape shrug', badge: 'Modern Ethnic', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80' }
        ]
      }
    ];

    return {
      nicheKey: 'fashion',
      subNiche,
      themeColor: 'amber',
      accentHex: '#d97706',
      themeBg: '#090503',
      badge: `Premier Bridal Couture & Ethnic Wear Destination in ${city}`,
      heroTagline: `${bizName} — Exclusive Bridal Lehengas, Heritage Sarees & Royal Ethnic Studio in ${city}`,
      heroSub: `Step into pure royalty. Discover handcrafted bridal lehengas, pure Georgette Bandhani sarees, intricate Gota Patti & Zardozi embroidery, and bespoke festive couture crafted to make every celebration unforgettable at ${bizName}.`,
      heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
      logoIcon: 'fa-gem',
      heroBadge1: 'Handcrafted Bridal Couture',
      heroBadge2: 'Pure Handloom & WhatsApp Video Shopping',
      navCta: 'Book Bridal Consultation',
      primaryCta: 'Explore Bridal Collection',
      secondaryCta: 'WhatsApp Video Shopping',
      servicesHeading: 'Handcrafted Elegance & Master Tailoring',
      servicesSub: `Every weave tells a story of royal Rajasthani craftsmanship, authentic fabrics, and bridal perfection at ${bizName}.`,
      services: [specialty1, specialty2, specialty3, specialty4],
      menuCategories,
      catalogHeading: `Exclusive Collections at ${bizName}`,
      catalogSub: `Explore our bridal lehengas, handwoven sarees, and festive party wear available in-store in ${city} and via global video shopping.`,
      galleryHeading: `Boutique Ambiance & Bridal Looks at ${bizName}`,
      gallerySub: `A glimpse into real brides, festive showcases, and intricate artisan craftsmanship at ${bizName} in ${city}.`,
      gallery: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80'
      ],
      testimonials: [
        {
          name: 'Pooja Sharma',
          loc: `${city} Bride`,
          text: `Got my dream wedding lehenga from ${bizName}! The Zardozi handwork is breathtaking, the fitting was 100% exact on the first trial, and their team was so warm and helpful.`,
          rating: 5
        },
        {
          name: 'Meenakshi Rathore',
          loc: `Festive Shopper, ${city}`,
          text: `Hands down the most authentic Bandhani and Gota-Patti sarees in ${city}. Unbeatable fabric richness, vibrant colors, and very reasonable pricing. My entire family shops here!`,
          rating: 5
        },
        {
          name: 'Simran Walia',
          loc: `NRI Bride (Video Shopping Client)`,
          text: `Did my entire wedding shopping over WhatsApp video call with ${bizName}. They showed every minute detail with patience, customized my blouses perfectly, and delivered safely to my doorstep!`,
          rating: 5
        }
      ],
      contactBadge: 'Bridal Appointments',
      contactTitle: `Schedule Your Bridal Consultation at ${bizName}`,
      contactSub: `Book an in-person showroom fitting or a personalized WhatsApp video shopping session with our master stylist.`,
      formTitle: `Book a Styling Consultation`,
      formSub: 'Complimentary bridal consultation • Custom blouse fitting • Global dispatch',
      formServiceLabel: 'Occasion / Requirement',
      formOptions: [
        'Bridal Wedding Lehenga Consultation',
        'Sangeet & Cocktail Reception Wear',
        'Traditional Bandhani & Silk Sarees',
        'Festive Anarkali & Sharara Sets',
        'WhatsApp Live Video Shopping Session'
      ],
      formSubmitText: `Book Consultation at ${bizName}`,
      aiConcierge: {
        title: `Interactive AI Bridal & Festive Stylist`,
        sub: `Select your upcoming occasion below to receive instant personalized outfit recommendations from ${bizName}.`,
        tipTitle: `Stylist Recommendation:`,
        tipText: `Shopping for your wedding? We recommend scheduling your bridal fitting at least 4-6 weeks before the wedding for customized master embroidery & blouse tailoring.`,
        orderBtnText: `Inquire on WhatsApp`,
        options: [
          { icon: '👑', title: 'Royal Wedding Bride', sub: 'Crimson & maroon heavy Zardozi lehengas' },
          { icon: '✨', title: 'Sangeet & Reception', sub: 'Pastel crystals, sequins & cocktail gowns' },
          { icon: '🪔', title: 'Festive & Puja Wear', sub: 'Pure Bandhani, Leheriya & Gota Patti' },
          { icon: '📱', title: 'Video Call Shopping', sub: 'Live store tour with doorstep worldwide delivery' }
        ]
      }
    };
  }

  // 5. DEFAULT (HOME SERVICES, SALONS, GYMS, TRADES)
  const cleanCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Professional';
  return {
    nicheKey: 'general',
    subNiche: `${cleanCategory} Services`,
    themeColor: 'indigo',
    accentHex: '#4f46e5',
    themeBg: '#070b14',
    badge: `#1 Rated ${cleanCategory} in ${city}`,
    heroTagline: `Top-Rated ${cleanCategory} Services You Can Rely On in ${city} — ${bizName}`,
    heroSub: `Dedicated professionals committed to delivering exceptional craftsmanship, personalized customer care, and reliable results on every single project.`,
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    logoIcon: 'fa-shield-halved',
    heroBadge1: 'Licensed & Insured Specialists',
    heroBadge2: '100% Satisfaction Guarantee',
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
    menuCategories: [
      {
        id: 'primary',
        name: 'Core Services',
        icon: 'fa-wrench',
        items: [
          { name: `Standard ${cleanCategory} Service`, price: 'Free Estimate', notes: 'Complete evaluation, standard repairs, maintenance & servicing', badge: 'Most Popular', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80' },
          { name: `Emergency / Same-Day ${cleanCategory}`, price: 'Priority', notes: 'Immediate response dispatched directly to your location in ' + city, badge: 'Rapid Response', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80' }
        ]
      }
    ],
    catalogHeading: `Professional ${cleanCategory} Solutions at ${bizName}`,
    catalogSub: `High quality, transparent pricing, and guaranteed customer satisfaction in ${city}.`,
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
    formSubmitText: `Submit Request to ${bizName}`,
    aiConcierge: {
      title: `AI Service & Estimate Assistant`,
      sub: `Select your service requirement below to connect with the team at ${bizName}.`,
      tipTitle: `Project Estimator Tip:`,
      tipText: `Need an urgent estimate or same-day service? Contact us on WhatsApp for immediate priority scheduling.`,
      orderBtnText: `Inquire on WhatsApp`,
      options: [
        { icon: '⚡', title: 'Urgent / Same-Day Service', sub: 'Immediate dispatch for critical issues' },
        { icon: '🔍', title: 'Inspection & Consultation', sub: 'Thorough evaluation & transparent quote' },
        { icon: '🛠️', title: 'Complete Project Upgrade', sub: 'End-to-end design & quality craftsmanship' },
        { icon: '📋', title: 'Routine Maintenance', sub: 'Keep everything operating at peak condition' }
      ]
    }
  };
}

/**
 * Builds the complete modern, luxury, fully animated HTML demo website for the prospect
 */
function generateSiteHTML(prospect, siteId, options = {}) {
  const city = prospect.city || 'Toronto';
  const bizName = prospect.business_name || 'Local Business';
  const phone = prospect.phone || '+1 (416) 555-0199';
  const phoneDigits = phone.replace(/[^0-9]/g, '') || '14165550199';
  const rating = prospect.rating || 4.9;
  const reviews = prospect.review_count || 58;
  
  const baseUrlOption = options.baseUrl || 'https://leads-gen-b3uj.onrender.com';
  const baseUrl = (typeof baseUrlOption === 'object' && baseUrlOption?.baseUrl) 
    ? baseUrlOption.baseUrl 
    : (typeof baseUrlOption === 'string' ? baseUrlOption : 'https://leads-gen-b3uj.onrender.com');

  const config = db.getConfig();
  const rawSenderWa = config.sender_whatsapp || '918920608191';
  const agencyWhatsApp = rawSenderWa.replace(/[^0-9]/g, '') || '918920608191';
  const senderName = config.sender_name || 'Devesh Kumar';

  // Get bespoke tailored profile matching this specific business niche
  const profile = getBespokeNicheProfile(prospect.category, bizName, city);

  // WhatsApp quick text for customer to contact business
  const customerWaText = profile.nicheKey === 'clinic'
    ? `Hello ${bizName}! I saw your clinic website and would like to book a consultation or check walk-in availability.`
    : profile.nicheKey === 'fashion'
    ? `Hello ${bizName}! I saw your boutique website and would like to inquire about your bridal collections, sarees, and custom fitting.`
    : profile.nicheKey === 'cafe'
    ? `Hi ${bizName}! I saw your website and would like to reserve a table or ask about your menu.`
    : profile.nicheKey === 'restaurant'
    ? `Hi ${bizName}! I would like to reserve a dining table.`
    : `Hi ${bizName}! I would like to inquire about your services.`;

  // WhatsApp claim text for business owner to claim from developer
  const claimWaText = `Hello ${senderName}! I am the owner/manager of ${bizName} in ${city}. I saw the modern website demo you built for us (${baseUrl}/demos/${siteId}) and I would like to claim, customize and connect our domain!`;

  const isClinic = profile.nicheKey === 'clinic';
  const isCafe = profile.nicheKey === 'cafe';
  const isFashion = profile.nicheKey === 'fashion';

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover">
  <title>${bizName} | ${profile.badge} (${city})</title>
  <meta name="description" content="${profile.heroTagline}">
  <meta name="theme-color" content="${profile.themeBg}">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
  
  <style>
    html {
      -webkit-tap-highlight-color: transparent;
      scroll-padding-top: 90px;
    }
    body { 
      font-family: 'Plus Jakarta Sans', sans-serif; 
      background-color: ${profile.themeBg}; 
      color: #f8fafc; 
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .touch-pan-y { touch-action: pan-y; }
    .font-serif-luxury {
      font-family: ${isClinic ? "'Plus Jakarta Sans', sans-serif" : "'Playfair Display', serif"};
    }

    /* Ambient Glow & Deep Velvet Lighting */
    .glow-radial-accent {
      background: radial-gradient(circle at 50% 20%, ${isClinic ? 'rgba(14, 165, 233, 0.22)' : 'rgba(217, 119, 6, 0.22)'} 0%, ${isClinic ? 'rgba(2, 132, 199, 0.08)' : 'rgba(180, 83, 9, 0.08)'} 45%, ${profile.themeBg} 80%);
    }
    .glow-orb-1 {
      position: absolute;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, ${isClinic ? 'rgba(14, 165, 233, 0.18)' : 'rgba(245, 158, 11, 0.18)'} 0%, rgba(0, 0, 0, 0) 70%);
      filter: blur(90px);
      pointer-events: none;
      border-radius: 50%;
    }
    .glow-orb-2 {
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, ${isClinic ? 'rgba(16, 185, 129, 0.15)' : 'rgba(180, 83, 9, 0.14)'} 0%, rgba(0, 0, 0, 0) 70%);
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
      box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px 2px ${isClinic ? 'rgba(14, 165, 233, 0.25)' : 'rgba(245, 158, 11, 0.2)'};
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

    /* 3D Holographic Orbital Rings */
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

    /* Shimmer Button Animation */
    @keyframes shimmerEffect {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .action-shimmer-btn {
      background: ${isClinic 
        ? 'linear-gradient(90deg, #0284c7 0%, #38bdf8 35%, #0ea5e9 50%, #38bdf8 65%, #0284c7 100%)' 
        : 'linear-gradient(90deg, #d97706 0%, #fbbf24 35%, #ffd700 50%, #fbbf24 65%, #d97706 100%)'};
      background-size: 200% auto;
      animation: shimmerEffect 4s linear infinite;
      box-shadow: 0 10px 25px -5px ${isClinic ? 'rgba(14, 165, 233, 0.4)' : 'rgba(245, 158, 11, 0.4)'};
    }

    /* Glassmorphism Cards */
    .glass-card {
      background: ${isClinic ? 'rgba(11, 23, 44, 0.75)' : 'rgba(22, 16, 12, 0.72)'};
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid ${isClinic ? 'rgba(14, 165, 233, 0.22)' : 'rgba(245, 158, 11, 0.18)'};
    }
    .glass-card:hover {
      border-color: ${isClinic ? 'rgba(14, 165, 233, 0.55)' : 'rgba(245, 158, 11, 0.5)'};
    }
  </style>
</head>
<body class="selection:bg-sky-500 selection:text-white pb-24 md:pb-0">

  <!-- Top Sticky Agency Claim Banner -->
  <div id="agency-claim-banner" class="bg-gradient-to-r from-[#071326] via-[#0c2242] to-[#071326] text-white text-xs py-2 px-3 sm:px-4 shadow-xl sticky top-0 z-50 border-b border-sky-500/30 backdrop-blur-md">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5 sm:gap-2 font-medium truncate">
        <span class="inline-flex items-center justify-center bg-gradient-to-r from-sky-400 to-emerald-400 text-black rounded-full w-5 h-5 text-xs font-black shadow shrink-0 animate-pulse">✨</span>
        <span class="text-sky-200/90 text-[11px] sm:text-xs truncate">Demo for <strong>${bizName}</strong></span>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <a href="https://wa.me/${agencyWhatsApp}?text=${encodeURIComponent(claimWaText)}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-3 py-1 rounded-full text-[11px] sm:text-xs shadow flex items-center gap-1.5 transition active:scale-95">
          <i class="fa-brands fa-whatsapp text-xs sm:text-sm"></i>
          <span class="hidden sm:inline">Claim on WhatsApp</span>
          <span class="sm:hidden">Claim</span>
        </a>
        <button onclick="document.getElementById('claim-modal').classList.remove('hidden')" class="bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold px-2.5 py-1 rounded-full text-[11px] sm:text-xs transition active:scale-95">
          Details
        </button>
      </div>
    </div>
  </div>

  <!-- Main Navigation -->
  <header class="bg-[#081222]/95 backdrop-blur-xl border-b border-sky-950/60 sticky top-[37px] z-40 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
      
      <!-- Brand Logo -->
      <a href="#" class="flex items-center gap-2.5 sm:gap-3.5 group max-w-[200px] sm:max-w-none">
        <div class="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-600 via-sky-700 to-slate-900 text-sky-100 flex items-center justify-center font-bold text-lg sm:text-xl shadow-xl shadow-sky-950/40 border border-sky-500/30 group-hover:scale-105 transition duration-300 shrink-0">
          <i class="fa-solid ${profile.logoIcon || 'fa-heart-pulse'} text-sky-300"></i>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping"></span>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
        </div>
        <div class="truncate">
          <span class="text-base sm:text-xl lg:text-2xl font-bold tracking-tight text-white block leading-tight group-hover:text-sky-300 transition truncate">${bizName}</span>
          <span class="text-[9px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest text-sky-400 font-semibold block truncate">${city} • ${profile.subNiche || 'Healthcare'}</span>
        </div>
      </a>
      
      <!-- Desktop Nav Links -->
      <nav class="hidden md:flex items-center gap-7 lg:gap-8 font-medium text-slate-300 text-sm">
        <a href="#about" class="hover:text-sky-400 transition">${isClinic ? 'Doctor Care' : isFashion ? 'Boutique Story' : 'Our Story'}</a>
        <a href="#menu" class="hover:text-sky-400 transition flex items-center gap-1.5">
          <span>${isClinic ? 'Specialties' : isFashion ? 'Bridal & Sarees' : isCafe ? 'Artisan Menu' : 'Offerings'}</span>
          <span class="text-[9px] uppercase px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">Verified</span>
        </a>
        <a href="#ambiance" class="hover:text-sky-400 transition">${isClinic ? 'Facility' : isFashion ? 'Lookbook' : 'Ambiance'}</a>
        <a href="#reviews" class="hover:text-sky-400 transition">Reviews</a>
        <a href="#reserve" class="hover:text-sky-400 transition">${isClinic ? 'Appointments' : isFashion ? 'Bridal Fitting' : 'Reservations'}</a>
      </nav>

      <!-- Desktop & Mobile Header Actions -->
      <div class="flex items-center gap-2 sm:gap-3">
        <a href="tel:${phone}" class="hidden lg:flex items-center gap-2 text-slate-300 font-medium hover:text-sky-400 text-xs px-3 py-2 rounded-xl border border-slate-800 hover:border-sky-500/30 transition">
          <i class="fa-solid fa-phone text-sky-400"></i>
          <span>${phone}</span>
        </a>
        <a href="#reserve" class="action-shimmer-btn text-white font-extrabold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg shadow-sky-900/40 transition hover:scale-105 active:scale-95 shrink-0">
          ${profile.navCta}
        </a>

        <!-- Mobile Hamburger Menu Button -->
        <button id="mobile-menu-btn" onclick="toggleMobileMenu()" class="md:hidden w-10 h-10 rounded-xl bg-slate-900/90 border border-sky-500/30 flex items-center justify-center text-sky-300 hover:text-white hover:border-sky-400 transition active:scale-95 shrink-0" aria-label="Toggle navigation menu">
          <i id="mobile-menu-icon" class="fa-solid fa-bars text-base"></i>
        </button>
      </div>

    </div>

    <!-- Mobile Navigation Drawer -->
    <div id="mobile-drawer" class="hidden md:hidden bg-[#081222]/98 border-t border-sky-500/20 px-5 py-4 space-y-3.5 backdrop-blur-2xl shadow-2xl transition-all">
      <nav class="flex flex-col space-y-2.5 font-medium text-sm text-slate-200">
        <a href="#about" onclick="toggleMobileMenu()" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-500/10 hover:text-sky-300 transition">
          <i class="fa-solid ${isClinic ? 'fa-stethoscope' : isFashion ? 'fa-gem' : 'fa-circle-info'} text-sky-400 w-5"></i>
          <span>${isClinic ? 'Doctor Care & Standards' : isFashion ? 'Boutique Story' : 'Our Story'}</span>
        </a>
        <a href="#menu" onclick="toggleMobileMenu()" class="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-500/10 hover:text-sky-300 transition">
          <div class="flex items-center gap-3">
            <i class="fa-solid ${isClinic ? 'fa-notes-medical' : isFashion ? 'fa-shirt' : 'fa-bars'} text-sky-400 w-5"></i>
            <span>${isClinic ? 'Specialties & Services' : isFashion ? 'Bridal & Saree Collection' : 'Catalog'}</span>
          </div>
          <span class="text-[9px] uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">Explore</span>
        </a>
        <a href="#ambiance" onclick="toggleMobileMenu()" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-500/10 hover:text-sky-300 transition">
          <i class="fa-solid ${isClinic ? 'fa-hospital' : isFashion ? 'fa-camera-retro' : 'fa-image'} text-sky-400 w-5"></i>
          <span>${isClinic ? 'Clinic Rooms & Diagnostic Lab' : isFashion ? 'Lookbook & Studio' : 'Ambiance'}</span>
        </a>
        <a href="#reviews" onclick="toggleMobileMenu()" class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-500/10 hover:text-sky-300 transition">
          <i class="fa-solid fa-star text-sky-400 w-5"></i>
          <span>${isClinic ? 'Patient' : isFashion ? 'Client' : 'Customer'} Reviews (${rating}★)</span>
        </a>
        <a href="#reserve" onclick="toggleMobileMenu()" class="flex items-center gap-3 p-2.5 rounded-xl bg-sky-500/15 text-sky-300 border border-sky-500/30 font-bold transition">
          <i class="fa-solid fa-calendar-check text-sky-400 w-5"></i>
          <span>${profile.navCta}</span>
        </a>
      </nav>

      <!-- Mobile Drawer Contact Card -->
      <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <a href="tel:${phone}" class="flex items-center gap-2 text-slate-300 hover:text-sky-400 py-1 font-mono">
          <i class="fa-solid fa-phone text-sky-400"></i>
          <span>${phone}</span>
        </a>
        <a href="https://wa.me/${phoneDigits}?text=${encodeURIComponent(customerWaText)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 text-emerald-400 font-bold py-1">
          <i class="fa-brands fa-whatsapp text-sm"></i>
          <span>WhatsApp Hotline</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 glow-radial-accent">
    <!-- Ambient Glow Orbs -->
    <div class="glow-orb-1 top-10 left-1/4"></div>
    <div class="glow-orb-2 bottom-10 right-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        <!-- Left Hero Content -->
        <div class="lg:col-span-7 space-y-7">
          
          <div class="inline-flex items-center gap-2.5 bg-sky-500/10 border border-sky-500/30 text-sky-300 px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span>${profile.badge}</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            ${bizName} <br/>
            <span class="text-sky-400 font-medium text-3xl sm:text-4xl lg:text-5xl">Compassionate Patient Care & Clinical Excellence</span>
          </h1>

          <p class="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
            ${profile.heroSub}
          </p>

          <!-- Interactive Action Buttons -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <a href="#menu" class="action-shimmer-btn text-white font-extrabold px-6 sm:px-8 py-3.5 rounded-2xl shadow-xl shadow-sky-900/40 transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base">
              <i class="fa-solid ${profile.logoIcon || 'fa-notes-medical'}"></i>
              <span>${profile.primaryCta}</span>
            </a>
            <a href="#reserve" class="bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-sky-500/30 hover:border-sky-500/60 font-bold px-6 sm:px-7 py-3.5 rounded-2xl transition active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base backdrop-blur-md">
              <i class="fa-solid fa-calendar-check text-sky-400"></i>
              <span>${profile.navCta}</span>
            </a>
          </div>

          <!-- Social Proof & Badges -->
          <div class="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-slate-300">
            <div class="flex items-center gap-2">
              <div class="flex text-amber-400 text-sm">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <span class="font-bold text-white text-sm">${rating}</span>
              <span class="text-slate-400">(${reviews} Google Reviews)</span>
            </div>
            <div class="flex items-center gap-2 text-sky-300 font-medium">
              <i class="fa-solid fa-shield-halved text-emerald-400"></i>
              <span>${profile.heroBadge1 || 'Certified Practitioners'}</span>
            </div>
            <div class="flex items-center gap-2 text-sky-300 font-medium">
              <i class="fa-solid fa-bolt text-sky-400"></i>
              <span>${profile.heroBadge2 || 'Walk-Ins & Direct Billing'}</span>
            </div>
          </div>

        </div>

        <!-- Right Hero 3D Interactive Studio with Live Three.js Experience -->
        <div class="lg:col-span-5 relative perspective-container">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-sky-500/40 glass-card tilt-card-3d group">
            
            <div class="glare-3d"></div>

            <!-- Top 3D Control Header -->
            <div class="px-4 sm:px-5 py-3 border-b border-sky-500/20 bg-black/40 backdrop-blur-md flex items-center justify-between z-20 relative depth-layer-2">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span class="text-xs font-bold text-sky-300 font-mono tracking-wider">3D REAL-TIME STUDIO</span>
              </div>
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Interactive 360°
              </span>
            </div>

            <!-- 3D Three.js Container with Touch pan-y -->
            <div id="canvas-3d-container" class="relative w-full h-[320px] sm:h-[400px] lg:h-[460px] cursor-grab active:cursor-grabbing flex items-center justify-center bg-radial from-[#0d1d36] via-[#091529] to-[#050c17] touch-pan-y select-none">
              <!-- Ambient 3D Rotating Rings Background -->
              <div class="absolute w-60 sm:w-72 h-60 sm:h-72 rounded-full border border-sky-500/20 orbital-ring-1 pointer-events-none"></div>
              <div class="absolute w-72 sm:w-84 h-72 sm:h-84 rounded-full border border-emerald-400/10 orbital-ring-2 pointer-events-none"></div>

              <!-- Interactive Drag & Tap Prompt -->
              <div class="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 pointer-events-none depth-layer-1">
                <span class="text-[10px] text-slate-300 bg-black/75 px-3 py-1 rounded-full border border-sky-500/30 flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                  <i class="fa-solid fa-arrows-up-down-left-right text-sky-400"></i>
                  <span>Drag 360° • Click to pulse</span>
                </span>
              </div>
            </div>
            
            <!-- Floating Live Status Overlay with 3D Depth Layers -->
            <div class="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 p-3.5 sm:p-4 rounded-2xl glass-card text-white z-20 depth-layer-3 border border-sky-500/30 shadow-2xl">
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] uppercase tracking-wider font-bold text-sky-400 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Open Today In ${city}
                </span>
                <span class="text-[10px] sm:text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">${profile.subNiche || 'Healthcare'}</span>
              </div>
              <h4 class="font-bold text-base sm:text-lg text-slate-100 truncate">${bizName}</h4>
              <p class="text-xs text-slate-300 truncate">${prospect.address || city + ', Ontario, Canada'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Interactive 3D Holographic AI Concierge -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16 relative z-20 perspective-container">
    <div class="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c1b33] via-[#081426] to-[#040b17] border border-sky-500/40 shadow-2xl relative overflow-hidden tilt-card-3d">
      <div class="glare-3d"></div>
      <div class="absolute top-0 right-0 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sky-900/40 depth-layer-1">
        <div class="flex items-start gap-4">
          <div class="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500/30 to-slate-900 flex items-center justify-center shrink-0 border border-sky-500/40 shadow-lg shadow-sky-950/60 float-3d-element">
            <i class="fa-solid fa-wand-magic-sparkles text-sky-300 text-xl"></i>
            <div class="absolute inset-0 rounded-2xl border border-sky-400/30 orbital-ring-1 pointer-events-none"></div>
          </div>
          <div>
            <div class="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">
              <span>Smart Clinic Concierge</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-bold text-white">
              ${profile.aiConcierge?.title || 'Interactive Patient Care & Triage Assistant'}
            </h3>
            <p class="text-xs sm:text-sm text-slate-400 mt-1">
              ${profile.aiConcierge?.sub || 'Select your need below to connect with the right department.'}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-xs font-semibold text-emerald-300">Live Assistant Online</span>
        </div>
      </div>

      <!-- Quick Mood Buttons with 3D Depth Layers -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 depth-layer-2">
        ${(profile.aiConcierge?.options || []).map((opt, idx) => `
          <button onclick="handleAiOption('${opt.title}', '${opt.sub}')" class="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-sky-950/50 border border-slate-800 hover:border-sky-500/50 text-left transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-900/20">
            <div class="text-sky-400 text-lg mb-1 group-hover:scale-125 transition duration-300">${opt.icon}</div>
            <div class="font-bold text-xs sm:text-sm text-slate-100">${opt.title}</div>
            <div class="text-[11px] text-slate-400 mt-0.5">${opt.sub}</div>
          </button>
        `).join('')}
      </div>

      <!-- Recommendation Display Box -->
      <div id="ai-response-box" class="mt-6 p-4 sm:p-5 rounded-2xl bg-[#060f1c] border border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 depth-layer-3 shadow-xl">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5 border border-sky-500/30">
            <i class="fa-solid fa-notes-medical text-lg"></i>
          </div>
          <div>
            <div class="text-[11px] uppercase tracking-wider text-sky-400 font-bold" id="ai-response-title">${profile.aiConcierge?.tipTitle || 'Coordinator Tip:'}</div>
            <p class="text-xs sm:text-sm text-slate-200 mt-0.5 leading-relaxed" id="ai-response-text">
              ${profile.aiConcierge?.tipText || `New to ${bizName}? You can walk in today or book an online consultation with one of our licensed physicians.`}
            </p>
          </div>
        </div>
        <a id="ai-order-btn" href="https://wa.me/${phoneDigits}?text=${encodeURIComponent(customerWaText)}" target="_blank" rel="noopener noreferrer" class="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5 hover:scale-105">
          <i class="fa-brands fa-whatsapp text-sm"></i>
          <span>${profile.aiConcierge?.orderBtnText || 'Inquire on WhatsApp'}</span>
        </a>
      </div>

    </div>
  </section>

  <!-- Interactive Specialties & Offerings Section -->
  <section id="menu" class="py-20 bg-[#060e1a] border-y border-sky-950/40 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-sky-400 font-bold uppercase tracking-widest text-xs flex items-center gap-1.5">
            <i class="fa-solid ${profile.logoIcon || 'fa-notes-medical'}"></i>
            <span>Verified Healthcare Departments</span>
          </span>
          <h2 class="text-3xl sm:text-4xl font-bold text-white mt-2">
            ${profile.catalogHeading}
          </h2>
        </div>
        
        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:flex-wrap" id="menu-tabs">
          <button onclick="filterMenu('all', this)" class="menu-tab-btn active px-4 py-2.5 rounded-xl text-xs font-bold transition bg-sky-500 text-white shadow-md shrink-0 whitespace-nowrap active:scale-95">
            All Specialties
          </button>
          ${(profile.menuCategories || []).map(cat => `
            <button onclick="filterMenu('${cat.id}', this)" class="menu-tab-btn px-4 py-2.5 rounded-xl text-xs font-bold transition bg-slate-900 text-slate-300 hover:text-sky-300 border border-slate-800 shrink-0 whitespace-nowrap active:scale-95">
              <i class="fa-solid ${cat.icon} mr-1.5 text-sky-400"></i> ${cat.name}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Grid with 3D Perspective Tilt -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container" id="menu-grid">
        ${(profile.menuCategories || []).flatMap(cat => cat.items.map(item => `
          <div class="menu-item-card glass-card tilt-card-3d rounded-2xl p-4 flex flex-col justify-between group border border-sky-500/20 hover:border-sky-500/60" data-category="${cat.id}">
            <div class="glare-3d"></div>
            <div>
              <div class="relative h-44 rounded-xl overflow-hidden mb-4 bg-slate-900 depth-layer-2 shadow-lg">
                <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                <div class="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md text-sky-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-500/40 depth-layer-3 shadow">
                  ${item.badge}
                </div>
              </div>

              <div class="flex items-start justify-between gap-2 mb-1.5 depth-layer-1">
                <h4 class="font-bold text-base text-white group-hover:text-sky-300 transition leading-snug">
                  ${item.name}
                </h4>
                <span class="text-sky-400 font-extrabold text-sm shrink-0 font-mono">${item.price}</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed depth-layer-1 font-light">${item.notes}</p>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between depth-layer-2">
              <span class="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">${cat.name}</span>
              <a href="https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hello ${bizName}! I would like to inquire/book an appointment for: ${item.name}.`)}" target="_blank" rel="noopener noreferrer" class="text-xs text-sky-400 hover:text-white font-bold flex items-center gap-1.5 transition py-1 px-2.5 rounded-lg bg-sky-500/10 hover:bg-sky-500 hover:text-black">
                <span>Book 3D</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </a>
            </div>
          </div>
        `)).join('')}
      </div>

    </div>
  </section>

  <!-- Core Specialties & Care Pillars -->
  <section id="about" class="py-20 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-sky-400 font-bold uppercase tracking-widest text-xs">Excellence In Practice</span>
        <h2 class="text-3xl sm:text-4xl font-bold text-white mt-2">
          ${profile.servicesHeading}
        </h2>
        <p class="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
          ${profile.servicesSub}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
        ${profile.services.map(s => `
          <div class="glass-card tilt-card-3d rounded-2xl p-6 flex flex-col justify-between group border border-sky-500/20 hover:border-sky-500/50">
            <div class="glare-3d"></div>
            <div>
              <div class="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xl mb-5 group-hover:bg-sky-500 group-hover:text-black transition duration-300 border border-sky-500/30 depth-layer-2 shadow-lg">
                <i class="fa-solid ${s.icon}"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-100 group-hover:text-sky-300 transition depth-layer-1">${s.title}</h3>
              <p class="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed font-light depth-layer-1">${s.desc}</p>
            </div>
            <div class="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-sky-400 depth-layer-2">
              <span>Care at ${bizName}</span>
              <i class="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition duration-300"></i>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  </section>

  <!-- Photo Gallery & Clinical Facility -->
  <section id="ambiance" class="py-20 bg-[#060e1a] border-y border-sky-950/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-sky-400 font-bold uppercase tracking-widest text-xs">Modern Facilities</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-white mt-2">${profile.galleryHeading}</h2>
        </div>
        <p class="text-slate-400 max-w-md text-xs sm:text-sm">
          ${profile.gallerySub}
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
        ${profile.gallery.map((img, i) => `
          <div class="rounded-2xl overflow-hidden shadow-2xl group relative h-64 bg-slate-900 border border-sky-500/20 tilt-card-3d">
            <div class="glare-3d"></div>
            <img src="${img}" alt="Facility ${i+1}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700 depth-layer-1">
            <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5 depth-layer-2">
              <span class="text-sky-200 font-bold text-sm drop-shadow">${bizName} • ${city}</span>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  </section>

  <!-- Verified Reviews with 3D Tilt -->
  <section id="reviews" class="py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="text-sky-400 font-bold uppercase tracking-widest text-xs">Patient & Client Stories</span>
        <h2 class="text-3xl sm:text-4xl font-bold text-white mt-2">Trusted Across ${city}</h2>
        <div class="flex items-center justify-center gap-2 mt-3">
          <div class="flex text-amber-400 text-sm">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <span class="font-bold text-slate-200 text-sm">Rated ${rating}/5 from ${reviews} verified Google reviews</span>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-6 perspective-container">
        ${profile.testimonials.map(t => `
          <div class="glass-card tilt-card-3d rounded-2xl p-6 flex flex-col justify-between border border-sky-500/20 group">
            <div class="glare-3d"></div>
            <div>
              <div class="flex text-amber-400 text-xs mb-3 depth-layer-1">
                ${Array(t.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
              </div>
              <p class="text-sm text-slate-300 leading-relaxed italic depth-layer-1 font-light">"${t.text}"</p>
            </div>
            <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between depth-layer-2">
              <div>
                <h4 class="font-bold text-sm text-white">${t.name}</h4>
                <p class="text-xs text-sky-400">${t.loc}</p>
              </div>
              <span class="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Verified Patient</span>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  </section>

  <!-- Interactive Booking & Appointment Section -->
  <section id="reserve" class="py-20 bg-[#060e1a] border-t border-sky-950/40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-12 gap-12 items-center">
        
        <div class="lg:col-span-6 space-y-6">
          <span class="text-sky-400 font-bold uppercase tracking-widest text-xs">${profile.contactBadge}</span>
          <h2 class="text-3xl sm:text-4xl font-bold text-white">${profile.contactTitle}</h2>
          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
            ${profile.contactSub}
          </p>

          <div class="space-y-4 pt-2">
            <div class="flex items-start gap-4 p-4 rounded-xl glass-card">
              <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <h4 class="font-bold text-sm text-white">Physical Location</h4>
                <p class="text-xs text-slate-300 mt-0.5">${prospect.address || city + ', Ontario, Canada'}</p>
                ${prospect.google_maps_url ? `<a href="${prospect.google_maps_url}" target="_blank" rel="noopener noreferrer" class="text-xs text-sky-400 hover:underline mt-1 inline-block">Open Google Maps Direction &rarr;</a>` : ''}
              </div>
            </div>

            <div class="flex items-start gap-4 p-4 rounded-xl glass-card">
              <div class="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div>
                <h4 class="font-bold text-sm text-white">Direct Telephone Line</h4>
                <p class="text-xs text-slate-300 mt-0.5">${phone}</p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-4 rounded-xl glass-card">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <i class="fa-brands fa-whatsapp"></i>
              </div>
              <div>
                <h4 class="font-bold text-sm text-white">Instant WhatsApp Contact</h4>
                <p class="text-xs text-slate-300 mt-0.5">Instant online confirmation & walk-in inquiries</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Appointment Form Card -->
        <div class="lg:col-span-6">
          <div class="p-6 sm:p-8 rounded-3xl glass-card border border-sky-500/30 shadow-2xl relative">
            <h3 class="text-2xl font-bold text-white">${profile.formTitle}</h3>
            <p class="text-xs text-slate-400 mt-1 mb-6">${profile.formSub}</p>

            <form id="booking-form" onsubmit="handleBookingSubmit(event)" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                <input type="text" id="form-name" required placeholder="e.g. Michael Smith" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none">
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input type="tel" id="form-phone" required placeholder="+1 (416) ..." class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none">
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-300 mb-1">Preferred Date</label>
                  <input type="date" id="form-date" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none">
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">${profile.formServiceLabel}</label>
                <select id="form-service" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none">
                  ${profile.formOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Consultation Notes / Symptoms</label>
                <textarea id="form-notes" rows="2" placeholder="Brief description of consultation reason..." class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-sky-500 focus:outline-none"></textarea>
              </div>

              <button type="submit" class="w-full action-shimmer-btn text-white font-extrabold py-3.5 rounded-xl shadow-lg transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-sm">
                <i class="fa-solid fa-check-circle"></i>
                <span>${profile.formSubmitText}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-12 bg-[#040810] border-t border-slate-900 text-xs text-slate-500">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div>
        <p class="font-bold text-slate-300">${bizName} &copy; ${new Date().getFullYear()} • ${city}</p>
        <p class="mt-1">${profile.subNiche || 'Healthcare'} • ${prospect.address || city + ', Ontario, Canada'}</p>
      </div>
      <div class="flex items-center gap-4">
        <a href="#about" class="hover:text-sky-400">Services</a>
        <a href="#reviews" class="hover:text-sky-400">Reviews</a>
        <a href="#reserve" class="hover:text-sky-400">Appointments</a>
        <a href="tel:${phone}" class="hover:text-sky-400 font-mono">${phone}</a>
      </div>
    </div>
  </footer>

  <!-- Floating Mobile Quick Contact Bar -->
  <div class="fixed bottom-0 left-0 right-0 z-40 bg-[#081222]/95 border-t border-sky-500/30 p-2.5 flex items-center gap-2 md:hidden backdrop-blur-xl">
    <a href="tel:${phone}" class="flex-1 bg-slate-900 border border-sky-500/30 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95">
      <i class="fa-solid fa-phone text-sky-400"></i>
      <span>Call Phone</span>
    </a>
    <a href="https://wa.me/${phoneDigits}?text=${encodeURIComponent(customerWaText)}" target="_blank" rel="noopener noreferrer" class="flex-1 bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 shadow-lg shadow-emerald-900/40">
      <i class="fa-brands fa-whatsapp text-sm"></i>
      <span>WhatsApp</span>
    </a>
  </div>

  <!-- Agency Claim Modal -->
  <div id="claim-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-sky-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative text-white">
      <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="absolute top-4 right-4 text-slate-400 hover:text-white text-lg">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-xl mb-4 border border-sky-500/40">
        <i class="fa-solid fa-sparkles"></i>
      </div>
      <h3 class="text-xl font-bold">Claim & Launch This Website for ${bizName}</h3>
      <p class="text-xs text-slate-300 mt-2 leading-relaxed">
        This high-converting website was custom-designed for <strong>${bizName}</strong>. You can claim it, edit all copy, doctors, photos, and connect your official custom domain.
      </p>

      <div class="mt-6 space-y-3">
        <a href="https://wa.me/${agencyWhatsApp}?text=${encodeURIComponent(claimWaText)}" target="_blank" rel="noopener noreferrer" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition active:scale-95">
          <i class="fa-brands fa-whatsapp text-base"></i>
          <span>Claim on WhatsApp with Developer</span>
        </a>
        <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition">
          Close Preview
        </button>
      </div>
    </div>
  </div>

  <!-- Scripts -->
  <script>
    function toggleMobileMenu() {
      const drawer = document.getElementById('mobile-drawer');
      const icon = document.getElementById('mobile-menu-icon');
      if (drawer.classList.contains('hidden')) {
        drawer.classList.remove('hidden');
        icon.className = 'fa-solid fa-xmark text-base';
      } else {
        drawer.classList.add('hidden');
        icon.className = 'fa-solid fa-bars text-base';
      }
    }

    function filterMenu(categoryId, btn) {
      document.querySelectorAll('.menu-tab-btn').forEach(b => {
        b.className = 'menu-tab-btn px-4 py-2.5 rounded-xl text-xs font-bold transition bg-slate-900 text-slate-300 hover:text-sky-300 border border-slate-800 shrink-0 whitespace-nowrap active:scale-95';
      });
      btn.className = 'menu-tab-btn active px-4 py-2.5 rounded-xl text-xs font-bold transition bg-sky-500 text-white shadow-md shrink-0 whitespace-nowrap active:scale-95';

      document.querySelectorAll('.menu-item-card').forEach(card => {
        if (categoryId === 'all' || card.getAttribute('data-category') === categoryId) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function handleAiOption(title, sub) {
      document.getElementById('ai-response-title').innerText = title;
      document.getElementById('ai-response-text').innerText = 'Selected consultation preference: ' + title + ' (' + sub + '). You can book an appointment or ask about wait times on WhatsApp!';
      const btn = document.getElementById('ai-order-btn');
      btn.href = 'https://wa.me/${phoneDigits}?text=' + encodeURIComponent('Hello ${bizName}! I would like to inquire about: ' + title + ' (' + sub + ').');
    }

    function handleBookingSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      const date = document.getElementById('form-date').value || 'Soonest available';
      const service = document.getElementById('form-service').value;
      const notes = document.getElementById('form-notes').value || 'No special notes';

      const msg = 'Hello ${bizName}!\\n\\nNew Appointment Request:\\n• Patient: ' + name + '\\n• Phone: ' + phone + '\\n• Department: ' + service + '\\n• Preferred Date: ' + date + '\\n• Notes: ' + notes;
      const url = 'https://wa.me/${phoneDigits}?text=' + encodeURIComponent(msg);
      window.open(url, '_blank');
      alert('Thank you ' + name + '! Redirecting to WhatsApp to send your appointment details directly to the clinic coordinator.');
    }

    // 3D Card Tilt Engine
    function init3dTiltEngine() {
      const cards = document.querySelectorAll('.tilt-card-3d');
      cards.forEach(card => {
        const glare = card.querySelector('.glare-3d');
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;
          card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
          if (glare) {
            glare.style.opacity = '0.35';
            glare.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)';
          }
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
          if (glare) glare.style.opacity = '0';
        });
      });
    }

    // Three.js 3D Interactive Scene (Niche Specific)
    function initThreeJsScene() {
      const container = document.getElementById('canvas-3d-container');
      if (!container || typeof THREE === 'undefined') return;

      const width = container.clientWidth || 450;
      const height = container.clientHeight || 450;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 1.5, 6.0);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      const isClinicNiche = ${isClinic};
      const isCafeNiche = ${isCafe};

      // Lighting
      const ambientLight = new THREE.AmbientLight(isClinicNiche ? 0xd0f0ff : 0xffeedd, 1.8);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(isClinicNiche ? 0x38bdf8 : 0xffb74d, 3.2);
      keyLight.position.set(5, 8, 4);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(isClinicNiche ? 0x10b981 : 0xffd54f, 2.0);
      rimLight.position.set(-5, 4, -4);
      scene.add(rimLight);

      const mouseLight = new THREE.PointLight(isClinicNiche ? 0x0ea5e9 : 0xffa726, 3.0, 12);
      mouseLight.position.set(0, 3, 3);
      scene.add(mouseLight);

      const mainGroup = new THREE.Group();
      scene.add(mainGroup);

      if (isClinicNiche) {
        // --- 3D MEDICAL CROSS WITH DNA DOUBLE HELIX ---
        const crossMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.15,
          metalness: 0.85,
          emissive: 0x0369a1,
          emissiveIntensity: 0.25
        });
        const trimMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          roughness: 0.1,
          metalness: 0.95
        });

        // Vertical Bar
        const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 2.4, 0.5), crossMat);
        mainGroup.add(vBar);

        // Horizontal Bar
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 0.5), crossMat);
        mainGroup.add(hBar);

        // Central Heart Sphere
        const centerSphere = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), trimMat);
        centerSphere.position.z = 0.28;
        mainGroup.add(centerSphere);

        // DNA Double Helix Orbiting Rings
        const ringGeo1 = new THREE.TorusGeometry(1.85, 0.05, 16, 64);
        ringGeo1.rotateX(Math.PI / 3);
        const ring1 = new THREE.Mesh(ringGeo1, new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.2, metalness: 0.9 }));
        mainGroup.add(ring1);

        const ringGeo2 = new THREE.TorusGeometry(1.95, 0.05, 16, 64);
        ringGeo2.rotateX(-Math.PI / 3);
        const ring2 = new THREE.Mesh(ringGeo2, new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.9 }));
        mainGroup.add(ring2);

      } else if (isCafeNiche) {
        // --- 3D COFFEE CUP WITH SAUCER ---
        const cupMat = new THREE.MeshStandardMaterial({ color: 0x140e0a, roughness: 0.18, metalness: 0.85 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.95 });

        const cup = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 0.8, 1.4, 48), cupMat);
        cup.position.y = 0.7;
        mainGroup.add(cup);

        const saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.2, 0.15, 48), cupMat);
        saucer.position.y = -0.05;
        mainGroup.add(saucer);

        const rim = new THREE.Mesh(new THREE.TorusGeometry(1.21, 0.05, 16, 48), goldMat);
        rim.rotateX(Math.PI / 2);
        rim.position.y = 1.4;
        mainGroup.add(rim);

      } else {
        // --- 3D GEOMETRIC SHIELD ---
        const shieldGeo = new THREE.OctahedronGeometry(1.3, 2);
        const shieldMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.2, metalness: 0.85 });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        mainGroup.add(shield);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.06, 16, 64), new THREE.MeshStandardMaterial({ color: 0x818cf8, metalness: 0.9 }));
        ring.rotateX(Math.PI / 4);
        mainGroup.add(ring);
      }

      // Particle Field
      const particleCount = 75;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 3.5;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: isClinicNiche ? 0x38bdf8 : isCafeNiche ? 0xfbbf24 : 0x818cf8,
        size: 0.09,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Mouse & Touch Drag Interaction
      let isDragging = false;
      let prevMouse = { x: 0, y: 0 };
      let targetRotX = 0.1;
      let targetRotY = 0.2;

      window.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const my = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
          targetRotY = mx * 0.85 + 0.2;
          targetRotX = -my * 0.45 + 0.1;
          mouseLight.position.x = mx * 3;
          mouseLight.position.y = my * 3 + 2;
        }
      });

      container.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
      });
      window.addEventListener('mouseup', () => { isDragging = false; });
      container.addEventListener('mousemove', (e) => {
        if (isDragging) {
          mainGroup.rotation.y += (e.clientX - prevMouse.x) * 0.01;
          mainGroup.rotation.x += (e.clientY - prevMouse.y) * 0.01;
          prevMouse = { x: e.clientX, y: e.clientY };
        }
      });

      // Mobile Touch Handling
      container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          isDragging = true;
          prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });
      container.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
          mainGroup.rotation.y += (e.touches[0].clientX - prevMouse.x) * 0.014;
          mainGroup.rotation.x += (e.touches[0].clientY - prevMouse.y) * 0.014;
          prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      }, { passive: true });
      container.addEventListener('touchend', () => { isDragging = false; });

      // Click/Tap Pulse
      function triggerPulse() {
        mainGroup.scale.set(1.15, 1.15, 1.15);
        setTimeout(() => { mainGroup.scale.set(1, 1, 1); }, 220);
      }
      container.addEventListener('click', triggerPulse);

      // Responsive Resize
      window.addEventListener('resize', () => {
        if (!container) return;
        const w = container.clientWidth || 450;
        const h = container.clientHeight || 450;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      });

      // Animation Loop
      let clock = new THREE.Clock();
      function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        if (!isDragging) {
          mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.04;
          mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.04;
        }
        mainGroup.position.y = Math.sin(time * 1.5) * 0.08;
        particles.rotation.y = time * 0.04;

        renderer.render(scene, camera);
      }
      animate();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(() => {
        init3dTiltEngine();
        initThreeJsScene();
      }, 100);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        init3dTiltEngine();
        initThreeJsScene();
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
