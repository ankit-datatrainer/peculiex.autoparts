import { getChatAnswerFromDB } from '../config/supabase.js';

export async function askChatbot(req, res) {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question string is required' });
    }

    const answer = await getChatAnswerFromDB(question.trim());
    res.json({
      success: true,
      data: {
        question: question.trim(),
        answer
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
