import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Flame, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CAFE_INFO } from './cafeData';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-300 hover:text-white transition backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Product Image */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                product.isVeg ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>{product.isVeg ? 'Vegetarian' : 'Non-Veg'}</span>
              </span>

              {product.isBestseller && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-slate-950 shadow-md">
                  ★ Bestseller
                </span>
              )}

              {product.calories && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-900/80 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>{product.calories}</span>
                </span>
              )}
            </div>
          </div>

          {/* Details Content */}
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                  {product.name}
                </h3>
                <p className="text-xs text-amber-400 font-semibold tracking-wide uppercase mt-1">
                  {product.category}
                </p>
              </div>
              <div className="text-xl font-bold text-amber-300 shrink-0">
                {CAFE_INFO.currency}{product.price}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Ingredients & Allergens */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="font-semibold text-slate-400 mb-1">Key Ingredients:</div>
                <div className="text-slate-200">
                  {product.ingredients?.join(', ') || 'House specialty blend'}
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="font-semibold text-slate-400 flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Allergen Notice:</span>
                </div>
                <div className="text-slate-200">
                  {product.allergens?.join(', ') || 'No common allergens'}
                </div>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800">
              
              {/* Quantity Counter */}
              <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-400 hover:text-white transition disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-sm text-white w-4 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={added}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-600/25 flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99]"
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Added to Cart ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity} for {CAFE_INFO.currency}{product.price * quantity}</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
