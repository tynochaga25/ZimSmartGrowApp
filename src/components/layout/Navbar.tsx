import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Command,
  Sun,
  Moon,
  Globe,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserMenu } from './UserMenu';

interface NavbarProps {
  onOpenCommand: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommand, onOpenNotifications }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, darkMode, toggleDarkMode, language, setLanguage, unreadNotificationsCount } =
    useAuthStore();

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Solutions', href: '/#features' },
        { name: 'How It Works', href: '/#how-it-works' },
        { name: 'Market Linkage', href: '/market' },
        { name: 'Impact Analytics', href: '/admin' },
        { name: 'Get Involved', href: '/get-involved' },
      ];
    }

    if (user?.role === 'farmer') {
      return [
        { name: 'Farm Dashboard', href: '/dashboard' },
        { name: 'AI Diagnosis', href: '/diagnose' },
        { name: 'Market Linkage', href: '/market' },
        { name: 'Get Involved', href: '/get-involved' },
      ];
    }

    if (user?.role === 'buyer') {
      return [
        { name: 'Offtake Market', href: '/market' },
        { name: 'Crop Intelligence', href: '/dashboard' },
        { name: 'Agronomic Analytics', href: '/admin' },
        { name: 'Get Involved', href: '/get-involved' },
      ];
    }

    // Admin & Partner
    return [
      { name: 'Impact Console', href: '/admin' },
      { name: 'Farmer Ecosystem', href: '/dashboard' },
      { name: 'Commodity Trading', href: '/market' },
      { name: 'Pre-Seed Ask', href: '/get-involved' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-dark-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark, single-line, whitespace-nowrap) */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-grow-700 dark:text-grow-400 whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-grow-600 dark:bg-grow-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <span className="font-heading font-extrabold text-charcoal dark:text-white">
            ZimSmart <span className="text-grow-600 dark:text-grow-400">Grow</span>
          </span>
        </Link>

        {/* Zone 2: 4–5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-grow-600 dark:hover:text-grow-400 ${
                  isActive
                    ? 'text-grow-700 dark:text-grow-400 font-semibold border-b-2 border-grow-600'
                    : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommand}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
            title="Search & Quick Actions"
            aria-label="Open command palette"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">⌘K</span>
          </button>

          {/* Language Switcher */}
          <div className="hidden lg:flex items-center text-xs bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">
            <span className="px-1.5 py-0.5 text-neutral-400">
              <Globe className="w-3.5 h-3.5" />
            </span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                language === 'en' ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs' : 'hover:text-charcoal'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('sn')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                language === 'sn' ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs' : 'hover:text-charcoal'
              }`}
              title="ChiShona"
            >
              SN
            </button>
            <button
              onClick={() => setLanguage('nd')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                language === 'nd' ? 'bg-white dark:bg-neutral-700 font-semibold shadow-xs' : 'hover:text-charcoal'
              }`}
              title="isiNdebele"
            >
              ND
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* If Authenticated: Notification Bell & User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-harvest" />
                )}
              </button>
              <UserMenu onOpenNotifications={onOpenNotifications} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-grow-700 transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-semibold text-white bg-grow-600 hover:bg-grow-700 dark:bg-grow-500 dark:hover:bg-grow-600 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                Get Started Free <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
