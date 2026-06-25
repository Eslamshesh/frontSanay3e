// src/services/dataService.jsx
// ⚠️ هذا الملف deprecated — استخدمي api.js مباشرةً في الكود الجديد
// تم تحويله ليستخدم api.js الحقيقي بدلاً من endpoints قديمة غير موجودة

import api from './api';

const dataService = {

  // جلب الحرفيين (بحث وفلترة) — يقابل GET /api/craftsmen.home.search
  getCraftsmen: (params = {}) =>
    api.getCraftsmen(params),

  // جلب المهن المتاحة — يقابل GET /api/crafts
  getCrafts: () =>
    api.getCrafts(),

  // جلب الحرفيين المميزين — يقابل GET /api/craftsmen/featured
  getFeaturedCraftsmen: () =>
    api.getFeaturedCraftsmen(),

  // جلب تفاصيل حرفي — يقابل GET /api/craftsmen.home.show/{id}
  getCraftsman: (id) =>
    api.getCraftsman(id),

  // إنشاء حجز (كان createRequest) — يقابل POST /api/client/bookings.store
  // data: { craftsman_id, service_id?, service_title?, booking_date, booking_time, notes?, location? }
  createRequest: (data) =>
    api.createBooking(data),

  // جلب حجوزات العميل — يقابل GET /api/client/bookings
  getRequests: (tab = 'upcoming') =>
    api.getMyBookings(tab),

  // جلب حجوزات الحرفي — يقابل GET /api/craftsman/bookings
  getCraftsmanBookings: () =>
    api.getCraftsmanBookings(),

  // إضافة تقييم — يقابل POST /api/client/bookings.addreview/{bookingId}/review
  // data: { rating, comment? }
  addReview: (bookingId, data) =>
    api.addReview(bookingId, data),

  // تسجيل حرفي جديد — يقابل POST /api/auth/register/craftsman (multipart/form-data)
  saveCraftsman: (formData) =>
    api.registerCraftsman(formData),

  // تحديث ملف الحرفي الشخصي — يقابل POST /api/craftsman/profile
  updateCraftsmanProfile: (formData) =>
    api.updateCraftsmanProfile(formData),

  // إحصائيات الحرفي — يقابل GET /api/craftsman/stats
  getCraftsmanStats: () =>
    api.getCraftsmanStats(),

  // ⚠️ الدوال التالية لا يوجد لها endpoint في الباك حالياً:
  // - getUsers()          → /admin/users (admin only، مش موثق كامل)
  // - getPendingCraftsmen() → /admin/craftsmen (admin only)
  // - verifyCraftsman()   → /admin/craftsmen/{id}/approve (admin only)
  // - sendMessage()       → غير متاح في الـ API الحالي
  // - getMessages()       → غير متاح في الـ API الحالي
  // - getReviews()        → التقييمات بتيجي مع بيانات الحرفي في getCraftsman(id)
};

export default dataService;
