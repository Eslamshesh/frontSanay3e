import React, { createContext, useState, useContext, useEffect } from 'react';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    const userData = {
      id: role === 'admin' ? 'admin_001' : Date.now(),
      name: role === 'admin' ? 'المشرف' : email.split('@')[0],
      email: email,
      role: role,
      avatar: null,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', 'token_' + Date.now());
    localStorage.setItem('userRole', role);
    setUser(userData);
    setIsAuthenticated(true);

    // ✅ توجيه مباشر حسب الدور
    if (role === 'admin') {
      window.location.href = '/admin/dashboard';
    } else if (role === 'customer') {
      window.location.href = '/customer/home';
    } else if (role === 'craftsman') {
      window.location.href = '/craftsman/home';
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const isCustomer = user?.role === 'customer';
  const isCraftsman = user?.role === 'craftsman';
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    isCustomer,
    isCraftsman,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;