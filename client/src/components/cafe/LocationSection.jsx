import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation, MessageCircle, ExternalLink } from 'lucide-react';
import { CAFE_INFO } from './cafeData';

export default function LocationSection() {
  // Check if Open Now (8:00 AM - 11:30 PM)
  const isCurrentlyOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 8 && hours < 23.5;
  };

  const openStatus = isCurrentlyOpen();

  return (
    <section id="location" className="py-24 bg-slate-900/40 border-y border-amber-900/20 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Visit The Roastery</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
            Find Us in Jaipur
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm">
            Centrally located in C-Scheme with dedicated valet parking and quiet garden seating.
          </p>
        </div>

        {/* 2-Column Info & Map Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Details Card */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 shadow-xl">
            <div className="space-y-6">
              
              {/* Status Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Store Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  openStatus ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${openStatus ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  <span>{openStatus ? 'Open Now Until 11:30 PM' : 'Closed • Opens 8:00 AM'}</span>
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Roastery Location</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {CAFE_INFO.address}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Phone</h4>
                  <a href={`tel:${CAFE_INFO.phone}`} className="text-xs text-amber-300 hover:underline mt-1 block">
                    {CAFE_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/20 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Café Hours</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {CAFE_INFO.openingHours}
                  </p>
                </div>
              </div>

            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <a
                href="https://maps.google.com/?q=C-Scheme+Jaipur"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={`https://wa.me/${CAFE_INFO.whatsapp}?text=Hi!%20I'm%20visiting%20Aura%20Artisan%20Cafe%20today!`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Map Visual */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden min-h-[380px] relative shadow-xl">
            <iframe
              title="Aura Artisan Cafe Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14234.341103608182!2d75.7937397!3d26.9079213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db419c8d1976f%3A0xc391e6b377fc0445!2sC%20Scheme%2C%20Ashok%20Nagar%2C%20Jaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px', filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Custom Pin Overlay Badge */}
            <div className="absolute top-4 left-4 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-amber-500/40 text-xs shadow-xl flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
              <div>
                <strong className="text-white block">{CAFE_INFO.name}</strong>
                <span className="text-[10px] text-amber-300">C-Scheme, Ashok Nagar</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
