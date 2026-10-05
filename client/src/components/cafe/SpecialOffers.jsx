import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Clock, ArrowRight, Check, Sparkles } from 'lucide-react';
import { SPECIAL_OFFERS, CAFE_INFO } from './cafeData';

export default function SpecialOffers({ onClaimOffer }) {
  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18
  });
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = (offer) => {
    setCopiedCode(offer.code);
    navigator.clipboard?.writeText(offer.code);
    if (onClaimOffer) {
      onClaimOffer(offer);
    }
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-24 bg-slate-900/40 border-y border-amber-900/20 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Limited-Time Specials</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
            Exclusive Café Combos
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm">
            Handcrafted pairings designed for morning rituals, afternoon catch-ups, and weekend brunches.
          </p>
        </div>

        {/* Offer Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {SPECIAL_OFFERS.map((offer) => {
            const isCopied = copiedCode === offer.code;

            return (
              <motion.div
                key={offer.id}
                whileHover={{ y: -4 }}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-xl flex flex-col justify-between"
              >
                {/* Accent Top Strip */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 to-rose-500" />

                <div className="space-y-4">
                  
                  {/* Badge & Discount */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {offer.badge}
                    </span>
                    <span className="text-sm font-black text-rose-400">
                      {offer.discount}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {offer.tagline}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-sm font-bold text-amber-300">
                    {offer.price}
                  </div>

                  {/* Live Countdown Timer */}
                  <div className="bg-slate-900/90 px-3.5 py-2.5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Offer expires in:</span>
                    </div>
                    <div className="font-mono font-bold text-amber-300 text-xs">
                      {String(timeLeft.hours).padStart(2, '0')}:
                      {String(timeLeft.minutes).padStart(2, '0')}:
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                  </div>

                </div>

                {/* Claim CTA */}
                <div className="pt-6">
                  <button
                    onClick={() => handleClaim(offer)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 transition active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Code "{offer.code}" Copied!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Claim Offer (Use {offer.code})</span>
                      </>
                    )}
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
