// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import VoiceSearch from '../components/Search/VoiceSearch';
import { 
  Search, MapPin, Star, Filter, Grid, Map,
  Mic, X, ChevronDown, RotateCw, CheckCircle, Loader
} from 'lucide-react';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');

  const [query, setQuery] = useState(initialQuery);
  const [filterLocation, setFilterLocation] = useState(searchParams.get('location') || '');
  const [filterRating, setFilterRating] = useState('');
  const [filterJob, setFilterJob] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [craftsmen, setCraftsmen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showVoice, setShowVoice] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [meta, setMeta] = useState({});

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // ✅ جلب البيانات من API
  const loadCraftsmen = useCallback(async (searchQuery = query) => {
    setLoading(true);
    setRefreshing(false);
    try {
      // ✅ استخدم getCraftsmen من api.js مع جميع المعاملات
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (filterLocation.trim()) params.city = filterLocation.trim();
      if (filterJob) params.craft_id = filterJob;
      if (sortBy) params.sort_by = sortBy;
      
      const data = await api.getCraftsmen(params);
      setCraftsmen(data.craftsmen || []);
      setMeta(data.meta || {});
    } catch (error) {
      console.warn('⚠️ Using fallback data:', error);
      // Fallback demo data
      setCraftsmen([
        { id: 1, profession: 'سباك', first_name: 'محمد', last_name: 'السباك', rating: 4.8, hourly_rate: 150, city: 'القاهرة', district: 'مدينة نصر', completed_jobs: 320, bio: 'سباك محترف خبرة 15 سنة' },
        { id: 2, profession: 'كهربائي', first_name: 'أحمد', last_name: 'الكهربائي', rating: 4.6, hourly_rate: 180, city: 'الجيزة', district: 'الدقي', completed_jobs: 280, bio: 'فني كهرباء معتمد' },
        { id: 3, profession: 'نجار', first_name: 'محمود', last_name: 'النجار', rating: 4.9, hourly_rate: 200, city: 'القاهرة', district: 'المعادي', completed_jobs: 450, bio: 'نجار موبيليا وديكورات' },
        { id: 4, profession: 'نقاش', first_name: 'كريم', last_name: 'الدهان', rating: 4.5, hourly_rate: 130, city: 'الإسكندرية', district: 'سموحة', completed_jobs: 190, bio: 'دهانات وديكورات حديثة' },
        { id: 5, profession: 'فني تكييف', first_name: 'حسن', last_name: 'التكييف', rating: 4.7, hourly_rate: 250, city: 'القاهرة', district: 'الزمالك', completed_jobs: 210, bio: 'صيانة وتركيب تكييفات' },
        { id: 6, profession: 'بناء', first_name: 'عماد', last_name: 'البناء', rating: 4.8, hourly_rate: 300, city: 'القاهرة', district: 'التجمع', completed_jobs: 380, bio: 'مقاول بناء وتشطيبات' },
      ]);
    }
    setLoading(false);
    setRefreshing(false);
  }, [query, filterLocation, filterJob, sortBy]);

  // ✅ تحميل البيانات عند تغيير المعاملات
  useEffect(() => {
    loadCraftsmen(initialQuery);
  }, [initialQuery, loadCraftsmen]);

  // Filter and sort
  const filtered = useMemo(() => {
    let results = [...craftsmen];
    if (filterRating) results = results.filter(c => c.rating >= parseFloat(filterRating));
    if (sortBy === 'price_asc') results.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
    if (sortBy === 'price_desc') results.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0));
    return results;
  }, [craftsmen, filterRating, sortBy]);

  const handleVoiceResult = (text) => {
    setQuery(text);
    setShowVoice(false);
    loadCraftsmen(text);
    navigate(`/search?q=${encodeURIComponent(text)}`);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCraftsmen();
  };

  // Translations
  const t = {
    searchResults: lang === 'ar' ? 'نتائج البحث' : 'Search Results',
    search: lang === 'ar' ? 'ابحث عن حرفي...' : 'Search...',
    found: (count) => lang === 'ar' ? `تم العثور على ${count} حرفي` : `Found ${count} craftsmen`,
    noResults: lang === 'ar' ? 'لا توجد نتائج' : 'No results',
    viewProfile: lang === 'ar' ? 'عرض الملف' : 'View Profile',
    bookNow: lang === 'ar' ? 'احجز الآن' : 'Book Now',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    highestRated: lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated',
    lowestPrice: lang === 'ar' ? 'الأقل سعراً' : 'Lowest Price',
    highestPrice: lang === 'ar' ? 'الأعلى سعراً' : 'Highest Price',
    gridView: lang === 'ar' ? 'شبكة' : 'Grid',
    mapView: lang === 'ar' ? 'خريطة' : 'Map',
    filters: lang === 'ar' ? 'تصفية' : 'Filters',
    refresh: lang === 'ar' ? 'تحديث' : 'Refresh',
  };

  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif", direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .skeleton { background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @media (max-width: 768px) { .search-header { flex-direction: column; } }
      `}</style>

      {/* Header */}
      <div style={{
        background: darkMode ? 'linear-gradient(160deg, #1e3a8a, #1e40af)' : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
        color: 'white', padding: '32px 0',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{t.searchResults}</h1>
              <p style={{ fontSize: '0.85rem', opacity: 0.85 }}>{t.found(filtered.length)}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="animate-fade-in-up delay-100" style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'white', borderRadius: '16px', padding: '4px' }}>
              <Search size={20} style={{ color: '#94a3b8', margin: lang === 'ar' ? '0 12px 0 0' : '0 0 0 12px' }} />
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && loadCraftsmen()} 
                placeholder={t.search}
                style={{ 
                  flex: 1, padding: '14px 8px', border: 'none', fontSize: '1rem', 
                  outline: 'none', color: '#0f172a', fontFamily: "'Cairo', sans-serif", 
                  textAlign: lang === 'ar' ? 'right' : 'left', background: 'transparent' 
                }} 
              />
              {query && <button onClick={() => { setQuery(''); loadCraftsmen(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#94a3b8' }}><X size={18} /></button>}
              <button onClick={() => setShowVoice(true)} style={{ padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px' }}>
                <Mic size={18} />
              </button>
            </div>
            <button onClick={() => loadCraftsmen()} style={{ padding: '14px 24px', borderRadius: '14px', border: 'none', cursor: 'pointer', background: 'white', color: '#2563eb', fontWeight: 700, fontSize: '0.95rem', fontFamily: "'Cairo', sans-serif" }}>
              {lang === 'ar' ? 'بحث' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        
        {/* Toolbar */}
        <div className="animate-fade-in-up delay-200" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', color: textColor, fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
              <Filter size={16} />{t.filters}
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '10px 14px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', color: textColor, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif" }}>
              <option value="rating">{t.highestRated}</option>
              <option value="price_asc">{t.lowestPrice}</option>
              <option value="price_desc">{t.highestPrice}</option>
            </select>
            <button onClick={handleRefresh} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${borderColor}`, cursor: 'pointer', color: textColor, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif" }}>
              <RotateCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: darkMode ? '#0f172a' : '#f1f5f9', borderRadius: '12px', padding: '4px' }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", background: viewMode === 'grid' ? '#3b82f6' : 'transparent', color: viewMode === 'grid' ? 'white' : textColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Grid size={16} />{t.gridView}
            </button>
            <button onClick={() => setViewMode('map')} style={{ padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", background: viewMode === 'map' ? '#3b82f6' : 'transparent', color: viewMode === 'map' ? 'white' : textColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Map size={16} />{t.mapView}
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div style={{ background: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${borderColor}`, marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif" }}>
              <option value="">{lang === 'ar' ? 'التقييم' : 'Rating'}</option>
              <option value="4.5">4.5+ ⭐</option>
              <option value="4">4+ ⭐</option>
              <option value="3">3+ ⭐</option>
            </select>
            <input type="text" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} placeholder={lang === 'ar' ? 'المدينة' : 'City'} style={{ padding: '10px 14px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", textAlign: 'right' }} />
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" style={{ borderRadius: '18px', height: '320px' }} />)}
          </div>
        ) : viewMode === 'map' ? (
          <div style={{ background: cardBg, borderRadius: '18px', border: `1px solid ${borderColor}`, overflow: 'hidden', minHeight: '400px' }}>
            <div style={{ padding: '16px' }}>
              <h3 style={{ fontWeight: 700, color: textColor }}><MapPin size={16} style={{ display: 'inline', marginRight: '6px', color: '#ef4444' }} />{t.mapView}</h3>
            </div>
            <iframe title="Map" width="100%" height="400" style={{ border: 'none', filter: darkMode ? 'invert(0.9) hue-rotate(180deg)' : 'none' }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(filterLocation || 'القاهرة')}&t=&z=13&ie=UTF8&iwloc=&output=embed`} />
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filtered.map((c, index) => (
              <div key={c.id} className="hover-lift animate-fade-in-up" style={{ background: cardBg, borderRadius: '18px', overflow: 'hidden', border: `1px solid ${borderColor}`, animationDelay: `${index * 0.08}s` }}>
                <div style={{ height: '120px', background: 'linear-gradient(160deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="#f59e0b" />{c.rating || 'جديد'}
                  </span>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', border: '3px solid rgba(255,255,255,0.4)' }}>
                    {c.first_name?.charAt(0) || c.profession?.charAt(0) || 'ح'}
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h3 style={{ fontWeight: 700, color: textColor, fontSize: '1rem' }}>{c.first_name} {c.last_name}</h3>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{c.hourly_rate || 0} {t.egp}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 500, marginBottom: '8px' }}>{c.profession || c.craft?.name}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <Link to={`/craftsman/${c.id}`} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff', color: '#3b82f6', textDecoration: 'none', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif" }}>{t.viewProfile}</Link>
                    <Link to={`/booking/${c.id}`} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#2563eb', color: 'white', textDecoration: 'none', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif" }}>{t.bookNow}</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: cardBg, borderRadius: '18px', border: `1px solid ${borderColor}` }}>
            <Search size={64} style={{ color: textSecondary, opacity: 0.3, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: textColor }}>{t.noResults}</h3>
          </div>
        )}
      </div>

      {showVoice && <VoiceSearch lang={lang} onResult={handleVoiceResult} onClose={() => setShowVoice(false)} />}
    </div>
  );
};

export default SearchResultsPage;