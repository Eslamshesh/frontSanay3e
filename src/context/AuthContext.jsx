// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ التحقق من التوكن عند تحميل التطبيق
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (savedToken && savedUser) {
        try {
          // ✅ محاولة جلب البيانات من الباك
          const data = await api.getMe();
          const userData = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatar: data.user.avatar_url || null,
            phone: data.user.phone || null,
            craftsman: data.user.craftsman || null,
            email_verified_at: data.user.email_verified_at || null,
          };
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userRole', data.user.role);
        } catch (error) {
          // ✅ لو الباك مش شغال، استخدم البيانات المحفوظة
          console.warn('⚠️ Backend not available, using saved user data');
          try {
            const savedUserData = JSON.parse(savedUser);
            setUser(savedUserData);
            setIsAuthenticated(true);
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // ✅ تسجيل الدخول - بدون navigate
  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      // ✅ محاولة الاتصال بالباك أولاً
      const data = await api.login(email, password);

      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar_url || null,
        phone: data.user.phone || null,
        craftsman: data.user.craftsman || null,
        email_verified_at: data.user.email_verified_at || null,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);

      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);

      // ✅ التحقق من البريد - بدون navigate
      const needsVerification = data.user.email_verified_at === null;
      
      if (needsVerification) {
        localStorage.setItem('pendingVerificationEmail', data.user.email);
      }

      return { 
        success: true, 
        user: userData, 
        role: data.user.role,
        needsVerification: needsVerification,
        token: data.token,
      };

    } catch (err) {
      // ✅ لو الباك مش شغال، استخدم Mock Data
      console.warn('⚠️ Backend not available, using mock login');

      // تحديد الدور بناءً على الإيميل
      let role = 'customer';
      let name = 'محمد العميل';
      if (email.includes('craftsman')) {
        role = 'craftsman';
        name = 'أحمد الحرفي';
      } else if (email.includes('admin')) {
        role = 'admin';
        name = 'مدير النظام';
      }

      // ✅ بيانات وهمية
      const mockUser = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: name,
        email: email,
        role: role,
        avatar: null,
        phone: '01012345678',
        craftsman: role === 'craftsman' ? { id: 1, crafts: [{ id: 1, name: 'نجار' }] } : null,
        email_verified_at: new Date().toISOString(), // ✅ مفعل افتراضياً في Mock
      };

      const mockToken = 'mock_token_' + Math.random().toString(36).substring(7);

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      localStorage.setItem('userRole', role);

      setUser(mockUser);
      setIsAuthenticated(true);
      setLoading(false);

      return { 
        success: true, 
        user: mockUser, 
        role: role,
        needsVerification: false,
        token: mockToken,
      };
    }
  };

  // ✅ تسجيل الخروج
  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('⚠️ Logout error:', err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('pendingVerificationEmail');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // ✅ تحديث بيانات المستخدم
  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  const isCustomer = user?.role === 'customer';
  const isCraftsman = user?.role === 'craftsman';
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    updateUser,
    isCustomer,
    isCraftsman,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;