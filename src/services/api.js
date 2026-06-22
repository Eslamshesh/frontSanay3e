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
  // ... جميع الدوال الموجودة ...
  
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

  updatePostResponse: async (postId, responseId, status) => {
    try {
      const res = await fetch(
        `${API_URL}/client/service-posts/${postId}/responses/${responseId}`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ status }),
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

  uploadMultiple: async (files, type = "portfolio") => {
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