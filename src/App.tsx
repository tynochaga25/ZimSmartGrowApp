/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileTabBar } from './components/layout/MobileTabBar';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { CommandPalette } from './components/ui/CommandPalette';
import { ToastContainer } from './components/ui/ToastContainer';
import { useAuthStore } from './store/authStore';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  const { darkMode } = useAuthStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Is auth screen (clean surface without clutter)
  const isAuthScreen = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-dark-bg text-charcoal dark:text-neutral-100 transition-colors">
      <ScrollToTop />

      {/* Top Bar Contract Navbar */}
      <Navbar
        onOpenCommand={() => setIsCommandOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        <AppRouter />
      </main>

      {/* Footer (omitted on auth screens for focused visual ergonomics) */}
      {!isAuthScreen && <Footer />}

      {/* Mobile Tab Bar */}
      <MobileTabBar />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />

      {/* Global Toast Notification System */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
