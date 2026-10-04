import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Mail, 
  Key, 
  Save, 
  CheckCircle2, 
  Info,
  Sliders
} from 'lucide-react';
import { updateConfig } from '../api';

export default function SettingsView({ config, onConfigSaved }) {
  const [formData, setFormData] = useState({
    target_city: 'Austin',
    target_country: 'United States',
    business_niche: 'Plumbers',
    max_leads_per_day: 25,
    sender_name: 'Alex Morgan',
    sender_email: 'alex@siteselleragent.com',
    physical_mailing_address: '100 Congress Ave, Suite 2000, Austin, TX 78701, USA',
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_user: '',
    smtp_pass: '',
    auto_pilot: false
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData(prev => ({ ...prev, ...config }));
    }
  }, [config]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateConfig(formData);
      setSavedSuccess(true);
      if (onConfigSaved) onConfigSaved(res.data);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Error updating configuration: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>LeadConfig & Agent Parameters</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure target location, business niche, CAN-SPAM mailing address, and Gmail SMTP credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Target Discovery Settings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span>Target Market & Discovery Filters</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target City *</label>
              <input
                type="text"
                required
                value={formData.target_city}
                onChange={e => setFormData({ ...formData, target_city: e.target.value })}
                placeholder="e.g. Austin, London, Miami, Chicago"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target Country *</label>
              <input
                type="text"
                required
                value={formData.target_country}
                onChange={e => setFormData({ ...formData, target_country: e.target.value })}
                placeholder="e.g. United States, Canada, UK"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Business Niche *</label>
              <input
                type="text"
                required
                value={formData.business_niche}
                onChange={e => setFormData({ ...formData, business_niche: e.target.value })}
                placeholder="e.g. Plumbers, Dentists, Roofers, Bakeries"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">High-ticket home & health services yield highest conversion rates.</p>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Max Leads Per Day *</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.max_leads_per_day}
                onChange={e => setFormData({ ...formData, max_leads_per_day: parseInt(e.target.value) || 25 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: CAN-SPAM Compliance & Sender Identity */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sender Identity & CAN-SPAM Compliance (Required)</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sender Full Name *</label>
              <input
                type="text"
                required
                value={formData.sender_name}
                onChange={e => setFormData({ ...formData, sender_name: e.target.value })}
                placeholder="Alex Morgan"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sender Email Address *</label>
              <input
                type="email"
                required
                value={formData.sender_email}
                onChange={e => setFormData({ ...formData, sender_email: e.target.value })}
                placeholder="alex@siteselleragent.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-400 font-semibold">Agency WhatsApp *</label>
                <a
                  href={`https://wa.me/${(formData.sender_whatsapp || '918920608191').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-400 hover:underline font-bold"
                >
                  Test Link ↗
                </a>
              </div>
              <input
                type="text"
                required
                value={formData.sender_whatsapp || '918920608191'}
                onChange={e => setFormData({ ...formData, sender_whatsapp: e.target.value })}
                placeholder="8920608191"
                className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-400 font-semibold mb-1">
              Physical Postal Mailing Address (Mandatory for CAN-SPAM) *
            </label>
            <input
              type="text"
              required
              value={formData.physical_mailing_address}
              onChange={e => setFormData({ ...formData, physical_mailing_address: e.target.value })}
              placeholder="e.g. 100 Congress Ave, Suite 2000, Austin, TX 78701, USA"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              The US CAN-SPAM Act requires all commercial messages to display a valid physical postal address.
            </p>
          </div>
        </div>

        {/* Section 3: Gmail SMTP Settings */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Mail className="w-4 h-4 text-purple-400" />
              <span>Gmail / SMTP Outreach Configuration</span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
              {formData.smtp_user ? 'Live SMTP Mode' : 'Sandbox Simulator Mode (Active)'}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Zero Setup Required:</strong> If left empty, SiteSeller Agent runs in realistic Sandbox Simulator mode — logging full headers, CAN-SPAM compliance, and handling test replies. To send real emails from your personal/workspace Gmail, enter your Gmail address and a 16-character <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-indigo-400 underline">Google App Password</a>.
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Gmail / SMTP Username</label>
              <input
                type="text"
                value={formData.smtp_user}
                onChange={e => setFormData({ ...formData, smtp_user: e.target.value })}
                placeholder="youragency@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Gmail App Password (16 chars)</label>
              <input
                type="password"
                value={formData.smtp_pass}
                onChange={e => setFormData({ ...formData, smtp_pass: e.target.value })}
                placeholder="xxxx xxxx xxxx xxxx"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>LeadConfig saved successfully!</span>
            </div>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
