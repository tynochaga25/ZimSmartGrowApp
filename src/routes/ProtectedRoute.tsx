import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: ('farmer' | 'buyer' | 'partner' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized roles to their primary home
    if (user.role === 'farmer') {
      return <Navigate to="/dashboard" replace />;
    }
    if (user.role === 'buyer') {
      return <Navigate to="/market" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  return children;
};
