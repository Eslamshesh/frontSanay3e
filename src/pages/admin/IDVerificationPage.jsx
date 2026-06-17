import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { 
  Shield, CheckCircle, XCircle, Clock, User, Image,
  Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  Eye, ZoomIn, X, Check, Ban, AlertCircle,
  Loader, Sparkles, RefreshCw, Camera, FileText,
  Calendar, Mail, Phone, MapPin, Wrench
} from 'lucide-react';

const IDVerificationPage = () => {
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [viewerImage, setViewerImage] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Load ID cards
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      setCards(data.idCards || []);
    } catch {
      // Demo data - bundled by craftsman
      setCards([
        { id: 1, craftsmanName: 'عادل الحداد', profession: 'حداد', email: 'adel@example.com', phone: '01005556677', frontImage: 'https://via.placeholder.com/400x250/2563eb/white?text=ID+Front', backImage: 'https://via.placeholder.com/400x250/1d4ed8/white?text=ID+Back', status: 'pending', uploadDate: '2024-01-10' },
        { id: 2, craftsmanName: 'حسن البناء', profession: 'بناء', email: 'hassan@example.com', phone: '01001112233', frontImage: 'https://via.placeholder.com/400x250/059669/white?text=ID+Front+2', backImage: 'https://via.placeholder.com/400x250/047857/white?text=ID+Back+2', status: 'pending', uploadDate: '2024-01-14' },
        { id: 3, craftsmanName: 'سامح التركيبات', profession: 'فني تكييف', email: 'sameh@example.com', phone: '01009998877', frontImage: 'https://via.placeholder.com/400x250/8b5cf6/white?text=ID+Front+3', backImage: 'https://via.placeholder.com/400x250/7c3aed/white?text=ID+Back+3', status: 'pending', uploadDate: '2024-02-20' },
        { id: 4, craftsmanName: 'سيد محترف', profession: 'نجار', email: 'sayid@example.com', phone: '01004445566', frontImage: 'https://via.placeholder.com/400x250/059669/white?text=Verified+ID', backImage: 'https://via.placeholder.com/400x250/047857/white?text=Verified+ID+Back', status: 'verified', uploadDate: '2023-12-01' },
        { id: 5, craftsmanName: 'محمود الرفاعي', profession: 'سباك', email: 'mahmoud2@example.com', phone: '01007776655', frontImage: 'https://via.placeholder.com/400x250/dc2626/white?text=Rejected+ID', backImage: 'https://via.placeholder.com/400x250/b91c1c/white?text=Rejected+ID+Back', status: 'rejected', uploadDate: '2024-01-05' },
      ]);
    }
    setLoading(false);
  };

  const filteredCards = cards.filter(c => {
    if (activeTab !== c.status) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return c.craftsmanName?.toLowerCase().includes(q) || c.profession?.toLowerCase().includes(q);
    }
    return true;
  });

  const pendingCards = cards.filter(c => c.status === 'pending');
  const verifiedCards = cards.filter(c => c.status === 'verified');
  const rejectedCards = cards.filter(c => c.status === 'rejected');
  const stats = { pending: pendingCards.length, verified: verifiedCards.length, rejected: rejectedCards.length, total: cards.length };

  const handleAction = (card, type) => {
    setSelectedCard(card);
    setActionType(type);
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    setActionLoading(prev => ({ ...prev, [selectedCard.id]: actionType }));
    try {
      if (actionType === 'verified') {
        await api.verifyCraftsman(selectedCard.id);
      } else {
        await api.rejectCraftsman(selectedCard.id);
      }
    } catch {}
    setCards(prev => prev.map(c => c.id === selectedCard.id ? { ...c, status: actionType } : c));
    setActionLoading(prev => ({ ...prev, [selectedCard.id]: null }));
    setShowActionModal(false);
    setSelectedCard(null);
  };

  // Translations
  const t = {
    title: lang === 'ar' ? 'التحقق من بطاقات الهوية' : 'ID Verification',
    pending: lang === 'ar' ? 'قيد المراجعة' : 'Pending',
    verified: lang === 'ar' ? 'تم التحقق' : 'Verified',
    rejected: lang === 'ar' ? 'مرفوضة' : 'Rejected',
    total: lang === 'ar' ? 'الإجمالي' : 'Total',
    frontSide: lang === 'ar' ? 'الوجه الأمامي' : 'Front Side',
    backSide: lang === 'ar' ? 'الوجه الخلفي' : 'Back Side',
    uploadDate: lang === 'ar' ? 'تاريخ الرفع' : 'Upload Date',
    verify: lang === 'ar' ? '✅ قبول' : '✅ Approve',
    reject: lang === 'ar' ? '❌ رفض' : '❌ Reject',
    confirmVerify: lang === 'ar' ? 'تأكيد القبول' : 'Confirm Approval',
    confirmReject: lang === 'ar' ? 'تأكيد الرفض' : 'Confirm Rejection',
    confirmText: (name, type) => lang === 'ar' ? `هل أنت متأكد من ${type === 'verified' ? 'قبول' : 'رفض'} بطاقة ${name}؟` : `Are you sure you want to ${type === 'verified' ? 'approve' : 'reject'} ${name}'s ID?`,
    confirm: lang === 'ar' ? 'تأكيد' : 'Confirm',
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    search: lang === 'ar' ? 'بحث عن حرفي...' : 'Search craftsman...',
    refresh: lang === 'ar' ? 'تحديث' : 'Refresh',
    noCards: lang === 'ar' ? 'لا توجد بطاقات في هذا القسم' : 'No cards in this section',
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
    clickToView: lang === 'ar' ? 'اضغط للتكبير' : 'Click to enlarge',
    craftsmanInfo: lang === 'ar' ? 'معلومات الحرفي' : 'Craftsman Info',
    profession: lang === 'ar' ? 'التخصص' : 'Profession',
    email: lang === 'ar' ? 'البريد' : 'Email',
    phone: lang === 'ar' ? 'الهاتف' : 'Phone',
  };

  // Dynamic colors
  const bgColor = darkMode ? '#0f172a' : '#f8fafc';
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const headerBg = darkMode ? '#0a0f1a' : '#0f172a';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#ffffff';

  const getStatusStyle = (status) => {
    if (status === 'pending') return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', label: t.pending, icon: <Clock size={16} /> };
    if (status === 'verified') return { bg: 'rgba(5,150,105,0.1)', color: '#059669', label: t.verified, icon: <CheckCircle size={16} /> };
    return { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', label: t.rejected, icon: <XCircle size={16} /> };
  };

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .animate-zoom-in { animation: zoomIn 0.3s ease forwards; }
        
        .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; }
        
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.15); }
        
        .skeleton { background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        
        @media (max-width: 768px) {
          .cards-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: headerBg, color: 'white', padding: '20px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{t.title}</h1>
                <p style={{ opacity: 0.7, fontSize: '0.8rem', margin: '2px 0 0' }}>{t.total}: {stats.total}</p>
              </div>
            </div>
            <button onClick={loadCards} disabled={loading}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', color: 'white', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />{t.refresh}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        
        {/* Stats */}
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { value: stats.pending, label: t.pending, color: '#f59e0b', icon: <Clock size={24} /> },
            { value: stats.verified, label: t.verified, color: '#059669', icon: <CheckCircle size={24} /> },
            { value: stats.rejected, label: t.rejected, color: '#dc2626', icon: <XCircle size={24} /> },
            { value: stats.total, label: t.total, color: '#3b82f6', icon: <Shield size={24} /> },
          ].map((stat, i) => (
            <div key={i} className="hover-lift animate-fade-in-up" style={{ background: cardBg, borderRadius: '14px', padding: '18px', border: `1px solid ${borderColor}`, textAlign: 'center', animationDelay: `${i * 0.08}s` }}>
              <div style={{ color: stat.color, marginBottom: '6px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: textColor }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: textSecondary }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Tabs */}
        <div className="animate-fade-in-up delay-100" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t.search}
              style={{ width: '100%', padding: '10px 16px 10px 40px', border: `2px solid ${borderColor}`, borderRadius: '10px', fontSize: '0.9rem', outline: 'none', background: inputBg, color: textColor, fontFamily: "'Cairo', sans-serif", textAlign: 'right' }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="animate-fade-in-up delay-200" style={{ display: 'flex', gap: '6px', marginBottom: '24px', background: cardBg, padding: '6px', borderRadius: '12px', border: `1px solid ${borderColor}` }}>
          {[
            { id: 'pending', label: t.pending, count: stats.pending, color: '#f59e0b' },
            { id: 'verified', label: t.verified, count: stats.verified, color: '#059669' },
            { id: 'rejected', label: t.rejected, count: stats.rejected, color: '#dc2626' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif",
                transition: 'all 0.3s ease',
                background: activeTab === tab.id ? tab.color : 'transparent',
                color: activeTab === tab.id ? 'white' : textColor,
              }}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ borderRadius: '16px', height: '350px' }} />)}
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {filteredCards.map((card, index) => {
              const statusStyle = getStatusStyle(card.status);
              return (
                <div key={card.id} className="hover-lift animate-fade-in-up" style={{
                  background: cardBg, borderRadius: '16px', overflow: 'hidden',
                  border: `1px solid ${borderColor}`, animationDelay: `${index * 0.08}s`,
                }}>
                  {/* ID Images - Side by Side */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', height: '180px', background: darkMode ? '#0f172a' : '#f1f5f9' }}>
                    <div onClick={() => setViewerImage(card.frontImage)} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                      <img src={card.frontImage} alt="Front" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600 }}>{t.frontSide}</div>
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0}>
                        <ZoomIn size={28} color="white" />
                      </div>
                    </div>
                    <div onClick={() => setViewerImage(card.backImage)} style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                      <img src={card.backImage} alt="Back" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '6px', left: '6px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 600 }}>{t.backSide}</div>
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }}
                        onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0}>
                        <ZoomIn size={28} color="white" />
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ color: textColor, fontSize: '0.95rem' }}>{card.craftsmanName}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '0.8rem', color: textSecondary }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Wrench size={12} />{card.profession}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Calendar size={12} />{card.uploadDate}</span>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                        {statusStyle.icon}{statusStyle.label}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '0.75rem', color: textSecondary }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Mail size={12} />{card.email}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Phone size={12} />{card.phone}</span>
                    </div>

                    {/* Action Buttons */}
                    {card.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button onClick={() => handleAction(card, 'verified')} disabled={actionLoading[card.id]}
                          style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: actionLoading[card.id] ? 0.7 : 1 }}>
                          {actionLoading[card.id] === 'verified' ? <Loader size={14} className="animate-spin" /> : <CheckCircle size={16} />}
                          {t.verify}
                        </button>
                        <button onClick={() => handleAction(card, 'rejected')} disabled={actionLoading[card.id]}
                          style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", background: '#dc2626', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: actionLoading[card.id] ? 0.7 : 1 }}>
                          {actionLoading[card.id] === 'rejected' ? <Loader size={14} className="animate-spin" /> : <XCircle size={16} />}
                          {t.reject}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px 20px', color: textSecondary, background: cardBg, borderRadius: '16px', border: `1px solid ${borderColor}` }}>
            <Shield size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>{t.noCards}</p>
          </div>
        )}
      </div>

      {/* Image Viewer */}
      {viewerImage && (
        <div onClick={() => setViewerImage(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <img src={viewerImage} alt="ID" className="animate-zoom-in" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '8px' }} />
          <button onClick={() => setViewerImage(null)} style={{ position: 'absolute', top: '20px', right: '20px', width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', color: 'white', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>✕</button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showActionModal && (
        <div onClick={() => setShowActionModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div className="animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ background: cardBg, borderRadius: '16px', padding: '32px', maxWidth: '440px', width: '100%', textAlign: 'center', border: `1px solid ${borderColor}`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: actionType === 'verified' ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              {actionType === 'verified' ? <CheckCircle size={28} color="#059669" /> : <XCircle size={28} color="#dc2626" />}
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: textColor, marginBottom: '8px' }}>
              {actionType === 'verified' ? t.confirmVerify : t.confirmReject}
            </h2>
            <p style={{ color: textSecondary, marginBottom: '24px', fontSize: '0.9rem' }}>
              {t.confirmText(selectedCard?.craftsmanName, actionType)}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={confirmAction} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Cairo', sans-serif", background: actionType === 'verified' ? '#059669' : '#dc2626', color: 'white' }}>{t.confirm}</button>
              <button onClick={() => setShowActionModal(false)} style={{ padding: '10px 24px', borderRadius: '10px', border: `1px solid ${borderColor}`, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Cairo', sans-serif", background: 'transparent', color: textColor }}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IDVerificationPage;