import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Zap, 
  LayoutDashboard, 
  Users, 
  Globe, 
  Send, 
  MessageSquare, 
  Settings,
  MapPin,
  Briefcase
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, config, onRunPipeline, isPipelineRunning }) {
  const tabs = [
    { id: 'dashboard', label: 'Superagent Ops', icon: LayoutDashboard },
    { id: 'prospects', label: 'Prospects Hub', icon: Users },
    { id: 'studio', label: 'AI Site Studio', icon: Globe },
    { id: 'outreach', label: 'Outreach & Logs', icon: Send },
    { id: 'inbox', label: 'Replies & CRM', icon: MessageSquare },
    { id: 'settings', label: 'LeadConfig', icon: Settings },
  ];

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">SiteSeller</span>
                <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30 uppercase tracking-wider">
                  Superagent AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Automated Web Agency Pipeline</p>
            </div>
          </div>

          {/* Active Target Banner */}
          <div className="hidden xl:flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 px-3.5 py-1.5 rounded-full text-xs text-slate-300">
            <span className="flex items-center gap-1 text-indigo-400 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              {config?.target_city || 'Austin'}, {config?.target_country || 'USA'}
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-purple-400 font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              {config?.business_niche || 'Plumbers'}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            <a
              href={`https://wa.me/${(config?.sender_whatsapp || '918920608191').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp Agency Line Connected (+91 8920608191)"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white transition shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">WhatsApp:</span>
              <span>+91 8920608191</span>
            </a>

            <button
              onClick={onRunPipeline}
              disabled={isPipelineRunning}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white shadow-lg transition-all ${
                isPipelineRunning 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed animate-pulse'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 hover:shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <Zap className={`w-4 h-4 ${isPipelineRunning ? 'animate-spin' : 'fill-white'}`} />
              <span>{isPipelineRunning ? 'Cycle Running...' : 'Run Autonomous Cycle'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          <div className="flex space-x-1 sm:space-x-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {onSwitchToCafe && (
            <button
              onClick={onSwitchToCafe}
              className="ml-3 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600/20 hover:bg-amber-600 border border-amber-500/40 text-amber-300 hover:text-stone-950 transition shadow-sm"
              title="Open Demo Café Website"
            >
              <span>☕ Demo Café Site</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/30 text-amber-200 rounded font-mono">DEMO</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
