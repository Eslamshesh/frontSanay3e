// src/services/notificationService.jsx

const notificationService = {
  // أنواع الإشعارات حسب الدور
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
    
    // إشعارات الصنايعي
    NEW_REQUEST: 'new_request',
    NEW_REVIEW: 'new_review',
    JOB_REMINDER: 'job_reminder',
    PAYMENT_RECEIVED: 'payment_received',
    NEW_MESSAGE_CRAFTSMAN: 'new_message_craftsman',
    PROMOTION_CRAFTSMAN: 'promotion_craftsman',
    PROFILE_VIEWED: 'profile_viewed',
  },

  // إرسال إشعار جديد
  sendNotification(userId, type, data) {
    const notifications = this.getAllNotifications();
    const notification = {
      id: Date.now(),
      userId,
      type,
      data,
      read: false,
      createdAt: new Date().toISOString()
    };
    notifications.push(notification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Trigger custom event for real-time updates
    window.dispatchEvent(new CustomEvent('newNotification', { detail: notification }));
  },

  // جلب إشعارات مستخدم معين
  getUserNotifications(userId, role) {
    const all = this.getAllNotifications();
    const customerTypes = [
      'booking_accepted', 'booking_rejected', 'booking_reminder',
      'craftsman_on_way', 'payment_reminder', 'new_message_customer',
      'promotion_customer', 'service_completed'
    ];
    const craftsmanTypes = [
      'new_request', 'new_review', 'job_reminder',
      'payment_received', 'new_message_craftsman',
      'promotion_craftsman', 'profile_viewed'
    ];

    return all.filter(n => {
      if (n.userId !== userId) return false;
      if (role === 'customer') return customerTypes.includes(n.type);
      if (role === 'craftsman') return craftsmanTypes.includes(n.type);
      return true;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // تعليم كمقروء
  markAsRead(notificationId) {
    const notifications = this.getAllNotifications();
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
  },

  // تعليم الكل كمقروء
  markAllAsRead(userId) {
    const notifications = this.getAllNotifications();
    const updated = notifications.map(n =>
      n.userId === userId ? { ...n, read: true } : n
    );
    localStorage.setItem('notifications', JSON.stringify(updated));
  },

  // حذف إشعار
  deleteNotification(notificationId) {
    const notifications = this.getAllNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    localStorage.setItem('notifications', JSON.stringify(filtered));
  },

  // مسح كل الإشعارات
  clearAll(userId) {
    const notifications = this.getAllNotifications();
    const filtered = notifications.filter(n => n.userId !== userId);
    localStorage.setItem('notifications', JSON.stringify(filtered));
  },

  // عدد غير المقروء
  getUnreadCount(userId, role) {
    const userNotifications = this.getUserNotifications(userId, role);
    return userNotifications.filter(n => !n.read).length;
  },

  // جلب كل الإشعارات
  getAllNotifications() {
    try {
      return JSON.parse(localStorage.getItem('notifications') || '[]');
    } catch {
      return [];
    }
  },

  // إضافة إشعارات تجريبية للعرض
  addDemoNotifications(userId, role) {
    const demos = role === 'customer' ? [
      {
        userId,
        type: 'booking_accepted',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        data: { craftsmanName: 'محمد علي', service: 'سباكة', date: 'غداً 10:00 ص', location: 'مدينة نصر' }
      },
      {
        userId,
        type: 'craftsman_on_way',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        data: { craftsmanName: 'أحمد حسن', service: 'كهرباء', time: '15 دقيقة' }
      },
      {
        userId,
        type: 'service_completed',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        data: { craftsmanName: 'كريم سعيد', service: 'نجارة', rating: 5 }
      },
      {
        userId,
        type: 'new_message_customer',
        read: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        data: { from: 'محمود فؤاد', preview: 'السلام عليكم، أنا في الطريق...' }
      },
      {
        userId,
        type: 'promotion_customer',
        read: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        data: { title: 'خصم 20%', desc: 'على جميع خدمات السباكة هذا الأسبوع' }
      },
      {
        userId,
        type: 'booking_reminder',
        read: false,
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        data: { craftsmanName: 'سامح عبدالله', service: 'دهان', date: 'بعد غد 2:00 م' }
      }
    ] : [
      {
        userId,
        type: 'new_request',
        read: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        data: { customerName: 'أحمد محمود', service: 'سباكة', location: 'مدينة نصر', budget: 150 }
      },
      {
        userId,
        type: 'new_review',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        data: { customerName: 'سارة علي', rating: 5, comment: 'خدمة ممتازة وسريعة' }
      },
      {
        userId,
        type: 'payment_received',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        data: { customerName: 'محمد حسين', amount: 200, service: 'كهرباء' }
      },
      {
        userId,
        type: 'new_message_craftsman',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        data: { from: 'نورا أحمد', preview: 'ممكن أعرف السعر النهائي؟' }
      },
      {
        userId,
        type: 'profile_viewed',
        read: true,
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        data: { count: 15, period: 'هذا الأسبوع' }
      },
      {
        userId,
        type: 'promotion_craftsman',
        read: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        data: { title: 'فرصة ذهبية', desc: 'ضع إعلانك في الصفحة الأولى مجاناً لمدة 3 أيام' }
      }
    ];

    const notifications = this.getAllNotifications();
    const newNotifications = [...notifications, ...demos.map(d => ({ ...d, id: Date.now() + Math.random() }))];
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
  }
};

export default notificationService;