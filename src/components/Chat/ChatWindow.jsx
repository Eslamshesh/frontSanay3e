import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import chatService from '../../services/chatService';
import { 
  X, Send, User, Phone, Video, MoreVertical,
  Check, CheckCheck, Smile, Paperclip, Image,
  ArrowDown, MessageCircle
} from 'lucide-react';

const ChatWindow = ({ otherUser, onClose, minimized, onMinimize }) => {
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Language
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    const handleLanguageChange = () => {
      setLang(localStorage.getItem('language') || 'ar');
    };
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Load messages
  useEffect(() => {
    if (currentUser.email && otherUser?.email) {
      const conv = chatService.getConversation(currentUser.email, otherUser.email);
      setMessages(conv);
    }
  }, [otherUser]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read
  useEffect(() => {
    if (currentUser.email && otherUser?.email) {
      chatService.markAsRead(currentUser.email, otherUser.email);
    }
  }, [otherUser]);

  const handleSend = () => {
    if (!input.trim()) return;
    chatService.sendMessage(currentUser.email, otherUser.email, input.trim());
    setInput('');
    const conv = chatService.getConversation(currentUser.email, otherUser.email);
    setMessages(conv);
    
    // Simulate typing
    if (otherUser?.email) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return lang === 'ar' ? 'الآن' : 'Now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}${lang === 'ar' ? 'د' : 'm'}`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
  };

  const t = {
    chat: lang === 'ar' ? 'محادثة' : 'Chat',
    typeMessage: lang === 'ar' ? 'اكتب رسالة...' : 'Type a message...',
    send: lang === 'ar' ? 'إرسال' : 'Send',
    online: lang === 'ar' ? 'متصل الآن' : 'Online',
    typing: lang === 'ar' ? 'يكتب...' : 'Typing...',
    today: lang === 'ar' ? 'اليوم' : 'Today',
    you: lang === 'ar' ? 'أنت' : 'You',
  };

  // Dynamic colors
  const bgColor = darkMode ? '#1e293b' : '#ffffff';
  const headerBg = darkMode ? '#1e3a8a' : '#2563eb';
  const chatBg = darkMode ? '#0f172a' : '#f8fafc';
  const userBubble = '#2563eb';
  const otherBubble = darkMode ? '#334155' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const inputBg = darkMode ? '#0f172a' : '#f1f5f9';

  if (minimized) {
    return (
      <div
        onClick={onMinimize}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999,
          background: headerBg,
          color: 'white',
          padding: '12px 20px',
          borderRadius: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
          fontFamily: "'Cairo', sans-serif",
          fontWeight: 600,
          fontSize: '0.9rem',
        }}
      >
        <MessageCircle size={20} />
        <span>{t.chat} - {otherUser?.name}</span>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#10b981',
          display: 'inline-block',
        }} />
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 999,
      width: '380px',
      height: '520px',
      background: bgColor,
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: "'Cairo', sans-serif",
      direction: 'rtl',
      border: `1px solid ${borderColor}`,
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes typing {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        .message-enter {
          animation: fadeIn 0.3s ease forwards;
        }
        
        .typing-dot {
          animation: typing 1.4s infinite;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @media (max-width: 480px) {
          .chat-window {
            width: 100vw !important;
            height: 100vh !important;
            bottom: 0 !important;
            right: 0 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: headerBg,
        color: 'white',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          {/* Avatar */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '1rem',
            position: 'relative',
            flexShrink: 0,
          }}>
            {(otherUser?.name || 'ص')[0]}
            <span style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid white',
            }} />
          </div>
          
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {otherUser?.name || t.chat}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              {isTyping ? t.typing : t.online}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={onMinimize}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowDown size={16} />
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        background: chatBg,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: textSecondary,
            marginTop: '40px',
            fontSize: '0.9rem',
          }}>
            <MessageCircle size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>{lang === 'ar' ? 'ابدأ المحادثة الآن' : 'Start the conversation'}</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMine = msg.from === currentUser.email;
          const prevMsg = i > 0 ? messages[i - 1] : null;
          const showAvatar = !prevMsg || prevMsg.from !== msg.from;

          return (
            <div
              key={i}
              className="message-enter"
              style={{
                display: 'flex',
                justifyContent: isMine ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '8px',
              }}
            >
              {!isMine && showAvatar && (
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: headerBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'white',
                  flexShrink: 0,
                }}>
                  {(otherUser?.name || 'ص')[0]}
                </div>
              )}
              {!isMine && !showAvatar && <div style={{ width: '28px' }} />}

              <div style={{
                maxWidth: '75%',
              }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: isMine ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: isMine ? userBubble : otherBubble,
                  color: isMine ? 'white' : textColor,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  boxShadow: isMine ? '0 2px 8px rgba(37,99,235,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                  wordBreak: 'break-word',
                }}>
                  {msg.text}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: textSecondary,
                  marginTop: '4px',
                  textAlign: isMine ? 'left' : 'right',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  justifyContent: isMine ? 'flex-end' : 'flex-start',
                }}>
                  {formatTime(msg.timestamp)}
                  {isMine && (
                    msg.read ? <CheckCheck size={12} style={{ color: '#3b82f6' }} /> : <Check size={12} />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 0',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: headerBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'white',
            }}>
              {(otherUser?.name || 'ص')[0]}
            </div>
            <div style={{
              background: otherBubble,
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'flex',
              gap: '4px',
            }}>
              <span className="typing-dot" style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: textSecondary,
              }} />
              <span className="typing-dot" style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: textSecondary,
              }} />
              <span className="typing-dot" style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: textSecondary,
              }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px',
        borderTop: `1px solid ${borderColor}`,
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-end',
        background: bgColor,
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t.typeMessage}
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: `1px solid ${borderColor}`,
            borderRadius: '20px',
            outline: 'none',
            fontSize: '0.875rem',
            fontFamily: "'Cairo', sans-serif",
            background: inputBg,
            color: textColor,
            resize: 'none',
            textAlign: 'right',
            maxHeight: '80px',
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = borderColor}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: input.trim() ? '#2563eb' : '#cbd5e1',
            border: 'none',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.3s ease',
            opacity: input.trim() ? 1 : 0.5,
          }}
        >
          <Send size={18} color="white" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;