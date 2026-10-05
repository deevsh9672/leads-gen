import React, { useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  CircleDot, 
  AlertCircle, 
  Terminal, 
  X, 
  Sparkles, 
  Search, 
  BarChart3, 
  Layers, 
  Server, 
  Send, 
  FileText, 
  MessageSquare
} from 'lucide-react';

export default function AutonomousModal({ isOpen, onClose, pipelineStatus, onRefreshData }) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pipelineStatus?.logs]);

  if (!isOpen) return null;

  const steps = [
    { id: 'discovering', label: '1. Discover', icon: Search, desc: 'Querying local businesses without websites' },
    { id: 'scoring', label: '2. Score', icon: BarChart3, desc: 'Evaluating 1-100 opportunity value & review trust' },
    { id: 'generating', label: '3. Generate', icon: Layers, desc: 'Building category-tailored responsive demo site' },
    { id: 'hosting', label: '4. Host', icon: Server, desc: 'Publishing live demo link at /demos/:id' },
    { id: 'outreaching', label: '5. Outreach', icon: Send, desc: 'Simultaneous Email + WhatsApp direct dispatch with live demo link' },
    { id: 'logging', label: '6. Log', icon: FileText, desc: 'Recording dual-channel audit in CRM log' },
    { id: 'reply_ready', label: '7. Reply Monitor', icon: MessageSquare, desc: 'Listening for client email & WhatsApp responses' },
  ];

  const currentStage = pipelineStatus?.stage || 'idle';
  const isRunning = pipelineStatus?.running;
  const isCompleted = currentStage === 'completed';
  const isError = currentStage === 'error';
  const progress = pipelineStatus?.progress || 0;
  const logs = pipelineStatus?.logs || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>Autonomous Superagent Pipeline</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono">
                  {isRunning ? 'EXECUTING' : isCompleted ? 'CYCLE FINISHED' : 'READY'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">7-Skill Autonomous Engine for Local Web Client Acquisition</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (onRefreshData) onRefreshData();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pipeline Stepper & Progress */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Overall Autonomous Progress</span>
            <span className="font-mono text-indigo-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-6">
            <div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stepper Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = progress > (idx + 1) * 14 || isCompleted;
              const isCurrent = currentStage === step.id;

              return (
                <div 
                  key={step.id} 
                  className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                    isCurrent 
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30' 
                      : isPast 
                      ? 'bg-slate-800/60 border-emerald-500/40 text-emerald-400' 
                      : 'bg-slate-900 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1 bg-slate-800">
                    {isPast ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[11px] font-bold truncate w-full">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Terminal Log Stream */}
        <div className="p-4 flex-1 flex flex-col bg-slate-950 overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-500 text-[11px]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>SUPERAGENT REAL-TIME TELEMETRY</span>
            </div>
            <span>{logs.length} events logged</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-2">
            {logs.length === 0 ? (
              <div className="text-slate-600 italic py-8 text-center">
                Waiting for pipeline events to stream...
              </div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 text-[10px] shrink-0 mt-0.5">[{log.timestamp}]</span>
                  <span className={
                    log.type === 'error' ? 'text-rose-400 font-bold' :
                    log.type === 'success' ? 'text-emerald-400' :
                    log.type === 'warning' ? 'text-amber-400' : 'text-slate-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Footer / Summary */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {pipelineStatus?.summary ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Done! Discovered: {pipelineStatus.summary.discovered_count} | Sites: {pipelineStatus.summary.sites_generated} | Emails: {pipelineStatus.summary.emails_sent}
              </span>
            ) : (
              <span>Autonomous cycle updates your database & CRM in real time.</span>
            )}
          </div>
          <button
            onClick={() => {
              if (onRefreshData) onRefreshData();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            {isRunning ? 'Run in Background' : 'Close & View Results'}
          </button>
        </div>

      </div>
    </div>
  );
}
