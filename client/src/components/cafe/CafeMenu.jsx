import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Coffee, 
  Leaf, 
  Croissant, 
  Utensils, 
  Cake, 
  GlassWater, 
  Plus, 
  Check, 
  Filter, 
  Star,
  SlidersHorizontal
} from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS, CAFE_INFO } from './cafeData';
import ProductDetailModal from './ProductDetailModal';

// Icon mapping helper
const CATEGORY_ICONS = {
  Sparkles,
  Coffee,
  Leaf,
  Croissant,
  Utensils,
  Cake,
  GlassWater
};

export default function CafeMenu({ onAddToCart, onShowToast }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [bestsellersOnly, setBestsellersOnly] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedItems, setAddedItems] = useState({});

  // Filtered & Sorted Menu Items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVeg = vegOnly ? item.isVeg : true;
      const matchesBestseller = bestsellersOnly ? item.isBestseller : true;

      return matchesCategory && matchesSearch && matchesVeg && matchesBestseller;
    }).sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      return 0; // recommended / default
    });
  }, [activeCategory, searchQuery, vegOnly, bestsellersOnly, sortOption]);

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    onAddToCart(item, 1);
    
    // Animate button state
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 900);

    if (onShowToast) {
      onShowToast(`Added "${item.name}" to cart`);
    }
  };

  return (
    <section id="menu" className="py-24 bg-slate-950 text-white relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Menu & Online Ordering</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
            Curated Artisanal Offerings
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Freshly roasted single-estate beans, slow-fermented bakes, and gourmet dishes prepared with obsessively sourced ingredients.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4">
          
          {/* Category Tabs (Scrollable on Mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {MENU_CATEGORIES.map((cat) => {
              const IconComponent = CATEGORY_ICONS[cat.icon] || Sparkles;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-600/30 scale-[1.02]'
                      : 'bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-amber-400'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Toggle Filters Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search coffee, croissants, pasta, desserts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Quick Filter Buttons & Sort */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              
              {/* Veg Only Toggle */}
              <button
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold border transition ${
                  vegOnly 
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Pure Veg</span>
              </button>

              {/* Bestsellers Only */}
              <button
                onClick={() => setBestsellersOnly(!bestsellersOnly)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold border transition ${
                  bestsellersOnly 
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Bestsellers</span>
              </button>

              {/* Price Sort Dropdown */}
              <div className="relative flex items-center">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <div className="text-3xl">☕</div>
            <p className="text-sm font-semibold">No items matched your search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setVegOnly(false);
                setBestsellersOnly(false);
                setActiveCategory('all');
              }}
              className="text-xs text-amber-400 underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const isAdded = addedItems[item.id];

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedProduct(item)}
                  className="bg-slate-900/70 border border-slate-800/80 rounded-3xl overflow-hidden hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container with Zoom */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        {/* Veg / Non-Veg Indicator Dot */}
                        <div className="w-5 h-5 rounded-md bg-slate-950/80 backdrop-blur-sm border border-slate-700 flex items-center justify-center">
                          <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                        </div>

                        {item.isBestseller && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md">
                            ★ Bestseller
                          </span>
                        )}
                      </div>

                      {/* Rating & Calories at bottom of image */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                        <span className="font-semibold flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{item.rating}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.calories}
                        </span>
                      </div>
                    </div>

                    {/* Text Details */}
                    <div className="p-5 space-y-2">
                      <h3 className="font-serif font-bold text-base text-white group-hover:text-amber-300 transition line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action Button */}
                  <div className="px-5 pb-5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-amber-300">
                        {CAFE_INFO.currency}{item.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, item)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}

    </section>
  );
}
