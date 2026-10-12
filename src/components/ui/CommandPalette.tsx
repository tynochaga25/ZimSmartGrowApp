import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Compass,
  Sprout,
  Activity,
  ShoppingBag,
  BarChart3,
  HandHeart,
  Moon,
  Sun,
  FileSpreadsheet,
  UserCheck,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { mockApi } from '../../lib/mockApi';
import { toast } from '../../store/toastStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { loginAsDemo, toggleDarkMode, darkMode } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    {
      id: 'dash',
      title: 'Farmer Dashboard',
      subtitle: 'Weather, market sparklines, active crops & alerts',
      icon: <Sprout className="w-4 h-4 text-emerald-600" />,
      action: () => {
        navigate('/dashboard');
        onClose();
      },
      category: 'Navigation',
    },
    {
      id: 'diag',
      title: 'AI Crop Disease Diagnosis',
      subtitle: 'Upload leaf photo & run computer vision diagnostics',
      icon: <Activity className="w-4 h-4 text-amber-500" />,
      action: () => {
        navigate('/diagnose');
        onClose();
      },
      category: 'Navigation',
    },
    {
      id: 'market',
      title: 'Market Linkage & Buyer Orders',
      subtitle: 'National Foods, Cairns, GMB off-taker contracts',
      icon: <ShoppingBag className="w-4 h-4 text-trust-blue" />,
      action: () => {
        navigate('/market');
        onClose();
      },
      category: 'Navigation',
    },
    {
      id: 'admin',
      title: 'Impact & Partner Analytics',
      subtitle: 'Registered farmers, revenue breakdown & regional stats',
      icon: <BarChart3 className="w-4 h-4 text-emerald-700" />,
      action: () => {
        navigate('/admin');
        onClose();
      },
      category: 'Navigation',
    },
    {
      id: 'involved',
      title: 'Get Involved & Funding Ask',
      subtitle: 'US$112,000 pre-seed round details & partner inquiry',
      icon: <HandHeart className="w-4 h-4 text-emerald-600" />,
      action: () => {
        navigate('/get-involved');
        onClose();
      },
      category: 'Navigation',
    },
    {
      id: 'landing',
      title: 'Landing Page Overview',
      subtitle: 'ZimSmart Grow value proposition & impact metrics',
      icon: <Compass className="w-4 h-4 text-gray-500" />,
      action: () => {
        navigate('/');
        onClose();
      },
      category: 'Navigation',
    },
    {
      id: 'demo-farmer',
      title: 'Quick Login: Demo Farmer',
      subtitle: 'Log in as Tendai Moyo (Chinhoyi, 3.5 ha)',
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
      action: () => {
        loginAsDemo('farmer');
        toast.success('Authenticated as Tendai Moyo (Farmer Demo)', 'Welcome Back');
        navigate('/dashboard');
        onClose();
      },
      category: 'Demo Accounts',
    },
    {
      id: 'demo-buyer',
      title: 'Quick Login: Demo Buyer / Offtaker',
      subtitle: 'Log in as Farai Chitepo (National Foods Ltd)',
      icon: <UserCheck className="w-4 h-4 text-trust-blue" />,
      action: () => {
        loginAsDemo('buyer');
        toast.success('Authenticated as Farai Chitepo (National Foods)', 'Buyer Session');
        navigate('/market');
        onClose();
      },
      category: 'Demo Accounts',
    },
    {
      id: 'demo-admin',
      title: 'Quick Login: Demo Admin / Investor',
      subtitle: 'Log in as Rudo Nyathi (ZimSmart Growth Lead)',
      icon: <UserCheck className="w-4 h-4 text-purple-600" />,
      action: () => {
        loginAsDemo('admin');
        toast.success('Authenticated as Rudo Nyathi (Admin Demo)', 'Executive Session');
        navigate('/admin');
        onClose();
      },
      category: 'Demo Accounts',
    },
    {
      id: 'export-csv',
      title: 'Export Anonymized Agronomic Data (CSV)',
      subtitle: 'Download sample Data-as-a-Service dataset',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" />,
      action: () => {
        mockApi.exportAnonymizedDataCsv();
        toast.success('Anonymized agronomic dataset downloaded successfully', 'DaaS Export');
        onClose();
      },
      category: 'Actions',
    },
    {
      id: 'toggle-theme',
      title: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      subtitle: 'Toggle interface visual theme',
      icon: darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-500" />,
      action: () => {
        toggleDarkMode();
        onClose();
      },
      category: 'Preferences',
    },
  ];

  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      i.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-100 dark:border-dark-border">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or jump to view (e.g. market, demo, diagnose)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-charcoal dark:text-gray-100 placeholder-neutral-400 outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-gray-200 rounded-md"
            aria-label="Close command palette"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No matching commands found for "{query}"
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-dark-surface text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-charcoal dark:text-gray-100 truncate flex items-center gap-2">
                      <span>{item.title}</span>
                      <span className="text-[10px] font-normal text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700 px-1.5 py-0.2 rounded">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-300 dark:text-neutral-600 group-hover:text-grow-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-neutral-50 dark:bg-dark-surface border-t border-neutral-100 dark:border-dark-border flex items-center justify-between text-[11px] text-neutral-500">
          <span>Navigation & Quick Actions</span>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px]">Esc</kbd> to close
          </div>
        </div>
      </motion.div>
    </div>
  );
};
