import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  User, Camera, Mail, Phone, MapPin, Home,
  Save, Lock, Trash2, CheckCircle,
  Settings, Heart, Star, Clock
} from 'lucide-react';

const CustomerProfilePage = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [activeTab, setActiveTab] = useState('info');
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    city: '',
    district: '',
    address: '',
  });

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  useEffect(() => {
    const savedProfile = localStorage.getItem('customerProfile');
    if (savedProfile) {
      try { setProfile(prev => ({ ...prev, ...JSON.parse(savedProfile) })); } catch {}
    }
    const savedAvatar = localStorage.getItem('customerAvatar');
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const t = {
    profile: lang === 'ar' ? 'الملف الشخصي' : 'Profile',
    customer: lang === 'ar' ? 'عميل' : 'Customer',
    personalInfo: lang === 'ar' ? 'المعلومات الشخصية' : 'Personal Info',
    settings: lang === 'ar' ? 'الإعدادات' : 'Settings',
    firstName: lang === 'ar' ? 'الاسم الأول' : 'First Name',
    lastName: lang === 'ar' ? 'الاسم الأخير' : 'Last Name',
    email: lang === 'ar' ? 'البريد الإلكتروني' : 'Email',
    phone: lang === 'ar' ? 'رقم الهاتف' : 'Phone',
    city: lang === 'ar' ? 'المدينة' : 'City',
    district: lang === 'ar' ? 'الحي' : 'District',
    address: lang === 'ar' ? 'العنوان التفصيلي' : 'Detailed Address',
    save: lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes',
    saved: lang === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!',
    changePhoto: lang === 'ar' ? 'تغيير الصورة' : 'Change Photo',
    changePassword: lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password',
    currentPassword: lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password',
    newPassword: lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password',
    confirmPassword: lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password',
    change: lang === 'ar' ? 'تغيير' : 'Change',
    deleteAccount: lang === 'ar' ? 'حذف الحساب' : 'Delete Account',
    deleteWarning: lang === 'ar' ? 'عند حذف حسابك، سيتم حذف جميع بياناتك بشكل نهائي ولا يمكن استعادتها.' : 'Deleting your account will permanently remove all your data and cannot be undone.',
    delete: lang === 'ar' ? 'حذف الحساب' : 'Delete Account',
    memberSince: lang === 'ar' ? 'عضو منذ' : 'Member since',
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
        localStorage.setItem('customerAvatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('customerProfile', JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
    textAlign: 'right',
  };

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Hero */}
      <div style={{
        background: darkMode ? 'linear-gradient(160deg, #1e3a8a, #1e40af)' : 'linear-gradient(160deg, #2563eb, #1d4ed8)',
        color: 'white', padding: '48px 0', textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
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
                  {profile.firstName?.charAt(0) || 'ع'}
                </div>
              )}
              <div style={{
                position: 'absolute', bottom: '4px', right: '4px',
                width: '30px', height: '30px', borderRadius: '50%',
                background: '#10b981', display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: '3px solid white', cursor: 'pointer',
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
            {t.customer}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Tabs */}
        <div className="animate-fade-in-up" style={{
          display: 'flex', gap: '8px', marginBottom: '28px',
          background: cardBg, borderRadius: '14px', padding: '6px',
          border: `1px solid ${borderColor}`,
        }}>
          {[
            { id: 'info', label: t.personalInfo, icon: <User size={16} /> },
            { id: 'settings', label: t.settings, icon: <Settings size={16} /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px', borderRadius: '10px',
                border: 'none', cursor: 'pointer', fontWeight: 600,
                fontSize: '0.9rem', fontFamily: "'Cairo', sans-serif",
                transition: 'all 0.3s ease',
                background: activeTab === tab.id ? '#3b82f6' : 'transparent',
                color: activeTab === tab.id ? 'white' : textColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
              {tab.icon}{tab.label}
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
              }}>
                <CheckCircle size={20} />{t.saved}
              </div>
            )}

            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}` }}>
              <form onSubmit={handleSave}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.firstName}</label>
                    <input type="text" name="firstName" value={profile.firstName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.lastName}</label>
                    <input type="text" name="lastName" value={profile.lastName} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.email}</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.phone}</label>
                    <input type="tel" name="phone" value={profile.phone} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.city}</label>
                    <input type="text" name="city" value={profile.city} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.district}</label>
                    <input type="text" name="district" value={profile.district} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>
                    <Home size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    {t.address}
                  </label>
                  <input type="text" name="address" value={profile.address} onChange={handleChange} style={inputStyle}
                    placeholder={lang === 'ar' ? 'رقم العمارة، اسم الشارع...' : 'Building no., street name...'}
                  />
                </div>

                <button type="submit" style={{
                  padding: '14px 32px', background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700,
                  fontSize: '1rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                }}
                onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; }}>
                  <Save size={18} />{t.save}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="animate-fade-in-up">
            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}`, marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} style={{ color: '#3b82f6' }} />{t.changePassword}
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
              <button style={{ padding: '12px 28px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>{t.change}</button>
            </div>

            <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', border: `1px solid ${borderColor}` }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#dc2626', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={18} />{t.deleteAccount}
              </h3>
              <p style={{ color: textSecondary, fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.6 }}>{t.deleteWarning}</p>
              <button style={{ padding: '12px 28px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Cairo', sans-serif" }}>{t.delete}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfilePage;