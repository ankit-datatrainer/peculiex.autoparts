'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';
import { useCart } from '../../../context/CartContext';
import { formatCurrency } from '../../../lib/translations';
import { aboutBullets, fitmentLine, specRows } from '../../../lib/productCopy';
import ProductCard from '../../../components/ProductCard';

export default function ProductDetailClient({ product, related = [] }) {
  const router = useRouter();
  const { t, tName, tCat, local, language } = useLanguage();
  const { addToCart, openCartDrawer, deliveryLocation } = useCart();

  const [quantity, setQuantity] = useState(1);
  const gallery =
    Array.isArray(product.images) && product.images.length > 0
      ? [...new Set(product.images)]
      : [product.image, product.image, product.image];
  const [selectedImg, setSelectedImg] = useState(gallery[0]);

  const title = tName(product.name, product.category);
  const bullets = aboutBullets(product, language);
  const fitment = fitmentLine(product, language);
  const specs = specRows(product, language);

  const discountPercent = Math.round((1 - product.price / product.mrp) * 100);
  const emiAmount = Math.ceil(product.price / 6);

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

  const handleBuyNow = () => {
    addToCart(product.id, quantity, product.brand, {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      category: product.category
    });
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
          <div className="detail-gallery">
            <div className="thumb-list">
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={selectedImg === src ? 'active' : ''}
                  onClick={() => setSelectedImg(src)}
                >
                  <img src={src} alt={`${title} ${t('view')} ${i + 1}`} />
                </button>
              ))}
            </div>
            <div className="main-image-wrap">
              <img src={selectedImg} alt={title} />
            </div>
          </div>

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
              {discountPercent > 0 && <span className="discount">-{discountPercent}%</span>}
              <strong className="detail-price">{formatCurrency(product.price)}</strong>
              <p>
                {t('M.R.P.')}: <s>{formatCurrency(product.mrp)}</s>
              </p>
              <p>{t('Inclusive of all taxes')}</p>
              <p>
                <strong>EMI</strong>{' '}
                {local(
                  `starts at ${formatCurrency(emiAmount)} per month.`,
                  `${formatCurrency(emiAmount)} प्रति माह से शुरू।`,
                  `${formatCurrency(emiAmount)} प्रति महिना पासून.`,
                  `${formatCurrency(emiAmount)} પ્રતિ માસથી શરૂ.`
                )}
              </p>
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
            <strong className="detail-price">{formatCurrency(product.price)}</strong>
            <p className="delivery-message">
              <strong>{t('FREE delivery')}</strong> {local('by', 'तक', 'पर्यंत')}{' '}
              <b>{deliveryDateStr()}</b>
              <br />
              {t('Order within 6 hrs 22 mins.')}
            </p>
            <p>
              ⌖ {t('Delivering to')} <strong>{deliveryLocation}</strong>
            </p>
            <p className="stock">{t('In stock')}</p>

            <label>
              {t('Quantity')}{' '}
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="buy-add"
              type="button"
              onClick={() => {
                addToCart(product.id, quantity, product.brand, {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      mrp: product.mrp,
      image: product.image,
      category: product.category
    });
                openCartDrawer();
              }}
            >
              {t('Add to cart')}
            </button>

            <button className="buy-now" type="button" onClick={handleBuyNow}>
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
