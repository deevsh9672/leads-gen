import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Sparkles, MessageCircle, Heart, Share2 } from 'lucide-react';
import { GALLERY_PHOTOS, CAFE_INFO } from './cafeData';

export default function InstagramGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="py-24 bg-slate-900/40 border-y border-amber-900/20 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>@aura.artisancafe</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              Follow Our Café Journey
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm">
              Capturing daily roasts, sunlit courtyard conversations, and artisanal bakes in the heart of Jaipur.
            </p>
          </div>

          <a
            href={`https://wa.me/${CAFE_INFO.whatsapp}?text=Hi%20${encodeURIComponent(CAFE_INFO.name)}!%20I%20love%20your%20cafe%20photos!`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 border border-slate-700/80 hover:border-amber-400/50 text-xs font-bold text-amber-300 transition hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Connect on WhatsApp</span>
          </a>
        </div>

        {/* Masonry / Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => setSelectedImage(photo)}
              className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 h-72 cursor-pointer shadow-xl"
            >
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="self-end">
                  <span className="p-2 rounded-full bg-slate-900/80 text-amber-400 inline-flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-amber-400/20" />
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    {photo.category}
                  </span>
                  <h4 className="text-base font-serif font-bold text-white mt-0.5">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-normal">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-950 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-[420px] sm:h-[480px] w-full overflow-hidden bg-slate-950">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="p-6 bg-slate-900 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {selectedImage.category}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mt-1">
                    {selectedImage.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-lg">
                    {selectedImage.caption}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/${CAFE_INFO.whatsapp}?text=Saw%20this%20photo%20on%20your%20website:%20${encodeURIComponent(selectedImage.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                    title="Share via WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
