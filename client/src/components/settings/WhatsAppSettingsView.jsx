import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Globe, 
  Phone, 
  Lock, 
  Trash2, 
  Plus, 
  ExternalLink,
  Sliders,
  Webhook
} from 'lucide-react';
import { 
  getProviderConfig, 
  updateProviderConfig, 
  testProviderConnection, 
  getProviderTemplates, 
  syncProviderTemplates, 
  getSuppressionList, 
  addToSuppressionList, 
  removeFromSuppressionList 
} from '../../api';

export default function WhatsAppSettingsView() {
  const [providerConfig, setProviderConfig] = useState(null);
  const [activeTab, setActiveTab] = useState('sandbox'); // sandbox, wati, meta, suppression
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [syncingTemplates, setSyncingTemplates] = useState(false);
  const [suppressionList, setSuppressionList] = useState([]);
  const [newSuppPhone, setNewSuppPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    try {
      const [cfgRes, tmplRes, suppRes] = await Promise.all([
        getProviderConfig(),
        getProviderTemplates(),
        getSuppressionList()
      ]);
      setProviderConfig(cfgRes.data);
      setActiveTab(cfgRes.data.active_provider || 'sandbox');
      setTemplates(tmplRes.data);
      setSuppressionList(suppRes.data);
    } catch (err) {
      console.error('Error loading provider settings:', err);
    }
  };

  const handleSaveConfig = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const updated = await updateProviderConfig({
        ...providerConfig,
        active_provider: activeTab
      });
      setProviderConfig(updated.data);
      alert('WhatsApp Provider Configuration saved successfully!');
    } catch (err) {
      alert('Error saving configuration: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const res = await testProviderConnection();
      setConnectionResult(res.data);
    } catch (err) {
      setConnectionResult({ success: false, error: err.message });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSyncTemplates = async () => {
    setSyncingTemplates(true);
    try {
      const res = await syncProviderTemplates();
      setTemplates(res.data.templates);
      alert(`Synchronized ${res.data.count} approved templates!`);
    } catch (err) {
      alert('Template sync failed: ' + err.message);
    } finally {
      setSyncingTemplates(false);
    }
  };

  const handleAddSuppression = async (e) => {
    e.preventDefault();
    if (!newSuppPhone) return;
    try {
      await addToSuppressionList({ phone: newSuppPhone, reason: 'Manually added by admin' });
      setNewSuppPhone('');
      const suppRes = await getSuppressionList();
      setSuppressionList(suppRes.data);
    } catch (err) {
      alert('Error adding to suppression list: ' + err.message);
    }
  };

  const handleRemoveSuppression = async (phone) => {
    try {
      await removeFromSuppressionList(phone);
      const suppRes = await getSuppressionList();
      setSuppressionList(suppRes.data);
    } catch (err) {
      alert('Error removing: ' + err.message);
    }
  };

  if (!providerConfig) return <div className="text-slate-500 text-xs p-8">Loading settings...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            <span>WhatsApp Provider & Compliance Settings</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure WATI API, Meta Cloud API, or Interactive Sandbox. Manage message templates and suppression lists.
          </p>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={testingConnection}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : 'text-emerald-400'}`} />
          <span>{testingConnection ? 'Testing...' : 'Test Connection'}</span>
        </button>
      </div>

      {/* Connection Diagnostic Banner if tested */}
      {connectionResult && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
          connectionResult.success 
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {connectionResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <div>
              <strong className="block font-bold">
                {connectionResult.success ? `Connected to ${connectionResult.provider.toUpperCase()} (${connectionResult.status})` : 'Connection Failed'}
              </strong>
              <span>{connectionResult.message || connectionResult.error}</span>
            </div>
          </div>
          <button onClick={() => setConnectionResult(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeTab === 'sandbox' 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          ⚡ Interactive Sandbox
        </button>

        <button
          onClick={() => setActiveTab('wati')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeTab === 'wati' 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          💬 WATI Official API
        </button>

        <button
          onClick={() => setActiveTab('meta')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeTab === 'meta' 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🌐 Meta Cloud API
        </button>

        <button
          onClick={() => setActiveTab('suppression')}
          className={`px-4 py-2 rounded-xl font-bold transition ${
            activeTab === 'suppression' 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          🛡️ Suppression List ({suppressionList.length})
        </button>
      </div>

      {/* Provider Details Form */}
      {activeTab !== 'suppression' ? (
        <form onSubmit={handleSaveConfig} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
          
          {activeTab === 'sandbox' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-950/30 border border-indigo-800/40 rounded-xl space-y-1">
                <span className="font-bold text-indigo-300 block text-sm">Developer Sandbox / Simulation Mode</span>
                <p className="text-slate-400">
                  Allows testing full WhatsApp broadcasts, delivery ticks, read receipts, and simulated incoming customer replies with zero Meta API cost and no credit card required.
                </p>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Simulated Latency (ms)</label>
                <input
                  type="number"
                  value={providerConfig.sandbox?.simulate_delivery_speed_ms || 200}
                  onChange={e => setProviderConfig({
                    ...providerConfig,
                    sandbox: { ...providerConfig.sandbox, simulate_delivery_speed_ms: Number(e.target.value) }
                  })}
                  className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'wati' && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 space-y-1">
                <span className="font-bold text-white block">WATI API Credentials</span>
                <p>Connect your official WATI WhatsApp team inbox account.</p>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">WATI Endpoint URL *</label>
                <input
                  type="text"
                  placeholder="https://live-server-XXXX.wati.io"
                  value={providerConfig.wati?.endpoint_url || ''}
                  onChange={e => setProviderConfig({
                    ...providerConfig,
                    wati: { ...providerConfig.wati, endpoint_url: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Access Token (Bearer) *</label>
                <input
                  type="password"
                  placeholder="Bearer eyJhbGciOiJIUzI1Ni..."
                  value={providerConfig.wati?.access_token || ''}
                  onChange={e => setProviderConfig({
                    ...providerConfig,
                    wati: { ...providerConfig.wati, access_token: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>
          )}

          {activeTab === 'meta' && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 space-y-1">
                <span className="font-bold text-white block">Meta WhatsApp Cloud API Configuration</span>
                <p>Connect direct Meta Graph API for official WhatsApp Business Platform broadcasting.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number ID *</label>
                  <input
                    type="text"
                    placeholder="e.g. 104592019482910"
                    value={providerConfig.meta?.phone_number_id || ''}
                    onChange={e => setProviderConfig({
                      ...providerConfig,
                      meta: { ...providerConfig.meta, phone_number_id: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">WhatsApp Business Account ID (WABA) *</label>
                  <input
                    type="text"
                    placeholder="e.g. 19283019283019"
                    value={providerConfig.meta?.waba_id || ''}
                    onChange={e => setProviderConfig({
                      ...providerConfig,
                      meta: { ...providerConfig.meta, waba_id: e.target.value }
                    })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">System User Permanent Access Token *</label>
                <input
                  type="password"
                  placeholder="EAAB..."
                  value={providerConfig.meta?.access_token || ''}
                  onChange={e => setProviderConfig({
                    ...providerConfig,
                    meta: { ...providerConfig.meta, access_token: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Webhook Verify Token</label>
                <input
                  type="text"
                  value={providerConfig.meta?.verify_token || 'meta_verify_token_siteseller_2026'}
                  onChange={e => setProviderConfig({
                    ...providerConfig,
                    meta: { ...providerConfig.meta, verify_token: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition shadow-md shadow-indigo-500/20"
            >
              {saving ? 'Saving...' : 'Save & Set as Active Provider'}
            </button>
          </div>
        </form>
      ) : (
        /* Suppression List Manager */
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-sm">Marketing Suppression & Opt-Out Ledger</h3>
              <p className="text-slate-400">Contacts on this list are permanently excluded from bulk broadcasts and marketing messages.</p>
            </div>
          </div>

          <form onSubmit={handleAddSuppression} className="flex gap-2">
            <input
              type="text"
              value={newSuppPhone}
              onChange={e => setNewSuppPhone(e.target.value)}
              placeholder="Enter phone number to block (e.g. +14165550199)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
            />
            <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold">
              Add Block
            </button>
          </form>

          <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden">
            {suppressionList.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                Suppression list is currently empty.
              </div>
            ) : (
              suppressionList.map(s => (
                <div key={s.id} className="p-3 bg-slate-950/60 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-slate-200 font-bold">{s.raw_phone || s.phone}</span>
                    <span className="text-[10px] text-slate-500 block">{s.reason} • {new Date(s.opt_out_at).toLocaleDateString()}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveSuppression(s.phone)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 rounded-lg transition"
                    title="Remove from suppression list"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Templates Synchronization Table */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Approved WhatsApp Message Templates</h3>
            <p className="text-slate-400">Templates verified and approved by Meta/WATI for business-initiated broadcasts.</p>
          </div>

          <button
            onClick={handleSyncTemplates}
            disabled={syncingTemplates}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncingTemplates ? 'animate-spin text-indigo-400' : ''}`} />
            <span>Sync Templates</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templates.map(tmpl => (
            <div key={tmpl.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-mono text-indigo-300 font-bold text-xs">{tmpl.name}</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                  {tmpl.status}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] line-clamp-3 whitespace-pre-wrap">{tmpl.body}</p>
              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 flex justify-between">
                <span>Category: {tmpl.category}</span>
                <span>Language: {tmpl.language}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
