import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  Tag, 
  CheckSquare, 
  Square, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  ExternalLink, 
  X, 
  Check, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { 
  addLead, 
  updateLead, 
  deleteLead, 
  bulkUpdateLeads, 
  importLeads, 
  getExportCsvUrl, 
  getExportJsonUrl 
} from '../../api';

export default function CrmLeadsView({ 
  leads, 
  tags, 
  users, 
  onRefresh, 
  onOpenInboxForPhone, 
  onGenerateSite 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [activeDrawerLead, setActiveDrawerLead] = useState(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkTagModal, setShowBulkTagModal] = useState(false);
  const [selectedTagToAdd, setSelectedTagToAdd] = useState('');

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    business_name: '',
    contact_person: '',
    category: 'Healthcare Clinic',
    city: 'Toronto',
    phone: '',
    email: '',
    address: '',
    status: 'NEW',
    tags: ['Hot Lead']
  });

  // Import State
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);

  // Note State in Drawer
  const [newNoteText, setNewNoteText] = useState('');

  // Status options
  const STATUSES = [
    { id: 'NEW', label: 'New Lead', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { id: 'QUALIFIED', label: 'Qualified', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { id: 'CONTACTED', label: 'Contacted', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { id: 'REPLIED', label: 'Replied', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { id: 'INTERESTED', label: 'Interested', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
    { id: 'FOLLOW_UP', label: 'Follow Up', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { id: 'MEETING_BOOKED', label: 'Meeting Booked', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { id: 'WON', label: 'Deal Won', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    { id: 'LOST', label: 'Lost / Closed', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    { id: 'OPTED_OUT', label: 'Opted Out', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
  ];

  // Filtering
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesTag = tagFilter === 'all' || (l.tags && l.tags.includes(tagFilter));
    return matchesSearch && matchesStatus && matchesTag;
  });

  const toggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    }
  };

  const toggleSelectLead = (id) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter(i => i !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  const handleBulkStatusChange = async (status) => {
    if (selectedLeadIds.length === 0) return;
    try {
      await bulkUpdateLeads({ lead_ids: selectedLeadIds, status });
      onRefresh();
      setSelectedLeadIds([]);
    } catch (err) {
      alert('Error updating leads: ' + err.message);
    }
  };

  const handleBulkAddTag = async () => {
    if (!selectedTagToAdd || selectedLeadIds.length === 0) return;
    try {
      await bulkUpdateLeads({ lead_ids: selectedLeadIds, add_tags: [selectedTagToAdd] });
      setShowBulkTagModal(false);
      setSelectedTagToAdd('');
      onRefresh();
      setSelectedLeadIds([]);
    } catch (err) {
      alert('Error adding tag: ' + err.message);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addLead(newLeadForm);
      setShowAddModal(false);
      onRefresh();
      setNewLeadForm({
        business_name: '',
        contact_person: '',
        category: 'Healthcare Clinic',
        city: 'Toronto',
        phone: '',
        email: '',
        address: '',
        status: 'NEW',
        tags: ['Hot Lead']
      });
    } catch (err) {
      alert('Error adding lead: ' + err.message);
    }
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setImporting(true);
    try {
      // Parse CSV format (Name, Phone, City, Category, Email)
      const lines = importText.trim().split('\n');
      const rows = [];
      for (const line of lines) {
        const parts = line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2) {
          rows.push({
            business_name: parts[0],
            phone: parts[1],
            city: parts[2] || 'Toronto',
            category: parts[3] || 'Healthcare Clinic',
            email: parts[4] || ''
          });
        }
      }
      if (rows.length === 0) {
        alert('Please paste valid CSV lines (Name, Phone, City, Category, Email)');
        setImporting(false);
        return;
      }
      const res = await importLeads({ leads: rows });
      alert(`Import Successful! ${res.data.imported_count} leads imported (${res.data.duplicates_skipped} duplicates skipped).`);
      setShowImportModal(false);
      setImportText('');
      onRefresh();
    } catch (err) {
      alert('Import failed: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleAddNoteToDrawerLead = async () => {
    if (!activeDrawerLead || !newNoteText.trim()) return;
    const note = {
      id: `note-${Date.now()}`,
      author: 'Devesh Kumar',
      text: newNoteText.trim(),
      created_at: new Date().toISOString()
    };
    const updatedNotes = [note, ...(activeDrawerLead.internal_notes || [])];
    try {
      const updated = await updateLead(activeDrawerLead.id, { internal_notes: updatedNotes });
      setActiveDrawerLead(updated.data);
      setNewNoteText('');
      onRefresh();
    } catch (err) {
      alert('Error adding note: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-indigo-400" />
              <span>Centralized CRM & Lead Directory</span>
            </h2>
            <span className="bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full text-xs border border-indigo-500/30">
              {filteredLeads.length} Leads
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track customer stages, bulk broadcast outreach, assign team members, and manage verified WhatsApp contacts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Import CSV</span>
          </button>

          <a
            href={getExportCsvUrl()}
            download
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search business, phone, city..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses ({leads.length})</option>
            {STATUSES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Tags ({tags.length})</option>
            {tags.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end">
          <span className="text-xs text-slate-400">
            Selected: <strong className="text-indigo-400">{selectedLeadIds.length}</strong> of {filteredLeads.length}
          </span>
        </div>
      </div>

      {/* Floating Bulk Action Bar when items selected */}
      {selectedLeadIds.length > 0 && (
        <div className="bg-indigo-950/80 border border-indigo-700/60 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-white font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            <span>{selectedLeadIds.length} leads selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowBulkTagModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Add Tag</span>
            </button>

            <select
              onChange={e => handleBulkStatusChange(e.target.value)}
              defaultValue=""
              className="bg-slate-900 border border-indigo-700/60 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium focus:outline-none"
            >
              <option value="" disabled>Change Status...</option>
              {STATUSES.map(s => (
                <option key={s.id} value={s.id}>Move to {s.label}</option>
              ))}
            </select>

            <button
              onClick={() => setSelectedLeadIds([])}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4 w-10">
                  <button onClick={toggleSelectAll} className="flex items-center">
                    {selectedLeadIds.length > 0 && selectedLeadIds.length === filteredLeads.length ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                </th>
                <th className="p-4">Business Name & Category</th>
                <th className="p-4">Location</th>
                <th className="p-4">Contact & WhatsApp</th>
                <th className="p-4">Lead Score</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    No leads found matching current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedLeadIds.includes(lead.id);
                  const statusObj = STATUSES.find(s => s.id === lead.status) || STATUSES[0];

                  return (
                    <tr 
                      key={lead.id} 
                      className={`hover:bg-slate-800/40 transition cursor-pointer ${isSelected ? 'bg-indigo-950/20' : ''}`}
                      onClick={() => setActiveDrawerLead(lead)}
                    >
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <button onClick={() => toggleSelectLead(lead.id)} className="flex items-center">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      <td className="p-4 font-medium text-white">
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                          <span>{lead.business_name}</span>
                          {lead.is_verified_real && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Verified Real Physical Business" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{lead.category}</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{lead.city}, {lead.country || 'Canada'}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate block max-w-[180px]">{lead.address}</span>
                      </td>

                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 font-mono text-indigo-300">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lead.phone || 'No phone'}</span>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span className="truncate max-w-[150px]">{lead.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                            lead.lead_score >= 80 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            lead.lead_score >= 60 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-slate-700 text-slate-300'
                          }`}>
                            {lead.lead_score}/100
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          ★ {lead.rating} ({lead.review_count} reviews)
                        </span>
                      </td>

                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={async (e) => {
                            await updateLead(lead.id, { status: e.target.value });
                            onRefresh();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border focus:outline-none cursor-pointer ${statusObj.color}`}
                        >
                          {STATUSES.map(s => (
                            <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(lead.tags || []).slice(0, 2).map((t, i) => (
                            <span key={i} className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-md text-[10px] font-medium">
                              {t}
                            </span>
                          ))}
                          {(lead.tags || []).length > 2 && (
                            <span className="text-[10px] text-slate-500">+{lead.tags.length - 2}</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenInboxForPhone && onOpenInboxForPhone(lead.phone)}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition"
                            title="Chat on WhatsApp Team Inbox"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => setActiveDrawerLead(lead)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                            title="View Full Profile & Timeline"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Profile Drawer */}
      {activeDrawerLead && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-wider">
                  Lead Profile
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                  <span>{activeDrawerLead.business_name}</span>
                  {activeDrawerLead.is_verified_real && (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  )}
                </h3>
                <p className="text-xs text-slate-400">{activeDrawerLead.category} • {activeDrawerLead.city}, {activeDrawerLead.country}</p>
              </div>

              <button
                onClick={() => setActiveDrawerLead(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  if (onOpenInboxForPhone) onOpenInboxForPhone(activeDrawerLead.phone);
                  setActiveDrawerLead(null);
                }}
                className="flex items-center justify-center gap-2 p-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-400 rounded-xl font-semibold text-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open in Team Inbox</span>
              </button>

              <button
                onClick={() => {
                  if (onGenerateSite) onGenerateSite(activeDrawerLead.id);
                  setActiveDrawerLead(null);
                }}
                className="flex items-center justify-center gap-2 p-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 rounded-xl font-semibold text-xs transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Generate Demo Site</span>
              </button>
            </div>

            {/* Lead Details Card */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-400">Lead Attributes</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block">Phone</span>
                  <span className="text-slate-200 font-mono font-medium">{activeDrawerLead.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Email</span>
                  <span className="text-slate-200">{activeDrawerLead.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Lead Score</span>
                  <span className="text-indigo-400 font-bold">{activeDrawerLead.lead_score}/100</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Rating</span>
                  <span className="text-amber-400 font-bold">★ {activeDrawerLead.rating} ({activeDrawerLead.review_count} reviews)</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">Physical Address</span>
                  <span className="text-slate-300">{activeDrawerLead.address}</span>
                </div>
                {activeDrawerLead.google_maps_url && (
                  <div className="col-span-2">
                    <a 
                      href={activeDrawerLead.google_maps_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Internal Team Notes */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-400">Internal Team Notes</h4>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Add private note (e.g. called owner, prefers email)..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleAddNoteToDrawerLead}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs"
                >
                  Save
                </button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(activeDrawerLead.internal_notes || []).length === 0 ? (
                  <p className="text-slate-500 text-[11px] italic">No internal notes yet.</p>
                ) : (
                  activeDrawerLead.internal_notes.map((n, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                        <span className="font-semibold text-slate-300">{n.author}</span>
                        <span>{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-200 text-xs">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px] text-slate-400">Activity Timeline</h4>
              <div className="space-y-3 pl-2 border-l-2 border-slate-800">
                {(activeDrawerLead.timeline || []).map((t, idx) => (
                  <div key={idx} className="relative pl-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 absolute -left-[18px] top-1"></span>
                    <span className="text-[10px] text-slate-500 block">{new Date(t.timestamp).toLocaleDateString()}</span>
                    <span className="font-bold text-slate-200 block">{t.title}</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add New CRM Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.business_name}
                  onChange={e => setNewLeadForm({ ...newLeadForm, business_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">WhatsApp Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+1 (416) 555-0199 or +91 98290 12890"
                  value={newLeadForm.phone}
                  onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={newLeadForm.city}
                    onChange={e => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={newLeadForm.category}
                    onChange={e => setNewLeadForm({ ...newLeadForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={newLeadForm.email}
                  onChange={e => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Import Leads from CSV / Text</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste CSV data line by line in the format: <br />
              <code className="text-indigo-300 font-mono">Business Name, Phone Number, City, Category, Email</code>
            </p>

            <textarea
              rows="6"
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="York Clinic, +1 416-555-0101, Toronto, Medical Clinic, york@clinic.com&#10;Bloor Health, +1 416-555-0102, Toronto, Wellness, info@bloor.ca"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                disabled={importing}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                {importing ? 'Importing...' : 'Start Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Tag Modal */}
      {showBulkTagModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Apply Tag in Bulk</h3>
            <p className="text-xs text-slate-400">Select a tag to assign to {selectedLeadIds.length} selected leads:</p>

            <select
              value={selectedTagToAdd}
              onChange={e => setSelectedTagToAdd(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
            >
              <option value="">Select a Tag...</option>
              {tags.map(t => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowBulkTagModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAddTag}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
              >
                Apply Tag
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
