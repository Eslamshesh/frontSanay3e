import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Shield, User, Lock, Eye, EyeOff,
  Sparkles, Wrench, AlertCircle, CheckCircle,
  Loader, Moon, Sun, Globe, ArrowLeft
} from 'lucide-react';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [lang, setLang] = useState('ar');
  
  const { adminLogin, isAdminAuthenticated, loading } = useAdminAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // ✅ لو الأدمن مسجل بالفعل - حوله فوراً للوحة التحكم
  useEffect(() => {
    if (!loading && isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdminAuthenticated, loading, navigate]);

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

  const t = {
    title: lang === 'ar' ? 'اطلب صنايعي' : 'Atlob Sanay3y',
    subtitle: lang === 'ar' ? 'لوحة تحكم المشرف' : 'Admin Dashboard',
    username: lang === 'ar' ? 'اسم المستخدم' : 'Username',
    password: lang === 'ar' ? 'كلمة المرور' : 'Password',
    login: lang === 'ar' ? 'دخول' : 'Login',
    loggingIn: lang === 'ar' ? 'جاري الدخول...' : 'Logging in...',
    backToSite: lang === 'ar' ? 'العودة للموقع' : 'Back to Site',
    fillAllFields: lang === 'ar' ? 'يرجى إدخال اسم المستخدم وكلمة المرور' : 'Please enter username and password',
    invalidCredentials: lang === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password',
    success: lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Login successful!',
    redirecting: lang === 'ar' ? 'جاري التحويل...' : 'Redirecting...',
    adminPanel: lang === 'ar' ? 'منطقة المشرفين' : 'Admin Area',
    secureLogin: lang === 'ar' ? 'دخول آمن ومشفر' : 'Secure & Encrypted Login',
    hint: lang === 'ar' ? 'التلميح: admin / admin123' : 'Hint: admin / admin123',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(t.fillAllFields);
      return;
    }

    setLoginLoading(true);

    const result = await adminLogin(username, password);
    
    if (result.success) {
      setSuccess(true);
      // ✅ تحويل مباشر للوحة التحكم
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 1500);
    } else {
      setError(t.invalidCredentials);
      setLoginLoading(false);
    }
  };

  // ✅ لو لسه بيحمل
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <Loader size={40} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  // ✅ لو مسجل بالفعل - متظهرش صفحة الدخول
  if (isAdminAuthenticated) return null;

  const bgColor = darkMode ? '#0a0f1a' : '#0f172a';
  const cardBg = darkMode ? '#1a1f2e' : '#1e293b';
  const inputBg = darkMode ? '#0d1117' : '#0f172a';
  const borderColor = darkMode ? '#2d3548' : '#334155';
  const textColor = '#f1f5f9';
  const textSecondary = '#94a3b8';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(circle at 50% 50%, ${darkMode ? '#1a1f2e' : '#1e293b'}, ${bgColor})`,
      padding: '40px 20px', fontFamily: "'Cairo', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes successBounce { 0% { transform: scale(0); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-success { animation: successBounce 0.6s ease forwards; }
        .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; } .delay-400 { animation-delay: 0.4s; }
        .input-focus:focus-within { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        @media (max-width: 480px) { .login-card { padding: 32px 20px !important; border-radius: 20px !important; } }
      `}</style>

      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(59,130,246,0.05)', filter: 'blur(60px)', animation: 'float 4s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(139,92,246,0.05)', filter: 'blur(60px)', animation: 'float 5s ease-in-out infinite 1s' }} />

      {/* Top Bar */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', display: 'flex', gap: '8px', zIndex: 10 }}>
        <button onClick={toggleLang} style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'white', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(10px)' }}>
          <Globe size={14} />{lang === 'ar' ? 'EN' : 'AR'}
        </button>
        <button onClick={toggleTheme} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          {darkMode ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} />}
        </button>
      </div>

      {/* Success Overlay */}
      {success && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="animate-success" style={{ background: cardBg, borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '1px solid rgba(5,150,105,0.3)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', animation: 'pulse 2s infinite' }}>
              <CheckCircle size={40} color="white" />
            </div>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', fontFamily: "'Cairo', sans-serif", marginBottom: '4px' }}>{t.success}</p>
            <p style={{ fontSize: '0.9rem', color: textSecondary, fontFamily: "'Cairo', sans-serif" }}>{t.redirecting}</p>
          </div>
        </div>
      )}

      <div className="login-card" style={{ background: cardBg, borderRadius: '24px', padding: '48px 40px', width: '100%', maxWidth: '420px', border: `1px solid ${borderColor}`, textAlign: 'center', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        
        <div className="animate-fade-in-up" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa' }}>
            <Shield size={14} />{t.adminPanel}
          </div>
        </div>

        <div className="animate-fade-in-up delay-100" style={{ marginBottom: '16px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(37,99,235,0.4)' }}>
            <Wrench size={28} color="white" />
          </div>
        </div>

        <h1 className="animate-fade-in-up delay-200" style={{ fontSize: '1.5rem', fontWeight: 700, color: textColor, marginBottom: '4px' }}>{t.title}</h1>
        <p className="animate-fade-in-up delay-300" style={{ color: textSecondary, fontSize: '0.9rem', marginBottom: '32px' }}>{t.subtitle}</p>

        {error && (
          <div className="animate-fade-in" style={{ background: 'rgba(220,38,38,0.1)', color: '#ef4444', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.85rem', border: '1px solid rgba(220,38,38,0.2)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <AlertCircle size={16} />{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="animate-fade-in-up delay-300" style={{ marginBottom: '16px', textAlign: 'right' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>{t.username}</label>
            <div className="input-focus" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: inputBg, border: `2px solid ${borderColor}`, borderRadius: '12px' }}>
              <User size={18} style={{ color: textSecondary, flexShrink: 0 }} />
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', fontFamily: "'Cairo', sans-serif", background: 'transparent', color: textColor, textAlign: 'right' }} />
            </div>
          </div>

          <div className="animate-fade-in-up delay-300" style={{ marginBottom: '24px', textAlign: 'right' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>{t.password}</label>
            <div className="input-focus" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: inputBg, border: `2px solid ${borderColor}`, borderRadius: '12px' }}>
              <Lock size={18} style={{ color: textSecondary, flexShrink: 0 }} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.95rem', fontFamily: "'Cairo', sans-serif", background: 'transparent', color: textColor, textAlign: 'right' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, padding: '4px' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loginLoading} className="animate-fade-in-up delay-400"
            style={{ width: '100%', padding: '14px', borderRadius: '14px', background: loginLoading ? '#475569' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: loginLoading ? 'not-allowed' : 'pointer', fontFamily: "'Cairo', sans-serif", transition: 'all 0.3s ease', boxShadow: loginLoading ? 'none' : '0 8px 25px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loginLoading ? 0.7 : 1 }}>
            {loginLoading ? (
              <><span style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} />{t.loggingIn}</>
            ) : (
              <><Shield size={18} />{t.login}</>
            )}
          </button>
        </form>

        <p className="animate-fade-in-up delay-400" style={{ marginTop: '16px', fontSize: '0.75rem', color: '#64748b' }}>💡 {t.hint}</p>

        <div className="animate-fade-in-up delay-400" style={{ marginTop: '16px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#10b981' }}>
          <Shield size={12} />{t.secureLogin}
        </div>

        <Link to="/" className="animate-fade-in-up delay-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '20px', color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", transition: 'all 0.3s ease' }}>
          <ArrowLeft size={16} />{t.backToSite}
        </Link>
      </div>
    </div>
  );
};

export default AdminLoginPage;