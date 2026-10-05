import React, { useState } from 'react';
import { Coffee, ArrowRight, Camera, MessageCircle, Heart, CheckCircle2 } from 'lucide-react';
import { CAFE_INFO } from './cafeData';

export default function CafeFooter({ onBookTable, onOpenMenu, onSwitchToSuperagent }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-600/20 border border-amber-400/30">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-serif font-black tracking-wide text-white block">
                  {CAFE_INFO.name}
                </span>
                <span className="text-[10px] text-amber-400 font-medium tracking-widest uppercase block">
                  {CAFE_INFO.tagline}
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Artisan single-estate roastery and French-inspired micro-bakery. Serving memorable coffees, slow-fermented bakes, and peaceful ambiance in {CAFE_INFO.city}.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${CAFE_INFO.whatsapp}?text=Hi%20${encodeURIComponent(CAFE_INFO.name)}!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-emerald-400 flex items-center justify-center transition"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500 text-pink-400 flex items-center justify-center transition"
                title="Instagram"
              >
                <Camera className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Explore</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-amber-400 transition">Home</a></li>
              <li><a href="#menu" onClick={onOpenMenu} className="hover:text-amber-400 transition">Artisan Menu</a></li>
              <li><a href="#showcase" className="hover:text-amber-400 transition">Signature Dishes</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition">Our Story</a></li>
              <li><a href="#offers" className="hover:text-amber-400 transition">Special Combos</a></li>
              <li><a href="#reservation" onClick={onBookTable} className="hover:text-amber-400 transition">Reserve a Table</a></li>
            </ul>
          </div>

          {/* Menu Highlights */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">Specialties</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-300">Single-Origin Pour-Over</span></li>
              <li><span className="text-slate-300">Pistachio Iced Latte</span></li>
              <li><span className="text-slate-300">Truffle Scrambled Brioche</span></li>
              <li><span className="text-slate-300">Burnt Basque Cheesecake</span></li>
              <li><span className="text-slate-300">Cascara Nitro Cold Brew</span></li>
              <li><span className="text-slate-300">Almond Croissants</span></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">The Roast Journal</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Subscribe for secret weekly roasts, invitation-only cupping sessions, and tasting invites.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Join Journal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {subscribed && (
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Welcome to Aura.</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {CAFE_INFO.name}. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4">
            <a href="#hero" className="hover:text-slate-300">Privacy Policy</a>
            <span>•</span>
            <a href="#hero" className="hover:text-slate-300">Terms of Service</a>
            <span>•</span>
            <span className="text-amber-400/80">WhatsApp: +91 8920608191</span>
            {onSwitchToSuperagent && (
              <>
                <span>•</span>
                <button
                  onClick={onSwitchToSuperagent}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Return to AI SiteSeller Agent
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
