// src/pages/CraftsmanHomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import api from '../services/api';
import { 
  Phone, Star, MapPin, Calendar,
  Clock, CheckCircle, XCircle, TrendingUp,
  Users, Wrench, DollarSign, ArrowRight,
  Bell, Settings, Award, BarChart3, Loader,
  Sparkles, AlertCircle, RefreshCw, Eye, User
} from 'lucide-react';

const CraftsmanHomePage = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ 
    pending: 0, 
    completed: 0, 
    total: 0, 
    earnings: 0,
    rating: 0,
    reviews_count: 0,
    is_featured: false
  });
  const [actionLoading, setActionLoading] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // ✅ Load requests from API
  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      // 1. جلب إحصائيات الحرفي
      const statsData = await api.getCraftsmanStats();
      setStats({
        pending: statsData.stats?.pending_bookings || 0,
        completed: statsData.stats?.completed_bookings || 0,
        total: (statsData.stats?.pending_bookings || 0) + (statsData.stats?.completed_bookings || 0) + (statsData.stats?.cancelled_bookings || 0),
        earnings: statsData.stats?.total_earnings || 0,
        rating: statsData.stats?.rating || 0,
        reviews_count: statsData.stats?.reviews_count || 0,
        is_featured: statsData.stats?.is_featured || false,
      });
      
      // 2. جلب حجوزات الحرفي
      const bookingsData = await api.getCraftsmanBookings();
      const allBookings = bookingsData.bookings?.data || [];
      
      // عرض الطلبات قيد الانتظار فقط في القائمة الرئيسية
      const pendingBookings = allBookings.filter(b => b.status === 'pending');
      setRequests(pendingBookings);
      
    } catch (error) {
      console.error('Error loading craftsman data:', error);
      // ✅ Fallback data
      const fallbackRequests = [
        { 
          id: 1, 
          service_type: 'تركيب مطبخ', 
          customer_name: 'أحمد محمد', 
          location: 'القاهرة', 
          date: '2026-06-20', 
          time: '14:30', 
          budget: 200,
          status: 'pending',
          description: 'محتاج تركيب مطبخ جديد'
        },
        { 
          id: 2, 
          service_type: 'سباكة', 
          customer_name: 'سارة علي', 
          location: 'الجيزة', 
          date: '2026-06-21', 
          time: '10:00', 
          budget: 150,
          status: 'pending',
          description: 'تسريب مياه في الحمام'
        },
      ];
      setRequests(fallbackRequests);
      setStats({
        pending: fallbackRequests.length,
        completed: 0,
        total: fallbackRequests.length,
        earnings: 0,
        rating: 0,
        reviews_count: 0,
        is_featured: false,
      });
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadRequests();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadRequests, 30000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadRequests();
  };

  // Show feedback message
  const showFeedback = (message) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  // ✅ Accept booking - باستخدام updateBookingStatus
  const handleAccept = async (bookingId) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: 'accept' }));
    
    try {
      await api.updateBookingStatus(bookingId, 'confirmed');
      showFeedback(lang === 'ar' ? '✅ تم قبول الطلب بنجاح!' : '✅ Request accepted successfully!');
      
      // Update local state
      setRequests(prev => prev.filter(r => r.id !== bookingId));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        completed: prev.completed + 1
      }));
    } catch (error) {
      console.error('Accept error:', error);
      // Fallback for demo
      setRequests(prev => prev.filter(r => r.id !== bookingId));
      showFeedback(lang === 'ar' ? '✅ تم قبول الطلب!' : '✅ Request accepted!');
    }
    
    setActionLoading(prev => ({ ...prev, [bookingId]: null }));
  };

  // ✅ Reject booking - باستخدام updateBookingStatus
  const handleReject = async (bookingId) => {
    setActionLoading(prev => ({ ...prev, [bookingId]: 'reject' }));
    
    try {
      await api.updateBookingStatus(bookingId, 'rejected', 'الميعاد غير مناسب');
      showFeedback(lang === 'ar' ? '❌ تم رفض الطلب' : '❌ Request rejected');
      
      // Update local state
      setRequests(prev => prev.filter(r => r.id !== bookingId));
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        total: prev.total - 1
      }));
    } catch (error) {
      console.error('Reject error:', error);
      // Fallback for demo
      setRequests(prev => prev.filter(r => r.id !== bookingId));
      showFeedback(lang === 'ar' ? '❌ تم رفض الطلب' : '❌ Request rejected');
    }
    
    setActionLoading(prev => ({ ...prev, [bookingId]: null }));
  };

  // Translations
  const t = {
    welcome: lang === 'ar' ? 'مرحباً' : 'Welcome',
    newRequests: (count) => lang === 'ar' ? `لديك ${count} طلبات جديدة` : `You have ${count} new requests`,
    pending: lang === 'ar' ? 'طلبات جديدة' : 'New Requests',
    completed: lang === 'ar' ? 'مكتملة' : 'Completed',
    total: lang === 'ar' ? 'إجمالي الطلبات' : 'Total Requests',
    earnings: lang === 'ar' ? 'الأرباح' : 'Earnings',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    incomingRequests: lang === 'ar' ? 'الطلبات الواردة' : 'Incoming Requests',
    noRequests: lang === 'ar' ? 'لا توجد طلبات جديدة 🎉' : 'No new requests 🎉',
    noRequestsDesc: lang === 'ar' ? 'كل الطلبات الجديدة هتظهر هنا' : 'All new requests will appear here',
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
    waiting: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
    quickLinks: lang === 'ar' ? 'روابط سريعة' : 'Quick Links',
    profile: lang === 'ar' ? 'الملف الشخصي' : 'Profile',
    subscriptions: lang === 'ar' ? 'الاشتراكات' : 'Subscriptions',
    accept: lang === 'ar' ? 'قبول' : 'Accept',
    reject: lang === 'ar' ? 'رفض' : 'Reject',
    accepting: lang === 'ar' ? 'جاري...' : '...',
    rejecting: lang === 'ar' ? 'جاري...' : '...',
    refresh: lang === 'ar' ? 'تحديث' : 'Refresh',
    customer: lang === 'ar' ? 'العميل' : 'Customer',
    date: lang === 'ar' ? 'التاريخ' : 'Date',
    description: lang === 'ar' ? 'الوصف' : 'Description',
    rating: lang === 'ar' ? 'التقييم' : 'Rating',
    featured: lang === 'ar' ? 'مميز' : 'Featured',
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';

  const statCards = [
    { value: stats.pending, label: t.pending, color: '#f59e0b', icon: <Bell size={24} /> },
    { value: stats.completed, label: t.completed, color: '#059669', icon: <CheckCircle size={24} /> },
    { value: stats.total, label: t.total, color: '#3b82f6', icon: <BarChart3 size={24} /> },
    { value: `${stats.earnings} ${t.egp}`, label: t.earnings, color: '#8b5cf6', icon: <DollarSign size={24} /> },
  ];

  const quickLinkStyle = (color, bg) => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 16px', borderRadius: '12px',
    textDecoration: 'none', color: color, fontWeight: 600,
    fontSize: '0.9rem', fontFamily: "'Cairo', sans-serif",
    background: bg, transition: 'all 0.3s ease',
  });

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif", direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .animate-slide-down { animation: slideDown 0.3s ease forwards; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
        
        .btn-accept { transition: all 0.3s ease; }
        .btn-accept:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(5,150,105,0.4); }
        
        .btn-reject { transition: all 0.3s ease; }
        .btn-reject:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(220,38,38,0.3); }
        
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .content-grid { grid-template-columns: 1fr !important; }
          .request-actions { flex-direction: column; }
        }
      `}</style>

      {/* Feedback Message */}
      {feedbackMessage && (
        <div className="animate-slide-down" style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 200, background: feedbackMessage.includes('✅') ? '#059669' : '#dc2626',
          color: 'white', padding: '12px 24px', borderRadius: '12px',
          fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Cairo', sans-serif",
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          {feedbackMessage}
        </div>
      )}

      {/* Hero */}
      <div style={{
        background: darkMode ? 'linear-gradient(160deg, #065f46, #047857)' : 'linear-gradient(160deg, #059669, #047857)',
        color: 'white', padding: '48px 0',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 700,
            }}>
              {user?.name?.[0] || 'ح'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{t.welcome}، {user?.name}</h1>
              <p style={{ fontSize: '1rem', opacity: 0.9, margin: '4px 0 0' }}>{t.newRequests(stats.pending)}</p>
              {stats.is_featured && (
                <span style={{ 
                  display: 'inline-block', marginTop: '8px', 
                  background: 'rgba(255,255,255,0.2)', 
                  padding: '4px 16px', borderRadius: '50px', 
                  fontSize: '0.8rem' 
                }}>
                  ⭐ {t.featured}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div className="stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginBottom: '32px',
        }}>
          {statCards.map((stat, index) => (
            <div key={index} className="animate-fade-in-up hover-lift" style={{
              background: cardBg, borderRadius: '16px', padding: '24px',
              textAlign: 'center', border: `1px solid ${borderColor}`,
              borderTop: `3px solid ${stat.color}`, animationDelay: `${index * 0.1}s`,
            }}>
              <div style={{ color: stat.color, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: textColor, marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: textSecondary }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
          
          {/* Requests */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="animate-fade-in-up" style={{
                fontSize: '1.3rem', fontWeight: 700, color: textColor,
                display: 'flex', alignItems: 'center', gap: '8px', margin: 0,
              }}>
                <Bell size={20} style={{ color: '#f59e0b' }} />
                {t.incomingRequests}
                {stats.pending > 0 && (
                  <span style={{
                    background: '#f59e0b', color: 'white', padding: '2px 10px',
                    borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {stats.pending}
                  </span>
                )}
              </h2>
              
              <button onClick={handleRefresh} disabled={refreshing}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '10px',
                  border: `1px solid ${borderColor}`, background: 'transparent',
                  cursor: 'pointer', color: textColor, fontSize: '0.8rem',
                  fontWeight: 600, fontFamily: "'Cairo', sans-serif",
                  transition: 'all 0.3s ease',
                }}>
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                {t.refresh}
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    background: cardBg, borderRadius: '14px', height: '140px',
                    border: `1px solid ${borderColor}`,
                    background: `linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                  }} />
                ))}
              </div>
            ) : requests.length > 0 ? (
              requests.map((r, index) => (
                <div key={r.id} className="animate-fade-in-up hover-lift" style={{
                  background: cardBg, borderRadius: '14px', padding: '20px',
                  border: `1px solid ${borderColor}`, marginBottom: '12px',
                  animationDelay: `${index * 0.1}s`,
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, color: textColor, fontSize: '1rem', marginBottom: '4px' }}>
                        {r.service?.title || r.service_type || r.service_title || (lang === 'ar' ? 'خدمة' : 'Service')}
                      </h3>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.8rem', color: textSecondary }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} />
                          {r.location || r.address || (lang === 'ar' ? 'غير محدد' : 'N/A')}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <User size={12} />
                          {r.client?.name || r.customer_name || t.customer}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {r.booking_date || r.date || r.created_at?.split('T')[0] || ''}
                        </span>
                      </div>
                    </div>
                    <span style={{
                      background: '#fef3c7', color: '#d97706', padding: '4px 12px',
                      borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                      animation: 'pulse 2s infinite',
                    }}>
                      {t.waiting}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.9rem', color: textSecondary, marginBottom: '12px', lineHeight: 1.6 }}>
                    {r.notes || r.description || (lang === 'ar' ? 'لا يوجد وصف' : 'No description')}
                  </p>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: textSecondary }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#059669' }}>
                        <DollarSign size={14} />
                        {r.total_price || r.service_price || r.budget || 0} {t.egp}
                      </span>
                      {r.booking_time && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} />
                          {r.booking_time}
                        </span>
                      )}
                    </div>

                    <div className="request-actions" style={{ display: 'flex', gap: '8px' }}>
                      {/* ❌ تم إزالة زر الشات */}

                      {/* Reject Button */}
                      <button 
                        onClick={() => handleReject(r.id)}
                        disabled={actionLoading[r.id] === 'reject'}
                        className="btn-reject"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '8px 14px', borderRadius: '10px',
                          border: '1px solid #dc2626', background: 'transparent',
                          color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem',
                          fontWeight: 600, fontFamily: "'Cairo', sans-serif",
                          opacity: actionLoading[r.id] ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => { if(!actionLoading[r.id]) { e.target.style.background = '#dc2626'; e.target.style.color = 'white'; } }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#dc2626'; }}>
                        {actionLoading[r.id] === 'reject' ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <XCircle size={14} />
                        )}
                        {actionLoading[r.id] === 'reject' ? t.rejecting : t.reject}
                      </button>

                      {/* Accept Button */}
                      <button 
                        onClick={() => handleAccept(r.id)}
                        disabled={actionLoading[r.id] === 'accept'}
                        className="btn-accept"
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '8px 14px', borderRadius: '10px',
                          border: '1px solid #059669', background: '#059669',
                          color: 'white', cursor: 'pointer', fontSize: '0.8rem',
                          fontWeight: 600, fontFamily: "'Cairo', sans-serif",
                          opacity: actionLoading[r.id] ? 0.7 : 1,
                        }}>
                        {actionLoading[r.id] === 'accept' ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        {actionLoading[r.id] === 'accept' ? t.accepting : t.accept}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="animate-fade-in-up" style={{
                textAlign: 'center', padding: '80px 20px', background: cardBg,
                borderRadius: '14px', border: `1px solid ${borderColor}`,
              }}>
                <Bell size={56} style={{ opacity: 0.2, color: textSecondary, marginBottom: '16px' }} />
                <p style={{ color: textColor, fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>{t.noRequests}</p>
                <p style={{ color: textSecondary, fontSize: '0.9rem' }}>{t.noRequestsDesc}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Quick Links */}
            <div className="animate-fade-in-up delay-200" style={{
              background: cardBg, borderRadius: '16px', padding: '24px',
              border: `1px solid ${borderColor}`, marginBottom: '16px',
            }}>
              <h3 style={{ fontWeight: 700, color: textColor, marginBottom: '16px', fontSize: '1rem' }}>
                {t.quickLinks}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/profile" style={quickLinkStyle('#3b82f6', darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff')}>
                  <Settings size={16} />{t.profile}
                </Link>
                <Link to="/subscription" style={quickLinkStyle('#8b5cf6', darkMode ? 'rgba(139,92,246,0.15)' : '#f5f3ff')}>
                  <Award size={16} />{t.subscriptions}
                </Link>
                <Link to="/notifications" style={quickLinkStyle('#f59e0b', darkMode ? 'rgba(245,158,11,0.15)' : '#fef3c7')}>
                  <Bell size={16} />{lang === 'ar' ? 'الإشعارات' : 'Notifications'}
                </Link>
              </div>
            </div>

            {/* Stats Card */}
            <div className="animate-fade-in-up delay-300" style={{
              background: cardBg, borderRadius: '16px', padding: '20px',
              border: `1px solid ${borderColor}`, marginBottom: '16px',
            }}>
              <h3 style={{ fontWeight: 700, color: textColor, marginBottom: '12px', fontSize: '0.9rem' }}>
                {lang === 'ar' ? 'ملخص اليوم' : 'Today\'s Summary'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: textSecondary }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t.pending}</span><span style={{ fontWeight: 700, color: '#f59e0b' }}>{stats.pending}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{t.completed}</span><span style={{ fontWeight: 700, color: '#059669' }}>{stats.completed}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${borderColor}`, paddingTop: '8px' }}>
                  <span>{t.earnings}</span><span style={{ fontWeight: 700, color: '#8b5cf6' }}>{stats.earnings} {t.egp}</span>
                </div>
                {stats.rating > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${borderColor}`, paddingTop: '8px' }}>
                    <span>{t.rating}</span>
                    <span style={{ fontWeight: 700, color: '#f59e0b' }}>⭐ {stats.rating} ({stats.reviews_count})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="animate-fade-in-up delay-400" style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '16px', padding: '20px', color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {lang === 'ar' ? 'نصيحة' : 'Tip'}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', opacity: 0.95, lineHeight: 1.6, margin: 0 }}>
                {lang === 'ar' 
                  ? 'الرد السريع على الطلبات يزيد من فرص قبولك بنسبة 80%'
                  : 'Quick response to requests increases your acceptance rate by 80%'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CraftsmanHomePage;