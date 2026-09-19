import { getGarageModelsFromDB } from '../config/supabase.js';

export async function getGarageModels(req, res) {
  try {
    const models = await getGarageModelsFromDB();
    res.json({ success: true, data: models });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
