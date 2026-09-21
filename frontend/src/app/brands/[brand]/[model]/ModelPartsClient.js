'use client';

import React, { useMemo, useState } from 'react';
import PartCard from '../../../../components/PartCard';
import { useLanguage } from '../../../../context/LanguageContext';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'discount', label: 'Biggest discount' },
  { id: 'name', label: 'Alphabetically, A–Z' }
];

const PAGE_SIZE = 36;

export default function ModelPartsClient({ model }) {
  const { t, tCat } = useLanguage();
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const parts = useMemo(() => {
    let list = model.parts;

    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (inStockOnly) list = list.filter((p) => p.available);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => `${p.name} ${p.category} ${p.sku}`.toLowerCase().includes(q));
    }

    const sorted = [...list];
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'discount') sorted.sort((a, b) => b.discountPercent - a.discountPercent);
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else sorted.sort((a, b) => Number(b.available) - Number(a.available));

    return sorted;
  }, [model.parts, category, sort, query, inStockOnly]);

  const reset = (fn) => (value) => {
    fn(value);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="parts-layout">
      <aside className="parts-filters">
        <h2>{t('Filters')}</h2>

        <label className="parts-search">
          <span className="sr-only">Search within {model.modelName} parts</span>
          <input
            type="search"
            placeholder={t('Search this model’s parts')}
            value={query}
            onChange={(e) => reset(setQuery)(e.target.value)}
          />
        </label>

        <label className="parts-checkbox">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => reset(setInStockOnly)(e.target.checked)}
          />
          <span>{t('In stock only')}</span>
        </label>

        <h3>{t('Category')}</h3>
        <ul className="parts-category-list">
          <li>
            <button
              type="button"
              className={category === 'all' ? 'active' : ''}
              onClick={() => reset(setCategory)('all')}
            >
              <span>{t('All parts')}</span>
              <em>{model.parts.length}</em>
            </button>
          </li>
          {model.categories.map((c) => (
            <li key={c.name}>
              <button
                type="button"
                className={category === c.name ? 'active' : ''}
                onClick={() => reset(setCategory)(c.name)}
              >
                <span>{tCat(c.name)}</span>
                <em>{c.count}</em>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="parts-results">
        <div className="parts-toolbar">
          <span>
            <strong>{parts.length}</strong> {t('parts')}
            {category !== 'all' && <> · {tCat(category)}</>}
          </span>
          <label>
            {t('Sort by:')}
            <select value={sort} onChange={(e) => reset(setSort)(e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {t(s.label)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {parts.length > 0 ? (
          <>
            <div className="parts-grid">
              {parts.slice(0, visible).map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>

            {visible < parts.length && (
              <button
                type="button"
                className="parts-more"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                {t('Show more parts')} ({parts.length - visible})
              </button>
            )}
          </>
        ) : (
          <div className="parts-empty">
            <span aria-hidden="true">🔧</span>
            <h3>{t('No parts match these filters')}</h3>
            <p>{t('Try clearing the search box or picking a different category.')}</p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                setQuery('');
                setInStockOnly(false);
                setVisible(PAGE_SIZE);
              }}
            >
              {t('Clear all filters')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
