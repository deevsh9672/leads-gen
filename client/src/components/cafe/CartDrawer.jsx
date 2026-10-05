import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  CheckCircle2, 
  Clock, 
  MessageCircle,
  Truck,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CAFE_INFO } from './cafeData';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderPlaced
}) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'details' | 'success'
  
  // Checkout Form State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    orderType: 'Dine-In (Table)',
    tableNumber: 'Table 4',
    address: '',
    paymentMethod: 'UPI / GooglePay'
  });
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05);
  const deliveryFee = customerInfo.orderType === 'Delivery' ? (subtotal > 500 ? 0 : 40) : 0;
  const total = Math.max(0, subtotal + gst + deliveryFee - appliedDiscount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'MORNINGBREW') {
      setAppliedDiscount(Math.round(subtotal * 0.25));
      setPromoSuccessMsg('25% discount applied!');
    } else if (code === 'WEEKENDVIBES') {
      setAppliedDiscount(300);
      setPromoSuccessMsg('₹300 discount applied!');
    } else if (code === 'BOGOBREW') {
      setAppliedDiscount(150);
      setPromoSuccessMsg('₹150 BOGO discount applied!');
    } else {
      alert('Invalid promo code. Try MORNINGBREW or WEEKENDVIBES');
    }
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
      id: orderId,
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      orderType: customerInfo.orderType === 'Dine-In (Table)' ? `${customerInfo.orderType} ${customerInfo.tableNumber}` : customerInfo.orderType,
      items: cartItems.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
      subtotal,
      total,
      status: 'Confirmed',
      placedAt: 'Just now'
    };

    setLastPlacedOrder(orderData);
    setCheckoutStep('success');
    if (onOrderPlaced) {
      onOrderPlaced(orderData);
    }
    onClearCart();

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const getWhatsAppOrderLink = () => {
    if (!lastPlacedOrder) return '#';
    const itemsList = lastPlacedOrder.items.map(i => `• ${i.qty}x ${i.name} (₹${i.price * i.qty})`).join('\n');
    const msg = `Hi ${CAFE_INFO.name}! 👋 I placed order #${lastPlacedOrder.id}:\n\n${itemsList}\n\nTotal: ₹${lastPlacedOrder.total}\nType: ${lastPlacedOrder.orderType}\nCustomer: ${lastPlacedOrder.customerName} (${lastPlacedOrder.phone})\n\nPlease prepare my order!`;
    return `https://wa.me/${CAFE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-slate-900 border-l border-amber-900/30 text-white h-full flex flex-col justify-between shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Your Café Order</h3>
              <p className="text-xs text-slate-400">
                {checkoutStep === 'cart' ? `${cartItems.length} items selected` : checkoutStep === 'details' ? 'Delivery & Table Details' : 'Order Placed!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="py-20 text-center text-slate-500 space-y-3">
                  <div className="text-4xl">☕</div>
                  <p className="font-medium text-sm text-slate-400">Your order tray is empty.</p>
                  <p className="text-[11px] max-w-xs mx-auto">Explore our specialty coffees, croissants, and truffle pasta to add items!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-3 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-xs truncate">{item.name}</h4>
                        <div className="text-amber-400 font-bold text-xs mt-0.5">
                          {CAFE_INFO.currency}{item.price * item.quantity}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 rounded-md bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-white w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="p-1 rounded-md bg-slate-800 text-slate-300 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Promo Code Box */}
              {cartItems.length > 0 && (
                <div className="pt-2">
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. MORNINGBREW)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs uppercase text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs"
                    >
                      Apply
                    </button>
                  </form>
                  {promoSuccessMsg && (
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      ✓ {promoSuccessMsg}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'details' && (
            <form onSubmit={handleCompleteOrder} id="checkout-form" className="space-y-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Kavita Sharma"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98290 12345"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Order Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Dine-In (Table)', 'Takeaway', 'Delivery'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCustomerInfo({ ...customerInfo, orderType: type })}
                      className={`p-2 rounded-xl text-center font-bold text-[11px] border transition ${
                        customerInfo.orderType === type
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {customerInfo.orderType === 'Dine-In (Table)' && (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Table Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Table 4 / Patio Table 2"
                    value={customerInfo.tableNumber}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {customerInfo.orderType === 'Delivery' && (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Delivery Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="Apartment, Street, C-Scheme, Jaipur"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Payment Method</label>
                <div className="space-y-2">
                  {['UPI / GooglePay / PhonePe', 'Pay on Delivery / Counter', 'Credit / Debit Card'].map((pm) => (
                    <label key={pm} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={customerInfo.paymentMethod === pm}
                        onChange={() => setCustomerInfo({ ...customerInfo, paymentMethod: pm })}
                        className="text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-white font-medium">{pm}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && lastPlacedOrder && (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-white">Order Confirmed!</h3>
                <p className="text-xs text-amber-300 font-semibold mt-1">
                  Order ID: #{lastPlacedOrder.id}
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  Our baristas are preparing your handcrafted order now.
                </p>
              </div>

              {/* Order Items Summary */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2">
                <div className="font-bold text-white mb-2 pb-1 border-b border-slate-800">
                  Order Breakdown
                </div>
                {lastPlacedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300">
                    <span>{it.qty}x {it.name}</span>
                    <span>₹{it.price * it.qty}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-amber-300 pt-2 border-t border-slate-800 text-sm">
                  <span>Total Paid</span>
                  <span>₹{lastPlacedOrder.total}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={getWhatsAppOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order to WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setCheckoutStep('cart');
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Billing Breakdown */}
        {checkoutStep !== 'success' && cartItems.length > 0 && (
          <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">{CAFE_INFO.currency}{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>5% GST</span>
                <span className="text-white font-medium">{CAFE_INFO.currency}{gst}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-white font-medium">{CAFE_INFO.currency}{deliveryFee}</span>
                </div>
              )}
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-{CAFE_INFO.currency}{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-amber-300 text-base">{CAFE_INFO.currency}{total}</span>
              </div>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                onClick={() => setCheckoutStep('details')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-semibold"
                >
                  Back
                </button>
                <button
                  form="checkout-form"
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2"
                >
                  <span>Confirm Order ({CAFE_INFO.currency}{total})</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </motion.div>
    </div>
  );
}
