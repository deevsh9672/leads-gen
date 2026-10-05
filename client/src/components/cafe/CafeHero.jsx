import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  BookOpen, 
  CalendarDays, 
  Star, 
  ChevronDown, 
  Sparkles, 
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { CAFE_INFO } from './cafeData';

export default function CafeHero({ onOrderNow, onExploreMenu, onBookTable }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white pt-24 pb-16">
      
      {/* Background Image with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85"
          alt="Cinematic Artisan Cafe"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1]"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/80" />
        <div className="absolute inset-0 bg-radial-gradient from-amber-600/15 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Floating Coffee Accents */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden xl:flex absolute top-36 right-20 z-10 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-amber-500/20 items-center gap-3 shadow-2xl shadow-amber-500/10"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
          ☕
        </div>
        <div>
          <div className="text-xs font-bold text-white">Yirgacheffe Roast</div>
          <div className="text-[10px] text-amber-300/80">Fresh batch roasted today</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [0, -4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden xl:flex absolute bottom-36 left-16 z-10 p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-amber-500/20 items-center gap-3 shadow-2xl"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
          🥐
        </div>
        <div>
          <div className="text-xs font-bold text-white">Artisan Viennoiserie</div>
          <div className="text-[10px] text-slate-300">Baked fresh at 8:00 AM</div>
        </div>
      </motion.div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
        
        {/* Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Specialty Coffee Roastery & Micro-Bakery • {CAFE_INFO.city}</span>
        </motion.div>

        {/* Large Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto"
        >
          Where Every Sip <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent italic font-normal">
            Tells a Story.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Single-origin estate beans slow-roasted in small batches, woodfired morning sourdough, and sunlit courtyard corners crafted for meaningful conversations.
        </motion.p>

        {/* CTAs Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
        >
          {/* Order Now */}
          <button
            onClick={onOrderNow}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Online</span>
          </button>

          {/* View Menu */}
          <button
            onClick={onExploreMenu}
            className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Explore Menu</span>
          </button>

          {/* Book Table */}
          <button
            onClick={onBookTable}
            className="px-6 py-3.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-200 border border-amber-700/40 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all hover:scale-105"
          >
            <CalendarDays className="w-4 h-4 text-amber-400" />
            <span>Book a Table</span>
          </button>
        </motion.div>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="pt-8 border-t border-slate-800/80 max-w-2xl mx-auto flex flex-wrap items-center justify-around gap-6 text-xs text-slate-400"
        >
          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-white text-sm">{CAFE_INFO.rating}</span>
            <span>({CAFE_INFO.reviewsCount} Google Reviews)</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Open Today: 8 AM - 11:30 PM</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
            <Coffee className="w-4 h-4" />
            <span>100% Specialty Arabica</span>
          </div>
        </motion.div>

      </div>

      {/* Gentle Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400 hover:text-amber-400 transition cursor-pointer"
        onClick={onExploreMenu}
      >
        <span>Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 text-amber-400" />
      </motion.div>

    </section>
  );
}
