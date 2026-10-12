import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Skeleton } from '../components/ui/Skeleton';

// Lazy-loaded routes for code splitting
const LandingPage = lazy(() =>
  import('../features/marketing/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const SignInPage = lazy(() =>
  import('../features/auth/SignInPage').then((m) => ({ default: m.SignInPage }))
);
const SignUpPage = lazy(() =>
  import('../features/auth/SignUpPage').then((m) => ({ default: m.SignUpPage }))
);
const FarmerDashboard = lazy(() =>
  import('../features/dashboard/FarmerDashboard').then((m) => ({ default: m.FarmerDashboard }))
);
const DiagnosePage = lazy(() =>
  import('../features/diagnose/DiagnosePage').then((m) => ({ default: m.DiagnosePage }))
);
const MarketPage = lazy(() =>
  import('../features/market/MarketPage').then((m) => ({ default: m.MarketPage }))
);
const AdminDashboard = lazy(() =>
  import('../features/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const GetInvolvedPage = lazy(() =>
  import('../features/marketing/GetInvolvedPage').then((m) => ({ default: m.GetInvolvedPage }))
);
const ProfilePage = lazy(() =>
  import('../features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);

// Fallback skeleton loader matching page geometry
const PageSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-8 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-36 w-full" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Skeleton className="lg:col-span-8 h-80 w-full" />
      <Skeleton className="lg:col-span-4 h-80 w-full" />
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Farmer Dashboard Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />

        {/* AI Disease Diagnosis */}
        <Route path="/diagnose" element={<DiagnosePage />} />

        {/* Market Linkage */}
        <Route path="/market" element={<MarketPage />} />

        {/* Admin and Impact Analytics */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Pre-Seed Ask / Get Involved */}
        <Route path="/get-involved" element={<GetInvolvedPage />} />

        {/* Profile Settings */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
