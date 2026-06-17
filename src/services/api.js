const BASE_URL = process.env.REACT_APP_API_URL || 'https://sanay3e-production.up.railway.app';

// ==========================================
// 🔑 Tokens
// ==========================================

const getUserToken = () => localStorage.getItem('token');
const getAdminToken = () => localStorage.getItem('adminToken');

// ==========================================
// 📦 Headers
// ==========================================

const headers = (isFormData = false, isAdmin = false) => {
  const token = isAdmin ? getAdminToken() : getUserToken();

  const h = {
    Accept: 'application/json',
  };

  if (token) {
    h['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    h['Content-Type'] = 'application/json';
  }

  return h;
};

// ==========================================
// ✅ Error Handling
// ==========================================

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'حدث خطأ');
    error.status = response.status;
    error.errors = data.errors || {};
    throw error;
  }

  return data;
};

// ==========================================
// 🌐 Request Helper
// ==========================================

const request = async (url, options = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, options);
  return handleResponse(response);
};

// ==========================================
// 🚀 API
// ==========================================

const api = {
  // ==========================================
  // 🔑 USER AUTH
  // ==========================================

  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user?.role || 'customer');
    }

    return data;
  },

  registerClient: async (userData) => {
    const data = await request('/auth/register/client', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(userData),
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user?.role || 'customer');
    }

    return data;
  },

  registerCraftsman: async (formData) => {
    const data = await request('/auth/register/craftsman', {
      method: 'POST',
      headers: headers(true),
      body: formData,
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', 'craftsman');
    }

    return data;
  },

  logout: async () => {
    try {
      await request('/auth/logout', {
        method: 'DELETE',
        headers: headers(),
      });
    } catch (e) {
      console.log(e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    }
  },

  getCurrentUser: async () => {
    return request('/auth/me', {
      headers: headers(),
    });
  },

  updateProfile: async (formData) => {
    return request('/auth/update-profile', {
      method: 'POST',
      headers: headers(true),
      body: formData,
    });
  },

  changePassword: async (passwordData) => {
    return request('/auth/change-password', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(passwordData),
    });
  },

  // ==========================================
  // 🛡️ ADMIN AUTH
  // ==========================================

  adminLogin: async (email, password) => {
    const data = await request('/auth/admin/login', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('admin', JSON.stringify(data.user));
    }

    return data;
  },

  adminLogout: async () => {
    try {
      await request('/auth/logout', {
        method: 'DELETE',
        headers: headers(false, true),
      });
    } catch (e) {
      console.log(e);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
    }
  },

  // ==========================================
  // 🌐 PUBLIC
  // ==========================================

  searchCraftsmen: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/craftsmen.home.search${query ? `?${query}` : ''}`);
  },

  getCraftsman: async (id) => {
    return request(`/craftsmen.home.show/${id}`);
  },

  getCraftsmen: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/crafts${query ? `?${query}` : ''}`);
  },

  // ==========================================
  // 👤 CLIENT BOOKINGS
  // ==========================================

  getCustomerBookings: async () => {
    return request('/bookings', {
      headers: headers(),
    });
  },

  createBooking: async (bookingData) => {
    return request('/bookings.store', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(bookingData),
    });
  },

  getBookingDetails: async (id) => {
    return request(`/bookings.show/${id}`, {
      headers: headers(),
    });
  },

  cancelBooking: async (id, reason = '') => {
    return request(`/bookings.cancel/${id}`, {
      method: 'DELETE',
      headers: headers(),
      body: JSON.stringify({ reason }),
    });
  },

  addReview: async (bookingId, reviewData) => {
    return request(`/bookings.addreview/${bookingId}/review`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(reviewData),
    });
  },

  // ==========================================
  // 👤 CLIENT SERVICE POSTS
  // ==========================================

  getMyPosts: async () => {
    return request('/my-posts', {
      headers: headers(),
    });
  },

  createServicePost: async (formData) => {
    return request('/service-posts.store', {
      method: 'POST',
      headers: headers(true),
      body: formData,
    });
  },

  getServicePost: async (id) => {
    return request(`/service-posts/${id}`, {
      headers: headers(),
    });
  },

  deleteServicePost: async (id) => {
    return request(`/service-posts.destroy/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
  },

  updateResponse: async (postId, responseId, data) => {
    return request(`/service-posts/${postId}/responses/${responseId}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(data),
    });
  },

  // ==========================================
  // 🔧 CRAFTSMAN
  // ==========================================

  getCraftsmanServicePosts: async () => {
    return request('/craftsman/service-posts', {
      headers: headers(),
    });
  },

  respondToServicePost: async (postId, data) => {
    return request(`/craftsman/service-posts/${postId}/respond`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
  },

  getCraftsmanBookings: async () => {
    return request('/craftsman/bookings', {
      headers: headers(),
    });
  },

  updateBookingStatus: async (id, status, reason = null) => {
    return request(`/craftsman/bookings/${id}/status`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ status, reason }),
    });
  },

  acceptBooking: async (id) => {
    return api.updateBookingStatus(id, 'confirmed');
  },

  rejectBooking: async (id, reason = '') => {
    return api.updateBookingStatus(id, 'rejected', reason);
  },

  getCraftsmanStats: async () => {
    return request('/craftsman/stats', {
      headers: headers(),
    });
  },

  getCraftsmanProfile: async () => {
    return request('/craftsman/profile', {
      headers: headers(),
    });
  },

  updateCraftsmanProfile: async (formData) => {
    return request('/craftsman/profile', {
      method: 'POST',
      headers: headers(true),
      body: formData,
    });
  },

  // ==========================================
  // 🛡️ ADMIN
  // ==========================================

  getAdminDashboard: async () => {
    return request('/admin/dashboard', {
      headers: headers(false, true),
    });
  },

  getAdminStats: async () => {
    return api.getAdminDashboard();
  },

  getAdminCraftsmen: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/craftsmen${query ? `?${query}` : ''}`, {
      headers: headers(false, true),
    });
  },

  getAdminCraftsmanDetails: async (id) => {
    return request(`/admin/craftsmen/${id}`, {
      headers: headers(false, true),
    });
  },

  // ✅ متوافق مع PUT في الباك إند
  approveCraftsman: async (id) => {
    return request(`/admin/craftsmen/${id}/approve`, {
      method: 'PUT',
      headers: headers(false, true),
    });
  },

  // ✅ متوافق مع PUT في الباك إند
  rejectCraftsman: async (id, reason = '') => {
    return request(`/admin/craftsmen/${id}/reject`, {
      method: 'PUT',
      headers: headers(false, true),
      body: JSON.stringify({ reason }),
    });
  },

  getAdminBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/bookings${query ? `?${query}` : ''}`, {
      headers: headers(false, true),
    });
  },

  getAdminPosts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/posts${query ? `?${query}` : ''}`, {
      headers: headers(false, true),
    });
  },

  togglePostVisibility: async (id) => {
    return request(`/admin/posts/${id}/toggle-visibility`, {
      method: 'PATCH',
      headers: headers(false, true),
    });
  },

  deleteAdminPost: async (id) => {
    return request(`/admin/posts.delete/${id}`, {
      method: 'DELETE',
      headers: headers(false, true),
    });
  },

  getAdminCrafts: async () => {
    return request('/admin/crafts', {
      headers: headers(false, true),
    });
  },

  createCraft: async (data) => {
    return request('/admin/crafts.store', {
      method: 'POST',
      headers: headers(false, true),
      body: JSON.stringify(data),
    });
  },

  updateCraft: async (id, data) => {
    return request(`/admin/crafts.update/${id}`, {
      method: 'POST',
      headers: headers(false, true),
      body: JSON.stringify(data),
    });
  },

  deleteCraft: async (id) => {
    return request(`/admin/crafts.delete/${id}`, {
      method: 'DELETE',
      headers: headers(false, true),
    });
  },

  getAdminReviews: async () => {
    return request('/admin/reviews', {
      headers: headers(false, true),
    });
  },

  toggleReviewVisibility: async (id) => {
    return request(`/admin/reviews/${id}/toggle-visibility`, {
      method: 'PATCH',
      headers: headers(false, true),
    });
  },

  getAdminAdvancedStats: async () => {
    return request('/admin/stats', {
      headers: headers(false, true),
    });
  },

  getAdminSettings: async () => {
    return request('/admin/settings', {
      headers: headers(false, true),
    });
  },

  updateAdminSettings: async (settings) => {
    return request('/admin/settings', {
      method: 'PUT',
      headers: headers(false, true),
      body: JSON.stringify(settings),
    });
  },

  impersonateUser: async (id) => {
    return request(`/admin/users/${id}/impersonate`, {
      method: 'POST',
      headers: headers(false, true),
    });
  },

  // ==========================================
  // 🔔 NOTIFICATIONS
  // ==========================================

  getNotifications: async () => {
    return request('/notifications', {
      headers: headers(),
    });
  },

  getUnreadNotificationsCount: async () => {
    return request('/notifications/count', {
      headers: headers(),
    });
  },

  markNotificationAsRead: async (id) => {
    return request(`/notifications/${id}/read`, {
      method: 'PATCH',
      headers: headers(),
    });
  },

  markAllNotificationsAsRead: async () => {
    return request('/notifications/read-all', {
      method: 'PATCH',
      headers: headers(),
    });
  },

  // ==========================================
  // 📁 UPLOAD
  // ==========================================

  uploadImage: async (file, type = 'post_image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return request('/upload/image', {
      method: 'POST',
      headers: headers(true),
      body: formData,
    });
  },

  uploadMultipleImages: async (files, type = 'portfolio') => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    formData.append('type', type);

    return request('/upload/multiple', {
      method: 'POST',
      headers: headers(true),
      body: formData,
    });
  },

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return request('/upload/document', {
      method: 'POST',
      headers: headers(true),
      body: formData,
    });
  },
};

export default api;