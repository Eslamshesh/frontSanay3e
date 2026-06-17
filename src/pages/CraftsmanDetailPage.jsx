import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import dataService from '../services/dataService';
import CraftsmanMap from '../components/Map/CraftsmanMap';
import ChatWindow from '../components/Chat/ChatWindow';
import { 
  MapPin, Star, Clock, Wrench, Phone, MessageCircle,
  CheckCircle, Award, ThumbsUp, Calendar, ArrowLeft,
  Shield, Briefcase, DollarSign, Users, Heart,
  Share2, Flag, ChevronRight, Sparkles, Zap,
  Loader, AlertCircle, Image, Eye
} from 'lucide-react';

const CraftsmanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [lang, setLang] = useState('ar');
  const [craftsman, setCraftsman] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Language initialization & load portfolio
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    
    // Load portfolio images from localStorage
    const savedPortfolio = localStorage.getItem('craftsmanPortfolio');
    if (savedPortfolio) {
      try { 
        const parsed = JSON.parse(savedPortfolio);
        setPortfolioImages(parsed); 
      } catch {}
    }
    
    const handleLanguageChange = () => {
      const currentLang = localStorage.getItem('language') || 'ar';
      setLang(currentLang);
    };
    
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const craftsmen = await dataService.getCraftsmen();
        const found = craftsmen.find(c => c.id === parseInt(id));
        setCraftsman(found || craftsmen[0]);
        
        const allReviews = await dataService.getReviews();
        setReviews((allReviews || []).filter(r => r.craftsman_id === parseInt(id)).slice(0, 10));
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  // Translations
  const t = {
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
    notFound: lang === 'ar' ? 'الحرفي غير موجود' : 'Craftsman not found',
    about: lang === 'ar' ? 'نبذة عني' : 'About Me',
    reviews: lang === 'ar' ? 'التقييمات' : 'Reviews',
    location: lang === 'ar' ? 'الموقع' : 'Location',
    bookNow: lang === 'ar' ? 'احجز الآن' : 'Book Now',
    contact: lang === 'ar' ? 'اتصل' : 'Call',
    message: lang === 'ar' ? 'راسل' : 'Message',
    chat: lang === 'ar' ? 'محادثة' : 'Chat',
    completedJobs: lang === 'ar' ? 'خدمة مكتملة' : 'Completed Jobs',
    yearsExp: lang === 'ar' ? 'سنوات الخبرة' : 'Years Exp',
    rating: lang === 'ar' ? 'تقييم' : 'Rating',
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
    tabs: {
      about: lang === 'ar' ? 'نبذة' : 'About',
      reviews: lang === 'ar' ? 'تقييمات' : 'Reviews',
      location: lang === 'ar' ? 'الموقع' : 'Location',
    },
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: darkMode ? '#0f172a' : '#f8fafc',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <Loader size={40} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontFamily: "'Cairo', sans-serif" }}>{t.loading}</p>
      </div>
    );
  }

  if (!craftsman) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: darkMode ? '#0f172a' : '#f8fafc',
      }}>
        <div style={{ textAlign: 'center' }}>
          <AlertCircle size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
          <p style={{ color: darkMode ? '#f1f5f9' : '#0f172a', fontSize: '1.2rem', fontFamily: "'Cairo', sans-serif" }}>{t.notFound}</p>
        </div>
      </div>
    );
  }

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const heroBg = darkMode 
    ? 'linear-gradient(160deg, #1e3a8a, #1e40af)'
    : 'linear-gradient(160deg, #2563eb, #1d4ed8)';

  // Nearby craftsmen data
  const nearbyCraftsmen = [
    { id: 101, name: 'أحمد حسن', city: craftsman.city || 'القاهرة', district: 'مصر الجديدة', latitude: 30.0844, longitude: 31.3357, rating: 4.5, profession: 'كهربائي' },
    { id: 102, name: 'كريم سعيد', city: craftsman.city || 'القاهرة', district: 'المعادي', latitude: 29.9644, longitude: 31.2557, rating: 4.7, profession: 'سباك' },
    { id: 103, name: 'محمود فؤاد', city: craftsman.city || 'القاهرة', district: 'الزمالك', latitude: 30.0644, longitude: 31.2257, rating: 4.3, profession: 'نجار' },
  ];

  // Handle image click - open in modal or new tab
  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
        
        .animate-slide-right {
          animation: slideRight 0.4s ease forwards;
        }
        
        .animate-zoom-in {
          animation: zoomIn 0.3s ease forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.15);
        }
        
        .tab-active {
          position: relative;
        }
        
        .tab-active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 3px;
          background: #3b82f6;
          border-radius: 3px 3px 0 0;
        }
        
        .portfolio-img {
          transition: transform 0.4s ease;
        }
        
        .portfolio-img:hover {
          transform: scale(1.08);
        }
        
        .image-modal {
          animation: zoomIn 0.3s ease forwards;
        }
        
        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
          .sidebar {
            position: static !important;
          }
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>

      {/* Back Button */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '20px 24px 0',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            border: `1px solid ${borderColor}`,
            background: 'transparent',
            cursor: 'pointer',
            color: textColor,
            fontFamily: "'Cairo', sans-serif",
            fontSize: '0.9rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = darkMode ? '#334155' : '#f1f5f9';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          <ArrowLeft size={18} />
          {t.back}
        </button>
      </div>

      {/* Hero Section */}
      <div className="animate-fade-in" style={{
        background: heroBg,
        color: 'white',
        padding: '40px 0',
        marginTop: '16px',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }} className="hero-content">
          {/* Avatar */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: craftsman.avatar ? 'transparent' : 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 700,
            border: '4px solid rgba(255,255,255,0.3)',
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
          }}>
            {craftsman.avatar ? (
              <img src={craftsman.avatar} alt={craftsman.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              craftsman.profession?.charAt(0) || 'ص'
            )}
            
            {/* Verified Badge */}
            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white',
            }}>
              <CheckCircle size={14} color="white" />
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h1 style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                margin: 0,
              }}>
                {craftsman.name || craftsman.profession}
              </h1>
              
              {/* Rating Badge */}
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                {craftsman.rating || '4.5'}
              </span>
            </div>

            <p style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Wrench size={16} />
              {craftsman.profession}
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              fontSize: '0.9rem',
              opacity: 0.85,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} />
                {craftsman.completed_jobs || 0} {t.completedJobs}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} />
                {craftsman.years_exp || 5} {t.yearsExp}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} />
                {craftsman.city || 'القاهرة'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: isFavorite ? '#ef4444' : 'white',
              }}
              title={isFavorite ? t.saved : t.save}
            >
              <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} />
            </button>
            
            <button
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                color: 'white',
              }}
              title={t.share}
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        {/* Tabs */}
        <div className="animate-fade-in-up" style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '24px',
          borderBottom: `2px solid ${borderColor}`,
          overflowX: 'auto',
        }}>
          {['about', 'reviews', 'location'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'tab-active' : ''}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 700 : 500,
                fontSize: '0.95rem',
                color: activeTab === tab ? '#3b82f6' : textSecondary,
                fontFamily: "'Cairo', sans-serif",
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
            >
              {tab === 'about' && '📝 '}
              {tab === 'reviews' && '⭐ '}
              {tab === 'location' && '📍 '}
              {t.tabs[tab]}
            </button>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '24px',
        }} className="detail-grid">
          
          {/* Left Column */}
          <div>
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="animate-fade-in-up">
                {/* Bio */}
                <div style={{
                  background: cardBg,
                  borderRadius: '16px',
                  padding: '28px',
                  border: `1px solid ${borderColor}`,
                  marginBottom: '20px',
                }}>
                  <h2 style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: textColor,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Briefcase size={20} style={{ color: '#3b82f6' }} />
                    {t.about}
                  </h2>
                  <p style={{
                    color: textSecondary,
                    lineHeight: 2,
                    fontSize: '0.95rem',
                  }}>
                    {craftsman.bio || t.noBio}
                  </p>
                </div>

                {/* Skills/Services */}
                <div style={{
                  background: cardBg,
                  borderRadius: '16px',
                  padding: '28px',
                  border: `1px solid ${borderColor}`,
                  marginBottom: '20px',
                }}>
                  <h2 style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: textColor,
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Sparkles size={20} style={{ color: '#f59e0b' }} />
                    {lang === 'ar' ? 'الخدمات' : 'Services'}
                  </h2>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}>
                    {[craftsman.profession, 'صيانة', 'تركيب', 'تصليح'].map((skill, i) => (
                      <span key={i} style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff',
                        color: '#3b82f6',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        border: '1px solid rgba(59,130,246,0.2)',
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ✅ Portfolio Gallery - NEW */}
                <div className="animate-fade-in-up delay-200" style={{
                  background: cardBg,
                  borderRadius: '16px',
                  padding: '28px',
                  border: `1px solid ${borderColor}`,
                }}>
                  <h2 style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: textColor,
                    marginBottom: portfolioImages.length > 0 ? '16px' : '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Image size={20} style={{ color: '#8b5cf6' }} />
                    {t.portfolio}
                    {portfolioImages.length > 0 && (
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: textSecondary,
                        marginLeft: '8px',
                      }}>
                        ({portfolioImages.length} {lang === 'ar' ? 'صور' : 'images'})
                      </span>
                    )}
                  </h2>
                  
                  {portfolioImages.length > 0 ? (
                    <div className="portfolio-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '12px',
                    }}>
                      {portfolioImages.map((img, index) => (
                        <div
                          key={index}
                          className="hover-lift"
                          onClick={() => handleImageClick(img)}
                          style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            height: '180px',
                            border: `1px solid ${borderColor}`,
                            cursor: 'pointer',
                            position: 'relative',
                            group: 'true',
                          }}
                        >
                          <img
                            src={img.url || img}
                            alt={`${lang === 'ar' ? 'عمل' : 'Work'} ${index + 1}`}
                            className="portfolio-img"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            loading="lazy"
                          />
                          {/* Overlay on hover */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          }}
                          onMouseEnter={(e) => { e.target.style.opacity = 1; }}
                          onMouseLeave={(e) => { e.target.style.opacity = 0; }}
                          >
                            <Eye size={28} color="white" />
                          </div>
                          {/* Image Number Badge */}
                          <span style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            backdropFilter: 'blur(4px)',
                          }}>
                            {index + 1}/{portfolioImages.length}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '30px 20px',
                      color: textSecondary,
                    }}>
                      <Image size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                      <p style={{ fontSize: '0.9rem' }}>{t.noPortfolio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="animate-fade-in-up">
                <div style={{
                  background: cardBg,
                  borderRadius: '16px',
                  padding: '28px',
                  border: `1px solid ${borderColor}`,
                }}>
                  <h2 style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: textColor,
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Star size={20} style={{ color: '#f59e0b' }} fill="#f59e0b" />
                    {t.reviews} ({reviews.length})
                  </h2>

                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div 
                        key={review.id || index}
                        className="animate-fade-in-up"
                        style={{
                          padding: '16px 0',
                          borderBottom: `1px solid ${borderColor}`,
                          animationDelay: `${index * 0.1}s`,
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: darkMode ? '#334155' : '#eff6ff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              color: '#3b82f6',
                            }}>
                              {(review.client_email || 'A')[0].toUpperCase()}
                            </div>
                            <strong style={{ color: textColor, fontSize: '0.95rem' }}>
                              {review.client_email?.split('@')[0] || (lang === 'ar' ? 'عميل' : 'Customer')}
                            </strong>
                          </div>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                fill={i < (review.rating || 5) ? '#f59e0b' : 'none'}
                                color={i < (review.rating || 5) ? '#f59e0b' : '#cbd5e1'}
                              />
                            ))}
                          </div>
                        </div>
                        <p style={{
                          color: textSecondary,
                          fontSize: '0.9rem',
                          lineHeight: 1.7,
                          margin: 0,
                        }}>
                          "{review.comment}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: textSecondary,
                    }}>
                      <Star size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                      <p>{t.noReviews}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location Tab */}
            {activeTab === 'location' && (
              <div className="animate-fade-in-up">
                <CraftsmanMap 
                  craftsman={{
                    name: craftsman.name || craftsman.profession,
                    city: craftsman.city || 'القاهرة',
                    district: craftsman.district || '',
                    latitude: craftsman.latitude || 30.0444,
                    longitude: craftsman.longitude || 31.2357,
                    rating: craftsman.rating || 4.5,
                    location: craftsman.city || 'القاهرة'
                  }}
                  nearbyCraftsmen={nearbyCraftsmen}
                  userLocation={{
                    latitude: 30.0444,
                    longitude: 31.2357
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="animate-fade-in-up delay-200 sidebar" style={{
            position: 'sticky',
            top: '84px',
            alignSelf: 'start',
          }}>
            {/* Booking Card */}
            <div className="hover-lift" style={{
              background: cardBg,
              borderRadius: '16px',
              padding: '28px',
              border: `1px solid ${borderColor}`,
              marginBottom: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              {/* Price */}
              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: `1px solid ${borderColor}`,
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#059669',
                  marginBottom: '4px',
                }}>
                  {craftsman.price || 150} {t.egp}
                </div>
                <div style={{ fontSize: '0.85rem', color: textSecondary }}>
                  {t.pricePerHour}
                </div>
              </div>

              {/* Book Now Button */}
              <Link
                to={`/booking/${craftsman.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  textDecoration: 'none',
                  fontFamily: "'Cairo', sans-serif",
                  boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(37,99,235,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(37,99,235,0.3)';
                }}
              >
                <Calendar size={20} />
                {t.bookNow}
              </Link>

              {/* Contact Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginTop: '12px',
              }}>
                <a
                  href={`tel:${craftsman.phone || '19555'}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: `2px solid ${borderColor}`,
                    background: 'transparent',
                    color: textColor,
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    fontFamily: "'Cairo', sans-serif",
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.color = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = borderColor;
                    e.target.style.color = textColor;
                  }}
                >
                  <Phone size={16} />
                  {t.contact}
                </a>
                <a
                  href={`https://wa.me/${craftsman.whatsapp || '20'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: `2px solid ${borderColor}`,
                    background: 'transparent',
                    color: textColor,
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    fontFamily: "'Cairo', sans-serif",
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#059669';
                    e.target.style.color = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = borderColor;
                    e.target.style.color = textColor;
                  }}
                >
                  <MessageCircle size={16} />
                  {t.message}
                </a>
              </div>

              {/* Chat Button */}
              <button
                onClick={() => setShowChat(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: `2px solid #8b5cf6`,
                  background: 'transparent',
                  color: '#8b5cf6',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  fontFamily: "'Cairo', sans-serif",
                  transition: 'all 0.3s ease',
                  marginTop: '8px',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#8b5cf6';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#8b5cf6';
                }}
              >
                <MessageCircle size={16} />
                {t.chat}
              </button>
            </div>

            {/* Info Cards */}
            <div style={{
              background: cardBg,
              borderRadius: '16px',
              padding: '20px',
              border: `1px solid ${borderColor}`,
            }}>
              <h3 style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: textColor,
                marginBottom: '16px',
              }}>
                {lang === 'ar' ? 'معلومات سريعة' : 'Quick Info'}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={16} style={{ color: '#059669' }} />
                  <span style={{ fontSize: '0.85rem', color: textSecondary }}>{t.verified}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={16} style={{ color: '#3b82f6' }} />
                  <span style={{ fontSize: '0.85rem', color: textSecondary }}>
                    {lang === 'ar' ? 'متاح اليوم' : 'Available Today'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users size={16} style={{ color: '#8b5cf6' }} />
                  <span style={{ fontSize: '0.85rem', color: textSecondary }}>
                    {craftsman.completed_jobs || 0}+ {t.completedJobs}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={16} style={{ color: '#ef4444' }} />
                  <span style={{ fontSize: '0.85rem', color: textSecondary }}>
                    {craftsman.city || 'القاهرة'}{craftsman.district ? ` - ${craftsman.district}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Report Button */}
            <button
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: 'transparent',
                cursor: 'pointer',
                color: textSecondary,
                fontSize: '0.8rem',
                fontWeight: 500,
                fontFamily: "'Cairo', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#ef4444';
                e.target.style.borderColor = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = textSecondary;
                e.target.style.borderColor = borderColor;
              }}
            >
              <Flag size={14} />
              {t.report}
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            cursor: 'pointer',
            padding: '20px',
          }}
        >
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url || selectedImage}
              alt="Portfolio"
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: '12px',
                objectFit: 'contain',
              }}
            />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {showChat && (
        <ChatWindow
          otherUser={{
            name: craftsman.name || craftsman.profession,
            email: craftsman.email || `craftsman_${craftsman.id}@demo.com`
          }}
          onClose={() => setShowChat(false)}
          minimized={chatMinimized}
          onMinimize={() => setChatMinimized(!chatMinimized)}
        />
      )}
    </div>
  );
};

export default CraftsmanDetailPage;