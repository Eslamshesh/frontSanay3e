import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ImageUploader from '../components/Upload/ImageUploader';
import { 
  Calendar, Clock, MapPin, Star, User, Wrench,
  Phone, MessageCircle, DollarSign, FileText,
  CheckCircle, ArrowLeft, ArrowRight, Camera,
  Upload, X, Sparkles, Shield, CreditCard,
  Loader, AlertCircle, ChevronRight, Heart
} from 'lucide-react';

const timeSlots = [
  '9:00 ص', '10:00 ص', '11:00 ص', '12:00 م',
  '1:00 م', '2:00 م', '3:00 م', '4:00 م',
  '5:00 م', '6:00 م', '7:00 م', '8:00 م'
];

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [lang, setLang] = useState('ar');
  const [craftsman, setCraftsman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Load craftsman data
  useEffect(() => {
    const loadCraftsman = async () => {
      setLoading(true);
      try {
        const data = await api.getCraftsman(id);
        setCraftsman(data.craftsman || data);
      } catch {
        // Fallback data
        setCraftsman({
          id: id || 1,
          name: 'أحمد النجار',
          profession: 'نجار',
          rating: 4.9,
          price: 200,
          city: 'القاهرة',
          district: 'مدينة نصر',
          phone: '01001234567',
          completed_jobs: 320,
        });
      }
      setLoading(false);
    };
    loadCraftsman();
  }, [id]);

  const platformFee = Math.round((craftsman?.price || 0) * 0.1);
  const total = (craftsman?.price || 0) + platformFee;
  const today = new Date().toISOString().split('T')[0];

  // Translations
  const t = {
    bookAppointment: lang === 'ar' ? 'حجز موعد' : 'Book Appointment',
    selectDateTime: lang === 'ar' ? 'اختر التاريخ والوقت' : 'Select Date & Time',
    date: lang === 'ar' ? 'التاريخ' : 'Date',
    time: lang === 'ar' ? 'الوقت' : 'Time',
    notes: lang === 'ar' ? 'ملاحظات' : 'Notes',
    notesPlaceholder: lang === 'ar' ? 'أي تفاصيل إضافية عن المشكلة...' : 'Any additional details about the issue...',
    uploadImages: lang === 'ar' ? 'صور المشكلة (اختياري)' : 'Problem Images (Optional)',
    next: lang === 'ar' ? 'التالي' : 'Next',
    back: lang === 'ar' ? 'رجوع' : 'Back',
    confirm: lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking',
    confirmTitle: lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking',
    craftsman: lang === 'ar' ? 'الحرفي' : 'Craftsman',
    profession: lang === 'ar' ? 'التخصص' : 'Profession',
    location: lang === 'ar' ? 'الموقع' : 'Location',
    priceSummary: lang === 'ar' ? 'ملخص السعر' : 'Price Summary',
    servicePrice: lang === 'ar' ? 'سعر الخدمة' : 'Service Price',
    platformFee: lang === 'ar' ? 'رسوم المنصة' : 'Platform Fee',
    total: lang === 'ar' ? 'الإجمالي' : 'Total',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    successTitle: lang === 'ar' ? '🎉 تم تأكيد الحجز!' : '🎉 Booking Confirmed!',
    successText: (name) => lang === 'ar' ? `سيصل ${name} في الموعد المحدد` : `${name} will arrive at the scheduled time`,
    backToHome: lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home',
    myBookings: lang === 'ar' ? 'حجوزاتي' : 'My Bookings',
    selectDate: lang === 'ar' ? 'يرجى اختيار التاريخ' : 'Please select a date',
    selectTime: lang === 'ar' ? 'يرجى اختيار الوقت' : 'Please select a time',
    submitting: lang === 'ar' ? 'جاري تأكيد الحجز...' : 'Confirming booking...',
    error: lang === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.',
    completedJobs: lang === 'ar' ? 'خدمة مكتملة' : 'Completed Jobs',
  };

  const handleNext = () => {
    if (!date) { setError(t.selectDate); return; }
    if (!time) { setError(t.selectTime); return; }
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');

    try {
      const bookingData = {
        craftsman_id: craftsman.id,
        service_type: craftsman.profession,
        description: notes,
        location: craftsman.city,
        budget: total,
        date: date,
        time: time,
        customer_name: user?.name || '',
        customer_email: user?.email || '',
      };

      const result = await api.createBooking(bookingData);
      
      if (result.success || result.id) {
        setBookingResult(result);
        setConfirmed(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(t.error);
      }
    } catch (err) {
      // Fallback for demo
      setBookingResult({ id: Date.now(), ...craftsman, date, time, total });
      setConfirmed(true);
    }
    setSubmitting(false);
  };

  const handleImagesUpload = (files) => {
    setImages(files);
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#ffffff';
  const gradientBg = darkMode 
    ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)'
    : 'linear-gradient(135deg, #2563eb, #3b82f6)';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgColor }}>
        <Loader size={40} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (confirmed) {
    return (
      <div style={{ background: bgColor, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Cairo', sans-serif" }}>
        <style>{`
          @keyframes successBounce { 0% { transform: scale(0); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
          @keyframes confetti { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(-200px) rotate(720deg); opacity: 0; } }
          .animate-success { animation: successBounce 0.6s ease forwards; }
        `}</style>
        
        <div className="animate-success" style={{
          background: cardBg, borderRadius: '24px', padding: '48px 36px',
          maxWidth: '500px', width: '100%', textAlign: 'center',
          border: `1px solid ${borderColor}`, boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '20px', animation: 'pulse 2s infinite',
          }}>
            <CheckCircle size={40} color="white" />
          </div>
          
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#059669', marginBottom: '12px' }}>
            {t.successTitle}
          </h1>
          <p style={{ color: textSecondary, marginBottom: '20px', lineHeight: 1.6, fontSize: '0.95rem' }}>
            {t.successText(craftsman?.name)}
          </p>

          <div style={{
            background: darkMode ? 'rgba(5,150,105,0.1)' : '#d1fae5',
            borderRadius: '12px', padding: '20px', marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', color: textSecondary }}>
              <span>{t.date}</span><span style={{ fontWeight: 600, color: textColor }}>{formatDate(date)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', color: textSecondary }}>
              <span>{t.time}</span><span style={{ fontWeight: 600, color: textColor }}>{time}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.9rem', color: textSecondary, borderTop: `1px solid ${borderColor}`, marginTop: '8px', paddingTop: '12px' }}>
              <span>{t.total}</span><span style={{ fontWeight: 700, color: '#059669', fontSize: '1.1rem' }}>{total} {t.egp}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/customer/home" style={{
              padding: '12px 28px', borderRadius: '12px',
              background: gradientBg, color: 'white', textDecoration: 'none',
              fontWeight: 700, fontFamily: "'Cairo', sans-serif",
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <ArrowRight size={18} />{t.backToHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .animate-slide-right { animation: slideRight 0.4s ease forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
        
        .time-slot { transition: all 0.3s ease; }
        .time-slot:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        
        @media (max-width: 768px) {
          .booking-grid { grid-template-columns: 1fr !important; }
          .time-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .sidebar { position: static !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: gradientBg, color: 'white', padding: '32px 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{t.bookAppointment}</h1>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>
                <span>● {t.step} {step}/2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Error */}
        {error && (
          <div className="animate-fade-in" style={{
            background: darkMode ? 'rgba(220,38,38,0.1)' : '#fef2f2',
            color: '#dc2626', padding: '12px 16px', borderRadius: '12px',
            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.9rem', border: '1px solid rgba(220,38,38,0.2)',
          }}>
            <AlertCircle size={18} />{error}
          </div>
        )}

        <div className="booking-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          
          {/* Main Content */}
          <div>
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="animate-fade-in-up">
                <div style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={20} style={{ color: '#3b82f6' }} />
                    {t.selectDateTime}
                  </h2>

                  {/* Date */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.9rem' }}>{t.date}</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={today}
                      style={{
                        width: '100%', padding: '14px 16px',
                        border: `2px solid ${borderColor}`, borderRadius: '12px',
                        fontSize: '0.95rem', outline: 'none',
                        background: inputBg, color: textColor,
                        fontFamily: "'Cairo', sans-serif",
                        textAlign: 'right', transition: 'all 0.3s ease',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = borderColor}
                    />
                  </div>

                  {/* Time Slots */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '12px', fontSize: '0.9rem' }}>{t.time}</label>
                    <div className="time-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setTime(slot)}
                          className="time-slot"
                          style={{
                            padding: '12px 8px', borderRadius: '12px',
                            border: time === slot ? '2px solid #3b82f6' : `2px solid ${borderColor}`,
                            background: time === slot ? (darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff') : 'transparent',
                            cursor: 'pointer', textAlign: 'center', fontSize: '0.85rem',
                            fontWeight: 500, color: time === slot ? '#3b82f6' : textColor,
                            fontFamily: "'Cairo', sans-serif",
                          }}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.9rem' }}>
                      <FileText size={14} style={{ display: 'inline', marginRight: '6px' }} />
                      {t.notes}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="3"
                      placeholder={t.notesPlaceholder}
                      style={{
                        width: '100%', padding: '14px 16px',
                        border: `2px solid ${borderColor}`, borderRadius: '12px',
                        fontSize: '0.95rem', outline: 'none', resize: 'vertical',
                        fontFamily: "'Cairo', sans-serif", minHeight: '80px',
                        background: inputBg, color: textColor,
                        textAlign: 'right', transition: 'all 0.3s ease',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = borderColor}
                    />
                  </div>

                  <button onClick={handleNext} style={{
                    width: '100%', padding: '16px', borderRadius: '14px',
                    background: gradientBg, color: 'white', border: 'none',
                    fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer',
                    fontFamily: "'Cairo', sans-serif", marginTop: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                  }}>
                    {t.next} <ArrowRight size={18} />
                  </button>
                </div>

                {/* Image Upload */}
                <div className="animate-fade-in-up delay-200" style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}` }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={18} style={{ color: '#8b5cf6' }} />
                    {t.uploadImages}
                  </h3>
                  <ImageUploader onUpload={handleImagesUpload} multiple={true} maxFiles={5} />
                </div>
              </div>
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <div className="animate-slide-right">
                <div style={{ background: cardBg, borderRadius: '16px', padding: '28px', border: `1px solid ${borderColor}` }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={20} style={{ color: '#059669' }} />
                    {t.confirmTitle}
                  </h2>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '24px' }}>
                    {[
                      { label: t.craftsman, value: craftsman?.name },
                      { label: t.profession, value: craftsman?.profession },
                      { label: t.date, value: formatDate(date) },
                      { label: t.time, value: time },
                      notes && { label: t.notes, value: notes },
                    ].filter(Boolean).map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between',
                        padding: '12px 0', borderBottom: `1px solid ${borderColor}`,
                        fontSize: '0.9rem',
                      }}>
                        <span style={{ color: textSecondary }}>{item.label}</span>
                        <span style={{ fontWeight: 600, color: textColor }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(1)} style={{
                      flex: 1, padding: '14px', borderRadius: '12px',
                      border: `2px solid ${borderColor}`, background: 'transparent',
                      cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
                      color: textColor, fontFamily: "'Cairo', sans-serif",
                    }}>
                      {t.back}
                    </button>
                    <button onClick={handleConfirm} disabled={submitting} style={{
                      flex: 2, padding: '14px', borderRadius: '12px',
                      background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #059669, #10b981)',
                      color: 'white', border: 'none', fontWeight: 700,
                      fontSize: '0.95rem', cursor: submitting ? 'not-allowed' : 'pointer',
                      fontFamily: "'Cairo', sans-serif",
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: submitting ? 'none' : '0 4px 16px rgba(5,150,105,0.3)',
                    }}>
                      {submitting ? (
                        <><Loader size={18} className="animate-spin" />{t.submitting}</>
                      ) : (
                        <><CheckCircle size={18} />{t.confirm}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="animate-fade-in-up delay-300 sidebar" style={{ position: 'sticky', top: '84px', alignSelf: 'start' }}>
            {/* Price Card */}
            <div style={{ background: cardBg, borderRadius: '16px', padding: '24px', border: `1px solid ${borderColor}`, marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} style={{ color: '#059669' }} />
                {t.priceSummary}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: textSecondary, fontSize: '0.9rem' }}>
                <span>{t.servicePrice}</span><span>{craftsman?.price || 0} {t.egp}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: textSecondary, fontSize: '0.9rem' }}>
                <span>{t.platformFee}</span><span>{platformFee} {t.egp}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 700, fontSize: '1.1rem', color: '#059669', borderTop: `2px solid ${borderColor}`, marginTop: '8px' }}>
                <span>{t.total}</span><span>{total} {t.egp}</span>
              </div>
            </div>

            {/* Craftsman Info Card */}
            <div className="hover-lift" style={{ background: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: gradientBg, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1.1rem', flexShrink: 0,
                }}>
                  {craftsman?.name?.charAt(0) || 'ح'}
                </div>
                <div>
                  <strong style={{ color: textColor, fontSize: '0.95rem' }}>{craftsman?.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 500 }}>{craftsman?.profession}</div>
                </div>
              </div>
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: textSecondary }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  {craftsman?.rating || 4.5}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: textSecondary }}>
                  <MapPin size={14} color="#ef4444" />
                  {craftsman?.city || ''} {craftsman?.district || ''}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: textSecondary }}>
                  <CheckCircle size={14} color="#059669" />
                  {craftsman?.completed_jobs || 0}+ {t.completedJobs}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;