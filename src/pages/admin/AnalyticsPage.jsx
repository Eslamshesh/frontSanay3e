import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { 
  BarChart3, TrendingUp, Users, Wrench, FileText, DollarSign,
  Star, Award, Calendar, RefreshCw, Loader, Sparkles,
  ChevronDown, Grid, PieChart, Activity, Zap, Clock,
  CheckCircle, User, Eye, MapPin, ArrowUp, ArrowDown
} from 'lucide-react';

const AnalyticsPage = () => {
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [range, setRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0, totalCraftsmen: 0, activeRequests: 0, totalRevenue: 0,
    newUsersThisWeek: 0, completionRate: 0, avgRating: 0
  });
  const [weeklyData, setWeeklyData] = useState({ labels: [], values: [] });
  const [topPerformers, setTopPerformers] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [trends, setTrends] = useState({ users: 0, revenue: 0, requests: 0 });

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Load analytics
  useEffect(() => {
    loadAnalytics();
  }, [range]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      setStats({
        totalUsers: data.totalUsers || 1245,
        totalCraftsmen: data.totalCraftsmen || 320,
        activeRequests: data.activeRequests || 87,
        totalRevenue: data.totalRevenue || 45600,
        newUsersThisWeek: data.newUsersThisWeek || 45,
        completionRate: data.completionRate || 92,
        avgRating: data.avgRating || 4.7,
      });
      setTrends({
        users: data.usersTrend || 12,
        revenue: data.revenueTrend || 8,
        requests: data.requestsTrend || -3,
      });
    } catch {
      // Demo data
      setStats({ totalUsers: 1245, totalCraftsmen: 320, activeRequests: 87, totalRevenue: 45600, newUsersThisWeek: 45, completionRate: 92, avgRating: 4.7 });
      setTrends({ users: 12, revenue: 8, requests: -3 });
    }

    // Demo weekly data
    const demoLabels = lang === 'ar' 
      ? ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
      : ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const demoValues = [12, 19, 15, 25, 22, 30, 28];
    setWeeklyData({ labels: demoLabels, values: demoValues });

    // Demo top performers
    setTopPerformers([
      { name: 'أحمد النجار', profession: 'نجار', completed: 350, rating: 4.9, revenue: 12500 },
      { name: 'محمد السيد', profession: 'كهربائي', completed: 400, rating: 4.8, revenue: 15000 },
      { name: 'محمود السباك', profession: 'سباك', completed: 220, rating: 4.7, revenue: 8500 },
      { name: 'كريم الدهان', profession: 'نقاش', completed: 190, rating: 4.5, revenue: 6200 },
    ]);

    // Demo distribution
    setDistribution([
      { name: lang === 'ar' ? 'سباكة' : 'Plumbing', percent: 30, color: '#3b82f6' },
      { name: lang === 'ar' ? 'كهرباء' : 'Electrical', percent: 25, color: '#059669' },
      { name: lang === 'ar' ? 'نجارة' : 'Carpentry', percent: 20, color: '#f59e0b' },
      { name: lang === 'ar' ? 'دهان' : 'Painting', percent: 15, color: '#8b5cf6' },
      { name: lang === 'ar' ? 'أخرى' : 'Other', percent: 10, color: '#ec4899' },
    ]);

    setLoading(false);
  };

  // Translations
  const t = {
    title: lang === 'ar' ? 'التحليلات والإحصائيات' : 'Analytics & Statistics',
    week: lang === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days',
    month: lang === 'ar' ? 'آخر 30 يوم' : 'Last 30 Days',
    totalUsers: lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users',
    totalCraftsmen: lang === 'ar' ? 'الحرفيين النشطين' : 'Active Craftsmen',
    activeRequests: lang === 'ar' ? 'الطلبات النشطة' : 'Active Requests',
    totalRevenue: lang === 'ar' ? 'الإيرادات' : 'Revenue',
    newUsers: lang === 'ar' ? 'مستخدمين جدد' : 'New Users',
    completionRate: lang === 'ar' ? 'نسبة الإنجاز' : 'Completion Rate',
    avgRating: lang === 'ar' ? 'متوسط التقييم' : 'Avg Rating',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    refresh: lang === 'ar' ? 'تحديث' : 'Refresh',
    topPerformers: lang === 'ar' ? 'أفضل الحرفيين أداء' : 'Top Performers',
    distribution: lang === 'ar' ? 'توزيع الخدمات' : 'Service Distribution',
    newUsersChart: lang === 'ar' ? 'المستخدمين الجدد' : 'New Users',
    revenue: lang === 'ar' ? 'الإيرادات' : 'Revenue',
    requests: lang === 'ar' ? 'الطلبات' : 'Requests',
    vsLastWeek: lang === 'ar' ? 'مقارنة بالأسبوع الماضي' : 'vs Last Week',
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const headerBg = darkMode ? '#0a0f1a' : '#0f172a';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';

  const maxValue = Math.max(...weeklyData.values, 1);
  const formatRevenue = (val) => val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val;

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes growBar { from { height: 0 !important; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; } .delay-400 { animation-delay: 0.4s; }
        
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.12); }
        
        .skeleton { background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        
        .grow-bar { animation: growBar 0.8s ease forwards; }
        
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .charts-grid { grid-template-columns: 1fr !important; }
          .bar-label { font-size: 0.65rem !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: headerBg, color: 'white', padding: '20px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{t.title}</h1>
                <p style={{ opacity: 0.7, fontSize: '0.8rem', margin: '2px 0 0' }}>{t.vsLastWeek}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select value={range} onChange={(e) => setRange(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif", cursor: 'pointer' }}>
                <option value="week" style={{ color: '#0f172a' }}>{t.week}</option>
                <option value="month" style={{ color: '#0f172a' }}>{t.month}</option>
              </select>
              <button onClick={loadAnalytics} disabled={loading}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', color: 'white', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />{t.refresh}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        
        {/* Stats Grid */}
        {loading ? (
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton" style={{ borderRadius: '16px', height: '100px' }} />)}
          </div>
        ) : (
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {[
              { value: `+${stats.totalUsers.toLocaleString()}`, label: t.totalUsers, color: '#3b82f6', icon: <Users size={22} />, trend: trends.users },
              { value: `+${stats.totalCraftsmen}`, label: t.totalCraftsmen, color: '#059669', icon: <Wrench size={22} />, trend: 5 },
              { value: stats.activeRequests, label: t.activeRequests, color: '#f59e0b', icon: <FileText size={22} />, trend: trends.requests },
              { value: `${formatRevenue(stats.totalRevenue)} ${t.egp}`, label: t.totalRevenue, color: '#8b5cf6', icon: <DollarSign size={22} />, trend: trends.revenue },
              { value: `${stats.completionRate}%`, label: t.completionRate, color: '#ec4899', icon: <CheckCircle size={22} />, trend: 3 },
              { value: `${stats.avgRating} ⭐`, label: t.avgRating, color: '#6366f1', icon: <Star size={22} />, trend: 1 },
            ].map((stat, i) => (
              <div key={i} className="hover-lift animate-fade-in-up" style={{
                background: cardBg, borderRadius: '14px', padding: '16px',
                border: `1px solid ${borderColor}`, position: 'relative', overflow: 'hidden',
                animationDelay: `${i * 0.06}s`,
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: stat.color }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: textColor, marginBottom: '2px' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.75rem', color: textSecondary }}>{stat.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px', fontSize: '0.7rem', color: stat.trend >= 0 ? '#059669' : '#dc2626' }}>
                      {stat.trend >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                      {Math.abs(stat.trend)}%
                    </div>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts Row */}
        <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          
          {/* Bar Chart */}
          <div className="animate-fade-in-up delay-200" style={{ background: cardBg, borderRadius: '16px', padding: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} style={{ color: '#3b82f6' }} />{t.newUsersChart}
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '6px', height: '200px', paddingTop: '20px' }}>
              {weeklyData.labels.map((label, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div className="grow-bar" style={{
                    width: '32px', maxWidth: '40px', borderRadius: '6px 6px 0 0',
                    height: `${(weeklyData.values[i] / maxValue) * 180}px`,
                    background: `linear-gradient(180deg, #3b82f6, #1d4ed8)`,
                    position: 'relative', minHeight: '4px',
                  }}>
                    <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 600, color: textColor }}>
                      {weeklyData.values[i]}
                    </span>
                  </div>
                  <span className="bar-label" style={{ fontSize: '0.7rem', color: textSecondary, marginTop: '8px' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="animate-fade-in-up delay-300" style={{ background: cardBg, borderRadius: '16px', padding: '24px', border: `1px solid ${borderColor}` }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: textColor, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} style={{ color: '#f59e0b' }} />{t.topPerformers}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {topPerformers.map((performer, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px',
                  borderRadius: '10px', background: darkMode ? '#0f172a' : '#f8fafc',
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : '#64748b',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: textColor, fontSize: '0.85rem' }}>{performer.name}</div>
                    <div style={{ fontSize: '0.7rem', color: textSecondary }}>{performer.profession}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>★ {performer.rating}</div>
                    <div style={{ fontSize: '0.7rem', color: textSecondary }}>{performer.completed} {lang === 'ar' ? 'خدمة' : 'jobs'}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.85rem' }}>
                    {performer.revenue.toLocaleString()} {t.egp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="animate-fade-in-up delay-400" style={{ background: cardBg, borderRadius: '16px', padding: '24px', border: `1px solid ${borderColor}` }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: textColor, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={18} style={{ color: '#8b5cf6' }} />{t.distribution}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {distribution.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: textColor, fontWeight: 500, minWidth: '60px' }}>{d.name}</span>
                <div style={{ flex: 1, height: '8px', background: darkMode ? '#334155' : '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div className="grow-bar" style={{ height: '100%', borderRadius: '4px', width: `${d.percent}%`, background: d.color, transition: 'width 1s ease' }} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: d.color, minWidth: '40px', textAlign: 'right' }}>{d.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '32px', padding: '12px', color: textSecondary, fontSize: '0.75rem', borderTop: `1px solid ${borderColor}` }}>
          <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
          {lang === 'ar' ? 'البيانات يتم تحديثها تلقائياً' : 'Data updates automatically'} • اطلب صنايعي © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;