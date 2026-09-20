// ============================================================================
// SPARES-BY-BIKE CATALOG
// Brand -> Model -> Spare parts, sourced from the live eauto.co.in catalog.
// index.json holds brand/model metadata only; each model's parts live in their
// own JSON chunk so a page only ever loads the model it is rendering.
// ============================================================================

import catalogIndex from '../data/eauto/index.json';
import partIndex from '../data/eauto/part-index.json';

export const catalogMeta = {
  scrapedAt: catalogIndex.scrapedAt,
  source: catalogIndex.source,
  totalParts: catalogIndex.totalParts,
  brandCount: catalogIndex.brands.length,
  modelCount: catalogIndex.brands.reduce((n, b) => n + b.modelCount, 0)
};

export const brandIndex = catalogIndex.brands;

export function getBrands() {
  return brandIndex;
}

export function getBrand(brandId) {
  if (!brandId) return null;
  const key = String(brandId).toLowerCase();
  return (
    brandIndex.find((b) => b.id === key) ||
    brandIndex.find((b) => b.name.toLowerCase() === key) ||
    null
  );
}

export function getModelMeta(brandId, modelId) {
  const brand = getBrand(brandId);
  if (!brand) return null;
  const key = String(modelId || '').toLowerCase();
  return brand.models.find((m) => m.id === key) || null;
}

/** Loads the parts chunk for one model. Returns null when the model is unknown. */
export async function getModel(brandId, modelId) {
  const brand = getBrand(brandId);
  const meta = getModelMeta(brandId, modelId);
  if (!brand || !meta) return null;

  try {
    const mod = await import(`../data/eauto/models/${brand.id}__${meta.id}.json`);
    return mod.default || mod;
  } catch (err) {
    console.warn(`eautoCatalog: missing parts chunk for ${brandId}/${modelId}`, err.message);
    return null;
  }
}

/** Resolves a single spare part by its catalog id (e.g. "ea-7486753407203"). */
export async function getPartById(partId) {
  const chunkKey = partIndex[partId];
  if (!chunkKey) return null;

  try {
    const mod = await import(`../data/eauto/models/${chunkKey}.json`);
    const chunk = mod.default || mod;
    const part = chunk.parts.find((p) => p.id === partId);
    if (!part) return null;
    return { ...part, modelImage: chunk.image, categories: chunk.categories };
  } catch (err) {
    console.warn(`eautoCatalog: could not load part ${partId}`, err.message);
    return null;
  }
}

export function isCatalogPartId(id) {
  return typeof id === 'string' && id.startsWith('ea-');
}

/** Sibling parts from the same model, for "related parts" rails. */
export async function getRelatedParts(part, limit = 6) {
  if (!part) return [];
  const model = await getModel(part.brandId, part.modelId);
  if (!model) return [];
  const sameCategory = model.parts.filter((p) => p.id !== part.id && p.category === part.category);
  const rest = model.parts.filter((p) => p.id !== part.id && p.category !== part.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

/**
 * Maps a catalog part onto the product shape used by ProductCard / the product
 * detail page, so catalog parts behave like any other product on the site.
 */
export function partToProduct(part) {
  if (!part) return null;
  const fitment = (part.tags || [])
    .filter((t) => t.startsWith('VehicleModel_'))
    .map((t) => t.replace('VehicleModel_', ''));

  const off =
    part.discountPercent ??
    (part.mrp && part.mrp > part.price ? Math.round(((part.mrp - part.price) / part.mrp) * 100) : 0);

  const images = part.images && part.images.length > 0 ? part.images : part.image ? [part.image] : [];

  return {
    id: part.id,
    name: part.name,
    brand: part.brand,
    category: part.category,
    partType: part.partType || part.category,
    vehicleType: part.vehicleType || '',
    sku: part.sku || part.oemPartNumber || '',
    oemPartNumber: part.sku || part.oemPartNumber || '',
    price: Number(part.price) || 0,
    mrp: Number(part.mrp) || Number(part.price) || 0,
    discountPercent: off,
    badge: part.badge || (off ? `${off}% off` : ''),
    image: part.image || images[0] || null,
    images,
    fit: part.fit || '',
    prime: part.available ?? true,
    available: part.available ?? true,
    fitmentModels: fitment.length ? fitment : [`${part.brand} ${part.modelName}`],
    about: part.description
      ? part.description.split(/(?<=\.)\s+/).filter(Boolean).slice(0, 4)
      : [`Genuine replacement ${part.category} for the ${part.brand} ${part.modelName}.`],
    specs: {
      Brand: part.vendor || part.brand,
      'Part Number': part.sku || part.oemPartNumber || '—',
      'Part Type': part.category,
      'Vehicle Brand': part.brand,
      'Vehicle Model': part.modelName,
      Availability: part.available !== false ? 'In stock' : 'Out of stock'
    },
    brandId: part.brandId,
    modelId: part.modelId,
    modelName: part.modelName,
    sourceUrl: part.sourceUrl || null,
    officialSourceUrl: part.sourceUrl || null
  };
}

/** Flat list of every part category in the catalog, with counts. */
export function getPartCategories(limit = 0) {
  const counts = new Map();
  for (const brand of brandIndex) {
    for (const model of brand.models) {
      for (const cat of model.topCategories) {
        counts.set(cat, (counts.get(cat) || 0) + 1);
      }
    }
  }
  const list = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return limit ? list.slice(0, limit) : list;
}
