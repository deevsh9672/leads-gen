import React from 'react';
import { 
  Users, 
  Globe, 
  Send, 
  MessageSquare, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export default function DashboardView({ 
  prospects, 
  logs, 
  config, 
  onRunPipeline, 
  setActiveTab, 
  onSelectProspectForStudio 
}) {
  const totalProspects = prospects.length;
  const noWebsiteProspects = prospects.filter(p => p.has_website === 'no').length;
  const contactedCount = prospects.filter(p => p.status === 'contacted').length;
  const repliedCount = prospects.filter(p => p.status === 'replied').length;
  const clientCount = prospects.filter(p => p.status === 'client').length;
  const emailsSent = logs.length;
  
  // Pipeline Value ($499 per client + $150 per replied lead)
  const pipelineValue = (clientCount * 499) + (repliedCount * 150);

  const stats = [
    {
      label: 'Prospects (No Website)',
      value: noWebsiteProspects,
      sub: `${totalProspects} total in database`,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      badge: '100% Qualified'
    },
    {
      label: 'Outreach Dispatched',
      value: emailsSent,
      sub: `${contactedCount} prospects reached`,
      icon: Send,
      color: 'from-purple-500 to-pink-600',
      badge: 'CAN-SPAM Verified'
    },
    {
      label: 'Replies & Clients',
      value: repliedCount + clientCount,
      sub: `${clientCount} signed clients`,
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Active Deals'
    },
    {
      label: 'Pipeline Value',
      value: `$${pipelineValue.toLocaleString()}`,
      sub: 'Based on $499 standard pkg',
      icon: DollarSign,
      color: 'from-amber-500 to-orange-600',
      badge: 'Revenue Potential'
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Hero Superagent Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous Lead-Generation & Demo Engine
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              SiteSeller Superagent Command Center
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Continuously finds local businesses with <strong className="text-white">no website</strong>, automatically builds bespoke high-converting demo websites, delivers personalized outreach via Gmail, and handles replies to close web agency clients.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                CAN-SPAM Act Compliant
              </span>
              <span>•</span>
              <span>Targeting: <strong className="text-indigo-300">{config?.business_niche || 'Plumbers'}</strong> in <strong className="text-indigo-300">{config?.target_city || 'Austin'}</strong></span>
              <span>•</span>
              <span>Daily Quota: <strong className="text-white">{config?.max_leads_per_day || 25} leads/day</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={onRunPipeline}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Launch 1-Click Superagent Cycle</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition"
            >
              Configure City & Niche Settings
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg hover:border-slate-700 transition">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {stat.badge}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-400 mt-1">{stat.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Funnel Visualizer */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Superagent Conversion Funnel</span>
            </h2>
            <p className="text-xs text-slate-400">Progression from discovery to signed agency client</p>
          </div>
          <button 
            onClick={() => setActiveTab('prospects')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>View All Prospects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Discovered', count: totalProspects, color: 'text-blue-400', border: 'border-blue-500/30' },
            { label: 'Scored (1-100)', count: prospects.filter(p => p.lead_score >= 60).length, color: 'text-indigo-400', border: 'border-indigo-500/30' },
            { label: 'Demo Built', count: prospects.filter(p => p.status !== 'new' || p.lead_score >= 80).length, color: 'text-purple-400', border: 'border-purple-500/30' },
            { label: 'Contacted', count: contactedCount, color: 'text-amber-400', border: 'border-amber-500/30' },
            { label: 'Replied', count: repliedCount, color: 'text-teal-400', border: 'border-teal-500/30' },
            { label: 'Client Closed', count: clientCount, color: 'text-emerald-400', border: 'border-emerald-500/30' }
          ].map((stage, i) => (
            <div key={i} className={`p-4 rounded-xl bg-slate-950/60 border ${stage.border} flex flex-col items-center text-center`}>
              <span className={`text-2xl font-black ${stage.color}`}>{stage.count}</span>
              <span className="text-xs font-semibold text-slate-300 mt-1">{stage.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Hot Leads Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Highest Opportunity Prospects (Without Website)</span>
            </h2>
            <p className="text-xs text-slate-400">Ranked by review trust, category search demand, and estimated conversion likelihood</p>
          </div>
          <button 
            onClick={() => setActiveTab('prospects')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Business Name</th>
                <th className="pb-3 font-semibold">Category & City</th>
                <th className="pb-3 font-semibold">Reviews</th>
                <th className="pb-3 font-semibold">Lead Score</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {prospects.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      {p.business_name.charAt(0)}
                    </div>
                    <span>{p.business_name}</span>
                  </td>
                  <td className="py-3.5 text-slate-300">
                    <div>{p.category}</div>
                    <div className="text-[10px] text-slate-500">{p.city}</div>
                  </td>
                  <td className="py-3.5 text-slate-300">
                    <span className="font-semibold text-amber-400">★ {p.rating || 4.8}</span>
                    <span className="text-slate-500 text-[10px] ml-1">({p.review_count || 30} reviews)</span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-10 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full" 
                          style={{ width: `${p.lead_score}%` }}
                        />
                      </div>
                      <span className="font-bold text-white">{p.lead_score}/100</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'client' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      p.status === 'replied' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' :
                      p.status === 'contacted' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      p.status === 'opted-out' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => {
                        onSelectProspectForStudio(p);
                        setActiveTab('studio');
                      }}
                      className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold transition"
                    >
                      View AI Demo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
