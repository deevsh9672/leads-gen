import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { CUSTOMER_REVIEWS, CAFE_INFO } from './cafeData';

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? CUSTOMER_REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === CUSTOMER_REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const review = CUSTOMER_REVIEWS[currentIndex];

  return (
    <section id="reviews" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Verified Customer Love</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
            What Jaipur Says About Us
          </h2>

          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-white text-sm">
              {CAFE_INFO.rating} out of 5.0 ({CAFE_INFO.reviewsCount} Google Reviews)
            </span>
          </div>
        </div>

        {/* Carousel Card */}
        <div className="relative bg-slate-900/80 border border-amber-900/30 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <Quote className="w-12 h-12 text-amber-500/20 absolute top-6 right-8 pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Star Rating */}
              <div className="flex text-amber-400">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-base sm:text-xl text-slate-200 font-serif italic leading-relaxed">
                "{review.text}"
              </p>

              {/* Customer Avatar & Bio */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{review.name}</h4>
                  <p className="text-xs text-slate-400">{review.role} • {review.date}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-end gap-2 pt-6">
            <button
              onClick={prevReview}
              className="p-2.5 rounded-full bg-slate-950 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-white transition"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-500 font-medium px-2">
              {currentIndex + 1} / {CUSTOMER_REVIEWS.length}
            </span>
            <button
              onClick={nextReview}
              className="p-2.5 rounded-full bg-slate-950 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-white transition"
              aria-label="Next Review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
