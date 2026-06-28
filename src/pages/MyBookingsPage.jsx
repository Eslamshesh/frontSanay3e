// // src/pages/MyBookingsPage.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useTheme } from '../context/ThemeContext';
// import { useAuth } from '../context/AuthContext';
// import api from '../services/api';
// import { 
//   Calendar, Clock, MapPin, Star, DollarSign,
//   ChevronLeft, ChevronRight, Filter, X,
//   CheckCircle, Clock as ClockIcon, AlertCircle,
//   Loader, Eye, MessageCircle, Phone
// } from 'lucide-react';

// const MyBookingsPage = () => {
//   const navigate = useNavigate();
//   const { darkMode } = useTheme();
//   const { user } = useAuth();
//   const [lang, setLang] = useState('ar');
  
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');
//   const [error, setError] = useState('');
//   const [cancelling, setCancelling] = useState(null);

//   const isArabic = lang === 'ar';

//   // ✅ Language
//   useEffect(() => {
//     const savedLang = localStorage.getItem('language') || 'ar';
//     setLang(savedLang);
//     const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
//     window.addEventListener('languagechange', handleLanguageChange);
//     return () => window.removeEventListener('languagechange', handleLanguageChange);
//   }, []);

//   // ✅ حالات الحجز المسموحة
//   const statuses = [
//     { value: 'all', label: isArabic ? 'الكل' : 'All' },
//     { value: 'pending', label: isArabic ? 'قيد الانتظار' : 'Pending' },
//     { value: 'confirmed', label: isArabic ? 'مؤكد' : 'Confirmed' },
//     { value: 'in_progress', label: isArabic ? 'قيد التنفيذ' : 'In Progress' },
//     { value: 'completed', label: isArabic ? 'مكتمل' : 'Completed' },
//     { value: 'cancelled', label: isArabic ? 'ملغي' : 'Cancelled' },
//     { value: 'rejected', label: isArabic ? 'مرفوض' : 'Rejected' },
//   ];

//   // ✅ جلب الحجوزات
//   const loadBookings = useCallback(async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const data = await api.getMyBookings('all');
//       setBookings(data.bookings?.data || []);
//     } catch (err) {
//       setError(err.message || (isArabic ? 'حدث خطأ في تحميل الحجوزات' : 'Error loading bookings'));
//       setBookings([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [isArabic]);

//   useEffect(() => {
//     loadBookings();
//   }, [loadBookings]);

//   // ✅ فلترة الحجوزات
//   const filteredBookings = filter === 'all' 
//     ? bookings 
//     : bookings.filter(b => b.status === filter);

//   // ✅ إلغاء حجز
//   const handleCancel = async (bookingId) => {
//     if (!window.confirm(isArabic ? 'هل أنت متأكد من إلغاء هذا الحجز؟' : 'Are you sure you want to cancel this booking?')) {
//       return;
//     }
    
//     setCancelling(bookingId);
//     try {
//       await api.cancelBooking(bookingId);
//       await loadBookings();
//     } catch (err) {
//       setError(err.message || (isArabic ? 'حدث خطأ في إلغاء الحجز' : 'Error cancelling booking'));
//     } finally {
//       setCancelling(null);
//     }
//   };

//   // ✅ الحصول على لون الحالة
//   const getStatusColor = (status) => {
//     const colors = {
//       pending: { bg: '#fef3c7', text: '#d97706', icon: <ClockIcon size={16} /> },
//       confirmed: { bg: '#dbeafe', text: '#2563eb', icon: <CheckCircle size={16} /> },
//       in_progress: { bg: '#f3e8ff', text: '#7c3aed', icon: <Loader size={16} className="animate-spin" /> },
//       completed: { bg: '#d1fae5', text: '#059669', icon: <CheckCircle size={16} /> },
//       cancelled: { bg: '#fee2e2', text: '#dc2626', icon: <X size={16} /> },
//       rejected: { bg: '#fee2e2', text: '#dc2626', icon: <AlertCircle size={16} /> },
//     };
//     return colors[status] || colors.pending;
//   };

//   // ✅ الحصول على نص الحالة
//   const getStatusText = (status) => {
//     const map = {
//       pending: isArabic ? 'قيد الانتظار' : 'Pending',
//       confirmed: isArabic ? 'مؤكد' : 'Confirmed',
//       in_progress: isArabic ? 'قيد التنفيذ' : 'In Progress',
//       completed: isArabic ? 'مكتمل' : 'Completed',
//       cancelled: isArabic ? 'ملغي' : 'Cancelled',
//       rejected: isArabic ? 'مرفوض' : 'Rejected',
//     };
//     return map[status] || status;
//   };

//   // ✅ تنسيق التاريخ
//   const formatDate = (date) => {
//     if (!date) return '';
//     const d = new Date(date);
//     return d.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   // ✅ تنسيق الوقت
//   const formatTime = (time) => {
//     if (!time) return '';
//     return time;
//   };

//   // ✅ الترجمات
//   const t = {
//     myBookings: isArabic ? 'حجوزاتي' : 'My Bookings',
//     youHave: (count) => isArabic ? `لديك ${count} حجز` : `You have ${count} bookings`,
//     errorLoading: isArabic ? 'حدث خطأ في تحميل الحجوزات' : 'Error loading bookings',
//     errorCancelling: isArabic ? 'حدث خطأ في إلغاء الحجز' : 'Error cancelling booking',
//     confirmCancel: isArabic ? 'هل أنت متأكد من إلغاء هذا الحجز؟' : 'Are you sure you want to cancel this booking?',
//     details: isArabic ? 'تفاصيل' : 'Details',
//     review: isArabic ? 'قيّم' : 'Review',
//     cancel: isArabic ? 'إلغاء' : 'Cancel',
//     noBookings: isArabic ? 'لا توجد حجوزات' : 'No bookings found',
//     noBookingsYet: isArabic ? 'لم تقم بأي حجز بعد' : 'You haven\'t made any bookings yet',
//     noBookingsStatus: (status) => isArabic ? `لا توجد حجوزات بحالة "${status}"` : `No bookings with status "${status}"`,
//     viewAll: isArabic ? 'عرض الكل' : 'View All',
//     searchCraftsman: isArabic ? 'ابحث عن حرفي' : 'Search for a craftsman',
//     all: isArabic ? 'الكل' : 'All',
//     pending: isArabic ? 'قيد الانتظار' : 'Pending',
//     confirmed: isArabic ? 'مؤكد' : 'Confirmed',
//     inProgress: isArabic ? 'قيد التنفيذ' : 'In Progress',
//     completed: isArabic ? 'مكتمل' : 'Completed',
//     cancelled: isArabic ? 'ملغي' : 'Cancelled',
//     rejected: isArabic ? 'مرفوض' : 'Rejected',
//     egp: isArabic ? 'ج.م' : 'EGP',
//   };

//   // Dynamic colors
//   const bgColor = darkMode ? '#0f172a' : '#f8fafc';
//   const cardBg = darkMode ? '#1e293b' : '#ffffff';
//   const textColor = darkMode ? '#f1f5f9' : '#0f172a';
//   const textSecondary = darkMode ? '#94a3b8' : '#64748b';
//   const borderColor = darkMode ? '#334155' : '#e2e8f0';

//   return (
//     <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif", direction: isArabic ? 'rtl' : 'ltr' }}>
//       <style>{`
//         @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
//         .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
//         .animate-spin { animation: spin 1s linear infinite; }
//         .delay-100 { animation-delay: 0.1s; }
//         .delay-200 { animation-delay: 0.2s; }
//         .delay-300 { animation-delay: 0.3s; }
//         .skeleton {
//           background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%);
//           background-size: 200% 100%;
//           animation: shimmer 1.5s infinite;
//         }
//         .hover-lift { transition: all 0.3s ease; }
//         .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
//         @media (max-width: 768px) {
//           .filter-bar { overflow-x: auto; flex-wrap: nowrap; }
//           .booking-card { flex-direction: column; align-items: stretch !important; }
//         }
//       `}</style>

//       {/* Header */}
//       <div style={{
//         background: darkMode ? 'linear-gradient(160deg, #1e3a8a, #1e40af)' : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
//         color: 'white',
//         padding: '32px 0',
//       }}>
//         <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
//           <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <button onClick={() => navigate(-1)} style={{
//               background: 'rgba(255,255,255,0.15)',
//               border: 'none',
//               color: 'white',
//               width: '40px',
//               height: '40px',
//               borderRadius: '10px',
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//               <ChevronLeft size={20} />
//             </button>
//             <div>
//               <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
//                 {t.myBookings}
//               </h1>
//               <p style={{ fontSize: '0.85rem', opacity: 0.85, margin: '2px 0 0' }}>
//                 {t.youHave(bookings.length)}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>

//         {/* Error */}
//         {error && (
//           <div className="animate-fade-in" style={{
//             background: darkMode ? 'rgba(220,38,38,0.1)' : '#fee2e2',
//             color: '#dc2626',
//             padding: '12px 16px',
//             borderRadius: '12px',
//             marginBottom: '16px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             border: '1px solid rgba(220,38,38,0.2)',
//           }}>
//             <AlertCircle size={18} />
//             {error}
//           </div>
//         )}

//         {/* Filter Bar */}
//         <div className="animate-fade-in-up delay-100 filter-bar" style={{
//           display: 'flex',
//           gap: '8px',
//           marginBottom: '20px',
//           flexWrap: 'wrap',
//           paddingBottom: '8px',
//         }}>
//           {statuses.map((s) => (
//             <button
//               key={s.value}
//               onClick={() => setFilter(s.value)}
//               style={{
//                 padding: '8px 16px',
//                 borderRadius: '50px',
//                 border: filter === s.value ? '2px solid #3b82f6' : `1px solid ${borderColor}`,
//                 background: filter === s.value ? (darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff') : 'transparent',
//                 color: filter === s.value ? '#3b82f6' : textSecondary,
//                 cursor: 'pointer',
//                 fontWeight: filter === s.value ? 700 : 500,
//                 fontSize: '0.85rem',
//                 fontFamily: "'Cairo', sans-serif",
//                 whiteSpace: 'nowrap',
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               {s.label}
//               {s.value !== 'all' && (
//                 <span style={{
//                   marginLeft: '4px',
//                   fontSize: '0.7rem',
//                   background: filter === s.value ? '#3b82f6' : (darkMode ? '#334155' : '#e2e8f0'),
//                   color: filter === s.value ? 'white' : textSecondary,
//                   padding: '2px 6px',
//                   borderRadius: '10px',
//                 }}>
//                   {bookings.filter(b => b.status === s.value).length}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Bookings List */}
//         {loading ? (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//             {[1, 2, 3].map(i => (
//               <div key={i} className="skeleton" style={{ borderRadius: '14px', height: '120px' }} />
//             ))}
//           </div>
//         ) : filteredBookings.length > 0 ? (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//             {filteredBookings.map((booking, index) => {
//               const statusStyle = getStatusColor(booking.status);
//               const isCompleted = booking.status === 'completed';
//               const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
              
//               return (
//                 <div
//                   key={booking.id}
//                   className="animate-fade-in-up hover-lift booking-card"
//                   style={{
//                     background: cardBg,
//                     borderRadius: '14px',
//                     padding: '18px 20px',
//                     border: `1px solid ${borderColor}`,
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     flexWrap: 'wrap',
//                     gap: '12px',
//                     animationDelay: `${index * 0.05}s`,
//                   }}
//                 >
//                   {/* Left - Info */}
//                   <div style={{ flex: 1, minWidth: '200px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
//                       <h3 style={{ fontWeight: 700, color: textColor, fontSize: '1rem', margin: 0 }}>
//                         {booking.craftsman?.first_name} {booking.craftsman?.last_name}
//                       </h3>
//                       <span style={{
//                         display: 'inline-flex',
//                         alignItems: 'center',
//                         gap: '4px',
//                         padding: '2px 10px',
//                         borderRadius: '20px',
//                         fontSize: '0.7rem',
//                         fontWeight: 600,
//                         background: statusStyle.bg,
//                         color: statusStyle.text,
//                       }}>
//                         {statusStyle.icon}
//                         {getStatusText(booking.status)}
//                       </span>
//                     </div>
                    
//                     <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '6px', fontSize: '0.85rem', color: textSecondary }}>
//                       <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                         <Calendar size={14} />
//                         {formatDate(booking.booking_date)}
//                       </span>
//                       {booking.booking_time && (
//                         <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//                           <Clock size={14} />
//                           {formatTime(booking.booking_time)}
//                         </span>
//                       )}
//                       {booking.total_price && (
//                         <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 600 }}>
//                           <DollarSign size={14} />
//                           {booking.total_price} {t.egp}
//                         </span>
//                       )}
//                     </div>

//                     {booking.notes && (
//                       <p style={{ fontSize: '0.8rem', color: textSecondary, marginTop: '4px' }}>
//                         📝 {booking.notes}
//                       </p>
//                     )}
//                   </div>

//                   {/* Right - Actions */}
//                   <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//                     {/* زر التفاصيل */}
//                     <button
//                       onClick={() => navigate(`/booking/${booking.id}`)}
//                       style={{
//                         padding: '6px 14px',
//                         borderRadius: '8px',
//                         border: `1px solid ${borderColor}`,
//                         background: 'transparent',
//                         cursor: 'pointer',
//                         color: textSecondary,
//                         fontSize: '0.8rem',
//                         fontFamily: "'Cairo', sans-serif",
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '4px',
//                       }}
//                     >
//                       <Eye size={14} />
//                       {t.details}
//                     </button>

//                     {/* زر التقييم - يظهر فقط للحجوزات المكتملة */}
//                     {isCompleted && (
//                       <button
//                         onClick={() => navigate(`/reviews?bookingId=${booking.id}`)}
//                         style={{
//                           padding: '6px 14px',
//                           borderRadius: '8px',
//                           background: '#f59e0b',
//                           color: 'white',
//                           border: 'none',
//                           cursor: 'pointer',
//                           fontSize: '0.8rem',
//                           fontWeight: 600,
//                           fontFamily: "'Cairo', sans-serif",
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '4px',
//                         }}
//                       >
//                         <Star size={14} />
//                         {t.review}
//                       </button>
//                     )}

//                     {/* زر الإلغاء - يظهر للحجوزات القيد الانتظار أو المؤكدة */}
//                     {canCancel && (
//                       <button
//                         onClick={() => handleCancel(booking.id)}
//                         disabled={cancelling === booking.id}
//                         style={{
//                           padding: '6px 14px',
//                           borderRadius: '8px',
//                           background: '#dc2626',
//                           color: 'white',
//                           border: 'none',
//                           cursor: cancelling === booking.id ? 'not-allowed' : 'pointer',
//                           fontSize: '0.8rem',
//                           fontWeight: 600,
//                           fontFamily: "'Cairo', sans-serif",
//                           opacity: cancelling === booking.id ? 0.6 : 1,
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '4px',
//                         }}
//                       >
//                         {cancelling === booking.id ? (
//                           <Loader size={14} className="animate-spin" />
//                         ) : (
//                           <X size={14} />
//                         )}
//                         {t.cancel}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="animate-fade-in" style={{
//             textAlign: 'center',
//             padding: '60px 20px',
//             background: cardBg,
//             borderRadius: '16px',
//             border: `1px solid ${borderColor}`,
//           }}>
//             <Calendar size={64} style={{ color: textSecondary, opacity: 0.3, marginBottom: '16px' }} />
//             <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
//               {t.noBookings}
//             </h3>
//             <p style={{ color: textSecondary, fontSize: '0.95rem' }}>
//               {filter === 'all' 
//                 ? t.noBookingsYet
//                 : t.noBookingsStatus(statuses.find(s => s.value === filter)?.label || '')
//               }
//             </p>
//             {filter !== 'all' && (
//               <button
//                 onClick={() => setFilter('all')}
//                 style={{
//                   marginTop: '12px',
//                   padding: '8px 20px',
//                   borderRadius: '8px',
//                   background: '#3b82f6',
//                   color: 'white',
//                   border: 'none',
//                   cursor: 'pointer',
//                   fontWeight: 600,
//                   fontSize: '0.85rem',
//                   fontFamily: "'Cairo', sans-serif",
//                 }}
//               >
//                 {t.viewAll}
//               </button>
//             )}
//             {filter === 'all' && (
//               <Link
//                 to="/search"
//                 style={{
//                   display: 'inline-block',
//                   marginTop: '12px',
//                   padding: '8px 20px',
//                   borderRadius: '8px',
//                   background: '#3b82f6',
//                   color: 'white',
//                   textDecoration: 'none',
//                   fontWeight: 600,
//                   fontSize: '0.85rem',
//                   fontFamily: "'Cairo', sans-serif",
//                 }}
//               >
//                 {t.searchCraftsman}
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyBookingsPage;
// src/pages/MyBookingsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Calendar, Clock, MapPin, User, Star,
  CheckCircle, XCircle, AlertCircle, Loader,
  ChevronDown, Phone, MessageSquare, RotateCcw,
  Play, Package, Ban, Wrench
} from 'lucide-react';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const STATUS_META = {
  pending:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  labelAr: 'قيد الانتظار',  labelEn: 'Pending'     },
  confirmed:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  labelAr: 'مؤكد',           labelEn: 'Confirmed'   },
  in_progress: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', labelAr: 'جارٍ التنفيذ',   labelEn: 'In Progress' },
  completed:   { color: '#059669', bg: 'rgba(5,150,105,0.12)',   labelAr: 'مكتمل',          labelEn: 'Completed'   },
  cancelled:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   labelAr: 'ملغي',           labelEn: 'Cancelled'   },
  rejected:    { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   labelAr: 'مرفوض',          labelEn: 'Rejected'    },
};

const CLIENT_TABS  = ['upcoming', 'past', 'cancelled'];
const CLIENT_TABS_AR = { upcoming: 'القادمة', past: 'السابقة', cancelled: 'الملغية' };
const CLIENT_TABS_EN = { upcoming: 'Upcoming', past: 'Past',    cancelled: 'Cancelled' };

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const formatDate = (str, isAr) => {
  if (!str) return '';
  const d = new Date(str.replace(' ', 'T'));
  if (isNaN(d)) return str;
  return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

const formatTime = (str) => {
  if (!str) return '';
  const [h, m] = str.split(':');
  const hour = Number(h);
  const ampm = hour >= 12 ? 'م' : 'ص';
  const h12  = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────
const StatusBadge = ({ status, isAr }) => {
  const meta = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{
      fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px',
      borderRadius: '99px', background: meta.bg, color: meta.color,
      letterSpacing: '0.02em',
    }}>
      {isAr ? meta.labelAr : meta.labelEn}
    </span>
  );
};

// ─────────────────────────────────────────────
// Confirm Modal
// ─────────────────────────────────────────────
const ConfirmModal = ({ isAr, darkMode, message, onConfirm, onCancel, withReason = false }) => {
  const [reason, setReason] = useState('');
  const card   = darkMode ? '#1e293b' : '#fff';
  const text   = darkMode ? '#f1f5f9' : '#0f172a';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const sub    = darkMode ? '#94a3b8' : '#64748b';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999, padding: '16px',
    }}>
      <div style={{
        background: card, borderRadius: '16px', padding: '28px 24px',
        maxWidth: '400px', width: '100%', direction: isAr ? 'rtl' : 'ltr',
        fontFamily: isAr ? 'Cairo, sans-serif' : 'Inter, sans-serif',
      }}>
        <p style={{ color: text, fontWeight: 600, fontSize: '1rem', margin: '0 0 16px' }}>
          {message}
        </p>
        {withReason && (
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder={isAr ? 'سبب الإلغاء (اختياري)' : 'Reason (optional)'}
            style={{
              width: '100%', boxSizing: 'border-box', resize: 'none',
              background: darkMode ? '#0f172a' : '#f8fafc',
              border: `1px solid ${border}`, borderRadius: '8px',
              padding: '10px 12px', color: text, fontSize: '0.85rem',
              fontFamily: 'inherit', marginBottom: '16px', outline: 'none',
            }}
          />
        )}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '8px 18px', borderRadius: '8px', border: `1px solid ${border}`,
            background: 'none', color: sub, cursor: 'pointer', fontSize: '0.85rem',
          }}>
            {isAr ? 'تراجع' : 'Cancel'}
          </button>
          <button onClick={() => onConfirm(reason)} style={{
            padding: '8px 18px', borderRadius: '8px', border: 'none',
            background: '#ef4444', color: '#fff', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 700,
          }}>
            {isAr ? 'تأكيد' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Booking Card — CLIENT
// ─────────────────────────────────────────────
const ClientBookingCard = ({ booking, isAr, darkMode, onCancel, onReview }) => {
  const navigate = useNavigate();
  const card   = darkMode ? '#1e293b' : '#fff';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const text   = darkMode ? '#f1f5f9' : '#0f172a';
  const sub    = darkMode ? '#94a3b8' : '#64748b';

  const craftsmanName = booking.craftsman?.user?.name
    || (booking.craftsman?.first_name
      ? `${booking.craftsman.first_name} ${booking.craftsman.last_name}`
      : (isAr ? 'الحرفي' : 'Craftsman'));

  const canCancel  = ['pending', 'confirmed'].includes(booking.status);
  const canReview  = booking.status === 'completed' && !booking.review;

  return (
    <div style={{
      background: card, border: `1px solid ${border}`, borderRadius: '14px',
      padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: text, marginBottom: '4px' }}>
            {booking.service_title || (isAr ? 'خدمة' : 'Service')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: sub, fontSize: '0.82rem' }}>
            <User size={13} />
            {craftsmanName}
          </div>
        </div>
        <StatusBadge status={booking.status} isAr={isAr} />
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {booking.booking_date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sub, fontSize: '0.8rem' }}>
            <Calendar size={13} />
            {formatDate(booking.booking_date, isAr)}
          </div>
        )}
        {booking.booking_time && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sub, fontSize: '0.8rem' }}>
            <Clock size={13} />
            {formatTime(booking.booking_time)}
          </div>
        )}
        {booking.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sub, fontSize: '0.8rem' }}>
            <MapPin size={13} />
            {booking.location}
          </div>
        )}
      </div>

      {/* Notes */}
      {booking.notes && (
        <p style={{
          margin: 0, fontSize: '0.82rem', color: sub, lineHeight: 1.6,
          borderRight: isAr ? '3px solid #334155' : 'none',
          borderLeft: !isAr ? '3px solid #334155' : 'none',
          paddingRight: isAr ? '10px' : 0,
          paddingLeft: !isAr ? '10px' : 0,
        }}>
          {booking.notes}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {canReview && (
          <button onClick={() => onReview(booking.id)} style={{
            flex: 1, padding: '9px 14px', borderRadius: '9px', border: 'none',
            background: '#f59e0b', color: '#000', fontWeight: 700,
            fontSize: '0.82rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <Star size={14} /> {isAr ? 'اكتب تقييماً' : 'Write Review'}
          </button>
        )}
        {booking.status === 'completed' && booking.review && (
          <div style={{
            flex: 1, padding: '9px 14px', borderRadius: '9px',
            background: 'rgba(5,150,105,0.1)', color: '#059669',
            fontSize: '0.82rem', fontWeight: 600, textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <CheckCircle size={14} /> {isAr ? 'تم التقييم' : 'Reviewed'}
          </div>
        )}
        {canCancel && (
          <button onClick={() => onCancel(booking)} style={{
            padding: '9px 14px', borderRadius: '9px',
            border: '1px solid rgba(239,68,68,0.4)',
            background: 'rgba(239,68,68,0.08)', color: '#ef4444',
            fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <XCircle size={14} /> {isAr ? 'إلغاء' : 'Cancel'}
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Booking Card — CRAFTSMAN
// ─────────────────────────────────────────────
const CraftsmanBookingCard = ({ booking, isAr, darkMode, onStatusChange }) => {
  const [open, setOpen] = useState(false);
  const card   = darkMode ? '#1e293b' : '#fff';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const text   = darkMode ? '#f1f5f9' : '#0f172a';
  const sub    = darkMode ? '#94a3b8' : '#64748b';

  const clientName = booking.client?.name || (isAr ? 'العميل' : 'Client');
  const clientPhone = booking.client?.phone;

  // الأكشنز المتاحة حسب الستاتس الحالي
  const ACTIONS = {
    pending:     [{ status: 'confirmed',   labelAr: 'قبول',        labelEn: 'Accept',      color: '#059669', icon: <CheckCircle size={14}/> },
                  { status: 'rejected',    labelAr: 'رفض',         labelEn: 'Reject',      color: '#ef4444', icon: <XCircle size={14}/>, needsReason: true }],
    confirmed:   [{ status: 'in_progress', labelAr: 'بدء التنفيذ', labelEn: 'Start',       color: '#8b5cf6', icon: <Play size={14}/> },
                  { status: 'rejected',    labelAr: 'رفض',         labelEn: 'Reject',      color: '#ef4444', icon: <XCircle size={14}/>, needsReason: true }],
    in_progress: [{ status: 'completed',   labelAr: 'إنهاء',       labelEn: 'Complete',    color: '#059669', icon: <CheckCircle size={14}/> }],
  };

  const actions = ACTIONS[booking.status] || [];

  return (
    <div style={{
      background: card, border: `1px solid ${border}`, borderRadius: '14px',
      padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {/* Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: text, marginBottom: '4px' }}>
            {booking.service_title || (isAr ? 'خدمة' : 'Service')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: sub, fontSize: '0.82rem' }}>
            <User size={13} /> {clientName}
          </div>
        </div>
        <StatusBadge status={booking.status} isAr={isAr} />
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {booking.booking_date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sub, fontSize: '0.8rem' }}>
            <Calendar size={13} /> {formatDate(booking.booking_date, isAr)}
          </div>
        )}
        {booking.booking_time && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sub, fontSize: '0.8rem' }}>
            <Clock size={13} /> {formatTime(booking.booking_time)}
          </div>
        )}
        {booking.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: sub, fontSize: '0.8rem' }}>
            <MapPin size={13} /> {booking.location}
          </div>
        )}
        {clientPhone && (
          <a href={`tel:${clientPhone}`} onClick={e => e.stopPropagation()} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            color: '#3b82f6', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600,
          }}>
            <Phone size={13} /> {clientPhone}
          </a>
        )}
      </div>

      {/* Notes */}
      {booking.notes && (
        <p style={{
          margin: 0, fontSize: '0.82rem', color: sub, lineHeight: 1.6,
          borderRight: isAr ? '3px solid #334155' : 'none',
          borderLeft: !isAr ? '3px solid #334155' : 'none',
          paddingRight: isAr ? '10px' : 0,
          paddingLeft: !isAr ? '10px' : 0,
        }}>
          {booking.notes}
        </p>
      )}

      {/* Review received */}
      {booking.review && (
        <div style={{
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '8px', padding: '10px 14px', fontSize: '0.82rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12}
                fill={s <= booking.review.rating ? '#f59e0b' : 'none'}
                color={s <= booking.review.rating ? '#f59e0b' : '#cbd5e1'}
              />
            ))}
          </div>
          {booking.review.comment && (
            <p style={{ margin: 0, color: sub }}>{booking.review.comment}</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {actions.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {actions.map(action => (
            <button
              key={action.status}
              onClick={() => onStatusChange(booking, action.status, action.needsReason)}
              style={{
                flex: 1, padding: '9px 14px', borderRadius: '9px', border: 'none',
                background: action.color + '20', color: action.color,
                fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              {action.icon}
              {isAr ? action.labelAr : action.labelEn}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────
const EmptyState = ({ isAr, darkMode }) => {
  const text = darkMode ? '#94a3b8' : '#64748b';
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <Package size={48} color={darkMode ? '#334155' : '#e2e8f0'} style={{ marginBottom: '14px' }} />
      <p style={{ color: text, margin: 0, fontSize: '0.9rem' }}>
        {isAr ? 'لا توجد حجوزات' : 'No bookings found'}
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
const MyBookingsPage = () => {
  const { darkMode } = useTheme();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [lang, setLang]           = useState('ar');
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');   // client only
  const [modal, setModal]         = useState(null);         // { booking, newStatus, needsReason }
  const [actionLoading, setActionLoading] = useState(false);

  const role   = user?.role;
  const isAr   = lang === 'ar';
  const isClient    = role === 'client' || role === 'customer';
  const isCraftsman = role === 'craftsman';

  // ── Language ──────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('language') || 'ar';
    setLang(saved);
    const h = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', h);
    return () => window.removeEventListener('languagechange', h);
  }, []);

  // ── Fetch ─────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isClient) {
        const data = await api.getMyBookings(activeTab);
        setBookings(data.bookings?.data || data.bookings || []);
      } else if (isCraftsman) {
        const data = await api.getCraftsmanBookings();
        setBookings(data.bookings?.data || data.bookings || []);
      }
    } catch {
      setBookings([]);
    }
    setLoading(false);
  }, [isClient, isCraftsman, activeTab]);

  useEffect(() => { load(); }, [load]);

  // ── Client: Cancel ────────────────────────
  const handleCancelRequest = (booking) => {
    setModal({ booking, newStatus: 'cancel', needsReason: true });
  };

  const handleCancelConfirm = async (reason) => {
    setActionLoading(true);
    try {
      await api.cancelBooking(modal.booking.id, reason || null);
      setModal(null);
      load();
    } catch (err) {
      alert(err.message || (isAr ? 'حدث خطأ' : 'Error'));
    }
    setActionLoading(false);
  };

  // ── Client: Review ────────────────────────
  const handleReview = (bookingId) => {
    navigate(`/my-bookings/${bookingId}/review`);
  };

  // ── Craftsman: Status change ──────────────
  const handleStatusRequest = (booking, newStatus, needsReason) => {
    setModal({ booking, newStatus, needsReason: !!needsReason });
  };

  const handleStatusConfirm = async (reason) => {
    setActionLoading(true);
    try {
      await api.updateBookingStatus(
        modal.booking.id,
        modal.newStatus,
        modal.needsReason ? reason || null : null
      );
      setModal(null);
      load();
    } catch (err) {
      alert(err.message || (isAr ? 'حدث خطأ' : 'Error'));
    }
    setActionLoading(false);
  };

  // ── Craftsman filter tabs ─────────────────
  const craftsmanStatuses = ['pending','confirmed','in_progress','completed','rejected','cancelled'];
  const [craftsmanFilter, setCraftsmanFilter] = useState('all');

  const displayedBookings = isCraftsman && craftsmanFilter !== 'all'
    ? bookings.filter(b => b.status === craftsmanFilter)
    : bookings;

  // ── Styles ────────────────────────────────
  const bg     = darkMode ? '#0f172a' : '#f8fafc';
  const card   = darkMode ? '#1e293b' : '#fff';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const text   = darkMode ? '#f1f5f9' : '#0f172a';
  const sub    = darkMode ? '#94a3b8' : '#64748b';
  const accent = '#f59e0b';

  // ── Craftsman stats strip ─────────────────
  const statusCount = (s) => bookings.filter(b => b.status === s).length;

  // ─────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: bg,
      direction: isAr ? 'rtl' : 'ltr',
      fontFamily: isAr ? 'Cairo, sans-serif' : 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 16px' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{
            fontSize: '1.55rem', fontWeight: 700, color: text,
            margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <Calendar size={24} color={accent} />
            {isAr ? 'حجوزاتي' : 'My Bookings'}
          </h1>
          <p style={{ color: sub, fontSize: '0.88rem', margin: 0 }}>
            {isClient
              ? (isAr ? 'تابع حجوزاتك مع الحرفيين' : 'Track your bookings with craftsmen')
              : (isAr ? 'إدارة طلبات العملاء' : 'Manage client requests')}
          </p>
        </div>

        {/* ── CLIENT: Tabs ── */}
        {isClient && (
          <div style={{
            display: 'flex', gap: '4px', marginBottom: '20px',
            background: darkMode ? '#1e293b' : '#f1f5f9',
            borderRadius: '12px', padding: '4px',
          }}>
            {CLIENT_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '9px 8px', borderRadius: '9px', border: 'none',
                background: activeTab === tab ? (darkMode ? '#0f172a' : '#fff') : 'none',
                color: activeTab === tab ? text : sub,
                fontWeight: activeTab === tab ? 700 : 400,
                fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}>
                {isAr ? CLIENT_TABS_AR[tab] : CLIENT_TABS_EN[tab]}
              </button>
            ))}
          </div>
        )}

        {/* ── CRAFTSMAN: Stats Strip ── */}
        {isCraftsman && !loading && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px', marginBottom: '20px',
          }}>
            {[
              { s: 'pending',     icon: <AlertCircle size={16}/>, color: '#f59e0b' },
              { s: 'confirmed',   icon: <CheckCircle size={16}/>, color: '#3b82f6' },
              { s: 'in_progress', icon: <Wrench size={16}/>,      color: '#8b5cf6' },
              { s: 'completed',   icon: <CheckCircle size={16}/>, color: '#059669' },
            ].map(({ s, icon, color }) => (
              <div key={s} style={{
                background: card, border: `1px solid ${border}`, borderRadius: '10px',
                padding: '12px', textAlign: 'center',
              }}>
                <div style={{ color, marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: text }}>{statusCount(s)}</div>
                <div style={{ fontSize: '0.68rem', color: sub, marginTop: '2px' }}>
                  {isAr ? STATUS_META[s].labelAr : STATUS_META[s].labelEn}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CRAFTSMAN: Filter Pills ── */}
        {isCraftsman && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {['all', ...craftsmanStatuses].map(f => (
              <button key={f} onClick={() => setCraftsmanFilter(f)} style={{
                padding: '5px 13px', borderRadius: '99px', border: 'none',
                background: craftsmanFilter === f ? accent : (darkMode ? '#1e293b' : '#f1f5f9'),
                color: craftsmanFilter === f ? '#000' : sub,
                fontWeight: craftsmanFilter === f ? 700 : 400,
                fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {f === 'all'
                  ? (isAr ? 'الكل' : 'All')
                  : (isAr ? STATUS_META[f]?.labelAr : STATUS_META[f]?.labelEn)
                }
                {f !== 'all' && statusCount(f) > 0 && (
                  <span style={{
                    marginRight: isAr ? '5px' : 0,
                    marginLeft: !isAr ? '5px' : 0,
                    background: craftsmanFilter === f ? 'rgba(0,0,0,0.15)' : (darkMode ? '#334155' : '#e2e8f0'),
                    borderRadius: '99px', padding: '0 6px', fontSize: '0.7rem',
                  }}>
                    {statusCount(f)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader size={32} color={accent} style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : displayedBookings.length === 0 ? (
          <EmptyState isAr={isAr} darkMode={darkMode} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isClient && displayedBookings.map(b => (
              <ClientBookingCard
                key={b.id}
                booking={b}
                isAr={isAr}
                darkMode={darkMode}
                onCancel={handleCancelRequest}
                onReview={handleReview}
              />
            ))}
            {isCraftsman && displayedBookings.map(b => (
              <CraftsmanBookingCard
                key={b.id}
                booking={b}
                isAr={isAr}
                darkMode={darkMode}
                onStatusChange={handleStatusRequest}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <ConfirmModal
          isAr={isAr}
          darkMode={darkMode}
          withReason={modal.needsReason}
          message={
            modal.newStatus === 'cancel'
              ? (isAr ? 'هل تريد إلغاء هذا الحجز؟' : 'Are you sure you want to cancel this booking?')
              : modal.newStatus === 'rejected'
                ? (isAr ? 'هل تريد رفض هذا الطلب؟' : 'Are you sure you want to reject this booking?')
                : (isAr ? `هل تريد تغيير الحالة إلى "${STATUS_META[modal.newStatus]?.labelAr}"؟`
                         : `Change status to "${STATUS_META[modal.newStatus]?.labelEn}"?`)
          }
          onConfirm={modal.newStatus === 'cancel' ? handleCancelConfirm : handleStatusConfirm}
          onCancel={() => setModal(null)}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default MyBookingsPage;