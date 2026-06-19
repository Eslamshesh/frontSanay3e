// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * مكون لحماية المسارات
 * @param {Object} props
 * @param {React.ReactNode} props.children - الصفحة المراد حمايتها
 * @param {string} props.requiredRole - الدور المطلوب (customer, craftsman)
 * @param {string} props.redirectTo - مسار إعادة التوجيه الافتراضي (اختياري)
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // ✅ حالة 1: جاري تحميل بيانات المستخدم
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            جاري التحقق من بياناتك...
          </p>
        </div>
      </div>
    );
  }

  // ✅ حالة 2: مش مسجل دخول → يروح للـ login مع حفظ المسار
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location }} 
      />
    );
  }

  // ✅ حالة 3: مطلوب دور معين والمستخدم مش من هذا الدور
  if (requiredRole && user.role !== requiredRole) {
    // توجيه ذكي حسب دور المستخدم الفعلي
    const redirectMap = {
      'customer': '/customer/home',
      'craftsman': '/craftsman/home',
      'admin': '/admin/dashboard',
    };

    const targetPath = redirectMap[user.role] || redirectTo;
    return <Navigate to={targetPath} replace />;
  }

  // ✅ حالة 4: مصرح له بالكامل → يظهر الصفحة
  return children;
};

export default ProtectedRoute;