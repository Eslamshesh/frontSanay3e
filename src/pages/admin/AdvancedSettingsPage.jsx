import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { 
  Settings, Save, Globe, Mail, Phone, Shield, 
  Bell, Image, Clock, DollarSign, Crown, Star,
  Zap, CheckCircle, AlertCircle, Loader, Sparkles,
  Lock, UserCheck, Calendar, Hash
} from 'lucide-react';

const AdvancedSettingsPage = () => {
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    siteName: 'اطلب صنايعي',
    siteDescription: 'منصة ربط العملاء بالحرفيين',
    contactEmail: 'support@atlobsanay3y.com',
    contactPhone: '19555',
    requireEmailVerification: true,
    requireIDVerification: true,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    maxRequestsPerDay: 10,
    maxPhotosPerReview: 5,
    autoApproveCraftsmen: false,
    maintenanceMode: false,
    // اشتراكات
    monthlyPlanPrice: 0,
    yearlyPlanPrice: 0,
    monthlyPlanFeatures: 'ملف شخصي احترافي, استقبال طلبات غير محدودة, ظهور في نتائج البحث, تقييمات ومراجعات, دعم فني',
    yearlyPlanFeatures: 'كل مميزات الشهري, أولوية في نتائج البحث, شارة حرفي موثوق, إحصائيات متقدمة, دعم VIP',
    freeTrialDays: 30,
    subscriptionEnabled: true,
  });

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Load settings from API
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      if (data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch {
      // Keep default settings
    }
    setLoading(false);
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      await api.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Save locally
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setLoading(false);
  };

  // Translations
  const t = {
    title: lang === 'ar' ? 'إعدادات المنصة' : 'Platform Settings',
    save: lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings',
    saved: lang === 'ar' ? '✅ تم حفظ الإعدادات بنجاح!' : '✅ Settings saved successfully!',
    general: lang === 'ar' ? 'عام' : 'General',
    subscriptions: lang === 'ar' ? 'الاشتراكات' : 'Subscriptions',
    security: lang === 'ar' ? 'الأمان' : 'Security',
    notifications: lang === 'ar' ? 'الإشعارات' : 'Notifications',
    limits: lang === 'ar' ? 'الحدود' : 'Limits',
    siteName: lang === 'ar' ? 'اسم المنصة' : 'Site Name',
    siteDescription: lang === 'ar' ? 'وصف المنصة' : 'Site Description',
    contactEmail: lang === 'ar' ? 'البريد الإلكتروني' : 'Contact Email',
    contactPhone: lang === 'ar' ? 'رقم الهاتف' : 'Contact Phone',
    emailVerification: lang === 'ar' ? 'تأكيد البريد الإلكتروني' : 'Email Verification',
    idVerification: lang === 'ar' ? 'التحقق من الهوية' : 'ID Verification',
    autoApprove: lang === 'ar' ? 'قبول تلقائي للحرفيين' : 'Auto-Approve Craftsmen',
    maintenanceMode: lang === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode',
    emailNotif: lang === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications',
    pushNotif: lang === 'ar' ? 'إشعارات المتصفح' : 'Push Notifications',
    smsNotif: lang === 'ar' ? 'إشعارات SMS' : 'SMS Notifications',
    maxRequests: lang === 'ar' ? 'الحد الأقصى للطلبات اليومية' : 'Max Daily Requests',
    maxPhotos: lang === 'ar' ? 'الحد الأقصى لصور التقييم' : 'Max Review Photos',
    // اشتراكات
    subscriptionTitle: lang === 'ar' ? 'إعدادات الاشتراكات' : 'Subscription Settings',
    subscriptionEnabled: lang === 'ar' ? 'تفعيل نظام الاشتراكات' : 'Enable Subscription System',
    monthlyPlan: lang === 'ar' ? 'الباقة الشهرية' : 'Monthly Plan',
    yearlyPlan: lang === 'ar' ? 'الباقة السنوية' : 'Yearly Plan',
    planPrice: lang === 'ar' ? 'السعر (ج.م)' : 'Price (EGP)',
    planFeatures: lang === 'ar' ? 'المميزات (مفصولة بفاصلة)' : 'Features (comma separated)',
    freeTrial: lang === 'ar' ? 'فترة التجربة المجانية (أيام)' : 'Free Trial Period (Days)',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    free: lang === 'ar' ? 'مجاني' : 'Free',
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
  };

  const tabs = [
    { id: 'general', label: t.general, icon: <Settings size={18} /> },
    { id: 'subscriptions', label: t.subscriptions, icon: <Crown size={18} /> },
    { id: 'security', label: t.security, icon: <Shield size={18} /> },
    { id: 'notifications', label: t.notifications, icon: <Bell size={18} /> },
    { id: 'limits', label: t.limits, icon: <Hash size={18} /> },
  ];

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const headerBg = darkMode ? '#0a0f1a' : '#0f172a';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#ffffff';

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    border: `2px solid ${borderColor}`, borderRadius: '10px',
    fontSize: '0.9rem', color: textColor, background: inputBg,
    outline: 'none', fontFamily: "'Cairo', sans-serif",
    transition: 'all 0.3s ease', textAlign: 'right',
  };

  const textareaStyle = {
    ...inputStyle, resize: 'vertical', minHeight: '80px',
  };

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes successPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .animate-slide-down { animation: slideDown 0.3s ease forwards; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-2px); }
        
        .toggle-btn { transition: all 0.3s ease; }
        .toggle-btn:hover { transform: scale(1.05); }
        
        .tab-btn { transition: all 0.3s ease; }
        .tab-btn:hover { transform: translateY(-1px); }
        
        @media (max-width: 768px) {
          .tabs-container { flex-wrap: wrap; gap: 4px; }
          .tab-btn { flex: 1; min-width: 90px; font-size: 0.75rem !important; padding: 10px 8px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: headerBg, color: 'white', padding: '20px 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)' }} />
        
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div className="animate-slide-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings size={20} />
              </div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{t.title}</h1>
            </div>
            <button onClick={handleSave} disabled={loading}
              style={{
                padding: '10px 20px', borderRadius: '10px', border: 'none',
                background: loading ? '#475569' : '#059669', color: 'white',
                fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif",
                display: 'flex', alignItems: 'center', gap: '8px',
                opacity: loading ? 0.7 : 1, transition: 'all 0.3s ease',
              }}>
              {loading ? (
                <><Loader size={16} className="animate-spin" />{t.loading}</>
              ) : (
                <><Save size={16} />{t.save}</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        
        {/* Success Message */}
        {saved && (
          <div className="animate-fade-in" style={{
            background: darkMode ? 'rgba(5,150,105,0.15)' : '#d1fae5',
            color: '#059669', padding: '14px 20px', borderRadius: '12px',
            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px',
            border: '1px solid rgba(5,150,105,0.2)', animation: 'successPulse 2s infinite',
          }}>
            <CheckCircle size={20} />{t.saved}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="animate-fade-in" style={{
            background: darkMode ? 'rgba(220,38,38,0.1)' : '#fef2f2',
            color: '#dc2626', padding: '12px 16px', borderRadius: '12px',
            marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <AlertCircle size={18} />{error}
          </div>
        )}

        {/* Tabs */}
        <div className="animate-fade-in-up tabs-container" style={{
          display: 'flex', gap: '6px', background: cardBg, padding: '6px',
          borderRadius: '14px', marginBottom: '24px', border: `1px solid ${borderColor}`,
        }}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="tab-btn"
              style={{
                flex: 1, padding: '12px 16px', borderRadius: '10px',
                border: 'none', cursor: 'pointer', fontWeight: 600,
                fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif",
                transition: 'all 0.3s ease',
                background: activeTab === tab.id ? '#3b82f6' : 'transparent',
                color: activeTab === tab.id ? 'white' : textColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                animationDelay: `${index * 0.05}s`,
              }}>
              {tab.icon}
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Card */}
        <div className="animate-fade-in-up delay-200" style={{
          background: cardBg, borderRadius: '16px', padding: '28px',
          border: `1px solid ${borderColor}`, boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        }}>
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} style={{ color: '#3b82f6' }} />
                {t.general}
              </h3>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.siteName}</label>
                  <input type="text" value={settings.siteName} onChange={(e) => handleChange('siteName', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>{t.siteDescription}</label>
                  <input type="text" value={settings.siteDescription} onChange={(e) => handleChange('siteDescription', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>
                    <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />{t.contactEmail}
                  </label>
                  <input type="email" value={settings.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>
                    <Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />{t.contactPhone}
                  </label>
                  <input type="tel" value={settings.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* ✅ Subscriptions Tab - NEW */}
          {activeTab === 'subscriptions' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={18} style={{ color: '#f59e0b' }} />
                {t.subscriptionTitle}
              </h3>

              {/* Enable/Disable */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', borderBottom: `1px solid ${borderColor}`,
                marginBottom: '20px',
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: textColor }}>{t.subscriptionEnabled}</span>
                <button onClick={() => handleToggle('subscriptionEnabled')} className="toggle-btn"
                  style={{
                    width: '48px', height: '28px', borderRadius: '14px', border: 'none',
                    cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease',
                    background: settings.subscriptionEnabled ? '#059669' : '#cbd5e1',
                  }}>
                  <span style={{
                    position: 'absolute', top: '3px',
                    left: settings.subscriptionEnabled ? '25px' : '3px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: 'white', transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>

              {settings.subscriptionEnabled && (
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  {/* Monthly Plan */}
                  <div style={{
                    background: darkMode ? 'rgba(59,130,246,0.05)' : '#f8fafc',
                    borderRadius: '14px', padding: '20px', border: `1px solid ${borderColor}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Star size={18} style={{ color: '#3b82f6' }} />
                      <h4 style={{ fontWeight: 700, color: textColor, margin: 0, fontSize: '1rem' }}>{t.monthlyPlan}</h4>
                    </div>
                    
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '6px', fontSize: '0.8rem' }}>
                        <DollarSign size={14} style={{ display: 'inline', marginRight: '4px' }} />{t.planPrice}
                      </label>
                      <input type="number" value={settings.monthlyPlanPrice} onChange={(e) => handleChange('monthlyPlanPrice', e.target.value)}
                        style={inputStyle} min="0" placeholder="0 = مجاني" />
                      {settings.monthlyPlanPrice === 0 && (
                        <span style={{ fontSize: '0.7rem', color: '#059669', marginTop: '4px', display: 'block' }}>✓ {t.free}</span>
                      )}
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '6px', fontSize: '0.8rem' }}>
                        <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />{t.planFeatures}
                      </label>
                      <textarea value={settings.monthlyPlanFeatures} onChange={(e) => handleChange('monthlyPlanFeatures', e.target.value)}
                        style={textareaStyle} rows="3" placeholder="مثال: ملف شخصي، طلبات غير محدودة..." />
                    </div>
                  </div>

                  {/* Yearly Plan */}
                  <div style={{
                    background: darkMode ? 'rgba(245,158,11,0.05)' : '#fffbeb',
                    borderRadius: '14px', padding: '20px', border: `2px solid #f59e0b`,
                    position: 'relative',
                  }}>
                    {/* Best Value Badge */}
                    <span style={{
                      position: 'absolute', top: '-12px', right: '16px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white', padding: '4px 14px', borderRadius: '12px',
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>
                      {lang === 'ar' ? 'أفضل قيمة' : 'Best Value'}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', marginTop: '12px' }}>
                      <Crown size={18} style={{ color: '#f59e0b' }} />
                      <h4 style={{ fontWeight: 700, color: textColor, margin: 0, fontSize: '1rem' }}>{t.yearlyPlan}</h4>
                    </div>
                    
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '6px', fontSize: '0.8rem' }}>
                        <DollarSign size={14} style={{ display: 'inline', marginRight: '4px' }} />{t.planPrice}
                      </label>
                      <input type="number" value={settings.yearlyPlanPrice} onChange={(e) => handleChange('yearlyPlanPrice', e.target.value)}
                        style={{ ...inputStyle, borderColor: '#f59e0b' }} min="0" placeholder="0 = مجاني" />
                      {settings.yearlyPlanPrice === 0 && (
                        <span style={{ fontSize: '0.7rem', color: '#059669', marginTop: '4px', display: 'block' }}>✓ {t.free}</span>
                      )}
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '6px', fontSize: '0.8rem' }}>
                        <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />{t.planFeatures}
                      </label>
                      <textarea value={settings.yearlyPlanFeatures} onChange={(e) => handleChange('yearlyPlanFeatures', e.target.value)}
                        style={{ ...textareaStyle, borderColor: '#f59e0b' }} rows="3" placeholder="مثال: كل مميزات الشهري + أولوية..." />
                    </div>
                  </div>

                  {/* Free Trial */}
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '6px', fontSize: '0.8rem' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />{t.freeTrial}
                    </label>
                    <input type="number" value={settings.freeTrialDays} onChange={(e) => handleChange('freeTrialDays', e.target.value)}
                      style={inputStyle} min="0" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} style={{ color: '#059669' }} />
                {t.security}
              </h3>
              {[
                { field: 'requireEmailVerification', label: t.emailVerification, icon: <Mail size={16} /> },
                { field: 'requireIDVerification', label: t.idVerification, icon: <UserCheck size={16} /> },
                { field: 'autoApproveCraftsmen', label: t.autoApprove, icon: <Zap size={16} /> },
                { field: 'maintenanceMode', label: t.maintenanceMode, icon: <Lock size={16} /> },
              ].map((item, index) => (
                <div key={item.field} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0', borderBottom: index < 3 ? `1px solid ${borderColor}` : 'none',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500, color: textColor }}>
                    <span style={{ color: textSecondary }}>{item.icon}</span>
                    {item.label}
                  </span>
                  <button onClick={() => handleToggle(item.field)} className="toggle-btn"
                    style={{
                      width: '48px', height: '28px', borderRadius: '14px', border: 'none',
                      cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease',
                      background: settings[item.field] ? '#3b82f6' : '#cbd5e1',
                    }}>
                    <span style={{
                      position: 'absolute', top: '3px',
                      left: settings[item.field] ? '25px' : '3px',
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'white', transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={18} style={{ color: '#f59e0b' }} />
                {t.notifications}
              </h3>
              {[
                { field: 'emailNotifications', label: t.emailNotif, icon: <Mail size={16} /> },
                { field: 'pushNotifications', label: t.pushNotif, icon: <Bell size={16} /> },
                { field: 'smsNotifications', label: t.smsNotif, icon: <Phone size={16} /> },
              ].map((item, index) => (
                <div key={item.field} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0', borderBottom: index < 2 ? `1px solid ${borderColor}` : 'none',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 500, color: textColor }}>
                    <span style={{ color: textSecondary }}>{item.icon}</span>
                    {item.label}
                  </span>
                  <button onClick={() => handleToggle(item.field)} className="toggle-btn"
                    style={{
                      width: '48px', height: '28px', borderRadius: '14px', border: 'none',
                      cursor: 'pointer', position: 'relative', transition: 'all 0.3s ease',
                      background: settings[item.field] ? '#3b82f6' : '#cbd5e1',
                    }}>
                    <span style={{
                      position: 'absolute', top: '3px',
                      left: settings[item.field] ? '25px' : '3px',
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'white', transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Limits Tab */}
          {activeTab === 'limits' && (
            <div className="animate-fade-in">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={18} style={{ color: '#8b5cf6' }} />
                {t.limits}
              </h3>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />{t.maxRequests}
                  </label>
                  <input type="number" value={settings.maxRequestsPerDay} onChange={(e) => handleChange('maxRequestsPerDay', e.target.value)}
                    style={inputStyle} min="1" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, color: textColor, marginBottom: '8px', fontSize: '0.85rem' }}>
                    <Image size={14} style={{ display: 'inline', marginRight: '4px' }} />{t.maxPhotos}
                  </label>
                  <input type="number" value={settings.maxPhotosPerReview} onChange={(e) => handleChange('maxPhotosPerReview', e.target.value)}
                    style={inputStyle} min="0" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdvancedSettingsPage;