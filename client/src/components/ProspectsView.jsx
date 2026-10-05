import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Sparkles, 
  Globe, 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Info, 
  Filter,
  Trash2,
  ExternalLink,
  ChevronDown,
  MessageCircle,
  Database,
  Compass,
  Zap
} from 'lucide-react';

export default function ProspectsView({ 
  prospects, 
  onRefresh, 
  onDiscover, 
  onAddProspect, 
  onUpdateStatus, 
  onDeleteProspect,
  onGenerateSite,
  onSendOutreach,
  onSendWhatsAppOutreach,
  onSelectForStudio
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDiscoverModal, setShowDiscoverModal] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [selectedBreakdown, setSelectedBreakdown] = useState(null);

  // Discover Parameters State
  const [discoverForm, setDiscoverForm] = useState({
    city: 'Jaipur',
    niche: 'Cafe',
    source: 'auto',
    limit: 10
  });

  // New Prospect Form State
  const [newProspect, setNewProspect] = useState({
    business_name: '',
    category: 'Cafe',
    city: 'Jaipur',
    phone: '',
    email: '',
    has_website: 'no',
    review_count: 35,
    rating: 4.8
  });

  const filtered = prospects.filter(p => {
    const matchesSearch = 
      p.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddProspect(newProspect);
    setShowAddModal(false);
    setNewProspect({
      business_name: '',
      category: 'Plumbing',
      city: 'Austin',
      phone: '',
      email: '',
      has_website: 'no',
      review_count: 35,
      rating: 4.8
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Prospects & Lead Intelligence Hub</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Local businesses verified with NO website. Ranked by algorithmic lead score (1–100).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowDiscoverModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Discover Qualified Leads (Apify / Apollo / OSM)</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prospect</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by business name, niche, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'new', 'contacted', 'replied', 'client', 'opted-out'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === st 
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Prospects Data Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Business Info</th>
                <th className="py-3 px-4 font-semibold">Contact & Location</th>
                <th className="py-3 px-4 font-semibold">Has Website?</th>
                <th className="py-3 px-4 font-semibold">Lead Score (1-100)</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Superagent Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No prospects found matching your query. Click "Discover Qualified Leads" to pull more!
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const bd = p.score_breakdown;
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition">
                      
                      {/* Business Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                            {p.business_name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{p.business_name}</div>
                            <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                              <span className="text-indigo-400 font-medium">{p.category}</span>
                              <span>•</span>
                              <span className="text-amber-400 font-medium">★ {p.rating || 4.8}</span>
                              <span className="text-slate-500">({p.review_count || 40} revs)</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                                (p.discovery_source || '').includes('Apify') 
                                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                  : (p.discovery_source || '').includes('Apollo')
                                  ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                  : (p.discovery_source || '').includes('OpenStreet')
                                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                              }`}>
                                <Database className="w-2.5 h-2.5" />
                                <span>{p.discovery_source || 'Smart AI Engine'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact & City */}
                      <td className="py-4 px-4 text-slate-300">
                        <div className="text-white font-medium">{p.city}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" />{p.phone || 'N/A'}</span>
                        </div>
                        <div className="text-slate-500 text-[10px] truncate max-w-[180px]">{p.email}</div>
                      </td>

                      {/* Has Website */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <span>NO WEBSITE</span>
                        </span>
                      </td>

                      {/* Lead Score */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-14 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                p.lead_score >= 80 ? 'bg-emerald-500' :
                                p.lead_score >= 60 ? 'bg-indigo-500' : 'bg-amber-500'
                              }`} 
                              style={{ width: `${p.lead_score}%` }}
                            />
                          </div>
                          <span className="font-black text-white text-xs">{p.lead_score}</span>
                          <button
                            onClick={() => setSelectedBreakdown(p)}
                            title="View Score Breakdown"
                            className="text-slate-500 hover:text-indigo-400 transition"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {bd?.tier || (p.lead_score >= 80 ? 'Hot Lead' : 'High Potential')}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <select
                          value={p.status}
                          onChange={(e) => onUpdateStatus(p.id, e.target.value)}
                          className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none transition bg-slate-950 ${
                            p.status === 'client' ? 'border-emerald-500/40 text-emerald-400' :
                            p.status === 'replied' ? 'border-teal-500/40 text-teal-400' :
                            p.status === 'contacted' ? 'border-amber-500/40 text-amber-400' :
                            p.status === 'opted-out' ? 'border-rose-500/40 text-rose-400' :
                            'border-slate-700 text-slate-300'
                          }`}
                        >
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="replied">replied</option>
                          <option value="client">client</option>
                          <option value="opted-out">opted-out</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              onSelectForStudio(p);
                              onGenerateSite(p.id);
                            }}
                            title="Generate / Open AI Demo Website (Skill 3 & 4)"
                            className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition"
                          >
                            <Globe className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => onSendOutreach(p.id)}
                            title="Send Outreach Email (Skill 5 & 6)"
                            className="p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white transition"
                          >
                            <Send className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onSendWhatsAppOutreach(p.id)}
                            title="Send WhatsApp Outreach with Demo Link (Direct to Client)"
                            className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition shadow-sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteProspect(p.id)}
                            title="Delete Prospect"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-500 hover:text-rose-400 transition"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Score Breakdown Modal */}
      {selectedBreakdown && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Lead Score Breakdown</h3>
              <button 
                onClick={() => setSelectedBreakdown(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-medium">Business Name</span>
                <span className="font-bold text-white">{selectedBreakdown.business_name}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-medium">Total Opportunity Score</span>
                <span className="font-black text-indigo-400 text-base">{selectedBreakdown.lead_score} / 100</span>
              </div>
              <div className="space-y-2 pt-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Reviews Volume Factor ({selectedBreakdown.review_count || 40} reviews):</span>
                  <span className="font-bold text-white">+{selectedBreakdown.score_breakdown?.review_score || 25} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Category High-Ticket Demand ({selectedBreakdown.category}):</span>
                  <span className="font-bold text-white">+{selectedBreakdown.score_breakdown?.category_score || 25} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Need Factor (Has No Website):</span>
                  <span className="font-bold text-white">+{selectedBreakdown.score_breakdown?.website_need_score || 25} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Reputation & Budget ({selectedBreakdown.rating || 4.8}★ rating):</span>
                  <span className="font-bold text-white">+{selectedBreakdown.score_breakdown?.reputation_score || 10} pts</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedBreakdown(null)}
              className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add Prospect Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add New Local Prospect</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 py-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lone Star Rooter Pros"
                  value={newProspect.business_name}
                  onChange={e => setNewProspect({ ...newProspect, business_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category / Niche *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plumbing, Dental, Roofing"
                    value={newProspect.category}
                    onChange={e => setNewProspect({ ...newProspect, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Austin"
                    value={newProspect.city}
                    onChange={e => setNewProspect({ ...newProspect, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="(512) 555-0199"
                    value={newProspect.phone}
                    onChange={e => setNewProspect({ ...newProspect, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="contact@business.com"
                    value={newProspect.email}
                    onChange={e => setNewProspect({ ...newProspect, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Review Count</label>
                  <input
                    type="number"
                    value={newProspect.review_count}
                    onChange={e => setNewProspect({ ...newProspect, review_count: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Star Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={newProspect.rating}
                    onChange={e => setNewProspect({ ...newProspect, rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save & Score Prospect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discover Qualified Leads Modal */}
      {showDiscoverModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Launch Multi-Source Lead Discovery</span>
              </div>
              <button 
                onClick={() => setShowDiscoverModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setDiscovering(true);
                try {
                  await onDiscover(discoverForm);
                  setShowDiscoverModal(false);
                } finally {
                  setDiscovering(false);
                }
              }}
              className="space-y-4 text-xs"
            >
              {/* Target City */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur, Austin, London, Mumbai"
                  value={discoverForm.city}
                  onChange={e => setDiscoverForm({ ...discoverForm, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Business Niche */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-400 font-semibold">Business Niche / Category *</label>
                  <span className="text-[10px] text-slate-500">Quick Select:</span>
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cafe, Restaurant, Salon, Gym, Roofer, Dentist"
                  value={discoverForm.niche}
                  onChange={e => setDiscoverForm({ ...discoverForm, niche: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Cafe', 'Restaurant', 'Salon & Spa', 'Fitness Gym', 'Real Estate', 'Clinic', 'Plumber', 'Bakery'].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setDiscoverForm({ ...discoverForm, niche: n })}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium border border-slate-700 transition"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discovery Source Selector */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Discovery Engine Source</label>
                <select
                  value={discoverForm.source}
                  onChange={e => setDiscoverForm({ ...discoverForm, source: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="auto">Auto Smart Cascade (Apify → Apollo.io → OpenStreetMap → Smart AI)</option>
                  <option value="apify">Apify Only (Google Maps / Places Scraper)</option>
                  <option value="apollo">Apollo.io Only (B2B Lead Intelligence API)</option>
                  <option value="osm">OpenStreetMap Only (Live Geo Query)</option>
                  <option value="smart">Smart AI Local Generator Only (Instant Zero-Delay Profiles)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Filters specifically for businesses without websites so you can pitch them modern website builds.
                </p>
              </div>

              {/* Lead Count */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Number of Leads to Fetch</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={discoverForm.limit}
                  onChange={e => setDiscoverForm({ ...discoverForm, limit: parseInt(e.target.value) || 10 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={discovering}
                  onClick={() => setShowDiscoverModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={discovering}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{discovering ? 'Crawling & Scoring Leads...' : 'Start Lead Discovery'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
