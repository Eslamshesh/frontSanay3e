// src/pages/CustomerHomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import VoiceSearch from '../components/Search/VoiceSearch';
import { 
  Search, Star, Clock, Sparkles, User, ChevronRight,
  FileText, Mic, Award, Users, CheckCircle, X, Loader
} from 'lucide-react';

const CustomerHomePage = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [lang, setLang] = useState('ar');
  const [searchTerm, setSearchTerm] = useState('');
  const [craftsmen, setCraftsmen] = useState([]);
  const [featuredCraftsmen, setFeaturedCraftsmen] = useState([]);
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVoice, setShowVoice] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [stats, setStats] = useState({ total: 0, avgRating: 0, totalJobs: 0 });
  const [recentBookings, setRecentBookings] = useState([]);

  // ✅ Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // ✅ جلب البيانات من API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. جلب المهن
      const craftsData = await api.getCrafts();
      setCrafts(craftsData.crafts || []);
      
      // 2. جلب الحرفيين المميزين
      const featuredData = await api.getFeaturedCraftsmen();
      setFeaturedCraftsmen(featuredData.craftsmen || []);
      
      // 3. جلب جميع الحرفيين (للإحصائيات)
      const craftsmenData = await api.getCraftsmen({ per_page: 100 });
      const list = craftsmenData.craftsmen || [];
      setCraftsmen(list);
      setStats({
        total: craftsmenData.meta?.total || list.length,
        avgRating: list.length > 0 
          ? (list.reduce((s, c) => s + (c.rating || 0), 0) / list.length).toFixed(1) 
          : 0,
        totalJobs: list.reduce((s, c) => s + (c.completed_bookings || c.completed_jobs || 0), 0),
      });
      
      // 4. جلب حجوزات العميل الأخيرة
      try {
        const bookingsData = await api.getMyBookings('past');
        setRecentBookings(bookingsData.bookings?.data?.slice(0, 3) || []);
      } catch {
        // تجاهل خطأ الحجوزات
      }
      
    } catch (error) {
      console.error('Error loading customer data:', error);
      // ✅ Fallback data
      const demos = [
        { id: 1, profession: 'سباك', first_name: 'محمد', last_name: 'السباك', rating: 4.8, hourly_rate: 150, city: 'القاهرة', district: 'مدينة نصر', completed_jobs: 320 },
        { id: 2, profession: 'كهربائي', first_name: 'أحمد', last_name: 'الكهربائي', rating: 4.6, hourly_rate: 180, city: 'الجيزة', district: 'الدقي', completed_jobs: 280 },
        { id: 3, profession: 'نجار', first_name: 'محمود', last_name: 'النجار', rating: 4.9, hourly_rate: 200, city: 'القاهرة', district: 'المعادي', completed_jobs: 450 },
        { id: 4, profession: 'نقاش', first_name: 'كريم', last_name: 'الدهان', rating: 4.5, hourly_rate: 130, city: 'الإسكندرية', district: 'سموحة', completed_jobs: 190 },
        { id: 5, profession: 'فني تكييف', first_name: 'حسن', last_name: 'التكييف', rating: 4.7, hourly_rate: 250, city: 'القاهرة', district: 'الزمالك', completed_jobs: 210 },
        { id: 6, profession: 'سباك', first_name: 'سامح', last_name: 'السباك', rating: 4.3, hourly_rate: 120, city: 'القاهرة', district: 'شبرا', completed_jobs: 150 },
        { id: 7, profession: 'بناء', first_name: 'عماد', last_name: 'البناء', rating: 4.8, hourly_rate: 300, city: 'القاهرة', district: 'التجمع', completed_jobs: 380 },
        { id: 8, profession: 'كهربائي', first_name: 'طارق', last_name: 'الفني', rating: 4.4, hourly_rate: 160, city: 'الجيزة', district: 'فيصل', completed_jobs: 200 },
      ];
      setFeaturedCraftsmen(demos);
      setCraftsmen(demos);
      setStats({ 
        total: demos.length, 
        avgRating: (demos.reduce((s, c) => s + c.rating, 0) / demos.length).toFixed(1), 
        totalJobs: demos.reduce((s, c) => s + c.completed_jobs, 0) 
      });
    }
    
    setLoading(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // ✅ توجيه صحيح مع encodeURIComponent
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleVoiceResult = (text) => {
    setSearchTerm(text);
    setShowVoice(false);
    if (text.trim()) {
      navigate(`/search?q=${encodeURIComponent(text.trim())}`);
    }
  };

  // ✅ فئات من API
  const categories = [
    { id: 'all', name: lang === 'ar' ? 'الكل' : 'All', icon: '🏠' },
    ...crafts.map(craft => ({
      id: craft.id || craft.name,
      name: lang === 'ar' ? craft.name : (craft.name_en || craft.name),
      icon: craft.icon || '🔧',
    }))
  ];

  // ✅ استخدام featuredCraftsmen للعرض
  const filteredCraftsmen = activeCategory === 'all' 
    ? featuredCraftsmen 
    : featuredCraftsmen.filter(c => 
        c.craft?.name === activeCategory || 
        c.profession === activeCategory ||
        c.crafts?.some(craft => craft.name === activeCategory || craft.name_en === activeCategory)
      );

  // ✅ تنسيق حالة الحجز
  const getStatusColor = (status) => {
    const colors = {
      pending: '#fef3c7',
      confirmed: '#dbeafe',
      in_progress: '#f3e8ff',
      completed: '#d1fae5',
      cancelled: '#fee2e2',
      rejected: '#fee2e2',
    };
    return colors[status] || colors.pending;
  };

  const getStatusTextColor = (status) => {
    const colors = {
      pending: '#d97706',
      confirmed: '#2563eb',
      in_progress: '#7c3aed',
      completed: '#059669',
      cancelled: '#dc2626',
      rejected: '#dc2626',
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const map = {
      pending: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
      confirmed: lang === 'ar' ? 'مؤكد' : 'Confirmed',
      in_progress: lang === 'ar' ? 'قيد التنفيذ' : 'In Progress',
      completed: lang === 'ar' ? 'مكتمل' : 'Completed',
      cancelled: lang === 'ar' ? 'ملغي' : 'Cancelled',
      rejected: lang === 'ar' ? 'مرفوض' : 'Rejected',
    };
    return map[status] || status;
  };

  // Translations
  const t = {
    welcome: lang === 'ar' ? 'مرحباً' : 'Welcome',
    howCanWeHelp: lang === 'ar' ? 'كيف نقدر نساعدك النهاردة؟' : 'How can we help you today?',
    search: lang === 'ar' ? 'ابحث عن حرفي...' : 'Search for a craftsman...',
    searchButton: lang === 'ar' ? 'بحث' : 'Search',
    voiceSearch: lang === 'ar' ? 'بحث صوتي' : 'Voice Search',
    sendRequest: lang === 'ar' ? 'اطلب خدمة' : 'Request Service',
    browseCraftsmen: lang === 'ar' ? 'تصفح الحرفيين' : 'Browse Craftsmen',
    featuredCraftsmen: lang === 'ar' ? 'حرفيون مميزون' : 'Featured Craftsmen',
    noResults: lang === 'ar' ? 'لا يوجد حرفيين' : 'No craftsmen found',
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
    recentRequests: lang === 'ar' ? 'حجوزاتك الأخيرة' : 'Your Recent Bookings',
    viewAll: lang === 'ar' ? 'عرض الكل' : 'View All',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    pending: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
    completed: lang === 'ar' ? 'مكتمل' : 'Completed',
    specialties: lang === 'ar' ? 'التخصصات' : 'Specialties',
  };

  // Dynamic colors
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
        .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; } .delay-300 { animation-delay: 0.3s; }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .skeleton { background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      {/* Hero Section */}
      <div style={{
        background: darkMode ? 'linear-gradient(160deg, #1e3a8a, #1e40af)' : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
        color: 'white', padding: '48px 0', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
              {user?.name?.[0] || 'ع'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{t.welcome}، {user?.name?.split(' ')[0]}</h1>
              <p style={{ fontSize: '1rem', opacity: 0.9, margin: '4px 0 0' }}>{t.howCanWeHelp}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="animate-fade-in-up delay-100" style={{ display: 'flex', gap: '10px', maxWidth: '700px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'white', borderRadius: '16px', padding: '4px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
              <Search size={20} style={{ color: '#94a3b8', margin: lang === 'ar' ? '0 10px 0 0' : '0 0 0 10px' }} />
              <input 
                type="text" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
                placeholder={t.search}
                style={{ 
                  flex: 1, padding: '14px 8px', border: 'none', fontSize: '0.95rem', 
                  outline: 'none', color: '#0f172a', fontFamily: "'Cairo', sans-serif", 
                  textAlign: lang === 'ar' ? 'right' : 'left', background: 'transparent' 
                }} 
              />
              {searchTerm && <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#94a3b8' }}><X size={18} /></button>}
              <button onClick={() => setShowVoice(true)} style={{ padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2px' }}>
                <Mic size={18} />
              </button>
            </div>
            <button onClick={handleSearch} style={{ padding: '14px 24px', borderRadius: '14px', border: 'none', cursor: 'pointer', background: '#f59e0b', color: 'white', fontWeight: 700, fontSize: '0.95rem', fontFamily: "'Cairo', sans-serif", whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}>
              {t.searchButton}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="animate-fade-in-up delay-200" style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <Link to="/request-service" style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 600, background: 'white', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <FileText size={18} />{t.sendRequest}
            </Link>
            <Link to="/search" style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 600, background: 'rgba(255,255,255,0.2)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} />{t.browseCraftsmen}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Mini Cards */}
      <div className="animate-fade-in-up delay-300" style={{ maxWidth: '1200px', margin: '-24px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          {[
            { value: `+${stats.total}`, label: lang === 'ar' ? 'حرفي' : 'Craftsmen', icon: <Users size={20} />, color: '#3b82f6' },
            { value: stats.avgRating || 0, label: lang === 'ar' ? 'التقييم' : 'Rating', icon: <Star size={20} />, color: '#f59e0b' },
            { value: `+${stats.totalJobs}`, label: lang === 'ar' ? 'خدمة' : 'Jobs', icon: <CheckCircle size={20} />, color: '#059669' },
          ].map((stat, i) => (
            <div key={i} className="hover-lift" style={{ background: cardBg, borderRadius: '14px', padding: '16px', border: `1px solid ${borderColor}`, textAlign: 'center' }}>
              <div style={{ color: stat.color, marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: textColor }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: textSecondary }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} style={{ color: '#3b82f6' }} />{t.recentRequests}
            </h2>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
              {recentBookings.map((req, i) => (
                <div key={i} style={{ background: cardBg, borderRadius: '14px', padding: '16px', border: `1px solid ${borderColor}`, minWidth: '250px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, color: textColor, fontSize: '0.9rem' }}>
                      {req.craftsman?.first_name} {req.craftsman?.last_name || req.service?.title || req.service_title || 'خدمة'}
                    </span>
                    <span style={{ 
                      padding: '2px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, 
                      background: getStatusColor(req.status), 
                      color: getStatusTextColor(req.status) 
                    }}>
                      {getStatusText(req.status)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: textSecondary }}>
                    {req.total_price && <span>{req.total_price} {t.egp}</span>}
                    {req.booking_date && <span> • {req.booking_date}</span>}
                    {req.booking_time && <span> • {req.booking_time}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '16px' }}>{t.specialties}</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)} 
                style={{ 
                  padding: '10px 18px', borderRadius: '50px', 
                  border: activeCategory === cat.id ? '2px solid #3b82f6' : `2px solid ${borderColor}`, 
                  background: activeCategory === cat.id ? (darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff') : 'transparent', 
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', 
                  color: activeCategory === cat.id ? '#3b82f6' : textColor, 
                  fontFamily: "'Cairo', sans-serif" 
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Craftsmen Grid */}
        <div className="animate-fade-in-up delay-100">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} style={{ color: '#f59e0b' }} />{t.featuredCraftsmen}
          </h2>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ borderRadius: '16px', height: '240px' }} />)}
            </div>
          ) : filteredCraftsmen.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {filteredCraftsmen.slice(0, 8).map((c, index) => (
                <div 
                  key={c.id} 
                  className="hover-lift animate-fade-in-up" 
                  style={{ 
                    background: cardBg, borderRadius: '16px', overflow: 'hidden', 
                    border: `1px solid ${borderColor}`, cursor: 'pointer', 
                    animationDelay: `${index * 0.06}s` 
                  }} 
                  onClick={() => navigate(`/craftsman/${c.id}`)}
                >
                  <div style={{ height: '100px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'white', border: '3px solid rgba(255,255,255,0.4)' }}>
                      {c.first_name?.charAt(0) || c.name?.charAt(0) || c.profession?.charAt(0) || 'ح'}
                    </div>
                    {c.rating && (
                      <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={12} fill="#fbbf24" color="#fbbf24" />{c.rating}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontWeight: 700, color: textColor, fontSize: '1rem', marginBottom: '4px' }}>
                      {c.first_name} {c.last_name || ''}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 500, marginBottom: '8px' }}>
                      {c.crafts?.map(craft => lang === 'ar' ? craft.name : (craft.name_en || craft.name)).join(' | ') || c.profession}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669' }}>
                        {c.hourly_rate || c.price || 0} {t.egp}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: textSecondary }}>{c.city || ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: textSecondary }}>
              <Search size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p>{t.noResults}</p>
            </div>
          )}
        </div>
      </div>

      {showVoice && <VoiceSearch lang={lang} onResult={handleVoiceResult} onClose={() => setShowVoice(false)} />}
    </div>
  );
};

export default CustomerHomePage;