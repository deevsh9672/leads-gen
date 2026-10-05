import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Download,
  Send,
  Eye,
  Layers,
  Phone
} from 'lucide-react';
import { getSiteForProspect, runGenerateSkill, runHostSkill } from '../api';

export default function SiteStudioView({ 
  prospects, 
  selectedProspect, 
  onSelectProspect, 
  onSendOutreach,
  onOpenCafeDemo
}) {
  const [activeProspectId, setActiveProspectId] = useState(
    selectedProspect?.id || (prospects[0]?.id || '')
  );
  const [viewport, setViewport] = useState('desktop'); // desktop, tablet, mobile
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedProspect?.id) {
      setActiveProspectId(selectedProspect.id);
    }
  }, [selectedProspect]);

  useEffect(() => {
    if (activeProspectId) {
      loadSite(activeProspectId);
    }
  }, [activeProspectId]);

  const currentProspect = prospects.find(p => p.id === activeProspectId) || prospects[0];

  const loadSite = async (prospectId) => {
    setLoading(true);
    try {
      const res = await getSiteForProspect(prospectId);
      setSiteData(res.data);
    } catch (err) {
      // If site doesn't exist yet, auto-generate it!
      try {
        const genRes = await runGenerateSkill(prospectId);
        setSiteData(genRes.data);
      } catch (genErr) {
        console.error('Error generating demo site:', genErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeProspectId) return;
    setLoading(true);
    try {
      const res = await runGenerateSkill(activeProspectId);
      setSiteData(res.data);
    } catch (err) {
      console.error('Error regenerating site:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    const urlToCopy = publicDemoUrl || siteData?.demo_url;
    if (!urlToCopy) return;
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    if (!siteData?.html_content) return;
    const blob = new Blob([siteData.html_content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProspect.business_name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_demo_website.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const backendOrigin = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? ''
    : 'https://leads-gen-b3uj.onrender.com';

  const demoUrl = siteData?.id ? `${backendOrigin}/demos/${siteData.id}` : null;

  const publicDemoUrl = siteData?.demo_url
    ? (siteData.demo_url.includes('localhost') && typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? siteData.demo_url.replace(/http:\/\/localhost:\d+/, 'https://leads-gen-b3uj.onrender.com')
        : siteData.demo_url)
    : demoUrl;

  return (
    <div className="space-y-6">
      
      {/* Studio Header & Prospect Selector */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">AI Demo Website Studio (Skill 3 & 4)</h2>
          </div>
          <p className="text-xs text-slate-400">
            Preview, customize, host, and inspect tailored modern websites generated for prospects.
          </p>
        </div>

        {/* Prospect Switcher Dropdown */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <span className="text-slate-500 font-semibold">Active Lead:</span>
            <select
              value={activeProspectId}
              onChange={(e) => {
                setActiveProspectId(e.target.value);
                const p = prospects.find(item => item.id === e.target.value);
                if (p && onSelectProspect) onSelectProspect(p);
              }}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              {prospects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.business_name} ({p.category})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Generating...' : 'Re-Generate'}</span>
          </button>

          {onOpenCafeDemo && (
            <button
              onClick={onOpenCafeDemo}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-950/40"
              title="Open full interactive luxury Café Demo Website"
            >
              <span>☕ View Café Demo Site</span>
              <span className="text-[10px] bg-stone-950/20 px-1.5 py-0.5 rounded text-stone-900 font-extrabold">DEMO</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Viewport Switcher & Links */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Device Viewport Switcher */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewport === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewport === 'tablet' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewport === 'mobile' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile (iPhone)</span>
          </button>
        </div>

        {/* Live URL & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {siteData?.demo_url && (
            <>
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied URL!' : 'Copy Demo Link'}</span>
              </button>

              <a
                href={publicDemoUrl || siteData.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl text-xs font-bold transition border border-emerald-500/30"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Live Demo</span>
              </a>
            </>
          )}

          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export HTML</span>
          </button>

          <button
            onClick={() => onSendOutreach(currentProspect.id)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Email This Demo</span>
          </button>
        </div>
      </div>

      {/* Embedded Device Frame Container */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-4 sm:p-8 flex items-center justify-center min-h-[680px] shadow-2xl relative overflow-hidden">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 text-slate-400 py-24">
            <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            <div className="font-bold text-white text-sm">Building AI Demo Website...</div>
            <div className="text-xs text-slate-500">Injecting hero section, services, testimonials, WhatsApp lead integration...</div>
          </div>
        ) : demoUrl ? (
          <div 
            className={`transition-all duration-300 bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-700 flex flex-col ${
              viewport === 'mobile' ? 'w-[390px] h-[780px] rounded-[42px] border-[8px] border-slate-800 ring-4 ring-slate-900' :
              viewport === 'tablet' ? 'w-[768px] h-[750px] border-4 border-slate-800' :
              'w-full h-[750px]'
            }`}
          >
            {/* Mock browser address bar if desktop/tablet */}
            {viewport !== 'mobile' && (
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-3 select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1 text-[11px] text-slate-600 font-mono truncate">
                  🔒 {siteData.demo_url}
                </div>
                <div className="text-xs text-slate-400 font-semibold">
                  Demo Mode
                </div>
              </div>
            )}

            {/* Mobile Speaker Notch */}
            {viewport === 'mobile' && (
              <div className="bg-slate-900 h-6 flex items-center justify-center select-none shrink-0">
                <div className="w-20 h-3 bg-slate-800 rounded-full" />
              </div>
            )}

            {/* Live Iframe */}
            <iframe
              src={demoUrl}
              title="Demo Website Preview"
              className="w-full flex-1 border-0 bg-white"
            />
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            No demo website generated yet. Click "Re-Generate" above to create one.
          </div>
        )}

      </div>

    </div>
  );
}
