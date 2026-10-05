import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight,
  Phone,
  Mail,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CAFE_INFO } from './cafeData';

export default function ReservationSection({ onNewReservation }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: 'Today',
    time: '7:30 PM',
    guests: 2,
    tableArea: 'Outdoor Garden Patio',
    specialRequest: ''
  });

  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const timeSlots = [
    '8:30 AM', '10:00 AM', '11:30 AM', '1:00 PM', 
    '3:30 PM', '5:00 PM', '7:00 PM', '8:30 PM', '9:30 PM'
  ];

  const tableAreas = [
    'Outdoor Garden Patio',
    'Indoor Cozy AC Lounge',
    'Work-Friendly High Table',
    'Romantic Candlelight Corner'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const resId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRes = {
      id: resId,
      customerName: formData.name,
      phone: formData.phone,
      email: formData.email,
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
      tableArea: formData.tableArea,
      specialRequest: formData.specialRequest,
      status: 'Confirmed'
    };

    setTimeout(() => {
      setSubmitting(false);
      setConfirmedReservation(newRes);
      if (onNewReservation) {
        onNewReservation(newRes);
      }

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  const getWhatsAppConfirmLink = () => {
    if (!confirmedReservation) return '#';
    const msg = `Hi ${CAFE_INFO.name}! 👋 I have placed table reservation #${confirmedReservation.id} for ${confirmedReservation.guests} guests on ${confirmedReservation.date} at ${confirmedReservation.time} (${confirmedReservation.tableArea}). Name: ${confirmedReservation.customerName}. Please confirm!`;
    return `https://wa.me/${CAFE_INFO.whatsapp}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="reservation" className="py-24 bg-slate-950 text-white relative">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Atmospheric Story & Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
              <span>Table Reservations</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
              Reserve Your Table for Thoughtful Moments.
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
              Whether you’re catching up over flat whites, working through a project, or celebrating over artisanal dinner, our tables are prepared with candlelight and care.
            </p>

            <div className="space-y-4 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">Guaranteed Seating</div>
                  <div className="text-[11px] text-slate-400">Held for 20 minutes past booking time</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <Users className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-white">Large Parties & Events</div>
                  <div className="text-[11px] text-slate-400">For parties of 8+, our manager will coordinate on WhatsApp</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Reservation Form / Success Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 border border-amber-900/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
              
              <AnimatePresence mode="wait">
                {confirmedReservation ? (
                  /* Success Confirmation Screen */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6 space-y-6"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 text-2xl">
                      ☕
                    </div>

                    <div>
                      <h3 className="text-2xl font-serif font-bold text-white">
                        Your Table is Reserved!
                      </h3>
                      <p className="text-xs text-amber-300 mt-1 font-semibold">
                        Reservation #{confirmedReservation.id}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2 max-w-sm mx-auto text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Guest Name:</span>
                        <strong className="text-white">{confirmedReservation.customerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Party Size:</span>
                        <strong className="text-white">{confirmedReservation.guests} Guests</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date & Time:</span>
                        <strong className="text-amber-400">{confirmedReservation.date} at {confirmedReservation.time}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Seating Area:</span>
                        <strong className="text-white">{confirmedReservation.tableArea}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <a
                        href={getWhatsAppConfirmLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send WhatsApp Confirmation</span>
                      </a>

                      <button
                        onClick={() => setConfirmedReservation(null)}
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs transition"
                      >
                        Book Another Table
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Form */
                  <form key="form" onSubmit={handleSubmit} className="space-y-5 text-xs">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                        Book Your Table
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Instant reservation confirmation with zero deposit required.
                      </p>
                    </div>

                    {/* Name, Phone, Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Your Full Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="Ananya Sharma"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Phone Number *</label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            placeholder="+91 98290 12345"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Date, Time, Guests */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Date *</label>
                        <select
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="Today">Today</option>
                          <option value="Tomorrow">Tomorrow</option>
                          <option value="This Friday">This Friday</option>
                          <option value="This Saturday">This Saturday</option>
                          <option value="This Sunday">This Sunday</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Time Slot *</label>
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                        >
                          {timeSlots.map((ts) => (
                            <option key={ts} value={ts}>{ts}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold mb-1">Guests *</label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 2 })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((g) => (
                            <option key={g} value={g}>{g} {g === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Seating Preference */}
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Preferred Seating Area</label>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {tableAreas.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => setFormData({ ...formData, tableArea: area })}
                            className={`p-2.5 rounded-xl border text-left text-xs font-medium transition ${
                              formData.tableArea === area
                                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Special Request */}
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Special Requests (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Birthday celebration, corner table, high chairs..."
                        value={formData.specialRequest}
                        onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <CalendarDays className="w-4 h-4" />
                      <span>{submitting ? 'Confirming Table...' : 'Reserve My Table'}</span>
                    </button>

                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
