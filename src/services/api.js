// src/services/api.js
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// ✅ مصلح: بنجيب الـ token من المكان الصح
const getHeaders = () => {
  const token = localStorage.getItem("token"); // ✅ مش من user object
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ✅ helper للتعامل مع الـ response وأخطاء الـ server
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    // Laravel بيرجع errors في data.message أو data.errors
    const message =
      data.message ||
      (data.errors ? Object.values(data.errors).flat().join(' | ') : 'حدث خطأ');
    throw new Error(message);
  }
  return data;
};

const api = {
  // ===== AUTH =====
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res); // ✅ بيرجع { token, user } من Laravel
  },

  registerClient: async (data) => {
    const res = await fetch(`${API_URL}/auth/register/client`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  registerCraftsman: async (data) => {
    const res = await fetch(`${API_URL}/auth/register/craftsman`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateProfile: async (data) => {
    const res = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // ===== CRAFTSMEN =====
  getCraftsmen: async () => {
    const res = await fetch(`${API_URL}/craftsmen`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getCraftsman: async (id) => {
    const res = await fetch(`${API_URL}/craftsmen/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getFeaturedCraftsmen: async () => {
    const res = await fetch(`${API_URL}/craftsmen/featured`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // ===== BOOKINGS =====
  createBooking: async (data) => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  getMyBookings: async () => {
    const res = await fetch(`${API_URL}/bookings`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getBooking: async (id) => {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateBookingStatus: async (id, status) => {
    const res = await fetch(`${API_URL}/bookings/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  cancelBooking: async (id) => {
    const res = await fetch(`${API_URL}/bookings/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  addReview: async (bookingId, data) => {
    const res = await fetch(`${API_URL}/bookings/${bookingId}/review`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // ===== SERVICE POSTS =====
  getServicePosts: async () => {
    const res = await fetch(`${API_URL}/service-posts`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createServicePost: async (data) => {
    const res = await fetch(`${API_URL}/service-posts`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteServicePost: async (id) => {
    const res = await fetch(`${API_URL}/service-posts/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  respondToServicePost: async (postId, data) => {
    const res = await fetch(`${API_URL}/service-posts/${postId}/respond`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // ===== NOTIFICATIONS =====
  getNotifications: async () => {
    const res = await fetch(`${API_URL}/notifications`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getUnreadCount: async () => {
    const res = await fetch(`${API_URL}/notifications/count`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  markNotificationRead: async (id) => {
    const res = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  markAllNotificationsRead: async () => {
    const res = await fetch(`${API_URL}/notifications/read-all`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // ===== UPLOAD =====
  // ✅ مصلح: token بيجي من localStorage.getItem('token') مش من user object
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token"); // ✅
    const res = await fetch(`${API_URL}/upload/image`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    return handleResponse(res);
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images[]", file));
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/upload/multiple`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    return handleResponse(res);
  },

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append("document", file);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/upload/document`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    return handleResponse(res);
  },
};

export default api;