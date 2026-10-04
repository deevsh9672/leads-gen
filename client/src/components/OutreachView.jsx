import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { runOutreachSkill } from '../api';

export default function OutreachView({ 
  prospects, 
  logs, 
  config, 
  onRefreshLogs, 
  onSimulateReplyClick 
}) {
  const [selectedProspectId, setSelectedProspectId] = useState(prospects[0]?.id || '');
  const [customSubject, setCustomSubject] = useState(
    config?.email_subject_template || 'Free modern website demo for {{business_name}}'
  );
  const [customBody, setCustomBody] = useState(
    config?.email_body_template || ''
  );
  const [sending, setSending] = useState(false);
  const [previewLog, setPreviewLog] = useState(null);

  const selectedProspect = prospects.find(p => p.id === selectedProspectId) || prospects[0];

  const handleSendSingle = async () => {
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
      alert('Error sending outreach: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  // Preview generated body with tags replaced
  const previewBody = () => {
    if (!selectedProspect) return customBody;
    let text = customBody;
    const vars = {
      business_name: selectedProspect.business_name,
      city: selectedProspect.city,
      category: selectedProspect.category,
      demo_url: `http://localhost:5000/demos/...`,
      sender_name: config?.sender_name || 'Alex Morgan',
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
            <span>Outreach & CAN-SPAM Compliance Center</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Delivers personalized cold emails with custom demo links and one clear call-to-action (Skill 5 & 6).
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

      {/* Main Grid: Composer + CAN-SPAM Auditor */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Email Composer (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Personalized Outreach Composer</span>
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
                    {p.business_name} ({p.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Merge Tags Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-500">Insert Tag:</span>
            {['{{business_name}}', '{{city}}', '{{category}}', '{{demo_url}}', '{{whatsapp_link}}', '{{sender_name}}', '{{sender_whatsapp}}'].map((tag) => (
              <span 
                key={tag}
                className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700 font-mono text-[10px] cursor-pointer hover:bg-indigo-900/50"
                onClick={() => setCustomBody(prev => prev + ' ' + tag)}
              >
                {tag}
              </span>
            ))}
          </div>

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
              onClick={handleSendSingle}
              disabled={sending}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2"
            >
              <Send className={`w-4 h-4 ${sending ? 'animate-spin' : ''}`} />
              <span>{sending ? 'Sending...' : 'Send Outreach Email (Skill 5)'}</span>
            </button>
          </div>
        </div>

        {/* CAN-SPAM Compliance & Live Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CAN-SPAM Card */}
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
                <span>Clear opt-out / unsubscribe mechanism</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Legitimate sender domain & reply inbox</span>
              </div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 mt-2">
              <strong>Your CAN-SPAM Address:</strong><br />
              {config?.physical_mailing_address || '100 Congress Ave, Suite 2000, Austin, TX 78701'}
            </div>
          </div>

          {/* Quick Preview Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">
              Interpolated Preview
            </h4>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 max-h-48 overflow-y-auto space-y-1 font-mono whitespace-pre-wrap">
              {previewBody()}
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
              Verified record of every outreach email sent, recipient address, delivery status, and demo URL
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {logs.length} Total Logs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Prospect Name</th>
                <th className="py-3 px-4 font-semibold">Recipient Email</th>
                <th className="py-3 px-4 font-semibold">Subject</th>
                <th className="py-3 px-4 font-semibold">Sent Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    No outreach emails logged yet. Click "Send Outreach Email" or run an Autonomous Cycle!
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-bold text-white">
                      {log.prospect_name || 'Prospect'}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {log.recipient_email}
                    </td>
                    <td className="py-3 px-4 text-slate-300 truncate max-w-[200px]">
                      {log.email_subject}
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
                          View Email
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

      {/* View Email Content Modal */}
      {previewLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Outreach Email Details</h3>
              <button 
                onClick={() => setPreviewLog(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">To:</span> {previewLog.recipient_email}
              </div>
              <div>
                <span className="text-slate-400 font-semibold">Subject:</span> {previewLog.email_subject}
              </div>
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
