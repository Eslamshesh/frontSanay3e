// src/services/notificationService.jsx
import api from './api';

/**
 * خدمة الإشعارات - متكاملة مع الباك
 * جميع الدوال تستخدم API الحقيقي من الباك
 */

const notificationService = {

  // ============================================================
  // أنواع الإشعارات — القيم الحقيقية كما يُرجعها الباك (class names)
  // ============================================================
  types: {
    NEW_BOOKING: 'NewBookingNotification',                              // للحرفي: حجز جديد
    BOOKING_STATUS_UPDATED: 'BookingStatusUpdatedNotification',         // للعميل: تحديث حالة الحجز
    NEW_CRAFTSMAN_REGISTRATION: 'NewCraftsmanRegistrationNotification', // للأدمن: طلب تسجيل حرفي
    NEW_SERVICE_POST: 'NewServicePostNotification',                     // للحرفي: منشور خدمة جديد
    NEW_POST_RESPONSE: 'NewPostResponseNotification',                   // للعميل: رد على منشور
    NEW_MESSAGE: 'NewMessageNotification',                              // للجميع: رسالة جديدة
  },

  // ============================================================
  // جلب الإشعارات من الباك
  // ============================================================

  // ✅ جلب كل الإشعارات
  getNotifications: async (unreadOnly = false, perPage = 20) => {
    try {
      const data = await api.getNotifications(unreadOnly, perPage);
      return {
        notifications: data.notifications || [],
        unreadCount: data.unread_count || 0,
        meta: data.meta || {},
      };
    } catch (error) {
      console.error('⚠️ Error fetching notifications:', error);
      return {
        notifications: [],
        unreadCount: 0,
        meta: {},
      };
    }
  },

  // ✅ جلب عدد الإشعارات غير المقروءة
  getUnreadCount: async () => {
    try {
      const data = await api.getUnreadCount();
      return data.unread_count || 0;
    } catch (error) {
      console.error('⚠️ Error fetching unread count:', error);
      return 0;
    }
  },

  // ============================================================
  // تحديث حالة الإشعارات
  // ============================================================

  // ✅ تعليم إشعار كمقروء
  markAsRead: async (notificationId) => {
    try {
      const data = await api.markNotificationRead(notificationId);
      return data;
    } catch (error) {
      console.error('⚠️ Error marking notification as read:', error);
      throw error;
    }
  },

  // ✅ تعليم كل الإشعارات كمقروءة
  markAllAsRead: async () => {
    try {
      const data = await api.markAllNotificationsRead();
      return data;
    } catch (error) {
      console.error('⚠️ Error marking all notifications as read:', error);
      throw error;
    }
  },

  // ============================================================
  // حذف الإشعارات
  // ============================================================

  // ✅ حذف إشعار
  deleteNotification: async (notificationId) => {
    try {
      const data = await api.deleteNotification(notificationId);
      return data;
    } catch (error) {
      console.error('⚠️ Error deleting notification:', error);
      throw error;
    }
  },

  // ✅ حذف كل الإشعارات المقروءة
  clearAll: async () => {
    try {
      const data = await api.clearAllNotifications();
      return data;
    } catch (error) {
      console.error('⚠️ Error clearing notifications:', error);
      throw error;
    }
  },

  // ============================================================
  // إرسال إشعار (للاستخدام الداخلي)
  // ============================================================

  // ✅ إرسال إشعار (الباك هو اللي يرسل فعلياً)
  // هذه الدالة للاستخدام الداخلي فقط - الباك يرسل الإشعارات
  sendNotification: (type, data) => {
    // ملاحظة: الإشعارات تُرسل من الباك عبر Events/WebSocket
    // هذه مجرد واجهة للتوثيق
    console.log('📢 Notification would be sent by backend:', { type, data });
    return { 
      success: true, 
      message: 'Notification will be sent by backend',
      type,
      data 
    };
  },

  // ============================================================
  // دوال مساعدة (Helper Functions)
  // ============================================================

  // ✅ الحصول على أيقونة الإشعار حسب النوع (class names من الباك)
  getNotificationIcon: (type) => {
    const icons = {
      NewBookingNotification: '📅',
      BookingStatusUpdatedNotification: '🔄',
      NewCraftsmanRegistrationNotification: '👤',
      NewServicePostNotification: '📢',
      NewPostResponseNotification: '💬',
      NewMessageNotification: '💬',
    };
    return icons[type] || '🔔';
  },

  // ✅ الحصول على لون الإشعار حسب النوع (class names من الباك)
  getNotificationColor: (type) => {
    const colors = {
      NewBookingNotification: '#f59e0b',
      BookingStatusUpdatedNotification: '#3b82f6',
      NewCraftsmanRegistrationNotification: '#8b5cf6',
      NewServicePostNotification: '#3b82f6',
      NewPostResponseNotification: '#ec4899',
      NewMessageNotification: '#6366f1',
    };
    return colors[type] || '#64748b';
  },

  // ✅ الحصول على نص الإشعار
  // الباك بيرجع data.message جاهز — نستخدمه أولاً، وفي حالة غيابه نعمل fallback
  getNotificationText: (notification) => {
    const { type, data } = notification;

    // الباك بيرجع data.message مباشرةً في كل الإشعارات — هذا هو المصدر الأساسي
    if (data?.message) return data.message;

    // Fallback لو data.message مش موجود (احتياطي)
    const fallbacks = {
      NewBookingNotification: `📅 حجز جديد من ${data?.client_name || 'عميل'}`,
      BookingStatusUpdatedNotification: `🔄 تم تحديث حالة الحجز إلى: ${data?.status || ''}`,
      NewCraftsmanRegistrationNotification: `👤 طلب تسجيل حرفي جديد: ${data?.name || ''}`,
      NewServicePostNotification: `📢 منشور خدمة جديد: ${data?.title || ''}`,
      NewPostResponseNotification: `💬 رد جديد على منشورك من ${data?.craftsman_name || 'حرفي'}`,
      NewMessageNotification: `💬 رسالة جديدة`,
    };
    return fallbacks[type] || '🔔 لديك إشعار جديد';
  },

  // ✅ تنسيق الوقت
  formatTime: (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'الآن';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} د`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} س`;
    if (diff < 172800000) return 'أمس';
    return date.toLocaleDateString('ar-EG');
  },
};

export default notificationService;