import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  LogOut,
  RefreshCw,
  Bell,
  CheckCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { toast } from '../../store/toastStore';

interface UserMenuProps {
  onOpenNotifications: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onOpenNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout, loginAsDemo, unreadNotificationsCount } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    logout();
    setIsOpen(false);
    toast.info('You have been signed out safely', 'Signed Out');
    navigate('/signin');
  };

  const handleSwitchDemoRole = (role: 'farmer' | 'buyer' | 'admin') => {
    loginAsDemo(role);
    setIsOpen(false);
    if (role === 'farmer') {
      toast.success('Switched to Tendai Moyo (Farmer Demo)', 'Role Changed');
      navigate('/dashboard');
    } else if (role === 'buyer') {
      toast.success('Switched to Farai Chitepo (Buyer Demo)', 'Role Changed');
      navigate('/market');
    } else {
      toast.success('Switched to Rudo Nyathi (Admin Demo)', 'Role Changed');
      navigate('/admin');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-neutral-200 dark:border-dark-border hover:border-grow-400 bg-white dark:bg-dark-card transition-all cursor-pointer"
        aria-label="User navigation menu"
      >
        <div className="w-7 h-7 rounded-full bg-grow-700 text-white flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>
        <div className="hidden sm:block text-left text-xs">
          <div className="font-semibold text-charcoal dark:text-gray-100 max-w-[100px] truncate leading-tight">
            {user.name.split(' ')[0]}
          </div>
          <div className="text-[10px] text-neutral-500 capitalize leading-none">
            {user.role}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border shadow-xl py-2 z-50 text-xs"
          >
            {/* Header info */}
            <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-dark-border">
              <div className="font-semibold text-charcoal dark:text-gray-100 truncate">{user.name}</div>
              <div className="text-[11px] text-neutral-500 truncate">
                {user.phone || user.email || user.organization || `${user.role} account`}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-grow-700 dark:text-grow-400 font-medium">
                <CheckCircle className="w-3 h-3 text-grow-600" />
                Verified ZimSmart Profile ({user.province || 'Zimbabwe'})
              </div>
            </div>

            {/* Main Links */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/profile');
                }}
                className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-dark-surface flex items-center gap-2.5 text-neutral-700 dark:text-neutral-200 cursor-pointer"
              >
                <User className="w-4 h-4 text-neutral-400" />
                Profile & Farm Settings
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenNotifications();
                }}
                className="w-full px-4 py-2 text-left hover:bg-neutral-50 dark:hover:bg-dark-surface flex items-center justify-between text-neutral-700 dark:text-neutral-200 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-neutral-400" />
                  Notifications
                </div>
                {unreadNotificationsCount > 0 && (
                  <span className="text-[10px] font-semibold bg-grow-600 text-white rounded-full px-1.5 py-0.2">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Switch Role (Demo Only) */}
            <div className="border-t border-neutral-100 dark:border-dark-border py-1.5 px-3">
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold px-1 py-1 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Quick Switch Role (Investor Demo)
              </div>
              <div className="grid grid-cols-3 gap-1 mt-1">
                <button
                  onClick={() => handleSwitchDemoRole('farmer')}
                  className={`px-2 py-1.5 rounded-lg text-center text-[10px] font-medium transition-colors cursor-pointer ${
                    user.role === 'farmer'
                      ? 'bg-grow-100 text-grow-800 dark:bg-grow-950 dark:text-grow-300 font-semibold'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Farmer
                </button>
                <button
                  onClick={() => handleSwitchDemoRole('buyer')}
                  className={`px-2 py-1.5 rounded-lg text-center text-[10px] font-medium transition-colors cursor-pointer ${
                    user.role === 'buyer'
                      ? 'bg-trust-blue/10 text-trust-blue font-semibold'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Buyer
                </button>
                <button
                  onClick={() => handleSwitchDemoRole('admin')}
                  className={`px-2 py-1.5 rounded-lg text-center text-[10px] font-medium transition-colors cursor-pointer ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold'
                      : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Sign Out */}
            <div className="border-t border-neutral-100 dark:border-dark-border pt-1">
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
