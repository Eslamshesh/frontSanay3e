// // src/App.jsx
// import React, { lazy, Suspense } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import { ThemeProvider } from './context/ThemeContext';
// import { AuthProvider } from './context/AuthContext';
// import { LanguageProvider } from './context/LanguageContext';
// import Layout from './components/Layout/Layout';
// import ProtectedRoute from './components/ProtectedRoute';

// // ===== Import عادي (بدل lazy) =====
// import HomePage from './pages/HomePage';
// import AboutPage from './pages/AboutPage';
// import RoleSelectionPage from './pages/RoleSelectionPage';
// import LoginPage from './pages/LoginPage';
// import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import CustomerSignupPage from './pages/CustomerSignupPage';
// import CraftsmanSignupPage from './pages/CraftsmanSignupPage';
// import VerifyEmailPage from './pages/VerifyEmailPage';
// import HelpSupportPage from './pages/HelpSupportPage';
// import TermsConditionsPage from './pages/TermsConditionsPage';
// import NotFoundPage from './pages/NotFoundPage';
// import SearchResultsPage from './pages/SearchResultsPage';
// import RequestServicePage from './pages/RequestServicePage';
// import BookingPage from './pages/BookingPage';
// import CraftsmanProfilePage from './pages/CraftsmanProfilePage';
// import CustomerProfilePage from './pages/CustomerProfilePage';
// import CraftsmanDetailPage from './pages/CraftsmanDetailPage';
// import ReviewsListPage from './pages/ReviewsListPage';
// import SubscriptionPage from './pages/SubscriptionPage';
// import CustomerHomePage from './pages/CustomerHomePage';
// import CraftsmanHomePage from './pages/CraftsmanHomePage';
// import MyBookingsPage from './pages/MyBookingsPage';
// import NotificationsViewPage from './pages/NotificationsViewPage';
// import ServicePostDetailPage from './pages/ServicePostDetailPage';
// import ClientPostsPage from './pages/ClientPostsPage';
// import CraftsmanPostsPage from './pages/CraftsmanPostsPage';

// // ============================================================
// // ProfileRouter
// // ============================================================

// const ProfileRouter = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" dir="rtl">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
//           <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
//             جاري تحميل الملف الشخصي...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   if (user?.role === 'craftsman') {
//     return <CraftsmanProfilePage />;
//   }
  
//   if (user?.role === 'client' || user?.role === 'customer') {
//     return <CustomerProfilePage />;
//   }
  
//   return <CustomerProfilePage />;
// };

// // ============================================================
// // App Component
// // ============================================================

// function App() {
//   return (
//     <ThemeProvider>
//       <LanguageProvider>
//         <AuthProvider>
//           <Layout>
//             <Suspense fallback={<div>جاري التحميل...</div>}>
//               <Routes>
//                 {/* ===== صفحات عامة ===== */}
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/about" element={<AboutPage />} />
//                 <Route path="/select-role" element={<RoleSelectionPage />} />
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//                 <Route path="/signup/customer" element={<CustomerSignupPage />} />
//                 <Route path="/signup/craftsman" element={<CraftsmanSignupPage />} />
//                 <Route path="/verify-email" element={<VerifyEmailPage />} />
//                 <Route path="/help" element={<HelpSupportPage />} />
//                 <Route path="/terms" element={<TermsConditionsPage />} />

//                 {/* ===== صفحات محمية ===== */}
//                 <Route path="/search" element={
//                   <ProtectedRoute>
//                     <SearchResultsPage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/request-service" element={
//                   <ProtectedRoute>
//                     <RequestServicePage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/booking/:id" element={
//                   <ProtectedRoute>
//                     <BookingPage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/craftsman/:id" element={
//                   <ProtectedRoute>
//                     <CraftsmanDetailPage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/reviews" element={
//                   <ProtectedRoute>
//                     <ReviewsListPage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/notifications" element={
//                   <ProtectedRoute>
//                     <NotificationsViewPage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/service-post/:id" element={
//                   <ProtectedRoute>
//                     <ServicePostDetailPage />
//                   </ProtectedRoute>
//                 } />

//                 {/* ===== صفحات العميل ===== */}
//                 <Route path="/customer/home" element={
//                   <ProtectedRoute requiredRole="client">
//                     <CustomerHomePage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/my-bookings" element={
//                   <ProtectedRoute requiredRole="client">
//                     <MyBookingsPage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/my-posts" element={
//                   <ProtectedRoute requiredRole="client">
//                     <ClientPostsPage />
//                   </ProtectedRoute>
//                 } />

//                 {/* ===== صفحات الحرفي ===== */}
//                 <Route path="/craftsman/home" element={
//                   <ProtectedRoute requiredRole="craftsman">
//                     <CraftsmanHomePage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/subscription" element={
//                   <ProtectedRoute requiredRole="craftsman">
//                     <SubscriptionPage />
//                   </ProtectedRoute>
//                 } />
//                 <Route path="/craftsman/posts" element={
//                   <ProtectedRoute requiredRole="craftsman">
//                     <CraftsmanPostsPage />
//                   </ProtectedRoute>
//                 } />

//                 {/* ===== الملف الشخصي ===== */}
//                 <Route path="/profile" element={
//                   <ProtectedRoute>
//                     <ProfileRouter />
//                   </ProtectedRoute>
//                 } />

//                 {/* ===== 404 ===== */}
//                 <Route path="*" element={<NotFoundPage />} />
//               </Routes>
//             </Suspense>
//           </Layout>
//         </AuthProvider>
//       </LanguageProvider>
//     </ThemeProvider>
//   );
// }

// export default App;
// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// ===== Import عادي (بدل lazy) =====
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CustomerSignupPage from './pages/CustomerSignupPage';
import CraftsmanSignupPage from './pages/CraftsmanSignupPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import HelpSupportPage from './pages/HelpSupportPage';
import TermsConditionsPage from './pages/TermsConditionsPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultsPage';
import RequestServicePage from './pages/RequestServicePage';
import BookingPage from './pages/BookingPage';
import CraftsmanProfilePage from './pages/CraftsmanProfilePage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import CraftsmanDetailPage from './pages/CraftsmanDetailPage';
//import ReviewsListPage from './pages/ReviewsListPage';
import SubscriptionPage from './pages/SubscriptionPage';
import CustomerHomePage from './pages/CustomerHomePage';
import CraftsmanHomePage from './pages/CraftsmanHomePage';
import MyBookingsPage from './pages/MyBookingsPage';
import NotificationsViewPage from './pages/NotificationsViewPage';
import ServicePostDetailPage from './pages/ServicePostDetailPage';
import ClientPostsPage from './pages/ClientPostsPage';
import CraftsmanPostsPage from './pages/CraftsmanPostsPage';
import CraftsmanReviewsPage from './pages/CraftsmanReviewsPage';
import AddReviewPage from './pages/AddReviewPage';

// ============================================================
// ProfileRouter
// ============================================================

const ProfileRouter = () => {
  const { user, loading } = useAuth();

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

  if (!user) return null;

  if (user?.role === 'craftsman') {
    return <CraftsmanProfilePage />;
  }
  
  if (user?.role === 'client' || user?.role === 'customer') {
    return <CustomerProfilePage />;
  }
  
  return <CustomerProfilePage />;
};

// ============================================================
// App Component
// ============================================================

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Layout>
            <Suspense fallback={<div>جاري التحميل...</div>}>
              <Routes>
                {/* ===== صفحات عامة ===== */}
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

                {/* ===== صفحات محمية ===== */}
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
                {/* <Route path="/reviews" element={
                  <ProtectedRoute>
                    <ReviewsListPage />
                  </ProtectedRoute>
                } /> */}
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <NotificationsViewPage />
                  </ProtectedRoute>
                } />
                <Route path="/service-post/:id" element={
                  <ProtectedRoute>
                    <ServicePostDetailPage />
                  </ProtectedRoute>
                } />

                {/* ===== صفحات العميل ===== */}
                <Route path="/customer/home" element={
                  <ProtectedRoute requiredRole="client">
                    <CustomerHomePage />
                  </ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                  <ProtectedRoute requiredRole="client">
                    <MyBookingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/my-posts" element={
                  <ProtectedRoute requiredRole="client">
                    <ClientPostsPage />
                  </ProtectedRoute>
                } />
                <Route path="/my-bookings/:bookingId/review" element={
                  <ProtectedRoute requiredRole="client">
                    <AddReviewPage />
                  </ProtectedRoute>
                } />

                {/* ===== صفحات الحرفي ===== */}
                <Route path="/craftsman/home" element={
                  <ProtectedRoute requiredRole="craftsman">
                    <CraftsmanHomePage />
                  </ProtectedRoute>
                } />
                <Route path="/craftsman/bookings" element={
                  <ProtectedRoute requiredRole="craftsman">
                    <MyBookingsPage />
                  </ProtectedRoute>
                } />
                <Route path="/subscription" element={
                  <ProtectedRoute requiredRole="craftsman">
                    <SubscriptionPage />
                  </ProtectedRoute>
                } />
                <Route path="/craftsman/posts" element={
                  <ProtectedRoute requiredRole="craftsman">
                    <CraftsmanPostsPage />
                  </ProtectedRoute>
                } />
                <Route path="/craftsman/reviews" element={
                  <ProtectedRoute requiredRole="craftsman">
                    <CraftsmanReviewsPage />
                  </ProtectedRoute>
                } />

                {/* ===== الملف الشخصي ===== */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfileRouter />
                  </ProtectedRoute>
                } />

                {/* ===== 404 ===== */}
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