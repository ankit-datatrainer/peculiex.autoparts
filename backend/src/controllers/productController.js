import { getProductsFromDB, getProductByIdFromDB, getCategoriesFromDB } from '../config/supabase.js';

export async function getAllProducts(req, res) {
  try {
    const { category, search, brand, partType, vehicleType, deal, limit } = req.query;
    const products = await getProductsFromDB({ category, search, brand, partType, vehicleType, deal, limit });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await getProductByIdFromDB(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getAllCategories(req, res) {
  try {
    const categories = await getCategoriesFromDB();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
