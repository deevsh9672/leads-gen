import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, HeartHandshake, Coffee, Users, Star, CheckCircle2 } from 'lucide-react';
import { CAFE_INFO } from './cafeData';

export default function CafeAbout() {
  const stats = [
    { value: CAFE_INFO.yearsExperience, label: 'Years of Craft', icon: Award },
    { value: CAFE_INFO.happyCustomers, label: 'Happy Customers', icon: Users },
    { value: CAFE_INFO.signatureDishes, label: 'Artisan Creations', icon: Coffee },
    { value: `${CAFE_INFO.rating}★`, label: 'Average Rating', icon: Star }
  ];

  return (
    <section id="about" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Editorial Image with Floating Accent */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-900/30">
              <img
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80"
                alt="Head Barista at Aura Artisan Cafe"
                className="w-full h-[520px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            {/* Floating Quality Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 shadow-2xl flex items-center gap-3.5"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold">
                ☕
              </div>
              <div>
                <div className="text-xs font-bold text-white">Direct-Trade Beans</div>
                <div className="text-[10px] text-amber-300/80">Ethically sourced from single estates</div>
              </div>
            </motion.div>
          </div>

          {/* Right: Storytelling & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Our Heritage & Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              Rooted in Jaipur, Inspired by Global Coffee Culture.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Founded with a singular obsession: to serve coffee that awakens the senses, in spaces that inspire connection. At {CAFE_INFO.name}, we slow roast our single-estate Arabica in micro-batches every Tuesday and Friday, ensuring peak fragrance and extraction clarity.
            </p>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Our kitchen operates on the principle of unhurried perfection: our sourdough ferments for 36 hours, French butter is hand-laminated into morning croissants, and pasta dough is rolled fresh every morning before service begins.
            </p>

            {/* Quality Commitments */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Specialty Grade Beans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Artificial Syrups or Preservatives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Oat & Almond Milk Dairy Alternatives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>High-Speed Fiber WiFi & Quiet Workspaces</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-xl sm:text-2xl font-serif font-black text-white">{s.value}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
