import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';

export default function CafePageLoader({ onComplete }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onComplete) onComplete();
    }, 1400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center text-white"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-radial-gradient from-amber-600/10 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Logo & Animated Steam Icon */}
          <div className="relative mb-6">
            <motion.div
              animate={{
                y: [0, -6, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-amber-400"
            >
              <span className="w-1 h-3 bg-amber-400/80 rounded-full animate-pulse blur-[0.5px]" />
              <span className="w-1 h-4 bg-amber-300 rounded-full animate-pulse delay-75 blur-[0.5px]" />
              <span className="w-1 h-2.5 bg-amber-500/80 rounded-full animate-pulse delay-150 blur-[0.5px]" />
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 text-white flex items-center justify-center shadow-2xl shadow-amber-500/30 border border-amber-400/30"
            >
              <Coffee className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Brand Name & Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-serif font-black tracking-wider text-amber-100"
          >
            AURA ARTISAN
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center gap-2 mt-2 text-xs uppercase tracking-widest text-amber-400/80 font-medium"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Brewing something special...</span>
          </motion.div>

          {/* Minimal Progress Bar */}
          <div className="w-40 h-[2px] bg-slate-800 rounded-full overflow-hidden mt-8">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
