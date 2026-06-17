import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext';
import Header from './Header';
import Footer from './Footer';
import ChatBot from '../Chatbot/ChatBot';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text)',
        transition: 'background 0.3s, color 0.3s',
      }}>
        {/* Header - يظهر بس لغير صفحات الأدمن */}
        {!isAdminRoute && <Header />}
        
        <main style={{ 
          flex: 1, 
          paddingTop: isAdminRoute ? '0' : '64px',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}>
          {children}
        </main>
        
        {/* Footer - يظهر بس لغير صفحات الأدمن */}
        {!isAdminRoute && <Footer />}
        
        {/* ChatBot - يظهر بس لغير صفحات الأدمن */}
        {!isAdminRoute && <ChatBot />}
      </div>
    </ThemeProvider>
  );
};

export default Layout;