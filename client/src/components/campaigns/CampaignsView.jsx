import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Play, 
  Pause, 
  XCircle, 
  RotateCcw, 
  CheckCircle2, 
  Users, 
  Clock, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Eye, 
  Search, 
  CheckCheck,
  Check,
  ChevronRight,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { 
  getCampaigns, 
  saveCampaign, 
  launchCampaign, 
  pauseCampaign, 
  resumeCampaign, 
  cancelCampaign, 
  testSendCampaign, 
  getCampaignRecipients, 
  getProviderTemplates 
} from '../../api';

export default function CampaignsView({ leads, tags, onRefreshAll }) {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [activeRecipientsCampaign, setActiveRecipientsCampaign] = useState(null);
  const [recipientsList, setRecipientsList] = useState([]);
  
  // Wizard Modal State
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardForm, setWizardForm] = useState({
    name: 'Toronto Clinic AI Website Outreach',
    description: 'Broadcast personalized modern demo website link to clinics in Toronto',
    selected_tags: ['Toronto Clinic'],
    selected_status: 'all',
    selected_city: 'Toronto',
    template_id: '',
    template_name: '',
    test_phone: '+91 8920608191'
  });

  const [testSendResult, setTestSendResult] = useState(null);
  const [testSending, setTestSending] = useState(false);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    loadCampaignsData();
  }, []);

  const loadCampaignsData = async () => {
    try {
      const [campRes, tmplRes] = await Promise.all([
        getCampaigns(),
        getProviderTemplates()
      ]);
      setCampaigns(campRes.data);
      setTemplates(tmplRes.data);
      if (tmplRes.data.length > 0 && !wizardForm.template_name) {
        setWizardForm(prev => ({
          ...prev,
          template_id: tmplRes.data[0].id,
          template_name: tmplRes.data[0].name
        }));
      }
    } catch (err) {
      console.error('Error loading campaigns:', err);
    }
  };

  const handleLaunch = async (campaignId) => {
    setLaunching(true);
    try {
      await launchCampaign(campaignId);
      loadCampaignsData();
      alert('Broadcast campaign launched! Batches are now dispatching in the background.');
    } catch (err) {
      alert('Error launching campaign: ' + err.message);
    } finally {
      setLaunching(false);
    }
  };

  const handlePause = async (campaignId) => {
    try {
      await pauseCampaign(campaignId);
      loadCampaignsData();
    } catch (err) {
      alert('Error pausing campaign: ' + err.message);
    }
  };

  const handleResume = async (campaignId) => {
    try {
      await resumeCampaign(campaignId);
      loadCampaignsData();
    } catch (err) {
      alert('Error resuming campaign: ' + err.message);
    }
  };

  const handleCancel = async (campaignId) => {
    if (!confirm('Are you sure you want to cancel this campaign? Pending messages will be cancelled.')) return;
    try {
      await cancelCampaign(campaignId);
      loadCampaignsData();
    } catch (err) {
      alert('Error cancelling campaign: ' + err.message);
    }
  };

  const handleOpenRecipients = async (campaign) => {
    setActiveRecipientsCampaign(campaign);
    try {
      const res = await getCampaignRecipients(campaign.id);
      setRecipientsList(res.data);
    } catch (err) {
      console.error('Error loading recipients:', err);
    }
  };

  // Test Send
  const handleTestSend = async () => {
    if (!wizardForm.test_phone) return;
    setTestSending(true);
    try {
      const res = await testSendCampaign({
        test_phone: wizardForm.test_phone,
        template_id: wizardForm.template_id,
        sample_lead: leads[0]
      });
      setTestSendResult(res.data);
      alert(`Test message successfully sent to ${wizardForm.test_phone}!`);
    } catch (err) {
      alert('Test send failed: ' + err.message);
    } finally {
      setTestSending(false);
    }
  };

  // Wizard Complete & Save Campaign
  const handleCreateCampaignSubmit = async () => {
    try {
      const audienceFilter = {
        tags: wizardForm.selected_tags,
        statuses: wizardForm.selected_status !== 'all' ? [wizardForm.selected_status] : [],
        city: wizardForm.selected_city
      };

      const newCamp = await saveCampaign({
        name: wizardForm.name,
        description: wizardForm.description,
        template_id: wizardForm.template_id,
        template_name: wizardForm.template_name,
        audience_filter: audienceFilter,
        status: 'DRAFT'
      });

      setShowWizard(false);
      setWizardStep(1);
      loadCampaignsData();
      alert(`Campaign "${newCamp.data.name}" created! You can now launch it when ready.`);
    } catch (err) {
      alert('Error creating campaign: ' + err.message);
    }
  };

  // Estimate audience size for wizard
  const estimatedAudienceCount = leads.filter(l => {
    const matchesTag = wizardForm.selected_tags.length === 0 || l.tags?.some(t => wizardForm.selected_tags.includes(t));
    const matchesCity = !wizardForm.selected_city || wizardForm.selected_city === 'all' || l.city.toLowerCase().includes(wizardForm.selected_city.toLowerCase());
    return matchesTag && matchesCity;
  }).length;

  const selectedTemplateObj = templates.find(t => t.id === wizardForm.template_id || t.name === wizardForm.template_name) || templates[0];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-indigo-400" />
            <span>WhatsApp Broadcast & Campaign Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dispatch personalized WhatsApp template messages to hundreds of leads with controlled background queues.
          </p>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New WhatsApp Campaign</span>
        </button>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 gap-4">
        {campaigns.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Broadcast Campaigns Created Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Create your first WhatsApp broadcast campaign targeting Toronto clinics or qualified leads using our 4-step wizard.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition"
            >
              Launch First Campaign
            </button>
          </div>
        ) : (
          campaigns.map((camp) => {
            const stats = camp.stats || {};
            const sentTotal = (stats.sent || 0) + (stats.delivered || 0);
            const deliveryPct = sentTotal > 0 ? Math.round(((stats.delivered || 0) / sentTotal) * 100) : 0;
            const readPct = (stats.delivered || 0) > 0 ? Math.round(((stats.read || 0) / (stats.delivered || 1)) * 100) : 0;

            return (
              <div
                key={camp.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-bold text-base text-white">{camp.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        camp.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                        camp.status === 'IN_PROGRESS' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 animate-pulse' :
                        camp.status === 'PAUSED' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{camp.description || 'Targeted WhatsApp Outreach'}</p>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Template: <span className="font-mono text-indigo-300">{camp.template_name}</span> • Created: {new Date(camp.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {camp.status === 'DRAFT' && (
                      <button
                        onClick={() => handleLaunch(camp.id)}
                        disabled={launching}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Launch Now</span>
                      </button>
                    )}

                    {camp.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handlePause(camp.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </button>
                    )}

                    {camp.status === 'PAUSED' && (
                      <button
                        onClick={() => handleResume(camp.id)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>
                    )}

                    {camp.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleCancel(camp.id)}
                        className="p-2 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 rounded-xl transition"
                        title="Cancel Campaign"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenRecipients(camp)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Logs</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Audience</span>
                    <div className="text-base font-extrabold text-white">{camp.total_recipients || 0}</div>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Delivered</span>
                    <div className="text-base font-extrabold text-emerald-400">
                      {stats.delivered || 0} <span className="text-[10px] text-slate-400 font-normal">({deliveryPct}%)</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Read</span>
                    <div className="text-base font-extrabold text-cyan-400">
                      {stats.read || 0} <span className="text-[10px] text-slate-400 font-normal">({readPct}%)</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Replies</span>
                    <div className="text-base font-extrabold text-purple-400">
                      {stats.replied || 0}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Failed</span>
                    <div className="text-base font-extrabold text-rose-400">
                      {stats.failed || 0}
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Opt-Outs</span>
                    <div className="text-base font-extrabold text-amber-400">
                      {stats.opt_out || 0}
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Recipient Logs Drawer */}
      {activeRecipientsCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Broadcast Delivery Logs</h3>
                <p className="text-xs text-slate-400">{activeRecipientsCampaign.name}</p>
              </div>
              <button
                onClick={() => setActiveRecipientsCampaign(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              {recipientsList.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No recipient records logged yet.
                </div>
              ) : (
                recipientsList.map((r) => (
                  <div key={r.id} className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-2">
                        <span>{r.business_name}</span>
                        <span className="text-indigo-400 font-mono text-[11px]">{r.phone}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{r.city} • {r.category}</span>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        r.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-300' :
                        r.status === 'read' ? 'bg-cyan-500/20 text-cyan-300' :
                        r.status === 'failed' ? 'bg-rose-500/20 text-rose-300' :
                        r.status === 'suppressed' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {r.status}
                      </span>
                      {r.error && <p className="text-[9px] text-rose-400 mt-1 max-w-[150px] truncate">{r.error}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4-Step Campaign Creation Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl">
            
            {/* Steps Indicator */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      wizardStep === s ? 'bg-indigo-600 text-white' : 
                      wizardStep > s ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {wizardStep > s ? '✓' : s}
                    </span>
                    <span className="hidden sm:inline font-medium text-slate-300">
                      {s === 1 ? 'Details' : s === 2 ? 'Audience' : s === 3 ? 'Template' : 'Review'}
                    </span>
                    {s < 4 && <ChevronRight className="w-3.5 h-3.5 text-slate-600" />}
                  </div>
                ))}
              </div>

              <button onClick={() => setShowWizard(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {/* Step 1: Campaign Details */}
            {wizardStep === 1 && (
              <div className="space-y-3.5 text-xs">
                <h4 className="font-bold text-sm text-white">Step 1: Campaign Details</h4>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Campaign Name *</label>
                  <input
                    type="text"
                    value={wizardForm.name}
                    onChange={e => setWizardForm({ ...wizardForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Description & Objective</label>
                  <textarea
                    rows="3"
                    value={wizardForm.description}
                    onChange={e => setWizardForm({ ...wizardForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Audience Selection */}
            {wizardStep === 2 && (
              <div className="space-y-3.5 text-xs">
                <h4 className="font-bold text-sm text-white">Step 2: Audience & Targeting</h4>
                
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Tag</label>
                  <select
                    value={wizardForm.selected_tags[0] || ''}
                    onChange={e => setWizardForm({ ...wizardForm, selected_tags: [e.target.value] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {tags.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target City</label>
                  <input
                    type="text"
                    value={wizardForm.selected_city}
                    onChange={e => setWizardForm({ ...wizardForm, selected_city: e.target.value })}
                    placeholder="Toronto"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-indigo-300 font-semibold flex items-center justify-between">
                  <span>Estimated Eligible Recipients:</span>
                  <span className="text-sm font-extrabold text-white">{estimatedAudienceCount} Leads</span>
                </div>
              </div>
            )}

            {/* Step 3: Template & Personalization */}
            {wizardStep === 3 && (
              <div className="space-y-3.5 text-xs">
                <h4 className="font-bold text-sm text-white">Step 3: Select Approved Template</h4>
                
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">WhatsApp Template</label>
                  <select
                    value={wizardForm.template_name}
                    onChange={e => {
                      const t = templates.find(item => item.name === e.target.value);
                      setWizardForm({
                        ...wizardForm,
                        template_name: e.target.value,
                        template_id: t?.id || ''
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.name}>{t.name} ({t.category})</option>
                    ))}
                  </select>
                </div>

                {/* Template Live Preview */}
                {selectedTemplateObj && (
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Template Preview</span>
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{selectedTemplateObj.body}</p>
                    <div className="text-[10px] text-indigo-400 font-mono">
                      Dynamic Variables: {selectedTemplateObj.variables?.join(', ') || 'name, company, city, demo_url'}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Review & Test Send */}
            {wizardStep === 4 && (
              <div className="space-y-3.5 text-xs">
                <h4 className="font-bold text-sm text-white">Step 4: Review & Verification</h4>
                
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Campaign:</span>
                    <strong className="text-white">{wizardForm.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Audience:</span>
                    <strong className="text-emerald-400">{estimatedAudienceCount} Leads ({wizardForm.selected_city})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Template:</span>
                    <strong className="font-mono text-indigo-300">{wizardForm.template_name}</strong>
                  </div>
                </div>

                {/* Test Dispatch to Phone */}
                <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl space-y-2">
                  <span className="font-bold text-purple-300 block">Send Test Message</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={wizardForm.test_phone}
                      onChange={e => setWizardForm({ ...wizardForm, test_phone: e.target.value })}
                      placeholder="+91 8920608191"
                      className="flex-1 bg-slate-900 border border-purple-700/60 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                    />
                    <button
                      onClick={handleTestSend}
                      disabled={testSending}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs disabled:opacity-50"
                    >
                      {testSending ? 'Sending...' : 'Send Test'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Navigation Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Back
                </button>
              ) : <div />}

              {wizardStep < 4 ? (
                <button
                  onClick={() => setWizardStep(wizardStep + 1)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleCreateCampaignSubmit}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Save & Prepare Campaign
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
