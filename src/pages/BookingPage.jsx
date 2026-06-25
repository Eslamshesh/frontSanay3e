// // src/pages/BookingPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useTheme } from '../context/ThemeContext';
// import { useAuth } from '../context/AuthContext';
// import api from '../services/api';
// import ImageUploader from '../components/Upload/ImageUploader';
// import CraftsmanMap from '../components/Map/CraftsmanMap';
// import { getCityCoordinates, calculateDistance } from '../utils/location';
// import { 
//   Calendar, Clock, MapPin, Star, DollarSign, FileText,
//   CheckCircle, ArrowLeft, ArrowRight, Camera,
//   Loader, AlertCircle, Briefcase, Route, Navigation,
//   Users, ChevronDown, ChevronUp, X, Wrench, User,
//   Phone, MessageCircle, Award, Shield, Sparkles,
//   TrendingUp, Zap, Heart, Share2, Eye, ThumbsUp
// } from 'lucide-react';

// const timeSlots = [
//   '9:00 ص', '10:00 ص', '11:00 ص', '12:00 م',
//   '1:00 م', '2:00 م', '3:00 م', '4:00 م',
//   '5:00 م', '6:00 م', '7:00 م', '8:00 م'
// ];

// const BookingPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { darkMode } = useTheme();
//   const { user } = useAuth();
//   const [lang, setLang] = useState('ar');
//   const [craftsman, setCraftsman] = useState(null);
//   const [nearbyCraftsmen, setNearbyCraftsmen] = useState([]);
//   const [crafts, setCrafts] = useState([]);
//   const [selectedCraft, setSelectedCraft] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [step, setStep] = useState(1);
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [notes, setNotes] = useState('');
//   const [images, setImages] = useState([]);
//   const [confirmed, setConfirmed] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedServiceId, setSelectedServiceId] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [showMap, setShowMap] = useState(true);
//   const [showNearby, setShowNearby] = useState(false);
//   const [activeTab, setActiveTab] = useState('details');

//   // ========== Language ==========
//   useEffect(() => {
//     const savedLang = localStorage.getItem('language') || 'ar';
//     setLang(savedLang);
//     const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
//     window.addEventListener('languagechange', handleLanguageChange);
//     return () => window.removeEventListener('languagechange', handleLanguageChange);
//   }, []);

//   // ========== Get User Location ==========
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         () => {
//           setUserLocation({
//             latitude: 30.0444,
//             longitude: 31.2357,
//           });
//         }
//       );
//     } else {
//       setUserLocation({
//         latitude: 30.0444,
//         longitude: 31.2357,
//       });
//     }
//   }, []);

//   // ========== Load Crafts ==========
//   useEffect(() => {
//     const loadCrafts = async () => {
//       try {
//         const data = await api.getCrafts();
//         setCrafts(data.crafts || []);
//       } catch (error) {
//         console.warn('Could not load crafts:', error);
//         setCrafts([
//           { id: 1, name: 'سباكة', icon: '🔧' },
//           { id: 2, name: 'كهرباء', icon: '⚡' },
//           { id: 3, name: 'نجارة', icon: '🪚' },
//           { id: 4, name: 'دهانات', icon: '🎨' },
//           { id: 5, name: 'تكييف وتبريد', icon: '❄️' },
//           { id: 6, name: 'بلاط وسيراميك', icon: '🏗️' },
//           { id: 7, name: 'حدادة', icon: '🔩' },
//           { id: 8, name: 'ألومنيوم', icon: '🪟' },
//           { id: 9, name: 'صيانة أجهزة', icon: '📺' },
//           { id: 10, name: 'تنظيف', icon: '🧹' },
//         ]);
//       }
//     };
//     loadCrafts();
//   }, []);

//   // ========== Load Craftsman Data ==========
//   useEffect(() => {
//     const loadCraftsman = async () => {
//       setLoading(true);
//       try {
//         const data = await api.getCraftsman(id);
//         const craftsmanData = data.craftsman || data;

//         let services = [];

//         if (craftsmanData.services && craftsmanData.services.length > 0) {
//           services = craftsmanData.services.map(s => ({
//             id: s.id || Date.now() + Math.random(),
//             name: s.name || s.title || 'خدمة',
//             price: s.price || s.cost || craftsmanData.hourly_rate || 150,
//           }));
//         } else if (craftsmanData.crafts && craftsmanData.crafts.length > 0) {
//           services = craftsmanData.crafts.map(c => ({
//             id: c.id || Date.now() + Math.random(),
//             name: c.name || c.title || 'خدمة',
//             price: craftsmanData.hourly_rate || craftsmanData.price || 150,
//           }));
//         } else {
//           services = [{
//             id: 1,
//             name: craftsmanData.profession || 'خدمة أساسية',
//             price: craftsmanData.hourly_rate || craftsmanData.price || 150,
//           }];
//         }

//         services = services.filter(s => s.name && s.price);

//         const formattedCraftsman = {
//           ...craftsmanData,
//           id: craftsmanData.id || parseInt(id),
//           name: craftsmanData.name || `${craftsmanData.first_name || ''} ${craftsmanData.last_name || ''}`.trim() || craftsmanData.profession || 'حرفي',
//           latitude: craftsmanData.latitude || craftsmanData.lat || getCityCoordinates(craftsmanData.city || 'القاهرة').lat,
//           longitude: craftsmanData.longitude || craftsmanData.lng || getCityCoordinates(craftsmanData.city || 'القاهرة').lng,
//           rating: craftsmanData.rating || 4.5,
//           hourly_rate: craftsmanData.hourly_rate || craftsmanData.price || 150,
//           city: craftsmanData.city || 'القاهرة',
//           district: craftsmanData.district || '',
//           phone: craftsmanData.phone || craftsmanData.phone_number || '',
//           completedJobs: craftsmanData.completed_jobs || craftsmanData.completed_bookings || 0,
//           yearsExperience: craftsmanData.years_exp || craftsmanData.yearsExperience || 5,
//           profession: craftsmanData.profession || craftsmanData.crafts?.[0]?.name || 'حرفي',
//           bio: craftsmanData.bio || craftsmanData.description || '',
//           services: services,
//         };

//         setCraftsman(formattedCraftsman);

//         if (services && services.length > 0) {
//           setSelectedServiceId(services[0].id);
//         } else {
//           setSelectedServiceId('hourly');
//         }

//         try {
//           const nearbyData = await api.getNearbyCraftsmen(id, {
//             lat: formattedCraftsman.latitude,
//             lng: formattedCraftsman.longitude,
//             radius: 50,
//           });
//           const nearby = (nearbyData.craftsmen || nearbyData || []).map(c => ({
//             ...c,
//             name: c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.profession,
//             latitude: c.latitude || c.lat || getCityCoordinates(c.city || 'القاهرة').lat,
//             longitude: c.longitude || c.lng || getCityCoordinates(c.city || 'القاهرة').lng,
//             rating: c.rating || 4.0,
//             profession: c.profession || c.craft?.name || 'حرفي',
//             city: c.city || 'القاهرة',
//             district: c.district || '',
//             distance: userLocation ? calculateDistance(
//               userLocation.latitude,
//               userLocation.longitude,
//               c.latitude || c.lat || getCityCoordinates(c.city || 'القاهرة').lat,
//               c.longitude || c.lng || getCityCoordinates(c.city || 'القاهرة').lng
//             ) : null,
//           }));
//           setNearbyCraftsmen(nearby);
//         } catch (e) {
//           console.warn('Could not load nearby craftsmen:', e);
//           setNearbyCraftsmen([
//             {
//               id: 2,
//               name: 'محمد السباك',
//               profession: 'سباك',
//               rating: 4.8,
//               city: 'القاهرة',
//               district: 'الزمالك',
//               latitude: 30.0588,
//               longitude: 31.2245,
//               distance: 2.8,
//               phone: '01001234568',
//             },
//             {
//               id: 3,
//               name: 'خالد الكهربائي',
//               profession: 'كهربائي',
//               rating: 4.7,
//               city: 'القاهرة',
//               district: 'الدقي',
//               latitude: 30.0384,
//               longitude: 31.2102,
//               distance: 3.5,
//               phone: '01001234569',
//             },
//           ]);
//         }
//       } catch (error) {
//         console.warn('⚠️ Using fallback craftsman data:', error);
//         const fallbackData = {
//           id: parseInt(id) || 1,
//           name: 'أحمد النجار',
//           first_name: 'أحمد',
//           last_name: 'النجار',
//           profession: 'نجار',
//           rating: 4.9,
//           hourly_rate: 200,
//           city: 'القاهرة',
//           district: 'مدينة نصر',
//           latitude: 30.0444,
//           longitude: 31.2357,
//           phone: '01001234567',
//           completedJobs: 320,
//           yearsExperience: 15,
//           bio: 'نجار محترف خبرة 15 سنة في جميع أعمال النجارة',
//           services: [
//             { id: 1, name: 'تركيب باب', price: 300 },
//             { id: 2, name: 'تصليح دولاب', price: 200 },
//             { id: 3, name: 'أعمال نجارة عامة', price: 400 },
//           ],
//           crafts: [{ id: 1, name: 'نجار' }],
//         };
//         setCraftsman(fallbackData);
//         setSelectedServiceId(fallbackData.services[0].id);
//         setNearbyCraftsmen([
//           {
//             id: 2,
//             name: 'محمد السباك',
//             profession: 'سباك',
//             rating: 4.8,
//             city: 'القاهرة',
//             district: 'الزمالك',
//             latitude: 30.0588,
//             longitude: 31.2245,
//             distance: 2.8,
//           },
//           {
//             id: 3,
//             name: 'خالد الكهربائي',
//             profession: 'كهربائي',
//             rating: 4.7,
//             city: 'القاهرة',
//             district: 'الدقي',
//             latitude: 30.0384,
//             longitude: 31.2102,
//             distance: 3.5,
//           },
//         ]);
//       }
//       setLoading(false);
//     };
//     loadCraftsman();
//   }, [id, userLocation]);

//   // ========== Calculate Price ==========
//   const getServicePrice = () => {
//     // ✅ لو اختار مهنة (craft)
//     if (selectedCraft) {
//       return craftsman?.hourly_rate || craftsman?.price || 150;
//     }

//     if (selectedServiceId === 'hourly') {
//       return craftsman?.hourly_rate || craftsman?.price || 150;
//     }

//     if (selectedServiceId && craftsman?.services) {
//       const selectedService = craftsman.services.find(s => s.id === selectedServiceId);
//       if (selectedService) return selectedService.price;
//     }

//     return craftsman?.hourly_rate || craftsman?.price || 150;
//   };

//   const price = getServicePrice();
//   const platformFee = Math.round(price * 0.1);
//   const total = price + platformFee;
//   const today = new Date().toISOString().split('T')[0];

//   // ============================================================
//   // ✅ دوال رفع الصور
//   // ============================================================

//   const uploadImage = async (file, type = 'post_image') => {
//     setSubmitting(true);
//     setError('');

//     try {
//       const data = await api.uploadImage(file, type);
//       return data;
//     } catch (error) {
//       console.error('❌ Upload error:', error);
//       setError(error.message || 'حدث خطأ في رفع الصورة');
//       return null;
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const uploadMultipleImages = async (files, type = 'post_image') => {
//     setSubmitting(true);
//     setError('');

//     try {
//       const data = await api.uploadMultiple(files, type);
//       return data;
//     } catch (error) {
//       console.error('❌ Upload multiple error:', error);
//       setError(error.message || 'حدث خطأ في رفع الصور');
//       return null;
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleImageUpload = async (files) => {
//     if (!files || files.length === 0) return;
    
//     try {
//       const newImages = files.map(file => ({
//         id: Date.now() + Math.random(),
//         url: URL.createObjectURL(file),
//         name: file.name,
//         date: new Date().toISOString(),
//       }));
//       setImages(prev => [...prev, ...newImages]);
      
//       const result = await uploadMultipleImages(files, 'booking');
      
//       if (result && result.uploads) {
//         const uploadedImages = result.uploads.map((img, index) => ({
//           id: img.id || Date.now() + Math.random(),
//           url: img.url || img.path,
//           name: img.name || 'صورة',
//           date: new Date().toISOString(),
//         }));
//         setImages(prev => {
//           const tempIds = newImages.map(img => img.id);
//           return prev.filter(img => !tempIds.includes(img.id));
//         });
//         setImages(prev => [...prev, ...uploadedImages]);
//       }
      
//     } catch (error) {
//       console.error('❌ Image upload error:', error);
//     }
//   };

//   const removeImage = (id) => {
//     setImages(prev => prev.filter(img => img.id !== id));
//   };

//   // ========== Translations ==========
//   const t = {
//     bookAppointment: lang === 'ar' ? 'حجز موعد' : 'Book Appointment',
//     date: lang === 'ar' ? 'التاريخ' : 'Date',
//     time: lang === 'ar' ? 'الوقت' : 'Time',
//     notes: lang === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (Optional)',
//     next: lang === 'ar' ? 'التالي' : 'Next',
//     back: lang === 'ar' ? 'رجوع' : 'Back',
//     confirm: lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking',
//     servicePrice: lang === 'ar' ? 'سعر الخدمة' : 'Service Price',
//     platformFee: lang === 'ar' ? 'رسوم المنصة' : 'Platform Fee',
//     total: lang === 'ar' ? 'الإجمالي' : 'Total',
//     egp: lang === 'ar' ? 'ج.م' : 'EGP',
//     successTitle: lang === 'ar' ? '🎉 تم تأكيد الحجز!' : '🎉 Booking Confirmed!',
//     successText: (name) => lang === 'ar' ? `سيصل ${name} في الموعد المحدد` : `${name} will arrive on time`,
//     viewBookings: lang === 'ar' ? 'عرض حجوزاتي' : 'View My Bookings',
//     backToHome: lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home',
//     selectDate: lang === 'ar' ? 'يرجى اختيار التاريخ' : 'Please select a date',
//     selectTime: lang === 'ar' ? 'يرجى اختيار الوقت' : 'Please select a time',
//     selectService: lang === 'ar' ? 'اختر الخدمة المطلوبة' : 'Select Service',
//     chooseService: lang === 'ar' ? '-- اختر خدمة --' : '-- Select Service --',
//     services: lang === 'ar' ? 'الخدمات المتاحة' : 'Available Services',
//     hourlyRate: lang === 'ar' ? 'السعر بالساعة' : 'Hourly Rate',
//     location: lang === 'ar' ? 'موقع الحرفي' : 'Craftsman Location',
//     nearby: lang === 'ar' ? 'حرفيون قريبون' : 'Nearby Craftsmen',
//     distance: lang === 'ar' ? 'المسافة' : 'Distance',
//     viewOnMap: lang === 'ar' ? 'عرض على الخريطة' : 'View on Map',
//     hideMap: lang === 'ar' ? 'إخفاء الخريطة' : 'Hide Map',
//     showNearby: lang === 'ar' ? 'عرض الحرفيين القريبين' : 'Show Nearby Craftsmen',
//     noNearby: lang === 'ar' ? 'لا يوجد حرفيين قريبين' : 'No nearby craftsmen',
//     km: lang === 'ar' ? 'كم' : 'km',
//     viewProfile: lang === 'ar' ? 'عرض الملف' : 'View Profile',
//     bookNow: lang === 'ar' ? 'احجز الآن' : 'Book Now',
//     craftsmanLocation: lang === 'ar' ? 'موقع الحرفي' : 'Craftsman Location',
//     yourLocation: lang === 'ar' ? 'موقعك' : 'Your Location',
//     about: lang === 'ar' ? 'نبذة عن الحرفي' : 'About Craftsman',
//     details: lang === 'ar' ? 'تفاصيل الحجز' : 'Booking Details',
//     location: lang === 'ar' ? 'الموقع' : 'Location',
//     reviews: lang === 'ar' ? 'التقييمات' : 'Reviews',
//     serviceType: lang === 'ar' ? 'نوع الخدمة' : 'Service Type',
//   };

//   // ========== Handlers ==========
//   const handleNext = () => {
//     if (!date) { setError(t.selectDate); return; }
//     if (!time) { setError(t.selectTime); return; }
//     setError('');
//     setStep(2);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleConfirm = async () => {
//     setSubmitting(true);
//     setError('');
//     try {
//       const bookingData = {
//         craftsman_id: parseInt(id),
//         booking_date: date,
//         booking_time: time,
//         notes: notes || '',
//         location: `${craftsman?.city || ''} ${craftsman?.district || ''}`.trim(),
//         service_id: selectedServiceId || null,
//         craft_id: selectedCraft?.id || null,
//         price: price,
//         total: total,
//       };

//       console.log('📤 [BookingPage] Sending booking data:', bookingData);

//       const data = await api.createBooking(bookingData);
//       console.log('✅ [BookingPage] Booking successful:', data);
      
//       setConfirmed(true);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     } catch (error) {
//       console.error('❌ [BookingPage] Booking error:', error);
      
//       if (error.errors) {
//         const errorMessages = Object.values(error.errors).flat().join(' | ');
//         setError(errorMessages);
//       } else {
//         setError(error.message || 'حدث خطأ في إنشاء الحجز');
//       }
//       setSubmitting(false);
//     }
//   };

//   const handleCraftsmanClick = (craftsman) => {
//     navigate(`/craftsman/${craftsman.id}`);
//   };

//   const handleDirectionsClick = (location) => {
//     window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`);
//   };

//   const handlePhoneClick = (phone) => {
//     if (phone) {
//       window.location.href = `tel:${phone}`;
//     }
//   };

//   // ========== Styles ==========
//   const bgColor = darkMode ? '#0f172a' : '#f8fafc';
//   const cardBg = darkMode ? '#1e293b' : '#ffffff';
//   const textColor = darkMode ? '#f1f5f9' : '#0f172a';
//   const textSecondary = darkMode ? '#94a3b8' : '#64748b';
//   const borderColor = darkMode ? '#334155' : '#e2e8f0';
//   const inputBg = darkMode ? '#0f172a' : '#ffffff';
//   const gradientBg = darkMode ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' : 'linear-gradient(135deg, #2563eb, #3b82f6)';

//   // ========== Loading State ==========
//   if (loading) {
//     return (
//       <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgColor, fontFamily: "'Cairo', sans-serif" }}>
//         <Loader size={40} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
//       </div>
//     );
//   }

//   // ========== Success State ==========
//   if (confirmed) {
//     return (
//       <div style={{ background: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Cairo', sans-serif", direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
//         <div style={{ background: cardBg, borderRadius: '24px', padding: '48px 36px', maxWidth: '500px', width: '100%', textAlign: 'center', border: `1px solid ${borderColor}` }}>
//           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
//             <CheckCircle size={40} color="white" />
//           </div>
//           <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669', marginBottom: '12px' }}>{t.successTitle}</h1>
//           <p style={{ color: textSecondary, marginBottom: '24px' }}>{t.successText(craftsman?.name || craftsman?.first_name || 'الحرفي')}</p>
          
//           <div style={{ 
//             background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff', 
//             borderRadius: '12px', 
//             padding: '16px',
//             marginBottom: '24px',
//             textAlign: 'left',
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: textSecondary }}>
//               <span>{t.date}</span>
//               <span style={{ fontWeight: 600, color: textColor }}>{date}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: textSecondary, marginTop: '4px' }}>
//               <span>{t.time}</span>
//               <span style={{ fontWeight: 600, color: textColor }}>{time}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: textSecondary, marginTop: '4px' }}>
//               <span>{t.total}</span>
//               <span style={{ fontWeight: 700, color: '#059669' }}>{total} {t.egp}</span>
//             </div>
//           </div>
          
//           <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
//             <button
//               onClick={() => navigate('/my-bookings')}
//               style={{
//                 padding: '12px 28px',
//                 borderRadius: '12px',
//                 background: '#3b82f6',
//                 color: 'white',
//                 border: 'none',
//                 fontWeight: 700,
//                 fontSize: '0.95rem',
//                 cursor: 'pointer',
//                 fontFamily: "'Cairo', sans-serif",
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
//               }}
//             >
//               📋 {t.viewBookings}
//             </button>
//             <Link
//               to="/"
//               style={{
//                 padding: '12px 28px',
//                 borderRadius: '12px',
//                 background: gradientBg,
//                 color: 'white',
//                 textDecoration: 'none',
//                 fontWeight: 700,
//                 fontSize: '0.95rem',
//                 fontFamily: "'Cairo', sans-serif",
//                 display: 'inline-flex',
//                 alignItems: 'center',
//                 gap: '8px',
//               }}
//             >
//               <ArrowRight size={18} />{t.backToHome}
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========== Main Render ==========
//   return (
//     <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif", direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
//       <style>{`
//         @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
//         .time-slot { transition: all 0.3s ease; }
//         .time-slot:hover { transform: translateY(-2px); }
//         .animate-spin { animation: spin 1s linear infinite; }
//         .tab-active::after { 
//           content: ''; 
//           position: absolute; 
//           bottom: -2px; 
//           left: 0; 
//           right: 0; 
//           height: 3px; 
//           background: #3b82f6; 
//           border-radius: 3px 3px 0 0; 
//         }
//         @media (max-width: 768px) { 
//           .booking-grid { grid-template-columns: 1fr !important; }
//           .map-container { height: 250px !important; }
//           .tabs-container { overflow-x: auto; }
//         }
//       `}</style>

//       {/* ===== Header ===== */}
//       <div style={{ background: gradientBg, color: 'white', padding: '32px 0' }}>
//         <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
//           <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <ArrowLeft size={18} />
//             </button>
//             <div>
//               <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{t.bookAppointment}</h1>
//               <p style={{ fontSize: '0.8rem', opacity: 0.85 }}>● {lang === 'ar' ? 'الخطوة' : 'Step'} {step}/2</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== Craftsman Info Banner ===== */}
//       <div style={{ 
//         maxWidth: '1100px', 
//         margin: '0 auto', 
//         padding: '16px 24px',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '16px',
//         flexWrap: 'wrap',
//       }}>
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '12px',
//           background: cardBg,
//           padding: '12px 20px',
//           borderRadius: '12px',
//           border: `1px solid ${borderColor}`,
//           flex: 1,
//         }}>
//           <div style={{
//             width: '44px',
//             height: '44px',
//             borderRadius: '50%',
//             background: gradientBg,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: 'white',
//             fontWeight: 700,
//             fontSize: '1.2rem',
//           }}>
//             {craftsman?.name?.charAt(0) || 'ح'}
//           </div>
//           <div>
//             <div style={{ fontWeight: 700, color: textColor }}>{craftsman?.name}</div>
//             <div style={{ fontSize: '0.85rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '6px' }}>
//               <Wrench size={14} />
//               {craftsman?.profession}
//             </div>
//           </div>
//           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: textSecondary }}>
//             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//               <Star size={14} fill="#f59e0b" color="#f59e0b" />
//               {craftsman?.rating || 'جديد'}
//             </span>
//             <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
//               <MapPin size={14} color="#ef4444" />
//               {craftsman?.city}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* ===== Content ===== */}
//       <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 24px 32px' }}>
//         {error && (
//           <div style={{ background: darkMode ? 'rgba(220,38,38,0.1)' : '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(220,38,38,0.2)' }}>
//             <AlertCircle size={18} />{error}
//           </div>
//         )}

//         <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
//           {/* ===== Main Form ===== */}
//           <div>
//             {/* ===== Tabs ===== */}
//             <div className="tabs-container" style={{ 
//               display: 'flex', 
//               gap: '4px', 
//               marginBottom: '24px', 
//               borderBottom: `2px solid ${borderColor}`, 
//               overflowX: 'auto' 
//             }}>
//               {['details', 'about', 'location'].map(tab => (
//                 <button 
//                   key={tab} 
//                   onClick={() => setActiveTab(tab)} 
//                   className={activeTab === tab ? 'tab-active' : ''} 
//                   style={{ 
//                     padding: '12px 24px', 
//                     border: 'none', 
//                     background: 'transparent', 
//                     cursor: 'pointer', 
//                     fontWeight: activeTab === tab ? 700 : 500, 
//                     fontSize: '0.95rem', 
//                     color: activeTab === tab ? '#3b82f6' : textSecondary, 
//                     fontFamily: "'Cairo', sans-serif", 
//                     whiteSpace: 'nowrap', 
//                     position: 'relative' 
//                   }}
//                 >
//                   {tab === 'details' && '📋 '}
//                   {tab === 'about' && '👤 '}
//                   {tab === 'location' && '📍 '}
//                   {tab === 'details' ? t.details : tab === 'about' ? t.about : t.location}
//                 </button>
//               ))}
//             </div>

//             {/* ===== Tab: Details ===== */}
//             {activeTab === 'details' && (
//               <div className="animate-fade-in-up" style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}` }}>
//                 <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <Calendar size={20} style={{ color: '#3b82f6' }} />
//                   {lang === 'ar' ? 'اختر التاريخ والوقت' : 'Select Date & Time'}
//                 </h2>

//                 {/* ===== نوع الخدمة (قائمة منسدلة) ===== */}
//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
//                     <Briefcase size={14} style={{ display: 'inline', marginLeft: '6px' }} />
//                     {t.serviceType}
//                   </label>
                  
//                   <select
//                     value={selectedCraft?.id || ''}
//                     onChange={(e) => {
//                       const craftId = e.target.value;
//                       if (craftId) {
//                         const craft = crafts.find(c => c.id === parseInt(craftId));
//                         setSelectedCraft(craft);
//                         setSelectedServiceId(null);
//                       } else {
//                         setSelectedCraft(null);
//                       }
//                     }}
//                     style={{
//                       width: '100%',
//                       padding: '14px',
//                       border: `2px solid ${borderColor}`,
//                       borderRadius: '12px',
//                       background: inputBg,
//                       color: textColor,
//                       fontFamily: "'Cairo', sans-serif",
//                       fontSize: '0.95rem',
//                       textAlign: lang === 'ar' ? 'right' : 'left',
//                       appearance: 'none',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     <option value="">{lang === 'ar' ? '-- اختر نوع الخدمة --' : '-- Select Service Type --'}</option>
                    
//                     {crafts.map(craft => (
//                       <option key={craft.id} value={craft.id}>
//                         {craft.icon || '🔧'} {craft.name}
//                       </option>
//                     ))}
//                   </select>
                  
//                   {selectedCraft && (
//                     <p style={{ 
//                       fontSize: '0.8rem', 
//                       color: '#059669', 
//                       marginTop: '6px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '4px',
//                     }}>
//                       ✅ {lang === 'ar' ? 'تم الاختيار:' : 'Selected:'} {selectedCraft.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* ===== Price Display ===== */}
//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
//                     <DollarSign size={14} style={{ display: 'inline', marginLeft: '6px' }} />
//                     {lang === 'ar' ? 'السعر' : 'Price'}
//                   </label>
                  
//                   <div style={{
//                     padding: '14px 16px',
//                     border: `2px solid ${borderColor}`,
//                     borderRadius: '12px',
//                     background: inputBg,
//                     color: textColor,
//                     fontSize: '1.1rem',
//                     fontWeight: 700,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'space-between',
//                     fontFamily: "'Cairo', sans-serif",
//                   }}>
//                     <span>{price} {t.egp}</span>
                    
//                     {selectedCraft && (
//                       <span style={{ fontSize: '0.8rem', fontWeight: 400, color: textSecondary }}>
//                         ({selectedCraft.name})
//                       </span>
//                     )}
                    
//                     {selectedServiceId && selectedServiceId !== 'hourly' && craftsman?.services && !selectedCraft && (
//                       <span style={{ fontSize: '0.8rem', fontWeight: 400, color: textSecondary }}>
//                         ({craftsman.services.find(s => s.id === selectedServiceId)?.name || ''})
//                       </span>
//                     )}
                    
//                     {selectedServiceId === 'hourly' && !selectedCraft && (
//                       <span style={{ fontSize: '0.8rem', fontWeight: 400, color: textSecondary }}>
//                         ({lang === 'ar' ? 'الساعة' : 'per hour'})
//                       </span>
//                     )}
//                   </div>
                  
//                   <div style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     fontSize: '0.85rem',
//                     color: textSecondary,
//                     marginTop: '8px',
//                     padding: '8px 0',
//                     borderBottom: `1px solid ${borderColor}`,
//                   }}>
//                     <span>{t.platformFee} (10%)</span>
//                     <span>+ {platformFee} {t.egp}</span>
//                   </div>
                  
//                   <div style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     fontSize: '1.1rem',
//                     fontWeight: 700,
//                     color: '#059669',
//                     marginTop: '8px',
//                     paddingTop: '8px',
//                   }}>
//                     <span>{t.total}</span>
//                     <span>{total} {t.egp}</span>
//                   </div>
//                 </div>

//                 {/* ===== Date ===== */}
//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
//                     <Calendar size={14} style={{ display: 'inline', marginLeft: '6px' }} />
//                     {t.date}
//                   </label>
//                   <input 
//                     type="date" 
//                     value={date} 
//                     onChange={(e) => setDate(e.target.value)} 
//                     min={today}
//                     style={{
//                       width: '100%',
//                       padding: '14px',
//                       border: `2px solid ${borderColor}`,
//                       borderRadius: '12px',
//                       fontSize: '0.95rem',
//                       background: inputBg,
//                       color: textColor,
//                       fontFamily: "'Cairo', sans-serif",
//                       textAlign: lang === 'ar' ? 'right' : 'left',
//                     }}
//                   />
//                   {date && (
//                     <p style={{ fontSize: '0.8rem', color: '#059669', marginTop: '4px' }}>
//                       ✅ {lang === 'ar' ? 'التاريخ المختار:' : 'Selected date:'} {date}
//                     </p>
//                   )}
//                 </div>

//                 {/* ===== Time ===== */}
//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '12px' }}>
//                     <Clock size={14} style={{ display: 'inline', marginLeft: '6px' }} />
//                     {t.time}
//                   </label>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
//                     {timeSlots.map(slot => (
//                       <button 
//                         key={slot} 
//                         onClick={() => setTime(slot)} 
//                         className="time-slot"
//                         style={{
//                           padding: '12px 8px',
//                           borderRadius: '12px',
//                           border: time === slot ? '2px solid #3b82f6' : `2px solid ${borderColor}`,
//                           background: time === slot ? (darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff') : 'transparent',
//                           cursor: 'pointer',
//                           fontSize: '0.85rem',
//                           fontWeight: time === slot ? 700 : 500,
//                           color: time === slot ? '#3b82f6' : textColor,
//                           fontFamily: "'Cairo', sans-serif",
//                           transition: 'all 0.3s ease',
//                         }}
//                       >
//                         {slot}
//                       </button>
//                     ))}
//                   </div>
//                   {time && (
//                     <p style={{ fontSize: '0.8rem', color: '#059669', marginTop: '8px' }}>
//                       ✅ {lang === 'ar' ? 'الوقت المختار:' : 'Selected time:'} {time}
//                     </p>
//                   )}
//                 </div>

//                 {/* ===== Notes ===== */}
//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
//                     <FileText size={14} style={{ display: 'inline', marginLeft: '6px' }} />
//                     {t.notes}
//                   </label>
//                   <textarea 
//                     value={notes} 
//                     onChange={(e) => setNotes(e.target.value)} 
//                     rows="3"
//                     placeholder={lang === 'ar' ? 'أي تفاصيل إضافية عن الخدمة المطلوبة...' : 'Any additional details about the service...'}
//                     style={{
//                       width: '100%',
//                       padding: '14px',
//                       border: `2px solid ${borderColor}`,
//                       borderRadius: '12px',
//                       fontSize: '0.95rem',
//                       background: inputBg,
//                       color: textColor,
//                       fontFamily: "'Cairo', sans-serif",
//                       textAlign: lang === 'ar' ? 'right' : 'left',
//                       resize: 'vertical',
//                       minHeight: '80px',
//                     }}
//                   />
//                 </div>

//                 {/* ===== Image Upload ===== */}
//                 <div style={{ marginBottom: '20px' }}>
//                   <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
//                     <Camera size={14} style={{ display: 'inline', marginLeft: '6px' }} />
//                     {lang === 'ar' ? 'صور إضافية (اختياري)' : 'Additional Images (Optional)'}
//                   </label>
                  
//                   <ImageUploader 
//                     onUpload={handleImageUpload}
//                     multiple={true}
//                     maxFiles={5}
//                     type="booking"
//                     autoUpload={true}
//                   />
                  
//                   {images.length > 0 && (
//                     <div style={{
//                       display: 'grid',
//                       gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
//                       gap: '8px',
//                       marginTop: '12px',
//                     }}>
//                       {images.map((img) => (
//                         <div key={img.id} style={{
//                           position: 'relative',
//                           borderRadius: '8px',
//                           overflow: 'hidden',
//                           height: '80px',
//                           border: `1px solid ${borderColor}`,
//                         }}>
//                           <img 
//                             src={img.url} 
//                             alt={img.name}
//                             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                           />
//                           <button
//                             onClick={() => removeImage(img.id)}
//                             style={{
//                               position: 'absolute',
//                               top: '4px',
//                               right: '4px',
//                               width: '20px',
//                               height: '20px',
//                               borderRadius: '50%',
//                               background: 'rgba(220,38,38,0.9)',
//                               color: 'white',
//                               border: 'none',
//                               cursor: 'pointer',
//                               display: 'flex',
//                               alignItems: 'center',
//                               justifyContent: 'center',
//                               fontSize: '0.7rem',
//                             }}
//                           >
//                             <X size={12} />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <button 
//                   onClick={handleNext} 
//                   style={{
//                     width: '100%',
//                     padding: '16px',
//                     borderRadius: '14px',
//                     background: gradientBg,
//                     color: 'white',
//                     border: 'none',
//                     fontWeight: 700,
//                     fontSize: '1.05rem',
//                     cursor: 'pointer',
//                     fontFamily: "'Cairo', sans-serif",
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '8px',
//                     boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
//                   }}
//                 >
//                   {t.next} <ArrowRight size={18} />
//                 </button>
//               </div>
//             )}

//             {/* ===== Tab: About ===== */}
//             {activeTab === 'about' && (
//               <div className="animate-fade-in-up" style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}` }}>
//                 <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   <User size={20} style={{ color: '#3b82f6' }} />
//                   {t.about}
//                 </h2>
//                 <p style={{ color: textSecondary, lineHeight: 2, fontSize: '0.95rem' }}>
//                   {craftsman?.bio || 'لم يضف نبذة تعريفية بعد'}
//                 </p>
//                 <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
//                   <span style={{ padding: '6px 14px', borderRadius: '20px', background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 500, border: '1px solid rgba(59,130,246,0.2)' }}>
//                     <Award size={14} style={{ display: 'inline', marginRight: '4px' }} />
//                     {craftsman?.yearsExperience || 0} {lang === 'ar' ? 'سنوات خبرة' : 'Years Exp'}
//                   </span>
//                   <span style={{ padding: '6px 14px', borderRadius: '20px', background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 500, border: '1px solid rgba(59,130,246,0.2)' }}>
//                     <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
//                     {craftsman?.completedJobs || 0} {lang === 'ar' ? 'خدمة مكتملة' : 'Completed Jobs'}
//                   </span>
//                   <span style={{ padding: '6px 14px', borderRadius: '20px', background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 500, border: '1px solid rgba(59,130,246,0.2)' }}>
//                     <Shield size={14} style={{ display: 'inline', marginRight: '4px' }} />
//                     {lang === 'ar' ? 'موثق' : 'Verified'}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* ===== Tab: Location ===== */}
//             {activeTab === 'location' && (
//               <div className="animate-fade-in-up">
//                 <CraftsmanMap
//                   craftsman={{
//                     id: craftsman.id,
//                     name: craftsman.name || `${craftsman.first_name || ''} ${craftsman.last_name || ''}`.trim(),
//                     latitude: craftsman.latitude || 30.0444,
//                     longitude: craftsman.longitude || 31.2357,
//                     city: craftsman.city,
//                     district: craftsman.district,
//                     rating: craftsman.rating,
//                     phone: craftsman.phone,
//                     profession: craftsman.profession,
//                   }}
//                   nearbyCraftsmen={nearbyCraftsmen}
//                   userLocation={userLocation}
//                   onCraftsmanClick={handleCraftsmanClick}
//                   onDirectionsClick={handleDirectionsClick}
//                   onPhoneClick={handlePhoneClick}
//                 />
//               </div>
//             )}
//           </div>

//           {/* ===== Sidebar ===== */}
//           <div style={{ position: 'sticky', top: '84px', alignSelf: 'start' }}>
//             {/* ===== Price Summary ===== */}
//             <div style={{ background: cardBg, borderRadius: '16px', padding: '24px', border: `1px solid ${borderColor}`, marginBottom: '16px' }}>
//               <h3 style={{ fontSize: '1rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <DollarSign size={18} style={{ color: '#059669' }} />
//                 {lang === 'ar' ? 'ملخص السعر' : 'Price Summary'}
//               </h3>
              
//               {selectedCraft && (
//                 <div style={{ 
//                   display: 'flex', 
//                   justifyContent: 'space-between', 
//                   padding: '8px 0', 
//                   color: textSecondary,
//                   fontSize: '0.85rem',
//                 }}>
//                   <span>{selectedCraft.name}</span>
//                   <span>{price} {t.egp}</span>
//                 </div>
//               )}

//               {selectedServiceId && selectedServiceId !== 'hourly' && craftsman?.services && !selectedCraft && (
//                 <div style={{ 
//                   display: 'flex', 
//                   justifyContent: 'space-between', 
//                   padding: '8px 0', 
//                   color: textSecondary,
//                   fontSize: '0.85rem',
//                 }}>
//                   <span>{craftsman.services.find(s => s.id === selectedServiceId)?.name || t.servicePrice}</span>
//                   <span>{craftsman.services.find(s => s.id === selectedServiceId)?.price || price} {t.egp}</span>
//                 </div>
//               )}

//               {selectedServiceId === 'hourly' && !selectedCraft && (
//                 <div style={{ 
//                   display: 'flex', 
//                   justifyContent: 'space-between', 
//                   padding: '8px 0', 
//                   color: textSecondary,
//                   fontSize: '0.85rem',
//                 }}>
//                   <span>{t.hourlyRate}</span>
//                   <span>{price} {t.egp}</span>
//                 </div>
//               )}
              
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 padding: '8px 0', 
//                 color: textSecondary,
//                 fontSize: '0.85rem',
//               }}>
//                 <span>{t.servicePrice}</span>
//                 <span>{price} {t.egp}</span>
//               </div>
              
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 padding: '8px 0', 
//                 color: textSecondary,
//                 fontSize: '0.85rem',
//               }}>
//                 <span>{t.platformFee} (10%)</span>
//                 <span>{platformFee} {t.egp}</span>
//               </div>
              
//               <div style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 padding: '12px 0', 
//                 fontWeight: 700, 
//                 fontSize: '1.1rem', 
//                 color: '#059669', 
//                 borderTop: `2px solid ${borderColor}`, 
//                 marginTop: '8px' 
//               }}>
//                 <span>{t.total}</span>
//                 <span>{total} {t.egp}</span>
//               </div>
//             </div>

//             {/* ===== Craftsman Info ===== */}
//             <div style={{ background: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${borderColor}`, marginBottom: '16px' }}>
//               <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
//                 <div style={{ 
//                   width: '48px', 
//                   height: '48px', 
//                   borderRadius: '50%', 
//                   background: gradientBg, 
//                   color: 'white', 
//                   display: 'flex', 
//                   alignItems: 'center', 
//                   justifyContent: 'center', 
//                   fontWeight: 700, 
//                   fontSize: '1.1rem' 
//                 }}>
//                   {craftsman?.name?.charAt(0) || craftsman?.first_name?.charAt(0) || 'ح'}
//                 </div>
//                 <div>
//                   <strong style={{ color: textColor }}>{craftsman?.name || `${craftsman?.first_name || ''} ${craftsman?.last_name || ''}`.trim()}</strong>
//                   <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>{craftsman?.profession || craftsman?.crafts?.[0]?.name}</div>
//                 </div>
//               </div>
//               <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: textSecondary }}>
//                 <span><Star size={14} fill="#f59e0b" color="#f59e0b" /> {craftsman?.rating || 'جديد'}</span>
//                 <span><MapPin size={14} color="#ef4444" /> {craftsman?.city} {craftsman?.district}</span>
//                 <span style={{ fontSize: '0.7rem', color: '#059669' }}>
//                   ✅ {lang === 'ar' ? 'متاح للحجز' : 'Available for booking'}
//                 </span>
//                 <span style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
//                   {craftsman?.phone && (
//                     <a href={`tel:${craftsman.phone}`} style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                       <Phone size={14} /> {lang === 'ar' ? 'اتصل' : 'Call'}
//                     </a>
//                   )}
//                   <a href={`https://wa.me/${craftsman?.phone || '20'}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
//                     <MessageCircle size={14} /> {lang === 'ar' ? 'واتساب' : 'WhatsApp'}
//                   </a>
//                 </span>
//               </div>
//             </div>

//             {/* ===== MAP SECTION ===== */}
//             {craftsman && (
//               <div style={{ 
//                 background: cardBg, 
//                 borderRadius: '16px', 
//                 border: `1px solid ${borderColor}`,
//                 overflow: 'hidden',
//               }}>
//                 <div 
//                   onClick={() => setShowMap(!showMap)}
//                   style={{
//                     padding: '16px 20px',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     cursor: 'pointer',
//                     borderBottom: showMap ? `1px solid ${borderColor}` : 'none',
//                   }}
//                 >
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                     <MapPin size={18} style={{ color: '#ef4444' }} />
//                     <span style={{ fontWeight: 700, color: textColor }}>{t.craftsmanLocation}</span>
//                   </div>
//                   <button
//                     onClick={() => setShowMap(!showMap)}
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       cursor: 'pointer',
//                       color: textSecondary,
//                     }}
//                   >
//                     {showMap ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//                   </button>
//                 </div>

//                 {showMap && (
//                   <div style={{ padding: '0 16px 16px' }}>
//                     <div className="map-container" style={{ height: '200px', borderRadius: '12px', overflow: 'hidden' }}>
//                       <CraftsmanMap
//                         craftsman={{
//                           id: craftsman.id,
//                           name: craftsman.name || `${craftsman.first_name || ''} ${craftsman.last_name || ''}`.trim(),
//                           latitude: craftsman.latitude || 30.0444,
//                           longitude: craftsman.longitude || 31.2357,
//                           city: craftsman.city,
//                           district: craftsman.district,
//                           rating: craftsman.rating,
//                           phone: craftsman.phone,
//                           profession: craftsman.profession,
//                         }}
//                         nearbyCraftsmen={nearbyCraftsmen}
//                         userLocation={userLocation}
//                         onCraftsmanClick={handleCraftsmanClick}
//                         onDirectionsClick={handleDirectionsClick}
//                         onPhoneClick={handlePhoneClick}
//                       />
//                     </div>

//                     {/* Nearby Craftsmen Toggle */}
//                     {nearbyCraftsmen.length > 0 && (
//                       <div style={{ marginTop: '12px' }}>
//                         <button
//                           onClick={() => setShowNearby(!showNearby)}
//                           style={{
//                             width: '100%',
//                             padding: '8px 12px',
//                             borderRadius: '8px',
//                             border: `1px solid ${borderColor}`,
//                             background: 'transparent',
//                             color: textColor,
//                             cursor: 'pointer',
//                             fontSize: '0.8rem',
//                             fontWeight: 600,
//                             fontFamily: "'Cairo', sans-serif",
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                             gap: '6px',
//                           }}
//                         >
//                           <Users size={14} />
//                           {showNearby ? t.hideMap : t.showNearby}
//                           <span style={{ 
//                             background: '#3b82f6', 
//                             color: 'white', 
//                             borderRadius: '50%',
//                             padding: '0 6px',
//                             fontSize: '0.7rem',
//                           }}>
//                             {nearbyCraftsmen.length}
//                           </span>
//                         </button>

//                         {showNearby && (
//                           <div style={{ marginTop: '8px', maxHeight: '150px', overflowY: 'auto' }}>
//                             {nearbyCraftsmen.slice(0, 3).map((n, i) => (
//                               <div
//                                 key={n.id || i}
//                                 onClick={() => handleCraftsmanClick(n)}
//                                 style={{
//                                   padding: '8px 12px',
//                                   borderRadius: '8px',
//                                   borderBottom: i < nearbyCraftsmen.length - 1 ? `1px solid ${borderColor}` : 'none',
//                                   cursor: 'pointer',
//                                   display: 'flex',
//                                   justifyContent: 'space-between',
//                                   alignItems: 'center',
//                                   transition: 'all 0.3s ease',
//                                 }}
//                                 onMouseEnter={(e) => { e.currentTarget.style.background = darkMode ? '#334155' : '#f1f5f9'; }}
//                                 onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
//                               >
//                                 <div>
//                                   <div style={{ fontSize: '0.85rem', fontWeight: 600, color: textColor }}>
//                                     {n.name}
//                                   </div>
//                                   <div style={{ fontSize: '0.7rem', color: textSecondary }}>
//                                     {n.profession} • {n.city}
//                                   </div>
//                                 </div>
//                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                   {n.distance && (
//                                     <span style={{ fontSize: '0.7rem', color: '#059669' }}>
//                                       {n.distance.toFixed(1)} {t.km}
//                                     </span>
//                                   )}
//                                   <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem', color: '#f59e0b' }}>
//                                     <Star size={12} fill="#f59e0b" />
//                                     {n.rating || 'جديد'}
//                                   </span>
//                                 </div>
//                               </div>
//                             ))}
//                             {nearbyCraftsmen.length > 3 && (
//                               <button
//                                 onClick={() => navigate('/search')}
//                                 style={{
//                                   width: '100%',
//                                   padding: '8px',
//                                   borderRadius: '8px',
//                                   border: 'none',
//                                   background: '#3b82f6',
//                                   color: 'white',
//                                   cursor: 'pointer',
//                                   fontSize: '0.75rem',
//                                   fontWeight: 600,
//                                   fontFamily: "'Cairo', sans-serif",
//                                   marginTop: '4px',
//                                 }}
//                               >
//                                 {lang === 'ar' ? `عرض ${nearbyCraftsmen.length - 3} حرفي آخر` : `View ${nearbyCraftsmen.length - 3} more`}
//                               </button>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingPage;
// src/pages/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Calendar, Clock, MapPin, Star, FileText,
  CheckCircle, Loader, AlertCircle, Wrench,
  ChevronLeft, ChevronRight, User
} from 'lucide-react';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
];

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [lang, setLang] = useState('ar');

  // Craftsman data
  const [craftsman, setCraftsman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form fields — يتطابق مع API schema
  const [serviceTitle, setServiceTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingLocation, setBookingLocation] = useState('');
  const [serviceId, setServiceId] = useState('');

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const isArabic = lang === 'ar';
  const today = new Date().toISOString().split('T')[0];

  // Language
  useEffect(() => {
    const saved = localStorage.getItem('language') || 'ar';
    setLang(saved);
    const h = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', h);
    return () => window.removeEventListener('languagechange', h);
  }, []);

  // Load craftsman
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getCraftsman(id);
        const c = data.craftsman || data;
        setCraftsman({
          id: c.id,
          name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'حرفي',
          avatar_url: c.avatar_url || null,
          rating: parseFloat(c.rating || 0),
          reviews_count: c.reviews_count || 0,
          city: c.city || '',
          district: c.district || '',
          bio: c.bio || '',
          is_verified: c.is_verified || false,
          crafts: c.crafts || [],
          completed_bookings: c.completed_bookings || 0,
          hourly_rate: c.hourly_rate || null,
        });
        // نعبي service_title تلقائياً بالتخصص الأول
        if (c.crafts?.[0]?.name) setServiceTitle(c.crafts[0].name);
        setBookingLocation(`${c.city || ''} ${c.district || ''}`.trim());
      } catch (err) {
        setError(err.message || (isArabic ? 'حدث خطأ في تحميل بيانات الحرفي' : 'Error loading craftsman'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    // Validate
    if (!serviceTitle.trim()) {
      setError(isArabic ? 'يرجى كتابة نوع الخدمة المطلوبة' : 'Please enter the service type');
      return;
    }
    if (!date) {
      setError(isArabic ? 'يرجى اختيار التاريخ' : 'Please select a date');
      return;
    }
    if (!time) {
      setError(isArabic ? 'يرجى اختيار الوقت' : 'Please select a time');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      // ✅ يتطابق مع API schema بالضبط
      const bookingData = {
        craftsman_id: parseInt(id),
        service_title: serviceTitle.trim(),
        booking_date: date,
        booking_time: time,
        ...(notes.trim() && { notes: notes.trim() }),
        ...(bookingLocation.trim() && { location: bookingLocation.trim() }),
        ...(serviceId && { service_id: serviceId }),
      };

      const data = await api.createBooking(bookingData);
      setBookingResult(data);
      setConfirmed(true);
    } catch (err) {
      if (err.errors) {
        setError(Object.values(err.errors).flat().join(' | '));
      } else {
        setError(err.message || (isArabic ? 'حدث خطأ في إنشاء الحجز' : 'Booking failed'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  // =========== Styles ===========
  const bg = darkMode ? '#0f172a' : '#f8fafc';
  const card = darkMode ? '#1e293b' : '#ffffff';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#94a3b8' : '#64748b';
  const inputBg = darkMode ? '#0f172a' : '#f8fafc';
  const accent = '#2563eb';

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    padding: '12px 14px', borderRadius: 10,
    border: `1.5px solid ${border}`,
    background: inputBg, color: text,
    fontSize: 15, fontFamily: 'Cairo, sans-serif',
    outline: 'none', transition: 'border-color 0.2s',
    direction: isArabic ? 'rtl' : 'ltr',
  };

  const labelStyle = {
    display: 'block', fontWeight: 600,
    fontSize: 14, color: text, marginBottom: 8,
  };

  // =========== Loading ===========
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
      <Loader size={36} style={{ color: accent, animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // =========== Error loading ===========
  if (error && !craftsman) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, padding: 24 }}>
      <div style={{ background: card, borderRadius: 16, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center', border: `1px solid ${border}` }}>
        <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: 16 }} />
        <p style={{ color: text, marginBottom: 20 }}>{error}</p>
        <button onClick={() => navigate(-1)} style={{ background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
          {isArabic ? 'رجوع' : 'Go Back'}
        </button>
      </div>
    </div>
  );

  // =========== Success ===========
  if (confirmed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, padding: 24, fontFamily: 'Cairo, sans-serif', direction: isArabic ? 'rtl' : 'ltr' }}>
      <div style={{ background: card, borderRadius: 20, padding: '48px 36px', maxWidth: 480, width: '100%', textAlign: 'center', border: `1px solid ${border}` }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <CheckCircle size={40} color="white" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#059669', marginBottom: 8 }}>
          {isArabic ? 'تم إرسال طلب الحجز ✅' : 'Booking Request Sent ✅'}
        </h2>
        <p style={{ color: sub, marginBottom: 24, lineHeight: 1.7 }}>
          {isArabic
            ? `سيتواصل معك ${craftsman?.name} لتأكيد الموعد`
            : `${craftsman?.name} will contact you to confirm`}
        </p>

        <div style={{ background: darkMode ? 'rgba(37,99,235,0.1)' : '#eff6ff', borderRadius: 12, padding: 16, marginBottom: 24, textAlign: isArabic ? 'right' : 'left' }}>
          {[
            { label: isArabic ? 'الخدمة' : 'Service', value: serviceTitle },
            { label: isArabic ? 'التاريخ' : 'Date', value: new Date(date).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
            { label: isArabic ? 'الوقت' : 'Time', value: time },
            ...(bookingLocation ? [{ label: isArabic ? 'الموقع' : 'Location', value: bookingLocation }] : []),
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 2 ? `1px solid ${border}` : 'none' }}>
              <span style={{ color: sub, fontSize: 13 }}>{row.label}</span>
              <span style={{ color: text, fontWeight: 600, fontSize: 13 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/my-bookings')} style={{ background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
            {isArabic ? 'حجوزاتي' : 'My Bookings'}
          </button>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', color: text, border: `1.5px solid ${border}`, borderRadius: 10, padding: '11px 24px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
            {isArabic ? 'الرئيسية' : 'Home'}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // =========== Main Form ===========
  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Cairo, sans-serif', direction: isArabic ? 'rtl' : 'ltr', color: text }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .input-focus:focus { border-color: ${accent} !important; }
        .time-btn:hover { border-color: ${accent} !important; color: ${accent} !important; }
        .time-btn.selected { background: ${accent} !important; color: white !important; border-color: ${accent} !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #1d4ed8, #2563eb)`, color: 'white', padding: '28px 0 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 14px', color: 'white', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
            {isArabic ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {isArabic ? 'رجوع' : 'Back'}
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            {isArabic ? 'تفاصيل الحجز' : 'Booking Details'}
          </h1>
          <p style={{ opacity: 0.85, fontSize: 14, marginTop: 4 }}>
            {isArabic ? 'اكمل البيانات لإرسال طلب الحجز' : 'Fill in the details to send your booking request'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px' }}>

        {/* Craftsman Card */}
        {craftsman && (
          <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: '20px 24px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {craftsman.avatar_url
                ? <img src={craftsman.avatar_url} alt={craftsman.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={26} color="white" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{craftsman.name}</span>
                {craftsman.is_verified && (
                  <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>✓ {isArabic ? 'موثق' : 'Verified'}</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                {craftsman.crafts?.length > 0 && (
                  <span style={{ color: accent, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Wrench size={13} /> {craftsman.crafts.map(c => c.name).join(', ')}
                  </span>
                )}
                {craftsman.rating > 0 && (
                  <span style={{ color: '#f59e0b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={13} fill="#f59e0b" /> {craftsman.rating.toFixed(1)}
                    {craftsman.reviews_count > 0 && <span style={{ color: sub }}>({craftsman.reviews_count})</span>}
                  </span>
                )}
                {craftsman.city && (
                  <span style={{ color: sub, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} /> {craftsman.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: '28px 24px' }}>

          {/* Service Title */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>
              <Wrench size={14} style={{ display: 'inline', marginLeft: 6, marginRight: 6 }} />
              {isArabic ? 'نوع الخدمة المطلوبة *' : 'Required Service *'}
            </label>
            <input
              className="input-focus"
              value={serviceTitle}
              onChange={e => setServiceTitle(e.target.value)}
              placeholder={isArabic ? 'مثال: تركيب باب، صيانة كهرباء...' : 'e.g. Door installation, electrical repair...'}
              style={inputStyle}
            />
            {craftsman?.crafts?.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {craftsman.crafts.map(c => (
                  <button key={c.id} onClick={() => setServiceTitle(c.name)}
                    style={{ background: serviceTitle === c.name ? accent : 'transparent', color: serviceTitle === c.name ? '#fff' : sub, border: `1px solid ${border}`, borderRadius: 20, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>
              <Calendar size={14} style={{ display: 'inline', marginLeft: 6, marginRight: 6 }} />
              {isArabic ? 'تاريخ الحجز *' : 'Booking Date *'}
            </label>
            <input
              className="input-focus"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={today}
              style={inputStyle}
            />
          </div>

          {/* Time Slots */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>
              <Clock size={14} style={{ display: 'inline', marginLeft: 6, marginRight: 6 }} />
              {isArabic ? 'وقت الحجز *' : 'Booking Time *'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(82px, 1fr))', gap: 8 }}>
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  className={`time-btn${time === slot ? ' selected' : ''}`}
                  onClick={() => setTime(slot)}
                  style={{
                    padding: '9px 4px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    border: `1.5px solid ${time === slot ? accent : border}`,
                    background: time === slot ? accent : inputBg,
                    color: time === slot ? '#fff' : text,
                    cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
                    transition: 'all 0.15s',
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>
              <MapPin size={14} style={{ display: 'inline', marginLeft: 6, marginRight: 6 }} />
              {isArabic ? 'موقع الخدمة' : 'Service Location'}
              <span style={{ color: sub, fontWeight: 400, fontSize: 12, marginRight: 4, marginLeft: 4 }}>({isArabic ? 'اختياري' : 'optional'})</span>
            </label>
            <input
              className="input-focus"
              value={bookingLocation}
              onChange={e => setBookingLocation(e.target.value)}
              placeholder={isArabic ? 'العنوان بالتفصيل...' : 'Detailed address...'}
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>
              <FileText size={14} style={{ display: 'inline', marginLeft: 6, marginRight: 6 }} />
              {isArabic ? 'ملاحظات إضافية' : 'Additional Notes'}
              <span style={{ color: sub, fontWeight: 400, fontSize: 12, marginRight: 4, marginLeft: 4 }}>({isArabic ? 'اختياري' : 'optional'})</span>
            </label>
            <textarea
              className="input-focus"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={isArabic ? 'أي تفاصيل إضافية تساعد الحرفي...' : 'Any extra details that help the craftsman...'}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: submitting ? '#93c5fd' : accent,
              color: '#fff', border: 'none', fontWeight: 700,
              fontSize: 16, cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Cairo, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.2s',
            }}
          >
            {submitting
              ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> {isArabic ? 'جاري الإرسال...' : 'Sending...'}</>
              : <><CheckCircle size={18} /> {isArabic ? 'تأكيد الحجز' : 'Confirm Booking'}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;