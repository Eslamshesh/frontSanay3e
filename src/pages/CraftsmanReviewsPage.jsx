// src/pages/CraftsmanReviewsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Star, TrendingUp, Award, MessageSquare,
  User, Calendar, ChevronRight, Loader,
  ThumbsUp, BarChart2
} from 'lucide-react';

const CraftsmanReviewsPage = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [lang, setLang] = useState('ar');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | 5 | 4 | 3 | 2 | 1

  // ── Language ──────────────────────────────────────────────────
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handler = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handler);
    return () => window.removeEventListener('languagechange', handler);
  }, []);

  const isAr = lang === 'ar';

  // ── Fetch reviews ─────────────────────────────────────────────
  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getReviews();
      // الباك يرجع { data: [...] } — نصفي الخاصة بالحرفي الحالي
      const mine = (data.data || []).filter(
        r => r.craftsman_id === user?.craftsman?.id || r.craftsman?.user_id === user?.id
      );
      setReviews(mine);
    } catch (err) {
      setError(isAr ? 'حدث خطأ في تحميل التقييمات' : 'Failed to load reviews');
    }
    setLoading(false);
  }, [user, isAr]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  // ── Stats ─────────────────────────────────────────────────────
  const totalReviews = reviews.length;
  const avgRating = totalReviews
    ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  const filteredReviews = filter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === Number(filter));

  // ── Styles ────────────────────────────────────────────────────
  const bg        = darkMode ? '#0f172a' : '#f8fafc';
  const card      = darkMode ? '#1e293b' : '#ffffff';
  const border    = darkMode ? '#334155' : '#e2e8f0';
  const text      = darkMode ? '#f1f5f9' : '#0f172a';
  const textSub   = darkMode ? '#94a3b8' : '#64748b';
  const accent    = '#f59e0b';
  const accentBg  = darkMode ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)';

  const formatDate = (str) => {
    if (!str) return '';
    const d = new Date(str.replace(' ', 'T'));
    if (isNaN(d)) return '';
    return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const StarRow = ({ value, size = 16 }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <Star
          key={s}
          size={size}
          fill={s <= value ? accent : 'none'}
          color={s <= value ? accent : (darkMode ? '#475569' : '#cbd5e1')}
        />
      ))}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: bg, direction: isAr ? 'rtl' : 'ltr',
      fontFamily: isAr ? 'Cairo, sans-serif' : 'Inter, sans-serif',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 700, color: text, margin: 0,
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <Award size={26} color={accent} />
            {isAr ? 'تقييمات العملاء' : 'Customer Reviews'}
          </h1>
          <p style={{ color: textSub, marginTop: '6px', fontSize: '0.9rem' }}>
            {isAr ? 'آراء العملاء في خدماتك' : 'What clients say about your services'}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Loader size={32} color={accent} style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px', padding: '20px', color: '#ef4444', textAlign: 'center',
          }}>
            {error}
          </div>
        ) : (
          <>
            {/* Stats Card */}
            <div style={{
              background: card, border: `1px solid ${border}`, borderRadius: '16px',
              padding: '24px', marginBottom: '20px',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px',
            }}>
              {/* Average Rating */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  fontSize: '3.5rem', fontWeight: 800, color: accent, lineHeight: 1,
                }}>
                  {avgRating}
                </div>
                <StarRow value={Math.round(Number(avgRating))} size={20} />
                <span style={{ color: textSub, fontSize: '0.82rem' }}>
                  {totalReviews} {isAr ? 'تقييم' : 'reviews'}
                </span>
              </div>

              {/* Rating Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: textSub, minWidth: '8px' }}>{star}</span>
                    <Star size={12} fill={accent} color={accent} />
                    <div style={{
                      flex: 1, height: '6px', borderRadius: '99px',
                      background: darkMode ? '#334155' : '#e2e8f0', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', borderRadius: '99px', background: accent,
                        width: totalReviews ? `${(count / totalReviews) * 100}%` : '0%',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: textSub, minWidth: '18px' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px', marginBottom: '20px',
            }}>
              {[
                { icon: <MessageSquare size={18} color={accent} />, value: totalReviews, label: isAr ? 'إجمالي التقييمات' : 'Total Reviews' },
                { icon: <ThumbsUp size={18} color='#22c55e' />, value: ratingCounts.filter(r => r.star >= 4).reduce((s,r) => s + r.count, 0), label: isAr ? 'تقييمات ممتازة' : 'Excellent' },
                { icon: <TrendingUp size={18} color='#3b82f6' />, value: `${avgRating}⭐`, label: isAr ? 'متوسط التقييم' : 'Avg Rating' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: card, border: `1px solid ${border}`, borderRadius: '12px',
                  padding: '14px', textAlign: 'center',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>{stat.icon}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: text }}>{stat.value}</div>
                  <div style={{ fontSize: '0.72rem', color: textSub, marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div style={{
              display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px',
            }}>
              {['all', '5', '4', '3', '2', '1'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '6px 14px', borderRadius: '99px', fontSize: '0.82rem',
                    fontWeight: filter === f ? 700 : 400, cursor: 'pointer', border: 'none',
                    background: filter === f ? accent : (darkMode ? '#1e293b' : '#f1f5f9'),
                    color: filter === f ? '#000' : textSub,
                    transition: 'all 0.2s',
                  }}
                >
                  {f === 'all'
                    ? (isAr ? 'الكل' : 'All')
                    : <>{f} <Star size={11} style={{ verticalAlign: 'middle' }} fill={filter === f ? '#000' : textSub} color={filter === f ? '#000' : textSub} /></>
                  }
                </button>
              ))}
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
              <div style={{
                background: card, border: `1px solid ${border}`, borderRadius: '16px',
                padding: '60px 20px', textAlign: 'center',
              }}>
                <Star size={40} color={darkMode ? '#334155' : '#e2e8f0'} style={{ marginBottom: '12px' }} />
                <p style={{ color: textSub, margin: 0 }}>
                  {isAr ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredReviews.map(review => (
                  <div key={review.id} style={{
                    background: card, border: `1px solid ${border}`, borderRadius: '14px',
                    padding: '18px 20px',
                  }}>
                    {/* Top Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '50%',
                          background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {review.client?.avatar
                            ? <img src={review.client.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            : <User size={18} color={accent} />
                          }
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: text }}>
                            {review.client?.name || (isAr ? 'عميل' : 'Client')}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <StarRow value={review.rating} size={13} />
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: textSub, fontSize: '0.75rem' }}>
                        <Calendar size={12} />
                        {formatDate(review.created_at)}
                      </div>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p style={{
                        margin: 0, color: text, fontSize: '0.88rem', lineHeight: 1.7,
                        padding: '10px 14px',
                        background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        borderRadius: '8px', borderRight: isAr ? `3px solid ${accent}` : 'none',
                        borderLeft: !isAr ? `3px solid ${accent}` : 'none',
                      }}>
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CraftsmanReviewsPage;
