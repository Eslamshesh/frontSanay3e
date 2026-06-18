import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api'; // ✅ بنستخدم api.js الحقيقي

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

  // ✅ عند فتح التطبيق نتحقق من الـ token المحفوظ
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // ✅ login حقيقي بيتكلم مع Laravel
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.login(email, password);

      // لو Laravel رجع error
      if (data.message && !data.token) {
        setError(data.message);
        return { success: false, message: data.message };
      }

      // ✅ نحفظ الـ token والـ user الحقيقيين من Laravel
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,       // الـ role جاي من الباك ✅
        avatar: data.user.avatar_url || null,
        phone: data.user.phone || null,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token); // ✅ token حقيقي من Laravel
      localStorage.setItem('userRole', data.user.role);

      setUser(userData);
      setIsAuthenticated(true);

      // ✅ توجيه حسب الـ role الجاي من الباك
      const role = data.user.role;
      if (role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else if (role === 'customer') {
        window.location.href = '/customer/home';
      } else if (role === 'craftsman') {
        window.location.href = '/craftsman/home';
      }

      return { success: true };

    } catch (err) {
      const msg = 'حدث خطأ في الاتصال بالسيرفر، تحقق من تشغيل Laravel';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // ✅ logout حقيقي بيبلغ Laravel
  const logout = async () => {
    try {
      await api.logout(); // بيبعت للـ Laravel يلغي الـ token
    } catch (err) {
      // حتى لو فشل الـ request نمسح البيانات المحلية
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  };

  // ✅ تحديث بيانات الـ user لو اتغيرت
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