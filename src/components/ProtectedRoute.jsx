import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // لو مش مسجل دخول خالص
  if (!isAuthenticated) {
    // لو المسار بتاع أدمن، وديه على /admin/login
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }
    // غير كده وديه على /login العادي
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // لو مسجل دخول بس الدور مش مطلوب
  if (requiredRole && user?.role !== requiredRole) {
    // لو أدمن دخل على صفحة مش بتاعته
    if (user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // لو حرفي أو عميل دخل على صفحة مش بتاعته
    if (user?.role === 'craftsman') {
      return <Navigate to="/craftsman/home" replace />;
    }
    if (user?.role === 'customer') {
      return <Navigate to="/customer/home" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;