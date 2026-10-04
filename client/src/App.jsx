import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import ProspectsView from './components/ProspectsView';
import SiteStudioView from './components/SiteStudioView';
import OutreachView from './components/OutreachView';
import InboxCRMView from './components/InboxCRMView';
import SettingsView from './components/SettingsView';
import AutonomousModal from './components/AutonomousModal';
import { 
  getProspects, 
  getLogs, 
  getConfig, 
  runAutonomousPipeline, 
  getPipelineStatus,
  runDiscoverSkill,
  runGenerateSkill,
  runOutreachSkill,
  runWhatsAppOutreachSkill,
  updateProspect,
  deleteProspect,
  addProspect
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [prospects, setProspects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [config, setConfig] = useState(null);
  const [selectedProspect, setSelectedProspect] = useState(null);
  const [preselectedLog, setPreselectedLog] = useState(null);
  
  // Pipeline State
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Poll pipeline status if running
  useEffect(() => {
    let interval = null;
    if (pipelineStatus?.running || isPipelineModalOpen) {
      interval = setInterval(async () => {
        try {
          const res = await getPipelineStatus();
          setPipelineStatus(res.data);
          if (!res.data.running && pipelineStatus?.running) {
            // Pipeline just finished!
            loadInitialData();
          }
        } catch (err) {
          console.error('Error polling pipeline status:', err);
        }
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pipelineStatus?.running, isPipelineModalOpen]);

  const loadInitialData = async () => {
    try {
      const [prospectsRes, logsRes, configRes, statusRes] = await Promise.all([
        getProspects(),
        getLogs(),
        getConfig(),
        getPipelineStatus()
      ]);
      setProspects(prospectsRes.data);
      setLogs(logsRes.data);
      setConfig(configRes.data);
      setPipelineStatus(statusRes.data);
      if (prospectsRes.data.length > 0 && !selectedProspect) {
        setSelectedProspect(prospectsRes.data[0]);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  const handleRunPipeline = async () => {
    try {
      setIsPipelineModalOpen(true);
      await runAutonomousPipeline();
      const statusRes = await getPipelineStatus();
      setPipelineStatus(statusRes.data);
    } catch (err) {
      alert('Error initiating pipeline: ' + err.message);
    }
  };

  const handleDiscover = async () => {
    try {
      const res = await runDiscoverSkill({
        city: config?.target_city,
        niche: config?.business_niche,
        limit: config?.max_leads_per_day || 10
      });
      alert(`Discovery Complete! Found ${res.data.discovered_count} qualified businesses lacking websites in ${res.data.city}!`);
      loadInitialData();
    } catch (err) {
      alert('Error running discovery skill: ' + err.message);
    }
  };

  const handleGenerateSite = async (prospectId) => {
    try {
      await runGenerateSkill(prospectId);
      const p = prospects.find(item => item.id === prospectId);
      if (p) setSelectedProspect(p);
      setActiveTab('studio');
      loadInitialData();
    } catch (err) {
      alert('Error generating demo site: ' + err.message);
    }
  };

  const handleSendOutreach = async (prospectId) => {
    try {
      await runOutreachSkill(prospectId, {});
      alert('Outreach email dispatched successfully!');
      loadInitialData();
    } catch (err) {
      alert('Error sending outreach: ' + err.message);
    }
  };

  const handleSendWhatsAppOutreach = async (prospectId) => {
    try {
      const res = await runWhatsAppOutreachSkill(prospectId, {});
      if (res.data?.wa_web_link) {
        window.open(res.data.wa_web_link, '_blank');
      }
      alert(`WhatsApp outreach logged! Ready to send to ${res.data?.prospect?.business_name || 'prospect'}.`);
      loadInitialData();
    } catch (err) {
      alert('Error initiating WhatsApp outreach: ' + err.message);
    }
  };

  const handleUpdateStatus = async (prospectId, status) => {
    try {
      await updateProspect(prospectId, { status });
      loadInitialData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDeleteProspect = async (prospectId) => {
    if (!window.confirm('Are you sure you want to remove this prospect?')) return;
    try {
      await deleteProspect(prospectId);
      loadInitialData();
    } catch (err) {
      alert('Error deleting prospect: ' + err.message);
    }
  };

  const handleAddProspect = async (prospectData) => {
    try {
      await addProspect(prospectData);
      loadInitialData();
    } catch (err) {
      alert('Error adding prospect: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onRunPipeline={handleRunPipeline}
        isPipelineRunning={pipelineStatus?.running}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            prospects={prospects}
            logs={logs}
            config={config}
            onRunPipeline={handleRunPipeline}
            setActiveTab={setActiveTab}
            onSelectProspectForStudio={(p) => {
              setSelectedProspect(p);
              setActiveTab('studio');
            }}
          />
        )}

        {activeTab === 'prospects' && (
          <ProspectsView
            prospects={prospects}
            onRefresh={loadInitialData}
            onDiscover={handleDiscover}
            onAddProspect={handleAddProspect}
            onUpdateStatus={handleUpdateStatus}
            onDeleteProspect={handleDeleteProspect}
            onGenerateSite={handleGenerateSite}
            onSendOutreach={handleSendOutreach}
            onSendWhatsAppOutreach={handleSendWhatsAppOutreach}
            onSelectForStudio={(p) => {
              setSelectedProspect(p);
              setActiveTab('studio');
            }}
          />
        )}

        {activeTab === 'studio' && (
          <SiteStudioView
            prospects={prospects}
            selectedProspect={selectedProspect}
            onSelectProspect={setSelectedProspect}
            onSendOutreach={handleSendOutreach}
          />
        )}

        {activeTab === 'outreach' && (
          <OutreachView
            prospects={prospects}
            logs={logs}
            config={config}
            onRefreshLogs={loadInitialData}
            onSimulateReplyClick={(log) => {
              setPreselectedLog(log);
              setActiveTab('inbox');
            }}
          />
        )}

        {activeTab === 'inbox' && (
          <InboxCRMView
            logs={logs}
            prospects={prospects}
            onRefreshData={loadInitialData}
            preselectedLog={preselectedLog}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            config={config}
            onConfigSaved={(updated) => setConfig(updated)}
          />
        )}
      </main>

      {/* Autonomous Pipeline Modal */}
      <AutonomousModal
        isOpen={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
        pipelineStatus={pipelineStatus}
        onRefreshData={loadInitialData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        SiteSeller Agent • Autonomous Web Agency Lead-Generation & Demo Engine • CAN-SPAM Compliant
      </footer>

    </div>
  );
}
