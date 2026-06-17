import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { 
  Wrench, Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  MapPin, Star, Calendar, Shield, User, CheckCircle, XCircle, 
  AlertCircle, Trash2, Edit, Eye, Phone, Mail, Briefcase,
  Loader, Sparkles, RefreshCw, Award, Clock, DollarSign,
  Check, X, Ban, UserCheck, UserX, TrendingUp, Image
} from 'lucide-react';

const CraftsmenManagementPage = () => {
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [craftsmen, setCraftsmen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProfession, setFilterProfession] = useState('');
  const [selected, setSelected] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [viewCraftsman, setViewCraftsman] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState({});
  const itemsPerPage = 10;

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Load craftsmen
  useEffect(() => {
    loadCraftsmen();
  }, []);

  const loadCraftsmen = async () => {
    setLoading(true);
    try {
      const data = await api.getCraftsmen();
      setCraftsmen(data.craftsmen || data || []);
    } catch {
      setCraftsmen([
        { id: 1, name: 'أحمد النجار', profession: 'نجار', city: 'القاهرة', district: 'مدينة نصر', rating: 4.9, completed_jobs: 350, status: 'active', verified: true, joinDate: '2023-06-15', phone: '01001234567', email: 'ahmed@example.com', price: 200, bio: 'نجار محترف خبرة 15 سنة' },
        { id: 2, name: 'محمود السباك', profession: 'سباك', city: 'الجيزة', district: 'الدقي', rating: 4.7, completed_jobs: 220, status: 'active', verified: true, joinDate: '2023-08-20', phone: '01009876543', email: 'mahmoud@example.com', price: 150, bio: 'سباك معتمد' },
        { id: 3, name: 'عادل الحداد', profession: 'حداد', city: 'القاهرة', district: 'شبرا', rating: 0, completed_jobs: 0, status: 'pending', verified: false, joinDate: '2024-01-10', phone: '01005556677', email: 'adel@example.com', price: 180, bio: '' },
        { id: 4, name: 'حسن البناء', profession: 'بناء', city: 'الجيزة', district: 'فيصل', rating: 0, completed_jobs: 0, status: 'pending', verified: false, joinDate: '2024-01-14', phone: '01001112233', email: 'hassan@example.com', price: 300, bio: '' },
        { id: 5, name: 'كريم الدهان', profession: 'نقاش', city: 'الإسكندرية', district: 'سموحة', rating: 4.5, completed_jobs: 190, status: 'active', verified: true, joinDate: '2023-09-01', phone: '01007778899', email: 'karim@example.com', price: 130, bio: 'دهانات وديكورات حديثة' },
        { id: 6, name: 'طارق الفني', profession: 'كهربائي', city: 'القاهرة', district: 'الزمالك', rating: 4.4, completed_jobs: 200, status: 'active', verified: true, joinDate: '2023-10-05', phone: '01006667788', email: 'tarek@example.com', price: 160, bio: 'كهربائي منازل وشركات' },
        { id: 7, name: 'سامح التركيبات', profession: 'فني تكييف', city: 'القاهرة', district: 'المعادي', rating: 0, completed_jobs: 0, status: 'pending', verified: false, joinDate: '2024-02-20', phone: '01009998877', email: 'sameh@example.com', price: 250, bio: '' },
        { id: 8, name: 'عماد المقاول', profession: 'بناء', city: 'القاهرة', district: 'التجمع', rating: 4.8, completed_jobs: 380, status: 'active', verified: true, joinDate: '2023-05-10', phone: '01003334455', email: 'emad@example.com', price: 300, bio: 'مقاول بناء وتشطيبات' },
      ]);
    }
    setLoading(false);
  };

  // Filter & Sort
  const filtered = useMemo(() => {
    let result = [...craftsmen];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c => c.name?.toLowerCase().includes(q) || c.profession?.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q));
    }
    if (filterStatus) result = result.filter(c => c.status === filterStatus);
    if (filterProfession) result = result.filter(c => c.profession === filterProfession);
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField] || '';
        const bVal = b[sortField] || '';
        return sortDirection === 'asc' ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
      });
    }
    return result;
  }, [craftsmen, searchTerm, filterStatus, filterProfession, sortField, sortDirection]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedCraftsmen = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const professions = useMemo(() => [...new Set(craftsmen.map(c => c.profession).filter(Boolean))], [craftsmen]);
  const pendingCount = craftsmen.filter(c => c.status === 'pending').length;

  const handleVerify = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'verify' }));
    try { await api.verifyCraftsman(id); } catch {}
    setCraftsmen(prev => prev.map(c => c.id === id ? { ...c, status: 'active', verified: true } : c));
    setActionLoading(prev => ({ ...prev, [id]: null }));
  };

  const handleReject = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'reject' }));
    try { await api.rejectCraftsman(id); } catch {}
    setCraftsmen(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
    setActionLoading(prev => ({ ...prev, [id]: null }));
  };

  const handleDelete = (id) => {
    setCraftsmen(prev => prev.filter(c => c.id !== id));
    setDeleteModal(null);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Translations
  const t = {
    title: lang === 'ar' ? 'إدارة الحرفيين' : 'Manage Craftsmen',
    totalCraftsmen: (count) => lang === 'ar' ? `${count} حرفي` : `${count} Craftsmen`,
    pendingReview: (count) => lang === 'ar' ? `${count} في انتظار المراجعة` : `${count} pending review`,
    search: lang === 'ar' ? 'بحث عن حرفي...' : 'Search craftsmen...',
    allStatuses: lang === 'ar' ? 'جميع الحالات' : 'All Statuses',
    allProfessions: lang === 'ar' ? 'جميع التخصصات' : 'All Professions',
    active: lang === 'ar' ? 'نشط' : 'Active',
    pending: lang === 'ar' ? 'قيد المراجعة' : 'Pending',
    rejected: lang === 'ar' ? 'مرفوض' : 'Rejected',
    craftsman: lang === 'ar' ? 'الحرفي' : 'Craftsman',
    profession: lang === 'ar' ? 'التخصص' : 'Profession',
    location: lang === 'ar' ? 'الموقع' : 'Location',
    rating: lang === 'ar' ? 'التقييم' : 'Rating',
    jobs: lang === 'ar' ? 'الخدمات' : 'Jobs',
    status: lang === 'ar' ? 'الحالة' : 'Status',
    verified: lang === 'ar' ? 'موثق' : 'Verified',
    date: lang === 'ar' ? 'التاريخ' : 'Date',
    actions: lang === 'ar' ? 'إجراءات' : 'Actions',
    verify: lang === 'ar' ? 'قبول' : 'Approve',
    reject: lang === 'ar' ? 'رفض' : 'Reject',
    delete: lang === 'ar' ? 'حذف' : 'Delete',
    viewDetails: lang === 'ar' ? 'عرض التفاصيل' : 'View Details',
    confirmDelete: lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete',
    confirmDeleteText: (name) => lang === 'ar' ? `هل أنت متأكد من حذف ${name}؟` : `Delete ${name}?`,
    confirm: lang === 'ar' ? 'تأكيد' : 'Confirm',
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    refresh: lang === 'ar' ? 'تحديث' : 'Refresh',
    noCraftsmen: lang === 'ar' ? 'لا يوجد حرفيين' : 'No craftsmen found',
    yes: lang === 'ar' ? 'نعم' : 'Yes',
    no: lang === 'ar' ? 'لا' : 'No',
    egp: lang === 'ar' ? 'ج.م' : 'EGP',
    details: lang === 'ar' ? 'تفاصيل الحرفي' : 'Craftsman Details',
    phone: lang === 'ar' ? 'الهاتف' : 'Phone',
    email: lang === 'ar' ? 'البريد' : 'Email',
    bio: lang === 'ar' ? 'نبذة' : 'Bio',
    price: lang === 'ar' ? 'السعر' : 'Price',
    close: lang === 'ar' ? 'إغلاق' : 'Close',
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
    if (status === 'active') return { bg: 'rgba(5,150,105,0.1)', color: '#059669', label: t.active, icon: <CheckCircle size={14} /> };
    if (status === 'pending') return { bg: 'rgba(245,158,11,0.1)', color: '#d97706', label: t.pending, icon: <Clock size={14} /> };
    if (status === 'rejected') return { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', label: t.rejected, icon: <XCircle size={14} /> };
    return { bg: 'rgba(148,163,184,0.1)', color: '#64748b', label: status, icon: <AlertCircle size={14} /> };
  };

  return (
    <div style={{ background: bgColor, minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
        .animate-slide-down { animation: slideDown 0.3s ease forwards; }
        
        .delay-100 { animation-delay: 0.1s; } .delay-200 { animation-delay: 0.2s; }
        
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-2px); }
        
        .table-row { transition: all 0.2s ease; }
        .table-row:hover { background: ${darkMode ? 'rgba(255,255,255,0.02)' : '#f8fafc'}; }
        
        .skeleton { background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        
        @media (max-width: 768px) {
          .filters-bar { flex-direction: column; }
          .filters-bar input, .filters-bar select { width: 100%; }
          .desktop-only { display: none; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: headerBg, color: 'white', padding: '20px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <div className="animate-slide-down" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wrench size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{t.title}</h1>
                <p style={{ opacity: 0.7, fontSize: '0.8rem', margin: '2px 0 0' }}>
                  {t.totalCraftsmen(craftsmen.length)}
                  {pendingCount > 0 && <span style={{ color: '#fbbf24', marginLeft: '8px' }}>• {t.pendingReview(pendingCount)}</span>}
                </p>
              </div>
            </div>
            <button onClick={loadCraftsmen} disabled={loading}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', color: 'white', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />{t.refresh}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        
        {/* Filters */}
        <div className="animate-fade-in-up filters-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
            <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder={t.search}
              style={{ width: '100%', padding: '10px 16px 10px 40px', border: `2px solid ${borderColor}`, borderRadius: '10px', fontSize: '0.9rem', outline: 'none', background: inputBg, color: textColor, fontFamily: "'Cairo', sans-serif", textAlign: 'right' }} />
          </div>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 14px', border: `2px solid ${borderColor}`, borderRadius: '10px', fontSize: '0.85rem', outline: 'none', background: inputBg, color: textColor, fontFamily: "'Cairo', sans-serif", cursor: 'pointer', minWidth: '150px' }}>
            <option value="">{t.allStatuses}</option>
            <option value="active">{t.active}</option>
            <option value="pending">{t.pending}</option>
            <option value="rejected">{t.rejected}</option>
          </select>
          <select value={filterProfession} onChange={(e) => { setFilterProfession(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 14px', border: `2px solid ${borderColor}`, borderRadius: '10px', fontSize: '0.85rem', outline: 'none', background: inputBg, color: textColor, fontFamily: "'Cairo', sans-serif", cursor: 'pointer', minWidth: '150px' }}>
            <option value="">{t.allProfessions}</option>
            {professions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="animate-fade-in-up delay-200" style={{ background: cardBg, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${borderColor}`, boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '40px' }}>
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ borderRadius: '10px', height: '50px', marginBottom: '8px' }} />)}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: darkMode ? '#0f172a' : '#f8fafc', borderBottom: `2px solid ${borderColor}` }}>
                    <th style={thStyle} onClick={() => handleSort('name')}>{t.craftsman} {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                    <th style={thStyle}>{t.profession}</th>
                    <th style={thStyle} className="desktop-only">{t.location}</th>
                    <th style={thStyle}>{t.rating}</th>
                    <th style={thStyle} className="desktop-only">{t.jobs}</th>
                    <th style={thStyle}>{t.status}</th>
                    <th style={thStyle} className="desktop-only">{t.verified}</th>
                    <th style={thStyle} className="desktop-only">{t.date}</th>
                    <th style={thStyle}>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCraftsmen.length > 0 ? paginatedCraftsmen.map((c, index) => {
                    const statusStyle = getStatusStyle(c.status);
                    return (
                      <tr key={c.id} className="table-row" style={{ borderBottom: `1px solid ${borderColor}`, animationDelay: `${index * 0.05}s` }}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                              {c.name?.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: textColor, fontSize: '0.9rem' }}>{c.name}</div>
                              <div style={{ fontSize: '0.75rem', color: textSecondary }} className="desktop-only">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color: '#3b82f6', fontWeight: 500 }}>{c.profession}</td>
                        <td style={tdStyle} className="desktop-only">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}><MapPin size={12} />{c.city} {c.district}</span>
                        </td>
                        <td style={tdStyle}>
                          {c.rating > 0 ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#f59e0b' }}><Star size={14} fill="#f59e0b" />{c.rating}</span>
                          ) : <span style={{ color: textSecondary }}>-</span>}
                        </td>
                        <td style={tdStyle} className="desktop-only">{c.completed_jobs || 0}</td>
                        <td style={tdStyle}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                            {statusStyle.icon}{statusStyle.label}
                          </span>
                        </td>
                        <td style={tdStyle} className="desktop-only">
                          {c.verified ? <CheckCircle size={18} style={{ color: '#059669' }} /> : <XCircle size={18} style={{ color: '#94a3b8' }} />}
                        </td>
                        <td style={tdStyle} className="desktop-only">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}><Calendar size={12} />{c.joinDate}</span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => setViewCraftsman(c)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Eye size={14} />
                            </button>
                            {c.status === 'pending' && (
                              <>
                                <button onClick={() => handleVerify(c.id)} disabled={actionLoading[c.id]}
                                  style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(5,150,105,0.1)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: actionLoading[c.id] ? 0.5 : 1 }}>
                                  {actionLoading[c.id] === 'verify' ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                                </button>
                                <button onClick={() => handleReject(c.id)} disabled={actionLoading[c.id]}
                                  style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.1)', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: actionLoading[c.id] ? 0.5 : 1 }}>
                                  {actionLoading[c.id] === 'reject' ? <Loader size={14} className="animate-spin" /> : <X size={14} />}
                                </button>
                              </>
                            )}
                            <button onClick={() => setDeleteModal(c)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.1)', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={9} style={{ padding: '60px', textAlign: 'center', color: textSecondary }}>
                      <Wrench size={48} style={{ opacity: 0.3, marginBottom: '12px' }} /><p>{t.noCraftsmen}</p>
                    </td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: `1px solid ${borderColor}`, flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: textSecondary }}>
                {lang === 'ar' ? `عرض ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filtered.length)} من ${filtered.length}` : `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filtered.length)} of ${filtered.length}`}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', color: textColor, opacity: currentPage === 1 ? 0.5 : 1 }}><ChevronRight size={16} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", background: p === currentPage ? '#3b82f6' : 'transparent', color: p === currentPage ? 'white' : textColor }}>{p}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', color: textColor, opacity: currentPage === totalPages ? 0.5 : 1 }}><ChevronLeft size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {viewCraftsman && (
        <div onClick={() => setViewCraftsman(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div className="animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ background: cardBg, borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%', border: `1px solid ${borderColor}`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor }}>{t.details}</h2>
              <button onClick={() => setViewCraftsman(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSecondary, fontSize: '1.2rem' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem' }}>{viewCraftsman.name?.charAt(0)}</div>
              <div>
                <div style={{ fontWeight: 700, color: textColor, fontSize: '1.1rem' }}>{viewCraftsman.name}</div>
                <div style={{ color: '#3b82f6', fontWeight: 500 }}>{viewCraftsman.profession}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: <Phone size={16} />, label: t.phone, value: viewCraftsman.phone || '-' },
                { icon: <Mail size={16} />, label: t.email, value: viewCraftsman.email || '-' },
                { icon: <MapPin size={16} />, label: t.location, value: `${viewCraftsman.city || ''} ${viewCraftsman.district || ''}` },
                { icon: <DollarSign size={16} />, label: t.price, value: viewCraftsman.price ? `${viewCraftsman.price} ${t.egp}` : '-' },
                { icon: <Star size={16} />, label: t.rating, value: viewCraftsman.rating > 0 ? `${viewCraftsman.rating} / 5` : '-' },
                { icon: <CheckCircle size={16} />, label: t.jobs, value: `${viewCraftsman.completed_jobs || 0} ${lang === 'ar' ? 'خدمة' : 'jobs'}` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${borderColor}`, fontSize: '0.9rem' }}>
                  <span style={{ color: textSecondary, display: 'flex', alignItems: 'center', gap: '6px' }}>{item.icon}{item.label}</span>
                  <span style={{ fontWeight: 600, color: textColor }}>{item.value}</span>
                </div>
              ))}
            </div>
            {viewCraftsman.bio && (
              <div style={{ marginTop: '12px', padding: '12px', borderRadius: '10px', background: darkMode ? '#0f172a' : '#f8fafc', fontSize: '0.9rem', color: textSecondary, lineHeight: 1.6 }}>"{viewCraftsman.bio}"</div>
            )}
            <button onClick={() => setViewCraftsman(null)} style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', color: textColor, fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Cairo', sans-serif" }}>{t.close}</button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div onClick={() => setDeleteModal(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div className="animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ background: cardBg, borderRadius: '16px', padding: '32px', maxWidth: '440px', width: '100%', textAlign: 'center', border: `1px solid ${borderColor}`, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(220,38,38,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Trash2 size={28} color="#dc2626" />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: textColor, marginBottom: '8px' }}>{t.confirmDelete}</h2>
            <p style={{ color: textSecondary, marginBottom: '24px', fontSize: '0.95rem' }}>{t.confirmDeleteText(deleteModal.name)}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => handleDelete(deleteModal.id)} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Cairo', sans-serif", background: '#dc2626', color: 'white' }}>{t.confirm}</button>
              <button onClick={() => setDeleteModal(null)} style={{ padding: '10px 24px', borderRadius: '10px', border: `1px solid ${borderColor}`, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', fontFamily: "'Cairo', sans-serif", background: 'transparent', color: textColor }}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  padding: '14px 16px', textAlign: 'right', fontSize: '0.8rem',
  fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase',
  letterSpacing: '0.5px', borderBottom: '2px solid #e2e8f0',
  cursor: 'pointer', userSelect: 'none',
};

const tdStyle = {
  padding: '12px 16px', fontSize: '0.85rem', color: '#64748b',
  borderBottom: '1px solid #f1f5f9',
};

export default CraftsmenManagementPage;