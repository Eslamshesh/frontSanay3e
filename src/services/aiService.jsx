// src/services/aiService.jsx
// يستخدم Anthropic Claude API (claude-haiku-4-5-20251001) — أسرع وأرخص موديل

const aiService = {

  askAI: async (userMessage, conversationHistory = []) => {
    const systemMessage = `أنت مساعد ذكي في منصة "طلب صنايعي" المتخصصة في ربط العملاء بالحرفيين.
المنصة فيها حرفيين في تخصصات: سباكة، كهرباء، نجارة، دهان، تكييف، بناء، حدادة، تنظيف.
ساعد المستخدم في:
1. تحديد نوع الحرفي المناسب لمشكلته
2. نصحه بالبحث عن حرفي قريب
3. شرح كيفية استخدام المنصة
4. الإجابة عن أسئلته
خلي ردودك قصيرة ومفيدة بالعامية المصرية.`;

    // بناء تاريخ المحادثة — Claude API لا يدعم role: system في messages
    // النظام يتمرر في حقل system المنفصل
    const messages = [
      ...conversationHistory.slice(-5), // آخر 5 رسائل للسياق
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          // ⚠️ لا ترسلي API key من الفرونت في الـ production
          // استخدمي proxy على السيرفر بتاعك يمرر الطلب
          'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY || '',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: systemMessage,
          messages,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API Error ${response.status}`);
      }

      const data = await response.json();
      return data.content?.[0]?.text || 'عذراً، مفيش رد من المساعد.';
    } catch (error) {
      console.error('AI Error:', error);
      return 'عذراً، حصل خطأ. جرب مرة تانية.';
    }
  },
};

export default aiService;
