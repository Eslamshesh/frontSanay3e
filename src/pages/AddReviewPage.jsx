// src/pages/AddReviewPage.jsx
// صفحة العميل لتقييم الحرفي بعد اكتمال الخدمة
// Route: /bookings/:bookingId/review

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Star, CheckCircle, Loader, AlertCircle,
  ChevronRight, ChevronLeft, User, Send
} from 'lucide-react';

const ratingLabels = {
  ar: { 1: 'سيء جداً', 2: 'سيء', 3: 'مقبول', 4: 'جيد', 5: 'ممتاز' },
  en: { 1: 'Very Bad', 2: 'Bad', 3: 'Average', 4: 'Good', 5: 'Excellent' },
};

const AddReviewPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [lang, setLang] = useState('ar');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const isArabic = lang === 'ar';

  useEffect(() => {
    const saved = localStorage.getItem('language') || 'ar';
    setLang(saved);
    const h = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', h);
    return () => window.removeEventListener('languagechange', h);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getBooking(bookingId);
        const b = data.booking || data;

        // لازم الحجز يكون completed عشان يتقيم
        if (b.status !== 'completed') {
          setError(isArabic
            ? 'لا يمكن تقييم هذا الحجز — الخدمة لم تكتمل بعد'
            : 'Cannot review this booking — service not completed yet');
          setLoading(false);
          return;
        }

        // لو اتقيم قبل كده
        if (b.review) {
          setError(isArabic
            ? 'قمت بتقييم هذا الحجز مسبقاً'
            : 'You already reviewed this booking');
          setLoading(false);
          return;
        }

        setBooking(b);
      } catch (err) {
        setError(err.message || (isArabic ? 'حدث خطأ في تحميل بيانات الحجز' : 'Error loading booking'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(isArabic ? 'يرجى اختيار تقييم' : 'Please select a rating');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.addReview(bookingId, {
        rating,
        ...(comment.trim() && { comment: comment.trim() }),
      });
      setConfirmed(true);
    } catch (err) {
      if (err.errors) {
        setError(Object.values(err.errors).flat().join(' | '));
      } else {
        setError(err.message || (isArabic ? 'حدث خطأ في إرسال التقييم' : 'Error submitting review'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Styles
  const bg = darkMode ? '#0f172a' : '#f8fafc';
  const card = darkMode ? '#1e293b' : '#ffffff';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#94a3b8' : '#64748b';
  const inputBg = darkMode ? '#0f172a' : '#f8fafc';
  const accent = '#2563eb';

  const craftsmanName = booking
    ? `${booking.craftsman?.first_name || ''} ${booking.craftsman?.last_name || ''}`.trim() || (isArabic ? 'الحرفي' : 'Craftsman')
    : '';

  // Loading
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
      <Loader size={36} style={{ color: accent, animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // Error (booking not found / already reviewed / not completed)
  if (error && !booking) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, padding: 24, fontFamily: 'Cairo, sans-serif', direction: isArabic ? 'rtl' : 'ltr' }}>
      <div style={{ background: card, borderRadius: 16, padding: 32, maxWidth: 420, width: '100%', textAlign: 'center', border: `1px solid ${border}` }}>
        <AlertCircle size={48} style={{ color: '#f59e0b', marginBottom: 16 }} />
        <p style={{ color: text, marginBottom: 20, lineHeight: 1.7 }}>{error}</p>
        <button onClick={() => navigate('/my-bookings')}
          style={{ background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontWeight: 600, fontSize: 14 }}>
          {isArabic ? 'حجوزاتي' : 'My Bookings'}
        </button>
      </div>
    </div>
  );

  // Success
  if (confirmed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, padding: 24, fontFamily: 'Cairo, sans-serif', direction: isArabic ? 'rtl' : 'ltr' }}>
      <div style={{ background: card, borderRadius: 20, padding: '48px 36px', maxWidth: 440, width: '100%', textAlign: 'center', border: `1px solid ${border}` }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Star size={38} color="white" fill="white" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#d97706', marginBottom: 8 }}>
          {isArabic ? 'شكراً على تقييمك! ⭐' : 'Thanks for your review! ⭐'}
        </h2>
        <p style={{ color: sub, marginBottom: 12, lineHeight: 1.7 }}>
          {isArabic
            ? `تقييمك لـ ${craftsmanName} سيساعد العملاء الآخرين`
            : `Your review of ${craftsmanName} will help other clients`}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 28 }}>
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={28} color="#f59e0b" fill={s <= rating ? '#f59e0b' : 'none'} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/my-bookings')}
            style={{ background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
            {isArabic ? 'حجوزاتي' : 'My Bookings'}
          </button>
          <button onClick={() => navigate('/')}
            style={{ background: 'transparent', color: text, border: `1.5px solid ${border}`, borderRadius: 10, padding: '11px 24px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: 14 }}>
            {isArabic ? 'الرئيسية' : 'Home'}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const displayRating = hoveredRating || rating;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: 'Cairo, sans-serif', direction: isArabic ? 'rtl' : 'ltr', color: text }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .star-btn { transition: transform 0.1s; cursor: pointer; }
        .star-btn:hover { transform: scale(1.2); }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', color: 'white', padding: '28px 0 24px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 20px' }}>
          <button onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '6px 14px', color: 'white', cursor: 'pointer', fontSize: 13, fontFamily: 'Cairo, sans-serif', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 4 }}>
            {isArabic ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {isArabic ? 'رجوع' : 'Back'}
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            {isArabic ? 'تقييم الخدمة' : 'Rate the Service'}
          </h1>
          <p style={{ opacity: 0.9, fontSize: 14, marginTop: 4 }}>
            {isArabic ? 'شاركنا تجربتك مع الحرفي' : 'Share your experience with the craftsman'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 20px' }}>

        {/* Craftsman info */}
        {booking && (
          <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: '18px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              {booking.craftsman?.avatar_url
                ? <img src={booking.craftsman.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <User size={24} color="white" />}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{craftsmanName}</div>
              <div style={{ color: sub, fontSize: 13, marginTop: 2 }}>
                {booking.service_title || booking.craftsman?.crafts?.[0]?.name || ''}
              </div>
              <div style={{ color: sub, fontSize: 12, marginTop: 2 }}>
                📅 {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US') : ''}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#991b1b', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Form */}
        <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: '28px 24px' }}>

          {/* Stars */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 16 }}>
              {isArabic ? 'كيف كانت تجربتك؟' : 'How was your experience?'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  className="star-btn"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoveredRating(s)}
                  onMouseLeave={() => setHoveredRating(0)}
                  style={{ background: 'none', border: 'none', padding: 4 }}
                >
                  <Star
                    size={42}
                    color="#f59e0b"
                    fill={s <= displayRating ? '#f59e0b' : 'none'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            {displayRating > 0 && (
              <p style={{ color: '#d97706', fontWeight: 700, fontSize: 15 }}>
                {ratingLabels[isArabic ? 'ar' : 'en'][displayRating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 14, color: text, marginBottom: 8 }}>
              {isArabic ? 'تعليقك' : 'Your Comment'}
              <span style={{ color: sub, fontWeight: 400, fontSize: 12, marginRight: 4, marginLeft: 4 }}>
                ({isArabic ? 'اختياري' : 'optional'})
              </span>
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={isArabic
                ? 'شاركنا تجربتك بالتفصيل — جودة الشغل، الالتزام بالمواعيد...'
                : 'Share your experience in detail — quality, punctuality...'}
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: '12px 14px', borderRadius: 10,
                border: `1.5px solid ${border}`,
                background: inputBg, color: text,
                fontSize: 14, fontFamily: 'Cairo, sans-serif',
                outline: 'none', resize: 'vertical',
                direction: isArabic ? 'rtl' : 'ltr',
              }}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: rating === 0 ? '#cbd5e1' : submitting ? '#fcd34d' : '#f59e0b',
              color: rating === 0 ? '#94a3b8' : '#fff',
              border: 'none', fontWeight: 700, fontSize: 16,
              cursor: rating === 0 || submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'Cairo, sans-serif',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.2s',
            }}
          >
            {submitting
              ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> {isArabic ? 'جاري الإرسال...' : 'Sending...'}</>
              : <><Send size={16} /> {isArabic ? 'إرسال التقييم' : 'Submit Review'}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewPage;
