
// src/pages/SearchResultsPage.jsx
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { useSearchParams, Link, useNavigate } from 'react-router-dom';
// import { useTheme } from '../context/ThemeContext';
// import api from '../services/api';
// import VoiceSearch from '../components/Search/VoiceSearch';
// import CraftsmanMap from '../components/Map/CraftsmanMap';
// import { getCityCoordinates, calculateDistance } from '../utils/location';
// import { 
//   Search, MapPin, Star, Filter, Grid, Map,
//   Mic, X, ChevronDown, RotateCw, CheckCircle, Loader,
//   AlertCircle, Users, Route, Navigation, Wrench
// } from 'lucide-react';

// const SearchResultsPage = () => {
//   const [searchParams] = useSearchParams();
//   const initialQuery = searchParams.get('q') || '';
//   const initialCity = searchParams.get('city') || '';
//   const navigate = useNavigate();
//   const { darkMode } = useTheme();
//   const [lang, setLang] = useState('ar');

//   // ========== State ==========
//   const [query, setQuery] = useState(initialQuery);
//   const [filterLocation, setFilterLocation] = useState(initialCity);
//   const [filterRating, setFilterRating] = useState('');
//   const [filterJob, setFilterJob] = useState('');
//   const [sortBy, setSortBy] = useState('rating');
//   const [craftsmen, setCraftsmen] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [viewMode, setViewMode] = useState('grid');
//   const [showVoice, setShowVoice] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [meta, setMeta] = useState({});
//   const [userLocation, setUserLocation] = useState(null);
//   const [selectedCraftsman, setSelectedCraftsman] = useState(null);
//   const [error, setError] = useState(null);
//   const [locationPermission, setLocationPermission] = useState('loading');
//   const [availableCrafts, setAvailableCrafts] = useState([]);

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
//           setLocationPermission('granted');
//         },
//         (error) => {
//           console.warn('Location permission denied:', error);
//           setLocationPermission('denied');
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
//       setLocationPermission('unsupported');
//     }
//   }, []);

//   // ========== Load Available Crafts ==========
//   useEffect(() => {
//     const loadCrafts = async () => {
//       try {
//         const data = await api.getCrafts();
//         // ✅ تأكد من أنها مصفوفة
//         const crafts = data.crafts || data || [];
//         setAvailableCrafts(crafts);
//       } catch (error) {
//         console.warn('Could not load crafts:', error);
//         // ✅ Fallback مصفوفة
//         setAvailableCrafts([
//           { id: 1, name: 'نجار', icon: '🔨' },
//           { id: 2, name: 'سباك', icon: '🔧' },
//           { id: 3, name: 'كهربائي', icon: '⚡' },
//           { id: 4, name: 'نقاش', icon: '🎨' },
//           { id: 5, name: 'بناء', icon: '🏗️' },
//           { id: 6, name: 'فني تكييف', icon: '❄️' },
//         ]);
//       }
//     };
//     loadCrafts();
//   }, []);

//   // ========== Load Craftsmen ==========
//   const loadCraftsmen = useCallback(async (searchQuery = query) => {
//     setLoading(true);
//     setRefreshing(false);
//     setError(null);
    
//     try {
//       const params = {};
      
//       if (searchQuery?.trim()) {
//         params.search = searchQuery.trim();
//       }
      
//       if (filterLocation?.trim()) {
//         params.city = filterLocation.trim();
//       }
      
//       if (filterJob) {
//         params.craft_id = filterJob;
//       }
      
//       if (sortBy) {
//         params.sort_by = sortBy;
//       }
      
//       if (userLocation) {
//         params.lat = userLocation.latitude;
//         params.lng = userLocation.longitude;
//         params.radius = 100;
//       }
      
//       const data = await api.getCraftsmen(params);
      
//       if (!data || !data.craftsmen) {
//         throw new Error('No data received from API');
//       }
      
//       const formattedCraftsmen = data.craftsmen.map(c => {
//         let lat = c.latitude || c.lat || null;
//         let lng = c.longitude || c.lng || null;
        
//         if (!lat || !lng) {
//           const coords = getCityCoordinates(c.city || filterLocation || 'القاهرة');
//           lat = coords.lat;
//           lng = coords.lng;
//         }

//         // ✅ اسم الحرفي — الباك بيرجع first_name و last_name
//         const craftsmanName = `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.name || 'حرفي';

//         // ✅ التخصص — الباك بيرجع crafts[] مش craft
//         const primaryCraft = c.crafts?.[0]?.name || c.craft?.name || c.profession || '';

//         // ✅ المهارات — بتيجي من crafts[]
//         const craftsmanSkills = c.crafts?.map(craft => craft.name) || [];

//         // ✅ السعر — الباك بيرجع hourly_rate
//         const hourlyRate = parseFloat(c.hourly_rate || c.price_per_hour || 0);

//         return {
//           ...c,
//           id: c.id,
//           name: craftsmanName,
//           latitude: parseFloat(lat),
//           longitude: parseFloat(lng),
//           rating: parseFloat(c.rating || c.average_rating || 0),
//           reviews_count: parseInt(c.reviews_count || 0),
//           hourly_rate: hourlyRate,
//           completedJobs: parseInt(c.completed_bookings || c.completed_jobs || 0),
//           yearsExperience: parseInt(c.years_experience || c.experience_years || 0),
//           phone: c.phone || '',
//           bio: c.bio || '',
//           skills: craftsmanSkills,
//           profession: primaryCraft,
//           city: c.city || filterLocation || '',
//           district: c.district || '',
//           avatar_url: c.avatar_url || null,
//           is_verified: c.is_verified || false,
//           distance: c.distance || (userLocation ? calculateDistance(
//             userLocation.latitude,
//             userLocation.longitude,
//             lat,
//             lng
//           ) : null),
//           portfolio: c.portfolio_images || [],
//         };
//       });
      
//       setCraftsmen(formattedCraftsmen);
//       setMeta(data.meta || { total: formattedCraftsmen.length });
      
//       if (formattedCraftsmen.length > 0) {
//         setSelectedCraftsman(formattedCraftsmen[0]);
//       } else {
//         setSelectedCraftsman(null);
//       }
      
//     } catch (error) {
//       console.error('❌ Error loading craftsmen:', error);
//       setError(error.message || 'حدث خطأ في تحميل البيانات');
//       setCraftsmen([]);
//       setMeta({ total: 0 });
//       setSelectedCraftsman(null);
//     }
    
//     setLoading(false);
//     setRefreshing(false);
//   }, [query, filterLocation, filterJob, sortBy, userLocation]);

//   // ========== Load on mount ==========
//   useEffect(() => {
//     loadCraftsmen(initialQuery);
//   }, [initialQuery, loadCraftsmen]);

//   // ========== Filter and sort ==========
//   const filtered = useMemo(() => {
//     let results = [...craftsmen];
    
//     if (filterRating) {
//       results = results.filter(c => c.rating >= parseFloat(filterRating));
//     }
    
//     if (sortBy === 'price_asc') {
//       results.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
//     } else if (sortBy === 'price_desc') {
//       results.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0));
//     } else if (sortBy === 'rating') {
//       results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//     } else if (sortBy === 'distance' && userLocation) {
//       results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
//     }
    
//     return results;
//   }, [craftsmen, filterRating, sortBy, userLocation]);

//   // ========== Handlers ==========
//   const handleVoiceResult = (text) => {
//     setQuery(text);
//     setShowVoice(false);
//     loadCraftsmen(text);
//     navigate(`/search?q=${encodeURIComponent(text)}`);
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     loadCraftsmen();
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

//   const handleSelectCraftsman = (craftsman) => {
//     setSelectedCraftsman(craftsman);
//     if (viewMode === 'grid') {
//       setViewMode('map');
//     }
//   };

//   const handleSearch = () => {
//     loadCraftsmen();
//     navigate(`/search?q=${encodeURIComponent(query)}`);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   // ========== Translations ==========
//   const t = {
//     searchResults: lang === 'ar' ? 'نتائج البحث' : 'Search Results',
//     search: lang === 'ar' ? 'ابحث عن حرفي...' : 'Search craftsmen...',
//     found: (count) => lang === 'ar' ? `تم العثور على ${count} حرفي` : `Found ${count} craftsmen`,
//     noResults: lang === 'ar' ? 'لا توجد نتائج' : 'No results found',
//     viewProfile: lang === 'ar' ? 'عرض الملف' : 'View Profile',
//     bookNow: lang === 'ar' ? 'احجز الآن' : 'Book Now',
//     egp: lang === 'ar' ? 'ج.م' : 'EGP',
//     highestRated: lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated',
//     lowestPrice: lang === 'ar' ? 'الأقل سعراً' : 'Lowest Price',
//     highestPrice: lang === 'ar' ? 'الأعلى سعراً' : 'Highest Price',
//     nearest: lang === 'ar' ? 'الأقرب إليك' : 'Nearest',
//     gridView: lang === 'ar' ? 'شبكة' : 'Grid',
//     mapView: lang === 'ar' ? 'خريطة' : 'Map',
//     filters: lang === 'ar' ? 'تصفية' : 'Filters',
//     refresh: lang === 'ar' ? 'تحديث' : 'Refresh',
//     showOnMap: lang === 'ar' ? 'عرض على الخريطة' : 'Show on Map',
//     nearby: lang === 'ar' ? 'الحرفيين القريبين' : 'Nearby Craftsmen',
//     distance: lang === 'ar' ? 'المسافة' : 'Distance',
//     selectCraftsman: lang === 'ar' ? 'اختر حرفي' : 'Select Craftsman',
//     error: lang === 'ar' ? 'حدث خطأ' : 'Error',
//     retry: lang === 'ar' ? 'إعادة المحاولة' : 'Retry',
//     noLocation: lang === 'ar' ? 'لم يتم تحديد الموقع' : 'Location not detected',
//     useCurrentLocation: lang === 'ar' ? 'استخدم موقعك الحالي' : 'Use current location',
//     distanceAway: (dist) => lang === 'ar' ? `${dist} كم عنك` : `${dist} km away`,
//     crafts: lang === 'ar' ? 'الحرف' : 'Crafts',
//     all: lang === 'ar' ? 'الكل' : 'All',
//     location: lang === 'ar' ? 'الموقع' : 'Location',
//   };

//   // ========== Styles ==========
//   const bgColor = darkMode ? '#0f172a' : '#f8fafc';
//   const cardBg = darkMode ? '#1e293b' : '#ffffff';
//   const textColor = darkMode ? '#f1f5f9' : '#0f172a';
//   const textSecondary = darkMode ? '#94a3b8' : '#64748b';
//   const borderColor = darkMode ? '#334155' : '#e2e8f0';
//   const errorBg = darkMode ? '#1e293b' : '#fef2f2';
//   const errorBorder = darkMode ? '#7f1d1d' : '#fecaca';

//   return (
//     <div style={{ 
//       background: bgColor, 
//       minHeight: '100vh', 
//       fontFamily: "'Cairo', sans-serif", 
//       direction: lang === 'ar' ? 'rtl' : 'ltr' 
//     }}>
//       <style>{`
//         @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
//         @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
//         @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//         .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
//         .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; }
//         .hover-lift { transition: all 0.3s ease; }
//         .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
//         .skeleton { background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
//         .animate-spin { animation: spin 1s linear infinite; }
//         .map-container { height: 400px; }
//         @media (max-width: 768px) { 
//           .search-header { flex-direction: column; } 
//           .map-container { height: 300px; }
//           .results-grid { grid-template-columns: 1fr !important; }
//           .filters-row { flex-direction: column; }
//         }
//       `}</style>

//       {/* ===== Header ===== */}
//       <div style={{
//         background: darkMode ? 'linear-gradient(160deg, #1e3a8a, #1e40af)' : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
//         color: 'white', 
//         padding: '32px 0',
//       }}>
//         <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
//           <div className="animate-fade-in-up" style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             gap: '12px', 
//             marginBottom: '20px',
//             flexWrap: 'wrap',
//           }}>
//             <div style={{ 
//               width: '44px', 
//               height: '44px', 
//               borderRadius: '12px', 
//               background: 'rgba(255,255,255,0.2)', 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'center' 
//             }}>
//               <Search size={22} />
//             </div>
//             <div>
//               <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
//                 {t.searchResults}
//               </h1>
//               <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>
//                 {loading ? '...' : t.found(filtered.length)}
//               </p>
//             </div>
//             {!loading && filtered.length > 0 && (
//               <div style={{ 
//                 marginRight: 'auto',
//                 fontSize: '0.8rem',
//                 opacity: 0.7,
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//               }}>
//                 <Navigation size={14} />
//                 <span>
//                   {lang === 'ar' 
//                     ? `عرض ${Math.min(filtered.length, 20)} من ${meta.total || filtered.length}`
//                     : `Showing ${Math.min(filtered.length, 20)} of ${meta.total || filtered.length}`}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* ===== Search Bar ===== */}
//           <div className="animate-fade-in-up delay-100" style={{ 
//             display: 'flex', 
//             gap: '10px',
//             flexWrap: 'wrap',
//           }}>
//             <div style={{ 
//               flex: 1, 
//               display: 'flex', 
//               alignItems: 'center', 
//               background: 'white', 
//               borderRadius: '16px', 
//               padding: '4px',
//               minWidth: '200px',
//             }}>
//               <Search size={20} style={{ 
//                 color: '#94a3b8', 
//                 margin: lang === 'ar' ? '0 12px 0 0' : '0 0 0 12px' 
//               }} />
//               <input 
//                 type="text" 
//                 value={query} 
//                 onChange={(e) => setQuery(e.target.value)} 
//                 onKeyPress={handleKeyPress}
//                 placeholder={t.search}
//                 style={{ 
//                   flex: 1, 
//                   padding: '14px 8px', 
//                   border: 'none', 
//                   fontSize: '1rem', 
//                   outline: 'none', 
//                   color: '#0f172a', 
//                   fontFamily: "'Cairo', sans-serif", 
//                   textAlign: lang === 'ar' ? 'right' : 'left', 
//                   background: 'transparent' 
//                 }} 
//               />
//               {query && (
//                 <button 
//                   onClick={() => { 
//                     setQuery(''); 
//                     loadCraftsmen(''); 
//                   }} 
//                   style={{ 
//                     background: 'none', 
//                     border: 'none', 
//                     cursor: 'pointer', 
//                     padding: '8px', 
//                     color: '#94a3b8',
//                     transition: 'all 0.3s ease',
//                   }}
//                 >
//                   <X size={18} />
//                 </button>
//               )}
//               <button 
//                 onClick={() => setShowVoice(true)} 
//                 style={{ 
//                   padding: '10px', 
//                   borderRadius: '12px', 
//                   border: 'none', 
//                   cursor: 'pointer', 
//                   background: '#eff6ff', 
//                   color: '#3b82f6', 
//                   display: 'flex', 
//                   alignItems: 'center', 
//                   justifyContent: 'center', 
//                   margin: '2px',
//                   transition: 'all 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.background = '#dbeafe'}
//                 onMouseLeave={(e) => e.currentTarget.style.background = '#eff6ff'}
//               >
//                 <Mic size={18} />
//               </button>
//             </div>
//             <button 
//               onClick={handleSearch} 
//               style={{ 
//                 padding: '14px 24px', 
//                 borderRadius: '14px', 
//                 border: 'none', 
//                 cursor: 'pointer', 
//                 background: 'white', 
//                 color: '#2563eb', 
//                 fontWeight: 700, 
//                 fontSize: '0.95rem', 
//                 fontFamily: "'Cairo', sans-serif",
//                 transition: 'all 0.3s ease',
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = 'scale(1.02)';
//                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//                 e.currentTarget.style.boxShadow = 'none';
//               }}
//             >
//               {lang === 'ar' ? 'بحث' : 'Search'}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ===== Content ===== */}
//       <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        
//         {/* ===== Toolbar ===== */}
//         <div className="animate-fade-in-up delay-200" style={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           marginBottom: '20px', 
//           flexWrap: 'wrap', 
//           gap: '12px' 
//         }}>
//           <div className="filters-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//             <button 
//               onClick={() => setShowFilters(!showFilters)} 
//               style={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: '6px', 
//                 padding: '10px 16px', 
//                 borderRadius: '12px', 
//                 border: `1px solid ${borderColor}`, 
//                 background: showFilters ? '#3b82f6' : cardBg, 
//                 cursor: 'pointer', 
//                 color: showFilters ? 'white' : textColor, 
//                 fontSize: '0.85rem', 
//                 fontWeight: 600, 
//                 fontFamily: "'Cairo', sans-serif",
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               <Filter size={16} />
//               {t.filters}
//             </button>
            
//             <select 
//               value={filterJob} 
//               onChange={(e) => setFilterJob(e.target.value)} 
//               style={{ 
//                 padding: '10px 14px', 
//                 borderRadius: '12px', 
//                 border: `1px solid ${borderColor}`, 
//                 background: cardBg, 
//                 cursor: 'pointer', 
//                 color: textColor, 
//                 fontSize: '0.85rem', 
//                 fontFamily: "'Cairo', sans-serif",
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               <option value="">{t.all}</option>
//               {Array.isArray(availableCrafts) && availableCrafts.map((craft) => (
//                 <option key={craft.id} value={craft.id}>
//                   {craft.icon} {craft.name}
//                 </option>
//               ))}
//             </select>
            
//             <select 
//               value={sortBy} 
//               onChange={(e) => setSortBy(e.target.value)} 
//               style={{ 
//                 padding: '10px 14px', 
//                 borderRadius: '12px', 
//                 border: `1px solid ${borderColor}`, 
//                 background: cardBg, 
//                 cursor: 'pointer', 
//                 color: textColor, 
//                 fontSize: '0.85rem', 
//                 fontFamily: "'Cairo', sans-serif",
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               <option value="rating">{t.highestRated}</option>
//               <option value="price_asc">{t.lowestPrice}</option>
//               <option value="price_desc">{t.highestPrice}</option>
//               {userLocation && <option value="distance">{t.nearest}</option>}
//             </select>
            
//             <button 
//               onClick={handleRefresh} 
//               disabled={refreshing} 
//               style={{ 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: '6px', 
//                 padding: '10px 14px', 
//                 borderRadius: '12px', 
//                 border: `1px solid ${borderColor}`, 
//                 cursor: refreshing ? 'not-allowed' : 'pointer', 
//                 color: textColor, 
//                 fontSize: '0.85rem', 
//                 fontFamily: "'Cairo', sans-serif",
//                 opacity: refreshing ? 0.5 : 1,
//                 background: cardBg,
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               <RotateCw size={16} className={refreshing ? 'animate-spin' : ''} />
//               <span style={{ display: 'none' }}>{t.refresh}</span>
//             </button>
//           </div>
          
//           <div style={{ 
//             display: 'flex', 
//             gap: '4px', 
//             background: darkMode ? '#0f172a' : '#f1f5f9', 
//             borderRadius: '12px', 
//             padding: '4px' 
//           }}>
//             <button 
//               onClick={() => setViewMode('grid')} 
//               style={{ 
//                 padding: '8px 14px', 
//                 borderRadius: '10px', 
//                 border: 'none', 
//                 cursor: 'pointer', 
//                 fontWeight: 600, 
//                 fontSize: '0.85rem', 
//                 fontFamily: "'Cairo', sans-serif", 
//                 background: viewMode === 'grid' ? '#3b82f6' : 'transparent', 
//                 color: viewMode === 'grid' ? 'white' : textColor, 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: '6px',
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               <Grid size={16} />
//               {t.gridView}
//             </button>
//             <button 
//               onClick={() => setViewMode('map')} 
//               style={{ 
//                 padding: '8px 14px', 
//                 borderRadius: '10px', 
//                 border: 'none', 
//                 cursor: 'pointer', 
//                 fontWeight: 600, 
//                 fontSize: '0.85rem', 
//                 fontFamily: "'Cairo', sans-serif", 
//                 background: viewMode === 'map' ? '#3b82f6' : 'transparent', 
//                 color: viewMode === 'map' ? 'white' : textColor, 
//                 display: 'flex', 
//                 alignItems: 'center', 
//                 gap: '6px',
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               <Map size={16} />
//               {t.mapView}
//             </button>
//           </div>
//         </div>

//         {/* ===== Expanded Filters ===== */}
//         {showFilters && (
//           <div style={{ 
//             background: cardBg, 
//             borderRadius: '16px', 
//             padding: '20px', 
//             border: `1px solid ${borderColor}`, 
//             marginBottom: '20px', 
//             display: 'flex', 
//             gap: '12px', 
//             flexWrap: 'wrap',
//             animation: 'fadeInUp 0.3s ease forwards',
//           }}>
//             <select 
//               value={filterRating} 
//               onChange={(e) => setFilterRating(e.target.value)} 
//               style={{ 
//                 padding: '10px 14px', 
//                 borderRadius: '10px', 
//                 border: `1px solid ${borderColor}`, 
//                 background: cardBg, 
//                 color: textColor, 
//                 fontSize: '0.85rem', 
//                 fontFamily: "'Cairo', sans-serif",
//                 minWidth: '120px',
//               }}
//             >
//               <option value="">{lang === 'ar' ? 'التقييم' : 'Rating'}</option>
//               <option value="4.5">4.5+ ⭐</option>
//               <option value="4">4+ ⭐</option>
//               <option value="3">3+ ⭐</option>
//             </select>
            
//             <input 
//               type="text" 
//               value={filterLocation} 
//               onChange={(e) => setFilterLocation(e.target.value)} 
//               placeholder={lang === 'ar' ? 'المدينة' : 'City'} 
//               style={{ 
//                 padding: '10px 14px', 
//                 borderRadius: '10px', 
//                 border: `1px solid ${borderColor}`, 
//                 background: cardBg, 
//                 color: textColor, 
//                 fontSize: '0.85rem', 
//                 fontFamily: "'Cairo', sans-serif", 
//                 textAlign: lang === 'ar' ? 'right' : 'left',
//                 minWidth: '150px',
//               }} 
//             />

//             <button
//               onClick={() => {
//                 setFilterRating('');
//                 setFilterLocation('');
//                 setFilterJob('');
//                 setSortBy('rating');
//               }}
//               style={{
//                 padding: '10px 16px',
//                 borderRadius: '10px',
//                 border: `1px solid ${borderColor}`,
//                 background: 'transparent',
//                 color: textSecondary,
//                 cursor: 'pointer',
//                 fontSize: '0.85rem',
//                 fontFamily: "'Cairo', sans-serif",
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               {lang === 'ar' ? 'إعادة تعيين' : 'Reset'}
//             </button>
//           </div>
//         )}

//         {/* ===== Error Message ===== */}
//         {error && (
//           <div style={{
//             padding: '20px',
//             background: errorBg,
//             borderRadius: '16px',
//             border: `1px solid ${errorBorder}`,
//             textAlign: 'center',
//             marginBottom: '20px',
//           }}>
//             <AlertCircle size={40} style={{ color: '#ef4444', marginBottom: '12px' }} />
//             <h3 style={{ color: '#ef4444', marginBottom: '8px', fontSize: '1.1rem' }}>
//               {t.error}
//             </h3>
//             <p style={{ color: textSecondary, marginBottom: '16px' }}>
//               {error}
//             </p>
//             <button
//               onClick={() => {
//                 setError(null);
//                 loadCraftsmen();
//               }}
//               style={{
//                 padding: '10px 24px',
//                 borderRadius: '10px',
//                 border: 'none',
//                 background: '#3b82f6',
//                 color: 'white',
//                 cursor: 'pointer',
//                 fontWeight: 600,
//                 fontFamily: "'Cairo', sans-serif",
//                 transition: 'all 0.3s ease',
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//             >
//               {t.retry}
//             </button>
//           </div>
//         )}

//         {/* ===== Location Status ===== */}
//         {locationPermission === 'denied' && (
//           <div style={{
//             padding: '12px 16px',
//             background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff',
//             borderRadius: '12px',
//             border: `1px solid ${darkMode ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.2)'}`,
//             marginBottom: '20px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             fontSize: '0.85rem',
//             color: '#3b82f6',
//           }}>
//             <AlertCircle size={16} style={{ flexShrink: 0 }} />
//             <span>
//               {lang === 'ar' 
//                 ? '⚠️ لم يتم تحديد موقعك. استخدم الفلتر "المدينة" للبحث.'
//                 : '⚠️ Your location was not detected. Use the "City" filter to search.'}
//             </span>
//           </div>
//         )}

//         {/* ===== Results ===== */}
//         {loading ? (
//           <div className="results-grid" style={{ 
//             display: 'grid', 
//             gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
//             gap: '20px' 
//           }}>
//             {[1, 2, 3, 4, 5, 6].map(i => (
//               <div key={i} className="skeleton" style={{ borderRadius: '18px', height: '280px' }} />
//             ))}
//           </div>
//         ) : viewMode === 'map' ? (
//           /* ===== 🗺️ MAP VIEW ===== */
//           <div className="animate-fade-in-up">
//             {filtered.length === 0 ? (
//               <div style={{ 
//                 textAlign: 'center', 
//                 padding: '60px 20px', 
//                 background: cardBg, 
//                 borderRadius: '18px', 
//                 border: `1px solid ${borderColor}` 
//               }}>
//                 <Search size={48} style={{ color: textSecondary, opacity: 0.3, marginBottom: '16px' }} />
//                 <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor }}>
//                   {t.noResults}
//                 </h3>
//               </div>
//             ) : (
//               <>
//                 {/* ===== The Map ===== */}
//                 {selectedCraftsman && (
//                   <div className="map-container">
//                     <CraftsmanMap
//                       craftsman={selectedCraftsman}
//                       nearbyCraftsmen={filtered.filter(c => c.id !== selectedCraftsman.id)}
//                       userLocation={userLocation}
//                       onCraftsmanClick={handleCraftsmanClick}
//                       onDirectionsClick={handleDirectionsClick}
//                       onPhoneClick={handlePhoneClick}
//                     />
//                   </div>
//                 )}

//                 {/* ===== Craftsmen List Below Map ===== */}
//                 <div style={{ 
//                   marginTop: '20px',
//                   padding: '16px',
//                   background: cardBg,
//                   borderRadius: '16px',
//                   border: `1px solid ${borderColor}`,
//                 }}>
//                   <h4 style={{ 
//                     fontSize: '1rem', 
//                     fontWeight: 700, 
//                     color: textColor, 
//                     marginBottom: '12px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                   }}>
//                     <Users size={18} style={{ color: '#3b82f6' }} />
//                     {t.selectCraftsman} ({filtered.length})
//                   </h4>
                  
//                   <div style={{
//                     display: 'flex',
//                     flexWrap: 'wrap',
//                     gap: '8px',
//                     maxHeight: '200px',
//                     overflowY: 'auto',
//                     padding: '4px',
//                   }}>
//                     {filtered.map((c) => (
//                       <button
//                         key={c.id}
//                         onClick={() => handleSelectCraftsman(c)}
//                         style={{
//                           padding: '8px 16px',
//                           borderRadius: '10px',
//                           border: selectedCraftsman?.id === c.id 
//                             ? '2px solid #3b82f6' 
//                             : `1px solid ${borderColor}`,
//                           background: selectedCraftsman?.id === c.id 
//                             ? 'rgba(59,130,246,0.1)' 
//                             : 'transparent',
//                           color: textColor,
//                           cursor: 'pointer',
//                           fontSize: '0.85rem',
//                           fontWeight: selectedCraftsman?.id === c.id ? 700 : 500,
//                           fontFamily: "'Cairo', sans-serif",
//                           transition: 'all 0.3s ease',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px',
//                         }}
//                         onMouseEnter={(e) => {
//                           if (selectedCraftsman?.id !== c.id) {
//                             e.currentTarget.style.background = darkMode ? '#334155' : '#f1f5f9';
//                           }
//                         }}
//                         onMouseLeave={(e) => {
//                           if (selectedCraftsman?.id !== c.id) {
//                             e.currentTarget.style.background = 'transparent';
//                           }
//                         }}
//                       >
//                         <span style={{ fontWeight: 700 }}>{c.rating || '?'}</span>
//                         <span>⭐</span>
//                         <span>{c.name}</span>
//                         {c.distance && (
//                           <span style={{
//                             fontSize: '0.7rem',
//                             color: '#059669',
//                             marginLeft: '4px',
//                           }}>
//                             ({c.distance.toFixed(1)} {lang === 'ar' ? 'كم' : 'km'})
//                           </span>
//                         )}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* ===== Quick Stats ===== */}
//                 <div style={{
//                   marginTop: '16px',
//                   display: 'grid',
//                   gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
//                   gap: '12px',
//                 }}>
//                   <div style={{
//                     padding: '12px',
//                     background: cardBg,
//                     borderRadius: '12px',
//                     border: `1px solid ${borderColor}`,
//                     textAlign: 'center',
//                   }}>
//                     <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3b82f6' }}>
//                       {filtered.length}
//                     </div>
//                     <div style={{ fontSize: '0.7rem', color: textSecondary }}>
//                       {lang === 'ar' ? 'إجمالي النتائج' : 'Total Results'}
//                     </div>
//                   </div>
//                   <div style={{
//                     padding: '12px',
//                     background: cardBg,
//                     borderRadius: '12px',
//                     border: `1px solid ${borderColor}`,
//                     textAlign: 'center',
//                   }}>
//                     <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>
//                       {filtered.length > 0 
//                         ? (filtered.reduce((sum, c) => sum + (c.rating || 0), 0) / filtered.length).toFixed(1)
//                         : '0'}
//                     </div>
//                     <div style={{ fontSize: '0.7rem', color: textSecondary }}>
//                       ⭐ {lang === 'ar' ? 'متوسط التقييم' : 'Avg Rating'}
//                     </div>
//                   </div>
//                   <div style={{
//                     padding: '12px',
//                     background: cardBg,
//                     borderRadius: '12px',
//                     border: `1px solid ${borderColor}`,
//                     textAlign: 'center',
//                   }}>
//                     <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669' }}>
//                       {filtered.length > 0 
//                         ? Math.round(filtered.reduce((sum, c) => sum + (c.hourly_rate || 0), 0) / filtered.length)
//                         : '0'} {t.egp}
//                     </div>
//                     <div style={{ fontSize: '0.7rem', color: textSecondary }}>
//                       {lang === 'ar' ? 'متوسط السعر' : 'Avg Price'}
//                     </div>
//                   </div>
//                   {userLocation && (
//                     <div style={{
//                       padding: '12px',
//                       background: cardBg,
//                       borderRadius: '12px',
//                       border: `1px solid ${borderColor}`,
//                       textAlign: 'center',
//                     }}>
//                       <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>
//                         {filtered.length > 0 && filtered.some(c => c.distance) 
//                           ? Math.min(...filtered.map(c => c.distance || Infinity)).toFixed(1)
//                           : '?'} {lang === 'ar' ? 'كم' : 'km'}
//                       </div>
//                       <div style={{ fontSize: '0.7rem', color: textSecondary }}>
//                         {lang === 'ar' ? 'أقرب حرفي' : 'Nearest'}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         ) : filtered.length > 0 ? (
//           /* ===== 📋 GRID VIEW ===== */
//           <div className="results-grid" style={{ 
//             display: 'grid', 
//             gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
//             gap: '20px' 
//           }}>
//             {filtered.map((c, index) => (
//               <div 
//                 key={c.id} 
//                 className="hover-lift animate-fade-in-up" 
//                 style={{ 
//                   background: cardBg, 
//                   borderRadius: '18px', 
//                   overflow: 'hidden', 
//                   border: `1px solid ${borderColor}`, 
//                   animationDelay: `${index * 0.05}s`,
//                   transition: 'all 0.3s ease',
//                 }}
//               >
//                 {/* ===== Card Header ===== */}
//                 <div style={{ 
//                   height: '100px', 
//                   background: 'linear-gradient(160deg, #2563eb, #1d4ed8)', 
//                   display: 'flex', 
//                   alignItems: 'center', 
//                   justifyContent: 'center', 
//                   position: 'relative',
//                 }}>
//                   {/* Rating Badge */}
//                   <span style={{ 
//                     position: 'absolute', 
//                     top: '10px', 
//                     left: lang === 'ar' ? 'auto' : '10px',
//                     right: lang === 'ar' ? '10px' : 'auto',
//                     background: 'rgba(0,0,0,0.5)',
//                     backdropFilter: 'blur(10px)',
//                     padding: '4px 10px', 
//                     borderRadius: '20px', 
//                     fontSize: '0.75rem', 
//                     fontWeight: 700, 
//                     color: '#fbbf24', 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     gap: '4px',
//                   }}>
//                     <Star size={12} fill="#fbbf24" />
//                     {c.rating || 'جديد'}
//                   </span>
                  
//                   {/* Avatar */}
//                   <div style={{ 
//                     width: '52px', 
//                     height: '52px', 
//                     borderRadius: '50%', 
//                     background: 'rgba(255,255,255,0.2)', 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     justifyContent: 'center', 
//                     fontSize: '1.4rem', 
//                     fontWeight: 700, 
//                     color: 'white', 
//                     border: '3px solid rgba(255,255,255,0.3)',
//                     overflow: 'hidden',
//                   }}>
//                     {c.avatar_url 
//                       ? <img src={c.avatar_url} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                       : (c.name?.charAt(0) || 'ح')
//                     }
//                   </div>

//                   {/* Show on Map Button */}
//                   <button
//                     onClick={() => handleSelectCraftsman(c)}
//                     style={{
//                       position: 'absolute',
//                       bottom: '-12px',
//                       right: lang === 'ar' ? 'auto' : '12px',
//                       left: lang === 'ar' ? '12px' : 'auto',
//                       padding: '4px 12px',
//                       borderRadius: '20px',
//                       border: 'none',
//                       background: 'white',
//                       color: '#2563eb',
//                       cursor: 'pointer',
//                       fontSize: '0.7rem',
//                       fontWeight: 600,
//                       fontFamily: "'Cairo', sans-serif",
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '4px',
//                       boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                       transition: 'all 0.3s ease',
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform = 'scale(1.05)';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform = 'scale(1)';
//                     }}
//                   >
//                     <Map size={12} />
//                     {t.showOnMap}
//                   </button>
//                 </div>
                
//                 {/* ===== Card Body ===== */}
//                 <div style={{ padding: '20px 16px 16px' }}>
//                   <div style={{ 
//                     display: 'flex', 
//                     justifyContent: 'space-between', 
//                     alignItems: 'start',
//                     marginBottom: '4px',
//                   }}>
//                     <h3 style={{ 
//                       fontWeight: 700, 
//                       color: textColor, 
//                       fontSize: '1rem',
//                       margin: 0,
//                       flex: 1,
//                     }}>
//                       {c.name}
//                     </h3>
//                     <span style={{ 
//                       fontWeight: 700, 
//                       color: '#059669',
//                       fontSize: '0.9rem',
//                       whiteSpace: 'nowrap',
//                       marginLeft: lang === 'ar' ? '0' : '8px',
//                       marginRight: lang === 'ar' ? '8px' : '0',
//                     }}>
//                       {c.hourly_rate || 0} {t.egp}
//                     </span>
//                   </div>
                  
//                   <p style={{ 
//                     fontSize: '0.8rem', 
//                     color: '#3b82f6', 
//                     fontWeight: 500, 
//                     marginBottom: '6px',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '4px',
//                     flexWrap: 'wrap',
//                   }}>
//                     <Wrench size={12} />
//                     {c.profession || 'حرفي'}
//                     {c.is_verified && (
//                       <span style={{ background: '#d1fae5', color: '#065f46', borderRadius: 20, padding: '1px 8px', fontSize: '0.65rem', fontWeight: 600 }}>
//                         ✓ {lang === 'ar' ? 'موثق' : 'Verified'}
//                       </span>
//                     )}
//                     {c.reviews_count > 0 && (
//                       <span style={{ color: textSecondary, fontSize: '0.7rem' }}>
//                         ({c.reviews_count} {lang === 'ar' ? 'تقييم' : 'reviews'})
//                       </span>
//                     )}
//                   </p>
                  
//                   <div style={{ 
//                     display: 'flex', 
//                     gap: '8px', 
//                     fontSize: '0.75rem', 
//                     color: textSecondary,
//                     marginBottom: '10px',
//                     flexWrap: 'wrap',
//                   }}>
//                     <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
//                       <MapPin size={12} />
//                       {c.city}
//                       {c.district && ` - ${c.district}`}
//                     </span>
//                     {c.distance && (
//                       <span style={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         gap: '3px',
//                         color: '#059669',
//                         fontWeight: 600,
//                       }}>
//                         <Route size={12} />
//                         {c.distance.toFixed(1)} {lang === 'ar' ? 'كم' : 'km'}
//                       </span>
//                     )}
//                   </div>
                  
//                   {c.bio && (
//                     <p style={{ 
//                       fontSize: '0.8rem', 
//                       color: textSecondary,
//                       lineHeight: 1.5,
//                       marginBottom: '10px',
//                       display: '-webkit-box',
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: 'vertical',
//                       overflow: 'hidden',
//                     }}>
//                       {c.bio}
//                     </p>
//                   )}

//                   {/* Skills */}
//                   {c.skills && c.skills.length > 0 && (
//                     <div style={{ 
//                       display: 'flex', 
//                       flexWrap: 'wrap', 
//                       gap: '4px', 
//                       marginBottom: '12px',
//                     }}>
//                       {c.skills.slice(0, 3).map((skill, i) => (
//                         <span key={i} style={{
//                           padding: '2px 8px',
//                           borderRadius: '12px',
//                           background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff',
//                           color: '#3b82f6',
//                           fontSize: '0.65rem',
//                           fontWeight: 500,
//                         }}>
//                           {skill}
//                         </span>
//                       ))}
//                       {c.skills.length > 3 && (
//                         <span style={{
//                           padding: '2px 8px',
//                           borderRadius: '12px',
//                           background: darkMode ? '#334155' : '#f1f5f9',
//                           color: textSecondary,
//                           fontSize: '0.65rem',
//                         }}>
//                           +{c.skills.length - 3}
//                         </span>
//                       )}
//                     </div>
//                   )}
                  
//                   {/* ===== Card Actions ===== */}
//                   <div style={{ display: 'flex', gap: '8px' }}>
//                     <Link 
//                       to={`/craftsman/${c.id}`} 
//                       style={{ 
//                         flex: 1, 
//                         padding: '8px 12px', 
//                         borderRadius: '10px', 
//                         background: darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff', 
//                         color: '#3b82f6', 
//                         textDecoration: 'none', 
//                         textAlign: 'center', 
//                         fontWeight: 600, 
//                         fontSize: '0.8rem', 
//                         fontFamily: "'Cairo', sans-serif",
//                         transition: 'all 0.3s ease',
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.background = '#3b82f6';
//                         e.currentTarget.style.color = 'white';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.background = darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff';
//                         e.currentTarget.style.color = '#3b82f6';
//                       }}
//                     >
//                       {t.viewProfile}
//                     </Link>
//                     <Link 
//                       to={`/booking/${c.id}`} 
//                       style={{ 
//                         flex: 1, 
//                         padding: '8px 12px', 
//                         borderRadius: '10px', 
//                         background: '#2563eb', 
//                         color: 'white', 
//                         textDecoration: 'none', 
//                         textAlign: 'center', 
//                         fontWeight: 600, 
//                         fontSize: '0.8rem', 
//                         fontFamily: "'Cairo', sans-serif",
//                         transition: 'all 0.3s ease',
//                       }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.background = '#1d4ed8';
//                         e.currentTarget.style.transform = 'scale(1.02)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.background = '#2563eb';
//                         e.currentTarget.style.transform = 'scale(1)';
//                       }}
//                     >
//                       {t.bookNow}
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           /* ===== No Results ===== */
//           <div style={{ 
//             textAlign: 'center', 
//             padding: '80px 20px', 
//             background: cardBg, 
//             borderRadius: '18px', 
//             border: `1px solid ${borderColor}`,
//           }}>
//             <Search size={64} style={{ color: textSecondary, opacity: 0.3, marginBottom: '16px' }} />
//             <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
//               {t.noResults}
//             </h3>
//             <p style={{ color: textSecondary, fontSize: '0.95rem' }}>
//               {lang === 'ar' 
//                 ? 'حاول تعديل كلمات البحث أو إزالة الفلاتر' 
//                 : 'Try adjusting your search terms or removing filters'}
//             </p>
//             <button
//               onClick={() => {
//                 setFilterRating('');
//                 setFilterLocation('');
//                 setFilterJob('');
//                 setSortBy('rating');
//                 loadCraftsmen('');
//               }}
//               style={{
//                 marginTop: '16px',
//                 padding: '10px 24px',
//                 borderRadius: '10px',
//                 border: 'none',
//                 background: '#3b82f6',
//                 color: 'white',
//                 cursor: 'pointer',
//                 fontWeight: 600,
//                 fontFamily: "'Cairo', sans-serif",
//                 transition: 'all 0.3s ease',
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
//               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
//             >
//               {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ===== Voice Search Modal ===== */}
//       {showVoice && (
//         <VoiceSearch 
//           lang={lang} 
//           onResult={handleVoiceResult} 
//           onClose={() => setShowVoice(false)} 
//         />
//       )}
//     </div>
//   );
// };

// export default SearchResultsPage;
// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import {
  Search, MapPin, Star, Filter, X, Loader,
  AlertCircle, Wrench, ChevronDown, RotateCw,
  CheckCircle, User, Calendar
} from 'lucide-react';

const SORT_OPTIONS = (isArabic) => [
  { value: 'rating',    label: isArabic ? 'الأعلى تقييماً' : 'Top Rated'    },
  { value: 'newest',    label: isArabic ? 'الأحدث'         : 'Newest'        },
  { value: 'completed', label: isArabic ? 'الأكثر خبرة'    : 'Most Experienced' },
];

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');

  // Filters from URL
  const [query, setQuery]               = useState(searchParams.get('q') || '');
  const [city, setCity]                 = useState(searchParams.get('city') || '');
  const [craftId, setCraftId]           = useState(searchParams.get('craft_id') || '');
  const [sortBy, setSortBy]             = useState('rating');
  const [minRating, setMinRating]       = useState('');

  // Data
  const [craftsmen, setCraftsmen]       = useState([]);
  const [crafts, setCrafts]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [error, setError]               = useState('');
  const [meta, setMeta]                 = useState({ total: 0, current_page: 1, last_page: 1 });
  const [page, setPage]                 = useState(1);

  // UI
  const [showFilters, setShowFilters]   = useState(false);
  const [inputValue, setInputValue]     = useState(searchParams.get('q') || '');

  const isArabic = lang === 'ar';

  // Language
  useEffect(() => {
    const saved = localStorage.getItem('language') || 'ar';
    setLang(saved);
    const h = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', h);
    return () => window.removeEventListener('languagechange', h);
  }, []);

  // Load crafts for filter
  useEffect(() => {
    api.getCrafts().then(d => setCrafts(d.crafts || [])).catch(() => {});
  }, []);

  // Load craftsmen
  const loadCraftsmen = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const params = {
        ...(query && { search: query }),
        ...(city && { city }),
        ...(craftId && { craft_id: craftId }),
        sort_by: sortBy,
        per_page: 12,
        page,
      };

      const data = await api.getCraftsmen(params);
      const raw = data.craftsmen || [];
console.log("Craftsmen Response:", raw);
      const formatted = raw.map(c => ({
        id: c.id,
       name: c.name || 'حرفي',
        avatar_url: c.avatar_url || null,
        rating: parseFloat(c.rating || 0),
        reviews_count: parseInt(c.reviews_count || 0),
        completed_bookings: parseInt(c.completed_bookings || 0),
        hourly_rate: parseFloat(c.hourly_rate || 0),
        city: c.city || '',
        district: c.district || '',
        bio: c.bio || '',
        is_verified: c.is_verified || false,
        profession: c.crafts?.[0]?.name || '',
        crafts: c.crafts || [],
      }));

      // فلتر rating محلي
      const filtered = minRating
        ? formatted.filter(c => c.rating >= parseFloat(minRating))
        : formatted;

      setCraftsmen(filtered);
      setMeta(data.meta || { total: filtered.length, current_page: 1, last_page: 1 });
    } catch (err) {
      setError(err.message || (isArabic ? 'حدث خطأ في تحميل النتائج' : 'Error loading results'));
      setCraftsmen([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [query, city, craftId, sortBy, minRating, page, isArabic]);

  useEffect(() => { loadCraftsmen(); }, [loadCraftsmen]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputValue);
    setPage(1);
    setSearchParams({ ...(inputValue && { q: inputValue }), ...(city && { city }) });
  };

  const handleClearFilters = () => {
    setCraftId(''); setCity(''); setMinRating(''); setSortBy('rating'); setPage(1);
  };

  const activeFiltersCount = [craftId, city, minRating].filter(Boolean).length;

  // Styles
  const bg = darkMode ? '#0f172a' : '#f8fafc';
  const card = darkMode ? '#1e293b' : '#ffffff';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#94a3b8' : '#64748b';
  const inputBg = darkMode ? '#0f172a' : '#f8fafc';
  const accent = '#2563eb';

  const inputStyle = {
    background: inputBg, border: `1.5px solid ${border}`,
    borderRadius: 10, padding: '10px 14px', color: text,
    fontSize: 14, fontFamily: 'Cairo, sans-serif', outline: 'none',
    width: '100%', boxSizing: 'border-box',
    direction: isArabic ? 'rtl' : 'ltr',
  };

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Cairo, sans-serif', direction: isArabic ? 'rtl' : 'ltr', color: text }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .ccard { animation: fadeUp 0.3s ease forwards; transition: box-shadow 0.2s, transform 0.2s; cursor: pointer; }
        .ccard:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-3px); }
        .input-f:focus { border-color: ${accent} !important; }
      `}</style>

      {/* Header / Search Bar */}
      <div style={{ background: `linear-gradient(135deg, #1d4ed8, #2563eb)`, padding: '28px 0 24px', color: 'white' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>
            {isArabic ? 'البحث عن حرفي' : 'Find a Craftsman'}
          </h1>
          <form onSubmit={handleSearch}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isArabic ? 'right' : 'left']: 12, color: '#94a3b8', pointerEvents: 'none' }} />
                <input
                  className="input-f"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={isArabic ? 'ابحث عن حرفي أو تخصص...' : 'Search for a craftsman or specialty...'}
                  style={{ ...inputStyle, [isArabic ? 'paddingRight' : 'paddingLeft']: 38 }}
                />
              </div>
              <button type="submit"
                style={{ background: 'white', color: accent, border: 'none', borderRadius: 10, padding: '10px 22px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
                {isArabic ? 'بحث' : 'Search'}
              </button>
              <button type="button" onClick={() => setShowFilters(p => !p)}
                style={{ background: showFilters ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '10px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
                <Filter size={15} />
                {isArabic ? 'فلترة' : 'Filter'}
                {activeFiltersCount > 0 && (
                  <span style={{ background: '#f59e0b', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px' }}>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '20px', marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>

              <div>
                <label style={{ fontSize: 12, color: sub, display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  {isArabic ? 'التخصص' : 'Specialty'}
                </label>
                <select value={craftId} onChange={e => { setCraftId(e.target.value); setPage(1); }} style={inputStyle}>
                  <option value="">{isArabic ? 'كل التخصصات' : 'All Specialties'}</option>
                  {crafts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: sub, display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  {isArabic ? 'المدينة' : 'City'}
                </label>
                <input className="input-f" value={city} onChange={e => { setCity(e.target.value); setPage(1); }}
                  placeholder={isArabic ? 'القاهرة، الجيزة...' : 'Cairo, Giza...'}
                  style={inputStyle} />
              </div>

              <div>
                <label style={{ fontSize: 12, color: sub, display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  {isArabic ? 'أدنى تقييم' : 'Min Rating'}
                </label>
                <select value={minRating} onChange={e => { setMinRating(e.target.value); setPage(1); }} style={inputStyle}>
                  <option value="">{isArabic ? 'الكل' : 'Any'}</option>
                  {[4.5, 4, 3.5, 3].map(r => (
                    <option key={r} value={r}>{'⭐'.repeat(Math.round(r))} {r}+</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: sub, display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  {isArabic ? 'الترتيب' : 'Sort By'}
                </label>
                <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }} style={inputStyle}>
                  {SORT_OPTIONS(isArabic).map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button onClick={handleClearFilters}
                style={{ marginTop: 14, background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, padding: '7px 16px', color: sub, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <X size={14} /> {isArabic ? 'مسح الفلاتر' : 'Clear Filters'}
              </button>
            )}
          </div>
        )}

        {/* Results bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ color: sub, fontSize: 14 }}>
            {loading ? (isArabic ? 'جاري البحث...' : 'Searching...')
              : isArabic ? `تم العثور على ${meta.total || craftsmen.length} حرفي` : `Found ${meta.total || craftsmen.length} craftsmen`}
          </div>
          <button onClick={() => loadCraftsmen(true)} disabled={refreshing}
            style={{ background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, padding: '6px 14px', cursor: 'pointer', color: sub, fontFamily: 'Cairo, sans-serif', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
            <RotateCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {isArabic ? 'تحديث' : 'Refresh'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 16, color: '#991b1b', display: 'flex', gap: 8, alignItems: 'center' }}>
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ borderRadius: 14, height: 200, background: darkMode ? '#1e293b' : '#e2e8f0', opacity: 0.6 }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && craftsmen.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '70px 20px', background: card, borderRadius: 16, border: `1px solid ${border}` }}>
            <Search size={52} style={{ color: sub, opacity: 0.4, marginBottom: 16 }} />
            <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{isArabic ? 'لا توجد نتائج' : 'No results found'}</h3>
            <p style={{ color: sub, marginBottom: 20 }}>
              {isArabic ? 'جرب تغيير كلمة البحث أو الفلاتر' : 'Try changing your search or filters'}
            </p>
            <button onClick={handleClearFilters}
              style={{ background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>
              {isArabic ? 'مسح الفلاتر' : 'Clear Filters'}
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && craftsmen.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {craftsmen.map((c, idx) => (
              <div key={c.id} className="ccard"
                onClick={() => navigate(`/craftsman/${c.id}`)}
                style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '20px', animationDelay: `${idx * 0.04}s` }}>

                {/* Header */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {c.avatar_url
                      ? <img src={c.avatar_url} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <User size={24} color="white" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</span>
                      {c.is_verified && (
                        <CheckCircle size={14} color="#059669" fill="#059669" title={isArabic ? 'موثق' : 'Verified'} />
                      )}
                    </div>
                    <div style={{ color: accent, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Wrench size={12} />
                      {c.profession || c.crafts?.map(cr => cr.name).join(', ') || '—'}
                    </div>
                    {c.city && (
                      <div style={{ color: sub, fontSize: 12, display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                        <MapPin size={11} /> {c.city}{c.district ? ` - ${c.district}` : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {c.bio && (
                  <p style={{ fontSize: 13, color: sub, lineHeight: 1.6, marginBottom: 12, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {c.bio}
                  </p>
                )}

                {/* Stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${border}` }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                      <Star size={13} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{c.rating > 0 ? c.rating.toFixed(1) : '—'}</span>
                    </div>
                    <div style={{ fontSize: 11, color: sub, marginTop: 1 }}>
                      {c.reviews_count > 0 ? `(${c.reviews_count})` : (isArabic ? 'لا يوجد' : 'No reviews')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center' }}>
                      <Calendar size={13} color={sub} />
                      {c.completed_bookings > 0 ? c.completed_bookings : '—'}
                    </div>
                    <div style={{ fontSize: 11, color: sub, marginTop: 1 }}>{isArabic ? 'حجز مكتمل' : 'Completed'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {c.hourly_rate > 0
                      ? <>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#059669' }}>{c.hourly_rate}</div>
                          <div style={{ fontSize: 11, color: sub, marginTop: 1 }}>{isArabic ? 'ج.م / ساعة' : 'EGP/hr'}</div>
                        </>
                      : <>
                          <div style={{ fontWeight: 700, fontSize: 14, color: sub }}>—</div>
                          <div style={{ fontSize: 11, color: sub, marginTop: 1 }}>{isArabic ? 'السعر' : 'Rate'}</div>
                        </>
                    }
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={e => { e.stopPropagation(); navigate(`/booking/${c.id}`); }}
                  style={{ marginTop: 14, width: '100%', background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
                  {isArabic ? 'احجز الآن' : 'Book Now'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && meta.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ background: card, border: `1px solid ${border}`, borderRadius: 8, padding: '8px 18px', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? sub : text, fontFamily: 'Cairo, sans-serif' }}>
              {isArabic ? 'السابق' : 'Prev'}
            </button>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).slice(
              Math.max(0, page - 3), Math.min(meta.last_page, page + 2)
            ).map(p => (
              <button key={p} onClick={() => setPage(p)}
                style={{ background: p === page ? accent : card, color: p === page ? '#fff' : text, border: `1px solid ${p === page ? accent : border}`, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: p === page ? 700 : 400, fontFamily: 'Cairo, sans-serif' }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(meta.last_page, p + 1))} disabled={page === meta.last_page}
              style={{ background: card, border: `1px solid ${border}`, borderRadius: 8, padding: '8px 18px', cursor: page === meta.last_page ? 'not-allowed' : 'pointer', color: page === meta.last_page ? sub : text, fontFamily: 'Cairo, sans-serif' }}>
              {isArabic ? 'التالي' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchResultsPage;
