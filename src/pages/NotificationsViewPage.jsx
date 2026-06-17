import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import api from '../services/api';
import { 
  Bell, BellOff, Check, Trash2, Star, MessageCircle,
  Calendar, DollarSign, Megaphone, User, Eye,
  Wrench, MapPin, Clock, ChevronLeft, Filter,
  CheckCircle, XCircle, AlertCircle, Sparkles,
  TrendingUp, Zap, Heart, Award, Loader
} from 'lucide-react';

const NotificationsViewPage = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [animateIn, setAnimateIn] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const role = userData?.role || 'customer';

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // ✅ تعريف loadNotifications قبل استخدامها
  const loadNotifications = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        // Try API first
        const data = notificationService.getUserNotifications(userData.email, role);
        setNotifications(data);
      } catch {
        // Fallback
        const data = notificationService.getUserNotifications(userData.email, role);
        setNotifications(data);
      }
      setLoading(false);
    }, 500);
  }, [userData.email, role]);

  // ✅ تعريف handleMarkAsRead
  const handleMarkAsRead = useCallback((id) => {
    try {
      api.markNotificationAsRead(id);
    } catch {}
    notificationService.markAsRead(id);
    loadNotifications();
  }, [loadNotifications]);

  // ✅ تعريف handleMarkAllAsRead
  const handleMarkAllAsRead = useCallback(() => {
    try {
      api.markAllNotificationsAsRead();
    } catch {}
    notificationService.markAllAsRead(userData.email);
    loadNotifications();
  }, [loadNotifications, userData.email]);

  // ✅ تعريف handleDelete
  const handleDelete = useCallback((id) => {
    try {
      api.deleteNotification(id);
    } catch {}
    notificationService.deleteNotification(id);
    loadNotifications();
  }, [loadNotifications]);

  // ✅ تعريف handleClearAll
  const handleClearAll = useCallback(() => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف كل الإشعارات؟' : 'Are you sure you want to delete all notifications?')) {
      notificationService.clearAll(userData.email);
      setNotifications([]);
    }
  }, [lang, userData.email]);

  // ✅ Load notifications on mount
  useEffect(() => {
    loadNotifications();
    setAnimateIn(true);

    // Listen for new notifications
    const handleNewNotification = () => loadNotifications();
    window.addEventListener('newNotification', handleNewNotification);
    return () => window.removeEventListener('newNotification', handleNewNotification);
  }, [loadNotifications]);

  // Add demo notifications if empty
  useEffect(() => {
    const existing = notificationService.getUserNotifications(userData.email, role);
    if (existing.length === 0) {
      notificationService.addDemoNotifications(userData.email, role);
      loadNotifications();
    }
  }, []); // eslint-disable-line

  // Filters
  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  // Get notification icon and color
  const getNotificationStyle = (type) => {
    const styles = {
      booking_accepted: { icon: <CheckCircle size={20} />, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
      booking_rejected: { icon: <XCircle size={20} />, color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
      booking_reminder: { icon: <Calendar size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
      craftsman_on_way: { icon: <Zap size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
      payment_reminder: { icon: <DollarSign size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
      new_message_customer: { icon: <MessageCircle size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
      promotion_customer: { icon: <Megaphone size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
      service_completed: { icon: <Award size={20} />, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
      new_request: { icon: <Bell size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
      new_review: { icon: <Star size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
      job_reminder: { icon: <Clock size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
      payment_received: { icon: <DollarSign size={20} />, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
      new_message_craftsman: { icon: <MessageCircle size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
      promotion_craftsman: { icon: <TrendingUp size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
      profile_viewed: { icon: <Eye size={20} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    };
    return styles[type] || { icon: <Bell size={20} />, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
  };

  // Format notification text
  const getNotificationText = (notif) => {
    const { type, data } = notif;
    const texts = {
      booking_accepted: lang === 'ar' 
        ? `✅ ${data.craftsmanName} قبل طلبك لخدمة ${data.service} - الموعد: ${data.date}`
        : `✅ ${data.craftsmanName} accepted your ${data.service} request - ${data.date}`,
      booking_rejected: lang === 'ar'
        ? `❌ للأسف، ${data.craftsmanName} رفض طلبك لخدمة ${data.service}`
        : `❌ Unfortunately, ${data.craftsmanName} rejected your ${data.service} request`,
      booking_reminder: lang === 'ar'
        ? `⏰ تذكير: موعدك مع ${data.craftsmanName} لخدمة ${data.service} ${data.date}`
        : `⏰ Reminder: Your ${data.service} appointment with ${data.craftsmanName} is ${data.date}`,
      craftsman_on_way: lang === 'ar'
        ? `🚀 ${data.craftsmanName} في الطريق إليك! يصل خلال ${data.time}`
        : `🚀 ${data.craftsmanName} is on the way! Arriving in ${data.time}`,
      payment_reminder: lang === 'ar'
        ? `💳 متنساش تدفع ${data.amount || ''} جنيه للصنايعي`
        : `💳 Don't forget to pay ${data.amount || ''} EGP to the craftsman`,
      new_message_customer: lang === 'ar'
        ? `💬 رسالة جديدة من ${data.from}: "${data.preview}"`
        : `💬 New message from ${data.from}: "${data.preview}"`,
      promotion_customer: lang === 'ar'
        ? `🎉 ${data.title}! ${data.desc}`
        : `🎉 ${data.title}! ${data.desc}`,
      service_completed: lang === 'ar'
        ? `🌟 تم إتمام خدمة ${data.service} مع ${data.craftsmanName} - قيم الخدمة!`
        : `🌟 ${data.service} service completed with ${data.craftsmanName} - Rate it!`,
      new_request: lang === 'ar'
        ? `🆕 طلب ${data.service} جديد من ${data.customerName} في ${data.location} - ${data.budget} ج`
        : `🆕 New ${data.service} request from ${data.customerName} in ${data.location} - ${data.budget} EGP`,
      new_review: lang === 'ar'
        ? `⭐ ${data.customerName} قيمك ${'★'.repeat(data.rating)} - "${data.comment}"`
        : `⭐ ${data.customerName} rated you ${'★'.repeat(data.rating)} - "${data.comment}"`,
      job_reminder: lang === 'ar'
        ? `⏰ تذكير: عندك معاد ${data.service || 'خدمة'} ${data.date || 'قريب'}`
        : `⏰ Reminder: You have a ${data.service || 'service'} appointment ${data.date || 'soon'}`,
      payment_received: lang === 'ar'
        ? `💰 استلمت ${data.amount} ج من ${data.customerName} عن خدمة ${data.service}`
        : `💰 Received ${data.amount} EGP from ${data.customerName} for ${data.service}`,
      new_message_craftsman: lang === 'ar'
        ? `💬 رسالة جديدة من ${data.from}: "${data.preview}"`
        : `💬 New message from ${data.from}: "${data.preview}"`,
      promotion_craftsman: lang === 'ar'
        ? `🚀 ${data.title}! ${data.desc}`
        : `🚀 ${data.title}! ${data.desc}`,
      profile_viewed: lang === 'ar'
        ? `👁️ ${data.count} شخص شاف ملفك ${data.period}`
        : `👁️ ${data.count} people viewed your profile ${data.period}`,
    };
    return texts[type] || '';
  };

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return lang === 'ar' ? 'الآن' : 'Now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} ${lang === 'ar' ? 'د' : 'm'}`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ${lang === 'ar' ? 'س' : 'h'}`;
    if (diff < 172800000) return lang === 'ar' ? 'أمس' : 'Yesterday';
    return date.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US');
  };

  // Translations
  const t = {
    title: lang === 'ar' ? 'الإشعارات' : 'Notifications',
    subtitle: role === 'customer' 
      ? (lang === 'ar' ? 'إشعارات طلباتك وخدماتك' : 'Your requests and services notifications')
      : (lang === 'ar' ? 'إشعارات طلباتك وتقييماتك' : 'Your requests and reviews notifications'),
    all: lang === 'ar' ? 'الكل' : 'All',
    unread: lang === 'ar' ? 'غير مقروءة' : 'Unread',
    markAllRead: lang === 'ar' ? 'تعليم الكل كمقروء' : 'Mark all as read',
    clearAll: lang === 'ar' ? 'حذف الكل' : 'Clear All',
    noNotifications: lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications',
    noNotificationsDesc: lang === 'ar' ? 'كل الإشعارات هتظهر هنا أول ما توصل' : 'All notifications will appear here once they arrive',
    unreadCount: (count) => lang === 'ar' ? `${count} غير مقروءة` : `${count} unread`,
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .animate-slide-left { animation: slideLeft 0.4s ease forwards; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .notification-item { transition: all 0.3s ease; }
        .notification-item:hover { transform: translateX(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .notification-item.unread { border-right: 3px solid #3b82f6; }
        
        .skeleton {
          background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @media (max-width: 768px) {
          .notif-header { flex-direction: column; gap: 12px; }
          .notif-actions { flex-wrap: wrap; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: darkMode ? 'linear-gradient(160deg, #1e3a8a, #1e40af)' : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
        color: 'white', padding: '40px 0',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <Bell size={24} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: '#ef4444', color: 'white', width: '22px', height: '22px',
                  borderRadius: '50%', fontSize: '0.7rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid white', animation: 'pulse 2s infinite',
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{t.title}</h1>
              <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: '2px 0 0' }}>{t.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
        
        {/* Filters & Actions */}
        <div className="animate-fade-in-up notif-header" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px', gap: '12px',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setFilter('all')}
              style={{
                padding: '8px 18px', borderRadius: '50px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                fontFamily: "'Cairo', sans-serif", transition: 'all 0.3s ease',
                background: filter === 'all' ? '#3b82f6' : (darkMode ? '#334155' : '#e2e8f0'),
                color: filter === 'all' ? 'white' : textColor,
              }}>
              {t.all} ({notifications.length})
            </button>
            <button onClick={() => setFilter('unread')}
              style={{
                padding: '8px 18px', borderRadius: '50px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                fontFamily: "'Cairo', sans-serif", transition: 'all 0.3s ease',
                background: filter === 'unread' ? '#3b82f6' : (darkMode ? '#334155' : '#e2e8f0'),
                color: filter === 'unread' ? 'white' : textColor,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                {t.unread}
                {unreadCount > 0 && (
                  <span style={{
                    background: '#ef4444', color: 'white', padding: '2px 8px',
                    borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
          </div>

          <div className="notif-actions" style={{ display: 'flex', gap: '8px' }}>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead}
                style={{
                  padding: '8px 14px', borderRadius: '10px', border: `1px solid ${borderColor}`,
                  background: 'transparent', cursor: 'pointer', color: '#3b82f6',
                  fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease',
                }}>
                <Check size={14} />{t.markAllRead}
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={handleClearAll}
                style={{
                  padding: '8px 14px', borderRadius: '10px', border: `1px solid ${borderColor}`,
                  background: 'transparent', cursor: 'pointer', color: '#dc2626',
                  fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.3s ease',
                }}>
                <Trash2 size={14} />{t.clearAll}
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton" style={{ borderRadius: '14px', height: '80px' }} />
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredNotifications.map((notif, index) => {
              const style = getNotificationStyle(notif.type);
              return (
                <div key={notif.id}
                  className={`notification-item animate-slide-left ${!notif.read ? 'unread' : ''}`}
                  style={{
                    background: !notif.read ? cardBg : (darkMode ? '#1e293b' : '#f8fafc'),
                    borderRadius: '14px', padding: '16px 20px',
                    border: `1px solid ${borderColor}`,
                    cursor: 'pointer', opacity: notif.read ? 0.7 : 1,
                    animationDelay: `${index * 0.08}s`,
                    display: 'flex', gap: '14px', alignItems: 'flex-start',
                  }}
                  onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: style.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: style.color,
                  }}>
                    {style.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '0.9rem', color: textColor,
                      lineHeight: 1.6, margin: '0 0 4px',
                      fontWeight: !notif.read ? 600 : 400,
                    }}>
                      {getNotificationText(notif)}
                    </p>
                    <span style={{
                      fontSize: '0.75rem', color: textSecondary,
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <Clock size={12} />
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {!notif.read && (
                      <button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notif.id); }}
                        style={{
                          width: '32px', height: '32px', borderRadius: '8px',
                          border: 'none', cursor: 'pointer', background: 'rgba(5,150,105,0.1)',
                          color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                        <Check size={14} />
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.1)',
                        color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                      <XCircle size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="animate-fade-in" style={{
            textAlign: 'center', padding: '80px 20px',
            background: cardBg, borderRadius: '16px',
            border: `1px solid ${borderColor}`,
          }}>
            <BellOff size={64} style={{ color: textSecondary, opacity: 0.4, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
              {t.noNotifications}
            </h3>
            <p style={{ color: textSecondary, fontSize: '0.95rem' }}>
              {t.noNotificationsDesc}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsViewPage;