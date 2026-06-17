import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import { 
  Users, Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Mail, Phone, MapPin, Calendar, Shield, User, Wrench, 
  CheckCircle, XCircle, AlertCircle, Trash2, Edit, Eye,
  Loader, Sparkles, Download, Upload, RefreshCw, MoreVertical,
  X, Check, Ban, UserCheck, UserX, Clock, Star
} from 'lucide-react';

const UsersManagementPage = () => {
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [selected, setSelected] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [bulkAction, setBulkAction] = useState(null);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table');
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

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      setUsers(data.users || []);
    } catch {
      // Demo data
      setUsers([
        { id: 1, name: 'محمد العلي', email: 'mohamed@example.com', phone: '0512345678', city: 'القاهرة', role: 'customer', status: 'active', requests: 12, joinDate: '2024-01-15' },
        { id: 2, name: 'سارة العمري', email: 'sara@example.com', phone: '0587654321', city: 'الجيزة', role: 'customer', status: 'active', requests: 5, joinDate: '2024-01-20' },
        { id: 3, name: 'خالد الشمري', email: 'khaled@example.com', phone: '0555444333', city: 'الإسكندرية', role: 'craftsman', status: 'active', requests: 25, joinDate: '2023-12-10' },
        { id: 4, name: 'فاطمة الزهراء', email: 'fatma@example.com', phone: '0511122233', city: 'القاهرة', role: 'customer', status: 'suspended', requests: 3, joinDate: '2024-02-01' },
        { id: 5, name: 'يوسف القحطاني', email: 'yousef@example.com', phone: '0544455566', city: 'الجيزة', role: 'craftsman', status: 'active', requests: 40, joinDate: '2023-11-05' },
        { id: 6, name: 'نورا حسين', email: 'nora@example.com', phone: '0566677788', city: 'الإسكندرية', role: 'customer', status: 'active', requests: 8, joinDate: '2024-03-10' },
        { id: 7, name: 'عماد الدين', email: 'emad@example.com', phone: '0533344455', city: 'القاهرة', role: 'craftsman', status: 'pending', requests: 0, joinDate: '2024-05-01' },
        { id: 8, name: 'ليلى سامي', email: 'laila@example.com', phone: '0599988877', city: 'الجيزة', role: 'customer', status: 'active', requests: 15, joinDate: '2024-02-15' },
      ]);
    }
    setLoading(false);
  };

  // Filter & Sort
  const filtered = useMemo(() => {
    let result = [...users];
    
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(u => 
        u.name?.toLowerCase().includes(q) || 
        u.email?.toLowerCase().includes(q) || 
        u.phone?.includes(q)
      );
    }
    if (filterStatus) result = result.filter(u => u.status === filterStatus);
    if (filterRole) result = result.filter(u => u.role === filterRole);

    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField] || '';
        const bVal = b[sortField] || '';
        return sortDirection === 'asc' ? aVal > bVal ? 1 : -1 : aVal < bVal ? 1 : -1;
      });
    }

    return result;
  }, [users, searchTerm, filterStatus, filterRole, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedUsers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? paginatedUsers.map(u => u.id) : []);
  };

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await api.updateUserStatus(id, newStatus);
    } catch {}
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    setActionLoading(prev => ({ ...prev, [id]: false }));
  };

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setSelected(prev => prev.filter(x => x !== id));
    setDeleteModal(null);
  };

  const handleBulkAction = () => {
    if (bulkAction === 'suspend') {
      setUsers(prev => prev.map(u => selected.includes(u.id) ? { ...u, status: 'suspended' } : u));
    } else if (bulkAction === 'activate') {
      setUsers(prev => prev.map(u => selected.includes(u.id) ? { ...u, status: 'active' } : u));
    } else if (bulkAction === 'delete') {
      setUsers(prev => prev.filter(u => !selected.includes(u.id)));
    }
    setSelected([]);
    setBulkAction(null);
  };

  // Translations
  const t = {
    title: lang === 'ar' ? 'إدارة المستخدمين' : 'Manage Users',
    totalUsers: (count) => lang === 'ar' ? `${count} مستخدم` : `${count} Users`,
    search: lang === 'ar' ? 'بحث عن مستخدم...' : 'Search users...',
    allStatuses: lang === 'ar' ? 'جميع الحالات' : 'All Statuses',
    allRoles: lang === 'ar' ? 'جميع الأدوار' : 'All Roles',
    active: lang === 'ar' ? 'نشط' : 'Active',
    suspended: lang === 'ar' ? 'موقوف' : 'Suspended',
    pending: lang === 'ar' ? 'معلق' : 'Pending',
    customer: lang === 'ar' ? 'عميل' : 'Customer',
    craftsman: lang === 'ar' ? 'حرفي' : 'Craftsman',
    selected: (count) => lang === 'ar' ? `تم تحديد ${count} مستخدم` : `${count} selected`,
    suspend: lang === 'ar' ? 'إيقاف' : 'Suspend',
    activate: lang === 'ar' ? 'تفعيل' : 'Activate',
    delete: lang === 'ar' ? 'حذف' : 'Delete',
    confirmDelete: lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete',
    confirmDeleteText: (name) => lang === 'ar' ? `هل أنت متأكد من حذف المستخدم ${name}؟` : `Are you sure you want to delete ${name}?`,
    confirm: lang === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete',
    cancel: lang === 'ar' ? 'إلغاء' : 'Cancel',
    actions: lang === 'ar' ? 'إجراءات' : 'Actions',
    user: lang === 'ar' ? 'المستخدم' : 'User',
    email: lang === 'ar' ? 'البريد' : 'Email',
    phone: lang === 'ar' ? 'الهاتف' : 'Phone',
    location: lang === 'ar' ? 'الموقع' : 'Location',
    role: lang === 'ar' ? 'الدور' : 'Role',
    requests: lang === 'ar' ? 'الطلبات' : 'Requests',
    status: lang === 'ar' ? 'الحالة' : 'Status',
    date: lang === 'ar' ? 'التاريخ' : 'Date',
    loading: lang === 'ar' ? 'جاري التحميل...' : 'Loading...',
    noUsers: lang === 'ar' ? 'لا يوجد مستخدمين' : 'No users found',
    export: lang === 'ar' ? 'تصدير' : 'Export',
    refresh: lang === 'ar' ? 'تحديث' : 'Refresh',
    viewDetails: lang === 'ar' ? 'عرض التفاصيل' : 'View Details',
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
    if (status === 'suspended') return { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', label: t.suspended, icon: <XCircle size={14} /> };
    return { bg: 'rgba(245,158,11,0.1)', color: '#d97706', label: t.pending, icon: <AlertCircle size={14} /> };
  };

  const getRoleStyle = (role) => {
    if (role === 'customer') return { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: t.customer, icon: <User size={14} /> };
    return { bg: 'rgba(5,150,105,0.1)', color: '#059669', label: t.craftsman, icon: <Wrench size={14} /> };
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
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        
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
                <Users size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{t.title}</h1>
                <p style={{ opacity: 0.7, fontSize: '0.8rem', margin: '2px 0 0' }}>{t.totalUsers(users.length)}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={loadUsers} disabled={loading}
                style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', cursor: 'pointer', color: 'white', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Cairo', sans-serif", display: 'flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />{t.refresh}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        
        {/* Filters */}
        <div className="animate-fade-in-up filters-bar" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
            <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder={t.search}
              style={{ width: '100%', padding: '10px 16px 10px 40px', border: `2px solid ${borderColor}`, borderRadius: '10px', fontSize: '0.9rem', outline: 'none', background: inputBg, color: textColor, fontFamily: "'Cairo', sans-serif", textAlign: 'right' }} />
          </div>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 14px', border: `2px solid ${borderColor}`, borderRadius: '10px', fontSize: '0.85rem', outline: 'none', background: inputBg, color: textColor, fontFamily: "'Cairo', sans-serif", cursor: 'pointer', minWidth: '150px' }}>
            <option value="">{t.allStatuses}</option>
            <option value="active">{t.active}</option>
            <option value="suspended">{t.suspended}</option>
            <option value="pending">{t.pending}</option>
          </select>
          <select value={filterRole} onChange={(e) => { setFilterRole(e.target.value); setCurrentPage(1); }}
            style={{ padding: '10px 14px', border: `2px solid ${borderColor}`, borderRadius: '10px', fontSize: '0.85rem', outline: 'none', background: inputBg, color: textColor, fontFamily: "'Cairo', sans-serif", cursor: 'pointer', minWidth: '150px' }}>
            <option value="">{t.allRoles}</option>
            <option value="customer">{t.customer}</option>
            <option value="craftsman">{t.craftsman}</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className="animate-slide-down" style={{
            display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
            padding: '12px 20px', background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff',
            borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#3b82f6' }}>{t.selected(selected.length)}</span>
            <button onClick={() => setBulkAction('activate')}
              style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Cairo', sans-serif", background: 'rgba(5,150,105,0.1)', color: '#059669' }}>{t.activate}</button>
            <button onClick={() => setBulkAction('suspend')}
              style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Cairo', sans-serif", background: 'rgba(245,158,11,0.1)', color: '#d97706' }}>{t.suspend}</button>
            <button onClick={() => setBulkAction('delete')}
              style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Cairo', sans-serif", background: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>{t.delete}</button>
          </div>
        )}

        {/* Bulk Action Confirmation */}
        {bulkAction && (
          <div className="animate-fade-in" style={{
            padding: '14px 20px', background: darkMode ? 'rgba(220,38,38,0.1)' : '#fef2f2',
            borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid rgba(220,38,38,0.2)',
          }}>
            <span style={{ color: '#dc2626', fontSize: '0.9rem', fontWeight: 600 }}>
              {lang === 'ar' ? `هل أنت متأكد من ${bulkAction === 'delete' ? 'حذف' : bulkAction === 'suspend' ? 'إيقاف' : 'تفعيل'} ${selected.length} مستخدم؟` : `Are you sure?`}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleBulkAction} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Cairo', sans-serif", background: '#dc2626', color: 'white' }}>{t.confirm}</button>
              <button onClick={() => setBulkAction(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: `1px solid ${borderColor}`, cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', fontFamily: "'Cairo', sans-serif", background: 'transparent', color: textColor }}>{t.cancel}</button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="animate-fade-in-up delay-200" style={{
          background: cardBg, borderRadius: '16px', overflow: 'hidden',
          border: `1px solid ${borderColor}`, boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '40px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="skeleton" style={{ borderRadius: '10px', height: '50px', marginBottom: '8px' }} />
                ))}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead>
                  <tr style={{ background: darkMode ? '#0f172a' : '#f8fafc', borderBottom: `2px solid ${borderColor}` }}>
                    <th style={thStyle}><input type="checkbox" onChange={handleSelectAll} checked={selected.length === paginatedUsers.length && paginatedUsers.length > 0} /></th>
                    <th style={thStyle} onClick={() => handleSort('name')} className="cursor-pointer">{t.user} {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
                    <th style={thStyle} className="desktop-only">{t.email}</th>
                    <th style={thStyle} className="desktop-only">{t.phone}</th>
                    <th style={thStyle} className="desktop-only">{t.location}</th>
                    <th style={thStyle}>{t.role}</th>
                    <th style={thStyle} className="desktop-only">{t.requests}</th>
                    <th style={thStyle}>{t.status}</th>
                    <th style={thStyle} className="desktop-only">{t.date}</th>
                    <th style={thStyle}>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length > 0 ? paginatedUsers.map((user, index) => {
                    const statusStyle = getStatusStyle(user.status);
                    const roleStyle = getRoleStyle(user.role);
                    return (
                      <tr key={user.id} className="table-row" style={{ borderBottom: `1px solid ${borderColor}`, animationDelay: `${index * 0.05}s` }}>
                        <td style={tdStyle}>
                          <input type="checkbox" checked={selected.includes(user.id)} onChange={() => handleSelect(user.id)} />
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                              {user.name?.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: textColor, fontSize: '0.9rem' }}>{user.name}</div>
                              <div style={{ fontSize: '0.75rem', color: textSecondary }} className="desktop-only">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={tdStyle} className="desktop-only">{user.email}</td>
                        <td style={tdStyle} className="desktop-only">{user.phone}</td>
                        <td style={tdStyle} className="desktop-only">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                            <MapPin size={12} />{user.city || user.location}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: roleStyle.bg, color: roleStyle.color }}>
                            {roleStyle.icon}{roleStyle.label}
                          </span>
                        </td>
                        <td style={tdStyle} className="desktop-only">{user.requests || 0}</td>
                        <td style={tdStyle}>
                          <select value={user.status} onChange={(e) => handleStatusChange(user.id, e.target.value)}
                            style={{ padding: '4px 10px', borderRadius: '12px', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', outline: 'none', background: statusStyle.bg, color: statusStyle.color, fontFamily: "'Cairo', sans-serif" }}>
                            <option value="active">{t.active}</option>
                            <option value="suspended">{t.suspended}</option>
                          </select>
                        </td>
                        <td style={tdStyle} className="desktop-only">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                            <Calendar size={12} />{user.joinDate}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button onClick={() => setDeleteModal(user)}
                              style={{ width: '30px', height: '30px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: 'rgba(220,38,38,0.1)', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={10} style={{ padding: '60px', textAlign: 'center', color: textSecondary }}>
                        <Users size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p>{t.noUsers}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 20px', borderTop: `1px solid ${borderColor}`,
              flexWrap: 'wrap', gap: '12px',
            }}>
              <span style={{ fontSize: '0.85rem', color: textSecondary }}>
                {lang === 'ar' ? `عرض ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filtered.length)} من ${filtered.length}` : `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filtered.length)} of ${filtered.length}`}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', color: textColor, opacity: currentPage === 1 ? 0.5 : 1 }}>
                  <ChevronRight size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Cairo', sans-serif", background: p === currentPage ? '#3b82f6' : 'transparent', color: p === currentPage ? 'white' : textColor }}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${borderColor}`, background: 'transparent', cursor: 'pointer', color: textColor, opacity: currentPage === totalPages ? 0.5 : 1 }}>
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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

// Table styles
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

export default UsersManagementPage;