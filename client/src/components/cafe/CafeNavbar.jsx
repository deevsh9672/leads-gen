import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  CalendarDays, 
  MessageCircle, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CAFE_INFO } from './cafeData';

export default function CafeNavbar({ 
  cartCount = 0, 
  onOpenCart, 
  onBookTable, 
  onSwitchToAgent,
  onOpenAdmin
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Menu', href: '#menu' },
    { label: 'Signature', href: '#showcase' },
    { label: 'Our Story', href: '#about' },
    { label: 'Offers', href: '#offers' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Location', href: '#location' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-950/85 backdrop-blur-xl border-b border-amber-900/30 py-3.5 shadow-2xl' 
            : 'bg-gradient-to-b from-slate-950/80 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-600/20 border border-amber-400/30 group-hover:scale-105 transition duration-300">
              <Coffee className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-serif font-black tracking-wide text-white block leading-tight group-hover:text-amber-300 transition">
                {CAFE_INFO.name.split(' ')[0]} <span className="text-amber-400 font-light text-base">ARTISAN</span>
              </span>
              <span className="text-[10px] text-amber-200/70 font-medium tracking-widest uppercase block">
                Roastery • Jaipur
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-amber-400 transition-colors relative py-1 group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Icons & CTAs */}
          <div className="flex items-center gap-3">
            
            {/* Superagent Switcher (For Pair Programming / Demo Control) */}
            {onSwitchToAgent && (
              <button
                onClick={onSwitchToAgent}
                title="Switch to Superagent Ops Dashboard"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] font-medium transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Superagent Ops</span>
              </button>
            )}

            {/* Admin Dashboard */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                title="Open Cafe Admin Manager"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/50 text-[11px] font-medium transition"
              >
                <span>Admin</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition flex items-center justify-center group"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md shadow-amber-500/40"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Book a Table Primary CTA */}
            <button
              onClick={onBookTable}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-lg shadow-amber-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900/80 text-slate-200 border border-slate-800"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <MenuIcon className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Animated Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[70px] z-40 bg-slate-950/95 backdrop-blur-2xl border-b border-amber-900/40 p-6 shadow-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-4 text-sm font-semibold uppercase tracking-wider text-slate-200 pb-6 border-b border-slate-800">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 hover:text-amber-400 transition flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                </a>
              ))}
            </nav>

            <div className="pt-6 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookTable();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
              >
                <CalendarDays className="w-4 h-4" />
                <span>Reserve a Table</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${CAFE_INFO.whatsapp}?text=Hi%20${encodeURIComponent(CAFE_INFO.name)}!%20I%20would%20like%20to%20order%20or%20inquire.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="py-2.5 bg-slate-800 text-amber-300 rounded-xl text-xs font-bold"
                  >
                    Admin Dashboard
                  </button>
                )}
              </div>

              {onSwitchToAgent && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSwitchToAgent();
                  }}
                  className="w-full py-2.5 bg-slate-900 border border-slate-800 text-indigo-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Return to SiteSeller Superagent</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
