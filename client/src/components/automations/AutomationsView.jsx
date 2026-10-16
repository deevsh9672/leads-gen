import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Settings, 
  Webhook, 
  Activity,
  Tag,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { 
  getWorkflows, 
  saveWorkflow, 
  triggerTestWorkflow, 
  getWorkflowExecutions 
} from '../../api';

export default function AutomationsView() {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [testingId, setTestingId] = useState(null);

  useEffect(() => {
    loadAutomationsData();
  }, []);

  const loadAutomationsData = async () => {
    try {
      const [wfRes, execRes] = await Promise.all([
        getWorkflows(),
        getWorkflowExecutions()
      ]);
      setWorkflows(wfRes.data);
      setExecutions(execRes.data);
    } catch (err) {
      console.error('Error loading automations:', err);
    }
  };

  const handleToggle = async (wf) => {
    try {
      await saveWorkflow({ ...wf, enabled: !wf.enabled });
      loadAutomationsData();
    } catch (err) {
      alert('Error updating workflow: ' + err.message);
    }
  };

  const handleRunTest = async (workflowId) => {
    setTestingId(workflowId);
    try {
      const res = await triggerTestWorkflow(workflowId);
      alert(`Workflow test completed!\nActions: ${res.data.actions_executed.join('\n')}`);
      loadAutomationsData();
    } catch (err) {
      alert('Test failed: ' + err.message);
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <span>Automated Follow-Up Engine & n8n Workflows</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Trigger automated actions, tasks, and follow-up templates when leads are created, reply on WhatsApp, or opt-out.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Active Rules: <strong className="text-amber-400 font-bold">{workflows.filter(w => w.enabled).length}</strong> of {workflows.length}
          </span>
        </div>
      </div>

      {/* Workflows List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className={`bg-slate-900/70 border rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition ${
              wf.enabled ? 'border-slate-800 hover:border-amber-500/40' : 'border-slate-800/40 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                  ⚡ {wf.trigger}
                </span>

                {/* Enable Switch */}
                <button
                  onClick={() => handleToggle(wf)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    wf.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    wf.enabled ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <h3 className="font-bold text-sm text-white">{wf.name}</h3>

              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Actions Sequence:</span>
                {wf.actions?.map((act, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                    <span className="text-amber-400 font-bold">›</span>
                    <span className="capitalize">{act.type.replace(/_/g, ' ')}:</span>
                    <strong className="text-indigo-300 font-normal">{act.tag || act.status || act.template_name || act.title}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[10px]">{new Date(wf.created_at).toLocaleDateString()}</span>
              <button
                onClick={() => handleRunTest(wf.id)}
                disabled={testingId === wf.id}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Play className="w-3 h-3 text-amber-400" />
                <span>{testingId === wf.id ? 'Testing...' : 'Test Run'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Execution History Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-3 p-5">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Recent Automation Execution Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Workflow</th>
                <th className="p-3">Trigger Event</th>
                <th className="p-3">Target Lead</th>
                <th className="p-3">Execution Details</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {executions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500">
                    No automation executions recorded yet. Triggers fire automatically upon lead events.
                  </td>
                </tr>
              ) : (
                executions.slice(0, 10).map((ex) => (
                  <tr key={ex.id} className="hover:bg-slate-800/30">
                    <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(ex.executed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3 font-semibold text-white">{ex.workflow_name}</td>
                    <td className="p-3 font-mono text-amber-300 text-[11px]">{ex.trigger_event}</td>
                    <td className="p-3 text-slate-300">{ex.target_lead_name || 'N/A'}</td>
                    <td className="p-3 text-slate-400 text-[11px] truncate max-w-xs">{ex.details}</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                        {ex.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
