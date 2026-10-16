import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import CrmLeadsView from './components/crm/CrmLeadsView';
import KanbanPipelineView from './components/crm/KanbanPipelineView';
import SharedInboxView from './components/inbox/SharedInboxView';
import CampaignsView from './components/campaigns/CampaignsView';
import AutomationsView from './components/automations/AutomationsView';
import WhatsAppSettingsView from './components/settings/WhatsAppSettingsView';
import SiteStudioView from './components/SiteStudioView';
import OutreachView from './components/OutreachView';
import AutonomousModal from './components/AutonomousModal';
import { 
  getLeads, 
  getProspects, 
  getTags, 
  getUsers, 
  getLogs, 
  getConfig, 
  getConversations,
  runAutonomousPipeline, 
  getPipelineStatus,
  runDiscoverSkill,
  runGenerateSkill,
  runOutreachSkill,
  runWhatsAppOutreachSkill,
  runBothOutreachSkill
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('crm');
  const [leads, setLeads] = useState([]);
  const [tags, setTags] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [config, setConfig] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedLeadForStudio, setSelectedLeadForStudio] = useState(null);
  const [inboxTargetPhone, setInboxTargetPhone] = useState(null);
  
  // Pipeline State
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState(null);

  useEffect(() => {
    loadInitialData();

    // Connect real-time socket.io client
    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
    const socket = io(socketUrl, { transports: ['websocket', 'polling'] });

    socket.on('inbox:message_received', () => {
      loadInitialData();
    });

    socket.on('lead:created', () => {
      loadInitialData();
    });

    socket.on('lead:updated', () => {
      loadInitialData();
    });

    socket.on('campaign:progress', () => {
      loadInitialData();
    });

    return () => {
      socket.disconnect();
    };
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
      const [leadsRes, tagsRes, usersRes, logsRes, configRes, convRes, statusRes] = await Promise.all([
        getLeads(),
        getTags(),
        getUsers(),
        getLogs(),
        getConfig(),
        getConversations(),
        getPipelineStatus()
      ]);
      setLeads(leadsRes.data);
      setTags(tagsRes.data);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
      setConfig(configRes.data);
      setConversations(convRes.data);
      setPipelineStatus(statusRes.data);
      if (leadsRes.data.length > 0 && !selectedLeadForStudio) {
        setSelectedLeadForStudio(leadsRes.data[0]);
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

  const handleGenerateSite = async (leadId) => {
    try {
      await runGenerateSkill(leadId);
      const l = leads.find(item => item.id === leadId);
      if (l) setSelectedLeadForStudio(l);
      setActiveTab('studio');
      loadInitialData();
    } catch (err) {
      alert('Error generating demo site: ' + err.message);
    }
  };

  const handleOpenInboxForPhone = (phone) => {
    setInboxTargetPhone(phone);
    setActiveTab('inbox');
  };

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onRunPipeline={handleRunPipeline}
        isPipelineRunning={pipelineStatus?.running}
        unreadCount={unreadMessagesCount}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: CRM LEADS */}
        {activeTab === 'crm' && (
          <CrmLeadsView
            leads={leads}
            tags={tags}
            users={users}
            onRefresh={loadInitialData}
            onOpenInboxForPhone={handleOpenInboxForPhone}
            onGenerateSite={handleGenerateSite}
          />
        )}

        {/* TAB 2: VISUAL SALES PIPELINE (KANBAN) */}
        {activeTab === 'pipeline' && (
          <KanbanPipelineView
            leads={leads}
            onRefresh={loadInitialData}
            onOpenLead={(lead) => {
              handleOpenInboxForPhone(lead.phone);
            }}
          />
        )}

        {/* TAB 3: WATI-STYLE SHARED TEAM INBOX */}
        {activeTab === 'inbox' && (
          <SharedInboxView
            users={users}
            onRefreshAll={loadInitialData}
            initialPhoneFilter={inboxTargetPhone}
          />
        )}

        {/* TAB 4: WHATSAPP BROADCAST CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <CampaignsView
            leads={leads}
            tags={tags}
            onRefreshAll={loadInitialData}
          />
        )}

        {/* TAB 5: AUTOMATIONS & N8N WORKFLOWS */}
        {activeTab === 'automations' && (
          <AutomationsView />
        )}

        {/* TAB 6: SUPERAGENT OPS & ANALYTICS */}
        {activeTab === 'dashboard' && (
          <DashboardView
            prospects={leads}
            logs={logs}
            config={config}
            onRunPipeline={handleRunPipeline}
            setActiveTab={setActiveTab}
            onSelectProspectForStudio={(p) => {
              setSelectedLeadForStudio(p);
              setActiveTab('studio');
            }}
          />
        )}

        {/* TAB 7: AI SITE STUDIO */}
        {activeTab === 'studio' && (
          <SiteStudioView
            prospects={leads}
            selectedProspect={selectedLeadForStudio}
            onSelectProspect={setSelectedLeadForStudio}
            onSendOutreach={async (id) => {
              await runOutreachSkill(id, {});
              alert('Outreach email dispatched!');
              loadInitialData();
            }}
            onSendWhatsAppOutreach={async (id) => {
              const res = await runWhatsAppOutreachSkill(id, {});
              if (res.data?.wa_web_link) window.open(res.data.wa_web_link, '_blank');
              loadInitialData();
            }}
            onSendBothOutreach={async (id) => {
              const res = await runBothOutreachSkill(id, {});
              if (res.data?.wa_web_link) window.open(res.data.wa_web_link, '_blank');
              loadInitialData();
            }}
          />
        )}

        {/* TAB 8: OUTREACH & LOGS */}
        {activeTab === 'outreach' && (
          <OutreachView
            prospects={leads}
            logs={logs}
            config={config}
            onRefreshLogs={loadInitialData}
            onSendBothOutreach={async (id) => {
              const res = await runBothOutreachSkill(id, {});
              if (res.data?.wa_web_link) window.open(res.data.wa_web_link, '_blank');
              loadInitialData();
            }}
            onSimulateReplyClick={() => {
              setActiveTab('inbox');
            }}
          />
        )}

        {/* TAB 9: SETTINGS & WHATSAPP CONFIG */}
        {activeTab === 'settings' && (
          <WhatsAppSettingsView />
        )}

      </main>

      {/* Autonomous Pipeline Kickoff Modal */}
      <AutonomousModal
        isOpen={isPipelineModalOpen}
        onClose={() => setIsPipelineModalOpen(false)}
        pipelineStatus={pipelineStatus}
        onRefreshData={loadInitialData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        SiteSeller Agent • WhatsApp Marketing, WATI-Style CRM & Lead Management SaaS Platform • Meta & CAN-SPAM Compliant
      </footer>

    </div>
  );
}
