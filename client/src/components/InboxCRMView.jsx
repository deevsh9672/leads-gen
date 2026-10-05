import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Tag, 
  TrendingUp,
  RefreshCw,
  CornerDownRight,
  ShieldAlert,
  MessageCircle,
  ExternalLink,
  Phone
} from 'lucide-react';
import { simulateReply, updateProspect } from '../api';

export default function InboxCRMView({ 
  logs, 
  prospects, 
  onRefreshData, 
  preselectedLog 
}) {
  const [selectedLogId, setSelectedLogId] = useState(
    preselectedLog?.id || logs.find(l => l.reply_received === 'yes')?.id || logs[0]?.id || ''
  );
  const [simText, setSimText] = useState(
    "Namaste Devesh ji, demo website dekhi bohot achi lagi! Kya charges hain isko hamare domain par live karne ke?"
  );
  const [processing, setProcessing] = useState(false);
  const [suggestedDraft, setSuggestedDraft] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // all, replied, client, opt-out

  const currentLog = logs.find(l => l.id === selectedLogId) || logs[0];
  const linkedProspect = prospects.find(p => p.id === currentLog?.prospect_id);

  // Pre-baked quick reply simulation templates (Hinglish for Indian local businesses)
  const SIMULATION_PRESETS = [
    {
      label: 'Positive & Claim Demo',
      sentiment: 'positive',
      text: "Bhai website dekhi, bohot badiya lagi! Isme humara actual menu aur photos kaise lagwayein?"
    },
    {
      label: 'Price & Package Inquiry',
      sentiment: 'pricing',
      text: "Namaste Devesh ji, demo pasand aaya. Total cost kitna aayega website setup aur domain ka?"
    },
    {
      label: 'Ready to Sign Deal',
      sentiment: 'client-ready',
      text: "Deal done bhai! Invoice aur payment details bhejo, hume ye 3D website launch karni hai."
    },
    {
      label: 'CAN-SPAM / Opt-Out',
      sentiment: 'opt-out',
      text: "Please hume koi aur message mat bhejo. Unsubscribe."
    }
  ];

  const handleSimulate = async (customReplyText) => {
    if (!currentLog) return;
    setProcessing(true);
    try {
      const textToUse = customReplyText || simText;
      const res = await simulateReply({
        logId: currentLog.id,
        replyText: textToUse
      });
      setSuggestedDraft(res.data.suggestedResponse);
      if (onRefreshData) onRefreshData();
      alert(`Reply processed! Detected Sentiment: "${res.data.sentiment.toUpperCase()}" -> Prospect status updated to: "${res.data.prospect?.status}"`);
    } catch (err) {
      alert('Error simulating reply: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAsClient = async () => {
    if (!linkedProspect) return;
    try {
      await updateProspect(linkedProspect.id, { status: 'client' });
      alert(`🎉 Congratulations! ${linkedProspect.business_name} marked as signed client!`);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Filter logs for inbox view
  const repliedLogs = logs.filter(l => l.reply_received === 'yes');

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-teal-400" />
            <span>Reply Intelligence & Agency CRM (Skill 7)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitors Gmail, classifies response sentiment, suggests closing follow-ups, and tracks clients.
          </p>
        </div>

        <button
          onClick={onRefreshData}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Main Grid: Inbox Feed (5 cols) + Reply Inspector & AI Assistant (7 cols) */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Inbox Conversations List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">Dispatched Outreach & Threads</h3>
            <span className="text-[11px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full">
              {repliedLogs.length} Replies Received
            </span>
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No outreach emails dispatched yet.
              </div>
            ) : (
              logs.map((l) => {
                const isSelected = l.id === selectedLogId;
                const hasReplied = l.reply_received === 'yes';

                return (
                  <div
                    key={l.id}
                    onClick={() => setSelectedLogId(l.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-indigo-950/40 border-indigo-500 text-white' 
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs truncate max-w-[170px]">{l.prospect_name || 'Prospect'}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        l.reply_sentiment === 'client-ready' ? 'bg-emerald-500/20 text-emerald-400' :
                        l.reply_sentiment === 'positive' ? 'bg-teal-500/20 text-teal-400' :
                        l.reply_sentiment === 'pricing' ? 'bg-indigo-500/20 text-indigo-400' :
                        l.reply_sentiment === 'opt-out' ? 'bg-rose-500/20 text-rose-400' :
                        hasReplied ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {l.reply_sentiment || (hasReplied ? 'Replied' : 'Sent')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate">
                      {hasReplied ? `💬 "${l.reply_text}"` : `✉️ ${l.email_subject}`}
                    </div>

                    <div className="text-[10px] text-slate-500 mt-2 flex items-center justify-between">
                      <span>{l.recipient_email}</span>
                      <span>{new Date(l.sent_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Reply Inspector & AI Assistant (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {currentLog ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              
              {/* Thread Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span>{currentLog.prospect_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300">
                      Status: {linkedProspect?.status || 'contacted'}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Demo sent: <a href={currentLog.demo_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">{currentLog.demo_url}</a>
                  </div>
                </div>

                {linkedProspect?.status !== 'client' && (
                  <button
                    onClick={handleMarkAsClient}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Convert to Signed Client ($499)</span>
                  </button>
                )}
              </div>

              {/* Received Reply Content */}
              {currentLog.reply_received === 'yes' ? (
                <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-400 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      Received Lead Response:
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold uppercase text-[10px]">
                      Intent: {currentLog.reply_sentiment || 'Interested'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 font-medium italic">
                    "{currentLog.reply_text}"
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400">
                  No reply received yet for this lead. Use the simulator below to test AI sentiment analysis & auto-response generation!
                </div>
              )}

              {/* AI Suggested Response */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    AI Superagent Closing Response
                  </h4>
                  {suggestedDraft && (
                    <span className="text-[10px] text-emerald-400 font-semibold">Ready to dispatch</span>
                  )}
                </div>

                <textarea
                  rows="5"
                  value={suggestedDraft || (currentLog.reply_received === 'yes' ? "Namaste team, bohot accha laga sunkar ki aapko demo pasand aayi! Chaliye discuss karte hain aapke custom domain par launch karne ke liye." : "Select or simulate a reply below to generate an AI response...")}
                  onChange={(e) => setSuggestedDraft(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lead Phone: <strong className="text-white font-mono">{linkedProspect?.phone || currentLog?.recipient_phone || '8920608191'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        let phone = (linkedProspect?.phone || currentLog?.recipient_phone || '8920608191').replace(/[^0-9]/g, '');
                        if (phone.length === 10 && ['6', '7', '8', '9'].includes(phone[0])) phone = '91' + phone;
                        if (!phone) phone = '918920608191';
                        const textToSend = suggestedDraft || "Namaste team, aapki demo website ready hai!";
                        const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(textToSend)}`;
                        window.open(waUrl, '_blank');
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send WhatsApp Reply (Hinglish)</span>
                    </button>

                    <button
                      onClick={() => alert(`Email reply queued for ${currentLog.recipient_email}!`)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Email</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulation Testing Suite */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">🧪 Simulate Incoming Lead Reply (Skill 7 Test)</span>
                  <span className="text-[11px] text-slate-500">Pick scenario or type below</span>
                </div>

                {/* Preset Scenarios */}
                <div className="grid grid-cols-2 gap-2">
                  {SIMULATION_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSimulate(preset.text)}
                      disabled={processing}
                      className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left text-xs transition group"
                    >
                      <div className="font-bold text-indigo-300 group-hover:text-white flex items-center justify-between">
                        <span>{preset.label}</span>
                        <CornerDownRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        "{preset.text}"
                      </div>
                    </button>
                  ))}
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              Select an outreach log from the left to inspect replies.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
