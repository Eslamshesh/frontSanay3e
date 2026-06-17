const chatService = {
  // جلب كل الرسائل
  getMessages: () => {
    try {
      return JSON.parse(localStorage.getItem('chat_messages') || '[]');
    } catch {
      return [];
    }
  },

  // حفظ كل الرسائل
  saveMessages: (messages) => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  },

  // جلب محادثة بين شخصين
  getConversation: (userA, userB) => {
    return chatService.getMessages().filter(msg =>
      (msg.from === userA && msg.to === userB) || (msg.from === userB && msg.to === userA)
    );
  },

  // إرسال رسالة جديدة
  sendMessage: (from, to, text) => {
    const messages = chatService.getMessages();
    messages.push({
      id: Date.now(),
      from,
      to,
      text,
      timestamp: new Date().toISOString(),
      read: false
    });
    chatService.saveMessages(messages);
  },

  // ✅ تعليم الرسائل كمقروءة
  markAsRead: (userEmail, otherEmail) => {
    const messages = chatService.getMessages();
    let updated = false;
    
    const newMessages = messages.map(msg => {
      if (msg.to === userEmail && msg.from === otherEmail && !msg.read) {
        updated = true;
        return { ...msg, read: true };
      }
      return msg;
    });
    
    if (updated) {
      chatService.saveMessages(newMessages);
    }
  },

  // ✅ جلب عدد الرسائل غير المقروءة
  getUnreadCount: (userEmail) => {
    return chatService.getMessages().filter(msg => 
      msg.to === userEmail && !msg.read
    ).length;
  },

  // ✅ جلب قائمة المحادثات لمستخدم
  getConversationsList: (userEmail) => {
    const messages = chatService.getMessages();
    const conversations = {};
    
    // تجميع الرسائل حسب الشخص التاني
    messages.forEach(msg => {
      if (msg.from === userEmail || msg.to === userEmail) {
        const otherUser = msg.from === userEmail ? msg.to : msg.from;
        
        if (!conversations[otherUser]) {
          conversations[otherUser] = {
            otherUser,
            messages: [],
            unreadCount: 0,
            lastMessage: null
          };
        }
        
        conversations[otherUser].messages.push(msg);
        
        if (msg.to === userEmail && !msg.read) {
          conversations[otherUser].unreadCount++;
        }
      }
    });
    
    // تحويل لـ array وترتيب حسب الأحدث
    return Object.values(conversations)
      .map(conv => ({
        ...conv,
        lastMessage: conv.messages[conv.messages.length - 1]
      }))
      .sort((a, b) => {
        const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
        const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
        return timeB - timeA;
      });
  },

  // ✅ حذف محادثة
  deleteConversation: (userA, userB) => {
    const messages = chatService.getMessages();
    const filtered = messages.filter(msg =>
      !((msg.from === userA && msg.to === userB) || (msg.from === userB && msg.to === userA))
    );
    chatService.saveMessages(filtered);
  },

  // ✅ حذف كل الرسائل (لأغراض التطوير)
  clearAll: () => {
    localStorage.removeItem('chat_messages');
  }
};

export default chatService;