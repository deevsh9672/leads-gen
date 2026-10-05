import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Star } from 'lucide-react';
import { SIGNATURE_DISHES, CAFE_INFO } from './cafeData';

export default function FoodShowcase({ onSelectDish }) {
  return (
    <section id="showcase" className="py-24 bg-slate-900/60 border-y border-amber-900/20 text-white relative overflow-hidden">
      
      {/* Background Gradient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Culinary Excellence</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              Crafted With Obsessive Passion
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every dish and roast at {CAFE_INFO.name} is a balance of artisanal heritage and contemporary flavor science.
            </p>
          </div>

          <a
            href="#menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 group transition"
          >
            <span>Browse All 25+ Menu Items</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </a>
        </div>

        {/* 3 Large Cinematic Showcase Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {SIGNATURE_DISHES.map((dish, idx) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-end h-[460px] cursor-pointer"
              onClick={() => onSelectDish && onSelectDish(dish)}
            >
              {/* Background Image */}
              <img
                src={dish.image}
                alt={dish.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition duration-700 ease-out brightness-[0.75] group-hover:brightness-90"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Tag Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {dish.tag}
                </span>
              </div>

              {/* Card Footer Details */}
              <div className="relative z-10 p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition">
                    {dish.title}
                  </h3>
                  <span className="text-lg font-black text-amber-400">
                    {dish.price}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {dish.subtitle}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-white transition">
                  <span>Order or inspect dish</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
