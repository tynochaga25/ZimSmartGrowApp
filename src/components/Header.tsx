import React from 'react';
import { Sprout, PhoneCall, Smartphone, Compass, ShieldAlert, FileText, CheckCircle2, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: 'ussd' | 'pwa' | 'comparator' | 'diagnostics' | 'docs';
  setActiveTab: (tab: 'ussd' | 'pwa' | 'comparator' | 'diagnostics' | 'docs') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-stone-800 bg-stone-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">ZimSmart <span className="text-emerald-400">Grow</span></span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Omnichannel MVP
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Zimbabwe National Agro-Ecological Advisory Engine • Natural Regions I–V
              </p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>USSD Gateway: *384*263#</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-300">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>10 Provinces Active</span>
            </div>
          </div>

          {/* Channel Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ussd')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ussd'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>USSD Dial</span>
            </button>

            <button
              onClick={() => setActiveTab('pwa')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pwa'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Farmer PWA</span>
            </button>

            <button
              onClick={() => setActiveTab('comparator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'comparator'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Omnichannel Proof</span>
            </button>

            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'diagnostics'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>AI Crop Doctor</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'docs'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Arch & Specs</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
