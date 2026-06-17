import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import VoiceSearch from '../components/Search/VoiceSearch';
import { 
  Search, MapPin, Star, Clock, Wrench, Sparkles,
  User, ChevronRight, ArrowRight, Bell, Calendar,
  FileText, Send, Mic, Zap, Shield, TrendingUp,
  Award, Heart, Users, Grid, List, Filter, X,
  Loader, AlertCircle, CheckCircle, ThumbsUp,
  DollarSign, Briefcase, Home, Navigation
} from 'lucide-react';

const CustomerHomePage = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [lang, setLang] = useState('ar');
  const [searchTerm, setSearchTerm] = useState('');
  const [craftsmen, setCraftsmen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVoice, setShowVoice] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [stats, setStats] = useState({ total: 0, avgRating: 0, totalJobs: 0 });
  const [recentRequests, setRecentRequests] = useState([]);

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
    loadRecentRequests();
  }, []);

  const loadCraftsmen = async () => {
    setLoading(true);
    try {
      const data = await api.getCraftsmen();
      const list = data.craftsmen || data || [];
      setCraftsmen(list);
      setStats({
        total: list.length,
        avgRating: list.length > 0 ? (list.reduce((s, c) => s + (c.rating || 0), 0) / list.length).toFixed(1) : 0,
        totalJobs: list.reduce((s, c) => s + (c.completed_jobs || 0), 0),
      });
    } catch {
      // Demo data
      const demos = [
        { id: 1, profession: 'سباك', name: 'محمد السباك', rating: 4.8, price: 150, city: 'القاهرة', district: 'مدينة نصر', completed_jobs: 320, avatar: null },
        { id: 2, profession: 'كهربائي', name: 'أحمد الكهربائي', rating: 4.6, price: 180, city: 'الجيزة', district: 'الدقي', completed_jobs: 280, avatar: null },
        { id: 3, profession: 'نجار', name: 'محمود النجار', rating: 4.9, price: 200, city: 'القاهرة', district: 'المعادي', completed_jobs: 450, avatar: null },
        { id: 4, profession: 'نقاش', name: 'كريم الدهان', rating: 4.5, price: 130, city: 'الإسكندرية', district: 'سموحة', completed_jobs: 190, avatar: null },
        { id: 5, profession: 'فني تكييف', name: 'حسن التكييف', rating: 4.7, price: 250, city: 'القاهرة', district: 'الزمالك', completed_jobs: 210, avatar: null },
        { id: 6, profession: 'سباك', name: 'سامح السباك', rating: 4.3, price: 120, city: 'القاهرة', district: 'شبرا', completed_jobs: 150, avatar: null },
        { id: 7, profession: 'بناء', name: 'عماد البناء', rating: 4.8, price: 300, city: 'القاهرة', district: 'التجمع', completed_jobs: 380, avatar: null },
        { id: 8, profession: 'كهربائي', name: 'طارق الفني', rating: 4.4, price: 160, city: 'الجيزة', district: 'فيصل', completed_jobs: 200, avatar: null },
      ];
      setCraftsmen(demos);
      setStats({
        total: demos.length,
        avgRating: (demos.reduce((s, c) => s + c.rating, 0) / demos.length).toFixed(1),
        totalJobs: demos.reduce((s, c) => s + c.completed_jobs, 0),
      });
    }
    setLoading(false);
  };

  const loadRecentRequests = () => {
    try {
      const requests = JSON.parse(localStorage.getItem('requests') || '[]');
      const myRequests = requests.filter(r => r.customer_email === user?.email).slice(0, 3);
      setRecentRequests(myRequests);
    } catch {}
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
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

  // Categories
  const categories = [
    { id: 'all', name: lang === 'ar' ? 'الكل' : 'All', icon: '🏠' },
    { id: 'سباك', name: lang === 'ar' ? 'سباكة' : 'Plumbing', icon: '🔧' },
    { id: 'كهربائي', name: lang === 'ar' ? 'كهرباء' : 'Electrical', icon: '⚡' },
    { id: 'نجار', name: lang === 'ar' ? 'نجارة' : 'Carpentry', icon: '🪚' },
    { id: 'نقاش', name: lang === 'ar' ? 'دهان' : 'Painting', icon: '🎨' },
    { id: 'فني تكييف', name: lang === 'ar' ? 'تكييف' : 'AC', icon: '❄️' },
    { id: 'بناء', name: lang === 'ar' ? 'بناء' : 'Construction', icon: '🏗️' },
  ];

  const filteredCraftsmen = activeCategory === 'all' 
    ? craftsmen 
    : craftsmen.filter(c => c.profession === activeCategory);

  // Translations
  const t = {
    welcome: lang === 'ar' ? 'مرحباً' : 'Welcome',
    howCanWeHelp: lang === 'ar' ? 'كيف نقدر نساعدك النهاردة؟' : 'How can we help you today?',
    search: lang === 'ar' ? 'ابحث عن حرفي، خدمة، أو تخصص...' : 'Search for a craftsman, service, or specialty...',
    searchButton: lang === 'ar' ? 'بحث' : 'Search',
    voiceSearch: lang === 'ar' ? 'بحث صوتي' : 'Voice Search',
    sendRequest: lang === 'ar' ? 'اطلب خدمة' : 'Request Service',
    browseCraftsmen: lang === 'ar' ? 'تصفح الحرفيين' : 'Browse Craftsmen',
    featuredCraftsmen: lang === 'ar' ? 'حرفيون مميزون' : 'Featured Craftsmen',
    viewProfile: lang === 'ar' ? 'عرض الملف' : 'View Profile',
    bookNow: lang === 'ar' ? 'احجز' : 'Book',
    noResults: lang === 'ar' ? 'لا يوجد حرفيين' : 'No craftsmen found',
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
    stats: {
      craftsmen: lang === 'ar' ? 'حرفي' : 'Craftsmen',
      rating: lang === 'ar' ? 'التقييم' : 'Rating',
      jobs: lang === 'ar' ? 'خدمة مكتملة' : 'Completed Jobs',
    },
    recentRequests: lang === 'ar' ? 'طلباتك الأخيرة' : 'Your Recent Requests',
    noRequests: lang === 'ar' ? 'لا توجد طلبات سابقة' : 'No previous requests',
    viewAll: lang === 'ar' ? 'عرض الكل' : 'View All',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    pending: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
    completed: lang === 'ar' ? 'مكتمل' : 'Completed',
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
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
        
        .category-btn { transition: all 0.3s ease; }
        .category-btn:hover { transform: translateY(-2px); }
        
        .skeleton {
          background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @media (max-width: 768px) {
          .hero-title { font-size: 1.5rem !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .craftsmen-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; }
        }
      `}</style>

      {/* Hero Section */}
      <div style={{
        background: darkMode 
          ? 'linear-gradient(160deg, #1e3a8a, #1e40af)'
          : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
        color: 'white', padding: '48px 0', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 700,
            }}>
              {user?.name?.[0] || 'ع'}
            </div>
            <div>
              <h1 className="hero-title" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
                {t.welcome}، {user?.name?.split(' ')[0]}
              </h1>
              <p style={{ fontSize: '1rem', opacity: 0.9, margin: '4px 0 0' }}>{t.howCanWeHelp}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="animate-fade-in-up delay-100" style={{ display: 'flex', gap: '10px', maxWidth: '700px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'white', borderRadius: '16px', padding: '4px', boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}>
              <Search size={20} style={{ color: '#94a3b8', marginLeft: '10px' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t.search}
                style={{
                  flex: 1, padding: '14px 8px', border: 'none',
                  fontSize: '0.95rem', outline: 'none', color: '#0f172a',
                  fontFamily: "'Cairo', sans-serif", textAlign: 'right',
                  background: 'transparent',
                }}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')}
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
                title={t.voiceSearch}
                onMouseEnter={(e) => { e.target.style.background = '#3b82f6'; e.target.style.color = 'white'; }}
                onMouseLeave={(e) => { e.target.style.background = '#eff6ff'; e.target.style.color = '#3b82f6'; }}
              >
                <Mic size={18} />
              </button>
            </div>
            <button onClick={handleSearch}
              style={{
                padding: '14px 24px', borderRadius: '14px', border: 'none',
                cursor: 'pointer', background: '#f59e0b', color: 'white',
                fontWeight: 700, fontSize: '0.95rem', fontFamily: "'Cairo', sans-serif",
                transition: 'all 0.3s ease', whiteSpace: 'nowrap',
                boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
              }}>
              {t.searchButton}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="animate-fade-in-up delay-200" style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <Link to="/request-service"
              style={{
                padding: '12px 24px', borderRadius: '12px', fontWeight: 600,
                background: 'white', color: '#2563eb', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
              <FileText size={18} />{t.sendRequest}
            </Link>
            <Link to="/search"
              style={{
                padding: '12px 24px', borderRadius: '12px', fontWeight: 600,
                background: 'rgba(255,255,255,0.2)', color: 'white',
                border: '2px solid rgba(255,255,255,0.3)', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.3s ease', backdropFilter: 'blur(10px)',
              }}>
              <Search size={18} />{t.browseCraftsmen}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Mini Cards */}
      <div className="animate-fade-in-up delay-300" style={{ maxWidth: '1200px', margin: '-24px auto 0', padding: '0 24px', position: 'relative', zIndex: 2 }}>
        <div className="stats-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
        }}>
          {[
            { value: `+${stats.total}`, label: t.stats.craftsmen, icon: <Users size={20} />, color: '#3b82f6', bg: darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff' },
            { value: stats.avgRating, label: t.stats.rating, icon: <Star size={20} />, color: '#f59e0b', bg: darkMode ? 'rgba(245,158,11,0.15)' : '#fef3c7' },
            { value: `+${stats.totalJobs}`, label: t.stats.jobs, icon: <CheckCircle size={20} />, color: '#059669', bg: darkMode ? 'rgba(5,150,105,0.15)' : '#d1fae5' },
          ].map((stat, i) => (
            <div key={i} className="hover-lift" style={{
              background: cardBg, borderRadius: '14px', padding: '16px',
              border: `1px solid ${borderColor}`, textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}>
              <div style={{ color: stat.color, marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: textColor }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: textSecondary }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Recent Requests */}
        {recentRequests.length > 0 && (
          <div className="animate-fade-in-up" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} style={{ color: '#3b82f6' }} />
                {t.recentRequests}
              </h2>
              <Link to="/notifications" style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
                {t.viewAll} <ChevronRight size={14} style={{ display: 'inline' }} />
              </Link>
            </div>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {recentRequests.map((req, i) => (
                <div key={i} style={{
                  background: cardBg, borderRadius: '14px', padding: '16px',
                  border: `1px solid ${borderColor}`, minWidth: '250px', flexShrink: 0,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, color: textColor, fontSize: '0.9rem' }}>{req.service_type}</span>
                    <span style={{
                      padding: '2px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600,
                      background: req.status === 'pending' ? '#fef3c7' : '#d1fae5',
                      color: req.status === 'pending' ? '#d97706' : '#059669',
                    }}>
                      {req.status === 'pending' ? t.pending : t.completed}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: textSecondary }}>
                    {req.budget && <span>{req.budget} {t.egp}</span>}
                    {req.date && <span> • {req.date}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="animate-fade-in-up" style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '16px' }}>
            {lang === 'ar' ? 'التخصصات' : 'Specialties'}
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className="category-btn"
                style={{
                  padding: '10px 18px', borderRadius: '50px', border: activeCategory === cat.id ? '2px solid #3b82f6' : `2px solid ${borderColor}`,
                  background: activeCategory === cat.id ? (darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff') : 'transparent',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  color: activeCategory === cat.id ? '#3b82f6' : textColor,
                  fontFamily: "'Cairo', sans-serif", transition: 'all 0.3s ease',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Craftsmen Grid */}
        <div className="animate-fade-in-up delay-100">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} style={{ color: '#f59e0b' }} />
              {t.featuredCraftsmen}
              <span style={{ fontSize: '0.8rem', color: textSecondary, fontWeight: 400 }}>
                ({filteredCraftsmen.length})
              </span>
            </h2>
            <Link to="/search" style={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
              {t.viewAll} <ChevronRight size={14} style={{ display: 'inline' }} />
            </Link>
          </div>

          {loading ? (
            <div className="craftsmen-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="skeleton" style={{ borderRadius: '16px', height: '240px' }} />
              ))}
            </div>
          ) : filteredCraftsmen.length > 0 ? (
            <div className="craftsmen-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px',
            }}>
              {filteredCraftsmen.map((c, index) => (
                <div key={c.id}
                  className="hover-lift animate-fade-in-up"
                  style={{
                    background: cardBg, borderRadius: '16px', overflow: 'hidden',
                    border: `1px solid ${borderColor}`, cursor: 'pointer',
                    animationDelay: `${index * 0.06}s`,
                  }}
                  onClick={() => navigate(`/craftsman/${c.id}`)}
                >
                  {/* Card Header */}
                  <div style={{
                    height: '100px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.3)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', fontWeight: 700, color: 'white',
                      border: '3px solid rgba(255,255,255,0.4)',
                    }}>
                      {c.profession?.charAt(0)}
                    </div>
                    <span style={{
                      position: 'absolute', top: '10px', right: '10px',
                      background: 'rgba(255,255,255,0.2)', padding: '4px 10px',
                      borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                      color: 'white', backdropFilter: 'blur(4px)',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                      {c.rating || 'جديد'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontWeight: 700, color: textColor, fontSize: '1rem', marginBottom: '4px' }}>
                      {c.name || c.profession}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 500, marginBottom: '8px' }}>
                      {c.profession}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669' }}>
                        {c.price || 0} {t.egp}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: textSecondary }}>
                        {c.city || ''}
                      </span>
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

export default CustomerHomePage;