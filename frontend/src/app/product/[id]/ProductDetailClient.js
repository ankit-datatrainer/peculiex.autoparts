'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../lib/translations';
import { aboutBullets, fitmentLine, specRows } from '../../../lib/productCopy';
import ProductCard from '../../../components/ProductCard';
import Price, { PriceLock } from '../../../components/Price';
import { useStore } from '../../../context/StoreContext';
import { clampQty, lineAmounts, formatRate, MAX_QTY } from '../../../lib/commerce';
import ProductGallery from './ProductGallery';

export default function ProductDetailClient({ product, related = [] }) {
  const router = useRouter();
  const { t, tName, tCat, local, language } = useLanguage();
  const { addToCart, openCartDrawer, deliveryLocation } = useCart();
  const { access, moqFor, gstFor } = useStore();

  const moq = moqFor(product);
  const gstRate = gstFor(product);
  const [quantity, setQuantity] = useState(moq);
  // What the shopper is typing, so the field can be emptied mid-edit.
  const [qtyText, setQtyText] = useState(String(moq));
  const canSee = access.canSee && product.price !== null && product.price !== undefined;
  const amounts = canSee ? lineAmounts(product.price, quantity, gstRate) : null;

  const changeQty = (next) => {
    const q = clampQty(next, moq);
    setQuantity(q);
    setQtyText(String(q));
  };

  const title = tName(product.name, product.category);
  const bullets = aboutBullets(product, language);
  const fitment = fitmentLine(product, language);
  const specs = specRows(product, language);

  const discountPercent = product.discountPercent || 0;
  const emiAmount = canSee ? Math.ceil(amounts.total / 6) : null;

  const deliveryDateStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const locale = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN' }[language] || 'en-IN';
    return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'short' });
  };

  const stars = (rating) => {
    const full = Math.round(rating || 4.5);
    return `${'★'.repeat(full)}${'☆'.repeat(Math.max(0, 5 - full))}`;
  };

  const snapshot = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    mrp: product.mrp,
    image: product.image,
    category: product.category,
    moq: product.moq ?? null,
    gstRate: product.gstRate ?? null,
    referenceNo: product.referenceNo || ''
  };

  const handleAdd = () => {
    addToCart(product.id, quantity, product.brand, snapshot);
    openCartDrawer();
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, product.brand, snapshot);
    router.push('/cart');
  };

  return (
    <div className="product-view">
      <div className="page-shell">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">{t('Home')}</Link> ›{' '}
          {product.brandId ? (
            <>
              <Link href={`/brands/${product.brandId}`}>{product.brand}</Link> ›{' '}
              {product.modelId && (
                <>
                  <Link href={`/brands/${product.brandId}/${product.modelId}`}>
                    {product.modelName}
                  </Link>{' '}
                  ›{' '}
                </>
              )}
              {tCat(product.category)}
            </>
          ) : (
            <>
              <Link href={`/search?category=${encodeURIComponent(product.category)}`}>
                {tCat(product.category)}
              </Link>{' '}
              › {product.brand}
            </>
          )}
        </div>

        <section className="detail-layout">
          {/* Gallery */}
          <ProductGallery
            images={product.images?.length ? product.images : [product.image].filter(Boolean)}
            labels={product.imageLabels || []}
            title={title}
            model3dUrl={product.model3dUrl}
          />

          {/* Info */}
          <div className="detail-info">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Link
                className="detail-brand"
                href={product.brandId ? `/brands/${product.brandId}` : `/search?brand=${encodeURIComponent(product.brand)}`}
                style={{ fontWeight: '800' }}
              >
                {product.brand} {t('Official Store')}
              </Link>
              {product.oemPartNumber && (
                <span style={{
                  background: '#EEF2F6',
                  color: '#1E293B',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}>
                  {t('OEM')}: {product.oemPartNumber}
                </span>
              )}
              <span style={{
                background: '#ECFDF5',
                color: '#059669',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                ✓ {t('100% Genuine Guaranteed')}
              </span>
            </div>

            <h1>{title}</h1>

            {product.referenceNo && (
              <p className="detail-ref">
                {t('Reference No.')}: <strong>{product.referenceNo}</strong>
              </p>
            )}

            {product.officialSourceUrl && (
              <div style={{ marginBottom: '0.75rem' }}>
                <a
                  href={product.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '12px',
                    color: '#2563EB',
                    textDecoration: 'none',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🌐 {t('Verified with')} {product.brand} {t('Official Portal')} ↗
                </a>
              </div>
            )}

            {product.rating ? (
              <div className="detail-rating">
                <span>{product.rating}</span>
                <span className="stars">{stars(product.rating)}</span>
                <a href="#reviews">
                  {(product.reviews || 0).toLocaleString('en-IN')} {t('ratings')}
                </a>
              </div>
            ) : (
              <div className="detail-rating">
                <span className={product.available === false ? 'stock out' : 'stock'}>
                  {product.available === false ? t('Out of stock') : t('In stock')}
                </span>
                <span className="moq-badge">
                  {t('MOQ')}: {moq} {t('units')}
                </span>
                {product.modelName && (
                  <Link href={`/brands/${product.brandId}/${product.modelId}`}>
                    {local(
                      `All ${product.brand} ${product.modelName} parts`,
                      `${product.brand} ${product.modelName} के सभी पार्ट्स`,
                      `${product.brand} ${product.modelName} चे सर्व पार्ट्स`,
                      `${product.brand} ${product.modelName} ના બધા પાર્ટ્સ`
                    )} →
                  </Link>
                )}
              </div>
            )}

            <div className="price-block">
              {canSee ? (
                <>
                  {discountPercent > 0 && <span className="discount">-{discountPercent}%</span>}
                  <strong className="detail-price">
                    <Price amount={product.price} />
                  </strong>
                  <span className="per-unit">/ {t('unit')}</span>
                  {product.mrp > product.price && (
                    <p>
                      {t('M.R.P.')}: <s><Price amount={product.mrp} /></s>
                    </p>
                  )}
                  <p className="gst-note">
                    + {t('GST')} {formatRate(gstRate)}% ({t('added at checkout')})
                  </p>
                  <p>
                    <strong>EMI</strong>{' '}
                    {local(
                      `starts at ${formatCurrency(emiAmount)} per month.`,
                      `${formatCurrency(emiAmount)} प्रति माह से शुरू।`,
                      `${formatCurrency(emiAmount)} प्रति महिना पासून.`,
                      `${formatCurrency(emiAmount)} પ્રતિ માસથી શરૂ.`
                    )}
                  </p>
                </>
              ) : (
                <div className="price-locked-block">
                  {discountPercent > 0 && <span className="discount">-{discountPercent}%</span>}
                  <PriceLock size="lg" />
                  <p>
                    {access.status === 'guest'
                      ? t('Prices are visible after you log in and verify your email.')
                      : t('Verify your email once to see prices on every product.')}
                  </p>
                </div>
              )}
            </div>

            <div className="offers">
              <h3>⚙ {t('Offers')}</h3>
              <div className="offer-cards">
                <div className="offer-card">
                  <strong>{t('Cashback')}</strong>
                  <p>
                    {local(
                      'Up to ₹100 cashback with select payment methods.',
                      'चुनिंदा भुगतान तरीकों पर ₹100 तक कैशबैक।',
                      'निवडक पेमेंट पद्धतींवर ₹100 पर्यंत कॅशबॅक.',
                      'પસંદગીની પેમેન્ટ પદ્ધતિઓ પર ₹100 સુધી કેશબેક.'
                    )}
                  </p>
                </div>
                <div className="offer-card">
                  <strong>{t('Bank offer')}</strong>
                  <p>
                    {local(
                      'Extra 5% off on eligible cards.',
                      'योग्य कार्ड पर अतिरिक्त 5% छूट।',
                      'पात्र कार्डवर अतिरिक्त 5% सूट.',
                      'પાત્ર કાર્ડ પર વધારાની 5% છૂટ.'
                    )}
                  </p>
                </div>
                <div className="offer-card">
                  <strong>{t('Partner offer')}</strong>
                  <p>
                    {local(
                      'Get GST invoice for business purchases.',
                      'बिज़नेस खरीद पर GST इनवॉइस पाएँ।',
                      'व्यवसाय खरेदीसाठी GST इनव्हॉइस मिळवा.',
                      'વ્યવસાય ખરીદી માટે GST ઇન્વોઇસ મેળવો.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            {product.specs && (
              <div className="product-specs-box" style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1rem',
                margin: '1.5rem 0'
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 0.75rem 0', color: '#0F172A' }}>
                  🔧 {t('OEM Technical Specifications')}
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <tbody>
                    {specs.map((row) => (
                      <tr key={row.key} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '6px 8px', color: '#64748B', fontWeight: '600', width: '40%' }}>
                          {row.label}
                        </td>
                        <td style={{ padding: '6px 8px', color: '#1E293B', fontWeight: '500' }}>
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="about-product">
              <h3>{t('About this item')}</h3>
              <ul>
                {bullets.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
                {fitment.value && (
                  <li>
                    <strong>{fitment.label}</strong> {fitment.value}. {fitment.check}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Buy Box */}
          <aside className="buy-box">
            {canSee ? (
              <strong className="detail-price">
                <Price amount={product.price} />
                <small className="per-unit"> / {t('unit')}</small>
              </strong>
            ) : (
              <PriceLock size="lg" />
            )}
            <p className="delivery-message">
              <strong>{t('FREE delivery')}</strong> {local('by', 'तक', 'पर्यंत')}{' '}
              <b>{deliveryDateStr()}</b>
              <br />
              {t('Order within 6 hrs 22 mins.')}
            </p>
            <p>
              ⌖ {t('Delivering to')} <strong>{deliveryLocation}</strong>
            </p>
            <p className="stock">
              {product.available === false ? t('Out of stock') : t('In stock')}
              <span className="moq-badge">
                {t('MOQ')}: {moq} {t('units')}
              </span>
            </p>

            <div className="buy-qty">
              <span id="qty-label">{t('Quantity')}</span>
              <div className="qty-stepper qty-typed qty-stepper-lg" role="group" aria-labelledby="qty-label">
                <button
                  type="button"
                  aria-label={t('Decrease quantity')}
                  onClick={() => changeQty(quantity - 1)}
                  disabled={quantity <= moq}
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={moq}
                  max={MAX_QTY}
                  value={qtyText}
                  aria-label={t('Quantity')}
                  onChange={(e) => {
                    setQtyText(e.target.value);
                    const n = Number(e.target.value);
                    if (e.target.value !== '' && Number.isFinite(n) && n >= moq) {
                      setQuantity(clampQty(n, moq));
                    }
                  }}
                  onBlur={() => changeQty(qtyText === '' ? moq : qtyText)}
                />
                <button
                  type="button"
                  aria-label={t('Increase quantity')}
                  onClick={() => changeQty(quantity + 1)}
                  disabled={quantity >= MAX_QTY}
                >
                  +
                </button>
              </div>
              <small className="moq-hint">
                {t('Minimum order')}: {moq} {t('units')}
              </small>
            </div>

            {canSee ? (
              <dl className="buy-totals" aria-live="polite">
                <div>
                  <dt>
                    {formatCurrency(product.price)} × {quantity}
                  </dt>
                  <dd>{formatCurrency(amounts.base)}</dd>
                </div>
                <div>
                  <dt>
                    {t('GST')} ({formatRate(gstRate)}%)
                  </dt>
                  <dd>{formatCurrency(amounts.tax)}</dd>
                </div>
                <div className="grand">
                  <dt>{t('Total')}</dt>
                  <dd>{formatCurrency(amounts.total)}</dd>
                </div>
              </dl>
            ) : (
              <p className="buy-locked-note">
                {access.status === 'guest'
                  ? t('Log in and verify your email to see the total for this quantity.')
                  : t('Verify your email to see the total for this quantity.')}
              </p>
            )}

            <button
              className="buy-add"
              type="button"
              onClick={handleAdd}
              disabled={product.available === false}
            >
              {t('Add to cart')}
            </button>

            <button
              className="buy-now"
              type="button"
              onClick={handleBuyNow}
              disabled={product.available === false}
            >
              {t('Buy now')}
            </button>

            <p className="secure-copy">
              🔒 {t('Secure transaction')}
              <br />
              <br />
              {t('Sold by MotoMart Verified Seller')}
              <br />
              {t('7-day replacement available')}
            </p>
          </aside>

          {/* Benefits */}
          <div className="detail-benefits">
            <div>
              <span>💳</span>
              {t('Pay on delivery')}
            </div>
            <div>
              <span>↩</span>
              {t('Easy replacement')}
            </div>
            <div>
              <span>⚡</span>
              {t('Fast delivery')}
            </div>
            <div>
              <span>🛡</span>
              {t('Warranty support')}
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="related-detail">
              <h2>{t('Customers also viewed')}</h2>
              <div className="product-row">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
