import { Router } from 'express';
import { getGarageModels } from '../controllers/garageController.js';

const router = Router();

router.get('/garage/models', getGarageModels);

export default router;
