// src/pages/CustomerSignupPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { 
  User, Mail, Phone, MapPin, Lock, Eye, EyeOff,
  Navigation, Building, Home, ChevronDown,
  CheckCircle, AlertCircle, Sparkles, ArrowRight,
  Loader, Shield, Wrench
} from 'lucide-react';

const egyptianCities = [
  'القاهرة', 'الإسكندرية', 'الجيزة', 'حلوان', 'السادس من أكتوبر',
  'بورسعيد', 'السويس', 'الإسماعيلية', 'المنصورة', 'طنطا',
  'الزقازيق', 'بنها', 'دمنهور', 'كفر الشيخ', 'شبين الكوم',
  'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج',
  'قنا', 'الأقصر', 'أسوان', 'الغردقة', 'شرم الشيخ',
  'دمياط', 'مرسى مطروح', 'العاشر من رمضان'
];

const CustomerSignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMethod, setLocationMethod] = useState('manual');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    password: '',
    confirmPassword: '',
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // Translations
  const t = {
    title: lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account',
    subtitle: lang === 'ar' ? 'أنشئ حساب عميل وابدأ في طلب الخدمات' : 'Create a customer account & start requesting services',
    firstName: lang === 'ar' ? 'الاسم الأول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الأخير' : 'Last Name',
    email: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    city: lang === 'ar' ? 'المدينة' : 'City',
    district: lang === 'ar' ? 'الحي / المنطقة' : 'District / Area',
    selectCity: lang === 'ar' ? 'اختر المدينة' : 'Select City',
    password: lang === 'ar' ? 'كلمة المرور' : 'Password',
    confirmPassword: lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password',
    detectLocation: lang === 'ar' ? 'تحديد موقعي تلقائياً' : 'Detect My Location',
    manualLocation: lang === 'ar' ? 'إدخال الموقع يدوياً' : 'Enter Location Manually',
    locating: lang === 'ar' ? 'جاري تحديد الموقع...' : 'Locating...',
    locationDetected: lang === 'ar' ? 'تم تحديد موقعك بنجاح!' : 'Location detected!',
    locationError: lang === 'ar' ? 'تعذر تحديد الموقع. حاول مرة أخرى أو أدخل يدوياً.' : 'Cannot detect location. Try again or enter manually.',
    submit: lang === 'ar' ? 'إنشاء الحساب' : 'Create Account',
    haveAccount: lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?',
    login: lang === 'ar' ? 'تسجيل الدخول' : 'Login',
    required: lang === 'ar' ? 'مطلوب' : 'Required',
    invalidEmail: lang === 'ar' ? 'بريد إلكتروني غير صالح' : 'Invalid email',
    passwordMin: lang === 'ar' ? '6 أحرف على الأقل' : 'Min 6 characters',
    passwordMismatch: lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match',
    creating: lang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...',
    redirecting: lang === 'ar' ? 'جاري التوجيه...' : 'Redirecting...',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError(t.locationError);
      return;
    }

    setIsLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
        setIsLocating(false);
        setSuccess(t.locationDetected);
        setTimeout(() => setSuccess(''), 3000);
      },
      () => {
        setIsLocating(false);
        setError(t.locationError);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = t.required;
    if (!formData.lastName.trim()) newErrors.lastName = t.required;
    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }
    if (!formData.phone.trim()) newErrors.phone = t.required;
    if (!formData.city && locationMethod === 'manual') newErrors.city = t.required;
    if (!formData.password) {
      newErrors.password = t.required;
    } else if (formData.password.length < 6) {
      newErrors.password = t.passwordMin;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.passwordMismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ تسجيل عميل - باستخدام api.registerClient
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const data = await api.registerClient({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        phone: formData.phone,
      });

      setSuccess(data.message || 'تم إنشاء الحساب بنجاح');
      
      // ✅ حفظ الإيميل للتأكيد
      localStorage.setItem('pendingVerificationEmail', formData.email);
      
      // ✅ توجيه إلى صفحة تأكيد البريد بعد 2 ثانية
      setTimeout(() => {
        navigate('/verify-email');
      }, 2000);

    } catch (err) {
      if (err.errors) {
        // ✅ عرض أخطاء validation من الباك
        const errorMessages = Object.values(err.errors).flat().join(' | ');
        setError(errorMessages);
      } else {
        setError(err.message || 'حدث خطأ في إنشاء الحساب');
      }
    } finally {
      setIsSubmitting(false);
    }
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

  const inputStyle = (fieldError) => ({
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${fieldError ? '#dc2626' : borderColor}`,
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: textColor,
    background: inputBg,
    outline: 'none',
    fontFamily: "'Cairo', sans-serif",
    transition: 'all 0.3s ease',
    textAlign: 'right',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: "'Cairo', sans-serif",
      direction: lang === 'ar' ? 'rtl' : 'ltr',
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
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        @media (max-width: 768px) {
          .signup-card {
            padding: 32px 20px !important;
          }
        }
      `}</style>

      <div className="signup-card" style={{
        background: cardBg,
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: `1px solid ${borderColor}`,
      }}>
        
        {/* Logo/Icon */}
        <div className="animate-fade-in-up" style={{
          textAlign: 'center',
          marginBottom: '24px',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: gradientBg,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            boxShadow: '0 8px 24px rgba(59,130,246,0.3)',
          }}>
            <User size={28} color="white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up delay-100" style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: textColor,
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          {t.title}
        </h1>
        <p className="animate-fade-in-up delay-200" style={{
          fontSize: '0.95rem',
          color: textSecondary,
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          {t.subtitle}
        </p>

        {/* Messages */}
        {error && (
          <div className="animate-fade-in" style={{
            background: darkMode ? 'rgba(220,38,38,0.1)' : '#fee2e2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(220,38,38,0.2)',
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="animate-fade-in" style={{
            background: darkMode ? 'rgba(5,150,105,0.1)' : '#d1fae5',
            color: '#059669',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(5,150,105,0.2)',
          }}>
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          {/* Names */}
          <div className="animate-fade-in-up delay-300" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: textColor,
                marginBottom: '8px',
              }}>
                {t.firstName} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{ ...inputStyle(errors.firstName), paddingRight: '40px' }}
                  placeholder={lang === 'ar' ? 'محمد' : 'Mohamed'}
                />
              </div>
              {errors.firstName && (
                <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.firstName}</span>
              )}
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: textColor,
                marginBottom: '8px',
              }}>
                {t.lastName} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{ ...inputStyle(errors.lastName), paddingRight: '40px' }}
                  placeholder={lang === 'ar' ? 'العلي' : 'Ali'}
                />
              </div>
              {errors.lastName && (
                <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="animate-fade-in-up delay-300" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: textColor,
              marginBottom: '8px',
            }}>
              {t.email} <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{ ...inputStyle(errors.email), paddingRight: '40px' }}
                placeholder="example@email.com"
              />
            </div>
            {errors.email && (
              <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="animate-fade-in-up delay-300" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: textColor,
              marginBottom: '8px',
            }}>
              {t.phone} <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ ...inputStyle(errors.phone), paddingRight: '40px' }}
                placeholder="01xxxxxxxxx"
              />
            </div>
            {errors.phone && (
              <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.phone}</span>
            )}
          </div>

          {/* Location Section */}
          <div className="animate-fade-in-up delay-300" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: textColor,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <MapPin size={16} style={{ color: '#ef4444' }} />
              {lang === 'ar' ? 'الموقع' : 'Location'} <span style={{ color: '#dc2626' }}>*</span>
            </label>

            {/* Location Method Toggle */}
            <div style={{
              display: 'flex',
              background: darkMode ? '#0f172a' : '#f1f5f9',
              borderRadius: '10px',
              padding: '3px',
              marginBottom: '12px',
              gap: '2px',
            }}>
              <button
                type="button"
                onClick={() => setLocationMethod('auto')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  fontFamily: "'Cairo', sans-serif",
                  background: locationMethod === 'auto' ? gradientBg : 'transparent',
                  color: locationMethod === 'auto' ? 'white' : textColor,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <Navigation size={14} />
                {t.detectLocation}
              </button>
              <button
                type="button"
                onClick={() => setLocationMethod('manual')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  fontFamily: "'Cairo', sans-serif",
                  background: locationMethod === 'manual' ? gradientBg : 'transparent',
                  color: locationMethod === 'manual' ? 'white' : textColor,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                }}
              >
                <Building size={14} />
                {t.manualLocation}
              </button>
            </div>

            {/* Auto Detect */}
            {locationMethod === 'auto' && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <button
                  type="button"
                  onClick={detectLocation}
                  disabled={isLocating}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `2px dashed ${formData.latitude ? '#059669' : '#3b82f6'}`,
                    background: formData.latitude ? 'rgba(5,150,105,0.05)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: formData.latitude ? '#059669' : '#3b82f6',
                    fontFamily: "'Cairo', sans-serif",
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isLocating ? (
                    <Loader size={18} className="animate-spin" />
                  ) : formData.latitude ? (
                    <CheckCircle size={18} />
                  ) : (
                    <Navigation size={18} />
                  )}
                  {isLocating ? t.locating : formData.latitude ? t.locationDetected : t.detectLocation}
                </button>
                
                {formData.latitude && (
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: textSecondary }}>
                    📍 Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            )}

            {/* Manual Location */}
            {locationMethod === 'manual' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}>
                <div>
                  <div style={{ position: 'relative' }}>
                    <Building size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none' }} />
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      style={{
                        ...inputStyle(errors.city),
                        paddingRight: '36px',
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="">{t.selectCity}</option>
                      {egyptianCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none' }} />
                  </div>
                  {errors.city && (
                    <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.city}</span>
                  )}
                </div>
                <div>
                  <div style={{ position: 'relative' }}>
                    <Home size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      style={{ ...inputStyle(), paddingRight: '36px' }}
                      placeholder={lang === 'ar' ? 'مثال: مدينة نصر' : 'Ex: Nasr City'}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Passwords */}
          <div className="animate-fade-in-up delay-300" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: textColor,
                marginBottom: '8px',
              }}>
                {t.password} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ ...inputStyle(errors.password), paddingRight: '40px', paddingLeft: '40px' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: textSecondary,
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.password}</span>
              )}
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: textColor,
                marginBottom: '8px',
              }}>
                {t.confirmPassword} <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ ...inputStyle(errors.confirmPassword), paddingRight: '40px', paddingLeft: '40px' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: textSecondary,
                    padding: '4px',
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="animate-fade-in-up delay-300"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: isSubmitting ? '#94a3b8' : gradientBg,
              color: 'white',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: '1rem',
              fontFamily: "'Cairo', sans-serif",
              transition: 'all 0.3s ease',
              boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(59,130,246,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? (
              <>
                <Loader size={18} className="animate-spin" />
                {t.creating}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {t.submit}
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="animate-fade-in-up delay-300" style={{
          textAlign: 'center',
          fontSize: '0.95rem',
          color: textSecondary,
          marginTop: '24px',
        }}>
          {t.haveAccount}{' '}
          <Link
            to="/login"
            style={{
              color: '#3b82f6',
              textDecoration: 'none',
              fontWeight: 700,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.target.style.textDecoration = 'underline'; }}
            onMouseLeave={(e) => { e.target.style.textDecoration = 'none'; }}
          >
            {t.login}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerSignupPage;