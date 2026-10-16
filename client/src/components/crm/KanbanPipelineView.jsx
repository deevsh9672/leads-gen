import React from 'react';
import { 
  Kanban, 
  Phone, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  Star, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { updateLead } from '../../api';

export default function KanbanPipelineView({ leads, onRefresh, onOpenLead }) {
  const COLUMNS = [
    { id: 'NEW', title: 'New Leads', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { id: 'QUALIFIED', title: 'Qualified', color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' },
    { id: 'CONTACTED', title: 'Contacted', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { id: 'REPLIED', title: 'Replied', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
    { id: 'INTERESTED', title: 'Interested', color: 'border-teal-500/40 text-teal-400 bg-teal-500/10' },
    { id: 'FOLLOW_UP', title: 'Follow Up', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
    { id: 'MEETING_BOOKED', title: 'Meeting Booked', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10' },
    { id: 'WON', title: 'Deal Won 🎉', color: 'border-green-500/40 text-green-300 bg-green-500/20' },
    { id: 'LOST', title: 'Lost / Closed', color: 'border-slate-500/40 text-slate-400 bg-slate-500/10' }
  ];

  const handleMoveStage = async (leadId, targetStage) => {
    try {
      await updateLead(leadId, { status: targetStage });
      onRefresh();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Kanban className="w-6 h-6 text-indigo-400" />
            <span>Visual Sales Pipeline & Kanban Board</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Drag and move customer cards across stages from initial discovery to closed deals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
          <span>Total Pipeline Value:</span>
          <strong className="text-emerald-400 font-bold">{leads.length} Active Leads</strong>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar min-h-[600px]">
        {COLUMNS.map((col, colIdx) => {
          const colLeads = leads.filter(l => l.status === col.id);

          return (
            <div 
              key={col.id} 
              className="w-72 shrink-0 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col max-h-[750px] shadow-lg"
            >
              
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color.split(' ')[2]}`}></span>
                  <span className="font-bold text-xs text-white uppercase tracking-wider">{col.title}</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards Scroll Area */}
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {colLeads.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-800/60 rounded-xl text-slate-600 text-xs text-center p-3">
                    No leads in {col.title}
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-slate-900 border border-slate-800/90 hover:border-indigo-500/50 p-3.5 rounded-xl shadow-md transition space-y-2.5 group cursor-pointer"
                      onClick={() => onOpenLead && onOpenLead(lead)}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div>
                          <div className="font-bold text-xs text-white group-hover:text-indigo-400 transition flex items-center gap-1">
                            <span>{lead.business_name}</span>
                            {lead.is_verified_real && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block">{lead.category}</span>
                        </div>

                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          lead.lead_score >= 80 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {lead.lead_score}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center gap-1 font-mono text-indigo-300">
                          <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{lead.city}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {(lead.tags || []).slice(0, 2).map((t, idx) => (
                          <span key={idx} className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[9px]">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Stage Mover Buttons */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]" onClick={e => e.stopPropagation()}>
                        {colIdx > 0 ? (
                          <button
                            onClick={() => handleMoveStage(lead.id, COLUMNS[colIdx - 1].id)}
                            className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded hover:bg-slate-700 transition"
                            title={`Move back to ${COLUMNS[colIdx - 1].title}`}
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        ) : <div />}

                        <span className="text-[10px] text-slate-500">
                          ★ {lead.rating}
                        </span>

                        {colIdx < COLUMNS.length - 1 ? (
                          <button
                            onClick={() => handleMoveStage(lead.id, COLUMNS[colIdx + 1].id)}
                            className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded hover:bg-slate-700 transition"
                            title={`Advance to ${COLUMNS[colIdx + 1].title}`}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : <div />}
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
