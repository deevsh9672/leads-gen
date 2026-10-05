import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, ChefHat, PackageCheck, Truck, X, MessageSquare, Phone, ChevronRight } from 'lucide-react';
import { WHATSAPP_CONTACT_NUMBER } from './cafeData';

export default function OrderTrackingModal({ isOpen, onClose, activeOrder, allOrders = [] }) {
  const [selectedOrderId, setSelectedOrderId] = useState(activeOrder?.id || allOrders[0]?.id || null);

  if (!isOpen) return null;

  const currentOrder = (allOrders.find(o => o.id === selectedOrderId)) || activeOrder || allOrders[0];

  const steps = [
    { key: 'Confirmed', label: 'Order Confirmed', icon: CheckCircle2, desc: 'Roastery desk accepted your order' },
    { key: 'Preparing', label: 'Artisan Prep', icon: ChefHat, desc: 'Brewing single-origin & baking fresh' },
    { key: 'Ready', label: 'Out for Delivery / Ready', icon: Truck, desc: 'On its way or ready at pickup counter' },
    { key: 'Completed', label: 'Delivered / Served', icon: PackageCheck, desc: 'Enjoy your artisan coffee experience' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Confirmed': return 0;
      case 'Preparing': return 1;
      case 'Ready': return 2;
      case 'Completed': return 3;
      default: return 1;
    }
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 1;

  const handleWhatsAppInquiry = () => {
    if (!currentOrder) return;
    const msg = `Hi Aura Artisan Café! Checking status for my order *${currentOrder.id}* (${currentOrder.customerName}). Status shows: ${currentOrder.status}.`;
    const waUrl = `https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-[#1c1917] border border-amber-900/40 rounded-3xl p-6 md:p-8 shadow-2xl text-stone-200 overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Subtle amber ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Live Order Tracker</span>
              </div>
              <h2 className="text-2xl font-serif text-amber-100 font-bold mt-1">
                Order #{currentOrder?.id || 'AURA-LIVE'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-6">
            {/* Multiple orders selector if available */}
            {allOrders.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                      selectedOrderId === ord.id
                        ? 'bg-amber-600 text-stone-950 font-bold'
                        : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    #{ord.id} ({ord.status})
                  </button>
                ))}
              </div>
            )}

            {/* Stepper */}
            <div className="bg-stone-900/80 rounded-2xl p-5 border border-stone-800/80">
              <div className="relative flex justify-between items-center mb-8">
                {/* Connecting bar */}
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-stone-800 -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500"
                    style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={step.key} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isDone
                            ? 'bg-amber-600 text-stone-950 shadow-md shadow-amber-900/30'
                            : isCurrent
                            ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/20 scale-110 shadow-lg shadow-amber-500/30'
                            : 'bg-stone-800 text-stone-500 border border-stone-700/60'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium text-center max-w-[80px] ${
                          isCurrent ? 'text-amber-300 font-bold' : isDone ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Status banner */}
              <div className="flex items-center justify-between p-3.5 bg-amber-950/30 border border-amber-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-amber-400/80 font-medium">Estimated Arrival</p>
                    <p className="text-sm font-semibold text-stone-100">{currentOrder?.eta || '15 - 25 Minutes'}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full border border-amber-500/30">
                  {currentOrder?.status || 'Preparing'}
                </span>
              </div>
            </div>

            {/* Order Details */}
            {currentOrder && (
              <div className="bg-stone-900/50 rounded-2xl p-5 border border-stone-800 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-stone-800/60 pb-3">
                  <span className="text-stone-400">Customer</span>
                  <span className="font-semibold text-stone-200">{currentOrder.customerName} ({currentOrder.phone})</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-stone-800/60 pb-3">
                  <span className="text-stone-400">Fulfillment</span>
                  <span className="font-semibold text-stone-200 uppercase tracking-wider text-xs bg-stone-800 px-2.5 py-1 rounded-md">
                    {currentOrder.orderType === 'dine-in' ? `Dine-In • Table #${currentOrder.tableNo || '7'}` : 'Delivery / Takeaway'}
                  </span>
                </div>
                {currentOrder.address && (
                  <div className="flex justify-between items-start text-sm border-b border-stone-800/60 pb-3">
                    <span className="text-stone-400">Address</span>
                    <span className="font-medium text-stone-300 text-right max-w-[280px]">{currentOrder.address}</span>
                  </div>
                )}
                <div className="pt-1">
                  <p className="text-xs text-stone-400 mb-2 font-medium">Ordered Items:</p>
                  <div className="space-y-2">
                    {currentOrder.items?.map((it, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-stone-300">
                          {it.quantity}x {it.name}
                        </span>
                        <span className="text-stone-400 font-mono">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-stone-800 font-semibold text-base text-amber-300">
                  <span>Grand Total</span>
                  <span className="font-mono text-lg font-bold">₹{currentOrder.totalAmount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer CTAs */}
          <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleWhatsAppInquiry}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold transition shadow-lg shadow-emerald-950/40"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              WhatsApp Live Roastery Desk
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
