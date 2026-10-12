import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  Store,
  BarChart2,
  HelpCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const MobileTabBar: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  const getTabs = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Home', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Diagnose', href: '/diagnose', icon: <ScanLine className="w-5 h-5" /> },
        { label: 'Market', href: '/market', icon: <Store className="w-5 h-5" /> },
        { label: 'Impact', href: '/admin', icon: <BarChart2 className="w-5 h-5" /> },
        { label: 'Involved', href: '/get-involved', icon: <HelpCircle className="w-5 h-5" /> },
      ];
    }

    if (user?.role === 'farmer') {
      return [
        { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Diagnose', href: '/diagnose', icon: <ScanLine className="w-5 h-5" /> },
        { label: 'Market', href: '/market', icon: <Store className="w-5 h-5" /> },
        { label: 'Analytics', href: '/admin', icon: <BarChart2 className="w-5 h-5" /> },
        { label: 'Impact', href: '/get-involved', icon: <HelpCircle className="w-5 h-5" /> },
      ];
    }

    return [
      { label: 'Market', href: '/market', icon: <Store className="w-5 h-5" /> },
      { label: 'Analytics', href: '/admin', icon: <BarChart2 className="w-5 h-5" /> },
      { label: 'Farmer View', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { label: 'Diagnosis', href: '/diagnose', icon: <ScanLine className="w-5 h-5" /> },
      { label: 'Involved', href: '/get-involved', icon: <HelpCircle className="w-5 h-5" /> },
    ];
  };

  const tabs = getTabs();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border-t border-neutral-200 dark:border-dark-border px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.href}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-grow-700 dark:text-grow-400 font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
              }`
            }
          >
            {tab.icon}
            <span className="mt-0.5">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
