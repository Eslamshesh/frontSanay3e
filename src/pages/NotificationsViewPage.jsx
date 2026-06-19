// src/pages/NotificationsViewPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import { 
  Bell, BellOff, Check, Trash2, Star, MessageCircle,
  Calendar, DollarSign, Megaphone, Eye,
  Clock, CheckCircle, XCircle, Sparkles,
  TrendingUp, Zap, Award, Loader
} from 'lucide-react';

const NotificationsViewPage = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [lang, setLang] = useState('ar');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const role = user?.role || 'customer';

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // ✅ جلب الإشعارات من API
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(filter === 'unread');
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.warn('⚠️ Notifications error:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
    setLoading(false);
  }, [filter]);

  // ✅ تعليم كمقروء
  const handleMarkAsRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.warn('⚠️ Mark read error:', error);
    }
  }, [loadNotifications]);

  // ✅ تعليم الكل كمقروء
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      loadNotifications();
    } catch (error) {
      console.warn('⚠️ Mark all read error:', error);
    }
  }, [loadNotifications]);

  // ✅ حذف إشعار
  const handleDelete = useCallback(async (id) => {
    try {
      await notificationService.deleteNotification(id);
      loadNotifications();
    } catch (error) {
      console.warn('⚠️ Delete notification error:', error);
    }
  }, [loadNotifications]);

  // ✅ حذف الكل (المقروءة فقط)
  const handleClearAll = useCallback(async () => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف كل الإشعارات المقروءة؟' : 'Are you sure you want to clear all read notifications?')) {
      try {
        await notificationService.clearAll();
        loadNotifications();
      } catch (error) {
        console.warn('⚠️ Clear all error:', error);
      }
    }
  }, [lang, loadNotifications]);

  // ✅ تحميل عند الفتح
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Filters
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  // Get notification icon and color
  const getNotificationStyle = (type) => {
    const styles = {
      NewBookingNotification: { icon: <Bell size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
      BookingStatusUpdatedNotification: { icon: <CheckCircle size={20} />, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
      NewCraftsmanRegistrationNotification: { icon: <Sparkles size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
      NewServicePostNotification: { icon: <Megaphone size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
      NewPostResponseNotification: { icon: <MessageCircle size={20} />, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
      NewMessageNotification: { icon: <MessageCircle size={20} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    };
    return styles[type] || { icon: <Bell size={20} />, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
  };

  // Format notification text
  const getNotificationText = (notif) => {
    return notif.data?.message || '';
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
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
      : (role === 'craftsman' 
        ? (lang === 'ar' ? 'إشعارات طلباتك وتقييماتك' : 'Your requests and reviews notifications')
        : (lang === 'ar' ? 'إشعارات المنصة' : 'Platform notifications')
      ),
    all: lang === 'ar' ? 'الكل' : 'All',
    unread: lang === 'ar' ? 'غير مقروءة' : 'Unread',
    markAllRead: lang === 'ar' ? 'تعليم الكل كمقروء' : 'Mark all as read',
    clearAll: lang === 'ar' ? 'حذف المقروءة' : 'Clear Read',
    noNotifications: lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications',
    noNotificationsDesc: lang === 'ar' ? 'كل الإشعارات هتظهر هنا أول ما توصل' : 'All notifications will appear here once they arrive',
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif", direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
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
            {notifications.filter(n => n.is_read).length > 0 && (
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
                  className={`notification-item animate-slide-left ${!notif.is_read ? 'unread' : ''}`}
                  style={{
                    background: !notif.is_read ? cardBg : (darkMode ? '#1e293b' : '#f8fafc'),
                    borderRadius: '14px', padding: '16px 20px',
                    border: `1px solid ${borderColor}`,
                    cursor: 'pointer', opacity: notif.is_read ? 0.7 : 1,
                    animationDelay: `${index * 0.08}s`,
                    display: 'flex', gap: '14px', alignItems: 'flex-start',
                  }}
                  onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
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
                      fontWeight: !notif.is_read ? 600 : 400,
                    }}>
                      {getNotificationText(notif)}
                    </p>
                    <span style={{
                      fontSize: '0.75rem', color: textSecondary,
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <Clock size={12} />
                      {formatTime(notif.created_at)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {!notif.is_read && (
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