// src/pages/CraftsmanSignupPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { 
  MapPin, Navigation, User, Mail, Phone, MessageCircle,
  Lock, Eye, EyeOff, Wrench, Shield, Camera, ChevronDown,
  CheckCircle, AlertCircle, ArrowLeft, Star, Sparkles,
  Briefcase, Building, Home, Loader
} from 'lucide-react';

const professionsList = [
  { name: 'سباك', icon: '🔧' },
  { name: 'كهربائي', icon: '⚡' },
  { name: 'نجار', icon: '🪚' },
  { name: 'نقاش', icon: '🎨' },
  { name: 'فني تكييف', icon: '❄️' },
  { name: 'بناء', icon: '🏗️' },
  { name: 'حداد', icon: '🔩' },
  { name: 'مبلط', icon: '🧱' },
  { name: 'فني ستلايت', icon: '📡' },
  { name: 'ميكانيكي', icon: '🔧' },
  { name: 'عامل نظافة', icon: '🧹' },
  { name: 'مكافحة حشرات', icon: '🐛' },
  { name: 'أخرى', icon: '➕' },
];

const egyptianCities = [
  'القاهرة', 'الإسكندرية', 'الجيزة', 'حلوان', 'السادس من أكتوبر',
  'بورسعيد', 'السويس', 'الإسماعيلية', 'المنصورة', 'طنطا',
  'الزقازيق', 'بنها', 'دمنهور', 'كفر الشيخ', 'شبين الكوم',
  'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج',
  'قنا', 'الأقصر', 'أسوان', 'الغردقة', 'شرم الشيخ',
  'دمياط', 'مرسى مطروح', 'العاشر من رمضان'
];

const CraftsmanSignupPage = () => {
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [lang, setLang] = useState('ar');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMethod, setLocationMethod] = useState('manual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    city: '',
    district: '',
    profession: '',
    customProfession: '',
    password: '',
    confirmPassword: '',
    latitude: null,
    longitude: null,
    idImage: null,
    idImagePreview: null,
  });

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

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
    title: lang === 'ar' ? 'تسجيل حرفي جديد' : 'New Craftsman Registration',
    subtitle: lang === 'ar' ? 'انضم إلى مجتمع الحرفيين وابدأ في استقبال الطلبات' : 'Join the craftsmen community and start receiving requests',
    personalInfo: lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Information',
    locationInfo: lang === 'ar' ? 'الموقع' : 'Location',
    professionInfo: lang === 'ar' ? 'المهنة' : 'Profession',
    securityInfo: lang === 'ar' ? 'تأمين الحساب' : 'Account Security',
    firstName: lang === 'ar' ? 'الاسم الأول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الأخير' : 'Last Name',
    email: lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone Number',
    whatsapp: lang === 'ar' ? 'واتساب' : 'WhatsApp',
    city: lang === 'ar' ? 'المدينة' : 'City',
    district: lang === 'ar' ? 'الحي / المنطقة' : 'District / Area',
    selectCity: lang === 'ar' ? 'اختر المدينة' : 'Select City',
    profession: lang === 'ar' ? 'اختر مهنتك' : 'Select Your Profession',
    customProfession: lang === 'ar' ? 'اكتب مهنتك الجديدة' : 'Write your new profession',
    customProfessionNote: lang === 'ar' ? 'المهنة الجديدة ستظهر بعد موافقة المشرف' : 'New profession will appear after admin approval',
    password: lang === 'ar' ? 'كلمة المرور' : 'Password',
    confirmPassword: lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password',
    uploadID: lang === 'ar' ? 'رفع صورة الهوية' : 'Upload ID Photo',
    uploadText: lang === 'ar' ? 'اسحب وأفلت الصورة هنا أو اضغط للاختيار' : 'Drag & drop image here or click to select',
    uploadHint: lang === 'ar' ? 'JPG, PNG - الحد الأقصى 5MB' : 'JPG, PNG - Max 5MB',
    detectLocation: lang === 'ar' ? 'تحديد موقعي تلقائياً' : 'Detect My Location Automatically',
    manualLocation: lang === 'ar' ? 'إدخال الموقع يدوياً' : 'Enter Location Manually',
    locating: lang === 'ar' ? 'جاري تحديد الموقع...' : 'Locating...',
    locationDetected: lang === 'ar' ? 'تم تحديد موقعك بنجاح!' : 'Location detected successfully!',
    locationError: lang === 'ar' ? 'تعذر تحديد الموقع. الرجاء المحاولة مرة أخرى أو إدخال الموقع يدوياً.' : 'Unable to detect location. Please try again or enter manually.',
    submit: lang === 'ar' ? 'إنشاء الحساب' : 'Create Account',
    haveAccount: lang === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?',
    login: lang === 'ar' ? 'تسجيل الدخول' : 'Login',
    next: lang === 'ar' ? 'التالي' : 'Next',
    back: lang === 'ar' ? 'السابق' : 'Back',
    required: lang === 'ar' ? '*' : '*',
    steps: lang === 'ar' ? ['المعلومات الشخصية', 'الموقع والمهنة', 'تأكيد الحساب'] : ['Personal Info', 'Location & Profession', 'Account Security'],
    creating: lang === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating account...',
    submitting: lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...',
    // ✅ إضافة ترجمة لرسالة التوجيه
    redirecting: lang === 'ar' ? 'جاري التوجيه...' : 'Redirecting...',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'profession') {
      if (value === 'أخرى') {
        setShowCustomInput(true);
        setFormData(prev => ({ ...prev, profession: '', customProfession: '' }));
      } else {
        setShowCustomInput(false);
        setFormData(prev => ({ ...prev, profession: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(lang === 'ar' ? 'حجم الملف كبير جداً. الحد الأقصى 5MB' : 'File too large. Maximum 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          idImage: file,
          idImagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError(lang === 'ar' ? 'متصفحك لا يدعم تحديد الموقع' : 'Your browser does not support geolocation');
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
      (err) => {
        setIsLocating(false);
        setError(t.locationError);
        console.error('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = lang === 'ar' ? 'مطلوب' : 'Required';
      if (!formData.lastName.trim()) newErrors.lastName = lang === 'ar' ? 'مطلوب' : 'Required';
      if (!formData.email.trim()) newErrors.email = lang === 'ar' ? 'مطلوب' : 'Required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = lang === 'ar' ? 'بريد غير صالح' : 'Invalid email';
    }

    if (stepNumber === 2) {
      if (!formData.city) newErrors.city = lang === 'ar' ? 'اختر المدينة' : 'Select city';
      if (!formData.profession && !showCustomInput) newErrors.profession = lang === 'ar' ? 'اختر المهنة' : 'Select profession';
      if (showCustomInput && !formData.customProfession.trim()) newErrors.customProfession = lang === 'ar' ? 'مطلوب' : 'Required';
      // ✅ إضافة التحقق من الصورة في validateStep
      if (!formData.idImage) {
        setError(lang === 'ar' ? '⚠️ يرجى رفع صورة الهوية للمتابعة' : '⚠️ Please upload ID photo to continue');
        return false;
      }
    }

    if (stepNumber === 3) {
      if (!formData.password) newErrors.password = lang === 'ar' ? 'مطلوب' : 'Required';
      else if (formData.password.length < 6) newErrors.password = lang === 'ar' ? '6 أحرف على الأقل' : 'Min 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = lang === 'ar' ? 'غير متطابق' : 'Not matching';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ handleNext المعدل - يتحقق من الصورة في الخطوة 2
  const handleNext = () => {
    // ✅ التحقق من الصورة في الخطوة 2
    if (step === 2) {
      if (!formData.idImage) {
        setError(lang === 'ar' ? '⚠️ يرجى رفع صورة الهوية للمتابعة' : '⚠️ Please upload ID photo to continue');
        return;
      }
    }
    
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  // ✅ تسجيل حرفي - باستخدام api.registerCraftsman
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateStep(3)) return;

    const finalProfession = showCustomInput ? formData.customProfession : formData.profession;

    if (!finalProfession.trim()) {
      setError(lang === 'ar' ? 'يرجى اختيار المهنة' : 'Please select a profession');
      return;
    }

    // ✅ الصورة موجودة (تم التحقق منها في step 2)
    if (!formData.idImage) {
      setError(lang === 'ar' ? 'يرجى رفع صورة الهوية' : 'Please upload ID photo');
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ بناء FormData للباك
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.firstName);
      formDataToSend.append('last_name', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('national_id_front', formData.idImage);
      formDataToSend.append('national_id_back', formData.idImage); // مؤقتاً نفس الصورة
      formDataToSend.append('craft_ids[]', 1); // مؤقتاً ID 1

      const data = await api.registerCraftsman(formDataToSend);

      setSuccess(data.message || 'تم إرسال الطلب بنجاح');
      
      // ✅ حفظ الإيميل للتأكيد
      localStorage.setItem('pendingVerificationEmail', formData.email);
      
      // ✅ توجيه إلى صفحة تأكيد البريد بعد 2 ثانية
      setTimeout(() => {
        navigate('/verify-email');
      }, 2000);

    } catch (err) {
      if (err.errors) {
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
    ? 'linear-gradient(135deg, #1e1b4b, #312e81)'
    : 'linear-gradient(135deg, #1e40af, #3b82f6)';

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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
        
        .animate-slide-right {
          animation: slideRight 0.4s ease forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        
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
        maxWidth: '600px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        border: `1px solid ${borderColor}`,
      }}>
        
        {/* Progress Steps */}
        <div className="animate-fade-in-up" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '36px',
        }}>
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div style={{
                width: s <= step ? '36px' : '32px',
                height: s <= step ? '36px' : '32px',
                borderRadius: '50%',
                background: s <= step ? gradientBg : (darkMode ? '#334155' : '#e2e8f0'),
                color: s <= step ? 'white' : textSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                transition: 'all 0.5s ease',
              }}>
                {s < step ? <CheckCircle size={18} /> : s}
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Step Indicator */}
        <div className="animate-fade-in-up delay-100" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{
            display: 'inline-block',
            padding: '6px 16px',
            borderRadius: '20px',
            background: darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff',
            color: '#3b82f6',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}>
            {t.steps[step - 1]}
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up delay-200" style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: textColor,
          textAlign: 'center',
          marginBottom: '8px',
        }}>
          {t.title}
        </h1>
        <p className="animate-fade-in-up delay-300" style={{
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
          
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
                    {t.firstName} <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={inputStyle(errors.firstName)}
                    placeholder={lang === 'ar' ? 'محمد' : 'Mohamed'}
                  />
                  {errors.firstName && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.firstName}</span>}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
                    {t.lastName} <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={inputStyle(errors.lastName)}
                    placeholder={lang === 'ar' ? 'علي' : 'Ali'}
                  />
                  {errors.lastName && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.lastName}</span>}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
                  {t.email} <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ ...inputStyle(errors.email), paddingRight: '44px' }}
                    placeholder="craftsman@example.com"
                  />
                </div>
                {errors.email && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
                    {t.phone}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ ...inputStyle(), paddingRight: '44px' }}
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
                    {t.whatsapp}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MessageCircle size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      style={{ ...inputStyle(), paddingRight: '44px' }}
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: gradientBg,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginTop: '24px',
                  fontFamily: "'Cairo', sans-serif",
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
                }}
              >
                {t.next}
              </button>
            </div>
          )}

          {/* Step 2: Location & Profession */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3b82f6', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} />
                {t.locationInfo}
              </h3>

              {/* Location Method Toggle */}
              <div style={{
                display: 'flex',
                background: darkMode ? '#0f172a' : '#f1f5f9',
                borderRadius: '12px',
                padding: '4px',
                marginBottom: '20px',
                gap: '4px',
              }}>
                <button
                  type="button"
                  onClick={() => setLocationMethod('auto')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    fontFamily: "'Cairo', sans-serif",
                    background: locationMethod === 'auto' ? gradientBg : 'transparent',
                    color: locationMethod === 'auto' ? 'white' : textColor,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Navigation size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  {t.detectLocation}
                </button>
                <button
                  type="button"
                  onClick={() => setLocationMethod('manual')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    fontFamily: "'Cairo', sans-serif",
                    background: locationMethod === 'manual' ? gradientBg : 'transparent',
                    color: locationMethod === 'manual' ? 'white' : textColor,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Building size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  {t.manualLocation}
                </button>
              </div>

              {/* Auto Detect */}
              {locationMethod === 'auto' && (
                <div style={{ textAlign: 'center', padding: '20px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    style={{
                      padding: '14px 28px',
                      borderRadius: '12px',
                      border: `2px dashed ${formData.latitude ? '#059669' : '#3b82f6'}`,
                      background: formData.latitude ? 'rgba(5,150,105,0.1)' : 'transparent',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: formData.latitude ? '#059669' : '#3b82f6',
                      fontFamily: "'Cairo', sans-serif",
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isLocating ? (
                      <Loader size={20} className="animate-spin" />
                    ) : formData.latitude ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Navigation size={20} />
                    )}
                    {isLocating ? t.locating : formData.latitude ? t.locationDetected : t.detectLocation}
                  </button>
                  
                  {formData.latitude && (
                    <div style={{ marginTop: '12px', fontSize: '0.85rem', color: textSecondary }}>
                      📍 Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)}
                    </div>
                  )}
                </div>
              )}

              {/* Manual Location */}
              {locationMethod === 'manual' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
                      {t.city} <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none' }} />
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        style={{
                          ...inputStyle(errors.city),
                          paddingRight: '44px',
                          appearance: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">{t.selectCity}</option>
                        {egyptianCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none' }} />
                    </div>
                    {errors.city && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.city}</span>}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
                      {t.district}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Home size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        style={{ ...inputStyle(), paddingRight: '44px' }}
                        placeholder={lang === 'ar' ? 'مثال: مدينة نصر' : 'Ex: Nasr City'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Profession Section */}
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3b82f6', marginBottom: '16px', marginTop: '28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={20} />
                {t.professionInfo}
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <Wrench size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none' }} />
                  <select
                    name="profession"
                    onChange={handleChange}
                    value={formData.profession}
                    style={{
                      ...inputStyle(errors.profession),
                      paddingRight: '44px',
                      appearance: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">{t.profession}</option>
                    {professionsList.map(prof => (
                      <option key={prof.name} value={prof.name}>{prof.icon} {prof.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary, pointerEvents: 'none' }} />
                </div>
                {errors.profession && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.profession}</span>}
              </div>

              {showCustomInput && (
                <div style={{
                  background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  marginBottom: '20px',
                }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#3b82f6', marginBottom: '8px' }}>
                    {t.customProfession}
                  </label>
                  <input
                    type="text"
                    name="customProfession"
                    value={formData.customProfession}
                    onChange={handleChange}
                    style={{
                      ...inputStyle(errors.customProfession),
                      background: 'white',
                    }}
                    placeholder={lang === 'ar' ? 'أدخل اسم المهنة الجديدة' : 'Enter new profession name'}
                  />
                  <p style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: '8px' }}>
                    {t.customProfessionNote}
                  </p>
                </div>
              )}

              {/* ID Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${formData.idImagePreview ? '#059669' : borderColor}`,
                  borderRadius: '14px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: formData.idImagePreview ? 'rgba(5,150,105,0.05)' : (darkMode ? '#0f172a' : '#f8fafc'),
                  marginBottom: '8px',
                }}
              >
                {formData.idImagePreview ? (
                  <div>
                    <CheckCircle size={28} style={{ color: '#059669', margin: '0 auto 8px' }} />
                    <p style={{ fontWeight: 600, color: '#059669', fontSize: '0.9rem' }}>
                      {lang === 'ar' ? 'تم رفع الصورة ✓' : 'Image Uploaded ✓'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <Camera size={28} style={{ color: textSecondary, margin: '0 auto 8px' }} />
                    <p style={{ fontWeight: 600, color: textColor, fontSize: '0.9rem' }}>{t.uploadID}</p>
                    <p style={{ fontSize: '0.8rem', color: textSecondary, marginTop: '6px' }}>{t.uploadText}</p>
                  </div>
                )}
                <p style={{ fontSize: '0.75rem', color: textSecondary, marginTop: '10px' }}>{t.uploadHint}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    border: `2px solid ${borderColor}`,
                    background: 'transparent',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: textColor,
                    fontFamily: "'Cairo', sans-serif",
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    background: gradientBg,
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1rem',
                    fontFamily: "'Cairo', sans-serif",
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 16px rgba(59,130,246,0.3)',
                  }}
                >
                  {t.next}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Account Security */}
          {step === 3 && (
            <div className="animate-fade-in-up">
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
                  {t.password} <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ ...inputStyle(errors.password), paddingRight: '44px', paddingLeft: '44px' }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: textSecondary,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: textColor, marginBottom: '8px' }}>
                  {t.confirmPassword} <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ ...inputStyle(errors.confirmPassword), paddingRight: '44px', paddingLeft: '44px' }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: textSecondary,
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    border: `2px solid ${borderColor}`,
                    background: 'transparent',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: textColor,
                    fontFamily: "'Cairo', sans-serif",
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t.back}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 2,
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
              </div>
            </div>
          )}

        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.95rem',
          color: textSecondary,
          marginTop: '28px',
        }}>
          {t.haveAccount}{' '}
          <Link to="/login" style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: 700,
          }}>
            {t.login}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CraftsmanSignupPage;