import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  Shield, Users, Wrench, BarChart3, 
  Settings, UserCheck, Briefcase, LogOut, 
  Grid, ChevronRight, Moon, Sun, Globe,
  Menu, X
} from 'lucide-react';

const AdminLayout = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { admin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [lang, setLang] = useState('ar');
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ اكتشاف الموبايل - محذوف لأنه مش مستخدم
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // قفل القائمة عند تغيير الصفحة
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // ✅ هل دي صفحة الدخول؟
  const isLoginPage = location.pathname === '/admin/login';

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('language', newLang);
    window.dispatchEvent(new Event('languagechange'));
  };

  const sidebarLinks = [
    { to: '/admin/dashboard', label: lang === 'ar' ? 'لوحة التحكم' : 'Dashboard', icon: <Grid size={20} />, color: '#3b82f6' },
    { to: '/admin/users', label: lang === 'ar' ? 'المستخدمين' : 'Users', icon: <Users size={20} />, color: '#6366f1' },
    { to: '/admin/craftsmen', label: lang === 'ar' ? 'الحرفيين' : 'Craftsmen', icon: <Wrench size={20} />, color: '#059669' },
    { to: '/admin/id-verification', label: lang === 'ar' ? 'تحقق الهوية' : 'ID Verification', icon: <UserCheck size={20} />, color: '#f59e0b' },
    { to: '/admin/profession-requests', label: lang === 'ar' ? 'طلبات المهن' : 'Profession Requests', icon: <Briefcase size={20} />, color: '#8b5cf6' },
    { to: '/admin/analytics', label: lang === 'ar' ? 'التحليلات' : 'Analytics', icon: <BarChart3 size={20} />, color: '#ec4899' },
    { to: '/admin/settings', label: lang === 'ar' ? 'الإعدادات' : 'Settings', icon: <Settings size={20} />, color: '#64748b' },
  ];

  const isActive = (path) => location.pathname === path;
  const currentPage = sidebarLinks.find(l => isActive(l.to))?.label || (lang === 'ar' ? 'لوحة التحكم' : 'Dashboard');

  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const headerBg = darkMode ? '#0a0f1a' : '#0f172a';
  const sidebarBg = darkMode ? '#0a0f1a' : '#0f172a';
  const borderColor = darkMode ? '#1e293b' : '#1e293b';

  // لو صفحة دخول - عرض بسيط من غير Header
  if (isLoginPage) {
    return (
      <div style={{ minHeight: '100vh', background: bgColor }}>
        <Outlet />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: "'Cairo', sans-serif", background: bgColor }}>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .dropdown-enter { animation: slideDown 0.3s ease forwards; }
        .overlay-enter { animation: fadeIn 0.3s ease forwards; }
        
        @media (min-width: 769px) {
          .desktop-layout { display: flex !important; }
          .mobile-header { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-layout { display: none !important; }
          .mobile-header { display: flex !important; }
        }
      `}</style>

      {/* 💻 سطح المكتب - Sidebar ثابت جنب المحتوى */}
      <div className="desktop-layout" style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <div style={{
          width: '260px', background: sidebarBg, color: 'white',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
          borderRight: `1px solid ${borderColor}`,
        }}>
          {/* Logo */}
          <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }} onClick={() => navigate('/admin/dashboard')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{lang === 'ar' ? 'منطقة المشرف' : 'Admin Area'}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{lang === 'ar' ? 'مشرف النظام' : 'System Admin'}</div>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{admin?.name || 'Admin'}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{lang === 'ar' ? 'مشرف النظام' : 'System Admin'}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
            {sidebarLinks.map((link, index) => (
              <button key={index} onClick={() => navigate(link.to)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', borderRadius: '10px', border: 'none',
                  cursor: 'pointer', transition: 'all 0.3s ease',
                  background: isActive(link.to) ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: isActive(link.to) ? '#60a5fa' : 'rgba(255,255,255,0.7)',
                  fontSize: '0.9rem', fontWeight: 500,
                  fontFamily: "'Cairo', sans-serif", textAlign: 'right',
                  marginBottom: '4px',
                }}
                onMouseEnter={(e) => { if (!isActive(link.to)) e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (!isActive(link.to)) e.target.style.background = 'transparent'; }}
              >
                {link.icon}{link.label}
                {isActive(link.to) && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={toggleLang} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", marginBottom: '6px' }}>
              <Globe size={18} />{lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <button onClick={toggleTheme} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", marginBottom: '6px' }}>
              {darkMode ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} />}
              {darkMode ? (lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (lang === 'ar' ? 'الوضع الليلي' : 'Dark Mode')}
            </button>
            <button onClick={adminLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.15)', color: '#ef4444', fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif" }}>
              <LogOut size={18} />{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>

      {/* 📱 موبايل - Header + Dropdown منسدل */}
      <div className="mobile-header" style={{ display: 'none', flexDirection: 'column', flex: 1 }}>
        
        {/* Top Header Bar */}
        <div style={{
          background: headerBg, color: 'white', padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${borderColor}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{currentPage}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{admin?.name || 'Admin'}</div>
            </div>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', padding: '8px 14px', borderRadius: '10px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif",
            }}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
            {lang === 'ar' ? 'القائمة' : 'Menu'}
          </button>
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <>
            <div onClick={() => setMenuOpen(false)} className="overlay-enter"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 90 }} />

            <div className="dropdown-enter" style={{
              background: sidebarBg, color: 'white',
              position: 'absolute', top: '57px', left: 0, right: 0,
              zIndex: 100, maxHeight: '80vh', overflowY: 'auto',
              borderBottom: `2px solid ${borderColor}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{admin?.name || 'Admin'}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{lang === 'ar' ? 'مشرف النظام' : 'System Admin'}</div>
                </div>
              </div>

              <nav style={{ padding: '10px' }}>
                {sidebarLinks.map((link, index) => (
                  <button key={index} onClick={() => navigate(link.to)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 18px', borderRadius: '12px', border: 'none',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      background: isActive(link.to) ? 'rgba(59,130,246,0.2)' : 'transparent',
                      color: isActive(link.to) ? '#60a5fa' : 'rgba(255,255,255,0.85)',
                      fontSize: '0.95rem', fontWeight: isActive(link.to) ? 600 : 400,
                      fontFamily: "'Cairo', sans-serif", textAlign: 'right',
                      marginBottom: '4px',
                    }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: isActive(link.to) ? `${link.color}30` : 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isActive(link.to) ? link.color : 'rgba(255,255,255,0.6)',
                    }}>
                      {link.icon}
                    </div>
                    <span style={{ flex: 1 }}>{link.label}</span>
                    {isActive(link.to) && <ChevronRight size={18} style={{ color: link.color }} />}
                  </button>
                ))}
              </nav>

              <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
                <button onClick={toggleLang} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
                  <Globe size={16} />{lang === 'ar' ? 'EN' : 'AR'}
                </button>
                <button onClick={toggleTheme} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
                  {darkMode ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} />}
                  {darkMode ? (lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'ar' ? 'ليلي' : 'Dark')}
                </button>
                <button onClick={adminLogout} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', cursor: 'pointer', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif" }}>
                  <LogOut size={16} />{lang === 'ar' ? 'خروج' : 'Exit'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Page Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;