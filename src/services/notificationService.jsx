// src/services/notificationService.jsx
import api from './api';

/**
 * خدمة الإشعارات - متكاملة مع الباك
 * جميع الدوال تستخدم API الحقيقي من الباك
 */

const notificationService = {

  // ============================================================
  // أنواع الإشعارات (حسب توثيق الباك)
  // ============================================================
  types: {
    // إشعارات العميل
    BOOKING_ACCEPTED: 'booking_accepted',
    BOOKING_REJECTED: 'booking_rejected',
    BOOKING_REMINDER: 'booking_reminder',
    CRAFTSMAN_ON_WAY: 'craftsman_on_way',
    PAYMENT_REMINDER: 'payment_reminder',
    NEW_MESSAGE_CUSTOMER: 'new_message_customer',
    PROMOTION_CUSTOMER: 'promotion_customer',
    SERVICE_COMPLETED: 'service_completed',
    
    // إشعارات الحرفي
    NEW_REQUEST: 'new_request',
    NEW_REVIEW: 'new_review',
    JOB_REMINDER: 'job_reminder',
    PAYMENT_RECEIVED: 'payment_received',
    NEW_MESSAGE_CRAFTSMAN: 'new_message_craftsman',
    PROMOTION_CRAFTSMAN: 'promotion_craftsman',
    PROFILE_VIEWED: 'profile_viewed',

    // إشعارات الأدمن
    NEW_CRAFTSMAN_REGISTRATION: 'new_craftsman_registration',
    NEW_BOOKING: 'new_booking',
    BOOKING_STATUS_UPDATED: 'booking_status_updated',
    NEW_SERVICE_POST: 'new_service_post',
    NEW_POST_RESPONSE: 'new_post_response',
    NEW_MESSAGE: 'new_message',
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

  // ✅ الحصول على أيقونة الإشعار حسب النوع
  getNotificationIcon: (type) => {
    const icons = {
      booking_accepted: '✅',
      booking_rejected: '❌',
      booking_reminder: '⏰',
      craftsman_on_way: '🚶',
      payment_reminder: '💰',
      new_message_customer: '💬',
      promotion_customer: '🎉',
      service_completed: '✔️',
      new_request: '📩',
      new_review: '⭐',
      job_reminder: '📋',
      payment_received: '💳',
      new_message_craftsman: '💬',
      promotion_craftsman: '🚀',
      profile_viewed: '👁️',
      new_craftsman_registration: '👤',
      new_booking: '📅',
      booking_status_updated: '🔄',
      new_service_post: '📢',
      new_post_response: '💬',
      new_message: '💬',
    };
    return icons[type] || '🔔';
  },

  // ✅ الحصول على لون الإشعار حسب النوع
  getNotificationColor: (type) => {
    const colors = {
      booking_accepted: '#059669',
      booking_rejected: '#dc2626',
      booking_reminder: '#f59e0b',
      craftsman_on_way: '#3b82f6',
      payment_reminder: '#ef4444',
      new_message_customer: '#8b5cf6',
      promotion_customer: '#ec4899',
      service_completed: '#10b981',
      new_request: '#f59e0b',
      new_review: '#8b5cf6',
      job_reminder: '#3b82f6',
      payment_received: '#059669',
      new_message_craftsman: '#8b5cf6',
      promotion_craftsman: '#ec4899',
      profile_viewed: '#6366f1',
      new_craftsman_registration: '#8b5cf6',
      new_booking: '#f59e0b',
      booking_status_updated: '#3b82f6',
      new_service_post: '#3b82f6',
      new_post_response: '#ec4899',
      new_message: '#6366f1',
    };
    return colors[type] || '#64748b';
  },

  // ✅ الحصول على نص الإشعار حسب النوع والبيانات
  getNotificationText: (notification) => {
    const { type, data } = notification;
    const messages = {
      booking_accepted: `✅ تم قبول حجزك مع ${data?.craftsmanName || 'الحرفي'}`,
      booking_rejected: `❌ تم رفض حجزك مع ${data?.craftsmanName || 'الحرفي'}`,
      booking_reminder: `⏰ تذكير: لديك حجز مع ${data?.craftsmanName || 'الحرفي'} في ${data?.date || ''}`,
      craftsman_on_way: `🚶 ${data?.craftsmanName || 'الحرفي'} في طريقه إليك، سيصل بعد ${data?.time || ''}`,
      payment_reminder: `💰 تذكير بدفع مبلغ ${data?.amount || ''}`,
      new_message_customer: `💬 رسالة جديدة من ${data?.from || ''}`,
      promotion_customer: `🎉 ${data?.title || ''}: ${data?.desc || ''}`,
      service_completed: `✔️ تم إكمال الخدمة بنجاح بواسطة ${data?.craftsmanName || 'الحرفي'}`,
      new_request: `📩 طلب جديد من ${data?.customerName || 'عميل'}`,
      new_review: `⭐ تقييم جديد من ${data?.customerName || 'عميل'} (${data?.rating || ''}⭐)`,
      job_reminder: `📋 تذكير: لديك مهمة مع ${data?.customerName || 'عميل'} في ${data?.date || ''}`,
      payment_received: `💰 تم استلام مبلغ ${data?.amount || ''} من ${data?.customerName || 'عميل'}`,
      new_message_craftsman: `💬 رسالة جديدة من ${data?.from || ''}`,
      promotion_craftsman: `🚀 ${data?.title || ''}: ${data?.desc || ''}`,
      profile_viewed: `👁️ تمت مشاهدة ملفك الشخصي ${data?.count || 0} مرة ${data?.period || ''}`,
      new_craftsman_registration: `👤 طلب تسجيل حرفي جديد: ${data?.name || ''}`,
      new_booking: `📅 حجز جديد من ${data?.clientName || 'عميل'}`,
      booking_status_updated: `🔄 تم تحديث حالة الحجز إلى: ${data?.status || ''}`,
      new_service_post: `📢 منشور جديد: ${data?.title || ''}`,
      new_post_response: `💬 رد جديد على منشورك من ${data?.craftsmanName || 'حرفي'}`,
      new_message: `💬 رسالة جديدة`,
    };
    return messages[type] || '🔔 لديك إشعار جديد';
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