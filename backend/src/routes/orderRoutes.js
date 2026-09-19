import { Router } from 'express';
import { createOrder } from '../controllers/orderController.js';

const router = Router();

router.post('/orders', createOrder);

export default router;
