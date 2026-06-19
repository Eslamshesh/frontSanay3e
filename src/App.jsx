// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// ============================================================
// Lazy Loading - تحميل الصفحات عند الحاجة فقط (تحسين الأداء)
// ============================================================

// صفحات عامة (متاحة للجميع)
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const CustomerSignupPage = lazy(() => import('./pages/CustomerSignupPage'));
const CraftsmanSignupPage = lazy(() => import('./pages/CraftsmanSignupPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const HelpSupportPage = lazy(() => import('./pages/HelpSupportPage'));
const TermsConditionsPage = lazy(() => import('./pages/TermsConditionsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// صفحات محمية (تحتاج تسجيل دخول)
const CustomerHomePage = lazy(() => import('./pages/CustomerHomePage'));
const CraftsmanHomePage = lazy(() => import('./pages/CraftsmanHomePage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const RequestServicePage = lazy(() => import('./pages/RequestServicePage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const CraftsmanProfilePage = lazy(() => import('./pages/CraftsmanProfilePage'));
const CustomerProfilePage = lazy(() => import('./pages/CustomerProfilePage'));
const NotificationsViewPage = lazy(() => import('./pages/NotificationsViewPage'));
const CraftsmanDetailPage = lazy(() => import('./pages/CraftsmanDetailPage'));
const ReviewsListPage = lazy(() => import('./pages/ReviewsListPage'));

// ============================================================
// ProfileRouter - يوجه للملف الشخصي حسب الدور
// ============================================================

const ProfileRouter = () => {
  const { user, loading } = useAuth();

  // أثناء التحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            جاري تحميل الملف الشخصي...
          </p>
        </div>
      </div>
    );
  }

  // إذا لم يكن هناك مستخدم
  if (!user) {
    return null;
  }

  // توجيه حسب الدور
  return user?.role === 'craftsman' 
    ? <CraftsmanProfilePage /> 
    : <CustomerProfilePage />;
};

// ============================================================
// Spinner Component - يستخدم أثناء تحميل الصفحات
// ============================================================

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900" dir="rtl">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
        جاري التحميل...
      </p>
    </div>
  </div>
);

// ============================================================
// App Component
// ============================================================

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ==========================================
                    📄 صفحات عامة - متاحة للجميع
                    ========================================== */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/select-role" element={<RoleSelectionPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/signup/customer" element={<CustomerSignupPage />} />
                <Route path="/signup/craftsman" element={<CraftsmanSignupPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/help" element={<HelpSupportPage />} />
                <Route path="/terms" element={<TermsConditionsPage />} />

                {/* ==========================================
                    🔒 صفحات محمية - تحتاج تسجيل دخول (أي دور)
                    ========================================== */}
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchResultsPage />
                  </ProtectedRoute>
                } />
                <Route path="/request-service" element={
                  <ProtectedRoute>
                    <RequestServicePage />
                  </ProtectedRoute>
                } />
                <Route path="/booking/:id" element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } />
                <Route path="/craftsman/:id" element={
                  <ProtectedRoute>
                    <CraftsmanDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/reviews" element={
                  <ProtectedRoute>
                    <ReviewsListPage />
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <NotificationsViewPage />
                  </ProtectedRoute>
                } />

                {/* ==========================================
                    🔒 صفحات محمية - دور العميل فقط
                    ========================================== */}
                <Route path="/customer/home" element={
                  <ProtectedRoute requiredRole="customer">
                    <CustomerHomePage />
                  </ProtectedRoute>
                } />

                {/* ==========================================
                    🔒 صفحات محمية - دور الحرفي فقط
                    ========================================== */}
                <Route path="/craftsman/home" element={
                  <ProtectedRoute requiredRole="craftsman">
                    <CraftsmanHomePage />
                  </ProtectedRoute>
                } />
                <Route path="/subscription" element={
                  <ProtectedRoute requiredRole="craftsman">
                    <SubscriptionPage />
                  </ProtectedRoute>
                } />

                {/* ==========================================
                    👤 الملف الشخصي - يظهر حسب الدور تلقائياً
                    ========================================== */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfileRouter />
                  </ProtectedRoute>
                } />

                {/* ==========================================
                    🚫 404 - صفحة غير موجودة
                    ========================================== */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </Layout>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;