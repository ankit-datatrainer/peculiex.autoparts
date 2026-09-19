import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { initialProducts, initialCategories, initialGarageModels, initialChatQA } from '../data/initialData.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your-supabase-project') &&
  !supabaseKey.includes('your-anon-key')
);

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseKey) : null;

if (isConfigured) {
  console.log('⚡ Connected to Supabase at:', supabaseUrl);
} else {
  console.log('ℹ️ Supabase environment variables not configured. Operating in robust fallback mode with complete MotoMart catalog in memory.');
}

// In-memory data store for fallback & orders
export const memoryStore = {
  products: [...initialProducts],
  categories: [...initialCategories],
  garageModels: { ...initialGarageModels },
  chatQA: [...initialChatQA],
  orders: [],
  tradeIns: []
};

// Database helper functions
export async function getProductsFromDB(filters = {}) {
  const { category, search, brand, partType, vehicleType, deal, limit } = filters;

  if (supabase) {
    try {
      let query = supabase.from('products').select('*');
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (brand && brand !== 'all') {
        query = query.ilike('brand', `%${brand}%`);
      }
      if (partType && partType !== 'all') {
        query = query.ilike('partType', `%${partType}%`);
      }
      if (deal) {
        query = query.not('badge', 'eq', '');
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let results = data;
        if (search) {
          const q = search.toLowerCase();
          results = results.filter(p =>
            `${p.name} ${p.brand} ${p.category} ${p.fit} ${p.partType || ''} ${p.oemPartNumber || ''}`.toLowerCase().includes(q)
          );
        }
        if (limit) {
          results = results.slice(0, Number(limit));
        }
        return results;
      }
    } catch (err) {
      console.warn('Supabase product query error, falling back to local dataset:', err.message);
    }
  }

  // Fallback to local catalog
  let results = [...memoryStore.products];
  if (brand && brand !== 'all') {
    const b = brand.toLowerCase();
    results = results.filter(p => p.brand.toLowerCase() === b || p.brand.toLowerCase().includes(b));
  }
  if (partType && partType !== 'all') {
    const pt = partType.toLowerCase();
    results = results.filter(p => (p.partType && p.partType.toLowerCase() === pt) || p.category.toLowerCase() === pt);
  }
  if (vehicleType && vehicleType !== 'all') {
    const vt = vehicleType.toLowerCase();
    results = results.filter(p => p.vehicleType && p.vehicleType.toLowerCase().includes(vt));
  }
  if (category && category !== 'all') {
    const cat = category.toLowerCase();
    results = results.filter(p =>
      p.category.toLowerCase() === cat ||
      (p.partType && p.partType.toLowerCase() === cat) ||
      p.brand.toLowerCase() === cat
    );
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      `${p.name} ${p.brand} ${p.category} ${p.fit} ${p.partType || ''} ${p.oemPartNumber || ''}`.toLowerCase().includes(q)
    );
  }
  if (deal) {
    results = results.filter(p => p.badge && p.badge.length > 0);
  }
  if (limit) {
    results = results.slice(0, Number(limit));
  }
  return results;
}

export async function getProductByIdFromDB(id) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase single product fetch error:', err.message);
    }
  }
  return memoryStore.products.find(p => p.id === id) || null;
}

export async function getCategoriesFromDB() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase categories fetch error:', err.message);
    }
  }
  return memoryStore.categories;
}

export async function getGarageModelsFromDB() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('garage_models').select('*');
      if (!error && data && data.length > 0) {
        const grouped = {};
        data.forEach(item => {
          if (!grouped[item.brand]) grouped[item.brand] = [];
          grouped[item.brand].push(item.model);
        });
        return grouped;
      }
    } catch (err) {
      console.warn('Supabase garage models error:', err.message);
    }
  }
  return memoryStore.garageModels;
}

export async function saveOrderToDB(order) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').insert([order]).select();
      if (!error && data) return data[0];
    } catch (err) {
      console.warn('Supabase order insert error, saving to memoryStore:', err.message);
    }
  }
  memoryStore.orders.push(order);
  return order;
}

export async function saveTradeInToDB(tradeIn) {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('trade_ins').insert([tradeIn]).select();
      if (!error && data) return data[0];
    } catch (err) {
      console.warn('Supabase trade-in insert error, saving to memoryStore:', err.message);
    }
  }
  memoryStore.tradeIns.push(tradeIn);
  return tradeIn;
}

export async function getChatAnswerFromDB(question) {
  const normalized = question.toLowerCase();

  let qaList = memoryStore.chatQA;
  if (supabase) {
    try {
      const { data, error } = await supabase.from('chatbot_qa').select('*');
      if (!error && data && data.length > 0) {
        qaList = data;
      }
    } catch (err) {
      // fallback
    }
  }

  const match = qaList.find(item =>
    item.keywords.some(keyword => normalized.includes(keyword.toLowerCase()))
  );

  return match
    ? match.answer
    : 'I can help with delivery, returns, fitment, payments, orders, products and trade-ins. Try asking about one of those topics or select a quick option above.';
}
