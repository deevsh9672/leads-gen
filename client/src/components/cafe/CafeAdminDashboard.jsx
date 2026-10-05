import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Coffee, ShoppingBag, Calendar, TrendingUp, CheckCircle, 
  Clock, AlertCircle, Phone, MessageSquare, Search, Filter, ShieldCheck
} from 'lucide-react';
import { WHATSAPP_CONTACT_NUMBER } from './cafeData';

export default function CafeAdminDashboard({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  reservations,
  onUpdateReservationStatus,
  menuItems,
  onToggleItemStock,
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reservations' | 'menu' | 'stats'
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const confirmedReservationsCount = reservations.filter(r => r.status === 'Confirmed').length;

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.phone.includes(searchQuery);
    if (!matchesSearch) return false;
    if (orderFilter === 'all') return true;
    return o.status.toLowerCase() === orderFilter.toLowerCase();
  });

  const sendWhatsAppUpdate = (order) => {
    const msg = `Hello ${order.customerName}! Update on your Aura Artisan Café order *#${order.id}*: Status is now *${order.status}*. Thank you for ordering with us!`;
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const statusColors = {
    Confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Preparing: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Ready: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    Completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Cancelled: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-6xl h-[92vh] bg-[#141210] border border-amber-800/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#1a1715]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">Roastery Operations</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">LIVE POS</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-amber-100">Aura Café Manager Console</h2>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="hidden md:flex items-center bg-stone-900 rounded-xl p-1 border border-stone-800">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'orders' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Live Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'reservations' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Bookings ({reservations.length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'menu' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              Menu Inventory
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'stats' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Analytics
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="flex md:hidden border-b border-stone-800 bg-stone-900/80 px-2 py-2 overflow-x-auto gap-2">
          {['orders', 'reservations', 'menu', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase font-bold tracking-wider whitespace-nowrap ${
                activeTab === tab ? 'bg-amber-600 text-stone-950' : 'text-stone-400 hover:bg-stone-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top KPIs Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 md:px-6 bg-[#171412] border-b border-stone-800/80">
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-3.5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Today's Revenue</span>
            <div className="text-xl font-bold font-mono text-amber-300 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-3.5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Active Kitchen Orders</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{activeOrdersCount} in progress</div>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-3.5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Table Bookings</span>
            <div className="text-xl font-bold font-mono text-blue-400 mt-1">{confirmedReservationsCount} Reserved</div>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-3.5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Roastery Hotline</span>
            <div className="text-sm font-bold font-mono text-stone-300 mt-1">+91 8920608191</div>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#12100e]">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by order ID, customer name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {['all', 'Confirmed', 'Preparing', 'Ready', 'Completed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                        orderFilter === st
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200'
                      }`}
                    >
                      {st === 'all' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-stone-900/30 rounded-2xl border border-stone-800">
                  <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <p className="text-stone-400 font-medium">No orders found matching your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-stone-900/70 border border-stone-800 hover:border-amber-700/50 rounded-2xl p-5 transition space-y-4 shadow-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-amber-400">#{ord.id}</span>
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${statusColors[ord.status] || 'bg-stone-800 text-stone-300'}`}>
                              {ord.status}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-stone-100 mt-1">{ord.customerName}</h4>
                          <p className="text-xs text-stone-400 font-mono">{ord.phone} • {ord.time}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-stone-500 uppercase tracking-wider block">Total Amount</span>
                          <span className="text-lg font-bold font-mono text-amber-300">₹{ord.totalAmount}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-stone-950/60 rounded-xl p-3 border border-stone-800/80 text-xs space-y-1.5">
                        {ord.items?.map((it, i) => (
                          <div key={i} className="flex justify-between text-stone-300">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="font-mono text-stone-400">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Status Update & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-stone-400">Change Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-stone-800 border border-stone-700 text-xs font-medium text-amber-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <button
                          onClick={() => sendWhatsAppUpdate(ord)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Notify Customer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RESERVATIONS TAB */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-stone-200">Table Bookings & VIP Lounges</h3>
                <span className="text-xs text-stone-400">{reservations.length} Total Reservations</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-stone-900/70 border border-stone-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs text-amber-400 font-bold">#{res.id}</span>
                        <h4 className="text-base font-bold text-stone-100">{res.name}</h4>
                        <p className="text-xs text-stone-400">{res.phone}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        res.status === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800/80 text-xs space-y-1">
                      <div className="flex justify-between text-stone-300">
                        <span className="text-stone-400">Date & Time:</span>
                        <span className="font-semibold text-amber-200">{res.date} at {res.time}</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span className="text-stone-400">Guests:</span>
                        <span>{res.guests} Guests</span>
                      </div>
                      <div className="flex justify-between text-stone-300">
                        <span className="text-stone-400">Assigned:</span>
                        <span className="text-emerald-400 font-semibold">{res.tableNo || 'Table #4 (Courtyard)'}</span>
                      </div>
                      {res.specialRequest && (
                        <div className="pt-2 text-stone-400 border-t border-stone-800 mt-2">
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">Special Note</span>
                          "{res.specialRequest}"
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {res.status !== 'Confirmed' ? (
                        <button
                          onClick={() => onUpdateReservationStatus(res.id, 'Confirmed')}
                          className="flex-1 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition"
                        >
                          Confirm Booking
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateReservationStatus(res.id, 'Completed')}
                          className="flex-1 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition"
                        >
                          Mark Seated
                        </button>
                      )}
                      <a
                        href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${res.name}, Aura Artisan Café confirming your table reservation on ${res.date} at ${res.time}. Looking forward to hosting you!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition"
                        title="WhatsApp Guest"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MENU INVENTORY TAB */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-stone-200">Menu Availability & Stock Control</h3>
                <span className="text-xs text-stone-400">{menuItems.length} Signature Items</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-stone-900/60 border border-stone-800 rounded-2xl"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-700/60"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-200 truncate">{item.name}</h4>
                      <p className="text-[11px] text-stone-400 font-mono">₹{item.price} • {item.category}</p>
                      <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-semibold ${
                        item.inStock !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {item.inStock !== false ? 'In Stock' : 'Sold Out'}
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleItemStock(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        item.inStock !== false
                          ? 'bg-stone-800 hover:bg-rose-950/40 text-stone-300 hover:text-rose-400 border border-stone-700'
                          : 'bg-emerald-600 text-stone-950 font-bold'
                      }`}
                    >
                      {item.inStock !== false ? 'Set Sold Out' : 'Restock'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6">
                <h3 className="text-lg font-serif font-bold text-amber-200 mb-2">Performance & Conversion Metrics</h3>
                <p className="text-xs text-stone-400 max-w-xl mb-6">
                  Real-time conversion metrics tracking digital orders, table bookings, and barista AI interactions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
                    <span className="text-xs text-stone-400">Total Orders Logged</span>
                    <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{orders.length}</p>
                    <span className="text-[11px] text-emerald-400 mt-1 block">↑ 18% from last week</span>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
                    <span className="text-xs text-stone-400">Average Order Value</span>
                    <p className="text-2xl font-bold font-mono text-amber-400 mt-1">
                      ₹{orders.length ? Math.round(totalRevenue / orders.length) : 0}
                    </p>
                    <span className="text-[11px] text-stone-400 mt-1 block">Artisan coffee combos</span>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
                    <span className="text-xs text-stone-400">AI Barista Recommendations</span>
                    <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">84%</p>
                    <span className="text-[11px] text-emerald-400 mt-1 block">Accepted into cart</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
