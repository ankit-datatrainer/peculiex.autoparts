import { Router } from 'express';
import { askChatbot } from '../controllers/chatController.js';

const router = Router();

router.post('/chat', askChatbot);

export default router;
