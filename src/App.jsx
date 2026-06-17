import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

import Layout from './components/Layout/Layout';
import AdminLayout from './components/Layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// صفحات المستخدمين
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CustomerSignupPage from './pages/CustomerSignupPage';
import CraftsmanSignupPage from './pages/CraftsmanSignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import CustomerHomePage from './pages/CustomerHomePage';
import CraftsmanHomePage from './pages/CraftsmanHomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import RequestServicePage from './pages/RequestServicePage';
import BookingPage from './pages/BookingPage';
import SubscriptionPage from './pages/SubscriptionPage';
import CraftsmanProfilePage from './pages/CraftsmanProfilePage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import NotificationsViewPage from './pages/NotificationsViewPage';
import HelpSupportPage from './pages/HelpSupportPage';
import CraftsmanDetailPage from './pages/CraftsmanDetailPage';
import ReviewsListPage from './pages/ReviewsListPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import NotFoundPage from './pages/NotFoundPage';

// صفحات الأدمن
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UsersManagementPage from './pages/admin/UsersManagementPage';
import CraftsmenManagementPage from './pages/admin/CraftsmenManagementPage';
import IDVerificationPage from './pages/admin/IDVerificationPage';
import ProfessionRequestsPage from './pages/admin/ProfessionRequestsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdvancedSettingsPage from './pages/admin/AdvancedSettingsPage';

// مكون ذكي لتوجيه الملف الشخصي حسب الدور
const ProfileRouter = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user?.role === 'craftsman' ? <CraftsmanProfilePage /> : <CustomerProfilePage />;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <Routes>
              {/* ==================== */}
              {/* صفحات الأدمن - معزولة تماماً ب AdminLayout */}
              {/* ==================== */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="login" element={<AdminLoginPage />} />
                <Route path="dashboard" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="users" element={
                  <ProtectedRoute requiredRole="admin">
                    <UsersManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="craftsmen" element={
                  <ProtectedRoute requiredRole="admin">
                    <CraftsmenManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="id-verification" element={
                  <ProtectedRoute requiredRole="admin">
                    <IDVerificationPage />
                  </ProtectedRoute>
                } />
                <Route path="profession-requests" element={
                  <ProtectedRoute requiredRole="admin">
                    <ProfessionRequestsPage />
                  </ProtectedRoute>
                } />
                <Route path="analytics" element={
                  <ProtectedRoute requiredRole="admin">
                    <AnalyticsPage />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdvancedSettingsPage />
                  </ProtectedRoute>
                } />
              </Route>

              {/* ==================== */}
              {/* صفحات المستخدمين - مع Layout العادي */}
              {/* ==================== */}
              <Route path="*" element={
                <Layout>
                  <Routes>
                    {/* صفحات عامة - متاحة لأي حد */}
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

                    {/* صفحات محمية - لازم تسجيل دخول */}
                    <Route path="/customer/home" element={
                      <ProtectedRoute requiredRole="customer">
                        <CustomerHomePage />
                      </ProtectedRoute>
                    } />
                    <Route path="/craftsman/home" element={
                      <ProtectedRoute requiredRole="craftsman">
                        <CraftsmanHomePage />
                      </ProtectedRoute>
                    } />
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
                    <Route path="/subscription" element={
                      <ProtectedRoute requiredRole="craftsman">
                        <SubscriptionPage />
                      </ProtectedRoute>
                    } />

                    {/* الملف الشخصي - بيوجه تلقائي حسب الدور */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfileRouter />
                      </ProtectedRoute>
                    } />

                    <Route path="/notifications" element={
                      <ProtectedRoute>
                        <NotificationsViewPage />
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

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </AdminAuthProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;