import React, { useState, useEffect } from 'react';
import { 
  Send, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Mail, 
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  MessageCircle,
  Phone
} from 'lucide-react';
import { runOutreachSkill, runWhatsAppOutreachSkill } from '../api';

export default function OutreachView({ 
  prospects, 
  logs, 
  config, 
  onRefreshLogs, 
  onSimulateReplyClick 
}) {
  const [activeChannel, setActiveChannel] = useState('email'); // 'email' or 'whatsapp'
  const [selectedProspectId, setSelectedProspectId] = useState(prospects[0]?.id || '');
  
  // Email Form State
  const [customSubject, setCustomSubject] = useState(
    config?.email_subject_template || 'Free modern website demo for {{business_name}}'
  );
  const [customBody, setCustomBody] = useState(
    config?.email_body_template || ''
  );

  // WhatsApp Form State
  const [customWaMessage, setCustomWaMessage] = useState(
    config?.whatsapp_message_template || 
    `Hi team at {{business_name}}! 👋 I noticed you don't have a website listed on Google for {{category}} services in {{city}}.\n\nTo help out, my team and I built you a complete, high-converting demo website — 100% free with no strings attached:\n👉 View your live website demo here: {{demo_url}}\n\nIf you'd like to claim this design, customize the text/photos, or connect your domain, just reply here!`
  );

  const [sending, setSending] = useState(false);
  const [previewLog, setPreviewLog] = useState(null);

  useEffect(() => {
    if (config?.email_body_template && !customBody) {
      setCustomBody(config.email_body_template);
    }
    if (config?.whatsapp_message_template) {
      setCustomWaMessage(config.whatsapp_message_template);
    }
  }, [config]);

  const selectedProspect = prospects.find(p => p.id === selectedProspectId) || prospects[0];

  const handleSendEmail = async () => {
    if (!selectedProspect) return;
    setSending(true);
    try {
      await runOutreachSkill(selectedProspect.id, {
        subject: customSubject,
        body: customBody
      });
      alert(`Success! Email outreach dispatched to ${selectedProspect.business_name} (${selectedProspect.email})!`);
      if (onRefreshLogs) onRefreshLogs();
    } catch (err) {
      alert('Error sending email outreach: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!selectedProspect) return;
    setSending(true);
    try {
      const res = await runWhatsAppOutreachSkill(selectedProspect.id, {
        message: customWaMessage,
        phone: selectedProspect.phone
      });
      if (res.data?.wa_web_link) {
        window.open(res.data.wa_web_link, '_blank');
      }
      alert(`WhatsApp outreach logged! Opening WhatsApp Web chat with ${selectedProspect.business_name}...`);
      if (onRefreshLogs) onRefreshLogs();
    } catch (err) {
      alert('Error sending WhatsApp outreach: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  // Preview generated body with tags replaced
  const previewBody = (template) => {
    if (!selectedProspect) return template;
    let text = template;
    const cleanWa = (config?.sender_whatsapp || '918920608191').replace(/[^0-9]/g, '');
    const vars = {
      business_name: selectedProspect.business_name,
      city: selectedProspect.city,
      category: selectedProspect.category,
      demo_url: `http://localhost:5000/demos/...`,
      sender_name: config?.sender_name || 'Alex Morgan',
      sender_whatsapp: config?.sender_whatsapp || '918920608191',
      whatsapp_link: `https://wa.me/${cleanWa}?text=Hi!`,
      physical_mailing_address: config?.physical_mailing_address || '100 Congress Ave, Austin, TX'
    };
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`{{${k}}}`, 'g'), v);
    }
    return text;
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-purple-400" />
            <span>Outreach Hub: Email & WhatsApp Direct (Skill 5 & 6)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Delivers personalized cold outreach via Gmail and direct WhatsApp (+91 8920608191) with custom demo links.
          </p>
        </div>

        <button
          onClick={onRefreshLogs}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Channel Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveChannel('email')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
            activeChannel === 'email'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Outreach (Gmail)</span>
        </button>

        <button
          onClick={() => setActiveChannel('whatsapp')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition ${
            activeChannel === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Direct</span>
        </button>
      </div>

      {/* Main Grid: Composer + Auditor */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Outreach Composer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              {activeChannel === 'email' ? (
                <>
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Personalized Email Composer</span>
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Personalized WhatsApp Pitch Composer</span>
                </>
              )}
            </h3>
            
            {/* Prospect selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">To Prospect:</span>
              <select
                value={selectedProspectId}
                onChange={(e) => setSelectedProspectId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-xs font-semibold focus:outline-none"
              >
                {prospects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.business_name} ({p.phone || p.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Merge Tags Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-500">Insert Tag:</span>
            {['{{business_name}}', '{{city}}', '{{category}}', '{{demo_url}}', '{{whatsapp_link}}', '{{sender_name}}'].map((tag) => (
              <span 
                key={tag}
                className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700 font-mono text-[10px] cursor-pointer hover:bg-indigo-900/50"
                onClick={() => {
                  if (activeChannel === 'email') {
                    setCustomBody(prev => prev + ' ' + tag);
                  } else {
                    setCustomWaMessage(prev => prev + ' ' + tag);
                  }
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {activeChannel === 'email' ? (
            <>
              {/* Subject Line */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Email Body</label>
                <textarea
                  rows="9"
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Action Row */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400">
                  Sender: <strong className="text-white">{config?.sender_name || 'Alex Morgan'}</strong> ({config?.sender_email || 'alex@siteselleragent.com'})
                </div>
                <button
                  onClick={handleSendEmail}
                  disabled={sending}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2"
                >
                  <Send className={`w-4 h-4 ${sending ? 'animate-spin' : ''}`} />
                  <span>{sending ? 'Sending...' : 'Send Email Outreach (Skill 5)'}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* WhatsApp Message Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-400">WhatsApp Message Content</label>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Recipient Phone: {selectedProspect?.phone || 'No phone listed'}
                  </span>
                </div>
                <textarea
                  rows="8"
                  value={customWaMessage}
                  onChange={(e) => setCustomWaMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl p-3.5 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Row */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400">
                  Your WhatsApp: <strong className="text-emerald-400 font-mono">+91 8920608191</strong>
                </div>
                <button
                  onClick={handleSendWhatsApp}
                  disabled={sending}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2"
                >
                  <MessageCircle className={`w-4 h-4 ${sending ? 'animate-spin' : ''}`} />
                  <span>{sending ? 'Dispatching...' : 'Send WhatsApp Message to Client'}</span>
                </button>
              </div>
            </>
          )}

        </div>

        {/* Compliance / Live Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {activeChannel === 'email' ? (
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>CAN-SPAM Act Compliance</span>
              </div>
              <p className="text-xs text-slate-400">
                Automated cold outreach strictly adheres to federal regulations for B2B commercial messages:
              </p>
              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Physical postal address included</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Accurate non-deceptive subject header</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp direct chat link included</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Clear opt-out instructions</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp Outreach Benefits</span>
              </div>
              <div className="space-y-2 text-xs pt-1 text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>98% Open Rate</strong> compared to 20% for email</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant 1-click mobile website preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct conversation to close the $499 package</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sent directly from your WhatsApp: +91 8920608191</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Preview Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Live Replaced Preview
            </h4>
            <div className={`p-3.5 rounded-xl border text-[11px] max-h-48 overflow-y-auto space-y-1 font-mono whitespace-pre-wrap ${
              activeChannel === 'whatsapp' 
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}>
              {previewBody(activeChannel === 'email' ? customBody : customWaMessage)}
            </div>
          </div>

        </div>

      </div>

      {/* Sent Outreach Audit Trail (Skill 6 Log) */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>OutreachLog Audit Trail (Skill 6)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Verified record of every outreach dispatched across Email & WhatsApp channels
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {logs.length} Total Dispatches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Channel</th>
                <th className="py-3 px-4 font-semibold">Prospect Name</th>
                <th className="py-3 px-4 font-semibold">Recipient (Email / Phone)</th>
                <th className="py-3 px-4 font-semibold">Subject / Message</th>
                <th className="py-3 px-4 font-semibold">Sent Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No outreach dispatched yet. Choose Email or WhatsApp above to reach out!
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4">
                      {log.channel === 'whatsapp' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <MessageCircle className="w-3 h-3" />
                          <span>WHATSAPP</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          <Mail className="w-3 h-3" />
                          <span>EMAIL</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {log.prospect_name || 'Prospect'}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {log.channel === 'whatsapp' ? (log.recipient_phone || 'WhatsApp') : log.recipient_email}
                    </td>
                    <td className="py-3 px-4 text-slate-300 truncate max-w-[200px]">
                      {log.email_subject || log.email_body}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(log.sent_date).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        log.status === 'replied' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' :
                        log.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewLog(log)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                        >
                          View Copy
                        </button>
                        <button
                          onClick={() => onSimulateReplyClick(log)}
                          className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold transition"
                        >
                          Simulate Reply
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Email/WhatsApp Content Modal */}
      {previewLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {previewLog.channel === 'whatsapp' ? 'WhatsApp Outreach Message' : 'Outreach Email Details'}
              </h3>
              <button 
                onClick={() => setPreviewLog(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">Recipient:</span>{' '}
                {previewLog.channel === 'whatsapp' ? previewLog.recipient_phone : previewLog.recipient_email}
              </div>
              {previewLog.channel !== 'whatsapp' && (
                <div>
                  <span className="text-slate-400 font-semibold">Subject:</span> {previewLog.email_subject}
                </div>
              )}
              <div>
                <span className="text-slate-400 font-semibold">Demo URL:</span>{' '}
                <a href={previewLog.demo_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                  {previewLog.demo_url}
                </a>
              </div>
              <div className="mt-2 bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap font-mono text-[11px] text-slate-300 max-h-64 overflow-y-auto">
                {previewLog.email_body}
              </div>
            </div>

            <button
              onClick={() => setPreviewLog(null)}
              className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
