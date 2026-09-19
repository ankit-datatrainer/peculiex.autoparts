import { initialProducts, companyBrands, initialGarageModels } from './catalogData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchProducts(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'all') params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.brand && filters.brand !== 'all') params.append('brand', filters.brand);
    if (filters.partType && filters.partType !== 'all') params.append('partType', filters.partType);
    if (filters.vehicleType && filters.vehicleType !== 'all') params.append('vehicleType', filters.vehicleType);
    if (filters.deal) params.append('deal', 'true');
    if (filters.limit) params.append('limit', filters.limit);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('API fetchProducts fallback activated:', err.message);
  }

  // Robust local filter fallback
  let results = [...initialProducts];
  if (filters.brand && filters.brand !== 'all') {
    const b = filters.brand.toLowerCase();
    results = results.filter(p => p.brand.toLowerCase() === b || p.brand.toLowerCase().includes(b));
  }
  if (filters.partType && filters.partType !== 'all') {
    const pt = filters.partType.toLowerCase();
    results = results.filter(p => (p.partType && p.partType.toLowerCase() === pt) || p.category.toLowerCase() === pt);
  }
  if (filters.vehicleType && filters.vehicleType !== 'all') {
    const vt = filters.vehicleType.toLowerCase();
    results = results.filter(p => p.vehicleType && p.vehicleType.toLowerCase().includes(vt));
  }
  if (filters.category && filters.category !== 'all') {
    const cat = filters.category.toLowerCase();
    results = results.filter(p =>
      p.category.toLowerCase() === cat ||
      (p.partType && p.partType.toLowerCase() === cat) ||
      p.brand.toLowerCase() === cat
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(p =>
      `${p.name} ${p.brand} ${p.category} ${p.fit} ${p.partType || ''} ${p.oemPartNumber || ''}`.toLowerCase().includes(q)
    );
  }
  if (filters.deal) {
    results = results.filter(p => p.badge && p.badge.length > 0);
  }
  if (filters.limit) {
    results = results.slice(0, Number(filters.limit));
  }
  return results;
}

export async function fetchProductById(id) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch (err) {
    console.warn('API fetchProductById fallback activated:', err.message);
  }
  return initialProducts.find(p => p.id === id) || null;
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn('API fetchCategories error:', err.message);
    return [];
  }
}

export async function fetchGarageModels() {
  try {
    const res = await fetch(`${API_BASE}/garage/models`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return json.data || {};
  } catch (err) {
    console.warn('API fetchGarageModels error:', err.message);
    return {};
  }
}

export async function placeOrder(orderData) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return res.json();
}

export async function submitTradeIn(tradeData) {
  const res = await fetch(`${API_BASE}/trade-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tradeData)
  });
  return res.json();
}

export async function askChatbot(question) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  return res.json();
}

export async function signIn(identifier) {
  const res = await fetch(`${API_BASE}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier })
  });
  return res.json();
}
