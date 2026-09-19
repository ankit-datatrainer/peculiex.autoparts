import { saveTradeInToDB } from '../config/supabase.js';

export async function submitTradeIn(req, res) {
  try {
    const { itemType, condition, phone } = req.body;

    if (!itemType || !condition || !phone) {
      return res.status(400).json({ success: false, message: 'All fields (itemType, condition, phone) are required' });
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number' });
    }

    // Calculate approximate trade estimate based on condition & item
    let baseEstimate = 1200;
    if (itemType.toLowerCase().includes('helmet')) baseEstimate = 1800;
    if (itemType.toLowerCase().includes('exhaust')) baseEstimate = 2500;
    if (itemType.toLowerCase().includes('alloy')) baseEstimate = 3200;
    if (itemType.toLowerCase().includes('jacket')) baseEstimate = 2200;

    let multiplier = 1;
    if (condition.toLowerCase().includes('new')) multiplier = 1.3;
    if (condition.toLowerCase().includes('used')) multiplier = 0.7;

    const estimatedValue = Math.round(baseEstimate * multiplier);

    const record = {
      item_type: itemType,
      condition,
      phone: phone.trim(),
      estimated_value: estimatedValue,
      status: 'submitted',
      created_at: new Date().toISOString()
    };

    const saved = await saveTradeInToDB(record);

    res.status(201).json({
      success: true,
      message: 'Trade-in estimate request submitted successfully',
      data: saved,
      estimate: `₹${estimatedValue.toLocaleString('en-IN')}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
