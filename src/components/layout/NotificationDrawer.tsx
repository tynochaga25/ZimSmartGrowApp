import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, AlertTriangle, TrendingUp, Sparkles, Check, ArrowRight } from 'lucide-react';
import { MOCK_ALERTS, SystemAlert } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { markNotificationsAsRead, unreadNotificationsCount } = useAuthStore();
  const navigate = useNavigate();

  const handleMarkAllRead = () => {
    markNotificationsAsRead();
  };

  const getAlertIcon = (category: SystemAlert['category']) => {
    switch (category) {
      case 'pest':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'market':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-trust-blue" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white dark:bg-dark-card border-l border-neutral-200 dark:border-dark-border shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-neutral-100 dark:border-dark-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-grow-50 dark:bg-dark-surface text-grow-700 dark:text-grow-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-charcoal dark:text-gray-100">Agricultural Intelligence Alerts</h2>
                    <p className="text-[11px] text-neutral-500">
                      {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread advisories` : 'All caught up'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-medium text-grow-700 dark:text-grow-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark read
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-gray-200 rounded-lg"
                    aria-label="Close drawer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {MOCK_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-xl border border-neutral-100 dark:border-dark-border bg-neutral-50/60 dark:bg-dark-surface hover:bg-neutral-50 dark:hover:bg-dark-surface/90 transition-all space-y-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-md bg-white dark:bg-neutral-800 shadow-xs shrink-0 mt-0.5">
                        {getAlertIcon(alert.category)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-semibold text-charcoal dark:text-gray-100 truncate">
                            {alert.title}
                          </h4>
                          <span className="text-[10px] text-neutral-400 shrink-0">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    {alert.actionUrl && (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => {
                            navigate(alert.actionUrl!);
                            onClose();
                          }}
                          className="text-xs font-medium text-grow-700 dark:text-grow-400 hover:text-grow-800 flex items-center gap-1 cursor-pointer"
                        >
                          Take Action <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="p-3 rounded-xl bg-grow-50/50 dark:bg-grow-950/30 border border-grow-200/50 dark:border-grow-900/50 text-[11px] text-grow-900 dark:text-grow-300 leading-relaxed">
                  <span className="font-semibold">SMS Fallback Active:</span> Critical pest warnings and weather advisories are also dispatched automatically via USSD/SMS gateway to 3G/2G smallholder phones.
                </div>
              </div>

              <div className="p-3 border-t border-neutral-100 dark:border-dark-border bg-neutral-50 dark:bg-dark-surface text-center">
                <button
                  onClick={onClose}
                  className="w-full py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                >
                  Close Drawer
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
