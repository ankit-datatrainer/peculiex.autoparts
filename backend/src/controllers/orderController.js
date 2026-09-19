import { saveOrderToDB, getProductByIdFromDB } from '../config/supabase.js';

export async function createOrder(req, res) {
  try {
    const { items, deliveryPincode, customerPhone, customerName } = req.body;

    if (!items || typeof items !== 'object' || Object.keys(items).length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    let subtotal = 0;
    const verifiedItems = [];

    for (const [productId, qty] of Object.entries(items)) {
      if (qty > 0) {
        const product = await getProductByIdFromDB(productId);
        if (product) {
          const itemTotal = Number(product.price) * Number(qty);
          subtotal += itemTotal;
          verifiedItems.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: qty,
            itemTotal
          });
        }
      }
    }

    const orderId = `MM-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    const newOrder = {
      id: orderId,
      items: verifiedItems,
      subtotal,
      delivery_pincode: deliveryPincode || '560001',
      customer_phone: customerPhone || '9876543210',
      customer_name: customerName || 'MotoMart Rider',
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    const saved = await saveOrderToDB(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: saved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
