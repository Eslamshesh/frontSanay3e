import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import VoiceSearch from '../components/Search/VoiceSearch';
import CraftsmanCard from '../components/Search/CraftsmanCard';
import { 
  Search, MapPin, Star, Filter, Grid, Map, List,
  Mic, X, Sliders, TrendingUp, DollarSign,
  Briefcase, ArrowUpDown, ChevronDown, Loader,
  Sparkles, AlertCircle, Compass, Navigation,
  RotateCw, CheckCircle, Wrench, Phone
} from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { isAuthenticated } = useAuth();
  const [lang, setLang] = useState('ar');

  // State
  const [query, setQuery] = useState(initialQuery);
  const [filterLocation, setFilterLocation] = useState(searchParams.get('location') || '');
  const [filterRating, setFilterRating] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterJob, setFilterJob] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [craftsmen, setCraftsmen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid | map
  const [showVoice, setShowVoice] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedCraftsman, setSelectedCraftsman] = useState(null);

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Load data
  useEffect(() => {
    loadCraftsmen();
    detectUserLocation();
  }, []);

  // Reload when query changes
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      loadCraftsmen(initialQuery);
    }
  }, [initialQuery]);

  const loadCraftsmen = async (searchQuery = query) => {
    setLoading(true);
    try {
      // Try API
      const data = searchQuery.trim() 
        ? await api.searchCraftsmen(searchQuery, filterLocation)
        : await api.getCraftsmen();
      setCraftsmen(data.craftsmen || data || []);
    } catch {
      // Fallback
      const craftsmenData = [
        { id: 1, profession: 'سباك', name: 'محمد السباك', rating: 4.8, price: 150, city: 'القاهرة', district: 'مدينة نصر', completed_jobs: 320, bio: 'سباك محترف خبرة 15 سنة في جميع أعمال السباكة والصيانة', phone: '01001234567', latitude: 30.0444, longitude: 31.2357 },
        { id: 2, profession: 'كهربائي', name: 'أحمد الكهربائي', rating: 4.6, price: 180, city: 'الجيزة', district: 'الدقي', completed_jobs: 280, bio: 'فني كهرباء معتمد خبرة في جميع أعمال الكهرباء المنزلية', phone: '01009876543', latitude: 30.0444, longitude: 31.2157 },
        { id: 3, profession: 'نجار', name: 'محمود النجار', rating: 4.9, price: 200, city: 'القاهرة', district: 'المعادي', completed_jobs: 450, bio: 'نجار موبيليا وديكورات خشبية بأعلى جودة', phone: '01005556677', latitude: 29.9644, longitude: 31.2557 },
        { id: 4, profession: 'نقاش', name: 'كريم الدهان', rating: 4.5, price: 130, city: 'الإسكندرية', district: 'سموحة', completed_jobs: 190, bio: 'دهانات وديكورات حديثة بأفضل الخامات', phone: '01001112233', latitude: 31.2001, longitude: 29.9187 },
        { id: 5, profession: 'فني تكييف', name: 'حسن التكييف', rating: 4.7, price: 250, city: 'القاهرة', district: 'الزمالك', completed_jobs: 210, bio: 'صيانة وتركيب جميع أنواع التكييفات', phone: '01007778899', latitude: 30.0644, longitude: 31.2257 },
        { id: 6, profession: 'سباك', name: 'سامح السباك', rating: 4.3, price: 120, city: 'القاهرة', district: 'شبرا', completed_jobs: 150, bio: 'سباكة عامة وإصلاح تسريبات', phone: '01009998877', latitude: 30.0844, longitude: 31.2457 },
        { id: 7, profession: 'بناء', name: 'عماد البناء', rating: 4.8, price: 300, city: 'القاهرة', district: 'التجمع', completed_jobs: 380, bio: 'مقاول بناء وتشطيبات سكنية', phone: '01003334455', latitude: 30.0144, longitude: 31.4057 },
        { id: 8, profession: 'كهربائي', name: 'طارق الفني', rating: 4.4, price: 160, city: 'الجيزة', district: 'فيصل', completed_jobs: 200, bio: 'كهربائي سيارات ومنازل', phone: '01006667788', latitude: 30.0244, longitude: 31.1957 },
      ];
      
      let results = craftsmenData;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        results = results.filter(c => 
          c.profession?.toLowerCase().includes(q) || 
          c.name?.toLowerCase().includes(q) ||
          c.bio?.toLowerCase().includes(q)
        );
      }
      setCraftsmen(results);
    }
    setLoading(false);
    setRefreshing(false);
  };

  // Detect user location
  const detectUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // Default to Cairo
          setUserLocation({ latitude: 30.0444, longitude: 31.2357 });
        }
      );
    }
  };

  // Calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Filter and sort
  const filtered = useMemo(() => {
    let results = [...craftsmen];

    if (filterRating) results = results.filter(c => c.rating >= parseFloat(filterRating));
    if (filterJob) results = results.filter(c => c.profession === filterJob);
    if (filterLocation) results = results.filter(c => 
      c.city?.includes(filterLocation) || c.district?.includes(filterLocation)
    );

    // Add distance
    if (userLocation) {
      results = results.map(c => ({
        ...c,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          c.latitude,
          c.longitude
        )
      }));
    }

    // Sort
    switch(sortBy) {
      case 'rating':
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price_low':
        results.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_high':
        results.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'distance':
        results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
      case 'jobs':
        results.sort((a, b) => (b.completed_jobs || 0) - (a.completed_jobs || 0));
        break;
      default:
        break;
    }

    return results;
  }, [craftsmen, filterRating, filterJob, filterLocation, sortBy, userLocation]);

  const jobs = useMemo(() => [...new Set(craftsmen.map(c => c.profession).filter(Boolean))], [craftsmen]);

  // Handle voice search result
  const handleVoiceResult = (text) => {
    setQuery(text);
    setShowVoice(false);
    loadCraftsmen(text);
    navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadCraftsmen();
  };

  // Handle location click
  const handleLocateCraftsman = (craftsman) => {
    setSelectedCraftsman(craftsman);
    setViewMode('map');
  };

  // Translations
  const t = {
    searchResults: lang === 'ar' ? 'نتائج البحث' : 'Search Results',
    search: lang === 'ar' ? 'ابحث عن حرفي...' : 'Search for a craftsman...',
    rating: lang === 'ar' ? 'التقييم' : 'Rating',
    price: lang === 'ar' ? 'السعر' : 'Price',
    found: (count) => lang === 'ar' ? `تم العثور على ${count} حرفي` : `Found ${count} craftsmen`,
    craftsman: lang === 'ar' ? 'حرفي' : 'Craftsman',
    noResults: lang === 'ar' ? 'لا توجد نتائج' : 'No results found',
    noResultsDesc: lang === 'ar' ? 'جرب تغيير معايير البحث أو استخدم كلمات مختلفة' : 'Try changing search criteria or use different keywords',
    viewProfile: lang === 'ar' ? 'عرض الملف' : 'View Profile',
    bookNow: lang === 'ar' ? 'احجز الآن' : 'Book Now',
    location: lang === 'ar' ? 'الموقع' : 'Location',
    specialty: lang === 'ar' ? 'التخصص' : 'Specialty',
    sort: lang === 'ar' ? 'ترتيب حسب' : 'Sort by',
    highestRated: lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated',
    lowestPrice: lang === 'ar' ? 'الأقل سعراً' : 'Lowest Price',
    highestPrice: lang === 'ar' ? 'الأعلى سعراً' : 'Highest Price',
    nearest: lang === 'ar' ? 'الأقرب' : 'Nearest',
    mostJobs: lang === 'ar' ? 'الأكثر خبرة' : 'Most Experienced',
    gridView: lang === 'ar' ? 'شبكة' : 'Grid',
    mapView: lang === 'ar' ? 'خريطة' : 'Map',
    voice: lang === 'ar' ? 'بحث صوتي' : 'Voice Search',
    filters: lang === 'ar' ? 'تصفية' : 'Filters',
    refresh: lang === 'ar' ? 'تحديث' : 'Refresh',
    distance: (d) => d < 1 ? `${Math.round(d * 1000)} ${lang === 'ar' ? 'متر' : 'm'}` : `${d.toFixed(1)} ${lang === 'ar' ? 'كم' : 'km'}`,
    away: lang === 'ar' ? 'عنك' : 'away',
    craftsmanOnMap: lang === 'ar' ? 'الحرفي على الخريطة' : 'Craftsman on Map',
    getDirections: lang === 'ar' ? 'الاتجاهات' : 'Directions',
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#ffffff';
  const accentColor = '#3b82f6';

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .animate-slide-down { animation: slideDown 0.3s ease forwards; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        
        .craftsman-card { transition: all 0.3s ease; }
        .craftsman-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
        .craftsman-card:hover .card-gradient { opacity: 1; }
        
        .card-gradient {
          position: absolute;
          top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b);
          opacity: 0; transition: opacity 0.3s ease;
        }
        
        .skeleton {
          background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @media (max-width: 768px) {
          .search-header { flex-direction: column; }
          .filter-row { flex-wrap: wrap; }
          .view-toggle { margin-top: 12px; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: darkMode ? 'linear-gradient(160deg, #1e3a8a, #1e40af)' : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
        color: 'white', padding: '32px 0',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Search size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{t.searchResults}</h1>
              <p style={{ fontSize: '0.85rem', opacity: 0.85, margin: '2px 0 0' }}>{t.found(filtered.length)}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="animate-fade-in-up delay-100" style={{
            display: 'flex', gap: '10px', alignItems: 'center',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'white', borderRadius: '16px', padding: '4px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
              <Search size={20} style={{ color: '#94a3b8', marginLeft: '12px' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && loadCraftsmen()}
                placeholder={t.search}
                style={{
                  flex: 1, padding: '14px 8px', border: 'none',
                  fontSize: '1rem', outline: 'none', color: '#0f172a',
                  fontFamily: "'Cairo', sans-serif", textAlign: 'right',
                  background: 'transparent',
                }}
              />
              {query && (
                <button onClick={() => { setQuery(''); loadCraftsmen(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#94a3b8' }}>
                  <X size={18} />
                </button>
              )}
              <button
                onClick={() => setShowVoice(true)}
                style={{
                  padding: '10px', borderRadius: '12px', border: 'none',
                  cursor: 'pointer', background: '#eff6ff', color: '#3b82f6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '2px', transition: 'all 0.3s ease',
                }}
                title={t.voice}
                onMouseEnter={(e) => { e.target.style.background = '#3b82f6'; e.target.style.color = 'white'; }}
                onMouseLeave={(e) => { e.target.style.background = '#eff6ff'; e.target.style.color = '#3b82f6'; }}
              >
                <Mic size={18} />
              </button>
            </div>
            
            <button
              onClick={() => loadCraftsmen()}
              style={{
                padding: '14px 24px', borderRadius: '14px', border: 'none',
                cursor: 'pointer', background: 'white', color: '#2563eb',
                fontWeight: 700, fontSize: '0.95rem', fontFamily: "'Cairo', sans-serif",
                transition: 'all 0.3s ease', whiteSpace: 'nowrap',
              }}>
              {lang === 'ar' ? 'بحث' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        
        {/* Toolbar */}
        <div className="animate-fade-in-up delay-200" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '20px', flexWrap: 'wrap', gap: '12px',
        }}>
          {/* Filters */}
          <div className="filter-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 16px', borderRadius: '12px',
                border: `1px solid ${borderColor}`, background: cardBg,
                cursor: 'pointer', color: textColor, fontSize: '0.85rem',
                fontWeight: 600, fontFamily: "'Cairo', sans-serif",
              }}>
              <Filter size={16} />
              {t.filters}
              <ChevronDown size={14} style={{ transform: showFilters ? 'rotate(180deg)' : 'rotate(0)', transition: 'all 0.3s' }} />
            </button>

            {/* Sort */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '10px 14px', borderRadius: '12px',
                border: `1px solid ${borderColor}`, background: cardBg,
                cursor: 'pointer', color: textColor, fontSize: '0.85rem',
                fontWeight: 500, fontFamily: "'Cairo', sans-serif",
              }}>
              <option value="rating">{t.highestRated}</option>
              <option value="price_low">{t.lowestPrice}</option>
              <option value="price_high">{t.highestPrice}</option>
              <option value="distance">{t.nearest}</option>
              <option value="jobs">{t.mostJobs}</option>
            </select>

            {/* Refresh */}
            <button onClick={handleRefresh} disabled={refreshing}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '10px 14px', borderRadius: '12px',
                border: `1px solid ${borderColor}`, background: 'transparent',
                cursor: 'pointer', color: textColor, fontSize: '0.85rem',
                fontWeight: 500, fontFamily: "'Cairo', sans-serif",
              }}>
              <RotateCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* View Toggle */}
          <div className="view-toggle" style={{
            display: 'flex', gap: '4px', background: darkMode ? '#0f172a' : '#f1f5f9',
            borderRadius: '12px', padding: '4px',
          }}>
            <button onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 14px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                fontFamily: "'Cairo', sans-serif", transition: 'all 0.3s ease',
                background: viewMode === 'grid' ? accentColor : 'transparent',
                color: viewMode === 'grid' ? 'white' : textColor,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              <Grid size={16} />{t.gridView}
            </button>
            <button onClick={() => setViewMode('map')}
              style={{
                padding: '8px 14px', borderRadius: '10px', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                fontFamily: "'Cairo', sans-serif", transition: 'all 0.3s ease',
                background: viewMode === 'map' ? accentColor : 'transparent',
                color: viewMode === 'map' ? 'white' : textColor,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
              <Map size={16} />{t.mapView}
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="animate-slide-down" style={{
            background: cardBg, borderRadius: '16px', padding: '20px',
            border: `1px solid ${borderColor}`, marginBottom: '20px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '6px', fontSize: '0.8rem' }}>{t.rating}</label>
              <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}
                style={selectStyle(borderColor, textColor, inputBg)}>
                <option value="">{lang === 'ar' ? 'الكل' : 'All'}</option>
                <option value="4.5">4.5+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="3">3+ ⭐</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '6px', fontSize: '0.8rem' }}>{t.specialty}</label>
              <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)}
                style={selectStyle(borderColor, textColor, inputBg)}>
                <option value="">{lang === 'ar' ? 'الكل' : 'All'}</option>
                {jobs.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '6px', fontSize: '0.8rem' }}>{t.location}</label>
              <input type="text" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}
                placeholder={lang === 'ar' ? 'المدينة أو الحي' : 'City or district'}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '10px',
                  border: `1px solid ${borderColor}`, background: inputBg,
                  color: textColor, fontSize: '0.85rem', outline: 'none',
                  fontFamily: "'Cairo', sans-serif", textAlign: 'right',
                }} />
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton" style={{ borderRadius: '18px', height: '320px' }} />
            ))}
          </div>
        ) : viewMode === 'map' ? (
          /* Map View */
          <div className="animate-fade-in-up" style={{
            background: cardBg, borderRadius: '18px', border: `1px solid ${borderColor}`,
            overflow: 'hidden', minHeight: '500px',
          }}>
            <div style={{ padding: '16px', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700, color: textColor, margin: 0, fontSize: '1rem' }}>
                <MapPin size={16} style={{ display: 'inline', marginRight: '6px', color: '#ef4444' }} />
                {t.mapView} ({filtered.length} {t.craftsman})
              </h3>
              {selectedCraftsman && (
                <button onClick={() => setSelectedCraftsman(null)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', background: darkMode ? '#334155' : '#f1f5f9',
                    color: textColor, fontSize: '0.8rem', fontFamily: "'Cairo', sans-serif",
                  }}>
                  {lang === 'ar' ? 'إظهار الكل' : 'Show All'}
                </button>
              )}
            </div>
            
            {/* Map iframe */}
            <div style={{ height: '400px', position: 'relative' }}>
              <iframe
                title="Craftsmen Map"
                width="100%"
                height="100%"
                style={{ border: 'none', filter: darkMode ? 'invert(0.9) hue-rotate(180deg)' : 'none' }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedCraftsman ? `${selectedCraftsman.district},${selectedCraftsman.city}` : filterLocation || 'القاهرة')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Nearby List */}
            <div style={{ padding: '16px', maxHeight: '300px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filtered.map((c, index) => (
                  <div key={c.id} onClick={() => setSelectedCraftsman(c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px', borderRadius: '12px',
                      background: selectedCraftsman?.id === c.id ? (darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff') : 'transparent',
                      border: `1px solid ${selectedCraftsman?.id === c.id ? '#3b82f6' : borderColor}`,
                      cursor: 'pointer', transition: 'all 0.3s ease',
                    }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                    }}>
                      {c.name?.charAt(0) || c.profession?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: textColor, fontSize: '0.9rem' }}>{c.name || c.profession}</div>
                      <div style={{ fontSize: '0.8rem', color: textSecondary }}>
                        {c.distance !== undefined && c.distance !== null ? `${t.distance(c.distance)} ${t.away} • ` : ''}
                        {c.city} {c.district ? `- ${c.district}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 600, fontSize: '0.85rem' }}>
                      <Star size={14} fill="#f59e0b" />{c.rating || 'جديد'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filtered.length > 0 ? (
          /* Grid View */
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px',
          }}>
            {filtered.map((c, index) => (
              <div key={c.id}
                className="craftsman-card animate-fade-in-up"
                style={{
                  background: cardBg, borderRadius: '18px', overflow: 'hidden',
                  border: `1px solid ${borderColor}`, position: 'relative',
                  animationDelay: `${index * 0.08}s`,
                }}>
                <div className="card-gradient" />
                
                {/* Card Header */}
                <div style={{
                  height: '140px', background: 'linear-gradient(160deg, #2563eb, #1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {/* Rating Badge */}
                  <span style={{
                    position: 'absolute', top: '12px', left: '12px',
                    background: 'white', padding: '6px 12px', borderRadius: '20px',
                    fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b',
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    <Star size={14} fill="#f59e0b" />{c.rating || 'جديد'}
                  </span>
                  
                  {/* Distance Badge */}
                  {c.distance !== undefined && c.distance !== null && (
                    <span style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                      padding: '6px 12px', borderRadius: '20px',
                      fontSize: '0.75rem', fontWeight: 600, color: 'white',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <MapPin size={12} />{t.distance(c.distance)}
                    </span>
                  )}

                  {/* Avatar */}
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.3)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 700, color: 'white',
                    border: '3px solid rgba(255,255,255,0.4)',
                  }}>
                    {c.profession?.charAt(0)}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '2px' }}>
                        {c.name || c.profession}
                      </h3>
                      <span style={{ fontSize: '0.85rem', color: accentColor, fontWeight: 500 }}>
                        {c.profession}
                      </span>
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>
                      {c.price || 0} {t.egp || 'ج.م'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: textSecondary, marginBottom: '12px', lineHeight: 1.5 }}>
                    {c.bio?.slice(0, 60)}...
                  </p>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '0.8rem', color: textSecondary }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} color="#ef4444" />{c.city}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} color="#059669" />{c.completed_jobs || 0} {lang === 'ar' ? 'خدمة' : 'jobs'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/craftsman/${c.id}`}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '10px',
                        background: darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff',
                        color: accentColor, textDecoration: 'none', textAlign: 'center',
                        fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif",
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => { e.target.style.background = accentColor; e.target.style.color = 'white'; }}
                      onMouseLeave={(e) => { e.target.style.background = darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff'; e.target.style.color = accentColor; }}>
                      {t.viewProfile}
                    </Link>
                    <Link to={`/booking/${c.id}`}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                        color: 'white', textDecoration: 'none', textAlign: 'center',
                        fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif",
                        boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                      }}>
                      {t.bookNow}
                    </Link>
                    <button onClick={() => handleLocateCraftsman(c)}
                      style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        border: `1px solid ${borderColor}`, background: 'transparent',
                        cursor: 'pointer', color: '#ef4444', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.3s ease', flexShrink: 0,
                      }}
                      onMouseEnter={(e) => { e.target.style.background = '#ef4444'; e.target.style.color = 'white'; }}
                      onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; }}
                      title={lang === 'ar' ? 'عرض على الخريطة' : 'View on map'}>
                      <MapPin size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in" style={{
            textAlign: 'center', padding: '80px 20px',
            background: cardBg, borderRadius: '18px', border: `1px solid ${borderColor}`,
          }}>
            <Search size={64} style={{ color: textSecondary, opacity: 0.3, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
              {t.noResults}
            </h3>
            <p style={{ color: textSecondary, fontSize: '0.95rem' }}>
              {t.noResultsDesc}
            </p>
          </div>
        )}
      </div>

      {/* Voice Search Modal */}
      {showVoice && (
        <VoiceSearch
          lang={lang}
          onResult={handleVoiceResult}
          onClose={() => setShowVoice(false)}
        />
      )}
    </div>
  );
};

// Helper styles
const selectStyle = (borderColor, textColor, inputBg) => ({
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: `1px solid ${borderColor}`, background: inputBg,
  color: textColor, fontSize: '0.85rem', outline: 'none',
  fontFamily: "'Cairo', sans-serif", textAlign: 'right', cursor: 'pointer',
});

export default SearchResultsPage;