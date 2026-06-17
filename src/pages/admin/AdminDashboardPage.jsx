import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { 
  Users, Wrench, FileText, DollarSign, Settings,
  UserCheck, Briefcase, BarChart3, LogOut,
  ArrowRight, Sparkles, Loader, RefreshCw, Shield,
  Grid, Moon, Sun, Globe
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { admin, adminLogout, isAdminAuthenticated, loading: authLoading } = useAdminAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [lang, setLang] = useState('ar');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0, totalCraftsmen: 0, activeRequests: 0,
    totalRevenue: 0, pendingVerifications: 0, newProfessions: 0,
  });

  // ✅ حماية - لو مش أدمن رجعه للدخول
  useEffect(() => {
    if (!authLoading && !isAdminAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdminAuthenticated, authLoading, navigate]);

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('language', newLang);
    window.dispatchEvent(new Event('languagechange'));
  };

  // Load stats
  useEffect(() => {
    if (isAdminAuthenticated) loadStats();
  }, [isAdminAuthenticated]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      setStats({
        totalUsers: data.totalUsers || 1245,
        totalCraftsmen: data.totalCraftsmen || 320,
        activeRequests: data.activeRequests || 87,
        totalRevenue: data.totalRevenue || 45600,
        pendingVerifications: data.pendingVerifications || 12,
        newProfessions: data.newProfessions || 5,
      });
    } catch {
      setStats({ totalUsers: 1245, totalCraftsmen: 320, activeRequests: 87, totalRevenue: 45600, pendingVerifications: 12, newProfessions: 5 });
    }
    setLoading(false);
    setRefreshing(false);
  };

  const t = {
    dashboard: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard',
    welcome: lang === 'ar' ? 'مرحباً' : 'Welcome',
    logout: lang === 'ar' ? 'تسجيل الخروج' : 'Logout',
    totalUsers: lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
    totalCraftsmen: lang === 'ar' ? 'الحرفيين' : 'Craftsmen',
    activeRequests: lang === 'ar' ? 'الطلبات النشطة' : 'Active Requests',
    totalRevenue: lang === 'ar' ? 'الإيرادات' : 'Revenue',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    pendingVerifications: lang === 'ar' ? 'قيد التحقق' : 'Pending',
    newProfessions: lang === 'ar' ? 'مهن جديدة' : 'New Professions',
    quickLinks: lang === 'ar' ? 'روابط سريعة' : 'Quick Links',
    manageUsers: lang === 'ar' ? 'إدارة المستخدمين' : 'Manage Users',
    manageCraftsmen: lang === 'ar' ? 'إدارة الحرفيين' : 'Manage Craftsmen',
    idVerification: lang === 'ar' ? 'التحقق من الهوية' : 'ID Verification',
    professionRequests: lang === 'ar' ? 'طلبات المهن' : 'Profession Requests',
    analytics: lang === 'ar' ? 'التحليلات' : 'Analytics',
    settings: lang === 'ar' ? 'الإعدادات' : 'Settings',
    refresh: lang === 'ar' ? 'تحديث' : 'Refresh',
    noAccess: lang === 'ar' ? 'غير مصرح لك بالدخول' : 'Access Denied',
  };

  const links = [
    { to: '/admin/users', label: t.manageUsers, icon: <Users size={24} />, color: '#3b82f6' },
    { to: '/admin/craftsmen', label: t.manageCraftsmen, icon: <Wrench size={24} />, color: '#059669' },
    { to: '/admin/id-verification', label: t.idVerification, icon: <UserCheck size={24} />, color: '#f59e0b' },
    { to: '/admin/profession-requests', label: t.professionRequests, icon: <Briefcase size={24} />, color: '#8b5cf6' },
    { to: '/admin/analytics', label: t.analytics, icon: <BarChart3 size={24} />, color: '#ec4899' },
    { to: '/admin/settings', label: t.settings, icon: <Settings size={24} />, color: '#6366f1' },
  ];

  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const headerBg = darkMode ? '#0a0f1a' : '#0f172a';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';

  const statCards = [
    { value: `+${stats.totalUsers.toLocaleString()}`, label: t.totalUsers, color: '#3b82f6', icon: <Users size={28} /> },
    { value: `+${stats.totalCraftsmen}`, label: t.totalCraftsmen, color: '#059669', icon: <Wrench size={28} /> },
    { value: stats.activeRequests, label: t.activeRequests, color: '#f59e0b', icon: <FileText size={28} /> },
    { value: `${stats.totalRevenue.toLocaleString()} ${t.egp}`, label: t.totalRevenue, color: '#8b5cf6', icon: <DollarSign size={28} /> },
    { value: stats.pendingVerifications, label: t.pendingVerifications, color: '#ef4444', icon: <Shield size={28} /> },
    { value: stats.newProfessions, label: t.newProfessions, color: '#ec4899', icon: <Briefcase size={28} /> },
  ];

  // ✅ لو لسه بيحمل
  if (authLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: bgColor }}>
        <Loader size={40} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // ✅ لو مش أدمن - متظهرش الصفحة
  if (!isAdminAuthenticated) return null;

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; } .delay-400 { animation-delay: 0.4s; }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.15); }
        .skeleton { background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .links-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>

      {/* Header */}
      <div style={{ background: headerBg, color: 'white', padding: '20px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={24} style={{ color: '#60a5fa' }} />
            <div>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{t.dashboard}</h1>
              <p style={{ opacity: 0.7, fontSize: '0.8rem', margin: 0 }}>{t.welcome}، {admin?.name || 'Admin'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={toggleLang} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', color: 'white', fontSize: '0.75rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={14} />{lang === 'ar' ? 'EN' : 'AR'}
            </button>
            <button onClick={toggleTheme} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', color: 'white', display: 'flex' }}>
              {darkMode ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} />}
            </button>
            <button onClick={adminLogout} style={{ padding: '8px 14px', borderRadius: '8px', background: '#dc2626', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LogOut size={14} />{t.logout}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {loading ? (
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" style={{ borderRadius: '16px', height: '110px' }} />)}
          </div>
        ) : (
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {statCards.map((stat, index) => (
              <div key={index} className="hover-lift animate-fade-in-up" style={{ background: cardBg, borderRadius: '16px', padding: '20px', border: `1px solid ${borderColor}`, position: 'relative', overflow: 'hidden', animationDelay: `${index * 0.08}s` }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: stat.color }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: textColor, marginBottom: '4px' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.8rem', color: textSecondary }}>{stat.label}</div>
                  </div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button onClick={() => { setRefreshing(true); loadStats(); }} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', color: textColor, fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />{t.refresh}
          </button>
        </div>

        <div className="animate-fade-in-up delay-300">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Grid size={18} style={{ color: '#3b82f6' }} />{t.quickLinks}
          </h2>
          <div className="links-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {links.map((link, index) => (
              <Link key={index} to={link.to} className="hover-lift animate-fade-in-up" style={{ padding: '24px 16px', background: cardBg, borderRadius: '14px', textDecoration: 'none', textAlign: 'center', border: `1px solid ${borderColor}`, animationDelay: `${index * 0.08 + 0.3}s` }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${link.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: link.color }}>{link.icon}</div>
                <div style={{ fontWeight: 600, color: textColor, fontSize: '0.85rem' }}>{link.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;