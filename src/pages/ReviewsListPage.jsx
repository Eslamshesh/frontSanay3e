import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import dataService from '../services/dataService';
import { 
  Star, TrendingUp, Users, Filter, ThumbsUp, 
  MessageSquare, Award, ChevronDown, Search,
  Calendar, User, CheckCircle, Sparkles,
  BarChart3, PieChart, Loader, AlertCircle
} from 'lucide-react';

const ReviewsListPage = () => {
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [helpfulClicked, setHelpfulClicked] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Language initialization
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    
    const handleLanguageChange = () => {
      const currentLang = localStorage.getItem('language') || 'ar';
      setLang(currentLang);
    };
    
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await dataService.getReviews();
      setReviews(data || []);
      setLoading(false);
    };
    loadData();
  }, []);

  // Translations
  const t = {
    title: lang === 'ar' ? 'التقييمات والمراجعات' : 'Ratings & Reviews',
    subtitle: lang === 'ar' ? 'اطلع على آراء وتقييمات العملاء' : 'Check out customer ratings and reviews',
    totalReviews: (count) => lang === 'ar' ? `${count} تقييم` : `${count} reviews`,
    outOf5: lang === 'ar' ? 'من 5' : 'out of 5',
    all: lang === 'ar' ? 'الكل' : 'All',
    newest: lang === 'ar' ? 'الأحدث' : 'Newest',
    oldest: lang === 'ar' ? 'الأقدم' : 'Oldest',
    highest: lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated',
    lowest: lang === 'ar' ? 'الأقل تقييماً' : 'Lowest Rated',
    helpful: lang === 'ar' ? 'مفيد' : 'Helpful',
    loading: lang === 'ar' ? 'جاري تحميل التقييمات...' : 'Loading reviews...',
    noReviews: lang === 'ar' ? 'لا توجد تقييمات تطابق بحثك' : 'No reviews match your search',
    searchPlaceholder: lang === 'ar' ? 'ابحث في التقييمات...' : 'Search reviews...',
    ratingDistribution: lang === 'ar' ? 'توزيع التقييمات' : 'Rating Distribution',
    averageRating: lang === 'ar' ? 'متوسط التقييم' : 'Average Rating',
    totalCount: lang === 'ar' ? 'إجمالي التقييمات' : 'Total Reviews',
    stars: (count) => lang === 'ar' ? `${count} نجوم` : `${count} stars`,
  };

  // Filter and sort
  let filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter);
  
  // Search
  if (searchQuery.trim()) {
    filtered = filtered.filter(r => 
      (r.comment && r.comment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.client_email && r.client_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
  
  // Sort
  switch(sortBy) {
    case 'oldest':
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      break;
    case 'highest':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'lowest':
      filtered.sort((a, b) => a.rating - b.rating);
      break;
    default: // newest
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  const total = reviews.length;
  const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '0';
  
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: total > 0 ? Math.round((reviews.filter(r => r.rating === star).length / total) * 100) : 0
  }));

  const handleHelpful = (reviewId) => {
    if (!helpfulClicked.includes(reviewId)) {
      setHelpfulClicked([...helpfulClicked, reviewId]);
    }
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const accentColor = '#3b82f6';
  const starColor = '#f59e0b';

  return (
    <div style={{
      background: bgColor,
      minHeight: '100vh',
      fontFamily: "'Cairo', sans-serif",
    }}>
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
        
        @keyframes growBar {
          from { width: 0 !important; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
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
        
        .grow-bar {
          animation: growBar 1.5s ease forwards;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        
        .filter-btn {
          transition: all 0.3s ease;
        }
        
        .filter-btn:hover {
          transform: translateY(-2px);
        }
        
        .skeleton {
          background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @media (max-width: 768px) {
          .stats-container {
            flex-direction: column !important;
          }
          .filters-row {
            flex-wrap: wrap !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: darkMode 
          ? 'linear-gradient(160deg, #1e3a8a, #1e40af)'
          : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
        color: 'white',
        padding: '48px 0',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div className="animate-fade-in-up" style={{ marginBottom: '12px' }}>
            <Award size={40} style={{ opacity: 0.9 }} />
          </div>
          <h1 className="animate-fade-in-up delay-100" style={{
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '8px',
          }}>
            {t.title}
          </h1>
          <p className="animate-fade-in-up delay-200" style={{
            fontSize: '1rem',
            opacity: 0.85,
          }}>
            {t.subtitle}
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        
        {/* Statistics Card */}
        <div className="animate-fade-in-up delay-300" style={{
          background: cardBg,
          borderRadius: '20px',
          padding: '32px',
          border: `1px solid ${borderColor}`,
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        }}>
          <div className="stats-container" style={{
            display: 'flex',
            gap: '32px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {/* Average Rating */}
            <div style={{
              textAlign: 'center',
              flexShrink: 0,
              minWidth: '120px',
            }}>
              <div style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                color: accentColor,
                lineHeight: 1,
                marginBottom: '4px',
              }}>
                {avg}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2px',
                marginBottom: '4px',
              }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    size={14}
                    fill={i <= Math.round(avg) ? starColor : 'none'}
                    color={i <= Math.round(avg) ? starColor : '#cbd5e1'}
                  />
                ))}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: textSecondary,
              }}>
                {t.outOf5} ({t.totalReviews(total)})
              </div>
            </div>

            {/* Distribution Bars */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h3 style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: textColor,
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <BarChart3 size={16} style={{ color: accentColor }} />
                {t.ratingDistribution}
              </h3>
              {dist.map((d) => (
                <div key={d.star} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '8px',
                }}>
                  <span style={{
                    width: '20px',
                    fontSize: '0.8rem',
                    color: textSecondary,
                    fontWeight: 600,
                    textAlign: 'right',
                  }}>
                    {d.star}
                  </span>
                  <Star size={12} fill={starColor} color={starColor} style={{ flexShrink: 0 }} />
                  <div style={{
                    flex: 1,
                    height: '8px',
                    background: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div className="grow-bar" style={{
                      height: '100%',
                      borderRadius: '4px',
                      background: d.star >= 4 
                        ? 'linear-gradient(90deg, #059669, #10b981)'
                        : d.star === 3
                        ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                        : 'linear-gradient(90deg, #ef4444, #f87171)',
                      width: `${d.percent}%`,
                      transition: 'width 1.5s ease',
                    }} />
                  </div>
                  <span style={{
                    width: '30px',
                    fontSize: '0.75rem',
                    color: textSecondary,
                    fontWeight: 500,
                  }}>
                    {d.count}
                  </span>
                  <span style={{
                    width: '35px',
                    fontSize: '0.75rem',
                    color: textSecondary,
                    textAlign: 'right',
                  }}>
                    {d.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="animate-fade-in-up delay-400" style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Rating Filters */}
          <div className="filters-row" style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => setFilter(0)}
              className="filter-btn"
              style={{
                padding: '8px 18px',
                borderRadius: '50px',
                border: filter === 0 ? `2px solid ${accentColor}` : `2px solid ${borderColor}`,
                background: filter === 0 ? accentColor : 'transparent',
                color: filter === 0 ? 'white' : textColor,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              {t.all}
            </button>
            {[5, 4, 3, 2, 1].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="filter-btn"
                style={{
                  padding: '8px 16px',
                  borderRadius: '50px',
                  border: filter === s ? `2px solid ${starColor}` : `2px solid ${borderColor}`,
                  background: filter === s ? starColor : 'transparent',
                  color: filter === s ? 'white' : textColor,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: "'Cairo', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {s} <Star size={12} fill={filter === s ? 'white' : starColor} color={filter === s ? 'white' : starColor} />
              </button>
            ))}
          </div>

          {/* Sort & Search */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: textSecondary,
              }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                style={{
                  padding: '8px 14px 8px 36px',
                  border: `1px solid ${borderColor}`,
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: cardBg,
                  color: textColor,
                  fontFamily: "'Cairo', sans-serif",
                  width: '180px',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = accentColor;
                  e.target.style.width = '220px';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = borderColor;
                  if (!searchQuery) e.target.style.width = '180px';
                }}
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 14px',
                border: `1px solid ${borderColor}`,
                borderRadius: '10px',
                fontSize: '0.85rem',
                outline: 'none',
                background: cardBg,
                color: textColor,
                fontFamily: "'Cairo', sans-serif",
                cursor: 'pointer',
              }}
            >
              <option value="newest">{t.newest}</option>
              <option value="oldest">{t.oldest}</option>
              <option value="highest">{t.highest}</option>
              <option value="lowest">{t.lowest}</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{
                borderRadius: '14px',
                height: '100px',
              }} />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((r, index) => (
            <div
              key={r.id}
              className="animate-fade-in-up hover-lift"
              style={{
                background: cardBg,
                borderRadius: '14px',
                padding: '24px',
                border: `1px solid ${borderColor}`,
                marginBottom: '12px',
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: darkMode ? '#334155' : '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accentColor,
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}>
                    {(r.client_email || 'U')[0].toUpperCase()}
                  </div>
                  
                  <div>
                    <strong style={{
                      fontSize: '0.95rem',
                      color: textColor,
                      display: 'block',
                    }}>
                      {r.client_email?.split('@')[0] || (lang === 'ar' ? 'مستخدم' : 'User')}
                    </strong>
                    <span style={{
                      fontSize: '0.8rem',
                      color: textSecondary,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <Calendar size={12} />
                      {r.created_at?.split('T')[0] || ''}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div style={{
                  display: 'flex',
                  gap: '2px',
                  background: darkMode ? 'rgba(245,158,11,0.1)' : '#fffbeb',
                  padding: '6px 12px',
                  borderRadius: '20px',
                }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < r.rating ? starColor : 'none'}
                      color={i < r.rating ? starColor : '#cbd5e1'}
                    />
                  ))}
                </div>
              </div>

              {/* Title */}
              {r.title && (
                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: textColor,
                  marginBottom: '6px',
                }}>
                  {r.title}
                </h3>
              )}

              {/* Comment */}
              <p style={{
                color: textSecondary,
                fontSize: '0.9rem',
                lineHeight: 1.8,
                marginBottom: '12px',
              }}>
                "{r.comment}"
              </p>

              {/* Actions */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                {/* Service info */}
                <span style={{
                  fontSize: '0.8rem',
                  color: textSecondary,
                  background: darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                  padding: '4px 10px',
                  borderRadius: '8px',
                }}>
                  🛠️ {r.profession || (lang === 'ar' ? 'خدمة منزلية' : 'Home Service')}
                </span>

                {/* Helpful Button */}
                <button
                  onClick={() => handleHelpful(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${borderColor}`,
                    background: helpfulClicked.includes(r.id) 
                      ? (darkMode ? 'rgba(5,150,105,0.15)' : '#d1fae5')
                      : 'transparent',
                    cursor: helpfulClicked.includes(r.id) ? 'default' : 'pointer',
                    color: helpfulClicked.includes(r.id) ? '#059669' : textSecondary,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    fontFamily: "'Cairo', sans-serif",
                    transition: 'all 0.3s ease',
                  }}
                >
                  <ThumbsUp size={14} />
                  {t.helpful}
                  {helpfulClicked.includes(r.id) && (
                    <CheckCircle size={14} />
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="animate-fade-in" style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: textSecondary,
            background: cardBg,
            borderRadius: '14px',
            border: `1px solid ${borderColor}`,
          }}>
            <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>
              {t.noReviews}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsListPage;