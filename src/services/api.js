// src/services/api.js
const API_URL = process.env.REACT_APP_API_URL || "https://sanay3e-production.up.railway.app/api";

// ✅ دوال مساعدة
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getFormHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (!res) {
    throw new Error("NETWORK_ERROR");
  }

  let data;
  try {
    data = await res.json();
  } catch (parseError) {
    console.warn('⚠️ Response is not JSON, status:', res.status);
    if (res.ok) {
      return { success: true, message: "تم بنجاح" };
    }
    throw new Error(`SERVER_ERROR_${res.status}`);
  }

  if (!res.ok) {
    const message = data.message ||
      (data.errors ? Object.values(data.errors).flat().join(" | ") : `خطأ ${res.status}`);
    const error = new Error(message);
    error.errors = data.errors || null;
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

// ============================================================
// API Object
// ============================================================

const api = {
  // ============================================================
  // ✅ PUBLIC - الحرفيون
  // ============================================================
  getFeaturedCraftsmen: async () => {
    try {
      const res = await fetch(`${API_URL}/craftsmen/featured`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getFeaturedCraftsmen fallback:', error.message);
      return { craftsmen: [] };
    }
  },

  getCraftsmen: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.craft_id) query.append("craft_id", params.craft_id);
      if (params.city) query.append("city", params.city);
      if (params.search) query.append("search", params.search);
      if (params.sort_by) query.append("sort_by", params.sort_by);
      if (params.per_page) query.append("per_page", params.per_page);
      if (params.page) query.append("page", params.page);
      const res = await fetch(
        `${API_URL}/craftsmen.home.search?${query.toString()}`,
        { headers: getHeaders() }
      );
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getCraftsmen fallback:', error.message);
      return { craftsmen: [], meta: { total: 0, current_page: 1, last_page: 1, per_page: 12 } };
    }
  },

  getCraftsman: async (id) => {
    try {
      const res = await fetch(`${API_URL}/craftsmen.home.show/${id}`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getCraftsman fallback:', error.message);
      return { craftsman: null };
    }
  },

  getCrafts: async () => {
    try {
      const res = await fetch(`${API_URL}/crafts`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getCrafts fallback:', error.message);
      return { crafts: [] };
    }
  },

  // ============================================================
  // ✅ AUTH
  // ============================================================
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ Login error:', error.message);
      if (error.message === "NETWORK_ERROR" || error.message === "Failed to fetch") {
        throw new Error("لا يوجد اتصال بالخادم");
      }
      if (error.message.includes("SERVER_ERROR")) {
        throw new Error("حدث خطأ في الخادم");
      }
      throw error;
    }
  },

  /**
   * تسجيل عميل جديد
   * ⚠️ مهم: يجب الحصول على verified_token أولاً عبر:
   *   1. api.sendOtp(email)
   *   2. api.verifyOtp(email, otp, 'register')  →  يرجع verified_token
   *   3. تمرير verified_token هنا فورًا (صالح 30 دقيقة، يُحذف بعد الاستخدام)
   *
   * @param {object} data - { name, email, password, password_confirmation, phone?, verified_token }
   */
  registerClient: async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/register/client`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ registerClient error:', error.message);
      throw error;
    }
  },

  /**
   * تسجيل حرفي جديد (يدخل قائمة انتظار موافقة الأدمن)
   * ⚠️ تأكيد الإيميل (verified_token) معطّل حاليًا في هذا الإندبوينت من جهة السيرفر.
   *
   * formData المطلوب أن يحتوي على:
   *   first_name, last_name, email, phone, city,
   *   password, password_confirmation,
   *   national_id_front (file), national_id_back (file),
   *   craft_ids[] (array - أول عنصر يُعتبر is_primary),
   *   district?, latitude?, longitude?
   */
  registerCraftsman: async (formData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register/craftsman`, {
        method: "POST",
        headers: getFormHeaders(),
        body: formData,
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ registerCraftsman error:', error.message);
      throw error;
    }
  },

  logout: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ logout error:', error.message);
      return { success: true, message: "تم تسجيل الخروج" };
    }
  },

  getMe: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getMe error:', error.message);
      throw error;
    }
  },

  updateProfile: async (formData) => {
    try {
      const res = await fetch(`${API_URL}/auth/update-profile`, {
        method: "POST",
        headers: getFormHeaders(),
        body: formData,
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ updateProfile error:', error.message);
      throw error;
    }
  },

  changePassword: async (data) => {
    try {
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ changePassword error:', error.message);
      throw error;
    }
  },

  // ============================================================
  // ✅ OTP & VERIFICATION
  // ============================================================

  /**
   * إرسال كود OTP (6 أرقام، صالح 5 دقائق)
   * ⚠️ الإندبوينت الحالي يأخذ email فقط (وليس identifier/type/purpose)
   * @param {string} email
   */
  sendOtp: async (email) => {
    try {
      const res = await fetch(`${API_URL}/auth/otp/send`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ sendOtp error:', error.message);
      throw error;
    }
  },

  /**
   * التحقق من كود OTP
   * @param {string} email
   * @param {string} otp - 6 أرقام بالضبط
   * @param {'register'|'password_reset'} purpose
   *
   * Response لو purpose = 'register':       { verified: true, verified_token }
   * Response لو purpose = 'password_reset':  { verified: true, reset_token }
   */
  verifyOtp: async (email, otp, purpose = 'register') => {
    try {
      const res = await fetch(`${API_URL}/auth/otp/verify`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, otp, purpose }),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ verifyOtp error:', error.message);
      throw error;
    }
  },

  /**
   * نسيت كلمة المرور — يرسل كود OTP بالإيميل (نفس آلية sendOtp من الداخل)
   * Response دايمًا 200 بنفس الرسالة لأسباب أمنية (مفيش تأكيد إذا كان الإيميل موجود أو لا)
   */
  forgotPassword: async (email) => {
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ forgotPassword error:', error.message);
      throw error;
    }
  },

  /**
   * إعادة تعيين كلمة المرور بالـ reset_token المُرجَع من verifyOtp(purpose: 'password_reset')
   * الفلو الكامل:
   *   1. api.forgotPassword(email)
   *   2. api.verifyOtp(email, otp, 'password_reset')  →  يرجع reset_token
   *   3. api.resetPasswordWithOtp(reset_token, password, password_confirmation)
   */
  resetPasswordWithOtp: async (reset_token, password, password_confirmation) => {
    try {
      const res = await fetch(`${API_URL}/auth/reset-password-otp`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ reset_token, password, password_confirmation }),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ resetPasswordWithOtp error:', error.message);
      throw error;
    }
  },

  // ============================================================
  // ✅ CLIENT ROUTES
  // ============================================================
  getMyBookings: async (tab = 'upcoming') => {
    try {
      const res = await fetch(`${API_URL}/client/bookings?tab=${tab}`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getMyBookings fallback:', error.message);
      return { bookings: { data: [] } };
    }
  },

  /**
   * @param {object} data - { craftsman_id, service_id?, service_title?, booking_date, booking_time, notes?, location? }
   * service_id اختياري لكن لو مش موجود فـ service_title مطلوب.
   */
  createBooking: async (data) => {
    try {
      const res = await fetch(`${API_URL}/client/bookings.store`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ createBooking error:', error.message);
      throw error;
    }
  },

  getBooking: async (id) => {
    try {
      const res = await fetch(`${API_URL}/client/bookings.show/${id}`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getBooking error:', error.message);
      throw error;
    }
  },

  // يعمل فقط على حجوزات pending أو confirmed
  cancelBooking: async (id, reason = null) => {
    try {
      const res = await fetch(`${API_URL}/client/bookings.cancel/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
        body: reason ? JSON.stringify({ reason }) : undefined,
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ cancelBooking error:', error.message);
      throw error;
    }
  },

  // يعمل فقط على حجوزات completed، ولا يسمح بتقييم مكرر
  addReview: async (bookingId, data) => {
    try {
      const res = await fetch(
        `${API_URL}/client/bookings.addreview/${bookingId}/review`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(data),
        }
      );
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ addReview error:', error.message);
      throw error;
    }
  },

  // ============================================================
  // ✅ CRAFTSMAN ROUTES
  // ============================================================
  getCraftsmanStats: async () => {
    try {
      const res = await fetch(`${API_URL}/craftsman/stats`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getCraftsmanStats fallback:', error.message);
      return {
        stats: {
          total_earnings: 0,
          completed_bookings: 0,
          pending_bookings: 0,
          cancelled_bookings: 0,
          rating: 0,
          reviews_count: 0,
          is_featured: false
        }
      };
    }
  },

  // 403 لو الحرفي غير approved
  updateCraftsmanProfile: async (formData) => {
    try {
      const res = await fetch(`${API_URL}/craftsman/profile`, {
        method: "POST",
        headers: getFormHeaders(),
        body: formData,
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ updateCraftsmanProfile error:', error.message);
      throw error;
    }
  },

  getCraftsmanBookings: async () => {
    try {
      const res = await fetch(`${API_URL}/craftsman/bookings`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getCraftsmanBookings fallback:', error.message);
      return { bookings: { data: [] } };
    }
  },

  /**
   * @param {number} id
   * @param {'confirmed'|'in_progress'|'completed'|'rejected'} status
   * @param {string|null} reason - مطلوب فقط لو status = 'rejected'
   */
  updateBookingStatus: async (id, status, reason = null) => {
    try {
      const body = { status };
      if (reason) body.reason = reason;
      const res = await fetch(`${API_URL}/craftsman/bookings/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ updateBookingStatus error:', error.message);
      throw error;
    }
  },

  // ============================================================
  // ✅ SERVICE POSTS (CRAFTSMAN)
  // ============================================================
  getServicePosts: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.city) query.append("city", params.city);
      if (params.craft_id) query.append("craft_id", params.craft_id);
      if (params.urgency) query.append("urgency", params.urgency);
      if (params.search) query.append("search", params.search);
      if (params.per_page) query.append("per_page", params.per_page);
      if (params.page) query.append("page", params.page);
      const res = await fetch(
        `${API_URL}/craftsman/service-posts?${query.toString()}`,
        { headers: getHeaders() }
      );
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getServicePosts fallback:', error.message);
      return { posts: { data: [] } };
    }
  },

  /**
   * @param {number} postId
   * @param {object} data - { message, offered_price?, estimated_days? }
   * 403 لو الحرفي غير approved. 422 لو رد على نفس المنشور مسبقًا.
   */
  respondToServicePost: async (postId, data) => {
    try {
      const res = await fetch(
        `${API_URL}/craftsman/service-posts/${postId}/respond`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(data),
        }
      );
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ respondToServicePost error:', error.message);
      throw error;
    }
  },

  // ============================================================
  // ✅ SERVICE POSTS (CLIENT)
  // ============================================================
  getMyPosts: async () => {
    try {
      const res = await fetch(`${API_URL}/client/my-posts`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getMyPosts error:', error.message);
      throw error;
    }
  },

  // formData: title, description, craft_id?, custom_craft?, location?, city?,
  //           budget_from?, budget_to?, needed_by?, urgency?, images[]?
  createServicePost: async (formData) => {
    try {
      const res = await fetch(`${API_URL}/client/service-posts.store`, {
        method: "POST",
        headers: getFormHeaders(),
        body: formData,
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ createServicePost error:', error.message);
      throw error;
    }
  },

  getServicePost: async (id) => {
    try {
      const res = await fetch(`${API_URL}/client/service-posts/${id}`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getServicePost error:', error.message);
      throw error;
    }
  },

  // يحول المنشور لحالة closed
  deleteServicePost: async (id) => {
    try {
      const res = await fetch(`${API_URL}/client/service-posts.destroy/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ deleteServicePost error:', error.message);
      throw error;
    }
  },

  /**
   * قبول/رفض رد حرفي على منشور
   * ⚠️ الباك إند يتوقع x-www-form-urlencoded (وليس JSON) في هذا الإندبوينت بالتحديد
   * @param {number} postId
   * @param {number} responseId
   * @param {'accepted'|'rejected'} status
   */
  updatePostResponse: async (postId, responseId, status) => {
    try {
      const res = await fetch(
        `${API_URL}/client/service-posts/${postId}/responses/${responseId}`,
        {
          method: "PATCH",
          headers: {
            ...getHeaders(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ status }).toString(),
        }
      );
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ updatePostResponse error:', error.message);
      throw error;
    }
  },

  // ============================================================
  // ✅ UPLOAD
  // ============================================================

  /**
   * @param {File} file
   * @param {'avatar'|'profile_photo'|'national_id'|'portfolio'|'post_image'|'chat_file'|'document'} type
   * الحد الأقصى للحجم يعتمد على type (راجع التوثيق: avatar=2MB, profile_photo/national_id/post_image=5MB,
   * portfolio=8MB, chat_file/document=10MB)
   */
  uploadImage: async (file, type = "avatar") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      const res = await fetch(`${API_URL}/upload/image`, {
        method: "POST",
        headers: getFormHeaders(),
        body: formData,
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ uploadImage error:', error.message);
      throw error;
    }
  },

  /**
   * @param {File[]} files - حتى 10 ملفات
   * @param {'portfolio'|'post_image'|'chat_file'} type
   */
  uploadMultiple: async (files, type = "post_image") => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files[]", file));
      formData.append("type", type);
      const res = await fetch(`${API_URL}/upload/multiple`, {
        method: "POST",
        headers: getFormHeaders(),
        body: formData,
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ uploadMultiple error:', error.message);
      throw error;
    }
  },

  // file: pdf/doc/docx/xls/xlsx/txt حتى 10MB
  uploadDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/upload/document`, {
        method: "POST",
        headers: getFormHeaders(),
        body: formData,
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ uploadDocument error:', error.message);
      throw error;
    }
  },

  // path مثال: "avatars/abc123.jpg" — يرفض المسارات التي تحتوي على ".." أو تبدأ بـ "/"
  deleteFile: async (path) => {
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({ path }),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ deleteFile error:', error.message);
      throw error;
    }
  },

  // ============================================================
  // ✅ REVIEWS
  // ============================================================

  /**
   * جلب كل التقييمات — GET /api/auth/reviews
   * Response: { data: [ { id, booking_id, client_id, craftsman_id, rating, comment, is_visible, created_at, client, craftsman } ] }
   */
  getReviews: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/reviews`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getReviews fallback:', error.message);
      return { data: [] };
    }
  },

  // ============================================================
  // ✅ NOTIFICATIONS
  // ============================================================
  getNotifications: async (unreadOnly = false, perPage = 20) => {
    try {
      const query = new URLSearchParams();
      if (unreadOnly) query.append("unread_only", "true");
      query.append("per_page", perPage);
      const res = await fetch(
        `${API_URL}/notifications?${query.toString()}`,
        { headers: getHeaders() }
      );
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getNotifications fallback:', error.message);
      return { notifications: [], unread_count: 0, meta: { total: 0 } };
    }
  },

  getUnreadCount: async () => {
    try {
      const res = await fetch(`${API_URL}/notifications/count`, {
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ getUnreadCount fallback:', error.message);
      return { unread_count: 0 };
    }
  },

  markNotificationRead: async (id) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ markNotificationRead error:', error.message);
      throw error;
    }
  },

  markAllNotificationsRead: async () => {
    try {
      const res = await fetch(`${API_URL}/notifications/read-all`, {
        method: "POST",
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ markAllNotificationsRead error:', error.message);
      throw error;
    }
  },

  deleteNotification: async (id) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ deleteNotification error:', error.message);
      throw error;
    }
  },

  // يحذف فقط الإشعارات المقروءة
  clearAllNotifications: async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return await handleResponse(res);
    } catch (error) {
      console.warn('⚠️ clearAllNotifications error:', error.message);
      throw error;
    }
  },
};

export default api;
