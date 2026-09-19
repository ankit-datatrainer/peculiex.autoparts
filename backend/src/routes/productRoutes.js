import { Router } from 'express';
import { getAllProducts, getProductById, getAllCategories } from '../controllers/productController.js';

const router = Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.get('/categories', getAllCategories);

export default router;
