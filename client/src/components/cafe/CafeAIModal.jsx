import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Coffee, 
  Croissant, 
  Cake, 
  Salad, 
  Flame, 
  Star,
  ShoppingBag,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { CAFE_INFO, MENU_ITEMS } from './cafeData';

const INITIAL_MESSAGES = [
  {
    sender: 'ai',
    text: `Hello! I'm Café AI, your personal barista & culinary guide at ${CAFE_INFO.name}. How can I delight your palate today?`,
    time: 'Just now'
  }
];

const QUICK_PROMPTS = [
  { label: '☕ Best Coffee', prompt: 'What is your best coffee for a purist?' },
  { label: '🥐 Breakfast Pairing', prompt: 'Recommend a warm morning breakfast combo' },
  { label: '🍰 Light Sweet', prompt: 'I want something sweet but not too heavy' },
  { label: '🥗 Pure Veg Picks', prompt: 'What are your top vegetarian chef specialties?' },
  { label: '📚 Study Fuel', prompt: 'Best coffee to help me focus and work on my laptop' },
  { label: '❤️ First Date', prompt: 'Best romantic pairing for two guests on a date' }
];

export default function CafeAIModal({ isOpen, onClose, onAddToCart, onShowToast }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAIResponse = (userText) => {
    const q = userText.toLowerCase();

    // 1. Sweet but not heavy
    if (q.includes('sweet') && (q.includes('heavy') || q.includes('light') || q.includes('not too'))) {
      const item1 = MENU_ITEMS.find(m => m.id === 'd1'); // Basque Cheesecake
      const item2 = MENU_ITEMS.find(m => m.id === 'c2'); // Pistachio latte
      return {
        text: `Try our Burnt Basque Cheesecake with Blueberry Compote paired with a Spanish Pistachio Iced Latte. It offers an ultra-creamy yet refreshingly tart balance without feeling overly heavy!`,
        recommendedItems: [item1, item2].filter(Boolean)
      };
    }

    // 2. Study / Focus / Laptop
    if (q.includes('study') || q.includes('focus') || q.includes('work') || q.includes('laptop')) {
      const item1 = MENU_ITEMS.find(m => m.id === 'c4'); // Cascara Nitro Cold Brew
      const item2 = MENU_ITEMS.find(m => m.id === 'c1'); // Ethiopian Pour-over
      return {
        text: `For long focus and laptop sessions, our 18-hour Cascara Nitro Cold Brew or Single-Origin Ethiopian Pour-Over are unbeatable. High clarity, zero sugar crash, and we have dedicated power outlets and high-speed fiber WiFi!`,
        recommendedItems: [item1, item2].filter(Boolean)
      };
    }

    // 3. First Date / Romantic
    if (q.includes('date') || q.includes('romantic') || q.includes('two') || q.includes('couple')) {
      const item1 = MENU_ITEMS.find(m => m.id === 'm1'); // Truffle Tagliatelle
      const item2 = MENU_ITEMS.find(m => m.id === 'd2'); // Tiramisu
      const item3 = MENU_ITEMS.find(m => m.id === 'c2'); // Pistachio latte
      return {
        text: `For a memorable date, I recommend reserving our outdoor courtyard table. Share our Wild Mushroom & Black Truffle Tagliatelle, followed by two artisan lattes and the Classic Espresso Tiramisu to finish!`,
        recommendedItems: [item1, item2, item3].filter(Boolean)
      };
    }

    // 4. Coffee purist / Best coffee
    if (q.includes('coffee') || q.includes('roast') || q.includes('pour-over') || q.includes('espresso')) {
      const item1 = MENU_ITEMS.find(m => m.id === 'c1');
      const item2 = MENU_ITEMS.find(m => m.id === 'c3');
      return {
        text: `Our pride is the Single-Origin Ethiopian Yirgacheffe Pour-Over. It yields delicate floral jasmine and citrus notes. If you prefer milk coffee, our Velvet Flat White is brewed with double ristretto precision.`,
        recommendedItems: [item1, item2].filter(Boolean)
      };
    }

    // 5. Breakfast
    if (q.includes('breakfast') || q.includes('morning') || q.includes('croissant') || q.includes('egg')) {
      const item1 = MENU_ITEMS.find(m => m.id === 'b1'); // Truffle eggs
      const item2 = MENU_ITEMS.find(m => m.id === 'b2'); // Almond croissant
      return {
        text: `Our morning crowd favorite is the Truffle Scrambled Brioche Toast paired with a hot Almond Twice-Baked Croissant straight out of the ovens at 8:00 AM!`,
        recommendedItems: [item1, item2].filter(Boolean)
      };
    }

    // 6. Vegetarian / Healthy
    if (q.includes('veg') || q.includes('healthy') || q.includes('salad') || q.includes('matcha')) {
      const item1 = MENU_ITEMS.find(m => m.id === 'b3'); // Avocado tartine
      const item2 = MENU_ITEMS.find(m => m.id === 't1'); // Ceremonial matcha
      return {
        text: `Over 85% of our menu is 100% pure vegetarian! We recommend our Smoked Hass Avocado & Burrata Tartine alongside a hot Ceremonial Uji Matcha Latte with almond milk.`,
        recommendedItems: [item1, item2].filter(Boolean)
      };
    }

    // 7. Location & Hours
    if (q.includes('location') || q.includes('where') || q.includes('address') || q.includes('time') || q.includes('hour') || q.includes('open')) {
      return {
        text: `We are located at Plot 14, C-Scheme, Ashok Nagar, Jaipur. We are open every single day from 8:00 AM to 11:30 PM with indoor AC and garden terrace seating!`,
        recommendedItems: []
      };
    }

    // 8. General / Bestseller fallback
    const item1 = MENU_ITEMS.find(m => m.id === 'c2');
    const item2 = MENU_ITEMS.find(m => m.id === 'm1');
    return {
      text: `Based on our Jaipur regulars, our #1 signature order is the Spanish Pistachio Iced Latte and the Wild Mushroom Truffle Pasta. Would you like to add one to your cart?`,
      recommendedItems: [item1, item2].filter(Boolean)
    };
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: query,
      time: 'Now'
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiReply = generateAIResponse(query);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply.text,
          recommendedItems: aiReply.recommendedItems,
          time: 'Now'
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleCartAddFromAI = (item) => {
    onAddToCart(item, 1);
    if (onShowToast) {
      onShowToast(`Added "${item.name}" from AI recommendation!`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg h-[85vh] sm:h-[650px] bg-slate-900 border border-amber-900/40 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
      >
        {/* Chat Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-amber-950/60 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">Café AI</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                  Sommelier
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Menu-Aware Flavor & Pairing Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-amber-950/60 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-700/50 text-[10px] font-medium whitespace-nowrap transition flex items-center gap-1"
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-tr-none shadow-md shadow-amber-600/20'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-sm'
                }`}
              >
                <p>{msg.text}</p>

                {/* Embedded Product Recommendations */}
                {msg.recommendedItems && msg.recommendedItems.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-700/50">
                    <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      Recommended Pairings:
                    </div>
                    {msg.recommendedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-bold text-white text-[11px] line-clamp-1">{item.name}</div>
                            <div className="text-amber-400 font-bold text-[10px]">
                              {CAFE_INFO.currency}{item.price}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCartAddFromAI(item)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow transition"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-[9px] text-slate-500 mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}

          {/* Typing Animation Bubble */}
          {isTyping && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 px-4 py-3 rounded-2xl rounded-tl-none w-20">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. coffee for studying, date night)..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white disabled:opacity-40 transition shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </motion.div>
    </div>
  );
}
