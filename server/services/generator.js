const db = require('../db');
const { v4: uuidv4 } = require('uuid');

/**
 * Builds tailored brand palettes, services, testimonials, and copy
 * for each individual business lead and niche.
 */
function getBespokeNicheProfile(category = '', bizName = 'Local Business', city = 'Jaipur') {
  const cat = (category || '').toLowerCase();
  const name = bizName.toLowerCase();

  // 1. CAFE / COFFEE SHOP / TEA ROOM
  if (cat.includes('cafe') || cat.includes('coffee') || cat.includes('tea') || cat.includes('roast') || cat.includes('espresso') || name.includes('cafe') || name.includes('coffee')) {
    
    // Dynamic specialty depending on business name nuances
    let specialty1 = { title: 'Artisan Espresso & Specialty Pour-Overs', desc: 'Single-origin Arabica roasts, silky flat whites, manual Chemex pour-overs, and cold brew flights.', icon: 'fa-mug-hot' };
    if (name.includes('roast') || name.includes('brew')) {
      specialty1 = { title: 'In-House Micro-Batch Roastery', desc: 'Freshly roasted single-estate beans from Chikmagalur and Coorg, ground on demand for peak aroma.', icon: 'fa-fire-burner' };
    }

    let specialty2 = { title: 'Fresh Baked Sourdough & Pastries', desc: 'Buttery flaky croissants, Belgian chocolate babkas, and daily artisanal sourdough toasties.', icon: 'fa-bread-slice' };
    if (name.includes('bake') || name.includes('crumb') || name.includes('cake')) {
      specialty2 = { title: 'Gourmet French Viennoiserie & Desserts', desc: 'Oven-fresh pain au chocolat, artisan berry cheesecakes, and custom tiered celebration cakes.', icon: 'fa-cake-candles' };
    }

    let specialty3 = { title: 'Cozy Work-Friendly Ambiance & Terrace', desc: 'High-speed fiber WiFi, ergonomic plush seating, abundant natural daylight, and a peaceful vibe.', icon: 'fa-laptop' };
    if (name.includes('garden') || name.includes('courtyard') || name.includes('heritage')) {
      specialty3 = { title: 'Serene Garden & Courtyard Seating', desc: 'Romantic open-air patio with lush greenery, fairy lights, and relaxed outdoor conversation spots.', icon: 'fa-tree' };
    }

    const specialty4 = { title: 'Chef’s All-Day Brunch & Organic Coolers', desc: 'Avocado tartines, truffle scrambled eggs, smoothie bowls, and botanical iced matcha quenchers.', icon: 'fa-utensils' };

    return {
      nicheKey: 'cafe',
      themeColor: 'amber',
      accentHex: '#b45309',
      badge: `Top-Rated Cafe & Coffee Spot in ${city}`,
      heroTagline: `${bizName} — Artisan Specialty Coffee, Fresh Bakes & Warm Vibes in ${city}`,
      heroSub: `From velvety handcrafted espresso and single-origin pour-overs to warm flaky croissants and relaxing work-friendly corners. ${bizName} is ${city}'s favorite neighborhood gathering spot.`,
      heroImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
      navCta: 'Reserve a Table / Visit',
      primaryCta: 'View Menu & Reserve Table',
      secondaryCta: 'Call Us Now',
      servicesHeading: 'Our Signature Cafe Offerings',
      servicesSub: `Every cup brewed from hand-selected beans, paired with oven-fresh daily bakes and welcoming hospitality at ${bizName}.`,
      services: [specialty1, specialty2, specialty3, specialty4],
      galleryHeading: `Vibes, Brews & Ambiance at ${bizName}`,
      gallerySub: `A glimpse into our sunlit corners, barista craft, and relaxing spaces waiting for you in ${city}.`,
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
          text: `Hands down the best coffee in ${city}! The barista at ${bizName} truly knows their craft, and the warm almond croissants are fresh out of the oven every morning.`,
          rating: 5
        },
        {
          name: 'Rahul M.',
          loc: `Local Foodie & Writer`,
          text: `The ambiance at ${bizName} is a 10/10. Calm cozy corners, extraordinary cold brews, and prompt friendly staff. My go-to hangout in ${city}.`,
          rating: 5
        },
        {
          name: 'Priya S.',
          loc: `Remote Professional`,
          text: `Perfect cafe for working or meeting friends. Fast WiFi, comfortable seating, and the Spanish Latte at ${bizName} is an absolute must-try!`,
          rating: 5
        }
      ],
      contactBadge: 'Reserve & Visit',
      contactTitle: `Craving Great Coffee & Fresh Bakes? Visit ${bizName} Today`,
      contactSub: `Drop by for your daily morning roast, reserve a cozy table for conversation, or order your favorite cafe treats ahead of time.`,
      formTitle: `Reserve a Table or Pre-Order`,
      formSub: 'Quick table booking • Instant confirmation via WhatsApp',
      formServiceLabel: 'Seating Preference / Booking Type',
      formOptions: ['Indoor Cozy Table (AC)', 'Outdoor Garden / Patio', 'Work-Friendly High Table (Power Sockets)', 'Private Group Gathering (5+ People)'],
      formSubmitText: `Reserve Table at ${bizName}`
    };
  }

  // 2. RESTAURANT / FINE DINING / BISTRO
  if (cat.includes('restaurant') || cat.includes('dining') || cat.includes('food') || cat.includes('bistro') || cat.includes('dhaba')) {
    return {
      nicheKey: 'restaurant',
      themeColor: 'rose',
      accentHex: '#e11d48',
      badge: `#1 Fine Dining & Culinary Experience in ${city}`,
      heroTagline: `Exquisite Flavors & Unforgettable Dining at ${bizName} in ${city}`,
      heroSub: `Experience signature culinary creations prepared by master chefs using farm-fresh seasonal ingredients in an elegant, vibrant setting.`,
      heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      navCta: 'Reserve a Table',
      primaryCta: 'Book Dining Table',
      secondaryCta: 'Call For Takeaway',
      servicesHeading: 'Chef’s Signature Selections & Experiences',
      servicesSub: `Immerse yourself in authentic gourmet dishes, candlelit ambiance, and personalized hospitality at ${bizName}.`,
      services: [
        { title: 'Chef’s Signature Tasting Menu', desc: 'Curated multi-course gastronomic journeys honoring authentic local flavors and modern culinary arts.', icon: 'fa-award' },
        { title: 'Table Reservations & Candlelight Dining', desc: 'Reserve your romantic table or vibrant group celebration with seamless instant confirmation.', icon: 'fa-champagne-glasses' },
        { title: 'Private Parties & Banquets', desc: 'Exclusive private dining halls, custom banquet menus, and attentive VIP hospitality for all events.', icon: 'fa-users' },
        { title: 'Artisan Mocktails & Handcrafted Desserts', desc: 'Handcrafted mixology, botanical coolers, and decadent handcrafted desserts.', icon: 'fa-heart' }
      ],
      galleryHeading: `Culinary Art & Dining Ambiance at ${bizName}`,
      gallerySub: `An authentic taste of elegance, passion, and flavor in ${city}.`,
      gallery: [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80'
      ],
      testimonials: [
        {
          name: 'Vikram Mehta',
          loc: `${city} Resident`,
          text: `Celebrated our anniversary at ${bizName}. The signature kebabs, rich gravies, and attentive service blew us away! Best restaurant in ${city}.`,
          rating: 5
        },
        {
          name: 'Ananya Sharma',
          loc: `Food Critic`,
          text: `Every dish at ${bizName} tells a story. Fresh flavors, gorgeous plating, and a warm welcoming ambiance that keeps us coming back.`,
          rating: 5
        },
        {
          name: 'David Wilson',
          loc: `Business Traveler`,
          text: `Outstanding hospitality. Hosted a team dinner of 12 people and everything was executed with flawless perfection. Highly recommend!`,
          rating: 5
        }
      ],
      contactBadge: 'Reservations',
      contactTitle: `Experience Exceptional Dining at ${bizName}`,
      contactSub: `Reserve your table in advance to avoid waiting, especially during busy evening and weekend hours.`,
      formTitle: `Reserve Your Dining Table`,
      formSub: 'Guaranteed seating • Instant confirmation',
      formServiceLabel: 'Dining Area Preference',
      formOptions: ['Main Dining Hall', 'Private Dining Room', 'Romantic Terrace Table', 'Family Lounge Section'],
      formSubmitText: `Book Table at ${bizName}`
    };
  }

  // 3. SALON / BEAUTY / SPA
  if (cat.includes('salon') || cat.includes('beauty') || cat.includes('spa') || cat.includes('parlour') || cat.includes('barber')) {
    return {
      nicheKey: 'salon',
      themeColor: 'pink',
      accentHex: '#db2777',
      badge: `Award-Winning Hair & Beauty Studio in ${city}`,
      heroTagline: `Luxury Hair, Skin & Rejuvenating Spa Treatments at ${bizName}`,
      heroSub: `Elevate your personal glow with bespoke hair design, restorative facial therapies, and bridal pampering by certified master stylists.`,
      heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
      navCta: 'Book Appointment',
      primaryCta: 'Book Salon Appointment',
      secondaryCta: 'View Services & Rates',
      servicesHeading: 'Signature Beauty & Styling Rituals',
      servicesSub: `World-class hair transformations, international skincare treatments, and soothing spa therapies at ${bizName}.`,
      services: [
        { title: 'Couture Hair Cuts & Coloring', desc: 'Balayage, keratin smoothing, botox hair treatments, and precision styling by senior stylists.', icon: 'fa-scissors' },
        { title: 'Luxury Hydrafacials & Skincare', desc: 'Deep pore cleansing, anti-pigmentation therapies, and organic glow facials.', icon: 'fa-wand-magic-sparkles' },
        { title: 'Bridal & Red-Carpet Glamour', desc: 'HD bridal makeup, airbrush artistry, saree draping, and pre-wedding rejuvenation packages.', icon: 'fa-crown' },
        { title: 'Aromatherapy Body Massages', desc: 'Swedish, deep tissue, and hot stone therapies designed to melt away stress.', icon: 'fa-spa' }
      ],
      galleryHeading: `Transformations & Salon Vibes at ${bizName}`,
      gallerySub: `A glimpse into our luxurious styling stations and glowing client transformations in ${city}.`,
      gallery: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80'
      ],
      testimonials: [
        {
          name: 'Megha Singhania',
          loc: `${city} Resident`,
          text: `Got my bridal makeup done at ${bizName} and felt like a queen! Natural, long-lasting, and exactly the subtle glow I wanted.`,
          rating: 5
        },
        {
          name: 'Kavita Joshi',
          loc: `Local Client`,
          text: `Best hair color transformation ever. The stylist took the time to understand my hair texture and delivered stunning balayage highlights!`,
          rating: 5
        },
        {
          name: 'Rohit Verma',
          loc: `${city} Resident`,
          text: `Premium grooming with great attention to detail. Relaxing head massage and clean hygienic space. Highly recommend ${bizName}!`,
          rating: 5
        }
      ],
      contactBadge: 'Appointments',
      contactTitle: `Ready for Your Transformation? Book at ${bizName}`,
      contactSub: `Select your preferred styling service and time slot for a personalized salon session.`,
      formTitle: `Schedule Your Salon Session`,
      formSub: 'No waiting • Dedicated senior stylist',
      formServiceLabel: 'Service Requested',
      formOptions: ['Hair Styling & Color', 'Hydrafacial / Skin Ritual', 'Bridal / Party Makeup', 'Relaxing Spa & Massage'],
      formSubmitText: `Book Session at ${bizName}`
    };
  }

  // 4. FITNESS / GYM / YOGA
  if (cat.includes('gym') || cat.includes('fitness') || cat.includes('yoga') || cat.includes('trainer') || cat.includes('workout')) {
    return {
      nicheKey: 'gym',
      themeColor: 'emerald',
      accentHex: '#059669',
      badge: `#1 High-Performance Fitness Hub in ${city}`,
      heroTagline: `Unleash Your Strength & Peak Fitness at ${bizName}`,
      heroSub: `World-class Olympic equipment, certified personal trainers, and high-octane group fitness classes designed to crush your goals.`,
      heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
      navCta: 'Claim Free Day Pass',
      primaryCta: 'Claim Free 1-Day Pass',
      secondaryCta: 'View Membership Plans',
      servicesHeading: 'High-Impact Fitness Programs',
      servicesSub: `Comprehensive strength training, functional conditioning, and dedicated coaches at ${bizName}.`,
      services: [
        { title: 'Heavy Strength & Functional Turf', desc: 'Olympic power cages, calibrated plates, kettlebells, and sprint turf for explosive gains.', icon: 'fa-dumbbell' },
        { title: '1-on-1 Certified Personal Coaching', desc: 'Custom workout splits, body composition scans, and form correction to reach goals fast.', icon: 'fa-user-ninja' },
        { title: 'High-Energy HIIT & Spinning', desc: 'Heart-pumping group classes with certified trainers and motivating soundscapes.', icon: 'fa-bolt' },
        { title: 'Personalized Nutrition & Macro Plans', desc: 'Sustainable meal guides, supplement planning, and weekly accountability tracking.', icon: 'fa-apple-whole' }
      ],
      galleryHeading: `The Training Floor at ${bizName}`,
      gallerySub: `A powerhouse environment built for progress, community, and energy in ${city}.`,
      gallery: [
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80'
      ],
      testimonials: [
        {
          name: 'Aman Agarwal',
          loc: `${city} Member`,
          text: `Joined ${bizName} 6 months ago and lost 14 kgs! The coaches are genuinely invested in your progress and the equipment is top notch.`,
          rating: 5
        },
        {
          name: 'Simran Kaur',
          loc: `Fitness Enthusiast`,
          text: `Clean, spacious gym with no crowding. The morning HIIT and strength sessions give me so much energy for the day!`,
          rating: 5
        },
        {
          name: 'Deepak Sharma',
          loc: `${city} Resident`,
          text: `Great community and motivating environment. The best gym experience I've had in ${city} by far.`,
          rating: 5
        }
      ],
      contactBadge: 'Trial Access',
      contactTitle: `Experience ${bizName} With a Free 1-Day Pass`,
      contactSub: `Try out our machines, attend a group session, and consult with our head coach completely free.`,
      formTitle: `Claim Your Free 1-Day Pass`,
      formSub: 'No credit card needed • 100% Free pass',
      formServiceLabel: 'Primary Fitness Goal',
      formOptions: ['Weight Loss & Fat Burn', 'Muscle Building & Strength', 'Functional Mobility & Posture', 'Personal Coaching Inquiries'],
      formSubmitText: `Claim Free Pass at ${bizName}`
    };
  }

  // 5. DEFAULT DYNAMIC PROFILE (FOR TRADES, HOME SERVICES & CUSTOM NICHES)
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
    servicesHeading: `Specialized ${cleanCategory} Services Tailored for ${city}`,
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
      {
        name: 'Sarah Jenkins',
        loc: `${city} Resident`,
        text: `Called ${bizName} and they arrived right on time, explained everything clearly, and finished the work with zero mess. Highly recommend!`,
        rating: 5
      },
      {
        name: 'Michael Torres',
        loc: `${city} Homeowner`,
        text: `Absolute 5-star experience with ${bizName}. Best service in ${city} by a long shot. Transparent prices with no hidden surprises.`,
        rating: 5
      },
      {
        name: 'Emily Chen',
        loc: `Local Business Owner`,
        text: `Professional, courteous, and very experienced. Will definitely be our first call for any future projects!`,
        rating: 5
      }
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
 * Builds the complete modern HTML demo website for the prospect
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
    : profile.nicheKey === 'restaurant'
    ? `Hi ${bizName}! I would like to reserve a table for dining.`
    : profile.nicheKey === 'salon'
    ? `Hi ${bizName}! I would like to book a salon styling appointment.`
    : `Hi ${bizName}! I would like to inquire about your services.`;

  // WhatsApp claim text for business owner to claim from developer
  const claimWaText = `Hi ${senderName}! I am the owner of ${bizName} in ${city}. I saw the free website demo you built for us (${baseUrl}/demos/${siteId}) and I would like to claim, customize and launch it!`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${bizName} | Official Website Demo (${city})</title>
  <meta name="description" content="${profile.heroTagline}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .hero-glow {
      background: radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-amber-500 selection:text-white pb-16">

  <!-- Live Demo Claim Banner -->
  <div class="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white text-xs sm:text-sm py-2.5 px-4 shadow-inner sticky top-0 z-50 border-b border-amber-500/30">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-2 font-medium">
        <span class="inline-flex items-center justify-center bg-amber-500 text-white rounded-full w-5 h-5 text-xs font-bold animate-pulse">✨</span>
        <span><strong>Live AI Website Demo</strong> built specially for <strong>${bizName}</strong></span>
      </div>
      <div class="flex items-center gap-2.5">
        <a href="https://wa.me/${agencyWhatsApp}?text=${encodeURIComponent(claimWaText)}" target="_blank" rel="noopener noreferrer" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3.5 py-1 rounded-full text-xs shadow flex items-center gap-1.5 transition-all hover:scale-105">
          <i class="fa-brands fa-whatsapp text-sm"></i>
          <span>Claim on WhatsApp (+91 8920608191)</span>
        </a>
        <button onclick="document.getElementById('claim-modal').classList.remove('hidden')" class="bg-white text-slate-900 hover:bg-amber-50 font-bold px-3.5 py-1 rounded-full text-xs shadow transition-all hover:scale-105">
          Claim Website
        </button>
      </div>
    </div>
  </div>

  <!-- Navbar -->
  <header class="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-10 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-black text-xl shadow-md">
          ${bizName.charAt(0)}
        </div>
        <div>
          <span class="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">${bizName}</span>
          <span class="text-xs text-amber-700 font-semibold">${prospect.category || 'Specialty Cafe'} • ${city}</span>
        </div>
      </div>
      
      <nav class="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
        <a href="#services" class="hover:text-amber-600 transition">Offerings</a>
        <a href="#gallery" class="hover:text-amber-600 transition">Ambiance</a>
        <a href="#testimonials" class="hover:text-amber-600 transition">Reviews</a>
        <a href="#contact" class="hover:text-amber-600 transition">Reserve & Contact</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="tel:${phone}" class="hidden sm:flex items-center gap-2 text-slate-700 font-semibold hover:text-amber-600 text-sm">
          <i class="fa-solid fa-phone text-amber-600"></i>
          <span>${phone}</span>
        </a>
        <a href="#contact" class="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition hover:shadow-amber-200 hover:shadow-lg">
          ${profile.navCta}
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 hero-glow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
            </span>
            ${profile.badge}
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            ${profile.heroTagline}
          </h1>

          <p class="text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
            ${profile.heroSub}
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <a href="#contact" class="bg-amber-600 hover:bg-amber-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-amber-600/25 transition hover:-translate-y-0.5">
              ${profile.primaryCta}
            </a>
            <a href="tel:${phone}" class="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-6 py-3.5 rounded-xl transition flex items-center gap-2">
              <i class="fa-solid fa-phone text-amber-600"></i>
              ${profile.secondaryCta}
            </a>
          </div>

          <!-- Social Proof Badges -->
          <div class="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <div class="flex items-center gap-2">
              <div class="flex text-amber-400">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <span class="font-bold text-slate-900">${rating} Stars</span>
              <span class="text-slate-400">(${reviews} Google Reviews)</span>
            </div>
            <div class="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <i class="fa-solid fa-circle-check"></i>
              <span>Locally Verified</span>
            </div>
            <div class="flex items-center gap-1.5 text-amber-700 font-semibold">
              <i class="fa-solid fa-heart"></i>
              <span>Fresh Craft Daily</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 relative">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img src="${profile.heroImage}" alt="${bizName}" class="w-full h-[450px] object-cover object-center transform hover:scale-105 transition duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-6 left-6 right-6 text-white p-4 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/20">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs uppercase tracking-wider font-semibold text-amber-300">Neighborhood Favorite</span>
                <span class="text-xs bg-emerald-500/90 px-2 py-0.5 rounded font-bold">Open Today</span>
              </div>
              <h4 class="font-bold text-lg">${bizName}</h4>
              <p class="text-xs text-slate-200">${prospect.address || city + ' Area'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Offerings / Services Section -->
  <section id="services" class="py-20 bg-white border-y border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-amber-600 font-bold uppercase tracking-wider text-xs">Crafted With Passion</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
          ${profile.servicesHeading}
        </h2>
        <p class="text-slate-600 mt-3 text-base">
          ${profile.servicesSub}
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${profile.services.map(s => `
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition duration-300 group flex flex-col justify-between">
            <div>
              <div class="w-12 h-12 rounded-xl bg-amber-600/10 text-amber-600 flex items-center justify-center font-bold text-xl mb-5 group-hover:bg-amber-600 group-hover:text-white transition">
                <i class="fa-solid ${s.icon}"></i>
              </div>
              <h3 class="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition">${s.title}</h3>
              <p class="text-sm text-slate-600 mt-2 leading-relaxed">${s.desc}</p>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>Explore details</span>
              <i class="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Gallery Section -->
  <section id="gallery" class="py-20 bg-slate-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span class="text-amber-600 font-bold uppercase tracking-wider text-xs">Experience The Vibe</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">${profile.galleryHeading}</h2>
        </div>
        <p class="text-slate-600 max-w-md text-sm">
          ${profile.gallerySub}
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${profile.gallery.map((img, i) => `
          <div class="rounded-xl overflow-hidden shadow-md group relative h-64 bg-slate-200">
            <img src="${img}" alt="Ambiance ${i+1}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
              <span class="text-white font-semibold text-sm">${bizName} • ${city}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section id="testimonials" class="py-20 bg-white border-y border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-14">
        <span class="text-amber-600 font-bold uppercase tracking-wider text-xs">Verified Customer Love</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">What Locals Say About ${bizName}</h2>
        <div class="flex items-center justify-center gap-2 mt-3">
          <div class="flex text-amber-400 text-sm">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <span class="font-bold text-slate-800 text-sm">Rated ${rating}/5 from ${reviews} verified reviews</span>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        ${profile.testimonials.map(t => `
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex text-amber-400 text-sm mb-3">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
              <p class="text-slate-700 italic text-sm leading-relaxed mb-6">"${t.text}"</p>
            </div>
            <div class="flex items-center gap-3 pt-4 border-t border-slate-200">
              <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                ${t.name.charAt(0)}
              </div>
              <div>
                <h4 class="font-bold text-sm text-slate-900">${t.name}</h4>
                <span class="text-xs text-slate-500">${t.loc}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact & Reservation Form Section -->
  <section id="contact" class="py-20 bg-slate-900 text-white relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-6 space-y-6">
          <span class="text-amber-400 font-bold uppercase tracking-wider text-xs">${profile.contactBadge}</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${profile.contactTitle}</h2>
          <p class="text-slate-300 text-base leading-relaxed">
            ${profile.contactSub}
          </p>
          <div class="space-y-4 pt-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div>
                <div class="text-xs text-slate-400">Direct Phone</div>
                <div class="font-bold text-white">${phone}</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <div class="text-xs text-slate-400">Location</div>
                <div class="font-bold text-white">${prospect.address || city + ' Central'}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6">
          <div class="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl">
            <h3 class="text-2xl font-bold mb-1">${profile.formTitle}</h3>
            <p class="text-slate-500 text-xs mb-6">${profile.formSub}</p>

            <form onsubmit="event.preventDefault(); alert('Reservation submitted for ${bizName}! In production, this notifies the business instantly on WhatsApp.');" class="space-y-4">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                  <input type="text" required placeholder="John Doe" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input type="tel" required placeholder="${phone}" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm">
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">${profile.formServiceLabel}</label>
                <select class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-white">
                  ${profile.formOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Time & Special Requests</label>
                <textarea rows="3" placeholder="e.g. Table for 4 this Saturday at 11 AM..." class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm"></textarea>
              </div>
              <button type="submit" class="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md transition hover:shadow-lg">
                ${profile.formSubmitText}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-slate-950 text-slate-400 py-12 text-sm border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="font-extrabold text-white">${bizName}</span>
        <span>•</span>
        <span>${city}</span>
      </div>
      <div>
        <p>&copy; ${new Date().getFullYear()} ${bizName}. All Rights Reserved. Generated by SiteSeller Agent.</p>
      </div>
    </div>
  </footer>

  <!-- Floating Customer WhatsApp Chat Button -->
  <a href="https://wa.me/${phoneDigits}?text=${encodeURIComponent(customerWaText)}" 
     target="_blank" 
     rel="noopener noreferrer"
     class="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
     title="Message ${bizName} on WhatsApp">
    <i class="fa-brands fa-whatsapp text-2xl"></i>
    <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs group-hover:ml-2">
      Chat with ${bizName}
    </span>
  </a>

  <!-- Claim Modal -->
  <div id="claim-modal" class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative">
      <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
      <div class="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center text-xl font-bold mb-4">
        ✨
      </div>
      <h3 class="text-xl font-bold">Claim ${bizName}'s Website</h3>
      <p class="text-sm text-slate-600 mt-2">
        This high-converting website was custom generated for <strong>${bizName}</strong>. You can connect it to your own custom domain, customize text & photos, and turn on live customer bookings today!
      </p>
      <div class="bg-amber-50 p-3.5 rounded-xl border border-amber-200 mt-4 text-xs text-amber-900 space-y-1">
        <div><strong>Includes:</strong> Free cloud hosting setup, mobile responsive design, Google Maps SEO optimization, and WhatsApp lead integration.</div>
      </div>
      <div class="mt-6 flex flex-col gap-2.5">
        <a href="https://wa.me/${agencyWhatsApp}?text=${encodeURIComponent(claimWaText)}" target="_blank" rel="noopener noreferrer" class="w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-600/30">
          <i class="fa-brands fa-whatsapp text-lg"></i>
          <span>Claim via WhatsApp (+91 8920608191)</span>
        </a>
        <a href="mailto:${senderEmail}?subject=${encodeURIComponent(`Claim Website for ${bizName}`)}&body=${encodeURIComponent(claimWaText)}" class="w-full text-center py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition">
          Claim via Email
        </a>
        <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold">
          Continue Previewing
        </button>
      </div>
    </div>
  </div>

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
