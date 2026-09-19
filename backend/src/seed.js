import { supabase } from './config/supabase.js';
import { initialProducts, initialCategories, initialGarageModels, initialChatQA } from './data/initialData.js';

async function seed() {
  if (!supabase) {
    console.error('❌ Supabase is not configured in .env. Please set SUPABASE_URL and SUPABASE_ANON_KEY first.');
    process.exit(1);
  }

  console.log('🌱 Starting MotoMart database seed to Supabase...');

  try {
    // 1. Seed Products
    console.log('Inserting products...');
    const { data: prodData, error: prodErr } = await supabase
      .from('products')
      .upsert(initialProducts, { onConflict: 'id' });
    if (prodErr) console.error('Error inserting products:', prodErr.message);
    else console.log(`✅ ${initialProducts.length} Products inserted/updated`);

    // 2. Seed Categories
    console.log('Inserting categories...');
    const { data: catData, error: catErr } = await supabase
      .from('categories')
      .upsert(initialCategories, { onConflict: 'id' });
    if (catErr) console.error('Error inserting categories:', catErr.message);
    else console.log(`✅ ${initialCategories.length} Categories inserted/updated`);

    // 3. Seed Garage Models
    console.log('Inserting garage models...');
    const garageRows = [];
    Object.entries(initialGarageModels).forEach(([brand, models]) => {
      models.forEach(model => {
        garageRows.push({
          vehicle_type: ['Activa 6G', 'Jupiter', 'NTorq 125', 'Dio', 'Fascino', 'Access 125', 'Burgman Street', 'Avenis', 'Chetak'].includes(model) ? 'Scooter' : 'Motorcycle',
          brand,
          model
        });
      });
    });

    const { error: garageErr } = await supabase
      .from('garage_models')
      .upsert(garageRows, { onConflict: 'brand,model' });
    if (garageErr) console.log('Garage models note:', garageErr.message);
    else console.log(`✅ ${garageRows.length} Garage models inserted`);

    // 4. Seed Chatbot QA
    console.log('Inserting chatbot QA...');
    const { error: chatErr } = await supabase
      .from('chatbot_qa')
      .upsert(initialChatQA);
    if (chatErr) console.log('Chatbot QA note:', chatErr.message);
    else console.log(`✅ Chatbot FAQ records inserted`);

    console.log('🎉 Supabase database seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
