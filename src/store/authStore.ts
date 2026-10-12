import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEMO_USERS, UserProfile } from '../data/mockData';

export type UserRole = 'farmer' | 'buyer' | 'partner' | 'admin';
export type SupportedLanguage = 'en' | 'sn' | 'nd';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  language: SupportedLanguage;
  darkMode: boolean;
  unreadNotificationsCount: number;
  login: (user: UserProfile, token: string) => void;
  loginAsDemo: (roleKey: 'farmer' | 'buyer' | 'admin') => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleDarkMode: () => void;
  markNotificationsAsRead: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      language: 'en',
      darkMode: false,
      unreadNotificationsCount: 3,

      login: (user: UserProfile, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      loginAsDemo: (roleKey: 'farmer' | 'buyer' | 'admin') => {
        const demoUser = DEMO_USERS[roleKey];
        if (demoUser) {
          const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.zimsmart.${roleKey}.${Date.now()}`;
          set({
            user: { ...demoUser },
            token: mockJwt,
            isAuthenticated: true,
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (updates: Partial<UserProfile>) => {
        const current = get().user;
        if (current) {
          set({
            user: { ...current, ...updates },
          });
        }
      },

      setLanguage: (language: SupportedLanguage) => {
        set({ language });
      },

      toggleDarkMode: () => {
        const nextMode = !get().darkMode;
        set({ darkMode: nextMode });
        if (nextMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      markNotificationsAsRead: () => {
        set({ unreadNotificationsCount: 0 });
      },
    }),
    {
      name: 'zimsmart.auth',
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
