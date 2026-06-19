// src/pages/CraftsmanDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import CraftsmanMap from '../components/Map/CraftsmanMap';
import { 
  MapPin, Star, Clock, Wrench, Phone, MessageCircle,
  CheckCircle, Award, Calendar, ArrowLeft,
  Shield, Briefcase, Users, Heart,
  Share2, Flag, Sparkles, Loader, AlertCircle, Image, Eye
} from 'lucide-react';

const CraftsmanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [craftsman, setCraftsman] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // ✅ جلب بيانات الحرفي من API
  useEffect(() => {
    const loadCraftsman = async () => {
      setLoading(true);
      try {
        // ✅ استخدام api.getCraftsman(id) من api.js
        const data = await api.getCraftsman(id);
        const c = data.craftsman || data;
        setCraftsman(c);
        setReviews(c.reviews || []);
        setPortfolioImages(c.portfolio || []);
      } catch (error) {
        console.warn('⚠️ Using fallback craftsman data:', error);
        // Fallback data
        setCraftsman({
          id: parseInt(id) || 1,
          first_name: 'أحمد', 
          last_name: 'النجار',
          profession: 'نجار', 
          rating: 4.9, 
          hourly_rate: 200,
          city: 'القاهرة', 
          district: 'مدينة نصر',
          phone: '01001234567', 
          completed_jobs: 320,
          bio: 'نجار محترف خبرة 15 سنة في جميع أعمال النجارة',
          skills: ['نجارة', 'صيانة', 'تركيب', 'تصليح'],
          crafts: [{ id: 1, name: 'نجار' }],
          reviews: [],
          portfolio: [],
        });
      }
      setLoading(false);
    };
    loadCraftsman();
  }, [id]);

  const t = {
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
    notFound: lang === 'ar' ? 'الحرفي غير موجود' : 'Craftsman not found',
    about: lang === 'ar' ? 'نبذة عني' : 'About Me',
    reviews: lang === 'ar' ? 'التقييمات' : 'Reviews',
    location: lang === 'ar' ? 'الموقع' : 'Location',
    bookNow: lang === 'ar' ? 'احجز الآن' : 'Book Now',
    contact: lang === 'ar' ? 'اتصل' : 'Call',
    message: lang === 'ar' ? 'راسل' : 'Message',
    completedJobs: lang === 'ar' ? 'خدمة مكتملة' : 'Completed Jobs',
    yearsExp: lang === 'ar' ? 'سنوات الخبرة' : 'Years Exp',
    pricePerHour: lang === 'ar' ? 'للساعة' : 'per hour',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    verified: lang === 'ar' ? 'موثق' : 'Verified',
    share: lang === 'ar' ? 'مشاركة' : 'Share',
    report: lang === 'ar' ? 'إبلاغ' : 'Report',
    save: lang === 'ar' ? 'حفظ' : 'Save',
    saved: lang === 'ar' ? 'تم الحفظ' : 'Saved',
    noReviews: lang === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet',
    noBio: lang === 'ar' ? 'لم يضف نبذة تعريفية بعد' : 'No bio added yet',
    back: lang === 'ar' ? 'العودة' : 'Back',
    portfolio: lang === 'ar' ? 'معرض الأعمال' : 'Portfolio',
    noPortfolio: lang === 'ar' ? 'لا توجد صور في المعرض' : 'No portfolio images',
    tabs: { about: lang === 'ar' ? 'نبذة' : 'About', reviews: lang === 'ar' ? 'تقييمات' : 'Reviews', location: lang === 'ar' ? 'الموقع' : 'Location' },
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: darkMode ? '#0f172a' : '#f8fafc', fontFamily: "'Cairo', sans-serif" }}>
        <Loader size={40} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }
  
  if (!craftsman) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: darkMode ? '#0f172a' : '#f8fafc', fontFamily: "'Cairo', sans-serif", gap: '12px' }}>
        <AlertCircle size={48} style={{ color: '#ef4444' }} />
        <p style={{ color: darkMode ? '#f1f5f9' : '#0f172a', fontSize: '1.2rem' }}>{t.notFound}</p>
        <Link to="/" style={{ padding: '12px 24px', borderRadius: '12px', background: '#3b82f6', color: 'white', textDecoration: 'none', fontFamily: "'Cairo', sans-serif" }}>
          {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </div>
    );
  }

  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const heroBg = darkMode ? 'linear-gradient(160deg, #1e3a8a, #1e40af)' : 'linear-gradient(160deg, #2563eb, #1d4ed8)';
  const price = craftsman?.hourly_rate || craftsman?.price || 150;
  const fullName = craftsman?.first_name ? `${craftsman.first_name} ${craftsman.last_name || ''}` : (craftsman?.name || craftsman?.profession);
  const skills = craftsman?.skills?.length > 0 ? craftsman.skills : [craftsman?.profession, 'صيانة', 'تركيب', 'تصليح'];
  const profession = craftsman?.profession || craftsman?.crafts?.[0]?.name;

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif", direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.15); }
        .tab-active::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 3px; background: #3b82f6; border-radius: 3px 3px 0 0; }
        .portfolio-img { transition: transform 0.4s ease; }
        .portfolio-img:hover { transform: scale(1.08); }
        .animate-spin { animation: spin 1s linear infinite; }
        @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr !important; } .sidebar { position: static !important; } }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 24px 0' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', color: textColor, fontFamily: "'Cairo', sans-serif", fontSize: '0.9rem', fontWeight: 600 }}>
          <ArrowLeft size={18} />{t.back}
        </button>
      </div>

      {/* Hero */}
      <div className="animate-fade-in-up" style={{ background: heroBg, color: 'white', padding: '40px 0', marginTop: '16px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, border: '4px solid rgba(255,255,255,0.3)', flexShrink: 0, position: 'relative' }}>
            {fullName?.charAt(0) || 'ح'}
            <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white' }}>
              <CheckCircle size={14} color="white" />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{fullName}</h1>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                <Star size={14} fill="#fbbf24" color="#fbbf24" />{craftsman?.rating || '4.5'}
              </span>
            </div>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wrench size={16} />{profession}
            </p>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.9rem', opacity: 0.85 }}>
              <span><CheckCircle size={14} /> {craftsman?.completed_jobs || craftsman?.completed_bookings || 0} {t.completedJobs}</span>
              <span><Award size={14} /> {craftsman?.years_exp || 5} {t.yearsExp}</span>
              <span><MapPin size={14} /> {craftsman?.city || 'القاهرة'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setIsFavorite(!isFavorite)} style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isFavorite ? '#ef4444' : 'white' }}>
              <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} />
            </button>
            <button style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: `2px solid ${borderColor}`, overflowX: 'auto' }}>
          {['about', 'reviews', 'location'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'tab-active' : ''} style={{ padding: '12px 24px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 500, fontSize: '0.95rem', color: activeTab === tab ? '#3b82f6' : textSecondary, fontFamily: "'Cairo', sans-serif", whiteSpace: 'nowrap', position: 'relative' }}>
              {tab === 'about' && '📝 '}{tab === 'reviews' && '⭐ '}{tab === 'location' && '📍 '}{t.tabs[tab]}
            </button>
          ))}
        </div>

        <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          <div>
            {activeTab === 'about' && (
              <div className="animate-fade-in-up">
                <div style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={20} style={{ color: '#3b82f6' }} />{t.about}
                  </h2>
                  <p style={{ color: textSecondary, lineHeight: 2, fontSize: '0.95rem' }}>{craftsman?.bio || t.noBio}</p>
                </div>
                <div style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} style={{ color: '#f59e0b' }} />{lang === 'ar' ? 'الخدمات' : 'Services'}
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skills.map((skill, i) => (
                      <span key={i} style={{ padding: '6px 14px', borderRadius: '20px', background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff', color: '#3b82f6', fontSize: '0.85rem', fontWeight: 500, border: '1px solid rgba(59,130,246,0.2)' }}>{skill}</span>
                    ))}
                  </div>
                </div>
                {portfolioImages.length > 0 && (
                  <div style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}` }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Image size={20} style={{ color: '#8b5cf6' }} />{t.portfolio}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                      {portfolioImages.map((img, index) => (
                        <div key={index} className="hover-lift" onClick={() => setSelectedImage(img)} style={{ borderRadius: '12px', overflow: 'hidden', height: '180px', border: `1px solid ${borderColor}`, cursor: 'pointer', position: 'relative' }}>
                          <img src={img.url || img} alt="" className="portfolio-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-fade-in-up" style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}` }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={20} style={{ color: '#f59e0b' }} fill="#f59e0b" />{t.reviews} ({reviews.length})
                </h2>
                {reviews.length > 0 ? reviews.map((r, i) => (
                  <div key={r.id || i} style={{ padding: '16px 0', borderBottom: `1px solid ${borderColor}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: textColor }}>{r.client?.name || r.client_email?.split('@')[0] || (lang === 'ar' ? 'عميل' : 'Customer')}</strong>
                      <span style={{ display: 'flex', gap: '2px' }}>{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} fill={j < (r.rating || 5) ? '#f59e0b' : 'none'} color={j < (r.rating || 5) ? '#f59e0b' : '#cbd5e1'} />)}</span>
                    </div>
                    <p style={{ color: textSecondary, fontSize: '0.9rem', lineHeight: 1.7 }}>"{r.comment}"</p>
                  </div>
                )) : <div style={{ textAlign: 'center', padding: '40px', color: textSecondary }}><Star size={48} style={{ opacity: 0.3, marginBottom: '12px' }} /><p>{t.noReviews}</p></div>}
              </div>
            )}

            {activeTab === 'location' && (
              <div className="animate-fade-in-up">
                <CraftsmanMap craftsman={{ name: fullName, city: craftsman?.city || 'القاهرة', district: craftsman?.district || '', rating: craftsman?.rating || 4.5 }} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="sidebar" style={{ position: 'sticky', top: '84px', alignSelf: 'start' }}>
            <div className="hover-lift" style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: `1px solid ${borderColor}` }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>{price} {t.egp}</div>
                <div style={{ fontSize: '0.85rem', color: textSecondary }}>{t.pricePerHour}</div>
              </div>
              <Link to={`/booking/${craftsman?.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', fontFamily: "'Cairo', sans-serif" }}>
                <Calendar size={20} />{t.bookNow}
              </Link>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                <a href={`tel:${craftsman?.phone || '19555'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', border: `2px solid ${borderColor}`, background: 'transparent', color: textColor, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
                  <Phone size={16} />{t.contact}
                </a>
                <a href={`https://wa.me/${craftsman?.whatsapp || '20'}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', border: `2px solid ${borderColor}`, background: 'transparent', color: textColor, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
                  <MessageCircle size={16} />{t.message}
                </a>
              </div>
            </div>
            <div style={{ background: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: textColor, marginBottom: '16px' }}>{lang === 'ar' ? 'معلومات سريعة' : 'Quick Info'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: textSecondary }}><Shield size={16} style={{ color: '#059669' }} />{t.verified}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: textSecondary }}><Clock size={16} style={{ color: '#3b82f6' }} />{lang === 'ar' ? 'متاح اليوم' : 'Available Today'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: textSecondary }}><Users size={16} style={{ color: '#8b5cf6' }} />{craftsman?.completed_jobs || craftsman?.completed_bookings || 0}+ {t.completedJobs}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: textSecondary }}><MapPin size={16} style={{ color: '#ef4444' }} />{craftsman?.city} {craftsman?.district}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <img src={selectedImage.url || selectedImage} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '12px', objectFit: 'contain' }} />
          <button onClick={() => setSelectedImage(null)} style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: 'white', fontSize: '1.5rem' }}>✕</button>
        </div>
      )}
    </div>
  );
};

export default CraftsmanDetailPage;