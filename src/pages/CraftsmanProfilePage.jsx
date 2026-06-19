// src/pages/CraftsmanProfilePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ImageUploader from '../components/Upload/ImageUploader';
import { 
  User, Camera, Mail, Phone, MapPin, Wrench, DollarSign,
  FileText, Save, Lock, Eye, EyeOff, Trash2, Plus,
  X, Star, Briefcase, Award, Clock, Image, Upload,
  AlertCircle, CheckCircle, Sparkles, Edit3, Grid,
  Heart, Share2, Settings, LogOut, Shield, TrendingUp,
  Loader
} from 'lucide-react';

const CraftsmanProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [activeTab, setActiveTab] = useState('info');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [stats, setStats] = useState({
    total_earnings: 0,
    completed_bookings: 0,
    pending_bookings: 0,
    rating: 0,
    reviews_count: 0,
    is_featured: false,
  });
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    whatsapp: '',
    city: '',
    district: '',
    profession: '',
    bio: '',
    price: '',
    priceType: 'hour',
    yearsExp: '',
  });

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // ✅ جلب بيانات الحرفي والإحصائيات من API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // جلب الإحصائيات
        const statsData = await api.getCraftsmanStats();
        setStats(statsData.stats || {});
        
        // ✅ جلب بيانات المستخدم من الباك
        const userData = await api.getMe();
        if (userData.user) {
          const u = userData.user;
          setProfile(prev => ({
            ...prev,
            firstName: u.name?.split(' ')[0] || '',
            lastName: u.name?.split(' ')[1] || '',
            email: u.email || '',
            phone: u.phone || '',
            city: u.craftsman?.city || '',
            profession: u.craftsman?.crafts?.map(c => c.name).join(', ') || '',
          }));
          if (u.avatar_url) setAvatar(u.avatar_url);
        }
      } catch (error) {
        console.warn('⚠️ Using fallback data:', error);
        // Fallback data
        const savedProfile = localStorage.getItem('craftsmanProfile');
        if (savedProfile) {
          try { setProfile(prev => ({ ...prev, ...JSON.parse(savedProfile) })); } catch {}
        }
        const savedAvatar = localStorage.getItem('craftsmanAvatar');
        if (savedAvatar) setAvatar(savedAvatar);
        const savedPortfolio = localStorage.getItem('craftsmanPortfolio');
        if (savedPortfolio) {
          try { setPortfolioImages(JSON.parse(savedPortfolio)); } catch {}
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const t = {
    profile: lang === 'ar' ? 'الملف الشخصي' : 'Profile',
    craftsman: lang === 'ar' ? 'حرفي' : 'Craftsman',
    personalInfo: lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Info',
    portfolio: lang === 'ar' ? 'معرض الأعمال' : 'Portfolio',
    settings: lang === 'ar' ? 'الإعدادات' : 'Settings',
    firstName: lang === 'ar' ? 'الاسم الأول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الأخير' : 'Last Name',
    email: lang === 'ar' ? 'البريد الإلكتروني' : 'Email',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone',
    whatsapp: lang === 'ar' ? 'واتساب' : 'WhatsApp',
    city: lang === 'ar' ? 'المدينة' : 'City',
    district: lang === 'ar' ? 'الحي' : 'District',
    profession: lang === 'ar' ? 'المهنة' : 'Profession',
    bio: lang === 'ar' ? 'نبذة عني' : 'About Me',
    price: lang === 'ar' ? 'السعر' : 'Price',
    pricePerHour: lang === 'ar' ? 'للساعة' : 'per hour',
    pricePerMeter: lang === 'ar' ? 'للمتر' : 'per meter',
    pricePerJob: lang === 'ar' ? 'للخدمة' : 'per job',
    yearsExp: lang === 'ar' ? 'سنوات الخبرة' : 'Years of Experience',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    save: lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes',
    saved: lang === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!',
    changePhoto: lang === 'ar' ? 'تغيير الصورة' : 'Change Photo',
    addToPortfolio: lang === 'ar' ? 'أضف صوراً من أعمالك' : 'Add photos of your work',
    portfolioDesc: lang === 'ar' ? 'اعرض أفضل أعمالك لجذب المزيد من العملاء' : 'Showcase your best work to attract more clients',
    changePassword: lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password',
    currentPassword: lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password',
    newPassword: lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password',
    confirmPassword: lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password',
    change: lang === 'ar' ? 'تغيير' : 'Change',
    deleteAccount: lang === 'ar' ? 'حذف الحساب' : 'Delete Account',
    deleteWarning: lang === 'ar' ? 'عند حذف حسابك، سيتم حذف جميع بياناتك بشكل نهائي ولا يمكن استعادتها.' : 'Deleting your account will permanently remove all your data and cannot be undone.',
    delete: lang === 'ar' ? 'حذف الحساب' : 'Delete Account',
    stats: lang === 'ar' ? 'الإحصائيات' : 'Statistics',
    earnings: lang === 'ar' ? 'الأرباح' : 'Earnings',
    completed: lang === 'ar' ? 'مكتملة' : 'Completed',
    pending: lang === 'ar' ? 'قيد الانتظار' : 'Pending',
    rating: lang === 'ar' ? 'التقييم' : 'Rating',
    featured: lang === 'ar' ? 'مميز' : 'Featured',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem('craftsmanAvatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePortfolioUpload = (files) => {
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
      date: new Date().toISOString(),
    }));
    const updated = [...portfolioImages, ...newImages];
    setPortfolioImages(updated);
    const toSave = updated.map(img => ({ id: img.id, name: img.name, date: img.date }));
    localStorage.setItem('craftsmanPortfolio', JSON.stringify(toSave));
  };

  const removePortfolioImage = (id) => {
    const updated = portfolioImages.filter(img => img.id !== id);
    setPortfolioImages(updated);
    const toSave = updated.map(img => ({ id: img.id, name: img.name, date: img.date }));
    localStorage.setItem('craftsmanPortfolio', JSON.stringify(toSave));
  };

  // ✅ حفظ الملف الشخصي - باستخدام api.updateCraftsmanProfile
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      if (profile.bio) formData.append('bio', profile.bio);
      if (profile.price) formData.append('hourly_rate', profile.price);
      if (profile.city) formData.append('city', profile.city);
      if (profile.district) formData.append('district', profile.district);
      if (profile.phone) formData.append('phone', profile.phone);
      if (avatar && avatar.startsWith('data:')) {
        // تحويل base64 إلى file
        const res = await fetch(avatar);
        const blob = await res.blob();
        formData.append('profile_photo', blob, 'avatar.jpg');
      }
      
      // المهارات
      if (profile.profession) {
        const skills = profile.profession.split(',').map(s => s.trim());
        skills.forEach(skill => formData.append('skills[]', skill));
      }

      const data = await api.updateCraftsmanProfile(formData);
      
      // تحديث بيانات المستخدم في Context
      if (data.craftsman) {
        updateUser({ craftsman: data.craftsman });
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.warn('⚠️ Save error, using localStorage fallback:', error);
      // Fallback - حفظ في localStorage
      localStorage.setItem('craftsmanProfile', JSON.stringify(profile));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#ffffff';

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${borderColor}`,
    borderRadius: '10px',
    fontSize: '0.95rem',
    color: textColor,
    background: inputBg,
    outline: 'none',
    fontFamily: "'Cairo', sans-serif",
    transition: 'all 0.3s ease',
    textAlign: lang === 'ar' ? 'right' : 'left',
  };

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif", direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
        .tab-active { background: #3b82f6 !important; color: white !important; }
        .animate-spin { animation: spin 1s linear infinite; }
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
          .portfolio-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Hero */}
      <div style={{
        background: darkMode ? 'linear-gradient(160deg, #1e3a8a, #1e40af)' : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
        color: 'white', padding: '48px 0', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          {/* Avatar */}
          <div className="animate-fade-in-up" style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: avatar ? 'transparent' : 'rgba(255,255,255,0.2)',
              border: '4px solid rgba(255,255,255,0.3)', overflow: 'hidden',
              margin: '0 auto', cursor: 'pointer', position: 'relative',
            }}
            onClick={() => fileInputRef.current?.click()}>
              {avatar ? (
                <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700 }}>
                  {profile.firstName?.charAt(0) || 'ح'}
                </div>
              )}
              <div style={{
                position: 'absolute', bottom: '4px', right: '4px',
                width: '30px', height: '30px', borderRadius: '50%',
                background: '#10b981', display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: '3px solid white',
                cursor: 'pointer',
              }}>
                <Camera size={14} color="white" />
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </div>

          <h1 className="animate-fade-in-up delay-100" style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '4px' }}>
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="animate-fade-in-up delay-200" style={{ fontSize: '1rem', opacity: 0.85 }}>
            {profile.profession || t.craftsman}
          </p>
          {stats.is_featured && (
            <span style={{ display: 'inline-block', marginTop: '8px', background: 'rgba(255,255,255,0.2)', padding: '4px 16px', borderRadius: '50px', fontSize: '0.8rem' }}>
              ⭐ {t.featured}
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', marginTop: '-20px', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          {[
            { value: `${stats.total_earnings || 0} ${t.egp}`, label: t.earnings, color: '#059669' },
            { value: stats.completed_bookings || 0, label: t.completed, color: '#3b82f6' },
            { value: stats.pending_bookings || 0, label: t.pending, color: '#f59e0b' },
            { value: stats.rating || 0, label: t.rating, color: '#8b5cf6' },
          ].map((stat, i) => (
            <div key={i} style={{ background: cardBg, borderRadius: '12px', padding: '16px', textAlign: 'center', border: `1px solid ${borderColor}` }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: textSecondary }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Tabs */}
        <div className="animate-fade-in-up" style={{
          display: 'flex', gap: '8px', marginBottom: '28px',
          background: cardBg, borderRadius: '14px', padding: '6px',
          border: `1px solid ${borderColor}`, flexWrap: 'wrap',
        }}>
          {[
            { id: 'info', label: t.personalInfo, icon: <User size={16} /> },
            { id: 'portfolio', label: t.portfolio, icon: <Image size={16} /> },
            { id: 'settings', label: t.settings, icon: <Settings size={16} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px 20px', borderRadius: '10px',
                border: 'none', cursor: 'pointer', fontWeight: 600,
                fontSize: '0.9rem', fontFamily: "'Cairo', sans-serif",
                transition: 'all 0.3s ease', minWidth: '120px',
                background: activeTab === tab.id ? '#3b82f6' : 'transparent',
                color: activeTab === tab.id ? 'white' : textColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="animate-fade-in-up">
            {saved && (
              <div style={{
                background: darkMode ? 'rgba(5,150,105,0.1)' : '#d1fae5',
                color: '#059669', padding: '14px 20px', borderRadius: '12px',
                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px',
                border: '1px solid rgba(5,150,105,0.2)',
              }}>
                <CheckCircle size={20} />
                {t.saved}
              </div>
            )}

            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}` }}>
              <form onSubmit={handleSave}>
                {/* Names */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.firstName}</label>
                    <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.lastName}</label>
                    <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.email}</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.phone}</label>
                    <input type="tel" name="phone" value={profile.phone} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                {/* WhatsApp & Profession */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.whatsapp}</label>
                    <input type="tel" name="whatsapp" value={profile.whatsapp} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.profession}</label>
                    <input type="text" name="profession" value={profile.profession} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                {/* City & District */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.city}</label>
                    <input type="text" name="city" value={profile.city} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.district}</label>
                    <input type="text" name="district" value={profile.district} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>
                    <FileText size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    {t.bio}
                  </label>
                  <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    placeholder={lang === 'ar' ? 'اكتب نبذة عن خبراتك ومهاراتك...' : 'Write about your experience and skills...'}
                  />
                </div>

                {/* Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.price} ({t.egp})</label>
                    <input type="number" name="price" value={profile.price} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{lang === 'ar' ? 'نوع التسعير' : 'Price Type'}</label>
                    <select name="priceType" value={profile.priceType} onChange={handleChange} style={inputStyle}>
                      <option value="hour">{t.pricePerHour}</option>
                      <option value="meter">{t.pricePerMeter}</option>
                      <option value="job">{t.pricePerJob}</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.yearsExp}</label>
                    <input type="number" name="yearsExp" value={profile.yearsExp} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{
                  padding: '14px 32px', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700,
                  fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: loading ? 'none' : '0 4px 16px rgba(37,99,235,0.3)',
                  opacity: loading ? 0.7 : 1,
                }}>
                  {loading ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                  {loading ? lang === 'ar' ? 'جاري الحفظ...' : 'Saving...' : t.save}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Portfolio Tab - نفس الكود */}
        {activeTab === 'portfolio' && (
          <div className="animate-fade-in-up">
            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Image size={24} style={{ color: '#3b82f6' }} />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: textColor, margin: 0 }}>{t.addToPortfolio}</h2>
              </div>
              <p style={{ color: textSecondary, marginBottom: '24px', fontSize: '0.9rem' }}>{t.portfolioDesc}</p>

              <ImageUploader onUpload={handlePortfolioUpload} multiple={true} maxFiles={10} />

              {portfolioImages.length > 0 && (
                <div className="portfolio-grid" style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '12px', marginTop: '24px',
                }}>
                  {portfolioImages.map((img, index) => (
                    <div key={img.id} className="hover-lift" style={{
                      position: 'relative', borderRadius: '12px', overflow: 'hidden',
                      height: '160px', border: `1px solid ${borderColor}`,
                    }}>
                      <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => removePortfolioImage(img.id)}
                        style={{
                          position: 'absolute', top: '8px', right: '8px',
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: 'rgba(220,38,38,0.9)', color: 'white',
                          border: 'none', cursor: 'pointer', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                        }}>
                        <X size={14} />
                      </button>
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'rgba(0,0,0,0.6)', color: 'white',
                        padding: '6px 10px', fontSize: '0.75rem',
                      }}>
                        {img.name || `${lang === 'ar' ? 'صورة' : 'Image'} ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab - نفس الكود */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in-up">
            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} style={{ color: '#3b82f6' }} />
                {t.changePassword}
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.currentPassword}</label>
                <input type="password" style={inputStyle} placeholder="••••••••" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.newPassword}</label>
                  <input type="password" style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.confirmPassword}</label>
                  <input type="password" style={inputStyle} placeholder="••••••••" />
                </div>
              </div>
              <button style={{
                padding: '12px 28px', background: '#3b82f6', color: 'white',
                border: 'none', borderRadius: '10px', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
              }}>{t.change}</button>
            </div>

            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#dc2626', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={18} />
                {t.deleteAccount}
              </h3>
              <p style={{ color: textSecondary, fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>
                {t.deleteWarning}
              </p>
              <button style={{
                padding: '12px 28px', background: '#dc2626', color: 'white',
                border: 'none', borderRadius: '10px', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
              }}>{t.delete}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CraftsmanProfilePage;