import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, MessageSquare, ShoppingBag, Clock, ChefHat, 
  Settings, CheckCircle, ArrowUpRight
} from 'lucide-react';

import CafePageLoader from './CafePageLoader';
import CafeNavbar from './CafeNavbar';
import CafeHero from './CafeHero';
import CafeMenu from './CafeMenu';
import FoodShowcase from './FoodShowcase';
import CafeAbout from './CafeAbout';
import SpecialOffers from './SpecialOffers';
import ReservationSection from './ReservationSection';
import CartDrawer from './CartDrawer';
import CafeAIModal from './CafeAIModal';
import ProductDetailModal from './ProductDetailModal';
import OrderTrackingModal from './OrderTrackingModal';
import CafeAdminDashboard from './CafeAdminDashboard';
import InstagramGallery from './InstagramGallery';
import CustomerReviews from './CustomerReviews';
import LocationSection from './LocationSection';
import CafeFooter from './CafeFooter';

import { 
  CAFE_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_RESERVATIONS, 
  WHATSAPP_CONTACT_NUMBER,
  CAFE_INFO 
} from './cafeData';

export default function CafeApp({ onSwitchToSuperagent }) {
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [menuItems, setMenuItems] = useState(CAFE_MENU_ITEMS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);

  // Modals & UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [inspectedProduct, setInspectedProduct] = useState(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(orders[0] || null);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Cart operations
  const handleAddToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    showToast(`Added ${quantity}x "${item.name}" to your tray`);
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // New Order Placed
  const handleOrderSuccess = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);
    setIsCartOpen(false);
    setIsTrackingOpen(true);
    showToast(`Order #${newOrder.id} placed successfully!`);
  };

  // Reservation Placed
  const handleReservationSuccess = (newRes) => {
    setReservations((prev) => [newRes, ...prev]);
    showToast(`Reservation #${newRes.id} confirmed!`);
  };

  // Admin Controls
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} status set to ${newStatus}`);
  };

  const handleUpdateReservationStatus = (resId, newStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status: newStatus } : r))
    );
    showToast(`Reservation #${resId} marked ${newStatus}`);
  };

  const handleToggleItemStock = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, inStock: item.inStock === false ? true : false } : item
      )
    );
  };

  // Direct WhatsApp Barista line
  const openDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi Aura Artisan Café! I'm browsing your online menu and would like to ask a question.`
    );
    window.open(`https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#110e0c] text-stone-100 font-sans selection:bg-amber-600 selection:text-stone-950 relative">
      {/* Initial cinematic loading screen */}
      <AnimatePresence>
        {loading && <CafePageLoader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 right-6 z-50 bg-[#1e1b18] border border-amber-600/40 text-stone-200 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Luxury Sticky Navbar */}
      <CafeNavbar
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSwitchToSuperagent={onSwitchToSuperagent}
      />

      {/* Main Page Flow */}
      <main>
        {/* Cinematic Hero */}
        <CafeHero
          onExploreMenu={() => {
            const el = document.getElementById('menu-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onBookTable={() => {
            const el = document.getElementById('reservations-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onAskAI={() => setIsAIOpen(true)}
        />

        {/* Parallax Signature Showcase */}
        <FoodShowcase
          onOrderNow={(dish) => {
            handleAddToCart(dish, 1);
          }}
        />

        {/* Limited Time Offers */}
        <SpecialOffers
          onClaimOffer={(offer) => {
            showToast(`Offer "${offer.title}" applied! Discount code: ${offer.code}`);
            setIsCartOpen(true);
          }}
        />

        {/* Interactive Menu Section */}
        <CafeMenu
          items={menuItems}
          onAddToCart={handleAddToCart}
          onInspectItem={(item) => setInspectedProduct(item)}
        />

        {/* Editorial Story & Roastery Heritage */}
        <CafeAbout onBookTour={() => setIsAIOpen(true)} />

        {/* Table Reservation Engine */}
        <ReservationSection onReservationSuccess={handleReservationSuccess} />

        {/* Customer Reviews & Ratings */}
        <CustomerReviews />

        {/* Visual Instagram & Lifestyle Gallery */}
        <InstagramGallery />

        {/* Location, Roastery Hours & Map */}
        <LocationSection />
      </main>

      {/* Dark Luxury Footer */}
      <CafeFooter onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Floating Floating Barista & Action Hub */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Live Order Tracker pill (if active orders exist) */}
        {orders.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => {
              setActiveTrackingOrder(orders[0]);
              setIsTrackingOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1c1917]/90 hover:bg-[#292524] border border-amber-600/40 text-stone-200 text-xs font-semibold shadow-xl backdrop-blur-md group transition"
          >
            <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Track Order #{orders[0].id}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </motion.button>
        )}

        <div className="flex items-center gap-3">
          {/* Direct WhatsApp to Roastery Desk */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={openDirectWhatsApp}
            title="Chat directly with Roastery Desk on WhatsApp (+91 8920608191)"
            className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-stone-950 flex items-center justify-center shadow-2xl shadow-emerald-950/60 border border-emerald-400/40 transition group"
          >
            <MessageSquare className="w-6 h-6 fill-current text-stone-950" />
          </motion.button>

          {/* Café AI Interactive Barista Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAIOpen(true)}
            className="px-5 py-3.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 font-bold flex items-center gap-2.5 shadow-2xl shadow-amber-950/80 border border-amber-300/40 hover:shadow-amber-500/30 transition"
          >
            <Sparkles className="w-5 h-5 text-stone-950 animate-bounce" />
            <span className="text-sm tracking-wide font-serif">Ask Café AI</span>
          </motion.button>
        </div>
      </div>

      {/* MODALS */}
      {/* Slide-over Cart & Checkout */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* AI Barista Conversational Modal */}
      <CafeAIModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onAddToCart={(item) => handleAddToCart(item, 1)}
      />

      {/* Detailed Product Inspector */}
      <ProductDetailModal
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        activeOrder={activeTrackingOrder}
        allOrders={orders}
      />

      {/* Integrated Roastery Operations & Admin Dashboard */}
      <CafeAdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        reservations={reservations}
        onUpdateReservationStatus={handleUpdateReservationStatus}
        menuItems={menuItems}
        onToggleItemStock={handleToggleItemStock}
      />
    </div>
  );
}
