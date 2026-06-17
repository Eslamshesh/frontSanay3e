import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ تحميل الأدمن من localStorage عند فتح الموقع
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        if (user.role === 'admin') {
          setAdmin(user);
          setIsAdminAuthenticated(true);
        }
      } catch (err) {
        console.error('Error parsing admin data:', err);
      }
    }
    setLoading(false);
  }, []);

  // ✅ دالة الدخول - بتجرب API وبعدين local
  const adminLogin = async (username, password) => {
    try {
      // نجرب API الأول
      const result = await api.login(username, password, 'admin');
      if (result && (result.token || result.success)) {
        const adminData = result.user || {
          id: 'admin_001',
          name: 'المشرف',
          email: username || 'admin@atlobsanay3y.com',
          role: 'admin',
        };
        
        localStorage.setItem('user', JSON.stringify(adminData));
        localStorage.setItem('token', result.token || 'admin_token_' + Date.now());
        localStorage.setItem('userRole', 'admin');
        
        setAdmin(adminData);
        setIsAdminAuthenticated(true);
        return { success: true, admin: adminData };
      }
    } catch (err) {
      console.log('API login failed, using local fallback');
    }

    // ✅ Fallback للديمو
    if (username === 'admin' && password === 'admin123') {
      const adminData = {
        id: 'admin_001',
        name: 'المشرف',
        email: 'admin@atlobsanay3y.com',
        role: 'admin',
      };
      
      localStorage.setItem('user', JSON.stringify(adminData));
      localStorage.setItem('token', 'admin_token_' + Date.now());
      localStorage.setItem('userRole', 'admin');
      
      setAdmin(adminData);
      setIsAdminAuthenticated(true);
      return { success: true, admin: adminData };
    }
    
    return { success: false, error: 'بيانات الدخول غير صحيحة' };
  };

  // ✅ دالة الخروج
  const adminLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setAdmin(null);
    setIsAdminAuthenticated(false);
  };

  const value = {
    admin,
    adminLogin,
    adminLogout,
    isAdminAuthenticated,
    loading
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;