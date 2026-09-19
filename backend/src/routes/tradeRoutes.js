import { Router } from 'express';
import { submitTradeIn } from '../controllers/tradeController.js';

const router = Router();

router.post('/trade-in', submitTradeIn);

export default router;
