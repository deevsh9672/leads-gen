import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Send, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  RefreshCw, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  Trash2, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  ShieldAlert, 
  MessageSquare, 
  FileText, 
  Image as ImageIcon, 
  UserCheck, 
  UserX, 
  Layers
} from 'lucide-react';
import { 
  getBroadcastStatus, 
  getBroadcastTemplates, 
  getBroadcastStats, 
  getBroadcastContacts, 
  addBroadcastContact, 
  importBroadcastContacts, 
  syncProspectsToBroadcastContacts, 
  updateBroadcastContactConsent, 
  deleteBroadcastContact, 
  getBroadcastCampaigns, 
  getBroadcastCampaignById, 
  createBroadcastCampaign, 
  sendBroadcastCampaign, 
  pauseBroadcastCampaign, 
  deleteBroadcastCampaign, 
  getBroadcastWebhookLogs 
} from '../api';

export default function BroadcastView({ prospects = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('campaigns'); // 'campaigns', 'create', 'contacts', 'settings'
  const [loading, setLoading] = useState(false);
  const [statusInfo, setStatusInfo] = useState(null);
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [webhookLogs, setWebhookLogs] = useState([]);
  
  // Selected Campaign Drill-down Modal
  const [activeCampaignDetail, setActiveCampaignDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Search & Filter States
  const [contactSearch, setContactSearch] = useState('');
  const [contactConsentFilter, setContactConsentFilter] = useState('all');
  const [campaignSearch, setCampaignSearch] = useState('');

  // Create Campaign State
  const [newCampaignName, setNewCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState('template'); // 'template' or 'text'
  const [selectedTemplateName, setSelectedTemplateName] = useState('website_demo_announcement');
  const [selectedLanguage, setSelectedLanguage] = useState('en_US');
  const [templateParam1, setTemplateParam1] = useState('{{name}}');
  const [templateParam2, setTemplateParam2] = useState('{{business_name}}');
  const [templateParam3, setTemplateParam3] = useState('{{city}}');
  const [templateParam4, setTemplateParam4] = useState('{{demo_url}}');
  const [customTextMessage, setCustomTextMessage] = useState(
    'Hi {{name}}! We built a high-converting 3D demo website for {{business_name}} in {{city}}.\n\n👉 View demo: {{demo_url}}\n\nReply here to claim or customize!'
  );
  const [mediaType, setMediaType] = useState('image');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState(new Set());
  const [recipientSelectAll, setRecipientSelectAll] = useState(true);

  // Manual Add Contact Modal
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualCountryCode, setManualCountryCode] = useState('1');
  const [manualCompany, setManualCompany] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [manualConsent, setManualConsent] = useState('CONSENTED');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState(null);
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  useEffect(() => {
    loadAllBroadcastData();
  }, []);

  const loadAllBroadcastData = async () => {
    setLoading(true);
    try {
      const [statusRes, statsRes, campaignsRes, contactsRes, templatesRes] = await Promise.all([
        getBroadcastStatus().catch(() => ({ data: null })),
        getBroadcastStats().catch(() => ({ data: null })),
        getBroadcastCampaigns().catch(() => ({ data: [] })),
        getBroadcastContacts().catch(() => ({ data: [] })),
        getBroadcastTemplates().catch(() => ({ data: [] }))
      ]);

      if (statusRes?.data) setStatusInfo(statusRes.data);
      if (statsRes?.data) setStats(statsRes.data);
      if (campaignsRes?.data) setCampaigns(campaignsRes.data);
      if (contactsRes?.data) {
        setContacts(contactsRes.data);
        // Default select all consented contacts
        const consentedIds = new Set(
          contactsRes.data.filter(c => c.consent_status !== 'OPTED_OUT').map(c => c.id)
        );
        setSelectedRecipientIds(consentedIds);
      }
      if (templatesRes?.data) setTemplates(templatesRes.data);
    } catch (err) {
      console.error('Error loading broadcast data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWebhookLogs = async () => {
    try {
      const res = await getBroadcastWebhookLogs();
      setWebhookLogs(res.data || []);
    } catch (err) {
      console.error('Error loading webhook logs:', err);
    }
  };

  // Sync Prospects to Broadcast Contacts
  const handleSyncProspects = async () => {
    try {
      setLoading(true);
      const res = await syncProspectsToBroadcastContacts();
      alert(res.data.message || 'Leads synced successfully!');
      loadAllBroadcastData();
    } catch (err) {
      alert('Error syncing leads: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add Manual Contact
  const handleAddManualContact = async (e) => {
    e.preventDefault();
    if (!manualPhone.trim()) {
      alert('Phone number is required');
      return;
    }
    try {
      const phoneDigits = manualPhone.replace(/\D/g, '');
      const fullPhone = phoneDigits.startsWith(manualCountryCode) 
        ? `+${phoneDigits}` 
        : `+${manualCountryCode}${phoneDigits}`;

      await addBroadcastContact({
        name: manualName || 'Contact',
        phone: fullPhone,
        company: manualCompany,
        city: manualCity,
        email: manualEmail,
        category: manualCategory,
        consent_status: manualConsent,
        consent_source: 'Manual Dashboard Entry'
      });

      alert('Contact added successfully!');
      setIsAddContactModalOpen(false);
      setManualName('');
      setManualPhone('');
      setManualCompany('');
      setManualCity('');
      setManualEmail('');
      setManualCategory('');
      loadAllBroadcastData();
    } catch (err) {
      alert('Error adding contact: ' + (err.response?.data?.error || err.message));
    }
  };

  // CSV Import
  const handleCsvFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r\n|\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          alert('CSV file must have a header row and at least one contact row.');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
        const phoneIdx = headers.findIndex(h => h.includes('phone') || h.includes('mobile') || h.includes('contact') || h.includes('number'));
        const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('business') || h.includes('title'));
        const companyIdx = headers.findIndex(h => h.includes('company') || h.includes('business') || h.includes('organization'));
        const cityIdx = headers.findIndex(h => h.includes('city') || h.includes('location'));
        const emailIdx = headers.findIndex(h => h.includes('email') || h.includes('mail'));

        if (phoneIdx === -1) {
          alert('Could not find a phone number column in CSV. Ensure header includes "Phone" or "Mobile".');
          return;
        }

        const contactsToImport = [];
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
          if (!row[phoneIdx]) continue;
          contactsToImport.push({
            name: nameIdx !== -1 ? row[nameIdx] : 'Contact',
            phone: row[phoneIdx],
            company: companyIdx !== -1 ? row[companyIdx] : '',
            city: cityIdx !== -1 ? row[cityIdx] : '',
            email: emailIdx !== -1 ? row[emailIdx] : '',
            consent_status: 'CONSENTED',
            consent_source: 'CSV Upload'
          });
        }

        const res = await importBroadcastContacts({
          contacts: contactsToImport,
          default_country_code: manualCountryCode || '1'
        });

        alert(`Import Complete!\n\nImported: ${res.data.imported_count} valid contacts\nDuplicates skipped: ${res.data.duplicates_count}\nInvalid skipped: ${res.data.invalid_count}`);
        loadAllBroadcastData();
      } catch (err) {
        alert('Error parsing CSV file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Download Sample CSV Template
  const downloadSampleCsv = () => {
    const csvContent = 'Name,Phone,Company,City,Email\nJohn Doe,+14165060804,Bay Street Medical,Toronto,service@baystclinic.com\nSarah Connor,+16473285882,Laser Care Center,Toronto,contact@lasercare.ca\nRajesh Kumar,+919829012890,Heritage Cafe,Jaipur,heritagecafe@gmail.com';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'whatsapp_contacts_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle Contact Consent Status (Consented vs Opted-out)
  const handleToggleConsent = async (contact) => {
    const newStatus = contact.consent_status === 'OPTED_OUT' ? 'CONSENTED' : 'OPTED_OUT';
    try {
      await updateBroadcastContactConsent(contact.id, {
        consent_status: newStatus,
        opt_out_reason: newStatus === 'OPTED_OUT' ? 'User manual toggle in dashboard' : null
      });
      loadAllBroadcastData();
    } catch (err) {
      alert('Error updating consent: ' + err.message);
    }
  };

  // Delete Contact
  const handleDeleteContact = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    try {
      await deleteBroadcastContact(contactId);
      loadAllBroadcastData();
    } catch (err) {
      alert('Error deleting contact: ' + err.message);
    }
  };

  // Create & Dispatch Campaign
  const handleCreateCampaign = async (andSendNow = false) => {
    if (!newCampaignName.trim()) {
      alert('Please enter a campaign name');
      return;
    }

    const selectedIds = Array.from(selectedRecipientIds);
    if (selectedIds.length === 0) {
      alert('Please select at least one recipient for this broadcast.');
      return;
    }

    try {
      setLoading(true);
      const paramsArray = [templateParam1, templateParam2, templateParam3, templateParam4].filter(Boolean);

      const campaignRes = await createBroadcastCampaign({
        name: newCampaignName.trim(),
        type: campaignType,
        template_name: campaignType === 'template' ? selectedTemplateName : '',
        template_language: selectedLanguage,
        template_parameters: paramsArray,
        message_text: customTextMessage,
        media_type: mediaType,
        media_url: mediaUrl,
        recipient_ids: selectedIds
      });

      const created = campaignRes.data;

      if (andSendNow) {
        if (!statusInfo?.configured) {
          alert(`Campaign '${created.name}' created as DRAFT!\n\n⚠️ WhatsApp Cloud API credentials are not yet configured on the server. Please visit the "API Setup" tab to configure your Meta Phone Number ID and Access Token to send live messages.`);
        } else {
          await sendBroadcastCampaign(created.id);
          alert(`🚀 Broadcast campaign '${created.name}' dispatched to ${created.recipient_count} recipients via WhatsApp Cloud API!`);
        }
      } else {
        alert(`Campaign '${created.name}' created with ${created.recipient_count} recipients!`);
      }

      setNewCampaignName('');
      setActiveSubTab('campaigns');
      loadAllBroadcastData();
    } catch (err) {
      alert('Error creating campaign: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Send Draft Campaign
  const handleSendCampaign = async (campaignId) => {
    if (!statusInfo?.configured) {
      alert('⚠️ WhatsApp Cloud API credentials not configured.\n\nPlease go to "API Setup" tab and configure your Phone Number ID and Meta Access Token.');
      return;
    }
    if (!window.confirm('Are you ready to send this WhatsApp broadcast to all queued recipients?')) return;
    try {
      await sendBroadcastCampaign(campaignId);
      alert('Broadcast execution initiated! Real-time delivery statuses will update as Meta delivers messages.');
      loadAllBroadcastData();
    } catch (err) {
      alert('Error sending broadcast: ' + (err.response?.data?.error || err.message));
    }
  };

  // Pause Sending Campaign
  const handlePauseCampaign = async (campaignId) => {
    try {
      await pauseBroadcastCampaign(campaignId);
      loadAllBroadcastData();
    } catch (err) {
      alert('Error pausing campaign: ' + err.message);
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Delete this broadcast campaign record?')) return;
    try {
      await deleteBroadcastCampaign(campaignId);
      loadAllBroadcastData();
    } catch (err) {
      alert('Error deleting campaign: ' + err.message);
    }
  };

  // View Campaign Drilldown
  const handleViewCampaignDetail = async (campaign) => {
    try {
      const res = await getBroadcastCampaignById(campaign.id);
      setActiveCampaignDetail(res.data);
      setIsDetailModalOpen(true);
    } catch (err) {
      alert('Error loading campaign details: ' + err.message);
    }
  };

  // Filtered contacts
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = !contactSearch || 
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone.includes(contactSearch) ||
      (c.company && c.company.toLowerCase().includes(contactSearch.toLowerCase())) ||
      (c.city && c.city.toLowerCase().includes(contactSearch.toLowerCase()));

    const matchesConsent = contactConsentFilter === 'all' || c.consent_status === contactConsentFilter;
    return matchesSearch && matchesConsent;
  });

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter(c => 
    !campaignSearch || c.name.toLowerCase().includes(campaignSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header & WhatsApp Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                WhatsApp Broadcasting Engine
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Cloud API v21.0
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Bulk campaign dispatcher, verified audience manager & automated Meta delivery-status tracker
              </p>
            </div>
          </div>
        </div>

        {/* Cloud API Connection Indicator */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <div className={`w-3 h-3 rounded-full ${statusInfo?.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
          <div>
            <div className="font-bold text-slate-200">
              {statusInfo?.configured ? 'Meta Cloud API Connected' : 'API Setup Required'}
            </div>
            <div className="text-[11px] text-slate-400">
              {statusInfo?.configured ? `Phone ID: ${statusInfo?.phone_number_id || 'Active'}` : 'Configure credentials in API Setup'}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcasting Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveSubTab('campaigns')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === 'campaigns'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Campaigns & Reports</span>
          <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-950/60 font-mono">
            {campaigns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('create')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === 'create'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>New Broadcast Campaign</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contacts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === 'contacts'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Audience & Consent</span>
          <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-950/60 font-mono">
            {contacts.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('settings');
            loadWebhookLogs();
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeSubTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>API & Webhooks</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB 1: CAMPAIGNS & REPORTS DASHBOARD                */}
      {/* ======================================================== */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Campaigns</span>
              <div className="text-2xl font-black text-white mt-1">{stats?.total_campaigns || campaigns.length}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dispatched</span>
              <div className="text-2xl font-black text-indigo-400 mt-1">{stats?.stats?.total_dispatched || 0}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">API Accepted</span>
              <div className="text-2xl font-black text-blue-400 mt-1">{stats?.stats?.total_accepted || 0}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sent (In Transit)</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">{stats?.stats?.total_sent || 0}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Delivered</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{stats?.stats?.total_delivered || 0}</div>
              <span className="text-[10px] text-emerald-500 font-bold">{stats?.stats?.delivery_rate || 0}% rate</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Read by Client</span>
              <div className="text-2xl font-black text-purple-400 mt-1">{stats?.stats?.total_read || 0}</div>
              <span className="text-[10px] text-purple-400 font-bold">{stats?.stats?.read_rate || 0}% rate</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Failed / Opted-Out</span>
              <div className="text-2xl font-black text-rose-400 mt-1">{stats?.stats?.total_failed || 0}</div>
            </div>
          </div>

          {/* Campaign List Table Header & Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Broadcast Campaigns</h2>
                <p className="text-xs text-slate-400">Track real-time outcomes, delivery rates, and granular recipient logs</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search campaign name..."
                    value={campaignSearch}
                    onChange={(e) => setCampaignSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  onClick={loadAllBroadcastData}
                  disabled={loading}
                  title="Refresh campaign stats"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={() => setActiveSubTab('create')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Campaign</span>
                </button>
              </div>
            </div>

            {/* Campaign Table */}
            {filteredCampaigns.length === 0 ? (
              <div className="p-12 text-center">
                <Radio className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
                <h3 className="text-base font-bold text-white">No broadcast campaigns yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Create your first WhatsApp broadcast campaign to reach your verified leads directly via Meta Cloud API.
                </p>
                <button
                  onClick={() => setActiveSubTab('create')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition"
                >
                  Launch New Broadcast
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Campaign Name</th>
                      <th className="px-4 py-3.5">Template / Format</th>
                      <th className="px-4 py-3.5">Recipients</th>
                      <th className="px-4 py-3.5">Delivery Progress</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Created</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                    {filteredCampaigns.map((camp) => {
                      const s = camp.stats || {};
                      const deliveredPct = s.total > 0 ? Math.round(((s.delivered || 0) / s.total) * 100) : 0;
                      return (
                        <tr key={camp.id} className="hover:bg-slate-800/30 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white text-sm">{camp.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">ID: {camp.id.substring(0, 8)}...</div>
                          </td>

                          <td className="px-4 py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                              {camp.type === 'template' ? `Template: ${camp.template_name || 'hello_world'}` : 'Direct Text'}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="font-bold text-white">{camp.recipient_count || camp.recipients?.length || 0}</div>
                            <div className="text-[10px] text-slate-400">
                              {s.delivered || 0} del • {s.read || 0} read
                            </div>
                          </td>

                          <td className="px-4 py-4 min-w-[140px]">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                              <span>{deliveredPct}% confirmed</span>
                              <span>{s.delivered || 0}/{s.total || 0}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                                style={{ width: `${deliveredPct}%` }}
                              ></div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                              camp.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              camp.status === 'SENDING' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 animate-pulse' :
                              camp.status === 'PAUSED' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                              camp.status === 'FAILED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                              'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {camp.status === 'SENDING' && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                              {camp.status === 'COMPLETED' && <CheckCircle2 className="w-2.5 h-2.5" />}
                              {camp.status}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-slate-400 text-[11px]">
                            {new Date(camp.created_at).toLocaleDateString()}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Send or Resume Button */}
                              {camp.status === 'DRAFT' && (
                                <button
                                  onClick={() => handleSendCampaign(camp.id)}
                                  title="Dispatch Campaign"
                                  className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {camp.status === 'SENDING' && (
                                <button
                                  onClick={() => handlePauseCampaign(camp.id)}
                                  title="Pause Sending"
                                  className="p-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/30 transition"
                                >
                                  <Pause className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {camp.status === 'PAUSED' && (
                                <button
                                  onClick={() => handleSendCampaign(camp.id)}
                                  title="Resume Sending"
                                  className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 transition"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* View Drilldown */}
                              <button
                                onClick={() => handleViewCampaignDetail(camp)}
                                title="View Delivery Logs"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteCampaign(camp.id)}
                                title="Delete Campaign"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-700/50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 2: CREATE BROADCAST CAMPAIGN COMPOSER           */}
      {/* ======================================================== */}
      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Configuration */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-400" />
                <span>Configure WhatsApp Campaign</span>
              </h2>

              {/* Campaign Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toronto Clinics Free Demo Site Announcement"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Message Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Dispatch Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCampaignType('template')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      campaignType === 'template'
                        ? 'bg-indigo-600/10 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Meta Approved Template</span>
                      {campaignType === 'template' && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Required for business-initiated outreach outside 24h window
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCampaignType('text')}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      campaignType === 'text'
                        ? 'bg-indigo-600/10 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Direct Message / Sandbox</span>
                      {campaignType === 'text' && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Freeform text for ongoing sessions and test development
                    </div>
                  </button>
                </div>
              </div>

              {/* If Template Selected: Template Picker & Parameters */}
              {campaignType === 'template' ? (
                <div className="space-y-4 bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Select Approved Template
                    </label>
                    <select
                      value={selectedTemplateName}
                      onChange={(e) => setSelectedTemplateName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {templates.map(tpl => (
                        <option key={tpl.name} value={tpl.name}>
                          {tpl.name} ({tpl.language} • {tpl.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Template Variable Interpolators */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Dynamic Variables (Personalized per recipient)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400">{`{{1}} Recipient Name`}</span>
                        <input
                          type="text"
                          value={templateParam1}
                          onChange={(e) => setTemplateParam1(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">{`{{2}} Business Name`}</span>
                        <input
                          type="text"
                          value={templateParam2}
                          onChange={(e) => setTemplateParam2(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">{`{{3}} City / Location`}</span>
                        <input
                          type="text"
                          value={templateParam3}
                          onChange={(e) => setTemplateParam3(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">{`{{4}} Website Demo URL`}</span>
                        <input
                          type="text"
                          value={templateParam4}
                          onChange={(e) => setTemplateParam4(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* If Direct Text Selected: Freeform Textarea */
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Message Content
                    </label>
                    <div className="flex gap-1.5 text-[10px] text-indigo-400">
                      <span className="cursor-pointer hover:underline" onClick={() => setCustomTextMessage(prev => prev + ' {{name}}')}>+name</span>
                      <span>•</span>
                      <span className="cursor-pointer hover:underline" onClick={() => setCustomTextMessage(prev => prev + ' {{business_name}}')}>+biz</span>
                      <span>•</span>
                      <span className="cursor-pointer hover:underline" onClick={() => setCustomTextMessage(prev => prev + ' {{demo_url}}')}>+demo</span>
                    </div>
                  </div>

                  {/* Niche Presets Bar */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 shrink-0">Niche Presets:</span>
                    <button
                      type="button"
                      onClick={() => setCustomTextMessage(`Hello {{name}}! 🏥 We built a modern demo clinic website for {{business_name}} in {{city}} with online appointment booking.\n\n👉 View Live Demo: {{demo_url}}\n\nReply here to claim or customize doctor specialties!`)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 whitespace-nowrap"
                    >
                      🏥 Clinic
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTextMessage(`Hello {{name}}! 🍽️ We built a luxury demo dining website for {{business_name}} in {{city}} with online table reservations.\n\n👉 View Live Demo: {{demo_url}}\n\nReply here to claim or add your custom menu!`)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 whitespace-nowrap"
                    >
                      🍽️ Restaurant
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTextMessage(`Hi {{name}}! ☕ We built a luxury 3D demo website for {{business_name}} in {{city}} with digital artisan menu.\n\n👉 View Live Demo: {{demo_url}}\n\nReply here to claim or customize!`)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 whitespace-nowrap"
                    >
                      ☕ Cafe
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTextMessage(`Hello {{name}}! ✨ We built a luxury demo website for {{business_name}} in {{city}} with online stylist & beauty booking.\n\n👉 View Live Demo: {{demo_url}}\n\nReply here to claim!`)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:bg-fuchsia-500/30 whitespace-nowrap"
                    >
                      ✂️ Salon
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTextMessage(`Hello {{name}}! 🏋️ We built a high-converting demo fitness website for {{business_name}} in {{city}} with trial pass booking.\n\n👉 View Live Demo: {{demo_url}}\n\nReply here to claim!`)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 whitespace-nowrap"
                    >
                      🏋️ Gym
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTextMessage(`Hello {{name}}! 💼 We built a modern demo website for {{business_name}} in {{city}} with online service estimates.\n\n👉 View Live Demo: {{demo_url}}\n\nReply here to claim!`)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 whitespace-nowrap"
                    >
                      💼 General
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={customTextMessage}
                    onChange={(e) => setCustomTextMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                  ></textarea>
                </div>
              )}

              {/* Media Attachment URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Optional Media Attachment (Header Image / Banner)
                </label>
                <div className="flex gap-3">
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white w-32"
                  >
                    <option value="image">Image (JPG/PNG)</option>
                    <option value="document">PDF Document</option>
                    <option value="video">Video (MP4)</option>
                  </select>
                  <input
                    type="url"
                    placeholder="https://example.com/banner.jpg"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Recipient Selection Table Header */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Target Audience ({selectedRecipientIds.size} selected)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Unsubscribed or opted-out contacts are filtered out automatically
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allConsented = new Set(contacts.filter(c => c.consent_status !== 'OPTED_OUT').map(c => c.id));
                        setSelectedRecipientIds(allConsented);
                      }}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRecipientIds(new Set())}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Recipient Picker Box */}
                <div className="max-h-60 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800/60">
                  {contacts.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      No contacts found in audience. Click "Sync Leads" or "Import CSV" to populate.
                    </div>
                  ) : (
                    contacts.map(c => {
                      const isOptedOut = c.consent_status === 'OPTED_OUT';
                      const isChecked = selectedRecipientIds.has(c.id);
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            if (isOptedOut) return;
                            const next = new Set(selectedRecipientIds);
                            if (next.has(c.id)) next.delete(c.id);
                            else next.add(c.id);
                            setSelectedRecipientIds(next);
                          }}
                          className={`flex items-center justify-between p-3 transition text-xs ${
                            isOptedOut 
                              ? 'opacity-40 cursor-not-allowed bg-rose-950/10' 
                              : 'cursor-pointer hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked && !isOptedOut}
                              disabled={isOptedOut}
                              onChange={() => {}}
                              className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                            />
                            <div>
                              <div className="font-bold text-white flex items-center gap-2">
                                <span>{c.name}</span>
                                {c.company && <span className="text-[11px] text-slate-400 font-normal">({c.company})</span>}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">{c.phone} • {c.city || 'Local'}</div>
                            </div>
                          </div>

                          <div>
                            {isOptedOut ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                Opted-Out
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                Consented
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Submission Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => handleCreateCampaign(false)}
                  disabled={loading}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleCreateCampaign(true)}
                  disabled={loading || selectedRecipientIds.size === 0}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Launch Broadcast ({selectedRecipientIds.size} Leads)</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Live WhatsApp Chat Mockup Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live WhatsApp Preview</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Meta Verified Badge</span>
              </div>

              {/* Simulated Mobile WhatsApp Chat Shell */}
              <div className="w-full max-w-sm mx-auto rounded-3xl bg-[#0b141a] border-4 border-slate-800 overflow-hidden shadow-2xl text-slate-100">
                {/* Chat Top Bar */}
                <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                      WA
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>SiteSeller Verified</span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                      </div>
                      <div className="text-[10px] text-emerald-400">Official Business Account</div>
                    </div>
                  </div>
                </div>

                {/* Message Canvas with WhatsApp wallpaper pattern */}
                <div className="p-4 space-y-3 min-h-[320px] bg-[#0b141a] flex flex-col justify-end">
                  
                  {/* Speech Bubble */}
                  <div className="bg-[#005c4b] text-slate-100 rounded-2xl rounded-tr-none p-3.5 shadow-md space-y-2.5 text-xs max-w-[90%] self-end">
                    
                    {/* Media Header Preview */}
                    {mediaUrl && (
                      <div className="rounded-xl overflow-hidden border border-emerald-900/40">
                        <img 
                          src={mediaUrl} 
                          alt="Campaign Banner" 
                          className="w-full h-32 object-cover" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    {/* Body Text */}
                    <div className="font-sans leading-relaxed whitespace-pre-line text-[11.5px]">
                      {campaignType === 'template' ? (
                        <>
                          Hello <strong className="text-white">Dr. Sarah Connor</strong>, we have built a custom modern demo website for <strong className="text-white">Bathurst Lawrence Walk-In Clinic</strong> in <strong className="text-white">Toronto</strong>.
                          <br /><br />
                          👉 View it live here: <span className="text-cyan-300 underline font-mono">https://leads-gen-b3uj.onrender.com/demos/sample</span>
                        </>
                      ) : (
                        customTextMessage
                          .replace(/\{\{name\}\}/gi, 'Dr. Sarah Connor')
                          .replace(/\{\{business_name\}\}/gi, 'Bathurst Lawrence Walk-In Clinic')
                          .replace(/\{\{city\}\}/gi, 'Toronto')
                          .replace(/\{\{demo_url\}\}/gi, 'https://leads-gen-b3uj.onrender.com/demos/sample')
                      )}
                    </div>

                    {/* Footer / Opt-out notice */}
                    <div className="text-[9px] text-emerald-200/60 pt-1 border-t border-emerald-700/30">
                      Reply STOP to unsubscribe • CAN-SPAM Compliant
                    </div>

                    {/* Time & Double Blue Checkmarks */}
                    <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/70 pt-0.5">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-cyan-300 font-bold tracking-tighter">✓✓</span>
                    </div>

                  </div>

                </div>

                {/* Bottom Input Area Mock */}
                <div className="bg-[#202c33] p-2 flex items-center justify-between text-slate-400 text-xs">
                  <span className="text-[11px] text-slate-500 pl-2">Reply to business...</span>
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>

              {/* Policy Notice Box */}
              <div className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Meta Policy Compliance:</strong> Business-initiated messages use approved templates with required opt-out instructions to prevent number flagging.
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 3: AUDIENCE & CONSENT MANAGEMENT                */}
      {/* ======================================================== */}
      {activeSubTab === 'contacts' && (
        <div className="space-y-6">
          
          {/* Top Audience Actions Strip */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Verified Broadcast Contacts</span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage contact numbers, E.164 normalization, consent records, and unsubscribe opt-outs
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Import CSV */}
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Import CSV</span>
                <input type="file" accept=".csv" onChange={handleCsvFileUpload} className="hidden" />
              </label>

              {/* Sample CSV */}
              <button
                onClick={downloadSampleCsv}
                title="Download CSV Template"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Sample CSV</span>
              </button>

              {/* Sync Leads */}
              <button
                onClick={handleSyncProspects}
                title="Sync all verified leads discovered by Superagent"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Verified Leads</span>
              </button>

              {/* Manual Add Contact */}
              <button
                onClick={() => setIsAddContactModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, phone, company..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <span>Consent:</span>
              </div>
              <select
                value={contactConsentFilter}
                onChange={(e) => setContactConsentFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="all">All Contacts</option>
                <option value="CONSENTED">Consented Only</option>
                <option value="OPTED_OUT">Opted-Out Only</option>
                <option value="UNCONFIRMED">Unconfirmed</option>
              </select>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {filteredContacts.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No contacts match filter</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Add contacts manually, import from CSV, or click "Sync Verified Leads" to import existing Toronto clinic leads.
                </p>
                <button
                  onClick={handleSyncProspects}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition"
                >
                  Sync Verified Leads Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Contact Name & Company</th>
                      <th className="px-4 py-3.5">E.164 WhatsApp Number</th>
                      <th className="px-4 py-3.5">Location</th>
                      <th className="px-4 py-3.5">Consent Status</th>
                      <th className="px-4 py-3.5">Source</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                    {filteredContacts.map(c => {
                      const isOptedOut = c.consent_status === 'OPTED_OUT';
                      return (
                        <tr key={c.id} className="hover:bg-slate-800/30 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white text-sm">{c.name}</div>
                            {c.company && (
                              <div className="text-[11px] text-slate-400">{c.company}</div>
                            )}
                          </td>

                          <td className="px-4 py-4 font-mono font-bold text-white">
                            {c.phone}
                          </td>

                          <td className="px-4 py-4 text-slate-400">
                            {c.city || 'Ontario, Canada'}
                          </td>

                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                              isOptedOut 
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}>
                              {isOptedOut ? <UserX className="w-2.5 h-2.5" /> : <UserCheck className="w-2.5 h-2.5" />}
                              {c.consent_status}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-slate-400 text-[11px]">
                            {c.consent_source || 'Directory'}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Toggle Opt-Out / Consent */}
                              <button
                                onClick={() => handleToggleConsent(c)}
                                title={isOptedOut ? "Re-instate Consent" : "Mark as Opted-Out"}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                                  isOptedOut
                                    ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border-emerald-500/30'
                                    : 'bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border-rose-500/30'
                                }`}
                              >
                                {isOptedOut ? 'Re-enable' : 'Opt-Out'}
                              </button>

                              {/* Delete Contact */}
                              <button
                                onClick={() => handleDeleteContact(c.id)}
                                title="Delete Contact"
                                className="p-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-700/50 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-TAB 4: API & WEBHOOK CONFIGURATION                  */}
      {/* ======================================================== */}
      {activeSubTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-indigo-400" />
                <span>Official Meta WhatsApp Business Cloud API Integration</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure your server webhook and API credentials directly with Meta for Developers
              </p>
            </div>

            {/* Connection Status Card */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              statusInfo?.configured 
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
                : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3.5 h-3.5 rounded-full ${statusInfo?.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
                <div>
                  <div className="font-bold text-sm">
                    {statusInfo?.configured ? 'Meta Cloud API Credentials Configured' : 'Credentials Awaiting Server Environment Variables'}
                  </div>
                  <div className="text-xs opacity-80">
                    {statusInfo?.configured 
                      ? 'Phone ID and access token active on backend server.' 
                      : 'Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in server environment.'}
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/40">
                Graph {statusInfo?.api_version || 'v21.0'}
              </span>
            </div>

            {/* Webhook Configuration Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Webhook Callback URL */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Webhook Callback URL (Paste in Meta Developer App)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={statusInfo?.webhook_url || 'https://leads-gen-b3uj.onrender.com/api/whatsapp/webhook'}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(statusInfo?.webhook_url || '', 'webhook_url')}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    {copiedKey === 'webhook_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'webhook_url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Handles live message delivery, read confirmations & incoming unsubscribe requests.
                </p>
              </div>

              {/* Verify Token */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Webhook Verify Token
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={statusInfo?.webhook_verify_token || 'siteseller_wa_webhook_verify_secret'}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-purple-300 select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(statusInfo?.webhook_verify_token || '', 'verify_token')}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    {copiedKey === 'verify_token' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'verify_token' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Enter this token when completing the webhook verification handshake on developers.facebook.com.
                </p>
              </div>
            </div>

            {/* Step-by-Step Meta Guide */}
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                <span>How to link Meta WhatsApp Cloud API</span>
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
                <li>Log in to <strong className="text-white">developers.facebook.com</strong> and select your App.</li>
                <li>In the left sidebar, click <strong className="text-white">WhatsApp &gt; API Setup</strong>.</li>
                <li>Copy the <strong className="text-white">Phone number ID</strong> and generate a permanent System User Token.</li>
                <li>Set <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">WHATSAPP_ACCESS_TOKEN</code> and <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300">WHATSAPP_PHONE_NUMBER_ID</code> on your hosting environment.</li>
                <li>Click <strong className="text-white">Configuration &gt; Edit Webhook</strong>, paste the Callback URL and Verify Token from above, and subscribe to the <code className="bg-slate-900 px-1 py-0.5 rounded text-purple-300">messages</code> field.</li>
              </ol>
            </div>

            {/* Recent Webhook Activity Logs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Recent Webhook Inbound Callbacks</h3>
                <button
                  onClick={loadWebhookLogs}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Webhook Logs</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-48 overflow-y-auto font-mono text-[11px] text-slate-400">
                {webhookLogs.length === 0 ? (
                  <div className="text-slate-500 text-center py-4">No webhook events logged yet. Callbacks from Meta will appear here in real-time.</div>
                ) : (
                  webhookLogs.map((log) => (
                    <div key={log.id} className="py-1 border-b border-slate-900 flex justify-between">
                      <span className="text-cyan-400">{log.event_type}</span>
                      <span className="text-slate-500">{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CAMPAIGN DRILL-DOWN DETAIL MODAL                         */}
      {/* ======================================================== */}
      {isDetailModalOpen && activeCampaignDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{activeCampaignDetail.name}</h3>
                <div className="text-xs text-slate-400">
                  Format: {activeCampaignDetail.type} • {activeCampaignDetail.recipients?.length || 0} Recipients
                </div>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Outcomes Table */}
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">WhatsApp Message ID (WAMID)</th>
                    <th className="px-4 py-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                  {activeCampaignDetail.recipients?.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30">
                      <td className="px-4 py-3 font-bold text-white">
                        {r.name}
                        {r.company && <span className="block text-[11px] text-slate-400 font-normal">{r.company}</span>}
                      </td>

                      <td className="px-4 py-3 font-mono">
                        {r.phone}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          r.status === 'READ' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                          r.status === 'ACCEPTED' || r.status === 'SENT' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                          r.status === 'FAILED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {r.status}
                        </span>
                        {r.error_message && (
                          <div className="text-[10px] text-rose-400 mt-0.5 max-w-xs">{r.error_message}</div>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                        {r.wamid ? `${r.wamid.substring(0, 18)}...` : '—'}
                      </td>

                      <td className="px-4 py-3 text-right text-slate-400 text-[11px]">
                        {r.read_at ? `Read: ${new Date(r.read_at).toLocaleTimeString()}` :
                         r.delivered_at ? `Delivered: ${new Date(r.delivered_at).toLocaleTimeString()}` :
                         r.sent_at ? `Sent: ${new Date(r.sent_at).toLocaleTimeString()}` : 'Queued'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MANUAL ADD CONTACT MODAL                                */}
      {/* ======================================================== */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Contact to Audience</span>
              </h3>
              <button
                onClick={() => setIsAddContactModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Emily Thorne"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">WhatsApp Number *</label>
                <div className="flex gap-2">
                  <select
                    value={manualCountryCode}
                    onChange={(e) => setManualCountryCode(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-white w-28"
                  >
                    <option value="1">CA/US (+1)</option>
                    <option value="91">India (+91)</option>
                    <option value="44">UK (+44)</option>
                    <option value="61">AU (+61)</option>
                  </select>
                  <input
                    type="tel"
                    required
                    placeholder="416-506-0804"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Company / Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Toronto Health Walk-in"
                  value={manualCompany}
                  onChange={(e) => setManualCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Toronto"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Consent Status</label>
                  <select
                    value={manualConsent}
                    onChange={(e) => setManualConsent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="CONSENTED">Consented</option>
                    <option value="OPTED_OUT">Opted-Out</option>
                    <option value="UNCONFIRMED">Unconfirmed</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddContactModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-white font-bold bg-emerald-600 hover:bg-emerald-500 shadow-md"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
