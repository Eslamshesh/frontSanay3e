const aiService = {
  apiKey: 'YOUR_API_KEY_HERE', // هتحطي مفتاح API بتاعك هنا

  askAI: async (userMessage, conversationHistory = []) => {
    // بنبني رسالة النظام عشان تخلي الـ AI يرد كمساعد في منصة طلب صناعي
    const systemMessage = `أنت مساعد ذكي في منصة "طلب صناعي" المتخصصة في ربط العملاء بالحرفيين.
المنصة فيها حرفيين في تخصصات: سباكة، كهرباء، نجارة، دهان، تكييف، بناء، حدادة، تنظيف.
ساعد المستخدم في:
1. تحديد نوع الحرفي المناسب لمشكلته
2. نصحه بالبحث عن حرفي قريب
3. شرح كيفية استخدام المنصة
4. الإجابة عن أسئلته
خلي ردودك قصيرة ومفيدة بالعامية المصرية.`;

    const messages = [
      { role: 'system', content: systemMessage },
      ...conversationHistory.slice(-5), // آخر 5 رسائل للسياق
      { role: 'user', content: userMessage }
    ];

    try {
      // ممكن تستخدم OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${aiService.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 150,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Error:', error);
      return 'عذراً، حصل خطأ. جرب مرة تانية.';
    }
  }
};

export default aiService;