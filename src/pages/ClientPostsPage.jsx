// src/pages/ClientPostsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Plus, Trash2, Eye, Clock, CheckCircle, XCircle,
  AlertCircle, Loader, FileText, ChevronDown, ChevronUp,
  MessageCircle, DollarSign, Calendar, MapPin, Wrench
} from 'lucide-react';

const ClientPostsPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [lang, setLang] = useState('ar');

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [updatingResponse, setUpdatingResponse] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const isArabic = lang === 'ar';

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLang = () => setLang(localStorage.getItem('language') || 'ar');
    window.addEventListener('languagechange', handleLang);
    return () => window.removeEventListener('languagechange', handleLang);
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getMyPosts();
      // الباك ممكن يرجع data.posts.data أو data.posts أو data.data أو data مباشرة
      const postsArray = data.posts?.data || data.posts || data.data || data || [];
      setPosts(Array.isArray(postsArray) ? postsArray : []);
    } catch (err) {
      setError(isArabic ? 'حدث خطأ في جلب منشوراتك' : 'Error loading your posts');
    } finally {
      setLoading(false);
    }
  }, [isArabic]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleDelete = async (postId) => {
    if (!window.confirm(isArabic ? 'هل تريد إغلاق هذا المنشور؟' : 'Close this post?')) return;
    setDeletingId(postId);
    try {
      await api.deleteServicePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      showSuccess(isArabic ? 'تم إغلاق المنشور' : 'Post closed');
    } catch (err) {
      setError(err.message || (isArabic ? 'حدث خطأ' : 'Error'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleResponseAction = async (postId, responseId, status) => {
    setUpdatingResponse(responseId);
    try {
      await api.updatePostResponse(postId, responseId, status);
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        return {
          ...p,
          responses: (p.responses || []).map(r =>
            r.id === responseId ? { ...r, status } : r
          )
        };
      }));
      showSuccess(
        status === 'accepted'
          ? (isArabic ? 'تم قبول العرض ✅' : 'Offer accepted ✅')
          : (isArabic ? 'تم رفض العرض' : 'Offer rejected')
      );
    } catch (err) {
      setError(err.message || (isArabic ? 'حدث خطأ' : 'Error'));
    } finally {
      setUpdatingResponse(null);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const getStatusBadge = (status) => {
    const map = {
      open:   { label: isArabic ? 'مفتوح' : 'Open',   color: '#10b981', bg: '#d1fae5' },
      closed: { label: isArabic ? 'مغلق' : 'Closed',  color: '#6b7280', bg: '#f3f4f6' },
      pending:{ label: isArabic ? 'معلق'  : 'Pending', color: '#f59e0b', bg: '#fef3c7' },
    };
    return map[status] || map['open'];
  };

  const getUrgencyLabel = (u) => ({
    low:    isArabic ? 'غير عاجل' : 'Low',
    medium: isArabic ? 'عادي'    : 'Medium',
    high:   isArabic ? 'عاجل'    : 'High',
    urgent: isArabic ? 'عاجل جداً': 'Urgent',
  }[u] || u);

  const bg = darkMode ? '#0f172a' : '#f8fafc';
  const card = darkMode ? '#1e293b' : '#ffffff';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const sub = darkMode ? '#94a3b8' : '#64748b';
  const accent = '#f59e0b';

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: 'Cairo, sans-serif', direction: isArabic ? 'rtl' : 'ltr' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
              {isArabic ? 'منشوراتي' : 'My Posts'}
            </h1>
            <p style={{ color: sub, marginTop: 4, fontSize: 14 }}>
              {isArabic ? 'تابع طلباتك وردود الحرفيين' : 'Track your requests and craftsman responses'}
            </p>
          </div>
          <button
            onClick={() => navigate('/request-service')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: accent, color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 18px', fontWeight: 600,
              fontSize: 14, cursor: 'pointer', fontFamily: 'Cairo, sans-serif'
            }}
          >
            <Plus size={16} />
            {isArabic ? 'منشور جديد' : 'New Post'}
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div style={{ background: '#d1fae5', color: '#065f46', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontWeight: 600 }}>
            {successMsg}
          </div>
        )}
        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Loader size={36} style={{ color: accent, animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* Empty */}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: card, borderRadius: 16, border: `1px solid ${border}` }}>
            <FileText size={52} style={{ color: sub, marginBottom: 16 }} />
            <h3 style={{ fontWeight: 600, marginBottom: 8 }}>{isArabic ? 'لا توجد منشورات بعد' : 'No posts yet'}</h3>
            <p style={{ color: sub, marginBottom: 20 }}>{isArabic ? 'أنشئ أول طلب خدمة وسيرد عليك الحرفيون' : 'Create your first service request'}</p>
            <button
              onClick={() => navigate('/request-service')}
              style={{ background: accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}
            >
              {isArabic ? 'أنشئ طلباً الآن' : 'Create a request'}
            </button>
          </div>
        )}

        {/* Posts List */}
        {!loading && posts.map(post => {
          const badge = getStatusBadge(post.status);
          const isExpanded = expandedPost === post.id;
          const responses = post.responses || [];

          return (
            <div key={post.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, marginBottom: 16, overflow: 'hidden' }}>

              {/* Post Header */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 17 }}>{post.title}</span>
                      <span style={{ background: badge.bg, color: badge.color, borderRadius: 20, padding: '2px 12px', fontSize: 12, fontWeight: 600 }}>
                        {badge.label}
                      </span>
                      {post.urgency && post.urgency !== 'medium' && (
                        <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>
                          {getUrgencyLabel(post.urgency)}
                        </span>
                      )}
                    </div>
                    <p style={{ color: sub, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                      {post.description?.length > 120 ? post.description.slice(0, 120) + '...' : post.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {post.status !== 'closed' && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        {deletingId === post.id ? <Loader size={14} /> : <Trash2 size={14} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
                  {post.city && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: sub, fontSize: 13 }}>
                      <MapPin size={13} /> {post.city}
                    </span>
                  )}
                  {(post.budget_from || post.budget_to) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: sub, fontSize: 13 }}>
                      <DollarSign size={13} />
                      {post.budget_from && post.budget_to
                        ? `${post.budget_from} - ${post.budget_to} ${isArabic ? 'ج.م' : 'EGP'}`
                        : `${post.budget_from || post.budget_to} ${isArabic ? 'ج.م' : 'EGP'}`}
                    </span>
                  )}
                  {post.needed_by && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: sub, fontSize: 13 }}>
                      <Calendar size={13} /> {new Date(post.needed_by).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}
                    </span>
                  )}
                  {post.craft && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: sub, fontSize: 13 }}>
                      <Wrench size={13} /> {post.craft?.name || post.custom_craft}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: sub, fontSize: 13 }}>
                    <Clock size={13} /> {new Date(post.created_at).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}
                  </span>
                </div>

                {/* Toggle Responses */}
                {responses.length > 0 && (
                  <button
                    onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                    style={{
                      marginTop: 14, display: 'flex', alignItems: 'center', gap: 6,
                      background: 'transparent', border: `1px solid ${border}`,
                      borderRadius: 8, padding: '7px 14px', cursor: 'pointer',
                      color: text, fontSize: 13, fontWeight: 600, fontFamily: 'Cairo, sans-serif'
                    }}
                  >
                    <MessageCircle size={14} style={{ color: accent }} />
                    {isArabic ? `${responses.length} رد من الحرفيين` : `${responses.length} craftsman response${responses.length > 1 ? 's' : ''}`}
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                )}
              </div>

              {/* Responses */}
              {isExpanded && responses.length > 0 && (
                <div style={{ borderTop: `1px solid ${border}`, padding: '0 24px 20px' }}>
                  <p style={{ color: sub, fontSize: 13, marginBottom: 12, paddingTop: 16, fontWeight: 600 }}>
                    {isArabic ? 'ردود الحرفيين' : 'Craftsman Responses'}
                  </p>
                  {responses.map(resp => (
                    <div key={resp.id} style={{
                      background: darkMode ? '#0f172a' : '#f8fafc',
                      border: `1px solid ${border}`, borderRadius: 12,
                      padding: '14px 16px', marginBottom: 10
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                            {resp.craftsman
                              ? `${resp.craftsman.first_name || ''} ${resp.craftsman.last_name || ''}`.trim()
                              : (isArabic ? 'حرفي' : 'Craftsman')}
                          </div>
                          <p style={{ color: sub, fontSize: 13, margin: '0 0 8px', lineHeight: 1.6 }}>{resp.message}</p>
                          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                            {resp.offered_price && (
                              <span style={{ color: '#10b981', fontSize: 13, fontWeight: 600 }}>
                                💰 {resp.offered_price} {isArabic ? 'ج.م' : 'EGP'}
                              </span>
                            )}
                            {resp.estimated_days && (
                              <span style={{ color: sub, fontSize: 13 }}>
                                ⏱ {resp.estimated_days} {isArabic ? 'يوم' : 'days'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Accept / Reject */}
                        {resp.status === 'pending' && post.status !== 'closed' ? (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleResponseAction(post.id, resp.id, 'accepted')}
                              disabled={updatingResponse === resp.id}
                              style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: 8, padding: '7px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Cairo, sans-serif' }}
                            >
                              {updatingResponse === resp.id ? <Loader size={13} /> : <CheckCircle size={13} />}
                              {isArabic ? 'قبول' : 'Accept'}
                            </button>
                            <button
                              onClick={() => handleResponseAction(post.id, resp.id, 'rejected')}
                              disabled={updatingResponse === resp.id}
                              style={{ background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 8, padding: '7px 14px', fontWeight: 600, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Cairo, sans-serif' }}
                            >
                              <XCircle size={13} />
                              {isArabic ? 'رفض' : 'Reject'}
                            </button>
                          </div>
                        ) : (
                          <span style={{
                            fontSize: 13, fontWeight: 600, padding: '5px 12px', borderRadius: 20,
                            background: resp.status === 'accepted' ? '#d1fae5' : resp.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                            color: resp.status === 'accepted' ? '#065f46' : resp.status === 'rejected' ? '#991b1b' : '#92400e',
                          }}>
                            {resp.status === 'accepted' ? (isArabic ? '✅ مقبول' : '✅ Accepted') :
                             resp.status === 'rejected' ? (isArabic ? '❌ مرفوض' : '❌ Rejected') :
                             (isArabic ? 'معلق' : 'Pending')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ClientPostsPage;
