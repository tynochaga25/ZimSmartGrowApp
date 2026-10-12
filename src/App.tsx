import React, { useState } from 'react';
import { Header } from './components/Header';
import { UssdSimulator } from './components/UssdSimulator';
import { FarmerPwaDashboard } from './components/FarmerPwaDashboard';
import { OmnichannelComparator } from './components/OmnichannelComparator';
import { DiseaseDiagnostics } from './components/DiseaseDiagnostics';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { PhoneCall, Smartphone, Compass, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'ussd' | 'pwa' | 'comparator' | 'diagnostics' | 'docs'>('ussd');

  return (
    <div className="min-h-screen bg-[#121110] text-stone-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === 'ussd' && <UssdSimulator />}
        {activeTab === 'pwa' && <FarmerPwaDashboard />}
        {activeTab === 'comparator' && <OmnichannelComparator />}
        {activeTab === 'diagnostics' && <DiseaseDiagnostics />}
        {activeTab === 'docs' && <ArchitectureDocs />}
      </main>

      {/* Global Bottom Status Bar */}
      <footer className="border-t border-stone-800 bg-stone-950/90 py-4 px-4 sm:px-6 lg:px-8 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-stone-300">ZimSmart Grow Core Engine</span>
            <span>•</span>
            <span className="font-mono text-stone-400">v1.0.0-mvp</span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">10 Provinces • Agro-Ecological Regions I–V</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <button
              onClick={() => setActiveTab('ussd')}
              className="hover:text-emerald-400 transition"
            >
              USSD Dial (*384*263#)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('comparator')}
              className="hover:text-emerald-400 transition"
            >
              Omnichannel Proof
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('docs')}
              className="hover:text-emerald-400 transition"
            >
              Architecture & SQL
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
