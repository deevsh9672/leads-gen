const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Category-specific visual palettes and content templates
const NICHE_CONTENT = {
  plumber: {
    heroTagline: 'Trusted, 24/7 Emergency Plumbing & Drain Cleaning in {City}',
    heroSub: 'From burst pipes to full bathroom repiping, our master plumbers deliver prompt, guaranteed service with transparent upfront pricing.',
    themeColor: 'blue',
    accentHex: '#0284c7',
    heroImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1600&q=80',
    services: [
      { title: '24/7 Emergency Repairs', desc: 'Rapid response for burst pipes, sewer backups, and urgent leaks to prevent costly water damage.', icon: 'Wrench' },
      { title: 'Hydro-Jetting & Drain Snaking', desc: 'Clear tree roots, grease, and stubborn blockages with advanced commercial hydro-jetting tech.', icon: 'Droplets' },
      { title: 'Water Heater Install & Repair', desc: 'Tankless and standard water heater installations with top energy efficiency warranties.', icon: 'Flame' },
      { title: 'Slab Leak & Pipe Detection', desc: 'Non-invasive acoustic and thermal imaging leak detection to pinpoint underground issues.', icon: 'ShieldCheck' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80'
    ]
  },
  dentist: {
    heroTagline: 'Gentle, Comprehensive Dental Care for Your Family in {City}',
    heroSub: 'Modern dentistry with a personal touch. From routine preventative cleanings to smile makeovers and dental implants in a relaxing environment.',
    themeColor: 'teal',
    accentHex: '#0d9488',
    heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80',
    services: [
      { title: 'Preventative & Family Care', desc: 'Gentle cleanings, digital low-radiation X-rays, and comprehensive exams for all ages.', icon: 'Sparkles' },
      { title: 'Cosmetic Teeth Whitening', desc: 'Professional in-office laser whitening and custom take-home trays for brilliant smile shine.', icon: 'Smile' },
      { title: 'Dental Implants & Crowns', desc: 'Permanent tooth replacement utilizing precision 3D guided surgery for lifelong durability.', icon: 'ShieldCheck' },
      { title: 'Emergency Dental Relief', desc: 'Same-day urgent appointments for toothaches, chipped teeth, and unexpected dental trauma.', icon: 'Clock' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
    ]
  },
  bakery: {
    heroTagline: 'Handcrafted Artisan Breads, Pastries & Custom Cakes in {City}',
    heroSub: 'Baked fresh every morning with organic heritage flour, European butter, and a passion for slow fermented perfection.',
    themeColor: 'amber',
    accentHex: '#d97706',
    heroImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
    services: [
      { title: 'Sourdough & Artisanal Loaves', desc: 'Naturally leavened loaves with a crispy golden blistered crust and chewy, open crumb.', icon: 'Heart' },
      { title: 'Custom Celebration Cakes', desc: 'Bespoke wedding and birthday tiered cakes made with luscious buttercream and fresh fruit.', icon: 'Sparkles' },
      { title: 'Morning French Viennoiserie', desc: 'Layered flaky croissants, pain au chocolat, and seasonal berry Danish pastries.', icon: 'Coffee' },
      { title: 'Catering & Event Platters', desc: 'Breakfast boxes and dessert grazing tables for corporate gatherings and bridal showers.', icon: 'ShoppingBag' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=600&q=80'
    ]
  },
  roofer: {
    heroTagline: 'Storm-Proof Roofing & Siding Excellence in {City}',
    heroSub: 'Licensed, insured roof replacements, storm damage restoration, and leak prevention built to shield your family home for decades.',
    themeColor: 'slate',
    accentHex: '#475569',
    heroImage: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1600&q=80',
    services: [
      { title: 'Complete Roof Replacements', desc: 'Architectural shingles, metal standing seam, and tile roofing backed by 30-year manufacturer warranty.', icon: 'Home' },
      { title: 'Storm & Hail Damage Insurance Claims', desc: 'Free drone roof inspections and end-to-end insurance claim assistance to maximize coverage.', icon: 'ShieldCheck' },
      { title: 'Emergency Leak Dispatch', desc: 'Same-day tarping and rapid leak remediation to safeguard your home interior.', icon: 'Wrench' },
      { title: 'Seamless Gutters & Fascia', desc: 'Custom on-site extruded aluminum gutters with leaf protection guards.', icon: 'Droplets' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80'
    ]
  },
  default: {
    heroTagline: 'Top-Rated Local Service You Can Count On in {City}',
    heroSub: 'Dedicated professionals committed to delivering exceptional craftsmanship, friendly customer care, and reliable results on every single project.',
    themeColor: 'indigo',
    accentHex: '#4f46e5',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    services: [
      { title: 'Expert Consultations', desc: 'Honest, detailed assessments and clear upfront estimates before any project begins.', icon: 'CheckCircle' },
      { title: 'Premium Craftsmanship', desc: 'Using high-grade materials, proven methods, and obsessive attention to detail.', icon: 'Award' },
      { title: 'Guaranteed Satisfaction', desc: 'Every service is backed by our 100% satisfaction promise and local warranty.', icon: 'ShieldCheck' },
      { title: 'Fast & Reliable Scheduling', desc: 'Flexible appointment times and rapid response for your home or business.', icon: 'Clock' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80'
    ]
  }
};

function getNicheContent(category = '') {
  const cat = (category || '').toLowerCase();
  for (const [key, content] of Object.entries(NICHE_CONTENT)) {
    if (cat.includes(key)) return content;
  }
  return NICHE_CONTENT.default;
}

function generateSiteHTML(prospect, siteId, options = {}) {
  const niche = getNicheContent(prospect.category);
  const city = prospect.city || 'Austin';
  const bizName = prospect.business_name || 'Local Business';
  const phone = prospect.phone || '(555) 123-4567';
  const phoneDigits = phone.replace(/[^0-9]/g, '') || '15551234567';
  const headline = niche.heroTagline.replace('{City}', city);
  const subheadline = niche.heroSub;
  const rating = prospect.rating || 4.8;
  const reviews = prospect.review_count || 48;
  const baseUrl = options.baseUrl || 'http://localhost:5000';
  const config = db.getConfig();
  const agencyWhatsApp = (config.sender_whatsapp || '918929698191').replace(/[^0-9]/g, '');

  const testimonials = [
    {
      name: 'Sarah Jenkins',
      loc: `${city} Resident`,
      text: `Called ${bizName} when we were in a bind. They arrived right on time, explained everything clearly, and finished the work with zero mess. Highly recommend!`,
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
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${bizName} | Official Website Demo</title>
  <meta name="description" content="${headline}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .hero-glow {
      background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white pb-16">

  <!-- Demo Notice Banner -->
  <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-xs sm:text-sm py-2.5 px-4 shadow-inner sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
      <div class="flex items-center gap-2 font-medium">
        <span class="inline-flex items-center justify-center bg-indigo-500 text-white rounded-full w-5 h-5 text-xs font-bold animate-pulse">✨</span>
        <span><strong>Live AI Website Demo</strong> built for <strong>${bizName}</strong> by SiteSeller Agent</span>
      </div>
      <div class="flex items-center gap-2.5">
        <a href="https://wa.me/${agencyWhatsApp}?text=Hi,%20I%20am%20from%20${encodeURIComponent(bizName)}%20and%20I%20want%20to%20claim%20this%20demo%20website!" target="_blank" rel="noopener noreferrer" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow flex items-center gap-1.5 transition-all hover:scale-105">
          <i class="fa-brands fa-whatsapp text-sm"></i>
          <span>WhatsApp Developer (+91 8929698191)</span>
        </a>
        <a href="#claim-modal" onclick="document.getElementById('claim-modal').classList.remove('hidden')" class="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-3 py-1 rounded-full text-xs shadow transition-all hover:scale-105">
          Claim Website
        </a>
      </div>
    </div>
  </div>

  <!-- Navbar -->
  <header class="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-10 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
          ${bizName.charAt(0)}
        </div>
        <div>
          <span class="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 block leading-tight">${bizName}</span>
          <span class="text-xs text-slate-500 font-medium">${prospect.category} • ${city}</span>
        </div>
      </div>
      
      <nav class="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
        <a href="#services" class="hover:text-indigo-600 transition">Services</a>
        <a href="#gallery" class="hover:text-indigo-600 transition">Work Gallery</a>
        <a href="#testimonials" class="hover:text-indigo-600 transition">Reviews</a>
        <a href="#contact" class="hover:text-indigo-600 transition">Contact</a>
      </nav>

      <div class="flex items-center gap-3">
        <a href="tel:${phone}" class="hidden sm:flex items-center gap-2 text-slate-700 font-semibold hover:text-indigo-600 text-sm">
          <i class="fa-solid fa-phone text-indigo-600"></i>
          <span>${phone}</span>
        </a>
        <a href="#contact" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition hover:shadow-indigo-200 hover:shadow-lg">
          Get Free Quote
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 space-y-6">
          <div class="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            #1 Rated ${prospect.category} in ${city}
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            ${headline}
          </h1>

          <p class="text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
            ${subheadline}
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <a href="#contact" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5">
              Request Free Estimate
            </a>
            <a href="tel:${phone}" class="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-6 py-3.5 rounded-xl transition flex items-center gap-2">
              <i class="fa-solid fa-phone text-indigo-600"></i>
              Call ${phone}
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
              <span>Licensed & Insured</span>
            </div>
            <div class="flex items-center gap-1.5 text-indigo-700 font-semibold">
              <i class="fa-solid fa-clock"></i>
              <span>Prompt Dispatch</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 relative">
          <div class="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <img src="${niche.heroImage}" alt="${bizName}" class="w-full h-[440px] object-cover object-center transform hover:scale-105 transition duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            <div class="absolute bottom-6 left-6 right-6 text-white p-4 rounded-xl bg-slate-900/60 backdrop-blur-md border border-white/20">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs uppercase tracking-wider font-semibold text-indigo-300">Local Verified</span>
                <span class="text-xs bg-emerald-500/80 px-2 py-0.5 rounded font-bold">Open Now</span>
              </div>
              <h4 class="font-bold text-lg">${bizName}</h4>
              <p class="text-xs text-slate-200">${prospect.address || city + ' Area'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section id="services" class="py-20 bg-white border-y border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="text-indigo-600 font-bold uppercase tracking-wider text-xs">What We Do Best</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
          Specialized Services Tailored for ${city}
        </h2>
        <p class="text-slate-600 mt-3 text-base">
          Our seasoned specialists handle jobs of all sizes with state-of-the-art tools and guaranteed quality.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${niche.services.map((s, idx) => `
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-xl mb-5 group-hover:bg-indigo-600 group-hover:text-white transition">
              <i class="fa-solid ${idx === 0 ? 'fa-bolt' : idx === 1 ? 'fa-screwdriver-wrench' : idx === 2 ? 'fa-shield-halved' : 'fa-handshake'}"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">${s.title}</h3>
            <p class="text-sm text-slate-600 mt-2 leading-relaxed">${s.desc}</p>
            <div class="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Learn more</span>
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
          <span class="text-indigo-600 font-bold uppercase tracking-wider text-xs">Our Workmanship</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">Recent Projects in ${city}</h2>
        </div>
        <p class="text-slate-600 max-w-md text-sm">
          A glimpse into the daily dedication and results delivered to homeowners and businesses throughout the region.
        </p>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${niche.gallery.map((img, i) => `
          <div class="rounded-xl overflow-hidden shadow-md group relative h-64 bg-slate-200">
            <img src="${img}" alt="Project ${i+1}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
              <span class="text-white font-semibold text-sm">Completed Project in ${city}</span>
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
        <span class="text-indigo-600 font-bold uppercase tracking-wider text-xs">Verified Feedback</span>
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">What Our Customers Say</h2>
        <div class="flex items-center justify-center gap-2 mt-3">
          <div class="flex text-amber-400 text-sm">
            <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          </div>
          <span class="font-bold text-slate-800 text-sm">Rated ${rating}/5 from ${reviews} real reviews</span>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        ${testimonials.map(t => `
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex text-amber-400 text-sm mb-3">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
              </div>
              <p class="text-slate-700 italic text-sm leading-relaxed mb-6">"${t.text}"</p>
            </div>
            <div class="flex items-center gap-3 pt-4 border-t border-slate-200">
              <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
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

  <!-- Contact & Booking Form Section -->
  <section id="contact" class="py-20 bg-slate-900 text-white relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-6 space-y-6">
          <span class="text-indigo-400 font-bold uppercase tracking-wider text-xs">Direct Booking</span>
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready for Quality Service? Get Your Free Estimate Today</h2>
          <p class="text-slate-300 text-base leading-relaxed">
            Fill out the quick quote form and our team will get back to you within 30 minutes with transparent pricing and scheduling options.
          </p>
          <div class="space-y-4 pt-4">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div>
                <div class="text-xs text-slate-400">Call Us Anytime</div>
                <div class="font-bold text-white">${phone}</div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <div class="text-xs text-slate-400">Service Coverage</div>
                <div class="font-bold text-white">${city} and surrounding areas</div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-6">
          <div class="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl">
            <h3 class="text-2xl font-bold mb-2">Book an Appointment / Quote</h3>
            <p class="text-slate-500 text-xs mb-6">No obligation • 100% Free upfront evaluation</p>

            <form onsubmit="event.preventDefault(); alert('Demo Form Submission Received! In live production, this instantly notifies ${bizName} via SMS & Email.');" class="space-y-4">
              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name</label>
                  <input type="text" required placeholder="John Doe" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm">
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input type="tel" required placeholder="(555) 000-0000" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm">
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input type="email" required placeholder="john@example.com" class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Service Needed</label>
                <select class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-white">
                  ${niche.services.map(s => `<option value="${s.title}">${s.title}</option>`).join('')}
                  <option value="Other">Other Custom Request</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase mb-1">Project Details or Notes</label>
                <textarea rows="3" placeholder="Tell us about the issue or preferred timing..." class="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"></textarea>
              </div>
              <button type="submit" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition hover:shadow-lg">
                Submit Request
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

  <!-- Floating WhatsApp Quick-Chat Button -->
  <a href="https://wa.me/${phoneDigits}?text=Hi%20${encodeURIComponent(bizName)},%20I%20saw%20your%20services%20and%20would%20like%20to%20get%20a%20quote!" 
     target="_blank" 
     rel="noopener noreferrer"
     class="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
     title="Chat with ${bizName} on WhatsApp">
    <i class="fa-brands fa-whatsapp text-2xl"></i>
    <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs group-hover:ml-2">
      Chat on WhatsApp
    </span>
  </a>

  <!-- Claim Modal -->
  <div id="claim-modal" class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-2xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative">
      <button onclick="document.getElementById('claim-modal').classList.add('hidden')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
        <i class="fa-solid fa-xmark text-lg"></i>
      </button>
      <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold mb-4">
        ✨
      </div>
      <h3 class="text-xl font-bold">Claim ${bizName}'s Website</h3>
      <p class="text-sm text-slate-600 mt-2">
        This high-converting website was custom generated for <strong>${bizName}</strong>. You can connect it to your own .com domain, change photos, and turn on online bookings today!
      </p>
      <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200 mt-4 text-xs text-slate-600 space-y-1">
        <div><strong>Includes:</strong> Free hosting setup, mobile responsive design, SEO optimization, and WhatsApp lead integration.</div>
      </div>
      <div class="mt-6 flex flex-col gap-2.5">
        <a href="https://wa.me/${agencyWhatsApp}?text=Hi%20Alex,%20I%20reviewed%20our%20website%20demo%20for%20${encodeURIComponent(bizName)}%20and%20want%20to%20claim%20it%20now!" target="_blank" rel="noopener noreferrer" class="w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-600/30">
          <i class="fa-brands fa-whatsapp text-lg"></i>
          <span>Claim via WhatsApp (+91 8929698191)</span>
        </a>
        <a href="mailto:alex@siteselleragent.com?subject=Claim%20Website%20for%20${encodeURIComponent(bizName)}&body=Hi,%20I%20would%20like%20to%20claim%20the%20website%20demo%20for%20${encodeURIComponent(bizName)}." class="w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition">
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
async function generateWebsiteForProspect(prospectId, baseUrl = 'http://localhost:5000') {
  const prospect = db.getProspectById(prospectId);
  if (!prospect) {
    throw new Error(`Prospect with ID ${prospectId} not found`);
  }

  const siteId = uuidv4();
  const demoUrl = `${baseUrl}/demos/${siteId}`;
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
  getNicheContent
};
